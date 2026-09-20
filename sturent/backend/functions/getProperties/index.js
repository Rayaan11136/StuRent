import { json, error } from "../../shared/http.js";
import { listProperties } from "../../shared/db.js";

export async function handler() {
  try {
    const properties = await listProperties();
    return json(200, { properties, analyzed: properties.length });
  } catch (err) {
    return error(500, "Unable to retrieve properties", "Please try again.");
  }
}
