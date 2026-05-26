import type { Cluster, ClusterStats, Marker } from "@googlemaps/markerclusterer";

/** MAP-009 — disable with NEXT_PUBLIC_MAP_CLUSTERING=0 */
export function mapClusteringEnabled(): boolean {
  return process.env.NEXT_PUBLIC_MAP_CLUSTERING !== "0";
}

/** Cluster when enough pins overlap at city zoom (café/rental searches). */
export const MAP_CLUSTER_MIN_PINS = 4;

export function shouldClusterMapPins(pinCount: number): boolean {
  return mapClusteringEnabled() && pinCount >= MAP_CLUSTER_MIN_PINS;
}

const PAISA_CLUSTER_FILL = "#0f766e";

/** Paisa teal cluster badge for AdvancedMarker maps. */
export function createPaisaClusterRenderer(): {
  render: (cluster: Cluster, stats: ClusterStats, map: google.maps.Map) => Marker;
} {
  return {
    render({ count, position }, _stats, map) {
      const svg = `<svg fill="${PAISA_CLUSTER_FILL}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="44" height="44">
<circle cx="120" cy="120" opacity=".55" r="70" />
<circle cx="120" cy="120" opacity=".25" r="95" />
<text x="50%" y="50%" style="fill:#fff;font-weight:600" text-anchor="middle" font-size="52" dominant-baseline="middle" font-family="system-ui,sans-serif">${count}</text>
</svg>`;
      const title = `${count} places`;
      const zIndex = 1000 + count;
      const parser = new DOMParser();
      const svgEl = parser.parseFromString(svg, "image/svg+xml").documentElement;
      return new google.maps.marker.AdvancedMarkerElement({
        map,
        position,
        zIndex,
        title,
        content: svgEl,
      });
    },
  };
}
