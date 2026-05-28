import { afterEach, describe, expect, it, vi } from "vitest";

import { getCopilotKitClientProps } from "../copilotkit-client-props";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getCopilotKitClientProps", () => {
  it("returns the same-origin runtimeUrl in production even when the Cloud public API key is set", () => {
    // The regression guard for UX-001: production must NOT route to CopilotKit
    // Cloud (v2), which cannot reach our in-process v1 agents.
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY", "ck_pub_should_be_ignored");

    const props = getCopilotKitClientProps("conciergeAgent");

    expect(props).toEqual({
      agent: "conciergeAgent",
      runtimeUrl: "/api/copilotkit",
      showDevConsole: false,
    });
    expect("publicApiKey" in props).toBe(false);
  });

  it("returns the same-origin runtimeUrl in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY", "");

    const props = getCopilotKitClientProps("hostEventAgent");

    expect(props).toEqual({
      agent: "hostEventAgent",
      runtimeUrl: "/api/copilotkit",
      showDevConsole: false,
    });
  });

  it("never passes publicApiKey for either agent, regardless of the Cloud env var", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY", "ck_pub_live_value");

    for (const agent of ["conciergeAgent", "hostEventAgent"] as const) {
      const props = getCopilotKitClientProps(agent);
      expect("publicApiKey" in props).toBe(false);
      expect((props as { runtimeUrl?: string }).runtimeUrl).toBe("/api/copilotkit");
    }
  });
});
