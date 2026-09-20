import { useEffect, useState } from "react";

export default function MatchScore({ score, size = "md", breakdown }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const target = Number(score) || 0;
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 700);
      setShown(Math.round(target * t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div
      className="match-ring"
      style={{
        "--p": shown,
        width: size === "lg" ? 72 : 52,
        height: size === "lg" ? 72 : 52,
        fontSize: size === "lg" ? 16 : 13
      }}
      aria-label={`Match score ${shown} percent`}
    >
      <span>{shown}%</span>
    </div>
  );
}

export function MatchBreakdown({ breakdown }) {
  if (!breakdown) return null;
  const rows = [
    ["Budget", breakdown.budgetScore, 30],
    ["Distance", breakdown.distanceScore, 20],
    ["Room", breakdown.roomScore, 15],
    ["Amenities", breakdown.amenityScore, 10],
    ["Food", breakdown.foodScore, 10],
    ["Lifestyle", breakdown.lifestyleScore, 15]
  ];
  return (
    <div>
      {rows.map(([label, value, max]) => (
        <div className="factor" key={label}>
          <span>{label}</span>
          <div className="bar" aria-hidden="true">
            <span style={{ width: `${(Number(value) / max) * 100}%` }} />
          </div>
          <strong>
            {value}/{max}
          </strong>
        </div>
      ))}
      <p style={{ marginTop: 12 }}>
        <strong>TOTAL {breakdown.matchScore}%</strong>
      </p>
      <p className="muted" style={{ fontSize: 13 }}>
        This is a rule-based score, not a ranking of which home is “best.”
      </p>
    </div>
  );
}
