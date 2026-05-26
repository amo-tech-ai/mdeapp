import { afterEach, describe, expect, it, vi } from "vitest";

describe("incrementAndCheckSearchGroundingQuota", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("blocks when ENABLE_SEARCH_GROUNDING is off", async () => {
    vi.stubEnv("ENABLE_SEARCH_GROUNDING", "0");
    const { incrementAndCheckSearchGroundingQuota } = await import(
      "./search-grounding-quota"
    );
    const result = await incrementAndCheckSearchGroundingQuota();
    expect(result).toEqual({ allowed: false, reason: "disabled" });
  });
});
