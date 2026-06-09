---
commit_id: C-005
status: pending_commit
sha: pending
---

# C-005 — events fast path + panel

## Tracker

| Field | Value |
|-------|--------|
| **Commit ID** | C-005 |
| **Intended message** | `feat(events): fast-path search API and clarify bypass (C-005)` |
| **Percent complete** | **100%** on disk — **0%** committed |
| **Pass/fail (scope)** | **PASS** (unit + perf script) |
| **Production readiness** | **78/100** — **CONDITIONAL** Gate 9 |
| **Standalone** | ⚠️ Needs C-004 chat shell |
| **File count** | **~11** — OK |

## Files to include (exact)

```
scripts/perf-events-chat-latency.mjs
src/app/api/events/search/route.ts
src/components/copilot/event-card.tsx
src/components/copilot/__tests__/event-card.test.tsx
src/hooks/use-event-search-fast-path.ts
src/lib/event-clarify-copy.ts
src/lib/event-search-fast-path.ts
src/lib/__tests__/event-search-fast-path.test.ts
```

Also stage C-004 files that wire fast path if not yet committed:

- `src/components/chat/concierge-chat-input.tsx` (intercept)
- `src/components/chat/chat-query-bar.tsx` (chip handler)
- `src/contexts/event-search-results-context.tsx` (`sourceUrl`)

**Rule:** If C-004 already committed, only list C-005 paths above. If fast-path wiring still only in working tree, include wiring files in **C-005** not C-004.

## Files to exclude

- Mastra `search-events.ts` (C-003)
- Screenshots, `tasks/**`

## Tests required

```bash
npm run lint
npm test -- --run event-search-fast-path event-card event-clarify
node scripts/perf-events-chat-latency.mjs   # dev on :3001
```

## Verification results (2026-05-27)

| Test | Status |
|------|--------|
| Unit | **PASS** |
| Perf script T1 clarify | **PASS** ~103–120ms, 0 copilotkit |
| Perf script T2 Music chip | **PASS** ~0.9–1.4s, 1× `events/search`, 10 cards |
| Gate 9 persona path | **CONDITIONAL** — automated perf only; no Playwright in CI yet |

## Risks

| Risk | Level | Note |
|------|-------|------|
| Agent path still slow | Medium | fast path only for generic + chip |
| Card regression | Low | `shrink-0` on `event-card` |
| Rollback | Low | Users fall back to full agent loop |

## Blockers

- **C-004** must be on branch before this commit is meaningful.

## Rollback notes

Remove `/api/events/search` → chips hit copilotkit again (slow but works).

## Dependency notes

- **Requires:** C-004  
- **Required by:** none (tip feature for stack)

## Staging command

```bash
git add scripts/perf-events-chat-latency.mjs src/app/api/events/search/ \
  src/components/copilot/event-card.tsx src/components/copilot/__tests__/event-card.test.tsx \
  src/hooks/use-event-search-fast-path.ts src/lib/event-clarify-copy.ts \
  src/lib/event-search-fast-path.ts src/lib/__tests__/event-search-fast-path.test.ts
# If wiring not in C-004:
git add src/components/chat/concierge-chat-input.tsx src/components/chat/chat-query-bar.tsx
git commit -m "feat(events): fast-path search API and clarify bypass (C-005)"
```
