import { useState } from "react";
import css from "./styles.js";
import HomePage from "./components/HomePage.jsx";
import ExplorerPage from "./components/ExplorerPage.jsx";
import SkillsPage from "./components/SkillsPage.jsx";
import ClustersPage from "./components/ClustersPage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import AboutPage from "./components/AboutPage.jsx";

const PAGES = [
  { id: "home",     label: "Home" },
  { id: "explorer", label: "Explorer", badge: "PPP" },
  { id: "skills",   label: "Skills" },
  { id: "clusters", label: "Clusters" },
  { id: "profile",  label: "My Profile", badge: "AI", badgeClass: "new" },
  { id: "about",    label: "About" },
];

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-logo" onClick={() => setPage("home")}>Career<span>Atlas</span></div>
          <div className="nav-tabs">
            {PAGES.map(p => (
              <button key={p.id} className={`nav-tab ${page === p.id ? "active" : ""}`} onClick={() => setPage(p.id)}>
                {p.label}
                {p.badge && <span className={`nav-badge ${p.badgeClass || ""}`}>{p.badge}</span>}
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
          Global Data Science Career Path Analyzer · AUM Capstone 2025 · Stack Overflow Survey + Big Mac Index PPP · Local ML CV Analysis
        </footer>
      </div>
    </>
  );
}
