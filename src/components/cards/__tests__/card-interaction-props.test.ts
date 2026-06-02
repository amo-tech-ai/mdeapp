import { describe, expect, it } from "vitest";
import {
  DEFAULT_TEST_IDS,
  defaultTestId,
  type ResultKind,
} from "@/components/cards/card-interaction-props";

describe("card-interaction-props", () => {
  it("defaultTestId returns stable testids per ResultKind", () => {
    const kinds: ResultKind[] = [
      "rental",
      "cafe",
      "nightlife",
      "event",
      "restaurant",
      "attraction",
      "grounded",
      "place",
    ];
    for (const kind of kinds) {
      expect(defaultTestId(kind)).toBe(DEFAULT_TEST_IDS[kind]);
    }
  });
});
