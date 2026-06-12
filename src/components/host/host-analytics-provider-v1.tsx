"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { getCopilotKitClientProps } from "@/lib/copilotkit-client-props";

/**
 * SAN-888 · CK-V2-002 — v1 CopilotKit provider for /host/analytics (flag off).
 * Extracted from layout; v1 originals stay unchanged for rollback.
 */
export function HostAnalyticsProviderV1({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CopilotKit {...getCopilotKitClientProps("hostOpsAgent")}>{children}</CopilotKit>
  );
}
