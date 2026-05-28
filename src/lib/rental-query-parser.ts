/**
 * Pure rental query classifier — used by rental fast-path (mirrors concierge gate).
 */
import type { ConciergeWorkingMemory } from "@/lib/types";

export type RentalSearchApiParams = {
  neighborhood?: string;
  minBedrooms?: number;
  maxPricePerNight?: number;
  limit?: number;
};

export type RentalQuerySignals = {
  hasBudget: boolean;
  hasBedrooms: boolean;
  hasVibeOrUseCase: boolean;
  hasNeighborhood: boolean;
  confidence: number;
  neighborhood?: string;
  minBedrooms?: number;
  maxPricePerNight?: number;
  budgetType?: "nightly" | "monthly" | "total_trip";
};

const RENTAL_INTENT_RE =
  /\b(rental|rentals|apartment|apartments|airbnb|stay|stays|lodging|for rent|list.*rent)\b/i;

const EVENT_INTENT_RE =
  /\b(events?|concert|concerts|salsa|nightlife|festival|ticket|tickets|what'?s on)\b/i;

const NEIGHBORHOOD_PATTERNS: Array<{ neighborhood: string; re: RegExp }> = [
  { neighborhood: "Laureles", re: /\blaureles\b/i },
  { neighborhood: "El Poblado", re: /\b(el poblad[oa]|poblado|provenza)\b/i },
  { neighborhood: "Envigado", re: /\benvigado\b/i },
  { neighborhood: "Belén", re: /\bbel[eé]n\b/i },
  { neighborhood: "Estadio", re: /\bestadio\b/i },
];

const BEDROOM_RE =
  /\b(\d+)\s?(?:br|bed(?:room)?s?)\b|\b(studio|one bedroom|1 bedroom|2 bedroom|3 bedroom)\b/i;

const VIBE_RE =
  /\b(remote work|remote-work|nightlife|family|quiet|long[- ]term|monthly|workspace|pet[- ]friendly)\b/i;

const MONTHLY_RE = /\b(month|monthly|per month|\/month|mes)\b/i;
const TRIP_RE = /\b(for the trip|total|10 days|two weeks|\d+\s+days)\b/i;

function parseBudget(text: string): {
  maxPricePerNight?: number;
  budgetType?: "nightly" | "monthly" | "total_trip";
} {
  const underMatch = text.match(
    /(?:under|below|max|up to)\s*\$?\s*([\d,.]+)\s*(?:\/\s*night|per night|night)?/i,
  );
  const plainMatch = text.match(/\$\s*([\d,.]+)/);
  const amountStr = underMatch?.[1] ?? plainMatch?.[1];
  if (!amountStr) {
    if (/\b(cheap|budget|affordable)\b/i.test(text)) {
      return { maxPricePerNight: 60, budgetType: "nightly" };
    }
    return {};
  }

  const amount = Number(amountStr.replace(/,/g, ""));
  if (!Number.isFinite(amount) || amount <= 0) return {};

  if (MONTHLY_RE.test(text) && amount >= 400) {
    return { maxPricePerNight: Math.round(amount / 30), budgetType: "monthly" };
  }
  if (TRIP_RE.test(text) && amount >= 300) {
    const daysMatch = text.match(/(\d+)\s+days?/i);
    const days = daysMatch ? Number(daysMatch[1]) : 30;
    return {
      maxPricePerNight: Math.round(amount / Math.max(days, 1)),
      budgetType: "total_trip",
    };
  }
  if (amount >= 400 && !/\/\s*night|per night/i.test(text)) {
    return { maxPricePerNight: Math.round(amount / 30), budgetType: "monthly" };
  }
  return { maxPricePerNight: amount, budgetType: "nightly" };
}

function parseBedrooms(text: string): number | undefined {
  const m = text.match(BEDROOM_RE);
  if (!m) return undefined;
  if (/studio/i.test(m[0])) return 0;
  const n = Number(m[1]);
  if (Number.isFinite(n)) return n;
  if (/one bedroom|1 bedroom/i.test(m[0])) return 1;
  if (/2 bedroom/i.test(m[0])) return 2;
  if (/3 bedroom/i.test(m[0])) return 3;
  return undefined;
}

/** User message is clearly about rentals, not events or cafés. */
export function looksLikeRentalSearch(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (EVENT_INTENT_RE.test(t) && !RENTAL_INTENT_RE.test(t)) return false;
  return RENTAL_INTENT_RE.test(t) || BEDROOM_RE.test(t) || /\/night|per night/i.test(t);
}

/** Budget, bedrooms, or neighborhood in text — not generic chit-chat. */
export function hasRentalSignals(text: string): boolean {
  if (looksLikeRentalSearch(text)) return true;
  const s = scoreRentalQuery(text);
  return s.hasBudget || s.hasBedrooms || s.hasNeighborhood;
}

export function looksLikeNonRentalSearch(text: string): boolean {
  const t = text.trim();
  if (looksLikeRentalSearch(t)) return false;
  return EVENT_INTENT_RE.test(t);
}

export function scoreRentalQuery(text: string): RentalQuerySignals {
  const normalized = text.trim();
  const { maxPricePerNight, budgetType } = parseBudget(normalized);
  const minBedrooms = parseBedrooms(normalized);

  let neighborhood: string | undefined;
  for (const { neighborhood: n, re } of NEIGHBORHOOD_PATTERNS) {
    if (re.test(normalized)) {
      neighborhood = n;
      break;
    }
  }

  const hasBudget =
    maxPricePerNight != null ||
    /\b(cheap|budget|luxury|affordable|under\s+\$)\b/i.test(normalized);
  const hasBedrooms = minBedrooms != null;
  const hasVibeOrUseCase = VIBE_RE.test(normalized);
  const hasNeighborhood = neighborhood != null;

  let confidence = 0.2;
  if (hasBudget && hasBedrooms) confidence = 0.9;
  else if (hasBudget && hasNeighborhood) confidence = 0.75;
  else if (hasBedrooms && hasNeighborhood) confidence = 0.7;
  else if (hasVibeOrUseCase && hasNeighborhood) confidence = 0.65;
  else if (hasBudget && hasVibeOrUseCase) confidence = 0.65;
  else if (hasBedrooms) confidence = 0.55;
  else if (hasBudget) confidence = 0.5;
  else if (hasNeighborhood && RENTAL_INTENT_RE.test(normalized)) confidence = 0.35;
  else if (hasNeighborhood) confidence = 0.35;

  return {
    hasBudget,
    hasBedrooms,
    hasVibeOrUseCase,
    hasNeighborhood,
    confidence,
    neighborhood,
    minBedrooms,
    maxPricePerNight,
    budgetType,
  };
}

/** Generic = rental intent but no budget, bedrooms, or vibe. */
export function isGenericRentalQuery(text: string): boolean {
  if (!looksLikeRentalSearch(text)) return false;
  const s = scoreRentalQuery(text);
  if (s.confidence >= 0.6) return false;
  return s.confidence < 0.6;
}

export function shouldInstantRentalClarify(
  text: string,
  memory: ConciergeWorkingMemory,
): boolean {
  if (!looksLikeRentalSearch(text)) return false;
  if (memory.lastRentalQuery && !memory.lastRentalQuery.genericAskPending) {
    return false;
  }
  if (memory.lastRentalQuery?.genericAskPending === true) return false;
  return isGenericRentalQuery(text);
}

const FAST_PATH_LIMIT = 8;

export function buildRentalSearchParams(
  text: string,
  memory: ConciergeWorkingMemory,
): RentalSearchApiParams | null {
  if (looksLikeNonRentalSearch(text)) return null;

  const s = scoreRentalQuery(text);
  const q = memory.lastRentalQuery;

  if (q?.genericAskPending) {
    const merged: RentalSearchApiParams = {
      neighborhood: s.neighborhood ?? q.neighborhood,
      minBedrooms: s.minBedrooms ?? q.minBedrooms,
      maxPricePerNight: s.maxPricePerNight ?? q.maxPricePerNight,
      limit: FAST_PATH_LIMIT,
    };
    if (
      merged.neighborhood ||
      merged.minBedrooms != null ||
      merged.maxPricePerNight != null
    ) {
      return merged;
    }
    if (hasRentalSignals(text)) {
      return { limit: FAST_PATH_LIMIT };
    }
  }

  if (memory.lastRentalQuery && !memory.lastRentalQuery.genericAskPending) {
    return {
      neighborhood: s.neighborhood ?? q?.neighborhood,
      minBedrooms: s.minBedrooms ?? q?.minBedrooms,
      maxPricePerNight: s.maxPricePerNight ?? q?.maxPricePerNight,
      limit: FAST_PATH_LIMIT,
    };
  }

  if (!looksLikeRentalSearch(text)) return null;

  if (s.hasBudget && s.hasNeighborhood) {
    return {
      neighborhood: s.neighborhood,
      minBedrooms: s.minBedrooms,
      maxPricePerNight: s.maxPricePerNight,
      limit: FAST_PATH_LIMIT,
    };
  }

  if (s.confidence >= 0.6) {
    return {
      neighborhood: s.neighborhood,
      minBedrooms: s.minBedrooms,
      maxPricePerNight: s.maxPricePerNight,
      limit: FAST_PATH_LIMIT,
    };
  }

  if (
    q?.neighborhood ||
    q?.minBedrooms != null ||
    q?.maxPricePerNight != null
  ) {
    return {
      neighborhood: q.neighborhood,
      minBedrooms: q.minBedrooms,
      maxPricePerNight: q.maxPricePerNight,
      limit: FAST_PATH_LIMIT,
    };
  }

  return null;
}

export function canFastPathRentalSearch(
  text: string,
  memory: ConciergeWorkingMemory,
): boolean {
  if (looksLikeNonRentalSearch(text)) return false;
  if (shouldInstantRentalClarify(text, memory)) return false;
  if (memory.lastRentalQuery?.genericAskPending) {
    return buildRentalSearchParams(text, memory) != null;
  }
  if (!looksLikeRentalSearch(text)) return false;
  return buildRentalSearchParams(text, memory) != null;
}
