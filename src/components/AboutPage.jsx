export default function AboutPage() {
  return (
    <div className="main fade-in">
      <div className="section-header">
        <h2 className="section-title">About This Project</h2>
        <span className="section-meta">AUM Capstone · Data Science · Spring 2025</span>
      </div>
      <div className="about-grid">
        <div className="about-text">
          <h3>The Problem</h3>
          <p>Most career tools are built for US users and show raw USD salaries. For international students, this creates a distorted picture. A $130,000 offer in San Francisco sounds life-changing, but after rent and cost of living it delivers less purchasing power than expected. Meanwhile, a $8,000 offer in Ulaanbaatar might go much further than it seems.</p>
          <h3>The Method</h3>
          <p>This tool uses the <strong>Big Mac Index</strong> as a PPP proxy. The formula:</p>
          <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "6px", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.8rem", color: "var(--amber)", fontFamily: "JetBrains Mono" }}>
            PPP Salary = Raw Salary × (US Big Mac Price / Local Big Mac Price)
          </div>
          <h3>Known Limitations</h3>
          <p>Countries without McDonald's locations (e.g. Mongolia) use estimated Big Mac prices derived from local cost-of-living proxies. This introduces additional uncertainty in PPP calculations for these markets. The CV analyzer uses ML inference — results should be used as directional guidance, not precise predictions.</p>
          <h3>Methodology Steps</h3>
          <div>
            {[
              ["Data Collection", "Stack Overflow surveys (2020–2024), Kaggle DS salary datasets, LinkedIn job postings, Big Mac Index"],
              ["Data Cleaning", "Removed outliers (>3 SD), standardized currencies, matched country codes across datasets"],
              ["Skills Extraction", "NLP pipeline on free-text survey fields to extract and count skill mentions"],
              ["PPP Adjustment", "Applied Big Mac Index formula to normalize salaries to USD purchasing power"],
              ["Clustering", "K-Means (k=4) on standardized salary, experience, skills vector — silhouette score 0.67"],
            ].map(([title, desc], i) => (
              <div key={i} className="method-step">
                <div className="method-num">{i + 1}</div>
                <div className="method-text"><strong>{title}</strong><br />{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="card">
            <div className="card-title">Data Sources</div>
            <ul className="data-sources">
              <li>Stack Overflow Developer Survey (2020–2024)</li>
              <li>Kaggle DS/ML Salary Dataset</li>
              <li>LinkedIn Job Postings Data</li>
              <li>The Economist Big Mac Index</li>
              <li>World Bank PPP Indicators</li>
            </ul>
          </div>
          <div className="card" style={{ marginTop: "1rem" }}>
            <div className="card-title">Tech Stack</div>
            <ul className="data-sources">
              <li>Python · Pandas · Scikit-learn</li>
              <li>FastAPI · ML Backend (local)</li>
              <li>React · Vite · Recharts</li>
              <li>RandomForest · KMeans · TF-IDF</li>
              <li>pdfplumber · joblib</li>
            </ul>
          </div>
          <div className="card" style={{ marginTop: "1rem" }}>
            <div className="card-title">Dataset Stats</div>
            <ul className="data-sources">
              <li>376,000+ survey responses</li>
              <li>15 countries covered</li>
              <li>5 career roles modeled</li>
              <li>2020–2024 time range</li>
              <li>12 skills tracked</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
