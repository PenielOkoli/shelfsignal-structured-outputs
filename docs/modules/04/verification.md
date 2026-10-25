# Verification — deliverable 4

Date: 25 October 2026 (Africa/Lagos).
Implementation commit: `208c01784767f44eca6ce66d2a5a5e0ffa002709`.

| Check | Observed result |
|---|---|
| TypeScript | Passed in the dedicated repository |
| Automated tests | 28 passed, 0 failed; actual React rendering plus schema/boundary checks |
| Local production build | Passed; home/API dynamic, guide/schema static |
| Git push → Vercel | Automatic production build triggered and reached Ready |
| Live `/`, `/guide`, `/schema` | HTTP 200, `X-Content-Type-Options: nosniff` |
| Invalid input / malformed JSON | HTTP 400 |
| Foreign Origin | HTTP 403 |
| Wrong media type | HTTP 415 |
| Oversized request | HTTP 413 |
| Real Groq request, en-NG / en-GB | HTTP 200 in both locales; valid schema, three cards/priorities/actions, actual React rendering passed |
| Node.js configuration | Project and deployment both use 22.x, matching package.json |
| Browser initial page | Live sample cards, catalog table, checkboxes, source label, number-4 footer, and key-pending indicator observed in accessibility snapshot |
| Interactive lab / viewport QA | Not completed: browser use was disabled in Work settings before interactions could run |

## Automated coverage

The tests render complete and incomplete plans through real React components. They verify that missing/invalid sections do not render cards, tables, or checkboxes; full-envelope failures show recovery; unsafe HTML-like text is escaped; duplicate IDs are rejected; empty actions are withheld; locale mismatch fails closed; missing placement produces `cards.0.placement`; diagnostic output excludes untrusted field values; and multiple errors in one section announce one affected section.

The lab contains ten scenarios. Unit/rendering tests establish their decoded and rendered behavior, but are not a substitute for the unfinished browser interaction and mobile checks.

## Reproduce

```sh
npm run check
node --import tsx scripts/verify-deployment.tsx https://shelfsignal-structured-outputs.vercel.app --live
```

The deployment verifier writes `live-verification.json`. With `--live`, it records provider failures and exits unsuccessfully unless both locales pass. It never substitutes fixtures for provider responses.

## Submission status

Implementation, repository, automatic deployment, and automated checks are complete. Live-AI verification also passed after the sensitive Production key was configured and deployment `dpl_2BE216RkrcPPKSyJB7Nw3piCgUzY` reached Ready. Browser interaction/mobile review remains outstanding and must not be described as passed.
