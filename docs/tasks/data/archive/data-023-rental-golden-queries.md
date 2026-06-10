---
task_id: data-023
mvp_step: 23
title: Rental golden queries — Camila eval SQL pack
layer: DATA
priority: P1
status: Done
verified: 2026-05-29
evidence: ../evidence/data-023-rental-golden-queries.sql
estimated_effort: 3h
depends_on: ["data-019", "data-009"]
unblocks: []
skills: [mde-task-lifecycle, mde-supabase, testing]
related:
  - data-006-golden-queries.md
  - ../../real-estate/real-estate-prd.md
description: SQL + JSON golden queries for rental search (neighborhood, beds, price_daily); complements venue data-006.
---

# DATA-023 — rental golden queries

## At a glance

| | |
|---|---|
| **For** | Lucía · Camila persona |
| **Surface** | Eval / Vitest / manual SQL |
| **Layer** | DATA |

## What we're building

20–30 rental queries with expected result constraints:

| Query class | Example | Assert |
|---|---|---|
| Hood + beds | "2BR Laureles" | ≤8 rows, all Laureles |
| Price ceiling | "under $50/night Poblado" | `price_daily <= 50` |
| WiFi tag | "good wifi remote work" | amenities or wifi_speed |
| Semantic | "quiet furnished long stay" | hybrid_search_listings RPC |
| Empty | "10BR castle Medellín" | 0 rows, no hallucination |

Output: `tasks/data/evidence/data-023-rental-golden-queries.sql` + `.json`

## Acceptance criteria

- [x] Each query runs against live Supabase (read-only) — see `.sql` + `.json`
- [x] Documents dependency on **data-009 M3** `price_daily` index (Q6 EXPLAIN)
- [ ] Linked from real-estate PRD eval suite (RE-027 post-MVP)

## Note

**data-006** stays venue-only (café/restaurant/nightclub). Do not merge files.
