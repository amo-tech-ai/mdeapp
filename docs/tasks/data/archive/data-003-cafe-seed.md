---
task_id: data-003
mvp_step: 03
legacy_id: CAF-003
title: Café seed sign-off + golden-query map
layer: DATA
priority: P0
status: Done
estimated_effort: 1 day
depends_on: ["data-002", "data-009", "data-035"]
unblocks: ["data-006", "data-007", "VEC-005"]
skills: [mde-task-lifecycle, mde-supabase, mde-maps]
mutation: seed
description: Café seed verify + golden-query mapping after DATA-035 loads venue_anchors; Places verify log sign-off.
---

# DATA-003 — cafe seed


## At a glance

| | |
|---|---|
| **For** | Sarah (café seeker) |
| **Surface** | `/chat` café discovery |
| **Layer** | DATA |

## What we're building

Sign-off task after **[DATA-035](data-035-cafe-listings-venue-anchor-seed.md)** loads listing research into `venue_anchors`. This task owns eval mapping and regression proof — not duplicate ETL.

## Features

- Confirm `tasks/venues/seeds/cafes-medellin.seed.json` applied
- Places verify log review (one line per anchor)
- Golden-query → `venue_anchors.id` map for **data-006**

## Agents & tools

`conciergeAgent` → `search-grounded-places` with `intent:cafe`

## Workflows

None.

## User journey

1. Sarah asks for specialty coffee in Laureles.
2. Grounding returns cards; anchors improve repeatability in evals.
3. Detail panel loads from Places cache (data-007).

## Summary

| Field | Value |
|-------|-------|
| Kind | **Café** |
| Persona | Sarah (quiet WiFi, Laureles/Poblado) |
| Content source | [`../../venues/tasks/listings/`](../../venues/tasks/listings/) prompt packs |

## Description

**Primary seed work:** [DATA-035](data-035-cafe-listings-venue-anchor-seed.md) (listings → `venue_anchors` + `metadata`).

Phase A discovery stays ADK-first (CAF-A5). Anchors improve eval repeatability and cache warming — not a replacement for grounding.

## Goals

1. DATA-035 Done: ≥15 café rows in `venue_anchors`.
2. Document which anchors power **data-006** golden queries (`tasks/venues/seeds/golden-queries-venues.json` or inline in evidence).
3. Confirm `search-grounded-places` intent:cafe remains primary in chat.

## Acceptance criteria

- [x] DATA-035 evidence merged (row count + sample metadata)
- [x] Golden-query mapping committed — [`golden-queries-venues.json`](../../venues/seeds/golden-queries-venues.json)
- [x] `search-grounded-places` intent:cafe still primary; anchors for eval/cache/catalog enrich only

## Evidence

[`tasks/data/evidence/data-003-cafe-signoff.md`](../../data/evidence/data-003-cafe-signoff.md) · Linear **SAN-334**

## Real-world example

**Sarah** — "quiet café with WiFi 3 hours Laureles" — golden query in data-006 maps to a verified anchor, not hallucinated names.
