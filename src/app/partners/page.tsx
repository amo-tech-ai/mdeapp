/**
 * SAN-692 — MKT Partner hub marketing page (/partners).
 * Public, not auth-gated. Mindtrip-style "grow your business" hub with
 * partner-type cards routing to each landing/flow, plus a signup step
 * marquee. Reuses HomeNav/HomeFooter for a consistent marketing shell.
 */
import { HomeFooter } from "@/components/home/home-footer";
import { HomeNav } from "@/components/home/home-nav";
import { PartnerHub } from "@/components/partners/partner-hub";

export const metadata = {
  title: "Partners · Grow your business with mdeai",
  description:
    "List with mdeai, sell with us, or let our AI run your marketing. Onboarding for event hosts, restaurants, venues, brokers, sponsors, and agencies in Medellín.",
};

export default function PartnersPage() {
  return (
    <>
      <HomeNav />
      <PartnerHub />
      <HomeFooter />
    </>
  );
}
