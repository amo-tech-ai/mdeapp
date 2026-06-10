# Release audit — MIS / PR #16 split

**Audit complete. No commits made.** Full artifact: [`tasks/commit/MAY-30/FORENSIC-AUDIT-2026-05-30.md`](tasks/commit/MAY-30/FORENSIC-AUDIT-2026-05-30.md)

---

## Step 1 — PR #16 contamination

**Status: CONTAMINATED** — title says UX-only; branch has 2 commits ahead of `origin/main` (`a9fffe8`).

| Commit | Intended scope | Actual |
|--------|----------------|--------|
| `b7265b9` | — | **SEARCH-003** restaurant hybrid + INT-001 intent slots (13 files) |
| `a9f0ea6` | UX-002/005 | UX chat (10 files) + **partial INT-002** in `rental-query-parser.ts` |

**Checks**

| Rule | Result |
|------|--------|
| UX-002/005 only | ❌ SEARCH-003 commit included |
| No MIS rental/event hybrid | ✅ SEARCH-001/002 only in **uncommitted** WIP |
| No Supabase migrations | ✅ zero files under `mdeapp/supabase/migrations/` |
| No SEARCH-001/002/003 in UX PR | ❌ SEARCH-003 committed; 001/002 uncommitted |

### Exact files — PR #16 should keep (UX-only)

```
src/app/layout.tsx
src/components/chat/concierge-error-notice.tsx
src/components/chat/concierge-thinking-indicator.tsx
src/components/chat/concierge-chat-messages.tsx
src/components/chat/chat-query-bar.tsx
src/components/chat/concierge-chat-input.tsx
src/components/chat/__tests__/concierge-error-notice.test.tsx
src/components/chat/__tests__/concierge-thinking-indicator.test.tsx
src/components/copilot/copilot-kit-provider.tsx
src/lib/concierge-error-store.ts
```

### Remove from PR #16 → separate PRs

**→ PR SEARCH-003** (commit `b7265b9`, 13 files):

```
package.json
scripts/intelligence/golden-queries-smoke.ts
src/components/copilot/place-result-card.tsx
src/components/copilot/search-tool-renders.tsx  # restaurant rank UI only in this commit
src/lib/__tests__/intent-slots.test.ts
src/lib/intent-slots.ts
src/mastra/agents/concierge.ts
src/mastra/lib/__tests__/intelligence-restaurant-search.test.ts
src/mastra/lib/intelligence-restaurant-search.ts
src/mastra/lib/query-embedding.ts
src/mastra/lib/search-logs.ts
src/mastra/tools/extract-intent-slots.ts
src/mastra/tools/search-restaurants.ts
```

**→ PR A** (from UX commit bleed):

```
src/lib/rental-query-parser.ts
src/lib/__tests__/rental-query-parser.test.ts
```

---

## Step 2–3 — PR A branch plan

After PR #16 (UX-only) + SEARCH-003 are on `main`:

```bash
cd mdeapp && git checkout main && git pull
git checkout -b feat/mis-multi-vertical-search
# stash/cherry-pick Bucket A only — see PR-A-MVP-SEARCH-TASKS.md C-014a–e
```

### Exact files — PR A (Bucket A)

**Modified (14):**

```
package.json                          # smoke:golden-queries only
scripts/intelligence/golden-queries-smoke.ts
src/app/api/rentals/search/route.ts
src/components/copilot/search-tool-renders.tsx   # rental/event rank UI
src/hooks/use-event-search-fast-path.ts          # cross-clear
src/hooks/use-rental-search-fast-path.ts         # cross-clear + queryText meta
src/lib/__tests__/rental-query-parser.test.ts
src/lib/normalize-tool-envelope.ts
src/lib/rental-query-parser.ts
src/lib/rental-search-fast-path.ts
src/mastra/agents/concierge.ts
src/mastra/tools/search-events.ts
src/mastra/tools/search-grounded-places.ts
src/mastra/tools/search-rentals.ts
```

**New (6):**

```
src/mastra/lib/intelligence-rental-search.ts
src/mastra/lib/intelligence-event-search.ts
src/mastra/lib/__tests__/intelligence-rental-search.test.ts
src/mastra/lib/__tests__/intelligence-event-search.test.ts
```

**PR A must NOT touch:** `query-embedding.ts` cache layer (keep SEARCH-003 slim version until PR B).

### Exact files — PR B (deferred)

```
src/mastra/lib/embedding-registry.ts
src/mastra/lib/query-embedding.ts              # cache read/write diff
src/mastra/lib/verify-card-grounding.ts
src/mastra/lib/__tests__/embedding-registry.test.ts
src/mastra/lib/__tests__/verify-card-grounding.test.ts
scripts/intelligence/embed-worker.ts
scripts/intelligence/verify-grounding-cards.ts
../scripts/intelligence/verify-mis-phase1.mjs  # cache check → ship with migration
supabase/migrations/*vec004*                   # MISSING locally — blocker
```

---

## Step 4 — Browser E2E (cross-clear)

**Both directions PASS** on `http://localhost:3001/` with uncommitted hook fix:

| Test | Result |
|------|--------|
| nomad rental Laureles → salsa this weekend | Rental cards + “Why these rentals” cleared; 10 event cards; 10 event pins |
| salsa → quiet rental Laureles | Event cards cleared; 8 rental cards; hybrid rank block; 8 rental pins |

**Red flag:** React hydration warning in `concierge-chat-messages.tsx:97` — UX PR scope, not MIS.

---

## Step 5 — Agent `queryText` path

| Query | Fast-path? | Hybrid? | Gap |
|-------|------------|---------|-----|
| digital nomad rental Laureles | ✅ rental API | ✅ `hybridUsed: true` | — |
| salsa this weekend | ✅ event chips | ❌ SQL fast-path only | `/api/events/search` has **no `queryText`** |
| quiet rooftop Provenza | ⏭ not browser-tested | ✅ golden smoke 8/8 | Agent path unverified in browser |

Event hybrid (SEARCH-002) works in Mastra tool + golden smoke; **browser chip fast-path bypasses it**. PR A follow-up: add `queryText` to `/api/events/search` + event fast-path hook if chip UX should use hybrid.

---

## Step 6 — Test summary (2026-05-30, current WIP tree)

| Command | Result |
|---------|--------|
| `npm run test -- rental-search-fast-path event-search-fast-path` | **17/17** |
| `npm run test -- intent-slots intelligence-restaurant search-restaurants` | **18/18** |
| `npm run smoke:golden-queries` | **8/8** |
| `npm run verify:mis-phase1` | **9/9** |
| `npm run typecheck` | **PASS** |
| `npm run check:mastra` | **PASS** |

---

## Blockers & red flags

1. **PR #16 contaminated** — must split before merge-as-UX-only.
2. **`query_embedding_cache`** — live on remote via MCP; **no local migration** → PR B blocker for fresh clones/CI.
3. **Event browser path** — fast-path skips SEARCH-002 hybrid unless API wired.
4. **Golden “salsa”** — hits `date_window_relaxed`; titles aren’t salsa-specific.
5. **Patricia DATA-041** — human QA still unsigned.
6. **Tests hit live Supabase + Gemini** — not hermetic CI.
7. **Cross-clear fix uncommitted** — must land in PR A, not PR #16.

---

## Go / no-go

| Target | Verdict |
|--------|---------|
| Merge current `feat/ux-002-005-chat-error-thinking` as UX-only | **NO-GO** |
| Split PR #16 → UX-only + SEARCH-003 | **GO** |
| PR A (`feat/mis-multi-vertical-search`) after main updated | **GO** (Bucket A tests green; browser cross-clear verified) |
| PR B (embed/cache/worker) | **NO-GO** until local migration exists |

**Score: 82/100**

---

## Recommended commit messages

**PR #16 (UX-only):**
```text
feat(ux): UX-002 error bubble + UX-005 thinking indicator (C-013)

- Concierge error notice + thinking indicator in chat shell
- CopilotKit provider error bridge
```

**PR SEARCH-003:**
```text
feat(search): SEARCH-003 hybrid restaurant search + INT-001 intent slots

- hybrid_search_restaurants RPC + rankExplanation UI
- intent-slots parser + golden smoke v1
```

**PR A:**
```text
feat(search): MIS rental + event hybrid search (SEARCH-001/002)

- queryText on search-rentals/events + rental fast-path API
- INT-002 parser confidence bands
- rankExplanation UI + cross-vertical panel/pin clear
- Golden query smoke v2 (8 journeys)
```

---

## Linear tasks to update

| When | Task | Action |
|------|------|--------|
| PR #16 merge | UX-002, UX-005 | → Done |
| PR SEARCH-003 merge | SEARCH-003, INT-001, MASTRA-MIS-001 | → Done (if not already) |
| PR A merge | SEARCH-001 (SAN-386), SEARCH-002 (SAN-387), INT-002 | → Done |
| PR B merge | VEC-003/004, AI-004 | → In Review until migration lands |
| Blocked | DATA-041 | Awaiting Patricia sign-off |

---

## Split execution order

1. **Fix PR #16** — new branch from `main`, UX files only; cherry-pick `b7265b9` to `feat/search-003-restaurants`.
2. **Merge UX + SEARCH-003** to `main`.
3. **`git checkout -b feat/mis-multi-vertical-search`** — apply Bucket A WIP (stash → C-014a–e slices).
4. **Defer PR B** — strip `embedding-registry`, cache diff, embed-worker from PR A.
5. **Optional PR A add-on** — `queryText` on `/api/events/search` for chip fast-path parity.

Say when you want the split executed (branch creation + stash apply); still holding commits per your rule.