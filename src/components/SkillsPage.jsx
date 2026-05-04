import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell } from "recharts";
import { TOP_SKILLS } from "../data.js";

export default function SkillsPage() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Language", "Domain", "Framework", "Platform"];
  const filtered = filter === "All" ? TOP_SKILLS : TOP_SKILLS.filter(s => s.category === filter);

  return (
    <div className="main fade-in">
      <div className="section-header">
        <h2 className="section-title">Skills in Demand</h2>
        <span className="section-meta">Stack Overflow Survey · NLP Extraction</span>
      </div>
      <div className="insight-box">
        <div className="insight-icon">🔬</div>
        <div className="insight-text">
          Skills extracted from <strong>376K+</strong> survey responses using NLP. Salary boost = average premium for that skill vs. same role without it. <strong>LLMs / GenAI</strong> tops the boost chart at +38% — the strongest signal from 2024 data.
        </div>
      </div>
      <div className="filter-chips">
        {categories.map(cat => <button key={cat} className={`chip ${filter === cat ? "active" : ""}`} onClick={() => setFilter(cat)}>{cat}</button>)}
      </div>
      <div className="skills-grid">
        <div className="card">
          <div className="card-title">Market Demand (% of job postings)</div>
          {filtered.map(s => (
            <div key={s.skill} className="skill-row">
              <span className="skill-name">{s.skill}</span>
              <div className="skill-bar-bg"><div className="skill-bar" style={{ width: `${s.demand}%`, background: "var(--amber)" }} /></div>
              <span className="skill-pct">{s.demand}%</span>
              <span className="skill-cat">{s.category}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">Salary Boost by Skill</div>
          {[...filtered].sort((a, b) => b.avgSalaryBoost - a.avgSalaryBoost).map(s => (
            <div key={s.skill} className="skill-row">
              <span className="skill-name">{s.skill}</span>
              <div className="skill-bar-bg"><div className="skill-bar" style={{ width: `${s.avgSalaryBoost * 2.2}%`, background: "var(--success)" }} /></div>
              <span className="skill-boost">+{s.avgSalaryBoost}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-title">Demand vs Salary Boost — Skill Map</div>
        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <XAxis dataKey="demand" name="Demand" type="number" domain={[38, 100]} tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }} tickFormatter={v => `${v}%`} axisLine={false} tickLine={false} />
            <YAxis dataKey="avgSalaryBoost" name="Boost" type="number" domain={[8, 42]} tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }} tickFormatter={v => `+${v}%`} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ strokeDasharray: "3 3", stroke: "var(--border)" }} content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return <div className="custom-tooltip"><div className="label" style={{ fontWeight: 600, color: "var(--text)" }}>{d.skill}</div><div className="value">Demand: {d.demand}% · Boost: +{d.avgSalaryBoost}%</div></div>;
            }} />
            <Scatter data={filtered}>
              {filtered.map((s, i) => <Cell key={i} fill={s.category === "Domain" ? "#f59e0b" : s.category === "Language" ? "#34d399" : s.category === "Framework" ? "#60a5fa" : "#f472b6"} />)}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
          {[["Domain", "#f59e0b"], ["Language", "#34d399"], ["Framework", "#60a5fa"], ["Platform", "#f472b6"]].map(([cat, color]) => (
            <span key={cat} style={{ fontSize: "0.65rem", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />{cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
