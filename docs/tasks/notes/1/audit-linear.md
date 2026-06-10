---
title: Linear sync audit vs mdeai docs + GitHub
auditor: task-verifier protocol (read-only)
date: 2026-06-03
updated: 2026-06-03
method: Linear MCP · tasks.md · plan.md · improve.md · linear.md · mdeapp git/PRs
prod_sha: bf40ef9
mdeapp_head: d006503
linear_edits: none
companion:
  - tasks.md
  - tasks/notes/audit-01-tasks.md
---

> **Summary:** Linear vs `tasks.md` / GitHub scorecard (~58% sync). Lists stale issues, missing SANs, and recommended fixes — read-only audit; apply batches only when approved.
  - tasks/notes/improve.md
  - linear.md
overall_linear_sync: 58
overall_grade: F
launch_path_sync: 62
---

# Linear sync audit — read-only

> **Question:** Does Linear match `tasks.md`, `plan.md`, and what actually shipped on `main`?  
> **Answer:** **58% synced (grade F).** Status accuracy for recent venue/intel merges is good where Done was flipped; **4 venue issues stuck In Review**, **commerce still tops `phase:launch`**, **6 queue rows have no SAN**, and **`linear.md` still sorts PAY-001 first** while Discovery Beta is active.

**Sources:** Linear MCP (2026-06-03) · [`tasks.md`](../../tasks.md) · [`plan.md`](../../plan.md) · [`improve.md`](./improve.md) · [`linear.md`](../../linear.md) · GitHub `amo-tech-ai/mdeapp` · prod @ `bf40ef9`

---

## Executive summary — scorecard

| Metric | Value | Dot | Grade |
|--------|------:|:---:|:-----:|
| **Overall Linear sync** | **58%** | 🔴 | **F** |
| Launch path only (7 pillars) | 62% | 🟡 | D |
| Status vs disk / PR | 62% | 🟡 | D |
| Implementation order | 45% | 🔴 | F |
| Track separation (Discovery vs Commerce) | 40% | 🔴 | F |
| Dependencies / blockers | 65% | 🟡 | D |
| Launch prioritization | 50% | 🔴 | F |
| Issue body quality (feature + use case) | 75% | 🟡 | C |
| Done = actually shipped | 70% | 🟡 | C |
| In Progress = truly active | 80% | 🟡 | B |
| Docs cross-sync (`tasks.md` ↔ Linear ↔ `linear.md`) | 52% | 🔴 | F |

**Grade scale:** A ≥90 · B 80–89 · C 70–79 · D 60–69 · F &lt;60

**Dot legend:** 🟢 aligned · 🟡 partial drift · 🔴 wrong/stale · ⏸ correctly deferred · ⚪ N/A / not started

**% meaning (Linear sync):** weighted average of (1) status match vs disk/PR, (2) priority/phase vs `tasks.md` row, (3) presence of Linear issue when queue expects one. Not implementation %.

---

## Launch path sync — by pillar

Active track only ([`tasks.md` rows 1–50](../../tasks.md)); commerce/trips/advanced deferred.

| Pillar | Launch rows | Linear sync % | Dot | Grade | Top gap |
|--------|-------------|-------------:|:---:|:-----:|---------|
| 1. Platform stability | 1, 5, 8, 10 | **72** | 🟡 | C | SAN-462 OK; F13 + OPS-JOURNEY **no SAN**; PR-16 In Progress ✅ |
| 2. Auth | 2, 26 | **68** | 🟡 | D | SAN-367 + PR #56 ✅; **AUTH-009 no SAN** |
| 3. Maps | 6, 7 | **55** | 🔴 | F | SAN-369/368 Todo — env gates not In Progress |
| 4. Discovery UX | 3–4, 9, 11–16 | **64** | 🟡 | D | SEARCH-003 Done ✅; embed 403 **no SAN**; #38 blocked on soak |
| 5. Mobile shell | 42–48 | **58** | 🔴 | F | SAN-489 Done but row 42 links **SAN-521**; MOB-CK In Progress |
| 6. Events / venues | 17–37, 21 | **61** | 🟡 | D | SAN-295–298 **In Review after merge**; SCREEN-023 **no SAN** |
| 7. Payments / publish | D1–D5 | **35** | 🔴 | F | Still **Urgent + phase:launch + Cycle 1** — should be ⏸ deferred |

**Launch path rollup:** **62%** 🟡 **D** — shippable after status/label cleanup, not after new features.

---

## Issue sync matrix — `tasks.md` ↔ Linear (launch-critical)

| Row | Task | tasks.md dot | Linear | Linear status | Sync % | Dot | Fix when editing |
|--:|------|:---:|--------|---------------|------:|:---:|------------------|
| 1 | SAN-462 / OPS-001 | 🟡 | [SAN-462](https://linear.app/sanjiovani/issue/SAN-462) | In Progress | **85** | 🟢 | Add `track:discovery-beta`; remove PAY-001 from body |
| 2 | AUTH-011 | 🟡 | [SAN-367](https://linear.app/sanjiovani/issue/SAN-367) | In Progress | **90** | 🟢 | Merge PR #56 → Done |
| 3 | DATA-041 | 🟢 | [SAN-379](https://linear.app/sanjiovani/issue/SAN-379) | Done | **100** | 🟢 | — |
| 4 | DATA-008 | 🟡 | [SAN-338](https://linear.app/sanjiovani/issue/SAN-338) | Todo | **75** | 🟡 | P1 after P0 gates |
| 5 | PR-16 | 🟡 | [SAN-458](https://linear.app/sanjiovani/issue/SAN-458) | In Progress | **85** | 🟢 | — |
| 6 | MAP-008B | 🟡 | [SAN-369](https://linear.app/sanjiovani/issue/SAN-369) | Todo | **60** | 🟡 | P0 — bump to In Progress |
| 7 | MAP-002B | 🟡 | [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) | Todo | **55** | 🔴 | P0 — prod ADK unproven |
| 8 | F13 | 🟡 | — | **missing** | **0** | 🔴 | Create SAN; P0 platform |
| 9 | DATA-EMBED | 🟡 | — | **missing** | **0** | 🔴 | Create SAN; P1 |
| 10 | OPS-JOURNEY | 🟡 | — | **missing** | **0** | 🔴 | Create SAN; pairs SAN-462 |
| 11 | SEARCH-002 | 🟡 | [SAN-387](https://linear.app/sanjiovani/issue/SAN-387) | In Review | **80** | 🟢 | Hold merge until soak policy |
| 12 | UX-023 | ⚪ | [SAN-437](https://linear.app/sanjiovani/issue/SAN-437) | Todo | **85** | 🟢 | Post-soak P1 |
| 15 | UX-033 | ⚪ | [SAN-323](https://linear.app/sanjiovani/issue/SAN-323) | Todo | **80** | 🟢 | — |
| 21 | SCREEN-023 | 🟥 | — | **missing** | **0** | 🔴 | Create SAN; P0 venues |
| 26 | AUTH-009 | ⚪ | — | **missing** | **0** | 🔴 | Create SAN; before VEN-019 |
| 37 | VEN-031 | 🟡 | — | partial refs | **50** | 🟡 | Dedicated SAN or link in venue epic |
| 42 | SCREEN-018 | 🟡 | [SAN-489](https://linear.app/sanjiovani/issue/SAN-489) Done | Done | **45** | 🔴 | **tasks.md links SAN-521** — doc fix |
| D1 | PAY-001 | ⏸ | [SAN-178](https://linear.app/sanjiovani/issue/SAN-178) | Todo Urgent | **25** | 🔴 | Defer: remove `phase:launch` |
| D2 | PAY-003 | ⏸ | [SAN-116](https://linear.app/sanjiovani/issue/SAN-116) | In Progress Urgent | **20** | 🔴 | Defer + stop In Progress |
| D3 | EVT-002 | ⏸ | [SAN-366](https://linear.app/sanjiovani/issue/SAN-366) | Todo | **40** | 🔴 | Defer labels |
| D4 | EVT-001 | ⏸ | [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) | Todo Urgent SLA | **30** | 🔴 | Defer labels |

### Shipped but Linear stale (status drift)

| Linear | Spec | Linear status | Disk / PR | Sync % | Dot | Action |
|--------|------|---------------|-----------|------:|:---:|--------|
| [SAN-295](https://linear.app/sanjiovani/issue/SAN-295) | VEN-012 | In Review | Merged #48 `269c436` | **15** | 🔴 | → Done |
| [SAN-296](https://linear.app/sanjiovani/issue/SAN-296) | VEN-013 | In Review | Shipped #48 | **20** | 🔴 | → Done (or IP if polish) |
| [SAN-297](https://linear.app/sanjiovani/issue/SAN-297) | VEN-014 | In Review | Merged #50 | **15** | 🔴 | → Done |
| [SAN-298](https://linear.app/sanjiovani/issue/SAN-298) | VEN-015 | In Review | Migration live | **20** | 🔴 | → Done |
| [SAN-304](https://linear.app/sanjiovani/issue/SAN-304) | VEN-021 | Done | Merged #53 | **100** | 🟢 | — |
| [SAN-307](https://linear.app/sanjiovani/issue/SAN-307) | VEN-020 | Done | Merged #55 | **100** | 🟢 | — |
| [SAN-388](https://linear.app/sanjiovani/issue/SAN-388) | SEARCH-003 | Done | Merged + vitest | **100** | 🟢 | — |
| [SAN-489](https://linear.app/sanjiovani/issue/SAN-489) | SCREEN-018 | Done | Merged #51 | **100** | 🟢 | Fix tasks.md row 42 link |

### Correctly aligned (reference)

SAN-379, SAN-388, SAN-304, SAN-307, SAN-489, SAN-462 (active), SAN-367 + PR #56, SAN-387 In Review + PR #38, SAN-100 Duplicate → SAN-462.

---

## Dimension breakdown

| Dimension | Sync % | Dot | Grade | Notes |
|-----------|------:|:---:|:-----:|-------|
| Status vs disk/PR | 62 | 🟡 | D | Recent Done flips good; 4 venue In Review stale |
| Implementation order | 45 | 🔴 | F | `linear.md` + `phase:launch` = commerce-first; docs = Discovery Beta |
| Track separation | 40 | 🔴 | F | No `track:discovery-beta` / `phase:deferred`; PAY/EVT in Cycle 1 |
| Dependencies / blockers | 65 | 🟡 | D | SAN-462→UX/#38 OK; SAN-462 body still cites PAY-001 |
| Launch prioritization | 50 | 🔴 | F | Commerce Urgent competes with soak/maps; TRP Urgent in same cycle |
| Issue quality | 75 | 🟡 | C | Plain English + persona on many; missing Use case template |
| Done = shipped | 70 | 🟡 | C | 4 lagging venue issues drag score |
| In Progress = active | 80 | 🟡 | B | SAN-367, SAN-462, SAN-458, SAN-521 real; SAN-116 false active |
| Docs cross-sync | 52 | 🔴 | F | `linear.md` Phase 2 table ≠ `tasks.md` two-track header |

---

## Correct implementation order (Discovery Beta — active)

Per [`tasks.md`](../../tasks.md) / [`plan.md`](../../plan.md). Commerce Exit **frozen** until track reopened.

```text
GATE (parallel)
  1. SAN-462  — soak 3/3 (1/3 at audit)
  2. SAN-367  — AUTH-011 prod auth (PR #56 open)
  3. SAN-369  — MAP-008B Map ID prod
  4. SAN-368  — MAP-002B ADK prod
  5. SAN-458  — PR-16 branch protection
  ‖ F13, DATA-EMBED, OPS-JOURNEY (create Linear issues)

AFTER SAN-462 3/3
  6. SAN-387 / PR #38 — SEARCH-002 event cards UI
  7. SAN-437 — UX-023 ResultCardShell
  ‖ SAN-323 UX-033 stale pins

VENUES (active spine)
  8. SCREEN-023 `/restaurants` (no SAN — gap)
  9. VEN-013 polish (SAN-296 → should Done)
 10. AUTH-009 → VEN-019 HITL (no SAN for AUTH-009)
 11. VEN-031 Playwright gate

MOBILE (P1, after platform gates)
 12. SAN-521 MOB-CK-001 (In Progress — SAN-489 Done)
 13. SAN-522+ mobile chat/map

DEFER ⏸
  PAY-001/003, EVT-002/001 (D1–D5)
  TRIP-* (Phase 2)
  INT-003/004 (P2 unless blocking Camila)
```

**Commerce MVP Exit (when reopened):** PAY-001 → PAY-003 → EVT-002 → EVT-001 — not current sprint.

---

## Current blockers

| Blocker | Persona impact | Linear / disk |
|---------|----------------|---------------|
| **SAN-462 1/3** | Can't safely merge #38 / UX soak work | In Progress — correct |
| **MAP-008B / MAP-002B Todo** | Tourist: pins / grounded cafés fail on prod | SAN-369, SAN-368 |
| **PR #38 open** | Andrés: event cards not on `main` | SAN-387 In Review |
| **`/rentals` redirect** | Camila: no browse page | tasks.md row 38 🟥; SAN-471 partial |
| **SCREEN-023 missing** | Tourist: no `/restaurants` | No Linear issue |
| **Embed API 403** | Camila: degraded hybrid search | No Linear issue |
| **Stale In Review venue issues** | Queue noise, wrong sprint focus | SAN-295, 296, 297, 298 |
| **`linear.md` commerce-first** | Operator pulls PAY before soak | Doc drift — not Linear |

---

## Missing Linear issues (`tasks.md` has row, no SAN)

| Task | Feature | Use case (from tasks.md) | P tier |
|------|---------|--------------------------|--------|
| **F13** | Thread / `ai_runs` persistence | Camila turn 11 remembers turn 1 after redeploy | P0 |
| **DATA-EMBED** | Fix embed 403 | Full hybrid fusion for *"2BR near Estadio"* | P1 |
| **OPS-JOURNEY** | Prod J05–J20 matrix | Lucía proves Carlos nightlife on mdeai.co | P0 |
| **AUTH-009** | JWT → Mastra context | User-scoped booking before VEN-019 HITL | P0 |
| **SCREEN-023** | `/restaurants` page | Tourist browses without chat | P0 |
| **VEN-031** | Playwright venue gate | CI proof booking + routing | P0 |

Copy body fields from [`improve.md` §2](./improve.md) + [`task-spec-template.md`](../templates/task-spec-template.md).

---

## Suggested milestones

| Milestone | Project | Issues |
|-----------|---------|--------|
| **Discovery Beta — Platform gates** | Core Foundation | SAN-462, 367, 369, 368, 458, F13, OPS-JOURNEY |
| **Discovery Beta — Venues stop** | Venues | SCREEN-023, VEN-019 path, VEN-031, J05–J08 |
| **Discovery Beta — UX soak** | Platform Infra | SAN-387, 437, 323 (post-soak) |
| **Commerce MVP Exit** *(frozen)* | Core + Events | SAN-178, 116, 366, 115 |
| **Trips Phase 2** *(frozen)* | Trips | TRP-* with `phase:phase2` only |
| **Mobile shell P1** | screens | SAN-521, 522, 524, 525 |

Use **🔵 Discovery Beta** for active cycle; reserve **🚨 Launch Critical** for Commerce Exit when reopened.

---

## Labels & P0 / P1 / P2 sprint model

| Label | Purpose |
|-------|---------|
| `track:discovery-beta` | Active launch path (rows 1–50) |
| `track:commerce-exit` | Deferred D1–D5 |
| `phase:deferred` | Remove from MVP view |
| `priority:p0` / `p1` / `p2` | Sprint buckets (or Linear priority 1/2/3) |
| `gate:soak` | Blocked on SAN-462 |
| `persona:camila` etc. | Optional filter |

| Tier | Linear priority | Scope | This cycle |
|------|-----------------|-------|------------|
| **P0** | Urgent (1) | Platform gates + venues stop + prod journeys | SAN-462, 367, 369, 368, SCREEN-023 path |
| **P1** | High (2) | Post-soak UX, mobile, DATA-008, `/rentals` | #38, UX-023, SAN-521, SAN-471 |
| **P2** | Medium (3) | INT-003/004, UX-024/029, trips, commerce | Out of Cycle 1 |

**Issue template** (mirror [`tasks.md`](../../tasks.md) Use case column):

```markdown
**Track:** Discovery Beta | Commerce Exit
**Phase:** P0 | P1 | P2
**Feature:** [capability]
**Use case:** **[Persona]:** [prompt/action] → [outcome]
**Purpose:** [one line why now]
**Gate:** SAN-462 | AUTH-009 | none
```

Good example: [SAN-489](https://linear.app/sanjiovani/issue/SAN-489) (Purpose + Camila mobile goals).

---

## Exact recommended changes (when you edit Linear)

### Status flips (ship proof exists)

1. SAN-295, SAN-296 → **Done** (PR #48)
2. SAN-297 → **Done** (PR #50)
3. SAN-298 → **Done** (migration live)

### Defer commerce (Discovery Beta active)

4. SAN-178, SAN-116, SAN-366, SAN-115 → remove `phase:launch`; add `track:commerce-exit` + `phase:deferred`; lower priority; **out of Cycle 1**
5. SAN-116 → **Todo** or Backlog (not In Progress)

### Active queue alignment

6. SAN-462 → `track:discovery-beta`; fix description (remove PAY-001 dependency)
7. SAN-369, SAN-368 → **In Progress** or top Todo P0
8. SAN-387 → keep In Review until #38 merge policy clear

### Create issues

9. F13, DATA-EMBED, OPS-JOURNEY, AUTH-009, SCREEN-023 — copy use cases from `tasks.md`

### Deprioritize

10. TRP-* `phase:mvp` + Urgent → `phase:phase2`
11. SAN-406, SAN-407 → P2, not Urgent

### Views + docs

12. New view **Discovery Beta** — exclude `phase:deferred`
13. Retag MVP EXECUTION — stop sorting PAY-001 first
14. Update [`linear.md`](../../linear.md) §Phase 2 to match `tasks.md` two-track header
15. Fix [`tasks.md`](../../tasks.md) row 42 — SCREEN-018 → SAN-489 (not SAN-521)

---

## GitHub PR alignment

| PR | Linear | Sync | Dot |
|----|--------|------|:---:|
| #56 AUTH-011 | SAN-367 In Progress | Active | 🟢 |
| #38 SEARCH-002 | SAN-387 In Review | Blocked by soak | 🟢 |
| #39 INT-010 | — | P2 defer | ⚪ |
| #55 VEN-020 | SAN-307 Done | Aligned | 🟢 |
| #53 VEN-021 | SAN-304 Done | Aligned | 🟢 |
| #48 VEN-012/013 | SAN-295/296 In Review | Should Done | 🔴 |

---

## Cross-doc sync checklist

Run after any launch-critical merge or Linear bulk edit.

| Step | Command / action | Pass criteria |
|------|------------------|---------------|
| 1 | `node tasks/scripts/sync-tasks-queue-hints.mjs --since 14` | Read hints only; patch `tasks.md` manually |
| 2 | Compare `phase:launch` view vs `tasks.md` rows 1–10 | No commerce Urgent in P0 |
| 3 | `cd mdeapp && npm run verify:task -- <TASK-ID> --skip-floor` | Exit 0 for Done candidates |
| 4 | Flip Linear Done only with PR SHA + evidence path | Per [`improve.md` §5](./improve.md) |
| 5 | Re-score this audit | Update `overall_linear_sync` in frontmatter |

**Related audits:** [`audit-01-tasks.md`](./audit-01-tasks.md) (queue document 62% 🟡) · playbook [`improve.md`](./improve.md)

---

## Best next task

**Primary:** [SAN-367](https://linear.app/sanjiovani/issue/SAN-367) (AUTH-011) — PR #56 open, In Progress, launch path.

**Parallel if blocked:**

- **SAN-462** — wait for nightly synthetic (2/3 remaining)
- **SAN-369 / SAN-368** — Vercel env (Map ID + ADK URL)

**Do not:** start PAY-001 or merge #38 until soak policy explicit (SAN-462 gate).

---

## Verdict

| Item | Value |
|------|-------|
| **Overall sync** | **58% · grade F · 🔴** |
| **Launch path** | **62% · grade D · 🟡** |
| **Biggest gaps** | Commerce in launch view · 4 stale In Review · 6 missing SAN · `linear.md` commerce-first · tasks.md row 42 wrong Linear link |
| **Linear edits** | None in this audit — apply §Exact recommended changes before sprint planning |
| **Re-audit trigger** | After SAN-462 3/3, after commerce defer batch, after missing-SAN create batch |

*Verified 2026-06-03 · prod `bf40ef9` · mdeapp `d006503` · vitest 488/488*
