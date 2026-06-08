import { describe, expect, it } from "vitest";
import {
  buildRentalSearchParams,
  canFastPathRentalSearch,
  shouldInstantRentalClarify,
} from "@/lib/rental-search-fast-path";
import type { ConciergeWorkingMemory } from "@/lib/types";

describe("rental-search-fast-path", () => {
  it("instant clarify for generic list rentals query", () => {
    expect(shouldInstantRentalClarify("list rentals medellin", {})).toBe(true);
    expect(
      shouldInstantRentalClarify("list rentals medellin", {
        lastRentalQuery: { genericAskPending: true },
      }),
    ).toBe(false);
  });

  it("fast path for specific query without LLM", () => {
    expect(
      canFastPathRentalSearch("1BR apartment in Laureles under 80 dollars per night", {}),
    ).toBe(true);
  });

  it("fast path after clarify with budget", () => {
    const memory: ConciergeWorkingMemory = {
      lastRentalQuery: { genericAskPending: true },
    };
    expect(canFastPathRentalSearch("june 1 to 30 $1000", memory)).toBe(true);
    const params = buildRentalSearchParams("june 1 to 30 $1000", memory);
    expect(params?.maxPricePerNight).toBeGreaterThan(0);
  });

  it("does not fast path event queries", () => {
    expect(canFastPathRentalSearch("salsa events this weekend", {})).toBe(false);
  });

  it("SAN-823: fast path for neighborhood + rental noun without clarify", () => {
    expect(shouldInstantRentalClarify("apartments in laureles", {})).toBe(false);
    expect(canFastPathRentalSearch("apartments in laureles", {})).toBe(true);
    const params = buildRentalSearchParams("apartments in laureles", {});
    expect(params?.neighborhood).toBe("Laureles");
    expect(params?.queryText).toBe("apartments in laureles");
  });

  it("SAN-823: fast path for furnished studio + neighborhood", () => {
    expect(canFastPathRentalSearch("furnished studio estadio", {})).toBe(true);
    const params = buildRentalSearchParams("furnished studio estadio", {});
    expect(params?.neighborhood).toBe("Estadio");
    expect(params?.minBedrooms).toBe(0);
  });

  it("SAN-823: fast path for bedrooms + neighborhood + budget", () => {
    expect(canFastPathRentalSearch("2BR poblado under $900", {})).toBe(true);
  });

  it("SAN-823: does not fast path vague housing intent", () => {
    expect(canFastPathRentalSearch("help me find a place", {})).toBe(false);
    expect(canFastPathRentalSearch("I am moving soon", {})).toBe(false);
  });

  it("does not fast path unrelated text while clarify is pending", () => {
    const memory: ConciergeWorkingMemory = {
      lastRentalQuery: { genericAskPending: true },
    };
    expect(canFastPathRentalSearch("thanks", memory)).toBe(false);
    expect(canFastPathRentalSearch("what's the weather", memory)).toBe(false);
    expect(buildRentalSearchParams("thanks", memory)).toBeNull();
  });
});
