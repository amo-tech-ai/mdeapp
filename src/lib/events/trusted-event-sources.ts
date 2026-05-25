/**
 * F40 — trusted Medellín event source registry (prompt-only Phase 1).
 * Source: tasks/events/41-event-links.md
 */

export type EventSourceTier =
  | "official"
  | "ticketing"
  | "nightlife"
  | "tech"
  | "tourism"
  | "community";

export type TrustedEventSource = {
  id: string;
  name: string;
  url: string;
  tier: EventSourceTier;
  categories: string[];
  locale: "en" | "es" | "both";
};

const TIER_ORDER: Record<EventSourceTier, number> = {
  official: 0,
  ticketing: 1,
  nightlife: 2,
  tech: 3,
  tourism: 4,
  community: 5,
};

export const TRUSTED_EVENT_SOURCES: readonly TrustedEventSource[] = [
  { id: "medellin-travel-cal", name: "Medellín Travel Calendar", url: "https://www.medellin.travel/calendario-eventos/", tier: "official", categories: ["culture", "festival", "all"], locale: "both" },
  { id: "medellin-travel-fairs", name: "Medellín Travel Fairs", url: "https://www.medellin.travel/fairs-and-festivals/?lang=en", tier: "official", categories: ["culture", "festival"], locale: "en" },
  { id: "plaza-mayor", name: "Plaza Mayor Events", url: "https://plazamayor.com.co/eventos-pm/", tier: "official", categories: ["culture", "conference", "all"], locale: "es" },
  { id: "inder", name: "INDER Medellín", url: "https://www.inder.gov.co/", tier: "official", categories: ["sport", "all"], locale: "es" },
  { id: "metro-medellin", name: "Metro Medellín Events", url: "https://www.metrodemedellin.gov.co/en/users/what-to-do-and-where-to-go-in-medellin/events-and-shows", tier: "official", categories: ["culture", "all"], locale: "en" },
  { id: "eventbrite-med", name: "Eventbrite Medellín", url: "https://www.eventbrite.com/d/colombia--medell%C3%ADn/events/", tier: "ticketing", categories: ["music", "nightlife", "tech", "all"], locale: "en" },
  { id: "eventbrite-week", name: "Eventbrite This Week", url: "https://www.eventbrite.com/d/colombia--medell%C3%ADn/events--this-week/", tier: "ticketing", categories: ["all"], locale: "en" },
  { id: "tuboleta", name: "TuBoleta", url: "https://www.tuboleta.com/", tier: "ticketing", categories: ["music", "sport", "all"], locale: "es" },
  { id: "tuticket", name: "TuTicket", url: "https://tuticket.com.co/", tier: "ticketing", categories: ["music", "sport", "all"], locale: "es" },
  { id: "ticketexpress", name: "TicketExpress", url: "https://ticketexpress.com.co/", tier: "ticketing", categories: ["music", "all"], locale: "es" },
  { id: "latiquetera", name: "La Tiquetera", url: "https://latiquetera.com/events/search?search=medellin", tier: "ticketing", categories: ["music", "nightlife", "all"], locale: "es" },
  { id: "ra-med", name: "Resident Advisor Medellín", url: "https://ra.co/events/co/medellin", tier: "nightlife", categories: ["nightlife", "music"], locale: "en" },
  { id: "songkick", name: "Songkick Medellín", url: "https://www.songkick.com/es/metro-areas/28331-colombia-medellin", tier: "nightlife", categories: ["music"], locale: "both" },
  { id: "bandsintown", name: "Bandsintown Medellín", url: "https://www.bandsintown.com/c/medellin-colombia", tier: "nightlife", categories: ["music"], locale: "en" },
  { id: "meetup", name: "Meetup Medellín", url: "https://www.meetup.com/find/?location=co--medellin", tier: "tech", categories: ["tech", "networking"], locale: "en" },
  { id: "luma", name: "Luma Medellín", url: "https://luma.com/medellin", tier: "tech", categories: ["tech", "networking"], locale: "en" },
  { id: "mdecommunity", name: "MDE Community", url: "https://www.mdecommunity.com/communities", tier: "tech", categories: ["networking", "tech"], locale: "en" },
  { id: "startco", name: "StartCo Plaza Mayor", url: "https://plazamayor.com.co/eventos/startco-2026/", tier: "tech", categories: ["tech", "startup"], locale: "es" },
  { id: "digitalex", name: "DigitalEx Plaza Mayor", url: "https://plazamayor.com.co/eventos/digitalex/", tier: "tech", categories: ["tech", "conference"], locale: "es" },
  { id: "fever", name: "Fever Medellín", url: "https://feverup.com/en/medellin", tier: "tourism", categories: ["culture", "food", "all"], locale: "en" },
  { id: "allevents", name: "AllEvents Medellín", url: "https://allevents.in/medellin", tier: "tourism", categories: ["all"], locale: "en" },
  { id: "medellin-co", name: "Medellin.co Events", url: "https://medellin.co/events/", tier: "tourism", categories: ["culture", "all"], locale: "both" },
  { id: "spanglish", name: "Spanglish Events", url: "https://www.spanglishevents.com/", tier: "community", categories: ["networking", "culture"], locale: "en" },
  { id: "medellingles", name: "Medellín Events Calendar", url: "https://medellingles.substack.com/p/medellin-events-calendar", tier: "community", categories: ["all"], locale: "en" },
] as const;

export const EVENT_DISCOVERY_CRITICAL_RULES = `
# Event discovery — critical rules (F40)
- Never invent events, venues, prices, or URLs.
- Never say "Found N events" unless search-events ran in the SAME turn.
- Prefer Supabase approved events via search-events first — tool results are the only truth.
- Return max 5–10 cards; prioritize events in the next 30 days.
- Deduplicate by title + date + venue when merging sources (future web discovery).
- Include source URL on cards when available (mapsUrl or mdeai event page).
- English-only copy in Phase 1.
`.trim();

const CATEGORY_ALIASES: Record<string, string[]> = {
  music: ["music"],
  nightlife: ["nightlife", "music"],
  sport: ["sport"],
  sports: ["sport"],
  food: ["food"],
  culture: ["culture", "festival"],
  festival: ["culture", "festival"],
  tech: ["tech", "startup", "networking"],
  networking: ["networking", "tech"],
  startup: ["tech", "startup"],
  all: ["all"],
};

/** Ordered trusted sources for a category (Supabase-first; external refs for prompt hints). */
export function sourcePriorityForCategory(category: string): TrustedEventSource[] {
  const key = category.toLowerCase();
  const tags = CATEGORY_ALIASES[key] ?? [key];
  const matched = TRUSTED_EVENT_SOURCES.filter((s) =>
    s.categories.some((c) => tags.includes(c) || c === "all"),
  );
  return [...matched].sort(
    (a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier],
  );
}

/** Prompt block injected into concierge / event agents. */
export function formatEventSourcePromptHint(category?: string): string {
  const sources = category
    ? sourcePriorityForCategory(category).slice(0, 5)
    : TRUSTED_EVENT_SOURCES.filter((s) => s.tier === "official" || s.tier === "ticketing").slice(0, 5);
  const lines = sources.map((s) => `- ${s.name}: ${s.url}`).join("\n");
  return `${EVENT_DISCOVERY_CRITICAL_RULES}\n\nReference sources (prompt-only until F42 web discovery):\n${lines}`;
}
