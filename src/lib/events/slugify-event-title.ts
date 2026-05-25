/** URL slug for new host events (ASCII, lowercase, hyphenated). */
export function slugifyEventTitle(title: string): string {
  const base = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  const suffix = Date.now().toString(36).slice(-6);
  return base ? `${base}-${suffix}` : `event-${suffix}`;
}
