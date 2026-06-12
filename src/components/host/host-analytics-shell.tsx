"use client";

import Link from "next/link";
import { CopilotChat } from "@copilotkit/react-ui";
import { AuthStatus } from "@/components/auth/auth-status";
import { HostNavRail } from "@/components/host/host-nav-rail";
import { HostOpsCopilotBridge } from "@/components/host/host-ops-copilot-bridge";
import { HostKpiPanel } from "@/components/host/host-kpi-panel";
import { HostNarrativeBanner } from "@/components/host/host-narrative-banner";
import { HostRecommendationsPanel } from "@/components/host/host-recommendations-panel";

const ANALYTICS_LABELS = {
  title: "Sales insights",
  initial:
    'Ask me about your sales — e.g. "how are my sales?" or "how is my best event doing?" I\'ll pull the numbers and fill the cards above.',
};

type HostAnalyticsShellProps = {
  userEmail?: string | null;
};

/**
 * SAN-729 · AIE-008 — Host Analytics Page + HostOpsCopilotBridge.
 * Three-panel AI-native dashboard: nav rail · KPI canvas (top) + chat (bottom) ·
 * recommendations (right). Everything renders from HostDashboardState — the agent
 * fills it live; NO Supabase fetch in this surface.
 */
export function HostAnalyticsShell({ userEmail }: HostAnalyticsShellProps) {
  return (
    <HostOpsCopilotBridge>
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

            {/* Center: KPI canvas + chat */}
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
                  labels={ANALYTICS_LABELS}
                />
              </div>
            </section>

            {/* Right: contextual detail (recommendations) */}
            <aside
              aria-label="Recommended actions"
              className="shrink-0 overflow-y-auto border-t border-border p-4 md:w-72 md:border-l md:border-t-0"
            >
              <HostRecommendationsPanel state={state} />
            </aside>
          </div>
        </div>
      )}
    </HostOpsCopilotBridge>
  );
}
