import {
  PromptInjectionDetector,
  TokenLimiter,
  type InputProcessor,
} from "@mastra/core/processors";
import { FLASH_MODEL } from "./models";

/**
 * Default Mastra input processors for chat agents.
 * PromptInjectionDetector adds a full extra LLM round-trip per turn — skip in dev
 * unless MASTRA_PROMPT_INJECTION_GUARD=true (opt-in for local security testing).
 */
export function getDefaultInputProcessors(): InputProcessor[] {
  const processors: InputProcessor[] = [new TokenLimiter(8192)];

  const forceOn = process.env.MASTRA_PROMPT_INJECTION_GUARD === "true";
  const forceOff = process.env.MASTRA_PROMPT_INJECTION_GUARD === "false";
  const isDev = process.env.NODE_ENV === "development";

  if (forceOn || (!isDev && !forceOff)) {
    processors.unshift(new PromptInjectionDetector({ model: FLASH_MODEL }));
  }

  return processors;
}
