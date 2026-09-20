import { useEffect, useState } from "react";
import { inr, displayCostField, fieldStatus } from "../utils/formatters.js";
import TransparencyBadge from "./TransparencyBadge.jsx";

function AnimatedNumber({ value }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const target = Number(value) || 0;
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 650);
      setN(Math.round(target * t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{inr(n)}</>;
}

export default function CostBreakdown({ property, cost }) {
  const rows = [
    ["rent", "Advertised rent"],
    ["maintenance", "Maintenance"],
    ["electricity", "Electricity"],
    ["wifi", "Wi-Fi"],
    ["food", "Food"],
    ["otherRecurringCosts", "Other recurring"]
  ];

  return (
    <div>
      {rows.map(([field, label]) => {
        const shown = displayCostField(property, field);
        return (
          <div className="cost-row" key={field}>
            <span>{label}</span>
            <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {shown.label}
              {field !== "rent" && <TransparencyBadge status={fieldStatus(property, field)} />}
            </span>
          </div>
        );
      })}
      <div className="cost-total">
        <span>Estimated actual monthly cost</span>
        <span>
          <AnimatedNumber value={cost.estimatedActualCost} />
        </span>
      </div>
      <p className="muted" style={{ fontSize: 13, marginBottom: 0 }}>
        Advertised rent {inr(cost.advertisedRent)}/month. Estimated values are labelled and are not verified facts.
      </p>
    </div>
  );
}
