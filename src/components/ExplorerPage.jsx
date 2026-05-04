import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from "recharts";
import { COUNTRIES, ROLES, EXP_LEVELS, SALARY_DATA, TREND_DATA, pppAdjust } from "../data.js";
import CustomTooltip from "./CustomTooltip.jsx";

export default function ExplorerPage() {
  const [role, setRole] = useState("ds");
  const [expLevel, setExpLevel] = useState("mid");
  const [ppp, setPpp] = useState(true);
  const [selected, setSelected] = useState(["US", "IN", "DE", "CA", "SG", "MN"]);
  const [showTrend, setShowTrend] = useState(false);

  const toggleCountry = code => setSelected(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
  const expMult = EXP_LEVELS.find(e => e.id === expLevel)?.multiplier || 1;

  const chartData = COUNTRIES.filter(c => selected.includes(c.code)).map(c => {
    const base = SALARY_DATA[c.code][role];
    const adjusted = Math.round(base * expMult);
    return { name: c.flag + " " + c.code, fullName: c.name, value: ppp ? pppAdjust(adjusted, c.bigMac) : adjusted, raw: adjusted, country: c };
  }).sort((a, b) => b.value - a.value);

  const usD = chartData.find(d => d.country.code === "US");
  const inD = chartData.find(d => d.country.code === "IN");
  const rawGap = usD && inD ? (usD.raw / inD.raw).toFixed(1) : "-";
  const adjGap = usD && inD ? (pppAdjust(usD.raw, 5.58) / pppAdjust(inD.raw, 2.54)).toFixed(1) : "-";
  const trendColors = { US: "#f59e0b", IN: "#34d399", DE: "#60a5fa", CA: "#f472b6", SG: "#a78bfa" };

  return (
    <div className="main fade-in">
      <div className="section-header">
        <h2 className="section-title">Salary Explorer</h2>
        <span className="section-meta">Stack Overflow Survey + Kaggle · Big Mac Index PPP</span>
      </div>
      <div className="controls">
        <div className="control-group">
          <label className="control-label">Role</label>
          <select className="control-select" value={role} onChange={e => setRole(e.target.value)}>
            {ROLES.map(r => <option key={r.id} value={r.id}>{r.icon} {r.title}</option>)}
          </select>
        </div>
        <div className="control-group">
          <label className="control-label">Experience Level</label>
          <select className="control-select" value={expLevel} onChange={e => setExpLevel(e.target.value)}>
            {EXP_LEVELS.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
          </select>
        </div>
      </div>
      <div className="toggle-row">
        <button className={`toggle ${ppp ? "on" : ""}`} onClick={() => setPpp(!ppp)} />
        <span className="toggle-label">PPP Adjustment (Big Mac Index)</span>
        {ppp && <span className="ppp-badge">ACTIVE</span>}
        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button className={`toggle ${showTrend ? "on" : ""}`} onClick={() => setShowTrend(!showTrend)} />
          <span className="toggle-label">Salary Trend 2020–2024</span>
        </span>
      </div>

      {chartData.length >= 2 && (
        <div className="spotlight-grid">
          <div className="spotlight-card">
            <div className="spotlight-label">Highest PPP</div>
            <div className="spotlight-value">{chartData[0]?.country?.flag} ${chartData[0]?.value?.toLocaleString()}</div>
            <div className="spotlight-sub">{chartData[0]?.country?.name}</div>
          </div>
          <div className="spotlight-card">
            <div className="spotlight-label">US vs India Gap</div>
            <div className="spotlight-value">{ppp ? adjGap : rawGap}×</div>
            <div className="spotlight-sub">{ppp ? "PPP-adjusted" : "Raw USD"}</div>
          </div>
          <div className="spotlight-card">
            <div className="spotlight-label">Gap Narrowed by PPP</div>
            <div className="spotlight-value" style={{ color: "var(--success)" }}>
              {rawGap && adjGap ? `${(rawGap - adjGap).toFixed(1)}×` : "-"}
            </div>
            <div className="spotlight-sub">via Big Mac adjustment</div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-title">Annual Salary — {ROLES.find(r => r.id === role)?.title} · {EXP_LEVELS.find(e => e.id === expLevel)?.label} · {ppp ? "PPP-Adjusted USD" : "Raw USD"}</div>
        {chartData.length === 0
          ? <div style={{ color: "var(--muted)", fontSize: "0.8rem", padding: "2rem", textAlign: "center" }}>Select at least one country below ↓</div>
          : <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} barSize={28}>
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip ppp={ppp} />} cursor={{ fill: "rgba(245,158,11,0.05)" }} />
                <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                  {chartData.map((e, i) => <Cell key={i} fill={i === 0 ? "#f59e0b" : i === chartData.length - 1 ? "#60a5fa" : "#1f2d42"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
        }
      </div>

      {usD && inD && (
        <div className="card">
          <div className="card-title">Gap Analysis — US vs India · {ROLES.find(r => r.id === role)?.title}</div>
          {[{ label: "Raw USD Gap", val: rawGap, color: "var(--danger)" }, { label: "PPP-Adjusted Gap", val: adjGap, color: "var(--success)" }].map(g => (
            <div key={g.label} className="gap-meter">
              <div className="gap-label"><span>{g.label}</span><span style={{ color: g.color }}>{g.val}×</span></div>
              <div className="gap-track"><div className="gap-fill" style={{ width: `${Math.min((1 / g.val) * 100 * 1.5, 100)}%`, background: g.color }} /></div>
            </div>
          ))}
          <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.75rem" }}>
            PPP reduces the apparent gap by <span style={{ color: "var(--amber)" }}>{(rawGap - adjGap).toFixed(1)}×</span>
          </div>
        </div>
      )}

      {showTrend && (
        <div className="card fade-in">
          <div className="card-title">Data Scientist Salary Trend 2020–2024 (Raw USD)</div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={TREND_DATA}>
              <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return <div className="custom-tooltip"><div className="label">{label}</div>{payload.map((p, i) => <div key={i} style={{ color: p.color, fontSize: "0.75rem" }}>{p.name}: ${p.value?.toLocaleString()}</div>)}</div>;
              }} />
              <Legend wrapperStyle={{ fontSize: "0.7rem", fontFamily: "JetBrains Mono", color: "#64748b" }} />
              {["US", "DE", "CA", "SG", "IN"].map(code => {
                const c = COUNTRIES.find(x => x.code === code);
                return <Line key={code} type="monotone" dataKey={code} name={`${c?.flag} ${code}`} stroke={trendColors[code]} strokeWidth={2} dot={{ fill: trendColors[code], r: 3 }} activeDot={{ r: 5 }} />;
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="insight-box">
        <div className="insight-icon">📊</div>
        <div className="insight-text">
          US vs India raw gap: <strong>{rawGap}×</strong>. After PPP adjustment: <strong>{adjGap}×</strong>.{" "}
          {ppp ? "The adjusted view tells a very different story for international career planning." : "Toggle PPP on to see real purchasing power."}
        </div>
      </div>

      <div className="section-header" style={{ marginTop: "1.5rem" }}>
        <h2 className="section-title" style={{ fontSize: "1.1rem" }}>
          Select Countries <span style={{ color: "var(--muted)", fontSize: "0.8rem", fontFamily: "JetBrains Mono" }}>({selected.length} selected)</span>
        </h2>
        <button style={{ background: "none", border: "none", color: "var(--muted)", fontSize: "0.68rem", cursor: "pointer" }} onClick={() => setSelected(["US", "IN", "DE", "CA", "SG", "MN"])}>Reset</button>
      </div>
      <div className="compare-grid">
        {COUNTRIES.map(c => {
          const sal = Math.round(SALARY_DATA[c.code][role] * expMult);
          const adj = pppAdjust(sal, c.bigMac);
          return (
            <div key={c.code} className={`country-card ${selected.includes(c.code) ? "selected" : ""}`} onClick={() => toggleCountry(c.code)}>
              <div className="check-mark">✓</div>
              <div className="country-flag">{c.flag}</div>
              <div className="country-name">{c.name}</div>
              <div className="country-region">{c.region}</div>
              <div className="salary-raw">${sal.toLocaleString()} raw</div>
              <div className="salary-ppp">${(ppp ? adj : sal).toLocaleString()}</div>
              <div className="salary-tag">{ppp ? "PPP-adjusted" : "Raw"} USD</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
