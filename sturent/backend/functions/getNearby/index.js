import { json, error, pathParam } from "../../shared/http.js";
import { getNearby } from "../../shared/db.js";

export async function handler(event) {
  try {
    const propertyId = pathParam(event, "propertyId");
    if (!propertyId) return error(400, "Missing propertyId", "Please try again.");
    const nearby = await getNearby(propertyId);
    return json(200, { propertyId, nearby });
  } catch (err) {
    return error(500, "Unable to retrieve nearby places", "Please try again.");
  }
}
