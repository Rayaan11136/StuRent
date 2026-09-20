# StuRent

### Tagline

Find a place that fits your life.

Student housing, without the hidden surprises.

---

## Problem

Students often compare homes on advertised rent alone. A listing that says **₹10,000/month** can become ₹10,000 rent plus maintenance, electricity, Wi-Fi and food. Deposits, lock-in periods, notice periods, and whether a fact is verified or just owner-provided are easy to miss. Location quality for student life is also hard to judge from a rent number.

## Solution

StuRent helps students understand the **real cost and lifestyle implications** of a home before they commit.

It never says “this is the best property.” It explains why a home matches a student’s preferences, what the trade-offs are, and leaves the decision with the student.

Payment must **never** affect a compatibility score. A landlord cannot pay to rank higher or hide conditions.

## Key Features

- Personalized, explainable matching (budget 30%, distance 20%, room 15%, amenities 10%, food 10%, lifestyle 15%)
- True monthly cost (rent + maintenance + electricity + Wi-Fi + food + other recurring)
- Transparency labels: Verified, Owner provided, Estimated — or **Not provided**
- Deal-breaker surfacing (deposits, lock-in, notice, excluded electricity)
- Side-by-side comparison (up to 3 homes, no “winner”)
- Nearby student services (food, laundry, shopping, transport, cafés, pharmacy)
- AI match explanations via Amazon Bedrock, with a deterministic Lambda fallback

## AWS Architecture

```
                 ┌────────────────────┐
                 │   StuRent React    │
                 │      Frontend      │
                 └─────────┬──────────┘
                           │
                           ▼
                 ┌────────────────────┐
                 │   API Gateway      │
                 └─────────┬──────────┘
                           │
                           ▼
                 ┌────────────────────┐
                 │      Lambda        │
                 │ Matching           │
                 │ Cost Calculation   │
                 │ API Logic          │
                 └──────┬───────┬─────┘
                        │       │
                        ▼       ▼
              ┌────────────┐ ┌────────────┐
              │ DynamoDB   │ │  Bedrock   │
              │ Properties │ │ AI Explain │
              │ Users      │ │ Match Text │
              │ Nearby     │ │            │
              └────────────┘ └────────────┘
```

- **Amazon API Gateway** (HTTP API) exposes REST routes.
- **AWS Lambda** scores homes, calculates true cost, and talks to Bedrock.
- **Amazon DynamoDB** stores properties, nearby places, and user profiles.
- **Amazon Bedrock** writes short natural-language explanations from structured match data only.

The React app never holds `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY`. It only calls the public API URL.

If the API is unset or unavailable, the UI falls back to the same matching engine and **fictional sample listings**.

## Tech Stack

- React, Vite, JavaScript, CSS
- Framer Motion, Lucide React
- AWS: API Gateway, Lambda, DynamoDB, Bedrock
- Optional later: Cognito, S3 + CloudFront

## Local Setup

Requirements: Node.js 20+.

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

Optional local API (same routes as Lambda):

```bash
cd backend
npm install
npm run export-data
npm run local
```

Then set `VITE_API_BASE_URL=http://localhost:4000` in `frontend/.env`.

## Environment Variables

Frontend (`frontend/.env.example`):

```
VITE_API_BASE_URL=
```

Backend (`backend/.env.example`):

```
TABLE_PROPERTIES=StuRentProperties
TABLE_USERS=StuRentUsers
TABLE_NEARBY=StuRentNearby
BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
AWS_REGION=ap-south-1
```

Never commit secrets. Configure AWS credentials with the AWS CLI / IAM role, not with files in this repo.

## Deployment

1. Enable Bedrock model access in the target region (for example `ap-south-1`).
2. From `backend/infrastructure`:

```bash
sam build --template-file template.yaml
sam deploy --guided
```

3. Seed tables:

```bash
cd backend
npm run export-data
npm run seed
```

4. Copy the API Gateway URL into `frontend/.env` as `VITE_API_BASE_URL`.
5. Build the frontend: `cd frontend && npm run build`.
6. Host `frontend/dist` on S3 + CloudFront (or any static host). Configure SPA fallback to `index.html`.

IAM on each Lambda is least-privilege: property functions read the properties table; nearby reads nearby + properties; explain-match may invoke Bedrock only.

## Demo Data

**Current property listings are fictional sample data for demonstration purposes.** They are not real homes, are not available to rent, and are labelled in the product UI.

## Future Improvements

- Real verified listings and availability
- Student authentication (Cognito)
- Real maps / places API for Nearby
- Landlord dashboard, booking, messaging, payments
- Student communities
- Optional student premium features (never tied to match score)

## Business model (product, not scoring)

Owners may later pay for listing tools, verification, or qualified leads. Student-service commissions are possible. **None of that may change match percentages or hide negative information.**
