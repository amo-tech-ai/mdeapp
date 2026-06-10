---
title: MIS-M1 Forensic Production Verification Audit
auditor: Cursor agent (task-verifier protocol)
date: 2026-05-30
scope: Phase 1 MIS-M1 only — no Phase 1b, no new architecture
evidence: ../data/evidence/MIS-M1-2026-06-01.md
plan: ../intelligence-plan.md
---

# MIS-M1 Forensic Audit — 2026-05-30

## Executive verdict

**MIS-M1 is partially live — not production-ready for the golden browser gate.**

| Layer | Verdict |
|-------|---------|
| **Data plane** (migrations, seeds, RLS, signals) | ✅ **Live** — verified via Supabase MCP |
| **Retrieval plane** (SEARCH-003 hybrid + search_logs wiring) | ❌ **Not on disk** — app code regressed / never merged to `main` |
| **Browser golden query** (`quiet rooftop Provenza`) | ❌ **Wrong path** — concierge → Google Places, not Supabase hybrid |
| **Phase 1b gate** | 🔴 **BLOCKED** until SEARCH-003 re-ships + browser proof green |

**Percent correct (full MIS-M1 definition): ~52%**

- Data + migrations + RLS: **~95%**
- App hybrid retrieval + logging: **~0%** (lib files absent; tool unwired)
- Browser E2E vs acceptance criteria: **~25%** (cards + pins yes; wrong venues, no logs, no rank/evidence UI)
- Verification scripts: **~40%** (vitest schema-only green; verify script broken; golden smoke missing)

---

## Pass/fail checklist (10 gates)

| # | Gate | Result | Proof |
|---|------|--------|-------|
| 1 | **DB proof** | ✅ PASS | MCP row counts: venue_signals=30, event_signals=49, rental_signals=44, neighborhood_profiles=8, venue_source_evidence=20, search_logs=7 |
| 2 | **Migration proof** | ✅ PASS | Remote `list_migrations`: `20260601120000`…`120800` (9/9). Git: `tasks/data/migrations/` ↔ `supabase/migrations/` MIS files aligned |
| 3 | **RLS proof** | ✅ PASS | RLS enabled on all MIS tables; policies: search_logs=3, venue_signals=2, embedding_jobs=1, venue_source_evidence=2 |
| 4 | **Search/ranking proof** | ⚠️ PARTIAL | SQL golden query returns **Relato**, **Sambombi** (Provenza rooftop). App does not call hybrid RPC |
| 5 | **Evidence proof** | ⚠️ PARTIAL | DB `venue_source_evidence` has 20 rows. UI shows Places badges only, not editorial evidence |
| 6 | **Browser card proof** | ❌ FAIL (wrong source) | Cards: La Chula, 360 Rooftop, Ene Rooftop, NDN, The up Garden — **Google Places**, not Relato/Sambombi |
| 7 | **Map pin proof** | ⚠️ PARTIAL | **5 pins** (Places). Expected MIS path: **2 pins** (Supabase inventory) |
| 8 | **search_logs proof** | ❌ FAIL | Count stayed **7** after browser query; no new row. Historical rows exist from prior manual/smoke runs only |
| 9 | **Latency proof** | ❌ FAIL (no new sample) | Last logged latency 2570ms (2026-05-30 11:32 UTC). Browser run did not write a row |
| 10 | **Regression test proof** | ⚠️ PARTIAL | `npm run test -- --run search-restaurants` → **10/10** (schema helpers only). No hybrid/integration tests |

---

## 1. What works

- **VEC-001:** 3 HNSW indexes only (`listing_embeddings_hnsw`, `event_embeddings_hnsw`, `restaurant_embeddings_hnsw`) — duplicates removed (MCP `pg_indexes`).
- **DATA-039–047:** All nine MIS migrations applied remotely.
- **Signal seeds:** Counts match plan (30/49/44/8).
- **Astorga + Provenza SQL:** Golden SQL returns Relato (0.91 rooftop) + Sambombi (0.85) — real DB rows, not hallucinated.
- **RLS:** New tables have RLS + ≥1 policy.
- **Dev server:** `http://localhost:3001/` → 200; CopilotKit POST → 400 (runtime up).
- **Concierge UX:** Natural-language query returns cards + map pins (via **search-grounded-places**).

---

## 2. What failed

- **SEARCH-003 not on `main`:** These files are **absent** from `mdeapp/src/mastra/lib/`:
  - `intelligence-restaurant-search.ts`
  - `query-embedding.ts`
  - `search-logs.ts`
- **`search-restaurants.ts`** uses legacy keyword `searchRestaurants()` + `runAuditedSearch` — no `queryText`, no hybrid RPC, no `writeSearchLog`.
- **Browser golden query** routed to **conciergeAgent → search-grounded-places** (Google), not deterministic `search-restaurants` tool.
- **No rank explanation UI** — no `data-testid="rank-explanation"` in `search-tool-renders.tsx` / `place-result-card.tsx`.
- **No editorial evidence in cards** — `PlaceResultCard` has title/subtitle/maps only.
- **`verify-mis-phase1.mjs`** fails: `ERR_MODULE_NOT_FOUND @supabase/supabase-js` when run from repo root (wrong module resolution).
- **`golden-queries-smoke.ts`** — **file not found** on disk.
- **Evidence doc overstated disk state** — claimed SEARCH-003 wired; disk contradicts.

---

## 3. Critical blockers (Phase 1b)

1. Re-ship SEARCH-003: restore lib files + wire `search-restaurants` tool (hybrid + signals + search_logs).
2. Route rooftop/restaurant NL queries to **search-restaurants** (not only Places) — update `concierge.ts` instructions or fast-path.
3. Pass through `rankExplanation` + `evidence` in tool outputSchema → UI.
4. Browser proof: Relato + Sambombi cards, 2 pins, new `search_logs` row with `hybrid_used=true`.
5. Fix verification scripts (`verify-mis-phase1.mjs` import path; add/restore `golden-queries-smoke.ts`).

---

## 4. Red flags

| Flag | Severity |
|------|----------|
| Evidence doc says `verified` but app code missing | 🔴 |
| search_logs frozen at 7 — observability not connected to live UI | 🔴 |
| Places results ≠ Supabase editorial ranking (product inconsistency) | 🔴 |
| `tasks/intelligence/tasks/` has **duplicate INT stubs** (legacy names + canonical) | 🟡 |
| Hydration error overlay (`chat-nav-rail.tsx`) in dev | 🟡 |
| `verify-mis-phase1.mjs` hardcodes VEC-001 pass without live probe | 🟡 |
| Prior E2E screenshot/evidence may reflect unmerged branch work | 🟡 |

---

## 5. Security / RLS

- **MIS tables:** RLS enabled (MCP verified).
- **search_logs:** service_role insert pattern — correct for server-only logging; anon cannot exfil logs (3 policies).
- **venue_source_evidence:** service_role read in intelligence path would need service key in Mastra lib (F13 carve-out) — not applicable until code ships.
- **Supabase security advisors:** No new findings specific to MIS tables in spot-check (project has pre-existing legacy advisor noise).

---

## 6. Performance / latency

- Historical `search_logs`: **841–2570 ms** total (embed API dominates).
- SQL stage for golden query: **~1.4 ms** (prior EXPLAIN in evidence).
- Browser Places path: no latency logged to `search_logs`.
- **Risk:** Every NL query hitting Gemini embed + hybrid without caching → 800–2500ms (acceptable for MVP if logged; not acceptable without logging).

---

## 7. Grounding / evidence review

| Source | State |
|--------|-------|
| `venue_source_evidence` (editorial) | 20 rows in DB — not surfaced in current UI |
| Google Places grounding | Active in browser — "Google-verified candidate" badges |
| Rank explanation JSON | Present in **historical** search_logs rows only |

---

## 8. Search / ranking review

**DB (correct MIS path):**

```sql
-- Provenza rooftop ≥0.7, confidence ≥0.6
Relato (0.91), Sambombi Bistró Local (0.85)
```

**App (current):** Rating-sorted `restaurants` table scan OR Google Places — **no** `hybrid_search_restaurants` RPC, **no** `venue_signals` join in tool code.

---

## 9. Browser E2E result (2026-05-30 audit run)

| Check | Expected (MIS-M1) | Observed |
|-------|-------------------|----------|
| Route | `http://localhost:3001/` | ✅ |
| Query | `quiet rooftop Provenza` | ✅ submitted |
| Cards | Relato, Sambombi | ❌ La Chula, 360 Rooftop, Ene, NDN, The up Garden |
| Pins | 2 | ⚠️ 5 (Places) |
| Rank explanation UI | visible | ❌ absent |
| Evidence/citation UI | editorial text | ❌ Places badges only |
| search_logs new row | yes | ❌ count still 7 |
| hybrid_used | true | ❌ not written |
| conciergeAgent dependency | should not be required | ❌ full agent + Places path |
| Screenshot | — | `tasks/data/evidence/MIS-M1-browser-e2e-audit-2026-05-30.png` |

---

## 10. Supabase live verification

| Check | Result |
|-------|--------|
| Migrations 20260601120000–120800 | ✅ 9/9 remote |
| venue_signals | ✅ 30 |
| event_signals | ✅ 49 |
| rental_signals | ✅ 44 |
| neighborhood_profiles | ✅ 8 |
| Astorga neighborhood | ✅ (prior probe) |
| venue_source_evidence | ✅ 20 |
| search_logs | ✅ 7 (stale — no new writes) |
| HNSW duplicates removed | ✅ 3 indexes |
| RLS on MIS tables | ✅ |

---

## 11. Test output summary

```bash
cd mdeapp && npm run test -- --run search-restaurants
# → 10/10 PASS (mapCuisineFromTypes, priceLevelToTier, restaurantSchema only)

cd mdeapp && node ../scripts/intelligence/verify-mis-phase1.mjs
# → FAIL ERR_MODULE_NOT_FOUND @supabase/supabase-js

npx tsx scripts/intelligence/golden-queries-smoke.ts
# → FILE NOT FOUND
```

---

## INT task folder hygiene

**2026-05-30:** Removed 6 legacy duplicate stubs from `tasks/intelligence/tasks/` (were copies of root-level superseded files). Canonical set = **22 files** (`INT-001`…`INT-022`). Mapping: [`MIGRATION.md`](../tasks/MIGRATION.md).

---

## 13. Critical fixes (ordered)

1. Restore SEARCH-003 files on `main` and wire `search-restaurants.ts`.
2. Add rank/evidence pass-through + UI (`rank-explanation`, evidence text on cards).
3. Concierge routing: rooftop/restaurant NL → `search-restaurants` with `queryText`.
4. Fix `verify-mis-phase1.mjs` to run from `mdeapp/` or use createRequire.
5. Restore `golden-queries-smoke.ts`.
6. Re-run browser E2E; update evidence with fresh search_logs id.
7. Dedupe INT task folder stubs (no content duplication).

---

## 14. Suggested improvements (post-gate)

- Query embedding cache (Phase 1b DATA/SEARCH backlog).
- Integration test: mock embed + assert hybrid RPC called.
- CI step: `verify-mis-phase1.mjs` + golden smoke on PRs touching `search-restaurants`.
- Separate Linear label for "MIS data shipped" vs "SEARCH-003 app shipped".

---

## 15. Best-practice recommendations

- **Never mark MIS-M1 Done from DB alone** — require disk grep for `searchRestaurantsIntelligent` + browser row in `search_logs`.
- **Evidence doc must cite git SHA** for app claims.
- **Anti-fake-done:** If `search_logs` count unchanged after browser query → fail gate.
- **One canonical INT path:** `tasks/intelligence/tasks/INT-NNN-*.md` only.

---

## 16. Next execution order (Phase 1 frozen)

```
BLOCKED: Phase 1b (VEC-003 → SEARCH-001 …) until:

1. Re-ship SEARCH-003 on main (C-ledger row)
2. Browser proof green (Relato/Sambombi + logs)
3. verify-mis-phase1.mjs + golden smoke green
4. Update MIS-M1 evidence with SHA + search_logs id

Then (unchanged Phase 1b queue):
VEC-003 → VEC-004 → SEARCH-001 → SEARCH-002 → AI-004 → AI-003 → DATA-046 → VEC-005

INT program (Backlog): INT-001 → … after MIS-M1 browser gate
```

---

## 17. Sources probed

- Supabase MCP: `list_migrations`, `execute_sql`, `get_advisors`
- Disk: `mdeapp/src/mastra/tools/search-restaurants.ts`, `mdeapp/src/mastra/lib/`
- Browser: Cursor IDE browser MCP @ `:3001`
- Tests: vitest search-restaurants
- Scripts: `scripts/intelligence/verify-mis-phase1.mjs`
- Plan: `tasks/intelligence/intelligence-plan.md`
- Prior evidence: `tasks/data/evidence/MIS-M1-2026-06-01.md` (corrected below)
