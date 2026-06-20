"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CopilotKit } from "@copilotkit/react-core/v2";
import { ConciergeCoAgentProvider } from "@/components/chat/concierge-coagent-context";
import { getCopilotKitClientProps } from "@/lib/copilotkit-client-props";
import { reportConciergeError } from "@/lib/concierge-error-store";
import { ThreadNavProvider, useThreadNav } from "@/lib/chat/thread-nav-context";
import { isHostOsShellRoute } from "@/lib/host/host-os-nav";

// skipcq: JS-0067 - module-local helper; not browser global scope
function CopilotKitWithThread({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { activeThreadId } = useThreadNav();

  // These routes bring their own v2 provider in a layout, so the root
  // conciergeAgent provider must NOT also wrap them:
  //  - /chat            → the public concierge layout
  //  - /host/event*     → the event wizard (HostEventProvider / hostEventAgent)
  //  - Host OS routes   → the unified HostOsShell (hostOpsAgent) via host/layout
  // SAN-1209: the Host OS shell now owns Overview · Events · Analytics under one
  // persistent hostOpsAgent provider. Marketing /host and /host/rentals* stay on
  // the root provider (isHostOsShellRoute returns false for them).
  if (
    pathname === "/chat" ||
    pathname.startsWith("/host/event") ||
    isHostOsShellRoute(pathname)
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
