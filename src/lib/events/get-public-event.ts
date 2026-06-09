import { createClient } from "@/lib/supabase/server";
import { isEventLookupUuid } from "./event-lookup";
import { parseEventHostDisplay } from "./parse-host-display";
import type {
  PublicEventDetail,
  PublicEventHost,
  PublicEventTicket,
  PublicEventVenue,
} from "./types";

type EventRow = {
  id: string;
  slug: string | null;
  name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  event_start_time: string;
  event_end_time: string | null;
  primary_image_url: string | null;
  currency: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  status: string;
  is_active: boolean;
  details: unknown;
  event_venues: VenueRow | VenueRow[] | null;
};

type VenueRow = {
  name: string;
  address: string;
  city: string;
};

type TicketRow = {
  id: string;
  name: string;
  price_cents: number;
  currency: string;
  qty_total: number;
  qty_sold: number;
  position: number;
};

function toNumber(value: number | string | null): number | null {
  if (value == null) return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function mapTicket(row: TicketRow): PublicEventTicket {
  return {
    id: row.id,
    name: row.name,
    priceCents: row.price_cents,
    currency: row.currency,
    qtyTotal: row.qty_total,
    qtySold: row.qty_sold,
    position: row.position,
  };
}

function mapVenue(row: VenueRow | null): PublicEventVenue | null {
  if (!row?.name?.trim()) return null;
  return {
    name: row.name.trim(),
    address: row.address?.trim() || null,
    city: row.city?.trim() || null,
  };
}

function normalizeVenueRow(
  venue: VenueRow | VenueRow[] | null | undefined,
): VenueRow | null {
  if (!venue) return null;
  return Array.isArray(venue) ? (venue[0] ?? null) : venue;
}

function mapEvent(
  row: EventRow,
  tickets: PublicEventTicket[],
  host: PublicEventHost | null,
  venue: PublicEventVenue | null,
): PublicEventDetail {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    address: row.address,
    city: row.city,
    startsAt: row.event_start_time,
    endsAt: row.event_end_time,
    imageUrl: row.primary_image_url,
    currency: row.currency,
    latitude: toNumber(row.latitude),
    longitude: toNumber(row.longitude),
    host,
    venue,
    tickets,
  };
}

/** Public event page fetch — slug or UUID, published/live + active only. */
export async function getPublicEvent(
  slugOrId: string,
): Promise<PublicEventDetail | null> {
  const supabase = await createClient();

  let eventQuery = supabase
    .from("events")
    .select(
      "id, slug, name, description, address, city, event_start_time, event_end_time, primary_image_url, currency, latitude, longitude, status, is_active, details, event_venues ( name, address, city )",
    )
    .in("status", ["published", "live"])
    .eq("is_active", true);

  eventQuery = isEventLookupUuid(slugOrId)
    ? eventQuery.eq("id", slugOrId)
    : eventQuery.eq("slug", slugOrId);

  const { data: eventRow, error: eventError } = await eventQuery.maybeSingle();

  if (eventError || !eventRow) return null;

  const row = eventRow as EventRow;
  const host = parseEventHostDisplay(row.details);
  const venue = mapVenue(normalizeVenueRow(row.event_venues));

  const { data: ticketRows, error: ticketError } = await supabase
    .from("event_tickets")
    .select("id, name, price_cents, currency, qty_total, qty_sold, position")
    .eq("event_id", row.id)
    .eq("is_active", true)
    .order("position", { ascending: true });

  if (ticketError) return null;

  return mapEvent(row, (ticketRows ?? []).map(mapTicket), host, venue);
}
