import type { ListingWorkflowStatus } from "./listing-workflow";

/** Broker inventory row — extends SAN-1108 BrokerListingRow for RE-DES-003 UI. */
export type BrokerListingDetail = {
  id: string;
  title: string;
  neighborhood: string;
  listingWorkflowStatus: ListingWorkflowStatus;
  landlordId: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  priceMonthly: number | null;
  currency: string | null;
  address: string | null;
  description: string | null;
  images: string[];
  latitude: number | null;
  longitude: number | null;
  publishedAt: string | null;
  amenities: string[];
};

export type BrokerListingLeadSummary = {
  id: string;
  name: string | null;
  status: string;
  createdAt: string;
  budgetMax: number | null;
};

export type BrokerListingShowingSummary = {
  id: string;
  scheduledAt: string;
  status: string;
  leadId: string;
};
