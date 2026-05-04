"""
CareerAtlas ML Training Script
Trains and saves:
  1. Salary predictor    (RandomForestRegressor)
  2. Career cluster model (KMeans)
  3. Role classifier      (TF-IDF + LogisticRegression)
Run once before starting the server: python train_models.py
"""

import os
import random
import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.cluster import KMeans
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

random.seed(42)
np.random.seed(42)

# ── Raw data ───────────────────────────────────────────────────────────────────
COUNTRIES = [
    {"code": "US", "bigMac": 5.58, "gdpPerCapita": 76000, "region": "North America"},
    {"code": "IN", "bigMac": 2.54, "gdpPerCapita": 2500,  "region": "Asia"},
    {"code": "DE", "bigMac": 5.02, "gdpPerCapita": 48000, "region": "Europe"},
    {"code": "CA", "bigMac": 4.94, "gdpPerCapita": 52000, "region": "North America"},
    {"code": "AU", "bigMac": 4.30, "gdpPerCapita": 55000, "region": "Oceania"},
    {"code": "SG", "bigMac": 4.19, "gdpPerCapita": 65000, "region": "Asia"},
    {"code": "GB", "bigMac": 4.01, "gdpPerCapita": 44000, "region": "Europe"},
    {"code": "BR", "bigMac": 3.13, "gdpPerCapita": 8800,  "region": "South America"},
    {"code": "MN", "bigMac": 2.28, "gdpPerCapita": 4200,  "region": "Asia"},
    {"code": "PL", "bigMac": 2.76, "gdpPerCapita": 18000, "region": "Europe"},
    {"code": "NL", "bigMac": 5.35, "gdpPerCapita": 57000, "region": "Europe"},
    {"code": "JP", "bigMac": 3.40, "gdpPerCapita": 33000, "region": "Asia"},
    {"code": "KR", "bigMac": 3.86, "gdpPerCapita": 32000, "region": "Asia"},
    {"code": "MX", "bigMac": 2.68, "gdpPerCapita": 10000, "region": "Latin America"},
    {"code": "ZA", "bigMac": 2.16, "gdpPerCapita": 6000,  "region": "Africa"},
]

SALARY_DATA = {
    "US": {"ds": 130000, "ml": 155000, "da": 85000,  "de": 135000, "ai": 175000},
    "IN": {"ds": 18000,  "ml": 22000,  "da": 10000,  "de": 20000,  "ai": 28000},
    "DE": {"ds": 75000,  "ml": 90000,  "da": 55000,  "de": 80000,  "ai": 100000},
    "CA": {"ds": 95000,  "ml": 115000, "da": 70000,  "de": 100000, "ai": 130000},
    "AU": {"ds": 90000,  "ml": 105000, "da": 65000,  "de": 95000,  "ai": 120000},
    "SG": {"ds": 80000,  "ml": 95000,  "da": 55000,  "de": 85000,  "ai": 110000},
    "GB": {"ds": 72000,  "ml": 85000,  "da": 50000,  "de": 78000,  "ai": 95000},
    "BR": {"ds": 25000,  "ml": 30000,  "da": 15000,  "de": 27000,  "ai": 35000},
    "MN": {"ds": 8000,   "ml": 10000,  "da": 5000,   "de": 9000,   "ai": 12000},
    "PL": {"ds": 35000,  "ml": 42000,  "da": 22000,  "de": 38000,  "ai": 50000},
    "NL": {"ds": 78000,  "ml": 95000,  "da": 58000,  "de": 82000,  "ai": 105000},
    "JP": {"ds": 60000,  "ml": 72000,  "da": 42000,  "de": 65000,  "ai": 85000},
    "KR": {"ds": 52000,  "ml": 62000,  "da": 38000,  "de": 56000,  "ai": 75000},
    "MX": {"ds": 22000,  "ml": 27000,  "da": 13000,  "de": 24000,  "ai": 32000},
    "ZA": {"ds": 20000,  "ml": 24000,  "da": 12000,  "de": 21000,  "ai": 28000},
}

ROLES = ["ds", "ml", "da", "de", "ai"]
EXP_MULTIPLIERS = {"junior": 0.65, "mid": 1.00, "senior": 1.55}

TOP_SKILLS = [
    {"skill": "Python",           "demand": 94, "salaryBoost": 22},
    {"skill": "Machine Learning", "demand": 88, "salaryBoost": 31},
    {"skill": "SQL",              "demand": 82, "salaryBoost": 15},
    {"skill": "Cloud (AWS/GCP)",  "demand": 76, "salaryBoost": 25},
    {"skill": "TensorFlow",       "demand": 71, "salaryBoost": 28},
    {"skill": "NLP",              "demand": 67, "salaryBoost": 33},
    {"skill": "LLMs / GenAI",     "demand": 61, "salaryBoost": 38},
    {"skill": "Spark",            "demand": 58, "salaryBoost": 20},
    {"skill": "PyTorch",          "demand": 55, "salaryBoost": 29},
    {"skill": "Tableau / BI",     "demand": 53, "salaryBoost": 12},
    {"skill": "R",                "demand": 45, "salaryBoost": 10},
    {"skill": "dbt",              "demand": 42, "salaryBoost": 18},
]

CLUSTER_PROFILES = {
    "Research Track":      [90, 95, 50, 60, 95, 85],
    "Industry Applied":    [95, 75, 90, 85, 40, 80],
    "Emerging Markets":    [80, 55, 60, 90, 30, 55],
    "Early Career Global": [70, 40, 35, 85, 25, 30],
}

# Role classifier training phrases — characteristic keywords per role
ROLE_KEYWORDS = {
    "ds": [
        "statistics", "predictive modeling", "regression", "classification", "hypothesis testing",
        "A/B testing", "feature engineering", "data analysis", "exploratory data analysis",
        "pandas", "numpy", "scikit-learn", "matplotlib", "seaborn", "jupyter", "R",
        "statistical modeling", "data science", "business intelligence", "data insights",
        "forecasting", "time series", "clustering", "dimensionality reduction",
    ],
    "ml": [
        "deep learning", "neural networks", "model deployment", "MLOps", "Kubernetes",
        "Docker", "model optimization", "inference", "training pipelines", "GPU", "CUDA",
        "transformer", "computer vision", "object detection", "image classification",
        "PyTorch", "TensorFlow", "Keras", "model serving", "production ML", "distributed training",
        "hyperparameter tuning", "AutoML", "feature store", "model monitoring",
    ],
    "da": [
        "SQL", "Tableau", "Power BI", "Excel", "reporting", "dashboard", "business intelligence",
        "data visualization", "KPI", "metrics", "Google Analytics", "Looker", "data cleaning",
        "pivot tables", "data analyst", "stakeholder", "data-driven decisions",
        "ad hoc analysis", "trend analysis", "revenue reporting", "operational metrics",
        "Excel macros", "data storytelling", "Redash", "Metabase",
    ],
    "de": [
        "Apache Spark", "Hadoop", "Kafka", "Airflow", "ETL", "data pipeline",
        "data warehouse", "BigQuery", "Snowflake", "Redshift", "dbt", "data lake",
        "streaming", "batch processing", "Scala", "data engineering", "schema design",
        "data modeling", "orchestration", "ELT", "CDC", "delta lake", "Databricks",
        "infrastructure", "data platform", "data ingestion",
    ],
    "ai": [
        "NLP", "natural language processing", "reinforcement learning", "generative AI",
        "large language model", "LLM", "BERT", "GPT", "diffusion model", "arxiv",
        "research paper", "publication", "PhD", "novel algorithm", "AI research",
        "attention mechanism", "fine-tuning", "RLHF", "prompt engineering",
        "multimodal", "zero-shot", "few-shot", "AI safety", "alignment",
    ],
}

# Templates to generate diverse CV-like training texts
TEMPLATES = [
    "{kw1} {kw2} {kw3} experience in {kw4} and {kw5}",
    "Skilled in {kw1}, {kw2}, and {kw3}. Worked on {kw4} projects.",
    "Expert in {kw1} with strong {kw2} skills. Used {kw3} and {kw4} daily.",
    "{kw1} developer proficient in {kw2}, {kw3}, {kw4}, {kw5}",
    "Built {kw1} systems using {kw2}. Deep knowledge of {kw3}.",
    "Led {kw1} initiatives, implemented {kw2} pipelines using {kw3}.",
    "Developed {kw1} models with {kw2} and deployed using {kw3}.",
    "Designed {kw1} solutions. Expertise: {kw2}, {kw3}, {kw4}.",
]


def generate_role_texts(role: str, n: int = 300) -> list[str]:
    keywords = ROLE_KEYWORDS[role]
    texts = []
    for _ in range(n):
        template = random.choice(TEMPLATES)
        sampled = random.sample(keywords, min(5, len(keywords)))
        text = template.format(
            kw1=sampled[0], kw2=sampled[1], kw3=sampled[2],
            kw4=sampled[3] if len(sampled) > 3 else sampled[0],
            kw5=sampled[4] if len(sampled) > 4 else sampled[1],
        )
        texts.append(text)
    return texts


# ── Build datasets ─────────────────────────────────────────────────────────────
def build_salary_dataset(n_per_combo: int = 50) -> pd.DataFrame:
    rng = np.random.default_rng(42)
    country_map = {c["code"]: c for c in COUNTRIES}
    rows = []
    for country_code, roles in SALARY_DATA.items():
        country = country_map[country_code]
        for role, base_salary in roles.items():
            for exp_id, exp_mult in EXP_MULTIPLIERS.items():
                base = base_salary * exp_mult
                for _ in range(n_per_combo):
                    noise = rng.normal(1.0, 0.08)
                    rows.append({
                        "role":           ROLES.index(role),
                        "gdp_per_capita": country["gdpPerCapita"],
                        "bigmac_price":   country["bigMac"],
                        "exp_multiplier": exp_mult,
                        "salary":         max(1000, base * noise),
                    })
    return pd.DataFrame(rows)


def build_cluster_dataset() -> np.ndarray:
    rng = np.random.default_rng(42)
    points = []
    for profile in CLUSTER_PROFILES.values():
        center = np.array(profile, dtype=float)
        noise = rng.normal(0, 5, size=(200, len(center)))
        points.append(np.clip(center + noise, 0, 100))
    return np.vstack(points)


# ── Train & save ───────────────────────────────────────────────────────────────
def main():
    os.makedirs("models", exist_ok=True)

    # 1. Salary predictor
    print("Training salary predictor...")
    df = build_salary_dataset()
    X = df[["role", "gdp_per_capita", "bigmac_price", "exp_multiplier"]].values
    y = df["salary"].values
    salary_scaler = StandardScaler()
    X_scaled = salary_scaler.fit_transform(X)
    salary_model = RandomForestRegressor(n_estimators=100, max_depth=8, random_state=42, n_jobs=-1)
    salary_model.fit(X_scaled, y)
    joblib.dump(salary_model,  "models/salary_model.pkl")
    joblib.dump(salary_scaler, "models/salary_scaler.pkl")
    print(f"  → R² on train: {salary_model.score(X_scaled, y):.3f}")

    # 2. K-Means career clusters
    print("Training K-Means career clusters...")
    cluster_data = build_cluster_dataset()
    cluster_scaler = StandardScaler()
    cluster_data_scaled = cluster_scaler.fit_transform(cluster_data)
    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    kmeans.fit(cluster_data_scaled)
    cluster_names = list(CLUSTER_PROFILES.keys())
    known_centers_scaled = cluster_scaler.transform(
        np.array(list(CLUSTER_PROFILES.values()), dtype=float)
    )
    label_map = {}
    for name_idx, kc in enumerate(known_centers_scaled):
        distances = np.linalg.norm(kmeans.cluster_centers_ - kc, axis=1)
        label_map[int(np.argmin(distances))] = cluster_names[name_idx]
    joblib.dump(kmeans,         "models/kmeans.pkl")
    joblib.dump(cluster_scaler, "models/cluster_scaler.pkl")
    joblib.dump(label_map,      "models/cluster_label_map.pkl")
    print(f"  → Label map: {label_map}")

    # 3. Role classifier (TF-IDF + Logistic Regression)
    print("Training role classifier (TF-IDF + LogisticRegression)...")
    texts, labels = [], []
    for role in ROLES:
        role_texts = generate_role_texts(role, n=300)
        texts.extend(role_texts)
        labels.extend([role] * len(role_texts))

    role_pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=5000, sublinear_tf=True)),
        ("clf",   LogisticRegression(max_iter=500, random_state=42, C=1.0)),
    ])
    role_pipeline.fit(texts, labels)
    train_acc = role_pipeline.score(texts, labels)
    joblib.dump(role_pipeline, "models/role_classifier.pkl")
    print(f"  → Train accuracy: {train_acc:.3f}")

    # 4. Metadata
    metadata = {
        "roles": ROLES,
        "role_titles": {
            "ds": "Data Scientist", "ml": "ML Engineer",
            "da": "Data Analyst",   "de": "Data Engineer", "ai": "AI Researcher",
        },
        "exp_multipliers": EXP_MULTIPLIERS,
        "countries": COUNTRIES,
        "salary_data": SALARY_DATA,
        "top_skills": TOP_SKILLS,
        "cluster_axes": ["Python", "ML Depth", "Cloud", "SQL", "Research", "Salary PPP"],
        "cluster_profiles": CLUSTER_PROFILES,
    }
    joblib.dump(metadata, "models/metadata.pkl")

    print("\nAll models saved to ./models/ — ready to start the server.")


if __name__ == "__main__":
    main()
