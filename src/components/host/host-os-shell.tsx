"use client";

import { useCallback, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CopilotKit } from "@copilotkit/react-core/v2";
import { getCopilotKitClientProps } from "@/lib/copilotkit-client-props";
import { HostContextProvider } from "@/components/host/host-context-provider";
import { HostOsHeader } from "@/components/host/host-os-header";
import { HostOsBody, CHAT_REGION_ID } from "@/components/host/host-os-body";
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
