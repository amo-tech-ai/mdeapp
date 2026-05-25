import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { incrementAndCheckGroundingQuota } from "./grounding-quota";

describe("incrementAndCheckGroundingQuota", () => {
  beforeEach(() => {
    vi.stubEnv("MAPS_GROUNDING_DAILY_LIMIT", "");
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("blocks when MAPS_GROUNDING_DAILY_LIMIT=0", async () => {
    vi.stubEnv("MAPS_GROUNDING_DAILY_LIMIT", "0");
    const r = await incrementAndCheckGroundingQuota();
    expect(r).toEqual({ allowed: false, reason: "disabled" });
  });

  it("allows when Supabase not configured (dev)", async () => {
    const r = await incrementAndCheckGroundingQuota();
    expect(r).toEqual({ allowed: true });
  });
});
