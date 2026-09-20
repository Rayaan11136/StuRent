import { properties, getPropertyById } from "../data/demoData.js";
import { rankProperties, buildDeterministicExplanation, matchProperty } from "../utils/matching.js";
import { calculateTrueCost } from "../utils/costCalculator.js";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function mockGetProperties() {
  await delay(180);
  return { properties, source: "demo" };
}

export async function mockGetProperty(id) {
  await delay(120);
  const property = getPropertyById(id);
  if (!property) {
    const err = new Error("Property not found");
    err.status = 404;
    throw err;
  }
  return { property, cost: calculateTrueCost(property), source: "demo" };
}

export async function mockMatch(preferences) {
  await delay(220);
  const ranked = rankProperties(properties, preferences);
  return {
    analyzed: properties.length,
    matches: ranked,
    averageMatch: Math.round(
      ranked.reduce((s, m) => s + m.matchScore, 0) / Math.max(ranked.length, 1)
    ),
    strongMatches: ranked.filter((m) => m.matchScore >= 70).length,
    source: "demo"
  };
}

export async function mockNearby(propertyId) {
  await delay(120);
  const property = getPropertyById(propertyId);
  if (!property) throw new Error("Property not found");
  return { nearby: property.nearby || [], propertyId, source: "demo" };
}

export async function mockExplain({ property, preferences, matchBreakdown }) {
  await delay(160);
  const breakdown = matchBreakdown || matchProperty(property, preferences);
  if (!breakdown.cost) breakdown.cost = calculateTrueCost(property);
  return {
    explanation: buildDeterministicExplanation(property, preferences, breakdown),
    source: "deterministic"
  };
}
