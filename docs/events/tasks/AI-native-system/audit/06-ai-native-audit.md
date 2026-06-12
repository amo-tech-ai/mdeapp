---
title: AI-Native System — Forensic Audit (consolidated)
id: AIE-AUDIT-06
date: 2026-06-11
audited_tree: origin/main @ eea34ef (git-verified) — local checkout ai/san-495 lagged 9 commits
method: 3 parallel specialist agents (HostOps code · task inventory + prior audits · plan vision + Supabase security) + direct git verification
builds_on: 01-audit.md · 02-core-foundation-audit.md · 03-ainative-audit.md · 04-audit-notes.md · 05-aie-005-audit.md
scope: docs/events/tasks/AI-native-system/** + the HostOps chain (AIE-001..008) + AI-native architecture
verdict: 🟡 Hybrid (AI-assisted event app) — NOT yet AI-native ops
---

# AI-Native System — Forensic Audit (AIE-AUDIT-06)

> **One-line answer:** This is **a traditional/hybrid event app with AI bolted onto two flows (event creation + venue booking)** — it is **not** the AI-native ops platform the plan describes. Roberto can *chat to create* an event and *approve* a publish, but he **cannot ask "how are my ticket sales?" anywhere** — the read tool exists, but the agent, the workflow, and the analytics page that would answer it are draft-only. **AI-native score ≈ 25/100. Launch: 🟡 Internal Testing Only.**

## §0 Method & baseline (read first)

This audit scores **`origin/main` @ `eea34ef`**, git-verified (`git show origin/main:…`), **not** the local checkout (`ai/san-495`, 9 commits behind). It **builds on the five prior audits** (`01`–`05`, all 2026-06-11) rather than re-deriving, and is the **first** to score `SAN-762 · AIE-006 — HostOps read tools` as **merged** (PR #182) — the prior audits called it "unmerged." Where this audit differs from `01`–`05`, the delta is the #182 merge and the origin/main verification that resolved `03`'s branch-lag errors (corrected by `04`).

---

## Phase 1 — Task inventory (33 issues: epic SAN-757 + 32 AIE)

**Only 2 of 32 tasks are Done; 1 claims 10%; the other 29 are Not Started.** The program is exhaustively specified (every task has a Linear issue, wireframe, acceptance) but almost entirely unbuilt. The frontmatter status disagrees with the index table in places (e.g. AIE-024 frontmatter "Done" vs index "In Review") — a tracker-hygiene gap.

| Tier | Tasks | Built / Done | Draft-only | Not started |
|---|---|---|---|---|
| **Core** (AIE-001..012) | 12 | 2 (`SAN-730 · AIE-002 — Host nav`*, `SAN-704 · AIE-004 — ai_runs prod writes`) | 5 (the HostOps `.draft.*` chain) | 5 |
| **MVP** (AIE-013..026) | 14 | 1 (`SAN-135 · AIE-024 — Luma event detail`) | 0 | 13 |
| **Advanced** (AIE-027..032) | 6 | 0 | 0 | 6 (index: FROZEN) |

\* `SAN-730 · AIE-002 — Host nav` is Done but ships a **disabled** `/host/analytics` nav stub (the page it points to doesn't exist).

**Verified Done (on disk):** `SAN-730 · AIE-002 — Host navigation rail` (`host-nav-rail.tsx`), `SAN-135 · AIE-024 — Luma event detail layout`. **Verified prod-live:** `SAN-704 · AIE-004 — ai_runs prod write fix` (10 authenticated rows / 7d). Everything else in the AIE program is spec, draft, or not started.

---

## Phase 2 — Architecture audit

### CopilotKit — **72 / 100**
The patterns that exist are **correct**, but the AI-native surface is narrow.
- **`useCoAgent`:** 2 real mounts — `concierge-coagent-context.tsx` (`ConciergeWorkingMemory`) and `host-event-copilot-bridge.tsx` (`EventDraftState`). Agent names match the Mastra registry + `useCoAgent({name})`. ✅ correct.
- **Generative UI:** exactly **1** disabled-mirror (`search-tool-renders.tsx` — concierge cards). The host wizard uses `available:"remote"` actions, not the disabled-mirror pattern. **No generative UI on any analytics/ops surface** (none exists). 🟡
- **HITL:** 2 client `renderAndWaitForResponse` (publish event, book venue). ✅ correct, but confined to those two flows.
- **Anti-patterns:** none found (no agent-name mismatch, no `mastra.agents.X` beta trap on the live agents). The gap is **coverage**, not correctness — the ops/analytics generative UI the vision needs isn't built.

### Mastra — **68 / 100**
Strong foundations, significant dead weight.
- **Agents:** 7 registered, **3 exposed** at runtime (`conciergeAgent`, `hostEventAgent`, `pingAgent`); `routerAgent`/`rentalAgent`/`eventAgent`/`evaluationAgent` are **dormant**. No `hostOpsAgent` exists. 🟡
- **Tools:** strong — Zod in/out, Supabase-first, `X-Goog-FieldMask` on Places. `hostops-read-tools.ts` is well-built (RLS-scoped, result-envelope) but **attached to zero agents** (orphan). ✅/🟡
- **Workflows:** 3 registered; **1 is a real HITL workflow** (`event-venue-booking-workflow.ts`, suspend/resume); the other 2 are dormant duplicates of client fast-paths. `salesInsightWorkflow` doesn't exist.
- **Multi-agent coordination:** **NONE** — no `AgentNetwork`/supervisor/handoff/delegate. Agents are isolated. The plan's agent ladder (hostOps→attendee→sponsor→adminOps) is unbuilt.
- **Circular deps / discoverability:** allowlist is correct; no circular risk found. `05-aie-005-audit.md` caught + fixed a real runtime-context bug in #182 (`runtimeContext.get("hostCtx")` → repo `RequestContext` pattern, fix `5781feb`).

### Supabase — **90 / 100**
Tightest layer (agent C scored 92).
- **`ai_runs`:** RLS enabled + **4 owner-scoped policies** (`user_id = (select profiles.id where id = auth.uid())`) for SELECT/INSERT/UPDATE/DELETE. Zero advisor findings on the AIE surface.
- **Service-role:** the `ai_runs` writer uses `createServiceRoleClient()` inside the **F13 carve-out** (`src/mastra/lib/**`); the `no-service-role-in-src` hook passes.
- **`hostops-read-core.ts`:** uses a **user-scoped client** with defence-in-depth (explicit `organizer_id` filter + 404 ownership gate) because `events` has a public-published SELECT policy. No cross-host leak (verified by an explicit leak test).
- **One real item (in flight):** `ai_runs` carries a stock `GRANT ALL TO anon` (RLS already returns zero rows → not exploitable). A `revoke` migration (`20260611210000_ai_runs_revoke_anon_grant.sql`) is staged on branch `ai/sec-ai-runs-revoke-anon-grant`, pending the migration-edit flag. Only live advisor ERROR is `spatial_ref_sys` (PostGIS system table, off-surface).

---

## Phase 3 — AI-native validation: 🟡 **Hybrid (~25%)**

| Capability | Current | Planned | Missing |
|---|---|---|---|
| Conversational Event Creation | 🟡 ~60% — chat form-fill + HITL publish, **but a co-equal manual form** | full chat-first | form is not optional; agent has no sales/ops awareness |
| Conversational Ticketing | 🔴 0% | `attendeeAgent` (AIE-014) | not started |
| Conversational Analytics | 🔴 ~10% (plumbing) | hostOps "how are my sales?" | agent + workflow + page all draft |
| Conversational Venue Booking | 🟡 ~50% — concierge venue CTA + HITL workflow | end-to-end | discovery hook (494-A2) unwired |
| Conversational Sponsorships | 🔴 0% | `sponsorMatchWorkflow` (AIE-016/017) | not started |
| Human Approval Flows | 🟡 ~40% — publish-event + book-venue HITL real | approval inbox (AIE-019) | central inbox missing |
| Shared Agent Memory | 🟡 ~50% — concierge + host wizard working memory | + HostDashboardState | HostDashboardState wired to nothing |
| Workflow Orchestration | 🟡 ~25% — 1 real workflow | sales/forecast/sponsor/crm workflows | 4 of 5 unbuilt |
| Generative UI | 🟡 ~25% — concierge cards only | KPI/analytics generative cards | ops generative UI absent |
| Multi-Agent Coordination | 🔴 0% | agent ladder + handoff | none — isolated agents |

**The system is AI-*assisted* (discovery + creation + booking), not AI-*native* (ops, analytics, matching, coordination).** The differentiator vs Luma/Eventbrite — "chat your ops, approve, done" — is foundation-only.

---

## Phase 4 — HostOps chain audit (the 7 named tasks)

| Task | Status | Architecture | Security | Tests | Prod-readiness |
|---|---|---|---|---|---|
| `SAN-762 · AIE-006 — HostOps read tools` | **Merged (#182), DORMANT** | ✅ correct (RLS-scoped, Zod, result-envelope) | ✅ safe (user-scoped + `organizer_id` + 404) | 🟡 11/11 but **mock DB**; no live assertion | **40** — built+tested but **unreachable**: no agent imports it; route never sets `HOST_SUPABASE_KEY` → `getHostContext` throws "Sign in as a host" |
| `SAN-760 · AIE-005 — hostOpsAgent + HostDashboardState` | **Draft-only** | ❌ not built (no agent in `src/`) | n/a | ❌ none | **5** |
| `SAN-759 · AIE-007 — salesInsightWorkflow` | **Draft-only** (pure `computeSalesInsights` in draft) | ❌ not built | n/a | ❌ none | **8** |
| `SAN-729 · AIE-008 — Host Analytics page` | **Missing** (draft `.tsx` only; spec "missing") | ❌ no route | n/a | ❌ none | **5** |
| `SAN-115 · AIE-001 — Production proof ledger` | **Not started (10%) — and BYPASSED** | ⚠️ human checklist; "no AIE task Done until this passes" — yet #182 shipped | n/a | n/a | **10** |
| `SAN-704 · AIE-004 — ai_runs prod write fix` | **Implemented + prod-live** | ✅ service-role, `after()`, never-throws, 2.5s timeout | ✅ F13 carve-out | 🟡 no-throw/env/timer tested, **DB mocked** | **80** — caveat: **fast-path turns bypass it** → blind to most Camila traffic |
| `SAN-758 · AIE-003 — Observability schema` | **Table exists (remote baseline), NO repo migration** | 🟡 `ai_runs` pre-exists out-of-repo; draft adds `workflow_runs` + `approval_logs` view (unapplied) | ✅ `ai_runs` RLS good | n/a | **40** — `ai_runs` live; the AIE-003 tables aren't applied |

**Chain verdict:** built **bottom-up** (data + read tools + ai_runs logging) with the **AI-native top three layers (agent, workflow, page) draft-only**. The one shipped tool is an orphan. **HostOps ≈ 10% of an AI-native ops system.**

---

## Phase 5 — Verify implementations (claimed vs found, origin/main)

| Feature | Claimed | Found | Result |
|---|---|---|---|
| `hostOpsAgent` | AIE-005 | grep `src/**` = 0 | 🔴 FAIL |
| `salesInsightWorkflow` | AIE-007 | no workflow file | 🔴 FAIL |
| HostOps read tools | AIE-006 | `tools/hostops-read-tools.ts` ✅ (dormant) | 🟡 PARTIAL |
| Host Analytics page | AIE-008 | no `src/app/host/analytics/` | 🔴 FAIL |
| `ai_runs` prod writes | AIE-004 | `lib/ai-runs.ts` + 10 prod rows/7d | 🟢 PASS |
| Observability tables (`workflow_runs`/`approval_logs`) | AIE-003 | not in migrations | 🔴 FAIL |
| Generative KPI cards | AIE-009 | not built | 🔴 FAIL |
| Host nav rail | AIE-002 | `host-nav-rail.tsx` ✅ (analytics link disabled) | 🟡 PARTIAL |
| Luma event detail | AIE-024 | shipped | 🟢 PASS |
| Multi-agent coordination | plan | none | 🔴 FAIL |

---

## Phase 6 — Failure-point analysis

**🔴 Critical blockers (launch-stopping for the AI-native goal):**
1. **The conversational ops loop does not exist.** No `hostOpsAgent`, the read tool is orphaned and would throw (route never sets `HOST_SUPABASE_KEY`), no analytics page. Roberto cannot ask "how are my sales?" — the headline AI-native feature.
2. **The Core exit gate is unsigned yet bypassed.** `SAN-115 · AIE-001 — Production proof ledger` says no AIE task ships until it passes; `SAN-762 · AIE-006 — HostOps read tools` shipped anyway → the program's own quality gate is not being enforced.

**🟡 Architectural risks:**
3. Orphaned tool + unset runtime context → a runtime throw the moment any agent calls it.
4. `ai_runs` misses every **fast-path** turn → observability blind to most discovery traffic.
5. 4 dormant agents + 2 dormant workflows → drift between code and reality (caused `03`'s mis-audit).

**⚪ Security risks (low):** Supabase is tight (90/100). The `ai_runs` anon grant is cosmetic and a revoke is staged.

**⚪ Scale risks (low for now):** `ai_runs` is well-indexed; read tools are bounded. Scale isn't the issue — existence is.

**🔴 Product risk:** the AI-native differentiator (conversational ops/analytics/matching) is ~12–26% built. As shipped, this is a competent hybrid event app, **not** the Luma/Eventbrite-killer the plan promises.

---

## Phase 7 — Best-practices audit

| Area | Score | Notes |
|---|---|---|
| CopilotKit | 75 | Correct `useCoAgent`/HITL patterns; missing generative UI on ops/analytics |
| Mastra | 68 | Strong tools + 1 real HITL workflow; 4 dormant agents, orphaned tool, agent ladder unbuilt |
| Supabase | 90 | Tight RLS, owner-scoped, F13 carve-out, defence-in-depth; minus the anon grant (in flight) |
| AI-native product | 30 | Foundation only; the conversational ops experience that defines "AI-native" is unbuilt |

---

## Phase 8 — Production readiness

| Area | Readiness | |
|---|---|---|
| Backend | 🟡 70 | Supabase tight; tables exist |
| AI | 🔴 30 | Concierge/host work; ops AI unbuilt |
| Agents | 🔴 35 | 2 live + 4 dormant; `hostOpsAgent` draft |
| Workflows | 🟡 55 | 1 real HITL; rest draft/dormant |
| Security | 🟢 88 | RLS tight; anon grant revoke staged |
| Analytics | 🔴 12 | Read tools orphaned; no page |
| UI | 🟡 60 | Host wizard + concierge live; analytics/ops UI absent |
| Testing | 🟡 55 | Unit tests exist; HostOps tests mock DB; no ops e2e |
| Observability | 🟡 55 | `ai_runs` prod-live but fast-path blind |
| Deployability | 🟢 80 | Ships clean; gaps are unbuilt features, not broken deploys |

---

## Phase 9 — Missing AI-native features

| Missing feature | Impact | Priority |
|---|---|---|
| `hostOpsAgent` (chat your ops) | 🔴 the headline AI-native promise | P0 |
| `salesInsightWorkflow` (grounded sales narrative) | 🔴 "how are my sales?" answer | P0 |
| Host Analytics page + generative KPI cards | 🔴 surface for conversational analytics | P0 |
| Wire HostOps read tools to an agent + set `HOST_SUPABASE_KEY` | 🔴 unblocks the orphaned tool | P0 |
| Enforce the AIE-001 production-proof gate | 🟡 process integrity | P1 |
| `ai_runs` coverage for fast-path turns | 🟡 real observability | P1 |
| Approval inbox / notification center (AIE-019) | 🟡 central HITL | P1 |
| `attendeeAgent`, `sponsorMatchWorkflow`, `crmLeadScoreWorkflow` | 🟡 ticketing/sponsor/CRM AI | P2 |
| Multi-agent coordination (the agent ladder) | ⚪ defer until single agents prove out | P2 |

---

## Phase 10 — Final report

### Executive summary (plain English)
The AI-Native System is a **fully designed, barely built** program. Every feature has a spec, a wireframe, and a Linear issue, but only **2 of 32 tasks are Done** and the AI-native ops core is **~12–26% built**. The parts that work — chat-assisted event creation, venue booking with human approval, and an invisible `ai_runs` audit log — are real and secure. The part that would make it "AI-native" — a host **talking to an agent** about sales, venues, sponsors, and getting grounded answers + generative dashboards — **does not exist yet**: the read tool is built but wired to nothing, and the agent, workflow, and page above it are drafts.

### What works (verified)
- Chat-assisted **event creation** with HITL publish (`hostEventAgent`, two-pane wizard).
- **Venue booking** with a real Mastra suspend/resume approval workflow + concierge CTA.
- **`ai_runs`** production logging (10 authenticated rows/7d), owner-scoped RLS.
- **Supabase security** across the AIE surface (90/100, no cross-host leak).
- **Host nav rail** and **Luma event detail** UI.

### What does not work (verified)
- "How are my sales?" → **nothing answers it** (`hostOpsAgent`, `salesInsightWorkflow`, analytics page all draft).
- HostOps read tools **would throw at runtime** (no agent, `HOST_SUPABASE_KEY` never set).
- **No multi-agent coordination**, no approval inbox, no sponsor/CRM/ticketing AI.
- `ai_runs` is **blind to fast-path turns** (most discovery traffic).

### Drafts vs reality
The 5 HostOps `.draft.*` files are **design docs with live code limited to Zod schemas + pure functions**; the agent/workflow/route wiring sits in block comments. Only `SAN-762 · AIE-006 — HostOps read tools`'s core was promoted to `src/` and merged — and it's dormant. The MVP tier (AIE-013..026) is a **84/100 *spec* score** (per `01-audit.md`) with **near-0% implementation**.

### Percent complete (per the Core foundation)
Core (AIE-001..012): **~15% built** (1 prod-live + 1 nav + 1 dormant tool of 12). HostOps slice (the 7 Phase-4 tasks): **~20%** weighted (ai_runs 80, read-tools 40, the rest <10). MVP/Advanced: **~0%** implementation.

### Overall AI-Native score: **25 / 100** 🔴
### Overall Production readiness (AI-native scope): **~35 / 100** 🟡  ·  (broader event platform, per `01-audit.md`: **52/100**)

### Launch recommendation: 🟡 **Internal Testing Only**
The creation/booking/discovery spine deploys and is secure — but the AI-native ops differentiator is foundation-only. Not 🔴 (it's not broken; core flows work) and not 🟢 (the AI-native promise is unbuilt).

---

## Required per-task output

### `SAN-762 · AIE-006 — HostOps read tools` 🟡
- **Status:** Merged (#182). **Production readiness:** 40. **AI-Native score:** 35.
- **Issues:** dormant — no agent imports it; route never sets `HOST_SUPABASE_KEY`. **Failure points:** `getHostContext` throws at runtime; tests mock the DB. **Critical fixes:** attach to `hostOpsAgent`; set the runtime context key in the host route. **Missing:** the consuming agent + page. **Improvements:** live-DB integration test. **Next:** unblock by building AIE-005.

### `SAN-760 · AIE-005 — hostOpsAgent + HostDashboardState` 🔴
- **Status:** Draft-only. **Production:** 5. **AI-Native:** 5.
- **Issues:** not in `src/`; `HostDashboardState` wired to nothing. **Failure points:** blocks the whole ops loop (`05-aie-005-audit.md`: "building on sand"). **Critical fixes:** build the agent, register it, add to the runtime allowlist (would be the 4th exposed agent), attach the read tools. **Next:** implement after AIE-001 gate + AIE-006 (done).

### `SAN-759 · AIE-007 — salesInsightWorkflow` 🔴
- **Status:** Draft-only (pure `computeSalesInsights` in draft). **Production:** 8. **AI-Native:** 8.
- **Critical fixes:** promote to `src/mastra/workflows/`; keep "LLM narrates, never computes." **Next:** after AIE-005.

### `SAN-729 · AIE-008 — Host Analytics page` 🔴
- **Status:** Missing (draft `.tsx`; spec "missing"). **Production:** 5. **AI-Native:** 10.
- **Critical fixes:** build `/host/analytics` + `HostOpsCopilotBridge` (`useCoAgent`) + generative KPI cards. **Next:** after AIE-005/007.

### `SAN-115 · AIE-001 — Production proof ledger` ⚪
- **Status:** Not started (10%) — **bypassed**. **Production:** n/a (process gate). **AI-Native:** n/a.
- **Issues:** tasks shipping without the gate signed. **Critical fix:** enforce the gate (CI or a required evidence file) before the next Core "Done."

### `SAN-704 · AIE-004 — ai_runs prod write fix` 🟢
- **Status:** Implemented + prod-live. **Production:** 80. **AI-Native:** n/a (infra).
- **Issues:** fast-path turns bypass; tests mock DB. **Critical fix:** log fast-path turns (SAN-627). **Next:** observability coverage.

### `SAN-758 · AIE-003 — Observability schema` 🟡
- **Status:** `ai_runs` exists (remote baseline); `workflow_runs`/`approval_logs` not applied. **Production:** 40. **AI-Native:** n/a.
- **Critical fix:** apply the draft DDL as a repo migration (RLS + policies are already in the draft); resolve the `approval_logs` naming collision (`02` R1) and `venue_bookings`→`bookings` mismatch (`02` R2).

---

## Appendix — prior-audit reconciliation
`01-audit.md` 52/100 (platform) + AIE MVP specs 84/100 (design). `02-core-foundation-audit.md` Core ~12% built, exit gate unmet. `03-ainative-audit.md` HostOps slice ~26% (AIE-004 88, AIE-006 68, AIE-003 19, AIE-007 14, AIE-005 14, AIE-008 13) — its agent/allowlist counts were wrong, fixed by `04-audit-notes.md` (~85% accurate; re-verified ai_runs prod-live). `05-aie-005-audit.md` AIE-005 blocked + fixed the #182 runtime-context bug. **This audit (06)** reconciles them on origin/main and records the #182 merge: `SAN-762 · AIE-006 — HostOps read tools` is now shipped-but-dormant, leaving the AI-native ops verdict unchanged at ~25/100.
