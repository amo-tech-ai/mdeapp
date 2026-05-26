"use client";

/**
 * Lightweight map pins only (glyph + optional closed dot).
 * Photos, ratings, blurbs, and actions live in SelectedPlaceOverlayCard — not on the map.
 */

import type { MapPinCategory } from "@/platform/contracts";
import {
  CLOSED_MARKER_COLOR,
  getCategoryMarkerColor,
  getCategoryMarkerGlyph,
  isClosedGroundedPin,
  parsePinMarkerMeta,
} from "./category-map-marker";

export type CategoryMapMarkerProps = {
  pinId: string;
  category: MapPinCategory;
  title: string;
  selected: boolean;
  dimmed: boolean;
  meta?: Record<string, unknown>;
};

export function CategoryMapMarker({
  pinId,
  category,
  title,
  selected,
  dimmed,
  meta,
}: CategoryMapMarkerProps) {
  const { glyph, id: glyphId } = getCategoryMarkerGlyph(category);
  const { openNow } = parsePinMarkerMeta(meta);
  const closed = isClosedGroundedPin(category, openNow);
  const backgroundColor = closed
    ? CLOSED_MARKER_COLOR
    : getCategoryMarkerColor(category);

  return (
    <div
      data-testid="map-pin"
      data-pin-id={pinId}
      data-pin-category={category}
      data-pin-dimmed={dimmed ? "true" : "false"}
      data-marker-glyph={glyphId}
      data-marker-closed={closed ? "true" : "false"}
      data-marker-selected={selected ? "true" : "false"}
      role="img"
      aria-label={`${category}: ${title}`}
      className={[
        "relative flex size-10 cursor-pointer items-center justify-center rounded-full border-[3px] font-semibold text-white transition-[transform,box-shadow,opacity]",
        selected
          ? "z-10 border-white ring-4 ring-primary/50 shadow-xl"
          : "border-white shadow-lg",
        closed && !selected ? "border-slate-200" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        backgroundColor,
        transform: selected ? "scale(1.28)" : "scale(1.08)",
        opacity: dimmed ? 0.4 : closed ? 0.92 : 1,
        boxShadow: selected
          ? "0 4px 14px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.9)"
          : "0 3px 10px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.85)",
      }}
    >
      <span
        aria-hidden
        className="text-lg leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]"
      >
        {glyph}
      </span>
      {closed ? (
        <span
          aria-hidden
          className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white bg-slate-300"
          data-testid="map-pin-closed-dot"
        />
      ) : null}
    </div>
  );
}
