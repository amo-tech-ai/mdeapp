---
title: PR stack audit summary — #17–#20
date: 2026-05-30
auditor: cursor (forensic PR audit)
---

# Combined PR audit summary (#17–#20)

## Stack diagram

```
main
 ├── PR #17  feat/ux-002-005-chat          (UX only)
 ├── PR #18  feat/search-003-restaurants   (SEARCH-003 / INT-001)
 │    └── PR #19  feat/mis-rental-event-search   (SEARCH-001/002)  ⚠ CONFLICTING
 │         └── PR #20  feat/vec-embedding-cache   (DEFERRED)
```

## Comparison table

| PR | Base → Head | Files | Merge state | Tests (local) | Verdict | Readiness |
|----|-------------|------:|-------------|---------------|---------|----------:|
| [#17](https://github.com/amo-tech-ai/mdeapp/pull/17) | `main` ← `feat/ux-002-005-chat` | 13 | MERGEABLE / CLEAN | 329/329 | 🟡 Merge after small fixes | **88%** |
| [#18](https://github.com/amo-tech-ai/mdeapp/pull/18) | `main` ← `feat/search-003-restaurants` | 15 | MERGEABLE / CLEAN | 338/338 | 🟡 Merge after small fixes | **78%** |
| [#19](https://github.com/amo-tech-ai/mdeapp/pull/19) | `#18` ← `feat/mis-rental-event-search` | 17 | **CONFLICTING / DIRTY** | 338/338 | 🔴 Do not merge yet | **72%** |
| [#20](https://github.com/amo-tech-ai/mdeapp/pull/20) | `#19` ← `feat/vec-embedding-cache` | 7 | MERGEABLE (to #19) | 345/345 | 🔴 Do not merge (deferred) | **55%** |

## Safest merge order

1. **PR #17** → `main` — independent UX; fix 4 CodeRabbit items first
2. **PR #18** → `main` — fix enum + tool registration + restaurant empty fallback
3. **Rebase PR #19** onto updated #18; resolve `golden-queries-smoke.ts`; merge #19
4. **Hold PR #20** until DATA-042 + `query_embedding_cache` migration + MIS-M2

## Next actions

| Priority | Action | Owner |
|----------|--------|-------|
| P0 | Fix #17: pending try/catch, dedupe thinking, smoke path | Dev |
| P0 | Fix #18: `lastIntent` enum, register `extractIntentSlotsTool`, restaurant NL fallback | Dev |
| P0 | Rebase #19 on #18; resolve golden-queries conflict | Dev |
| P1 | Close superseded PR #16 after #17 merges | Dev |
| P1 | Trigger `@coderabbitai review` on #18 post-fixes | Dev |
| P2 | Add `query_embedding_cache` migration before un-deferring #20 | Dev + Supabase |
| P2 | Run `smoke:golden-queries` + browser UX smoke with evidence paths | QA |

## Per-PR audit docs

- [`12-PR-17-UX-AUDIT.md`](17-PR-17-UX-AUDIT.md)
- [`13-PR-18-SEARCH-AUDIT.md`](18-PR-18-SEARCH-AUDIT.md)
- [`14-PR-19-MIS-AUDIT.md`](19-PR-19-MIS-AUDIT.md)
- [`15-PR-20-VEC-AUDIT.md`](20-PR-20-VEC-AUDIT.md)
- [`17-PR-AUDIT-SKILLS-MCP-VERIFICATION.md`](./17-PR-AUDIT-SKILLS-MCP-VERIFICATION.md)
- [`18-PR-REAUDIT-EVIDENCE-2026-05-30.md`](./18-PR-REAUDIT-EVIDENCE-2026-05-30.md)
- Index: [`README.md`](./README.md)

## Unverified items (marked)

- Live `smoke:golden-queries` / hybrid RPC against production Supabase
- `embed:worker` and `verify:grounding-cards` CLI against real data
- PR #17 Playwright smoke re-run this session (prior evidence on disk)
- CodeRabbit full review on #19/#20 (auto-review disabled off default branch)
