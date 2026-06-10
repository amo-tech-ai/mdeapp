---
task_id: data-008
mvp_step: 08
legacy_id: CAF-009
title: Places backfill cron / edge job
layer: DATA
priority: P1
status: Partial
verified: 2026-06-02
evidence: ../../testing/evidence/DATA-008-backfill-evidence.md
estimated_effort: 1 day
depends_on: ["data-007"]
unblocks: ["data-004", "CKV-001"]
skills: [mde-supabase, mde-maps, gemini]
doc: ../docs/04-supabase-seeds-vectors.md
replaces: [VEN-009]
description: Batch Places API New backfill for rows missing hours/phone/photos; field mask on every call.
---

# DATA-008 — places backfill cron


## At a glance

| | |
|---|---|
| **For** | All detail-panel users |
| **Surface** | Edge cron / backfill job |
| **Layer** | DATA |

## What we're building

Scheduled Places backfill so cache (data-007) stays warm for top anchors and search hits.

## Features

- Cron or edge fn for stale/missing cache rows
- X-Goog-FieldMask on every fetch
- Metrics for cache hit rate

## Agents & tools

None

## Workflows

Optional batch job — not user-facing

## User journey

1. Nightly job reads gap list from data-007.
2. Places API fills `place_details_cache`.
3. Next day's detail opens feel instant.

## Goals

1. Edge fn or cron: select `restaurants` / cache rows missing `place_details_cache` coverage.
2. Call Places with minimal field mask; upsert cache.
3. Rate-limit + idempotent by `place_id`.
4. Log run to ops table or structured logs.

## Acceptance

- [x] Edge path: `/api/places/detail` read-through cache + field mask
- [x] Backfill script idempotent by `place_id` + `field_mask_version`
- [x] No browser-side Places calls
- [ ] ≥80% anchor rows have cache entry after one run (blocked: Google API 403/429 on env)
- [x] RLS unchanged on public tables
