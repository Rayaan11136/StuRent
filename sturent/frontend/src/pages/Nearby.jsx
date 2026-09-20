import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { nearbyCategories, properties, getPropertyById } from "../data/demoData.js";
import NearbyCard from "../components/NearbyCard.jsx";

export default function Nearby() {
  const { nearbyPropertyId, setNearbyPropertyId } = useApp();
  const [type, setType] = useState("food");
  const property = getPropertyById(nearbyPropertyId) || properties[0];
  const places = useMemo(
    () => (property.nearby || []).filter((p) => p.type === type),
    [property, type]
  );

  return (
    <div className="page">
      <h1>📍 Nearby</h1>
      <p className="muted">
        Student-life around <strong>{property.name}</strong>. This MVP uses sample places, structured so a real maps
        API can replace them later.
      </p>

      <label className="field-label" htmlFor="near-home">
        Home
      </label>
      <select
        id="near-home"
        value={property.id}
        onChange={(e) => setNearbyPropertyId(e.target.value)}
        style={{ marginBottom: 16, padding: 10, borderRadius: 12, border: "1px solid var(--border)" }}
      >
        {properties.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} — {p.area}
          </option>
        ))}
      </select>

      <div className="option-row" style={{ marginBottom: 18 }}>
        {nearbyCategories.map((c) => (
          <button
            key={c.id}
            className={`option ${type === c.id ? "selected" : ""}`}
            onClick={() => setType(c.id)}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {places.length === 0 ? (
        <p>Not provided for this category on this sample home.</p>
      ) : (
        <div className="nearby-grid">
          {places.map((place, i) => (
            <NearbyCard key={place.name} place={place} index={i} />
          ))}
        </div>
      )}

      <p style={{ marginTop: 20 }}>
        <Link to={`/property/${property.id}`}>Open {property.name}</Link>
      </p>
    </div>
  );
}
