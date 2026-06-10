---
task_id: PR-01
title: Verify #32 try/catch fallback (likely already fixed by #34)
phase: MEDIUM
priority: P2
status: Done
archived: 2026-06-02
main_sha: 4de18f1
prod_sha: 4de18f1
verified: 2026-06-01
main_sha: c9e54b8
spec_accuracy_pct: 100
audit_dot: green
github_pr: [32, 34]
verified_note: try/catch on origin/main L224-252; catch falls through to structured search; optional search-events.test.ts
area: backend
skill: mastra, vitest
source: docs/02-pr-audit.md (#32 critical finding)
depends_on: []
description: Confirm searchEventsIntelligent has a try/catch fallback on main; close if #34 covered it.
---

## Summary

| Field | Value |
|-------|-------|
| Audit claim | #32 merged `searchEventsIntelligent` with **no try/catch** → hard failure on RPC error |
| Live reality (2026-06-01) | `main:src/mastra/tools/search-events.ts` lines 224–257 **already wrap it** in `try{…}catch` with `source:'fallback'` — landed by **#34** (merged) |
| Action | **Verified 2026-06-01:** catch falls through to structured Supabase query (keyword path), not empty. Optional: add `search-events.test.ts` RPC-failure regression |

## Problem

The 8-PR audit ranked this the #1 critical fix, but it reviewed the #32 snapshot and **missed #34** ("events hybrid safety + live queryText wiring", merged after #32). The guard already exists. This task closes the loop honestly rather than re-fixing.

## Change (wiring)

| Layer | File | Action |
|-------|------|--------|
| Tool | `src/mastra/tools/search-events.ts` | Inspect (lines 224–257) — confirm catch path returns keyword results, not `{results:[]}` |
| Test | `src/mastra/tools/__tests__/search-events.test.ts` | Create/Modify — simulate `searchEventsIntelligent` throw → assert fallback returns keyword hits |

## Skill to use

- **`mastra`** — this is a Mastra tool; follow tool-output schema + error conventions.
- **`vitest`** — write the RPC-failure regression test (mock the intelligence call to throw).

## Gates / Acceptance

- [x] Confirmed on latest `main` (`c9e54b8`): catch falls through to structured search — Camila still gets results when hybrid RPC blips.
- [x] Catch does **not** return empty-only — it continues to `.from('events')` filter path.
- [ ] Optional follow-up: `search-events.test.ts` simulating `searchEventsIntelligent` throw (59 other mastra tool tests pass today).

## Testing & proof

### Persona / journey

**Camila** asks for salsa events → if hybrid RPC throws, she still sees keyword matches (never empty-only, never a stack trace).

### Pre-ship (if adding regression test)

```bash
cd mdeapp
npm test -- --run src/mastra/tools/__tests__/search-events.test.ts   # when created
npm test -- --run src/mastra/tools
npm run floor
```

### Implementation proof (Done @ `a9eb176`)

| Check | Command / evidence | Expected |
|-------|-------------------|----------|
| try/catch on `main` | `git show origin/main:src/mastra/tools/search-events.ts \| sed -n '218,260p'` | `try { … searchEventsIntelligent … } catch` → keyword fallback |
| Landed via | PR **#34** @ `3af7ea0` (supersedes audit #32 snapshot) | merged |
| Events in prod smoke | `PROD_SMOKE_BASE_URL=https://www.mdeai.co PW_SKIP_WEBSERVER=1 npm run test:e2e:prod-synthetic` | event-card count > 0 |
| Agent tool path | Mastra `conciergeAgent` → `search_events` tool | no uncaught RPC error in prod synthetic |

**Evidence:** `tasks/testing/evidence/prod-synthetic-smoke-2026-06-01.md` · `mdeapp/tmp/prod-synthetic-smoke-qa/report.json`

## Risks / Notes

- **Linear cross-ref:** no Linear issue tracks this try/catch guard. The closest, **SAN-387 (SEARCH-002, In Review)**, is the *hybrid_search_events wiring*, not the fallback guard. So the "already fixed by #34" premise rests on **git evidence** (verified this session: `main:search-events.ts:224–257` wraps `searchEventsIntelligent`), **not** on Linear — verify against git/PR history, not the board.
- If verification shows the fallback is empty-on-error (not keyword), this re-becomes a real fix — branch fresh off `main`, do not touch the hotfix tree.
- Persona: **Camila** asks "salsa this weekend" → on RPC failure she should see keyword matches, never a stack trace.
