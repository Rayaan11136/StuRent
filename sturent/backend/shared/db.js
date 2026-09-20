import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const TABLE_PROPERTIES = process.env.TABLE_PROPERTIES || "StuRentProperties";
const TABLE_NEARBY = process.env.TABLE_NEARBY || "StuRentNearby";

function fallbackProperties() {
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    join(here, "fallbackProperties.json"),
    join(here, "../../data/properties.json")
  ];
  for (const file of candidates) {
    try {
      return JSON.parse(readFileSync(file, "utf8"));
    } catch {
      /* try next location */
    }
  }
  console.error("Fallback properties unavailable");
  return [];
}

export async function listProperties() {
  try {
    const res = await client.send(new ScanCommand({ TableName: TABLE_PROPERTIES }));
    const items = res.Items || [];
    if (items.length) return items.map(normalizeProperty);
  } catch (err) {
    console.error("DynamoDB scan failed, using bundled sample data", err.message);
  }
  return fallbackProperties();
}

export async function getProperty(propertyId) {
  try {
    const res = await client.send(
      new GetCommand({ TableName: TABLE_PROPERTIES, Key: { propertyId } })
    );
    if (res.Item) return normalizeProperty(res.Item);
  } catch (err) {
    console.error("DynamoDB get failed", err.message);
  }
  return fallbackProperties().find((p) => p.id === propertyId || p.propertyId === propertyId) || null;
}

export async function getNearby(propertyId) {
  try {
    const res = await client.send(
      new QueryCommand({
        TableName: TABLE_NEARBY,
        IndexName: "propertyId-index",
        KeyConditionExpression: "propertyId = :pid",
        ExpressionAttributeValues: { ":pid": propertyId }
      })
    );
    if (res.Items?.length) return res.Items;
  } catch (err) {
    console.error("Nearby query failed", err.message);
  }
  const property = await getProperty(propertyId);
  return property?.nearby || [];
}

function normalizeProperty(item) {
  return {
    ...item,
    id: item.id || item.propertyId,
    propertyId: item.propertyId || item.id
  };
}
