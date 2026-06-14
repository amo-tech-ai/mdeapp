"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CopilotKit } from "@copilotkit/react-core/v2";
import { ConciergeCoAgentProvider } from "@/components/chat/concierge-coagent-context";
import { getCopilotKitClientProps } from "@/lib/copilotkit-client-props";
import { reportConciergeError } from "@/lib/concierge-error-store";
import { ThreadNavProvider, useThreadNav } from "@/lib/chat/thread-nav-context";

function CopilotKitWithThread({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { activeThreadId } = useThreadNav();

  // /chat and /host/* use per-route v2 providers in their layouts.
  if (
    pathname === "/chat" ||
    pathname.startsWith("/host/analytics") ||
    pathname.startsWith("/host/event")
  ) {
    return <>{children}</>;
  }

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

/** Client wrapper so `onError` can be passed to <CopilotKit> without Server Component restrictions. */
export function MdeCopilotKitProvider({ children }: { children: ReactNode }) {
  return (
    <ThreadNavProvider>
      <CopilotKitWithThread>{children}</CopilotKitWithThread>
    </ThreadNavProvider>
  );
}
