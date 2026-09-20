/** Treat "included" and missing numeric values as ₹0 in the monthly total. */
export function costAmount(value) {
  if (value === "included" || value === "Included" || value == null || value === "") {
    return 0;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function calculateTrueCost(property) {
  const breakdown = {
    rent: costAmount(property.rent),
    maintenance: costAmount(property.maintenance),
    electricity: costAmount(property.electricity),
    wifi: costAmount(property.wifi),
    food: costAmount(property.food),
    otherRecurringCosts: costAmount(property.otherRecurringCosts)
  };

  const estimatedActualCost = Object.values(breakdown).reduce((sum, n) => sum + n, 0);

  return {
    advertisedRent: breakdown.rent,
    estimatedActualCost,
    breakdown
  };
}

export function isIncluded(property, field) {
  const value = property[field];
  if (value === "included" || value === "Included") return true;
  if (field === "electricity" && costAmount(value) === 0 && (property.verified || []).includes("electricity")) {
    return true;
  }
  if (field === "wifi" && costAmount(value) === 0 && (property.amenities || []).includes("Wi-Fi")) {
    return true;
  }
  if (field === "food" && costAmount(value) === 0 && (property.amenities || []).includes("Food")) {
    return true;
  }
  return costAmount(value) === 0 && value !== undefined && field !== "food";
}
