/** MAP-019 — rollback to single Maps link when `false`. */
export function mapsDeepLinksEnabled(): boolean {
  return process.env.NEXT_PUBLIC_MAPS_DEEP_LINKS !== "false";
}
