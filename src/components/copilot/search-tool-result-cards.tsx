"use client";

import { useEffect, useRef, type RefObject } from "react";
import { CafeResultCard } from "@/components/copilot/cafe-result-card";
import { RentalCard } from "@/components/copilot/rental-card";
import type { RentalSearchMeta } from "@/components/chat/rental-fast-path-context";
import { EventCard } from "@/components/copilot/event-card";
import { DomainResults } from "@/components/copilot/domain-results";
import { ToolPinsSync } from "@/components/copilot/tool-pins-sync";
import { EmptyState } from "@/components/empty/empty-state";
import { WebCitationList } from "@/components/copilot/web-citation-list";
import {
  useRentalUi,
  type CafeVenueDetail,
  type NightlifeVenueDetail,
} from "@/components/chat/rental-ui-context";
import { readGroundedVenueKind } from "@/lib/grounded-venue-kind";
import type { ParsedGroundedToolResult } from "@/lib/parse-grounded-tool-result";
import { useEventSearchResults } from "@/components/chat/event-search-results-context";
import { RichCardResultsRegistrar } from "@/components/chat/rich-card-results-context";
import { useMapContext } from "@/platform/maps/map-context";
import { normalizeToolEnvelope } from "@/lib/normalize-tool-envelope";
import { parseGroundedToolResult } from "@/lib/parse-grounded-tool-result";

function rentalPinId(listingId: string) {
  return `rental-${listingId}`;
}

function eventPinId(eventId: string) {
  return `event-${eventId}`;
}

function groundedPinId(id: string) {
  return `grounded-${id}`;
}

type GroundedRow = ParsedGroundedToolResult["results"][number];

function groundedRowToBase(row: GroundedRow, rank: number) {
  return {
    pinId: groundedPinId(row.id),
    title: row.title,
    placeId: row.placeId,
    mapsUrl: row.mapsUrl,
    directionsUrl: row.directionsUrl,
    reviewsUrl: row.reviewsUrl,
    rating: row.rating,
    userRatingCount: row.userRatingCount,
    priceLevel: row.priceLevel,
    openNow: row.openNow,
    formattedAddress: row.formattedAddress,
    primaryType: row.primaryType,
    summary: row.summary,
    photoName: row.photoName,
    photoAuthorAttributions: row.photoAuthorAttributions,
    fieldMaskVersion: row.fieldMaskVersion,
    rank,
  };
}

function toCafeVenueDetail(row: GroundedRow, rank: number): CafeVenueDetail {
  return {
    kind: "cafe",
    ...groundedRowToBase(row, rank),
  };
}

function toNightlifeVenueDetail(
  row: GroundedRow,
  rank: number,
): NightlifeVenueDetail {
  return {
    kind: "nightlife",
    ...groundedRowToBase(row, rank),
  };
}

function useGroundedListScroll(listRef: RefObject<HTMLDivElement | null>) {
  const { selectedPinId } = useMapContext();
  useEffect(() => {
    if (!selectedPinId || !listRef.current) return;
    const card = listRef.current.querySelector(
      `[data-pin-id="${selectedPinId}"]`,
    );
    card?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedPinId, listRef]);
}

export function GroundedPlaceResults({ result }: { result: unknown }) {
  const venueKind = readGroundedVenueKind(result);
  if (venueKind === "nightlife") {
    return <GroundedNightlifeResults result={result} />;
  }
  return <GroundedCafeResults result={result} />;
}

export function GroundedNightlifeResults({ result }: { result: unknown }) {
  const { selectedPinId, panToPin } = useMapContext();
  const { openNightlifeDetail, openNightlifeBooking } = useRentalUi();
  const listRef = useRef<HTMLDivElement>(null);
  const { results: rows } = parseGroundedToolResult(result);
  const nightlifeRows = rows.map((r, index) =>
    toNightlifeVenueDetail(r, index + 1),
  );

  useGroundedListScroll(listRef);

  return (
    <>
      <RichCardResultsRegistrar category="grounded" count={rows.length} />
      <ToolPinsSync category="grounded" result={result} />
      {rows.length === 0 ? (
        <EmptyState
          testId="grounded-empty"
          title="No nightlife venues found"
          description="Try salsa bars, rooftop cocktails, or another neighborhood."
        />
      ) : (
        <div ref={listRef} className="flex flex-col gap-2 py-2">
          {nightlifeRows.map((detail) => (
            <CafeResultCard
              key={detail.pinId}
              testId="nightlife-card"
              resultKind="nightlife"
              detailsTestId="nightlife-details-cta"
              bookingTestId="nightlife-booking-cta"
              mediaPlaceholderLabel="Bar"
              pinId={detail.pinId}
              rank={detail.rank ?? 1}
              title={detail.title}
              mapsUrl={detail.mapsUrl}
              directionsUrl={detail.directionsUrl}
              reviewsUrl={detail.reviewsUrl}
              rating={detail.rating}
              userRatingCount={detail.userRatingCount}
              priceLevel={detail.priceLevel}
              openNow={detail.openNow}
              primaryType={detail.primaryType}
              summary={detail.summary}
              formattedAddress={detail.formattedAddress}
              photoName={detail.photoName}
              photoAuthorAttributions={detail.photoAuthorAttributions}
              placeId={detail.placeId}
              fieldMaskVersion={detail.fieldMaskVersion}
              selected={selectedPinId === detail.pinId}
              onSelect={() => panToPin(detail.pinId)}
              onOpenDetails={() =>
                openNightlifeDetail(detail, nightlifeRows)
              }
              onBookRequest={() => openNightlifeBooking(detail)}
            />
          ))}
        </div>
      )}
    </>
  );
}

export function GroundedCafeResults({ result }: { result: unknown }) {
  const { selectedPinId, panToPin } = useMapContext();
  const { openCafeDetail, openCafeBooking } = useRentalUi();
  const listRef = useRef<HTMLDivElement>(null);
  const { results: rows } = parseGroundedToolResult(result);
  const cafeRows = rows.map((r, index) => toCafeVenueDetail(r, index + 1));

  useGroundedListScroll(listRef);

  return (
    <>
      <RichCardResultsRegistrar category="grounded" count={rows.length} />
      <ToolPinsSync category="grounded" result={result} />
      {rows.length === 0 ? (
        <EmptyState
          testId="grounded-empty"
          title="No places found"
          description="Try a different query or area."
        />
      ) : (
        <div ref={listRef} className="flex flex-col gap-2 py-2">
          {cafeRows.map((detail) => (
            <CafeResultCard
              key={detail.pinId}
              testId="grounded-card"
              resultKind="cafe"
              pinId={detail.pinId}
              rank={detail.rank ?? 1}
              title={detail.title}
              mapsUrl={detail.mapsUrl}
              directionsUrl={detail.directionsUrl}
              reviewsUrl={detail.reviewsUrl}
              rating={detail.rating}
              userRatingCount={detail.userRatingCount}
              priceLevel={detail.priceLevel}
              openNow={detail.openNow}
              primaryType={detail.primaryType}
              summary={detail.summary}
              formattedAddress={detail.formattedAddress}
              photoName={detail.photoName}
              photoAuthorAttributions={detail.photoAuthorAttributions}
              placeId={detail.placeId}
              fieldMaskVersion={detail.fieldMaskVersion}
              selected={selectedPinId === detail.pinId}
              onSelect={() => panToPin(detail.pinId)}
              onOpenDetails={() => openCafeDetail(detail, cafeRows)}
              onBookRequest={() => openCafeBooking(detail)}
            />
          ))}
        </div>
      )}
    </>
  );
}

export function RentalResults({
  result,
  searchMeta,
}: {
  result: unknown;
  searchMeta?: RentalSearchMeta;
}) {
  const { selectedPinId, panToPin } = useMapContext();
  const { openScheduleViewing, openVenueDetail } = useRentalUi();
  const listRef = useRef<HTMLDivElement>(null);
  const envelope = result as {
    results?: Array<{
      id: string;
      title: string;
      neighborhood: string;
      nightly_price?: number;
      bedrooms?: number;
      photo_url?: string;
      image_url?: string;
      amenities?: string[];
      tags?: string[];
      wifi?: boolean;
      availability?: string;
      host_name?: string;
    }>;
    rankExplanation?: Array<{ factor: string; score: number; note: string }>;
    hybridUsed?: boolean;
  };
  const rows = envelope.results ?? [];
  const rankExplanation = envelope.rankExplanation ?? [];
  const searchParams = searchMeta?.params;

  useEffect(() => {
    if (!selectedPinId || !listRef.current) return;
    const card = listRef.current.querySelector(
      `[data-pin-id="${selectedPinId}"]`,
    );
    card?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedPinId]);

  return (
    <>
      <RichCardResultsRegistrar category="rental" count={rows.length} />
      <ToolPinsSync category="rental" result={result} />
      {rankExplanation.length > 0 ? (
        <div
          className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground"
          data-testid="rank-explanation-rental"
        >
          <p className="font-medium text-foreground">Why these rentals</p>
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
        <EmptyState
          testId="rentals-empty"
          title="No rentals matched"
          description="Try a wider budget, another neighborhood, or fewer filters."
          suggestions={[
            { label: "Laureles under $80", testId: "rentals-empty-suggest-laureles" },
            { label: "Poblado 2BR", testId: "rentals-empty-suggest-poblado" },
          ]}
        />
      ) : (
        <div ref={listRef} className="flex flex-col gap-2 py-2">
          {rows.map((r, index) => {
          const pinId = rentalPinId(r.id);
          const openDetail = () => {
            panToPin(pinId);
            openVenueDetail({
              kind: "rental",
              listingId: r.id,
              pinId,
              title: r.title,
              neighborhood: r.neighborhood,
              nightlyPrice: r.nightly_price,
              bedrooms: r.bedrooms,
              photoUrl: r.photo_url ?? r.image_url,
              amenities: r.amenities,
              availability: r.availability,
              hostName: r.host_name,
            });
          };
          return (
            <RentalCard
              key={r.id}
              id={pinId}
              listingId={r.id}
              title={r.title}
              neighborhood={r.neighborhood}
              nightly_price={r.nightly_price}
              bedrooms={r.bedrooms}
              photoUrl={r.photo_url ?? r.image_url}
              wifi={r.wifi}
              amenities={r.amenities}
              tags={r.tags}
              availability={r.availability}
              featured={index === 0}
              searchParams={searchParams}
              selected={selectedPinId === pinId}
              onSelect={() => panToPin(pinId)}
              onOpenDetails={openDetail}
              onSchedule={() =>
                openScheduleViewing({
                  listingId: r.id,
                  title: r.title,
                  neighborhood: r.neighborhood,
                })
              }
            />
          );
        })}
        </div>
      )}
    </>
  );
}

export function EventResults({ result }: { result: unknown }) {
  const { selectedPinId, panToPin } = useMapContext();
  const { openVenueDetail } = useRentalUi();
  const { setRows, setWebCitations } = useEventSearchResults();
  const listRef = useRef<HTMLDivElement>(null);
  const envelope = normalizeToolEnvelope(result);
  const rankExplanation = envelope.rankExplanation ?? [];
  const rows = (envelope.results ?? []) as Array<{
    id: string;
    title: string;
    venue: string;
    neighborhood: string;
    startsAt: string;
    pricePerTicket: number;
    currency?: string;
    imageUrl?: string;
    sourceUrl?: string;
  }>;

  useEffect(() => {
    const parsed = normalizeToolEnvelope(result);
    const list = (parsed.results ?? []) as Array<{
      id: string;
      title: string;
      venue?: string;
      neighborhood?: string;
      startsAt: string;
      pricePerTicket?: number;
      imageUrl?: string;
      sourceUrl?: string;
      mapsUrl?: string | null;
    }>;
    const validCitations = (parsed.webGrounding?.citations ?? []).filter(
      (c): c is { title: string; url: string; snippet?: string | null } =>
        typeof c.url === "string" &&
        c.url.startsWith("http") &&
        typeof c.title === "string",
    );
    if (list.length === 0) {
      setWebCitations(validCitations);
      return;
    }
    setRows(
      list.map((e) => ({
        id: e.id,
        title: e.title,
        venue: e.venue ?? "Medellín",
        neighborhood: e.neighborhood ?? "Medellín",
        startsAt: e.startsAt,
        pricePerTicket: e.pricePerTicket ?? 0,
        imageUrl: e.imageUrl,
        sourceUrl: e.sourceUrl ?? e.mapsUrl ?? undefined,
      })),
    );
    setWebCitations(validCitations);
  }, [result, setRows, setWebCitations]);

  useEffect(() => {
    if (!selectedPinId || !listRef.current) return;
    const card = listRef.current.querySelector(
      `[data-pin-id="${selectedPinId}"]`,
    );
    card?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedPinId]);

  return (
    <>
      <RichCardResultsRegistrar category="event" count={rows.length} />
      <ToolPinsSync category="event" result={result} />
      {rankExplanation.length > 0 ? (
        <div
          className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground"
          data-testid="rank-explanation-event"
        >
          <p className="font-medium text-foreground">Why these events</p>
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
        <EmptyState
          testId="events-empty"
          title="No events found"
          description="Try a different date range or neighborhood."
          suggestions={[
            { label: "Events this weekend", testId: "events-empty-suggest-weekend" },
            { label: "Salsa in Poblado", testId: "events-empty-suggest-salsa" },
          ]}
        />
      ) : (
        <div ref={listRef} className="flex flex-col gap-2 py-2">
          {rows.map((e) => {
          const pinId = eventPinId(e.id);
          const ticketUrl = `/events/${e.id}`;
          const openDetail = () => {
            panToPin(pinId);
            openVenueDetail({
              kind: "event",
              eventId: e.id,
              pinId,
              title: e.title,
              neighborhood: e.neighborhood,
              venue: e.venue,
              startsAt: e.startsAt,
              pricePerTicket: e.pricePerTicket,
              imageUrl: e.imageUrl,
              ticketUrl,
            });
          };
          return (
            <EventCard
              key={e.id}
              id={pinId}
              eventId={e.id}
              title={e.title}
              venue={e.venue}
              neighborhood={e.neighborhood}
              startsAt={e.startsAt}
              pricePerTicket={e.pricePerTicket}
              currency={e.currency}
              imageUrl={e.imageUrl}
              ticketUrl={ticketUrl}
              sourceUrl={e.sourceUrl}
              selected={selectedPinId === pinId}
              onSelect={() => panToPin(pinId)}
              onOpenDetails={openDetail}
            />
          );
        })}
        </div>
      )}
      {envelope.webGrounding &&
      ((envelope.webGrounding.citations?.length ?? 0) > 0 ||
        envelope.webGrounding.metadata?.reason) ? (
        <WebCitationList
          citations={
            (envelope.webGrounding.citations ?? []) as Array<{
              title: string;
              url: string;
              snippet?: string | null;
            }>
          }
          reason={
            typeof envelope.webGrounding.metadata?.reason === "string"
              ? envelope.webGrounding.metadata.reason
              : null
          }
        />
      ) : null}
    </>
  );
}

export function RestaurantResults({ result }: { result: unknown }) {
  return (
    <DomainResults
      category="restaurant"
      result={result}
      testId="restaurant-card"
    />
  );
}

export function AttractionResults({ result }: { result: unknown }) {
  return (
    <DomainResults
      category="attraction"
      result={result}
      testId="attraction-card"
    />
  );
}
