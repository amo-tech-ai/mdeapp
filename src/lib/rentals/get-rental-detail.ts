import { createClient } from "@supabase/supabase-js";
import { searchRentals } from "@/mastra/tools/search-rentals";

/**
 * SAN-1202 · RE-DES-007 — consumer rental detail.
 * Reuses the existing `apartments` table (no new tables). Unknown fields stay
 * `null` so the UI can render "Data pending" — never faked.
 */
export type RentalDetail = {
  id: string;
  slug: string | null;
  title: string;
  neighborhood: string;
  address: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  maxGuests: number | null;
  priceNightly: number | null;
  priceMonthly: number | null;
  currency: string;
  deposit: number | null;
  amenities: string[];
  buildingAmenities: string[];
  images: string[];
  description: string | null;
  houseRules: string | null;
  hostName: string | null;
  availableFrom: string | null;
  availableTo: string | null;
  minimumStayDays: number | null;
  maximumStayDays: number | null;
  latitude: number | null;
  longitude: number | null;
  status: string | null;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function num(v: unknown): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function strArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v : null;
}

/** Map a raw `apartments` row to the detail view-model. Exported for unit tests. */
export function mapApartmentRowToDetail(r: Record<string, unknown>): RentalDetail {
  return {
    id: String(r.id),
    slug: str(r.slug),
    title: str(r.title) ?? "Rental",
    neighborhood: str(r.neighborhood) ?? "",
    address: str(r.address),
    bedrooms: num(r.bedrooms),
    bathrooms: num(r.bathrooms),
    maxGuests: num(r.max_guests) ?? num(r.guests),
    priceNightly: num(r.price_daily),
    priceMonthly: num(r.price_monthly),
    currency: str(r.currency) ?? "USD",
    deposit: num(r.deposit_amount),
    amenities: strArray(r.amenities),
    buildingAmenities: strArray(r.building_amenities),
    images: strArray(r.images),
    description: str(r.description),
    houseRules: str(r.house_rules),
    hostName: str(r.host_name),
    availableFrom: str(r.available_from),
    availableTo: str(r.available_to),
    minimumStayDays: num(r.minimum_stay_days),
    maximumStayDays: num(r.maximum_stay_days),
    latitude: num(r.latitude),
    longitude: num(r.longitude),
    status: str(r.status),
  };
}

/**
 * Load one published rental by id or slug. Returns null for missing/unpublished
 * (RLS scopes anon reads to active listings). No Supabase env → dev/mock fallback
 * via the search tool's mock list (so the page renders locally without a DB).
 */
export async function getRentalDetail(idOrSlug: string): Promise<RentalDetail | null> {
  const client = getClient();
  if (client) {
    let q = client.from("apartments").select("*").eq("status", "active").limit(1);
    q = UUID_RE.test(idOrSlug) ? q.eq("id", idOrSlug) : q.eq("slug", idOrSlug);
    const { data, error } = await q.maybeSingle();
    if (error) {
      console.error("[get-rental-detail] supabase error:", error.message);
      return null;
    }
    return data ? mapApartmentRowToDetail(data as Record<string, unknown>) : null;
  }

  // No DB env (local dev / CI) — reuse the search tool's mock fallback.
  const { results } = await searchRentals({ limit: 24 });
  const hit = results.find((r) => r.id === idOrSlug);
  if (!hit) return null;
  return {
    id: hit.id,
    slug: null,
    title: hit.title,
    neighborhood: hit.neighborhood,
    address: null,
    bedrooms: hit.bedrooms,
    bathrooms: null,
    maxGuests: null,
    priceNightly: hit.nightly_price,
    priceMonthly: null,
    currency: hit.currency,
    deposit: null,
    amenities: hit.amenities,
    buildingAmenities: [],
    images: hit.image ? [hit.image] : [],
    description: null,
    houseRules: null,
    hostName: hit.host_name,
    availableFrom: null,
    availableTo: null,
    minimumStayDays: null,
    maximumStayDays: null,
    latitude: hit.latitude ?? null,
    longitude: hit.longitude ?? null,
    status: "active",
  };
}
