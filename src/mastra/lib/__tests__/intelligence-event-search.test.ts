import { describe, expect, it } from "vitest";
import { parseEventIntelligenceSlots } from "../intelligence-event-search";

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

  it("extracts fashion + networking", () => {
    const slots = parseEventIntelligenceSlots("fashion networking event Poblado");
    expect(slots.wantsFashion).toBe(true);
    expect(slots.wantsNetworking).toBe(true);
  });
});
