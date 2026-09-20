import { inr, km } from "../utils/formatters.js";
import MatchScore from "./MatchScore.jsx";

const rows = [
  ["Match %", (m) => `${m.matchScore}%`],
  ["Advertised rent", (m) => inr(m.property.rent)],
  ["Actual estimated cost", (m) => inr(m.cost.estimatedActualCost)],
  ["Distance", (m) => km(m.property.distance)],
  ["Room", (m) => m.property.roomType],
  ["Deposit", (m) => inr(m.property.deposit)],
  ["Lock-in", (m) => m.property.lockIn || "Not provided"],
  ["Notice period", (m) => m.property.noticePeriod || "Not provided"],
  ["Wi-Fi", (m) => (m.property.amenities || []).includes("Wi-Fi") ? "Yes" : "Not listed"],
  ["Food", (m) => (m.property.amenities || []).includes("Food") || Number(m.property.food) > 0 ? "Available / billed" : "Not included"],
  ["Laundry", (m) => (m.property.amenities || []).includes("Laundry") || (m.nearbyCounts?.laundry || 0) > 0 ? "On-site or nearby" : "Not listed"],
  ["AC", (m) => (m.property.amenities || []).includes("AC") ? "Yes" : "Not listed"],
  ["Study space", (m) => (m.property.amenities || []).some((a) => /study/i.test(a)) ? "Yes" : "Not listed"],
  ["Nearby food", (m) => `${m.nearbyCounts?.food ?? (m.property.nearby || []).filter((n) => n.type === "food").length}`],
  ["Nearby transport", (m) => `${m.nearbyCounts?.transport ?? (m.property.nearby || []).filter((n) => n.type === "transport").length}`]
];

export default function CompareTable({ items }) {
  return (
    <div className="compare-wrap">
      <table className="compare-table">
        <thead>
          <tr>
            <th>Factor</th>
            {items.map((m) => (
              <th key={m.property.id}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <MatchScore score={m.matchScore} />
                  <div>
                    <div>{m.property.name}</div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {m.property.area}
                    </div>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, getter]) => (
            <tr key={label}>
              <th>{label}</th>
              {items.map((m) => (
                <td key={m.property.id}>{getter(m)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
