"use client";

import { ChatMap } from "@/components/maps/ChatMap";
import { MapsShell } from "@/components/maps/MapProvider";

export function BrowseMapPanel() {
  return (
    <div
      className="sticky top-28 hidden h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-border lg:block"
      data-testid="browse-map-panel"
    >
      <MapsShell>
        <ChatMap mapDomId="browse-map" />
      </MapsShell>
    </div>
  );
}
