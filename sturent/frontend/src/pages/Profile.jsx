import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { properties } from "../data/demoData.js";

export default function Profile() {
  const { preferences, savedIds } = useApp();
  const amenityLabels = [
    preferences.wifi && "Wi-Fi",
    preferences.food && "Food nearby",
    preferences.laundry && "Laundry nearby",
    preferences.transport && "Public transport",
    preferences.ac && "AC",
    preferences.study && "Study space",
    preferences.gym && "Gym"
  ].filter(Boolean);

  const savedNames = savedIds
    .map((id) => properties.find((p) => p.id === id)?.name)
    .filter(Boolean);

  return (
    <div className="page">
      <h1>Profile</h1>
      <p className="muted">
        {preferences.name} • {preferences.college}
      </p>
      <div className="profile-grid">
        <div className="kv">
          <span>Budget</span>
          <strong>₹{Number(preferences.budget).toLocaleString("en-IN")}</strong>
        </div>
        <div className="kv">
          <span>Preferred distance</span>
          <strong>{preferences.maxDistance} km</strong>
        </div>
        <div className="kv">
          <span>Room</span>
          <strong>{preferences.roomType}</strong>
        </div>
        <div className="kv">
          <span>Lifestyle</span>
          <strong>{preferences.lifestyle}</strong>
        </div>
        <div className="kv" style={{ gridColumn: "1 / -1" }}>
          <span>Amenities & nearby needs</span>
          <strong>{amenityLabels.join(" · ") || "None selected"}</strong>
        </div>
        <div className="kv" style={{ gridColumn: "1 / -1" }}>
          <span>Saved homes</span>
          <strong>{savedNames.length ? savedNames.join(", ") : "None yet"}</strong>
        </div>
      </div>
      <Link className="btn btn-primary" to="/find" style={{ marginTop: 18 }}>
        Edit preferences
      </Link>
    </div>
  );
}
