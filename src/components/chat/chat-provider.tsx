"use client";

import { CopilotKit } from "@copilotkit/react-core/v2";
import { useState, type ReactNode } from "react";
import { getCopilotKitClientProps } from "@/lib/copilotkit-client-props";
import { reportConciergeError } from "@/lib/concierge-error-store";

/** Fresh threadId per mount for the chat workspace provider. */
export function ChatProvider({ children }: { children: ReactNode }) {
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
