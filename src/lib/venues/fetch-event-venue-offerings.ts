import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type {
  EventVenueOfferingsPayload,
  EventVenueOfferingSummary,
  EventVenuePackageSummary,
} from "@/lib/venues/event-venue-offerings-types";
import { isSchemaUnavailableError } from "@/lib/venues/is-schema-unavailable-error";

type LooseClient = SupabaseClient<Record<string, unknown>>;

function asLooseClient(supabase: SupabaseClient<Database>): LooseClient {
  return supabase as unknown as LooseClient;
}

// venue_event_offerings / venue_event_packages are not in database.types.ts
// until the SAN-492 migration is applied, so rows are typed at the boundary.
type PartnerLocationRow = {
  id: string;
  label: string | null;
  neighborhood: string | null;
  google_place_id: string;
};

function mapOffering(row: Record<string, unknown>): EventVenueOfferingSummary {
  return {
    id: String(row.id),
    offeringKey: String(row.offering_key),
    eventTypes: Array.isArray(row.event_types)
      ? row.event_types.map(String)
      : [],
    amenities: Array.isArray(row.amenities)
      ? row.amenities.map(String)
      : [],
    minimumSpend:
      row.minimum_spend == null ? null : Number(row.minimum_spend),
    pricePerPersonFrom:
      row.price_per_person_from == null
        ? null
        : Number(row.price_per_person_from),
  };
}

function mapPackage(row: Record<string, unknown>): EventVenuePackageSummary {
  return {
    id: String(row.id),
    name: String(row.name),
    description: row.description == null ? null : String(row.description),
    priceFrom: Number(row.price_from),
    minGuests: Number(row.min_guests),
    maxGuests: Number(row.max_guests),
  };
}

export async function fetchEventVenueOfferingsByPlaceId(
  supabase: SupabaseClient<Database>,
  placeId: string,
): Promise<
  | { ok: true; data: EventVenueOfferingsPayload | null }
  | { ok: false; message: string }
> {
  const trimmed = placeId.trim();
  if (!trimmed || trimmed.length < 8) {
    return { ok: true, data: null };
  }

  const client = asLooseClient(supabase);

  const { data: locationData, error: locError } = await client
    .from("partner_locations")
    .select("id, label, neighborhood, google_place_id")
    .eq("google_place_id", trimmed)
    .maybeSingle();
  const location = locationData as PartnerLocationRow | null;

  if (locError) {
    if (isSchemaUnavailableError(locError)) {
      return { ok: true, data: null };
    }
    return { ok: false, message: locError.message };
  }

  if (!location?.id) {
    return { ok: true, data: null };
  }

  const { data: offeringRows, error: offError } = await client
    .from("venue_event_offerings")
    .select(
      "id, offering_key, event_types, amenities, minimum_spend, price_per_person_from",
    )
    .eq("partner_location_id", location.id);

  if (offError) {
    if (isSchemaUnavailableError(offError)) {
      return { ok: true, data: null };
    }
    return { ok: false, message: offError.message };
  }

  const offerings = ((offeringRows ?? []) as Record<string, unknown>[]).map(
    mapOffering,
  );
  if (offerings.length === 0) {
    return { ok: true, data: null };
  }

  const { data: packageRows, error: pkgError } = await client
    .from("venue_event_packages")
    .select("id, name, description, price_from, min_guests, max_guests")
    .eq("partner_location_id", location.id);

  if (pkgError && !isSchemaUnavailableError(pkgError)) {
    return { ok: false, message: pkgError.message };
  }

  const packages = ((packageRows ?? []) as Record<string, unknown>[]).map(
    mapPackage,
  );

  return {
    ok: true,
    data: {
      partnerLocationId: String(location.id),
      locationLabel: String(location.label ?? trimmed),
      neighborhood:
        location.neighborhood == null ? null : String(location.neighborhood),
      placeId: trimmed,
      offerings,
      packages,
    },
  };
}
