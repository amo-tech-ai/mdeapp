import { z } from "zod";

export const EventDraftStatus = z.enum([
  "draft",
  "pending_approval",
  "approved",
  "rejected",
  "published",
]);

export const EventTicketTierDraft = z.object({
  name: z.string().min(1).max(80),
  priceCop: z.number().int().nonnegative(),
  quantity: z.number().int().positive(),
});

export const EventDraftStateSchema = z.object({
  title: z.string().max(120).default(""),
  neighborhood: z.string().default(""),
  dateIso: z.string().optional(),
  venue: z.string().default(""),
  priceMinCop: z.number().int().nonnegative().default(0),
  capacity: z.number().int().nonnegative().default(0),
  description: z.string().default(""),
  coverPhotoPath: z.string().optional(),
  ticketTiers: z.array(EventTicketTierDraft).default([]),
  approvalRequestId: z.string().uuid().optional(),
  publishedEventId: z.string().uuid().optional(),
  publishedSlug: z.string().optional(),
  status: EventDraftStatus.default("draft"),
});

export type EventDraftState = z.infer<typeof EventDraftStateSchema>;
export type EventTicketTierDraft = z.infer<typeof EventTicketTierDraft>;

export const EMPTY_EVENT_DRAFT: EventDraftState = EventDraftStateSchema.parse({});

export function mergeEventDraft(
  current: EventDraftState,
  patch: Partial<EventDraftState>,
): EventDraftState {
  return EventDraftStateSchema.parse({ ...current, ...patch });
}

export function activeHostWizardStep(
  draft: EventDraftState,
): "basics" | "venue" | "tickets" | "preview" {
  if (
    draft.status === "pending_approval" ||
    draft.status === "published" ||
    draft.status === "approved"
  ) {
    return "preview";
  }
  const hasBasics = draft.title.trim().length > 0;
  const hasVenue = draft.venue.trim().length > 0 && draft.capacity > 0;
  const hasTickets =
    draft.ticketTiers.length > 0 || draft.priceMinCop > 0;

  if (hasBasics && hasVenue && hasTickets) return "preview";
  if (hasBasics && hasVenue) return "tickets";
  if (hasBasics) return "venue";
  return "basics";
}

export function isDraftReadyForPublish(draft: EventDraftState): boolean {
  return (
    draft.title.trim().length > 0 &&
    draft.neighborhood.trim().length > 0 &&
    Boolean(draft.dateIso) &&
    draft.venue.trim().length > 0 &&
    draft.capacity > 0 &&
    (draft.ticketTiers.length > 0 || draft.priceMinCop > 0)
  );
}
