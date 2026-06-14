/**
 * SAN-664 — MKT Sponsors / Sponsorship landing (/sponsors).
 * Placeholder stub so the SAN-692 partner hub "Sponsor" card does not 404.
 * Full landing (audience reach, packages, demo form) is built under SAN-664.
 */
import { PartnerLandingPlaceholder } from "@/components/partners/partner-landing-placeholder";

export const metadata = {
  title: "Sponsorship · mdeai",
  description:
    "Sponsor Medellín events and contests with mdeai — reach engaged audiences across the concierge. Full sponsorship landing coming soon.",
  // Placeholder page — keep out of the index until the full SAN-664 landing ships.
  robots: { index: false, follow: true },
};

export default function SponsorsPage() {
  return (
    <PartnerLandingPlaceholder
      partnerLabel="Sponsorship"
      tagline="Put your brand in front of Medellín's most engaged audiences."
      description="A landing for sponsors and brands is on the way. Sponsor events and contests, reach audiences discovering things to do through the concierge, and track the results — all with clearly labeled, grounded placements."
      highlights={[
        "Featured placement across events and contests",
        "Reach audiences already planning their nights out",
        "Sponsorship packages with transparent, labeled placements",
      ]}
      signupType="sponsor"
      linearRef="SAN-664 — MKT Sponsors / Sponsorship landing"
    />
  );
}
