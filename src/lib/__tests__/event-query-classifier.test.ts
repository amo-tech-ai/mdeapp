import { describe, it, expect } from "vitest";
import {
  hasEventFastPathSignals,
  isGenericEventQuery,
  looksLikeNonEventSearch,
  scoreEventQuery,
  eventSubChipPrompt,
} from "../event-query-classifier";

describe("event-query-classifier", () => {
  it("treats city-only list as generic", () => {
    expect(isGenericEventQuery("list events medellin")).toBe(true);
    expect(isGenericEventQuery("list events in Medellín")).toBe(true);
  });

  it("treats category queries as specific", () => {
    expect(isGenericEventQuery("nightlife events")).toBe(false);
    expect(isGenericEventQuery("music this weekend")).toBe(false);
    expect(scoreEventQuery("salsa events this weekend in Medellín")).toMatchObject({
      hasCategory: true,
      hasDateWindow: true,
      category: "music",
      dateWindow: "this_weekend",
    });
  });

  it("treats neighborhood + category as specific", () => {
    expect(isGenericEventQuery("sports near Laureles")).toBe(false);
    expect(scoreEventQuery("sports near Laureles").neighborhood).toBe("Laureles");
  });

  it("treats show-all as specific", () => {
    expect(isGenericEventQuery("show all events")).toBe(false);
    expect(isGenericEventQuery("what's on this weekend")).toBe(false);
  });

  it("builds sub-chip send prompts", () => {
    expect(
      eventSubChipPrompt({ label: "Nightlife", category: "nightlife" }),
    ).toBe("Nightlife events in Medellín");
    expect(eventSubChipPrompt({ label: "Show all", showAll: true })).toBe(
      "Show all events in Medellín",
    );
  });

  it("detects non-event rental and café queries", () => {
    expect(looksLikeNonEventSearch("1BR in Laureles under $80/night")).toBe(
      true,
    );
    expect(looksLikeNonEventSearch("best cafes in Poblado")).toBe(true);
    expect(looksLikeNonEventSearch("food events in Poblado")).toBe(false);
  });

  it("detects coffee / espresso queries as non-event (B-04)", () => {
    // The exact user query that was misrouting to /api/events/search
    expect(looksLikeNonEventSearch("good specialty coffee in Laureles")).toBe(true);
    expect(looksLikeNonEventSearch("best coffee in Poblado")).toBe(true);
    expect(looksLikeNonEventSearch("quiet espresso bar near Parque Lleras")).toBe(true);
    // "coffee events" still reaches event path (contains "events")
    expect(looksLikeNonEventSearch("coffee events this weekend")).toBe(false);
  });

  it("neighborhood alone is not event fast-path intent", () => {
    const s = scoreEventQuery("1BR in Laureles under $80/night");
    expect(s.hasNeighborhood).toBe(true);
    expect(
      hasEventFastPathSignals("1BR in Laureles under $80/night", s),
    ).toBe(false);
  });
});
