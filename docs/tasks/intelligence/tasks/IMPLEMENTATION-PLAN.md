# INT-001…INT-022 — Implementation plan

**Status:** Living doc · **Gate:** MIS-M1 browser proof before Phase 1b  
**Canonical specs:** `tasks/intelligence/tasks/INT-*.md` · **ID map:** [`MIGRATION.md`](./MIGRATION.md)

## Execution order (dependency-safe)

```text
CORE:     INT-001 → 002 → 003 → 004 → 005
MVP:      INT-006 → 007 → 008 → 009 → 010 (+ INT-021, INT-022 additive)
POST-MVP: INT-011 → 012 → 013 → 014 → 015
ADVANCED: INT-016 → 017 → 018 → 019 → 020
```

## Phase 0 — MIS-M1 blocker (before INT CORE ships Done)

| Step | Work | Verify |
|------|------|--------|
| 0.1 | Restore SEARCH-003 libs + `search-restaurants` hybrid path | `npm run test -- search-restaurants` |
| 0.2 | UI rank/evidence + concierge `queryText` routing | Browser: `quiet rooftop Provenza` |
| 0.3 | `golden-queries-smoke.ts` + `verify:mis-phase1` | Exit 0 with Supabase env |
| 0.4 | Evidence + audit → `partially-live` → `live` only on browser pass | Screenshot + `search_logs` row |

**Skills:** `mastra`, `mde-supabase`, `gemini`, `copilotkit-integrations`, `testing`, `task-verifier`

## Phase 1 — CORE (INT-001…005)

| ID | Deliverable | Tests | Grade gate |
|----|-------------|-------|------------|
| INT-001 | `intent-slots.ts`, `extract-intent-slots` tool | `intent-slots.test.ts` mocked | A: schema + bands + 3 hero prompts |
| INT-002 | Rental parser dates/city/confidence ≥0.75 hero | parser vitest | B+ until hero ≥0.85 |
| INT-003 | Gemini clarify route 0.50–0.84 | routing vitest + browser | No canned clarify on partial signals |
| INT-004 | Remove instant canned bypass | regression | Fast-path ≥0.85 unchanged |
| INT-005 | CORE regression suite | CI subset | All CORE tests green |

## Phase 2 — MVP vertical wrappers (INT-006…010, 021, 022)

Per-vertical slot wrappers on shared schema; restaurant path uses existing `parseIntelligenceSlots` + hybrid search.

## Phase 3 — POST-MVP memory (INT-011…015)

Requires VEC-001 live; do not start until Phase 0 gate green.

## Phase 4 — ADVANCED (INT-016…020)

Cross-domain personalization, observational memory — Phase 2+ only.

## Testing strategy

| Layer | Command | When |
|-------|---------|------|
| Unit | `cd mdeapp && npm run test -- intent-slots intelligence-restaurant search-restaurants` | Every INT slice |
| DB smoke | `npm run verify:mis-phase1` | After data/search touch |
| Golden SQL | `npm run smoke:golden-queries` | After SEARCH-003 |
| Browser | Playwright / cursor-ide-browser @ `:3001` | UI/routing changes |
| Floor | `npm run typecheck && npm run lint` | Pre-commit |

## Grading rubric (per INT task)

| Score | Criteria |
|-------|----------|
| **A (Done)** | Spec acceptance criteria ✅ · tests pass · localhost proof · evidence file |
| **B (partial)** | Code on disk · unit tests pass · browser or DB proof missing |
| **C (spec only)** | Task markdown only |
| **F** | Contradicts Phase 1 freeze or breaks fast-path |

## Current session progress (2026-05-30)

| Item | Status |
|------|--------|
| SEARCH-003 libs restored | ✅ on disk |
| Rank/evidence UI + concierge routing | ✅ patched |
| INT-001 schema + tool + tests | ✅ |
| `golden-queries-smoke.ts` | ✅ |
| `verify:mis-phase1` module fix | ✅ |
| Browser E2E golden query | ✅ Relato + Sambombi + rank-explanation @ :3001 |
| INT-002…022 implementation | ⏳ queued per INDEX |

## MCP verification (official docs)

Before external API changes:

- Gemini models → `gemini-api-docs-mcp`
- CopilotKit / AG-UI → `project-0-mdeai-copilotkit`
- Mastra tools → `user-mastra`
- Supabase schema → `user-supabase`

## Production readiness checklist

- [x] Hybrid search returns Relato/Sambombi for golden query (not grounded Places)
- [x] Rank explanation UI visible in browser
- [ ] `search_logs.hybrid_used = true` on live browser query (verify next slice)
- [ ] No service-role keys outside allowed paths
- [ ] CopilotKit 1.55.2 v1-only imports
- [ ] INT-001…005 tests green without live Gemini in CI
