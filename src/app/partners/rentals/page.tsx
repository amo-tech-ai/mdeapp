/**
 * SAN-691 — MKT For Rentals / Brokers landing (/partners/rentals).
 * Placeholder stub so the SAN-692 partner hub "Broker" card does not 404.
 * Full landing (hero, lead-qual, map pins) is built under SAN-691.
 */
import { PartnerLandingPlaceholder } from "@/components/partners/partner-landing-placeholder";

export const metadata = {
  title: "For Brokers & Rental Hosts · mdeai",
  description:
    "List your Medellín rentals with mdeai and reach renters already searching — qualified leads, AI listing help, booked viewings. Full landing coming soon.",
};

export default function PartnersRentalsPage() {
  return (
    <PartnerLandingPlaceholder
      partnerLabel="For brokers & rental hosts"
      tagline="Turn Medellín's rental searches into booked viewings."
      description="A marketing landing for brokers and real-estate hosts is on the way. List your units, let the concierge surface them to renters already searching your neighborhood, and capture qualified leads without ad spend."
      highlights={[
        "Listings surfaced to renters in the AI concierge and on the map",
        "AI-assisted listing drafts and lead qualification",
        "Schedule-viewing hand-off straight to your inbox",
      ]}
      signupType="broker"
      linearRef="SAN-691 — MKT For Rentals / Brokers landing"
    />
  );
}
