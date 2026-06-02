"use client";

import type { ReactNode } from "react";
import { CopilotKit } from "@copilotkit/react-core";
import { ConciergeCoAgentProvider } from "@/components/chat/concierge-coagent-context";
import { getCopilotKitClientProps } from "@/lib/copilotkit-client-props";
import { reportConciergeError } from "@/lib/concierge-error-store";
import { ThreadNavProvider, useThreadNav } from "@/lib/chat/thread-nav-context";

function CopilotKitWithThread({ children }: { children: ReactNode }) {
  const { activeThreadId } = useThreadNav();
  return (
    <CopilotKit
      {...getCopilotKitClientProps("conciergeAgent")}
      threadId={activeThreadId}
      onError={reportConciergeError}
    >
      <ConciergeCoAgentProvider>{children}</ConciergeCoAgentProvider>
    </CopilotKit>
  );
}

/** Client wrapper so `onError` (a function) can be passed to <CopilotKit> without
 *  violating Next.js App Router's "no functions from Server Components" rule. */
export function MdeCopilotKitProvider({ children }: { children: ReactNode }) {
  return (
    <ThreadNavProvider>
      <CopilotKitWithThread>{children}</CopilotKitWithThread>
    </ThreadNavProvider>
  );
}
