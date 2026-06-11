/**
 * INT-001 — shared intent + slot contract for turn-1 routing.
 * Intent labels: classifyRouterIntent() in router-intent.ts (SAN-868 single source).
 */
import { z } from "zod";
import { scoreRentalQuery } from "@/lib/rental-query-parser";
import {
  classifyRouterIntent,
  routerIntentSchema,
  type RouterIntent,
} from "@/lib/router-intent";
import { looksLikeCafeSearch } from "@/lib/restaurant-query-classifier";

export const intentSchema = routerIntentSchema;

export const routingActionSchema = z.enum(["search_now", "clarify", "agent"]);

export const dateRangeSlotSchema = z
  .object({
    start: z.string().optional(),
    end: z.string().optional(),
    label: z.string().optional(),
  })
  .optional();

export const budgetSlotSchema = z
  .object({
    amount: z.number().positive().optional(),
    maxPricePerNight: z.number().positive().optional(),
    currency: z.string().optional(),
    budgetType: z.enum(["nightly", "monthly", "total_trip"]).optional(),
  })
  .optional();

export const sharedSlotsSchema = z.object({
  neighborhood: z.string().optional(),
  cityWide: z.boolean().optional(),
  bedrooms: z.number().int().min(0).optional(),
  budget: budgetSlotSchema,
  dateRange: dateRangeSlotSchema,
  vibes: z.array(z.string()).optional(),
  needs: z.array(z.string()).optional(),
  queryText: z.string().optional(),
  timeOfDay: z.enum(["lunch", "dinner", "brunch", "late-night"]).optional(),
  groupSize: z.number().int().min(1).optional(),
  occasion: z.enum(["date-night", "business", "family", "friends"]).optional(),
});

export const intentSlotExtractionSchema = z.object({
  intent: intentSchema,
  confidence: z.number().min(0).max(1),
  action: routingActionSchema,
  reason: z.string(),
  slots: sharedSlotsSchema,
});

export type Intent = z.infer<typeof intentSchema>;
export type RoutingAction = z.infer<typeof routingActionSchema>;
export type SharedSlots = z.infer<typeof sharedSlotsSchema>;
export type IntentSlotExtraction = z.infer<typeof intentSlotExtractionSchema>;

export const CONFIDENCE_FAST_PATH = 0.85;
export const CONFIDENCE_CLARIFY_MIN = 0.5;

export function confidenceToAction(confidence: number): RoutingAction {
  if (confidence >= CONFIDENCE_FAST_PATH) return "search_now";
  if (confidence >= CONFIDENCE_CLARIFY_MIN) return "clarify";
  return "agent";
}

export function canDeterministicSearch(extraction: IntentSlotExtraction): boolean {
  if (extraction.confidence < CONFIDENCE_FAST_PATH) return false;
  if (extraction.action !== "search_now") return false;

  const { intent, slots } = extraction;

  if (intent === "rental_search") {
    const hasBudget =
      slots.budget?.maxPricePerNight != null || slots.budget?.amount != null;
    const hasLocation = Boolean(slots.neighborhood || slots.cityWide);
    const hasBedrooms = slots.bedrooms != null;
    return (hasBudget && hasLocation) || (hasBudget && hasBedrooms && hasLocation);
  }

  if (intent === "restaurant_discovery" || intent === "venue_booking") {
    return Boolean(slots.queryText?.trim() || slots.neighborhood);
  }

  if (intent === "event_discovery") {
    return Boolean(slots.neighborhood || slots.dateRange?.label || slots.vibes?.length);
  }

  return false;
}

const MEDELLIN_CITY_RE = /\bmedell[ií]n\b/i;

function parseDateRange(text: string): SharedSlots["dateRange"] {
  const june = text.match(/\bjune\s+(\d{1,2})\s*(?:to|-)\s*(\d{1,2})\b/i);
  if (june) {
    return {
      start: `2026-06-${june[1].padStart(2, "0")}`,
      end: `2026-06-${june[2].padStart(2, "0")}`,
      label: `June ${june[1]}–${june[2]}`,
    };
  }
  if (/\bthis weekend\b/i.test(text)) {
    return { label: "this weekend" };
  }
  if (/\btomorrow\b/i.test(text)) {
    return { label: "tomorrow" };
  }
  return undefined;
}

function extractSlotsForIntent(text: string, intent: RouterIntent): SharedSlots {
  const normalized = text.trim();

  if (intent === "rental_search") {
    const rental = scoreRentalQuery(normalized);
    const dateRange = parseDateRange(normalized);
    const cityWide = MEDELLIN_CITY_RE.test(normalized) && !rental.neighborhood;
    return {
      neighborhood: rental.neighborhood,
      cityWide: cityWide || undefined,
      bedrooms: rental.minBedrooms,
      budget:
        rental.maxPricePerNight != null
          ? {
              maxPricePerNight: rental.maxPricePerNight,
              budgetType: rental.budgetType,
              currency: "USD",
            }
          : undefined,
      dateRange,
    };
  }

  if (intent === "venue_booking") {
    const guestMatch = normalized.match(
      /\b(?:for\s+)?(\d+)\s+(?:people|guests)\b/i,
    );
    return {
      queryText: normalized,
      groupSize: guestMatch ? Number.parseInt(guestMatch[1], 10) : undefined,
      occasion: "friends",
    };
  }

  if (intent === "event_discovery") {
    let neighborhood: string | undefined;
    if (/provenza|poblado/i.test(normalized)) neighborhood = "Provenza";
    else if (/laureles/i.test(normalized)) neighborhood = "Laureles";
    const vibes = /\bsalsa\b/i.test(normalized) ? ["salsa"] : undefined;
    return { neighborhood, dateRange: parseDateRange(normalized), vibes };
  }

  if (intent === "restaurant_discovery") {
    let neighborhood: string | undefined;
    if (/provenza/i.test(normalized)) neighborhood = "Provenza";
    else if (/poblado/i.test(normalized)) neighborhood = "El Poblado";
    else if (/laureles/i.test(normalized)) neighborhood = "Laureles";

    if (looksLikeCafeSearch(normalized)) {
      const needs = /\bremote work|laptop|quiet\b/i.test(normalized)
        ? ["remote_work", "quiet"]
        : undefined;
      return { neighborhood, needs, queryText: normalized };
    }

    let timeOfDay: SharedSlots["timeOfDay"];
    if (/\blunch\b/i.test(normalized)) timeOfDay = "lunch";
    else if (/\bbrunch\b/i.test(normalized)) timeOfDay = "brunch";
    else if (/\blate.?night\b/i.test(normalized)) timeOfDay = "late-night";
    else if (/\bdinner\b/i.test(normalized)) timeOfDay = "dinner";

    const groupMatch =
      normalized.match(/\bfor\s+(\d+)\s+(?:people|persons|guests)\b/i) ||
      normalized.match(/\bparty\s+of\s+(\d+)\b/i);
    const groupSize = groupMatch ? Number.parseInt(groupMatch[1], 10) : undefined;

    let occasion: SharedSlots["occasion"];
    if (/\bdate.?night\b/i.test(normalized)) occasion = "date-night";
    else if (/\bbusiness\b/i.test(normalized)) occasion = "business";
    else if (/\bfamily\b/i.test(normalized)) occasion = "family";
    else if (/\bfriends\b/i.test(normalized)) occasion = "friends";

    return { neighborhood, queryText: normalized, timeOfDay, groupSize, occasion };
  }

  return {};
}

/** Deterministic extractor — intent from classifyRouterIntent(); slots from extractSlotsForIntent(). */
export function extractIntentSlotsHeuristic(text: string): IntentSlotExtraction {
  const classified = classifyRouterIntent(text);
  return {
    intent: classified.intent,
    confidence: classified.confidence,
    action: classified.action,
    reason: classified.reason,
    slots: extractSlotsForIntent(text, classified.intent),
  };
}
