import { describe, it, expect } from "vitest";
import {
  conciergeAgent,
  conciergeWorkingMemorySchema,
} from "../concierge";

describe("conciergeAgent", () => {
  it('has id "concierge-agent"', () => {
    expect(conciergeAgent.id).toBe("concierge-agent");
  });

  it("registers all search tools including grounding and web events", async () => {
    const tools = await conciergeAgent.listTools();
    const toolIds = Object.values(tools).map((tool) => tool.id);
    expect(toolIds).toEqual(
      expect.arrayContaining([
        "search-rentals",
        "search-events",
        "search-restaurants",
        "search-attractions",
        "search-grounded-places",
        "search-web-grounded-events",
      ]),
    );
    expect(toolIds.filter((id) => id.startsWith("search-"))).toHaveLength(6);
  });

  it("working memory schema accepts concierge state shape", () => {
    const parsed = conciergeWorkingMemorySchema.parse({
      lastIntent: "rental_search",
      lastRentalQuery: {
        neighborhood: "Laureles",
        minBedrooms: 1,
        maxPricePerNight: 80,
        budgetType: "nightly",
      },
      lastRentalResults: [
        {
          id: "r1",
          title: "1BR Laureles",
          neighborhood: "Laureles",
          nightly_price: 75,
        },
      ],
    });
    expect(parsed.lastIntent).toBe("rental_search");
    expect(parsed.lastRentalQuery?.neighborhood).toBe("Laureles");
  });

  it("working memory supports follow-up refinement fields", () => {
    const parsed = conciergeWorkingMemorySchema.parse({
      lastIntent: "rental_search",
      lastRentalQuery: { maxPricePerNight: 56 },
      selectedListingId: "r1",
    });
    expect(parsed.selectedListingId).toBe("r1");
    expect(parsed.lastRentalQuery?.maxPricePerNight).toBe(56);
  });

  it("instructions require refining rentals on show cheaper", async () => {
    const instructions = await conciergeAgent.getInstructions();
    expect(instructions).toContain("show cheaper options");
    expect(instructions).toContain("lastRentalQuery");
    expect(instructions).toContain("do NOT repeat card fields");
    expect(instructions).toContain("event clarification gate");
    expect(instructions).toContain("genericAskPending");
  });

  it("instructions require web grounding after fresh event queries", async () => {
    const instructions = await conciergeAgent.getInstructions();
    expect(instructions).toContain("search-web-grounded-events");
    expect(instructions).toContain("From the web");
    expect(instructions).toContain("fewer than 3 rows");
  });

  it("instructions forbid repeating grounded place names in prose", async () => {
    const instructions = await conciergeAgent.getInstructions();
    expect(instructions).toContain("NEVER list cafés or venues by name");
    expect(instructions).toContain("View on Google Maps");
  });

  it("working memory accepts event query with genericAskPending", () => {
    const parsed = conciergeWorkingMemorySchema.parse({
      lastIntent: "event_discovery",
      lastEventQuery: {
        category: "nightlife",
        dateWindow: "this_weekend",
        genericAskPending: false,
      },
    });
    expect(parsed.lastEventQuery?.category).toBe("nightlife");
  });

  it("registers extract-intent-slots tool for INT-001 routing", async () => {
    const tools = await conciergeAgent.listTools();
    const toolIds = Object.values(tools).map((tool) => tool.id);
    expect(toolIds).toContain("extract-intent-slots");
  });

  it("working memory accepts restaurant_search and cafe_search intents", () => {
    const restaurant = conciergeWorkingMemorySchema.parse({ lastIntent: "restaurant_search" });
    expect(restaurant.lastIntent).toBe("restaurant_search");

    const cafe = conciergeWorkingMemorySchema.parse({ lastIntent: "cafe_search" });
    expect(cafe.lastIntent).toBe("cafe_search");
  });
});
