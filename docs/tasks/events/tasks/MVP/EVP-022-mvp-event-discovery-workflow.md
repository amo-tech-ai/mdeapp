---
id: EVP-022-mvp
linear: SAN-125
legacy_id: EVT-D03
title: eventDiscoveryWorkflow (Mastra)
status: Not Started
priority: P2
phase: Post-MVP
effort: 3d
depends_on: [EVP-020-mvp-discovered-events-data-model, EVP-005-core-event-tool-and-workflow]
parent_pack: EVP-018-mvp-event-web-discovery-task-pack.md
plans:
  - ../../plan/events/event-discovery/10-event-discover-plan.md §6 §8
skill:
  - mastra
  - mde-firecrawl
  - gemini
---

# EVP-022-mvp — `eventDiscoveryWorkflow`

> **Two workflows** (plan 10): **(A) daily ingest** batch — scrape → normalize → dedupe → enrich → approval queue; **(B) runtime chat** — already `search-events` + optional web grounding (EVP-015/021). This task owns **(A)** primarily.

## Batch ingest steps (EVD-03..08)

1. `scrapeEventsWorkflow` — Eventbrite, RA.co, medellin.travel → `raw_events`
2. `normalizeEventsWorkflow` — Bogota TZ, `source_url` required
3. `dedupeEventsWorkflow` — fuzzy title + date + venue
4. `enrichVenueWorkflow` — delegate EVP-024
5. `rankEventsWorkflow` — quality_score rules; optional Gemini one-liner on candidates
6. Write `event_scrape_jobs` / `event_runs` audit rows
7. Notify Patricia (EVP-026 / OCL-042)

## Runtime chat (existing — do not break)

1. `search-events` / fast path (EVP-005, EVP-006)
2. Optional web grounding when SQL thin (EVP-021, C-004)
3. Cards + pins via CopilotKit (EVP-025)

## Files

- `mdeapp/src/mastra/workflows/event-discovery-workflow.ts` (extend or new)
- Register in `mdeapp/src/mastra/index.ts`

## Acceptance criteria

- [ ] Vitest workflow steps with mocked ADK
- [ ] Supabase-first: empty web still returns DB events
- [ ] `event_discovery_runs` row per execution
- [ ] Feature flag off → legacy EVP-005-core path only
