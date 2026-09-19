import { describe, expect, it } from "vitest";
import {
  handleGetIssue,
  handleLatestEvent,
  handleListIssues,
  handleMe,
  handleUpdateIssue,
  InvalidIssueUpdateError,
  MissingOrganizationError,
} from "./handlers";

type MockCall = { url: string; method: string; body: string | null };

function mockSentry(routes: Record<string, unknown>) {
  const calls: MockCall[] = [];
  const fetchImpl: typeof fetch = async (input, init) => {
    const url = String(input);
    const method = init?.method ?? "GET";
    calls.push({
      url,
      method,
      body: typeof init?.body === "string" ? init.body : null,
    });
    const path = new URL(url).pathname;
    const payload = routes[`${method} ${path}`] ?? routes[path];
    if (payload === undefined) {
      return new Response(JSON.stringify({ detail: `unexpected ${path}` }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(payload), { status: 200 });
  };
  return { fetchImpl, calls };
}

describe("unofficial concept handlers", () => {
  it("handleMe reads user and orgs without storing the token", async () => {
    const { fetchImpl, calls } = mockSentry({
      "GET /api/0/auth/": {
        id: "9",
        name: "Ada",
        email: "ada@example.com",
        username: "ada",
      },
      "GET /api/0/organizations/": [
        {
          id: "1",
          slug: "acme",
          name: "Acme",
          links: { regionUrl: "https://de.sentry.io" },
        },
      ],
    });

    const result = await handleMe({
      token: "secret-token",
      host: "sentry.io",
      fetchImpl,
    });

    expect(result.note).toContain("Unofficial concept");
    expect(result.user.username).toBe("ada");
    expect(result.organizations[0]?.slug).toBe("acme");
    expect(result.organizations[0]?.suggestedSentryHost).toBe("de.sentry.io");
    expect(calls.every((call) => call.url.startsWith("https://sentry.io/"))).toBe(
      true,
    );
  });

  it("list issues requires an organization slug", async () => {
    await expect(
      handleListIssues({
        token: "secret",
        host: "us.sentry.io",
        organization: null,
        query: undefined,
        limit: undefined,
        statsPeriod: undefined,
      }),
    ).rejects.toBeInstanceOf(MissingOrganizationError);
  });

  it("lists issues against the region host with Sentry search", async () => {
    const { fetchImpl, calls } = mockSentry({
      "GET /api/0/organizations/acme/issues/": [
        { id: "42", title: "Boom", shortId: "APP-42", status: "unresolved" },
      ],
    });

    const result = await handleListIssues({
      token: "secret",
      host: "us.sentry.io",
      organization: "acme",
      query: "is:unresolved assigned:me",
      limit: 5,
      statsPeriod: "24h",
      fetchImpl,
    });

    expect(result.note).toContain("Unofficial concept");
    expect(result.issues[0]?.id).toBe("42");
    expect(calls[0]?.url).toContain("https://us.sentry.io/");
    expect(calls[0]?.url).toContain("query=is%3Aunresolved+assigned%3Ame");
    expect(calls[0]?.url).toContain("limit=5");
  });

  it("gets and truncates a latest event", async () => {
    const { fetchImpl } = mockSentry({
      "GET /api/0/issues/42/events/latest/": {
        eventID: "evt",
        entries: [
          {
            type: "exception",
            data: {
              values: [{ type: "Error", value: "nope", stacktrace: { frames: [] } }],
            },
          },
        ],
      },
    });

    const result = await handleLatestEvent({
      token: "secret",
      host: "sentry.io",
      issueId: "42",
      fetchImpl,
    });
    expect(result.note).toContain("Unofficial concept");
    expect(result.event.exceptionType).toBe("Error");
  });

  it("get issue summarizes the unofficial payload", async () => {
    const { fetchImpl } = mockSentry({
      "GET /api/0/issues/42/": { id: "42", title: "Boom", status: "unresolved" },
    });
    const result = await handleGetIssue({
      token: "secret",
      host: "sentry.io",
      issueId: "42",
      fetchImpl,
    });
    expect(result.issue.title).toBe("Boom");
    expect(result.note).toContain("not an official Sentry product");
  });

  it("PATCH forwards a PUT mutate to Sentry", async () => {
    const { fetchImpl, calls } = mockSentry({
      "PUT /api/0/issues/42/": {
        id: "42",
        title: "Boom",
        status: "resolved",
        assignedTo: { name: "Ada", type: "user" },
      },
    });

    const result = await handleUpdateIssue({
      token: "secret",
      host: "sentry.io",
      issueId: "42",
      status: "resolved",
      assignedTo: "me",
      fetchImpl,
    });

    expect(result.mutating).toBe(true);
    expect(result.note).toContain("Unofficial concept");
    expect(result.issue.status).toBe("resolved");
    expect(calls[0]?.method).toBe("PUT");
    expect(calls[0]?.body).toBe(
      JSON.stringify({ status: "resolved", assignedTo: "me" }),
    );
  });

  it("rejects unofficial PATCH bodies that are empty or invalid", async () => {
    await expect(
      handleUpdateIssue({
        token: "secret",
        host: "sentry.io",
        issueId: "1",
      }),
    ).rejects.toBeInstanceOf(InvalidIssueUpdateError);

    await expect(
      handleUpdateIssue({
        token: "secret",
        host: "sentry.io",
        issueId: "1",
        status: "deleted",
      }),
    ).rejects.toBeInstanceOf(InvalidIssueUpdateError);
  });
});
