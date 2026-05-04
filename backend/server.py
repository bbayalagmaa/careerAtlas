"""
CareerAtlas ML Backend — no external AI APIs, 100% local ML
Run: uvicorn server:app --reload --port 8000
"""

import re
import base64
import io
import joblib
import numpy as np
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

import pdfplumber

# ── Load models ────────────────────────────────────────────────────────────────
MODELS_DIR = Path(__file__).parent / "models"

def _load(name):
    path = MODELS_DIR / name
    if not path.exists():
        raise RuntimeError(f"Model not found: {path}. Run: python train_models.py")
    return joblib.load(path)

salary_model    = _load("salary_model.pkl")
salary_scaler   = _load("salary_scaler.pkl")
kmeans          = _load("kmeans.pkl")
cluster_scaler  = _load("cluster_scaler.pkl")
label_map       = _load("cluster_label_map.pkl")
role_classifier = _load("role_classifier.pkl")
metadata        = _load("metadata.pkl")

BASE_BIGMAC_US = 5.58

# ── Skill keyword map ──────────────────────────────────────────────────────────
# Maps each tracked skill to patterns to search for in CV text
SKILL_PATTERNS = {
    "Python":           [r"\bpython\b"],
    "Machine Learning": [r"\bmachine\s+learning\b", r"\bml\b(?!\s+engineer)", r"\bscikit[\s-]?learn\b"],
    "SQL":              [r"\bsql\b", r"\bmysql\b", r"\bpostgres\b", r"\bpostgresql\b"],
    "Cloud (AWS/GCP)":  [r"\baws\b", r"\bgcp\b", r"\bazure\b", r"\bcloud\b", r"\bs3\b", r"\bec2\b"],
    "TensorFlow":       [r"\btensorflow\b", r"\btf\b"],
    "NLP":              [r"\bnlp\b", r"\bnatural\s+language\b", r"\btext\s+processing\b"],
    "LLMs / GenAI":     [r"\bllm\b", r"\bgpt\b", r"\bbert\b", r"\bgenerative\s+ai\b", r"\blarge\s+language\b", r"\bfine[\s-]?tun"],
    "Spark":            [r"\bspark\b", r"\bapache\s+spark\b", r"\bpyspark\b"],
    "PyTorch":          [r"\bpytorch\b", r"\btorch\b"],
    "Tableau / BI":     [r"\btableau\b", r"\bpower\s+bi\b", r"\blooker\b", r"\bmetabase\b", r"\bbi\b"],
    "R":                [r"\br\s+programming\b", r"\bggplot\b", r"\btidyverse\b", r"\bdplyr\b"],
    "dbt":              [r"\bdbt\b", r"\bdata\s+build\s+tool\b"],
}

# Skill → cluster axis contribution weights
SKILL_AXIS_WEIGHTS = {
    "Python":           {"Python": 20},
    "Machine Learning": {"ML Depth": 25},
    "SQL":              {"SQL": 20},
    "Cloud (AWS/GCP)":  {"Cloud": 25},
    "TensorFlow":       {"ML Depth": 15},
    "NLP":              {"ML Depth": 10, "Research": 10},
    "LLMs / GenAI":     {"ML Depth": 15, "Research": 15},
    "Spark":            {"Cloud": 10},
    "PyTorch":          {"ML Depth": 15},
    "Tableau / BI":     {"SQL": 10},
    "R":                {"Python": 5, "Research": 5},
    "dbt":              {"SQL": 10},
}

# Skill → country bonus: how much each country values that specific skill
# Based on job market concentration (AI labs, fintech, data engineering hubs, etc.)
SKILL_COUNTRY_BOOST = {
    "Python":           {"US": 10, "CA": 8,  "DE": 8,  "AU": 7,  "GB": 7,  "IN": 9,  "SG": 7,  "NL": 6},
    "Machine Learning": {"US": 15, "CA": 12, "GB": 10, "DE": 8,  "SG": 8,  "AU": 7,  "NL": 6},
    "SQL":              {"DE": 10, "NL": 10, "AU": 9,  "CA": 8,  "GB": 8,  "US": 7,  "JP": 7},
    "Cloud (AWS/GCP)":  {"US": 12, "CA": 10, "SG": 10, "AU": 8,  "GB": 8,  "DE": 7,  "NL": 7},
    "TensorFlow":       {"US": 12, "CA": 10, "GB": 8,  "DE": 7,  "SG": 7,  "AU": 6},
    "NLP":              {"US": 15, "CA": 12, "GB": 12, "DE": 8,  "SG": 7,  "NL": 6},
    "LLMs / GenAI":     {"US": 18, "CA": 14, "GB": 12, "DE": 8,  "SG": 8,  "AU": 6},
    "Spark":            {"US": 10, "DE": 10, "NL": 9,  "CA": 8,  "AU": 7,  "GB": 7},
    "PyTorch":          {"US": 14, "CA": 11, "GB": 9,  "DE": 8,  "SG": 7,  "AU": 6},
    "Tableau / BI":     {"US": 8,  "DE": 10, "NL": 9,  "AU": 9,  "GB": 8,  "CA": 7},
    "R":                {"US": 8,  "DE": 10, "NL": 9,  "AU": 8,  "GB": 8,  "CA": 7},
    "dbt":              {"DE": 11, "NL": 10, "US": 9,  "AU": 8,  "CA": 8,  "GB": 7},
}

# ── Helpers ────────────────────────────────────────────────────────────────────
def rank_countries(role_id: str, exp_mult: float, sal_mult: float,
                   found_skills: list[str], salary_data: dict, countries_map: dict,
                   top_n: int = 5) -> tuple[list[str], dict]:
    """
    Score every country dynamically using two factors (60/40 weighted):
      1. PPP-adjusted salary for this person's role + experience + skills (60%)
      2. Skill-country fit: how much each country specifically values their skills (40%)
    Returns top_n country codes sorted by score, plus a dict of (raw, ppp) salaries.
    """
    raw_ppps = {}
    for code, country in countries_map.items():
        base = salary_data.get(code, {}).get(role_id, salary_data["US"]["ds"])
        raw = round(base * exp_mult * sal_mult)
        ppp = ppp_adjust(raw, country["bigMac"])
        raw_ppps[code] = (raw, ppp)

    ppp_values = [v[1] for v in raw_ppps.values()]
    ppp_min, ppp_max = min(ppp_values), max(ppp_values)
    ppp_range = ppp_max - ppp_min or 1

    # Max possible skill bonus across any single country (for normalization)
    max_skill_bonus = sum(
        max(SKILL_COUNTRY_BOOST.get(sk, {}).values(), default=0)
        for sk in found_skills
    ) or 1

    scores = {}
    for code in countries_map:
        ppp_score = (raw_ppps[code][1] - ppp_min) / ppp_range * 100
        skill_bonus = sum(SKILL_COUNTRY_BOOST.get(sk, {}).get(code, 0) for sk in found_skills)
        skill_score = (skill_bonus / max_skill_bonus) * 100

        scores[code] = round(0.6 * ppp_score + 0.4 * skill_score, 2)

    top_codes = sorted(scores, key=lambda c: scores[c], reverse=True)[:top_n]
    return top_codes, raw_ppps, scores

def ppp_adjust(raw: float, bigmac: float) -> int:
    return round((raw * BASE_BIGMAC_US) / bigmac)

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    text_parts = []
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        for page in pdf.pages:
            t = page.extract_text()
            if t:
                text_parts.append(t)
    return "\n".join(text_parts)

def extract_skills(text: str) -> list[str]:
    text_lower = text.lower()
    found = []
    for skill, patterns in SKILL_PATTERNS.items():
        if any(re.search(p, text_lower) for p in patterns):
            found.append(skill)
    return found

def extract_experience_years(text: str) -> int:
    """
    Look for patterns like '5 years', '3+ years', '2020 - 2024', etc.
    Returns best estimated total years of experience.
    """
    patterns = [
        r"(\d+)\+?\s*years?\s+(?:of\s+)?(?:experience|exp)",
        r"(\d+)\s*(?:yrs?|years?)\s+(?:of\s+)?(?:experience|exp|work)",
        r"experience[:\s]+(\d+)\s*(?:years?|yrs?)",
    ]
    for p in patterns:
        m = re.search(p, text, re.IGNORECASE)
        if m:
            return int(m.group(1))

    # Fallback: count year ranges like 2019 – 2024 (= 5 yrs per range)
    year_pairs = re.findall(r"(20\d{2})\s*[-–—]\s*(20\d{2}|present|current)", text, re.IGNORECASE)
    if year_pairs:
        total = 0
        for start, end in year_pairs:
            end_yr = 2025 if end.lower() in ("present", "current") else int(end)
            total += max(0, end_yr - int(start))
        return min(total, 20)

    # Count standalone 4-digit years as proxy
    years_found = re.findall(r"\b(20\d{2})\b", text)
    if years_found:
        unique_years = sorted(set(int(y) for y in years_found))
        return min(len(unique_years), 15)

    return 0

def infer_exp_level(years: int) -> tuple[str, str]:
    if years <= 2:
        return "Junior (0-2 yrs)", "junior"
    elif years <= 5:
        return "Mid (3-5 yrs)", "mid"
    else:
        return "Senior (6+ yrs)", "senior"

def extract_name(text: str) -> str:
    """
    Try to find a name: look at first 3 non-empty lines for a short title-cased line.
    """
    for line in text.splitlines()[:5]:
        line = line.strip()
        if 2 <= len(line.split()) <= 4 and line.istitle() and not any(
            kw in line.lower() for kw in ["curriculum", "resume", "cv", "profile", "summary"]
        ):
            return line
    return "Data Science Candidate"

def build_cluster_profile(found_skills: list[str], role_id: str, years: int) -> dict:
    """Build a 6-axis profile vector from found skills."""
    axes = ["Python", "ML Depth", "Cloud", "SQL", "Research", "Salary PPP"]
    base = {ax: 20.0 for ax in axes}

    for skill in found_skills:
        for axis, weight in SKILL_AXIS_WEIGHTS.get(skill, {}).items():
            base[axis] = min(100, base[axis] + weight)

    # Boost Salary PPP based on experience and in-demand skill count
    demand_map = {s["skill"]: s["demand"] for s in metadata["top_skills"]}
    avg_demand = np.mean([demand_map.get(s, 50) for s in found_skills]) if found_skills else 50
    base["Salary PPP"] = min(100, 20 + (years / 15) * 40 + (avg_demand / 100) * 40)

    # Research boost for AI/ML roles
    if role_id in ("ai", "ml"):
        base["Research"] = min(100, base["Research"] + 20)

    return {ax: round(base[ax], 1) for ax in axes}

def predict_cluster(profile_dict: dict) -> str:
    axes = ["Python", "ML Depth", "Cloud", "SQL", "Research", "Salary PPP"]
    vec = np.array([[profile_dict[ax] for ax in axes]])
    vec_scaled = cluster_scaler.transform(vec)
    cluster_idx = int(kmeans.predict(vec_scaled)[0])
    return label_map.get(cluster_idx, "Industry Applied")

def marketability_score(found_skills: list[str], years: int) -> int:
    demand_map = {s["skill"]: s["demand"] for s in metadata["top_skills"]}
    skill_score = sum(demand_map.get(s, 0) for s in found_skills)
    max_skill_score = sum(s["demand"] for s in metadata["top_skills"])
    skill_pct = skill_score / max_skill_score if max_skill_score else 0
    exp_pct = min(years / 10, 1.0)
    score = 40 + round(skill_pct * 40 + exp_pct * 18)
    return min(98, max(40, score))

def country_reason(country_code: str, role_title: str, exp_label: str) -> str:
    reasons = {
        "US": f"Highest absolute salaries for {role_title} roles, strong tech ecosystem",
        "CA": f"Growing tech sector with welcoming immigration for {role_title} professionals",
        "DE": f"Strong engineering culture and competitive salaries for {role_title} in Europe",
        "AU": f"High demand for {role_title} talent with excellent work-life balance",
        "SG": f"Asia-Pacific hub for data roles, tax-friendly and internationally connected",
        "GB": f"Major financial and tech sector driving {role_title} demand in London",
        "NL": f"Amsterdam tech scene and EU access make it ideal for {role_title}s",
        "IN": f"Rapidly growing market with strong demand for {exp_label} {role_title} talent",
        "JP": f"Expanding AI investment and competitive salaries for data professionals",
        "KR": f"Tech giants like Samsung and Kakao driving {role_title} demand",
        "BR": f"Largest tech market in South America, growing data science community",
        "PL": f"Competitive salaries in Europe with lower cost of living",
        "MX": f"Nearshore tech hub with growing demand for data professionals",
        "ZA": f"Gateway to Africa's emerging tech market",
        "MN": f"Early mover advantage in a developing data science ecosystem",
    }
    return reasons.get(country_code, f"Demand for {role_title} professionals")

# ── FastAPI app ────────────────────────────────────────────────────────────────
app = FastAPI(title="CareerAtlas ML API", version="2.0.0")

import os
_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:4173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if "*" in _ORIGINS else _ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Endpoints ──────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "mode": "local-ml-only"}

@app.get("/ml/salary")
def predict_salary(role: str = "ds", country: str = "US", exp: str = "mid"):
    roles = metadata["roles"]
    exp_mults = metadata["exp_multipliers"]
    countries = {c["code"]: c for c in metadata["countries"]}

    if role not in roles:
        raise HTTPException(400, f"role must be one of {roles}")
    if exp not in exp_mults:
        raise HTTPException(400, f"exp must be one of {list(exp_mults.keys())}")
    if country not in countries:
        raise HTTPException(400, f"Unknown country: {country}")

    c = countries[country]
    features = np.array([[roles.index(role), c["gdpPerCapita"], c["bigMac"], exp_mults[exp]]])
    raw = float(salary_model.predict(salary_scaler.transform(features))[0])

    return {
        "role": role, "country": country, "exp": exp,
        "rawSalary": round(raw),
        "pppSalary": ppp_adjust(raw, c["bigMac"]),
        "currency": "USD",
    }

@app.get("/ml/clusters")
def get_clusters():
    axes = metadata["cluster_axes"]
    centers = cluster_scaler.inverse_transform(kmeans.cluster_centers_)
    clusters = [
        {"id": i, "label": label_map.get(i, f"Cluster {i}"),
         "profile": {ax: round(float(centers[i][j]), 1) for j, ax in enumerate(axes)}}
        for i in range(len(centers))
    ]
    return {"clusters": clusters, "axes": axes}

@app.get("/ml/skills")
def get_skills():
    return {"skills": metadata["top_skills"]}

# ── CV Analysis — 100% local ML, no external API ──────────────────────────────
class CVRequest(BaseModel):
    text: Optional[str] = None
    pdf_base64: Optional[str] = None

@app.post("/analyze-cv")
def analyze_cv(req: CVRequest):
    # 1. Get text
    if req.pdf_base64:
        try:
            pdf_bytes = base64.b64decode(req.pdf_base64)
            cv_text = extract_text_from_pdf(pdf_bytes)
        except Exception as e:
            raise HTTPException(400, f"Could not read PDF: {e}")
    elif req.text:
        cv_text = req.text
    else:
        raise HTTPException(400, "Provide 'text' or 'pdf_base64'")

    if len(cv_text.strip()) < 30:
        raise HTTPException(400, "CV text too short to analyze")

    # 2. Extract skills
    found_skills = extract_skills(cv_text)

    # 3. Infer role via TF-IDF + LogisticRegression
    role_id = role_classifier.predict([cv_text])[0]
    role_proba = dict(zip(role_classifier.classes_,
                          role_classifier.predict_proba([cv_text])[0]))
    role_title = metadata["role_titles"][role_id]

    # 4. Extract experience
    years = extract_experience_years(cv_text)
    exp_label, exp_id = infer_exp_level(years)
    exp_mult = metadata["exp_multipliers"][exp_id]

    # 5. Build cluster profile & predict cluster
    profile = build_cluster_profile(found_skills, role_id, years)
    cluster_label = predict_cluster(profile)

    cluster_reasoning_map = {
        "Research Track":      "Your profile shows strong ML depth and research orientation",
        "Industry Applied":    "Your skills align with production-focused industry applications",
        "Emerging Markets":    "Your profile fits fast-growing tech markets with foundational skills",
        "Early Career Global": "Your early-career profile is versatile across global markets",
    }

    # 6. Skills to learn (tracked skills not found, ordered by demand)
    skill_demand = {s["skill"]: s["demand"] for s in metadata["top_skills"]}
    skills_to_learn = sorted(
        [s for s in skill_demand if s not in found_skills],
        key=lambda s: skill_demand[s],
        reverse=True,
    )[:3]

    # 7. Marketability score
    score = marketability_score(found_skills, years)

    # 8. Salary multiplier from skill demand
    demand_boost = sum(
        next((s["salaryBoost"] for s in metadata["top_skills"] if s["skill"] == sk), 0)
        for sk in found_skills
    )
    sal_mult = round(min(1.8, max(0.5, 1.0 + demand_boost / 300)), 3)

    # 9. Top country recommendations — dynamically ranked by PPP salary + skill fit
    salary_data = metadata["salary_data"]
    countries_map = {c["code"]: c for c in metadata["countries"]}

    top_codes, all_salaries, country_scores = rank_countries(
        role_id, exp_mult, sal_mult, found_skills, salary_data, countries_map
    )

    country_recs = []
    country_reasons = {}
    for code in top_codes:
        country = countries_map.get(code)
        if not country:
            continue
        raw_sal, ppp_sal = all_salaries[code]
        reason = country_reason(code, role_title, exp_label)
        country_recs.append({
            "code": code, "name": country.get("name", code),
            "rawSalary": raw_sal, "pppSalary": ppp_sal,
            "matchScore": country_scores[code],
            "reason": reason,
        })
        country_reasons[code] = reason

    # 10. Name & summary
    name = extract_name(cv_text)
    skill_str = ", ".join(found_skills[:3]) if found_skills else "various data tools"
    summary = (
        f"{name} is a {exp_label.lower()} {role_title} with expertise in {skill_str}. "
        f"Their profile aligns with the {cluster_label} career path."
    )

    return {
        "name":               name,
        "inferredRole":       role_title,
        "inferredRoleId":     role_id,
        "experienceLevel":    exp_label,
        "experienceLevelId":  exp_id,
        "yearsExperience":    years,
        "foundSkills":        found_skills,
        "summary":            summary,
        "clusterMatch":       cluster_label,
        "clusterReasoning":   cluster_reasoning_map.get(cluster_label, ""),
        "topCountryCodes":    top_codes,
        "countryReasons":     country_reasons,
        "skillsToLearn":      skills_to_learn,
        "marketabilityScore": score,
        "salaryMultiplier":   sal_mult,
        "countryRecs":        country_recs,
        # Debug info (useful for capstone presentation)
        "_debug": {
            "roleConfidence": {k: round(float(v), 3) for k, v in role_proba.items()},
            "clusterProfile": profile,
            "countryScores": {k: round(v, 1) for k, v in sorted(
                country_scores.items(), key=lambda x: x[1], reverse=True
            )},
        },
    }
