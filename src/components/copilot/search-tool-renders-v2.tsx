"use client";

import { useCallback, useEffect, useRef, type ReactElement } from "react";
import { useRenderTool } from "@copilotkit/react-core/v2";
import { z } from "zod";
import { ToolErrorChip } from "@/components/copilot/tool-error-chip";
import { Skeleton } from "@/components/ui/skeleton";
import { WebCitationList } from "@/components/copilot/web-citation-list";
import {
  AttractionResults,
  EventResults,
  GroundedPlaceResults,
  RentalResults,
  RestaurantResults,
} from "@/components/copilot/search-tool-renders";
import { useChatWorkflow } from "@/components/chat/chat-workflow-context";
import {
  MASTRA_COPILOT_TOOL_ACTIONS,
  MASTRA_TOOL_IDS,
} from "@/platform/copilot/mastra-tool-action-names";
import type { WorkflowKind } from "@/platform/copilot/workflow-steps";
import { useEventSearchResults } from "@/components/chat/event-search-results-context";
import type { EventWebCitationRow } from "@/components/chat/event-search-results-context";
import { normalizeToolEnvelope } from "@/lib/normalize-tool-envelope";
import {
  getToolRenderErrorMessage,
  isToolRenderError,
} from "@/lib/tool-render-state";

type ToolRenderProps = { status: string; result?: unknown };

const searchRentalsParams = z.object({
  neighborhood: z.string().optional(),
  minBedrooms: z.number().int().min(0).optional(),
  maxPricePerNight: z.number().positive().optional(),
  limit: z.number().int().min(1).max(20).optional(),
  queryText: z.string().optional(),
});

const looseToolParams = z.object({}).passthrough();

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

function LoadingCards() {
  return (
    <div
      className="flex flex-col gap-2 py-2"
      data-testid="tool-cards-loading"
      aria-busy="true"
    >
      <p className="text-sm text-muted-foreground">Searching…</p>
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

function parseWebEventToolCitations(result: unknown): EventWebCitationRow[] {
  const row =
    result && typeof result === "object"
      ? (result as Record<string, unknown>)
      : {};
  const list = Array.isArray(row.citations) ? row.citations : [];
  return list.filter(
    (c): c is EventWebCitationRow =>
      Boolean(
        c &&
          typeof c === "object" &&
          typeof (c as { url?: string }).url === "string" &&
          (c as { url: string }).url.startsWith("http") &&
          typeof (c as { title?: string }).title === "string",
      ),
  );
}

function WebCitationsSync({ citations }: { citations: EventWebCitationRow[] }) {
  const { setWebCitations } = useEventSearchResults();
  const lastKeyRef = useRef("");

  useEffect(() => {
    const key = JSON.stringify(citations).slice(0, 400);
    if (key === lastKeyRef.current) return;
    lastKeyRef.current = key;
    setWebCitations(citations);
  }, [citations, setWebCitations]);

  return null;
}

function resolveCompletedToolBody(
  result: unknown,
  renderResults: ReactElement,
): ReactElement {
  if (isToolRenderError(result, "complete")) {
    return <ToolErrorChip message={getToolRenderErrorMessage(result)} />;
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

function rentalToolRender({ status, result }: ToolRenderProps): ReactElement {
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

function eventToolRender({ status, result }: ToolRenderProps): ReactElement {
  const citations =
    status === "complete" && result
      ? (normalizeToolEnvelope(result).webGrounding?.citations ?? []).filter(
          (c): c is EventWebCitationRow =>
            typeof c.url === "string" &&
            c.url.startsWith("http") &&
            typeof c.title === "string",
        )
      : [];
  const body = resolveToolBody({
    status,
    result,
    renderResults: <EventResults result={result} />,
  });
  return (
    <ToolRenderShell kind="event" status={status}>
      <>
        {citations.length > 0 ? (
          <WebCitationsSync citations={citations} />
        ) : null}
        {body}
      </>
    </ToolRenderShell>
  );
}

function restaurantToolRender({
  status,
  result,
}: ToolRenderProps): ReactElement {
  const body = resolveToolBody({
    status,
    result,
    renderResults: <RestaurantResults result={result} />,
  });
  return (
    <ToolRenderShell kind="restaurant" status={status}>
      {body}
    </ToolRenderShell>
  );
}

function attractionToolRender({
  status,
  result,
}: ToolRenderProps): ReactElement {
  const body = resolveToolBody({
    status,
    result,
    renderResults: <AttractionResults result={result} />,
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
    renderResults: <GroundedPlaceResults result={result} />,
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
  const parsed = parseWebEventToolCitations(result);
  const row =
    result && typeof result === "object"
      ? (result as Record<string, unknown>)
      : {};
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
      <>
        {parsed.length > 0 ? <WebCitationsSync citations={parsed} /> : null}
        <WebCitationList citations={parsed} reason={reason} />
      </>
    </ToolRenderShell>
  );
}

function useDualToolRender(
  mastraName: string,
  toolId: string,
  parameters: z.ZodType,
  render: (props: ToolRenderProps) => ReactElement,
) {
  useRenderTool({ name: mastraName, parameters, render }, [render]);
  useRenderTool({ name: toolId, parameters, render }, [render]);
}

/**
 * SAN-890 · CK-V2-004 — v2 mirrors of SearchToolRenders (useRenderTool ×12).
 * v1 search-tool-renders.tsx untouched for flag-off rollback.
 */
export function useSearchToolRendersV2() {
  const rentalRender = useCallback(
    (props: ToolRenderProps) => rentalToolRender(props),
    [],
  );
  const eventRender = useCallback(
    (props: ToolRenderProps) => eventToolRender(props),
    [],
  );
  const restaurantRender = useCallback(
    (props: ToolRenderProps) => restaurantToolRender(props),
    [],
  );
  const attractionRender = useCallback(
    (props: ToolRenderProps) => attractionToolRender(props),
    [],
  );
  const groundedRender = useCallback(
    (props: ToolRenderProps) => groundedToolRender(props),
    [],
  );
  const webEventsRender = useCallback(
    (props: ToolRenderProps) => webEventsToolRender(props),
    [],
  );

  useDualToolRender(
    MASTRA_COPILOT_TOOL_ACTIONS.rentals,
    MASTRA_TOOL_IDS.rentals,
    searchRentalsParams,
    rentalRender,
  );
  useDualToolRender(
    MASTRA_COPILOT_TOOL_ACTIONS.events,
    MASTRA_TOOL_IDS.events,
    looseToolParams,
    eventRender,
  );
  useDualToolRender(
    MASTRA_COPILOT_TOOL_ACTIONS.restaurants,
    MASTRA_TOOL_IDS.restaurants,
    looseToolParams,
    restaurantRender,
  );
  useDualToolRender(
    MASTRA_COPILOT_TOOL_ACTIONS.attractions,
    MASTRA_TOOL_IDS.attractions,
    looseToolParams,
    attractionRender,
  );
  useDualToolRender(
    MASTRA_COPILOT_TOOL_ACTIONS.grounded,
    MASTRA_TOOL_IDS.grounded,
    looseToolParams,
    groundedRender,
  );
  useDualToolRender(
    MASTRA_COPILOT_TOOL_ACTIONS.webEvents,
    MASTRA_TOOL_IDS.webEvents,
    looseToolParams,
    webEventsRender,
  );
}
