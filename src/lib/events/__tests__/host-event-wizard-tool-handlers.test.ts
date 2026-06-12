import { describe, expect, it } from "vitest";
import {
  applySetEventBasics,
  applySetPricing,
  applySetVenue,
  publishDecisionDraftPatch,
} from "@/lib/events/host-event-wizard-tool-handlers";
import { EMPTY_EVENT_DRAFT } from "@/lib/types";

describe("host-event-wizard-tool-handlers", () => {
  it("applySetEventBasics merges title, neighborhood, dateIso", () => {
    const next = applySetEventBasics(EMPTY_EVENT_DRAFT, {
      title: "Startup mixer",
      neighborhood: "Provenza",
      dateIso: "2026-03-15T19:00:00-05:00",
    });
    expect(next.title).toBe("Startup mixer");
    expect(next.neighborhood).toBe("Provenza");
    expect(next.dateIso).toBe("2026-03-15T19:00:00-05:00");
  });

  it("applySetVenue coerces capacity to number", () => {
    const next = applySetVenue(EMPTY_EVENT_DRAFT, {
      venue: "Hotel Intercontinental",
      capacity: "200",
    });
    expect(next.venue).toBe("Hotel Intercontinental");
    expect(next.capacity).toBe(200);
  });

  it("applySetPricing keeps existing tiers when omitted", () => {
    const base = applySetPricing(EMPTY_EVENT_DRAFT, {
      priceMinCop: 50000,
      ticketTiers: [{ name: "GA", priceCop: 0, quantity: 100 }],
    });
    const next = applySetPricing(base, { priceMinCop: 75000 });
    expect(next.priceMinCop).toBe(75000);
    expect(next.ticketTiers).toHaveLength(1);
    expect(next.ticketTiers[0]?.name).toBe("GA");
  });

  it("publishDecisionDraftPatch preserves approve race rule", () => {
    expect(publishDecisionDraftPatch("rejected")).toEqual({ status: "rejected" });
    expect(publishDecisionDraftPatch("edit")).toEqual({ status: "draft" });
    expect(publishDecisionDraftPatch("approved")).toBeNull();
  });
});
