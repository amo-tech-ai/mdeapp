import type { SalesInsights } from "@/lib/events/sales-insights-core";
import type { KpiCard } from "@/lib/types/host-dashboard";
import { formatMoney } from "@/lib/events/format-money";

/**
 * SAN-729 · AIE-008 — Host Analytics Page + HostOpsCopilotBridge.
 *
 * PURE — turns the deterministic `SalesInsights` (from SAN-759 · AIE-007 —
 * salesInsightWorkflow) into render-ready KPI tiles. Money/percent are formatted
 * ONCE, in code — the LLM never formats or computes these. The bridge lifts
 * the tool result through this helper into `HostDashboardState.kpiCards`.
 *
 * `formatMoney` lives in `./format-money` so the narration prompt (sales-insights-core)
 * formats money identically — the cards and the agent's sentence never disagree.
 */

// Re-exported for callers/tests that import it from here.
export { formatMoney };

/** Sell-through % for the weakest event, as a whole number string. */
function pct(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}

export function toKpiCards(insights: SalesInsights): KpiCard[] {
  const cards: KpiCard[] = [
    {
      id: "revenue",
      label: "Total revenue",
      value: formatMoney(insights.totalRevenueCents, insights.currency),
      intent: insights.totalRevenueCents > 0 ? "good" : "neutral",
      hint: `${insights.eventCount} event${insights.eventCount === 1 ? "" : "s"}`,
    },
    {
      id: "tickets",
      label: "Tickets sold",
      value: insights.totalTicketsSold.toLocaleString("en-US"),
      intent: "neutral",
    },
    {
      id: "orders",
      label: "Paid orders",
      value: insights.paidOrders.toLocaleString("en-US"),
      intent: insights.paidOrders === 0 ? "warn" : "neutral",
    },
  ];

  if (insights.bestEvent) {
    cards.push({
      id: "best",
      label: "Best event",
      value: insights.bestEvent.name,
      intent: "good",
      hint: formatMoney(insights.bestEvent.revenueCents, insights.currency),
    });
  }
  if (insights.weakestEvent) {
    cards.push({
      id: "weakest",
      label: "Needs attention",
      value: insights.weakestEvent.name,
      intent: insights.weakestEvent.sellThrough < 0.3 ? "warn" : "neutral",
      hint: `${pct(insights.weakestEvent.sellThrough)} sold`,
    });
  }
  return cards;
}
