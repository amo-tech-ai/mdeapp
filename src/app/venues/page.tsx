import type { Metadata } from "next";

import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import {
  resolveVenueVariant,
  VENUE_VARIANT_ACCENT,
  VenuesLanding,
} from "@/components/partners/venues-landing";

type Props = {
  searchParams: Promise<{ v?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { v } = await searchParams;
  const variant = resolveVenueVariant(v);

  const titles: Record<typeof variant, string> = {
    default: "For Venues · mdeai — Fill your tables, fill your nights",
    restaurant: "For Restaurants · mdeai — Be the answer when visitors ask where to eat",
    cafe: "For Cafés · mdeai — Where Medellín's nomads work next",
    nightclub: "For Nightlife · mdeai — Slow Tuesdays are a software problem",
    space: "For Event Spaces · mdeai — Your space, booked by AI",
  };

  return {
    title: titles[variant],
    description:
      "mdeai puts your venue inside Medellín's AI concierge — where visitors already ask what to do, where to eat, and where to go out.",
  };
}

/**
 * SAN-661 · MKT — For Venues landing (/venues).
 *
 * ?v=restaurant|cafe|nightclub|space switches hero copy + accent.
 * Builds PartnerLandingShell — reused by /partners/rentals, /business/ai,
 * /sponsors, and /partners/* vertical landings (D-PTR-03/04/05/08).
 */
export default async function VenuesPage({ searchParams }: Props) {
  const { v } = await searchParams;
  const variant = resolveVenueVariant(v);
  const accent = VENUE_VARIANT_ACCENT[variant];

  return (
    <MarketingPageShell accent={accent} mainTestId="venues-page">
      <VenuesLanding variant={variant} />
    </MarketingPageShell>
  );
}
