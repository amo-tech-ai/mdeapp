"use client";

import { type ReactNode } from "react";
import { CopilotChat } from "@copilotkit/react-core/v2";
import { HostOsNav } from "@/components/host/host-os-nav";
import { HostInboxPlaceholder } from "@/components/host/host-inbox-placeholder";
import { HOST_OS_CHAT_LABELS, HostOsChatTitle } from "@/components/host/host-os-chat-title";

export const CHAT_REGION_ID = "host-os-chat-region";

type HostOsBodyProps = {
  children: ReactNode;
  routeLabel: string;
};

// skipcq: JS-0067 - ES module export; not browser global scope
export function HostOsBody({ children, routeLabel }: HostOsBodyProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col md:flex-row">
      <HostOsNav />
      <section
        aria-label={`${routeLabel} workspace`}
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto"
      >
        {children}
      </section>
      <aside
        id={CHAT_REGION_ID}
        data-testid="host-os-chat-region"
        aria-label="Host concierge"
        aria-live="polite"
        aria-relevant="additions"
        className="flex h-[60vh] shrink-0 flex-col gap-3 overflow-hidden border-t border-border p-3 md:h-auto md:w-80 md:border-l md:border-t-0 lg:w-96"
      >
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
        <HostInboxPlaceholder />
      </aside>
    </div>
  );
}
