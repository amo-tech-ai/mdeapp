"use client";

import { useEffect, useRef } from "react";
import { PlaceResultCard } from "@/components/copilot/place-result-card";
import { AttractionCard } from "@/components/copilot/attraction-card";
import { RestaurantCardWithEventVenue } from "@/components/copilot/restaurant-card-with-event-venue";
import { ToolPinsSync } from "@/components/copilot/tool-pins-sync";
import { EmptyState } from "@/components/empty/empty-state";
import { RichCardResultsRegistrar } from "@/components/chat/rich-card-results-context";
import { useRentalUi } from "@/components/chat/rental-ui-context";
import { normalizeToolEnvelope } from "@/lib/normalize-tool-envelope";
import { toRestaurantVenueDetail } from "@/lib/venues/to-restaurant-venue-detail";
import { useMapContext } from "@/platform/maps/map-context";
import type { MapPinCategory } from "@/platform/contracts";

export function categoryPinId(category: MapPinCategory, rawId: string) {
  return `${category}-${rawId}`;
}

type PlaceRow = {
  id: string;
  title?: string;
  name?: string;
  neighborhood?: string;
  cuisine?: string;
  category?: string;
  priceTier?: string;
  pricePerTicket?: number;
  avgPricePerPerson?: number;
  priceUsd?: number;
  durationMinutes?: number;
  bestTimeOfDay?: string;
  rating?: number;
  imageUrl?: string;
  mapsUrl?: string | null;
  aiSummary?: string | null;
  placeId?: string | null;
  evidence?: Array<{
    sourceType: string;
    sourceUrl: string | null;
    extractedText: string | null;
  }>;
};

function priceLabelForRow(r: PlaceRow): string | undefined {
  if (r.pricePerTicket != null) return `$${r.pricePerTicket} ticket`;
  if (r.avgPricePerPerson != null) return `$${r.avgPricePerPerson}/person`;
  if (r.priceUsd != null) return r.priceUsd === 0 ? "Free" : `$${r.priceUsd}`;
  return undefined;
}

function DomainEmptyState({
  category,
  testId,
}: {
  category: MapPinCategory;
  testId: string;
}) {
  const copy =
    category === "restaurant"
      ? {
          title: "No restaurants found",
          description: "Try another cuisine or neighborhood.",
        }
      : category === "attraction"
        ? {
            title: "No attractions found",
            description: "Try a broader area or activity type.",
          }
        : {
            title: "No places found",
            description: "Try rephrasing your search.",
          };
  return (
    <EmptyState testId={testId} title={copy.title} description={copy.description} />
  );
}

/** Pins + registrar + card list with map hover sync (restaurant / attraction). */
export function DomainResults({
  category,
  result,
  testId,
}: {
  category: MapPinCategory;
  result: unknown;
  testId: string;
}) {
  const { selectedPinId, panToPin } = useMapContext();
  const { openCafeDetail, openRestaurantBooking } = useRentalUi();
  const listRef = useRef<HTMLDivElement>(null);
  const envelope = normalizeToolEnvelope(result);
  const rows = (envelope.results ?? []) as PlaceRow[];
  const rankExplanation = envelope.rankExplanation ?? [];

  useEffect(() => {
    if (!selectedPinId || !listRef.current) return;
    const card = listRef.current.querySelector(
      `[data-pin-id="${selectedPinId}"]`,
    );
    card?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedPinId]);

  return (
    <>
      <RichCardResultsRegistrar category={category} count={rows.length} />
      <ToolPinsSync category={category} result={result} />
      {rankExplanation.length > 0 ? (
        <div
          className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground"
          data-testid="rank-explanation"
        >
          <p className="font-medium text-foreground">Why these results</p>
          <ul className="mt-1 list-inside list-disc">
            {rankExplanation.map((entry) => (
              <li key={`${entry.factor}-${entry.note}`}>
                {entry.factor} ({entry.score.toFixed(2)}): {entry.note}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {rows.length === 0 ? (
        <DomainEmptyState category={category} testId={`${testId}-empty`} />
      ) : (
        <div ref={listRef} className="flex flex-col gap-2 py-2">
          {rows.map((r, index) => {
            const pinId = categoryPinId(category, r.id);
            const title = r.title ?? r.name ?? "Result";

            if (category === "restaurant") {
              const bookingTarget = toRestaurantVenueDetail({
                pinId,
                title,
                placeId: r.placeId,
                mapsUrl: r.mapsUrl,
                neighborhood: r.neighborhood,
                cuisine: r.cuisine,
                rating: r.rating,
                aiSummary: r.aiSummary,
                rank: index + 1,
              });
              const openDetail = () => {
                panToPin(pinId);
                openCafeDetail({
                  kind: "cafe",
                  bookingAsRestaurant: true,
                  pinId,
                  title,
                  placeId: r.placeId ?? undefined,
                  mapsUrl: r.mapsUrl ?? undefined,
                  rating: r.rating,
                  formattedAddress: r.neighborhood,
                  summary: r.aiSummary ?? undefined,
                  rank: index + 1,
                });
              };
              return (
                <RestaurantCardWithEventVenue
                  key={r.id}
                  testId={testId}
                  composition="legacy"
                  title={title}
                  neighborhood={r.neighborhood}
                  cuisine={r.cuisine}
                  priceTier={r.priceTier}
                  avgPricePerPerson={r.avgPricePerPerson}
                  rating={r.rating}
                  imageUrl={r.imageUrl}
                  mapsUrl={r.mapsUrl}
                  aiSummary={r.aiSummary}
                  placeId={r.placeId}
                  pinId={pinId}
                  selected={selectedPinId === pinId}
                  onSelect={() => panToPin(pinId)}
                  onOpenDetails={openDetail}
                  onBookRequest={() => openRestaurantBooking(bookingTarget)}
                />
              );
            }

            if (category === "attraction") {
              const openDetail = () => {
                panToPin(pinId);
                openCafeDetail({
                  kind: "cafe",
                  pinId,
                  title,
                  placeId: r.placeId ?? undefined,
                  mapsUrl: r.mapsUrl ?? undefined,
                  rating: r.rating,
                  formattedAddress: r.neighborhood,
                  summary: r.aiSummary ?? undefined,
                  rank: index + 1,
                });
              };
              return (
                <AttractionCard
                  key={r.id}
                  testId={testId}
                  title={title}
                  neighborhood={r.neighborhood}
                  category={r.category}
                  priceUsd={r.priceUsd}
                  durationMinutes={r.durationMinutes}
                  bestTimeOfDay={r.bestTimeOfDay}
                  rating={r.rating}
                  imageUrl={r.imageUrl}
                  mapsUrl={r.mapsUrl}
                  aiSummary={r.aiSummary}
                  pinId={pinId}
                  selected={selectedPinId === pinId}
                  onSelect={() => panToPin(pinId)}
                  onOpenDetails={openDetail}
                />
              );
            }

            return (
              <PlaceResultCard
                key={r.id}
                testId={testId}
                title={title}
                subtitle={r.neighborhood}
                priceLabel={priceLabelForRow(r)}
                mapsUrl={r.mapsUrl ?? undefined}
                evidenceText={
                  r.evidence?.[0]?.extractedText ??
                  r.evidence?.[0]?.sourceUrl ??
                  undefined
                }
                pinId={pinId}
                selected={selectedPinId === pinId}
                onSelect={() => panToPin(pinId)}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
