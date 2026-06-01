import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  buildMatchReason,
  formatRentalPrices,
  rentalBenefitBadges,
  type RentalResultRow,
} from "@/lib/rental-display";
import type { RentalSearchApiParams } from "@/lib/rental-query-parser";
import { cn } from "@/lib/utils";
import { Calendar, Heart } from "lucide-react";

export type RentalCardProps = RentalResultRow & {
  id: string;
  listingId: string;
  photoUrl?: string;
  selected?: boolean;
  featured?: boolean;
  searchParams?: RentalSearchApiParams;
  onSelect?: (id: string) => void;
  onSchedule?: () => void;
  onSave?: () => void;
  onOpenDetails?: () => void;
};

export function RentalCard({
  id,
  title,
  neighborhood,
  nightly_price,
  bedrooms,
  photoUrl,
  availability,
  wifi,
  amenities,
  tags,
  selected,
  featured,
  searchParams,
  onSelect,
  onSchedule,
  onSave,
  onOpenDetails,
}: RentalCardProps) {
  const { nightlyLabel, monthlyLabel } = formatRentalPrices(nightly_price);
  const benefits = rentalBenefitBadges({
    id,
    title,
    neighborhood,
    nightly_price,
    bedrooms,
    wifi,
    amenities,
    tags,
  });
  const matchReason = buildMatchReason(
    { id, title, neighborhood, nightly_price, bedrooms, wifi, amenities, tags },
    searchParams,
  );

  const openCard = () => {
    if (onOpenDetails) onOpenDetails();
    else onSelect?.(id);
  };

  const photoAlt =
    title && neighborhood
      ? `${title} rental photo in ${neighborhood}`
      : title
        ? `${title} rental photo`
        : neighborhood
          ? `Rental photo in ${neighborhood}`
          : "Listing photo";

  const cardLabel = `Rental: ${title}${neighborhood ? `, ${neighborhood}` : ""}`;

  return (
    <article
      className={cn(
        "overflow-hidden rounded-lg border bg-card text-sm shadow-sm transition",
        selected ? "border-primary ring-2 ring-primary/30" : "border-border",
        featured && "border-primary/40 bg-primary/[0.02]",
      )}
      data-testid="rental-card"
      data-result-kind="rental"
      data-pin-id={id}
      data-selected={selected ? "true" : "false"}
      aria-label={cardLabel}
    >
      <div className="flex gap-3 p-3">
        <div
          className="min-w-0 flex-1"
          role={onSelect || onOpenDetails ? "button" : undefined}
          tabIndex={onSelect || onOpenDetails ? 0 : undefined}
          onClick={onSelect || onOpenDetails ? openCard : undefined}
          onKeyDown={
            onSelect || onOpenDetails
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openCard();
                  }
                }
              : undefined
          }
        >
          <div className="flex flex-wrap items-center gap-2">
            {featured ? (
              <Badge variant="secondary" className="text-[10px] uppercase">
                Best match
              </Badge>
            ) : null}
            <h3 className="min-w-0 flex-1 font-medium leading-snug">{title}</h3>
          </div>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {neighborhood}
            {bedrooms != null ? ` · ${bedrooms} BR` : ""}
          </p>

          {nightlyLabel ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {nightlyLabel}
              </span>
              {monthlyLabel ? (
                <span className="text-xs text-muted-foreground">
                  {monthlyLabel}
                </span>
              ) : null}
            </div>
          ) : null}

          {availability ? (
            <p className="mt-1 text-xs text-muted-foreground">{availability}</p>
          ) : null}

          <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
            {matchReason}
          </p>

          {benefits.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1">
              {benefits.map((b) => (
                <Badge
                  key={b}
                  variant="outline"
                  className="text-[10px] font-normal"
                >
                  {b}
                </Badge>
              ))}
            </div>
          ) : null}

          <div className="mt-3 flex flex-wrap gap-2">
            {onOpenDetails ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                data-testid="rental-details-cta"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetails();
                }}
              >
                Details
              </Button>
            ) : null}
            <Button
              type="button"
              size="sm"
              variant="default"
              data-testid="rental-schedule-cta"
              onClick={(e) => {
                e.stopPropagation();
                onSchedule?.();
              }}
            >
              <Calendar className="size-3.5" aria-hidden />
              Schedule viewing
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              data-testid="rental-save-cta"
              disabled
              title="Save for later (coming soon)"
              onClick={(e) => {
                e.stopPropagation();
                onSave?.();
              }}
            >
              <Heart className="size-3.5" aria-hidden />
              Save
            </Button>
          </div>
        </div>

        {photoUrl ? (
          <div className="hidden w-[200px] shrink-0 sm:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt={photoAlt}
              width={200}
              height={120}
              className="h-[120px] w-[200px] rounded-md object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <div
            className="hidden h-[120px] w-[200px] shrink-0 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground sm:flex"
            aria-hidden
          >
            Photo
          </div>
        )}
      </div>
    </article>
  );
}
