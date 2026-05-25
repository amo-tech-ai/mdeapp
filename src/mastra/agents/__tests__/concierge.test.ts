import { describe, it, expect } from "vitest";
import {
  conciergeAgent,
  conciergeWorkingMemorySchema,
} from "../concierge";

describe("conciergeAgent", () => {
  it('has id "concierge-agent"', () => {
    expect(conciergeAgent.id).toBe("concierge-agent");
  });

  it("registers all five search tools including grounding", async () => {
    const tools = await conciergeAgent.listTools();
    const toolIds = Object.values(tools).map((tool) => tool.id);
    expect(toolIds).toEqual(
      expect.arrayContaining([
        "search-rentals",
        "search-events",
        "search-restaurants",
        "search-attractions",
        "search-grounded-places",
      ]),
    );
    expect(toolIds.filter((id) => id.startsWith("search-"))).toHaveLength(5);
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
});
