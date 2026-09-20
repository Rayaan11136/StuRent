/**
 * Local API that uses the same matching / cost / explain handlers as Lambda.
 * Useful when AWS is not deployed. The React app should still set VITE_API_BASE_URL
 * to this server, or rely on built-in demo fallback.
 */
import http from "http";
import { properties } from "../frontend/src/data/demoData.js";
import { rankProperties, matchProperty, getDealBreakers, buildDeterministicExplanation } from "./shared/matching.js";
import { calculateTrueCost } from "./shared/costCalculator.js";

const PORT = Number(process.env.PORT || 4000);

function send(res, code, body) {
  res.writeHead(code, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
  });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 200, {});

  const url = new URL(req.url, `http://localhost:${PORT}`);

  try {
    if (req.method === "GET" && url.pathname === "/properties") {
      return send(res, 200, { properties, analyzed: properties.length });
    }

    const one = url.pathname.match(/^\/properties\/([^/]+)$/);
    if (req.method === "GET" && one) {
      const property = properties.find((p) => p.id === decodeURIComponent(one[1]));
      if (!property) return send(res, 404, { error: "Property not found", message: "This listing is not available." });
      return send(res, 200, { property, cost: calculateTrueCost(property) });
    }

    const near = url.pathname.match(/^\/properties\/([^/]+)\/nearby$/);
    if (req.method === "GET" && near) {
      const property = properties.find((p) => p.id === decodeURIComponent(near[1]));
      if (!property) return send(res, 404, { error: "Property not found", message: "Please try again." });
      return send(res, 200, { propertyId: property.id, nearby: property.nearby || [] });
    }

    if (req.method === "POST" && url.pathname === "/match") {
      const preferences = await readBody(req);
      const matches = rankProperties(properties, preferences);
      return send(res, 200, {
        analyzed: properties.length,
        matches,
        strongMatches: matches.filter((m) => m.matchScore >= 70).length,
        averageMatch: Math.round(matches.reduce((s, m) => s + m.matchScore, 0) / matches.length)
      });
    }

    if (req.method === "POST" && url.pathname === "/explain-match") {
      const body = await readBody(req);
      const breakdown = body.matchBreakdown || matchProperty(body.property, body.preferences);
      if (!breakdown.cost) breakdown.cost = calculateTrueCost(body.property);
      breakdown.dealBreakers = getDealBreakers(body.property, body.preferences, breakdown.cost);
      return send(res, 200, {
        explanation: buildDeterministicExplanation(body.property, body.preferences, breakdown),
        source: "deterministic"
      });
    }

    return send(res, 404, { error: "Not found", message: "Unknown route." });
  } catch (err) {
    console.error(err);
    return send(res, 500, { error: "Server error", message: "Please try again." });
  }
});

server.listen(PORT, () => {
  console.log(`StuRent local API http://localhost:${PORT}`);
});
