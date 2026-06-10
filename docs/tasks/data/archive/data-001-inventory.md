---
task_id: data-001
mvp_step: 01
legacy_id: CAF-001
title: Venues data inventory — cafés, restaurants, nightclubs
layer: DATA
priority: P0
status: Done
verified: 2026-05-29
evidence: ../evidence/data-001-inventory.md
estimated_effort: 4h
depends_on: []
unblocks: ["data-002", "data-006", "data-007", "data-034", "VEC-002"]
skills: [mde-task-lifecycle, mde-supabase, pgvector, task-verifier]
related:
  - ../../vector/VEC-001-pgvector-inventory-and-duplicate-index-plan.md
  - ../audit-supabase.md
  - ../plan/23-audit.md
description: Read-only inventory of Supabase + cache state for all three venue kinds before any seed or schema work. Live audit shipped 2026-05-26 — close task after evidence file + task-verifier.
---

# DATA-001 — inventory


## At a glance

| | |
|---|---|
| **For** | Sofía (dev) + Patricia (ops) |
| **Surface** | Supabase audit — no user UI |
| **Layer** | DATA |

## What we're building

Count and document every table/cache that powers café, restaurant, and nightclub discovery before we seed or migrate anything.

## Features

- Row counts + RLS snapshot for restaurants, caches, WA tables
- Per-kind gap list: missing anchors, place_ids, empty caches
- Evidence file for task-verifier

## Agents & tools

None — Supabase MCP / SQL only. Reference `conciergeAgent` tools that exist today.

## Workflows

None — one-off audit.

## User journey

1. Sofía runs inventory SQL across shared venue tables.
2. Findings split into café · restaurant · nightclub sections.
3. Gap list drives data-003/004/005 seeds and CAF-008 booking table.

## Summary

| Field | Value |
|-------|-------|
| Layer | DATA |
| Personas | Sarah (café), Carlos (restaurant), Tourist (nightclub) |
| Mutation | **Read-only** |

## Three-kind data map (audit each)

| Kind | Discovery today | Catalog / anchors | Detail | Embeddings |
|------|-----------------|-------------------|--------|------------|
| **Café** | `search-grounded-places` `intent:cafe` | `venue_anchors` (kind=cafe) — **0 rows**; grounding primary | `place_details_cache` | None yet (VEC Phase B) |
| **Restaurant** | `search-restaurants` | `public.restaurants` (44 rows, 44/44 `google_place_id`) | Places + DB merge | `restaurant_embeddings` (43) |
| **Nightclub** | `search-grounded-places` `intent:nightlife` | `venue_anchors` (kind=nightclub) — **0 rows**; DATA-005 seed | `place_details_cache` | None yet |

## Goals

1. **Shared tables:** row counts + RLS for `restaurants`, `restaurant_embeddings`, `place_details_cache`, `places_search_cache`, `bookings`, `whatsapp_*`, `wa_outbox`, `approval_requests`.
2. **Café path:** sample grounded `place_id`s from logs or cache; count cache hits for café detail API; note whether any café rows live in `restaurants` by mistake.
3. **Restaurant path:** same as §1 for catalog + embedding coverage.
4. **Nightclub path:** document absence/presence of nightlife rows anywhere; list Provenza/Laureles `place_id`s already in cache from café/restaurant overlap.
5. Flag duplicate HNSW indexes on embedding tables (link **VEC-001**).
6. Save evidence → `tasks/data/evidence/data-001-inventory.md` (canonical audit: [`../audit-supabase.md`](../audit-supabase.md)).

## Acceptance criteria

- [x] Evidence has **three sections** (café, restaurant, nightclub) with SQL/MCP proof → [`../evidence/data-001-inventory.md`](../evidence/data-001-inventory.md)
- [x] Gap list per kind: missing anchors, missing `google_place_id`, empty caches
- [x] `venue_booking_requests` gap documented — **resolved by DATA-009 M1** (2026-05-29)
- [x] No schema mutations in this task

## Real-world examples

- **Sarah** — inventory shows whether Laureles café queries rely 100% on ADK or have curated anchors to add in data-003.
- **Tourist** — inventory confirms no nightclub catalog yet → data-005 required before NGT-002 evals.
