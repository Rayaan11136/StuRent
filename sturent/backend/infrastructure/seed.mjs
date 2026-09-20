/**
 * Seed DynamoDB tables. Requires AWS credentials in the environment — never commit them.
 */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const properties = JSON.parse(readFileSync(join(root, "data/properties.json"), "utf8"));
const nearby = JSON.parse(readFileSync(join(root, "data/nearby.json"), "utf8"));

const TABLE_PROPERTIES = process.env.TABLE_PROPERTIES || "StuRentProperties";
const TABLE_NEARBY = process.env.TABLE_NEARBY || "StuRentNearby";
const TABLE_USERS = process.env.TABLE_USERS || "StuRentUsers";

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));

async function putAll(table, items) {
  for (const item of items) {
    await db.send(new PutCommand({ TableName: table, Item: item }));
  }
}

await putAll(TABLE_PROPERTIES, properties);
await putAll(TABLE_NEARBY, nearby);
await putAll(TABLE_USERS, [
  {
    userId: "demo-student",
    name: "Aanya Sharma",
    college: "Christ University",
    budget: 15000,
    maxDistance: 3,
    roomType: "Single",
    preferences: { wifi: true, food: true, laundry: true, transport: true, ac: false, study: true, gym: false },
    lifestyle: "balanced",
    savedProperties: []
  }
]);

console.log(`Seeded ${properties.length} properties, ${nearby.length} nearby rows, 1 demo user.`);
