import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

/**
 * SAN-762 · AIE-006 — HostOps read tools (core).
 * Two read-only data functions for a host's own events + sales. They take a
 * USER-SCOPED Supabase client (RLS governs every read — no service-role) and ALSO
 * filter `organizer_id` explicitly, because `events` carries a public-published
 * SELECT policy: an unfiltered authenticated query would return other hosts'
 * published events too. Defence-in-depth = RLS + explicit organizer filter.
 *
 * RLS verified live 2026-06-11: events.events_organizer_select_own,
 * event_orders.orders_organizer_select, event_tickets.tickets_organizer_all.
 *
 * The Mastra tool wrappers (hostops-read-tools.ts) get the user-scoped client +
 * userId from runtime context — wired in SAN-760 · AIE-005. These core functions
 * are client-injected, so they test in isolation.
 */

type Ok<T> = { ok: true; data: T };
type Err = { ok: false; status: number; message: string };
type Result<T> = Ok<T> | Err;

type Db = SupabaseClient<Database>;

// ── list_host_events ────────────────────────────────────────────────────────────
export const hostEventSummarySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string().nullable(),
  status: z.string(),
  eventStartTime: z.string().nullable(),
});
export type HostEventSummary = z.infer<typeof hostEventSummarySchema>;

export async function listHostEvents(
  supabase: Db,
  userId: string,
  opts?: { status?: string; limit?: number },
): Promise<Result<HostEventSummary[]>> {
  let q = supabase
    .from("events")
    .select("id, name, slug, status, event_start_time")
    .eq("organizer_id", userId) // defence-in-depth, not just RLS
    .order("event_start_time", { ascending: false })
    .limit(Math.min(Math.max(opts?.limit ?? 50, 1), 100));

  if (opts?.status) q = q.eq("status", opts.status);

  const { data, error } = await q;
  if (error) return { ok: false, status: 500, message: error.message };
  return {
    ok: true,
    data: (data ?? []).map((r) => ({
      id: r.id,
      name: r.name ?? "",
      slug: r.slug ?? null,
      status: r.status ?? "",
      eventStartTime: r.event_start_time ?? null,
    })),
  };
}

// ── get_sales_summary ────────────────────────────────────────────────────────────
export const tierBreakdownSchema = z.object({
  ticketId: z.string().uuid(),
  name: z.string(),
  priceCents: z.number().int(),
  qtySold: z.number().int(),
  qtyTotal: z.number().int(),
});
export const salesSummarySchema = z.object({
  eventId: z.string().uuid(),
  eventName: z.string(),
  currency: z.string(),
  paidOrders: z.number().int(),
  cancelledOrders: z.number().int(),
  ticketsSold: z.number().int(),
  grossRevenueCents: z.number().int(),
  tiers: z.array(tierBreakdownSchema),
});
export type SalesSummary = z.infer<typeof salesSummarySchema>;

export async function getSalesSummary(
  supabase: Db,
  userId: string,
  eventId: string,
): Promise<Result<SalesSummary>> {
  // 1. Ownership: 404 if the event is not the host's (RLS would also hide it).
  const { data: ev, error: evErr } = await supabase
    .from("events")
    .select("id, name")
    .eq("id", eventId)
    .eq("organizer_id", userId)
    .maybeSingle();
  if (evErr) return { ok: false, status: 500, message: evErr.message };
  if (!ev) return { ok: false, status: 404, message: "Event not found or not yours." };

  // 2. Orders (RLS-scoped; pinned to this event).
  const { data: orders, error: oErr } = await supabase
    .from("event_orders")
    .select("status, quantity, total_cents, currency")
    .eq("event_id", eventId);
  if (oErr) return { ok: false, status: 500, message: oErr.message };

  // 3. Tier rows.
  const { data: tickets, error: tErr } = await supabase
    .from("event_tickets")
    .select("id, name, price_cents, qty_sold, qty_total, currency")
    .eq("event_id", eventId)
    .order("position", { ascending: true });
  if (tErr) return { ok: false, status: 500, message: tErr.message };

  const rows = orders ?? [];
  const paid = rows.filter((o) => o.status === "paid");
  const cancelled = rows.filter((o) => o.status === "cancelled");

  return {
    ok: true,
    data: {
      eventId,
      eventName: ev.name ?? "",
      currency: paid[0]?.currency ?? tickets?.[0]?.currency ?? "COP",
      paidOrders: paid.length,
      cancelledOrders: cancelled.length,
      ticketsSold: paid.reduce((n, o) => n + (o.quantity ?? 0), 0),
      grossRevenueCents: paid.reduce((n, o) => n + (o.total_cents ?? 0), 0),
      tiers: (tickets ?? []).map((t) => ({
        ticketId: t.id,
        name: t.name ?? "",
        priceCents: t.price_cents ?? 0,
        qtySold: t.qty_sold ?? 0,
        qtyTotal: t.qty_total ?? 0,
      })),
    },
  };
}
