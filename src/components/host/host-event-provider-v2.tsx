"use client";

import "@copilotkit/react-core/v2/styles.css";
import { CopilotKit } from "@copilotkit/react-core/v2";
import { getCopilotKitClientProps } from "@/lib/copilotkit-client-props";

/**
 * SAN-889 · CK-V2-003 — v2 subpath provider for /host/event/* (flag on).
 * Pattern-1 runtime props unchanged; backend/Mastra untouched.
 */
export function HostEventProviderV2({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CopilotKit {...getCopilotKitClientProps("hostEventAgent")} enableInspector={false}>
      {children}
    </CopilotKit>
  );
}
