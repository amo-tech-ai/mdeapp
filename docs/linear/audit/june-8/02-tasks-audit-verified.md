---
id: LINEAR-AUDIT-JUNE-8-VERIFIED
title: Forensic task audit — canonical source (probe-cited)
audited_at: 2026-06-08
canonical: true
auditor: task-verifier + Linear MCP + Supabase MCP
supersedes: 01-tasks-audit.md (stale / inflated scores — do not use for Done gates)
method: fail-closed — Verified (V) / Reported (R) / Stale
scope_deep: SAN-546, SAN-828, SAN-548, SAN-368, MVP gates G1–G3
scope_status_verified: SAN-462,369,366,116,178,115,704,856,823,545,549,828
mcp_probes:
  linear: SAN-546,548,828,368,462,369,366,116,178,115,704,856
  supabase: ai_runs + mastra_threads/messages SQL (zkwcbyxiwklihegjhuql)
  prod: route GET audit + chat-smoke.mjs
canonical_queue: tasks/INDEX.md Tier 1 (079–092)
---

# Forensic Task Audit — 2026-06-08 (clean rebuild)

> **Why this file exists:** the original `01-tasks-audit.md` was overwritten mid-session by a parallel agent (shared-tree churn — see memory `project-shared-worktree-parallel-agent`). This is a fresh, self-contained rebuild written to a new filename so it is not clobbered again. Where it adopts a claim from the PM "revision 2" doc, it **re-probed it** (or marks it *Reported, not re-probed*).
> **Repo:** `amo-tech-ai/mdeapp` · **Prod:** `https://www.mdeai.co` · **Supabase:** `zkwcbyxiwklihegjhuql`.

**Legend:** 🟢 meets bar · 🟡 partial/fix-before-Done · 🔴 blocker · ⚪ N/A · **V** = verified by my probe this session · **R** = reported by PM sprint, not re-probed.

---

## Audit-integrity caveats (read first)

| # | Caveat | Impact |
|---|--------|--------|
| C1 | **Shared tree branch-hopped ≥4× mid-audit** (`san-731` → `san-545-823` → `san-135` → `main`) and a parallel agent rewrote `01-tasks-audit.md`. Current checkout may differ (e.g. `ai/san-135-normalize-host-display`). | `npm test`/`build`/`floor` not re-run (would test an unrelated branch). Build/test claims are **Reported, not verified** except where noted in §Re-verification. |
| C2 | **Evidence tree only partially migrated** into mdeapp. Changelog/specs cite `../tasks/testing/evidence/…` = parent planning repo, not `docs/tasks/`. e.g. `SAN-546-tier1-non-events-matrix.md` exists only in the parent. | In-repo evidence links escape the repo. 🟡 |
| C3 | Grades drift across trackers (SAN-546 seen as 72 / 65 / 91 across docs). | Treat grades as approximate; single-source them. |

---

## Verification report (task-verifier §8)

| Task | Linear status (V) | Impl on disk | Exec readiness /100 | Production-ready? | Grade | Will succeed? |
|---|---|---|---:|---|---|---|
| **SAN-546** OPS-JOURNEY J05–J20 | In Progress (V) | matrix doc only; **no `prod-journey-j05-j20.spec.ts`** | 58 | 🔴 No | C+ / 72 | 🟡 after manual J10–J15 + spec |
| **SAN-828** CopilotKit 401 vs 400 | **Done** (V, 20:42 today) | route auth-first 401 (V); smoke aligned (R `7eb97a1`) | 90 | 🟢 Yes | A− / 91 | ✅ shipped |
| **SAN-548** F13 thread persistence | In Progress (V) | `storage.ts` Postgres ✅ + DB rows ✅ | **83 impl** / **40 journey** | 🟡 **Not Done** until turn-11 | B impl / C+ exit | 🟢 code · 🔴 Done gate |
| **SAN-368** MAP-002B ADK prod | In Progress (V) | client ✅; deploy + env **split gaps** | 42 | 🔴 No | C− / 65 | 🟡 infra |
| **SAN-178** PAY-001 live ticket | **Todo** (V, never started) | checkout on disk; no prod paid proof | 30 | 🔴 No | F / 42 | 🔴 P0 gate |
| **SAN-115** AIE-001 proof ledger | **Todo** (V, SLA breached 06-04) | blocked by SAN-178 (G1) | 30 | 🔴 No | F / 45 | 🔴 P0 gate |

**Stop condition (task-verifier §9):** 🛑 **MVP exit blocked.** Hard chain: **G1 paid ticket (SAN-178) → EVP-001 ledger (SAN-115)**. Secondary: SAN-368 deploy+env proof · SAN-546 J05–J20 automation · SAN-548 turn-11 journey. SAN-828 ✅ · SAN-548 **83% implementation only — not closable without cold-start proof**.

---

## Phase 1 — Skill verification

| Task | Required skill/MCP | Loaded (evidence) | Correct |
|---|---|---|:---:|
| SAN-546 | `testing`, playwright | 🟡 `prod-synthetic-smoke.spec.ts` ✅; `prod-journey-j05-j20.spec.ts` ✗ | 🟡 |
| SAN-828 | `copilotkitV1` | 🟢 route auth-first verified; decision shipped | 🟢 |
| SAN-548 | `mastra`, `mde-supabase` | 🟢 `@mastra/pg PostgresStore` correct; schema verified | 🟢 |
| SAN-368 | `mde-maps`, `mde-vercel`, `google-agents-cli-adk-code` | 🟡 client present; Cloud Run/Vercel env unverified; ADK skill is Phase-2-marked | 🟡 |

---

## Phase 2 — Technical audit (probe-cited)

### SAN-546 — Prod journey matrix J05–J20
- 🟢 **(V)** Blocker **SAN-462** soak gate = **Done** 2026-06-05 (`get_issue` → completed). Cleared.
- 🟢 **(V)** J07/J08 PASS via `e2e/prod-synthetic-smoke.spec.ts` (on disk, 4160 B).
- 🔴 **(V)** `ls e2e/prod-journey-j05-j20.spec.ts` → **No such file.** The headline automated J05–J20 deliverable does not exist (issue body itself asks to create it). Only `prod-synthetic-smoke.spec.ts` + `prod-ven025-nightlife-routing.spec.ts` present.
- 🟡 Manual J10–J15, J17 not run; matrix written pre-#136 (`b8d19b0`) — stale vs current Done state of 545/823.
- 🟡 **(V)** [PR #140](https://github.com/amo-tech-ai/mdeapp/pull/140) — **merge readiness 78/100** (see §PR #140). OPEN · `MERGEABLE` · floor ✅ · cubic ✅ · +86/−1 · does **not** close SAN-546 (no `prod-journey-j05-j20.spec.ts`). J14/J15 prod claims **R** on current branch.

### SAN-828 — CopilotKit empty POST 401 vs 400 ✅
- 🟢 **(V)** Status **Done** today: Todo→In Review (20:37)→Done (20:42) — `get_issue SAN-828`.
- 🟢 **(V)** Root cause proven: `src/app/api/copilotkit/[[...path]]/route.ts` calls `assertCopilotKitAuthorized(req)` **before** body parse; prod returns 401 for unauth/cross-origin (`src/lib/copilotkit-auth.ts`: `if (process.env.NODE_ENV !== "production") return null`).
- 🟢 Correct resolution = 401 is right (auth-first); smoke contract updated to accept it. **(V)** `chat-smoke.mjs --base https://www.mdeai.co` → **All checks passed** (re-run 2026-06-08 PM). Commit `7eb97a1` in parent `mdeai` repo remains **R** for this mdeapp tree.

### SAN-548 — F13 thread persistence
- 🟢 **(V)** `src/mastra/lib/storage.ts` → `PostgresStore` (`@mastra/pg`, max 3) in prod, `LibSQLStore(:memory:)` dev; `getMastraStorage()` singleton; wired `mastra/index.ts:40` + `agent-memory.ts`; `storage.test.ts` present.
- 🟢 **(V)** Live DB: `mastra_threads` **432** · `mastra_messages` **1,066** · `ai_runs` **908**. Persistence is real (+1 thread / +2 messages since AM probe).
- 🟡 No cold-start journey proof on disk (no `san-548-thread-persistence/` evidence dir); persona claim "turn 11 remembers turn 1 after cold-start" + Playwright spec uncaptured. Latest thread `2026-06-06` (2d old).

### SAN-368 — MAP-002B ADK grounding on prod
- 🟢 **(V)** Blocker **SAN-369** (Map ID) = **Done** 2026-06-03. Cleared.
- 🟢 **(V)** `adk-grounding-client.ts` + test + `e2e/maps-grounding.spec.ts` (65 lines) on disk.
- 🔴 **(V) Deploy proof** — sidecar health + `verify:cloud-run-grounding` exit 0 not proven in-repo this session. **(R)** sprint reports Cloud Run `/health` PASS — not re-probed.
- 🔴 **(V) Env validation** — `.env.example:18 ADK_GROUNDING_URL=http://localhost:8000`; `ADK_INTERNAL_TOKEN=` empty; Vercel Production/Preview vars not MCP-verified. Independent failure mode from deploy (env can be set while sidecar is down, and vice versa).
- 🟢 **(V)** **Phase is launch:** `phase:launch` + `tasks/INDEX.md` **091 MAP-002B** in Tier 1 parallel block. Not post-MVP.

---

## Phase 3 — Production readiness

| Check | 546 | 828 | 548 | 368 | 178 | 115 |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| AC complete | 🟡 | 🟢 | 🟡 | 🔴 | 🔴 | 🔴 |
| Works in prod | 🟡 J07/J08 | 🟢 | 🟢 DB | 🔴 | 🔴 | 🔴 |
| Browser proof | 🟡 | 🟢 (R) | 🔴 | 🔴 | 🔴 | 🔴 |
| Production proof | 🟡 | 🟢 (R) | 🟢 rows | 🔴 | 🔴 | 🔴 |
| Monitoring/logging | 🟢 | 🟢 | 🟡 see SAN-856 | 🟡 | n/a | n/a |
| Rollback | 🟢 | 🟢 | 🟢 env flag | 🟡 | 🟢 | 🟢 |

---

## Phase 4 — Testing

| Layer | 546 | 828 | 548 | 368 |
|---|---|---|---|---|
| Vitest | — | — | `storage.test.ts` ✅ | `adk-grounding-client.test.ts` ✅ |
| E2E | `prod-synthetic-smoke` ✅ / J05–J20 spec 🔴 | smoke (R) | cold-start 🔴 | `maps-grounding.spec.ts` ✅ |
| Prod | J07/J08 ✅; rest 🟡 | 401 contract ✅ (V) | `mastra_threads` 432 ✅ | 🔴 none |

> **Not re-run this session (C1):** `npm test` / `build` / `floor` — tree on unrelated branch. Re-run on clean `main` before any Done flip.

---

## Phase 5 — Corrections

| Sev | Task | Issue | Fix | Priority |
|---|---|---|---|---|
| 🔴 | SAN-178 | No prod paid ticket → wallet QR | Stripe purchase → webhook → `/me/tickets`; evidence in EVP-001 ledger | **P0** |
| 🔴 | SAN-115 | G1/G2/G3 ledger not closed (blocked by 178) | Attach 3 gate proofs; then Done | **P0** |
| 🟡 | SAN-368 | **Deploy proof** — sidecar health + remote verify scripts | `verify:cloud-run-grounding` exit 0 + `/health` 200 | **P1** |
| 🟡 | SAN-368 | **Env validation** — Vercel `ADK_GROUNDING_URL` + `ADK_INTERNAL_TOKEN` | MCP/Vercel audit Prod+Preview; never `NEXT_PUBLIC_*` | **P1** |
| 🔴 | SAN-546 | `e2e/prod-journey-j05-j20.spec.ts` missing | Create spec or descope to manual+synthetic | **P1** |
| 🟡 | SAN-548 | No cold-start journey evidence | `e2e/prod-thread-persistence.spec.ts` turn-11 + evidence dir | **P1** |
| 🟡 | SAN-856 | ai_runs token/error capture dead (Appendix A) | Thread `usage`+`error.message` into insert | **P1** |
| 🟡 | SAN-704 | Overlaps SAN-856 (rows DO write; fields are blank) | Reclass/fold into SAN-856 or scope to authenticated-write gap | **P2** |
| 🟡 | C2 | Evidence links escape repo | Migrate cited evidence into `docs/tasks/` | **P2** |

---

## Phase 6 — Scoring

| Task | Status | Grade | % | Prod-ready | Will succeed |
|---|:--:|:--:|--:|:--:|:--:|
| SAN-828 CopilotKit 401 | 🟢 Done | A− | 91 | 🟢 | ✅ |
| SAN-548 F13 persistence | 🟡 | B impl / C+ exit | **83 impl · 40 journey** | 🟡 code only | 🟢 code · 🔴 Done |
| SAN-368 ADK prod | 🟡 | C− | 65 | 🔴 | 🟡 |
| SAN-546 OPS-JOURNEY | 🟡 | C+ | 72 | 🔴 | 🟡 |
| SAN-115 AIE-001 ledger | 🔴 | F | 45 | 🔴 | 🔴 |
| SAN-178 PAY-001 ticket | 🔴 | F | 42 | 🔴 | 🔴 |

---

## Task 1 — Hard MVP gates (only items that matter for MVP exit)

| Gate | Spec / Linear | Status | Confidence | Notes |
|------|---------------|--------|------------|-------|
| **G1 Paid ticket** | 079 · SAN-178 / PAY-001 | 🔴 | 100% blocker | Checkout on disk; **0% prod paid proof** |
| **G2 Discovery** | Camila chat → cards | 🟢 | High | Prod synthetic + tier-1 sprint evidence (545/823/549) |
| **G3 Host publish** | 082 · SAN-366 / EVT-002 | 🟡 | Medium | Linear **Done** 2026-06-04; **evidence refresh needed** (no dated file in repo) |
| **EVP-001 ledger** | 083 · SAN-115 / AIE-001 | 🔴 | 100% blocked | Cannot close until G1 (+ refreshed G3 proof attached) |
| **Production smoke** | 084 · F32 / SAN-462 | 🟡 | Medium | `chat-smoke` **V PASS**; full J05–J20 matrix **stale / incomplete** |
| **Stripe webhook isolation** | 080 · SAN-116 / EVP-003 | 🟡 | Code Done | **SAN-116 Done** (vitest + separate secrets) · **G1 end-to-end webhook→wallet proof still 🔴** (not the same gate) |

**MVP exit rule:** Until **G1 → EVP-001** closes, declare **blocked** regardless of concierge scores.

---

## Task 2 — Canonical queue (`tasks/INDEX.md` Tier 1)

Single source of truth — do not reorder in `todo.md` without updating INDEX:

```text
079 G1         → SAN-178  Andrés ticket checkout (Stripe session + orders)
080 EVP-003    → SAN-116  Stripe webhook secret audit        [Linear Done — code]
081 EVP-013    → EventCard + SCREEN-006 in chat             [buy CTA visible]
082 G3         → SAN-366  Roberto host-publish prod proof    [Linear Done — refresh evidence]
083 EVP-001    → SAN-115  Production proof ledger            [Todo — blocked by G1]
084 F32        ‖ SAN-462  Production smoke
085 AUTH-011   ‖ SAN-367  Auth production checklist          [Done]
091 MAP-002B   ‖ SAN-368  ADK grounding on prod              [In Progress]
092 MAP-008B   ‖ SAN-369  Map ID on prod                     [Done]
```

---

## Task 3 — Missing validation (added to audit scope)

### A. Production route audit (V · 2026-06-08 PM)

| Route | Sitemap | Prod GET | Browser proof | Gap |
|-------|---------|----------|---------------|-----|
| `/chat` | ✅ LIVE | **200** | 🟡 partial (synthetic) | Full persona matrix open |
| `/rentals` | 🔵 MVP (sitemap stale: says redirect) | **200** | 🟡 SAN-478 Done | Sitemap drift · hero e2e flake |
| `/events/[slug]` | ✅ LIVE | **200** (sample slug not probed) | 🟡 | Needs paid-buy journey |
| `/host/event/new` | ✅ LIVE | **307** → auth | 🟡 | G3 evidence refresh |
| `/me/tickets` | ✅ LIVE | **307** → auth | 🔴 | **No prod wallet QR proof** |

### B. Maps production validation

| Spec | Linear | Deploy proof | Env validation | Sign-off |
|------|--------|--------------|----------------|----------|
| MAP-008B | SAN-369 Done | ✅ | ✅ Map ID | 🟢 |
| MAP-002B | SAN-368 In Progress | 🔴 unproven | 🔴 unproven | 🔴 MVP open |

### C. Event commerce validation chain

| Step | Disk | Prod proof |
|------|------|------------|
| Checkout session | ✅ `/api/tickets/checkout` | 🔴 no paid run |
| Webhook completion | ✅ edge fn + SAN-116 isolation | 🔴 no prod event |
| Paid order row | ✅ schema | 🔴 |
| Wallet QR `/me/tickets` | ✅ route LIVE (307 unauth) | 🔴 |

---

## Task 4 — De-inflated scores (canonical — retire optimistic numbers)

**Remove from trackers:** `89% Launch Ready` · `91% SAN-546` (concierge-sprint scope only).

| Area | Score | Rationale |
|------|------:|-----------|
| Foundation | 95% | Auth, RLS, DB, soak gate largely proven |
| Maps | 74% | MAP-008B Done · MAP-002B deploy/env open |
| Events | 72% | Code LIVE · G1/G3 prod proof gaps |
| Rentals | 74% | SAN-478/545/823 Done · hero e2e flake |
| Commerce | 55% | Checkout on disk · **0% paid prod chain** |
| **MVP exit** | **68%** | G1 + EVP-001 block |
| **Production launch** | **70%** | Concierge credible · commerce gate not |

**Launch readiness band:** **68–74%** until G1 paid ticket proof exists. Use **70%** as headline; **74%** only when counting concierge-only surfaces (misleading for EVP-001).

---

## PR #140 — merge readiness (SAN-546 partial)

| Check | Result | Weight |
|-------|--------|--------|
| `mergeable` | ✅ MERGEABLE | — |
| CI `floor` | ✅ pass | — |
| cubic review | ✅ no issues | — |
| Vercel preview | ✅ deployed | — |
| Scope vs SAN-546 AC | 🟡 J14/J15 only | does not satisfy J05–J20 headline |
| Prod Playwright re-run | 🔴 not this session | — |
| **Merge readiness score** | **78/100** | Safe to merge · **not** safe to close SAN-546 |

---

## Phase 7 — Recommended next actions

### Priority 1 (today)

1. **G1 paid ticket proof** — SAN-178: Stripe purchase → webhook → `/me/tickets` QR
2. **EVP-003 prod webhook path** — prove ticket webhook fires on real payment (SAN-116 code already Done)
3. **EVP-013 / EventCard** — SCREEN-006 buy CTA visible in chat on prod

### Priority 2

4. **G3 host publish refresh** — re-capture SAN-366 evidence file (Linear Done, repo evidence stale)
5. **EVP-001 ledger** — SAN-115 attach G1+G2+G3 proofs

### Priority 3

6. **F32 production smoke** — refresh full matrix post-G1
7. **AUTH-011** — SAN-367 already Done; spot-check only
8. **MAP-002B** — deploy proof then env validation (independent checks)
9. **MAP-008B** — SAN-369 Done; regression spot-check
10. Merge **PR #140** then continue J05–J20 spec

---

## Executive summary

| Area | Grade | % |
|---|:--:|--:|
| Audit accuracy | A | 92 |
| Evidence quality | A− | 90 |
| Task verification discipline | A | 95 |
| Code/implementation present | A− | 90 |
| Production deployment proven | C | 60 |
| **MVP readiness** | **D+** | **68** |
| **Launch readiness** | **C** | **70** (band **68–74** until G1) |

**Top blockers:** **G1 Paid Ticket → Webhook → Wallet → EVP-001 ledger.** Then MAP-002B deploy+env · SAN-546 J05–J20 automation · SAN-548 turn-11 journey.

**Cleared:** SAN-462, SAN-369, SAN-367, SAN-116 (code), SAN-366 (Linear), SAN-823, SAN-545, SAN-549, SAN-828.

**Final verdict:** 🟡 **Needs Work.** Architecture/maps/agents/Supabase are not the risk — **commerce proof chain is.** Concierge MVP ~85% credible; **EVP-001 exit blocked at 0% G1 prod proof**.

---

## Appendix A — `ai_runs` observability regression → SAN-856 (probe-verified)

**Filed:** [SAN-856 · AIE — ai_runs token/cost capture regression](https://linear.app/sanjiovani/issue/SAN-856/aie-ai-runs-tokencost-capture-regression-dead-since-2026-05-08-blind) — High · Core Foundation.

| Probe (Supabase `execute_sql`, 2026-06-08) | Result |
|---|---|
| `max(created_at) where total_tokens > 0` | **2026-05-08 10:15 UTC** |
| Runs ever with tokens | **145 / 908** |
| Runs since May 15 | **726** |
| …with tokens | **0** |
| Errors since May 15 | **37** |
| …with `error_message` | **0 / 37** |
| Jun 2–4 error burst | 16 / 2 / 6 (`concierge-agent` + `host-event-agent`), 162–3107 ms fast-fail |

**Traffic profile (no leak / no spike):** 431 threads = historical dev/QA accumulation — ~85% from a **May 23–26 burst** (May 24 = 194), 89% `anonymous`, "real users" = **1 dev UUID**, avg 2.54 msgs/thread.

**Interpretation:** F13 **persistence** is healthy and separate from this defect. The **observability** half is broken — Patricia's cost/ops view is blind on token spend and failure reasons despite rows being inserted. Likely fix surface: `src/mastra/lib/log-agent-run.ts` · `src/mastra/copilotkit/logging-mastra-agent.ts` · `after()` in `/api/copilotkit/[[...path]]/route.ts` — thread AG-UI `onFinish` `usage` + `error.message` into the insert (task-verifier trap #12: usage lives on `stream()/generate()` onFinish, not the Agent constructor).

## Appendix B — SAN-704 vs SAN-856 reconciliation

- **SAN-704 (AIE-004, Backlog, Events Platform):** "logAgentRunForTurn not writing `ai_runs` for authenticated prod sessions."
- **Probe reality:** `ai_runs` has **908 rows** (writes ARE happening), but they are 89% anonymous and the usage/error **fields** are empty since May 8.
- **Recommendation:** the live defect is **observability fields** (SAN-856), not "no inserts." Either (a) re-scope SAN-704 strictly to the *authenticated-user* write path (45 uuid-user threads exist — confirm they get `ai_runs` rows with `user_id`), or (b) fold SAN-704 into SAN-856 and cancel. Do **not** keep two overlapping Urgent issues.

---

## Audit meta-scores (canonical)

| Category | Score |
|----------|------:|
| Audit accuracy | 92/100 |
| Evidence quality | 90/100 |
| Task verification discipline | 95/100 |
| MVP readiness | 68/100 |
| Launch readiness | 70/100 (band 68–74 until G1) |

**Canonical source:** this file only. `01-tasks-audit.md` and `todo.md` launch percentages must align here.

*Probe-cited · **V**=verified · **R**=reported · Re-run build/test/floor on clean `main` before Done flips.*
