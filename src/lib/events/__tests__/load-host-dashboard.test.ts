import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { SalesSummary } from "@/lib/events/hostops-read-core";
import { gatherSalesSummaries } from "@/lib/events/sales-insights-core";
import { loadHostDashboardInitial } from "@/lib/events/load-host-dashboard";

vi.mock("@/lib/events/sales-insights-core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/events/sales-insights-core")>();
  return {
    ...actual,
    gatherSalesSummaries: vi.fn(),
  };
});

const SAMPLE_SUMMARY: SalesSummary = {
  eventId: "00000000-0000-4000-8000-000000000001",
  eventName: "Salsa Night",
  currency: "COP",
  grossRevenueCents: 500_000,
  ticketsSold: 10,
  paidOrders: 2,
  cancelledOrders: 0,
  tiers: [
    {
      ticketId: "00000000-0000-4000-8000-000000000002",
      name: "General",
      priceCents: 50_000,
      qtyTotal: 100,
      qtySold: 10,
    },
  ],
};

describe("loadHostDashboardInitial", () => {
  const fakeClient = {} as SupabaseClient<Database>;

  beforeEach(() => {
    vi.mocked(gatherSalesSummaries).mockReset();
  });

  it("returns idle empty when host has no sales", async () => {
    vi.mocked(gatherSalesSummaries).mockResolvedValue([]);
    const state = await loadHostDashboardInitial(fakeClient, "user-1");
    expect(state.workflowStatus).toBe("idle");
    expect(state.kpiCards).toHaveLength(0);
  });

  it("returns ready KPIs when host has paid sales", async () => {
    vi.mocked(gatherSalesSummaries).mockResolvedValue([SAMPLE_SUMMARY]);
    const state = await loadHostDashboardInitial(fakeClient, "user-1");
    expect(state.workflowStatus).toBe("ready");
    expect(state.kpiCards.length).toBeGreaterThan(0);
    expect(state.recommendations).toBeDefined();
    expect(state.lastUpdatedIso).toBeTruthy();
  });

  it("returns error state when gather throws", async () => {
    vi.mocked(gatherSalesSummaries).mockRejectedValue(new Error("db down"));
    const state = await loadHostDashboardInitial(fakeClient, "user-1");
    expect(state.workflowStatus).toBe("error");
  });
});
