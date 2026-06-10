# Venue roadmap

**PRD:** [venue-management-prd-v1.md](./venue-management-prd-v1.md)

## Principles

1. **Tickets before venue OS** — G1–G5 green before archive 036+.  
2. **Maps spine before layouts** — EVT-039–044 before 040–041.  
3. **Deterministic booking before AI optimizer** — 041 before 043.  
4. **Propose-only AI** — Mastra/OpenClaw never own calendar truth.

## Phase 0 — Foundation (done / in repo)

| Item | Evidence |
|------|----------|
| `event_venues` table + RLS | `20260503011925_event_phase1.sql` |
| `events.venue_id` | Same migration |
| Medellín seed venues | `20260513100000_seed_medellin_events_h2_2026.sql` |

## Phase 1 — MVP maps + picker (NOW)

**Queue:** `V2-tasks/advanced/` **EVT-039–044**  
**Blocked by:** Map ID prod, Places masks verified, host wizard route exists (EVT-027+)

| EVT | Deliverable | Effort |
|-----|-------------|--------|
| 039 | Venue picker + Autocomplete UI | M |
| 040 | Places (New) server masks | M |
| 041 | places_cache TTL | S |
| 042 | Persist `placeUri` on venue/event | S |
| 043 | Map + Advanced Markers on EventDetail | M |
| 044 | Nearby POI cards | M |

**Migration (add to EVT-039 or small migration):**

```sql
ALTER TABLE public.event_venues
  ADD COLUMN IF NOT EXISTS google_place_id text,
  ADD COLUMN IF NOT EXISTS maps_link_uri text,
  ADD COLUMN IF NOT EXISTS place_cache_id uuid REFERENCES public.places_cache(id);
```

**Exit criteria:** 95% published events have geo + map renders + Lighthouse map panel a11y; `npm run floor` green.

## Phase 2 — Venue library ops (CORE)

**Queue:** `tasks/archive/036`–`042` (re-open as new EVT series when scheduled)

| Order | Task | Depends |
|-------|------|---------|
| 1 | 036 resources | 001 schema |
| 2 | 037 staff | 036 |
| 3 | 038 availability | 036 |
| 4 | 039 `/host/venues` UI | 036–038 |
| 5 | 040 layouts | 039 |
| 6 | 041 bookings `EXCLUDE` | 038, 040 |
| 7 | 042 analytics | 041 |

**Exit criteria:** Organizer runs 2 events same venue without double-book; dashboard shows utilization %.

## Phase 3 — AI + automation (ADVANCED)

| Item | Track |
|------|-------|
| 043 `ai-venue-optimizer` edge | Gemini propose-only |
| 044 `ai-venue-layout-generator` | Gemini + Storage |
| Mastra venue agents | [venue-agents-architecture.md](./venue-agents-architecture.md) |
| OpenClaw venue reminders | [venue-automation-strategy.md](./venue-automation-strategy.md) |
| Hermes utilization features | Read-only |

## Phase 4 — Enterprise

- Multi-org venue admin  
- Public booking requests + approval  
- Contract templates (reuse sponsor 055–057)  

## What is overengineering for Medellín MVP

- iCal RRULE sync to Google Calendar (38) before 10 organizers request it  
- 3D floor plan editor  
- PMS two-way sync  
- AI demand forecasting  

## Dangerous too early

- Public venue booking without payment + contract flow  
- AI auto-confirm booking  
- OpenClaw mass messaging to venue cold leads  

## Success gates per phase

| Phase | Gate |
|-------|------|
| 1 | Map screenshot + Places MCP verified masks |
| 2 | Double-book integration test passes |
| 3 | `verify:mastra` + no layout auto-write without Apply |
| 4 | Legal review on public booking ToS |
