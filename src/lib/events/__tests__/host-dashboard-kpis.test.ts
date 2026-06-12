import { describe, it, expect } from "vitest";
import { toKpiCards, formatMoney } from "@/lib/events/host-dashboard-kpis";
import type { SalesInsights } from "@/lib/events/sales-insights-core";

function insights(over: Partial<SalesInsights> = {}): SalesInsights {
  return {
    eventCount: 2,
    currency: "COP",
    totalRevenueCents: 500_000,
    totalTicketsSold: 80,
    paidOrders: 20,
    bestEvent: null,
    weakestEvent: null,
    recommendedActions: [],
    ...over,
  };
}

describe("formatMoney", () => {
  it("formats cents as whole-unit currency, no fake decimals", () => {
    expect(formatMoney(500_000, "COP")).toMatch(/5,000/);
    expect(formatMoney(250_000, "USD")).toMatch(/\$2,500/);
  });
  it("formats an unknown-but-valid currency code without crashing", () => {
    const out = formatMoney(100_000, "ZZZ");
    expect(out).toContain("1,000");
    expect(out).toContain("ZZZ");
  });
});

describe("toKpiCards — render-ready tiles from deterministic insights", () => {
  it("always returns revenue, tickets, orders", () => {
    const cards = toKpiCards(insights());
    expect(cards.map((c) => c.id)).toEqual(["revenue", "tickets", "orders"]);
    expect(cards.find((c) => c.id === "revenue")?.value).toMatch(/5,000/);
    expect(cards.find((c) => c.id === "tickets")?.value).toBe("80");
  });

  it("flags zero paid orders as 'warn'", () => {
    const cards = toKpiCards(insights({ paidOrders: 0 }));
    expect(cards.find((c) => c.id === "orders")?.intent).toBe("warn");
  });

  it("adds best + weakest cards when present, with formatted hints", () => {
    const cards = toKpiCards(
      insights({
        bestEvent: { eventId: "e1", name: "Gala", revenueCents: 400_000 },
        weakestEvent: { eventId: "e2", name: "Quiet Night", sellThrough: 0.15 },
      }),
    );
    const best = cards.find((c) => c.id === "best");
    const weak = cards.find((c) => c.id === "weakest");
    expect(best?.value).toBe("Gala");
    expect(best?.intent).toBe("good");
    expect(weak?.value).toBe("Quiet Night");
    expect(weak?.intent).toBe("warn"); // <30% sold
    expect(weak?.hint).toMatch(/15% sold/);
  });

  it("does not invent best/weakest when null (empty host)", () => {
    const cards = toKpiCards(insights({ totalRevenueCents: 0, totalTicketsSold: 0, paidOrders: 0 }));
    expect(cards.some((c) => c.id === "best")).toBe(false);
    expect(cards.some((c) => c.id === "weakest")).toBe(false);
    expect(cards.find((c) => c.id === "revenue")?.intent).toBe("neutral");
  });
});
