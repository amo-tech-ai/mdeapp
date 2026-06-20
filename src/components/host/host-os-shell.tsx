"use client";

import Link from "next/link";
import { useCallback, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CopilotChat, CopilotKit } from "@copilotkit/react-core/v2";
import { getCopilotKitClientProps } from "@/lib/copilotkit-client-props";
import { AuthStatus } from "@/components/auth/auth-status";
import { HostOsNav } from "@/components/host/host-os-nav";
import { HostCommandBar } from "@/components/host/host-command-bar";
import { HostInboxPlaceholder } from "@/components/host/host-inbox-placeholder";
import { HostContextProvider } from "@/components/host/host-context-provider";
import { deriveHostOsRouteLabel } from "@/lib/host/host-os-nav";

/**
 * SAN-1209 · HOST-OS-001 — Unified Host OS Shell.
 *
 * The single frame for Roberto's whole host workspace (Overview · Events ·
 * Analytics). Before this, each host page mounted its OWN nav rail + its OWN
 * CopilotChat under its OWN CopilotKit provider — so walking from Dashboard to
 * Analytics crossed a provider boundary and the conversation reset. This shell
 * lifts ONE `hostOpsAgent` provider, ONE persistent chat, ONE nav, and the
 * shared header/context above the routed pages, so the frame (and the
 * conversation) survive client-side navigation between host screens.
 *
 * Rendered once by `src/app/host/layout.tsx` for the OS routes; the marketing
 * landing (`/host`), the event wizard (`/host/event*`, own provider) and the
 * real-estate broker area (`/host/rentals*`) stay passthrough.
 */

const HOST_OS_CHAT_LABELS = {
  title: "Host concierge",
  initial:
    "Ask about any event, your sales, venues or attendees. I keep the thread across Overview, Events and Analytics — no need to re-explain which event we're on.",
};

const CHAT_REGION_ID = "host-os-chat-region";

function HostOsHeader({
  routeLabel,
  onAskAi,
}: {
  routeLabel: string;
  onAskAi: () => void;
}) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-6">
      <div className="min-w-0">
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
          ← mdeai
        </Link>
        <h1
          data-testid="host-os-route-label"
          className="text-lg font-semibold sm:text-xl"
        >
          {routeLabel}
        </h1>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <HostCommandBar onAskAi={onAskAi} />
        <AuthStatus />
      </div>
    </header>
  );
}

function HostOsBody({
  children,
  routeLabel,
}: {
  children: ReactNode;
  routeLabel: string;
}) {
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
          <div className="mb-2 shrink-0">
            <p className="text-sm font-semibold text-foreground">
              <span aria-hidden="true" className="mr-1 text-accent-foreground">
                ✦
              </span>
              {HOST_OS_CHAT_LABELS.title}
            </p>
            <p className="text-xs text-muted-foreground">
              Persistent across your host workspace.
            </p>
          </div>
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

// skipcq: JS-0067 - ES module export; not browser global scope
export function HostOsShell({ children }: { children: ReactNode }) {
  const [threadId] = useState(() => crypto.randomUUID());
  const pathname = usePathname();
  const routeLabel = deriveHostOsRouteLabel(pathname);

  const focusChat = useCallback(() => {
    const region = document.getElementById(CHAT_REGION_ID);
    region?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    const input = region?.querySelector<HTMLElement>("textarea, input");
    input?.focus();
  }, []);

  return (
    <CopilotKit
      {...getCopilotKitClientProps("hostOpsAgent")}
      threadId={threadId}
      enableInspector={false}
    >
      <HostContextProvider>
        <div
          data-testid="host-os-shell"
          className="flex min-h-screen flex-col bg-background text-foreground"
        >
          <HostOsHeader routeLabel={routeLabel} onAskAi={focusChat} />
          <HostOsBody routeLabel={routeLabel}>{children}</HostOsBody>
        </div>
      </HostContextProvider>
    </CopilotKit>
  );
}
