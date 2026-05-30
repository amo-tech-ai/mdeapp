import { describe, it, expect } from "vitest";
import { parseIntelligenceSlots } from "../intelligence-restaurant-search";

describe("parseIntelligenceSlots", () => {
  it("extracts Provenza rooftop + quiet from golden query", () => {
    const slots = parseIntelligenceSlots("quiet rooftop Provenza");
    expect(slots.neighborhood).toBe("Provenza");
    expect(slots.wantsRooftop).toBe(true);
    expect(slots.wantsQuiet).toBe(true);
  });

  it("maps Laureles for nomad queries", () => {
    const slots = parseIntelligenceSlots("wifi cowork Laureles");
    expect(slots.neighborhood).toBe("Laureles");
    expect(slots.wantsNomad).toBe(true);
  });
});
