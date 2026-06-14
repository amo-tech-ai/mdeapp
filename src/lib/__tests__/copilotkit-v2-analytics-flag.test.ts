import { afterEach, describe, expect, it, vi } from "vitest";
import { isCopilotKitV2AnalyticsEnabled } from "@/lib/copilotkit-v2-analytics-flag";

describe("copilotkit-v2-analytics-flag", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns false when unset", () => {
    vi.stubEnv("COPILOTKIT_V2_ANALYTICS", "");
    expect(isCopilotKitV2AnalyticsEnabled()).toBe(false);
  });

  it("returns false when off", () => {
    vi.stubEnv("COPILOTKIT_V2_ANALYTICS", "0");
    expect(isCopilotKitV2AnalyticsEnabled()).toBe(false);
  });

  it("returns true only when COPILOTKIT_V2_ANALYTICS=1", () => {
    vi.stubEnv("COPILOTKIT_V2_ANALYTICS", "1");
    expect(isCopilotKitV2AnalyticsEnabled()).toBe(true);
  });
});
