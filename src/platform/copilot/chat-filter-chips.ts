import type { ConciergeWorkingMemory } from "@/lib/types";
import type { EventDateWindow } from "@/lib/event-query-classifier";

export type ChipGroup = "neighborhood" | "bedrooms" | "price" | "intent" | "event";

export type EventCategory = NonNullable<
  ConciergeWorkingMemory["lastEventQuery"]
>["category"];

export type FilterChipDef = {
  id: string;
  label: string;
  group: ChipGroup;
  neighborhood?: string;
  minBedrooms?: number;
  maxPricePerNight?: number;
  intent?: ConciergeWorkingMemory["lastIntent"];
  eventCategory?: EventCategory;
  eventDateWindow?: EventDateWindow;
  eventShowAll?: boolean;
};

export const CHAT_FILTER_CHIPS: readonly FilterChipDef[] = [
  { id: "laureles", label: "Laureles", group: "neighborhood", neighborhood: "Laureles", intent: "rental_search" },
  { id: "poblado", label: "Poblado", group: "neighborhood", neighborhood: "Poblado", intent: "rental_search" },
  { id: "2br", label: "2 BR", group: "bedrooms", minBedrooms: 2, intent: "rental_search" },
  { id: "under-80", label: "Under $80/night", group: "price", maxPricePerNight: 80, intent: "rental_search" },
  { id: "events", label: "Events", group: "intent", intent: "event_discovery" },
  { id: "food", label: "Food & cafés", group: "intent", intent: "chitchat" },
] as const;

/** F39 — event sub-chips shown when Events intent is active. */
export const EVENT_SUB_CHIPS: readonly FilterChipDef[] = [
  { id: "ev-music", label: "Music", group: "event", eventCategory: "music" },
  { id: "ev-nightlife", label: "Nightlife", group: "event", eventCategory: "nightlife" },
  { id: "ev-sports", label: "Sports", group: "event", eventCategory: "sport" },
  { id: "ev-food", label: "Food", group: "event", eventCategory: "food" },
  { id: "ev-culture", label: "Culture", group: "event", eventCategory: "culture" },
  { id: "ev-weekend", label: "This Weekend", group: "event", eventDateWindow: "this_weekend" },
  { id: "ev-tonight", label: "Tonight", group: "event", eventDateWindow: "tonight" },
  { id: "ev-all", label: "Show all", group: "event", eventShowAll: true },
] as const;

export function isChipActive(
  memory: ConciergeWorkingMemory | undefined,
  chip: FilterChipDef,
): boolean {
  if (!memory) return false;
  if (chip.group === "intent") return memory.lastIntent === chip.intent;
  if (chip.group === "event") {
    const q = memory.lastEventQuery;
    if (chip.eventShowAll) return q?.dateWindow === "any" && q?.category == null;
    if (chip.eventCategory) return q?.category === chip.eventCategory;
    if (chip.eventDateWindow) return q?.dateWindow === chip.eventDateWindow;
    return false;
  }
  const q = memory.lastRentalQuery;
  if (chip.group === "neighborhood") return q?.neighborhood === chip.neighborhood;
  if (chip.group === "bedrooms") return q?.minBedrooms === chip.minBedrooms;
  if (chip.group === "price") return q?.maxPricePerNight === chip.maxPricePerNight;
  return false;
}

export function applyChipToggle(
  memory: ConciergeWorkingMemory | undefined,
  chip: FilterChipDef,
  nextActive: boolean,
): ConciergeWorkingMemory {
  const base: ConciergeWorkingMemory = { ...(memory ?? {}) };

  if (chip.group === "event") {
    const q = { ...(base.lastEventQuery ?? {}) };
    if (nextActive) {
      if (chip.eventShowAll) {
        q.dateWindow = "any";
        q.category = undefined;
      } else if (chip.eventCategory) {
        q.category = chip.eventCategory;
      } else if (chip.eventDateWindow) {
        q.dateWindow = chip.eventDateWindow;
      }
      q.genericAskPending = false;
    } else if (chip.eventShowAll) {
      if (q.dateWindow === "any" && q.category == null) q.dateWindow = undefined;
    } else if (chip.eventCategory && q.category === chip.eventCategory) {
      q.category = undefined;
    } else if (chip.eventDateWindow && q.dateWindow === chip.eventDateWindow) {
      q.dateWindow = undefined;
    }
    return {
      ...base,
      lastIntent: "event_discovery",
      lastEventQuery: Object.keys(q).length > 0 ? q : undefined,
    };
  }

  if (chip.group === "intent") {
    return {
      ...base,
      lastIntent: nextActive ? chip.intent : base.lastIntent === chip.intent ? undefined : base.lastIntent,
    };
  }

  const q = { ...(base.lastRentalQuery ?? {}) };
  if (chip.group === "neighborhood") {
    q.neighborhood = nextActive ? chip.neighborhood : q.neighborhood === chip.neighborhood ? undefined : q.neighborhood;
  }
  if (chip.group === "bedrooms") {
    q.minBedrooms = nextActive ? chip.minBedrooms : q.minBedrooms === chip.minBedrooms ? undefined : q.minBedrooms;
  }
  if (chip.group === "price") {
    q.maxPricePerNight = nextActive ? chip.maxPricePerNight : q.maxPricePerNight === chip.maxPricePerNight ? undefined : q.maxPricePerNight;
  }

  return {
    ...base,
    lastIntent: "rental_search",
    lastRentalQuery: Object.keys(q).length > 0 ? q : undefined,
  };
}
