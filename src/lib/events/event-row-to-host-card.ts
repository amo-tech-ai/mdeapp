import type { HostEventCardProps } from "@/components/host/host-event-card";

/** The `public.events` columns the host list selects. Real host filter column
 *  is `organizer_id` (NOT `host_id`). Kept structural so the mapper stays
 *  decoupled from the generated Supabase types and easy to unit-test. */
export type HostEventRow = {
  id: string;
  name: string | null;
  slug: string | null;
  status: string | null;
  address: string | null;
  city: string | null;
  event_start_time: string | null;
  primary_image_url: string | null;
  ticket_price_min: number | null;
};

/** First address segment before a comma; falls back to city, then "Medellín".
 *  Mirrors `extractNeighborhood` in src/mastra/tools/search-events.ts. */
function neighborhoodFrom(address: string | null, city: string | null): string {
  const segment = address?.split(",")[0]?.trim();
  if (segment) return segment;
  if (city) return city;
  return "Medellín";
}

/** Map a Supabase events row → HostEventCard props. Preserves a null price as
 *  null (the card renders "Price TBD") — never coerce to 0. */
export function eventRowToHostCardProps(row: HostEventRow): HostEventCardProps {
  return {
    id: row.id,
    title: row.name ?? "Untitled event",
    venue: row.address ?? "Venue TBD",
    neighborhood: neighborhoodFrom(row.address, row.city),
    startsAt: row.event_start_time ?? "",
    priceMin: row.ticket_price_min ?? null,
    imageUrl: row.primary_image_url ?? undefined,
    status: row.status ?? "draft",
    slug: row.slug,
  };
}
