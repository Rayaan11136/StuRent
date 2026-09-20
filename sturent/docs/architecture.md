# StuRent architecture

```
                    STUDENT
                       │
                       ▼
              React Web Application
                       │
                       │ HTTPS  (VITE_API_BASE_URL only — no AWS keys)
                       ▼
               Amazon API Gateway
                       │
                       ▼
                  AWS Lambda
                 /     |      \
                /      |       \
               ▼       ▼        ▼
          DynamoDB   Bedrock   Logic
             │          │
             └────┬─────┘
                  ▼
          Personalized Results
```

## Request flow

1. The student sets preferences in the React app.
2. `POST /match` goes to API Gateway → `sturent-match` Lambda.
3. Lambda reads `StuRentProperties` from DynamoDB (or bundled sample data if the table is empty / unreachable).
4. Lambda calculates true monthly cost and a **deterministic** match breakdown. The frontend is not the source of truth when the API is up.
5. `POST /explain-match` sends that structured breakdown to Bedrock. If Bedrock fails, Lambda returns the same deterministic paragraph the UI can also generate locally.
6. Nearby places come from `StuRentNearby` (GSI on `propertyId`), designed to be replaced by a maps API later.

## Trust rules

- Estimated and owner-provided fields are never labelled Verified.
- Match scores cannot be boosted by owner payments.
- Explanations may not invent amenities, prices, distances, or policies.

## Fallback

```
Production mode → AWS API
If unavailable → demo / local matching engine
```

The product remains demonstrable without live AWS.
