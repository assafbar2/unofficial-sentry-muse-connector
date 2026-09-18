import { describe, expect, it } from "vitest";
import {
  PRODUCT_NAME,
  UNOFFICIAL_DISCLAIMER,
  unofficialHeaders,
  withUnofficial,
} from "./disclaimer";

describe("unofficial disclaimer", () => {
  it("wraps every payload with the concept flag and full disclaimer", () => {
    const wrapped = withUnofficial({ issues: [] });
    expect(wrapped.unofficialConcept).toBe(true);
    expect(wrapped.disclaimer).toBe(UNOFFICIAL_DISCLAIMER);
    expect(wrapped.issues).toEqual([]);
    expect(UNOFFICIAL_DISCLAIMER).toContain("independent interpretation");
    expect(UNOFFICIAL_DISCLAIMER).toContain("Not affiliated with, endorsed by, or published by Sentry or Meta");
    expect(PRODUCT_NAME).toMatch(/^Unofficial concept:/);
  });

  it("sets the unofficial HTTP header", () => {
    const headers = unofficialHeaders();
    expect(headers.get("X-Unofficial-Concept")).toBe("true");
    expect(headers.get("X-Product-Name")).toBe(PRODUCT_NAME);
  });
});
