# Unofficial concept: Sentry connector for Meta Muse

> Unofficial concept. Not affiliated with, endorsed by, or published by Sentry or Meta. This is an independent interpretation of how a Sentry connector for Muse could look.

This repository is a **sketch**, not a shipping Sentry product and not a Meta-reviewed Muse directory connector.

## What it is

A small, stateless Next.js API that Muse can ingest as a **custom connector**:

- OpenAPI at `/openapi.json` (titled as an unofficial concept)
- SKILL at `/skill.md` (instructs Muse to disclose that this is unofficial)
- Curated on-call endpoints under `/api/v1/*`
- A landing page: banner + product name, then what a visitor can actually do

Every JSON response includes `unofficialConcept: true` plus the disclaimer, and the `X-Unofficial-Concept: true` header.

## What it is not

- Not an official Sentry connector
- Not an official Meta / Muse listing
- Not Sentry MCP (`https://mcp.sentry.dev`)
- Not affiliated with, endorsed by, or published by Sentry or Meta

## What a visitor can do

The live site is a working custom-connector host, not a login product:

- **From Muse:** copy the prompt on the page, give Muse your own Sentry User Auth Token, ask what’s on fire.
- **From a terminal:** `curl` `/api/v1/me` and `/api/v1/issues` with that token.
- **Without a token:** read OpenAPI, SKILL, privacy, terms, and the demo screenshot. You will not see Sentry data.

There is no account to create on this site. Muse’s official directory is separate; custom connect works without it.

## Live public host (Vercel Hobby)

This unofficial sketch is deployed on a free Vercel Hobby project so Meta can fetch HTTPS URLs. It is still not an official Sentry or Meta product.

**Public origin:** [https://unofficial-sentry-muse-connector.vercel.app](https://unofficial-sentry-muse-connector.vercel.app)

Paste these into Muse Connector Platform **Technical specs** only if you file this as an **independent unofficial** listing — never as Sentry:

| Field | Value |
| --- | --- |
| API / base URL | `https://unofficial-sentry-muse-connector.vercel.app/api/v1` |
| OpenAPI spec | `https://unofficial-sentry-muse-connector.vercel.app/openapi.json` |
| SKILL | `https://unofficial-sentry-muse-connector.vercel.app/skill.md` |
| Documentation | `https://unofficial-sentry-muse-connector.vercel.app` |
| Privacy policy | `https://unofficial-sentry-muse-connector.vercel.app/privacy` |
| Terms of service | `https://unofficial-sentry-muse-connector.vercel.app/terms` |
| Icon (512×512 PNG) | `https://unofficial-sentry-muse-connector.vercel.app/connector-icon.png` |
| Screenshot | `https://unofficial-sentry-muse-connector.vercel.app/how-it-looks.png` |

Vercel Deployment Protection is off on this project so Muse can read OpenAPI and SKILL without a login wall.

GitHub: [https://github.com/assafbar2/unofficial-sentry-muse-connector](https://github.com/assafbar2/unofficial-sentry-muse-connector). Deployed on Vercel (Hobby). Connect that GitHub repo in the Vercel dashboard if you want later pushes to auto-deploy.

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

## Privacy and terms (for the Meta form)

You do not need a separate legal site. The live unofficial pages are:

- Privacy: [https://unofficial-sentry-muse-connector.vercel.app/privacy](https://unofficial-sentry-muse-connector.vercel.app/privacy)
- Terms: [https://unofficial-sentry-muse-connector.vercel.app/terms](https://unofficial-sentry-muse-connector.vercel.app/terms)
- Icon: [https://unofficial-sentry-muse-connector.vercel.app/connector-icon.png](https://unofficial-sentry-muse-connector.vercel.app/connector-icon.png)

They are not Sentry’s legal pages. Local copies still work at [http://localhost:3000/privacy](http://localhost:3000/privacy).

## Questions

This unofficial concept is a personal sketch. Email **Barnir** at [barnir@agentmail.to](mailto:barnir@agentmail.to) with questions. That is not a Sentry or Meta support channel.

Screenshot (demo sketch): [https://unofficial-sentry-muse-connector.vercel.app/how-it-looks.png](https://unofficial-sentry-muse-connector.vercel.app/how-it-looks.png)
