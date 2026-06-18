"use client";

import Link from "next/link";
import { CopilotChat } from "@copilotkit/react-core/v2";
import { AuthStatus } from "@/components/auth/auth-status";
import { HostNavRail } from "@/components/host/host-nav-rail";
import { HostOpsCopilotBridge } from "@/components/host/host-ops-copilot-bridge";
import { HostKpiPanel } from "@/components/host/host-kpi-panel";
import { HostNarrativeBanner } from "@/components/host/host-narrative-banner";
import { HostAnalyticsAside } from "@/components/host/host-analytics-aside";
import { HostAnalyticsPromptChips } from "@/components/host/host-analytics-prompt-chips";
import type { HostDashboardState } from "@/lib/types/host-dashboard";

const ANALYTICS_LABELS = {
  title: "Sales insights",
  initial:
    'Ask me about your sales — e.g. "how are my sales?" or "how is my best event doing?" I\'ll pull the numbers and fill the cards above.',
};

type HostAnalyticsShellProps = {
  userEmail?: string | null;
  initialDashboard?: HostDashboardState;
};

function hostDashboardServerKey(initial?: HostDashboardState): string {
  if (!initial) return "idle:0";
  return (
    initial.lastUpdatedIso ?? `${initial.workflowStatus}:${initial.kpiCards.length}`
  );
}

export function HostAnalyticsShell({
  userEmail,
  initialDashboard,
}: HostAnalyticsShellProps) {
  return (
    <HostOpsCopilotBridge
      key={hostDashboardServerKey(initialDashboard)}
      initialState={initialDashboard}
    >
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
                {state.kpiCards.length === 0 && state.workflowStatus !== "loading" ? (
                  <HostAnalyticsPromptChips />
                ) : null}
              </div>
              <div
                id="host-ops-chat-region"
                data-testid="host-ops-chat-region"
                aria-live="polite"
                aria-relevant="additions"
                className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-t border-border px-2 pb-2 pt-1 sm:px-4"
              >
                <CopilotChat
                  agentId="hostOpsAgent"
                  className="copilotKitChat--center mde-center-copilot-chat min-h-0 flex-1"
                  labels={{
                    modalHeaderTitle: ANALYTICS_LABELS.title,
                    welcomeMessageText: ANALYTICS_LABELS.initial,
                  }}
                />
              </div>
            </section>

            <aside
              aria-label={
                state.recommendations.length > 0
                  ? "Recommended actions"
                  : "Sales assistant"
              }
              className="shrink-0 overflow-y-auto border-t border-border p-4 md:w-72 md:border-l md:border-t-0"
            >
              <HostAnalyticsAside state={state} />
            </aside>
          </div>
        </div>
      )}
    </HostOpsCopilotBridge>
  );
}
