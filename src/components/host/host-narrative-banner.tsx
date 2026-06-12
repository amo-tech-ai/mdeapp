import type { HostDashboardState } from "@/lib/types/host-dashboard";

/**
 * SAN-729 · AIE-008 — the plain-language summary the agent narrated, shown above
 * the KPI grid. Text only — the numbers it describes live in the cards.
 */
export function HostNarrativeBanner({ state }: { state: HostDashboardState }) {
  if (!state.lastNarrative) return null;
  return (
    <div
      data-testid="host-narrative-banner"
      className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3"
    >
      <p className="text-sm text-foreground">{state.lastNarrative}</p>
    </div>
  );
}
