/**
 * Pure rental query classifier — used by rental fast-path (mirrors concierge gate).
 */
import type { ConciergeWorkingMemory } from "@/lib/types";

export type RentalSearchApiParams = {
  neighborhood?: string;
  minBedrooms?: number;
  maxPricePerNight?: number;
  limit?: number;
  /** Natural-language query for hybrid_search_listings + rental_signals. */
  queryText?: string;
  /** ISO date YYYY-MM-DD — start of stay window */
  checkIn?: string;
  /** ISO date YYYY-MM-DD — end of stay window */
  checkOut?: string;
  stayType?: "nightly" | "monthly" | "total_trip";
};

function attachQueryText(
  params: RentalSearchApiParams,
  text: string,
  s: RentalQuerySignals,
): RentalSearchApiParams {
  const dated: RentalSearchApiParams = {
    ...params,
    ...(s.checkIn && { checkIn: s.checkIn }),
    ...(s.checkOut && { checkOut: s.checkOut }),
    ...(s.budgetType && { stayType: s.budgetType }),
  };
  if (s.confidence >= 0.6 || s.hasNomad || s.hasCafeOrGym || s.hasVibeOrUseCase) {
    return { ...dated, queryText: text.trim() };
  }
  return dated;
}

export type RentalQuerySignals = {
  hasBudget: boolean;
  hasBedrooms: boolean;
  hasVibeOrUseCase: boolean;
  hasNeighborhood: boolean;
  hasDateRange: boolean;
  hasNomad: boolean;
  hasCafeOrGym: boolean;
  cityWide: boolean;
  confidence: number;
  neighborhood?: string;
  minBedrooms?: number;
  maxPricePerNight?: number;
  budgetType?: "nightly" | "monthly" | "total_trip";
  dateRangeLabel?: string;
  checkIn?: string;
  checkOut?: string;
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
  /\b(remote work|remote-work|digital nomad|nomad|nightlife|family|quiet|long[- ]term|monthly|workspace|pet[- ]friendly|wifi|cowork)\b/i;

const CAFE_GYM_RE = /\b(caf[eé]s?|coffee|gym|gyms|coworking)\b/i;

const NOMAD_RE = /\b(digital nomad|nomad|remote work|remote-work|work from|workspace|wifi|cowork)\b/i;

const MONTHLY_RE = /\b(month|monthly|per month|\/month|mes)\b/i;
const TRIP_RE = /\b(for the trip|total|10 days|two weeks|\d+\s+days)\b/i;
const MEDELLIN_CITY_RE = /\bmedell[ií]n\b/i;

const MONTH_IDX: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

const DATE_RANGE_RE =
  /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{1,2})\s*(?:to|-)\s*(\d{1,2})\b/i;

function parseDateRange(text: string): { label?: string; checkIn?: string; checkOut?: string } {
  const m = text.match(DATE_RANGE_RE);
  if (m) {
    const monthIdx = MONTH_IDX[m[1].toLowerCase().slice(0, 3)] ?? -1;
    if (monthIdx >= 0) {
      const startDay = Number(m[2]);
      const endDay = Number(m[3]);
      const ref = new Date();
      let year = ref.getFullYear();
      if (new Date(year, monthIdx, endDay) < ref) year++;
      const pad = (n: number) => String(n).padStart(2, "0");
      const mon = pad(monthIdx + 1);
      const monthLabel = m[1][0].toUpperCase() + m[1].slice(1).toLowerCase();
      return {
        label: `${monthLabel} ${startDay}–${endDay}`,
        checkIn: `${year}-${mon}-${pad(startDay)}`,
        checkOut: `${year}-${mon}-${pad(endDay)}`,
      };
    }
  }
  if (/\bthis weekend\b/i.test(text)) {
    const ref = new Date();
    const daysToSat = (6 - ref.getDay() + 7) % 7 || 7;
    const sat = new Date(ref);
    sat.setDate(ref.getDate() + daysToSat);
    const sun = new Date(sat);
    sun.setDate(sat.getDate() + 1);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    return { label: "this weekend", checkIn: fmt(sat), checkOut: fmt(sun) };
  }
  if (/\btomorrow\b/i.test(text)) {
    const tom = new Date();
    tom.setDate(tom.getDate() + 1);
    const d = tom.toISOString().slice(0, 10);
    return { label: "tomorrow", checkIn: d, checkOut: d };
  }
  return {};
}

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
  if (amount >= 400 && !/\bnight(?:ly)?\b/i.test(text)) {
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
  const hasNomad = NOMAD_RE.test(normalized);
  const hasCafeOrGym = CAFE_GYM_RE.test(normalized);
  const hasQuiet = /\bquiet\b/i.test(normalized);
  const hasNeighborhood = neighborhood != null;
  const { label: dateRangeLabel, checkIn, checkOut } = parseDateRange(normalized);
  const hasDateRange = dateRangeLabel != null;
  const cityWide = MEDELLIN_CITY_RE.test(normalized) && !hasNeighborhood;

  let confidence = 0.2;
  if (hasBudget && hasBedrooms) confidence = 0.9;
  else if (hasBudget && hasNeighborhood && budgetType === "monthly") confidence = 0.76;
  else if (hasBudget && hasNeighborhood) confidence = 0.75;
  else if (hasNomad && hasNeighborhood) confidence = 0.72;
  else if (hasBedrooms && hasNeighborhood) confidence = 0.7;
  else if (hasVibeOrUseCase && hasNeighborhood) confidence = 0.65;
  else if (hasQuiet && hasCafeOrGym && hasNeighborhood) confidence = 0.62;
  else if (hasBudget && hasVibeOrUseCase) confidence = 0.65;
  else if (hasBedrooms) confidence = 0.55;
  else if (hasBudget && hasDateRange && cityWide) confidence = 0.78;
  else if (hasBudget && hasDateRange) confidence = 0.72;
  else if (hasBudget) confidence = 0.5;
  // SAN-823: neighborhood + rental noun → fast-path (was 0.35 → clarify loop)
  else if (hasNeighborhood && RENTAL_INTENT_RE.test(normalized)) confidence = 0.62;
  else if (hasNeighborhood) confidence = 0.35;

  return {
    hasBudget,
    hasBedrooms,
    hasVibeOrUseCase,
    hasNeighborhood,
    hasDateRange,
    cityWide,
    hasNomad,
    hasCafeOrGym,
    confidence,
    neighborhood,
    minBedrooms,
    maxPricePerNight,
    budgetType,
    dateRangeLabel,
    checkIn,
    checkOut,
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
      checkIn: s.checkIn ?? q.checkIn,
      checkOut: s.checkOut ?? q.checkOut,
      stayType: s.budgetType ?? q.budgetType,
      limit: FAST_PATH_LIMIT,
    };
    if (
      merged.neighborhood ||
      merged.minBedrooms != null ||
      merged.maxPricePerNight != null
    ) {
      return attachQueryText(merged, text, s);
    }
    if (hasRentalSignals(text)) {
      return attachQueryText({ limit: FAST_PATH_LIMIT }, text, s);
    }
  }

  if (memory.lastRentalQuery && !memory.lastRentalQuery.genericAskPending) {
    return attachQueryText(
      {
        neighborhood: s.neighborhood ?? q?.neighborhood,
        minBedrooms: s.minBedrooms ?? q?.minBedrooms,
        maxPricePerNight: s.maxPricePerNight ?? q?.maxPricePerNight,
        checkIn: q?.checkIn,
        checkOut: q?.checkOut,
        stayType: q?.budgetType,
        limit: FAST_PATH_LIMIT,
      },
      text,
      s,
    );
  }

  if (!looksLikeRentalSearch(text)) return null;

  if (s.hasBudget && s.hasNeighborhood) {
    return attachQueryText(
      {
        neighborhood: s.neighborhood,
        minBedrooms: s.minBedrooms,
        maxPricePerNight: s.maxPricePerNight,
        limit: FAST_PATH_LIMIT,
      },
      text,
      s,
    );
  }

  if (s.confidence >= 0.6) {
    return attachQueryText(
      {
        neighborhood: s.neighborhood,
        minBedrooms: s.minBedrooms,
        maxPricePerNight: s.maxPricePerNight,
        limit: FAST_PATH_LIMIT,
      },
      text,
      s,
    );
  }

  if (
    q?.neighborhood ||
    q?.minBedrooms != null ||
    q?.maxPricePerNight != null
  ) {
    return attachQueryText(
      {
        neighborhood: q.neighborhood,
        minBedrooms: q.minBedrooms,
        maxPricePerNight: q.maxPricePerNight,
        checkIn: q.checkIn,
        checkOut: q.checkOut,
        stayType: q.budgetType,
        limit: FAST_PATH_LIMIT,
      },
      text,
      s,
    );
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
