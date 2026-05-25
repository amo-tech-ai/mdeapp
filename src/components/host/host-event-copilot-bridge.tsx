"use client";

import { useCallback, useState } from "react";
import {
  useCoAgent,
  useCopilotAction,
  useCopilotReadable,
} from "@copilotkit/react-core";
import {
  EMPTY_EVENT_DRAFT,
  mergeEventDraft,
  type EventDraftState,
  type EventTicketTierDraft,
} from "@/lib/types";
import { EventPublishApprovalPanel } from "@/components/host/event-publish-approval-panel";

type HostEventCopilotBridgeProps = {
  children: (ctx: {
    draft: EventDraftState;
    setDraft: (patch: Partial<EventDraftState>) => void;
  }) => React.ReactNode;
};

/** F36 — shared co-agent state + frontend tools for hostEventAgent. */
export function HostEventCopilotBridge({ children }: HostEventCopilotBridgeProps) {
  const [draft, setDraftState] = useState<EventDraftState>(EMPTY_EVENT_DRAFT);

  // React state is source of truth — form works even before hostEventAgent connects.
  // CopilotKit docs: pass state + setState for external state management.
  useCoAgent<EventDraftState>({
    name: "hostEventAgent",
    state: draft,
    setState: (next) => {
      setDraftState((prev) => {
        if (typeof next === "function") {
          const updated = next(prev);
          return updated ? mergeEventDraft(prev, updated) : prev;
        }
        return mergeEventDraft(prev, next);
      });
    },
  });

  const setDraft = useCallback((patch: Partial<EventDraftState>) => {
    setDraftState((prev) => mergeEventDraft(prev, patch));
  }, []);

  useCopilotReadable(
    {
      description: "Roberto's in-progress event draft for the host wizard",
      value: draft,
    },
    [draft],
  );

  useCopilotAction({
    name: "set_event_basics",
    description: "Set event title, neighborhood, and start datetime",
    parameters: [
      { name: "title", type: "string", required: true },
      { name: "neighborhood", type: "string", required: true },
      { name: "dateIso", type: "string", required: true, description: "ISO 8601 datetime" },
    ],
    handler: async ({ title, neighborhood, dateIso }) => {
      setDraft({ title, neighborhood, dateIso });
    },
  });

  useCopilotAction({
    name: "set_venue",
    description: "Set venue name and capacity",
    parameters: [
      { name: "venue", type: "string", required: true },
      { name: "capacity", type: "number", required: true },
    ],
    handler: async ({ venue, capacity }) => {
      setDraft({ venue, capacity: Number(capacity) });
    },
  });

  useCopilotAction({
    name: "set_pricing",
    description: "Set minimum ticket price in COP cents, description, optional tiers",
    parameters: [
      { name: "priceMinCop", type: "number", required: true },
      { name: "description", type: "string", required: false },
      {
        name: "ticketTiers",
        type: "object[]",
        required: false,
        description: "Array of { name, priceCop, quantity }",
      },
    ],
    handler: async ({ priceMinCop, description, ticketTiers }) => {
      const tiers = Array.isArray(ticketTiers)
        ? (ticketTiers as EventTicketTierDraft[])
        : draft.ticketTiers;
      setDraft({
        priceMinCop: Number(priceMinCop),
        description: typeof description === "string" ? description : draft.description,
        ticketTiers: tiers,
      });
    },
  });

  useCopilotAction({
    name: "preview_and_publish",
    description: "Show HITL publish approval panel when the draft is complete",
    available: "remote",
    parameters: [
      {
        name: "draft",
        type: "object",
        required: true,
        description: "Complete EventDraftState snapshot",
      },
    ],
    renderAndWaitForResponse: ({ args, respond, status }) => (
      <EventPublishApprovalPanel
        draft={(args.draft as EventDraftState) ?? draft}
        status={status}
        onPublished={({ eventId, slug, approvalRequestId }) => {
          setDraft({
            status: "published",
            publishedEventId: eventId,
            publishedSlug: slug,
            approvalRequestId,
          });
        }}
        respond={(decision) => {
          if (decision === "approved") {
            setDraft({ status: "pending_approval" });
          } else if (decision === "rejected") {
            setDraft({ status: "rejected" });
          } else {
            setDraft({ status: "draft" });
          }
          respond?.(decision);
        }}
      />
    ),
  });

  return <>{children({ draft, setDraft })}</>;
}
