---
task_id: data-007
mvp_step: 07
legacy_id: CAF-007
title: place_details_cache coverage — all venue kinds
layer: DATA
priority: P1
status: Done
verified: 2026-06-02
archived: 2026-06-02
evidence: ../../testing/evidence/DATA-007-cache-audit.md
estimated_effort: 3h
depends_on: ["data-001", "data-003", "data-005", "MAP-005"]
unblocks: ["data-008"]
skills: [mde-task-lifecycle, mde-supabase, mde-maps]
description: Audit cache hit coverage for café, restaurant, and nightclub place_ids used in cards/detail — after MAP-005 proxy wiring.
---

# DATA-007 — cache audit


## At a glance

| | |
|---|---|
| **For** | Sarah, Carlos, Tourist — detail panels |
| **Surface** | `/api/places/detail` + right column |
| **Layer** | DATA |

## What we're building

Audit `place_details_cache` coverage so detail panels don't hammer Places API on every click.

> **Run after MAP-005** — meaningful hit-rate requires proxy read-through from mdeapp, not ADK-only writes.

**Baseline (MCP read-only, 2026-05-30 — pre-MAP-005):**

| Kind | place_ids | cached | hit rate |
|------|----------:|-------:|---------:|
| café | 20 | 14 | ~70% |
| nightclub | 13 | 1 | ~8% |
| restaurant | 43 | 0 | 0% |

Use DATA-006 golden place_ids as the audit universe; DATA-008 should prioritize restaurant + nightclub misses.

## Features

- Hit-rate report by place_id kind
- Backfill list for data-008
- Field mask compliance check

## Agents & tools

None — cache layer for UI

## Workflows

None.

## User journey

1. User opens any detail panel.
2. App reads cache first; misses trigger Places fetch.
3. Audit tells Sofía which anchors need backfill.

## Goals

1. Union all `place_id`s from data-003 café anchors, data-004 restaurants, data-005 nightclub anchors.
2. Report cache hit/miss % per kind.
3. List misses for **data-008** (data-008) backfill cron priority queue.

## Acceptance criteria

- [x] Evidence file with per-kind coverage table
- [x] No Places API calls required (read cache only) unless spot-check noted
- [x] Miss list exported for DATA-008 (`DATA-007-cache-misses.json`)
