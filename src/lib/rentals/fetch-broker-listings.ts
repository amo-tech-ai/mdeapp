import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { BrokerListingDetail } from "./broker-listing-detail";
import { filterOwnedBrokerListings } from "./filter-owned-broker-listings";
import { mapBrokerListingRow, type ApartmentBrokerListingRow } from "./map-broker-listing-row";

const BROKER_LISTING_SELECT =
  "id, title, neighborhood, listing_workflow_status, landlord_id, bedrooms, bathrooms, price_monthly, currency, address, description, images, latitude, longitude, published_at, amenities";

export type FetchBrokerListingsResult =
  | { ok: true; listings: BrokerListingDetail[]; landlordProfileIds: string[] }
  | { ok: false; message: string };

type DbClient = SupabaseClient<Database>;

/** Load broker-scoped apartment inventory (RLS + explicit landlord filter). */
export async function fetchBrokerListings(
  supabase: DbClient,
  userId: string,
): Promise<FetchBrokerListingsResult> {
  const { data: profiles, error: profileError } = await supabase
    .from("landlord_profiles")
    .select("id")
    .eq("user_id", userId);

  if (profileError) {
    return { ok: false, message: profileError.message };
  }

  const landlordProfileIds = (profiles ?? []).map((p) => p.id);

  const { data, error } = await supabase
    .from("apartments")
    .select(BROKER_LISTING_SELECT)
    .order("updated_at", { ascending: false })
    .limit(200);

  if (error) {
    return { ok: false, message: error.message };
  }

  const mapped = (data as ApartmentBrokerListingRow[]).map(mapBrokerListingRow);
  const listings = filterOwnedBrokerListings(mapped, landlordProfileIds);

  return { ok: true, listings, landlordProfileIds };
}
