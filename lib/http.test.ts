import { describe, expect, it } from "vitest";
import { UNOFFICIAL_DISCLAIMER } from "./disclaimer";
import { jsonError, jsonUnofficial } from "./http";
import { beginRequest, isResponse } from "./request";
import { resetRateLimitForTests } from "./rate-limit";

describe("HTTP envelope", () => {
  it("includes unofficialConcept on success and error JSON", async () => {
    const ok = jsonUnofficial({ hello: "world" });
    expect(ok.headers.get("X-Unofficial-Concept")).toBe("true");
    const okBody = await ok.json();
    expect(okBody.unofficialConcept).toBe(true);
    expect(okBody.disclaimer).toBe(UNOFFICIAL_DISCLAIMER);
    expect(okBody.hello).toBe("world");

    const err = jsonError(401, "missing_bearer_token", "nope");
    const errBody = await err.json();
    expect(err.status).toBe(401);
    expect(errBody.unofficialConcept).toBe(true);
    expect(errBody.disclaimer).toBe(UNOFFICIAL_DISCLAIMER);
    expect(errBody.error.code).toBe("missing_bearer_token");
  });
});

describe("beginRequest", () => {
  it("401s without a Bearer token and still labels the unofficial concept", async () => {
    resetRateLimitForTests();
    const response = beginRequest(new Request("http://localhost/api/v1/me"));
    expect(isResponse(response)).toBe(true);
    if (!isResponse(response)) return;
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.unofficialConcept).toBe(true);
    expect(body.disclaimer).toContain("independent interpretation");
  });

  it("rejects a non-allowlisted Sentry host before any upstream call", async () => {
    resetRateLimitForTests();
    const response = beginRequest(
      new Request("http://localhost/api/v1/me", {
        headers: {
          Authorization: "Bearer token",
          "X-Sentry-Host": "attacker.test",
        },
      }),
    );
    expect(isResponse(response)).toBe(true);
    if (!isResponse(response)) return;
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error.code).toBe("invalid_sentry_host");
    expect(body.unofficialConcept).toBe(true);
  });
});
