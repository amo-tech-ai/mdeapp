import {
  PromptInjectionDetector,
  TokenLimiter,
  type InputProcessor,
} from "@mastra/core/processors";
import { FLASH_MODEL } from "./models";

/**
 * Default Mastra input processors for chat agents.
 *
 * PERF-002: PromptInjectionDetector runs a full extra Gemini round-trip BEFORE
 * the agent's own model call — measured at ~3–5s of fixed latency on every turn,
 * the reason a zero-tool concierge turn still took ~9.7s (p50). The concierge is
 * read-only search plus one human-approved (HITL) booking request, so the
 * injection blast radius is low. We make the detector OPT-IN
 * (MASTRA_PROMPT_INJECTION_GUARD=true) instead of auto-on in production.
 * TokenLimiter (non-LLM, no round-trip) always stays on.
 *
 * To re-enable the guard for a deploy: set MASTRA_PROMPT_INJECTION_GUARD=true.
 */
export function getDefaultInputProcessors(): InputProcessor[] {
  const processors: InputProcessor[] = [new TokenLimiter(8192)];

  if (process.env.MASTRA_PROMPT_INJECTION_GUARD === "true") {
    processors.unshift(new PromptInjectionDetector({ model: FLASH_MODEL }));
  }

  return processors;
}
