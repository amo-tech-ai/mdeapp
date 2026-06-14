import { cn } from "@/lib/utils";
import type { HostDashboardState } from "@/lib/types/host-dashboard";
import type { RecommendedAction } from "@/lib/events/sales-insights-core";

const SEVERITY_CHIP: Record<RecommendedAction["severity"], string> = {
  info: "border-primary/40 text-primary",
  watch: "border-accent/50 text-accent-foreground",
  urgent: "border-destructive/50 text-destructive",
};
const SEVERITY_LABEL: Record<RecommendedAction["severity"], string> = {
  info: "Idea",
  watch: "Watch",
  urgent: "Act now",
};

/**
 * SAN-729 · AIE-008 — the detail panel: severity-ranked next steps the agent
 * surfaced (from HostDashboardState.recommendations). Deterministic — these come
 * straight from the insight tool, not LLM free-text.
 */
export function HostRecommendationsPanel({ state }: { state: HostDashboardState }) {
  if (state.recommendations.length === 0) return null;
  return (
    <div data-testid="host-recommendations" className="space-y-2">
      <h2 className="text-sm font-semibold text-foreground">Recommended actions</h2>
      <ul className="space-y-2">
        {state.recommendations.map((rec) => (
          <li
            key={rec.eventId}
            data-testid="host-recommendation-item"
            className="rounded-lg border border-border bg-card p-3"
          >
            <span
              className={cn(
                "inline-block rounded-full border px-2 py-0.5 text-xs font-medium",
                SEVERITY_CHIP[rec.severity],
              )}
            >
              {SEVERITY_LABEL[rec.severity]}
            </span>
            <p className="mt-1.5 text-sm text-foreground">{rec.action}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
