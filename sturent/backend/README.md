# StuRent backend

Serverless API for matching, true cost, nearby places, and Bedrock explanations.

## Layout

- `functions/` — Lambda entrypoints
- `shared/` — matching, cost, DynamoDB access, Bedrock client
- `infrastructure/template.yaml` — SAM (API Gateway + DynamoDB + IAM)
- `local-server.js` — same routes without AWS, for demos

## Commands

```bash
npm install
npm run export-data
npm run local
```

Deploy:

```bash
cd infrastructure
sam build --template-file template.yaml
sam deploy --guided
```

Seed (needs AWS credentials in the environment, not in git):

```bash
npm run seed
```

## Notes

- Matching weights live in `shared/matching.js` and are copied to the frontend utils for demo fallback. Keep them aligned.
- Bedrock is only used for prose. Scores always come from the rule engine.
- Lambda IAM: read-only DynamoDB for listing/match/nearby; Bedrock invoke only on explain-match.
