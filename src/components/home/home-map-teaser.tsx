"use client";

import { useRouter } from "next/navigation";
import { Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { MapsShell } from "@/components/maps/MapProvider";
import { MEDELLIN_CENTER, getGoogleMapsMapId } from "@/platform/maps/map-config";

const TEASER_PINS = [
  { id: "laureles",  lat: 6.2516, lng: -75.5918, label: "Rentals in Laureles",           query: "Rentals in Laureles" },
  { id: "poblado",   lat: 6.2099, lng: -75.5686, label: "Rooftop bars in El Poblado",    query: "Rooftop bars in El Poblado" },
  { id: "envigado",  lat: 6.1752, lng: -75.5927, label: "Local eats in Envigado",        query: "Restaurants in Envigado" },
  { id: "centro",    lat: 6.2518, lng: -75.5636, label: "Events at El Centro",           query: "Events at El Centro Medellín" },
  { id: "provenza",  lat: 6.2075, lng: -75.5699, label: "Cafés near Provenza",           query: "Cafés near Provenza Medellín" },
] as const;

function TeaserPin({ label }: { label: string }) {
  return (
    <div
      aria-label={label}
      className="flex size-4 cursor-pointer items-center justify-center rounded-full bg-primary shadow-md ring-2 ring-background transition-transform duration-150 hover:scale-125 motion-reduce:hover:scale-100"
    />
  );
}

function MapTeaser() {
  const router = useRouter();
  const mapId = getGoogleMapsMapId();

  return (
    <div className="relative h-[260px] w-full overflow-hidden rounded-2xl border border-border sm:h-[320px] md:h-[380px]">
      <Map
        mapId={mapId}
        defaultCenter={MEDELLIN_CENTER}
        defaultZoom={12}
        gestureHandling="none"
        disableDefaultUI
        className="h-full w-full"
        aria-label="Map of Medellín showing popular areas"
      >
        {TEASER_PINS.map(({ id, lat, lng, label, query }) => (
          <AdvancedMarker
            key={id}
            position={{ lat, lng }}
            onClick={() => router.push(`/chat?q=${encodeURIComponent(query)}`)}
          >
            <TeaserPin label={label} />
          </AdvancedMarker>
        ))}
      </Map>
      <div className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-border bg-background/80 px-2.5 py-1 text-xs text-muted-foreground backdrop-blur-sm">
        ▣ Google Maps
      </div>
    </div>
  );
}

export function HomeMapTeaser() {
  return (
    <section
      aria-label="Live map of Medellín"
      className="bg-muted/40 py-10 md:py-12"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground md:text-lg">
              See it on the map
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Tap a pin to ask the concierge about that area.
            </p>
          </div>
        </div>
        <MapsShell>
          <MapTeaser />
        </MapsShell>
      </div>
    </section>
  );
}
