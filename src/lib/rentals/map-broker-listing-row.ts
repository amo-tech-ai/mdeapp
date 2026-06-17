import type { Database } from "@/lib/supabase/database.types";
import type { BrokerListingDetail } from "./broker-listing-detail";
import { isListingWorkflowStatus } from "./listing-workflow";

export type ApartmentBrokerListingRow = Pick<
  Database["public"]["Tables"]["apartments"]["Row"],
  | "id"
  | "title"
  | "neighborhood"
  | "listing_workflow_status"
  | "landlord_id"
  | "bedrooms"
  | "bathrooms"
  | "price_monthly"
  | "currency"
  | "address"
  | "description"
  | "images"
  | "latitude"
  | "longitude"
  | "published_at"
  | "amenities"
>;

/** Map Supabase apartments row → broker listing detail contract. */
export function mapBrokerListingRow(row: ApartmentBrokerListingRow): BrokerListingDetail {
  if (!isListingWorkflowStatus(row.listing_workflow_status)) {
    throw new Error(`invalid listing_workflow_status: ${row.listing_workflow_status}`);
  }
  return {
    id: row.id,
    title: row.title,
    neighborhood: row.neighborhood,
    listingWorkflowStatus: row.listing_workflow_status,
    landlordId: row.landlord_id,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    priceMonthly: row.price_monthly,
    currency: row.currency,
    address: row.address,
    description: row.description,
    images: row.images ?? [],
    latitude: row.latitude,
    longitude: row.longitude,
    publishedAt: row.published_at,
    amenities: row.amenities ?? [],
  };
}
