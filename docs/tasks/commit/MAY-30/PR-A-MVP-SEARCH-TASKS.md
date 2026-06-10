# PR A — MVP-safe MIS search (C-014)

**Branch:** `feat/mis-multi-vertical-search` (from `main` after PR #16 merge)  
**Linear:** SAN-386 SEARCH-001, SAN-387 SEARCH-002, INT-002  
**Do not include:** PR #16 UX files, VEC-003/004, embed-worker, AI-004

## Pre-flight

```bash
cd /home/sk/mdeai/mdeapp
git fetch origin main
git checkout -b feat/mis-multi-vertical-search origin/main
# cherry-pick or apply only Bucket A files from WIP stash
```

## Commit slices (≤400 LOC each)

### C-014a — INT-002 + rental fast-path queryText

**Files:**
- `src/lib/rental-query-parser.ts`
- `src/lib/__tests__/rental-query-parser.test.ts`
- `src/lib/rental-search-fast-path.ts`
- `src/hooks/use-rental-search-fast-path.ts`
- `src/app/api/rentals/search/route.ts`

**Verify:** `npm run test -- rental-query-parser rental-search-fast-path`

### C-014b — SEARCH-001 rental hybrid

**Files:**
- `src/mastra/lib/intelligence-rental-search.ts`
- `src/mastra/lib/__tests__/intelligence-rental-search.test.ts`
- `src/mastra/tools/search-rentals.ts` (queryText path; **do not** import embedding-registry)

**Verify:** `curl -X POST localhost:3001/api/rentals/search -H 'Content-Type: application/json' -d '{"queryText":"digital nomad Laureles","limit":3}'`

### C-014c — SEARCH-002 event hybrid

**Files:**
- `src/mastra/lib/intelligence-event-search.ts`
- `src/mastra/lib/__tests__/intelligence-event-search.test.ts`
- `src/mastra/tools/search-events.ts`

**Verify:** `npm run test -- intelligence-event-search`

### C-014d — rank UI + envelope + venue anchors

**Files:**
- `src/components/copilot/search-tool-renders.tsx` (**fix stale rank block**)
- `src/lib/normalize-tool-envelope.ts`
- `src/mastra/tools/search-grounded-places.ts`
- `src/mastra/agents/concierge.ts` (queryText lines only)

**Verify:** Browser — rental then event query; only matching rank section visible

### C-014e — DATA-046 golden smoke

**Files:**
- `scripts/intelligence/golden-queries-smoke.ts`

**Verify:** `npm run smoke:golden-queries`

## Done gate

- [ ] `npm run floor` exit 0
- [ ] `npm run smoke:golden-queries` 8/8
- [ ] Browser: nomad rental + salsa (agent) with correct rank sections
- [ ] No changes to `query-embedding.ts` beyond what is already on `main`/PR #16
- [ ] PR targets `main`, not PR #16 branch

## PR title

`feat(search): MIS rental + event hybrid search (SEARCH-001/002)`

## PR body bullets

- Natural-language `queryText` on search-rentals and search-events
- Hybrid RPC + signal joins + search_logs
- rankExplanation on rental/event cards
- Golden query smoke v2 (8 Medellín journeys)
- Venue grounding query normalization (café Wi-Fi, salsa bar, rooftop)
