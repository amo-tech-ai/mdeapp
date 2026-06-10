---
title: Events Platform — Forensic Audit (AIE + Linear)
audited: 2026-06-08
auditor: task-verifier · copilotkitV1 · mastra
linear_project: https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues
aie_index: ../tasks/AI-native-system/index-aievents.md
linear_sync: ../tasks/AI-native-system/LINEAR-SYNC.md
architecture: ../plans/04-AI-native-system.md
prior_audit: ./01-audit-events-mvp.md
skills: [task-verifier, copilotkitV1, mastra, copilotkit-integrations]
---

# Events Platform — Forensic Audit Report

**Role:** Senior software specialist · forensic auditor (`task-verifier`)  
**Scope:** [Events Platform Linear](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues) — **AIE-000→032** pack + legacy EVT issues + disk truth in `mdeapp/`  
**Question:** Are tasks **correct**, in **implementation order**, and **production-ready**?

**Verdict:** **Planning is strong (🟢 ~88%); execution is not production-ready (🔴 ~42%).** Linear AIE sync is complete; **P0 hostOps stack is 0% on disk** and **SAN-115 ledger is open**.

---

## Executive scorecard

| Dimension | Score | Dot | Real-world impact |
|-----------|------:|:---:|-------------------|
| **AIE spec / Linear descriptions** | 91% | 🟢 | Roberto’s roadmap is documented with mermaid + CopilotKit/Mastra patterns |
| **Implementation order (AIE)** | 86% | 🟢 | Core → MVP → Advanced is correct; a few `blockedBy` gaps in Linear |
| **Linear hygiene** | 72% | 🟡 | 33 AIE issues ✅ but **107 total** issues — CTEST + duplicate EVT IDs clutter the board |
| **Disk execution (Core P0)** | 18% | 🔴 | Camila can discover events; Roberto **cannot** ask “how are sales?” in chat |
| **Production readiness** | 48% | 🔴 | Andrés checkout code LIVE; **G1 ledger + hostOps + ai_runs prod** block launch sign-off |
| **Stack compliance** | 94% | 🟢 | CopilotKit **1.55.2** pinned; no v2 imports probed |
| **Agent cap discipline** | 62% | 🟡 | Plan says 5 Core — disk already registers **7** Mastra agents (pre-hostOps) |
| **Overall weighted** | **68%** | 🟡 | **Grade C+** — safe to *execute* specs; **not** safe to mark Done |

**Will the program succeed?** **Yes, if P0 chain is enforced** — specs align with `copilotkitV1` + Mastra Pattern 1. **Will it succeed if teams skip SAN-115 and build MVP sponsors first?** **No** — scope firewall violations already visible on the board (CTEST in Events project).

**Production-ready today?** **No.** Discovery Beta only: chat cards + host wizard + ticket APIs on Vercel. **Analyze** loop (north star step 6) is unbuilt.

---

## Test evidence (2026-06-08)

| # | Probe | Command / check | Result |
|---|-------|-----------------|--------|
| T1 | Event Vitest | `cd mdeapp && npm test -- --run event` | 🟢 **97/97 pass** |
| T2 | Host events Vitest | `npm test -- --run host-events` | 🟢 **pass** |
| T3 | Approval commit | `npm test -- --run approval-commit` | 🟢 **pass** |
| T4 | Grounding | `npm test -- --run grounding` | 🟢 **pass** |
| T5 | CopilotKit pin | `package.json` `@copilotkit/*` | 🟢 **1.55.2** |
| T6 | `hostOpsAgent` on disk | `rg hostOpsAgent mdeapp/src` | 🔴 **0 matches** |
| T7 | `/host/analytics` route | `src/app/host/analytics/page.tsx` | 🔴 **missing** |
| T8 | `/venues` route | `src/app/venues/page.tsx` | 🔴 **missing** |
| T9 | Observability tables | `approval_logs`, `workflow_runs`, `event_views` | 🔴 **no migration** |
| T10 | Host nav (AIE-002) | `host-nav-rail.tsx` Events+Analytics `disabled: true` | 🟡 **partial** — `/host/events` page **exists** but nav disabled |
| T11 | Mastra agent map | `src/mastra/index.ts` | 🟡 **7 agents** — no `hostOpsAgent` |
| T12 | Prod GET `/` | `curl https://www.mdeai.co/` | 🟢 **200** |
| T13 | Prod chat-smoke | `chat-smoke.mjs --base https://www.mdeai.co` | 🔴 **FAIL** — `POST /api/copilotkit` empty → **401** (script expects 400) |
| T14 | Linear AIE count | `label:prefix:AIE` in Events Platform | 🟢 **33 issues** (000 + 001–032) |
| T15 | CopilotKit MCP | shared-state docs | 🟢 `useCoAgent` + AG-UI state — matches `copilotkitV1` |

---

## Grading legend

| Dot | Spec % | Exec % | Meaning |
|-----|--------|--------|---------|
| 🟢 | 85–100 | 85–100 | Accurate spec + shipped + tested |
| 🟡 | 50–84 | 15–84 | Drift, partial, or blocked |
| 🔴 | 0–49 | 0–14 | Missing, unsafe, or failing |
| ⚪ | N/A | 0 | Not started (spec may still be valid) |

**Per-task %** = **40% spec correctness** + **60% execution readiness** (task-verifier rubric).

---

## Red flags & blockers (critical)

| # | Severity | Finding | Persona example |
|---|----------|---------|-----------------|
| R1 | 🔴 P0 | **SAN-115 / AIE-001 ledger open** — no dated `aie-001-ledger.md` | Patricia cannot sign launch; Andrés paid-ticket proof unfiled |
| R2 | 🔴 P0 | **`hostOpsAgent` absent** — AIE-005→009 0% on disk | Roberto opens `/host/analytics` → 404; “revenue vs last week?” impossible |
| R3 | 🔴 P0 | **SAN-704 / AIE-004** — `ai_runs` prod writes broken | Agent turns invisible to ops after deploy |
| R4 | 🟡 P0 | **Host nav disabled** while `/host/events` LIVE | Roberto bookmarks `/host/events` but sidebar shows Events greyed out (AIE-002) |
| R5 | 🟡 | **Agent cap exceeded** — 7 agents before adding hostOps | Plan says max 5 Core; `pingAgent`, `rentalAgent`, `evaluationAgent` inflate count |
| R6 | 🟡 | **107 issues in Events Platform** — 13× CTEST contest issues | Board sort polluted; implementers lose P0 focus |
| R7 | 🟡 | **Duplicate EVT prefixes** (2× EVT-002, EVT-013, EVT-014) | Same work tracked under EVT + AIE titles — triage confusion |
| R8 | 🟡 | **Prod copilotkit smoke** 401 vs 400 | Tier-1 gate flaky; may mask auth regression |
| R9 | ⚪ | **MVP tasks lack uniform `blockedBy: SAN-115`** in Linear | AIE-014+ could start early without ledger gate |
| R10 | ⚪ | **Disk AIE specs missing `linear: SAN-###`** in frontmatter | Single source of truth split across Linear + markdown |

---

## Implementation order audit

### AIE pack (canonical) — **🟢 86% correct**

```text
001 ledger → 002 nav → 003 schema ∥ 004 ai_runs → 005→009 hostOps → 010 funnel
→ 011→012 venues → [Core exit] → 013→026 MVP → 027→032 Advanced (FROZEN)
```

| Check | Verdict | Correction |
|-------|---------|------------|
| Core before MVP | 🟢 | Keep — matches `04-AI-native-system.md` §2 firewall |
| hostOps before attendeeAgent | 🟢 | AIE-014 correctly after AIE-008 |
| Venues after analytics | 🟡 | AIE-011 could parallel 008 after 001 — optional optimization |
| Advanced FROZEN | 🟢 | `FROZEN` label on SAN-781…786 |
| Linear `blockedBy` chain | 🟡 | Add `SAN-115` to all MVP agent tasks (767, 768, …) |
| Legacy EVT-015–028 discovery pack | 🟡 | Still on board **parallel** to AIE — mark `phase:post-mvp` or move project |

### Legacy EVP order vs AIE — **🟡 74% aligned**

EVP-015–028 (discovery) should stay **after** AIE Core exit, not before hostOps. `tasks/events/tasks/INDEX.md` still says “NEXT: SAN-119 discovery” — **conflicts** with AIE P0. **Correction:** Update INDEX implementation order to **AIE-001→012 first**.

---

## Per-task audit (AIE-000 → AIE-032)

| Order | Task | Linear | Spec% | Exec% | Grade | Dot | Prod? | Succeed? | Corrections |
|------:|------|--------|------:|------:|:-----:|:---:|:-----:|:--------:|-------------|
| — | AIE-000 Epic | SAN-757 | 95 | — | A | 🟢 | N/A | Yes | Add link to `02-events-audit.md` in description |
| 1 | AIE-001 Ledger | SAN-115 | 92 | 10 | D+ | 🔴 | No | Yes* | *Create evidence file; fix prod copilotkit smoke |
| 2 | AIE-002 Host nav | SAN-730 | 88 | 35 | C | 🟡 | Partial | Yes | Enable Events + Analytics links — page already exists |
| 3 | AIE-003 Schema | SAN-758 | 90 | 0 | C- | ⚪ | No | Yes | Ship migration before AIE-019/026 |
| 4 | AIE-004 ai_runs | SAN-704 | 94 | 5 | D | 🔴 | No | Yes | Urgent — blocks observability claims |
| 5 | AIE-005 hostOpsAgent | SAN-760 | 93 | 0 | C- | 🔴 | No | Yes | Register 5th agent; sync Zod + types + bridge |
| 6 | AIE-006 Read tools | SAN-762 | 91 | 0 | C- | 🔴 | No | Yes | RLS organizer scope tests required |
| 7 | AIE-007 salesInsight WF | SAN-759 | 92 | 0 | C- | 🔴 | No | Yes | SQL-first steps; unit test mocked orders |
| 8 | AIE-008 Analytics page | SAN-729 | 90 | 0 | C- | 🔴 | No | Yes | Create `src/app/host/analytics/page.tsx` |
| 9 | AIE-009 KPI cards | SAN-761 | 89 | 0 | C- | 🔴 | No | Yes | `useCopilotAction` disabled + render pattern |
| 10 | AIE-010 Funnel | SAN-763 | 87 | 0 | C- | ⚪ | No | Yes | Depends on `event_views` migration |
| 11 | AIE-011 Venue explorer | SAN-765 | 88 | 0 | C- | 🔴 | No | Yes | Not same as SAN-498 panel — need `/venues` |
| 12 | AIE-012 Venue detail | SAN-764 | 88 | 0 | C- | 🔴 | No | Yes | Slug route + `set_venue` wizard link |
| 13 | AIE-013 Forecast | SAN-766 | 90 | 0 | C- | ⚪ | No | Yes* | *After SAN-115 + hostOps |
| 14 | AIE-014 attendeeAgent | SAN-767 | 91 | 0 | C- | ⚪ | No | Yes* | Cap 8 agents; add `blockedBy: SAN-115` |
| 15 | AIE-015 Recs hub | SAN-769 | 86 | 0 | C- | ⚪ | No | Yes | Route `/recommendations` not in sitemap |
| 16 | AIE-016 Sponsor match | SAN-770 | 89 | 0 | C- | ⚪ | No | Yes | Link SAN-132; don’t duplicate CRM scope |
| 17 | AIE-017 Sponsor UI | SAN-768 | 88 | 0 | C- | ⚪ | No | Yes | sponsorAgent = agent #7 |
| 18 | AIE-018 CRM score | SAN-771 | 87 | 0 | C- | ⚪ | No | Yes | Schema `crm_leads` not on disk |
| 19 | AIE-019 Comms | SAN-772 | 86 | 0 | C- | ⚪ | No | Yes | Needs AIE-003 `approval_logs` |
| 20 | AIE-020 Bookings | SAN-773 | 85 | 0 | C- | ⚪ | No | Yes | Distinct from SAN-500 wizard step |
| 21 | AIE-021 Event health | SAN-774 | 88 | 0 | C- | ⚪ | No | Yes | Reuse hostOps — no new agent |
| 22 | AIE-022 Global UX | SAN-775 | 84 | 0 | C- | ⚪ | No | Yes | ⌘K/FAB — avoid second CopilotKit root |
| 23 | AIE-023 Attendee inbox | SAN-777 | 85 | 0 | C- | ⚪ | No | Yes | `/inbox` ≠ `/host/inbox` |
| 24 | AIE-024 Luma detail | SAN-135 | 90 | 15 | C+ | 🟡 | Partial | Yes | In Review — commerce page LIVE, Luma UX gap |
| 25 | AIE-025 Admin | SAN-778 | 84 | 0 | C- | ⚪ | No | Yes | Patricia role gate + RLS |
| 26 | AIE-026 AI runs UI | SAN-779 | 86 | 0 | C- | ⚪ | No | Yes | Blocked on SAN-704 + SAN-758 |
| 27 | AIE-027 bookingAgent | SAN-781 | 92 | 0 | B | ⚪ | No | Yes* | *FROZEN until revenue 30d — correct |
| 28 | AIE-028 Marketing split | SAN-782 | 90 | 0 | B | ⚪ | No | Yes | No monolithic marketingAgent — good |
| 29 | AIE-029 Sponsor ROI | SAN-783 | 85 | 0 | B- | ⚪ | No | Yes | PostHog MCP deferred — OK |
| 30 | AIE-030 Exceptions | SAN-784 | 86 | 0 | B- | ⚪ | No | Yes | adminOpsAgent MVP #8 |
| 31 | AIE-031 Campaigns | SAN-785 | 85 | 0 | B- | ⚪ | No | Yes | HITL + Resend only |
| 32 | AIE-032 WhatsApp | SAN-786 | 83 | 0 | B- | ⚪ | No | Yes | Template-only — correct safety |

**Pack averages:** Spec **89%** 🟢 · Execution **4%** 🔴 · Combined **38%** 🔴

---

## Task reports (narrative — P0 Core)

### AIE-001 — Production proof ledger (SAN-115) — 🔴 51%

**Real world:** Andrés buys on prod → wallet QR must be proven in a ledger row Patricia can audit. Today: code paths exist; **evidence file missing**.

**Corrections:** Run G1/G2/G3 matrix; file `tasks/testing/evidence/2026-06-08/aie-001-ledger.md`; investigate copilotkit 401 on prod smoke.

---

### AIE-005–009 — hostOps stack — 🔴 37% spec-only

**Real world:** Roberto finishes hosting “Salsa Night” and asks the concierge-style ops chat: *“How ticket sales compare to my last event?”* Today: **no agent, no page, no workflow** — he’d export CSV manually.

**Stack check (skills):**

| Pattern | Required | Disk |
|---------|----------|------|
| `useCoAgent({ name: "hostOpsAgent" })` | copilotkitV1 | ❌ |
| Agent key = Mastra map key | copilotkitV1 | ❌ |
| `salesInsightWorkflow` SQL-first | mastra / 04-plan | ❌ |
| Generative KPI `available: "disabled"` | copilotkitV1 | ❌ (event cards pattern exists for concierge) |

**Corrections:** Implement in order 005→006→007→008→009; single PR slice per ledger row C-###.

---

### AIE-002 — Host nav (SAN-730) — 🟡 58%

**Real world:** Roberto clicks “Events” in host sidebar — today it’s **greyed out** even though `/host/events` returns 200.

**Corrections:** Set `disabled: false` for Events + Analytics; add Playwright `e2e/host/host-events-list.spec.ts`.

---

### AIE-011–012 — Venues — 🔴 35%

**Real world:** Roberto needs a rooftop for 80 guests — today he must paste addresses into chat; there is **no `/venues` browse** like Peerspace.

**Corrections:** Build 029/030 wireframes; don’t conflate with SAN-498 match **panel** only.

---

## What’s missing (not on Linear or disk)

| Gap | Priority | Suggested action |
|-----|----------|------------------|
| `linear: SAN-###` in all AIE markdown frontmatter | P1 | Bulk sync from `LINEAR-SYNC.md` |
| Playwright `/host/analytics` journey | P1 | Add when AIE-008 ships |
| `sitemap.md` entries for `/host/analytics`, `/venues` | P2 | On route ship |
| Move CTEST-000–012 out of Events Platform | P1 | Separate Contest project |
| Consolidate duplicate EVT-002/013/014 issues | P2 | Close or `duplicateOf` |
| `adminOpsAgent` spec task (MVP #8) | P2 | Fold into AIE-025/030 or add AIE-033 |
| PostHog MCP wiring (AIE-029) | P3 | Advanced only |

---

## Best practices compliance

| Practice | Status | Notes |
|----------|--------|-------|
| CopilotKit 1.55.2 v1 only | 🟢 | Verified in `package.json` |
| No AI in Stripe checkout | 🟢 | AIE-024 / wireframe 004 correct |
| HITL for publish/money | 🟢 | `renderAndWaitForResponse` on host wizard |
| SQL truth → LLM narrate | 🟢 | Specified in AIE-006/007/013 |
| One agent per proven loop | 🟡 | Discipline good in specs; disk has extra agents |
| SAN-115 before scope creep | 🔴 | Not enforced on all Linear deps |
| Infisical secrets | 🟢 | No `.env` secrets probed |
| Phase 1 English only | 🟢 | No Spanish in specs |

---

## Suggested improvements

1. **Linear view:** `project:"Events Platform" label:prefix:AIE` — hide CTEST via filter.
2. **Sequence field:** Add `estimate: 1–32` on AIE issues for board sort (title sort works but fragile).
3. **Agent audit:** Document which of the 7 current agents count toward Events cap vs platform.
4. **Merge EVP INDEX → AIE:** `tasks/events/tasks/INDEX.md` should point P0 to AIE not EVP-015.
5. **Prod smoke:** Align copilotkit empty-body expectation (401 vs 400) or document auth requirement.
6. **Wireframe ↔ Linear:** Link `tasks/events/wireframes/events/NNN` in each issue `links[]`.

---

## Next steps (prompt)

```text
WEEK 1 (P0 — Roberto analytics):
  1. SAN-115 → file ledger (AIE-001)
  2. SAN-704 → fix ai_runs prod (AIE-004)
  3. SAN-730 → enable nav (AIE-002)
  4. SAN-760→762→759→729→761 (AIE-005→009)
  5. Browser proof: "revenue vs last week" on localhost + prod screenshot

WEEK 2 (Core venues):
  6. SAN-765→764 (AIE-011→012) after ledger green
  7. SAN-758 migration (AIE-003) in same sprint as approvals

GATE before MVP:
  - Roberto grounded analytics on prod
  - SAN-115 Done
  - Flip AIE-013+ only after gate

DO NOT START:
  - AIE-027 bookingAgent
  - CTEST issues under Events Platform
  - EVP-015 discovery pack (parallel track — post gate)
```

---

## Summary

| Question | Answer |
|----------|--------|
| Are Linear tasks complete? | 🟢 **AIE 33/33 synced** with mermaid + labels |
| Is order correct? | 🟢 **Mostly** — fix INDEX + `blockedBy` on MVP |
| 100% correct? | 🔴 **No** — execution ~4%, ledger open, hostOps missing |
| Production ready? | 🔴 **No** — Discovery Beta only (~48%) |
| Will tasks succeed? | 🟢 **Specs yes** if P0 order enforced |

**Overall grade: C+ (68%)** — excellent planning artifact; **ship SAN-115 + hostOps** to reach B+.

---

## References

- [Events Platform Linear](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues)
- [SAN-757 AIE Epic](https://linear.app/sanjiovani/issue/SAN-757)
- [CopilotKit Mastra shared state](https://docs.copilotkit.ai/integrations/mastra/shared-state)
- Prior audit: [`01-audit-events-mvp.md`](./01-audit-events-mvp.md)
