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

  it("working memory preserves rental query genericAskPending", () => {
    const parsed = conciergeWorkingMemorySchema.parse({
      lastIntent: "rental_search",
      lastRentalQuery: {
        neighborhood: "Laureles",
        genericAskPending: true,
      },
    });
    expect(parsed.lastRentalQuery?.genericAskPending).toBe(true);
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

  it("instructions tell agent to pass search-grounded-places intent for nightlife and cafés", async () => {
    const instructions = await conciergeAgent.getInstructions();
    expect(instructions).toContain('intent: "nightlife"');
    expect(instructions).toContain('intent: "cafe"');
    expect(instructions).toContain('intent "nightlife"');
    expect(instructions).toContain("popular venues in Provenza tonight");
    expect(instructions).toContain("search-events");
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

  // PERF-002: extract-intent-slots was a no-op echo tool the agent was told to
  // call first, adding a Gemini step every agent turn. Routing now relies on the
  // client-side classifier + the per-search clarification gates, so the tool is
  // unwired. Guard against it being re-added to the concierge tool set.
  it("does not register the no-op extract-intent-slots tool", async () => {
    const tools = await conciergeAgent.listTools();
    const toolIds = Object.values(tools).map((tool) => tool.id);
    expect(toolIds).not.toContain("extract-intent-slots");
  });

  it("working memory accepts router intents including restaurant_discovery", () => {
    const restaurant = conciergeWorkingMemorySchema.parse({
      lastIntent: "restaurant_discovery",
    });
    expect(restaurant.lastIntent).toBe("restaurant_discovery");

    const venue = conciergeWorkingMemorySchema.parse({ lastIntent: "venue_booking" });
    expect(venue.lastIntent).toBe("venue_booking");
  });

  it("working memory rental genericAskPending defaults to undefined when omitted", () => {
    const parsed = conciergeWorkingMemorySchema.parse({
      lastRentalQuery: { neighborhood: "Poblado" },
    });
    expect(parsed.lastRentalQuery?.genericAskPending).toBeUndefined();
  });

  it("working memory preserves rental query genericAskPending false", () => {
    const parsed = conciergeWorkingMemorySchema.parse({
      lastRentalQuery: { genericAskPending: false },
    });
    expect(parsed.lastRentalQuery?.genericAskPending).toBe(false);
  });
});
