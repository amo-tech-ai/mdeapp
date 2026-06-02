export const MEDELLIN_CENTER = { lat: 6.2442, lng: -75.5812 } as const;

export const DEFAULT_MAP_ZOOM = 13;

let warnedMissingMapsApiKey = false;

export function getGoogleMapsApiKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (
    !key &&
    process.env.NODE_ENV === "development" &&
    !warnedMissingMapsApiKey
  ) {
    warnedMissingMapsApiKey = true;
    console.warn(
      "[maps] NEXT_PUBLIC_GOOGLE_MAPS_API_KEY not set; map disabled",
    );
  }
  return key;
}

export {
  DEMO_MAP_ID,
  getGoogleMapsMapId,
  hasConfiguredMapId,
} from "@/lib/google-maps-map-id";

export const MOCK_LAYOUT_PIN = {
  id: "mock-laureles-pin",
  category: "rental" as const,
  lat: 6.252,
  lng: -75.591,
  title: "Laureles — map ready",
  subtitle: "MAP-001 smoke pin",
  source: "mock" as const,
};
