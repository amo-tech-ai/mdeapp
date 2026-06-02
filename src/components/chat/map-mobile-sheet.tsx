"use client";

import { useState, useSyncExternalStore } from "react";
import { Map, MapPin } from "lucide-react";
import { ChatMap } from "@/components/maps/ChatMap";
import { EmptyState } from "@/components/empty/empty-state";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMapContext } from "@/platform/maps/map-context";

function MapSheetBody({ open }: { open: boolean }) {
  const { pins } = useMapContext();
  const visiblePins = pins.filter((pin) => pin.source !== "mock");
  const showEmpty = visiblePins.length === 0;

  return (
    <div className="relative h-[min(70vh,520px)] min-h-[280px] w-full">
      <ChatMap mapResizeSignal={open ? 1 : 0} />
      {showEmpty ? (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/70 p-4"
          data-testid="map-mobile-empty-state"
        >
          <EmptyState
            testId="map-mobile-empty-card"
            title="Map is ready"
            description="Search in chat — pins will appear here."
            icon={<MapPin className="size-6" />}
            className="pointer-events-auto max-w-xs bg-background/95"
          />
        </div>
      ) : null}
    </div>
  );
}

function subscribeLgUp(onChange: () => void) {
  const mq = window.matchMedia("(min-width: 1024px)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getLgUpSnapshot() {
  return window.matchMedia("(min-width: 1024px)").matches;
}

function getLgUpServerSnapshot() {
  return false;
}

/** MAP-007 mobile bottom sheet — map without covering chat input. */
export function MapMobileSheet() {
  const [userMapOpen, setUserMapOpen] = useState(false);
  const isLgUp = useSyncExternalStore(
    subscribeLgUp,
    getLgUpSnapshot,
    getLgUpServerSnapshot,
  );
  const { pins } = useMapContext();
  const pinCount = pins.filter((p) => p.source !== "mock").length;

  const sheetOpen = !isLgUp && userMapOpen;

  return (
    <div
      data-testid="map-mobile-controls"
      data-right-column-mode="map"
      className="pointer-events-none fixed bottom-[calc(7.5rem+env(safe-area-inset-bottom,0px))] right-4 z-40 lg:hidden"
    >
      <Button
        type="button"
        data-testid="map-sheet-trigger"
        className="pointer-events-auto h-11 gap-2 rounded-full px-4 shadow-lg"
        size="default"
        aria-label={pinCount > 0 ? `Open map with ${pinCount} pins` : "Open map"}
        aria-haspopup="dialog"
        aria-expanded={sheetOpen}
        aria-controls="map-sheet-content"
        onClick={() => setUserMapOpen(true)}
      >
        <Map className="size-4" aria-hidden />
        Open map
        {pinCount > 0 ? ` (${pinCount})` : ""}
      </Button>
      <Sheet open={sheetOpen} onOpenChange={setUserMapOpen}>
        <SheetContent
          id="map-sheet-content"
          side="bottom"
          className="flex max-h-[calc(85dvh-env(safe-area-inset-bottom,0px))] min-h-[75dvh] flex-col p-0 pb-[env(safe-area-inset-bottom,0px)]"
          data-testid="map-sheet-content"
        >
          <SheetHeader className="border-b border-border px-4 py-3 text-left">
            <SheetTitle>Map</SheetTitle>
            <SheetDescription>
              Tap a pin or close to return to chat. Escape closes this sheet.
            </SheetDescription>
          </SheetHeader>
          <MapSheetBody open={sheetOpen} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
