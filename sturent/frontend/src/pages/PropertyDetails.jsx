import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProperty, explainMatch } from "../services/api.js";
import { useApp } from "../context/AppContext.jsx";
import { matchProperty, getDealBreakers } from "../utils/matching.js";
import { calculateTrueCost } from "../utils/costCalculator.js";
import { km, displayCostField, fieldStatus } from "../utils/formatters.js";
import CostBreakdown from "../components/CostBreakdown.jsx";
import MatchScore, { MatchBreakdown } from "../components/MatchScore.jsx";
import TransparencyBadge from "../components/TransparencyBadge.jsx";
import NearbyCard from "../components/NearbyCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function PropertyDetails() {
  const { id } = useParams();
  const { preferences, toggleSaved, isSaved, toggleCompare, isCompared, setNearbyPropertyId } = useApp();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [explanation, setExplanation] = useState("");

  useEffect(() => {
    let live = true;
    setError("");
    getProperty(id)
      .then((res) => live && setData(res))
      .catch((e) => live && setError(e.message || "Unable to retrieve this home"));
    return () => {
      live = false;
    };
  }, [id]);

  const property = data?.property;
  const breakdown = useMemo(() => {
    if (!property) return null;
    const m = matchProperty(property, preferences);
    if (!m.cost) m.cost = calculateTrueCost(property);
    return m;
  }, [property, preferences]);

  useEffect(() => {
    if (!property || !breakdown) return undefined;
    let live = true;
    explainMatch({ property, preferences, matchBreakdown: breakdown }).then((res) => {
      if (live) setExplanation(res.explanation);
    });
    return () => {
      live = false;
    };
  }, [property, breakdown, preferences]);

  if (error) {
    return (
      <div className="page">
        <div className="error-banner">
          {error}
          <button className="btn btn-ghost small" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!property || !breakdown) {
    return (
      <div className="page">
        <p className="muted">Loading home…</p>
      </div>
    );
  }

  const cost = breakdown.cost;
  const dealBreakers = getDealBreakers(property, preferences, cost);
  const amenityFields = [
    ["wifi", "Wi-Fi"],
    ["food", "Food"],
    ["electricity", "Electricity"],
    ["deposit", "Deposit"]
  ];

  return (
    <div className="page">
      <div className="hero-detail">
        <img
          src={property.image}
          alt={`${property.name} exterior`}
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&h=900&fit=crop&q=80&auto=format";
          }}
        />
        <div className="overlay-text">
          <h1>{property.name}</h1>
          <p>
            {property.area}, {property.city} • {km(property.distance)} from your college (demo)
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={() => toggleSaved(property.id)}>
          {isSaved(property.id) ? "Saved" : "Save this home"}
        </button>
        <button className={`btn btn-ghost ${isCompared(property.id) ? "active" : ""}`} onClick={() => toggleCompare(property.id)}>
          {isCompared(property.id) ? "In compare" : "Add to compare"}
        </button>
        <Link
          className="btn btn-ghost"
          to="/nearby"
          onClick={() => setNearbyPropertyId(property.id)}
        >
          📍 Nearby
        </Link>
      </div>

      <div className="grid-2 stack">
        <section className="panel">
          <h2>About this home</h2>
          <p>{property.description}</p>
          <p>
            Advertised rent <strong>₹{Number(property.rent).toLocaleString("en-IN")}/month</strong>
          </p>
        </section>
        <section className="panel" style={{ display: "grid", placeItems: "center" }}>
          <MatchScore score={breakdown.matchScore} size="lg" />
          <p className="muted">Match with your current preferences</p>
        </section>
      </div>

      <section className="panel" style={{ marginTop: 16 }}>
        <h2>What will you actually pay?</h2>
        <CostBreakdown property={property} cost={cost} />
      </section>

      <section className="panel" style={{ marginTop: 16 }}>
        <h2>Why this matches you</h2>
        <p>{explanation || "Preparing an explanation from the match breakdown…"}</p>
        <MatchBreakdown breakdown={breakdown} />
      </section>

      <section className="panel" style={{ marginTop: 16 }}>
        <h2>Things to know</h2>
        {dealBreakers.map((d) => (
          <div key={d.text} className={`alert ${d.level === "info" ? "info" : ""}`}>
            {d.level === "info" ? "ℹ" : "⚠"} {d.text}
          </div>
        ))}
      </section>

      <section className="panel" style={{ marginTop: 16 }}>
        <h2>What you get</h2>
        <div className="amenity-list">
          {(property.amenities || []).map((a) => (
            <div className="amenity-item" key={a}>
              <span>{a}</span>
              <span className="muted">Listed amenity</span>
            </div>
          ))}
        </div>
        <div className="transparency-list" style={{ marginTop: 16 }}>
          {amenityFields.map(([field, label]) => {
            const shown = field === "deposit"
              ? { label: `₹${Number(property.deposit).toLocaleString("en-IN")}` }
              : displayCostField(property, field);
            return (
              <div className="amenity-item" key={field}>
                <span>
                  <strong>{label}</strong>
                  <div className="muted">{shown.label}</div>
                </span>
                <TransparencyBadge status={fieldStatus(property, field)} />
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel" style={{ marginTop: 16 }}>
        <h2>What’s nearby?</h2>
        <p className="muted">Sample neighbourhood data. Architecture is ready for a maps/places API later.</p>
        {(property.nearby || []).length === 0 ? (
          <EmptyState title="No nearby places listed" text="Not provided for this sample home." />
        ) : (
          <div className="nearby-grid">
            {property.nearby.map((place, i) => (
              <NearbyCard key={`${place.name}-${i}`} place={place} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
