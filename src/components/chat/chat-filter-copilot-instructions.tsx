"use client";

import { useCopilotAdditionalInstructions } from "@copilotkit/react-core";
import { useConciergeCoAgent } from "@/components/chat/concierge-coagent-context";
import type { ConciergeWorkingMemory } from "@/lib/types";
import {
  isChipActive,
  CHAT_FILTER_CHIPS,
  EVENT_SUB_CHIPS,
} from "@/platform/copilot/chat-filter-chips";

function buildEventsInstructions(
  eventsMode: boolean,
  memory: ConciergeWorkingMemory,
): string {
  if (!eventsMode) return "";

  const q = memory.lastEventQuery;
  const scopeParts: string[] = [];
  if (q?.category) scopeParts.push(`category=${q.category}`);
  if (q?.dateWindow) scopeParts.push(`dateWindow=${q.dateWindow}`);
  if (q?.neighborhood) scopeParts.push(`neighborhood=${q.neighborhood}`);
  const scopeLine =
    scopeParts.length > 0
      ? `User selected event filters: ${scopeParts.join(", ")}. Call search-events with those params when they ask to list or show events.`
      : "";

  return [
    "The user has the Events filter active.",
    "For SPECIFIC event requests (category, date window, neighborhood, or 'show all'), call search-events in this turn before replying.",
    "For GENERIC city-only requests ('list events medellin', 'events in Medellín' with no category/date/neighborhood), ask ONE short clarify question with category options — do NOT call search-events in that turn. Set genericAskPending in working memory.",
    "Never say 'Found N events' without a search-events tool result in the same turn.",
    scopeLine,
  ]
    .filter(Boolean)
    .join(" ");
}

/** F39 — Events filter + sub-chip scope injected into concierge turns. */
export function ChatFilterCopilotInstructions() {
  const { state } = useConciergeCoAgent();
  const memory = state ?? {};
  const eventsChip = CHAT_FILTER_CHIPS.find((c) => c.id === "events");
  const eventsMode =
    eventsChip != null && isChipActive(memory, eventsChip);

  const instructions = buildEventsInstructions(eventsMode, memory);

  useCopilotAdditionalInstructions(
    {
      instructions,
      available: eventsMode ? "enabled" : "disabled",
    },
    [eventsMode, memory.lastEventQuery?.category, memory.lastEventQuery?.dateWindow, memory.lastEventQuery?.neighborhood],
  );

  return null;
}

export { EVENT_SUB_CHIPS };
