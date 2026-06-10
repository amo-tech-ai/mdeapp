---
id: EVP-020-mvp
linear: SAN-123
legacy_id: EVT-D02
title: Discovered events data model + RLS
status: Not Started
priority: P2
phase: Post-MVP
effort: 2d
depends_on: [EVP-019-mvp-research-official-docs]
parent_pack: EVP-018-mvp-event-web-discovery-task-pack.md
plans:
  - ../../plan/events/event-discovery/10-event-discover-plan.md §7
skill:
  - mde-supabase
  - pgvector
---

# EVP-020-mvp — Data model

> Align with [10-event-discover-plan.md](../../plan/events/event-discovery/10-event-discover-plan.md) §7. Prefer **`event_sources`**, **`raw_events`**, extend **`events`**, **`event_venues`**, **`event_scrape_jobs`**, **`event_runs`** — map legacy names below if migration already uses `discovered_*`.

## Tables (canonical — plan 10)

| Table | Purpose |
|-------|---------|
| `event_sources` | Eventbrite, RA, medellin.travel, … |
| `raw_events` | Scrape payload + `external_id` |
| `events` | Extend: `source_id`, `source_url`, `discovery_status`, `place_id`, `last_scraped_at` |
| `event_venues` | Canonical venue + `place_id` |
| `event_tags` / M2M | family-friendly, nightlife, … |
| `event_scrape_jobs` | Per-source job status |
| `event_runs` | Pipeline audit |
| `event_quality_scores` | freshness, trust, dedupe |
| `event_embeddings` | **Phase 2** — `pgvector` skill |

## Legacy / alternate names (F-39)

| Table | Purpose |
|-------|---------|
| `discovered_events` | Normalized candidate events from web |
| `discovered_event_sources` | URL + tier + fetch metadata |
| `event_source_snapshots` | Raw JSON snapshot per fetch |
| `event_dedupe_matches` | Cluster duplicates |
| `event_approval_queue` | Pending human review |

## Each table spec must include

- Columns + types + indexes
- RLS enabled + policies (anon read none; authenticated insert own; admin approve)
- Unique constraints (source_url + start_time hash)
- Freshness TTL (e.g. 7d stale)
- Approval lifecycle: `pending → approved → rejected → expired`

## Acceptance criteria

- [ ] Migration SQL in `mdeapp/supabase/migrations/`
- [ ] RLS advisor clean via Supabase MCP
- [ ] ERD mermaid in spec evidence
- [ ] No prod apply without review
