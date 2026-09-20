import { useMemo } from "react";
import { useApp } from "../context/AppContext.jsx";
import { properties } from "../data/demoData.js";
import { rankProperties } from "../utils/matching.js";
import PropertyCard from "../components/PropertyCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Saved() {
  const { savedIds, preferences, lastMatchResult } = useApp();
  const items = useMemo(() => {
    const ranked = lastMatchResult?.matches || rankProperties(properties, preferences);
    return savedIds.map((id) => ranked.find((m) => m.property.id === id)).filter(Boolean);
  }, [savedIds, lastMatchResult, preferences]);

  return (
    <div className="page">
      <h1>
        Saved <span className="italic">homes.</span>
      </h1>
      <p className="muted">Saved IDs are stored in this browser for now (localStorage).</p>
      {items.length === 0 ? (
        <EmptyState
          title="No saved homes"
          text="Tap Save on a property card or details page."
          to="/matches"
          cta="See matches"
        />
      ) : (
        <div className="grid-3">
          {items.map((item, i) => (
            <PropertyCard key={item.property.id} item={item} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
