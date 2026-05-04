import { useState } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Legend } from "recharts";
import { COUNTRIES, CAREER_CLUSTERS, RADAR_AXES } from "../data.js";

const QUIZ = [
  { key: "exp",      question: "How many years of experience do you have?",  options: [{ label: "0–1 year", value: "early" }, { label: "2–4 years", value: "mid" }, { label: "5–8 years", value: "senior" }, { label: "8+ years", value: "research" }] },
  { key: "interest", question: "What excites you most?",                       options: [{ label: "Publishing research & novel models", value: "research" }, { label: "Building products that ship", value: "industry" }, { label: "Analyzing business data", value: "emerging" }, { label: "Learning broad skills", value: "early" }] },
  { key: "location", question: "Where do you want to work?",                   options: [{ label: "US / Western Europe", value: "research" }, { label: "Canada / Australia / Singapore", value: "industry" }, { label: "India / Poland / Brazil", value: "emerging" }, { label: "Mongolia / remote anywhere", value: "early" }] },
];

export default function ClustersPage() {
  const [activeCluster, setActiveCluster] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  const runQuiz = () => {
    const votes = { research: 0, industry: 0, emerging: 0, early: 0 };
    Object.values(quizAnswers).forEach(v => { if (votes[v] !== undefined) votes[v]++; });
    const winner = Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];
    setQuizResult({ research: CAREER_CLUSTERS[0], industry: CAREER_CLUSTERS[1], emerging: CAREER_CLUSTERS[2], early: CAREER_CLUSTERS[3] }[winner]);
  };

  const radarData = RADAR_AXES.map(axis => {
    const row = { axis };
    CAREER_CLUSTERS.forEach(cl => { row[cl.label.split(" ")[0]] = cl.profile[axis] || 0; });
    return row;
  });

  return (
    <div className="main fade-in">
      <div className="section-header">
        <h2 className="section-title">Career Path Clusters</h2>
        <span className="section-meta">K-Means Clustering · 4 archetypes</span>
      </div>
      <div className="insight-box">
        <div className="insight-icon">🧩</div>
        <div className="insight-text">K-means clustering on salary, experience, skills, and geography identified <strong>4 career archetypes</strong>. Use the quiz to find yours, or <strong>upload your CV</strong> in the My Profile tab for a personalized analysis.</div>
      </div>
      <div className="cluster-list">
        {CAREER_CLUSTERS.map(cl => (
          <div key={cl.id} className={`cluster-card ${activeCluster === cl.id ? "active" : ""}`} style={{ "--c": cl.color }} onClick={() => setActiveCluster(activeCluster === cl.id ? null : cl.id)}>
            <div className="cluster-label" style={{ color: cl.color }}>{cl.label}</div>
            <div className="cluster-countries">{cl.countries.map(c => COUNTRIES.find(x => x.code === c)?.flag || "").join(" ")} {cl.countries.join(" · ")}</div>
            <div className="cluster-ppp" style={{ color: cl.color }}>${cl.avgSalaryPPP.toLocaleString()} <span style={{ fontSize: "0.65rem", color: "var(--muted)" }}>avg PPP</span></div>
            <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginBottom: "0.5rem" }}>Avg. {cl.avgExp} yr{cl.avgExp > 1 ? "s" : ""} experience</div>
            <div className="cluster-skills">{cl.skills.map(s => <span key={s} className="skill-chip">{s}</span>)}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-title">Cluster Profile Comparison</div>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="#1f2d42" />
            <PolarAngleAxis dataKey="axis" tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "JetBrains Mono" }} />
            {CAREER_CLUSTERS.map(cl => (
              <Radar key={cl.id} name={cl.label} dataKey={cl.label.split(" ")[0]} stroke={cl.color} fill={cl.color}
                fillOpacity={activeCluster === null || activeCluster === cl.id ? 0.1 : 0.02}
                strokeWidth={activeCluster === null || activeCluster === cl.id ? 2 : 0.5} />
            ))}
            <Legend wrapperStyle={{ fontSize: "0.68rem", fontFamily: "JetBrains Mono", color: "#64748b" }} />
          </RadarChart>
        </ResponsiveContainer>
        <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: "0.5rem" }}>Click a cluster card to highlight it.</div>
      </div>
      <div className="quiz-card">
        <div className="quiz-title">🎯 Find My Career Cluster</div>
        <div className="quiz-sub">Answer 3 quick questions to find your archetype.</div>
        {QUIZ.map((q, qi) => (
          <div key={q.key} style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.78rem", color: "var(--text)", marginBottom: "0.75rem", fontWeight: 600 }}>{qi + 1}. {q.question}</div>
            <div className="quiz-options">
              {q.options.map(opt => (
                <button key={opt.value} className={`quiz-option ${quizAnswers[q.key] === opt.value ? "selected" : ""}`} onClick={() => setQuizAnswers(prev => ({ ...prev, [q.key]: opt.value }))}>{opt.label}</button>
              ))}
            </div>
          </div>
        ))}
        <button className="quiz-btn" onClick={runQuiz} disabled={Object.keys(quizAnswers).length < QUIZ.length} style={{ opacity: Object.keys(quizAnswers).length < QUIZ.length ? 0.4 : 1 }}>
          Find My Cluster →
        </button>
        {quizResult && (
          <div className="quiz-result" style={{ borderColor: quizResult.color }}>
            <div style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Your Career Archetype</div>
            <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.4rem", color: quizResult.color, marginBottom: "0.5rem" }}>{quizResult.label}</div>
            <div style={{ fontSize: "0.78rem", color: "var(--slate)", lineHeight: 1.7 }}>
              You match the <strong style={{ color: quizResult.color }}>{quizResult.label}</strong> cluster — typically found in <strong>{quizResult.countries.join(", ")}</strong>.
              Average PPP salary: <strong>${quizResult.avgSalaryPPP.toLocaleString()}</strong>. Key skills: <strong>{quizResult.skills.join(", ")}</strong>.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
