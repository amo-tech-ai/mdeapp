import { google } from "@ai-sdk/google";
import type { LanguageModelV1 } from "ai";

const hasGemini = Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

if (!hasGemini && !hasOpenAI) {
  console.error(
    "[models] Neither GOOGLE_GENERATIVE_AI_API_KEY nor OPENAI_API_KEY is set. " +
      "All Mastra agents will fail at inference time.",
  );
} else if (!hasGemini && hasOpenAI) {
  console.warn(
    "[models] GOOGLE_GENERATIVE_AI_API_KEY missing — falling back to OpenAI (dev/preview only). " +
      "Production must use Gemini.",
  );
}

/**
 * Phase 1 production default: gemini-3.5-flash.
 * Dev/preview fallback: openai/gpt-5.4-mini via Mastra model router when
 * GOOGLE_GENERATIVE_AI_API_KEY is absent and OPENAI_API_KEY is set.
 * NEVER ship the OpenAI fallback path to production — Gemini is required.
 */
export const FLASH_MODEL: LanguageModelV1 | string = hasGemini
  ? google("gemini-3.5-flash")
  : "openai/gpt-5.4-mini";

export const PRO_MODEL: LanguageModelV1 | string = hasGemini
  ? google("gemini-3.1-pro-preview")
  : "openai/gpt-5.4-mini";

/** Legacy aliases (my-mastra-app used string IDs; mdeapp uses AI SDK) */
export const CONCIERGE_MODEL = FLASH_MODEL;
export const REASONING_MODEL = FLASH_MODEL;
export const PLANNING_MODEL = FLASH_MODEL;
