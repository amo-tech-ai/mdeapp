"use client";

import { CopilotKitCSSProperties } from "@copilotkit/react-ui";
import { GeoChatShell } from "@/components/chat/geo-chat-shell";
import { MapContextProvider } from "@/platform/maps/map-context";
import { HomeVerticalsStrip } from "@/components/home/home-verticals-strip";
import { HomeSuggestions } from "@/components/home/home-suggestions";
import { HomeTrending } from "@/components/home/home-trending";
import { HomeDiscoveryRows } from "@/components/home/home-discovery-rows";
import { HomeNeighborhoods } from "@/components/home/home-neighborhoods";
import { HomeTrustBand } from "@/components/home/home-trust-band";
import { HomeHostBand } from "@/components/home/home-host-band";
import { HomeHowItWorks } from "@/components/home/home-how-it-works";
import { HomeFooter } from "@/components/home/home-footer";
import { HomeFab } from "@/components/home/home-fab";

/** MAP-007B + D-13 — GeoChatShell occupies first viewport; marketing bands scroll below. */
export default function HomePage() {
  return (
    <>
      <main
        id="main-content"
        style={
          {
            "--copilot-kit-primary-color": "var(--primary)",
          } as CopilotKitCSSProperties
        }
        className="bg-background text-foreground"
      >
        {/* Bands 01–02: Chat + Map — first viewport */}
        <div className="h-[100dvh]">
          <MapContextProvider>
            <GeoChatShell />
          </MapContextProvider>
        </div>

        {/* Band 03: Verticals quick-nav */}
        <HomeVerticalsStrip />

        {/* Band 04: AI suggestions */}
        <HomeSuggestions />

        {/* Band 05: Trending carousel */}
        <HomeTrending />

        {/* Band 06: Discovery rows (placeholders) */}
        <HomeDiscoveryRows />

        {/* Band 07: Neighbourhood cards */}
        <HomeNeighborhoods />

        {/* Band 08: Trust signals */}
        <HomeTrustBand />

        {/* Band 09: Host CTA */}
        <HomeHostBand />

        {/* Band 10: How it works */}
        <HomeHowItWorks />

        {/* Band 11: Footer */}
        <HomeFooter />
      </main>

      {/* Band 12: Fixed concierge FAB */}
      <HomeFab />
    </>
  );
}
