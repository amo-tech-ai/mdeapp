"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        translate="no"
        className="inline-flex min-h-8 items-center gap-1 rounded-md px-2 text-xs font-medium text-primary underline-offset-2 hover:underline"
        data-testid="restaurant-card-maps-link"
        onClick={(e) => e.stopPropagation()}
      >
        <ExternalLink className="size-3.5" aria-hidden />
        Google Maps
      </a>
    );
  }

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      translate="no"
      className="inline-flex min-h-8 items-center gap-1 rounded-md border border-border bg-background px-2 text-xs font-medium text-primary hover:bg-muted"
      data-testid="restaurant-card-directions-link"
      onClick={(e) => e.stopPropagation()}
    >
      <MapPin className="size-3.5" aria-hidden />
      Directions
    </a>
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

  return (
    <article
      className={cn(
        "overflow-hidden rounded-lg border bg-card text-sm shadow-sm transition",
        selected ? "border-primary ring-2 ring-primary/30" : "border-border",
      )}
      data-testid={testId}
      data-result-kind="restaurant"
      data-pin-id={pinId}
      data-selected={selected ? "true" : "false"}
      onMouseEnter={preview}
      onFocus={preview}
      aria-label={`Restaurant: ${title}${neighborhood ? `, ${neighborhood}` : ""}`}
    >
      <div
        className="flex gap-3 p-3"
        role={onOpenDetails ? "button" : undefined}
        tabIndex={onOpenDetails ? 0 : undefined}
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
        {imageUrl ? (
          <div className="shrink-0">
            <div
              className="relative h-24 w-24 overflow-hidden rounded-md bg-muted"
              data-testid="restaurant-card-photo"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- listing hero URLs from search */}
              <img
                src={imageUrl}
                alt=""
                width={96}
                height={96}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        ) : (
          <div
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground"
            data-testid="restaurant-card-photo-placeholder"
            aria-hidden
          >
            Restaurant
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              {neighborhood ? (
                <p className="text-[11px] font-medium text-muted-foreground">
                  {neighborhood}
                </p>
              ) : null}
              <h3 className="font-medium leading-snug">{title}</h3>
            </div>
            {ratingText ? (
              <p
                className="shrink-0 text-xs font-medium text-foreground"
                data-testid="restaurant-card-rating"
              >
                ★ {ratingText}
              </p>
            ) : null}
          </div>

          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Badge variant="secondary">{typeLabel}</Badge>
            {priceLabel ? <Badge variant="outline">{priceLabel}</Badge> : null}
          </div>

          {blurb && blurb !== neighborhood ? (
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
              {blurb}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t px-3 py-2">
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
              <Info className="size-3.5" aria-hidden />
              Details
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
