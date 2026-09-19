# Unofficial concept: Sentry connector for Meta Muse

Unofficial concept. Not affiliated with, endorsed by, or published by Sentry or Meta. This is an independent interpretation of how a Sentry connector for Muse could look.

- Human UI: unofficial in the banner and the product name only. Do not repeat “Unofficial concept” in every heading after that.
- Keep unofficialConcept on API envelopes, OpenAPI, and SKILL.
- Do not add Sentry or Meta logos, directory-submission flows, Stripe Link, MCP, or Seer.
- Curated on-call API only: me, issues list/get, truncated latest-event, PATCH status/assignee.
- `X-Sentry-Host` allowlist: sentry.io, us.sentry.io, de.sentry.io.
- Never log Bearer tokens.
- Questions: Barnir <barnir@agentmail.to> (personal contact for this unofficial sketch).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
