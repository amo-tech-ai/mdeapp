"use client";

import { useEffect, useRef } from "react";
import { useCopilotAction } from "@copilotkit/react-core";
import type { ReactElement } from "react";
import { RentalCard } from "@/components/copilot/rental-card";
import { EventCard } from "@/components/copilot/event-card";
import { PlaceResultCard } from "@/components/copilot/place-result-card";
import { ToolErrorChip } from "@/components/copilot/tool-error-chip";
import { EmptyState } from "@/components/empty/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { GroundingAttribution } from "@/components/maps/GroundingAttribution";
import { useRentalUi } from "@/components/chat/rental-ui-context";
import { useEventSearchResults } from "@/components/chat/event-search-results-context";
import { useChatWorkflow } from "@/components/chat/chat-workflow-context";
import {
  MASTRA_COPILOT_TOOL_ACTIONS,
  MASTRA_TOOL_IDS,
} from "@/platform/copilot/mastra-tool-action-names";
import type { WorkflowKind } from "@/platform/copilot/workflow-steps";
import { useMapContext } from "@/platform/maps/map-context";
import { normalizeToolOutput } from "@/platform/maps/normalize-tool-output";
import { normalizeToolEnvelope } from "@/lib/normalize-tool-envelope";
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

function RentalResults({ result }: { result: unknown }) {
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
      availability?: string;
      host_name?: string;
    }>;
  };
  const rows = envelope.results ?? [];

  useEffect(() => {
    if (!selectedPinId || !listRef.current) return;
    const card = listRef.current.querySelector(
      `[data-pin-id="${selectedPinId}"]`,
    );
    card?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedPinId]);

  return (
    <>
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
          {rows.map((r) => {
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
  const { setRows } = useEventSearchResults();
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
    if (list.length === 0) return;
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
  }, [result, setRows]);

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

function useDisabledToolRender(
  name: string,
  render: (props: { status: string; result: unknown }) => ReactElement,
) {
  useCopilotAction({ name, available: "disabled", render }, []);
}

export function SearchToolRenders() {
  const rentalRender = rentalToolRender;
  useDisabledToolRender(MASTRA_COPILOT_TOOL_ACTIONS.rentals, rentalRender);
  useDisabledToolRender(MASTRA_TOOL_IDS.rentals, rentalRender);

  const eventRender = ({ status, result }: { status: string; result: unknown }) => {
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
  };
  useDisabledToolRender(MASTRA_COPILOT_TOOL_ACTIONS.events, eventRender);
  useDisabledToolRender(MASTRA_TOOL_IDS.events, eventRender);

  const restaurantRender = ({
    status,
    result,
  }: {
    status: string;
    result: unknown;
  }) => {
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
  };
  useDisabledToolRender(MASTRA_COPILOT_TOOL_ACTIONS.restaurants, restaurantRender);
  useDisabledToolRender(MASTRA_TOOL_IDS.restaurants, restaurantRender);

  const attractionRender = ({
    status,
    result,
  }: {
    status: string;
    result: unknown;
  }) => {
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
  };
  useDisabledToolRender(MASTRA_COPILOT_TOOL_ACTIONS.attractions, attractionRender);
  useDisabledToolRender(MASTRA_TOOL_IDS.attractions, attractionRender);

  const groundedRender = ({
    status,
    result,
  }: {
    status: string;
    result: unknown;
  }) => {
    if (isToolRenderError(result, status)) {
      return (
        <ToolRenderShell kind="grounded" status={status}>
          <ToolErrorChip message={getToolRenderErrorMessage(result)} />
        </ToolRenderShell>
      );
    }
    if (status !== "complete" || !result) {
      return (
        <ToolRenderShell kind="grounded" status={status}>
          <LoadingCards />
        </ToolRenderShell>
      );
    }
    const envelope = result as {
      results?: Array<{ id: string; title: string; mapsUrl?: string }>;
      attribution?: Array<{ source?: string; placeUri?: string }>;
    };
    const rows = envelope.results ?? [];
    return (
      <ToolRenderShell kind="grounded" status={status}>
        {rows.length === 0 ? (
          <EmptyState
            testId="grounded-empty"
            title="No places found"
            description="Try a different query or area."
          />
        ) : (
          <>
            <ToolPinsSync category="grounded" result={result} />
            <div className="flex flex-col gap-2 py-2">
              {rows.map((r) => (
                <PlaceResultCard
                  key={r.id}
                  testId="grounded-card"
                  title={r.title}
                  mapsUrl={r.mapsUrl}
                />
              ))}
              <GroundingAttribution rows={envelope.attribution ?? []} />
            </div>
          </>
        )}
      </ToolRenderShell>
    );
  };
  useDisabledToolRender(MASTRA_COPILOT_TOOL_ACTIONS.grounded, groundedRender);
  useDisabledToolRender(MASTRA_TOOL_IDS.grounded, groundedRender);

  return null;
}
