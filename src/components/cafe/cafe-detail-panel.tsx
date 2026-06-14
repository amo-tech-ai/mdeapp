"use client";

import { useCallback, useState } from "react";
import { useConciergeChat } from "@/lib/hooks/use-concierge-chat";
import { MessageRole, TextMessage } from "@copilotkit/runtime-client-gql";
import {
  CalendarCheck,
  ExternalLink,
  MapPin,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useRentalUi,
  type CafeVenueDetail,
} from "@/components/chat/rental-ui-context";
import { usePlaceDetails } from "@/hooks/use-place-details";
import { buildCafeAskPrompts } from "@/lib/cafe-ask-prompts";
import {
  formatGroundedRating,
  openNowLabel,
  priceLevelToLabel,
  primaryTypeToLabel,
} from "@/lib/places-display";
import { placesPhotoProxyUrl } from "@/lib/places-photo-proxy";
import { useMapContext } from "@/platform/maps/map-context";
import { cn } from "@/lib/utils";
import { VenueBookingStatusChip } from "@/components/venues/venue-booking-status-chip";
import { toRestaurantVenueDetail } from "@/lib/venues/to-restaurant-venue-detail";

type DetailTab = "overview" | "reviews" | "location";

function mergeDetail(
  card: CafeVenueDetail,
  enriched: ReturnType<typeof usePlaceDetails>,
): {
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  openNow?: boolean | null;
  formattedAddress?: string;
  primaryType?: string;
  websiteUri?: string;
  nationalPhoneNumber?: string;
  weekdayDescriptions: string[];
  photoNames: string[];
  mapsUrl?: string;
  directionsUrl?: string;
  reviewsUrl?: string;
  fieldMaskVersion?: string;
  factsCheckedAt?: string;
} {
  const e = enriched.status === "ready" ? enriched.data : null;
  return {
    rating: e?.rating ?? card.rating,
    userRatingCount: e?.userRatingCount ?? card.userRatingCount,
    priceLevel: e?.priceLevel ?? card.priceLevel,
    openNow: e?.openNow ?? card.openNow,
    formattedAddress: e?.formattedAddress ?? card.formattedAddress,
    primaryType: e?.primaryType ?? card.primaryType,
    websiteUri: e?.websiteUri,
    nationalPhoneNumber: e?.nationalPhoneNumber,
    weekdayDescriptions: e?.weekdayDescriptions ?? [],
    photoNames:
      e?.photoNames.length ? e.photoNames : card.photoName ? [card.photoName] : [],
    mapsUrl: e?.mapsUrl ?? card.mapsUrl,
    directionsUrl: e?.directionsUrl ?? card.directionsUrl,
    reviewsUrl: e?.reviewsUrl ?? card.reviewsUrl,
    fieldMaskVersion: e?.fieldMaskVersion ?? card.fieldMaskVersion,
    factsCheckedAt: e?.checkedAt ?? card.factsCheckedAt,
  };
}

function TabButton({
  active,
  id,
  label,
  onSelect,
}: {
  active: boolean;
  id: DetailTab;
  label: string;
  onSelect: (tab: DetailTab) => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      data-testid={`cafe-detail-tab-${id}`}
      onClick={() => onSelect(id)}
      className={cn(
        "border-b-2 px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function SiblingRail({
  siblings,
  currentPinId,
  onSelect,
}: {
  siblings: CafeVenueDetail[];
  currentPinId: string;
  onSelect: (sibling: CafeVenueDetail) => void;
}) {
  const others = siblings.filter((s) => s.pinId !== currentPinId).slice(0, 4);
  if (others.length === 0) return null;

  return (
    <section className="border-t pt-4" data-testid="cafe-sibling-rail">
      <h3 className="mb-2 text-sm font-semibold">More from this search</h3>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {others.map((s) => {
          const thumb = s.photoName ? placesPhotoProxyUrl(s.photoName, 120) : null;
          const rating = formatGroundedRating(s.rating, s.userRatingCount);
          return (
            <button
              key={s.pinId}
              type="button"
              data-testid="cafe-sibling-card"
              onClick={() => onSelect(s)}
              className="flex w-28 shrink-0 flex-col overflow-hidden rounded-lg border bg-card text-left text-xs shadow-sm transition hover:border-primary"
            >
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumb} alt="" className="h-16 w-full object-cover" />
              ) : (
                <div className="flex h-16 items-center justify-center bg-muted text-muted-foreground">
                  Cafe
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

function AskPrompts({
  title,
  primaryType,
}: {
  title: string;
  primaryType?: string;
}) {
  const { appendMessage, isLoading } = useConciergeChat();
  const prompts = buildCafeAskPrompts(title, primaryType);

  const onPrompt = useCallback(
    async (prompt: string) => {
      if (isLoading) return;
      await appendMessage(
        new TextMessage({ role: MessageRole.User, content: prompt }),
      );
    },
    [appendMessage, isLoading],
  );

  return (
    <section data-testid="cafe-ask-prompts">
      <h3 className="mb-2 text-sm font-semibold">You might want to ask</h3>
      <div className="flex flex-col gap-1.5">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            data-testid="cafe-ask-prompt"
            disabled={isLoading}
            onClick={() => void onPrompt(prompt)}
            className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-left text-sm hover:bg-muted disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>
    </section>
  );
}

export function CafeDetailPanel({
  detail,
  siblings,
  className,
}: {
  detail: CafeVenueDetail;
  siblings: CafeVenueDetail[];
  className?: string;
}) {
  const {
    closeCafeDetail,
    openCafeDetail,
    openCafeBooking,
    openRestaurantBooking,
  } = useRentalUi();
  const { panToPin } = useMapContext();
  const [tab, setTab] = useState<DetailTab>("overview");
  const enrichment = usePlaceDetails(detail.placeId);
  const merged = mergeDetail(detail, enrichment);

  const ratingText = formatGroundedRating(
    merged.rating,
    merged.userRatingCount,
  );
  const priceLabel = priceLevelToLabel(merged.priceLevel);
  const typeLabel = detail.bookingAsRestaurant
    ? "Restaurant"
    : (primaryTypeToLabel(merged.primaryType) ?? "Cafe");
  const hoursLabel = openNowLabel(merged.openNow);
  const heroPhoto = merged.photoNames[0]
    ? placesPhotoProxyUrl(merged.photoNames[0], 640)
    : null;
  const thumbPhotos = merged.photoNames.slice(1, 5);

  const selectSibling = (sibling: CafeVenueDetail) => {
    panToPin(sibling.pinId);
    openCafeDetail(sibling, siblings);
    setTab("overview");
  };

  const showOnMap = () => {
    panToPin(detail.pinId);
    closeCafeDetail();
  };

  return (
    <article
      data-testid="cafe-detail-panel"
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
            data-testid="cafe-detail-close"
            aria-label="Close detail and show map"
            onClick={closeCafeDetail}
          >
            <X className="size-4" />
          </Button>
          <div className="flex flex-wrap justify-end gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="outline"
              data-testid="cafe-detail-booking-cta"
              onClick={() => {
                if (detail.bookingAsRestaurant) {
                  openRestaurantBooking(
                    toRestaurantVenueDetail({
                      pinId: detail.pinId,
                      title: detail.title,
                      placeId: detail.placeId,
                      mapsUrl: detail.mapsUrl,
                      neighborhood: detail.formattedAddress,
                      rating: detail.rating,
                      aiSummary: detail.summary,
                      rank: detail.rank,
                    }),
                  );
                  return;
                }
                openCafeBooking(detail);
              }}
            >
              <CalendarCheck className="size-3.5" aria-hidden />
              {detail.bookingAsRestaurant ? "Request table" : "Request visit"}
            </Button>
          </div>
        </div>
        <h2 className="mt-2 text-lg font-semibold leading-snug">{detail.title}</h2>
        <div className="mt-2">
          <VenueBookingStatusChip
            placeId={detail.placeId}
            uiKind={detail.bookingAsRestaurant ? "restaurant" : "cafe"}
          />
        </div>
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
              variant={merged.openNow === true ? "secondary" : "outline"}
              className="text-xs"
            >
              {hoursLabel}
            </Badge>
          ) : null}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {heroPhoto ? (
          <div className="grid grid-cols-3 gap-1 p-2" data-testid="cafe-detail-gallery">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroPhoto}
              alt=""
              className="col-span-2 row-span-2 h-48 w-full rounded-md object-cover"
            />
            {thumbPhotos.map((name) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={name}
                src={placesPhotoProxyUrl(name, 200)}
                alt=""
                className="h-[calc(6rem-2px)] w-full rounded-md object-cover"
              />
            ))}
          </div>
        ) : null}

        <div
          role="tablist"
          aria-label="Cafe detail sections"
          className="flex border-b px-2"
        >
          <TabButton
            id="overview"
            label="Overview"
            active={tab === "overview"}
            onSelect={setTab}
          />
          <TabButton
            id="reviews"
            label="Reviews"
            active={tab === "reviews"}
            onSelect={setTab}
          />
          <TabButton
            id="location"
            label="Location"
            active={tab === "location"}
            onSelect={setTab}
          />
        </div>

        <div className="space-y-4 p-4">
          {tab === "overview" ? (
            <>
              {detail.summary ? (
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    From search summary
                  </p>
                  <p className="mt-1 text-sm leading-relaxed">{detail.summary}</p>
                </div>
              ) : null}

              {enrichment.status === "loading" ? (
                <p className="text-sm text-muted-foreground">Loading place details…</p>
              ) : null}

              {enrichment.status === "error" ? (
                <p
                  className="text-sm text-muted-foreground"
                  data-testid="place-details-unavailable"
                >
                  Place details are temporarily unavailable. Hours and contact may be
                  missing — summary above is from your search.
                </p>
              ) : null}

              {merged.weekdayDescriptions.length > 0 ? (
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Hours
                  </p>
                  <ul className="mt-1 space-y-0.5 text-sm">
                    {merged.weekdayDescriptions.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <dl className="grid gap-3 text-sm">
                {merged.formattedAddress ? (
                  <div>
                    <dt className="text-muted-foreground">Address</dt>
                    <dd>{merged.formattedAddress}</dd>
                  </div>
                ) : null}
                {merged.websiteUri ? (
                  <div>
                    <dt className="text-muted-foreground">Website</dt>
                    <dd>
                      <a
                        href={merged.websiteUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline-offset-2 hover:underline"
                      >
                        {merged.websiteUri.replace(/^https?:\/\//, "")}
                      </a>
                    </dd>
                  </div>
                ) : null}
                {merged.nationalPhoneNumber ? (
                  <div>
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd>
                      <a
                        href={`tel:${merged.nationalPhoneNumber}`}
                        className="text-primary underline-offset-2 hover:underline"
                      >
                        {merged.nationalPhoneNumber}
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>

              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary">Google-verified</Badge>
                {detail.placeId ? <Badge variant="outline">Place ID</Badge> : null}
                {merged.factsCheckedAt ? (
                  <Badge variant="outline">Checked {merged.factsCheckedAt}</Badge>
                ) : null}
              </div>

              <AskPrompts title={detail.title} primaryType={merged.primaryType} />
            </>
          ) : null}

          {tab === "reviews" ? (
            <div className="space-y-3 text-sm">
              {ratingText ? (
                <p className="text-base font-medium">
                  {merged.rating?.toFixed(1)} / 5
                  {merged.userRatingCount != null
                    ? ` · ${merged.userRatingCount.toLocaleString("en-US")} Google reviews`
                    : ""}
                </p>
              ) : (
                <p className="text-muted-foreground">
                  No Google rating available for this place.
                </p>
              )}
              {merged.reviewsUrl ? (
                <a
                  href={merged.reviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary underline-offset-2 hover:underline"
                  data-testid="cafe-detail-reviews-link"
                >
                  <ExternalLink className="size-3.5" aria-hidden />
                  View on Google
                </a>
              ) : null}
              <p className="text-xs text-muted-foreground">
                Community reviews are not shown until sourced from verified data.
              </p>
            </div>
          ) : null}

          {tab === "location" ? (
            <div className="space-y-3 text-sm">
              {merged.formattedAddress ? (
                <p>{merged.formattedAddress}</p>
              ) : (
                <p className="text-muted-foreground">Address not available.</p>
              )}
              <div className="flex flex-wrap gap-2">
                {merged.directionsUrl ?? merged.mapsUrl ? (
                  <a
                    href={merged.directionsUrl ?? merged.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 font-medium text-primary hover:bg-muted"
                    data-testid="cafe-detail-directions-link"
                  >
                    <MapPin className="size-4" aria-hidden />
                    Get directions
                  </a>
                ) : null}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  data-testid="cafe-detail-show-on-map"
                  onClick={showOnMap}
                >
                  Show on map
                </Button>
              </div>
            </div>
          ) : null}

          <SiblingRail
            siblings={siblings}
            currentPinId={detail.pinId}
            onSelect={selectSibling}
          />
        </div>
      </div>
    </article>
  );
}
