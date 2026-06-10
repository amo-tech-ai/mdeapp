---
id: LINEAR-AUDIT-JUNE-8
title: CORE + MVP tasks forensic audit — skill-verified (revision 2)
audited_at: 2026-06-08
reverified_at: 2026-06-08 (post sprint)
auditor: task-verifier + Linear MCP + Supabase MCP
source_archive: ../archive/june-8-audit-tasks.md
skills_used:
  - task-verifier
  - copilotkitV1
  - gemini
  - mastra
  - mde-maps
  - mde-supabase
  - stripe-best-practices
mcp_probes:
  linear: SAN-545,546,548,828,823,549,478,178,115,368,856,292,704
  supabase: ai_runs token/error SQL
  prod: GET / 200 · chat-smoke 13/13 PASS
evidence:
  - ../../../../tasks/testing/evidence/2026-06-08/launch-readiness-sprint-RESULTS.md
---

# CORE + MVP Tasks Forensic Audit — June 8 (revision 2)

**Verdict:** Original audit (`archive/june-8-audit-tasks.md`) was **~72% correct on structure** but **~40% stale on launch blockers** after the 2026-06-08 sprint. Codebase stack compliance holds at **~88%**; tracker markdown lags Linear by 1–2 days.

**Legend:** 🟢 Complete · 🟡 In progress / partial · ⚪ Not started · 🔴 Failed / dup / blocker

**% Correct formula (per task):** spec 40% + status vs disk 40% + stack alignment 20%

---

## Executive verdict (revised)

| Metric | Archive audit (AM) | **Revised (PM sprint)** | Dot |
|--------|-------------------:|------------------------:|-----|
| Codebase (skills) | 88% | **88%** | 🟢 |
| Task trackers vs disk | 48% | **55%** | 🔴 |
| Launch readiness | 65–68% | **89%** | 🟡 |
| MVP proof (Andrés G1) | 33% | **33%** | 🔴 |
| **Overall project** | 59% | **74%** | 🟡 |

**Single highest-ROI blocker (unchanged):** [SAN-178 · PAY-001 — Live ticket purchase on production](https://linear.app/sanjiovani/issue/SAN-178/pay-001-live-ticket-purchase-on-production) → blocks [SAN-115 · AIE-001 — Production proof ledger](https://linear.app/sanjiovani/issue/SAN-115/aie-001-core-production-proof-ledger-mvp-launch-gate).

---

## 1. Audit-of-the-audit — what was right vs wrong

| # | Original claim | Verdict | Evidence (MCP / disk) |
|---|----------------|---------|------------------------|
| 1 | SAN-545 embed 403 🔴 P0 | **STALE — fixed** | Linear **Done** · PR #136 · `embedStatus: ok` |
| 2 | SAN-546 journey matrix "impl 0%" | **WRONG** | Linear **In Progress** · J15/J17 PASS · J14 harness flake · PR #140 |
| 3 | SAN-828 CK empty POST = prod bug | **WRONG** | `assertCopilotKitAuthorized()` returns **401** without Origin (by design) · smoke fixed `7eb97a1` · Linear **Done** |
| 4 | SAN-823 rental fast-path open | **STALE** | Linear **Done** · PR #136 |
| 5 | SAN-549 nightlife intent 65% WIP | **STALE** | Linear **Done** · prod J06 evidence |
| 6 | SAN-478 launch-readiness blocker | **STALE** | Linear **Done** · `/rentals` live |
| 7 | SAN-178 / SAN-115 Andrés G1 unproven | **CORRECT** | Linear **Todo** · checkout on disk · no prod paid proof |
| 8 | SAN-548 turn-11 prod proof missing | **CORRECT** | Linear **In Progress** · `storage.ts` Postgres ✓ · no cold-start Playwright |
| 9 | SAN-368 ADK env incomplete | **CORRECT** | Linear **In Progress** · S6 café cards PASS · Vercel `ADK_*` + floor OOM open |
| 10 | SAN-292 Todo while disk Done | **CORRECT** | `restaurant-card.tsx` + tests on disk · Linear still **Todo** |
| 11 | 11 Linear dups block hygiene | **PARTIAL** | Phase-0 batch in `audit-checklist.md` marked ✅ 2026-06-09; re-export still 🟡 |
| 12 | Payments under-scoped in `core.md` | **PARTIAL FIX** | SAN-115/116/178 now in `core.md` § Payments · still no G1 proof |
| 13 | ai_runs token capture dead | **CORRECT** | Supabase SQL: last tokens **2026-05-08** · 726 runs since May 15 with 0 tokens · filed **SAN-856** |
| 14 | SAN-704 ai_runs write fix Backlog | **NEEDS RECLASS** | Rows are written (908 total); problem is **observability fields** (SAN-856), not missing inserts |
| 15 | Trips in MVP = scope creep | **CORRECT** | Still 8 Urgent trip issues in MVP CSV — move to ADV |

---

## 2. Skill compliance (disk — unchanged, still strong)

| Skill | Result | Note |
|-------|--------|------|
| copilotkitV1 | 🟢 | v1 imports · agent name match · HITL pattern |
| gemini | 🟢 | `gemini-3.5-flash` only in agents |
| mastra | 🟡 | Postgres `getMastraStorage()` ✓ · turn-11 proof open · **ai_runs usage not threaded** |
| mde-maps | 🟢 | `mapId` + field masks · ADK client on disk |
| mde-supabase | 🟢 | RLS carve-out respected · hybrid RPC wired |
| stripe-best-practices | 🟡 | Checkout Sessions + webhook on disk · **G1 prod proof 0%** |
| shadcn | 🟢 | Semantic tokens · booking sheets |
| task-verifier | 🔴 | Tracker status lags disk on SAN-292, SAN-546 score in `core.md` |

---

## 3. Red flags · blockers (revised P0/P1)

| Sev | Task | Failure mode | Persona |
|-----|------|--------------|---------|
| 🔴 P0 | **SAN-178 · PAY-001** | No prod paid ticket → wallet QR | Andrés |
| 🔴 P0 | **SAN-115 · AIE-001** | G1+G2+G3 ledger not closed | Patricia |
| 🟡 P1 | **SAN-546 · OPS-JOURNEY** | J14 harness idle timeout; J05–J13 matrix incomplete | Lucía |
| 🟡 P1 | **SAN-548 · F13** | Turn-11 cold-start Playwright missing | Camila |
| 🟡 P1 | **SAN-368 · MAP-002B** | Vercel env audit + `verify:task MAP-002B` floor | Tourist |
| 🟡 P1 | **SAN-856** (new) | ai_runs blind on cost + error_message since May 8 | Patricia |
| 🟡 P1 | **SAN-407 · INT-004** | Canned rental clarify bypass still live | Camila |
| ⚪ | **SAN-704 · AIE-004** | Mis-scoped — rows exist; fold into SAN-856 or cancel |

**Cleared since AM audit:** SAN-545 · SAN-823 · SAN-828 · SAN-549 · SAN-478.

---

## 4. Critical fixes (reordered — 2026-06-08 PM)

| # | Fix | Verify |
|---|-----|--------|
| 1 | **SAN-178** prod Stripe purchase → webhook → `/me/tickets` QR | Evidence in EVP-001 ledger |
| 2 | **SAN-115** attach G1+G2+G3 · mark Done | `mvp-proof-ledger.md` |
| 3 | **SAN-546** merge PR #140 · fix J14 `waitForCopilotIdle` · run full J05–J20 | `launch-readiness-sprint-RESULTS.md` |
| 4 | **SAN-548** add `e2e/prod-thread-persistence.spec.ts` turn-11 | Prod screenshot path |
| 5 | **SAN-368** Vercel `ADK_*` MCP audit · rerun floor without OOM | `verify:task MAP-002B` |
| 6 | **SAN-856** thread `usage` + `error.message` into `ai_runs` rows | SQL: `since_may15_with_tokens > 0` |
| 7 | Flip **SAN-292** → In Review or Done in Linear (disk shipped) | task-verifier gate 9 |
| 8 | Update **`core.md` SAN-546** score 38→91 (tracker drift) | Regenerate or manual patch |
| 9 | Re-export CSV after bulk status sweep | `csv-audit-report.md` |
| 10 | Move Trips SAN-273–290 cluster to ADV | MVP blocker list clean |

---

## 5. Launch-critical tasks — per-task scores (verified)

| Dot | Task | Linear | % Correct | Grade | Production ready |
|-----|------|--------|----------:|-------|:----------------:|
| 🟢 | SAN-545 · DATA-EMBED | Done | 92 | A | ✅ |
| 🟢 | SAN-823 · UX-038 | Done | 88 | B+ | ✅ |
| 🟢 | SAN-828 · UX-043 | Done | 91 | A− | ✅ |
| 🟢 | SAN-549 · intent:nightlife | Done | 88 | B+ | ✅ |
| 🟢 | SAN-478 · REAL-011 | Done | 93 | A | ✅ |
| 🟡 | SAN-546 · OPS-JOURNEY | In Progress | 91 | B+ | ⚠️ J14 |
| 🟡 | SAN-548 · F13 | In Progress | 68 | C+ | ❌ |
| 🟡 | SAN-368 · MAP-002B | In Progress | 78 | B− | ⚠️ |
| 🔴 | SAN-178 · PAY-001 | Todo | 42 | F | ❌ |
| 🔴 | SAN-115 · AIE-001 | Todo | 45 | F | ❌ |

**Prod Tier 1 (2026-06-08 PM):** GET `/` → 200 · `chat-smoke.mjs` → **13/13 PASS**

---

## 6. Persona readiness (revised)

| Persona | % Ready | Dot | Blocker |
|---------|--------:|-----|---------|
| Camila | ~90% | 🟢 | SAN-548 turn-11 optional for launch chat |
| Tourist | ~85% | 🟡 | SAN-368 Vercel env |
| Roberto | ~90% | 🟢 | G3 evidence only |
| Lucía | ~78% | 🟡 | SAN-546 J14 + remaining journeys |
| Andrés | ~45% | 🔴 | SAN-178 |
| Patricia | ~35% | 🔴 | SAN-115 + SAN-856 observability |

---

## 7. Improvements still valid from archive audit

1. Regenerate trackers from Linear CSV with staleness rules (`generate.py`)
2. Auto-close when disk + tests + evidence pass (task-verifier script)
3. Cap In Progress at 3 per `mdeai-linear.mdc`
4. Nightly prod-synthetic + evidence commit
5. Require acceptance criteria on all Urgent issues
6. Discovery epic parent for SEARCH namespace
7. Partner CRM M2–M4 task pack (10 rows) — still missing
8. Defer AIE-016–026 cluster to ADV labels

**Dropped / completed:** SAN-545 fix · SAN-828 smoke · dup batch (partial) · payments section in `core.md`.

---

## 8. Next steps (Cycle 1)

```text
P0: SAN-178 → SAN-115 (Andrés + ledger)
P1: SAN-546 PR #140 + J14 harness → SAN-548 turn-11 → SAN-368 env
P1: SAN-856 ai_runs observability (replaces SAN-704 scope)
Hygiene: SAN-292 status · core.md SAN-546 score · CSV re-export
```

**Will launch succeed without Andrés G1?** Camila/Tourist paths are **~85–90%** — yes for concierge MVP. **Full Cycle 1 gate (EVP-001)?** No until SAN-178 + SAN-115.

---

## Appendix A — ai_runs observability regression (SAN-856)

**Filed:** [SAN-856](https://linear.app/sanjiovani/issue/SAN-856/aie-ai-runs-tokencost-capture-regression-dead-since-2026-05-08-blind)  
**Probe:** Supabase MCP `execute_sql` on prod `ai_runs` (2026-06-08)

| Probe | Result |
|-------|--------|
| `last_with_tokens` | **2026-05-08 10:15 UTC** |
| Runs since 2026-05-15 | **726** |
| …with `total_tokens > 0` | **0** |
| Errors since 2026-05-15 | **37** |
| …with `error_message` populated | **0 / 37** |

**Interpretation:** F13 **persistence** (`mastra_threads` / `mastra_messages`) is healthy — separate from this defect. Patricia's cost/ops dashboard is blind on token spend and failure reasons despite rows being inserted.

**Likely fix surface:** `src/mastra/lib/log-agent-run.ts` · `logging-mastra-agent.ts` · `after()` in `/api/copilotkit/[[...path]]/route.ts` — thread AG-UI `onFinish` usage + error into insert.

**Jun 2–4 error burst:** 24 fast-fail errors on `concierge-agent` / `host-event-agent` — correlate with pre-SAN-828 auth-first 401 probes; not a live traffic spike.

---

*Revision 2 · Skill + Linear + Supabase MCP verified 2026-06-08 · Pair with [`08-core-audit.md`](../archive/08-core-audit.md) and [`audit-checklist.md`](../../markdown/audit-checklist.md)*
