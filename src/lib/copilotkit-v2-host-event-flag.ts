/**
 * SAN-889 · CK-V2-003 — gate v2 CopilotKit on /host/event/* only.
 * Server-only read; default off preserves prod v1 behavior.
 */
export function isCopilotKitV2HostEventEnabled(): boolean {
  return process.env.COPILOTKIT_V2_HOST_EVENT === "1";
}
