---
task_id: data-034
mvp_step: 34
title: Maps geo inventory — inventory lat/lng + place_id coverage
layer: DATA
priority: P1
status: Done
estimated_effort: 3h
depends_on: ["data-001", "data-019", "data-012"]
unblocks: ["MAP-012"]
verified: 2026-05-29
evidence: ../evidence/data-034-maps-geo-inventory.md
skills: [mde-task-lifecycle, mde-supabase, mde-maps, task-verifier]
related:
  - ../../maps/docs/maps-audit-plan.md
  - ../../maps/docs/maps-prd.md
  - data-001-inventory.md
description: Matrix of geo columns on inventory tables that feed map pins — apartments, events, restaurants, tourist_destinations.
---

# DATA-034 — maps geo inventory

## Purpose

Sofía proves **Camila's rental pins**, **Roberto's event pins**, and **Tourist restaurant/attraction pins** have coordinates before MAP-012 neighborhood intel or new pin categories ship.

Complements **data-001** (venue kinds) and **data-019** (rentals) with a **map-pin lens**.

## Tables to audit

| Table | Geo columns | place_id column | Pin category | Persona |
|-------|-------------|-----------------|--------------|---------|
| `apartments` | `latitude`, `longitude` | optional | `rental` | Camila |
| `events` | via `event_venues` on `events.venue_id` | venue ref | `event` | Roberto / Tourist |
| `restaurants` | lat/lng | `google_place_id` | `restaurant` | Tourist |
| `tourist_destinations` | lat/lng | `google_place_id` | `attraction` | Tourist |

## Cache coverage (read-only)

Cross-check **data-007** after MAP-005 — snapshot counts for audit-2:

```sql
SELECT count(*) AS place_details_rows,
       count(*) FILTER (WHERE expires_at > now()) AS valid_details
FROM place_details_cache;

SELECT count(*) AS search_cache_rows,
       count(*) FILTER (WHERE expires_at > now()) AS valid_search
FROM places_search_cache;
```

Add to deliverable table:

| Cache | Valid rows | Notes |
|-------|----------:|-------|
| `place_details_cache` | | ADK sidecar writes today |
| `places_search_cache` | | Unused until MAP-005 |

## Queries to run (read-only)

```sql
-- Rentals pin-ready
SELECT count(*) AS total,
       count(*) FILTER (WHERE latitude IS NOT NULL AND longitude IS NOT NULL) AS with_coords
FROM apartments WHERE deleted_at IS NULL;

-- Events with venue coords (live schema: event_venues, not venues)
SELECT count(*) AS events_total,
       count(*) FILTER (WHERE ev.latitude IS NOT NULL) AS with_venue_coords
FROM events e
LEFT JOIN event_venues ev ON ev.id = e.venue_id;

-- Restaurants
SELECT count(*) AS total,
       count(*) FILTER (WHERE google_place_id IS NOT NULL) AS with_place_id,
       count(*) FILTER (WHERE latitude IS NOT NULL AND longitude IS NOT NULL) AS with_coords
FROM restaurants;

-- Tourist destinations
SELECT count(*) AS total,
       count(*) FILTER (WHERE latitude IS NOT NULL AND longitude IS NOT NULL) AS with_coords
FROM tourist_destinations;
```

## Deliverable

`tasks/data/evidence/data-034-maps-geo-inventory.md` with:

| Kind | Total rows | With lat/lng | With place_id | Gap action |
|------|-----------:|-------------:|--------------:|------------|
| rental | 44 | 44/44 | n/a | DATA-009 M3 indexes applied |
| event | 49 | 18/49 via venue | — | venue backfill optional |
| restaurant | 44 | 44/44 coords | 44/44 | DATA-004 verify-only |
| attraction | 23 | 23/23 | 23/23 | none |

Evidence: [`../evidence/data-034-maps-geo-inventory.md`](../evidence/data-034-maps-geo-inventory.md)

## Acceptance criteria

- [x] All four inventory kinds counted via Supabase MCP
- [x] Gap rows summarized (counts only)
- [ ] Linked from maps-audit-plan §6
- [x] DATA-009 M3 indexes applied (rental search)
- [x] Cache row counts in evidence (52 place_details, 33 places_search)
