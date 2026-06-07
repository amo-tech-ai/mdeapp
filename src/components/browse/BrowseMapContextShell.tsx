"use client";

import type { ReactNode } from "react";
import { MapContextProvider } from "@/platform/maps/map-context";
import { MapsShell } from "@/components/maps/MapProvider";

export function BrowseMapContextShell({ children }: { children: ReactNode }) {
  return (
    <MapContextProvider seedMockPin={false}>
      <MapsShell>{children}</MapsShell>
    </MapContextProvider>
  );
}
