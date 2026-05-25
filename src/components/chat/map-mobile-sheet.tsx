"use client";

import { useState } from "react";
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
  SheetTrigger,
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

/** MAP-007 mobile bottom sheet — map without covering CopilotKit input. */
export function MapMobileSheet() {
  const [open, setOpen] = useState(false);
  const { pins } = useMapContext();
  const pinCount = pins.filter((p) => p.source !== "mock").length;

  return (
    <div
      data-testid="map-mobile-controls"
      className="pointer-events-none fixed bottom-[7.5rem] right-4 z-40 lg:hidden"
    >
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              type="button"
              data-testid="map-sheet-trigger"
              className="pointer-events-auto h-11 gap-2 rounded-full px-4 shadow-lg"
              size="default"
              aria-label={
                pinCount > 0
                  ? `Open map with ${pinCount} pins`
                  : "Open map"
              }
            >
              <Map className="size-4" aria-hidden />
              Open map
              {pinCount > 0 ? ` (${pinCount})` : ""}
            </Button>
          }
        />
        <SheetContent
          side="bottom"
          className="flex max-h-[85vh] min-h-[75vh] flex-col p-0"
          data-testid="map-sheet-content"
        >
          <SheetHeader className="border-b border-border px-4 py-3 text-left">
            <SheetTitle>Map</SheetTitle>
            <SheetDescription>
              Tap a pin or close to return to chat. Escape closes this sheet.
            </SheetDescription>
          </SheetHeader>
          <MapSheetBody open={open} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
