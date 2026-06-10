---
task: data-005
date: 2026-05-30
project: zkwcbyxiwklihegjhuql
status: Done
linear: SAN-335
---

# DATA-005 — Nightclub / bar anchor seed

## Pipeline

1. Curated pack: `supabase/seeds/venues/nightclubs-medellin.curated.json` (13 anchors)
2. Places verify: `mdeapp/scripts/seed-nightclub-anchors.mjs` + `X-Goog-FieldMask`
3. CSV: `supabase/seeds/venues/nightclubs-medellin.csv`
4. SQL: `supabase/migrations/20260530003708_data005_venue_anchors_nightclubs.sql`
5. Repo migration: `supabase/migrations/20260529160000_data005_venue_anchors_nightclubs.sql`
6. Verify log: `tasks/testing/evidence/DATA-005-places-verify.log`

## Live counts (2026-05-30)

| Metric | Value |
|--------|------:|
| Active nightclub anchors | **13** |
| Places verify success | **13/13** |
| Neighborhoods | Provenza (6), Manila (2), Laureles (2), El Poblado (3) |
| With `metadata.ai_vibe_summary` | 13/13 |
| With `metadata.place_type` | bar (6) · nightclub (7) |
| Sourced from `events` table | **0** |

## Places curation notes

- **Baia Rooftop** dropped — Places had no reliable match; replaced with **360 Rooftop Bar** (verified display name).
- **VIVO Medellín** maps to Places **La House Provenza** (`places_verify.display_name` in metadata).
- **Perú Medellín** dropped — wrong Places match; replaced with **Palma Pitón Manila**.
- **818 DISTRICT** added for Laureles circuit (Estadio area).

## Disambiguation (DATA-002)

Anchors are **places** (`venue_anchors.kind = nightclub`), not ticketed `events`. Golden queries in `golden-queries-venues.json` use `search-grounded-places` / nightlife intent — **not** `search-events`.

## mde-supabase compliance

- Lat/lng from Places Text Search only
- `ON CONFLICT (google_place_id, kind)` idempotent upsert
- RLS unchanged — service_role seed path
- No invented cover charges, dress codes, or hours in metadata

## Unblocks

DATA-006 (nightclub golden query section pre-filled), MSV-001, CKV-004 eval anchors.
