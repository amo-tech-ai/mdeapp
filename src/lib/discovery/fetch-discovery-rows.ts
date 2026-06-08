/**
 * Server-only data fetchers for the homepage discovery rows (SAN-718).
 *
 * Each function returns PlaceCardData[] — an empty array signals "use fallback".
 * All Supabase queries select only the columns they need (no SELECT *).
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { listPublishedEvents } from "@/lib/events/list-published-events";
import type { PlaceCardData } from "@/components/home/home-discovery-rows";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function priceDollars(level: number | null | undefined): string {
  if (!level || level < 1) return "";
  return "$".repeat(Math.min(Math.max(level, 1), 4));
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatEventDate(isoDate: string): string {
  const d = new Date(isoDate);
  const now = new Date();
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / 86_400_000);
  if (diffDays <= 0) return "Tonight";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays <= 7) return "This week";
  if (diffDays <= 14) return "Next week";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Row 1 — Rentals ──────────────────────────────────────────────────────────

type ApartmentRow = {
  id: string;
  title: string;
  neighborhood: string;
  price_monthly: number | null;
  bedrooms: number | null;
  wifi_speed: number | null;
  utilities_included: boolean | null;
  pet_friendly: boolean | null;
  images: string[] | null;
  rating: number | null;
};

function mapApartmentToCard(row: ApartmentRow): PlaceCardData {
  const price = row.price_monthly
    ? `From $${Math.round(Number(row.price_monthly)).toLocaleString()} / mo`
    : row.neighborhood;

  const hints: string[] = [];
  if (row.neighborhood) hints.push(row.neighborhood);
  if (row.bedrooms) hints.push(`${row.bedrooms}BR`);
  if (row.wifi_speed && row.wifi_speed >= 50) hints.push("fast Wi-Fi");
  if (row.utilities_included) hints.push("bills included");
  if (row.pet_friendly) hints.push("pet-friendly");
  const why =
    hints.length > 1
      ? `${hints.join(" · ")}.`
      : `Available now in ${row.neighborhood}.`;

  return {
    id: row.id,
    name: row.title,
    kind: "Rental",
    rating: Number(row.rating) || 4.5,
    meta: price,
    why,
    image: row.images?.[0] ?? "",
    query: `${row.title} ${row.neighborhood} Medellín rental`,
  };
}

export async function fetchLiveRentals(
  supabase: SupabaseClient,
): Promise<PlaceCardData[]> {
  const { data, error } = await supabase
    .from("apartments")
    .select(
      "id, title, neighborhood, price_monthly, bedrooms, wifi_speed, utilities_included, pet_friendly, images, rating",
    )
    .eq("moderation_status", "approved")
    .not("images", "is", null)
    .order("rating", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(4);

  if (error || !data?.length) return [];
  return (data as ApartmentRow[]).map(mapApartmentToCard);
}

// ─── Row 2 — Top Restaurants ─────────────────────────────────────────────────

type RestaurantRow = {
  id: string;
  name: string;
  neighborhood: string | null;
  cuisine_types: string[];
  price_level: number | null;
  primary_image_url: string | null;
  rating: number | null;
  ai_summary: string | null;
};

function mapRestaurantToCard(row: RestaurantRow): PlaceCardData {
  const priceStr = priceDollars(row.price_level);
  const meta = [row.neighborhood, priceStr].filter(Boolean).join(" · ");
  const kind = row.cuisine_types?.[0] ? capitalize(row.cuisine_types[0]) : "Restaurant";

  return {
    id: row.id,
    name: row.name,
    kind,
    rating: Number(row.rating) || 4.5,
    meta,
    why: row.ai_summary ?? `Highly rated in ${row.neighborhood ?? "Medellín"}.`,
    image: row.primary_image_url ?? "",
    query: `${row.name} restaurant ${row.neighborhood ?? "Medellín"} Medellín`,
  };
}

const RESTAURANT_SELECT =
  "id, name, neighborhood, cuisine_types, price_level, primary_image_url, rating, ai_summary";

export async function fetchLiveRestaurants(
  supabase: SupabaseClient,
): Promise<PlaceCardData[]> {
  const { data, error } = await supabase
    .from("restaurants")
    .select(RESTAURANT_SELECT)
    .eq("is_active", true)
    .gte("rating", 4.3)
    .not("primary_image_url", "is", null)
    .order("rating", { ascending: false, nullsFirst: false })
    .limit(4);

  if (error || !data?.length) return [];
  return (data as RestaurantRow[]).map(mapRestaurantToCard);
}

// ─── Row 3 — Cafés to Work From ──────────────────────────────────────────────

const CAFE_CUISINE_TYPES = ["cafe", "coffee", "specialty coffee", "tea house"];
const CAFE_TAGS = ["cafe", "coffee shop", "wifi", "remote work", "laptop friendly", "coworking"];

export async function fetchLiveCafes(
  supabase: SupabaseClient,
): Promise<PlaceCardData[]> {
  const { data, error } = await supabase
    .from("restaurants")
    .select(RESTAURANT_SELECT)
    .eq("is_active", true)
    .not("primary_image_url", "is", null)
    .or(
      `cuisine_types.ov.{${CAFE_CUISINE_TYPES.join(",")}},tags.ov.{${CAFE_TAGS.join(",")}}`,
    )
    .order("rating", { ascending: false, nullsFirst: false })
    .limit(4);

  if (error || !data?.length) return [];

  return (data as RestaurantRow[]).map((row) => ({
    ...mapRestaurantToCard(row),
    kind: "Café",
  }));
}

// ─── Row 4 — Upcoming Events ─────────────────────────────────────────────────

const EVENT_CATEGORY_LABEL: Record<string, string> = {
  music: "Music",
  food: "Food & drink",
  culture: "Culture",
  sports: "Sports",
  nightlife: "Nightlife",
  festival: "Festival",
  business: "Business",
  other: "Event",
};

export async function fetchLiveEvents(
  supabase: SupabaseClient,
): Promise<PlaceCardData[]> {
  const { results, error } = await listPublishedEvents(supabase, {
    limit: 4,
    // No dateWindow filter — service orders by event_start_time ASC,
    // so the first 4 results are the next upcoming published events.
  });

  if (error || !results.length) return [];

  return results.map((row) => {
    const dateStr = formatEventDate(row.startsAt);
    const priceStr =
      row.pricePerTicket === 0 ? "Free" : `$${row.pricePerTicket} entry`;

    // Build a non-redundant why line — skip generic/TBD values
    const venuePart =
      row.venue && row.venue !== "Medellín" && row.venue !== "TBD" ? row.venue : null;
    const neighborhoodPart =
      row.neighborhood && row.neighborhood !== "Medellín" ? row.neighborhood : null;
    const why =
      venuePart && neighborhoodPart
        ? `${venuePart} · ${neighborhoodPart}`
        : venuePart ?? neighborhoodPart ?? "In Medellín";

    return {
      id: row.id,
      name: row.title,
      kind: EVENT_CATEGORY_LABEL[row.category] ?? "Event",
      rating: 4.7, // events don't carry user ratings — use neutral display value
      meta: `${dateStr} · ${priceStr}`,
      why,
      image: row.imageUrl ?? "",
      query: `${row.title} Medellín events tickets`,
    };
  });
}
