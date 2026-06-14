/**
 * SAN-901 · CK-V2-004A — gate v2 CopilotKit on /chat only.
 * Server-only read; default off preserves prod v1 behavior.
 */
export function isCopilotKitV2ChatEnabled(): boolean {
  return process.env.COPILOTKIT_V2_CHAT === "1";
}

/** Client mirror — set alongside COPILOTKIT_V2_CHAT so root provider skips v1 on /chat. */
export function isCopilotKitV2ChatClientEnabled(): boolean {
  return process.env.NEXT_PUBLIC_COPILOTKIT_V2_CHAT === "1";
}
