# MIS multi-vertical WIP — forensic audit (2026-05-30)

**Auditor:** Claude Code (release engineer)  
**Git root:** `mdeapp/`  
**Working branch:** `feat/ux-002-005-chat-error-thinking` (PR #16 open)  
**Uncommitted WIP:** 14 modified + 10 untracked in `mdeapp/` (~580 insertions)

## Verdict

**NO-GO** to merge current branch as-is. **GO** after split:

1. **PR #16 (fix):** UX-002/005 only — drop commit `b7265b9` or open separate SEARCH-003 PR.
2. **PR A:** `feat/mis-multi-vertical-search` from updated `main` — Bucket A WIP only.
3. **PR B:** deferred embed/cache/worker/verifier + local migration.

Do **not** commit MIS WIP to `feat/ux-002-005-chat-error-thinking`.

## Score: 82/100 (post cross-clear browser pass)

| Area | Score | Notes |
|------|------:|-------|
| MVP search wiring | 85 | Rental hybrid + fast-path proven; event hybrid works in scripts |
| Test floor | 95 | 353/353, typecheck, check:mastra |
| PR hygiene | 55 | Mixed branch, infra coupled to search, stale rank UI bug |
| DB reproducibility | 60 | `query_embedding_cache` live via MCP only |
| Browser UX | 85 | Cross-clear PASS both directions; hydration warning remains |

---

## File classification

| File | Bucket | Notes |
|------|--------|-------|
| `src/lib/rental-query-parser.ts` | **A** | INT-002 confidence + queryText attach |
| `src/lib/__tests__/rental-query-parser.test.ts` | **A** | INT-002 tests |
| `src/lib/rental-search-fast-path.ts` | **A** | rankExplanation envelope |
| `src/hooks/use-rental-search-fast-path.ts` | **A** | passes queryText + meta |
| `src/app/api/rentals/search/route.ts` | **A** | queryText API |
| `src/mastra/lib/intelligence-rental-search.ts` | **A** | SEARCH-001 |
| `src/mastra/lib/intelligence-event-search.ts` | **A** | SEARCH-002 |
| `src/mastra/lib/__tests__/intelligence-rental-search.test.ts` | **A** | slot parser tests |
| `src/mastra/lib/__tests__/intelligence-event-search.test.ts` | **A** | slot parser tests |
| `src/mastra/tools/search-rentals.ts` | **A** | queryText + logs (keep HEAD `query-embedding` import) |
| `src/mastra/tools/search-events.ts` | **A** | queryText + logs |
| `src/mastra/agents/concierge.ts` | **A** | queryText instructions only (strip if stacked on #16) |
| `src/mastra/tools/search-grounded-places.ts` | **A** | venue anchor normalize (café/nightlife) |
| `src/components/copilot/search-tool-renders.tsx` | **A** | rankExplanation rental/event UI (**fix stale block**) |
| `src/lib/normalize-tool-envelope.ts` | **A** | rankExplanation passthrough |
| `scripts/intelligence/golden-queries-smoke.ts` | **A** | DATA-046 v2 (8 queries) |
| `package.json` | **A** | only `smoke:golden-queries` if already present; defer B scripts |
| `src/mastra/lib/embedding-registry.ts` | **B** | VEC-003 |
| `src/mastra/lib/query-embedding.ts` | **B** | VEC-004 cache layer (diff from HEAD) |
| `src/mastra/lib/__tests__/embedding-registry.test.ts` | **B** | |
| `src/mastra/lib/verify-card-grounding.ts` | **B** | AI-004 |
| `src/mastra/lib/__tests__/verify-card-grounding.test.ts` | **B** | |
| `scripts/intelligence/embed-worker.ts` | **B** | VEC-004 worker |
| `scripts/intelligence/verify-grounding-cards.ts` | **B** | AI-004 smoke |
| `../scripts/intelligence/verify-mis-phase1.mjs` | **B** | parent repo; cache table check — ship with migration |
| `supabase/migrations/*vec004*` | **B** | **MISSING locally** — must add before PR B |

**Bucket C (reject from MIS PRs):** none in current WIP tree. Do not add roadmap docs.

---

## Blocker verification

| Question | Answer |
|----------|--------|
| `query_embedding_cache` migration missing locally? | **YES** — 0 files under `supabase/migrations/`; table exists on remote (MCP applied) |
| DB changes only via MCP? | **YES** for cache table; breaks fresh clone / CI without migration file |
| Tests depend on remote DB? | **YES** — `verify:mis-phase1`, golden smoke, grounding-cards need live Supabase + Gemini key |
| Event date relax labeled? | **YES** in code — `date_window_relaxed` rank factor when no weekend rows |
| Rank explanations real? | **MOSTLY** — factors cite RPC/signal joins; `evidenceText` is templated `Signal source: {source}` not row evidence |
| `search_logs` safe? | **YES** — warn-only on failure; does not block search |
| Hybrid RPC fallback? | **YES** — SQL listing/event query when embed null or RPC empty |
| Works without cache warm? | **YES** — HEAD `query-embedding.ts` calls Gemini directly; cache is optional optimization |

---

## Critical fixes before PR A

1. ~~**Stale rank explanation**~~ — **fixed 2026-05-30:** event fast-path clears rental panel + rental pins; rental fast-path clears event panel + event pins (`use-*-search-fast-path.ts`).
2. **Event browser path** — live test hit chip fast-path; verify agent passes `queryText` on concierge turn.
3. **Branch isolation** — create `feat/mis-multi-vertical-search` from `main` post-#16; never add MIS commits to PR #16.
4. **PR A must not depend on `embedding-registry.ts`** — keep committed slim `query-embedding.ts` until PR B.

---

## Tests run (2026-05-30)

```text
npm run verify:mis-phase1     → 9/9 PASS
npm run smoke:golden-queries  → 8/8 PASS
npm run verify:grounding-cards → PASS
npm run test -- src/mastra/lib src/mastra/tools src/lib → 235/235 PASS
npm run typecheck             → PASS
npm run check:mastra          → PASS
npm run floor                 → 353/353 PASS (lint, build, test, audit moderate only)
```

---

## Browser proof (`http://localhost:3001/` — re-run 2026-05-30)

### Step 4 — cross-clear (WIP uncommitted hooks)

| Transition | Rental cards | Event cards | Why these rentals | Pins | Verdict |
|------------|--------------|-------------|-------------------|------|---------|
| nomad rental → salsa this weekend | cleared | ✅ 10 | cleared | ✅ 10 event | **PASS** |
| salsa → quiet rental Laureles | ✅ 8 | cleared | ✅ hybrid factors | ✅ 8 rental | **PASS** |

### Individual queries

| Query | Cards | Rank explanation | Pins | JSON leak | Notes |
|-------|-------|------------------|------|-----------|-------|
| Digital nomad rental Laureles | ✅ 8 rentals | ✅ hybrid_semantic, neighborhood_profile, digital_nomad_score | ✅ 8 | ✅ none | Fast-path + API hybrid |
| Salsa this weekend | ✅ 10 events | ✅ no stale rental block (after cross-clear fix) | ✅ 10 | ✅ none | Chip fast-path; not salsa-specific titles |
| Agent queryText path (salsa/rooftop/nomad) | ⏭ not run | — | — | — | Fast-path intercepts; event API lacks queryText |
| Café Wi-Fi Laureles | ⏭ not run | — | — | — | Agent turn |
| Dinner + nightlife Provenza | ⏭ not run | — | — | — | Agent turn |

**Red flag (UX):** React hydration warning in `concierge-chat-messages.tsx:97` — unrelated to MIS split; track under UX-002 PR.

---

## PR #16 contamination check

**Status: CONTAMINATED** — title says UX-only; branch has 2 commits vs `origin/main`:

| Commit | Scope | Files |
|--------|-------|------:|
| `b7265b9` | SEARCH-003 + INT-001 | 13 (restaurant hybrid, intent-slots, query-embedding, golden smoke v1) |
| `a9f0ea6` | UX-002/005 + partial INT-002 | 12 (chat error/thinking + rental-parser bonus) |

**Not in PR #16 commits (good):** SEARCH-001/002, Supabase migrations, embedding-registry, embed-worker.  
**In uncommitted WIP only:** rental/event hybrid, cross-clear hooks, Bucket B infra.

### PR #16 should contain (UX-only, 10 files)

- `src/app/layout.tsx`
- `src/components/chat/concierge-error-notice.tsx`, `concierge-thinking-indicator.tsx`, `concierge-chat-messages.tsx`, `chat-query-bar.tsx`, `concierge-chat-input.tsx`
- `src/components/chat/__tests__/concierge-error-notice.test.tsx`, `concierge-thinking-indicator.test.tsx`
- `src/components/copilot/copilot-kit-provider.tsx`
- `src/lib/concierge-error-store.ts`

**Move out of PR #16:** `rental-query-parser.ts` + tests (→ PR A INT-002); entire `b7265b9` (→ PR SEARCH-003 or merge before PR A).

### Safe split commands (after audit; no commit until approved)

```bash
cd mdeapp
git fetch origin main
git checkout -b feat/ux-002-005-only origin/main
git checkout a9f0ea6 -- src/app/layout.tsx src/components/chat/ src/components/copilot/copilot-kit-provider.tsx src/lib/concierge-error-store.ts
# open PR #16 replacement; close contaminated PR or force-push after review

git checkout -b feat/search-003-restaurants origin/main
git cherry-pick b7265b9

# after both merge:
git checkout main && git pull
git checkout -b feat/mis-multi-vertical-search
# apply Bucket A from stash (see PR-A-MVP-SEARCH-TASKS.md)
```

**Uncommitted MIS WIP must not be pushed to `feat/ux-002-005-chat-error-thinking`.**
