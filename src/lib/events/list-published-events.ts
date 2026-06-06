import type { SupabaseClient } from "@supabase/supabase-js";
import type { DateWindow, EventCategory } from "@/mastra/tools/search-events";
import {
  dateWindow,
  dbEventTypesForCategory,
  extractNeighborhood,
  mapCategory,
  normalizeEventCurrency,
} from "@/mastra/tools/search-events";

/** Browse catalog row — SCREEN-027 / SAN-586 contract. */
export type PublishedEventListItem = {
  id: string;
  eventId: string;
  slug: string;
  title: string;
  venue: string;
  neighborhood: string;
  startsAt: string;
  pricePerTicket: number;
  currency: string;
  imageUrl?: string;
  ticketUrl: string;
  category: EventCategory;
  status: "published";
};

export type ListPublishedEventsQuery = {
  category?: EventCategory;
  neighborhood?: string;
  dateWindow?: DateWindow;
  price?: "free" | "paid";
  limit?: number;
  offset?: number;
};

export type ListPublishedEventsResult = {
  results: PublishedEventListItem[];
  total: number;
  limit: number;
  offset: number;
  error: string | null;
};

type EventBrowseRow = {
  id: string;
  slug: string | null;
  name: string;
  event_type: string | null;
  address: string | null;
  city: string | null;
  event_start_time: string;
  ticket_price_min: number | null;
  currency: string | null;
  primary_image_url: string | null;
  ticket_url: string | null;
  status: string;
};

const EVENT_LIST_SELECT =
  "id, slug, name, event_type, address, city, event_start_time, ticket_price_min, currency, primary_image_url, ticket_url, status";

export function mapEventRowToBrowseItem(row: EventBrowseRow): PublishedEventListItem {
  const slug = row.slug?.trim() || row.id;
  const ticketUrl = row.ticket_url?.trim() || `/events/${slug}`;

  return {
    id: row.id,
    eventId: row.id,
    slug,
    title: row.name,
    venue: row.address ?? "Medellín",
    neighborhood: extractNeighborhood(row.address, row.city),
    startsAt: row.event_start_time,
    pricePerTicket: row.ticket_price_min ?? 0,
    currency: normalizeEventCurrency(row.currency),
    imageUrl: row.primary_image_url ?? undefined,
    ticketUrl,
    category: mapCategory(row.event_type),
    status: "published",
  };
}

/** Deterministic published-event catalog — no LLM / hybrid / queryText. */
export async function listPublishedEvents(
  supabase: SupabaseClient,
  query: ListPublishedEventsQuery,
): Promise<ListPublishedEventsResult> {
  const limit = Math.min(Math.max(query.limit ?? 24, 1), 50);
  const offset = Math.max(query.offset ?? 0, 0);

  let q = supabase
    .from("events")
    .select(EVENT_LIST_SELECT, { count: "exact" })
    .eq("is_active", true)
    .in("status", ["published", "live"]);

  if (query.category) {
    q = q.in("event_type", dbEventTypesForCategory(query.category));
  }

  if (query.neighborhood) {
    q = q.ilike("address", `%${query.neighborhood}%`);
  }

  if (query.price === "free") {
    q = q.or("ticket_price_min.is.null,ticket_price_min.eq.0");
  } else if (query.price === "paid") {
    q = q.gt("ticket_price_min", 0);
  }

  const window = dateWindow(query.dateWindow);
  if (window.gte) q = q.gte("event_start_time", window.gte);
  if (window.lte) q = q.lte("event_start_time", window.lte);

  q = q
    .order("event_start_time", { ascending: true })
    .order("id", { ascending: true })
    .range(offset, offset + limit - 1);

  const { data, error, count } = await q;

  if (error) {
    console.error("[list-published-events]", error.message);
    return {
      results: [],
      total: 0,
      limit,
      offset,
      error: "Could not load events. Try again in a moment.",
    };
  }

  const results = (data as EventBrowseRow[]).map(mapEventRowToBrowseItem);
  return {
    results,
    total: count ?? results.length,
    limit,
    offset,
    error: null,
  };
}
