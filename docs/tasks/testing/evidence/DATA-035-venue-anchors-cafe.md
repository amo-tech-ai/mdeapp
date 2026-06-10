---
task: data-035
date: 2026-05-30
project: zkwcbyxiwklihegjhuql
status: Done
---

# DATA-035 — Café venue_anchors seed evidence

## Pipeline

1. Curated pack: `tasks/venues/seeds/cafes-medellin.curated.json` (18 anchors)
2. Places verify: `mdeapp/scripts/seed-cafe-anchors.mjs` + `X-Goog-FieldMask`
3. SQL: `tasks/venues/seeds/venue_anchors_cafes.sql`
4. Repo migration: `supabase/migrations/20260529150000_data035_venue_anchors_cafes.sql`
5. Verify log: `tasks/testing/evidence/DATA-035-places-verify.log`

## Live counts (2026-05-30)

| Metric | Value |
|--------|------:|
| Active café anchors | **17** |
| Places verify success | 18/18 queries |
| Unique `(google_place_id, kind)` | 17 (Délmuri/Amelier Laureles share one place_id) |
| With `metadata.ai_vibe_summary` | 17/17 |

## mde-supabase compliance

- Lat/lng from Places only (never listing prose)
- Inserts idempotent via `ON CONFLICT (google_place_id, kind)`
- RLS: public SELECT active; service_role write path used for seed apply
- No invented hours/phone in seed metadata (DATA-008 backfill)

## Unblocks

DATA-003 sign-off, DATA-006 golden queries, DATA-007 cache audit.

## Re-verify (2026-06-02)

| Check | Result |
|-------|--------|
| Supabase MCP — active cafés | **17** |
| `metadata.ai_vibe_summary` | **17/17** |
| Duplicate `google_place_id` | **0** |
| Vitest café fallback | **3/3** pass |
| Linear SAN-332 | **Done** (evidence links attached) |
| Localhost `:3001` | UI **200**, CopilotKit reachable |

**Remaining gap (not DATA-035):** DATA-008 spot-check — detail panel phone/hours from `place_details_cache`.

**Grade:** **A- / 90** — production-ready for seed catalog; chat still ADK-grounding-first.
