import { COUNTRIES, SALARY_DATA, pppAdjust } from "../data.js";

export default function HomePage({ setPage }) {
  return (
    <div>
      <div className="hero">
        <div className="hero-grid-bg" />
        <div className="hero-globe">🌏</div>
        <div className="hero-eyebrow">Capstone Project · AUM · 2025</div>
        <h1 className="hero-title">Global Data Science<br /><em>Career Path Analyzer</em></h1>
        <p className="hero-sub">
          Raw salaries lie. A $130K offer in San Francisco and a $8K offer in Ulaanbaatar may represent
          similar purchasing power. Upload your CV to get a personalized global career analysis —
          powered by the Big Mac Index.
        </p>
        <div className="hero-stats">
          {[{ num: "376K+", label: "Survey Responses" }, { num: "15", label: "Countries" }, { num: "AI", label: "CV Analyzer" }, { num: "PPP", label: "Adjusted" }].map(s => (
            <div key={s.label}><div className="hero-stat-num">{s.num}</div><div className="hero-stat-label">{s.label}</div></div>
          ))}
        </div>
      </div>
      <div className="main">
        <div className="insight-box">
          <div className="insight-icon">🆕</div>
          <div className="insight-text">
            <strong>New: Personal CV Analyzer</strong> — Upload your CV and get AI-powered career recommendations
            showing which countries match your skills, your estimated PPP-adjusted salary range, and which skills to learn next.
            <span style={{ marginLeft: "0.5rem", cursor: "pointer", color: "var(--amber)", textDecoration: "underline" }} onClick={() => setPage("profile")}>
              Try it now →
            </span>
          </div>
        </div>
        <div className="section-header">
          <h2 className="section-title" style={{ fontSize: "1.1rem" }}>PPP-Adjusted Snapshot · Data Scientist · Mid-Level</h2>
          <span className="section-meta">Click a country to explore →</span>
        </div>
        <div className="compare-grid">
          {COUNTRIES.slice(0, 9).map(c => {
            const raw = SALARY_DATA[c.code].ds;
            const adj = pppAdjust(raw, c.bigMac);
            return (
              <div key={c.code} className="country-card" onClick={() => setPage("explorer")}>
                <div className="check-mark">✓</div>
                <div className="country-flag">{c.flag}</div>
                <div className="country-name">{c.name}</div>
                <div className="country-region">{c.region}</div>
                <div className="salary-raw">${raw.toLocaleString()} raw</div>
                <div className="salary-ppp">${adj.toLocaleString()}</div>
                <div className="salary-tag">PPP-adjusted</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
