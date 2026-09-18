import { describe, expect, it } from "vitest";
import { getBearerToken } from "./auth";

describe("getBearerToken", () => {
  it("reads a bearer token without logging it", () => {
    const request = new Request("http://localhost/api/v1/me", {
      headers: { Authorization: "Bearer sntrys_test-token" },
    });
    expect(getBearerToken(request)).toBe("sntrys_test-token");
  });

  it("returns null when the header is missing or not Bearer", () => {
    expect(getBearerToken(new Request("http://localhost"))).toBeNull();
    expect(
      getBearerToken(
        new Request("http://localhost", { headers: { Authorization: "Basic x" } }),
      ),
    ).toBeNull();
  });
});
