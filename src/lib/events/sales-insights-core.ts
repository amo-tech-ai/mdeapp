import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import {
  listHostEvents,
  getSalesSummary,
  type SalesSummary,
} from "@/lib/events/hostops-read-core";

/**
 * SAN-759 · AIE-007 — salesInsightWorkflow (deterministic core).
 *
 * GUARDRAIL: every number is computed HERE, deterministically, from the SAN-762 ·
 * AIE-006 — HostOps read tools summaries. The Gemini narrate step only restates
 * these numbers (see buildNarrationPrompt) — it never calculates, estimates, or
 * re-derives anything.
 *
 * `gatherSalesSummaries` uses the user-scoped client (RLS-governed; no service-role);
 * the client is injected by SAN-760 · AIE-005 — hostOpsAgent + HostDashboardState.
 * `computeSalesInsights` is pure (no client, no LLM) — fully unit-tested.
 */

// ── output shape ─────────────────────────────────────────────────────────────
export const recommendedActionSchema = z.object({
  eventId: z.string().uuid(),
  eventName: z.string(),
  severity: z.enum(["info", "watch", "urgent"]),
  action: z.string(),
});
export const salesInsightsSchema = z.object({
  eventCount: z.number().int(),
  currency: z.string(),
  totalRevenueCents: z.number().int(),
  totalTicketsSold: z.number().int(),
  paidOrders: z.number().int(),
  bestEvent: z
    .object({ eventId: z.string().uuid(), name: z.string(), revenueCents: z.number().int() })
    .nullable(),
  weakestEvent: z
    .object({ eventId: z.string().uuid(), name: z.string(), sellThrough: z.number() })
    .nullable(),
  recommendedActions: z.array(recommendedActionSchema),
});
export type SalesInsights = z.infer<typeof salesInsightsSchema>;
export type RecommendedAction = z.infer<typeof recommendedActionSchema>;

/** Sell-through = tickets sold / capacity across a summary's tiers (0 when no capacity). */
export function sellThrough(s: SalesSummary): number {
  const total = s.tiers.reduce((n, t) => n + (t.qtyTotal ?? 0), 0);
  const sold = s.tiers.reduce((n, t) => n + (t.qtySold ?? 0), 0);
  return total > 0 ? sold / total : 0;
}

/**
 * PURE — the heart of the workflow. Numbers originate here from the AIE-006
 * summaries; the narrate step only restates them. No LLM, no DB client.
 */
export function computeSalesInsights(summaries: SalesSummary[]): SalesInsights {
  const eventCount = summaries.length;
  const totalRevenueCents = summaries.reduce((n, s) => n + s.grossRevenueCents, 0);
  const totalTicketsSold = summaries.reduce((n, s) => n + s.ticketsSold, 0);
  const paidOrders = summaries.reduce((n, s) => n + s.paidOrders, 0);
  const currency = summaries.find((s) => s.currency)?.currency ?? "COP";

  const best = summaries.reduce<SalesSummary | null>(
    (acc, s) => (acc && acc.grossRevenueCents >= s.grossRevenueCents ? acc : s),
    null,
  );
  // weakest = lowest sell-through, only among events that actually have capacity
  const withCapacity = summaries.filter((s) => s.tiers.some((t) => (t.qtyTotal ?? 0) > 0));
  const weakest = withCapacity.reduce<SalesSummary | null>(
    (acc, s) => (acc && sellThrough(acc) <= sellThrough(s) ? acc : s),
    null,
  );

  const recommendedActions = withCapacity.flatMap<RecommendedAction>((s) => {
    const rate = sellThrough(s);
    if (s.paidOrders === 0)
      return [{ eventId: s.eventId, eventName: s.eventName, severity: "urgent" as const, action: `${s.eventName} has no sales yet — check pricing and visibility.` }];
    if (rate < 0.3)
      return [{ eventId: s.eventId, eventName: s.eventName, severity: "watch" as const, action: `${s.eventName} is ${Math.round(rate * 100)}% sold — consider a promotion or a discount tier.` }];
    if (rate >= 0.9)
      return [{ eventId: s.eventId, eventName: s.eventName, severity: "info" as const, action: `${s.eventName} is ${Math.round(rate * 100)}% sold — consider adding capacity or a premium tier.` }];
    return [];
  });

  return {
    eventCount,
    currency,
    totalRevenueCents,
    totalTicketsSold,
    paidOrders,
    bestEvent: best ? { eventId: best.eventId, name: best.eventName, revenueCents: best.grossRevenueCents } : null,
    weakestEvent: weakest ? { eventId: weakest.eventId, name: weakest.eventName, sellThrough: sellThrough(weakest) } : null,
    recommendedActions,
  };
}

/**
 * Gather sales summaries for the host's own events using the AIE-006 reads.
 * Non-owned / missing events come back 404 from getSalesSummary and are SKIPPED
 * (fail-safe) — a host's insight never includes another host's data.
 *
 * A HARD failure of `listHostEvents` (DB outage / auth error) THROWS — it must not
 * be confused with "you have no events", or Gemini would narrate "no sales" to a
 * host whose database simply hiccupped (Greptile P1). The same applies per-event:
 * only a 404 (not owned) is skipped; any other getSalesSummary failure THROWS.
 */
export async function gatherSalesSummaries(
  supabase: SupabaseClient<Database>,
  userId: string,
  opts?: { eventId?: string },
): Promise<SalesSummary[]> {
  let eventIds: string[];
  if (opts?.eventId) {
    eventIds = [opts.eventId];
  } else {
    const events = await listHostEvents(supabase, userId);
    if (!events.ok) {
      throw new Error(`Could not load your events (${events.status}). Please try again.`);
    }
    eventIds = events.data.map((e) => e.id);
  }

  // Concurrent — independent per-event reads. Only a 404 (event not owned / missing)
  // is a legitimate skip (RLS fail-safe). Any OTHER failure (500 / outage / rate-limit)
  // THROWS — it must not be swallowed into an empty list and narrated as "no sales"
  // (Greptile P1, follow-up to the listHostEvents fail-loud above; critical on the
  // single-eventId path where exactly one read is made).
  const results = await Promise.all(
    eventIds.map((id) => getSalesSummary(supabase, userId, id)),
  );
  const summaries: SalesSummary[] = [];
  for (const r of results) {
    if (r.ok) {
      summaries.push(r.data);
    } else if (r.status !== 404) {
      throw new Error(
        `Could not load sales for one of your events (${r.status}). Please try again.`,
      );
    }
    // r.status === 404 → not owned / missing — skip (fail-safe)
  }
  return summaries;
}

/**
 * GUARDRAIL — builds the narration prompt with every number INJECTED and an
 * explicit instruction to restate only. The LLM never calculates. Pure + tested.
 */
export function buildNarrationPrompt(insights: SalesInsights): string {
  const lines = [
    "You are summarizing an event host's sales for them in 2-3 short, plain sentences.",
    "Use ONLY the numbers below. Do NOT calculate, estimate, re-derive, or round beyond whole percent. If a value is null, omit it.",
    "",
    `Events: ${insights.eventCount}`,
    `Total revenue (cents, ${insights.currency}): ${insights.totalRevenueCents}`,
    `Total tickets sold: ${insights.totalTicketsSold}`,
    `Paid orders: ${insights.paidOrders}`,
    insights.bestEvent
      ? `Best event by revenue: ${insights.bestEvent.name} (${insights.bestEvent.revenueCents} cents)`
      : "Best event: none",
    insights.weakestEvent
      ? `Weakest event by sell-through: ${insights.weakestEvent.name} (${Math.round(insights.weakestEvent.sellThrough * 100)}% sold)`
      : "Weakest event: none",
  ];
  if (insights.recommendedActions.length > 0) {
    lines.push(
      `Suggested actions to relay:\n${insights.recommendedActions.map((a) => `- ${a.action}`).join("\n")}`,
    );
  }
  return lines.join("\n");
}
