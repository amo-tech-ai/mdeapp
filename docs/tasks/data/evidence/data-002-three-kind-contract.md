---
task: data-002
date: 2026-05-29
project: zkwcbyxiwklihegjhuql
depends_on: data-001
status: Done
---

# DATA-002 — Three-kind catalog contract

## Rule (non-negotiable)

**Nightclubs ≠ ticketed events.** Reggaeton/bar discovery uses `venue_anchors` (kind=nightclub) or Places grounding — never `events` / EventCard checkout.

---

## Café (`venue_anchors.kind = cafe`)

| Surface | Required fields | Source |
|---------|-----------------|--------|
| Card | `name`, `neighborhood`, `tags[]`, hero image URL | `venue_anchors` + `metadata.images[0]` |
| Detail | `google_place_id`, lat/lng, hours, rating | Places `place_details_cache` by place_id |
| Booking | `place_id`, party_size, requested_at, contact_* | `venue_booking_requests` (M1) |
| AI vibe | `metadata.ai_vibe_summary` | Gemini proposal → human/seed approved (DATA-035) |

**Phase 1 discovery:** ADK/Places primary; curated anchors optional eval rows (DATA-035).

**Forbidden:** LLM-invented place_ids, lat/lng, or phone numbers without cache/anchor backing.

---

## Restaurant (`public.restaurants`)

| Surface | Required fields | Source |
|---------|-----------------|--------|
| Card | `name`, `neighborhood`, `cuisine`, `price_level`, photo | `restaurants` row |
| Detail | `google_place_id`, description, hours | Row + `place_details_cache` |
| Map pin | lat/lng or resolvable place_id | Row (44/44 have `google_place_id`) |
| Semantic | embedding vector | `restaurant_embeddings` (43 rows) |

**Source of truth:** `restaurants` table — **not** `venue_anchors`.

**DATA-004 scope:** verify-only / gap-fill — catalog already at 44/44 place_ids.

---

## Nightclub (`venue_anchors.kind = nightclub`)

| Surface | Required fields | Source |
|---------|-----------------|--------|
| Card | `name`, `neighborhood`, `tags[]` (e.g. reggaeton, rooftop) | `venue_anchors` seed (DATA-005) |
| Detail | `google_place_id`, lat/lng | Places cache |
| Booking | table/VIP request via `venue_booking_requests.venue_kind=nightclub` | M1 table |

**Exclude:** rows in `events` with ticket tiers — those are Roberto/Andrés commerce, not nightlife anchors.

---

## Gap SQL

See [`sql/data-002-gaps-by-kind.sql`](./sql/data-002-gaps-by-kind.sql).

| Kind | Gap (2026-05-29) | Next task |
|------|------------------|-----------|
| Café | 0 anchors | DATA-035 → DATA-003 |
| Restaurant | 0 missing place_id | DATA-004 verify-only |
| Nightclub | 0 anchors | DATA-005 | **13 anchors** (2026-05-30) |

---

## Unblocks

DATA-003, DATA-004 (verify), DATA-005, DATA-007, DATA-035 may proceed after DATA-009 M2 (applied 2026-05-29).
