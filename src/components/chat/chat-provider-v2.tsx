"use client";

import "@copilotkit/react-core/v2/styles.css";
import { CopilotKit } from "@copilotkit/react-core/v2";
import { useState, type ReactNode } from "react";
import { getCopilotKitClientProps } from "@/lib/copilotkit-client-props";
import { reportConciergeError } from "@/lib/concierge-error-store";

/**
 * SAN-901 · CK-V2-004A — v2 subpath provider for /chat (flag on).
 * Fresh threadId per mount — spike scope; SAN-890 wires ThreadNav.
 */
export function ChatProviderV2({ children }: { children: ReactNode }) {
  const [threadId] = useState(() => crypto.randomUUID());

  return (
    <CopilotKit
      {...getCopilotKitClientProps("conciergeAgent")}
      threadId={threadId}
      enableInspector={false}
      onError={reportConciergeError}
    >
      {children}
    </CopilotKit>
  );
}
