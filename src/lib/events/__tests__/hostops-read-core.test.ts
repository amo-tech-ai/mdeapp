import { describe, it, expect } from "vitest";
import { listHostEvents, getSalesSummary } from "@/lib/events/hostops-read-core";

/**
 * SAN-762 · AIE-006 — HostOps read tools (core tests).
 * A tiny chainable mock of the Supabase query builder. `eq()` calls are captured so
 * we can assert the explicit organizer/ownership filters (the RLS defence-in-depth).
 */
type Res = { data: unknown; error: { message: string } | null };

function makeClient(cfg: {
  eventsList?: Res; // resolved when the events query is awaited (list path)
  eventsSingle?: Res; // resolved from .maybeSingle() (ownership path)
  orders?: Res;
  tickets?: Res;
}) {
  const eqLog: Array<[string, unknown]> = [];
  const tablesQueried: string[] = [];

  const builder = (listRes: Res, singleRes: Res) => {
    const b: Record<string, unknown> = {};
    Object.assign(b, {
      select: () => b,
      eq: (col: string, val: unknown) => {
        eqLog.push([col, val]);
        return b;
      },
      order: () => b,
      limit: () => b,
      maybeSingle: () => Promise.resolve(singleRes),
      then: (res: (r: Res) => unknown, rej?: (e: unknown) => unknown) =>
        Promise.resolve(listRes).then(res, rej),
    });
    return b;
  };

  const client = {
    from: (table: string) => {
      tablesQueried.push(table);
      if (table === "events")
        return builder(cfg.eventsList ?? { data: [], error: null }, cfg.eventsSingle ?? { data: null, error: null });
      if (table === "event_orders") return builder(cfg.orders ?? { data: [], error: null }, { data: null, error: null });
      if (table === "event_tickets") return builder(cfg.tickets ?? { data: [], error: null }, { data: null, error: null });
      return builder({ data: [], error: null }, { data: null, error: null });
    },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { client: client as any, eqLog, tablesQueried };
}

const UID = "11111111-1111-1111-1111-111111111111";
const EID = "22222222-2222-2222-2222-222222222222";

describe("listHostEvents — host sees own events only", () => {
  it("filters by organizer_id = userId and maps rows", async () => {
    const { client, eqLog } = makeClient({
      eventsList: {
        data: [{ id: EID, name: "Salsa Night", slug: "salsa", status: "published", event_start_time: "2026-07-01T00:00:00Z" }],
        error: null,
      },
    });
    const r = await listHostEvents(client, UID);
    expect(r.ok).toBe(true);
    expect(eqLog).toContainEqual(["organizer_id", UID]); // RLS defence-in-depth
    if (r.ok) {
      expect(r.data).toHaveLength(1);
      expect(r.data[0]).toMatchObject({ id: EID, name: "Salsa Night", status: "published" });
    }
  });

  it("applies an optional status filter", async () => {
    const { client, eqLog } = makeClient({ eventsList: { data: [], error: null } });
    await listHostEvents(client, UID, { status: "draft" });
    expect(eqLog).toContainEqual(["organizer_id", UID]);
    expect(eqLog).toContainEqual(["status", "draft"]);
  });

  it("surfaces a db error as 500", async () => {
    const { client } = makeClient({ eventsList: { data: null, error: { message: "boom" } } });
    const r = await listHostEvents(client, UID);
    expect(r).toEqual({ ok: false, status: 500, message: "boom" });
  });
});

describe("getSalesSummary — ownership + revenue", () => {
  it("blocks another host's event with 404 and never reads orders", async () => {
    const { client, tablesQueried } = makeClient({ eventsSingle: { data: null, error: null } }); // not owned
    const r = await getSalesSummary(client, UID, EID);
    expect(r).toMatchObject({ ok: false, status: 404 });
    expect(tablesQueried).not.toContain("event_orders"); // bailed before aggregating
  });

  it("computes revenue + tickets from paid orders only, with per-tier breakdown", async () => {
    const { client } = makeClient({
      eventsSingle: { data: { id: EID, name: "Startup Night" }, error: null },
      orders: {
        data: [
          { status: "paid", quantity: 2, total_cents: 5000, currency: "COP" },
          { status: "paid", quantity: 1, total_cents: 2500, currency: "COP" },
          { status: "cancelled", quantity: 3, total_cents: 9000, currency: "COP" }, // must be excluded
        ],
        error: null,
      },
      tickets: {
        data: [{ id: "33333333-3333-3333-3333-333333333333", name: "GA", price_cents: 2500, qty_sold: 3, qty_total: 50 }],
        error: null,
      },
    });
    const r = await getSalesSummary(client, UID, EID);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.grossRevenueCents).toBe(7500); // 5000 + 2500, cancelled excluded
      expect(r.data.ticketsSold).toBe(3); // 2 + 1
      expect(r.data.paidOrders).toBe(2);
      expect(r.data.cancelledOrders).toBe(1);
      expect(r.data.currency).toBe("COP");
      expect(r.data.tiers).toEqual([
        { ticketId: "33333333-3333-3333-3333-333333333333", name: "GA", priceCents: 2500, qtySold: 3, qtyTotal: 50 },
      ]);
    }
  });

  it("handles an owned event with no sales (empty state) → zeros", async () => {
    const { client } = makeClient({
      eventsSingle: { data: { id: EID, name: "Quiet Event" }, error: null },
      orders: { data: [], error: null },
      tickets: { data: [], error: null },
    });
    const r = await getSalesSummary(client, UID, EID);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data).toMatchObject({ paidOrders: 0, cancelledOrders: 0, ticketsSold: 0, grossRevenueCents: 0, tiers: [] });
    }
  });
});
