import { google } from "@ai-sdk/google";
import { withTokenUsageTracking } from "./token-usage-middleware";

/**
 * Phase 1 default: gemini-3.5-flash (all agents).
 * Wrapped with COST-001 token-usage tracking so every agent model call records
 * its Gemini token usage into the active per-turn sink (token-usage-middleware).
 * The wrapper is transparent — same LanguageModelV2 contract, no behavior change.
 * @see https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash
 */
export const FLASH_MODEL = withTokenUsageTracking(google("gemini-3.5-flash"));
export const PRO_MODEL = withTokenUsageTracking(
  google("gemini-3.1-pro-preview"),
);

/** Legacy aliases (my-mastra-app used string IDs; mdeapp uses AI SDK) */
export const CONCIERGE_MODEL = FLASH_MODEL;
export const REASONING_MODEL = FLASH_MODEL;
export const PLANNING_MODEL = FLASH_MODEL;
