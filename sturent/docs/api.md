# StuRent API

Base URL: value of `VITE_API_BASE_URL` (API Gateway stage URL or `http://localhost:4000`).

All JSON. CORS enabled for browser clients.

Errors:

```json
{
  "error": "Unable to retrieve properties",
  "message": "Please try again."
}
```

## `GET /properties`

Returns sample or DynamoDB listings.

## `GET /properties/{propertyId}`

One listing plus true-cost object:

```json
{
  "advertisedRent": 10500,
  "estimatedActualCost": 12100,
  "breakdown": {
    "rent": 10500,
    "maintenance": 800,
    "electricity": 500,
    "wifi": 300,
    "food": 0
  }
}
```

Included amounts are treated as `0`. Estimated fields keep their estimated status on the property record.

## `POST /match`

Body:

```json
{
  "budget": 15000,
  "maxDistance": 3,
  "roomType": "Single",
  "wifi": true,
  "food": true,
  "laundry": true,
  "transport": true,
  "ac": false,
  "study": true,
  "gym": false,
  "lifestyle": "balanced"
}
```

Returns ranked `matches` with `matchScore`, `budgetScore`, `distanceScore`, `roomScore`, `amenityScore`, `foodScore`, `lifestyleScore`, cost, and deal-breakers.

## `POST /explain-match`

Body: `{ "property": {}, "preferences": {}, "matchBreakdown": {} }`

Uses Bedrock when available; otherwise a deterministic explanation.

## `GET /properties/{propertyId}/nearby`

Nearby student-life sample rows for that home.
