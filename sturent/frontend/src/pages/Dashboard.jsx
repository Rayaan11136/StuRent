import { Link } from "react-router-dom";
import { Heart, BadgeCheck } from "lucide-react";
import { properties } from "../data/demoData.js";
import { rankProperties } from "../utils/matching.js";
import { useApp } from "../context/AppContext.jsx";
import PropertyCard from "../components/PropertyCard.jsx";

export default function Dashboard() {
  const { preferences, lastMatchResult } = useApp();
  const preview = (lastMatchResult?.matches || rankProperties(properties, preferences)).slice(0, 3);

  return (
    <div className="page">
      <section className="hero">
        <h1>
          Find a place
          <br />
          that fits your <span className="italic">life.</span>
        </h1>
        <p className="lead">
          StuRent helps you discover student homes based on your budget, lifestyle and what’s actually around you.
        </p>
        <Link className="btn btn-primary" to="/find">
          Find my home →
        </Link>

        <div className="float-card float-1">
          <Heart size={16} color="#7657FF" />
          <b>92%</b>
          Match
        </div>
        <div className="float-card float-2">
          <b>₹12.1k</b>
          True monthly cost
        </div>
        <div className="float-card float-3">
          <BadgeCheck size={16} color="#159B68" />
          <b>Verified</b>
          Property details
        </div>
      </section>

      <div className="section-title">
        <div>
          <h2>How StuRent works</h2>
          <p className="muted" style={{ margin: "6px 0 0" }}>
            We never say a home is “the best.” We show fit, cost, and trade-offs.
          </p>
        </div>
      </div>
      <div className="grid-3">
        <article className="stat-card">
          <span>True cost</span>
          <strong>Rent is only the start</strong>
          <p className="muted">Maintenance, electricity, Wi-Fi and food are added so the monthly number is honest.</p>
        </article>
        <article className="stat-card">
          <span>Explainable match</span>
          <strong>Budget 30%</strong>
          <p className="muted">Distance, room, amenities, food and lifestyle make up the rest. Every point is visible.</p>
        </article>
        <article className="stat-card">
          <span>Nearby life</span>
          <strong>Food, laundry, transit</strong>
          <p className="muted">Sample neighbourhood services sit next to each home so lifestyle isn’t a guess.</p>
        </article>
      </div>

      <div className="section-title">
        <h2>A peek at current sample matches</h2>
        <Link to="/matches">See all →</Link>
      </div>
      <div className="grid-3">
        {preview.map((item, i) => (
          <PropertyCard key={item.property.id} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}
