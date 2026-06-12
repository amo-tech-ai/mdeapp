import { HostKpiCard } from "@/components/host/host-kpi-card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty/empty-state";
import type { HostDashboardState } from "@/lib/types/host-dashboard";

/**
 * SAN-729 · AIE-008 — the KPI canvas. Renders entirely from HostDashboardState —
 * no Supabase fetch here. The agent's get_sales_insights result is lifted into
 * `kpiCards` by HostOpsCopilotBridge; this panel just maps over them.
 */
export function HostKpiPanel({ state }: { state: HostDashboardState }) {
  if (state.workflowStatus === "loading") {
    return (
      <div
        data-testid="host-kpi-skeletons"
        aria-busy="true"
        aria-label="Loading your sales"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  if (state.workflowStatus === "error") {
    return (
      <EmptyState
        testId="host-kpi-error"
        title="Couldn't load your sales"
        description="Something went wrong fetching your numbers. Ask again in a moment."
      />
    );
  }

  if (state.kpiCards.length === 0) {
    return (
      <EmptyState
        testId="host-kpi-empty"
        title="Ask about your sales"
        description='Type "how are my sales?" in the chat below and your numbers will appear here.'
      />
    );
  }

  return (
    <div
      data-testid="host-kpi-grid"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      {state.kpiCards.map((card) => (
        <HostKpiCard key={card.id} card={card} />
      ))}
    </div>
  );
}
