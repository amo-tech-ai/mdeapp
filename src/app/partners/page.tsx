import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PartnerHub } from "@/components/partners/partner-hub";

export const metadata = {
  title: "Partners · Grow your business with mdeai",
  description:
    "Partner programs for event hosts, venues, brokers, sponsors, restaurants, cafés, and nightlife in Medellín.",
};

/** SAN-692 — MKT Partner hub (/partners). Composed on the reusable MarketingPageShell. */
export default function PartnersPage() {
  return (
    <MarketingPageShell accent="gold" mainTestId="partner-hub">
      <PartnerHub />
    </MarketingPageShell>
  );
}
