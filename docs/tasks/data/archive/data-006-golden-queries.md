---
task_id: data-006
mvp_step: 06
legacy_id: CAF-006
title: Golden eval queries — café, restaurant, nightclub
layer: DATA
priority: P1
status: Done
layer_a: Done
layer_b: Open
estimated_effort: 3h
depends_on: ["data-035", "data-003", "data-004", "data-005"]
unblocks: ["VEC-005"]
skills: [mde-task-lifecycle, mde-supabase, testing]
mutation: none
description: Persona query pack for all three kinds (JSON + read-only SQL). Layer A Done 2026-05-30; Layer B (MSV-012) app-track.
evidence: ../evidence/data-006-venue-golden-queries.md
---

# DATA-006 — golden queries


## At a glance

| | |
|---|---|
| **For** | Lucía (QA) + Sofía |
| **Surface** | Eval harness — `/chat` + read-only Supabase SQL |
| **Layer** | DATA (artifact only — no DDL) |
| **Layer A** | ✅ Done (2026-05-30) |
| **Layer B** | ⚪ Open — MSV-012 app track |

## What we're building

Golden query JSON + SQL regression pack for all three venue kinds so MSV/CKV changes don't regress discovery quality.

**Two eval layers:**

| Layer | What | Done when |
|-------|------|-----------|
| **A — Data regression** | Read-only SQL vs live Supabase | All G* queries return expected rows |
| **B — Tool / chat eval** | POST `/api/copilotkit` or Vitest tool calls | MSV-012 / app track (out of scope for DATA Done gate) |

## Features

- [`supabase/seeds/venues/golden-queries-venues.json`](../../../supabase/seeds/venues/golden-queries-venues.json)
- [`tasks/data/evidence/data-006-venue-golden-queries.sql`](../evidence/data-006-venue-golden-queries.sql)
- Expected tool + min result count per query
- Hooks **MSV-012** eval agent (app layer)

## Agents & tools (per DATA-002)

| Kind | Tool | Source table |
|------|------|--------------|
| Café | `search-grounded-places` | `venue_anchors` (kind=cafe) — eval anchors + grounding |
| Restaurant | `search-restaurants` | **`public.restaurants`** (not `venue_anchors`) |
| Nightclub | `search-grounded-places` | `venue_anchors` (kind=nightclub) |

`conciergeAgent` routes café/coffee → grounded places; cuisine/dinner → `search-restaurants`.

## Workflows

None.

## User journey

1. Sofía runs Layer A SQL (MCP or `psql`) — must pass before merge.
2. Lucía runs Layer B (optional for DATA Done): each prompt via `/api/copilotkit` or tool unit tests.
3. Failures on Layer B block MSV-001 / CKV-003 app tasks — not DATA-006 alone.

## Goals

1. ≥5 queries per kind (**18 total** in JSON) with verified IDs:
   - Café / nightclub → `venue_anchors.id` + `google_place_id`
   - **Restaurant → `restaurants.id` + `google_place_id`** (DATA-004 catalog)
2. Sources: DATA-003/005 anchor maps, DATA-004 `restaurants` rows (address + `cuisine_types` filters match `search-restaurants.ts`).
3. Personas: Sarah (café), Carlos (restaurant), Tourist (nightclub).
4. Artifacts: JSON + SQL under paths above.

## Acceptance criteria

### Layer A (DATA Done gate)

- [x] Café queries (7) map to verified `venue_anchors` place_ids (DATA-003)
- [x] Nightclub queries (6) map to verified `venue_anchors` place_ids (DATA-005)
- [x] Restaurant queries (6) map to verified `restaurants.id` + `google_place_id` (DATA-004)
- [x] `data-006-venue-golden-queries.sql` committed — café, restaurant, nightclub sections
- [x] Nightclub prompts exclude ticket/event commerce wording
- [x] Layer A SQL run logged in evidence (2026-05-30 — 26/26 pass)

### Layer B (app / MSV — not required for Layer A Done)

- [ ] Restaurant tool eval asserts `source: 'supabase'` (not fallback list)
- [ ] MSV-012 harness reads `golden-queries-venues.json`

## Real-world example

**Carlos** — "traditional bandeja paisa in Laureles" — SQL assert matches `Hacienda Junín` via `address ILIKE '%Laureles%'`, same filter as `search-restaurants` tool.

**Tourist** — "reggaeton near Provenza tonight" — anchor assert hits `Dulce Jesús Mío` / `VIVO Medellín` in `venue_anchors`, not a row in `events`.

## Evidence

- **Layer A run log:** [`../evidence/data-006-venue-golden-queries.md`](../evidence/data-006-venue-golden-queries.md) — 19/19 persona + 7 contract asserts, 2026-05-30
- SQL pack: [`../evidence/data-006-venue-golden-queries.sql`](../evidence/data-006-venue-golden-queries.sql)
- JSON: [`../../venues/seeds/golden-queries-venues.json`](../../venues/seeds/golden-queries-venues.json)
- Café sign-off: [`../evidence/data-003-cafe-signoff.md`](../evidence/data-003-cafe-signoff.md)
