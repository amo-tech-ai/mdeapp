"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VenueCardShell } from "@/components/browse/venue-card-shell";
import { formatGroundedRating } from "@/lib/places-display";
import { mapsDeepLinksEnabled } from "@/lib/maps-deep-links";
import { cn } from "@/lib/utils";
import { ExternalLink, Info, MapPin } from "lucide-react";
import type { CardInteractionProps, ResultKind } from "@/components/cards/card-interaction-props";

export type RestaurantCardProps = {
  title: string;
  neighborhood?: string;
  cuisine?: string;
  priceTier?: string;
  avgPricePerPerson?: number;
  rating?: number;
  imageUrl?: string;
  mapsUrl?: string | null;
  aiSummary?: string | null;
  testId?: string;
  /** D-09 nova Card shell — default for restaurant vertical. */
  composition?: "legacy" | "nova";
  /** Browse grid: full-width 16:10 hero. Chat: inline thumb. */
  mediaLayout?: "inline" | "cover";
} & CardInteractionProps & {
  resultKind?: ResultKind;
};

function cuisineLabel(cuisine?: string): string | null {
  if (!cuisine) return null;
  return cuisine
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function RestaurantMapLinks({ mapsUrl }: { mapsUrl?: string | null }) {
  if (!mapsUrl) return null;
  const deepLinks = mapsDeepLinksEnabled();

  if (!deepLinks) {
    return (
      <Button
        variant="link"
        size="sm"
        className="h-8 px-2 text-xs"
        nativeButton={false}
        render={
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            translate="no"
            data-testid="restaurant-card-maps-link"
            onClick={(e) => e.stopPropagation()}
          />
        }
      >
        <ExternalLink data-icon="inline-start" aria-hidden />
        Google Maps
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8 px-2 text-xs"
      nativeButton={false}
      render={
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          translate="no"
          data-testid="restaurant-card-directions-link"
          onClick={(e) => e.stopPropagation()}
        />
      }
    >
      <MapPin data-icon="inline-start" aria-hidden />
      Directions
    </Button>
  );
}

function RestaurantCardMedia({
  imageUrl,
  mediaLayout,
}: {
  imageUrl?: string;
  mediaLayout: "inline" | "cover";
}) {
  const frameClass = cn(
    "relative overflow-hidden rounded-xl bg-muted",
    mediaLayout === "cover"
      ? "aspect-[16/10] w-full"
      : "aspect-[16/10] w-24 shrink-0 self-start",
  );

  if (imageUrl) {
    return (
      <div className={frameClass} data-testid="restaurant-card-photo">
        {/* eslint-disable-next-line @next/next/no-img-element -- listing hero URLs from search */}
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 size-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        frameClass,
        "flex items-center justify-center text-xs text-muted-foreground",
      )}
      data-testid="restaurant-card-photo-placeholder"
      aria-hidden
    >
      Restaurant
    </div>
  );
}

export function RestaurantCard({
  title,
  neighborhood,
  cuisine,
  priceTier,
  avgPricePerPerson,
  rating,
  imageUrl,
  mapsUrl,
  aiSummary,
  testId = "restaurant-card",
  composition = "legacy",
  mediaLayout = "inline",
  pinId,
  selected,
  onSelect,
  onOpenDetails,
}: RestaurantCardProps) {
  const ratingText = formatGroundedRating(rating);
  const typeLabel = cuisineLabel(cuisine) ?? "Restaurant";
  const priceLabel =
    avgPricePerPerson != null
      ? `$${avgPricePerPerson}/person`
      : priceTier
        ? priceTier
        : null;
  const blurb = aiSummary?.trim() || neighborhood?.trim() || null;

  const preview = () => onSelect?.();
  const openDetails = () => {
    preview();
    onOpenDetails?.();
  };

  const media = (
    <RestaurantCardMedia imageUrl={imageUrl} mediaLayout={mediaLayout} />
  );

  const summaryText =
    blurb && blurb !== neighborhood ? blurb : null;
  const showFooter = Boolean(mapsUrl) || Boolean(onOpenDetails);

  const footerContent = (
    <>
      <RestaurantMapLinks mapsUrl={mapsUrl} />
      <div className="flex flex-wrap gap-1.5">
        {onOpenDetails ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            data-testid="restaurant-details-cta"
            onClick={(e) => {
              e.stopPropagation();
              openDetails();
            }}
          >
            <Info data-icon="inline-start" aria-hidden />
            Details
          </Button>
        ) : null}
      </div>
    </>
  );

  return (
    <VenueCardShell
      testId={testId}
      resultKind="restaurant"
      pinId={pinId}
      selected={selected}
      composition={composition}
      mediaLayout={mediaLayout}
      ariaLabel={`Restaurant: ${title}${neighborhood ? `, ${neighborhood}` : ""}`}
      onPreview={preview}
      bodyRole={onOpenDetails ? "button" : undefined}
      bodyTabIndex={onOpenDetails ? 0 : undefined}
      bodyAriaLabel={onOpenDetails ? `Open details for ${title}` : undefined}
      onBodyClick={onOpenDetails ? openDetails : preview}
      onBodyKeyDown={
        onOpenDetails
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openDetails();
              }
            }
          : undefined
      }
      media={media}
      footer={
        showFooter
          ? composition === "legacy"
            ? (
                <div className="flex flex-wrap items-center justify-between gap-2 border-t px-3 py-2">
                  {footerContent}
                </div>
              )
            : footerContent
          : undefined
      }
    >
      <div
        className={
          composition === "nova"
            ? "flex min-h-0 flex-1 flex-col"
            : undefined
        }
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {composition === "nova" ? (
              <p className="min-h-[15px] text-[11px] font-medium text-muted-foreground">
                {neighborhood ?? "\u00A0"}
              </p>
            ) : neighborhood ? (
              <p className="text-[11px] font-medium text-muted-foreground">
                {neighborhood}
              </p>
            ) : null}
            <h3
              className={cn(
                "font-medium leading-snug",
                composition === "nova" && "line-clamp-2 min-h-[2.5rem]",
              )}
            >
              {title}
            </h3>
          </div>
          {ratingText ? (
            <p
              className="shrink-0 text-xs font-medium text-foreground"
              data-testid="restaurant-card-rating"
            >
              ★ {ratingText}
            </p>
          ) : composition === "nova" ? (
            <span className="min-w-8 shrink-0" aria-hidden />
          ) : null}
        </div>

        <div
          className={cn(
            "mt-1.5 flex flex-wrap gap-1.5",
            composition === "nova" && "min-h-6",
          )}
        >
          <Badge variant="secondary">{typeLabel}</Badge>
          {priceLabel ? <Badge variant="outline">{priceLabel}</Badge> : null}
        </div>

        {composition === "nova" ? (
          <p className="mt-2 line-clamp-2 min-h-10 flex-1 text-xs leading-5 text-muted-foreground">
            {summaryText ?? "\u00A0"}
          </p>
        ) : summaryText ? (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
            {summaryText}
          </p>
        ) : null}
      </div>
    </VenueCardShell>
  );
}
