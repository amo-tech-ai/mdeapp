"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { getCopilotKitClientProps } from "@/lib/copilotkit-client-props";

/**
 * SAN-889 · CK-V2-003 — v1 CopilotKit provider for /host/event/* (flag off).
 * Extracted from layout; v1 path unchanged for rollback.
 */
export function HostEventProviderV1({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CopilotKit {...getCopilotKitClientProps("hostEventAgent")}>{children}</CopilotKit>
  );
}
