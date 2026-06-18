import { describe, expect, it } from "vitest";
import {
  eventMatchesDateWindow,
  parseEventIntelligenceSlots,
  resolveEventCategoryForQuery,
} from "../intelligence-event-search";

describe("resolveEventCategoryForQuery", () => {
  it("remaps nightlife chip + salsa queryText to music for hybrid filter", () => {
    expect(
      resolveEventCategoryForQuery(
        "nightlife",
        "salsa events this weekend in Medellín",
      ),
    ).toBe("music");
  });

  it("clears nightlife when queryText is absent (chip-only scope)", () => {
    expect(resolveEventCategoryForQuery("nightlife", undefined)).toBeUndefined();
    expect(resolveEventCategoryForQuery("nightlife", "")).toBeUndefined();
  });

  it("keeps other categories when queryText is absent", () => {
    expect(resolveEventCategoryForQuery("music", undefined)).toBe("music");
  });

  it("remaps nightlife chip + hyphenated live-music queryText to music", () => {
    expect(
      resolveEventCategoryForQuery(
        "nightlife",
        "live-music in Laureles tonight",
      ),
    ).toBe("music");
  });

  it("keeps nightlife when query has no salsa/live-music signals", () => {
    expect(
      resolveEventCategoryForQuery("nightlife", "clubs this weekend in Poblado"),
    ).toBe("nightlife");
  });

  it("leaves music unchanged", () => {
    expect(
      resolveEventCategoryForQuery("music", "salsa events this weekend"),
    ).toBe("music");
  });
});

describe("parseEventIntelligenceSlots", () => {
  it("extracts salsa + this weekend", () => {
    const slots = parseEventIntelligenceSlots("salsa this weekend in Provenza");
    expect(slots.wantsSalsa).toBe(true);
    expect(slots.dateWindow).toBe("this_weekend");
    expect(slots.neighborhood).toBe("El Poblado");
  });

  it("extracts live music intent", () => {
    const slots = parseEventIntelligenceSlots("live music in Laureles tonight");
    expect(slots.wantsLiveMusic).toBe(true);
    expect(slots.dateWindow).toBe("tonight");
    expect(slots.neighborhood).toBe("Laureles");
  });

  it("extracts hyphenated live-music intent", () => {
    const slots = parseEventIntelligenceSlots("live-music in Laureles tonight");
    expect(slots.wantsLiveMusic).toBe(true);
  });

  it("extracts fashion + networking", () => {
    const slots = parseEventIntelligenceSlots("fashion networking event Poblado");
    expect(slots.wantsFashion).toBe(true);
    expect(slots.wantsNetworking).toBe(true);
  });
});

describe("eventMatchesDateWindow", () => {
  it("includes events on the exact window boundaries", () => {
    const w = { gte: "2026-06-20T00:00:00Z", lte: "2026-06-20T23:59:59Z" };
    expect(eventMatchesDateWindow("2026-06-20T00:00:00Z", w)).toBe(true); // gte edge
    expect(eventMatchesDateWindow("2026-06-20T23:59:59Z", w)).toBe(true); // lte edge
  });

  it("treats Z and +00:00 as the same instant (no lexicographic drift)", () => {
    const w = { gte: "2026-06-20T00:00:00+00:00", lte: "2026-06-20T12:00:00Z" };
    // "2026-06-20T06:00:00Z" sorts > "...+00:00" as a string but is in-window by time
    expect(eventMatchesDateWindow("2026-06-20T06:00:00Z", w)).toBe(true);
  });

  it("excludes events outside the window and handles open/empty bounds", () => {
    const w = { gte: "2026-06-20T00:00:00Z", lte: "2026-06-20T23:59:59Z" };
    expect(eventMatchesDateWindow("2026-06-19T23:00:00Z", w)).toBe(false);
    expect(eventMatchesDateWindow("2026-06-21T00:30:00Z", w)).toBe(false);
    expect(eventMatchesDateWindow("2026-06-20T10:00:00Z", {})).toBe(true); // no bounds
    expect(eventMatchesDateWindow(null, w)).toBe(false); // no event time
  });
});
