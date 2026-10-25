# Security and operational limits

## Implemented

- Groq provider access is isolated behind `import 'server-only'`.
- `GROQ_API_KEY` has no `NEXT_PUBLIC_` prefix and is never passed to client props.
- Environment files and Vercel metadata are Git-ignored; `.env.example` is a placeholder-only exception.
- Input is strict runtime-validated: 20–1,000 character brief and supported locale only.
- Request parsing limits actual bytes to 8 KiB, not a client-supplied Content-Length.
- Unsupported content types, malformed JSON, foreign Origin headers and invalid input are rejected before provider use.
- Live calls have no automatic retries, a 25-second timeout, and 3,000 maximum output tokens. UI timeout is 32 seconds; cancellation ignores any stale response.
- Best-effort per-instance guard: 10 live calls per minute and at most two concurrent calls. This is not a global or durable quota.
- Provider error details, raw failed output, input brief, and credentials are not explicitly logged by application code.
- Responses are no-store. Provider errors are generic. No automatic demo substitution conceals a failed live request.
- Strict object schemas, enum allowlists, unique IDs, length bounds, and known catalog references constrain output.
- Model strings render as escaped text. There is no raw HTML injection, arbitrary URL fetching, remote code, purchasing, or inventory modification.
- Framing is denied, MIME sniffing disabled, device capabilities disabled, referrer policy limited. CSP is a baseline framing/object/base policy, not a complete nonce-based script CSP.

## Before wider production use

Add authenticated users, a shared durable rate limiter, quotas, provider spend controls, monitoring, and retention/privacy review. The existing in-memory limiter can reset across instances and cold starts and must not be described as comprehensive cost protection. Set limits in the Groq account and use `AI_ENABLED=false` as an operational kill switch when needed.

The app does not store briefs in a database, but the hosting and AI providers may have their own logging and retention policies. Do not enter confidential customer or business data into this public learning demo. The initial catalog is sample data. Schema validation establishes data shape, not accuracy or usefulness.

If a key leaks, revoke and replace it at Groq, update the Vercel environment, and redeploy. Removing the latest copy from a file is not a substitute for revocation.
