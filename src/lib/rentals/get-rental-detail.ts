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

// skipcq: JS-0067 - module-local helper; not browser global scope
const getClient = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
};

// skipcq: JS-0067 - module-local helper; not browser global scope
const num = (value: unknown): number | null => {
  if (value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

// skipcq: JS-0067 - module-local helper; not browser global scope
const strArray = (value: unknown): string[] => {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
};

// skipcq: JS-0067 - module-local helper; not browser global scope
const str = (value: unknown): string | null => {
  return typeof value === "string" && value.trim() ? value : null;
};

// skipcq: JS-0067 - module-local helper; not browser global scope
const rentalSlugFromSourceUrl = (sourceUrl: string): string | null => {
  try {
    return new URL(sourceUrl).pathname.split("/").filter(Boolean).pop() ?? null;
  } catch {
    return sourceUrl.split("?")[0].split("/").filter(Boolean).pop() ?? null;
  }
};

/** Map a raw `apartments` row to the detail view-model. Exported for unit tests. */
// skipcq: JS-0067 - ES module export; not browser global scope
export function mapApartmentRowToDetail(row: Record<string, unknown>): RentalDetail {
  return {
    id: String(row.id),
    slug: str(row.slug),
    title: str(row.title) ?? "Rental",
    neighborhood: str(row.neighborhood) ?? "",
    address: str(row.address),
    bedrooms: num(row.bedrooms),
    bathrooms: num(row.bathrooms),
    maxGuests: num(row.max_guests) ?? num(row.guests),
    priceNightly: num(row.price_daily),
    priceMonthly: num(row.price_monthly),
    currency: str(row.currency) ?? "USD",
    deposit: num(row.deposit_amount),
    amenities: strArray(row.amenities),
    buildingAmenities: strArray(row.building_amenities),
    images: strArray(row.images),
    description: str(row.description),
    houseRules: str(row.house_rules),
    hostName: str(row.host_name),
    availableFrom: str(row.available_from),
    availableTo: str(row.available_to),
    minimumStayDays: num(row.minimum_stay_days),
    maximumStayDays: num(row.maximum_stay_days),
    latitude: num(row.latitude),
    longitude: num(row.longitude),
    status: str(row.status),
  };
}

/**
 * Load one published rental by id or slug. Returns null for missing/unpublished
 * (RLS scopes anon reads to active listings). No Supabase env → dev/mock fallback
 * via the search tool's mock list (so the page renders locally without a DB).
 */
// skipcq: JS-0067, JS-R1005 - ES module export; intentional db-path + mock-fallback branching, not a bug
export async function getRentalDetail(idOrSlug: string): Promise<RentalDetail | null> {
  const client = getClient();
  if (!client) {
    return getMockRentalDetail(idOrSlug);
  }

  const apartmentsQuery = client.from("apartments").select("*").eq("status", "active").limit(1);
  const field = UUID_RE.test(idOrSlug) ? "id" : "slug";
  const { data, error } = await apartmentsQuery.eq(field, idOrSlug).maybeSingle();
  if (error) {
    throw new Error(`[get-rental-detail] supabase error: ${error.message}`);
  }
  return data ? mapApartmentRowToDetail(data as Record<string, unknown>) : null;
}

// skipcq: JS-0067 - ES module export; testable mock fallback helper
export async function getMockRentalDetail(idOrSlug: string): Promise<RentalDetail | null> {
  const { results } = await searchRentals({ limit: 24 });
  const hit = results.find((rental) => rental.id === idOrSlug || rentalSlugFromSourceUrl(rental.source_url) === idOrSlug);
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
