---
title: Events Platform — Full task audit
date: 2026-06-09
auditor: task-verifier + mde-task-lifecycle + mde-supabase
scope: Events Platform active tasks (Todo / In Progress / In Review) + P0 gates SAN-178 · SAN-115 · SAN-116
verified_via: Linear MCP · GitHub (gh) · Supabase MCP (zkwcbyxiwklihegjhuql) · disk · evidence dir
naming: SAN-### · SPEC-ID — Full Title
overall_score: 62
grade: C+
companion: tasks/events/notes/notes-5-events.md
---

# Events Platform audit — 2026-06-09

**Verdict: 62/100 (C+)** — Phase A shipped on disk; tracker drift and open P0 commerce gates block launch sign-off; venue booking schema authored but not on prod.

---

## Scope

17 active Events Platform issues + 3 cross-project P0 gates blocking **SAN-857 · AIE-025 — Event browse detail panel (EVP-032A)**.

| Bucket | Count |
|--------|------:|
| In Progress | 3 |
| In Review | 2 → 5 after wire sync |
| Todo | 12 |
| P0 gates (Core) | 3 |

---

## Errors

| # | Error | Severity | Remediation |
|---|--------|----------|-------------|
| E1 | `tasks/events/todo.md` Linear column stale | 🔴 | Synced 2026-06-09 (this pass) |
| E2 | `index-events.md` L29 SAN-178 "not filed" | 🟡 | Synced — partial proof exists |
| E3 | `todo.md` main SHA stale | 🟡 | Updated to `2835cf2` |
| E4 | SAN-135 Linear In Progress vs merged #138+#142 | 🔴 | Linear → Done; #143 closed duplicate |
| E5 | SAN-116 Done vs identical webhook secrets | 🔴 | Linear → In Progress + audit link |
| E6 | SAN-178 lists PAY-003 ✅ incorrectly | 🔴 | Comment on SAN-178 |
| E7 | Ghost SAN-860 in e2e filename | 🟡 | Renamed → SAN-546 |
| E8 | PR #143 title missing naming rule | 🟡 | Closed as duplicate of #142 |
| E9 | Wires W03–W05 no review evidence | 🟡 | `SAN-512-514-WIRE-RESULTS.md` filed |
| E10 | SAN-857 disk spec missing | 🟡 | Still TODO — author on start |

---

## Missing evidence

| Task | Status |
|------|--------|
| SAN-178 · PAY-001 | 🟡 Partial — `SAN-178-RESULTS.md` (test mode) |
| SAN-115 · AIE-001 | 🔴 No ledger file |
| SAN-116 · PAY-003 | 🔴 No isolation proof |
| SAN-492 · EVT-033 | 🟡 PR #146 draft; not applied prod |
| SAN-510/511 | ✅ `SAN-510-511-WIRE-RESULTS.md` |
| SAN-512/513/514 | ✅ `SAN-512-514-WIRE-RESULTS.md` (this pass) |
| SAN-858 · DATA-QUALITY | 🟡 Option A draft — human sign-off pending |
| SAN-135 · AIE-024 | ✅ SCREEN-014 + browser proofs |
| SAN-857 · AIE-025 | 🔴 Spec not on disk |

---

## Status drift (corrected)

| Task | Corrected state |
|------|-----------------|
| SAN-135 · AIE-024 | **Done** |
| SAN-492 · EVT-033 | **In Progress** |
| SAN-510 · EVT-051 | **Done** |
| SAN-511 · EVT-052 | **Done** |
| SAN-512/513/514 | **Done** |
| SAN-858 · DATA-QUALITY | **In Progress** (sign-off pending) |
| SAN-116 · PAY-003 | **In Progress** (reopened) |

---

## Critical blockers

1. **SAN-178 · PAY-001** — test-mode prod; blocks SAN-115 → SAN-857
2. **SAN-492 · EVT-033** — prod lacks `venue_event_offerings`, `accepts_event_bookings`
3. **SAN-116 · PAY-003** — webhook secrets not isolated
4. **31/49** published events NULL `organizer_id` — SAN-858 Option A pending ack

---

## Supabase vs docs (live prod)

| Check | Result |
|-------|--------|
| Latest migration | `20260608202427` ✅ |
| SAN-492 tables | Not applied ✅ matches docs |
| Published / NULL organizer | 49 / 31 ✅ |

**Schema/doc alignment: 92/100**

---

## Ghost IDs

| Ghost | Canonical |
|-------|-----------|
| SAN-860/861/862 | **SAN-546 · OPS-JOURNEY — Lucía: Prod journey matrix J05–J20** |

---

## Per-task scores

| Task | Score | Grade | State |
|------|------:|:-----:|-------|
| SAN-730 · AIE-002 | 88 | B+ | Done |
| SAN-731 · UI-004 | 90 | A- | Done |
| SAN-135 · AIE-024 | 92 | A- | Done |
| SAN-492 · EVT-033 | 85 | B | In Progress |
| SAN-510 · EVT-051 | 94 | A | Done |
| SAN-511 · EVT-052 | 94 | A | Done |
| SAN-512 · EVT-053 | 78 | C+ | In Review |
| SAN-513 · EVT-054 | 78 | C+ | In Review |
| SAN-514 · EVT-055 | 78 | C+ | In Review |
| SAN-858 · DATA-QUALITY | 86 | B | In Progress |
| SAN-493–502, 497, 498, 500 | 60–72 | D–C | Todo |
| SAN-857 · AIE-025 | 70 | C | Todo |
| SAN-178 · PAY-001 | 55 | F | In Progress |
| SAN-115 · AIE-001 | 25 | F | Todo |
| SAN-116 · PAY-003 | 40 | F | In Progress |

---

## Overall readiness

| Layer | Score |
|-------|------:|
| Phase A | 93 |
| Commerce / ledger | 38 |
| Venue booking chain | 22 |
| Tracker hygiene | 72 (post-sync) |
| Supabase vs docs | 92 |

### **Overall: 62/100 (C+)**

---

## Actions taken (2026-06-09 sync pass)

- [x] Evidence file (this document)
- [x] `SAN-512-514-WIRE-RESULTS.md`
- [x] `todo.md` + `index-events.md` sync
- [x] Linear: SAN-135/510/511/512/513/514 Done; SAN-116 In Progress
- [x] Close duplicate PR #143
- [x] Rename e2e spec SAN-860 → SAN-546
- [ ] SAN-858 human sign-off → Done
- [ ] SAN-178 Path A/B → SAN-115 ledger
- [ ] SAN-492 ERD sign-off → apply #146
- [ ] Author `EVP-032A-event-browse-detail-panel.md` for SAN-857
