"use client";

import { useState } from "react";
import {
  CalendarCheck,
  ExternalLink,
  MapPin,
  Shield,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useRentalUi,
  type NightlifeVenueDetail,
} from "@/components/chat/rental-ui-context";
import { usePlaceDetails } from "@/hooks/use-place-details";
import {
  formatGroundedRating,
  openNowLabel,
  priceLevelToLabel,
  primaryTypeToLabel,
} from "@/lib/places-display";
import { placesPhotoProxyUrl } from "@/lib/places-photo-proxy";
import { useMapContext } from "@/platform/maps/map-context";
import { cn } from "@/lib/utils";

const SAFETY_COPY_KEY = "mdeai-nightlife-safety-shown";

function NightlifeSafetyNotice() {
  const [visible] = useState(() => {
    if (typeof sessionStorage === "undefined") return false;
    if (sessionStorage.getItem(SAFETY_COPY_KEY)) return false;
    sessionStorage.setItem(SAFETY_COPY_KEY, "1");
    return true;
  });

  if (!visible) return null;

  return (
    <div
      className="rounded-lg border border-amber-200/80 bg-amber-50/80 px-3 py-2 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100"
      data-testid="nightlife-safety-notice"
    >
      <p className="flex items-start gap-2 font-medium">
        <Shield className="mt-0.5 size-4 shrink-0" aria-hidden />
        Going out in Medellín
      </p>
      <p className="mt-1 text-xs leading-relaxed opacity-90">
        Use licensed taxis or ride apps after midnight, keep IDs handy, and share
        your location with someone you trust. Cover and dress codes vary by venue.
      </p>
    </div>
  );
}

function SiblingRail({
  siblings,
  currentPinId,
  onSelect,
}: {
  siblings: NightlifeVenueDetail[];
  currentPinId: string;
  onSelect: (sibling: NightlifeVenueDetail) => void;
}) {
  const others = siblings.filter((s) => s.pinId !== currentPinId).slice(0, 4);
  if (others.length === 0) return null;

  return (
    <section className="border-t pt-4" data-testid="nightlife-sibling-rail">
      <h3 className="mb-2 text-sm font-semibold">More from this search</h3>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {others.map((s) => {
          const thumb = s.photoName ? placesPhotoProxyUrl(s.photoName, 120) : null;
          const rating = formatGroundedRating(s.rating, s.userRatingCount);
          return (
            <button
              key={s.pinId}
              type="button"
              data-testid="nightlife-sibling-card"
              onClick={() => onSelect(s)}
              className="flex w-28 shrink-0 flex-col overflow-hidden rounded-lg border bg-card text-left text-xs shadow-sm transition hover:border-primary"
            >
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumb} alt="" className="h-16 w-full object-cover" />
              ) : (
                <div className="flex h-16 items-center justify-center bg-muted text-muted-foreground">
                  Bar
                </div>
              )}
              <div className="p-2">
                <p className="line-clamp-2 font-medium leading-tight">{s.title}</p>
                {rating ? (
                  <p className="mt-1 text-muted-foreground">★ {rating}</p>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function NightlifeDetailPanel({
  detail,
  siblings,
  className,
}: {
  detail: NightlifeVenueDetail;
  siblings: NightlifeVenueDetail[];
  className?: string;
}) {
  const { closeNightlifeDetail, openNightlifeDetail, openNightlifeBooking } =
    useRentalUi();
  const { panToPin } = useMapContext();
  const enrichment = usePlaceDetails(detail.placeId);
  const e = enrichment.status === "ready" ? enrichment.data : null;

  const ratingText = formatGroundedRating(
    e?.rating ?? detail.rating,
    e?.userRatingCount ?? detail.userRatingCount,
  );
  const priceLabel = priceLevelToLabel(e?.priceLevel ?? detail.priceLevel);
  const typeLabel = primaryTypeToLabel(e?.primaryType ?? detail.primaryType) ?? "Nightlife";
  const hoursLabel = openNowLabel(e?.openNow ?? detail.openNow);
  const heroPhoto =
    (e?.photoNames[0] ? placesPhotoProxyUrl(e.photoNames[0], 640) : null) ??
    (detail.photoName ? placesPhotoProxyUrl(detail.photoName, 640) : null);
  const address = e?.formattedAddress ?? detail.formattedAddress;
  const mapsUrl = e?.mapsUrl ?? detail.mapsUrl;
  const summary = detail.summary?.trim();

  const selectSibling = (sibling: NightlifeVenueDetail) => {
    panToPin(sibling.pinId);
    openNightlifeDetail(sibling, siblings);
  };

  return (
    <article
      data-testid="nightlife-detail-panel"
      data-right-column-mode="detail"
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden bg-background",
        className,
      )}
    >
      <header className="shrink-0 border-b px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            data-testid="nightlife-detail-close"
            aria-label="Close detail and show map"
            onClick={closeNightlifeDetail}
          >
            <X className="size-4" />
          </Button>
          <div className="flex flex-wrap justify-end gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="outline"
              data-testid="nightlife-detail-booking-cta"
              onClick={() => openNightlifeBooking(detail)}
            >
              <CalendarCheck className="size-3.5" aria-hidden />
              Request visit
            </Button>
          </div>
        </div>
        <h2 className="mt-2 text-lg font-semibold leading-snug">{detail.title}</h2>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          {ratingText ? (
            <span className="inline-flex items-center gap-1 font-medium text-foreground">
              <Star className="size-3.5 fill-current" aria-hidden />
              {ratingText}
            </span>
          ) : null}
          <span>{typeLabel}</span>
          {priceLabel ? <span>· {priceLabel}</span> : null}
          {hoursLabel ? (
            <Badge
              variant={e?.openNow === true ? "secondary" : "outline"}
              className="text-xs"
            >
              {hoursLabel}
            </Badge>
          ) : null}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <NightlifeSafetyNotice />

        {heroPhoto ? (
          <div className="mb-4 overflow-hidden rounded-lg" data-testid="nightlife-detail-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroPhoto} alt="" className="h-48 w-full object-cover" />
          </div>
        ) : null}

        {address ? (
          <p className="mt-3 text-sm text-muted-foreground">{address}</p>
        ) : null}

        {summary ? (
          <p className="mt-3 text-sm leading-relaxed text-foreground">{summary}</p>
        ) : null}

        <dl className="mt-4 grid gap-3 text-sm">
          <div data-testid="nightlife-detail-cover">
            <dt className="text-muted-foreground">Cover</dt>
            <dd className="text-muted-foreground">Varies — confirm with venue</dd>
          </div>
          <div data-testid="nightlife-detail-music">
            <dt className="text-muted-foreground">Music</dt>
            <dd className="text-muted-foreground">
              {typeLabel.includes("salsa") ? "Live salsa" : "Ask concierge for genre"}
            </dd>
          </div>
          <div data-testid="nightlife-detail-dress">
            <dt className="text-muted-foreground">Dress code</dt>
            <dd className="text-muted-foreground">Smart casual unless stated at door</dd>
          </div>
        </dl>

        {mapsUrl ? (
          <div className="mt-4">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-8 items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-primary hover:bg-muted"
              data-testid="nightlife-detail-maps-link"
            >
              <MapPin className="size-3.5" aria-hidden />
              Open in Google Maps
              <ExternalLink className="size-3" aria-hidden />
            </a>
          </div>
        ) : null}

        <SiblingRail
          siblings={siblings}
          currentPinId={detail.pinId}
          onSelect={selectSibling}
        />
      </div>
    </article>
  );
}
