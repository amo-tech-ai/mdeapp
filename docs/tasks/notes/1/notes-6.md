## DATA-041 — Complete

Verified via **mde-supabase** workflow (local service-role probes; Supabase plugin MCP timed out). No DDL changes needed — table + seed already live.

### Verification results

| Gate | Result |
|------|--------|
| Migration | `mdeapp/supabase/migrations/20260601120300_data041_venue_signals.sql` ✅ |
| Row count | **30** (20 restaurant + 10 anchor) ✅ |
| GQ-S01 | *quiet rooftop Provenza* → **Relato, Sambombi Bistró Local** ✅ |
| RLS | 2 policies; anon SELECT works ✅ |
| `confidence < 0.6` | **0 rows** ✅ |
| `verify-mis-phase1.mjs` | **9/9 passed** ✅ |
| Vitest | **3/3 passed** (added confidence gate test) ✅ |

### Code change (minimal)

Exported `signalBoost` + test that `confidence < 0.6` → zero rank boost (DATA-041 spec rule):

```typescript
// intelligence-restaurant-search.test.ts — new test
expect(low).toBe(0);  // confidence 0.55 excluded from SEARCH-003 boost
```

### Docs updated

- `tasks/data/evidence/DATA-041-verify-2026-06-03.md` — full evidence + grade
- `DATA-041-venue-signals.md` → **status: Done**
- Human QA sheet — engineering **Pass** 2026-06-03
- `tasks.md` row 3 → **100% 🟢**
- `INDEX-data.md` → Done

### Grade (task-verifier rubric)

| | Score | Grade |
|---|------:|---|
| **Spec quality** | 96/100 | **A** |
| **Execution readiness** | 95/100 | **A−** |

**−5:** Patricia editorial spot-check still ☐ (O.C.I. rooftop 0.96, Carmen cocktail 0.85) — blocks **MIS-M1 editorial**, not DATA-041 engineering Done.

### Persona effect

Tourist asks *"quiet rooftop dinner Provenza"* → `searchRestaurantsIntelligent` joins `venue_signals`, boosts Relato/Sambombi — no hallucinated venues.

### Remaining (optional)

1. Patricia signs [`DATA-041-venue-signals-human-qa.md`](tasks/data/evidence/DATA-041-venue-signals-human-qa.md)
2. Commit slice: test export + evidence docs (say if you want that)
3. **SEARCH-003** is unblocked — next intel task per queue