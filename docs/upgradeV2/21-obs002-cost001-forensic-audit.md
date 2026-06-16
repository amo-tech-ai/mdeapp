# OBS-002 / OBS-002b / COST-001 — Forensic Pre-Deploy Audit

**Date:** 2026-06-16 · **Branch:** `ai/obs-002-agent-error-visibility` · **Auditor:** automated forensic pass
**Verdict:** ✅ All code gates green · ⚠️ one scope decision + one deploy-ordering note before merge.

Tasks audited:
- **OBS-002 — Agent Error Visibility** (capture + classify failed agent turns)
- **OBS-002b — `ai_runs.error_type` Column** (promote failure class to an indexed column)
- **COST-001 — Token & Cost Tracking** (capture Gemini tokens + estimated USD per turn)

---

## Executive summary

All four hard gates pass on the committed branch: typecheck 0 errors, lint 0, unit tests
green, production build exit 0. Cost tracking is **proven end-to-end against the live
database** (a real Gemini turn logged 32,242 tokens = $0.009978, math exact). The
`error_type` column, its partial index, and an index-using query plan all exist in the
live Supabase project.

Two things to decide before pushing:
1. **PR scope** — this branch also carries 2 older SAN-896 (CopilotKit v2 evidence)
   commits + ~3.5 MB of screenshots that are not OBS/COST work. Bundle or split?
2. **Deploy ordering** — the code inserts `error_type` on every row. The migration is
   already applied to the shared DB, so this is safe *here*, but the migration must
   travel with any fresh-environment deploy or all `ai_runs` inserts silently fail.

| Task | Score | Ready | Risk |
|---|---|---|---|
| OBS-002 — Agent Error Visibility | 88 / 100 | 🟢 | LOW |
| OBS-002b — `ai_runs.error_type` Column | 95 / 100 | 🟢 | LOW |
| COST-001 — Token & Cost Tracking | 93 / 100 | 🟢 | LOW |
| **Overall** | **92 / 100** | 🟢 **YES** | **LOW** |

**Production Ready:** YES (code) · **Will deployment succeed:** YES (migration already live) · **Risk:** LOW

---

## Phase 1 — Repository audit

Committed branch vs `main`: **34 files, 9 commits.** Clean of artifacts.

| Check | Result |
|---|---|
| `.next` / `node_modules` / `.env` / `.log` in diff | 🟢 none |
| Generated artifacts | 🟢 none |
| Accidental secrets | 🟢 none (service-role only in `src/mastra/lib/ai-runs.ts` — allowed by F13 carve-out) |
| `console.log` / `debugger` added | 🟢 none (only `console.debug` gated behind `LOG_LEVEL=debug`, and `console.warn/error` on insert-failure — intentional) |
| Screenshots / binaries | 🟡 ~3.5 MB PNGs — **all belong to SAN-896, not OBS/COST** |
| Temp / local test artifacts | 🟢 none |

**Scope flags (🟡):**
- The branch was cut from a **SAN-896 · CK-V2-000** branch, not `main`. The 2 oldest of
  9 commits (`8bde5461`, `20d9ac47`) ship SAN-896 CK-v2 evidence (e2e spec, screenshots,
  a chat-view edit). They are **not in `main`**, so a PR from this branch bundles them.
- The **working tree has 373 uncommitted files** (mostly `.claude/skills/` churn + unrelated
  `src/**` UI edits). These are **NOT in any commit → NOT in the PR.** Safe, but the tree
  is dirty; do not `git add -A`.

**Merge readiness (committed scope): 9 / 10** — the only deduction is SAN-896 bundling.

---

## Phase 2 — OBS-002 verification (Agent Error Visibility)

**PASS — 88% · Risk LOW.** Source: `logging-mastra-agent.ts` `run()` + `mastra-telemetry.ts`.

The turn outcome is tracked with rxjs `tap` (complete/error) + `finalize` (fires on
complete, error, AND unsubscribe). Client abort = "unsubscribed before completion without
error" → classified `client_abort`, not `success`. This is the exact tourist-closes-browser
case in the brief, and it is handled by construction.

| Capability | Evidence | Verdict |
|---|---|---|
| Failed turns captured | `tap.error` flips status, `finalize` persists | 🟢 |
| Error message stored | `describeAgentError` (trimmed ≤500 chars, never throws) | 🟢 |
| Error classification | `classifyAgentError` → 9-value union | 🟢 |
| Client abort detected | `finalize`: success && !completed ⇒ `client_abort` | 🟢 |
| Timeout / rate-limit / auth | name/msg/status heuristics (429→rate_limit, 401/403→auth) | 🟢 |
| Tool / validation / database / model | keyword heuristics; unknown → `unknown` (never hidden) | 🟢 |

**Findings:**
- ⚪ **`tool_failure` is the only error type not explicitly unit-tested.** The other 8
  branches are covered in `mastra-telemetry.test.ts`. Add one assertion.
- 🟡 **No live error evidence.** All 1,111 `ai_runs` rows have `error_type = null`
  (success). Classification is proven by unit tests only — no real failure has yet landed
  in the column. Expected (column is new), but it means the live error path is untested
  end-to-end.
- ⚪ Classification is substring-heuristic; a Gemini error whose message lacks any keyword
  falls to `unknown`. Acceptable and self-flagging by design.

---

## Phase 3 — OBS-002b verification (`ai_runs.error_type` column)

**PASS — 95% · Risk LOW.** Verified against the **live** project `zkwcbyxiwklihegjhuql`.

| Check | Result |
|---|---|
| Migration additive | 🟢 `add column if not exists error_type text` |
| Migration idempotent / re-runnable | 🟢 `if not exists` on both column + index |
| No destructive changes | 🟢 nullable, no backfill, no type change |
| Index exists | 🟢 `idx_ai_runs_error_type` partial `WHERE error_type IS NOT NULL` |
| Query plan uses index | 🟢 `EXPLAIN` shows **Bitmap Index Scan on idx_ai_runs_error_type** |
| Insert path writes `error_type` | 🟢 `ai-runs.ts` insert includes `error_type` |
| Reads work / backward compatible | 🟢 nullable; old readers unaffected |

**Patricia's real query (Phase-3 example) — index-backed:**
```sql
select id, agent_name, error_message, created_at
from ai_runs
where error_type = 'rate_limit'
  and created_at >= now() - interval '7 days';
```

**Scores:** Migration safety **98%** · Rollback safety **90%** (trivially reversible:
`drop index … ; alter table … drop column …` — but **no `down` script is shipped**;
note it) · Production readiness **95%**.

---

## Phase 4 — COST-001 verification (Token & Cost Tracking)

**PASS — 93% · Risk LOW. Proven against the live DB.**

Capture chain (every link verified in source):
```
turn → LoggingMastraAgent.run() opens TokenSink, subscribes inside runWithTokenSink (ALS)
     → google("gemini-3.5-flash") wrapped by withTokenUsageTracking (Proxy)
     → doGenerate / doStream "finish" → addModelUsage() → active sink
     → finalize(): read sink → calculateModelCost() → recordMastraRun → ai_runs
```

| Path | Verdict |
|---|---|
| Input / output / total tokens captured | 🟢 sink accumulates per model call |
| Cost calculated | 🟢 `calculateModelCost` — single price source, no literals elsewhere |
| Cost stored + retrievable | 🟢 `estimated_cost_usd` column, live row confirmed |
| Streaming path | 🟢 `TransformStream` tee on `doStream` "finish" — no stream consumed |
| Tool-call / multi-step | 🟢 cumulative add per call; verify run emitted `TOOL_CALL_*` |
| Unknown model | 🟢 falls back to Flash rate, flags `cost_rate_fallback` — never silent $0 |
| Abort / missing usage | 🟢 no "finish" ⇒ last total kept; malformed ⇒ 0, no throw |

**Live proof — "Find me apartments in Laureles"-class concierge turn:**

| Metric | Captured | Recomputed | Match |
|---|---|---|---|
| input / output tokens | 32,103 / 139 | — | — |
| total tokens | 32,242 | — | — |
| estimated_cost_usd | $0.009978 | 32,103×0.30/1M + 139×2.50/1M = $0.0099784 | 🟢 exact |

**Findings:**
- 🟡 Rates in `model-cost.ts` are hand-set conservative constants — re-check vs Google
  pricing periodically.
- ⚪ The fast-path router classifier uses the **raw (unwrapped)** model to stay client-safe,
  so its tokens are intentionally untracked (small, noted in the doc).

---

## Phase 5 — Production safety review

| Area | Grade | Note |
|---|---|---|
| Security | 🟢 | Service-role confined to `src/mastra/lib/ai-runs.ts` (F13 carve-out); no secrets in diff |
| Reliability | 🟢 | `recordMastraRun` never throws; 2.5 s insert timeout; `clearTimeout` in `finally` |
| Performance | 🟢 | Logging in `finalize` off the response path; partial index keeps failure queries cheap |
| Observability | 🟡 | Captured + queryable, but **no dashboard/UI** for Patricia and **no Sentry tie-in** |
| Monitoring / alerts | 🟡 | No alert on rate-limit/error-rate spikes |
| Cost visibility | 🟢 | Per-turn token + USD on every row |

**🔴 / 🟡 / ⚪ register:**
- 🟡 **Deploy ordering (highest item).** `ai-runs.ts` inserts `error_type` unconditionally.
  If code reaches an environment **before** the migration, **every** `ai_runs` insert
  fails (caught + swallowed → no rows, silent logging blackout). **Mitigated here:** the
  migration is already applied to the shared prod DB. Action: ensure the migration ships
  with/ahead of the deploy in any fresh environment.
- 🟡 No dashboard / no alerting / no Sentry link (follow-up, not a blocker).
- ⚪ `tool_failure` untested; no `down` migration script; classifier tokens untracked.
- 🟢 Good: single cost source of truth; abort-safe by construction; idempotent migration;
  never-throw logging.

---

## Phase 6 — Regression audit (SAN-896 · CK-V2-000)

| Check | Result |
|---|---|
| v1 `@copilotkit/react-core` / `react-ui` imports (excl. `/v2`) | 🟢 0 |
| `audit:copilotkit-v2` | 🟢 v1 hook files = 0, v2 hook files = 18 |
| Production build (all routes compiled) | 🟢 exit 0 |
| Chat / host analytics / host event / cards / maps | 🟢 build compiles all routes; no v1 reintroduced |

No regression introduced by OBS/COST changes — they touch only `src/mastra/lib/**` and the
logging agent, not UI/CopilotKit surfaces.

---

## Phase 7 — PR readiness gates

| Gate | Command | Result |
|---|---|---|
| Typecheck | `npx tsc --noEmit` | 🟢 exit 0 |
| Lint | `eslint` (changed src) | 🟢 exit 0 |
| Tests | `vitest` (4 OBS/COST files) | 🟢 22 passed |
| Build | `npm run build` | 🟢 exit 0 |

---

## Phase 8 — Deployment checklist (per task)

| Task | % Complete | Prod-ready % | Risk % | Confidence % | Missing work |
|---|---|---|---|---|---|
| OBS-002 — Agent Error Visibility | 95 | 90 | 12 | 88 | `tool_failure` test; one live error row to prove path |
| OBS-002b — `ai_runs.error_type` Column | 100 | 95 | 8 | 96 | optional `down` migration script |
| COST-001 — Token & Cost Tracking | 98 | 93 | 10 | 94 | pricing-freshness check; classifier-token note |

**Recommended next steps:** (1) decide PR scope (below); (2) add the `tool_failure` test;
(3) after merge, re-query `ai_runs` to confirm real user turns populate tokens + a real
error classifies; (4) backlog a Patricia dashboard + error-rate alert.

---

## Phase 9 — PR gate

No critical issue, no data-loss risk, build green, tests green → **clear to push.**
Blocked only on the **scope decision**: this branch bundles SAN-896 CK-v2 commits +
screenshots on top of which OBS/COST sit. Splitting requires a rebase (SAN-896 is at the
branch base). Awaiting owner's call before pushing.
