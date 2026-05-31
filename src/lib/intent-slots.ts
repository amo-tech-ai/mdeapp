/**
 * INT-001 — shared intent + slot contract for turn-1 routing.
 * Confidence bands: ≥0.85 fast-path · 0.50–0.84 Gemini clarify · <0.50 full agent.
 */
import { z } from "zod";
import {
  looksLikeRentalSearch,
  scoreRentalQuery,
  looksLikeNonRentalSearch,
} from "@/lib/rental-query-parser";

export const intentSchema = z.enum([
  "rental_search",
  "event_discovery",
  "cafe_search",
  "restaurant_search",
  "chitchat",
  "unknown",
]);

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
  // Restaurant-specific slots (INT-001 extension)
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

  if (intent === "restaurant_search" || intent === "cafe_search") {
    return Boolean(slots.queryText?.trim() || slots.neighborhood);
  }

  if (intent === "event_discovery") {
    return Boolean(slots.neighborhood || slots.dateRange?.label || slots.vibes?.length);
  }

  return false;
}

const CAFE_RE =
  /\b(caf[eé]|coffee|quiet spot|remote work|laptop|cowork|wifi)\b/i;
const RESTAURANT_RE =
  /\b(restaurant|dinner|lunch|rooftop|brunch|food|cuisine|eat)\b/i;
const EVENT_RE =
  /\b(events?|concert|salsa|nightlife|festival|ticket|what'?s on)\b/i;
const MEDELLIN_CITY_RE = /\bmedell[ií]n\b/i;

function parseDateRange(text: string): SharedSlots["dateRange"] {
  const june = text.match(
    /\bjune\s+(\d{1,2})\s*(?:to|-)\s*(\d{1,2})\b/i,
  );
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

/** Deterministic heuristic extractor — used in tests and as fast-path fallback (no live Gemini). */
export function extractIntentSlotsHeuristic(text: string): IntentSlotExtraction {
  const normalized = text.trim();
  if (!normalized) {
    return {
      intent: "unknown",
      confidence: 0,
      action: "agent",
      reason: "empty message",
      slots: {},
    };
  }

  if (looksLikeRentalSearch(normalized) && !looksLikeNonRentalSearch(normalized)) {
    const rental = scoreRentalQuery(normalized);
    const dateRange = parseDateRange(normalized);
    const cityWide = MEDELLIN_CITY_RE.test(normalized) && !rental.neighborhood;
    let confidence = rental.confidence;
    if (cityWide && rental.hasBudget && dateRange) {
      confidence = Math.max(confidence, 0.75);
    }
    const action = confidenceToAction(confidence);
    return {
      intent: "rental_search",
      confidence,
      action,
      reason: "rental signals from parser",
      slots: {
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
      },
    };
  }

  if (EVENT_RE.test(normalized) && !CAFE_RE.test(normalized)) {
    let neighborhood: string | undefined;
    if (/provenza|poblado/i.test(normalized)) neighborhood = "Provenza";
    else if (/laureles/i.test(normalized)) neighborhood = "Laureles";
    const dateRange = parseDateRange(normalized);
    const vibes = /\bsalsa\b/i.test(normalized) ? ["salsa"] : undefined;
    const confidence =
      neighborhood && dateRange ? 0.8 : neighborhood || dateRange ? 0.65 : 0.45;
    return {
      intent: "event_discovery",
      confidence,
      action: confidenceToAction(confidence),
      reason: "event keywords",
      slots: { neighborhood, dateRange, vibes },
    };
  }

  if (CAFE_RE.test(normalized)) {
    let neighborhood: string | undefined;
    if (/laureles/i.test(normalized)) neighborhood = "Laureles";
    else if (/poblado|provenza/i.test(normalized)) neighborhood = "El Poblado";
    const needs = /\bremote work|laptop|quiet\b/i.test(normalized)
      ? ["remote_work", "quiet"]
      : undefined;
    const confidence = neighborhood && needs ? 0.88 : neighborhood ? 0.72 : 0.55;
    return {
      intent: "cafe_search",
      confidence,
      action: confidenceToAction(confidence),
      reason: "café / remote-work keywords",
      slots: { neighborhood, needs, queryText: normalized },
    };
  }

  if (RESTAURANT_RE.test(normalized)) {
    let neighborhood: string | undefined;
    if (/provenza/i.test(normalized)) neighborhood = "Provenza";
    else if (/poblado/i.test(normalized)) neighborhood = "El Poblado";

    let timeOfDay: "lunch" | "dinner" | "brunch" | "late-night" | undefined;
    if (/\blunch\b/i.test(normalized)) timeOfDay = "lunch";
    else if (/\bbrunch\b/i.test(normalized)) timeOfDay = "brunch";
    else if (/\blate.?night\b/i.test(normalized)) timeOfDay = "late-night";
    else if (/\bdinner\b/i.test(normalized)) timeOfDay = "dinner";

    const groupMatch =
      normalized.match(/\bfor\s+(\d+)\s+(?:people|persons|guests)\b/i) ||
      normalized.match(/\bparty\s+of\s+(\d+)\b/i);
    const groupSize = groupMatch ? parseInt(groupMatch[1], 10) : undefined;

    let occasion: "date-night" | "business" | "family" | "friends" | undefined;
    if (/\bdate.?night\b/i.test(normalized)) occasion = "date-night";
    else if (/\bbusiness\b/i.test(normalized)) occasion = "business";
    else if (/\bfamily\b/i.test(normalized)) occasion = "family";
    else if (/\bfriends\b/i.test(normalized)) occasion = "friends";

    const confidence = neighborhood ? 0.82 : 0.6;
    return {
      intent: "restaurant_search",
      confidence,
      action: confidenceToAction(confidence),
      reason: "restaurant / food keywords",
      slots: { neighborhood, queryText: normalized, timeOfDay, groupSize, occasion },
    };
  }

  return {
    intent: "chitchat",
    confidence: 0.3,
    action: "agent",
    reason: "no vertical signals",
    slots: {},
  };
}
