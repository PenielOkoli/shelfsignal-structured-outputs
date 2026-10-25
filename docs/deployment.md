# Deployment — deliverable 4

- Repository: https://github.com/PenielOkoli/shelfsignal-structured-outputs
- Live app: https://shelfsignal-structured-outputs.vercel.app
- Output contract: https://shelfsignal-structured-outputs.vercel.app/schema
- Vercel project: `shelfsignal-structured-outputs`
- Git connection: `PenielOkoli/shelfsignal-structured-outputs`, production branch `main`.

## Verified on 25 October 2026

The push of commit `208c01784767f44eca6ce66d2a5a5e0ffa002709` automatically triggered a Vercel production deployment. Deployment `dpl_D2mAgv8QP78uByoWQpCsAWyzcNPS` reached **Ready** and received the live alias above. No manual deployment was needed to establish the GitHub-to-Vercel connection.

The home, guide, and schema pages returned HTTP 200. Invalid request, malformed JSON, foreign origin, wrong content type, and oversized body checks passed. See [machine-readable evidence](modules/04/live-verification.json) and [verification notes](modules/04/verification.md).

## Remaining provider configuration

The new project's Production environment currently has `GROQ_MODEL`, but no `GROQ_API_KEY`. Real generation correctly returns HTTP 503 with `code: configuration`. The sample, validation lab, typed UI, and schema reference remain usable. Live AI is **not yet verified for this deployment**.

The learner will add the key directly at:
https://vercel.com/penielokolis-projects/shelfsignal-structured-outputs/settings/environment-variables

1. Add `GROQ_API_KEY` for **Production**. Do not expose it through a `NEXT_PUBLIC_` variable.
2. Redeploy the project so the function receives the new environment.
3. Run the live verification command below. A successful run must validate and render responses for both supported locales.

```sh
node --import tsx scripts/verify-deployment.tsx https://shelfsignal-structured-outputs.vercel.app --live
```

This project is independent of `shelfsignal-phase-2`; the previously submitted remote repository and deployment were not changed. Predecessor provider evidence is retained separately and never counted as verification of this project.

## Reproduce deployment

Use the Next.js preset, Node.js 22.x, `npm ci`, and `npm run build`. Keep the new repository connected so pushes to `main` trigger production builds. Environment files and Vercel link metadata are ignored by Git.
