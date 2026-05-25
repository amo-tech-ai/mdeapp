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

  it("includes PromptInjectionDetector in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("MASTRA_PROMPT_INJECTION_GUARD", "");
    expect(getDefaultInputProcessors()).toHaveLength(2);
  });

  it("respects MASTRA_PROMPT_INJECTION_GUARD=true in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("MASTRA_PROMPT_INJECTION_GUARD", "true");
    expect(getDefaultInputProcessors()).toHaveLength(2);
  });
});
