import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isCopilotKitV2ChatClientEnabled,
  isCopilotKitV2ChatEnabled,
} from "@/lib/copilotkit-v2-chat-flag";

describe("copilotkit-v2-chat-flag", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns false when unset", () => {
    vi.stubEnv("COPILOTKIT_V2_CHAT", "");
    expect(isCopilotKitV2ChatEnabled()).toBe(false);
  });

  it("returns false when off", () => {
    vi.stubEnv("COPILOTKIT_V2_CHAT", "0");
    expect(isCopilotKitV2ChatEnabled()).toBe(false);
  });

  it("returns true only when COPILOTKIT_V2_CHAT=1", () => {
    vi.stubEnv("COPILOTKIT_V2_CHAT", "1");
    expect(isCopilotKitV2ChatEnabled()).toBe(true);
  });

  it("client flag reads NEXT_PUBLIC_COPILOTKIT_V2_CHAT only", () => {
    vi.stubEnv("NEXT_PUBLIC_COPILOTKIT_V2_CHAT", "1");
    expect(isCopilotKitV2ChatClientEnabled()).toBe(true);
  });
});
