import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import * as core from "@/lib/events/sales-insights-core";
import type { SalesSummary } from "@/lib/events/hostops-read-core";
import { loadHostDashboardInitial } from "@/lib/events/load-host-dashboard";

const SAMPLE_SUMMARY: SalesSummary = {
  eventId: "00000000-0000-4000-8000-000000000001",
  eventName: "Salsa Night",
  currency: "COP",
  grossRevenueCents: 500_000,
  ticketsSold: 10,
  paidOrders: 2,
  cancelledOrders: 0,
  tiers: [{ qtyTotal: 100, qtySold: 10 }],
};

describe("loadHostDashboardInitial", () => {
  const fakeClient = {} as SupabaseClient<Database>;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns idle empty when host has no sales", async () => {
    vi.spyOn(core, "gatherSalesSummaries").mockResolvedValue([]);
    const state = await loadHostDashboardInitial(fakeClient, "user-1");
    expect(state.workflowStatus).toBe("idle");
    expect(state.kpiCards).toHaveLength(0);
  });

  it("returns ready KPIs when host has paid sales", async () => {
    vi.spyOn(core, "gatherSalesSummaries").mockResolvedValue([SAMPLE_SUMMARY]);
    const state = await loadHostDashboardInitial(fakeClient, "user-1");
    expect(state.workflowStatus).toBe("ready");
    expect(state.kpiCards.length).toBeGreaterThan(0);
    expect(state.recommendations).toBeDefined();
    expect(state.lastUpdatedIso).toBeTruthy();
  });

  it("returns error state when gather throws", async () => {
    vi.spyOn(core, "gatherSalesSummaries").mockRejectedValue(new Error("db down"));
    const state = await loadHostDashboardInitial(fakeClient, "user-1");
    expect(state.workflowStatus).toBe("error");
  });
});
