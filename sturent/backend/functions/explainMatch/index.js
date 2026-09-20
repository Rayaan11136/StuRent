import { json, error, parseBody } from "../../shared/http.js";
import { explainMatch } from "../../shared/explain.js";
import { matchProperty, getDealBreakers } from "../../shared/matching.js";
import { calculateTrueCost } from "../../shared/costCalculator.js";

export async function handler(event) {
  try {
    const body = parseBody(event);
    if (!body?.property || !body?.preferences) {
      return error(400, "Missing payload", "Property and preferences are required.");
    }

    const matchBreakdown =
      body.matchBreakdown || matchProperty(body.property, body.preferences);
    if (!matchBreakdown.cost) matchBreakdown.cost = calculateTrueCost(body.property);
    matchBreakdown.dealBreakers = getDealBreakers(
      body.property,
      body.preferences,
      matchBreakdown.cost
    );

    const result = await explainMatch({
      property: body.property,
      preferences: body.preferences,
      matchBreakdown
    });

    return json(200, result);
  } catch (err) {
    return error(500, "Unable to explain match", "Please try again.");
  }
}
