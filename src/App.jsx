import { useState } from "react";

const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸", bigMac: 5.58, currency: "USD", region: "North America" },
  { code: "CN", name: "China",         flag: "🇨🇳", bigMac: 3.45, currency: "CNY", region: "Asia", isNew: true },
  { code: "IN", name: "India",         flag: "🇮🇳", bigMac: 2.54, currency: "INR", region: "Asia" },
  { code: "DE", name: "Germany",       flag: "🇩🇪", bigMac: 5.02, currency: "EUR", region: "Europe" },
  { code: "CA", name: "Canada",        flag: "🇨🇦", bigMac: 4.94, currency: "CAD", region: "North America" },
  { code: "AU", name: "Australia",     flag: "🇦🇺", bigMac: 4.30, currency: "AUD", region: "Oceania" },
  { code: "SG", name: "Singapore",     flag: "🇸🇬", bigMac: 4.19, currency: "SGD", region: "Asia" },
  { code: "GB", name: "United Kingdom",flag: "🇬🇧", bigMac: 4.01, currency: "GBP", region: "Europe" },
  { code: "BR", name: "Brazil",        flag: "🇧🇷", bigMac: 3.13, currency: "BRL", region: "South America" },
  { code: "MN", name: "Mongolia",      flag: "🇲🇳", bigMac: 2.28, currency: "MNT", region: "Asia" },
  { code: "PL", name: "Poland",        flag: "🇵🇱", bigMac: 2.76, currency: "PLN", region: "Europe" },
];

const ROLES = [
  { id: "ds", title: "Data Scientist",  icon: "◈" },
  { id: "ml", title: "ML Engineer",     icon: "⬡" },
  { id: "da", title: "Data Analyst",    icon: "◇" },
  { id: "de", title: "Data Engineer",   icon: "⬢" },
  { id: "ai", title: "AI Researcher",   icon: "◉" },
];

const SALARY = {
  US: { ds: 130000, ml: 155000, da: 85000,  de: 135000, ai: 175000 },
  CN: { ds: 35000,  ml: 45000,  da: 22000,  de: 38000,  ai: 55000  },
  IN: { ds: 18000,  ml: 22000,  da: 10000,  de: 20000,  ai: 28000  },
  DE: { ds: 75000,  ml: 90000,  da: 55000,  de: 80000,  ai: 100000 },
  CA: { ds: 95000,  ml: 115000, da: 70000,  de: 100000, ai: 130000 },
  AU: { ds: 90000,  ml: 105000, da: 65000,  de: 95000,  ai: 120000 },
  SG: { ds: 80000,  ml: 95000,  da: 55000,  de: 85000,  ai: 110000 },
  GB: { ds: 72000,  ml: 85000,  da: 50000,  de: 78000,  ai: 95000  },
  BR: { ds: 25000,  ml: 30000,  da: 15000,  de: 27000,  ai: 35000  },
  MN: { ds: 8000,   ml: 10000,  da: 5000,   de: 9000,   ai: 12000  },
  PL: { ds: 35000,  ml: 42000,  da: 22000,  de: 38000,  ai: 50000  },
};

const TOP_SKILLS = [
  { skill: "Python",           demand: 94, avgSalaryBoost: 22 },
  { skill: "Machine Learning", demand: 88, avgSalaryBoost: 31 },
  { skill: "SQL",              demand: 82, avgSalaryBoost: 15 },
  { skill: "TensorFlow",       demand: 71, avgSalaryBoost: 28 },
  { skill: "Cloud (AWS/GCP)",  demand: 76, avgSalaryBoost: 25 },
  { skill: "Spark",            demand: 58, avgSalaryBoost: 20 },
  { skill: "R",                demand: 45, avgSalaryBoost: 10 },
  { skill: "NLP",              demand: 67, avgSalaryBoost: 33 },
];

const CAREER_CLUSTERS = [
  { id: 1, label: "Research Track",      color: "#f59e0b", countries: ["US","DE","GB"],    skills: ["Python","ML","Research"], avgExp: 6 },
  { id: 2, label: "Industry Applied",    color: "#34d399", countries: ["CA","AU","SG"],    skills: ["Python","Cloud","SQL"],   avgExp: 4 },
  { id: 3, label: "Emerging Markets",    color: "#60a5fa", countries: ["IN","BR","PL","CN"], skills: ["Python","SQL","BI"],    avgExp: 3 },
  { id: 4, label: "Early Career Global", color: "#f472b6", countries: ["MN","IN","BR"],    skills: ["Python","SQL","Excel"],   avgExp: 1 },
];

const BASE_BIGMAC_US = 5.58;
function pppAdjust(raw, bm) { return Math.round((raw * BASE_BIGMAC_US) / bm); }

// ── STYLES ────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=JetBrains+Mono:wght@300;400;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0b0f1a; --surface: #111827; --surface2: #1a2236; --border: #1f2d42;
    --amber: #f59e0b; --amber2: #fcd34d; --teal: #2dd4bf; --slate: #94a3b8;
    --text: #e2e8f0; --muted: #64748b; --danger: #f87171; --success: #34d399;
  }

  body { background: var(--bg); color: var(--text); font-family: 'JetBrains Mono', monospace; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  .nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(11,15,26,0.95); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0 2rem; display: flex; align-items: center; justify-content: space-between;
    height: 60px; gap: 1rem;
  }
  .nav-left { display: flex; align-items: center; gap: 1.25rem; }
  .nav-logo { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 900; color: var(--amber); letter-spacing: -0.02em; }
  .nav-logo span { color: var(--text); }
  .updated-badge { font-size: 0.6rem; padding: 2px 9px; border-radius: 20px; background: rgba(45,212,191,0.12); color: var(--teal); border: 1px solid rgba(45,212,191,0.3); white-space: nowrap; }
  .nav-tabs { display: flex; gap: 0; }
  .nav-tab { padding: 0 1.1rem; height: 60px; display: flex; align-items: center; font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; background: none; border-top: none; border-left: none; border-right: none; white-space: nowrap; }
  .nav-tab:hover { color: var(--text); }
  .nav-tab.active { color: var(--amber); border-bottom-color: var(--amber); }
  .nav-badge { background: var(--amber); color: var(--bg); font-size: 0.58rem; padding: 1px 5px; border-radius: 20px; margin-left: 5px; font-weight: 700; }
  .new-badge { background: var(--teal); color: #0b0f1a; font-size: 0.58rem; padding: 1px 5px; border-radius: 20px; margin-left: 5px; font-weight: 700; }

  .hero { padding: 5rem 2rem 4rem; max-width: 1100px; margin: 0 auto; width: 100%; position: relative; }
  .hero-eyebrow { font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--amber); margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.75rem; }
  .hero-eyebrow::before { content: ''; display: block; width: 32px; height: 1px; background: var(--amber); }
  .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(2.2rem, 4.5vw, 4rem); font-weight: 900; line-height: 1.05; margin-bottom: 1.25rem; }
  .hero-title em { font-style: italic; color: var(--amber); }
  .hero-sub { font-size: 0.88rem; color: var(--slate); max-width: 540px; line-height: 1.8; margin-bottom: 2.5rem; }
  .hero-stats { display: flex; gap: 2.5rem; flex-wrap: wrap; }
  .hero-stat-num { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; color: var(--amber); line-height: 1; }
  .hero-stat-label { font-size: 0.65rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; }
  .hero-grid-bg { position: absolute; top: 0; right: -2rem; width: 45%; height: 100%; background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 40px 40px; mask-image: radial-gradient(ellipse 80% 80% at 60% 40%, black 0%, transparent 70%); opacity: 0.35; }
  .hero-globe { position: absolute; right: 6%; top: 12%; width: 260px; height: 260px; border-radius: 50%; border: 1px solid var(--border); background: radial-gradient(circle at 35% 35%, #1a2a4a, #0b0f1a); display: flex; align-items: center; justify-content: center; font-size: 4.5rem; animation: float 6s ease-in-out infinite; }
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }

  .main { flex: 1; max-width: 1100px; margin: 0 auto; width: 100%; padding: 0 2rem 4rem; }
  .section-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 700; }
  .section-meta { font-size: 0.68rem; color: var(--muted); letter-spacing: 0.05em; }

  .controls { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .control-group { display: flex; flex-direction: column; gap: 0.4rem; flex: 1; min-width: 160px; }
  .control-label { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); }
  .control-select { background: var(--surface); border: 1px solid var(--border); color: var(--text); padding: 0.6rem 0.8rem; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; border-radius: 4px; cursor: pointer; outline: none; transition: border-color 0.2s; appearance: none; }
  .control-select:focus { border-color: var(--amber); }

  .toggle-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
  .toggle-label { font-size: 0.72rem; color: var(--slate); }
  .toggle { width: 44px; height: 24px; border-radius: 12px; background: var(--border); cursor: pointer; position: relative; transition: background 0.2s; border: none; flex-shrink: 0; }
  .toggle.on { background: var(--amber); }
  .toggle::after { content: ''; position: absolute; width: 18px; height: 18px; border-radius: 50%; background: var(--bg); top: 3px; left: 3px; transition: transform 0.2s; }
  .toggle.on::after { transform: translateX(20px); }
  .ppp-badge { font-size: 0.62rem; padding: 2px 9px; border-radius: 20px; background: rgba(245,158,11,0.15); color: var(--amber); border: 1px solid rgba(245,158,11,0.3); }

  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
  .card-title { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); margin-bottom: 1.1rem; }

  .compare-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(185px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
  .country-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.1rem; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; }
  .country-card:hover, .country-card.selected { border-color: var(--amber); box-shadow: 0 0 18px rgba(245,158,11,0.1); }
  .country-card.selected::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--amber); }
  .country-card.china { border-left: 3px solid #ef4444; }
  .country-flag { font-size: 1.7rem; margin-bottom: 0.4rem; }
  .country-name { font-size: 0.8rem; font-weight: 600; margin-bottom: 0.2rem; }
  .country-region { font-size: 0.62rem; color: var(--muted); margin-bottom: 0.65rem; }
  .salary-raw { font-size: 0.68rem; color: var(--slate); }
  .salary-ppp { font-family: 'Playfair Display', serif; font-size: 1.25rem; color: var(--amber); font-weight: 700; margin-top: 2px; }
  .salary-tag { font-size: 0.58rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-top: 3px; }
  .new-country-badge { font-size: 0.54rem; padding: 1px 6px; border-radius: 10px; background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.3); display: inline-block; margin-bottom: 4px; }

  .insight-box { background: rgba(245,158,11,0.05); border: 1px solid rgba(245,158,11,0.2); border-radius: 8px; padding: 1.1rem 1.25rem; margin-bottom: 1.75rem; display: flex; gap: 1rem; align-items: flex-start; }
  .insight-icon { font-size: 1.3rem; flex-shrink: 0; }
  .insight-text { font-size: 0.8rem; color: var(--slate); line-height: 1.7; }
  .insight-text strong { color: var(--amber); }

  /* CHART */
  .bar-chart { display: flex; align-items: flex-end; gap: 10px; height: 240px; padding-bottom: 28px; }
  .bar-col { display: flex; flex-direction: column; align-items: center; gap: 3px; flex: 1; height: 100%; justify-content: flex-end; }
  .bar-rect { width: 100%; border-radius: 3px 3px 0 0; transition: height 0.4s ease; min-height: 4px; }
  .bar-val { font-size: 0.6rem; color: var(--text); }
  .bar-lbl { font-size: 0.6rem; color: var(--muted); text-align: center; white-space: nowrap; }

  /* SKILLS */
  .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  @media (max-width: 600px) { .skills-grid { grid-template-columns: 1fr; } }
  .skill-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 0; border-bottom: 1px solid var(--border); }
  .skill-name { font-size: 0.75rem; min-width: 130px; }
  .skill-bar-bg { flex: 1; height: 4px; background: var(--border); border-radius: 2px; }
  .skill-bar { height: 4px; background: var(--amber); border-radius: 2px; }
  .skill-pct { font-size: 0.68rem; color: var(--muted); min-width: 34px; text-align: right; }
  .skill-boost { font-size: 0.62rem; padding: 2px 7px; border-radius: 12px; background: rgba(52,211,153,0.12); color: var(--success); min-width: 48px; text-align: center; }

  /* CLUSTERS */
  .cluster-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 1rem; }
  .cluster-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.1rem; border-left: 3px solid var(--c, #f59e0b); }
  .cluster-label { font-weight: 600; font-size: 0.82rem; margin-bottom: 0.4rem; }
  .cluster-countries { font-size: 0.68rem; color: var(--muted); margin-bottom: 0.4rem; }
  .cluster-skills { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.4rem; }
  .skill-chip { font-size: 0.6rem; padding: 2px 7px; border-radius: 12px; background: var(--surface2); color: var(--slate); border: 1px solid var(--border); }

  /* PROFILE / CV */
  .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  @media (max-width: 650px) { .profile-grid { grid-template-columns: 1fr; } }
  .cv-textarea { width: 100%; min-height: 240px; background: var(--surface2); border: 1px solid var(--border); color: var(--text); font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; padding: 0.85rem; border-radius: 4px; resize: vertical; outline: none; line-height: 1.6; transition: border-color 0.2s; }
  .cv-textarea:focus { border-color: var(--amber); }
  .cv-textarea::placeholder { color: var(--muted); }
  .analyze-btn { width: 100%; margin-top: 0.75rem; padding: 0.75rem; background: var(--amber); color: var(--bg); font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; font-weight: 600; border: none; border-radius: 4px; cursor: pointer; transition: all 0.2s; letter-spacing: 0.08em; text-transform: uppercase; }
  .analyze-btn:hover { background: var(--amber2); }
  .analyze-btn:disabled { background: var(--border); color: var(--muted); cursor: not-allowed; }
  .result-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.1rem; margin-bottom: 0.85rem; }
  .result-label { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); margin-bottom: 0.6rem; }
  .result-value { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: var(--amber); font-weight: 700; }
  .result-body { font-size: 0.76rem; color: var(--slate); line-height: 1.75; white-space: pre-wrap; }
  .score-row { display: flex; align-items: center; gap: 1rem; }
  .score-num { font-family: 'Playfair Display', serif; font-size: 2.4rem; color: var(--amber); font-weight: 700; }
  .loading-dots { display: flex; gap: 5px; align-items: center; justify-content: center; padding: 1.5rem 0; }
  .loading-dots span { width: 7px; height: 7px; border-radius: 50%; background: var(--amber); animation: dot 1.2s infinite; }
  .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes dot { 0%,80%,100% { transform: scale(0.5); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
  .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 280px; gap: 1rem; color: var(--muted); font-size: 0.8rem; text-align: center; }
  .empty-icon { font-size: 2.5rem; }

  /* ABOUT */
  .about-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
  @media (max-width: 600px) { .about-grid { grid-template-columns: 1fr; } }
  .about-text { font-size: 0.84rem; color: var(--slate); line-height: 1.9; }
  .about-text h3 { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: var(--text); margin-bottom: 0.65rem; margin-top: 1.25rem; }
  .about-text h3:first-child { margin-top: 0; }
  .about-text p { margin-bottom: 0.85rem; }
  .data-sources { list-style: none; }
  .data-sources li { font-size: 0.7rem; padding: 0.55rem 0; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 0.5rem; color: var(--slate); }
  .data-sources li::before { content: '▸'; color: var(--amber); font-size: 0.58rem; }

  .footer { border-top: 1px solid var(--border); padding: 1.5rem 2rem; text-align: center; font-size: 0.65rem; color: var(--muted); letter-spacing: 0.05em; }
  .fade-in { animation: fadeIn 0.35s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
`;

// ── PAGES ─────────────────────────────────────────────────────────────────────

function HomePage({ setPage }) {
  return (
    <div>
      <div className="hero">
        <div className="hero-grid-bg" />
        <div className="hero-globe">🌏</div>
        <div className="hero-eyebrow">Capstone Project · AUM · 2025</div>
        <h1 className="hero-title">Global Data Science<br /><em>Career Path Analyzer</em></h1>
        <p className="hero-sub">
          Raw salaries lie. A $130K offer in San Francisco and a $10K offer in Ulaanbaatar
          may represent similar purchasing power. This tool shows the real picture —
          adjusted for what money actually buys where you live.
        </p>
        <div className="hero-stats">
          <div><div className="hero-stat-num">376K+</div><div className="hero-stat-label">Survey Responses</div></div>
          <div><div className="hero-stat-num">11</div><div className="hero-stat-label">Countries</div></div>
          <div><div className="hero-stat-num">5</div><div className="hero-stat-label">Career Roles</div></div>
          <div><div className="hero-stat-num">PPP</div><div className="hero-stat-label">Adjusted Salaries</div></div>
        </div>
      </div>
      <div className="main">
        <div className="insight-box">
          <div className="insight-icon">💡</div>
          <div className="insight-text">
            <strong>Key Finding:</strong> The raw US–India salary gap for Data Scientists appears to be ~12×.
            After Big Mac Index PPP adjustment, that gap narrows to roughly <strong>5–6×</strong> —
            a dramatically different story for international career planning.
            <strong> New: China added</strong> using BOSS直聘 data.
          </div>
        </div>
        <div className="compare-grid">
          {COUNTRIES.slice(0, 6).map(c => {
            const raw = SALARY[c.code].ds;
            const adj = pppAdjust(raw, c.bigMac);
            return (
              <div key={c.code} className={`country-card ${c.isNew ? "china" : ""}`} onClick={() => setPage("explorer")}>
                {c.isNew && <div className="new-country-badge">NEW · BOSS直聘</div>}
                <div className="country-flag">{c.flag}</div>
                <div className="country-name">{c.name}</div>
                <div className="country-region">{c.region}</div>
                <div className="salary-raw">${raw.toLocaleString()} raw</div>
                <div className="salary-ppp">${adj.toLocaleString()}</div>
                <div className="salary-tag">PPP-adjusted · Data Scientist</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ExplorerPage() {
  const [role, setRole] = useState("ds");
  const [ppp, setPpp] = useState(true);
  const [selected, setSelected] = useState(["US", "CN", "IN", "DE", "CA", "SG"]);

  const toggle = (code) => setSelected(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);

  const chartData = COUNTRIES
    .filter(c => selected.includes(c.code))
    .map(c => ({ ...c, value: ppp ? pppAdjust(SALARY[c.code][role], c.bigMac) : SALARY[c.code][role] }))
    .sort((a, b) => b.value - a.value);

  const maxVal = Math.max(...chartData.map(d => d.value), 1);
  const rawGap = (SALARY.US[role] / SALARY.IN[role]).toFixed(1);
  const adjGap = (pppAdjust(SALARY.US[role], 5.58) / pppAdjust(SALARY.IN[role], 2.54)).toFixed(1);

  return (
    <div className="main fade-in">
      <div className="section-header">
        <h2 className="section-title">Salary Explorer</h2>
        <span className="section-meta">Source: Stack Overflow + Kaggle + BOSS直聘 · Big Mac Index PPP</span>
      </div>
      <div className="controls">
        <div className="control-group">
          <label className="control-label">Role</label>
          <select className="control-select" value={role} onChange={e => setRole(e.target.value)}>
            {ROLES.map(r => <option key={r.id} value={r.id}>{r.icon} {r.title}</option>)}
          </select>
        </div>
      </div>
      <div className="toggle-row">
        <button className={`toggle ${ppp ? "on" : ""}`} onClick={() => setPpp(!ppp)} />
        <span className="toggle-label">PPP Adjustment (Big Mac Index)</span>
        {ppp && <span className="ppp-badge">ACTIVE</span>}
      </div>
      <div className="card">
        <div className="card-title">Annual Salary — {ROLES.find(r => r.id === role)?.title} · {ppp ? "PPP-Adjusted USD" : "Raw USD"}</div>
        <div className="bar-chart">
          {chartData.map((d, i) => {
            const h = Math.max(4, Math.round((d.value / maxVal) * 180));
            const color = i === 0 ? "#f59e0b" : d.code === "CN" ? "#ef4444" : "#1f2d42";
            return (
              <div key={d.code} className="bar-col">
                <div className="bar-val">${Math.round(d.value / 1000)}k</div>
                <div className="bar-rect" style={{ height: h, background: color }} />
                <div className="bar-lbl">{d.flag} {d.code}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="insight-box">
        <div className="insight-icon">📊</div>
        <div className="insight-text">
          US vs India raw gap: <strong>{rawGap}×</strong>. After PPP adjustment: <strong>{adjGap}×</strong>.
          Toggle PPP to see both perspectives.
        </div>
      </div>
      <div className="section-header" style={{ marginTop: "1.5rem" }}>
        <h2 className="section-title" style={{ fontSize: "1.05rem" }}>Select Countries to Compare</h2>
      </div>
      <div className="compare-grid">
        {COUNTRIES.map(c => {
          const raw = SALARY[c.code][role];
          const adj = pppAdjust(raw, c.bigMac);
          return (
            <div key={c.code} className={`country-card ${selected.includes(c.code) ? "selected" : ""} ${c.isNew ? "china" : ""}`} onClick={() => toggle(c.code)}>
              {c.isNew && <div className="new-country-badge">NEW</div>}
              <div className="country-flag">{c.flag}</div>
              <div className="country-name">{c.name}</div>
              <div className="country-region">{c.region}</div>
              <div className="salary-raw">${raw.toLocaleString()} raw</div>
              <div className="salary-ppp">${(ppp ? adj : raw).toLocaleString()}</div>
              <div className="salary-tag">{ppp ? "PPP-adjusted" : "Raw"} USD</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SkillsPage() {
  const byDemand = [...TOP_SKILLS].sort((a, b) => b.demand - a.demand);
  const byBoost = [...TOP_SKILLS].sort((a, b) => b.avgSalaryBoost - a.avgSalaryBoost);
  return (
    <div className="main fade-in">
      <div className="section-header">
        <h2 className="section-title">Skills in Demand</h2>
        <span className="section-meta">Source: Stack Overflow Developer Survey · NLP extraction</span>
      </div>
      <div className="insight-box">
        <div className="insight-icon">🔬</div>
        <div className="insight-text">Skills extracted from 376K+ survey responses. Salary boost = average premium for professionals listing that skill vs those who don't, within the same role.</div>
      </div>
      <div className="skills-grid">
        <div className="card">
          <div className="card-title">Demand by Skill (% of job postings)</div>
          {byDemand.map(s => (
            <div key={s.skill} className="skill-row">
              <span className="skill-name">{s.skill}</span>
              <div className="skill-bar-bg"><div className="skill-bar" style={{ width: `${s.demand}%` }} /></div>
              <span className="skill-pct">{s.demand}%</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">Salary Boost by Skill</div>
          {byBoost.map(s => (
            <div key={s.skill} className="skill-row">
              <span className="skill-name">{s.skill}</span>
              <div className="skill-bar-bg"><div className="skill-bar" style={{ width: `${s.avgSalaryBoost * 2.8}%`, background: "#34d399" }} /></div>
              <span className="skill-boost">+{s.avgSalaryBoost}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClustersPage() {
  return (
    <div className="main fade-in">
      <div className="section-header">
        <h2 className="section-title">Career Path Clusters</h2>
        <span className="section-meta">K-Means Clustering · 4 clusters identified</span>
      </div>
      <div className="insight-box">
        <div className="insight-icon">🧩</div>
        <div className="insight-text">
          K-means clustering on experience, salary, skills, and geography identified <strong>4 distinct career archetypes</strong>.
          China is now included in Emerging Markets based on BOSS直聘 data.
        </div>
      </div>
      <div className="cluster-list">
        {CAREER_CLUSTERS.map(cl => (
          <div key={cl.id} className="cluster-card" style={{ "--c": cl.color }}>
            <div className="cluster-label" style={{ color: cl.color }}>{cl.label}</div>
            <div className="cluster-countries">
              {cl.countries.map(c => { const x = COUNTRIES.find(cc => cc.code === c); return x ? `${x.flag} ${x.name}` : c; }).join(" · ")}
            </div>
            <div style={{ fontSize: "0.68rem", color: "#64748b" }}>Avg. {cl.avgExp} yrs experience</div>
            <div className="cluster-skills">
              {cl.skills.map(s => <span key={s} className="skill-chip">{s}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfilePage() {
  const [cvText, setCvText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function runAnalysis() {
    if (!cvText || cvText.trim().length < 20) {
      alert("Please paste your CV or skills summary first.");
      return;
    }
    setAnalyzing(true);
    setResult(null);
    setError(null);

    const prompt = `You are a global data science career advisor with expertise in PPP-adjusted salary analysis across 11 countries: US, China, India, Germany, Canada, Australia, Singapore, UK, Brazil, Mongolia, and Poland.

Analyze this CV/skills summary and respond ONLY with a valid JSON object — no markdown, no extra text:
{
  "cluster": "one of: Research Track | Industry Applied | Emerging Markets | Early Career Global",
  "score": <integer 1-10>,
  "scoreNote": "<short explanation under 15 words>",
  "countries": "<3 recommended countries, one sentence each on PPP opportunity>",
  "gaps": "<3 specific skills to develop, one sentence each on why>"
}

CV/Skills Summary:
${cvText.slice(0, 1500)}`;

    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await resp.json();
      const text = data.content?.map(b => b.text || "").join("").trim();
      const clean = text.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(clean));
    } catch (e) {
      setError("Analysis failed. Check your API key or try again.");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="main fade-in">
      <div className="section-header">
        <h2 className="section-title">My Profile</h2>
        <span className="section-meta">Powered by Claude AI · Career Match Analysis</span>
      </div>
      <div className="insight-box">
        <div className="insight-icon">🤖</div>
        <div className="insight-text">
          Paste your CV or skills summary. Claude AI will identify your <strong>career cluster match</strong>,
          recommend <strong>countries by PPP opportunity</strong>, flag <strong>skill gaps</strong>,
          and give you a global <strong>marketability score</strong>.
        </div>
      </div>
      <div className="profile-grid">
        <div className="card">
          <div className="card-title">Your CV / Skills Summary</div>
          <textarea
            className="cv-textarea"
            placeholder={"Paste your CV, resume, or skills summary here...\n\nExample:\nI am a data science student at AUM with experience in Python, SQL, and machine learning. I have worked on NLP and predictive modeling projects and I am interested in Asia-Pacific markets..."}
            value={cvText}
            onChange={e => setCvText(e.target.value)}
          />
          <button className="analyze-btn" onClick={runAnalysis} disabled={analyzing}>
            {analyzing ? "Analyzing..." : "◉ Analyze My Profile"}
          </button>
          {analyzing && <div className="loading-dots"><span /><span /><span /></div>}
          {error && <div style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "0.75rem" }}>{error}</div>}
        </div>

        <div>
          {!result && !analyzing && (
            <div className="card">
              <div className="empty-state">
                <div className="empty-icon">◉</div>
                <div>Paste your CV on the left<br />and click Analyze to get<br />your personalized career report</div>
              </div>
            </div>
          )}
          {result && (
            <>
              <div className="result-card">
                <div className="result-label">Career Cluster Match</div>
                <div className="result-value">{result.cluster}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Marketability Score</div>
                <div className="score-row">
                  <div className="score-num">{result.score}<span style={{ fontSize: "1rem", color: "var(--muted)" }}>/10</span></div>
                  <div>
                    <div style={{ fontSize: "0.76rem", color: "var(--slate)" }}>{result.scoreNote}</div>
                    <div style={{ fontSize: "0.62rem", color: "var(--muted)", marginTop: "3px" }}>Global Data Science Market</div>
                  </div>
                </div>
              </div>
              <div className="result-card">
                <div className="result-label">Recommended Countries (PPP)</div>
                <div className="result-body">{result.countries}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Skill Gaps to Address</div>
                <div className="result-body">{result.gaps}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="main fade-in">
      <div className="section-header">
        <h2 className="section-title">About This Project</h2>
        <span className="section-meta">AUM Capstone · Data Science · Spring 2025</span>
      </div>
      <div className="about-grid">
        <div className="about-text">
          <h3>The Problem</h3>
          <p>Most career tools are built for US users and display raw USD salaries. For international students and job seekers, this creates a distorted picture. A $130,000 offer in San Francisco may feel life-changing, but after rent, taxes, and cost of living it delivers less purchasing power than expected. A $10,000 offer in Ulaanbaatar might go much further than it seems.</p>
          <h3>The Method</h3>
          <p>This tool uses the Big Mac Index as a Purchasing Power Parity (PPP) proxy, developed by The Economist. By normalizing salaries against local Big Mac prices relative to the US baseline, we get an apples-to-apples comparison of real earning power.</p>
          <h3>China Data (New · Apr 2025)</h3>
          <p>China was added using BOSS直聘 (China's largest job platform) and the TeamedUp China data science salary study. Big Mac price sourced from The Economist Index. China's tech hubs (Beijing, Shanghai, Shenzhen) show strong ML/AI compensation that competes globally on a PPP basis.</p>
          <h3>Mongolia Note</h3>
          <p>Mongolia has no McDonald's, so its Big Mac price is estimated/modeled by The Economist. This limitation is documented and affects PPP precision for Mongolian salary figures.</p>
        </div>
        <div>
          <div className="card">
            <div className="card-title">Data Sources</div>
            <ul className="data-sources">
              <li>Stack Overflow Developer Survey (2020–2024)</li>
              <li>Kaggle DS/ML Salary Dataset</li>
              <li>LinkedIn Job Postings Data</li>
              <li>BOSS直聘 · China salary data (NEW)</li>
              <li>TeamedUp China DS Study (NEW)</li>
              <li>The Economist Big Mac Index</li>
              <li>World Bank PPP Indicators</li>
            </ul>
          </div>
          <div className="card" style={{ marginTop: "1rem" }}>
            <div className="card-title">Tech Stack</div>
            <ul className="data-sources">
              <li>Python · Pandas · Scikit-learn</li>
              <li>React · Vite</li>
              <li>Claude API (AI Profile Analysis)</li>
              <li>K-Means Clustering</li>
              <li>NLP: Skill Extraction</li>
              <li>Vercel Deployment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");

  const pages = [
    { id: "home",     label: "Home" },
    { id: "explorer", label: "Explorer", badge: "PPP" },
    { id: "skills",   label: "Skills" },
    { id: "clusters", label: "Clusters" },
    { id: "profile",  label: "My Profile", newBadge: "AI" },
    { id: "about",    label: "About" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-left">
            <div className="nav-logo">Career<span>Atlas</span></div>
            <div className="updated-badge">↻ Updated Apr 2025 · China added</div>
          </div>
          <div className="nav-tabs">
            {pages.map(p => (
              <button key={p.id} className={`nav-tab ${page === p.id ? "active" : ""}`} onClick={() => setPage(p.id)}>
                {p.label}
                {p.badge && <span className="nav-badge">{p.badge}</span>}
                {p.newBadge && <span className="new-badge">{p.newBadge}</span>}
              </button>
            ))}
          </div>
        </nav>

        {page === "home"     && <HomePage setPage={setPage} />}
        {page === "explorer" && <ExplorerPage />}
        {page === "skills"   && <SkillsPage />}
        {page === "clusters" && <ClustersPage />}
        {page === "profile"  && <ProfilePage />}
        {page === "about"    && <AboutPage />}

        <footer className="footer">
          CareerAtlas · AUM Capstone 2025 · Stack Overflow Survey + Big Mac Index PPP · v2.1 — China (BOSS直聘) + AI CV Analyzer added
        </footer>
      </div>
    </>
  );
}
