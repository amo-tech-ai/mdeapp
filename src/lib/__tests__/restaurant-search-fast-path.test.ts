import { describe, expect, it } from "vitest";
import {
  hasRestaurantFastPathSignals,
  isGenericRestaurantQuery,
  looksLikeCafeSearch,
  looksLikeNightlifeGroundingSearch,
  looksLikeRestaurantSearch,
  scoreRestaurantQuery,
} from "@/lib/restaurant-query-classifier";
import {
  buildRestaurantSearchParams,
  canFastPathRestaurantSearch,
  shouldInstantRestaurantClarify,
} from "@/lib/restaurant-search-fast-path";
import { RESTAURANT_CLARIFY_MESSAGE } from "@/lib/restaurant-clarify-copy";
import { restaurantSearchParamsFromChip } from "@/lib/restaurant-filter-chips";

describe("restaurant query classifier", () => {
  it("matches generic restaurant discovery", () => {
    expect(looksLikeRestaurantSearch("suggest restaurants medellin")).toBe(true);
    expect(looksLikeRestaurantSearch("quiet rooftop dinner in Provenza")).toBe(true);
  });

  it("detects generic suggest restaurants without filters", () => {
    expect(isGenericRestaurantQuery("suggest restaurants")).toBe(true);
    expect(isGenericRestaurantQuery("suggest restaurants medellin")).toBe(true);
  });

  it("searches immediately when cuisine vibe and neighborhood present", () => {
    const q = "fine dining modern poblado";
    const s = scoreRestaurantQuery(q);
    expect(hasRestaurantFastPathSignals(q, s)).toBe(true);
    expect(isGenericRestaurantQuery(q)).toBe(false);
    expect(buildRestaurantSearchParams(q)).not.toBeNull();
  });

  it("does not hijack café or event queries", () => {
    expect(looksLikeCafeSearch("good specialty coffee in Laureles")).toBe(true);
    expect(looksLikeRestaurantSearch("good specialty coffee in Laureles")).toBe(false);
    expect(looksLikeRestaurantSearch("salsa events this weekend")).toBe(false);
  });

  it("routes generic venues tonight to grounded nightlife, not restaurants", () => {
    const q = "popular venues tonight in Provenza";
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
  it("instant clarify for generic restaurant ask", () => {
    expect(shouldInstantRestaurantClarify("suggest restaurants", {})).toBe(true);
    expect(RESTAURANT_CLARIFY_MESSAGE).toContain("Tap a filter");
  });

  it("does not re-clarify when genericAskPending is true", () => {
    expect(
      shouldInstantRestaurantClarify("suggest restaurants", {
        lastRestaurantQuery: { genericAskPending: true },
      }),
    ).toBe(false);
  });

  it("can fast-path generic clarify or specific search", () => {
    expect(canFastPathRestaurantSearch("suggest restaurants")).toBe(true);
    expect(canFastPathRestaurantSearch("fine dining modern poblado")).toBe(true);
  });

  it("preserves composed queryText on restaurant discovery fast-path", () => {
    const params = buildRestaurantSearchParams("suggest restaurants in Provenza");
    expect(params).not.toBeNull();
    expect(params?.queryText).toMatch(/^restaurants\b/i);
    expect(params?.queryText).not.toBe("suggest restaurants in Provenza");
  });

  it("builds near-me chip params with ephemeral coordinates", () => {
    const params = restaurantSearchParamsFromChip(
      { id: "a-near", label: "Near me", group: "area", nearMe: true },
      { latitude: 6.25, longitude: -75.58 },
    );
    expect(params.userLatitude).toBe(6.25);
    expect(params.userLongitude).toBe(-75.58);
    expect(params.queryText).toContain("near me");
  });
});
