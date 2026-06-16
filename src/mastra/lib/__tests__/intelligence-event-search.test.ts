import { describe, expect, it } from "vitest";
import {
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
