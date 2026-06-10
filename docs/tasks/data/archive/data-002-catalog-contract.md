---
task_id: data-002
mvp_step: 02
legacy_id: CAF-002
title: Three-kind catalog contract — café, restaurant, nightclub
layer: DATA
priority: P0
status: Done
verified: 2026-05-29
evidence: ../evidence/data-002-three-kind-contract.md
estimated_effort: 4h
depends_on: ["data-001"]
unblocks: ["data-003", "data-004", "data-005", "data-007"]
skills: [mde-task-lifecycle, mde-supabase, mde-maps]
description: Column and source-of-truth contract per venue kind; place_id gap reports for all catalog paths.
---

# DATA-002 — catalog contract


## At a glance

| | |
|---|---|
| **For** | All three personas — Sarah, Carlos, Tourist |
| **Surface** | Contract doc → seeds + UI fields |
| **Layer** | DATA |

## What we're building

Define which fields each venue kind must have for cards, detail panels, and booking — and where each fact comes from (Places vs DB, never LLM-only).

## Features

- Per-kind field contract (card, detail, booking)
- Gap SQL exports for data-003/004/005
- Rule: nightclubs ≠ ticketed events

## Agents & tools

None — design contract for `conciergeAgent` tool outputs.

## Workflows

None.

## User journey

1. Team reviews data-001 inventory.
2. Contract maps each scr/wire field (005/007/008) to a data source.
3. Tourist's reggaeton query is defined as Places/bar anchors, not EventCard tickets.

## Summary

| Kind | Source of truth (Phase 1) | Catalog task |
|------|---------------------------|--------------|
| **Café** | Places / ADK grounding | **data-003** (data-003) curated anchors (optional eval rows) |
| **Restaurant** | `public.restaurants` + Places | **data-004** (data-004) seed expansion |
| **Nightclub** | Places / ADK `intent:nightlife` | **data-005** (data-005) anchor seed (clubs/bars, not ticketed events) |

## Description

From **data-001** (data-001), produce one contract doc covering all three kinds: required fields for cards/detail/booking, forbidden LLM-invented fields, and gap SQL per kind.

## Goals

1. Markdown contract table per kind (card, detail panel, booking form fields).
2. **Restaurant:** `%` rows with valid `google_place_id`, lat/lng, neighborhood.
3. **Café:** list curated anchor candidates from [`../../venues/tasks/listings/`](../../venues/tasks/listings/) vs already-cached `place_id`s.
4. **Nightclub:** define anchor set (e.g. Provenza reggaeton, Laureles bars) — place_ids to resolve in **data-005** (data-005); exclude ticketed events (`search-events`).
5. **Café `venue_anchors.metadata` v1** — adopt schema from [**data-035**](data-035-cafe-listings-venue-anchor-seed.md) (`contact`, `ai_vibe_summary`, `images`, `confidence_score`).
6. Evidence → `evidence/data-002-three-kind-contract.md` + `sql/data-002-gaps-by-kind.sql`.

## Acceptance criteria

- [x] Three-kind contract reviewed against scr **005**, **007**, **008**
- [x] Gap exports for data-003, data-004, data-005 → [`../evidence/sql/data-002-gaps-by-kind.sql`](../evidence/sql/data-002-gaps-by-kind.sql)
- [x] Explicit rule: nightclubs ≠ `events` table rows

## Real-world example

**Tourist** asks for "reggaeton near Provenza" — contract ensures anchors are **places** (bars/clubs), not EventCard ticket listings.
