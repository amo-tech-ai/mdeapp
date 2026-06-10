---
id: MAP-018E
title: Supabase places_details_cache for Place Details (New)
status: Done
priority: P1
phase: MVP — MAP-018 track (before traffic spike)
effort: 3-4h
owner: claude
depends_on: [MAP-018B]
blocks: [MAP-005]
parent: MAP-018
skill: [mde-maps, mde-supabase, testing]
---

# MAP-018E — places_details_cache

## At a glance

**Patricia:** Second *"cafés in Laureles"* query in one day should not bill 5× Place Details again.

**Goal:** Cache masked Place Details JSON by `place_id` with TTL; read from Cloud Run sidecar (018B) before Google HTTP.

## Migration

**Table:** `places_details_cache`

| Column | Type | Notes |
|--------|------|-------|
| `place_id` | `text` PK | `ChIJ…` |
| `payload_json` | `jsonb` | Full masked Details response |
| `field_mask_version` | `text` | e.g. `details-v1-2026-05-25` |
| `photo_name_primary` | `text` nullable | `photos[0].name` |
| `maps_url` | `text` nullable | `googleMapsLinks.placeUri` |
| `fetched_at` | `timestamptz` | TTL check |

**TTL:** 7 days MVP (align MAP-005); invalidate on `field_mask_version` bump.

## RLS

- `ENABLE ROW LEVEL SECURITY`
- **SELECT/INSERT/UPDATE:** `service_role` only (sidecar + edge)
- **anon/authenticated:** deny (browsers never read cache directly)

## Files to modify

| File | Change |
|------|--------|
| `supabase/migrations/*_places_details_cache.sql` | Table + policies |
| `services/adk-grounding/places_enrich.py` | read-through / write-through |
| `mdeapp/scripts/verify-rls-places-cache.mjs` | Optional policy smoke |

## Env vars

| Var | Where |
|-----|-------|
| `SUPABASE_URL` | Cloud Run secret |
| `SUPABASE_SERVICE_ROLE_KEY` | Cloud Run secret only — never Vercel client |

## Security

- Service role only on sidecar — not in `mdeapp/src/**` per CLAUDE.md hard rule for service role in app src.
- If Mastra must read cache later → MAP-005 edge proxy, not browser.

## Tests

- SQL: RLS blocks anon select.
- Python unit: cache hit skips `httpx` to Google.
- Log line: `places_cache_hit=true` on invoke.

## Success criteria

1. Repeat invoke for same 5 place IDs within TTL → 0 Details HTTP calls (mock or log count).
2. Migration applied on project `zkwcbyxiwklihegjhuql`.
3. Cache bypass flag for debugging.

## Rollback

Sidecar skips cache table; direct Details every time — table harmless if unused.

## Note

Full `places-proxy` edge + search cache = **MAP-005** — this task is **Details-only** MVP cache.
