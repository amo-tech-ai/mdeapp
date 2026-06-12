"use client";

import Link from "next/link";
import { CopilotChat } from "@copilotkit/react-core/v2";
import { AuthStatus } from "@/components/auth/auth-status";
import { HostNavRail } from "@/components/host/host-nav-rail";
import { HostOpsCopilotBridgeV2 } from "@/components/host/host-ops-copilot-bridge-v2";
import { HostKpiPanel } from "@/components/host/host-kpi-panel";
import { HostNarrativeBanner } from "@/components/host/host-narrative-banner";
import { HostRecommendationsPanel } from "@/components/host/host-recommendations-panel";

const ANALYTICS_LABELS = {
  title: "Sales insights",
  initial:
    'Ask me about your sales — e.g. "how are my sales?" or "how is my best event doing?" I\'ll pull the numbers and fill the cards above.',
};

type HostAnalyticsShellV2Props = {
  userEmail?: string | null;
};

/**
 * SAN-888 · CK-V2-002 — v2 analytics shell (flag on).
 * v1 host-analytics-shell.tsx unchanged for flag-off parity.
 */
export function HostAnalyticsShellV2({ userEmail }: HostAnalyticsShellV2Props) {
  return (
    <HostOpsCopilotBridgeV2>
      {({ state }) => (
        <div
          data-testid="host-analytics"
          className="flex min-h-screen flex-col bg-background text-foreground"
        >
          <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-6">
            <div className="min-w-0">
              <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
                ← mdeai
              </Link>
              <h1 className="text-lg font-semibold sm:text-xl">Sales insights</h1>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">
                {userEmail ? `Signed in as ${userEmail}` : "Host workspace"}
              </p>
            </div>
            <AuthStatus />
          </header>

          <div className="flex min-h-0 flex-1 flex-col md:flex-row">
            <HostNavRail />

            <section
              aria-label="Sales dashboard"
              className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
            >
              <div className="space-y-3 overflow-y-auto p-4">
                <HostNarrativeBanner state={state} />
                <HostKpiPanel state={state} />
              </div>
              <div
                id="host-ops-chat-region"
                data-testid="host-ops-chat-region"
                aria-live="polite"
                aria-relevant="additions"
                className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-t border-border px-2 pb-2 pt-1 sm:px-4"
              >
                <CopilotChat
                  className="copilotKitChat--center mde-center-copilot-chat min-h-0 flex-1"
                  labels={{
                    modalHeaderTitle: ANALYTICS_LABELS.title,
                    welcomeMessageText: ANALYTICS_LABELS.initial,
                  }}
                />
              </div>
            </section>

            <aside
              aria-label="Recommended actions"
              className="shrink-0 overflow-y-auto border-t border-border p-4 md:w-72 md:border-l md:border-t-0"
            >
              <HostRecommendationsPanel state={state} />
            </aside>
          </div>
        </div>
      )}
    </HostOpsCopilotBridgeV2>
  );
}
