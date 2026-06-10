---
task_id: ven-014
mvp_step: 014
title: Places cache and field-mask enforcement
layer: MAPS
priority: P0
status: In Review
linear: SAN-297
depends_on: [data-007, data-008, ven-010, ven-013]
unblocks: [VEN-031]
skills: [mde-maps, mde-supabase, task-verifier]
description: Enforce Places API field masks, cache venue details, and block wildcard masks in production.
---

# VEN-014 — Places cache and field-mask enforcement

## At a glance

| | |
|---|---|
| **For** | Tourist, Camila, Sofia |
| **Surface** | RestaurantDetailPanel, NightlifeDetailPanel, `/api/places/detail` |
| **Layer** | MAPS / COST |

## What we're building

A production-safe Places detail path for venue panels. Detail panels must prefer cached data, request only needed fields, and never use wildcard field masks in production.

## Features

- Server-only Places API calls.
- `X-Goog-FieldMask` required on every Places API New request.
- `*` wildcard mask blocked in production.
- `place_details_cache` read-before-fetch and upsert-after-fetch.
- Quota, timeout, and cache-miss fallback states.

## Agents & tools

Mastra tools can request cached venue facts through deterministic code. Gemini must not invent hours, phone numbers, dress code, coordinates, ratings, payment state, or booking truth when Places data is missing.

## Workflows

1. User opens restaurant or nightlife detail.
2. Server checks `place_details_cache`.
3. If stale or missing, server calls Places with a minimal field mask.
4. UI renders cached/fresh/fallback state clearly.

## User journey

A Tourist opens a Provenza club detail panel. The panel loads hours and phone from cache or a masked Places call, with a graceful fallback if quota fails.

## Partial shipped (2026-06-02)

- [x] `place-details-cache.ts` + `/api/places/detail` + `validatePlacesFieldMask`
- [x] DATA-007 audit script — **2.7%** cache hit (DATA-008 backfill blocked: Places 403)
- [x] Detail panels call `/api/places/detail` on open (`usePlaceDetails` → read-through route)
- [ ] CI grep gate for FieldMask in `npm run floor` (hook exists: `places-api-field-mask.mjs`)

## Acceptance

- [x] Server Places routes use `X-Goog-FieldMask` (see `google-places-client.ts`)
- [x] Production code rejects wildcard `*` field masks (`validatePlacesFieldMask` + vitest)
- [x] Detail panels read cache before fetching (API read-through 2026-06-02)
- [x] Quota/error fallback visible in UI (`place-details-unavailable`)
- [x] No browser-side Places API key for detail fetch (route is server-only)

## Do not do

- Do not call Places from every card render.
- Do not expose server Places keys to the browser.
- Do not let Gemini fabricate missing place details.
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-014](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-014-verify-YYYY-MM-DD.md` |
| Grade | B+ — [evidence](../evidence/VEN-014-verify-2026-06-02.md) |
| Production ready | No — floor + cache hit proof pending |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | Places routes return cached rows when fresh |
| **MCP** | google-maps-code-assist — FieldMask on every Places call |
| **Chrome DevTools** | Network tab — no unmasked Places fields |
| **Playwright** | — |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- CI grep for FieldMask
- Cache audit script

