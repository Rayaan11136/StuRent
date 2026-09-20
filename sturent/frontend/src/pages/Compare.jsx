import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { properties } from "../data/demoData.js";
import { rankProperties } from "../utils/matching.js";
import CompareTable from "../components/CompareTable.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Compare() {
  const { compareIds, toggleCompare, preferences, lastMatchResult } = useApp();

  const items = useMemo(() => {
    const ranked = lastMatchResult?.matches || rankProperties(properties, preferences);
    return compareIds
      .map((id) => ranked.find((m) => m.property.id === id))
      .filter(Boolean);
  }, [compareIds, lastMatchResult, preferences]);

  return (
    <div className="page">
      <h1>
        Compare <span className="italic">trade-offs.</span>
      </h1>
      <p className="muted">
        Up to 3 homes. This table is neutral — it does not pick a winner. Paid promotion, if added later, would never
        change these scores.
      </p>

      {items.length === 0 ? (
        <EmptyState
          title="Nothing to compare yet"
          text="Open a home and tap Compare. You can add up to three."
          to="/matches"
          cta="Browse matches"
        />
      ) : (
        <>
          <div className="chips" style={{ marginBottom: 16 }}>
            {items.map((m) => (
              <button key={m.property.id} className="chip" onClick={() => toggleCompare(m.property.id)}>
                Remove {m.property.name}
              </button>
            ))}
          </div>
          <CompareTable items={items} />
          <p style={{ marginTop: 16 }}>
            <Link to="/matches">Back to matches</Link>
          </p>
        </>
      )}
    </div>
  );
}
