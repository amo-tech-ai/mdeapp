"use client";

import { useEffect } from "react";
import { useMapContext } from "@/platform/maps/map-context";

// Scrolls the matching card into view when the user clicks a map pin.
// Uses focusPinId (set only by panToPin/pin-click) to avoid scrolling on card hover.
export function useBrowseCardScroll() {
  const { focusPinId, clearFocusPinRequest } = useMapContext();

  useEffect(() => {
    if (!focusPinId) return;
    const card = document.querySelector(`[data-pin-id="${focusPinId}"]`);
    if (card instanceof HTMLElement) {
      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    clearFocusPinRequest();
  }, [focusPinId, clearFocusPinRequest]);
}
