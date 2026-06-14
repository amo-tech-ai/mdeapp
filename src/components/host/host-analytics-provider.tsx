"use client";

import { CopilotKit } from "@copilotkit/react-core/v2";
import { getCopilotKitClientProps } from "@/lib/copilotkit-client-props";

export function HostAnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CopilotKit {...getCopilotKitClientProps("hostOpsAgent")} enableInspector={false}>
      {children}
    </CopilotKit>
  );
}
