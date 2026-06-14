"use client";

import { useCallback, useMemo, useState } from "react";
import {
  useAgent,
  useAgentContext,
  useFrontendTool,
  useHumanInTheLoop,
  UseAgentUpdate,
} from "@copilotkit/react-core/v2";
import { z } from "zod";
import { EventPublishApprovalPanel } from "@/components/host/event-publish-approval-panel";
import {
  applySetEventBasics,
  applySetPricing,
  applySetVenue,
  publishDecisionDraftPatch,
} from "@/lib/events/host-event-wizard-tool-handlers";
import type { ApprovalDecision } from "@/lib/events/approval-decision";
import {
  EMPTY_EVENT_DRAFT,
  EventDraftStateSchema,
  EventTicketTierDraft,
  mergeEventDraft,
  type EventDraftState,
} from "@/lib/types";

const setEventBasicsParams = z.object({
  title: z.string(),
  neighborhood: z.string(),
  dateIso: z.string().describe("ISO 8601 datetime"),
});

const setVenueParams = z.object({
  venue: z.string(),
  capacity: z.number(),
});

const setPricingParams = z.object({
  priceMinCop: z.number(),
  description: z.string().optional(),
  ticketTiers: z.array(EventTicketTierDraft).optional(),
});

const previewPublishParams = z.object({
  draft: EventDraftStateSchema,
});

type HostEventCopilotBridgeV2Props = {
  children: (ctx: {
    draft: EventDraftState;
    setDraft: (patch: Partial<EventDraftState>) => void;
  }) => React.ReactNode;
};

type HitlRenderProps = {
  args: Partial<{ draft: EventDraftState }>;
  status: "inProgress" | "executing" | "complete";
  respond?: (result: unknown) => Promise<void>;
};

function createPublishHitlRender(
  getDraft: () => EventDraftState,
  setDraft: (patch: Partial<EventDraftState>) => void,
) {
  return function HostEventPublishHitlRender({
    args,
    status,
    respond,
  }: HitlRenderProps) {
    const draftArg = (args.draft as EventDraftState | undefined) ?? getDraft();
    const panelStatus =
      status === "inProgress"
        ? "inProgress"
        : status === "executing"
          ? "executing"
          : "complete";

    return (
      <EventPublishApprovalPanel
        draft={draftArg}
        status={panelStatus}
        onPublished={({ eventId, slug, approvalRequestId }) => {
          setDraft({
            status: "published",
            publishedEventId: eventId,
            publishedSlug: slug,
            approvalRequestId,
          });
        }}
        respond={(decision: ApprovalDecision) => {
          const patch = publishDecisionDraftPatch(decision);
          if (patch) setDraft(patch);
          void respond?.(decision);
        }}
      />
    );
  };
}

/**
 * SAN-889 · CK-V2-003 — v2 bridge for hostEventAgent (flag on).
 * v1 host-event-copilot-bridge.tsx untouched for flag-off rollback.
 */
export function HostEventCopilotBridgeV2({ children }: HostEventCopilotBridgeV2Props) {
  const [draft, setDraftState] = useState<EventDraftState>(EMPTY_EVENT_DRAFT);

  const setDraft = useCallback((patch: Partial<EventDraftState>) => {
    setDraftState((prev) => mergeEventDraft(prev, patch));
  }, []);

  const { agent } = useAgent({
    agentId: "hostEventAgent",
    updates: [UseAgentUpdate.OnStateChanged],
  });

  const agentDraft = agent.state;
  const mergedDraft = useMemo(() => {
    if (!agentDraft || typeof agentDraft !== "object") return draft;
    return mergeEventDraft(draft, agentDraft as Partial<EventDraftState>);
  }, [draft, agentDraft]);

  useAgentContext({
    description: "Roberto's in-progress event draft for the host wizard",
    value: mergedDraft,
  });

  // SAN-905 · skip agent.setState on every draft edit — mid-stream pushes
  // caused extra CopilotKit turns and Gemini thought_signature replay errors.

  useFrontendTool(
    {
      name: "set_event_basics",
      description: "Set event title, neighborhood, and start datetime",
      parameters: setEventBasicsParams,
      handler: async (args) => {
        setDraftState((prev) => applySetEventBasics(prev, args));
      },
    },
    [],
  );

  useFrontendTool(
    {
      name: "set_venue",
      description: "Set venue name and capacity",
      parameters: setVenueParams,
      handler: async (args) => {
        setDraftState((prev) => applySetVenue(prev, args));
      },
    },
    [],
  );

  useFrontendTool(
    {
      name: "set_pricing",
      description:
        "Set minimum ticket price in COP cents, description, optional tiers",
      parameters: setPricingParams,
      handler: async (args) => {
        setDraftState((prev) => applySetPricing(prev, args));
      },
    },
    [],
  );

  const PublishHitlRender = useMemo(
    () => createPublishHitlRender(() => mergedDraft, setDraft),
    [mergedDraft, setDraft],
  );

  useHumanInTheLoop(
    {
      name: "preview_and_publish",
      description: "Show HITL publish approval panel when the draft is complete",
      parameters: previewPublishParams,
      render: PublishHitlRender,
    },
    [PublishHitlRender],
  );

  return <>{children({ draft: mergedDraft, setDraft })}</>;
}
