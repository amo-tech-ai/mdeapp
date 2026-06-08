"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { MapRefererHelp } from "@/components/maps/map-referer-help";
import { useMapsAuthFailure } from "@/components/maps/use-maps-auth-failure";
import { getGoogleMapsApiKey } from "@/platform/maps/map-config";

/** Google Maps JS API — map panel only. Pin state lives in MapContextProvider above CopilotSidebar. */
export function MapsShell({ children }: { children: React.ReactNode }) {
  const apiKey = getGoogleMapsApiKey();
  const authFailed = useMapsAuthFailure();

  if (!apiKey) {
    return (
      <div
        data-testid="map-env-error"
        className="flex h-full min-h-[280px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground"
      >
        <p>
          Map unavailable: set{" "}
          <code className="text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> and{" "}
          <code className="text-xs">NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID</code> in{" "}
          <code className="text-xs">mdeapp/.env.local</code>.
        </p>
      </div>
    );
  }

  if (authFailed) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <MapRefererHelp />
      </div>
    );
  }

  return (
    <APIProvider
      apiKey={apiKey}
      libraries={["marker"]}
    >
      {children}
    </APIProvider>
  );
}
