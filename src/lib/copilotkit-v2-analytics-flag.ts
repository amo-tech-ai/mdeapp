/**
 * SAN-888 · CK-V2-002 — gate v2 CopilotKit on /host/analytics only.
 * Server-only read; default off preserves prod v1 behavior.
 */
export function isCopilotKitV2AnalyticsEnabled(): boolean {
  return process.env.COPILOTKIT_V2_ANALYTICS === "1";
}
