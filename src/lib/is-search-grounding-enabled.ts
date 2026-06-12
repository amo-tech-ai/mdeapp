/**
 * VERCEL-CPU-001 — web search grounding (ADK sidecar) is off in Vercel production
 * regardless of ENABLE_SEARCH_GROUNDING. Prevents a second long Gemini/ADK hop per
 * event chat turn when prod env was left enabled.
 */
export function isSearchGroundingEnabled(): boolean {
  if (process.env.VERCEL_ENV === "production") return false;
  return process.env.ENABLE_SEARCH_GROUNDING?.trim() === "1";
}
