import { describe, it, expect, afterEach, vi } from "vitest";
import { getDefaultInputProcessors } from "../agent-input-processors";

describe("getDefaultInputProcessors", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("skips PromptInjectionDetector in development by default", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("MASTRA_PROMPT_INJECTION_GUARD", "");
    const processors = getDefaultInputProcessors();
    expect(processors).toHaveLength(1);
  });

  // PERF-002: the LLM injection detector is now opt-in (it added a full extra
  // Gemini round-trip per turn). Production no longer enables it by default.
  it("skips PromptInjectionDetector in production by default", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("MASTRA_PROMPT_INJECTION_GUARD", "");
    expect(getDefaultInputProcessors()).toHaveLength(1);
  });

  it("enables PromptInjectionDetector only when MASTRA_PROMPT_INJECTION_GUARD=true", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("MASTRA_PROMPT_INJECTION_GUARD", "true");
    expect(getDefaultInputProcessors()).toHaveLength(2);

    vi.stubEnv("NODE_ENV", "production");
    expect(getDefaultInputProcessors()).toHaveLength(2);
  });
});
