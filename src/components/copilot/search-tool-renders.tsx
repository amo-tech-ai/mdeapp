"use client";

import { useEffect, useRef } from "react";
import { useCopilotAction } from "@copilotkit/react-core";
import type { ReactElement } from "react";
import { CafeResultCard } from "@/components/copilot/cafe-result-card";
import { RentalCard } from "@/components/copilot/rental-card";
import type { RentalSearchMeta } from "@/components/chat/rental-fast-path-context";
import { EventCard } from "@/components/copilot/event-card";
import { PlaceResultCard } from "@/components/copilot/place-result-card";
import { ToolErrorChip } from "@/components/copilot/tool-error-chip";
import { EmptyState } from "@/components/empty/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { WebCitationList } from "@/components/copilot/web-citation-list";
import {
  useRentalUi,
  type CafeVenueDetail,
} from "@/components/chat/rental-ui-context";
import { useEventSearchResults } from "@/components/chat/event-search-results-context";
import { RichCardResultsRegistrar } from "@/components/chat/rich-card-results-context";
import { useChatWorkflow } from "@/components/chat/chat-workflow-context";
import {
  MASTRA_COPILOT_TOOL_ACTIONS,
  MASTRA_TOOL_IDS,
} from "@/platform/copilot/mastra-tool-action-names";
import type { WorkflowKind } from "@/platform/copilot/workflow-steps";
import { useMapContext } from "@/platform/maps/map-context";
import { normalizeToolOutput } from "@/platform/maps/normalize-tool-output";
import { normalizeToolEnvelope } from "@/lib/normalize-tool-envelope";
import { parseGroundedToolResult } from "@/lib/parse-grounded-tool-result";
import {
  getToolRenderErrorMessage,
  isToolRenderEmpty,
  isToolRenderError,
} from "@/lib/tool-render-state";
import type { MapPinCategory } from "@/platform/contracts";

function ToolPinsSync({
  category,
  result,
}: {
  category: MapPinCategory;
  result: unknown;
}) {
  const { mergePinsByCategory } = useMapContext();
  const lastMergedKeyRef = useRef("");

  useEffect(() => {
    const { pins } = normalizeToolOutput(category, result);
    if (pins.length === 0) return;
    const key = `${category}:${pins.map((p) => p.id).sort().join(",")}`;
    if (key === lastMergedKeyRef.current) return;
    lastMergedKeyRef.current = key;
    mergePinsByCategory(category, pins);
  }, [category, result, mergePinsByCategory]);

  return null;
}

function WorkflowStatusReporter({
  kind,
  status,
}: {
  kind: WorkflowKind;
  status: string;
}) {
  const { reportToolStatus } = useChatWorkflow();
  useEffect(() => {
    reportToolStatus(kind, status);
  }, [kind, status, reportToolStatus]);
  return null;
}

function rentalPinId(listingId: string) {
  return `rental-${listingId}`;
}

function eventPinId(eventId: string) {
  return `event-${eventId}`;
}

function groundedPinId(id: string) {
  return `grounded-${id}`;
}

function toCafeVenueDetail(
  row: ReturnType<typeof parseGroundedToolResult>["results"][number],
  rank: number,
): CafeVenueDetail {
  return {
    kind: "cafe",
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

function GroundedCafeResults({ result }: { result: unknown }) {
  const { selectedPinId, panToPin } = useMapContext();
  const { openCafeDetail, openCafeBooking } = useRentalUi();
  const listRef = useRef<HTMLDivElement>(null);
  const { results: rows } = parseGroundedToolResult(result);
  const cafeRows = rows.map((r, index) => toCafeVenueDetail(r, index + 1));

  useEffect(() => {
    if (!selectedPinId || !listRef.current) return;
    const card = listRef.current.querySelector(
      `[data-pin-id="${selectedPinId}"]`,
    );
    card?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedPinId]);

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
  };
  const rows = envelope.results ?? [];
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

function EventResults({ result }: { result: unknown }) {
  const { selectedPinId, panToPin } = useMapContext();
  const { openVenueDetail } = useRentalUi();
  const { setRows, setWebCitations } = useEventSearchResults();
  const listRef = useRef<HTMLDivElement>(null);
  const envelope = normalizeToolEnvelope(result);
  const rows = (envelope.results ?? []) as Array<{
    id: string;
    title: string;
    venue: string;
    neighborhood: string;
    startsAt: string;
    pricePerTicket: number;
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
      <ToolPinsSync category="event" result={result} />
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

function GenericResults({
  category,
  result,
  testId,
}: {
  category: MapPinCategory;
  result: unknown;
  testId: string;
}) {
  const envelope = result as {
    results?: Array<{
      id: string;
      title?: string;
      name?: string;
      neighborhood?: string;
      pricePerTicket?: number;
      avgPricePerPerson?: number;
      priceUsd?: number;
    }>;
  };
  const rows = envelope.results ?? [];

  return (
    <>
      <ToolPinsSync category={category} result={result} />
      {rows.length === 0 ? (
        <GenericEmptyState category={category} testId={`${testId}-empty`} />
      ) : (
        <div className="flex flex-col gap-2 py-2">
          {rows.map((r) => (
            <PlaceResultCard
              key={r.id}
              testId={testId}
              title={r.title ?? r.name ?? "Result"}
              subtitle={r.neighborhood}
              priceLabel={
                r.pricePerTicket != null
                  ? `$${r.pricePerTicket} ticket`
                  : r.avgPricePerPerson != null
                    ? `$${r.avgPricePerPerson}/person`
                    : r.priceUsd != null
                      ? r.priceUsd === 0
                        ? "Free"
                        : `$${r.priceUsd}`
                      : undefined
              }
            />
          ))}
        </div>
      )}
    </>
  );
}

function GenericEmptyState({
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

function LoadingCards() {
  return (
    <div className="flex flex-col gap-2 py-2" data-testid="tool-cards-loading" aria-busy="true">
      <p className="text-sm text-muted-foreground">Searching…</p>
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

function resolveCompletedToolBody(
  result: unknown,
  renderResults: ReactElement,
): ReactElement {
  if (isToolRenderError(result, "complete")) {
    return <ToolErrorChip message={getToolRenderErrorMessage(result)} />;
  }
  if (isToolRenderEmpty(result)) {
    return renderResults;
  }
  return renderResults;
}

function resolveToolBody({
  status,
  result,
  renderResults,
}: {
  status: string;
  result: unknown;
  renderResults: ReactElement;
}): ReactElement {
  if (isToolRenderError(result, status)) {
    return <ToolErrorChip message={getToolRenderErrorMessage(result)} />;
  }
  if (status !== "complete" || !result) {
    return <LoadingCards />;
  }
  return resolveCompletedToolBody(result, renderResults);
}

function ToolRenderShell({
  kind,
  status,
  children,
}: {
  kind: WorkflowKind;
  status: string;
  children: ReactElement | null;
}) {
  return (
    <>
      <WorkflowStatusReporter kind={kind} status={status} />
      {children}
    </>
  );
}

function rentalToolRender({
  status,
  result,
}: {
  status: string;
  result: unknown;
}): ReactElement {
  const body = resolveToolBody({
    status,
    result,
    renderResults: <RentalResults result={result} />,
  });
  return (
    <ToolRenderShell kind="rental" status={status}>
      {body}
    </ToolRenderShell>
  );
}

type ToolRenderProps = { status: string; result: unknown };

function eventToolRender({ status, result }: ToolRenderProps): ReactElement {
  const body = resolveToolBody({
    status,
    result,
    renderResults: <EventResults result={result} />,
  });
  return (
    <ToolRenderShell kind="event" status={status}>
      {body}
    </ToolRenderShell>
  );
}

function restaurantToolRender({ status, result }: ToolRenderProps): ReactElement {
  const body = resolveToolBody({
    status,
    result,
    renderResults: (
      <GenericResults
        category="restaurant"
        result={result}
        testId="restaurant-card"
      />
    ),
  });
  return (
    <ToolRenderShell kind="restaurant" status={status}>
      {body}
    </ToolRenderShell>
  );
}

function attractionToolRender({ status, result }: ToolRenderProps): ReactElement {
  const body = resolveToolBody({
    status,
    result,
    renderResults: (
      <GenericResults
        category="attraction"
        result={result}
        testId="attraction-card"
      />
    ),
  });
  return (
    <ToolRenderShell kind="attraction" status={status}>
      {body}
    </ToolRenderShell>
  );
}

function groundedToolRender({ status, result }: ToolRenderProps): ReactElement {
  const body = resolveToolBody({
    status,
    result,
    renderResults: <GroundedCafeResults result={result} />,
  });
  return (
    <ToolRenderShell kind="grounded" status={status}>
      {body}
    </ToolRenderShell>
  );
}

function webEventsToolRender({ status, result }: ToolRenderProps): ReactElement {
  if (isToolRenderError(result, status)) {
    return (
      <ToolRenderShell kind="event" status={status}>
        <ToolErrorChip message={getToolRenderErrorMessage(result)} />
      </ToolRenderShell>
    );
  }
  if (status !== "complete" || !result) {
    return (
      <ToolRenderShell kind="event" status={status}>
        <LoadingCards />
      </ToolRenderShell>
    );
  }
  const row =
    result && typeof result === "object"
      ? (result as Record<string, unknown>)
      : {};
  const parsed = (Array.isArray(row.citations) ? row.citations : []).filter(
    (c): c is { title: string; url: string; snippet?: string | null } =>
      Boolean(
        c &&
          typeof c === "object" &&
          typeof (c as { url?: string }).url === "string" &&
          (c as { url: string }).url.startsWith("http") &&
          typeof (c as { title?: string }).title === "string",
      ),
  );
  const reason =
    row.metadata && typeof row.metadata === "object"
      ? (row.metadata as { reason?: string }).reason
      : null;

  if (parsed.length === 0 && !reason) {
    return (
      <ToolRenderShell kind="event" status={status}>
        <></>
      </ToolRenderShell>
    );
  }

  return (
    <ToolRenderShell kind="event" status={status}>
      <WebCitationList citations={parsed} reason={reason} />
    </ToolRenderShell>
  );
}

function useDisabledToolRender(
  name: string,
  render: (props: ToolRenderProps) => ReactElement,
) {
  useCopilotAction({ name, available: "disabled", render }, []);
}

export function SearchToolRenders() {
  useDisabledToolRender(MASTRA_COPILOT_TOOL_ACTIONS.rentals, rentalToolRender);
  useDisabledToolRender(MASTRA_TOOL_IDS.rentals, rentalToolRender);
  useDisabledToolRender(MASTRA_COPILOT_TOOL_ACTIONS.events, eventToolRender);
  useDisabledToolRender(MASTRA_TOOL_IDS.events, eventToolRender);
  useDisabledToolRender(
    MASTRA_COPILOT_TOOL_ACTIONS.restaurants,
    restaurantToolRender,
  );
  useDisabledToolRender(MASTRA_TOOL_IDS.restaurants, restaurantToolRender);
  useDisabledToolRender(
    MASTRA_COPILOT_TOOL_ACTIONS.attractions,
    attractionToolRender,
  );
  useDisabledToolRender(MASTRA_TOOL_IDS.attractions, attractionToolRender);
  useDisabledToolRender(MASTRA_COPILOT_TOOL_ACTIONS.grounded, groundedToolRender);
  useDisabledToolRender(MASTRA_TOOL_IDS.grounded, groundedToolRender);
  useDisabledToolRender(MASTRA_COPILOT_TOOL_ACTIONS.webEvents, webEventsToolRender);
  useDisabledToolRender(MASTRA_TOOL_IDS.webEvents, webEventsToolRender);

  return null;
}
