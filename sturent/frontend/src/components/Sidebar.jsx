import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Heart,
  ArrowLeftRight,
  MapPin,
  Star,
  User,
  Settings
} from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

const explore = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/find", label: "Find a Home", icon: Search },
  { to: "/matches", label: "My Matches", icon: Heart },
  { to: "/compare", label: "Compare", icon: ArrowLeftRight },
  { to: "/nearby", label: "Nearby", icon: MapPin },
  { to: "/saved", label: "Saved", icon: Star }
];

export default function Sidebar() {
  const { mobileNavOpen, setMobileNavOpen } = useApp();
  const location = useLocation();

  const close = () => setMobileNavOpen(false);

  return (
    <>
      <aside className={`sidebar ${mobileNavOpen ? "open" : ""}`} aria-label="Primary">
        <div className="sidebar-brand">
          <span className="brand-mark" aria-hidden="true">✦</span>
          StuRent
        </div>
        <div className="nav-label">EXPLORE</div>
        <nav>
          {explore.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              onClick={close}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-spacer" />
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`} onClick={close}>
          <User size={18} aria-hidden="true" />
          Profile
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`} onClick={close}>
          <Settings size={18} aria-hidden="true" />
          Settings
        </NavLink>
        <div className="sidebar-card">
          <strong>✓ Transparency first</strong>
          <p>Know what you’re actually paying.</p>
        </div>
      </aside>

      <nav className="bottom-nav" aria-label="Mobile">
        {explore.slice(0, 5).map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === "/"} className={location.pathname === to ? "active" : ""}>
            <Icon size={16} />
            {label.split(" ")[0]}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
