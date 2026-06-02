import { describe, expect, it } from "vitest";
import {
  looksLikeCafeSearch,
  looksLikeNightlifeGroundingSearch,
  looksLikeRestaurantSearch,
  scoreRestaurantQuery,
} from "@/lib/restaurant-query-classifier";
import {
  buildRestaurantSearchParams,
  canFastPathRestaurantSearch,
} from "@/lib/restaurant-search-fast-path";

describe("restaurant query classifier", () => {
  it("matches generic restaurant discovery", () => {
    expect(looksLikeRestaurantSearch("suggest restaurants medellin")).toBe(true);
    expect(looksLikeRestaurantSearch("quiet rooftop dinner in Provenza")).toBe(true);
  });

  it("does not hijack café or event queries", () => {
    expect(looksLikeCafeSearch("good specialty coffee in Laureles")).toBe(true);
    expect(looksLikeRestaurantSearch("good specialty coffee in Laureles")).toBe(
      false,
    );
    expect(looksLikeRestaurantSearch("salsa events this weekend")).toBe(false);
  });

  it("routes salsa/rooftop cocktail discovery to grounded nightlife, not restaurants", () => {
    const q =
      "Salsa bars and rooftop cocktails locals go to in El Poblado";
    expect(looksLikeNightlifeGroundingSearch(q)).toBe(true);
    expect(looksLikeRestaurantSearch(q)).toBe(false);
    expect(canFastPathRestaurantSearch(q)).toBe(false);
  });

  it("extracts neighborhood from Provenza", () => {
    const s = scoreRestaurantQuery("quiet rooftop dinner in Provenza");
    expect(s.neighborhood).toBe("El Poblado");
  });
});

describe("restaurant search fast path", () => {
  it("builds params for suggest restaurants", () => {
    expect(canFastPathRestaurantSearch("suggest restaurants medellin")).toBe(true);
    const params = buildRestaurantSearchParams("suggest restaurants medellin");
    expect(params?.queryText).toBe("suggest restaurants medellin");
    expect(params?.limit).toBe(5);
  });
});
