import { json, error, parseBody } from "../../shared/http.js";
import { listProperties } from "../../shared/db.js";
import { rankProperties } from "../../shared/matching.js";

export async function handler(event) {
  try {
    const preferences = parseBody(event);
    if (!preferences) return error(400, "Invalid JSON", "Please try again.");
    if (!preferences.budget || !preferences.maxDistance || !preferences.roomType) {
      return error(400, "Incomplete preferences", "Budget, distance and room type are required.");
    }

    const properties = await listProperties();
    const matches = rankProperties(properties, preferences);
    const strongMatches = matches.filter((m) => m.matchScore >= 70).length;
    const averageMatch = Math.round(
      matches.reduce((s, m) => s + m.matchScore, 0) / Math.max(matches.length, 1)
    );

    return json(200, {
      analyzed: properties.length,
      matches,
      strongMatches,
      averageMatch
    });
  } catch (err) {
    return error(500, "Unable to match properties", "Please try again.");
  }
}
