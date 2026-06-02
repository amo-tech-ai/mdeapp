"use client";

import { useSyncExternalStore } from "react";
import { NightlifeDetailPanel } from "@/components/nightlife/nightlife-detail-panel";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRentalUi } from "@/components/chat/rental-ui-context";

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

export function NightlifeDetailMobileSheet() {
  const { nightlifeDetail, nightlifeSiblings, closeNightlifeDetail } =
    useRentalUi();
  const isLgUp = useSyncExternalStore(
    subscribeLgUp,
    getLgUpSnapshot,
    getLgUpServerSnapshot,
  );
  const sheetOpen = !isLgUp && nightlifeDetail != null;

  return (
    <div className="lg:hidden" data-testid="nightlife-detail-mobile-mount">
      <Sheet
        open={sheetOpen}
        onOpenChange={(open) => {
          if (!open) closeNightlifeDetail();
        }}
      >
        <SheetContent
          side="bottom"
          className="flex max-h-[90vh] min-h-[60vh] flex-col p-0"
          data-testid="nightlife-detail-mobile-sheet"
        >
          {nightlifeDetail ? (
            <>
              <SheetHeader className="sr-only">
                <SheetTitle>{nightlifeDetail.title}</SheetTitle>
                <SheetDescription>Nightlife venue detail</SheetDescription>
              </SheetHeader>
              <NightlifeDetailPanel
                detail={nightlifeDetail}
                siblings={nightlifeSiblings}
                className="min-h-0 flex-1"
              />
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
