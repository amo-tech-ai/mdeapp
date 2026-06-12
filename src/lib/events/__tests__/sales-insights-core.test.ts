import { describe, it, expect, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { SalesSummary } from "@/lib/events/hostops-read-core";
import * as reads from "@/lib/events/hostops-read-core";
import {
  computeSalesInsights,
  sellThrough,
  gatherSalesSummaries,
  buildNarrationPrompt,
} from "@/lib/events/sales-insights-core";

// ── fixtures ───────────────────────────────────────────────────────────────
let uuidSeq = 0;
function uuid(): string {
  uuidSeq += 1;
  const n = uuidSeq.toString(16).padStart(12, "0");
  return `00000000-0000-4000-8000-${n}`;
}

function tier(qtySold: number, qtyTotal: number) {
  return { ticketId: uuid(), name: "GA", priceCents: 5000, qtySold, qtyTotal };
}

function summary(over: Partial<SalesSummary> = {}): SalesSummary {
  return {
    eventId: uuid(),
    eventName: "Event",
    currency: "COP",
    paidOrders: 10,
    cancelledOrders: 0,
    ticketsSold: 50,
    grossRevenueCents: 250_000,
    tiers: [tier(50, 100)],
    ...over,
  };
}

// ── computeSalesInsights (PURE) ──────────────────────────────────────────────
describe("computeSalesInsights — deterministic core", () => {
  it("empty host: zeros, no best/weakest, no actions", () => {
    const r = computeSalesInsights([]);
    expect(r.eventCount).toBe(0);
    expect(r.totalRevenueCents).toBe(0);
    expect(r.totalTicketsSold).toBe(0);
    expect(r.paidOrders).toBe(0);
    expect(r.bestEvent).toBeNull();
    expect(r.weakestEvent).toBeNull();
    expect(r.recommendedActions).toEqual([]);
  });

  it("one event: best and weakest are that event", () => {
    const s = summary({ eventName: "Solo", grossRevenueCents: 100_000, ticketsSold: 40, paidOrders: 8, tiers: [tier(40, 80)] });
    const r = computeSalesInsights([s]);
    expect(r.eventCount).toBe(1);
    expect(r.totalRevenueCents).toBe(100_000);
    expect(r.totalTicketsSold).toBe(40);
    expect(r.bestEvent).toEqual({ eventId: s.eventId, name: "Solo", revenueCents: 100_000 });
    expect(r.weakestEvent?.eventId).toBe(s.eventId);
    expect(r.weakestEvent?.sellThrough).toBeCloseTo(0.5);
  });

  it("multiple events: totals sum across events", () => {
    const a = summary({ grossRevenueCents: 100_000, ticketsSold: 20, paidOrders: 5 });
    const b = summary({ grossRevenueCents: 300_000, ticketsSold: 60, paidOrders: 15 });
    const r = computeSalesInsights([a, b]);
    expect(r.eventCount).toBe(2);
    expect(r.totalRevenueCents).toBe(400_000);
    expect(r.totalTicketsSold).toBe(80);
    expect(r.paidOrders).toBe(20);
  });

  it("best event = highest revenue", () => {
    const low = summary({ eventName: "Low", grossRevenueCents: 50_000 });
    const high = summary({ eventName: "High", grossRevenueCents: 900_000 });
    const r = computeSalesInsights([low, high]);
    expect(r.bestEvent?.name).toBe("High");
    expect(r.bestEvent?.revenueCents).toBe(900_000);
  });

  it("weakest event = lowest sell-through, ignoring capacity-less events", () => {
    const strong = summary({ eventName: "Strong", tiers: [tier(90, 100)] });
    const weak = summary({ eventName: "Weak", tiers: [tier(10, 100)] });
    const noCap = summary({ eventName: "NoCap", tiers: [tier(0, 0)] });
    const r = computeSalesInsights([strong, weak, noCap]);
    expect(r.weakestEvent?.name).toBe("Weak");
    expect(r.weakestEvent?.sellThrough).toBeCloseTo(0.1);
  });

  it("no sales: urgent recommended action", () => {
    const dead = summary({ eventName: "Ghost", paidOrders: 0, ticketsSold: 0, grossRevenueCents: 0, tiers: [tier(0, 100)] });
    const r = computeSalesInsights([dead]);
    const action = r.recommendedActions.find((a) => a.eventId === dead.eventId);
    expect(action?.severity).toBe("urgent");
    expect(action?.action).toContain("no sales");
  });

  it("high sell-through (>=90%): info action to add capacity", () => {
    const hot = summary({ eventName: "Hot", paidOrders: 95, tiers: [tier(95, 100)] });
    const r = computeSalesInsights([hot]);
    const action = r.recommendedActions.find((a) => a.eventId === hot.eventId);
    expect(action?.severity).toBe("info");
    expect(action?.action).toContain("capacity");
  });

  it("low sell-through (<30%) with some sales: watch action to discount", () => {
    const slow = summary({ eventName: "Slow", paidOrders: 5, tiers: [tier(15, 100)] });
    const r = computeSalesInsights([slow]);
    const action = r.recommendedActions.find((a) => a.eventId === slow.eventId);
    expect(action?.severity).toBe("watch");
    expect(action?.action).toMatch(/discount|promotion/);
  });

  it("currency: takes the first event's declared currency", () => {
    const usd = summary({ currency: "USD" });
    expect(computeSalesInsights([usd]).currency).toBe("USD");
  });
});

describe("sellThrough", () => {
  it("returns 0 when there is no capacity", () => {
    expect(sellThrough(summary({ tiers: [tier(0, 0)] }))).toBe(0);
  });
  it("sums across tiers", () => {
    expect(sellThrough(summary({ tiers: [tier(10, 50), tier(40, 50)] }))).toBeCloseTo(0.5);
  });
});

// ── gatherSalesSummaries — unauthorized events skipped (fail-safe) ────────────
describe("gatherSalesSummaries — RLS fail-safe", () => {
  const fakeClient = {} as SupabaseClient<Database>;

  it("skips events whose getSalesSummary returns not-ok (404 / not owned)", async () => {
    const owned = summary({ eventName: "Mine" });
    vi.spyOn(reads, "listHostEvents").mockResolvedValue({
      ok: true,
      data: [
        { id: owned.eventId, name: "Mine", slug: null, status: "published", eventStartTime: null },
        { id: uuid(), name: "Theirs", slug: null, status: "published", eventStartTime: null },
      ],
    });
    vi.spyOn(reads, "getSalesSummary").mockImplementation(async (_c, _u, id) =>
      id === owned.eventId
        ? { ok: true, data: owned }
        : { ok: false, status: 404, message: "Not found" },
    );

    const out = await gatherSalesSummaries(fakeClient, "user-1");
    expect(out).toHaveLength(1);
    expect(out[0].eventName).toBe("Mine");
    vi.restoreAllMocks();
  });

  it("returns [] when the host has no events", async () => {
    vi.spyOn(reads, "listHostEvents").mockResolvedValue({ ok: true, data: [] });
    const out = await gatherSalesSummaries(fakeClient, "user-1");
    expect(out).toEqual([]);
    vi.restoreAllMocks();
  });

  it("THROWS on a hard listHostEvents failure — a DB error must not look like 'no sales' (Greptile P1)", async () => {
    vi.spyOn(reads, "listHostEvents").mockResolvedValue({
      ok: false,
      status: 500,
      message: "db down",
    });
    await expect(gatherSalesSummaries(fakeClient, "user-1")).rejects.toThrow(/could not load/i);
    vi.restoreAllMocks();
  });
});

// ── buildNarrationPrompt — the guardrail ─────────────────────────────────────
describe("buildNarrationPrompt — AI explains, never calculates", () => {
  it("injects every number and forbids calculation", () => {
    const insights = computeSalesInsights([
      summary({ eventName: "Gala", grossRevenueCents: 250_000, ticketsSold: 50, paidOrders: 10, tiers: [tier(50, 100)] }),
    ]);
    const prompt = buildNarrationPrompt(insights);
    expect(prompt).toContain("Do NOT calculate");
    expect(prompt).toContain("250000"); // revenue injected, not asked-for
    expect(prompt).toContain("50"); // tickets injected
    expect(prompt).toContain("Gala");
  });

  it("omits nulls cleanly for an empty host", () => {
    const prompt = buildNarrationPrompt(computeSalesInsights([]));
    expect(prompt).toContain("Best event: none");
    expect(prompt).toContain("Weakest event: none");
    expect(prompt).toContain("Do NOT calculate");
  });
});
