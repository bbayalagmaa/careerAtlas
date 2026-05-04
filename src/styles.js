const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=JetBrains+Mono:wght@300;400;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0b0f1a; --surface: #111827; --surface2: #1a2236;
    --border: #1f2d42; --amber: #f59e0b; --amber2: #fcd34d;
    --teal: #2dd4bf; --slate: #94a3b8; --text: #e2e8f0;
    --muted: #64748b; --danger: #f87171; --success: #34d399;
  }
  body { background: var(--bg); color: var(--text); font-family: 'JetBrains Mono', monospace; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* NAV */
  .nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(11,15,26,0.95); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; height: 60px;
  }
  .nav-logo { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 900; color: var(--amber); letter-spacing: -0.02em; cursor: pointer; }
  .nav-logo span { color: var(--text); }
  .nav-tabs { display: flex; gap: 0; }
  .nav-tab {
    padding: 0 1.1rem; height: 60px; display: flex; align-items: center;
    font-size: 0.7rem; letter-spacing: 0.07em; text-transform: uppercase;
    color: var(--muted); cursor: pointer; border-bottom: 2px solid transparent;
    transition: all 0.2s; background: none; border-top: none; border-left: none; border-right: none;
  }
  .nav-tab:hover { color: var(--text); }
  .nav-tab.active { color: var(--amber); border-bottom-color: var(--amber); }
  .nav-badge { background: var(--amber); color: var(--bg); font-size: 0.58rem; padding: 1px 5px; border-radius: 20px; margin-left: 5px; font-weight: 700; }
  .nav-badge.new { background: var(--success); }

  /* HERO */
  .hero { padding: 5rem 2rem 4rem; max-width: 1100px; margin: 0 auto; width: 100%; position: relative; overflow: hidden; }
  .hero-eyebrow { font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--amber); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem; }
  .hero-eyebrow::before { content: ''; display: block; width: 32px; height: 1px; background: var(--amber); }
  .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(2.2rem, 4.5vw, 4rem); font-weight: 900; line-height: 1.05; margin-bottom: 1.5rem; }
  .hero-title em { font-style: italic; color: var(--amber); }
  .hero-sub { font-size: 0.88rem; color: var(--slate); max-width: 540px; line-height: 1.8; margin-bottom: 2.5rem; }
  .hero-stats { display: flex; gap: 3rem; flex-wrap: wrap; }
  .hero-stat-num { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; color: var(--amber); line-height: 1; }
  .hero-stat-label { font-size: 0.65rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; }
  .hero-grid-bg { position: absolute; top: 0; right: -2rem; width: 45%; height: 100%; background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 40px 40px; mask-image: radial-gradient(ellipse 80% 80% at 60% 40%, black 0%, transparent 70%); opacity: 0.4; pointer-events: none; }
  .hero-globe { position: absolute; right: 6%; top: 10%; width: 260px; height: 260px; border-radius: 50%; border: 1px solid var(--border); background: radial-gradient(circle at 35% 35%, #1a2a4a, #0b0f1a); box-shadow: 0 0 80px rgba(245,158,11,0.08); display: flex; align-items: center; justify-content: center; font-size: 5rem; animation: float 6s ease-in-out infinite; }
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }

  /* MAIN */
  .main { flex: 1; max-width: 1100px; margin: 0 auto; width: 100%; padding: 0 2rem 4rem; }
  .section-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 700; }
  .section-meta { font-size: 0.7rem; color: var(--muted); letter-spacing: 0.05em; }

  /* CONTROLS */
  .controls { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .control-group { display: flex; flex-direction: column; gap: 0.4rem; flex: 1; min-width: 160px; }
  .control-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); }
  .control-select { background: var(--surface); border: 1px solid var(--border); color: var(--text); padding: 0.6rem 0.8rem; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; border-radius: 4px; cursor: pointer; outline: none; transition: border-color 0.2s; appearance: none; }
  .control-select:focus { border-color: var(--amber); }

  /* TOGGLE */
  .toggle-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .toggle-label { font-size: 0.72rem; color: var(--slate); }
  .toggle { width: 44px; height: 24px; border-radius: 12px; background: var(--border); cursor: pointer; position: relative; transition: background 0.2s; border: none; flex-shrink: 0; }
  .toggle.on { background: var(--amber); }
  .toggle::after { content: ''; position: absolute; width: 18px; height: 18px; border-radius: 50%; background: var(--bg); top: 3px; left: 3px; transition: transform 0.2s; }
  .toggle.on::after { transform: translateX(20px); }
  .ppp-badge { font-size: 0.65rem; padding: 3px 10px; border-radius: 20px; background: rgba(245,158,11,0.15); color: var(--amber); border: 1px solid rgba(245,158,11,0.3); letter-spacing: 0.05em; }

  /* CARDS */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
  .card-title { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); margin-bottom: 1.25rem; }

  /* COUNTRY GRID */
  .compare-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(175px, 1fr)); gap: 0.75rem; margin-bottom: 2rem; }
  .country-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; }
  .country-card:hover { border-color: rgba(245,158,11,0.5); transform: translateY(-2px); }
  .country-card.selected { border-color: var(--amber); box-shadow: 0 0 20px rgba(245,158,11,0.1); }
  .country-card.selected::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--amber); }
  .country-flag { font-size: 1.5rem; margin-bottom: 0.4rem; }
  .country-name { font-size: 0.75rem; font-weight: 600; margin-bottom: 0.2rem; }
  .country-region { font-size: 0.6rem; color: var(--muted); margin-bottom: 0.6rem; }
  .salary-raw { font-size: 0.65rem; color: var(--muted); }
  .salary-ppp { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: var(--amber); font-weight: 700; margin-top: 2px; }
  .salary-tag { font-size: 0.58rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-top: 2px; }
  .check-mark { position: absolute; top: 8px; right: 8px; width: 18px; height: 18px; border-radius: 50%; background: var(--amber); color: var(--bg); font-size: 0.65rem; display: flex; align-items: center; justify-content: center; font-weight: 700; opacity: 0; transition: opacity 0.2s; }
  .country-card.selected .check-mark { opacity: 1; }

  /* INSIGHT */
  .insight-box { background: rgba(245,158,11,0.05); border: 1px solid rgba(245,158,11,0.2); border-radius: 8px; padding: 1.25rem 1.5rem; margin-bottom: 1.5rem; display: flex; gap: 1rem; align-items: flex-start; }
  .insight-icon { font-size: 1.3rem; flex-shrink: 0; }
  .insight-text { font-size: 0.8rem; color: var(--slate); line-height: 1.7; }
  .insight-text strong { color: var(--amber); }

  /* SPOTLIGHT */
  .spotlight-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
  .spotlight-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.1rem; text-align: center; }
  .spotlight-label { font-size: 0.62rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.4rem; }
  .spotlight-value { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--amber); font-weight: 700; }
  .spotlight-sub { font-size: 0.65rem; color: var(--muted); margin-top: 3px; }

  /* GAP METER */
  .gap-meter { margin: 1rem 0; }
  .gap-label { font-size: 0.68rem; color: var(--slate); margin-bottom: 0.5rem; display: flex; justify-content: space-between; }
  .gap-track { height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
  .gap-fill { height: 100%; border-radius: 4px; transition: width 0.8s cubic-bezier(0.23, 1, 0.32, 1); }

  /* SKILLS */
  .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  .skill-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 0; border-bottom: 1px solid var(--border); }
  .skill-name { font-size: 0.78rem; min-width: 130px; }
  .skill-bar-bg { flex: 1; height: 4px; background: var(--border); border-radius: 2px; }
  .skill-bar { height: 4px; border-radius: 2px; transition: width 0.6s ease; }
  .skill-pct { font-size: 0.68rem; color: var(--muted); min-width: 32px; text-align: right; }
  .skill-boost { font-size: 0.62rem; padding: 2px 7px; border-radius: 12px; background: rgba(52,211,153,0.12); color: var(--success); min-width: 48px; text-align: center; }
  .skill-cat { font-size: 0.58rem; padding: 1px 6px; border-radius: 10px; background: var(--surface2); color: var(--muted); border: 1px solid var(--border); }
  .filter-chips { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
  .chip { font-size: 0.65rem; padding: 4px 12px; border-radius: 20px; border: 1px solid var(--border); color: var(--muted); cursor: pointer; transition: all 0.15s; background: var(--surface); }
  .chip:hover { border-color: var(--amber); color: var(--text); }
  .chip.active { background: rgba(245,158,11,0.15); border-color: var(--amber); color: var(--amber); }

  /* CLUSTERS */
  .cluster-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px,1fr)); gap: 1rem; margin-bottom: 1.5rem; }
  .cluster-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; border-left: 3px solid var(--c, #f59e0b); cursor: pointer; transition: all 0.2s; }
  .cluster-card:hover, .cluster-card.active { box-shadow: 0 0 20px rgba(0,0,0,0.3); transform: translateY(-2px); }
  .cluster-label { font-weight: 600; font-size: 0.85rem; margin-bottom: 0.4rem; }
  .cluster-countries { font-size: 0.68rem; color: var(--muted); margin-bottom: 0.4rem; }
  .cluster-ppp { font-family: 'Playfair Display', serif; font-size: 1.1rem; margin-bottom: 0.5rem; }
  .cluster-skills { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.5rem; }
  .skill-chip { font-size: 0.6rem; padding: 2px 8px; border-radius: 12px; background: var(--surface2); color: var(--slate); border: 1px solid var(--border); }

  /* QUIZ */
  .quiz-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 2rem; margin-bottom: 1.5rem; }
  .quiz-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; margin-bottom: 0.5rem; }
  .quiz-sub { font-size: 0.78rem; color: var(--muted); margin-bottom: 1.5rem; }
  .quiz-options { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .quiz-option { padding: 0.8rem 1rem; border: 1px solid var(--border); border-radius: 6px; cursor: pointer; transition: all 0.15s; font-size: 0.78rem; color: var(--slate); background: var(--surface2); text-align: left; }
  .quiz-option:hover { border-color: var(--amber); color: var(--text); }
  .quiz-option.selected { border-color: var(--amber); background: rgba(245,158,11,0.1); color: var(--amber); }
  .quiz-btn { margin-top: 1.5rem; padding: 0.75rem 2rem; background: var(--amber); color: var(--bg); border: none; font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; font-weight: 600; border-radius: 4px; cursor: pointer; letter-spacing: 0.05em; transition: opacity 0.2s; }
  .quiz-btn:hover { opacity: 0.85; }
  .quiz-result { border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-top: 1rem; background: var(--surface2); animation: fadeIn 0.4s ease; }

  /* CV ANALYZER */
  .cv-page { padding-bottom: 4rem; }
  .cv-upload-zone {
    border: 2px dashed var(--border); border-radius: 12px;
    padding: 3rem 2rem; text-align: center;
    transition: all 0.25s; cursor: pointer; position: relative;
    background: var(--surface);
  }
  .cv-upload-zone:hover, .cv-upload-zone.drag-over {
    border-color: var(--amber);
    background: rgba(245,158,11,0.04);
  }
  .cv-upload-zone input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .cv-upload-icon { font-size: 2.5rem; margin-bottom: 1rem; }
  .cv-upload-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; margin-bottom: 0.5rem; }
  .cv-upload-sub { font-size: 0.78rem; color: var(--muted); line-height: 1.6; }
  .cv-upload-formats { display: flex; gap: 0.5rem; justify-content: center; margin-top: 1rem; }
  .format-badge { font-size: 0.62rem; padding: 3px 10px; border-radius: 20px; background: var(--surface2); border: 1px solid var(--border); color: var(--muted); }
  .cv-tabs { display: flex; gap: 0; border-bottom: 1px solid var(--border); margin-bottom: 1.5rem; }
  .cv-tab { padding: 0.75rem 1.25rem; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; background: none; border-top: none; border-left: none; border-right: none; }
  .cv-tab:hover { color: var(--text); }
  .cv-tab.active { color: var(--amber); border-bottom-color: var(--amber); }
  .cv-textarea {
    width: 100%; min-height: 200px; background: var(--surface);
    border: 1px solid var(--border); border-radius: 8px;
    color: var(--text); font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem; padding: 1rem; resize: vertical; outline: none;
    line-height: 1.7; transition: border-color 0.2s;
  }
  .cv-textarea:focus { border-color: var(--amber); }
  .cv-textarea::placeholder { color: var(--muted); }
  .analyze-btn {
    width: 100%; padding: 1rem; margin-top: 1rem;
    background: linear-gradient(135deg, var(--amber), #d97706);
    color: var(--bg); border: none; border-radius: 8px;
    font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 700;
    cursor: pointer; transition: all 0.2s; letter-spacing: 0.02em;
    display: flex; align-items: center; justify-content: center; gap: 0.75rem;
  }
  .analyze-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(245,158,11,0.25); }
  .analyze-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

  /* LOADING */
  .analyzing-state { text-align: center; padding: 4rem 2rem; }
  .analyzing-spinner {
    width: 56px; height: 56px; border-radius: 50%;
    border: 3px solid var(--border); border-top-color: var(--amber);
    animation: spin 0.9s linear infinite; margin: 0 auto 1.5rem;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .analyzing-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; margin-bottom: 0.5rem; }
  .analyzing-sub { font-size: 0.78rem; color: var(--muted); }
  .analyzing-steps { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1.5rem; align-items: center; }
  .analyzing-step { font-size: 0.72rem; color: var(--muted); display: flex; align-items: center; gap: 0.5rem; }
  .analyzing-step.done { color: var(--success); }
  .analyzing-step.active { color: var(--amber); }

  /* RESULTS */
  .results-header {
    background: linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.02));
    border: 1px solid rgba(245,158,11,0.25); border-radius: 12px;
    padding: 2rem; margin-bottom: 2rem;
    display: grid; grid-template-columns: 1fr auto; gap: 2rem; align-items: start;
  }
  .results-name { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 900; margin-bottom: 0.25rem; }
  .results-role { font-size: 0.85rem; color: var(--amber); margin-bottom: 0.5rem; }
  .results-exp { font-size: 0.72rem; color: var(--muted); }
  .results-score {
    text-align: center; background: var(--surface);
    border: 1px solid var(--border); border-radius: 8px; padding: 1rem 1.5rem;
  }
  .results-score-num { font-family: 'Playfair Display', serif; font-size: 2.2rem; color: var(--amber); font-weight: 900; line-height: 1; }
  .results-score-label { font-size: 0.62rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; }
  .results-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
  .found-skills { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.75rem; }
  .found-skill {
    font-size: 0.68rem; padding: 4px 10px; border-radius: 20px;
    background: rgba(52,211,153,0.12); color: var(--success);
    border: 1px solid rgba(52,211,153,0.25);
  }
  .missing-skill {
    font-size: 0.68rem; padding: 4px 10px; border-radius: 20px;
    background: rgba(248,113,113,0.1); color: var(--danger);
    border: 1px solid rgba(248,113,113,0.2);
  }
  .country-rec {
    display: flex; align-items: center; gap: 1rem;
    padding: 0.85rem; border: 1px solid var(--border); border-radius: 8px;
    margin-bottom: 0.75rem; background: var(--surface2); transition: all 0.2s;
  }
  .country-rec:hover { border-color: rgba(245,158,11,0.3); }
  .country-rec-flag { font-size: 1.6rem; }
  .country-rec-info { flex: 1; }
  .country-rec-name { font-size: 0.82rem; font-weight: 600; margin-bottom: 2px; }
  .country-rec-reason { font-size: 0.68rem; color: var(--muted); }
  .country-rec-salary { text-align: right; }
  .country-rec-raw { font-size: 0.65rem; color: var(--muted); }
  .country-rec-ppp { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: var(--amber); font-weight: 700; }
  .country-rec-rank { width: 24px; height: 24px; border-radius: 50%; background: rgba(245,158,11,0.15); color: var(--amber); font-size: 0.68rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .cluster-match {
    border: 2px solid var(--c, var(--amber)); border-radius: 12px;
    padding: 1.5rem; background: var(--surface); margin-bottom: 1.5rem;
    position: relative; overflow: hidden;
  }
  .cluster-match::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: var(--c, var(--amber));
  }
  .cluster-match-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); margin-bottom: 0.4rem; }
  .cluster-match-name { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 700; margin-bottom: 0.5rem; }
  .cluster-match-desc { font-size: 0.8rem; color: var(--slate); line-height: 1.7; }
  .skill-gap-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0; border-bottom: 1px solid var(--border); }
  .skill-gap-name { font-size: 0.78rem; min-width: 140px; }
  .skill-gap-bar-bg { flex: 1; height: 6px; background: var(--border); border-radius: 3px; position: relative; }
  .skill-gap-fill { height: 100%; border-radius: 3px; }
  .skill-gap-status { font-size: 0.62rem; min-width: 60px; text-align: right; }
  .reset-btn { background: none; border: 1px solid var(--border); color: var(--muted); padding: 0.5rem 1.25rem; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; cursor: pointer; transition: all 0.2s; }
  .reset-btn:hover { border-color: var(--amber); color: var(--amber); }
  .privacy-note { font-size: 0.65rem; color: var(--muted); text-align: center; margin-top: 0.75rem; display: flex; align-items: center; justify-content: center; gap: 0.4rem; }

  /* ABOUT */
  .about-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
  .about-text { font-size: 0.83rem; color: var(--slate); line-height: 1.9; }
  .about-text h3 { font-family: 'Playfair Display', serif; font-size: 1.15rem; color: var(--text); margin-bottom: 0.65rem; margin-top: 1.25rem; }
  .about-text h3:first-child { margin-top: 0; }
  .about-text p { margin-bottom: 0.85rem; }
  .data-sources { list-style: none; }
  .data-sources li { font-size: 0.72rem; padding: 0.6rem 0; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 0.5rem; color: var(--slate); }
  .data-sources li::before { content: '▸'; color: var(--amber); font-size: 0.6rem; }
  .method-step { display: flex; gap: 1rem; padding: 0.85rem 0; border-bottom: 1px solid var(--border); align-items: flex-start; }
  .method-num { width: 24px; height: 24px; border-radius: 50%; background: rgba(245,158,11,0.15); color: var(--amber); font-size: 0.7rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .method-text { font-size: 0.78rem; color: var(--slate); line-height: 1.6; }
  .method-text strong { color: var(--text); }

  /* TOOLTIP */
  .custom-tooltip { background: var(--surface2); border: 1px solid var(--border); padding: 0.75rem 1rem; border-radius: 6px; font-size: 0.75rem; }
  .custom-tooltip .label { color: var(--muted); font-size: 0.65rem; margin-bottom: 4px; }
  .custom-tooltip .value { color: var(--amber); font-weight: 600; }

  /* FOOTER */
  .footer { border-top: 1px solid var(--border); padding: 1.5rem 2rem; text-align: center; font-size: 0.68rem; color: var(--muted); letter-spacing: 0.05em; }

  /* ANIMATIONS */
  .fade-in { animation: fadeIn 0.35s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  @media (max-width: 700px) {
    .hero-globe, .hero-grid-bg { display: none; }
    .about-grid, .skills-grid, .results-grid { grid-template-columns: 1fr; }
    .spotlight-grid { grid-template-columns: 1fr 1fr; }
    .quiz-options { grid-template-columns: 1fr; }
    .results-header { grid-template-columns: 1fr; }
    .nav-tabs .nav-tab { padding: 0 0.6rem; font-size: 0.62rem; }
  }
`;

export default css;
