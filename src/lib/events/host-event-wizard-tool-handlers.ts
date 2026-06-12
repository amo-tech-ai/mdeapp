import type { ApprovalDecision } from "@/lib/events/approval-decision";
import {
  mergeEventDraft,
  type EventDraftState,
  type EventTicketTierDraft,
} from "@/lib/types";

export type SetEventBasicsArgs = {
  title: string;
  neighborhood: string;
  dateIso: string;
};

export type SetVenueArgs = {
  venue: string;
  capacity: number;
};

export type SetPricingArgs = {
  priceMinCop: number;
  description?: string;
  ticketTiers?: EventTicketTierDraft[];
};

/** Pure patch helpers — shared by v1 bridge semantics and v2 useFrontendTool handlers. */
export function applySetEventBasics(
  current: EventDraftState,
  args: SetEventBasicsArgs,
): EventDraftState {
  return mergeEventDraft(current, {
    title: args.title,
    neighborhood: args.neighborhood,
    dateIso: args.dateIso,
  });
}

export function applySetVenue(
  current: EventDraftState,
  args: SetVenueArgs,
): EventDraftState {
  return mergeEventDraft(current, {
    venue: args.venue,
    capacity: Number(args.capacity),
  });
}

export function applySetPricing(
  current: EventDraftState,
  args: SetPricingArgs,
): EventDraftState {
  const tiers = Array.isArray(args.ticketTiers)
    ? args.ticketTiers
    : current.ticketTiers;
  return mergeEventDraft(current, {
    priceMinCop: Number(args.priceMinCop),
    description:
      typeof args.description === "string"
        ? args.description
        : current.description,
    ticketTiers: tiers,
  });
}

/**
 * HITL decision → draft patch. Approved path returns null — onPublished owns published state.
 * Mirrors v1 host-event-copilot-bridge race guard.
 */
export function publishDecisionDraftPatch(
  decision: ApprovalDecision,
): Partial<EventDraftState> | null {
  if (decision === "rejected") return { status: "rejected" };
  if (decision !== "approved") return { status: "draft" };
  return null;
}
