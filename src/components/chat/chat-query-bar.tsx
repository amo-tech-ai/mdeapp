"use client";

import { useState } from "react";
import { useCopilotChat } from "@copilotkit/react-core";
import { useConciergeCoAgent } from "@/components/chat/concierge-coagent-context";
import { MessageRole, TextMessage } from "@copilotkit/runtime-client-gql";
import type { ConciergeWorkingMemory } from "@/lib/types";
import { eventSubChipPrompt } from "@/lib/event-query-classifier";
import { useEventSearchFastPath } from "@/hooks/use-event-search-fast-path";
import { clearConciergeError } from "@/lib/concierge-error-store";
import { cn } from "@/lib/utils";
import {
  CHAT_FILTER_CHIPS,
  EVENT_SUB_CHIPS,
  applyChipToggle,
  isChipActive,
  type FilterChipDef,
} from "@/platform/copilot/chat-filter-chips";

/** SCREEN-003 + F39 — sticky chips → concierge working memory; event sub-row when Events active. */
export function ChatQueryBar() {
  const { state: agentState, setState } = useConciergeCoAgent();
  const { appendMessage, isLoading } = useCopilotChat();
  const { handleEventChip } = useEventSearchFastPath();
  const [localState, setLocalState] = useState<ConciergeWorkingMemory>({});

  const memory: ConciergeWorkingMemory = { ...localState, ...(agentState ?? {}) };
  const eventsChip = CHAT_FILTER_CHIPS.find((c) => c.id === "events");
  const eventsMode =
    eventsChip != null && isChipActive(memory, eventsChip);

  function toggleChip(chip: FilterChipDef) {
    const nextActive = !isChipActive(memory, chip);
    const next = applyChipToggle(memory, chip, nextActive);
    setLocalState(next);
    setState(next);
  }

  async function onEventSubChip(chip: FilterChipDef) {
    const nextActive = !isChipActive(memory, chip);
    const next = applyChipToggle(memory, chip, nextActive);
    setLocalState(next);
    setState(next);
    if (!nextActive || isLoading) return;
    clearConciergeError();

    const prompt = eventSubChipPrompt({
      label: chip.label,
      category: chip.eventCategory,
      dateWindow: chip.eventDateWindow,
      showAll: chip.eventShowAll,
    });
    const handled = await handleEventChip(chip, prompt, next);
    if (!handled) {
      await appendMessage(
        new TextMessage({
          role: MessageRole.User,
          content: prompt,
        }),
      );
    }
  }

  return (
    <div
      data-testid="chat-query-bar"
      className="sticky top-0 z-10 shrink-0 border-b border-border bg-background/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <p className="mb-2 text-xs font-medium text-muted-foreground">
        Medellín · tap filters to scope your next message
      </p>
      <div
        className="flex flex-wrap gap-1.5"
        role="group"
        aria-label="Search filters"
      >
        {CHAT_FILTER_CHIPS.map((chip) => {
          const active = isChipActive(memory, chip);
          return (
            <button
              key={chip.id}
              type="button"
              data-testid={`filter-chip-${chip.id}`}
              data-active={active ? "true" : "false"}
              aria-pressed={active}
              onClick={() => toggleChip(chip)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted/50 text-foreground hover:bg-muted",
              )}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
      {eventsMode ? (
        <div
          className="mt-2 flex flex-wrap gap-1.5 border-t border-border/60 pt-2"
          role="group"
          aria-label="Event categories"
          data-testid="event-sub-chips"
        >
          {EVENT_SUB_CHIPS.map((chip) => {
            const active = isChipActive(memory, chip);
            return (
              <button
                key={chip.id}
                type="button"
                data-testid={`filter-chip-${chip.id}`}
                data-active={active ? "true" : "false"}
                aria-pressed={active}
                disabled={isLoading}
                onClick={() => onEventSubChip(chip)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted/40 text-foreground hover:bg-muted",
                )}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
