"use client";

import "@copilotkit/react-core/v2/styles.css";
import { CopilotKit } from "@copilotkit/react-core/v2";
import { getCopilotKitClientProps } from "@/lib/copilotkit-client-props";

/**
 * SAN-888 · CK-V2-002 — v2 subpath provider for /host/analytics (flag on).
 * Pattern-1 runtime props unchanged; backend/Mastra untouched.
 */
export function HostAnalyticsProviderV2({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CopilotKit {...getCopilotKitClientProps("hostOpsAgent")}>{children}</CopilotKit>
  );
}
