// Shared state shape for mdeai agents. Mirrors the Zod schema in
// src/mastra/agents/index.ts (MdeState). Keep these two in sync.
// W3 replaces this with EventDraftState for Roberto's host event flow.
export type MdeState = {
  lastQuery: string;
  hint: string;
};

/** Mirrors conciergeWorkingMemorySchema — keep in sync with concierge.ts */
export type ConciergeWorkingMemory = {
  lastIntent?: import("@/lib/router-intent").RouterIntent;
  lastRentalQuery?: {
    neighborhood?: string;
    minBedrooms?: number;
    maxPricePerNight?: number;
    budgetType?: "nightly" | "monthly" | "total_trip";
    genericAskPending?: boolean;
    checkIn?: string;
    checkOut?: string;
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
  lastRestaurantQuery?: {
    neighborhood?: string;
    cuisine?: string;
    vibe?: string;
    priceTier?: "$" | "$$" | "$$$" | "$$$$";
    genericAskPending?: boolean;
  };
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
