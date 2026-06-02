import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { GroundedPhotoAttribution } from "@/lib/parse-grounded-tool-result";
import { mapsDeepLinksEnabled } from "@/lib/maps-deep-links";
import { placesPhotoProxyUrl } from "@/lib/places-photo-proxy";
import {
  formatGroundedRating,
  openNowLabel,
  priceLevelToLabel,
  primaryTypeToLabel,
} from "@/lib/places-display";
import { cn } from "@/lib/utils";
import { CalendarCheck, ExternalLink, Info, MapPin } from "lucide-react";
import type { CardInteractionProps, ResultKind } from "@/components/cards/card-interaction-props";

export type CafeResultCardProps = {
  title: string;
  rank: number;
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
  placeId?: string;
  fieldMaskVersion?: string;
  testId?: string;
  onBookRequest?: () => void;
} & CardInteractionProps & {
  /** Café rows use `data-result-kind="cafe"`; defaults to cafe when omitted. */
  resultKind?: ResultKind;
};

function CafeMapLinks({
  mapsUrl,
  directionsUrl,
  reviewsUrl,
}: {
  mapsUrl?: string;
  directionsUrl?: string;
  reviewsUrl?: string;
}) {
  const deepLinks = mapsDeepLinksEnabled();
  const primaryUrl = directionsUrl ?? mapsUrl;

  if (!primaryUrl && !reviewsUrl) return null;

  if (!deepLinks) {
    return mapsUrl ? (
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        translate="no"
        className="inline-flex min-h-8 items-center gap-1 rounded-md px-2 text-xs font-medium text-primary underline-offset-2 hover:underline"
        data-testid="cafe-card-maps-link"
        onClick={(e) => e.stopPropagation()}
      >
        <ExternalLink className="size-3.5" aria-hidden />
        Google Maps
      </a>
    ) : null;
  }

  return (
    <div className="flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
      {primaryUrl ? (
        <a
          href={primaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          translate="no"
          className="inline-flex min-h-8 items-center gap-1 rounded-md border border-border bg-background px-2 text-xs font-medium text-primary hover:bg-muted"
          data-testid="cafe-card-directions-link"
        >
          <MapPin className="size-3.5" aria-hidden />
          Directions
        </a>
      ) : null}
      {reviewsUrl ? (
        <a
          href={reviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          translate="no"
          className="inline-flex min-h-8 items-center gap-1 rounded-md border border-border bg-background px-2 text-xs font-medium text-primary hover:bg-muted"
          data-testid="cafe-card-reviews-link"
        >
          Reviews
        </a>
      ) : null}
    </div>
  );
}

export function CafeResultCard({
  title,
  rank,
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
  placeId,
  fieldMaskVersion,
  testId = "cafe-result-card",
  pinId,
  selected,
  onSelect,
  onOpenDetails,
  onBookRequest,
}: CafeResultCardProps) {
  const ratingText = formatGroundedRating(rating, userRatingCount);
  const priceLabel = priceLevelToLabel(priceLevel);
  const typeLabel = primaryTypeToLabel(primaryType) ?? "Cafe";
  const hoursLabel = openNowLabel(openNow);
  const photoSrc = photoName ? placesPhotoProxyUrl(photoName) : null;
  const blurb = summary?.trim() || formattedAddress?.trim() || null;

  const preview = () => onSelect?.();
  const openDetails = () => {
    preview();
    onOpenDetails?.();
  };

  return (
    <article
      className={cn(
        "overflow-hidden rounded-lg border bg-card text-sm shadow-sm transition",
        selected ? "border-primary ring-2 ring-primary/30" : "border-border",
      )}
      data-testid={testId}
      data-result-kind="cafe"
      data-pin-id={pinId}
      data-selected={selected ? "true" : "false"}
      onMouseEnter={preview}
      onFocus={preview}
    >
      <div
        className="flex gap-3 p-3"
        role={onOpenDetails ? "button" : undefined}
        tabIndex={onOpenDetails ? 0 : undefined}
        aria-label={`Open details for ${title}`}
        onClick={onOpenDetails ? openDetails : preview}
        onKeyDown={
          onOpenDetails
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openDetails();
                }
              }
            : undefined
        }
      >
        {photoSrc ? (
          <div className="shrink-0">
            <div
              className="relative h-24 w-24 overflow-hidden rounded-md bg-muted"
              data-testid="grounded-card-photo"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- Places photo proxy URL; dynamic signed media */}
              <img
                src={photoSrc}
                alt=""
                width={96}
                height={96}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            {photoAuthorAttributions && photoAuthorAttributions.length > 0 ? (
              <p
                className="mt-0.5 max-w-24 text-[10px] leading-tight text-muted-foreground"
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
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground"
            data-testid="grounded-card-photo-placeholder"
            aria-hidden
          >
            Cafe
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-normal text-muted-foreground">
                Match #{rank}
              </p>
              <h3 className="font-medium leading-snug">{title}</h3>
            </div>
            {ratingText ? (
              <p
                className="shrink-0 text-xs font-medium text-foreground"
                data-testid="grounded-card-rating"
              >
                ★ {ratingText}
              </p>
            ) : null}
          </div>

          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Badge variant="secondary">{typeLabel}</Badge>
            {priceLabel ? <Badge variant="outline">{priceLabel}</Badge> : null}
            {hoursLabel ? (
              <Badge
                variant={openNow === true ? "secondary" : "outline"}
                data-testid="grounded-card-hours"
              >
                {hoursLabel}
              </Badge>
            ) : null}
          </div>

          {blurb ? (
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
              {blurb}
            </p>
          ) : null}

          <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5">
              <Info className="size-3" aria-hidden />
              Google-verified candidate
            </span>
            {placeId ? (
              <span className="rounded bg-muted px-1.5 py-0.5">Place ID</span>
            ) : null}
            {fieldMaskVersion ? (
              <span className="rounded bg-muted px-1.5 py-0.5">
                Places fields checked
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t px-3 py-2">
        <CafeMapLinks
          mapsUrl={mapsUrl}
          directionsUrl={directionsUrl}
          reviewsUrl={reviewsUrl}
        />
        <div className="flex flex-wrap gap-1.5">
          <Button
            type="button"
            size="sm"
            variant="outline"
            data-testid="cafe-details-cta"
            onClick={(e) => {
              e.stopPropagation();
              openDetails();
            }}
          >
            Details
          </Button>
          <Button
            type="button"
            size="sm"
            data-testid="cafe-booking-cta"
            onClick={(e) => {
              e.stopPropagation();
              preview();
              onBookRequest?.();
            }}
          >
            <CalendarCheck className="size-3.5" aria-hidden />
            Request
          </Button>
        </div>
      </div>
    </article>
  );
}
