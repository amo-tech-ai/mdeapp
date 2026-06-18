"use client";

import { useEffect, useMemo } from "react";
import { AdvancedMarker, Map, useMap } from "@vis.gl/react-google-maps";
import type { BrokerListingDetail } from "@/lib/rentals/broker-listing-detail";
import { MapsShell } from "@/components/maps/MapProvider";
import { CategoryMapMarker } from "@/components/maps/markers/CategoryMapMarker";
import {
  DEFAULT_MAP_ZOOM,
  getGoogleMapsMapId,
  MEDELLIN_CENTER,
} from "@/platform/maps/map-config";

type RentalsListingsMapProps = {
  listings: BrokerListingDetail[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function MapSelectionPan({
  selectedId,
  pins,
}: {
  selectedId: string | null;
  pins: BrokerListingDetail[];
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !selectedId) return;
    const sel = pins.find((p) => p.id === selectedId);
    if (
      sel?.latitude != null &&
      sel.longitude != null &&
      Number.isFinite(sel.latitude) &&
      Number.isFinite(sel.longitude)
    ) {
      map.panTo({ lat: sel.latitude, lng: sel.longitude });
    }
  }, [map, selectedId, pins]);

  return null;
}

function BrokerListingsMapInner({
  listings,
  selectedId,
  onSelect,
}: RentalsListingsMapProps) {
  const mapId = getGoogleMapsMapId();
  const pins = useMemo(
    () =>
      listings.filter(
        (l) => l.latitude != null && l.longitude != null && Number.isFinite(l.latitude) && Number.isFinite(l.longitude),
      ),
    [listings],
  );

  const center = useMemo(() => {
    if (selectedId) {
      const sel = pins.find((p) => p.id === selectedId);
      if (sel?.latitude != null && sel.longitude != null) {
        return { lat: sel.latitude, lng: sel.longitude };
      }
    }
    if (pins.length > 0) {
      return { lat: pins[0]?.latitude, lng: pins[0]?.longitude };
    }
    return MEDELLIN_CENTER;
  }, [pins, selectedId]);

  return (
    <div
      data-testid="rentals-listings-map"
      className="relative h-full min-h-[280px] w-full overflow-hidden rounded-lg border border-border"
    >
      <Map
        mapId={mapId}
        defaultCenter={center}
        defaultZoom={DEFAULT_MAP_ZOOM}
        gestureHandling="greedy"
        disableDefaultUI
        className="h-full w-full"
      >
        <MapSelectionPan selectedId={selectedId} pins={pins} />
        {pins.map((listing) => (
          <AdvancedMarker
            key={listing.id}
            position={{
              lat: listing.latitude != null ? listing.latitude : 0,
              lng: listing.longitude != null ? listing.longitude : 0
            }}
            onClick={() => onSelect(listing.id)}
          >
            <CategoryMapMarker
              pinId={listing.id}
              category="rental"
              title={listing.title}
              selected={selectedId === listing.id}
              dimmed={false}
            />
          </AdvancedMarker>
        ))}
      </Map>
    </div>
  );
}

export function RentalsListingsMap(props: RentalsListingsMapProps) {
  return (
    <MapsShell>
      <BrokerListingsMapInner {...props} />
    </MapsShell>
  );
}
