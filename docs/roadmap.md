# FlexiSAF internship delivery tracker

Owner: Peniel Okoli. Updated: 25 October 2026 (Africa/Lagos).

## Working agreement

- Complete work ahead of the weekly schedule, in reviewable increments.
- Continue an existing product when the curriculum requires continuity.
- Keep requirements, implementation, tests, deployment evidence, and submission instructions in the relevant GitHub repository.
- Give each milestone a clear identity while preserving the chosen product's design language.
- Use GitHub-connected Vercel deployment. Record the actual live URL and verified commit.
- Each new deliverable MUST have a new GitHub repository and its own connected Vercel deployment. Carry forward the relevant product foundation and document its source; leave previously submitted repositories and deployments unchanged.
- Distinguish tested behavior, live model results, fixtures, and unfinished work. Never invent evidence or the learner's personal review.

## Supplied repositories

The user reports three earlier submissions and explicitly identifies ShelfSignal as their number 2 submission (technical foundation). Their requested next deliverable is number 4, structured outputs. Existing repository descriptions do not override the user's submission mapping.

| Repository | Observed scope |
|---|---|
| https://github.com/PenielOkoli/coinpilot-ai-phase-1 | Next.js and TypeScript foundation, references a separate original Module 1 brief |
| https://github.com/PenielOkoli/gatherwell-phase-1 | Workshop-planning foundation and product brief |
| https://github.com/PenielOkoli/shelfsignal-phase-2 | Structured outputs, typed rendering, fallback lab, Groq integration: matches attached module 4 |

No supplied repository is yet verified as the submitted module 3 streaming-chat deliverable. Do not mark that module missing or complete solely from repository titles.

## Remaining curriculum

| Module | Scope | Required evidence | Status |
|---|---|---|---|
| 4 | Structured outputs | Schema, typed UI, fallback states, rendering tests, live URL | Built and deployed in shelfsignal-structured-outputs; 28 tests pass; live AI verified for both locales; browser interaction/mobile QA outstanding |
| 5 | Tool calling | Safe tool schemas, action previews, approval gate, server validation, progress/failure/rollback, logs | Next after number 4; not started |
| 6 | Retrieval | Source selection, grounded answers, citations, source inspection, uncertainty, no-results | Planned |
| 7 | Supervised agent | Visible plan, approval, pause/resume/cancel, blocked/failed states, activity log | Planned |
| 8 | Multiple AI roles | Distinct roles, assignments, handoffs, comparisons, synthesis, human decision log | Planned |
| 9 | Evaluations | Golden tasks, rubric, real results, baseline comparison, feedback, release gates | Planned |
| 10 | Security | Server boundaries, validation, sanitization tests, abuse limits, privacy and retention | Planned |
| 11 | Performance | Measured baseline/after, streaming or long-history improvement, bundle evidence | Planned |
| 12 | Coding-agent workflow | Issue and acceptance criteria, plan before edits, reviewed diff, tests, policy, learner comments | Planned; learner must supply their own review/comments |
| 13 | Full-stack integration | Durable persistence, real sessions/users, persisted admin review, integration tests | Planned |

Module 6's supplied submission bullet list duplicates the agent module. Satisfy its detailed retrieval outcome and record this discrepancy in its assessment mapping.

## Milestone structure

Each milestone should have `docs/modules/NN/assessment.md`, an implementation plan, verification evidence, and a submission note. Use a milestone Git tag after verification. Keep tests beside the app and link them from the evidence table. A milestone is ready only when the required behavior works, relevant checks pass, Vercel is deployed, and limitations are accurately recorded.

## Delivery batches

1. Confirm module numbering and establish the continuation product; complete the next milestone.
2. Retrieval plus supervised workflow (6–7).
3. Role collaboration plus evaluations (8–9).
4. Security plus measured performance (10–11).
5. Engineering workflow evidence plus durable full-stack integration (12–13).

Batching is a planning aid, not a claim of completion. Resume from the last verified milestone rather than waiting for the calendar week.
