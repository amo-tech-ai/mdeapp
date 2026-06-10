---
id: EVP-007-core
legacy_id: F40
title: Event discovery agent prompt + trusted source registry
status: Done
priority: P2
phase: Post-MVP — event discovery quality
effort: 3–5h
depends_on:
  - EVP-006-core
  - EVP-005-core
source_notes: ./41-event-links.md
skill:
  - mastra
  - gemini
  - mde-firecrawl
target_files:
  - mdeapp/src/mastra/agents/concierge.ts
  - mdeapp/src/mastra/agents/event-agent.ts
  - mdeapp/src/lib/events/trusted-event-sources.ts
  - docs/events/trusted-sources.md
---

# EVP-007-core — Event discovery agent prompt + trusted source registry

## Purpose

Codify the **event discovery agent system prompt** and **trusted Medellín source URL registry** from [`41-event-links.md`](./docs/41-event-links.md) so agents cite real sources, never invent events, and route category → source priority correctly.

**Phase 1 scope:** prompt + static registry + Supabase `search-events` behavior alignment. **No** live scraping of external sites yet (see EVP-018-mvp pack).

## User story

As **Camila**, when I ask for nightlife or tech events, I want answers grounded in real ticketing/tourism sources — not hallucinated venues.

## Build scope

### Trusted source registry

New `src/lib/events/trusted-event-sources.ts`:

| Tier | Examples from 41-event-links |
|------|------------------------------|
| Official | medellin.travel, plazamayor.com.co, inder.gov.co, metrodemedellin.gov.co |
| Ticketing | eventbrite, tuboleta, tuticket, ticketexpress, latiquetera |
| Nightlife/music | ra.co, songkick, bandsintown |
| Tech/networking | meetup, luma, mdecommunity |
| Tourism | feverup, allevents.in |

Export:

- `TRUSTED_EVENT_SOURCES[]` with `{ id, url, tier, categories[], locale }`
- `sourcePriorityForCategory(category)` → ordered URL list for prompt injection

Mirror human-readable list in `docs/events/trusted-sources.md` (no secrets).

### Agent instructions

Merge into `concierge.ts` / `event-agent.ts` (English-only Phase 1):

**Critical rules (from 41-event-links):**

- Never invent events
- Never say "Found X events" without `search-events` tool in same turn
- Prefer Supabase approved events first (`search-events`)
- Max 5–10 cards; prioritize next 30 days
- Deduplicate by title + date + venue when merging sources (future)
- Include source URL on cards when available from DB `maps_url` / metadata

**Search strategy hints (prompt-only until grounding):**

| Category | Priority sources (reference) |
|----------|------------------------------|
| Music/nightlife | RA, Songkick, Eventbrite |
| Tech/networking | Meetup, Luma, MDE Community |
| Festivals/culture | Medellin Travel, Plaza Mayor, Fever |
| Sports | INDER, Eventbrite, Tuboleta |

### Tool output

Ensure `search-events` returns fields needed for cards:

- title, category, startsAt, venue, neighborhood, ticket/free flag, source URL, tags, imageUrl

Gap-fill any missing mapper fields vs `41-event-links` OUTPUT FORMAT.

## Acceptance criteria

- [ ] Registry file lists ≥20 sources from 41-event-links with tiers
- [ ] Agent prompt includes CRITICAL RULES block verbatim (adapted for Supabase-first)
- [ ] `search-events` cards show source link when row has URL
- [ ] No agent claims external events not in tool result
- [ ] `npm run floor` exit 0

## Tests

- [ ] Vitest: `sourcePriorityForCategory('nightlife')` returns RA/Eventbrite tier
- [ ] Vitest: registry URLs are valid https
- [ ] SCREEN-006 still passes for Supabase-backed search

## Evidence

- [ ] `tasks/notes/EVP-007-core-evidence.md`

## Do not do

- Do not scrape external URLs in Phase 1
- Do not write discovered events to Supabase without approval (EVP-018-mvp EVP-026-mvp)
- Do not expose service-role keys

## Dependencies on EVP-018-mvp

| EVP-007-core (this) | EVP-018-mvp pack |
|------------|----------|
| Prompt + registry | ADK SearchAgent, grounding, dedupe tables |
