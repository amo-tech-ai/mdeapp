// Shared state shape for mdeai agents. Mirrors the Zod schema in
// src/mastra/agents/index.ts (MdeState). Keep these two in sync.
// W3 replaces this with EventDraftState for Roberto's host event flow.
export type MdeState = {
  lastQuery: string;
  hint: string;
};

/** Mirrors conciergeWorkingMemorySchema — keep in sync with concierge.ts */
export type ConciergeWorkingMemory = {
  lastIntent?: "rental_search" | "event_discovery" | "chitchat" | "unknown";
  lastRentalQuery?: {
    neighborhood?: string;
    minBedrooms?: number;
    maxPricePerNight?: number;
    budgetType?: "nightly" | "monthly" | "total_trip";
    genericAskPending?: boolean;
  };
  lastRentalResults?: Array<{
    id: string;
    title: string;
    neighborhood: string;
    nightly_price: number;
  }>;
  selectedListingId?: string;
  lastEventQuery?: {
    category?: "music" | "food" | "culture" | "sport" | "nightlife";
    neighborhood?: string;
    dateWindow?: "tonight" | "this_weekend" | "this_week" | "next_week" | "any";
    genericAskPending?: boolean;
  };
  lastEventResults?: Array<{
    id: string;
    title: string;
    venue?: string;
    date?: string;
  }>;
  selectedEventId?: string;
  mapUi?: import("@/platform/contracts/map-ui-state").MapUiState;
};

export {
  EventDraftStateSchema,
  EventDraftStatus,
  EventTicketTierDraft,
  EMPTY_EVENT_DRAFT,
  mergeEventDraft,
  activeHostWizardStep,
  isDraftReadyForPublish,
  type EventDraftState,
} from "./types/event-draft";
