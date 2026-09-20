/**
 * Writes data/properties.json and data/nearby.json from the frontend demo dataset.
 */
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { properties } from "../../frontend/src/data/demoData.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
mkdirSync(join(root, "data"), { recursive: true });

const nearby = [];
for (const p of properties) {
  (p.nearby || []).forEach((place, i) => {
    nearby.push({
      nearbyId: `${p.id}-${place.type}-${i}`,
      propertyId: p.id,
      ...place
    });
  });
}

const withKeys = properties.map((p) => ({ ...p, propertyId: p.id }));
writeFileSync(join(root, "data/properties.json"), JSON.stringify(withKeys, null, 2));
writeFileSync(join(root, "data/nearby.json"), JSON.stringify(nearby, null, 2));
writeFileSync(
  join(root, "backend/shared/fallbackProperties.json"),
  JSON.stringify(withKeys)
);
console.log(`Exported ${withKeys.length} properties and ${nearby.length} nearby places.`);
