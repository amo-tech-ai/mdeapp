/**
 * SAN-901 · CK-V2-004A — gate v2 CopilotKit on /chat only.
 * Both env vars must be "1" together — prevents server/client provider drift.
 */
export function isCopilotKitV2ChatEnabled(): boolean {
  return (
    process.env.COPILOTKIT_V2_CHAT === "1" &&
    process.env.NEXT_PUBLIC_COPILOTKIT_V2_CHAT === "1"
  );
}

/** Same gate as server — single source of truth for root provider skip. */
export function isCopilotKitV2ChatClientEnabled(): boolean {
  return isCopilotKitV2ChatEnabled();
}
