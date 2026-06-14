import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isCopilotKitV2ChatClientEnabled,
  isCopilotKitV2ChatEnabled,
} from "@/lib/copilotkit-v2-chat-flag";

describe("copilotkit-v2-chat-flag", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns false when both unset", () => {
    vi.stubEnv("COPILOTKIT_V2_CHAT", "");
    vi.stubEnv("NEXT_PUBLIC_COPILOTKIT_V2_CHAT", "");
    expect(isCopilotKitV2ChatEnabled()).toBe(false);
  });

  it("returns false when only server flag is on", () => {
    vi.stubEnv("COPILOTKIT_V2_CHAT", "1");
    vi.stubEnv("NEXT_PUBLIC_COPILOTKIT_V2_CHAT", "");
    expect(isCopilotKitV2ChatEnabled()).toBe(false);
  });

  it("returns false when only client flag is on", () => {
    vi.stubEnv("COPILOTKIT_V2_CHAT", "");
    vi.stubEnv("NEXT_PUBLIC_COPILOTKIT_V2_CHAT", "1");
    expect(isCopilotKitV2ChatEnabled()).toBe(false);
  });

  it("returns true only when both flags are 1", () => {
    vi.stubEnv("COPILOTKIT_V2_CHAT", "1");
    vi.stubEnv("NEXT_PUBLIC_COPILOTKIT_V2_CHAT", "1");
    expect(isCopilotKitV2ChatEnabled()).toBe(true);
    expect(isCopilotKitV2ChatClientEnabled()).toBe(true);
  });
});
