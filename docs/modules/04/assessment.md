# Number 4 — Structured Outputs and AI-Driven UI Rendering

Phase 2, Week 5. This is a separate submission continuing ShelfSignal.

| Requirement | Implementation / evidence |
|---|---|
| Define an output schema | `src/lib/schema.ts`: strict Zod response and section contracts |
| Typed UI components | `src/components/plan-view.tsx`: cards, priority table, checklist with inferred types |
| Invalid, partial, missing, unexpected fields | `decodePlan`: envelope checks and independent complete-section validation |
| Visible fallback | Section and full-plan recovery states, ten interactive test scenarios |
| Separate prose and machine-readable data | `summary` vs. `cards`, `priorities`, `actions`; generated schema reference at `/schema` |
| Rendering edge-case tests | `tests/rendering.test.tsx` and `tests/module-04.test.tsx`, using real React rendering |
| Locale-ready structured fields | Separate `locale`, language metadata and Intl number formatting; en-NG and en-GB |
| Live provider integration | Server-only Groq via AI SDK `generateText` and `Output.object` |
| Safe rendering | React escapes text, IDs are allowlisted, catalog facts remain application-owned |
| Validation evidence | Field paths, four section results, export gate, and recovery controls in the lab |

## Reviewer walkthrough

1. Open the studio. Initial cards/table/checklist are labeled **Sample data**.
2. Open **Test states** and select **Missing placement**. The report identifies `cards.0.placement`; cards are withheld, while the table and checklist remain.
3. Select **Invalid priority**. Several invalid fields count as one withheld section.
4. Select **Empty actions** or **Duplicate products**. Only the affected section is withheld; export is disabled.
5. Select **Unexpected field**, **Truncated JSON**, or **Locale mismatch**. Full recovery UI replaces recommendations.
6. Select **HTML-like text**. Script-like content appears literally and never executes.
7. Restore the sample. Check an action, inspect JSON, and export the validated plan with its provenance.
8. Follow **Explore the output contract** to see the generated JSON Schema and separation of metadata, prose, and UI data.
9. Generate a real plan once the new deployment has its Groq key configured. Confirm **Groq output**, matching locale, and **Schema verified**.

## Verification

The source passes TypeScript and 28 automated tests. Deployment-specific checks are recorded in `verification.md`; do not interpret the predecessor's historical evidence as a result from this repository.

## Limits

Sample catalog; no real inventory writes or purchases. Checklist state lasts only for the page session. Regional English formatting does not imply translation into two languages. Validation checks shape and known identifiers, not the commercial accuracy of recommendations. The per-instance request limiter is not a durable distributed quota.
