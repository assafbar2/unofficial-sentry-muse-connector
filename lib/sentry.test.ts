import { describe, expect, it } from "vitest";
import {
  InvalidSentryHostError,
  SentryApiError,
  resolveSentryHost,
  sentryFetch,
  summarizeEvent,
  summarizeIssue,
} from "./sentry";

describe("resolveSentryHost", () => {
  it("defaults to sentry.io and allows region hosts", () => {
    expect(resolveSentryHost(null)).toBe("sentry.io");
    expect(resolveSentryHost("https://US.SENTRY.IO/foo")).toBe("us.sentry.io");
    expect(resolveSentryHost("de.sentry.io")).toBe("de.sentry.io");
  });

  it("rejects arbitrary hosts to prevent SSRF", () => {
    expect(() => resolveSentryHost("evil.example")).toThrow(InvalidSentryHostError);
    expect(() => resolveSentryHost("127.0.0.1")).toThrow(InvalidSentryHostError);
    expect(() => resolveSentryHost("sentry.io.evil.test")).toThrow(
      InvalidSentryHostError,
    );
  });
});

describe("summarizers", () => {
  it("summarizes an issue for the unofficial on-call slice", () => {
    const summary = summarizeIssue({
      id: "1",
      shortId: "APP-1",
      title: "TypeError",
      culprit: "app.ts",
      status: "unresolved",
      count: "9",
      userCount: 3,
      permalink: "https://sentry.io/issues/1/",
      project: { slug: "app", name: "App" },
      assignedTo: { name: "Ada", type: "user" },
    });
    expect(summary.shortId).toBe("APP-1");
    expect(summary.project?.slug).toBe("app");
    expect(summary.assignedTo?.name).toBe("Ada");
  });

  it("truncates event stacks and drops extra frames", () => {
    const frames = Array.from({ length: 20 }, (_, index) => ({
      filename: `file-${index}.ts`,
      function: `fn${index}`,
      lineNo: index,
      inApp: true,
    }));
    const summary = summarizeEvent({
      eventID: "abc",
      entries: [
        {
          type: "exception",
          data: {
            values: [
              {
                type: "TypeError",
                value: "boom",
                stacktrace: { frames },
              },
            ],
          },
        },
      ],
      tags: Array.from({ length: 30 }, (_, index) => ({
        key: `k${index}`,
        value: `v${index}`,
      })),
    });
    expect(summary.stack).toHaveLength(10);
    expect(summary.stack[0]?.filename).toBe("file-10.ts");
    expect(summary.tags).toHaveLength(15);
    expect(summary.exceptionType).toBe("TypeError");
  });
});

describe("sentryFetch", () => {
  it("throws SentryApiError on non-OK responses", async () => {
    const fetchImpl: typeof fetch = async () =>
      new Response(JSON.stringify({ detail: "denied" }), { status: 403 });

    await expect(
      sentryFetch({
        token: "secret",
        host: "sentry.io",
        path: "/api/0/users/me/",
        fetchImpl,
      }),
    ).rejects.toMatchObject({ status: 403, name: "SentryApiError" } satisfies Partial<SentryApiError>);
  });
});
