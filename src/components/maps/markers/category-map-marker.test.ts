import { describe, expect, it } from "vitest";
import {
  buildCategoryMapMarkerState,
  CATEGORY_MARKER_GLYPH,
  formatMarkerRating,
  getCategoryMarkerGlyph,
  isClosedGroundedPin,
  parsePinMarkerMeta,
} from "./category-map-marker";

describe("category-map-marker config", () => {
  it("maps each category to a distinct glyph id", () => {
    expect(getCategoryMarkerGlyph("grounded").id).toBe("cafe");
    expect(getCategoryMarkerGlyph("rental").glyph).toBe("🏠");
    expect(getCategoryMarkerGlyph("event").id).toBe("event");
    expect(getCategoryMarkerGlyph("restaurant").id).toBe("restaurant");
    expect(Object.keys(CATEGORY_MARKER_GLYPH)).toHaveLength(6);
  });

  it("formats rating to one decimal when needed", () => {
    expect(formatMarkerRating(4.8)).toBe("4.8");
    expect(formatMarkerRating(5)).toBe("5");
  });

  it("mutes only when openNow is explicitly false on grounded", () => {
    expect(isClosedGroundedPin("grounded", false)).toBe(true);
    expect(isClosedGroundedPin("grounded", true)).toBe(false);
    expect(isClosedGroundedPin("grounded")).toBe(false);
    expect(isClosedGroundedPin("rental", false)).toBe(false);
  });

  it("parses meta rating and openNow", () => {
    expect(parsePinMarkerMeta({ rating: 4.2, openNow: false })).toEqual({
      rating: 4.2,
      openNow: false,
    });
    expect(parsePinMarkerMeta({ openNow: null })).toEqual({});
  });
});

describe("buildCategoryMapMarkerState", () => {
  it("combines grounded closed state", () => {
    expect(
      buildCategoryMapMarkerState("grounded", { openNow: false }),
    ).toEqual({
      glyphId: "cafe",
      closed: true,
    });
  });

  it("rental has home glyph", () => {
    expect(buildCategoryMapMarkerState("rental")).toEqual({
      glyphId: "rental",
      closed: false,
    });
  });
});
