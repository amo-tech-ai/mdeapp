import { google } from "@ai-sdk/google";

/**
 * Phase 1 default: gemini-3.5-flash (all agents).
 * @see https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash
 */
export const FLASH_MODEL = google("gemini-3.5-flash");
export const PRO_MODEL = google("gemini-3.1-pro-preview");

/** Legacy aliases (my-mastra-app used string IDs; mdeapp uses AI SDK) */
export const CONCIERGE_MODEL = FLASH_MODEL;
export const REASONING_MODEL = FLASH_MODEL;
export const PLANNING_MODEL = FLASH_MODEL;
