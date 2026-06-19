/**
 * MASTRA-RE-002 — RentalSearchEngine: one search entry for API, workflow, and tool.
 * Fast path OR agent OR workflow — never duplicate search on the same dedupe key.
 */
import type { RentalQuery, RentalSearchResult } from "../tools/search-rentals";
import { searchRentals } from "../tools/search-rentals";
import {
  rentalIntentToSearchParams,
  type RentalIntent,
} from "@/lib/rental-intent-schema";

const inFlight = new Map<string, Promise<RentalSearchResult>>();
let searchInvocationCount = 0;

export const resetRentalSearchEngineForTests = (): void => {
  inFlight.clear();
  searchInvocationCount = 0;
};

export const getRentalSearchInvocationCount = (): number => searchInvocationCount;

const dedupeKey = (query: RentalQuery): string =>
  JSON.stringify({
    neighborhood: query.neighborhood,
    minBedrooms: query.minBedrooms,
    maxPricePerNight: query.maxPricePerNight,
    limit: query.limit ?? 8,
    queryText: query.queryText,
    checkIn: query.checkIn,
    checkOut: query.checkOut,
    stayType: query.stayType,
  });

export const rentalSearchEngine = {
  search(query: RentalQuery): Promise<RentalSearchResult> {
    const key = dedupeKey(query);
    const existing = inFlight.get(key);
    if (existing) return existing;

    searchInvocationCount++;
    const pending = searchRentals(query).finally(() => {
      inFlight.delete(key);
    });
    inFlight.set(key, pending);
    return pending;
  },

  searchFromIntent(
    intent: RentalIntent,
    limit = 8,
  ): Promise<RentalSearchResult> {
    return this.search(rentalIntentToSearchParams(intent, limit));
  },
};
