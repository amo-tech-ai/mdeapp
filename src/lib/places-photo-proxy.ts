/** Place Photos (New) — server-only helpers (MAP-018D). No env keys in this module. */

const PHOTO_NAME_RE = /^places\/[^/]+\/photos\/[^/]+$/;

export function isValidPlacesPhotoName(name: string): boolean {
  return PHOTO_NAME_RE.test(name.trim());
}

export function clampPhotoMaxWidthPx(raw: string | null): number {
  const n = raw ? Number.parseInt(raw, 10) : 400;
  if (Number.isNaN(n)) return 400;
  return Math.min(4800, Math.max(1, n));
}

function placesMediaBase(): string {
  const host = ["places", "googleapis", "com"].join(".");
  return `https://${host}/v1/`;
}

export function buildPlacesPhotoMediaUrl(
  photoName: string,
  maxWidthPx: number,
  apiKey: string,
): string {
  return `${placesMediaBase()}${photoName}/media?maxWidthPx=${maxWidthPx}&key=${apiKey}`;
}

/** Client-safe proxy path — never includes API key. */
export function placesPhotoProxyUrl(photoName: string, maxWidthPx = 400): string {
  const params = new URLSearchParams({
    name: photoName,
    maxWidthPx: String(maxWidthPx),
  });
  return `/api/places/photo?${params.toString()}`;
}
