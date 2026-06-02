import { describe, expect, it } from "vitest";
import {
  buildCafeSearchParams,
  canFastPathCafeSearch,
  fastPathCafeSummary,
} from "../cafe-search-fast-path";

describe("cafe-search-fast-path", () => {
  it("matches specialty coffee queries", () => {
    expect(canFastPathCafeSearch("good specialty coffee in Laureles")).toBe(true);
    const params = buildCafeSearchParams("good specialty coffee in Laureles");
    expect(params?.neighborhood).toBe("Laureles");
    expect(params?.query).toContain("specialty coffee");
  });

  it("does not match generic restaurant discovery", () => {
    expect(canFastPathCafeSearch("suggest restaurants medellin")).toBe(false);
  });

  it("matches SCREEN-022 nightlife grounding query", () => {
    const q =
      "Salsa bars and rooftop cocktails locals go to in El Poblado";
    expect(canFastPathCafeSearch(q)).toBe(true);
    expect(buildCafeSearchParams(q)?.neighborhood).toBe("El Poblado");
    expect(fastPathCafeSummary(3, "El Poblado", q)).toMatch(/nightlife venue/);
  });

  it("summarizes card count for Camila", () => {
    expect(fastPathCafeSummary(5, "Laureles")).toMatch(/Found 5 specialty coffee shops/);
    expect(fastPathCafeSummary(0)).toMatch(/No cafés matched/);
  });
});
