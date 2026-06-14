"use client";

import "@copilotkit/react-core/v2/styles.css";
import { CopilotKit } from "@copilotkit/react-core/v2";
import { useMemo } from "react";
import { getCopilotKitClientProps } from "@/lib/copilotkit-client-props";

/**
 * SAN-889 · CK-V2-003 — v2 subpath provider for /host/event/* (flag on).
 * SAN-905 · fresh threadId per wizard session — avoids stale thought_signature history.
 */
export function HostEventProviderV2({
  children,
}: {
  children: React.ReactNode;
}) {
  const threadId = useMemo(() => crypto.randomUUID(), []);

  return (
    <CopilotKit
      {...getCopilotKitClientProps("hostEventAgent")}
      threadId={threadId}
      enableInspector={false}
    >
      {children}
    </CopilotKit>
  );
}
