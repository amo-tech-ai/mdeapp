---
title: Events Platform — Full task audit (working notes)
date: 2026-06-09
updated: 2026-06-09
evidence: tasks/testing/evidence/2026-06-09/EVENTS-PLATFORM-AUDIT.md
overall_score: 62
grade: C+
status: synced
---

**Verdict: Events Platform is ~62/100 launch-ready — Phase A is shipped on disk, but tracker drift, open P0 commerce gates, and zero venue-booking schema on prod block a clean Done sign-off.**

Audit run 2026-06-09 · canonical evidence: [`EVENTS-PLATFORM-AUDIT.md`](../testing/evidence/2026-06-09/EVENTS-PLATFORM-AUDIT.md)

---

## Scope

**17 active Events Platform issues** (Todo / In Progress / In Review) + **3 cross-cutting P0 gates** that block **SAN-857 · AIE-025**.

| Bucket | Count |
|--------|------:|
| In Progress | 3 |
| In Review | 2 |
| Todo (Cycle 1 venue + browse) | 12 |
| Cross-project P0 (SAN-178, SAN-115, SAN-116) | 3 |

---

## Errors

| # | Error | Severity |
|---|--------|----------|
| E1 | **`tasks/events/todo.md` Linear column stale** — still `[Todo]` for **SAN-492**, **SAN-510**, **SAN-511**, **SAN-858** while Linear is In Progress / In Review | 🔴 |
| E2 | **`tasks/events/index-events.md` L29** — claims SAN-178 evidence "not filed"; **`SAN-178-RESULTS.md` exists** (partial test-mode proof) | 🟡 |
| E3 | **`todo.md` main SHA** — cites `8936927`; **`origin/main` = `2835cf2`** (#145 merged) | 🟡 |
| E4 | **SAN-135 · AIE-024** — Linear **In Progress** after two Done flips; **#138+#142 merged**; **#143 open** appears duplicate of merged #142 | 🔴 |
| E5 | **SAN-116 · PAY-003** — Linear **Done**; ticket vs sponsor webhook secrets still identical in env (prior audit) | 🔴 |
| E6 | **SAN-178 · PAY-001** — Linear description still lists PAY-003 ✅; env reality contradicts SAN-116 Done | 🔴 |
| E7 | **Ghost IDs** — `mdeapp/e2e/screens/SAN-860-j15-pin-clear-local.spec.ts` references **SAN-860** (no Linear entity); canonical **SAN-546 · OPS-JOURNEY** | 🟡 |
| E8 | **PR #143 title** — `"Ai/san 135 normalize host display"` — missing `SAN-135 · AIE-024 — …` naming rule | 🟡 |
| E9 | **Wires W03–W05 on disk** but **no wire-review evidence** (unlike SAN-510/511) | 🟡 |
| E10 | **SAN-857 disk spec missing** — Linear points to `tasks/events/specs/EVP-032A-event-browse-detail-panel.md`; **file not found** | 🟡 |

---

## Missing evidence

| Task | Required proof | Status |
|------|----------------|--------|
| **SAN-178 · PAY-001** | Live-money checkout + ledger G1 | 🟡 Partial — test-mode prod (`cs_test_*`, `SAN-178-RESULTS.md` + QR png) |
| **SAN-115 · AIE-001** | Full ledger (G1–G3) | 🔴 No dated ledger file |
| **SAN-116 · PAY-003** | Distinct webhook secrets + rotation proof | 🔴 None matching Done claim |
| **SAN-492 · EVT-033** | Staging apply + RLS smoke | 🟡 Branch/PR only — **`SAN-492-RESULTS.md`**, **`SAN-492-PR146-AUDIT.md`** |
| **SAN-510 · EVT-051** | Wire review | ✅ `SAN-510-511-WIRE-RESULTS.md` |
| **SAN-511 · EVT-052** | Wire review | ✅ same file |
| **SAN-512 · EVT-053** | Wire review | 🔴 VEB-W03 exists; **no RESULTS.md** |
| **SAN-513 · EVT-054** | Wire review | 🔴 VEB-W04 exists; **no RESULTS.md** |
| **SAN-514 · EVT-055** | Wire review | 🔴 VEB-W05 exists; **no RESULTS.md** |
| **SAN-858 · DATA-QUALITY** | Classification sign-off | 🟡 `SAN-858-CLASSIFICATION.md` (Option A draft) |
| **SAN-135 · AIE-024** | Post-ship browser | ✅ `SAN-135-RESULTS.md`, `SAN-135-PR142-browser-proof.md`, SCREEN-014 |
| **SAN-857 · AIE-025** | N/A (not started) | 🔴 No spec on disk |
| **UI impl tasks (494–502, 497, 498, 500)** | Playwright + Browser MCP | ⬜ Expected absent — **no `src` components** (`event-venue-cta`, etc.) |
| **SAN-546 · OPS-JOURNEY** (maps, not Events board) | Prod J15 post-#145 | 🟡 Needs re-run after deploy |

---

## Status drift (Linear ↔ GitHub ↔ disk)

| Task | Linear | GitHub | Disk / prod | Corrected state |
|------|--------|--------|-------------|-----------------|
| **SAN-135 · AIE-024 — MVP Luma event detail layout (EVP-032)** | In Progress | #138+#142 **merged**; #143 **open duplicate** | `event-detail-view.tsx` on main | **Done** — close #143 or re-scope as micro-follow-up |
| **SAN-492 · EVT-033 — Event venue + offerings schema** | In Progress ✅ | **#146 draft** | Migration **not on main**; **not on prod** | **In Progress** ✅ |
| **SAN-510 · EVT-051 — Wire: Event offerings panel + Event Venue CTA** | In Review ✅ | — | VEB-W01 on disk | **Done** (wire-only AC met) |
| **SAN-511 · EVT-052 — Wire: Request proposal modal** | In Review ✅ | — | VEB-W02 on disk | **Done** (wire-only AC met) |
| **SAN-858 · DATA-QUALITY — Events ownership classification** | In Progress ✅ | — | Option A doc; 31/49 NULL `organizer_id` live | **In Review** → **Done** after human sign-off on Option A |
| **SAN-512/513/514** (wires) | Todo | — | **W03–W05 exist** | **In Review** (disk ahead of Linear) |
| **SAN-493–502, 497, 498, 500, 857** | Todo ✅ | — | No implementation | **Todo** ✅ |
| **SAN-730 · AIE-002**, **SAN-731 · UI-004** | Done ✅ | #135, #137 merged | On main | **Done** ✅ |
| **SAN-178 · PAY-001** (Core, blocks events) | In Progress ✅ | — | Partial test-mode proof | **In Progress** ✅ |
| **SAN-115 · AIE-001** | Todo ✅ | — | Ledger incomplete | **Todo** ✅ (blocked by SAN-178) |
| **SAN-116 · PAY-003** | Done | — | Secrets not isolated | **In Progress** or **Done w/ documented exception** |

**`todo.md` sync needed:** update Linear column for B.1, B.3, B.4, B.15; fix main SHA; reconcile SAN-135 row (still says Done in Phase A table but Linear In Progress).

---

## Critical blockers

1. **SAN-178 · PAY-001 — Live ticket purchase on production** — Andrés cannot count as live revenue until test-mode sign-off (Path A) or live Stripe keys (Path B). Blocks **SAN-115 → SAN-857**.
2. **SAN-492 · EVT-033 — Event venue + offerings schema** — entire venue chain (493→502) blocked until ERD sign-off + staging/prod apply. Prod confirmed: **`venue_event_offerings` absent**, **`accepts_event_bookings` absent**.
3. **SAN-116 · PAY-003 — Stripe webhook secret isolation** — false Done poisons SAN-178 acceptance criteria checklist.
4. **SAN-135 · AIE-024** — tracker churn (Done↔In Progress) + orphan **PR #143** creates merge confusion.
5. **31/49 published events** with NULL `organizer_id` — Roberto won't see catalogue imports at `/host/events` until **SAN-858** is signed off (Option A = accept, still needs product ack).

**Stale blockers cleared:** PR #145 merged (was blocking pin-clear); SAN-492 branch pushed (#146). **SAN-510/511** no longer blocked by 492 for wire work.

---

## Production risks

| Risk | Persona impact | Mitigation |
|------|----------------|------------|
| Stripe **test mode** on prod | Andrés pays fake money; hosts see test orders | SAN-178 Path A/B decision |
| Shared webhook secrets | Sponsor event could hit ticket webhook handler | Rotate + split SAN-116 |
| SAN-492 applied without RLS smoke | Patricia/Camila booking data leak | Keep #146 draft; staging first |
| NULL `organizer_id` catalogue | Roberto thinks platform is empty for 31 events | SAN-858 Option A sign-off + UX copy |
| index-events **46%** vs todo **96/100 Phase A** | Team overestimates venue-booking readiness | Treat index-events overall % as north star for full platform |
| Ghost SAN-860 in e2e | Linear automation / reporting breaks | Rename spec → SAN-546 |

**Tier 1 prod smoke** (from prior session): GET `/` 200, chat-smoke OK — core shell healthy; **not** launch-signed.

---

## Supabase schema vs documentation

| Doc claim | Live prod (`zkwcbyxiwklihegjhuql`) | Match? |
|-----------|-------------------------------------|--------|
| Latest migration `20260608202427` (SAN-135 backfill) | ✅ `schema_migrations` top = `20260608202427` | ✅ |
| SAN-492 tables **not applied** | `venue_event_offerings` = false, `accepts_event_bookings` = false | ✅ |
| 49 published / 31 NULL organizer | 49 / 31 | ✅ |
| `bookings` reuse for event proposals | Table exists (6 RLS policies per prior audit) | ✅ |
| 0 venue partners for event booking demo | Still 0 until SAN-493 | ✅ expected |

**Schema/doc alignment: 92/100** — docs correctly describe pre-apply state; risk is only if someone merges #146 without sign-off.

---

## Ghost task IDs

| ID | Linear | Where used | Fix |
|----|--------|------------|-----|
| SAN-860 | ❌ not found | `e2e/screens/SAN-860-j15-pin-clear-local.spec.ts`, PR #145 title | → **SAN-546 · OPS-JOURNEY — Lucía: Prod journey matrix J05–J20** |
| SAN-861 | ❌ | PR #145 title | same |
| SAN-862 | ❌ | PR #145 title | same |

No ghost IDs inside **`tasks/events/todo.md`** task rows (naming format OK in tables).

---

## UI proof matrix (Chrome DevTools + Playwright + Browser MCP)

| Task | UI? | Browser/Playwright proof | Verdict |
|------|-----|--------------------------|---------|
| **SAN-135 · AIE-024** | ✅ | SCREEN-014, `SAN-135-PR142-browser-proof.md`, prod smoke refs | ✅ SHIP |
| **SAN-731 · UI-004** | ✅ | `SAN-731-RESULTS.md` | ✅ SHIP |
| **SAN-730 · AIE-002** | ✅ | Phase A gate audit | ✅ SHIP |
| **SAN-510/511** | Wire only | N/A | ✅ (doc task) |
| **SAN-512/513/514** | Wire only | Missing review evidence | 🟡 |
| **SAN-494–502, 497, 498, 500** | Future UI | Not started | ⬜ blocked |
| **SAN-857 · AIE-025** | Future UI | Blocked by SAN-115 | ⬜ |

---

## Final score per task

Scores = **execution readiness** (task-verifier rubric: disk + evidence + drift penalty). Grade A=90+, B=80–89, C=70–79, D=60–69, F<60.

| Task | Score | Grade | Corrected Linear state |
|------|------:||:-----:|------------------------|
| **SAN-730 · AIE-002 — Enable host navigation rail** | 88 | B+ | Done ✅ |
| **SAN-731 · UI-004 — Event detail loading skeleton + hero alt (a11y)** | 90 | A- | Done ✅ |
| **SAN-135 · AIE-024 — MVP Luma event detail layout (EVP-032)** | 92 | A- | **Done** (close #143) |
| **SAN-492 · EVT-033 — Event venue + offerings schema** | 85 | B | In Progress ✅ |
| **SAN-510 · EVT-051 — Wire: Event offerings panel + Event Venue CTA** | 94 | A | **Done** |
| **SAN-511 · EVT-052 — Wire: Request proposal modal** | 94 | A | **Done** |
| **SAN-512 · EVT-053 — Wire: Venue match panel + compare** | 78 | C+ | **In Review** |
| **SAN-513 · EVT-054 — Wire: Host wizard venue step** | 78 | C+ | **In Review** |
| **SAN-514 · EVT-055 — Wire: Admin event booking queue** | 78 | C+ | **In Review** |
| **SAN-858 · DATA-QUALITY — Events ownership classification** | 86 | B | In Review → Done after sign-off |
| **SAN-493 · EVT-034 — Seed Mamacita + 5 event partners** | 72 | C | Todo (blocked) |
| **SAN-494 · EVT-035 — Restaurant card Event Venue CTA** | 65 | D | Todo |
| **SAN-495 · EVT-036 — Event offerings detail panel** | 63 | D | Todo |
| **SAN-496 · EVT-037 — Request proposal modal (HITL)** | 62 | D | Todo |
| **SAN-497 · EVT-038 — eventVenueAgent + search/rank tools** | 68 | D+ | Todo |
| **SAN-498 · EVT-039 — AI venue match score panel** | 60 | D | Todo |
| **SAN-500 · EVT-041 — Host wizard venue step (Roberto)** | 62 | D | Todo |
| **SAN-502 · EVT-043 — Patricia admin queue event requests** | 60 | D | Todo |
| **SAN-857 · AIE-025 — Event browse detail panel (EVP-032A)** | 70 | C | Todo (blocked SAN-115) |
| **SAN-178 · PAY-001** *(P0 gate)* | 55 | F | In Progress |
| **SAN-115 · AIE-001** *(P0 gate)* | 25 | F | Todo |
| **SAN-116 · PAY-003** *(dependency)* | 40 | F | **Reopen In Progress** |

---

## Overall readiness score

| Layer | Score | Notes |
|-------|------:|-------|
| **Phase A (detail + host nav + skeleton)** | **93/100** | Shipped; SAN-135 tracker noise only |
| **Commerce / launch ledger** | **38/100** | SAN-178 partial; SAN-115 open; SAN-116 false Done |
| **Venue booking chain** | **22/100** | Schema authored, 0% prod UI; wires ~40% reviewed |
| **Tracker hygiene** | **58/100** | todo.md + index-events drift; ghost IDs |
| **Supabase truth vs docs** | **92/100** | Aligned pre-apply |

### **Overall Events Platform readiness: 62/100 (C+)**

Interpretation: **Discovery Beta** — Camila/Andrés core paths work on prod; **not launch-signed**; venue booking is spec-ready, not runtime-ready.

---

## Recommended actions (priority order)

### Done this pass (2026-06-09)

- [x] Evidence → [`EVENTS-PLATFORM-AUDIT.md`](../testing/evidence/2026-06-09/EVENTS-PLATFORM-AUDIT.md)
- [x] Wire evidence → [`SAN-512-514-WIRE-RESULTS.md`](../testing/evidence/2026-06-09/SAN-512-514-WIRE-RESULTS.md)
- [x] Sync `todo.md` + `index-events.md`
- [x] Linear: **SAN-135/510/511/512/513/514** → Done · **SAN-116 · PAY-003** → In Progress
- [x] Close duplicate **PR #143**
- [x] Rename e2e `SAN-860-*` → **`SAN-546-j15-pin-clear-local.spec.ts`**

### Still open (human / P0)

1. **SAN-858 · DATA-QUALITY** — human ack Option A → Done
2. **SAN-178 · PAY-001** — Path A or B → **SAN-115 · AIE-001** ledger
3. **SAN-116 · PAY-003** — rotate distinct sponsor webhook secret
4. **SAN-492 · EVT-033** — ERD sign-off → staging apply → merge #146
5. Author **`tasks/events/specs/EVP-032A-event-browse-detail-panel.md`** for SAN-857
6. Re-run prod **J15** after #145 deploy (SAN-546)