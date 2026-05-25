const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Route param may be shareable slug or legacy EventCard UUID link. */
export function isEventLookupUuid(value: string): boolean {
  return UUID_RE.test(value);
}
