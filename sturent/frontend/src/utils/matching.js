import { calculateTrueCost } from "./costCalculator.js";

export const MATCH_WEIGHTS = {
  budget: 30,
  distance: 20,
  room: 15,
  amenities: 10,
  food: 10,
  lifestyle: 15
};

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

export function nearbyCounts(property) {
  const list = property.nearby || [];
  const count = (type) => list.filter((n) => n.type === type).length;
  return {
    food: count("food"),
    laundry: count("laundry"),
    shopping: count("shopping"),
    transport: count("transport"),
    cafe: count("cafe"),
    pharmacy: count("pharmacy")
  };
}

function hasAmenity(property, names) {
  const set = new Set((property.amenities || []).map((a) => a.toLowerCase()));
  return names.some((n) => set.has(n.toLowerCase()));
}

function budgetScore(cost, budget) {
  if (!budget) return 0;
  if (cost <= budget) return MATCH_WEIGHTS.budget;
  const overRatio = (cost - budget) / budget;
  return round1(clamp(MATCH_WEIGHTS.budget * (1 - overRatio / 0.5), 0, MATCH_WEIGHTS.budget));
}

function distanceScore(distance, maxDistance) {
  if (distance == null || maxDistance == null) return 0;
  if (distance <= maxDistance) return MATCH_WEIGHTS.distance;
  const over = (distance - maxDistance) / maxDistance;
  return round1(clamp(MATCH_WEIGHTS.distance * (1 - over), 0, MATCH_WEIGHTS.distance));
}

function roomScore(propertyType, preferred) {
  if (!preferred || preferred === "Any") return MATCH_WEIGHTS.room;
  if (propertyType === preferred) return MATCH_WEIGHTS.room;
  const order = ["Single", "Double", "Triple"];
  const a = order.indexOf(propertyType);
  const b = order.indexOf(preferred);
  if (a >= 0 && b >= 0 && Math.abs(a - b) === 1) return 6;
  return 0;
}

function amenityScore(property, prefs, counts) {
  const checks = [];
  if (prefs.wifi) checks.push(hasAmenity(property, ["Wi-Fi", "Wifi"]) || costAmountSafe(property.wifi) === 0);
  if (prefs.laundry) checks.push(hasAmenity(property, ["Laundry"]) || counts.laundry > 0);
  if (prefs.ac) checks.push(hasAmenity(property, ["AC", "Air Conditioning"]));
  if (prefs.study) checks.push(hasAmenity(property, ["Study Room", "Study space", "Study"]));
  if (prefs.gym) checks.push(hasAmenity(property, ["Gym"]));
  if (prefs.transport) checks.push(counts.transport > 0);

  if (checks.length === 0) return MATCH_WEIGHTS.amenities;
  const met = checks.filter(Boolean).length;
  return round1((met / checks.length) * MATCH_WEIGHTS.amenities);
}

function costAmountSafe(v) {
  if (v === "included" || v === "Included" || v == null || v === "") return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function foodScore(property, prefs, counts) {
  if (!prefs.food) return MATCH_WEIGHTS.food;
  let score = 0;
  const inHouse = hasAmenity(property, ["Food"]) || costAmountSafe(property.food) > 0;
  if (inHouse) score += 6;
  score += Math.min(4, counts.food * 1.2);
  return round1(clamp(score, 0, MATCH_WEIGHTS.food));
}

function lifestyleScore(property, prefs, counts) {
  const lifestyle = prefs.lifestyle || "balanced";
  const tags = property.lifestyleTags || [];
  let score = 8;

  if (lifestyle === "quiet") {
    if (tags.includes("quiet")) score += 4;
    if (hasAmenity(property, ["Study Room", "Study"])) score += 2;
    if (tags.includes("social")) score -= 3;
    score += Math.min(2, counts.cafe > 0 && counts.cafe <= 2 ? 2 : counts.cafe > 3 ? 0 : 1);
  } else if (lifestyle === "social") {
    if (tags.includes("social")) score += 4;
    if (hasAmenity(property, ["Gym"])) score += 1.5;
    score += Math.min(2.5, counts.cafe * 0.6);
    score += Math.min(1.5, counts.shopping * 0.8);
  } else {
    if (tags.includes("balanced")) score += 3;
    else score += 1.5;
    score += Math.min(1.5, counts.transport * 0.7);
    score += Math.min(1, counts.cafe * 0.4);
  }

  if (prefs.laundry && counts.laundry > 0) score += 0.8;
  if (prefs.transport && counts.transport > 0) score += 0.8;
  if (prefs.food && counts.food >= 3) score += 1;

  return round1(clamp(score, 0, MATCH_WEIGHTS.lifestyle));
}

export function matchProperty(property, preferences) {
  const cost = calculateTrueCost(property);
  const counts = nearbyCounts(property);

  const budget = budgetScore(cost.estimatedActualCost, Number(preferences.budget));
  const distance = distanceScore(Number(property.distance), Number(preferences.maxDistance));
  const room = roomScore(property.roomType, preferences.roomType);
  const amenities = amenityScore(property, preferences, counts);
  const food = foodScore(property, preferences, counts);
  const lifestyle = lifestyleScore(property, preferences, counts);

  const matchScore = Math.round(budget + distance + room + amenities + food + lifestyle);

  return {
    propertyId: property.id,
    matchScore,
    budgetScore: budget,
    distanceScore: distance,
    roomScore: room,
    amenityScore: amenities,
    foodScore: food,
    lifestyleScore: lifestyle,
    cost,
    nearbyCounts: counts
  };
}

export function rankProperties(propertyList, preferences) {
  const results = propertyList.map((property) => {
    const breakdown = matchProperty(property, preferences);
    return {
      property,
      ...breakdown,
      dealBreakers: getDealBreakers(property, preferences, breakdown.cost)
    };
  });

  results.sort((a, b) => b.matchScore - a.matchScore);
  return results;
}

export function getDealBreakers(property, preferences = {}, cost) {
  const items = [];
  const deposit = Number(property.deposit);
  const rent = Number(property.rent) || 1;

  if (Number.isFinite(deposit) && deposit >= 20000) {
    items.push({
      level: "warn",
      text: `Security deposit: ₹${deposit.toLocaleString("en-IN")}`
    });
  }

  if ((property.lockInMonths || 0) >= 3) {
    items.push({
      level: "warn",
      text: `Lock-in period: ${property.lockIn}`
    });
  }

  if ((property.noticeDays || 0) >= 30) {
    items.push({
      level: property.noticeDays >= 60 ? "warn" : "info",
      text: `Notice period: ${property.noticePeriod}`
    });
  }

  if (costAmountSafe(property.electricity) > 0) {
    items.push({
      level: "warn",
      text: "Electricity is not included."
    });
  }

  if (preferences.food && costAmountSafe(property.food) === 0 && !hasAmenity(property, ["Food"])) {
    items.push({
      level: "info",
      text: "Food is not included on-site."
    });
  }

  if (cost && preferences.budget && cost.estimatedActualCost > Number(preferences.budget)) {
    items.push({
      level: "warn",
      text: `Estimated actual cost exceeds your ₹${Number(preferences.budget).toLocaleString("en-IN")} budget.`
    });
  }

  if (property.distance > Number(preferences.maxDistance || Infinity)) {
    items.push({
      level: "warn",
      text: `Distance ${property.distance} km is beyond your ${preferences.maxDistance} km preference.`
    });
  }

  if (deposit / rent >= 2.5) {
    items.push({
      level: "info",
      text: "Deposit is more than 2.5× advertised monthly rent."
    });
  }

  return items;
}

export function buildDeterministicExplanation(property, preferences, breakdown) {
  const reasons = [];
  if (breakdown.budgetScore >= 20) {
    reasons.push(`it fits within a ₹${Number(preferences.budget).toLocaleString("en-IN")} budget at an estimated ₹${breakdown.cost.estimatedActualCost.toLocaleString("en-IN")} per month`);
  } else {
    reasons.push(`the estimated monthly cost of ₹${breakdown.cost.estimatedActualCost.toLocaleString("en-IN")} sits above your ₹${Number(preferences.budget).toLocaleString("en-IN")} budget`);
  }

  if (breakdown.distanceScore >= 14) {
    reasons.push(`it is ${property.distance} km from your college, within your ${preferences.maxDistance} km range`);
  } else {
    reasons.push(`it is ${property.distance} km away, which stretches your ${preferences.maxDistance} km distance preference`);
  }

  reasons.push(`the room type is ${property.roomType}`);

  const tradeoffs = [];
  if (property.deposit >= 20000) tradeoffs.push(`a ₹${property.deposit.toLocaleString("en-IN")} security deposit`);
  if ((property.lockInMonths || 0) >= 3) tradeoffs.push(`a ${property.lockIn} lock-in`);
  if (costAmountSafe(property.electricity) > 0) tradeoffs.push("electricity billed separately");
  if (preferences.food && breakdown.foodScore < 7) tradeoffs.push("limited in-house food");

  const strength =
    breakdown.matchScore >= 80 ? "a strong match" : breakdown.matchScore >= 65 ? "a reasonable match" : "a partial match";

  let text = `This home is ${strength} because ${reasons.slice(0, 3).join(", ")}.`;
  if (tradeoffs.length) {
    text += ` The main trade-off${tradeoffs.length > 1 ? "s are" : " is"} ${tradeoffs.join(" and ")}.`;
  }
  text += " The decision is yours — this score explains fit, it does not rank a winner.";
  return text;
}
