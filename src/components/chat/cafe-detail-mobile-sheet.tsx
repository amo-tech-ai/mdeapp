"use client";

import { useSyncExternalStore } from "react";
import { CafeDetailPanel } from "@/components/cafe/cafe-detail-panel";
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

/** Mobile bottom sheet for café detail — desktop uses ChatMapPanel. */
export function CafeDetailMobileSheet() {
  const { cafeDetail, cafeSiblings, closeCafeDetail } = useRentalUi();
  const isLgUp = useSyncExternalStore(
    subscribeLgUp,
    getLgUpSnapshot,
    getLgUpServerSnapshot,
  );
  const sheetOpen = !isLgUp && cafeDetail != null;

  return (
    <div className="lg:hidden" data-testid="cafe-detail-mobile-mount">
      <Sheet
        open={sheetOpen}
        onOpenChange={(open) => {
          if (!open) closeCafeDetail();
        }}
      >
        <SheetContent
          side="bottom"
          className="flex max-h-[90vh] min-h-[60vh] flex-col p-0"
          data-testid="cafe-detail-mobile-sheet"
        >
          {cafeDetail ? (
            <>
              <SheetHeader className="sr-only">
                <SheetTitle>{cafeDetail.title}</SheetTitle>
                <SheetDescription>Café detail</SheetDescription>
              </SheetHeader>
              <CafeDetailPanel
                detail={cafeDetail}
                siblings={cafeSiblings}
                className="min-h-0 flex-1"
              />
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
