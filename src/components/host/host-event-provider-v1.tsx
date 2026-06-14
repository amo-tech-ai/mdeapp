"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { useState } from "react";
import { getCopilotKitClientProps } from "@/lib/copilotkit-client-props";

/**
 * SAN-889 · CK-V2-003 — v1 CopilotKit provider for /host/event/* (flag off).
 * SAN-905 · fresh threadId per wizard session — avoids stale thought_signature history.
 */
export function HostEventProviderV1({
  children,
}: {
  children: React.ReactNode;
}) {
  const [threadId] = useState(() => crypto.randomUUID());

  return (
    <CopilotKit
      {...getCopilotKitClientProps("hostEventAgent")}
      threadId={threadId}
    >
      {children}
    </CopilotKit>
  );
}
