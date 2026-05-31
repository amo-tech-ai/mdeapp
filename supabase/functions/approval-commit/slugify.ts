/** Deno copy — keep in sync with mdeapp/src/lib/events/slugify-event-title.ts */
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
