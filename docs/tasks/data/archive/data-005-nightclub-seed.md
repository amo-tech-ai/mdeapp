---
task_id: data-005
mvp_step: 05
legacy_id: CAF-005
title: Nightclub / bar anchor seed + Places verify
layer: DATA
priority: P0
status: Done
estimated_effort: 1 day
depends_on: ["data-002", "data-009"]
unblocks: ["data-006", "MSV-001", "CKV-004"]
skills: [mde-task-lifecycle, mde-supabase, mde-maps]
mutation: seed
description: Curated nightclub/bar rows in venue_anchors (kind=nightclub) — Places-verified place_ids; not ticketed events. Requires DATA-009 M2 table.
---

# DATA-005 — nightclub seed


## At a glance

| | |
|---|---|
| **For** | Tourist (nightlife) |
| **Surface** | `/chat` nightlife (SCREEN-022) |
| **Layer** | DATA |

## What we're building

Anchor seed for clubs/bars into **`public.venue_anchors`** (`kind = 'nightclub'`) — places, not ticketed events. Inserts via **service_role** only (RLS: no anon/authenticated write on anchors).

## Features

- Seed `seeds/nightclubs-medellin.csv`
- place_ids for MSV-001 nightlife intent evals
- Explicit exclude: `events` table rows

## Agents & tools

`conciergeAgent` → `search-grounded-places` `intent:nightlife` (MSV-001)

## Workflows

None.

## User journey

1. Tourist asks for reggaeton near Provenza tonight.
2. Nightlife intent returns bar/club places.
3. NightlifeDetailPanel (CKV-004) shows vibe + safety copy.

## Summary

| Field | Value |
|-------|-------|
| Kind | **Nightclub / bar** (grounded place, not event ticket) |
| Persona | Tourist (reggaeton Provenza tonight) |
| Discovery | `search-grounded-places` `intent:nightlife` (NGT-001) |

## Description

Nightlife Phase A is **grounding-first** like cafés. This task seeds **anchor clubs/bars** for evals, cache warming, and NGT-002 UI tests — distinct from `search-events` ticketed parties.

## Goals

1. Anchor list: ≥10 nightlife places (mix: reggaeton clubs, cocktail bars, live music) in Provenza, Manila, Laureles.
2. Resolve `google_place_id` via Places Text Search + field mask.
3. Seed file: `supabase/seeds/venues/nightclubs-medellin.csv` → INSERT into `venue_anchors` with `source = 'curated'`.
4. Document disambiguation: anchor `place_type=nightclub|bar` vs events handoff.

## Acceptance criteria

- [x] No row sourced from `events` table
- [x] Every anchor has Places-verified id (13/13)
- [x] Feeds **data-006** — `golden-queries-venues.json` nightlife-001 "reggaeton Provenza tonight"
- [x] No invented dress codes, cover charges, or hours

## Evidence

[`tasks/data/evidence/data-005-nightclub-seed.md`](../../data/evidence/data-005-nightclub-seed.md) · Linear **SAN-335**

## Out of scope

- Ticket inventory, event dates, Stripe — **events** pillar
- OpenClaw IG scrape — **VEN-008** / OCL-*

## Real-world example

**Tourist** — map pins for Provenza clubs come from verified place_ids, not LLM venue names.
