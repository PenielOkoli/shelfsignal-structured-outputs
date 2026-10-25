# ShelfSignal — Deliverable 4

**Structured Outputs and AI-Driven UI Rendering · Phase 2 · Week 5**

Less guesswork. More shelf appeal. ShelfSignal turns a retail brief into validated product cards, a catalog-backed priority table, and an action checklist.

This is a **new repository and separate Vercel deployment** continuing [the earlier ShelfSignal foundation](https://github.com/PenielOkoli/shelfsignal-phase-2), copied from commit `21e619836b9cb3020490046d4474610572e3ca9f`. Earlier submitted repositories and deployments remain unchanged.

## Submission

- Repository: https://github.com/PenielOkoli/shelfsignal-structured-outputs
- Live app: https://shelfsignal-structured-outputs.vercel.app
- [Deployment and Groq configuration](docs/deployment.md)
- [Number 4 requirements and reviewer walkthrough](docs/modules/04/assessment.md)
- [Implementation plan](docs/modules/04/plan.md)
- [Verification evidence](docs/modules/04/verification.md)
- [Remaining deliverables and repository policy](docs/roadmap.md)

The app is deployed and automatically connected to this repository. TypeScript, all 28 tests, the production build, and live HTTP boundary checks pass. **Live Groq generation is configured and verified for en-NG and en-GB.** Browser interaction/mobile QA remains outstanding because browser use was disabled during verification.

## What to inspect

| Evidence | Location |
|---|---|
| Strict Zod output contract | [src/lib/schema.ts](src/lib/schema.ts) |
| Typed React components | [src/components/plan-view.tsx](src/components/plan-view.tsx) |
| Field-level validation report | [src/components/validation-report.tsx](src/components/validation-report.tsx) |
| Interactive fallback lab | [src/components/studio.tsx](src/components/studio.tsx) |
| Ten response fixtures | [src/lib/samples.ts](src/lib/samples.ts) |
| Generated JSON Schema reference | [src/app/schema/page.tsx](src/app/schema/page.tsx), live route `/schema` |
| Live Groq integration | [src/lib/server/groq.ts](src/lib/server/groq.ts) |
| Schema/boundary/rendering tests | [tests](tests) |
| Boundaries and privacy | [Architecture](docs/architecture.md), [security](docs/security.md) |

## Try it

1. Review the initial **Sample data** plan. It is a fixture, not a live AI result.
2. Open **Test states**. Try missing cards, an invalid priority, unexpected fields, truncated JSON, HTML-like text, empty actions, duplicate products, missing placement, or a locale mismatch.
3. Inspect the validation report. Only complete, verified sections reach components. Export requires a fully valid plan.
4. Restore the sample, check off a task, open JSON, or export the plan with its source label.
5. Follow **Explore the output contract** to see metadata, narrative, and typed UI data separated explicitly.
6. With the server key configured, **Generate with Groq** makes a real provider request. A failed request keeps the previous plan visible and clearly labeled.

The studio preserves ShelfSignal's paper, cobalt, and sage design with illustrated merchandise. The validation lab is an optional inspection tool, while the main flow stays focused on the shop owner's planning task.

## Run and verify

Node.js 22.x and npm:

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
```

`npm run check` runs type checking, all 28 tests, and the production build. Tests render real React components and cover unsafe strings, invalid envelopes, partial sections, duplicates, field paths, and locale mismatch.

Copy `.env.example` to `.env.local` for local provider configuration. Set `GROQ_API_KEY` only on the server. Optional `GROQ_MODEL` defaults to `openai/gpt-oss-20b`; `AI_ENABLED=false` disables live generation. Configure the new Vercel project's Production environment separately and redeploy. No secret belongs in GitHub or a `NEXT_PUBLIC_` variable.

## Scope and honesty

The catalog is sample data. No purchases or inventory writes are connected. Checklist state lasts for the page session. English Nigeria/UK locales demonstrate metadata and regional formatting, not multiple language translations. Shape validation cannot prove recommendations are commercially effective. Review suggestions before acting on them.

`docs/baseline-live-verification.json` preserves predecessor evidence only. Current checks are listed under `docs/modules/04/verification.md`.
