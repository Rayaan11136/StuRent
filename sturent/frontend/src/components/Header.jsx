import { Menu } from "lucide-react";
import { isUsingRemoteApi } from "../services/api.js";
import { DEMO_DISCLAIMER } from "../data/demoData.js";
import { useApp } from "../context/AppContext.jsx";

export default function Header() {
  const { setMobileNavOpen, preferences } = useApp();
  const remote = isUsingRemoteApi();

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="menu-btn"
          aria-label="Open navigation"
          onClick={() => setMobileNavOpen(true)}
        >
          <Menu size={18} />
        </button>
        <span className="demo-chip" title={DEMO_DISCLAIMER}>
          Demo listings • not real homes
        </span>
      </div>
      <div className="header-left">
        <span className="source-chip">{remote ? "Live API + demo fallback" : "Local demo mode"}</span>
        <span className="source-chip">{preferences.college}</span>
      </div>
    </header>
  );
}
