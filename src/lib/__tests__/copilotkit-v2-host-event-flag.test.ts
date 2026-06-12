import { afterEach, describe, expect, it, vi } from "vitest";
import { isCopilotKitV2HostEventEnabled } from "@/lib/copilotkit-v2-host-event-flag";

describe("copilotkit-v2-host-event-flag", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns false when unset", () => {
    vi.stubEnv("COPILOTKIT_V2_HOST_EVENT", "");
    expect(isCopilotKitV2HostEventEnabled()).toBe(false);
  });

  it("returns false when off", () => {
    vi.stubEnv("COPILOTKIT_V2_HOST_EVENT", "0");
    expect(isCopilotKitV2HostEventEnabled()).toBe(false);
  });

  it("returns true only when COPILOTKIT_V2_HOST_EVENT=1", () => {
    vi.stubEnv("COPILOTKIT_V2_HOST_EVENT", "1");
    expect(isCopilotKitV2HostEventEnabled()).toBe(true);
  });
});
