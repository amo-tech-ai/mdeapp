"use client";

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
 * SAN-1209 · HOST-OS-001 — chrome (header, nav rail, the concierge chat aside) now
 * lives once in the unified `HostOsShell` (`src/app/host/layout.tsx`). This shell is
 * just the dashboard body: the HostOpsCopilotBridge feeding the presentational
 * HostDashboardOverview. The bridge and the layout's persistent CopilotChat share
 * the one `hostOpsAgent` subscription under the layout's provider.
 *
 * GUARDRAIL (inherited from SAN-759 · AIE-007 — salesInsightWorkflow /
 * SAN-760 · AIE-005 — hostOpsAgent + HostDashboardState): every number lives in a
 * data card produced by the deterministic loader / get_sales_insights result. The
 * briefing narrates trends in prose and NEVER re-types a figure. Numeric state is
 * owned by HostOpsCopilotBridge; the agent (hostOpsAgent) may only narrate, never
 * recompute.
 */

type HostDashboardOsShellProps = {
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
  initialDashboard,
}: HostDashboardOsShellProps) {
  return (
    <HostOpsCopilotBridge
      key={hostDashboardServerKey(initialDashboard)}
      initialState={initialDashboard}
    >
      {({ state }) => (
        <section
          data-testid="host-dashboard"
          aria-label="Host dashboard overview"
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
        >
          <HostDashboardOverview state={state} />
        </section>
      )}
    </HostOpsCopilotBridge>
  );
}
