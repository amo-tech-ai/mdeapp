import { cn } from "@/lib/utils";
import type { KpiCard } from "@/lib/types/host-dashboard";

/** Intent → semantic token classes (registered oklch tokens only; no hardcoded grays). */
const INTENT_RING: Record<KpiCard["intent"], string> = {
  neutral: "border-border",
  good: "border-primary/40",
  warn: "border-accent/50",
  urgent: "border-destructive/50",
};
const INTENT_VALUE: Record<KpiCard["intent"], string> = {
  neutral: "text-foreground",
  good: "text-primary",
  warn: "text-accent-foreground",
  urgent: "text-destructive",
};

/** SAN-729 · AIE-008 — one KPI tile, driven by HostDashboardState.kpiCards. */
export function HostKpiCard({ card }: { card: KpiCard }) {
  return (
    <div
      data-testid={`host-kpi-card-${card.id}`}
      className={cn(
        "rounded-lg border bg-card p-4 shadow-sm transition-colors",
        INTENT_RING[card.intent],
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {card.label}
      </p>
      <p className={cn("mt-1 truncate text-2xl font-semibold", INTENT_VALUE[card.intent])}>
        {card.value}
      </p>
      {card.hint ? (
        <p className="mt-1 truncate text-xs text-muted-foreground">{card.hint}</p>
      ) : null}
    </div>
  );
}
