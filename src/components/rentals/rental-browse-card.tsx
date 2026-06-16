"use client";

import type { KeyboardEvent } from "react";
import { Bed, Building2, Calendar, Heart, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { VenueCardShell } from "@/components/browse/venue-card-shell";
import { VenueCardPlaceholder } from "@/components/browse/venue-card-placeholder";
import { formatRentalPrices } from "@/lib/rental-display";
import { cn } from "@/lib/utils";
import type { Rental } from "@/mastra/tools/search-rentals";

function bedroomLabel(bedrooms: number | null): string {
  if (bedrooms == null || bedrooms === 0) return "Studio";
  return `${bedrooms} BR`;
}

function openScheduleViewing(url: string) {
  try {
    const { protocol } = new URL(url);
    if (protocol === "http:" || protocol === "https:") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  } catch {
    // malformed URL — silently ignore
  }
}

const FEATURED_AMENITIES = ["wifi", "workspace", "kitchen", "gym", "pool", "balcony", "parking"];

const AMENITY_LABELS: Record<string, string> = {
  wifi: "WiFi",
  workspace: "Workspace",
  kitchen: "Kitchen",
  gym: "Gym",
  pool: "Pool",
  balcony: "Balcony",
  parking: "Parking",
  ac: "A/C",
  "air conditioning": "A/C",
  washer: "Washer",
  dryer: "Dryer",
  dishwasher: "Dishwasher",
  "pet-friendly": "Pet OK",
  "pet friendly": "Pet OK",
  rooftop: "Rooftop",
  concierge: "Concierge",
  "long-stay": "Long-stay",
};

function amenityLabel(raw: string): string {
  const key = raw.toLowerCase().trim();
  return AMENITY_LABELS[key] ?? raw.charAt(0).toUpperCase() + raw.slice(1);
}

function topAmenities(amenities: string[] | null, limit = 3): string[] {
  if (!amenities?.length) return [];
  const lower = amenities.map((a) => a.toLowerCase());
  const featured = FEATURED_AMENITIES.filter((f) => lower.includes(f));
  const rest = lower.filter((a) => !FEATURED_AMENITIES.includes(a));
  return [...featured, ...rest].slice(0, limit).map(amenityLabel);
}

type RentalBrowseCardProps = {
  rental: Rental;
  /** SAN-478 / REAL-011 — per-listing id for Playwright (`rental-card-${id}`). */
  testId?: string;
  selected?: boolean;
  onSelect?: () => void;
};

function RentalBrowseCardMedia({
  imageUrl,
  title,
  neighborhood,
  nightlyLabel,
}: {
  imageUrl?: string;
  title: string;
  neighborhood: string;
  nightlyLabel: string | null;
}) {
  return (
    <div className="relative">
      {imageUrl ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={`${title} rental in ${neighborhood}`}
            className="size-full object-cover"
            loading="lazy"
            data-testid="rental-browse-card-photo"
          />
        </div>
      ) : (
        <VenueCardPlaceholder
          label="Apartment"
          icon={<Building2 className="size-5" aria-hidden />}
          mediaLayout="cover"
          testId="rental-browse-card-photo-placeholder"
        />
      )}
      {nightlyLabel ? (
        <span className="absolute bottom-2 right-2 rounded-full bg-background/90 px-2.5 py-0.5 font-mono text-xs font-semibold text-foreground backdrop-blur-sm">
          {nightlyLabel}
        </span>
      ) : null}
    </div>
  );
}

export function RentalBrowseCard({
  rental,
  testId,
  selected,
  onSelect,
}: RentalBrowseCardProps) {
  const { nightlyLabel, monthlyLabel } = formatRentalPrices(rental.nightly_price);
  const chips = topAmenities(rental.amenities);
  const hasWifi = rental.wifi || rental.amenities?.some((a) => a.toLowerCase().includes("wifi"));
  const pinId = `rental-${rental.id}`;
  const preview = () => onSelect?.();
  const interactive = Boolean(onSelect);

  const handleBodyKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect?.();
    }
  };

  return (
    <VenueCardShell
      testId={testId ?? `rental-card-${rental.id}`}
      resultKind="rental"
      pinId={pinId}
      composition="nova"
      mediaLayout="cover"
      selected={selected}
      ariaLabel={`Rental: ${rental.title}, ${rental.neighborhood}`}
      onPreview={interactive ? preview : undefined}
      bodyRole={interactive ? "button" : undefined}
      bodyTabIndex={interactive ? 0 : undefined}
      bodyAriaLabel={`Select ${rental.title} on map`}
      onBodyClick={interactive ? () => onSelect?.() : undefined}
      onBodyKeyDown={interactive ? handleBodyKeyDown : undefined}
      media={
        <RentalBrowseCardMedia
          imageUrl={rental.image || undefined}
          title={rental.title}
          neighborhood={rental.neighborhood}
          nightlyLabel={nightlyLabel}
        />
      }
      footer={
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          {rental.schedule_viewing_url ? (
            <Button
              type="button"
              size="sm"
              variant="default"
              data-testid="rental-schedule-cta"
              className={cn(buttonVariants({ size: "sm", variant: "default" }))}
              onClick={(e) => {
                e.stopPropagation();
                openScheduleViewing(rental.schedule_viewing_url);
              }}
            >
              <Calendar data-icon="inline-start" aria-hidden />
              Schedule viewing
            </Button>
          ) : null}
          <Button
            size="sm"
            variant="outline"
            data-testid="rental-save-cta"
            disabled
            title="Save for later (coming soon)"
          >
            <Heart data-icon="inline-start" aria-hidden />
            Save
          </Button>
        </div>
      }
    >
      <p className="text-[11px] font-medium text-muted-foreground">{rental.neighborhood}</p>
      <h3 className="mt-0.5 font-medium leading-snug">{rental.title}</h3>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Badge variant="secondary" className="gap-1 font-normal">
          <Bed className="size-3" aria-hidden />
          {bedroomLabel(rental.bedrooms)}
        </Badge>
        {hasWifi ? (
          <Badge variant="outline" className="gap-1 font-normal">
            <Wifi className="size-3" aria-hidden />
            WiFi
          </Badge>
        ) : null}
        {chips.map((chip) =>
          chip.toLowerCase() !== "wifi" ? (
            <Badge key={chip} variant="outline" className="font-normal">
              {chip}
            </Badge>
          ) : null,
        )}
      </div>

      {monthlyLabel ? (
        <p className="mt-1.5 text-xs text-muted-foreground">{monthlyLabel}</p>
      ) : null}

      {rental.availability ? (
        <p className="mt-1 truncate text-xs text-muted-foreground">{rental.availability}</p>
      ) : null}
    </VenueCardShell>
  );
}
