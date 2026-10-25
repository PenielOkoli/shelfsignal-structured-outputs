# Product brief — ShelfSignal continuation

## Audience and problem

Independent shop owners often know which products they carry but struggle to turn a loose promotional idea into a coherent display and practical preparation checklist. A long chatbot paragraph is difficult to act on or compare with the product catalog.

## Product idea

ShelfSignal turns a short merchandising brief into three coordinated surfaces: product display cards, a stock-priority table, and a short action checklist. A narrative summary explains the overall direction while structured fields drive the actual interface.

This deliverable continues the existing ShelfSignal foundation in a separate repository and deployment, as requested by the learner. Source: https://github.com/PenielOkoli/shelfsignal-phase-2 at commit 21e619836b9cb3020490046d4474610572e3ca9f. It is not connected to a real shop. The three-product catalog has sample prices and stock counts.

## Core journey

Enter a brief → request a plan from Groq → validate the complete response → render typed cards/table/actions → review and check off tasks → export a validated JSON plan.

The initial sample makes the UI immediately explorable. A validation lab lets reviewers trigger failures without needing a provider key or waiting for a real model to make a mistake.

## Scope

- Product IDs are fixed to mug, tote, and notebook; price/stock remain trusted catalog facts.
- Model output suggests display copy, placement, prioritization, and non-executable tasks.
- Live Groq structured generation, timeout, cancellation, configuration errors, provider errors, and validation errors.
- Strict schemas and visible section-level and full-response fallback states.
- English regional locales `en-NG` and `en-GB`; locale metadata is separate from content.
- No accounts, checkout, order placement, stock writes, customer data, cross-device storage, sales prediction, or live inventory integration.

## Success criteria

A valid response renders all three UI surfaces without prose parsing. Missing or invalid sections never crash the UI or become executable recommendations. A bad envelope shows a recoverable full fallback. Export is disabled for partially validated or invalid plans. Catalog figures are never accepted from model output. UI and documentation clearly distinguish sample, test, and live output.
