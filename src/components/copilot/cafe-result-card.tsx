import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ResultCardActions,
  ResultCardBadges,
  ResultCardBody,
  ResultCardFooter,
  ResultCardHeader,
  ResultCardMedia,
  ResultCardShell,
} from "@/components/cards/result-card-shell";
import type { GroundedPhotoAttribution } from "@/lib/parse-grounded-tool-result";
import { mapsDeepLinksEnabled } from "@/lib/maps-deep-links";
import { placesPhotoProxyUrl } from "@/lib/places-photo-proxy";
import {
  formatGroundedRating,
  openNowLabel,
  priceLevelToLabel,
  primaryTypeToLabel,
} from "@/lib/places-display";
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
  detailsTestId?: string;
  bookingTestId?: string;
  mediaPlaceholderLabel?: string;
  onBookRequest?: () => void;
} & CardInteractionProps & {
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

function photoAttributionNodes(
  photoAuthorAttributions?: GroundedPhotoAttribution[],
) {
  if (!photoAuthorAttributions?.length) return null;
  return (
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
  detailsTestId = "cafe-details-cta",
  bookingTestId = "cafe-booking-cta",
  mediaPlaceholderLabel = "Cafe",
  pinId,
  resultKind = "cafe",
  selected,
  onSelect,
  onOpenDetails,
  onBookRequest,
}: CafeResultCardProps) {
  const ratingText = formatGroundedRating(rating, userRatingCount);
  const priceLabel = priceLevelToLabel(priceLevel);
  const typeLabel =
    primaryTypeToLabel(primaryType) ??
    (resultKind === "nightlife" ? "Nightlife" : "Cafe");
  const hoursLabel = openNowLabel(openNow);
  const photoSrc = photoName ? placesPhotoProxyUrl(photoName) : null;
  const blurb = summary?.trim() || formattedAddress?.trim() || null;

  const preview = () => onSelect?.();
  const openDetails = () => {
    preview();
    onOpenDetails?.();
  };

  return (
    <ResultCardShell
      pinId={pinId}
      resultKind={resultKind}
      selected={selected}
      testId={testId}
      onSelect={onSelect}
      mapSync
    >
      <ResultCardBody
        onSelect={onSelect}
        onOpenDetails={onOpenDetails}
        detailAriaLabel={`Open details for ${title}`}
      >
        <ResultCardMedia
          photoSrc={photoSrc}
          placeholderLabel={mediaPlaceholderLabel}
          attribution={photoAttributionNodes(photoAuthorAttributions)}
        />

        <div className="min-w-0 flex-1">
          <ResultCardHeader
            eyebrow={
              <p className="text-[11px] font-medium uppercase tracking-normal text-muted-foreground">
                Match #{rank}
              </p>
            }
            title={title}
            trailing={
              ratingText ? (
                <p
                  className="shrink-0 text-xs font-medium text-foreground"
                  data-testid="grounded-card-rating"
                >
                  ★ {ratingText}
                </p>
              ) : null
            }
          />

          <ResultCardBadges>
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
          </ResultCardBadges>

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
      </ResultCardBody>

      <ResultCardFooter>
        <CafeMapLinks
          mapsUrl={mapsUrl}
          directionsUrl={directionsUrl}
          reviewsUrl={reviewsUrl}
        />
        <ResultCardActions>
          <Button
            type="button"
            size="sm"
            variant="outline"
            data-testid={detailsTestId}
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
            data-testid={bookingTestId}
            onClick={(e) => {
              e.stopPropagation();
              preview();
              onBookRequest?.();
            }}
          >
            <CalendarCheck className="size-3.5" aria-hidden />
            Request
          </Button>
        </ResultCardActions>
      </ResultCardFooter>
    </ResultCardShell>
  );
}
