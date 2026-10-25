# Deployment — deliverable 4

- GitHub repository: https://github.com/PenielOkoli/shelfsignal-structured-outputs
- Vercel project: `shelfsignal-structured-outputs`
- Live URL: pending verified deployment.
- GitHub auto-deployment connection: pending verification.
- Live Groq on this new project: pending configuration and verification.

This project is independent of `shelfsignal-phase-2`. Its predecessor's deployments and provider test results do not establish this project's deployment status.

Use the Next.js preset, Node.js 22.x, `npm ci`, and `npm run build`. Production needs server-side `GROQ_API_KEY`; the sample and validation lab work without it. Add secrets in Vercel, never source control. Keep the repository connected so pushes to `main` trigger production deployments.
