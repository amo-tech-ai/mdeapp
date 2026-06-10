export type EventVenueOfferingSummary = {
  id: string;
  offeringKey: string;
  eventTypes: string[];
  amenities: string[];
  minimumSpend: number | null;
  pricePerPersonFrom: number | null;
};

export type EventVenuePackageSummary = {
  id: string;
  name: string;
  description: string | null;
  priceFrom: number;
  minGuests: number;
  maxGuests: number;
};

export type EventVenueOfferingsPayload = {
  /** null when the venue's partner_location has no partner_id — proposal CTA is then hidden. */
  partnerId: string | null;
  partnerLocationId: string;
  locationLabel: string;
  neighborhood: string | null;
  placeId: string;
  offerings: EventVenueOfferingSummary[];
  packages: EventVenuePackageSummary[];
};
