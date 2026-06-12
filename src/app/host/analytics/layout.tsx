import { CopilotKit } from "@copilotkit/react-core";
import { getCopilotKitClientProps } from "@/lib/copilotkit-client-props";

/**
 * SAN-729 · AIE-008 — per-route CopilotKit provider for /host/analytics.
 * Binds the runtime to `hostOpsAgent` (must match useCoAgent({ name: "hostOpsAgent" })
 * in HostOpsCopilotBridge and the key in Mastra({ agents: { hostOpsAgent } })).
 */
export default function HostAnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CopilotKit {...getCopilotKitClientProps("hostOpsAgent")}>
      {children}
    </CopilotKit>
  );
}
