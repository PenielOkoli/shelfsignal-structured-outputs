# Deployment — deliverable 4

- Repository: https://github.com/PenielOkoli/shelfsignal-structured-outputs
- Live app: https://shelfsignal-structured-outputs.vercel.app
- Output contract: https://shelfsignal-structured-outputs.vercel.app/schema
- Vercel project: `shelfsignal-structured-outputs`
- Git connection: `PenielOkoli/shelfsignal-structured-outputs`, production branch `main`.

## Verified on 25 October 2026

The push of commit `208c01784767f44eca6ce66d2a5a5e0ffa002709` automatically triggered a Vercel production deployment. Deployment `dpl_D2mAgv8QP78uByoWQpCsAWyzcNPS` reached **Ready** and received the live alias above. No manual deployment was needed to establish the GitHub-to-Vercel connection.

The home, guide, and schema pages returned HTTP 200. Invalid request, malformed JSON, foreign origin, wrong content type, and oversized body checks passed. See [machine-readable evidence](modules/04/live-verification.json) and [verification notes](modules/04/verification.md).

## Node.js and live provider configuration

On 25 October 2026, the Vercel project's Node.js setting was changed from 24.x to **22.x**, matching the repository's engines requirement. The new production deployment reports Node.js 22.x. This resolves the project/repository version mismatch.

GROQ_API_KEY is stored as a **sensitive Production variable** and never committed to source. GROQ_MODEL is openai/gpt-oss-20b. After redeployment, real provider requests passed for **en-NG and en-GB**: each returned HTTP 200, three cards, three priorities, and three actions; schema validation and real React rendering passed.

Verified deployment: dpl_2BE216RkrcPPKSyJB7Nw3piCgUzY.

To configure or replace the key, use the project's Vercel environment settings and redeploy. Keep it server-side. Reproduce verification with:

```sh
node --import tsx scripts/verify-deployment.tsx https://shelfsignal-structured-outputs.vercel.app --live
```

This project is independent of `shelfsignal-phase-2`; the previously submitted remote repository and deployment were not changed. Predecessor provider evidence is retained separately and never counted as verification of this project.

## Reproduce deployment

Use the Next.js preset, Node.js 22.x, `npm ci`, and `npm run build`. Keep the new repository connected so pushes to `main` trigger production builds. Environment files and Vercel link metadata are ignored by Git.
