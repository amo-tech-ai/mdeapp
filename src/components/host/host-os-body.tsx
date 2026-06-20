"use client";

import { type ReactNode } from "react";
import { CopilotChat } from "@copilotkit/react-core/v2";
import { HostOsNav } from "@/components/host/host-os-nav";
import { HostInboxPlaceholder } from "@/components/host/host-inbox-placeholder";
import { HOST_OS_CHAT_LABELS, HostOsChatTitle } from "@/components/host/host-os-chat-title";
import { HostErrorBoundary } from "@/components/host/host-error-boundary";

export const CHAT_REGION_ID = "host-os-chat-region";

type HostOsBodyProps = {
  children: ReactNode;
  routeLabel: string;
};

/** Shown when the page body subtree throws — body must never blank silently. */
function HostBodyFallback() {
  return (
    <div
      data-testid="host-os-body-fallback"
      role="alert"
      className="m-4 rounded-lg border border-border bg-muted/30 p-6 text-sm"
    >
      <p className="font-medium text-foreground">This view couldn’t load.</p>
      <p className="mt-1 text-muted-foreground">
        Something went wrong rendering this workspace. Refresh the page to try
        again — your other host screens are unaffected.
      </p>
    </div>
  );
}

/** Shown when the persistent Copilot rail throws — page body stays intact. */
function HostRailFallback() {
  return (
    <div
      data-testid="host-os-chat-fallback"
      role="status"
      className="flex min-h-0 flex-1 flex-col justify-center rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground"
    >
      <p className="font-medium text-foreground">
        Host concierge temporarily unavailable
      </p>
      <p className="mt-1">
        The assistant couldn’t connect right now. The rest of your workspace
        still works — refresh to bring it back.
      </p>
    </div>
  );
}

// skipcq: JS-0067 - ES module export; not browser global scope
export function HostOsBody({ children, routeLabel }: HostOsBodyProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col md:flex-row">
      <HostOsNav />
      <section
        aria-label={`${routeLabel} workspace`}
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto"
      >
        {/* The page body must survive even if a routed page subtree throws —
            otherwise one bad render blanks Roberto's whole workspace. */}
        <HostErrorBoundary label="page-body" fallback={<HostBodyFallback />}>
          {children}
        </HostErrorBoundary>
      </section>
      <aside
        id={CHAT_REGION_ID}
        data-testid="host-os-chat-region"
        aria-label="Host concierge"
        aria-live="polite"
        aria-relevant="additions"
        className="flex h-[60vh] shrink-0 flex-col gap-3 overflow-hidden border-t border-border p-3 md:h-auto md:w-80 md:border-l md:border-t-0 lg:w-96"
      >
        {/* Isolate the persistent Copilot rail: if the hostOpsAgent runtime
            connection throws, the page body next to it stays rendered. */}
        <HostErrorBoundary label="copilot-rail" fallback={<HostRailFallback />}>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <HostOsChatTitle />
            <CopilotChat
              agentId="hostOpsAgent"
              className="copilotKitChat--center mde-center-copilot-chat min-h-0 flex-1"
              labels={{
                modalHeaderTitle: HOST_OS_CHAT_LABELS.title,
                welcomeMessageText: HOST_OS_CHAT_LABELS.initial,
              }}
            />
          </div>
        </HostErrorBoundary>
        <HostInboxPlaceholder />
      </aside>
    </div>
  );
}
