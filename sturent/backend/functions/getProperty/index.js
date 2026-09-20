import { json, error, pathParam } from "../../shared/http.js";
import { getProperty } from "../../shared/db.js";
import { calculateTrueCost } from "../../shared/costCalculator.js";

export async function handler(event) {
  try {
    const propertyId = pathParam(event, "propertyId");
    if (!propertyId) return error(400, "Missing propertyId", "Please try again.");
    const property = await getProperty(propertyId);
    if (!property) return error(404, "Property not found", "This listing is not available.");
    return json(200, { property, cost: calculateTrueCost(property) });
  } catch (err) {
    return error(500, "Unable to retrieve properties", "Please try again.");
  }
}
