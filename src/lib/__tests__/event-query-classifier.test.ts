import { describe, it, expect } from "vitest";
import {
  isGenericEventQuery,
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
});
