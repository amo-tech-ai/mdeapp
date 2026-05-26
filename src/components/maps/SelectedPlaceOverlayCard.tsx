"use client";

import type { MapPin } from "@/platform/contracts";
import { mapsDeepLinksEnabled } from "@/lib/maps-deep-links";
import { placesPhotoProxyUrl } from "@/lib/places-photo-proxy";
import {
  formatGroundedRating,
  openNowLabel,
  priceLevelToLabel,
  primaryTypeToLabel,
} from "@/lib/places-display";
import { getCategoryMarkerGlyph } from "@/components/maps/markers/category-map-marker";
import { parseMapPinPreviewMeta } from "@/components/maps/map-pin-meta";

export type SelectedPlaceOverlayCardProps = {
  pin: MapPin;
};

/**
 * Mindtrip-style rich card — only shown in map InfoWindow overlay, never as map marker DOM.
 */
export function SelectedPlaceOverlayCard({ pin }: SelectedPlaceOverlayCardProps) {
  const meta = parseMapPinPreviewMeta(pin.meta);
  const { glyph } = getCategoryMarkerGlyph(pin.category);
  const photoSrc = meta.photoName
    ? placesPhotoProxyUrl(meta.photoName, 480)
    : null;
  const ratingText = formatGroundedRating(meta.rating, meta.userRatingCount);
  const priceLabel = priceLevelToLabel(meta.priceLevel);
  const typeLabel = primaryTypeToLabel(meta.primaryType);
  const hoursLabel = openNowLabel(meta.openNow);
  const editorial =
    meta.summary?.trim() || pin.subtitle?.trim() || null;
  const mapsUrl = pin.placeUri;
  const deepLinks = mapsDeepLinksEnabled();

  return (
    <div
      className="w-[min(300px,90vw)] overflow-hidden rounded-xl bg-card text-card-foreground shadow-xl"
      data-testid="selected-place-overlay"
      data-pin-id={pin.id}
    >
      <div className="relative">
        {photoSrc ? (
          <div
            className="relative h-40 w-full bg-muted"
            data-testid="selected-place-overlay-photo"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- Places photo proxy */}
            <img
              src={photoSrc}
              alt=""
              width={300}
              height={160}
              className="h-full w-full object-cover"
            />
            <div
              className="absolute bottom-2 left-0 right-0 flex justify-center gap-1"
              data-testid="selected-place-overlay-carousel"
              aria-hidden
            >
              <span className="size-1.5 rounded-full bg-white shadow-sm" />
            </div>
          </div>
        ) : (
          <div
            className="flex h-32 items-center justify-center bg-muted text-4xl"
            data-testid="selected-place-overlay-photo-placeholder"
            aria-hidden
          >
            {glyph}
          </div>
        )}
        <div className="absolute right-2 top-2 flex gap-1.5">
          <button
            type="button"
            disabled
            title="Save — coming soon"
            aria-label="Save place (coming soon)"
            className="flex size-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm disabled:opacity-90"
            data-testid="selected-place-overlay-save"
          >
            ♥
          </button>
          <button
            type="button"
            disabled
            title="Add to trip — coming soon"
            aria-label="Add to trip (coming soon)"
            className="flex size-9 items-center justify-center rounded-full bg-black/55 text-lg text-white backdrop-blur-sm disabled:opacity-90"
            data-testid="selected-place-overlay-add-trip"
          >
            +
          </button>
        </div>
      </div>

      <div className="space-y-2 p-3">
        <h3 className="text-base font-semibold leading-snug">{pin.title}</h3>
        {ratingText ? (
          <p
            className="text-sm text-foreground"
            data-testid="selected-place-overlay-rating"
          >
            ★ {ratingText}
          </p>
        ) : null}
        {(typeLabel || pin.subtitle || priceLabel) && (
          <p className="text-xs text-muted-foreground">
            {[typeLabel, pin.subtitle, priceLabel].filter(Boolean).join(" · ")}
          </p>
        )}
        {hoursLabel ? (
          <span
            className={`inline-block rounded px-1.5 py-0.5 text-xs ${
              meta.openNow === true
                ? "bg-emerald-100 text-emerald-800"
                : "bg-muted text-muted-foreground"
            }`}
            data-testid="selected-place-overlay-hours"
          >
            {hoursLabel}
          </span>
        ) : null}
        {editorial ? (
          <p
            className="line-clamp-4 text-xs leading-relaxed text-muted-foreground"
            data-testid="selected-place-overlay-editorial"
          >
            {editorial}
          </p>
        ) : null}
        <OverlayMapCtas
          mapsUrl={mapsUrl}
          directionsUrl={meta.directionsUrl}
          reviewsUrl={meta.reviewsUrl}
          deepLinks={deepLinks}
        />
      </div>
    </div>
  );
}

function OverlayMapCtas({
  mapsUrl,
  directionsUrl,
  reviewsUrl,
  deepLinks,
}: {
  mapsUrl?: string;
  directionsUrl?: string;
  reviewsUrl?: string;
  deepLinks: boolean;
}) {
  if (!mapsUrl && !directionsUrl && !reviewsUrl) return null;

  if (!deepLinks) {
    if (!mapsUrl) return null;
    return (
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        translate="no"
        className="inline-block text-xs font-medium text-primary underline-offset-2 hover:underline"
        data-testid="selected-place-overlay-maps-link"
      >
        Open in Google Maps
      </a>
    );
  }

  const linkClass =
    "inline-flex min-h-9 items-center justify-center rounded-md border border-border bg-background px-2.5 text-xs font-medium text-primary hover:bg-muted";

  return (
    <div
      className="flex flex-wrap gap-1.5 pt-0.5"
      data-testid="selected-place-overlay-cta-row"
    >
      {directionsUrl ? (
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          translate="no"
          className={linkClass}
          data-testid="selected-place-overlay-directions"
        >
          Directions
        </a>
      ) : null}
      {reviewsUrl ? (
        <a
          href={reviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          translate="no"
          className={linkClass}
          data-testid="selected-place-overlay-reviews"
        >
          Reviews
        </a>
      ) : null}
      {mapsUrl ? (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          translate="no"
          className={linkClass}
          data-testid="selected-place-overlay-maps-link"
        >
          Maps
        </a>
      ) : null}
    </div>
  );
}
