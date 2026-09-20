import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { matchProperties } from "../services/api.js";
import PropertyCard from "../components/PropertyCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Matches() {
  const { preferences, lastMatchResult, setLastMatchResult } = useApp();
  const [loading, setLoading] = useState(!lastMatchResult);
  const [error, setError] = useState("");

  useEffect(() => {
    if (lastMatchResult) return undefined;
    let live = true;
    matchProperties(preferences)
      .then((res) => {
        if (live) setLastMatchResult(res);
      })
      .catch((e) => live && setError(e.message || "Could not load matches"))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [lastMatchResult, preferences, setLastMatchResult]);

  const result = lastMatchResult;
  const strong = result?.matches?.filter((m) => m.matchScore >= 70) || [];
  const shown = strong.length ? strong : result?.matches || [];

  return (
    <div className="page matches-page">
      <h1>
        Your <span className="italic">matches.</span>
      </h1>
      <p className="muted">
        Scores explain fit against your preferences. They do not declare a winner.
      </p>

      {error && (
        <div className="error-banner">
          {error}
          <button className="btn btn-ghost small" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      {loading && <p className="muted">Scoring homes…</p>}

      {result && (
        <>
          <div className="stats-row">
            <article className="stat-card">
              <span>Homes analyzed</span>
              <strong>{result.analyzed ?? result.matches.length}</strong>
            </article>
            <article className="stat-card">
              <span>Strong matches (70%+)</span>
              <strong>{result.strongMatches ?? strong.length}</strong>
            </article>
            <article className="stat-card">
              <span>Average match</span>
              <strong>{result.averageMatch ?? 0}%</strong>
            </article>
          </div>
          <p className="muted">Source: {result.source === "aws" ? "AWS Lambda matching" : "local demo matching"}</p>
          {shown.length === 0 ? (
            <EmptyState
              title="No strong matches yet"
              text="Try widening distance or budget on Find a Home."
              to="/find"
              cta="Edit preferences"
            />
          ) : (
            <div className="grid-3">
              {shown.map((item, i) => (
                <PropertyCard key={item.property.id} item={item} index={i} />
              ))}
            </div>
          )}
          <p style={{ marginTop: 24 }}>
            <Link to="/find">Adjust preferences</Link>
          </p>
        </>
      )}
    </div>
  );
}
