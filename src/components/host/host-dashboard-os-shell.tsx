"use client";

import Link from "next/link";
import { CopilotChat } from "@copilotkit/react-core/v2";
import { AuthStatus } from "@/components/auth/auth-status";
import { HostNavRail } from "@/components/host/host-nav-rail";
import { HostOpsCopilotBridge } from "@/components/host/host-ops-copilot-bridge";
import { HostDashboardOverview } from "@/components/host/host-dashboard-overview";
import type { HostDashboardState } from "@/lib/types/host-dashboard";

/**
 * SAN-1194 · HOST-DASH-001 — Host Dashboard OS.
 *
 * Roberto's "is my business healthy today?" home base (NOT Analytics deep-BI, NOT
 * the single-event Command Center). It AGGREGATES the host workspace into a 5-second
 * read: a figure-free AI daily briefing, a KPI snapshot, needs-attention items, and
 * quick links out to the workspaces that own each action.
 *
 * GUARDRAIL (inherited from SAN-759 · AIE-007 — salesInsightWorkflow /
 * SAN-760 · AIE-005 — hostOpsAgent + HostDashboardState): every number lives in a
 * data card produced by the deterministic loader / get_sales_insights result. The
 * briefing narrates trends in prose and NEVER re-types a figure. Numeric state is
 * owned by HostOpsCopilotBridge; the agent (hostOpsAgent) may only narrate, never
 * recompute. The presentational body lives in HostDashboardOverview (no CopilotKit
 * context, unit-testable); this shell only adds chrome + the live concierge chat.
 *
 * First slice: Portfolio snapshot + Business health render as honest data-pending
 * placeholders — the loader does not populate per-event `events` yet (that is a
 * follow-up). Nothing here is mocked: shown numbers are real or absent.
 */

const DASHBOARD_LABELS = {
  title: "Daily concierge",
  initial:
    "Ask what needs your attention today, for a read on the week, or which event is at risk. I write the read — every number stays in a card, and actions link out to where they live.",
};

type HostDashboardOsShellProps = {
  userEmail?: string | null;
  initialDashboard?: HostDashboardState;
};

// skipcq: JS-0067 - module-local helper; not browser global scope
function hostDashboardServerKey(initial?: HostDashboardState): string { // skipcq: JS-0067
  if (!initial) return "idle:0";
  return (
    initial.lastUpdatedIso ?? `${initial.workflowStatus}:${initial.kpiCards.length}`
  );
}

// skipcq: JS-0067 - ES module export; not browser global scope
export function HostDashboardOsShell({ // skipcq: JS-0067
  userEmail,
  initialDashboard,
}: HostDashboardOsShellProps) {
  return (
    <HostOpsCopilotBridge
      key={hostDashboardServerKey(initialDashboard)}
      initialState={initialDashboard}
    >
      {({ state }) => (
        <div
          data-testid="host-dashboard"
          className="flex min-h-screen flex-col bg-background text-foreground"
        >
          <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-6">
            <div className="min-w-0">
              <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
                ← mdeai
              </Link>
              <h1 className="text-lg font-semibold sm:text-xl">Dashboard</h1>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">
                {userEmail ? `Signed in as ${userEmail}` : "Host workspace"} · your events only
              </p>
            </div>
            <AuthStatus />
          </header>

          <div className="flex min-h-0 flex-1 flex-col md:flex-row">
            <HostNavRail />

            <section
              aria-label="Host dashboard overview"
              className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
            >
              <HostDashboardOverview state={state} />

              {/* Right-rail concierge moves below on mobile via flex order; read-only overview */}
              <div
                id="host-dashboard-chat-region"
                data-testid="host-dashboard-chat-region"
                aria-live="polite"
                aria-relevant="additions"
                className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-t border-border px-2 pb-2 pt-1 sm:px-4 md:hidden"
              >
                <CopilotChat
                  agentId="hostOpsAgent"
                  className="copilotKitChat--center mde-center-copilot-chat min-h-0 flex-1"
                  labels={{
                    modalHeaderTitle: DASHBOARD_LABELS.title,
                    welcomeMessageText: DASHBOARD_LABELS.initial,
                  }}
                />
              </div>
            </section>

            <aside
              aria-label="Daily concierge"
              className="hidden shrink-0 flex-col overflow-hidden border-l border-border md:flex md:w-80 lg:w-96"
            >
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-semibold text-foreground">
                  <span aria-hidden="true" className="mr-1 text-accent-foreground">
                    ✦
                  </span>
                  Daily concierge
                </p>
                <p className="text-xs text-muted-foreground">
                  Read-only overview · actions link out.
                </p>
              </div>
              <div
                aria-live="polite"
                aria-relevant="additions"
                className="flex min-h-0 flex-1 flex-col overflow-hidden px-2 pb-2 pt-1"
              >
                <CopilotChat
                  agentId="hostOpsAgent"
                  className="copilotKitChat--center mde-center-copilot-chat min-h-0 flex-1"
                  labels={{
                    modalHeaderTitle: DASHBOARD_LABELS.title,
                    welcomeMessageText: DASHBOARD_LABELS.initial,
                  }}
                />
              </div>
            </aside>
          </div>
        </div>
      )}
    </HostOpsCopilotBridge>
  );
}
