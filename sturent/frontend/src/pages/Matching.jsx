import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingMatch from "../components/LoadingMatch.jsx";
import { useApp } from "../context/AppContext.jsx";
import { matchProperties } from "../services/api.js";

const steps = [
  "Understanding your budget",
  "Checking your preferred distance",
  "Comparing room types",
  "Checking amenities",
  "Calculating actual living costs",
  "Analyzing lifestyle compatibility"
];

export default function Matching() {
  const { pendingPrefs, setPreferences, setLastMatchResult, preferences } = useApp();
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [doneCount, setDoneCount] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const prefs = pendingPrefs || preferences;
    let cancelled = false;

    const run = async () => {
      try {
        const result = await matchProperties(prefs);
        if (cancelled) return;
        setLastMatchResult(result);
        setPreferences(prefs);
        setDoneCount(result.strongMatches ?? result.matches.filter((m) => m.matchScore >= 70).length);
      } catch (e) {
        if (!cancelled) setError(e.message || "Matching failed");
      }
    };

    run();

    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setActive((prev) => Math.min(prev + 1, steps.length - 1));
      if (i >= steps.length) clearInterval(timer);
    }, 550);

    const go = setTimeout(() => {
      if (!cancelled) navigate("/matches");
    }, 3800);

    return () => {
      cancelled = true;
      clearInterval(timer);
      clearTimeout(go);
    };
  }, []);

  return (
    <div className="page">
      {error && <div className="error-banner">{error}</div>}
      <LoadingMatch steps={steps} activeIndex={active} doneCount={doneCount} />
    </div>
  );
}
