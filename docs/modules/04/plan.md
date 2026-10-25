# Deliverable 4 implementation plan

Requested: Phase 2 — Structured Outputs and AI-Driven UI Rendering (Week 5).

The learner identifies ShelfSignal as their previously submitted technical foundation. Continue that product here. Existing structured-output code is a starting point; do not skip this deliverable or begin tool calling.

## Acceptance criteria

1. A strict Zod contract separates narrative, typed UI data, and locale metadata.
2. Unknown network/model data passes validation before entering typed components.
3. Valid data renders merchandising cards, a priority table, and action suggestions.
4. Missing, partial, duplicate, empty, unexpected, and wrong-locale outputs show recoverable states without rendering unverified sections.
5. A reviewer can inspect field-level validation results without seeing secrets or raw provider internals.
6. Actual React rendering tests cover failures and HTML-like strings.
7. Existing model calls, cancellation, export restrictions, and provenance labels remain functional.
8. GitHub contains the implementation and evidence; Vercel serves the verified version.

## Changes

- Preserve ShelfSignal's paper, cobalt, and sage visual language and illustrated product cards.
- Expand the validation lab with empty, duplicate, missing nested field, and locale mismatch cases.
- Add a compact field-level validation report within the test lab.
- Provide a readable schema reference and a generated JSON Schema from the same Zod contract.
- Test edge cases and inspect the deployed UI, then record exact outcomes and limits.
- Add a module-specific assessment and submission page in repository documentation, plus a roadmap for 5–13.

No tool-calling implementation is part of this milestone.
