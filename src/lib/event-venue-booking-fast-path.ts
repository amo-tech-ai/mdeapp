import type { RestaurantSearchApiParams } from "@/lib/restaurant-search-fast-path";
import { scoreRestaurantQuery } from "@/lib/restaurant-query-classifier";
import {
  looksLikeEventVenueBookingQuery,
  parseEventVenueBookingIntent,
} from "@/lib/event-venue-booking-intent";

const FAST_PATH_LIMIT = 5;

export function canFastPathEventVenueBooking(text: string): boolean {
  return looksLikeEventVenueBookingQuery(text);
}

export function buildEventVenueBookingSearchParams(
  text: string,
): RestaurantSearchApiParams | null {
  if (!looksLikeEventVenueBookingQuery(text)) return null;

  const intent = parseEventVenueBookingIntent(text);
  const signals = scoreRestaurantQuery(text);

  return {
    neighborhood: intent.neighborhood ?? signals.neighborhood,
    queryText: text.trim(),
    limit: FAST_PATH_LIMIT,
  };
}

export function eventVenueBookingAssistantSummary(
  count: number,
  partySize?: number,
): string {
  if (count === 0) {
    return "No venues with private-event offerings matched — try another neighborhood or guest count.";
  }
  const guests = partySize ? ` for about ${partySize} guests` : "";
  return `Found ${count} venue${count === 1 ? "" : "s"} that host private events${guests} — tap Event Venue on a card to see offerings.`;
}
