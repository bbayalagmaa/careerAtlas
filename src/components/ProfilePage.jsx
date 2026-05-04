import { useState, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { COUNTRIES, CAREER_CLUSTERS, ALL_TRACKED_SKILLS, TOP_SKILLS } from "../data.js";
import CustomTooltip from "./CustomTooltip.jsx";

const STEPS = [
  "Reading your CV…",
  "Extracting skills & experience…",
  "Matching career clusters…",
  "Calculating PPP salaries…",
  "Generating recommendations…",
];

export default function ProfilePage() {
  const [inputMode, setInputMode] = useState("upload");
  const [cvText, setCvText] = useState("");
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("idle");
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      if (file.type === "application/pdf") {
        const reader = new FileReader();
        reader.onload = () => resolve({ type: "pdf", data: reader.result.split(",")[1] });
        reader.onerror = reject;
        reader.readAsDataURL(file);
      } else {
        const reader = new FileReader();
        reader.onload = () => resolve({ type: "text", data: reader.result });
        reader.onerror = reject;
        reader.readAsText(file);
      }
    });
  };

  const handleFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    try {
      const result = await readFileAsText(file);
      setCvText(result.type === "text" ? result.data : `__PDF__${result.data}`);
    } catch {
      setCvText("");
    }
  };

  const analyzeCV = async () => {
    const textToAnalyze = cvText.trim();
    if (!textToAnalyze) return;
    setStatus("analyzing");
    setAnalysisStep(0);

    const stepInterval = setInterval(() => {
      setAnalysisStep(prev => {
        if (prev >= STEPS.length - 1) { clearInterval(stepInterval); return prev; }
        return prev + 1;
      });
    }, 900);

    try {
      const isPDF = textToAnalyze.startsWith("__PDF__");
      const base64Data = isPDF ? textToAnalyze.replace("__PDF__", "") : null;
      const body = isPDF && base64Data ? { pdf_base64: base64Data } : { text: textToAnalyze };

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_URL}/analyze-cv`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      clearInterval(stepInterval);
      setAnalysisStep(STEPS.length - 1);

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Backend error ${response.status}`);
      }

      const parsed = await response.json();
      const countryRecs = (parsed.countryRecs || []).map(rec => {
        const country = COUNTRIES.find(c => c.code === rec.code);
        if (!country) return null;
        return { country, rawSalary: rec.rawSalary, pppSalary: rec.pppSalary, reason: rec.reason };
      }).filter(Boolean);

      const cluster = CAREER_CLUSTERS.find(cl => cl.label === parsed.clusterMatch) || CAREER_CLUSTERS[1];
      setResult({ ...parsed, countryRecs, cluster });
      setTimeout(() => setStatus("done"), 400);
    } catch (err) {
      clearInterval(stepInterval);
      console.error(err);
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle"); setResult(null); setCvText(""); setFileName(""); setAnalysisStep(0);
  };

  if (status === "idle") {
    return (
      <div className="main fade-in cv-page">
        <div className="section-header">
          <h2 className="section-title">My Career Profile</h2>
          <span className="section-meta">ML-Powered · CV Analysis · PPP Salary Match</span>
        </div>
        <div className="insight-box">
          <div className="insight-icon">🤖</div>
          <div className="insight-text">
            Upload your CV and our ML model will extract your skills and experience, match you to a career cluster,
            recommend the <strong>best countries</strong> for your profile with <strong>PPP-adjusted salaries</strong>,
            and show you exactly which skills to learn next.
          </div>
        </div>
        <div className="cv-tabs">
          <button className={`cv-tab ${inputMode === "upload" ? "active" : ""}`} onClick={() => setInputMode("upload")}>📎 Upload PDF / TXT</button>
          <button className={`cv-tab ${inputMode === "paste" ? "active" : ""}`} onClick={() => setInputMode("paste")}>✏️ Paste CV Text</button>
        </div>
        {inputMode === "upload" ? (
          <div
            className={`cv-upload-zone ${dragOver ? "drag-over" : ""}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          >
            <input ref={fileInputRef} type="file" accept=".pdf,.txt,.doc,.docx" onChange={e => handleFile(e.target.files[0])} />
            <div className="cv-upload-icon">{fileName ? "📄" : "☁️"}</div>
            <div className="cv-upload-title">{fileName ? fileName : "Drop your CV here"}</div>
            <div className="cv-upload-sub">{fileName ? "File loaded. Click Analyze to continue." : "or click to browse files"}</div>
            <div className="cv-upload-formats">
              {["PDF", "TXT", "DOC"].map(f => <span key={f} className="format-badge">{f}</span>)}
            </div>
          </div>
        ) : (
          <textarea
            className="cv-textarea"
            placeholder={`Paste your CV text here...\n\nExample:\nJohn Smith\nData Scientist | 3 years experience\n\nSkills: Python, TensorFlow, SQL, AWS\nEducation: BSc Computer Science\nExperience: Machine learning engineer at fintech startup...`}
            value={cvText.startsWith("__PDF__") ? "" : cvText}
            onChange={e => setCvText(e.target.value)}
          />
        )}
        <button className="analyze-btn" onClick={analyzeCV} disabled={!cvText.trim()}>
          <span>✦</span>
          Analyze My Career Profile
          <span>✦</span>
        </button>
        <div className="privacy-note">
          🔒 Your CV is processed locally by ML models and never stored or sent to external APIs.
        </div>
      </div>
    );
  }

  if (status === "analyzing") {
    return (
      <div className="main fade-in">
        <div className="analyzing-state">
          <div className="analyzing-spinner" />
          <div className="analyzing-title">Analyzing Your Profile</div>
          <div className="analyzing-sub">ML models are reading your CV and matching against 376K+ career data points…</div>
          <div className="analyzing-steps">
            {STEPS.map((step, i) => (
              <div key={i} className={`analyzing-step ${i < analysisStep ? "done" : i === analysisStep ? "active" : ""}`}>
                <span>{i < analysisStep ? "✓" : i === analysisStep ? "◈" : "○"}</span>
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="main fade-in">
        <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
          <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem", marginBottom: "0.5rem" }}>Analysis Failed</div>
          <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: "2rem" }}>
            Make sure the backend is running: <code style={{ color: "var(--amber)" }}>uvicorn server:app --port 8000</code>
          </div>
          <button className="reset-btn" onClick={reset}>← Try Again</button>
        </div>
      </div>
    );
  }

  if (status === "done" && result) {
    const missingSkills = ALL_TRACKED_SKILLS.filter(s => !result.foundSkills?.includes(s));
    const skillsToLearn = result.skillsToLearn || missingSkills.slice(0, 3);

    return (
      <div className="main fade-in cv-page">
        <div className="section-header">
          <h2 className="section-title">Your Career Analysis</h2>
          <button className="reset-btn" onClick={reset}>← Analyze Another CV</button>
        </div>

        <div className="results-header">
          <div>
            <div className="results-name">{result.name}</div>
            <div className="results-role">{result.inferredRole} · {result.experienceLevel}</div>
            <div className="results-exp" style={{ marginBottom: "1rem" }}>{result.summary}</div>
            <div className="found-skills">
              {result.foundSkills?.map(s => <span key={s} className="found-skill">✓ {s}</span>)}
            </div>
          </div>
          <div className="results-score">
            <div className="results-score-num">{result.marketabilityScore}</div>
            <div className="results-score-label">Marketability<br />Score / 100</div>
          </div>
        </div>

        <div className="cluster-match" style={{ "--c": result.cluster?.color }}>
          <div className="cluster-match-label">Your Career Cluster</div>
          <div className="cluster-match-name" style={{ color: result.cluster?.color }}>{result.cluster?.label}</div>
          <div className="cluster-match-desc">{result.clusterReasoning}</div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
            {result.cluster?.skills?.map(s => <span key={s} className="skill-chip">{s}</span>)}
          </div>
        </div>

        <div className="results-grid">
          <div>
            <div className="card-title" style={{ marginBottom: "1rem" }}>🌍 Best Countries for Your Profile</div>
            {result.countryRecs?.map((rec, i) => (
              <div key={rec.country.code} className="country-rec">
                <div className="country-rec-rank">#{i + 1}</div>
                <div className="country-rec-flag">{rec.country.flag}</div>
                <div className="country-rec-info">
                  <div className="country-rec-name">{rec.country.name}</div>
                  <div className="country-rec-reason">{rec.reason}</div>
                </div>
                <div className="country-rec-salary">
                  <div className="country-rec-raw">${rec.rawSalary.toLocaleString()} raw</div>
                  <div className="country-rec-ppp">${rec.pppSalary.toLocaleString()}</div>
                  <div style={{ fontSize: "0.58rem", color: "var(--muted)" }}>PPP-adj.</div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="card-title" style={{ marginBottom: "1rem" }}>📈 Skill Gap Analysis</div>
            <div className="card" style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Skills You Have</div>
              {result.foundSkills?.map(skill => {
                const skillData = TOP_SKILLS.find(s => s.skill === skill);
                return (
                  <div key={skill} className="skill-gap-row">
                    <span className="skill-gap-name">{skill}</span>
                    <div className="skill-gap-bar-bg">
                      <div className="skill-gap-fill" style={{ width: `${skillData?.demand || 60}%`, background: "var(--success)" }} />
                    </div>
                    <span className="skill-gap-status" style={{ color: "var(--success)" }}>✓ {skillData?.demand || "—"}%</span>
                  </div>
                );
              })}
            </div>
            <div className="card">
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Priority Skills to Learn</div>
              {skillsToLearn.map(skill => {
                const skillData = TOP_SKILLS.find(s => s.skill === skill);
                return (
                  <div key={skill} className="skill-gap-row">
                    <span className="skill-gap-name">{skill}</span>
                    <div className="skill-gap-bar-bg">
                      <div className="skill-gap-fill" style={{ width: `${skillData?.demand || 50}%`, background: "var(--danger)", opacity: 0.6 }} />
                    </div>
                    <span className="skill-gap-status" style={{ color: "var(--amber)" }}>+{skillData?.avgSalaryBoost || "?"}%</span>
                  </div>
                );
              })}
              <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: "0.75rem" }}>% shown = salary boost for adding this skill</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Your Estimated Salary Across Top Countries (PPP-Adjusted)</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={result.countryRecs?.map(r => ({ name: r.country.flag + " " + r.country.code, value: r.pppSalary, raw: r.rawSalary }))} barSize={32}>
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip ppp={true} />} cursor={{ fill: "rgba(245,158,11,0.05)" }} />
              <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                {result.countryRecs?.map((_, i) => <Cell key={i} fill={i === 0 ? "#f59e0b" : i === 1 ? "#34d399" : "#1f2d42"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="insight-box">
          <div className="insight-icon">💡</div>
          <div className="insight-text">
            Your top recommended country is <strong>{result.countryRecs?.[0]?.country.name}</strong> with an estimated
            PPP-adjusted salary of <strong>${result.countryRecs?.[0]?.pppSalary?.toLocaleString()}</strong>.
            Adding <strong>{skillsToLearn[0]}</strong> to your profile could boost earnings by up to <strong>+{TOP_SKILLS.find(s => s.skill === skillsToLearn[0])?.avgSalaryBoost || "?"}%</strong>.
          </div>
        </div>
      </div>
    );
  }

  return null;
}
