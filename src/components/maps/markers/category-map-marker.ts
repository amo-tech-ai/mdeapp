import type { MapPinCategory } from "@/platform/contracts";

/** Stable test hook — not localized emoji text in DOM queries */
export type MarkerGlyphId =
  | "cafe"
  | "rental"
  | "event"
  | "restaurant"
  | "attraction"
  | "venue";

export const CATEGORY_MARKER_GLYPH: Record<MapPinCategory, { glyph: string; id: MarkerGlyphId }> =
  {
    grounded: { glyph: "☕", id: "cafe" },
    rental: { glyph: "🏠", id: "rental" },
    event: { glyph: "🎟️", id: "event" },
    restaurant: { glyph: "🍽️", id: "restaurant" },
    attraction: { glyph: "📍", id: "attraction" },
    venue: { glyph: "📌", id: "venue" },
  };

export const CATEGORY_MARKER_COLORS: Record<string, string> = {
  rental: "var(--primary)",
  restaurant: "#c2410c",
  event: "#7c3aed",
  attraction: "#059669",
  venue: "#334155",
  /** Warm coffee orange — reads clearly on map tiles vs blue water/parks */
  grounded: "#ea580c",
  mock: "var(--primary)",
};

/** Muted but still legible on the map when openNow is false */
export const CLOSED_MARKER_COLOR = "#475569";

export type PinMarkerMeta = {
  rating?: number;
  openNow?: boolean;
};

export function parsePinMarkerMeta(
  meta: Record<string, unknown> | undefined,
): PinMarkerMeta {
  if (!meta) return {};
  const rating =
    typeof meta.rating === "number" && !Number.isNaN(meta.rating)
      ? meta.rating
      : undefined;
  const openNow =
    meta.openNow === false ? false : meta.openNow === true ? true : undefined;
  return { rating, openNow };
}

export function formatMarkerRating(rating: number): string {
  const rounded = Math.round(rating * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function isClosedGroundedPin(
  category: MapPinCategory,
  openNow: boolean | undefined,
): boolean {
  return category === "grounded" && openNow === false;
}

export function getCategoryMarkerGlyph(category: MapPinCategory): {
  glyph: string;
  id: MarkerGlyphId;
} {
  return CATEGORY_MARKER_GLYPH[category] ?? CATEGORY_MARKER_GLYPH.grounded;
}

export function getCategoryMarkerColor(category: string): string {
  return CATEGORY_MARKER_COLORS[category] ?? "var(--primary)";
}

export function buildCategoryMapMarkerState(
  category: MapPinCategory,
  meta?: PinMarkerMeta,
): {
  glyphId: MarkerGlyphId;
  closed: boolean;
} {
  const { id: glyphId } = getCategoryMarkerGlyph(category);
  return {
    glyphId,
    closed: isClosedGroundedPin(category, meta?.openNow),
  };
}
