import { HomeNav } from "@/components/home/home-nav";
import { HomeHero } from "@/components/home/home-hero";
import { HomeMapTeaser } from "@/components/home/home-map-teaser";
import { HomeVerticalsStrip } from "@/components/home/home-verticals-strip";
import { HomeSuggestions } from "@/components/home/home-suggestions";
import { HomeTrending } from "@/components/home/home-trending";
import { HomeDiscoveryRows } from "@/components/home/home-discovery-rows";
import { HomeNeighborhoods } from "@/components/home/home-neighborhoods";
import { HomeTrustBand } from "@/components/home/home-trust-band";
import { HomeHostBand } from "@/components/home/home-host-band";
import { HomeHowItWorks } from "@/components/home/home-how-it-works";
import { HomePressLogos } from "@/components/home/home-press-logos";
import { HomeFooter } from "@/components/home/home-footer";
import { HomeFab } from "@/components/home/home-fab";

/** D-13: Marketing home page. Chat lives at /chat. */
export default function HomePage() {
  return (
    <>
      {/* Band 01: Sticky top nav */}
      <HomeNav />

      <main id="main-content" className="bg-background text-foreground">
        {/* Band 02: Hero + concierge search */}
        <HomeHero />

        {/* Band 03: Live map teaser */}
        <HomeMapTeaser />

        {/* Band 04: Verticals strip */}
        <HomeVerticalsStrip />

        {/* Band 05: AI suggestions */}
        <HomeSuggestions />

        {/* Band 06: Trending carousel */}
        <HomeTrending />

        {/* Band 07: Discovery rows */}
        <HomeDiscoveryRows />

        {/* Band 08: Neighbourhood cards */}
        <HomeNeighborhoods />

        {/* Band 09: Trust signals */}
        <HomeTrustBand />

        {/* Band 10: Host CTA */}
        <HomeHostBand />

        {/* Band 11: How it works */}
        <HomeHowItWorks />

        {/* Band 12: Press + partner logos */}
        <HomePressLogos />

        {/* Band 13: Footer */}
        <HomeFooter />
      </main>

      {/* Fixed concierge FAB */}
      <HomeFab />
    </>
  );
}
