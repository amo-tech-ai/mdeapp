task_id: ven-034
mvp_step: 034
id: VEN-034
title: Seed 5 verified coffee tours
status: Open
priority: P0
phase: CTI-A
effort: 3h
owner: claude
depends_on: [VEN-032]
blocks: [VEN-036, VEN-035]
listings_ref: ../../listings/cafes/05a-coffee-tours.md
skill: [mde-supabase, plan-analysis, mde-task-lifecycle]
mcp: [user-supabase]
---

# VEN-034 — Seed coffee tours

## In plain English

Load **real Medellín coffee farm tours** into Supabase from curated research — at least five operators, with **three verified Google `place_id`s** so maps and Places enrich work on day one.

## User story

**As a Tourist on `/chat`,** I want to see La Sierra, La Casa Grande, and other real operators — not names the model invented — **so that** I can trust the “Book” and “Map” buttons.

## Real-world example

> *“Show me the best authentic coffee farm tour near Medellín”*

Chat returns cards backed by rows like `tour-urbano-la-sierra` with a real `place_id`, neighborhood `La Sierra`, and a source URL to the operator’s site.

## Goals

1. Seed script + optional SQL for dev/staging.
2. ≥5 tours; ≥3 with verified `place_id`.
3. Profiles + sources for narrative and provenance.
4. Low-confidence listings marked `verified=false`.

## Success criteria

1. `SELECT count(*) FROM coffee_tours` ≥ 5 on dev.
2. **`count(*) WHERE place_id IS NOT NULL` ≥ 3** — verified before UI work (VEN-038+).
3. Each row has `slug`, `neighborhood`; lat/lng from Places or seed doc — not agent-invented.
4. At least 3 rows have `coffee_tour_sources` with URL provenance.
5. Artisan / low-confidence tours excluded or `verified=false`.
6. Seed script exits non-zero if `place_id` count &lt; 3 (recommended).

## Seed set (minimum 5)

From [`05a-coffee-tours.md`](../../listings/cafes/05a-coffee-tours.md):

1. Tour Urbano / La Sierra (Urban Coffee Tour)
2. La Casa Grande
3. Corazón de León
4. Expedition Colombia (or Proyecto Renacer)
5. Café Atardecer / sunset tour

**Hard rule (blocking):** ≥ **3** seed rows MUST have a **verified Google `place_id`** (Places Details `GET` or MCP `google-maps-code-assist`) before VEN-038/008/009 start. Remaining rows may be `verified=false` with explicit `source_confidence` &lt; 70.

## Wiring plan

| Layer | File | Action |
|-------|------|--------|
| Seed script | `mdeapp/scripts/seed-coffee-tours.mjs` | Create |
| SQL optional | `mdeapp/supabase/seed/coffee_tours.sql` | Create |
| Profiles | `coffee_tour_profiles` rows | `ai_summary`, `best_for` from `06-coffee-tours.md` |

## Tests

```bash
node mdeapp/scripts/seed-coffee-tours.mjs --dry-run
# MCP execute_sql: count + sample slugs
```

## Research

Use [`prompt-tours.md`](../../listings/cafes/prompt-tours.md) for gaps — human/Firecrawl, not agent-invented coords.
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-034](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-034-verify-YYYY-MM-DD.md` |
| Grade | ⚪ Pending (optional track) |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | See VEN-VERIFY-MATRIX § VEN-034 |
| **MCP** | Supabase / mastra / maps per task |
| **Chrome DevTools** | Tour UI routes when implemented |
| **Playwright** | Tour specs when implemented |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Optional coffee-tour track — verify after implementation

