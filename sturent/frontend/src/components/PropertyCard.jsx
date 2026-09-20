import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import MatchScore from "./MatchScore.jsx";
import { inr, km } from "../utils/formatters.js";
import { useApp } from "../context/AppContext.jsx";

export default function PropertyCard({ item, index = 0 }) {
  const { property, matchScore, cost } = item;
  const { toggleCompare, isCompared, toggleSaved, isSaved } = useApp();

  return (
    <motion.article
      className="property-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
    >
      <div className="thumb">
        <img
          src={property.image}
          alt={`${property.name} in ${property.area}`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&h=900&fit=crop&q=80&auto=format";
          }}
        />
      </div>
      <div className="card-body">
        <div className="card-top">
          <div>
            <strong>{property.name}</strong>
            <div className="area">
              {property.area}, {property.city} • {km(property.distance)}
            </div>
          </div>
          <MatchScore score={matchScore} />
        </div>
        <div className="price-row">
          <span>Advertised {inr(property.rent)}</span>
          <span>
            <strong>Est. {inr(cost.estimatedActualCost)}</strong>
          </span>
        </div>
        <div className="chips">
          <span className="chip">{property.roomType}</span>
          {(property.amenities || []).slice(0, 3).map((a) => (
            <span className="chip" key={a}>
              {a}
            </span>
          ))}
          {(property.verified || []).length > 0 && <span className="chip">🟢 Some verified</span>}
          {(property.estimated || []).length > 0 && <span className="chip">🟡 Some estimated</span>}
        </div>
        <div className="card-actions">
          <Link className="btn btn-primary small" to={`/property/${property.id}`}>
            View details
          </Link>
          <button
            className={`btn btn-ghost small ${isCompared(property.id) ? "active" : ""}`}
            onClick={() => toggleCompare(property.id)}
          >
            {isCompared(property.id) ? "In compare" : "Compare"}
          </button>
          <button
            className={`btn btn-ghost small ${isSaved(property.id) ? "active" : ""}`}
            onClick={() => toggleSaved(property.id)}
            aria-pressed={isSaved(property.id)}
            aria-label={isSaved(property.id) ? "Unsave home" : "Save home"}
          >
            {isSaved(property.id) ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
