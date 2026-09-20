import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

const distances = [1, 3, 5, 10];
const rooms = ["Single", "Double", "Triple", "Any"];
const lifestyles = [
  { id: "quiet", label: "Quiet & focused" },
  { id: "social", label: "Social & active" },
  { id: "balanced", label: "Balanced" }
];

export default function FindHome() {
  const { preferences, setPendingPrefs } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState(preferences);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const submit = (e) => {
    e.preventDefault();
    setPendingPrefs(form);
    navigate("/matching");
  };

  return (
    <div className="page">
      <h1>
        Tell us what home means to <span className="italic">you.</span>
      </h1>
      <p className="muted">We’ll score sample homes against these preferences. You still make the call.</p>

      <form className="pref-form" onSubmit={submit}>
        <div className="field">
          <div className="range-row">
            <label htmlFor="budget">Budget</label>
            <span>₹{Number(form.budget).toLocaleString("en-IN")}/month</span>
          </div>
          <input
            id="budget"
            type="range"
            min="5000"
            max="30000"
            step="500"
            value={form.budget}
            onChange={(e) => set({ budget: Number(e.target.value) })}
          />
        </div>

        <div className="field">
          <div className="field-label">Maximum distance</div>
          <div className="option-row">
            {distances.map((d) => (
              <button
                type="button"
                key={d}
                className={`option ${form.maxDistance === d ? "selected" : ""}`}
                onClick={() => set({ maxDistance: d })}
              >
                {d} km
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <div className="field-label">Room</div>
          <div className="option-row">
            {rooms.map((r) => (
              <button
                type="button"
                key={r}
                className={`option ${form.roomType === r ? "selected" : ""}`}
                onClick={() => set({ roomType: r })}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <div className="field-label">Requirements</div>
          <div className="toggle-grid">
            {[
              ["wifi", "Wi-Fi"],
              ["food", "Food nearby"],
              ["laundry", "Laundry nearby"],
              ["transport", "Public transport"],
              ["ac", "AC"],
              ["study", "Study space"],
              ["gym", "Gym"]
            ].map(([key, label]) => (
              <button
                type="button"
                key={key}
                className={`toggle ${form[key] ? "on" : ""}`}
                aria-pressed={form[key]}
                onClick={() => set({ [key]: !form[key] })}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <div className="field-label">Lifestyle</div>
          <div className="option-row">
            {lifestyles.map((l) => (
              <button
                type="button"
                key={l.id}
                className={`option ${form.lifestyle === l.id ? "selected" : ""}`}
                onClick={() => set({ lifestyle: l.id })}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" type="submit">
          Find my matches ✦
        </button>
      </form>
    </div>
  );
}
