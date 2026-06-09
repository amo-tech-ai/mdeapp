---
id: MAP-012
title: Neighborhood intelligence cards
status: Not Started
priority: P2
phase: Post-MVP
effort: 4-6h
owner: claude
depends_on: [MAP-006, MAP-012A]
blocks: []
skill: [mde-maps, mde-supabase, mastra]
prd_ref: ../../plan/maps/maps-prd.md
draft_sources:
  - ../../drafts/tasks/mastra/maps/tasks/intelligence/046-spatial-analytics-cache.md
  - ../../drafts/tasks/mastra/maps/tasks/intelligence/048-enrichment-workers.md
  - ../../drafts/tasks/mastra/maps/features/16-google-maps-features.md
---

# MAP-012 — Neighborhood intelligence

## At a glance

**Description:** Compare Medellín neighborhoods (Laureles vs El Poblado) with **data-backed cards** — coworking/café density from cached rollups, not LLM vibe text.

**Purpose:** **Camila** asks “which area is better for remote work?” Google’s `generativeSummary` is not reliable in Colombia. We pre-compute scores from MAP-006-style nearby patterns and store them in Supabase.

**Goals:**
- `neighborhood_scores` table + weekly refresh edge job (bounded Places spend).
- `NeighborhoodCard` UI on `/` and `/rentals`.
- Read path only on user queries — no live Places storm per message.
- Document why we skip generative Places fields for CO.

**Features:**
| Who | What they get |
|-----|----------------|
| **Camila** | Side-by-side hood comparison with counts, not hallucinated prose. |
| **Patricia** | ~100 Places calls/week cap on refresh job. |

> **Camila** compares Laureles vs El Poblado → hood cards with coworking/café density from **cached** Supabase rollups — **not** Places `generativeSummary` (US-limited, often empty in CO).

## 0. Phase 0 — Analytics SKU spike (gate)

> **Execute [**MAP-012A**](./MAP-012A-colombia-aggregate-insights-spike.md) first.** MAP-012 implementation is **blocked** until spike evidence + v1 API choice are Done.

See MAP-012A for probe matrix, decision table, and evidence file `tasks/notes/MAP-012A-spike-evidence.md`.

## 1. Purpose

Neighborhood comparison UX for `/` and `/rentals`: read `neighborhood_scores` (or equivalent) populated by weekly refresh from MAP-006 nearby patterns **or** Aggregate/Insights (per Phase 0 decision) — offline `ai_summary` / curated copy where Google generative fields are unavailable.

## 2. Goals

- Migration `neighborhood_scores` (`neighborhood` text PK, counts per category, `computed_at`)
- RLS: public read; service-role write
- Edge `places-density-refresh` — iterates 5–10 Medellín neighborhoods × categories; uses **Phase 0 winner** (Aggregate API, Insights, or MAP-005 Nearby proxy); caps ~100 Places calls/week
- `NeighborhoodCard.tsx` — Laureles vs Poblado (or dynamic pair from user query)
- Mastra tool or read API `getNeighborhoodScores` — no live Places on hot path
- Document deferral of `generativeSummary` in PRD cross-ref

## 3. Features

| Persona | Effect |
|---------|--------|
| **Camila** | “Which area is better for remote work?” → data-backed card, not hallucinated vibe text. |
| **Patricia** | Weekly refresh cost bounded (~$0.50/week per draft 046 estimate). |

## 4. Curated layer (ex-MAIC-013)

> **Phase 1:** human-curated facts + tool compare; **Phase 2:** `neighborhood_scores` rollups from MAP-006 refresh. LLM must **not** invent crime/safety stats.

| Item | Path / rule |
|------|-------------|
| Seed | `mdeapp/src/data/neighborhoods/medellin.json` — Laureles, El Poblado, Manila, Envigado, Belén, Centro, Sabaneta |
| Tool | `mdeapp/src/mastra/tools/explain-neighborhood.ts` — pair compare from user query |
| UI | `NeighborhoodCard.tsx` + **F49** `useCopilotAction` mirror (ex-MAIC-009) |
| Legal | Patricia review on curated copy before prod |
| Search | Optional MAP-002 SearchAgent enrichment **after** curated baseline — disclaimer if stale |
| Anti-hallucination | Scores cite cache row or JSON field — no vibe-only prose |

## 5. Workflows

0. Confirm **MAP-012A** Done — v1 API path recorded in evidence.
1. Ship `medellin.json` + explain tool (read path, no live Places).
2. Define neighborhood list in config (same hoods as seed).
3. Migration + RLS policies.
4. Cron or manual edge invoke for refresh (Supabase cron pg_cron if enabled).
5. UI card in chat center column; optional pin overlay unchanged.
6. Tie-in with INTEL-043 spatial ranking **only** if that task is scheduled — otherwise read cache directly in tool.

## 6. Acceptance criteria

1. Card renders from Supabase row without live Places call (prove via log).
2. No `generativeSummary` in any field mask for this feature.
3. RLS: anon cannot insert scores.
4. Refresh job documented + idempotent.
5. `npm run floor` green.

## 7. Verification checklist (100% Done gate)

> [`VERIFICATION-CHECKLIST.md`](./VERIFICATION-CHECKLIST.md) · Evidence: [`MAP-012-evidence.md`](../notes/MAP-012-evidence.md).

### Shared gates

- [ ] G1–G8 complete

### DB / RLS

- [ ] Migration `neighborhood_scores` (or agreed name) — **RLS enabled** + ≥1 policy
- [ ] Anon cannot INSERT scores (SQL or test documented)
- [ ] Refresh job idempotent — documented in evidence

### Unit / integration

- [ ] SQL fixture → `NeighborhoodScoreCard` props Vitest
- [ ] Edge upsert mock — row count stable on second run
- [ ] Card on `/` loads from Supabase **without** live Places call (log proves cache read)
- [ ] `rg "generativeSummary" mdeapp/src/mastra` for this feature → 0 in field masks

### Manual

- [ ] Prompt referencing Laureles / El Poblado → hood card visible; map pins unchanged unless separate tool fired

## 8. Rollback

Hide card; stop cron; table remains.

## 9. Out of scope

- Full INTEL subsystem PRD
- Ask Maps / Immersive Nav (consumer-only — features/17 defer)

## 10. Definition of Done

**Phase 0:** [**MAP-012A**](./MAP-012A-colombia-aggregate-insights-spike.md) Done.

**Phase 1:** §6 acceptance + **§7 verification checklist** + refresh doc + curated JSON reviewed.

Commit: `feat(maps): neighborhood scores cache + cards (MAP-012)`.
