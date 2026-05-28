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

  it("does not fast path unrelated text while clarify is pending", () => {
    const memory: ConciergeWorkingMemory = {
      lastRentalQuery: { genericAskPending: true },
    };
    expect(canFastPathRentalSearch("thanks", memory)).toBe(false);
    expect(canFastPathRentalSearch("what's the weather", memory)).toBe(false);
    expect(buildRentalSearchParams("thanks", memory)).toBeNull();
  });
});
