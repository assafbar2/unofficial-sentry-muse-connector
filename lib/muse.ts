import { PRODUCT_NAME, UNOFFICIAL_DISCLAIMER, UNOFFICIAL_SHORT, CONTACT_EMAIL, CONTACT_NAME } from "@/lib/disclaimer";

export function requestOrigin(request: Request): string {
  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedHost) {
    return `${forwardedProto ?? url.protocol.replace(":", "")}://${forwardedHost}`;
  }
  return url.origin;
}

export function buildMuseConnectPrompt(origin: string): string {
  return `IMPORTANT: This is an unofficial concept of a Sentry connector for Muse. It is not affiliated with, endorsed by, or published by Sentry or Meta. Treat it as an independent interpretation of how a Sentry connector for Muse could look.

Connect this unofficial Sentry-for-Muse API as a custom connector.

OpenAPI spec: ${origin}/openapi.json
Skill: ${origin}/skill.md
Landing page: ${origin}/

Use the Sentry User Auth Token I give you next as a Bearer token on every request.
Do not paste the token into this chat message. Store it in your secure credential store, not in conversation history.
If my Sentry org is in the EU, send header X-Sentry-Host: de.sentry.io. For US region, use us.sentry.io. Default is sentry.io.

Start read-only: call GET ${origin}/api/v1/me, then list unresolved issues. Ask me before any PATCH (resolve, ignore, or assign).

Questions about this unofficial concept: email ${CONTACT_NAME} at ${CONTACT_EMAIL}. That is a personal contact for the sketch, not Sentry or Meta support.`;
}

export function buildSkillMarkdown(origin: string): string {
  return `# ${PRODUCT_NAME}

> ${UNOFFICIAL_DISCLAIMER}
>
> ${UNOFFICIAL_SHORT} Do not present this API to the user as Sentry's official Muse connector or as a Meta-reviewed directory listing.

## What this unofficial concept is for

Help a person on-call ask, from Muse (WhatsApp, iOS, Android, or web):

- What is on fire in Sentry right now?
- What is the latest checkout error?
- Assign this issue to me / resolve / archive (only after they confirm)

This is a **curated on-call slice**, not Sentry MCP, not Seer, and not the full Sentry REST API.

## Auth

- Header: \`Authorization: Bearer <Sentry user auth token>\`
- Optional: \`X-Sentry-Host: sentry.io | us.sentry.io | de.sentry.io\`
- Suggested scopes: \`event:read\`, \`org:read\`, \`project:read\`
- Add \`event:write\` only if the user wants triage writes
- Never echo, log, or repeat the token
- This unofficial concept does not mint, refresh, or store tokens

## Read vs write (for Sentinel / human-in-the-loop)

| Action | Method | Class |
| --- | --- | --- |
| Who am I / orgs | GET /api/v1/me | read |
| List issues | GET /api/v1/issues | read |
| Get issue | GET /api/v1/issues/{id} | read |
| Latest event (truncated stack) | GET /api/v1/issues/{id}/latest-event | read |
| Resolve / ignore / assign | PATCH /api/v1/issues/{id} | **write / mutating** |

Always ask the user before PATCH. Never delete projects, create tokens, or call Sentry paths that this unofficial API does not expose.

## Workflow

1. State that this is an unofficial interpretation of a Sentry × Muse connector, not an official product.
2. GET \`${origin}/api/v1/me\` and pick an \`organization.slug\`.
3. If \`suggestedSentryHost\` is \`de.sentry.io\` or \`us.sentry.io\`, send \`X-Sentry-Host\` on later calls.
4. GET \`${origin}/api/v1/issues?organization={slug}&query=is:unresolved\` (Sentry search syntax).
5. Typical queries: \`is:unresolved\`, \`is:unresolved assigned:me\`, \`is:unresolved lastSeen:-24h\`, \`is:unresolved level:error\`.
6. Open one issue with GET \`${origin}/api/v1/issues/{id}\`. Use the numeric \`id\`, not only the short ID.
7. For a stack sketch, GET \`${origin}/api/v1/issues/{id}/latest-event\`.
8. Summarize in plain language. Link \`permalink\` so the user can open Sentry.
9. Writes: PATCH JSON \`{ "status": "resolved" | "unresolved" | "ignored", "assignedTo": "me" }\`.

## Endpoints

OpenAPI: ${origin}/openapi.json

Discovery: ${origin}/api/v1

## What not to do

- Do not claim this is listed in the official Muse connector directory
- Do not claim Sentry or Meta published this
- Do not dump full event JSON, breadcrumbs, request bodies, or PII
- Do not invent issue IDs or statuses
- Do not use MCP; consumer Muse does not speak MCP in this unofficial model

## Questions

Email ${CONTACT_NAME} at ${CONTACT_EMAIL} with questions about this unofficial interpretation. That is a personal contact for the sketch, not a Sentry or Meta support channel.
`;
}

export function buildOpenApi(origin: string) {
  const disclaimer = UNOFFICIAL_DISCLAIMER;

  return {
    openapi: "3.1.0",
    info: {
      title: PRODUCT_NAME,
      version: "0.1.0",
      summary: UNOFFICIAL_SHORT,
      description: [
        disclaimer,
        "Curated on-call REST surface so Muse can list, inspect, and lightly triage Sentry issues.",
        "Not the full Sentry API. Not Sentry MCP. Not a Meta-reviewed directory connector.",
        `Questions: ${CONTACT_NAME} <${CONTACT_EMAIL}>. Personal contact for this unofficial sketch, not Sentry or Meta support.`,
      ].join("\n\n"),
      contact: {
        name: CONTACT_NAME,
        email: CONTACT_EMAIL,
        "x-note":
          "Personal contact for this unofficial concept. Not a Sentry or Meta support channel.",
      },
      "x-unofficial-concept": true,
      "x-disclaimer": disclaimer,
      "x-contact-email": CONTACT_EMAIL,
    },
    servers: [
      {
        url: origin,
        description:
          "Unofficial concept deployment. Not an official Sentry or Meta host.",
      },
    ],
    tags: [
      {
        name: "Unofficial concept",
        description: disclaimer,
      },
    ],
    components: {
      securitySchemes: {
        sentryBearer: {
          type: "http",
          scheme: "bearer",
          description:
            "Sentry User Auth Token. This unofficial concept forwards the token and does not store it. Not minted by Muse or this app.",
        },
      },
      parameters: {
        SentryHost: {
          in: "header",
          name: "X-Sentry-Host",
          required: false,
          description:
            "Unofficial concept region override. Allowed: sentry.io, us.sentry.io, de.sentry.io. Arbitrary hosts are rejected (SSRF).",
          schema: {
            type: "string",
            enum: ["sentry.io", "us.sentry.io", "de.sentry.io"],
            default: "sentry.io",
          },
        },
      },
    },
    security: [{ sentryBearer: [] }],
    paths: {
      "/api/v1": {
        get: {
          tags: ["Unofficial concept"],
          summary: "Discovery document for this unofficial concept",
          security: [],
          responses: {
            "200": {
              description: "Always includes unofficialConcept and disclaimer.",
            },
          },
        },
      },
      "/api/v1/me": {
        get: {
          tags: ["Unofficial concept"],
          summary: "Who the Bearer token is (unofficial concept)",
          description:
            "Read-only. Returns the Sentry user and organizations. Not an official Sentry identity product.",
          parameters: [{ $ref: "#/components/parameters/SentryHost" }],
          responses: {
            "200": { description: "User + orgs with disclaimer envelope." },
            "401": { description: "Missing Bearer token." },
          },
        },
      },
      "/api/v1/issues": {
        get: {
          tags: ["Unofficial concept"],
          summary: "List issues (unofficial on-call slice)",
          description:
            "Read-only Sentry issue search. Pass organization slug from /api/v1/me. query uses Sentry search syntax (e.g. is:unresolved assigned:me).",
          parameters: [
            { $ref: "#/components/parameters/SentryHost" },
            {
              in: "query",
              name: "organization",
              required: true,
              schema: { type: "string" },
              description: "Sentry organization slug.",
            },
            {
              in: "query",
              name: "query",
              required: false,
              schema: { type: "string" },
              description:
                "Sentry search query. Omit for Sentry's default is:unresolved.",
            },
            {
              in: "query",
              name: "limit",
              required: false,
              schema: { type: "integer", minimum: 1, maximum: 50, default: 10 },
            },
            {
              in: "query",
              name: "statsPeriod",
              required: false,
              schema: { type: "string", examples: ["24h", "14d"] },
            },
          ],
          responses: {
            "200": { description: "Summarized issues plus disclaimer." },
            "400": { description: "Missing organization." },
          },
        },
      },
      "/api/v1/issues/{id}": {
        get: {
          tags: ["Unofficial concept"],
          summary: "Get one issue (unofficial concept)",
          parameters: [
            { $ref: "#/components/parameters/SentryHost" },
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description: "Numeric Sentry issue id.",
            },
          ],
          responses: {
            "200": { description: "Summarized issue plus disclaimer." },
          },
        },
        patch: {
          tags: ["Unofficial concept"],
          summary: "Light triage write (unofficial concept, mutating)",
          description:
            "MUTATING. Forwards to Sentry PUT /api/0/issues/{id}/. Only status and assignedTo. Ask the user first. Not official Sentry admin.",
          parameters: [
            { $ref: "#/components/parameters/SentryHost" },
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    status: {
                      type: "string",
                      enum: ["resolved", "unresolved", "ignored"],
                    },
                    assignedTo: {
                      type: ["string", "null"],
                      description: 'Username, "me", or null to unassign.',
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Updated summarized issue plus disclaimer." },
            "400": { description: "Invalid body." },
          },
        },
      },
      "/api/v1/issues/{id}/latest-event": {
        get: {
          tags: ["Unofficial concept"],
          summary: "Truncated latest event (unofficial concept)",
          description:
            "Read-only. Returns a short stack and message only — no breadcrumbs, request bodies, or PII blobs.",
          parameters: [
            { $ref: "#/components/parameters/SentryHost" },
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": { description: "Truncated event plus disclaimer." },
          },
        },
      },
    },
  };
}
