---
task_id: data-004
mvp_step: 04
legacy_id: CAF-004
title: Restaurant catalog verify + gap-fill (not full re-seed)
layer: DATA
priority: P1
status: Done
verified: 2026-05-29
evidence: ../evidence/data-004-restaurant-verify.md
estimated_effort: 2h
depends_on: ["data-002"]
unblocks: ["data-008", "CKV-001"]
skills: [mde-task-lifecycle, mde-supabase, mde-maps, gemini]
mutation: verify-only
replaces: [VEN-006]
description: Verify public.restaurants Medellín catalog — live DB already 44/44 google_place_id via 20260404044721_restaurants_seed.sql; gap-fill only if audit finds misses.
---

# DATA-004 — restaurant seed


## At a glance

| | |
|---|---|
| **For** | Carlos (restaurant diner) |
| **Surface** | `/chat` restaurant discovery (SCREEN-023) |
| **Layer** | DATA |

## What we're building

**Verify** `public.restaurants` catalog (live: **44 rows, 44/44 `google_place_id`**, 43 embeddings). Only run gap-fill migration if DATA-002 gap SQL finds misses — do not duplicate `20260404044721_restaurants_seed.sql`.

## Features

- Seed `seeds/restaurants-medellin.csv`
- google_place_id, cuisine, neighborhood, price tier
- Embedding-ready rows for VEC Phase B

## Agents & tools

`conciergeAgent` → `searchRestaurantsTool`

## Workflows

None.

## User journey

1. Carlos asks for Italian in El Poblado.
2. Agent calls search-restaurants; DB + Places merge on cards.
3. Carlos opens RestaurantDetailPanel (CKV-002).

## Summary

| Field | Value |
|-------|-------|
| Kind | **Restaurant** |
| Persona | Carlos (dinner for 4) |
| Table | `public.restaurants` |

## Description

Expand restaurant catalog beyond initial seed. Backfill missing `google_place_id` from Places — never LLM lat/lng or hours.

## Goals

1. Run [`../evidence/sql/data-002-gaps-by-kind.sql`](../evidence/sql/data-002-gaps-by-kind.sql) restaurant section — expect **0** place_id gaps.
2. If gaps found: single surgical migration + Places backfill with `X-Goog-FieldMask` on every call (mde-maps rule).
3. Confirm ≥20 quality Medellín rows (already met) and embedding coverage ≥90%.
4. RLS preserved — no anon writes.

## Acceptance criteria

- [x] Gap SQL run; evidence → [`../evidence/data-004-restaurant-verify.md`](../evidence/data-004-restaurant-verify.md)
- [x] Field mask N/A — no backfill needed
- [ ] `search-restaurants` returns rows on `/chat` — app smoke (CKV-001)
- [x] Skip full re-seed — 44/44 place_ids hold

## Real-world example

**Carlos** — "Italian El Poblado" returns catalog cards with real Places-backed addresses.
