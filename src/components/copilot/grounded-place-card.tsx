import type { GroundedPhotoAttribution } from "@/lib/parse-grounded-tool-result";
import { mapsDeepLinksEnabled } from "@/lib/maps-deep-links";
import { placesPhotoProxyUrl } from "@/lib/places-photo-proxy";
import {
  formatGroundedRating,
  openNowLabel,
  priceLevelToLabel,
  primaryTypeToLabel,
} from "@/lib/places-display";

export type GroundedPlaceCardProps = {
  title: string;
  mapsUrl?: string;
  directionsUrl?: string;
  reviewsUrl?: string;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  openNow?: boolean | null;
  primaryType?: string;
  summary?: string;
  formattedAddress?: string;
  photoName?: string;
  photoAuthorAttributions?: GroundedPhotoAttribution[];
  testId: string;
  pinId?: string;
  selected?: boolean;
  onSelect?: () => void;
};

function MapsLinkCtas({
  mapsUrl,
  directionsUrl,
  reviewsUrl,
}: {
  mapsUrl?: string;
  directionsUrl?: string;
  reviewsUrl?: string;
}) {
  if (!mapsUrl && !directionsUrl && !reviewsUrl) return null;

  const deepLinks = mapsDeepLinksEnabled();

  if (!deepLinks) {
    if (!mapsUrl) return null;
    return (
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        translate="no"
        className="mt-1.5 inline-block min-h-11 text-xs text-primary underline-offset-2 hover:underline"
        data-testid="grounded-maps-link"
        onClick={(e) => e.stopPropagation()}
      >
        Open in Google Maps
      </a>
    );
  }

  const linkClass =
    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-background px-3 text-xs font-medium text-primary underline-offset-2 hover:bg-muted";

  return (
    <div
      className="mt-2 flex flex-wrap gap-2"
      data-testid="grounded-maps-cta-row"
      onClick={(e) => e.stopPropagation()}
    >
      {directionsUrl ? (
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          translate="no"
          className={linkClass}
          data-testid="grounded-directions-link"
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
          data-testid="grounded-reviews-link"
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
          data-testid="grounded-maps-link"
        >
          Open in Google Maps
        </a>
      ) : null}
    </div>
  );
}

export function GroundedPlaceCard({
  title,
  mapsUrl,
  directionsUrl,
  reviewsUrl,
  rating,
  userRatingCount,
  priceLevel,
  openNow,
  primaryType,
  summary,
  formattedAddress,
  photoName,
  photoAuthorAttributions,
  testId,
  pinId,
  selected,
  onSelect,
}: GroundedPlaceCardProps) {
  const interactive = Boolean(onSelect && pinId);
  const ratingText = formatGroundedRating(rating, userRatingCount);
  const priceLabel = priceLevelToLabel(priceLevel);
  const typeLabel = primaryTypeToLabel(primaryType);
  const hoursLabel = openNowLabel(openNow);
  const photoSrc = photoName ? placesPhotoProxyUrl(photoName) : null;
  const blurb = summary?.trim() || formattedAddress?.trim() || null;

  return (
    <article
      className={`rounded-lg border bg-card p-3 text-sm shadow-sm ${
        selected ? "border-primary ring-2 ring-primary/30" : "border-border"
      } ${interactive ? "cursor-pointer" : ""}`}
      data-testid={testId}
      data-pin-id={pinId}
      data-selected={selected ? "true" : "false"}
      onClick={interactive ? onSelect : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect?.();
              }
            }
          : undefined
      }
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      <div className="flex gap-3">
        {photoSrc ? (
          <div className="shrink-0">
            <div
              className="relative h-20 w-20 overflow-hidden rounded-md bg-muted"
              data-testid="grounded-card-photo"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- Places photo proxy URL; dynamic signed media */}
              <img
                src={photoSrc}
                alt=""
                width={80}
                height={80}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            {photoAuthorAttributions && photoAuthorAttributions.length > 0 ? (
              <p
                className="mt-0.5 max-w-20 text-[10px] leading-tight text-muted-foreground"
                data-testid="grounded-card-photo-attribution"
              >
                {photoAuthorAttributions.map((a, i) => (
                  <span key={`${a.displayName ?? i}-${a.uri ?? ""}`}>
                    {i > 0 ? ", " : null}
                    {a.uri && a.displayName ? (
                      <a
                        href={a.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline-offset-1 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {a.displayName}
                      </a>
                    ) : (
                      (a.displayName ?? a.uri)
                    )}
                  </span>
                ))}
              </p>
            ) : null}
          </div>
        ) : (
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground"
            data-testid="grounded-card-photo-placeholder"
            aria-hidden
          >
            Café
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-medium leading-snug">{title}</h3>
          {ratingText ? (
            <p
              className="mt-0.5 text-xs text-foreground"
              data-testid="grounded-card-rating"
            >
              ★ {ratingText}
            </p>
          ) : null}
          {(priceLabel || typeLabel || hoursLabel) && (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {priceLabel ? (
                <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium">
                  {priceLabel}
                </span>
              ) : null}
              {typeLabel ? (
                <span className="rounded bg-muted px-1.5 py-0.5 text-xs capitalize text-muted-foreground">
                  {typeLabel}
                </span>
              ) : null}
              {hoursLabel ? (
                <span
                  className={`rounded px-1.5 py-0.5 text-xs ${
                    openNow === true
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-muted text-muted-foreground"
                  }`}
                  data-testid="grounded-card-hours"
                >
                  {hoursLabel}
                </span>
              ) : null}
            </div>
          )}
          {blurb ? (
            <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
              {blurb}
            </p>
          ) : null}
          <MapsLinkCtas
            mapsUrl={mapsUrl}
            directionsUrl={directionsUrl}
            reviewsUrl={reviewsUrl}
          />
        </div>
      </div>
    </article>
  );
}
