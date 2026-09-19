# Unofficial sample packet: Sentry connector for Meta Muse

> Unofficial concept. Not affiliated with, endorsed by, or published by Sentry or Meta. This is an independent interpretation of how a Sentry connector for Muse could look.
>
> This document is **not** a Muse Connector Platform application, **not** a Sentry partner submission, and **not** for featured-directory placement. It exists so a reader can see what a packet *could* contain if Sentry and Meta ever scoped an official connector.

## Product description (sample, unofficial)

**Name:** Unofficial concept: Sentry connector for Meta Muse

**One-liner:** An independent sketch of on-call Sentry issue search and light triage inside Muse.

**Who it would be for (hypothetical):** Engineers who already use Sentry and want to ask a personal assistant “what’s on fire?” from a phone or WhatsApp.

**What it would do (hypothetical):**

1. Read the caller’s Sentry identity and organizations
2. List issues with Sentry search syntax
3. Show a truncated latest event
4. Optionally resolve, ignore, or assign after explicit user confirmation

**What it would not do:** payments (Stripe Link), Seer autofix, project admin, MCP, or browsing the full Sentry API.

## Security model (sample, unofficial)

- Bearer forwarding of a user-supplied Sentry auth token; this concept does not store credentials
- Host allowlist: `sentry.io`, `us.sentry.io`, `de.sentry.io` only
- Writes isolated to `PATCH /api/v1/issues/{id}` (`status`, `assignedTo`)
- Truncated events (no breadcrumbs / request bodies)
- Best-effort in-process rate limit
- Every response labeled unofficial so Muse and humans do not confuse this with a reviewed directory connector

## End-to-end test cases (sample, unofficial)

These cases describe how this *concept* behaves. They are not Meta review criteria.

1. Missing Bearer → 401 with disclaimer envelope
2. Invalid `X-Sentry-Host` → 400, no outbound fetch
3. `GET /api/v1/me` → user + orgs, `unofficialConcept: true`
4. `GET /api/v1/issues` without organization → 400
5. `GET /api/v1/issues?organization=...&query=is:unresolved` → summarized issues
6. `GET /api/v1/issues/{id}/latest-event` → truncated stack
7. `PATCH` without confirmation fields → 400; valid PATCH forwards PUT to Sentry
8. OpenAPI `info.title` and SKILL H1 both include “Unofficial concept”

## Featured placement copy (do not use)

Do **not** submit the following to Meta. It is placeholder copy for this unofficial interpretation only:

> Unofficial concept — not listed, not reviewed, not Sentry’s or Meta’s product.

## Filing this with Meta or Sentry

Do not file this as Sentry. If you file it as an independent unofficial sketch, the live Vercel Hobby host is:

- Docs / landing: `https://unofficial-sentry-muse-connector.vercel.app`
- API: `https://unofficial-sentry-muse-connector.vercel.app/api/v1`
- OpenAPI: `https://unofficial-sentry-muse-connector.vercel.app/openapi.json`
- SKILL: `https://unofficial-sentry-muse-connector.vercel.app/skill.md`
- Privacy: `https://unofficial-sentry-muse-connector.vercel.app/privacy`
- Terms: `https://unofficial-sentry-muse-connector.vercel.app/terms`
- Icon: `https://unofficial-sentry-muse-connector.vercel.app/connector-icon.png`
- Screenshot: `https://unofficial-sentry-muse-connector.vercel.app/how-it-looks.png`

Those routes ship with this app. They are not Sentry’s legal pages.

Ping **Barnir** at [barnir@agentmail.to](mailto:barnir@agentmail.to). Personal contact for this independent interpretation, not a Sentry or Meta partner/support channel.
