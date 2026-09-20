import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import { useApp } from "./context/AppContext.jsx";

const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const FindHome = lazy(() => import("./pages/FindHome.jsx"));
const Matching = lazy(() => import("./pages/Matching.jsx"));
const Matches = lazy(() => import("./pages/Matches.jsx"));
const PropertyDetails = lazy(() => import("./pages/PropertyDetails.jsx"));
const Compare = lazy(() => import("./pages/Compare.jsx"));
const Nearby = lazy(() => import("./pages/Nearby.jsx"));
const Saved = lazy(() => import("./pages/Saved.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));

function PageFallback() {
  return (
    <div className="page">
      <p className="muted">Loading…</p>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const { mobileNavOpen, setMobileNavOpen } = useApp();

  return (
    <div className="app-shell">
      <Sidebar />
      <div
        className={`overlay ${mobileNavOpen ? "show" : ""}`}
        onClick={() => setMobileNavOpen(false)}
        aria-hidden="true"
      />
      <div className="main">
        <Header />
        <Suspense fallback={<PageFallback />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28 }}
            >
              <Routes location={location}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/find" element={<FindHome />} />
                <Route path="/matching" element={<Matching />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/nearby" element={<Nearby />} />
                <Route path="/saved" element={<Saved />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </div>
    </div>
  );
}
