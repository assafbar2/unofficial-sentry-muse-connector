import { describe, expect, it } from "vitest";
import { UNOFFICIAL_DISCLAIMER, PRODUCT_NAME } from "./disclaimer";
import { buildMuseConnectPrompt, buildOpenApi, buildSkillMarkdown } from "./muse";

const origin = "https://example.test";

describe("Muse packaging for the unofficial concept", () => {
  it("puts the unofficial interpretation in the connect prompt", () => {
    const prompt = buildMuseConnectPrompt(origin);
    expect(prompt).toContain("unofficial concept of a Sentry connector for Muse");
    expect(prompt).toContain("not affiliated with, endorsed by, or published by Sentry or Meta");
    expect(prompt).toContain(`${origin}/openapi.json`);
    expect(prompt).toContain(`${origin}/skill.md`);
    expect(prompt).toContain("Treat it as an independent interpretation");
    expect(prompt).toContain("barnir@agentmail.to");
  });

  it("titles the SKILL as an unofficial concept", () => {
    const skill = buildSkillMarkdown(origin);
    expect(skill.startsWith(`# ${PRODUCT_NAME}`)).toBe(true);
    expect(skill).toContain(UNOFFICIAL_DISCLAIMER);
    expect(skill).toContain("Do not claim this is listed in the official Muse connector directory");
    expect(skill).toContain("barnir@agentmail.to");
  });

  it("marks OpenAPI info as an unofficial concept", () => {
    const spec = buildOpenApi(origin);
    expect(spec.info.title).toBe(PRODUCT_NAME);
    expect(spec.info["x-unofficial-concept"]).toBe(true);
    expect(spec.info["x-disclaimer"]).toBe(UNOFFICIAL_DISCLAIMER);
    expect(spec.info.description).toContain("Not a Meta-reviewed directory connector");
    expect(spec.servers[0]?.description).toContain("Not an official Sentry or Meta host");
    expect(spec.info.contact?.email).toBe("barnir@agentmail.to");
    expect(spec.info.contact?.name).toBe("Barnir");
  });
});
