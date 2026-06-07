"use client";

import type { ReactNode } from "react";
import { MapContextProvider } from "@/platform/maps/map-context";

// MapsShell (APIProvider) lives inside BrowseMapPanel/BrowseMapSheet so that
// a Maps auth failure only blocks the map tiles — never the card grid.
export function BrowseMapContextShell({ children }: { children: ReactNode }) {
  return (
    <MapContextProvider seedMockPin={false}>{children}</MapContextProvider>
  );
}
