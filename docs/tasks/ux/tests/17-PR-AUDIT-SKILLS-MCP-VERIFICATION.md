---
title: PR #17–#20 audit — skills & MCP verification addendum
date: 2026-05-30
last-verified: 2026-05-31
refs: index-skills.md, tasks/ux/tests/12–16
---

# Skills & MCP verification addendum

## Direct answer

**No — the first audit pass did not fully follow `index-skills.md`.**

| Expected (index-skills routing) | PR audit | Done in pass 1? | Done in addendum? |
|---------------------------------|----------|-----------------|-------------------|
| `task-verifier` (Done gate protocol) | All PRs | ❌ Not loaded | ⚠️ Partial (disk + npm probes only) |
| `copilotkit` + `copilotkit-integrations` | #17 | ❌ | ✅ CopilotKit MCP `search-code` |
| `mastra` + `gemini` | #18–#20 | ❌ | ✅ Gemini MCP + Supabase MCP; Mastra MCP weak |
| `mde-supabase` + Supabase MCP | #18–#20 | ❌ | ✅ Supabase MCP |
| `code-review` | All PRs | ❌ | ❌ (CodeRabbit comments used instead) |
| `testing` | All PRs | ✅ npm test/build | ✅ |

Pass 1 was **`gh` + local floor + disk reads + CodeRabbit comments**. This addendum records MCP probes run after the user asked.

---

## MCP verification results (2026-05-30, re-confirmed 2026-05-31)

### Gemini API (`gemini-api-docs-mcp`)

| Claim | Result | Source |
|-------|--------|--------|
| `gemini-embedding-001` is valid embed model | ✅ Verified | Gemini embeddings docs via MCP `fetch_docs` |
| 768-dim via `outputDimensionality` | ✅ Verified | Same doc — recommends 768/1536/3072 |
| PR `query-embedding.ts` / `embedding-registry.ts` model+dimension | ✅ Matches official docs | Disk + MCP |

### Supabase (`user-supabase` MCP)

| Claim | Result | Source |
|-------|--------|--------|
| `hybrid_search_restaurants` RPC | ✅ Exists | `execute_sql` on `information_schema.routines` |
| `hybrid_search_listings` RPC | ✅ Exists | Same |
| `hybrid_search_events` RPC | ✅ Exists | Same |
| `search_logs` table | ✅ Exists | Same |
| `query_embedding_cache` table | ✅ **Remote only** | MCP `list_migrations` includes `vec004_query_embedding_cache`; **0 files** under `supabase/migrations/` match `query_embedding_cache` — migration not in repo |
| `embedding_jobs` table | ✅ Exists remote | MCP + local migration `20260601120200_data040_embedding_jobs.sql` |

**PR #20 correction stands:** Remote DB has the cache table; repo migration for `vec004` is missing locally. Deferral is correct.

### CopilotKit (`project-0-mdeai-copilotkit` MCP)

| Claim | Result | Source |
|-------|--------|--------|
| PR #17 `<CopilotKit onError={...}>` pattern | ✅ Valid for 1.55.2 | MCP `search-code` → `copilotkit-props.tsx` defines `onError?: CopilotErrorHandler` |
| Client wrapper in App Router | ✅ Best practice | Matches skill note: no functions from Server Components |

**Still unverified:** Whether `reportConciergeError` receives all RUN_ERROR paths without `publicApiKey`. CopilotKit source shows some UI errors only trace when `publicApiKey` is set — needs runtime browser proof.

### Mastra (`user-mastra` MCP)

| Claim | Result | Source |
|-------|--------|--------|
| Agent must register tools in `tools: {}` | ✅ **Disk-verified 2026-05-31** | `git show origin/feat/search-003-restaurants:src/mastra/agents/concierge.ts` — `extractIntentSlotsTool` file exists but NOT in concierge `tools` block |
| `createTool` API shape | ⚠️ Unverified via MCP | Disk: `extract-intent-slots.ts` uses `createTool` from `@mastra/core/tools` |

---

## Impact on verdicts (updated 2026-05-31)

| PR | Verdict | MCP/audit finding | Change since 2026-05-30 |
|----|---------|-------------------|-----------------------|
| #17 | 🟡 Merge after rebase + 3 fixes | `onError` wiring confirmed idiomatic; 4 code issues confirmed still open | Merge readiness ↓ 88% → 82% (GitHub CONFLICTING due to 3 main CI commits) |
| #18 | 🟡 Merge after enum + tool fix | RPCs + embed model confirmed; agent tool gap disk-verified | Merge readiness ↑ 78% → 88% (all 9 CodeRabbit fixes applied `97a0c0d` + `645acdb`; 2 agent wiring issues remain) |
| #19 | 🟡 Merge after #18 | Hybrid RPCs confirmed; 5 regressions found + fixed in `3f98068` | Merge readiness ↑ 72% → 82% (regressions fixed; GitHub CONFLICTING is stack artifact) |
| #20 | 🔴 Do not merge | Cache table on remote, not in local migrations; PII stripped again | Merge readiness ↓ 55% → 40% (needs rebase onto updated #19; PII regression re-introduced) |

---

## Skill routing that should have been loaded

Per `index-skills.md`:

| PR | Should load first | Then |
|----|-------------------|------|
| #17 | `copilotkit` → `copilotkit-integrations` | `testing`, CopilotKit MCP |
| #18 | `mastra`, `gemini` | `mde-supabase`, gemini + Supabase MCP |
| #19 | `mastra`, `mde-real-estate` | Supabase MCP |
| #20 | `gemini`, `mde-supabase` | Supabase MCP |

---

## Recommended re-audit steps (if 100% skill/MCP compliance required)

1. Load `task-verifier` and re-run anti-fake-done checklist per PR branch.
2. `@coderabbitai review` on #18 after enum + tool fix (rate-limited during pass 1).
3. Browser proof for #17 RUN_ERROR → error bubble (CopilotKit MCP cannot substitute).
4. `npm run smoke:golden-queries` on #18/#19 with `.env.local` (live Supabase + Gemini).
5. Copy `vec004_query_embedding_cache` migration from remote into `supabase/migrations/` before un-deferring #20.
6. Re-run `npm test` on `feat/vec-embedding-cache` **after** rebasing onto updated `feat/mis-rental-event-search` (`3f98068`).

---

## Re-audit execution (2026-05-30) — DONE

Full evidence: [`18-PR-REAUDIT-EVIDENCE-2026-05-30.md`](./18-PR-REAUDIT-EVIDENCE-2026-05-30.md)

| Step | Status | Result |
|------|--------|--------|
| 1 task-verifier gates | ✅ | #17 gate 9 + floor; #18/#19 golden + floor |
| 2 Browser #17 error bubble | ✅ | Playwright → `ux-002-error-bubble-smoke.png` |
| 3 Golden queries | ✅ | #18 PASS · #19 **8/8 PASS** |
| 4 vec004 migration | ✅ | `supabase/migrations/20260530123440_vec004_query_embedding_cache.sql` (uncommitted) |

**Bonus:** `npm run verify:mis-phase1` → **9/9 passed** (includes VEC-004 cache table).

**Still open:** CodeRabbit #17 · #18 three majors · #19 git rebase · #20 cache I/O · commit migration
