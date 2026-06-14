import { afterEach, describe, expect, it, vi } from "vitest";

describe("incrementAndCheckSearchGroundingQuota", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("blocks when search grounding is disabled", async () => {
    vi.stubEnv("ENABLE_SEARCH_GROUNDING", "0");
    const { incrementAndCheckSearchGroundingQuota } = await import(
      "./search-grounding-quota"
    );
    const result = await incrementAndCheckSearchGroundingQuota();
    expect(result).toEqual({ allowed: false, reason: "disabled" });
  });

  it("blocks on Vercel production even when flag is on", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("ENABLE_SEARCH_GROUNDING", "1");
    const { incrementAndCheckSearchGroundingQuota } = await import(
      "./search-grounding-quota"
    );
    const result = await incrementAndCheckSearchGroundingQuota();
    expect(result).toEqual({ allowed: false, reason: "disabled" });
  });
});
