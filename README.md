# Unofficial concept: Sentry connector for Meta Muse

> Unofficial concept. Not affiliated with, endorsed by, or published by Sentry or Meta. This is an independent interpretation of how a Sentry connector for Muse could look.

This repository is a **sketch**, not a shipping Sentry product and not a Meta-reviewed Muse directory connector.

## What it is

A small, stateless Next.js API that Muse can ingest as a **custom connector**:

- OpenAPI at `/openapi.json` (titled as an unofficial concept)
- SKILL at `/skill.md` (instructs Muse to disclose that this is unofficial)
- Curated on-call endpoints under `/api/v1/*`
- A landing page that repeats the unofficial disclaimer in the banner, hero, prompt, table, and footer

Every JSON response includes `unofficialConcept: true` plus the disclaimer, and the `X-Unofficial-Concept: true` header.

## What it is not

- Not an official Sentry connector
- Not an official Meta / Muse listing
- Not Sentry MCP (`https://mcp.sentry.dev`)
- Not affiliated with, endorsed by, or published by Sentry or Meta

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The page, OpenAPI, SKILL, and API discovery document all state that this is an unofficial interpretation.

## Try the unofficial API

Create a Sentry User Auth Token (this project never mints tokens):

```bash
export SENTRY_AUTH_TOKEN=sntrys_...
curl -s http://localhost:3000/api/v1/me \
  -H "Authorization: Bearer $SENTRY_AUTH_TOKEN"
```

Optional region header (allowlisted): `X-Sentry-Host: us.sentry.io` or `de.sentry.io`.

## Tests

```bash
npm test
npm run lint
npm run build
```

## Sample partner packet

See [PARTNER.md](./PARTNER.md). That file is also an unofficial sample, not a real submission to Muse Connector Platform.

## Questions

This unofficial concept is a personal sketch. Email **Assaf Barnir** at [assaf.barnir@sentry.io](mailto:assaf.barnir@sentry.io) with questions. That is not a Sentry or Meta support channel.
