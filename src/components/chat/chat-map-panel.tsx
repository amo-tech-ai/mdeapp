"use client";

import { MapPin } from "lucide-react";
import { CafeDetailPanel } from "@/components/cafe/cafe-detail-panel";
import { useRentalUi } from "@/components/chat/rental-ui-context";
import { ChatMap } from "@/components/maps/ChatMap";
import { EmptyState } from "@/components/empty/empty-state";
import { useMapContext } from "@/platform/maps/map-context";

/** MAP-007 sticky map column (desktop) — mode map | cafe detail. */
export function ChatMapPanel() {
  const { cafeDetail, cafeSearchSiblings, rightColumnMode } = useRentalUi();
  const { pins } = useMapContext();
  const visiblePins = pins.filter((pin) => pin.source !== "mock");
  const showEmpty = visiblePins.length === 0;

  return (
    <section
      data-testid="map-panel"
      data-right-column-mode={rightColumnMode}
      aria-label={rightColumnMode === "detail" ? "Cafe detail" : "Medellín map"}
      className="relative hidden h-full min-h-0 w-full min-w-0 lg:flex lg:flex-col"
    >
      {cafeDetail ? (
        <CafeDetailPanel detail={cafeDetail} siblings={cafeSearchSiblings} />
      ) : (
        <div className="relative min-h-0 flex-1 lg:sticky lg:top-0 lg:h-full">
          <ChatMap mapDomId="chat-map" />
          {showEmpty ? (
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/70 p-6"
              data-testid="map-empty-state"
            >
              <EmptyState
                testId="map-empty-state-card"
                title="Map is ready"
                description="Ask for rentals, events, or cafés — pins will appear here."
                icon={<MapPin className="size-8" />}
                className="pointer-events-auto max-w-xs bg-background/95"
              />
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
