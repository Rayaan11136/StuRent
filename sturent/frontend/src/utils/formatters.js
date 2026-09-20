export function inr(value) {
  if (value == null || value === "") return "Not provided";
  if (value === "included" || value === "Included") return "Included";
  const n = Number(value);
  if (!Number.isFinite(n)) return "Not provided";
  return `₹${n.toLocaleString("en-IN")}`;
}

export function inrCompact(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) {
    const k = n / 1000;
    return `₹${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  return `₹${n}`;
}

export function km(value) {
  if (value == null) return "Not provided";
  return `${value} km`;
}

export function fieldStatus(property, field) {
  const verified = property.verified || [];
  const ownerProvided = property.ownerProvided || [];
  const estimated = property.estimated || [];
  if (verified.includes(field)) return "verified";
  if (estimated.includes(field)) return "estimated";
  if (ownerProvided.includes(field)) return "owner";
  return "unknown";
}

export function displayCostField(property, field) {
  const value = property[field];
  if (value == null || value === "") return { label: "Not provided", amount: null };
  if (value === "included" || value === "Included") return { label: "Included", amount: 0 };
  const n = Number(value);
  if (!Number.isFinite(n)) return { label: "Not provided", amount: null };
  if (n === 0) {
    if ((property.amenities || []).includes("Food") && field === "food") {
      return { label: "Included", amount: 0 };
    }
    if (field === "electricity" && (property.verified || []).includes("electricity")) {
      return { label: "Included", amount: 0 };
    }
    if (field === "wifi" && ((property.amenities || []).includes("Wi-Fi") || (property.verified || []).includes("wifi"))) {
      return { label: "Included", amount: 0 };
    }
    if (field === "food") return { label: "₹0", amount: 0 };
    return { label: "Included", amount: 0 };
  }
  return { label: `${inr(n)}/month`, amount: n };
}

export function matchTone(score) {
  if (score >= 80) return "strong";
  if (score >= 65) return "good";
  return "partial";
}
