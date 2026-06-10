# Forensic sync audit — Linear ↔ documentation

**Date:** 2026-06-09  
**Auditor:** Linear MCP + `All issues.csv` + 16 markdown trackers + task INDEX files + `sitemap.md`  
**Verdict:** **Not 100% synchronized** — planning/hygiene strong; CSV stale; 92 open orphans; proof gap on launch path.

---

## Executive summary

| Status | Count | Evidence |
|--------|------:|----------|
| Total SAN in CSV export | **739** | `docs/linear/CSV/All issues.csv` parse |
| Active (non-Dup/Canceled) | **716** | Same |
| Unique SAN in trackers | **580** | 16 `docs/linear/markdown/*.md` files |
| **Orphans** (Linear active, not in trackers) | **176** | CSV ∖ markdown trackers |
| **Open orphans** | **92** | Todo/In Progress/Backlog/In Review |
| Duplicate SAN (status=Duplicate) | **13** | CSV |
| Spec ID collisions (active titles) | **30** | Title regex scan |
| SAN in markdown **missing from CSV** | **20** | SAN-835–854 — **live in Linear API** |
| MVP blockers (Track A) | **3** | SAN-178, SAN-546, SAN-115 |
| VEB-000 parent epic | **0** | Linear search + SAN-492 `parentId` null |

---

## Final integrity scores

| Area | Score / 100 | Rationale |
|------|------------:|-----------|
| Linear Coverage | **82** | 580/716 active tracked; 20 Linear-live SANs absent from stale CSV |
| MVP Coverage | **88** | Track A issues exist, labeled, documented; **proof 33%** |
| Dependencies | **84** | SAN-115→parent SAN-757; blocks SAN-178; no cycles on launch chain |
| Tracker Accuracy | **78** | 92 open orphans; SAN-730 missing from rollups; intentional ADV repeats |
| Duplicate Cleanup | **86** | Phase 0 dups verified (API SAN-463); 30 spec collisions remain |
| Route Coverage | **83** | MVP routes mostly owned; `/rentals` P0 gap; `/host/analytics` no route |
| Venues | **91** | VEB 18/18 in Linear + `venues.md`; no VEB-000; SAN-792–796 dup track |
| Grounding | **72** | GS-005/006/009 reopened; **SEARCH-002 collision** 387 vs 780 |
| Launch Readiness | **72** | 1/3 persona proofs; SAN-178 unproven |
| **Overall sync** | **79** | **Confidence: 85%** (high on hygiene claims; CSV age lowers certainty) |

---

## 1. Linear coverage audit

### Verified correct 🟢

| Pack | Linear | Tracker | Evidence |
|------|--------|---------|----------|
| VEB-001…018 | SAN-492–509 | `venues.md`, `mvp.md`, `ADV.md` | 18/18 grep + API SAN-492 |
| VEN MVP | SAN-292–314 | `venues.md`, `mvp.md` | 23 rows |
| RE-001…020 | SAN-469 cluster | `real-estate.md` | 20/20 |
| TRIP-001…019 | SAN-273–291 | `trips.md` | 19/19 |
| OCL filed | SAN-187–226 | `openclaw.md`, ADV | 40/40 |
| Phase 0 hygiene | 8 SANs | `notes.md` | API SAN-463 Duplicate→368 ✅ |

### Missing from CSV (live in Linear) 🔴

| SAN range | Count | In markdown | CSV |
|-----------|------:|-------------|-----|
| SAN-835–854 | 20 | `mvp.md` + `ADV.md` manual | **0** |

**Evidence:** `get_issue SAN-835` → Backlog, UX, 2026-06-08. CSV max ~SAN-834.

### Missing Linear issues (documented, not filed) 🟡

| Pack | Count | Source | Action |
|------|------:|--------|--------|
| Revenue R2–R5 | ~32 | `tasks/revenue/LINEAR-REVENUE.md` | **Frozen** until SAN-178 |

### Linear without documentation (orphans) 🔴

| Bucket | Open count | Top projects |
|--------|----------:|--------------|
| Post-MVP / freeze | ~65 | AI & Intelligence (43) |
| Duplicate close | 5 | SAN-792–796 Venues |
| Manual review | ~19 | UX, Commerce, unassigned |
| Shipped archive | ~84 Done | UIX SCREEN-* (OK bundled) |

Full list: [`orphan-triage-report.md`](./orphan-triage-report.md)

---

## 2. Tracker audit

### Required trackers — spot checks

| SAN | Expected tracker | Found | Status |
|-----|------------------|-------|--------|
| SAN-178 | core.md, revenue.md, ADV.md | ✅ | Todo · Urgent |
| SAN-546 | core.md | ✅ | **In Progress** (API) · CSV stale Todo |
| SAN-115 | core.md, ADV.md | ✅ | Todo · parent SAN-757 |
| SAN-730 | mvp.md or ADV | ❌ **mvp.md** | Only in `notes.md` + task indexes |
| SAN-731 | mvp.md | ✅ | Backlog |
| SAN-135 | mvp.md, ADV.md | ✅ | In Review |
| SAN-492 | venues.md, mvp.md | ✅ | Todo |
| SAN-227/228/231 | grounding.md, ADV.md | ✅ | Backlog |
| SAN-387 | mvp.md, mastra.md | ✅ | In Review |
| SAN-780 | grounding.md, ADV.md | ✅ | Backlog · SEARCH-002 title |

### Tracker duplicate rows

Repeated SAN IDs in one file (navigation/blockers) are **intentional** in `ADV.md`, `CHAT.md`, `mvp.md` — not CSV duplicate rows. Example: SAN-178 appears 4× in ADV (blocker footers). **Not a sync defect.**

---

## 3. Duplicate audit

### Marked Duplicate in Linear 🟢

| Duplicate | Canonical | Verified |
|-----------|-----------|----------|
| SAN-463 | SAN-368 | API `status: Duplicate` |
| SAN-464 | SAN-369 | CSV + hygiene log |
| SAN-563 | SAN-551 | CSV |
| SAN-798/799 | SAN-800/801 | CSV |
| SAN-470 | SAN-469 | CSV |
| SAN-437/360 | SAN-574 | CSV |

### Active spec collisions 🔴

| Spec ID | SANs | Severity |
|---------|------|----------|
| **SEARCH-002** | SAN-387, SAN-780 | **P0 naming** |
| VEN-010 | SAN-167, SAN-793 | P1 dup track |
| VEN-020 | SAN-299, SAN-795 | P1 dup track |
| VEN-001 | SAN-158, SAN-362, SAN-792 | P1 |
| PAY-001 | SAN-178, SAN-715 | 🟢 OK (715 Done = decline states) |

Detail: [`duplicate-spec-audit.md`](./duplicate-spec-audit.md), [`search-namespace-audit.md`](./search-namespace-audit.md)

---

## 4. Dependency audit

### Launch chain (Linear API 2026-06-09)

```text
SAN-178 (Todo, Urgent, phase:launch)
  → blocks SAN-115 ledger G1
SAN-546 (In Progress, phase:launch) 
  → G2 evidence
SAN-366 (Done) 
  → G3 met
SAN-115 (Todo, parentId: SAN-757)
  → closes when G1+G2+G3 filed
```

| Check | Result |
|-------|--------|
| blockedBy on SAN-115 | Description refs SAN-178 ✅ |
| parent SAN-757 on SAN-115 | API `parentId: SAN-757` ✅ |
| SAN-730 parent | API `parentId: SAN-757` ✅ |
| Milestone on VEB | SAN-492 → 🎟️ Events — MVP Gates ✅ |
| Circular deps on launch path | None found ✅ |
| VEB-000 parent | **Missing** — SAN-492 `parentId` null 🔴 |

---

## 5. MVP audit

| Gate | SAN | Linear | Docs | Proof |
|------|-----|--------|------|-------|
| G1 Andrés payment | SAN-178 | Todo | core, revenue, ledger | 🔴 **None** |
| G2 Camila matrix | SAN-546 | In Progress | core, CHAT | 🟡 Partial |
| G3 Roberto publish | SAN-366 | Done | mvp, events index | ✅ |
| Ledger | SAN-115 | Todo | core, ADV, AIE spec | 🔴 Open |

**MVP proof score: 33/100** (1 of 3 gates with prod evidence).

---

## 6. Venues audit

| Item | Status | Evidence |
|------|--------|----------|
| VEB-001…018 disk specs | ✅ 18/18 | `tasks/venues/tasks/event-booking/INDEX.md` |
| SAN-492…509 Linear | ✅ 18/18 | CSV + API |
| Tracker `venues.md` | ✅ 46 rows | VEN+DATA+VEB |
| VEB-000 parent epic | ❌ | No Linear issue; children orphaned |
| SAN-792–796 parallel VEN | 🔴 | Orphans; collide with SAN-292–314 |

---

## 7. Grounding audit

| SAN | Role | Linear status | Tracker | Issue |
|-----|------|---------------|---------|-------|
| SAN-227 | GS-005 verify | Backlog | grounding.md ✅ | phase:phase2 label |
| SAN-228 | GS-006 spike | Backlog | grounding.md ✅ | |
| SAN-231 | GS-009 sponsor | Backlog | grounding.md ✅ | Post-MVP OK |
| SAN-387 | SEARCH-002 events | In Review | mvp.md ✅ | Canonical event hybrid |
| SAN-780 | SEARCH-002 confidence | Backlog | ADV.md ✅ | **Rename → SEARCH-003** |

**Note:** `notes.md` line "SAN-780 renamed SEARCH-002" conflicts with SAN-387 also SEARCH-002 — hygiene incomplete.

---

## 8. Route coverage audit

| Route | Owner SAN | Status | Acceptance in Linear |
|-------|-----------|--------|----------------------|
| `/chat` | SAN-733, SAN-822 | Live / sprint | ✅ |
| `/events` | SAN-518, SAN-586 | Live | ✅ |
| `/events/[slug]` | SAN-135, SAN-731, SAN-178 | Live / shell checkout | 🟡 PAY proof |
| `/rentals` | SAN-478 | MVP P0 Todo | ✅ spec |
| `/restaurants` | SAN-490 | Live | ✅ |
| `/nightlife` | SAN-491 | Live | ✅ |
| `/cafes` | SAN-519 | Live/polish | ✅ |
| `/host/events` | SAN-118, SAN-366 | Live | ✅ |
| `/host/event/new` | EVP-010 | Live | ✅ |
| `/host/analytics` | SAN-729, SAN-730 | **No sitemap route** | Spec only |
| `/venues` | — | **No route** | SAN-765 future |
| `/admin/events` | — | POST | No issue (OK) |

Source: [`/home/sk/mdeai/sitemap.md`](../../../sitemap.md), [`route-coverage-audit.md`](./route-coverage-audit.md)

---

## 9. Orphan triage summary

| Bucket | Count | Action |
|--------|------:|--------|
| Post-MVP / freeze | 65 | Move to ADV; remove from Cycle 1 Todo |
| Duplicate / close | 5 | SAN-792–796 → dup SAN-292–314 |
| Manual review | 19 | Assign owner |
| Shipped archive (Done) | 84 | Bundle in ux.md — low risk |

Target: 92 open → **<20** after dup + freeze. [`orphan-triage-report.md`](./orphan-triage-report.md)

---

## Critical findings

### 🔴 Must fix immediately

1. **SAN-178** — No production Stripe purchase proof (launch blocker #1)
2. **CSV export stale** — SAN-835–854 missing; SAN-546 status wrong in CSV
3. **SEARCH-002 collision** — SAN-387 vs SAN-780 same spec ID
4. **SAN-792–796** — Parallel VEN track collides with canonical SAN-292–314
5. **SAN-730** — Track B P1 issue **not in mvp.md/ADV.md** rollups

### 🟡 Should fix soon

6. VEB-000 parent epic missing (SAN-492–509)
7. 92 open orphans — triage to <20
8. GS label on SAN-227 says `phase:phase2` — align with post-MVP freeze
9. Revenue R2–R5 — do not import until Track A green (documented freeze OK)

### 🟢 Verified correct

10. Phase 0 hygiene 8/8 (MAP-035, SEARCH rename intent, dups, GS reopen)
11. VEB 18/18 filed with disk specs + `veb-import-plan.md`
12. SAN-366 Roberto publish Done
13. SAN-733 Camila handoff Done
14. Core payment spine SAN-116, SAN-715 Done
15. Duplicate issues SAN-463/464/563/798/799/470/437 properly marked

---

## Final verdict

| Question | Answer |
|----------|--------|
| Is Linear 100% synchronized? | **No — ~79% overall** |
| What is missing? | CSV refresh; SAN-178 proof; VEB-000; SAN-730 in rollups; SEARCH-003 rename |
| What is incorrect? | SEARCH-002 dual assignment; SAN-792–796 dup track; stale CSV statuses |
| What should be archived? | 84 Done UIX orphans (bundle note); dup VEN orphans after merge |
| What should be deferred? | Revenue R2+, OCL, Intelligence, Sponsors, VEB implementation |
| What should be imported? | **Nothing** until SAN-178 → SAN-546 → SAN-115 |
| Overall completion % | **Planning 95% · Sync 79% · Execution 5% · Launch 72%** |
| Overall confidence % | **85%** (API-verified for P0 SANs; CSV age limits orphan precision) |

---

## Recommended next 10 actions (priority order)

| # | Action | Type |
|---|--------|------|
| 1 | **SAN-178** — prod Stripe purchase + wallet QR evidence | Execution |
| 2 | **SAN-546** — complete prod 4-vertical matrix | Execution |
| 3 | **SAN-115** — close ledger with G1+G2+G3 files | Execution |
| 4 | Export Linear CSVs (refresh SAN-835+) | Hygiene |
| 5 | **SAN-730** — ship host nav + add row to `mvp.md` | Execution + tracker |
| 6 | **SAN-731** + **SAN-135** — UI polish (parallel) | Execution |
| 7 | Rename SAN-780 → SEARCH-003 in Linear | Hygiene (<5 min) |
| 8 | Dup/cancel SAN-792–796 vs SAN-292–314 | Hygiene (<15 min) |
| 9 | Create VEB-000 parent · wire SAN-492–509 | Hygiene (<15 min) |
| 10 | Orphan triage batch — freeze 65 intel/commerce to post-MVP | Hygiene |

**Do not:** New audits · Revenue import · OpenClaw · new trackers.

---

## Evidence index

| Source | Path / method |
|--------|----------------|
| CSV parse | `docs/linear/CSV/All issues.csv` — 739 rows, Python 2026-06-09 |
| Linear API | `get_issue` SAN-178, 546, 115, 492, 463, 835, 792 |
| Trackers | `docs/linear/markdown/{core,mvp,ADV,CHAT,maps,venues,...}.md` |
| Task indexes | `docs/tasks/events/index-events.md`, `venues/event-booking/INDEX.md` |
| Prior audits | `docs/linear/audit/*.md` (frozen — no new audits) |
| Sitemap | `/home/sk/mdeai/sitemap.md` |
