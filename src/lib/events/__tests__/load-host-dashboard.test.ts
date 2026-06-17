import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import * as core from "@/lib/events/sales-insights-core";
import { loadHostDashboardInitial } from "@/lib/events/load-host-dashboard";

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
    vi.spyOn(core, "gatherSalesSummaries").mockResolvedValue([
      {
        eventId: "e1",
        eventName: "Salsa Night",
        currency: "COP",
        grossRevenueCents: 500_000,
        ticketsSold: 10,
        paidOrders: 2,
        tiers: [{ qtyTotal: 100, qtySold: 10 }],
      },
    ] as never);
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
