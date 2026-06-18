import { describe, expect, it } from "vitest";
import { buildBrokerDashboardView } from "../build-broker-dashboard-view";
import { DATA_PENDING_LABEL } from "../data-pending";
import type { BrokerListingDetail } from "../broker-listing-detail";

// skipcq: JS-0067 - vitest fixture helper
function listing(overrides: Partial<BrokerListingDetail> = {}): BrokerListingDetail {
  return {
    id: "apt-1",
    title: "Laureles 2BR",
    neighborhood: "Laureles",
    listingWorkflowStatus: "draft",
    landlordId: "landlord-1",
    bedrooms: 2,
    bathrooms: 1,
    priceMonthly: 2_400_000,
    currency: "COP",
    address: "Calle 10",
    description: null,
    images: [],
    latitude: null,
    longitude: null,
    publishedAt: null,
    amenities: [],
    ...overrides,
  };
}

describe("buildBrokerDashboardView", () => {
  it("uses aggregate KPI counts, not capped queue lengths", () => {
    const view = buildBrokerDashboardView({
      displayName: "Ana",
      listings: [
        listing({ id: "a1", listingWorkflowStatus: "published" }),
        listing({ id: "a2", listingWorkflowStatus: "draft", images: [] }),
      ],
      publishedListingsCount: 42,
      leads7dCount: 150,
      viewingsBookedCount: 25,
      apartmentCount: 210,
      unansweredLeads: [
        {
          id: "l1",
          name: "María",
          status: "new",
          created_at: "",
          last_contacted_at: null,
          apartment_id: "a1",
        },
      ],
      upcomingShowings: [
        {
          id: "s1",
          apartment_id: "a1",
          scheduled_at: "2030-01-01T12:00:00.000Z",
          status: "scheduled",
          lead_id: "l1",
        },
      ],
      leads30dCount: 18,
      views30dCount: null,
    });

    expect(view.kpis[0]?.value).toBe("42");
    expect(view.kpis[1]?.value).toBe("150");
    expect(view.kpis[2]?.value).toBe("25");
    expect(view.kpis[3]?.value).toBe(DATA_PENDING_LABEL);
    expect(view.isEmpty).toBe(false);
  });

  it("uses real published count from listings for attention and data pending for avg response", () => {
    const view = buildBrokerDashboardView({
      displayName: "Ana",
      listings: [
        listing({ id: "a1", listingWorkflowStatus: "published" }),
        listing({ id: "a2", listingWorkflowStatus: "draft", images: [] }),
      ],
      publishedListingsCount: 1,
      leads7dCount: 1,
      viewingsBookedCount: 0,
      apartmentCount: 2,
      unansweredLeads: [
        {
          id: "l1",
          name: "María",
          status: "new",
          created_at: "",
          last_contacted_at: null,
          apartment_id: "a1",
        },
      ],
      upcomingShowings: [],
      leads30dCount: 18,
      views30dCount: null,
    });

    expect(view.trends.find((t) => t.id === "leads")?.value).toBe("18");
    expect(view.trends.find((t) => t.id === "views")?.value).toBe(DATA_PENDING_LABEL);
    expect(view.briefing.bullets.some((b) => b.includes("photos"))).toBe(true);
    expect(view.attention.some((a) => a.kind === "lead_unanswered")).toBe(true);
  });

  it("reports empty state when no inventory or activity", () => {
    const view = buildBrokerDashboardView({
      displayName: null,
      listings: [],
      publishedListingsCount: 0,
      leads7dCount: 0,
      viewingsBookedCount: 0,
      apartmentCount: 0,
      unansweredLeads: [],
      upcomingShowings: [],
      leads30dCount: 0,
      views30dCount: null,
    });
    expect(view.isEmpty).toBe(true);
    expect(view.kpis.every((k) => k.value === "0" || k.value === DATA_PENDING_LABEL)).toBe(true);
  });
});
