"use client";

import { useEffect, useRef } from "react";
import { useDefaultTool } from "@copilotkit/react-core";
import { normalizeToolEnvelope } from "@/lib/normalize-tool-envelope";
import { useEventSearchResults } from "@/components/chat/event-search-results-context";
import type { EventWebCitationRow } from "@/components/chat/event-search-results-context";
import {
  MASTRA_COPILOT_TOOL_ACTIONS,
  MASTRA_TOOL_IDS,
} from "@/platform/copilot/mastra-tool-action-names";

const EVENT_TOOL_NAMES = new Set<string>([
  MASTRA_COPILOT_TOOL_ACTIONS.events,
  MASTRA_TOOL_IDS.events,
]);

const WEB_EVENTS_TOOL_NAMES = new Set<string>([
  MASTRA_COPILOT_TOOL_ACTIONS.webEvents,
  MASTRA_TOOL_IDS.webEvents,
]);

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

function SyncFromToolResult({
  name,
  status,
  result,
}: {
  name: string;
  status: string;
  result?: unknown;
}) {
  const { setWebCitations } = useEventSearchResults();
  const lastKeyRef = useRef("");

  useEffect(() => {
    if (status !== "complete" || !result) return;

    let citations: EventWebCitationRow[] = [];
    if (WEB_EVENTS_TOOL_NAMES.has(name)) {
      citations = parseWebEventToolCitations(result);
    } else if (EVENT_TOOL_NAMES.has(name)) {
      const envelope = normalizeToolEnvelope(result);
      citations = (envelope.webGrounding?.citations ?? []).filter(
        (c): c is EventWebCitationRow =>
          typeof c.url === "string" &&
          c.url.startsWith("http") &&
          typeof c.title === "string",
      );
    } else {
      return;
    }

    if (citations.length === 0) return;

    const key = `${name}:${JSON.stringify(citations).slice(0, 400)}`;
    if (key === lastKeyRef.current) return;
    lastKeyRef.current = key;
    setWebCitations(citations);
  }, [name, status, result, setWebCitations]);

  return null;
}

/** MAP-002D — sync web citations from AG-UI tool results into EventResultsPanel. */
export function EventWebCitationSync() {
  useDefaultTool({
    render: (props: { name: string; status: string; result?: unknown }) => (
      <SyncFromToolResult
        name={props.name}
        status={props.status}
        result={props.result}
      />
    ),
  });
  return null;
}
