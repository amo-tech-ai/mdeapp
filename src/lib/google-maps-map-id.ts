/**
 * MAP-008 — production-safe Map ID for AdvancedMarker (vis.gl).
 * @see https://developers.google.com/maps/documentation/javascript/map-ids/mapid-over
 */

export const DEMO_MAP_ID = "DEMO_MAP_ID" as const;

function readMapIdEnv(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;
  const trimmed = raw?.trim();
  return trimmed || undefined;
}

/** Vercel preview/production must not silently use DEMO_MAP_ID. */
export function isProductionLikeEnv(): boolean {
  if (process.env.NODE_ENV === "production") return true;
  const vercel = process.env.VERCEL_ENV ?? process.env.NEXT_PUBLIC_VERCEL_ENV;
  return vercel === "production" || vercel === "preview";
}

/**
 * Map ID for `<Map mapId={...}>`.
 * - Env set → always use it.
 * - Dev/test unset → DEMO_MAP_ID + warn.
 * - Production/preview unset → undefined + error (no silent demo map).
 */
export function getGoogleMapsMapId(): string | undefined {
  const mapId = readMapIdEnv();
  if (mapId) return mapId;

  if (!isProductionLikeEnv()) {
    if (typeof console !== "undefined") {
      console.warn(
        "[mdeai maps] NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID missing — using DEMO_MAP_ID (dev/test only). " +
          "Create a Map ID at https://console.cloud.google.com/google/maps-apis/studio/maps",
      );
    }
    return DEMO_MAP_ID;
  }

  if (typeof console !== "undefined") {
    console.error(
      "[mdeai maps] NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID is required in production/preview. " +
        "AdvancedMarker will not load without a real Map ID.",
    );
  }
  return undefined;
}

/** True when a non-demo Map ID is configured (Playwright / env checks). */
export function hasConfiguredMapId(): boolean {
  const id = getGoogleMapsMapId();
  return Boolean(id && id !== DEMO_MAP_ID);
}
