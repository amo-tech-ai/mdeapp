"use client";

import { HostOpsCopilotBridge } from "@/components/host/host-ops-copilot-bridge";
import { HostKpiPanel } from "@/components/host/host-kpi-panel";
import { HostNarrativeBanner } from "@/components/host/host-narrative-banner";
import { HostAnalyticsAside } from "@/components/host/host-analytics-aside";
import { HostAnalyticsPromptChips } from "@/components/host/host-analytics-prompt-chips";
import type { HostDashboardState } from "@/lib/types/host-dashboard";

/**
 * SAN-1209 · HOST-OS-001 — chrome (header, nav rail, the inline concierge chat)
 * now lives once in the unified `HostOsShell` (`src/app/host/layout.tsx`). This
 * shell is just the analytics body: the HostOpsCopilotBridge feeding the
 * narrative banner, KPI panel and recommendations aside. The bridge and the
 * layout's persistent CopilotChat share the one `hostOpsAgent` subscription, so
 * asking "how are my sales?" in the layout chat fills the cards here.
 */

type HostAnalyticsShellProps = {
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
export function HostAnalyticsShell({ // skipcq: JS-0067
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
          className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row"
        >
          <section
            aria-label="Sales dashboard"
            className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto"
          >
            <div className="space-y-3 p-4">
              <HostNarrativeBanner state={state} />
              <HostKpiPanel state={state} />
              {state.kpiCards.length === 0 && state.workflowStatus !== "loading" ? (
                <HostAnalyticsPromptChips />
              ) : null}
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
      )}
    </HostOpsCopilotBridge>
  );
}
