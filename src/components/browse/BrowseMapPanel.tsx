"use client";

import { ChatMap } from "@/components/maps/ChatMap";

export function BrowseMapPanel() {
  return (
    <div
      className="sticky top-28 hidden h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-border lg:block"
      data-testid="browse-map-panel"
    >
      <ChatMap mapDomId="browse-map" />
    </div>
  );
}
