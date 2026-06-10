You are a Senior Product Architect, Technical Program Manager, Linear Administrator, and Forensic Auditor.

Goal:
Verify that Linear is 100% synchronized with the project documentation, trackers, audits, PRDs, roadmaps, task indexes, and markdown rollups.

Audit everything.

Sources of Truth:

* docs/linear/
* docs/linear/markdown/
* docs/linear/audit/
* tasks/
* plans/
* PRDs
* INDEX files
* MVP definitions
* Roadmaps
* Audit reports

Verification Process

1. Linear Coverage Audit

   * Verify every task/spec has a corresponding Linear issue when required.
   * Identify missing SAN issues.
   * Identify issues in Linear that do not exist in documentation.

2. Tracker Audit

   * Verify:

     * core.md
     * mvp.md
     * ADV.md
     * CHAT.md
     * maps.md
     * venues.md
     * partners.md
     * revenue.md
     * grounding.md
     * real-estate.md
     * ux.md
   * Ensure every SAN appears in the correct tracker.

3. Duplicate Audit

   * Find duplicate SANs.
   * Find duplicate specs.
   * Find duplicate feature implementations.
   * Verify duplicate issues are marked Duplicate and linked to canonicals.

4. Dependency Audit

   * Verify:

     * blockedBy
     * parent issues
     * milestones
     * labels
     * project assignment
   * Find circular dependencies.
   * Find orphan issues.

5. MVP Audit
   Verify MVP path:

   * SAN-178
   * SAN-546
   * SAN-115

   Verify launch blockers are correctly identified.

6. Venues Audit

   * Verify VEB-001 → VEB-018
   * Verify SAN-492 → SAN-509
   * Verify VEB-000 parent epic exists or flag missing.

7. Grounding Audit

   * Verify:

     * SAN-227
     * SAN-228
     * SAN-231
     * SAN-387
     * SAN-780

   Check naming collisions.

8. Route Coverage Audit
   Compare sitemap against Linear.

   Verify every MVP route has:

   * owner
   * issue
   * status
   * acceptance criteria

9. Orphan Audit
   Review all orphan issues.

   Categorize:

   * Keep
   * Duplicate
   * Archive
   * Post-MVP
   * Unknown

10. Final Integrity Score

Generate scores:

| Area              | Score / 100 |
| ----------------- | ----------- |
| Linear Coverage   |             |
| MVP Coverage      |             |
| Dependencies      |             |
| Tracker Accuracy  |             |
| Duplicate Cleanup |             |
| Route Coverage    |             |
| Venues            |             |
| Grounding         |             |
| Launch Readiness  |             |
| Overall           |             |

Output

Executive Summary

| Status             | Count |
| ------------------ | ----- |
| Total SAN Issues   |       |
| Missing SANs       |       |
| Duplicate SANs     |       |
| Orphans            |       |
| Missing Parents    |       |
| Missing Milestones |       |
| Missing Labels     |       |
| MVP Blockers       |       |

Critical Findings

🔴 Must Fix Immediately

🟡 Should Fix Soon

🟢 Verified Correct

Final Verdict

* Is Linear 100% synchronized?
* What is missing?
* What is incorrect?
* What should be archived?
* What should be deferred?
* What should be imported?
* Overall completion %
* Overall confidence %
* Recommended next 10 actions in priority order.

Do not assume anything is correct.
Verify every claim against source files and Linear.
Provide evidence for all findings.


**Agreed — audits are frozen.** `audit-checklist.md` is now only the final execution queue (also removed stray assistant text that had leaked into the file).

## Active work

**Track A** (only path that moves launch):
```text
SAN-178 → SAN-546 → SAN-115
```

**Track B** (parallel): SAN-730 · SAN-731 · SAN-135  

**Track C** (optional, <30 min): SAN-780→SEARCH-003 · dup 792–796 · VEB-000

## Frozen

Revenue R2+ · OpenClaw · Intelligence · Sponsors · Admin CRM · Rec systems · new trackers · **new audits**

## Reality

| MVP proof | 33 |
| Launch | 72 |

**Next action:** [SAN-178](https://linear.app/sanjiovani/issue/SAN-178) — real prod payment → webhook → ticket → wallet QR. Nothing else changes launch readiness until that's green.

Want me to **implement SAN-178** or **SAN-730** next?

# Execution queue (canonical)

**Audit frozen · no new audits.** Full checklist: [`audit-checklist.md`](./audit-checklist.md)

```text
Track A: SAN-178 → SAN-546 → SAN-115
Track B: SAN-730 · SAN-731 · SAN-135 (parallel)
Track C: SAN-780→003 · SAN-792–796 dup · VEB-000 (<30 min)
```

**Highest ROI:** SAN-178 prod Stripe proof. MVP proof score: **33/100**.

---

## Events UI notes (reference)

**Verdict:** Planning is solid; execution is ~4% done. The best UI momentum is **3 quick polish tasks** (nav, detail skeleton, Luma hero) you can ship **in parallel** with SAN-115 — not sponsor/admin/discovery screens yet.

---

## Where you are

| Persona | What works today | What's missing |
|---------|------------------|----------------|
| **Camila** | Chat event cards, `/events`, basic detail | Luma-quality detail, recs hub |
| **Roberto** | Wizard + `/host/events` **on disk** | Nav still **disabled**; no `/host/analytics` |
| **Andrés** | Tickets + checkout APIs | Wallet polish, checkout deep link |
| **Patricia** | — | All admin/sponsor surfaces spec-only |

P0 chain per [AIE index](tasks/events/tasks/AI-native-system/index-aievents.md): **SAN-115 → hostOps (AIE-005–009) → venues → MVP**. UI work is fine **before** hostOps if it doesn't fake agent KPIs.

---

## Recommended next tasks (UI-first, start this week)

### Tier 1 — Ship in 1–2 days each (no new agents)

| Priority | Task | Linear | Route / surface | Spec / wireframe | Why now |
|----------|------|--------|---------------|------------------|---------|
| **1** | **Enable host nav** | [SAN-730](https://linear.app/sanjiovani/issue/SAN-730) · AIE-002 | `host-nav-rail.tsx` | [008-host-dashboard](tasks/events/wireframes/events/008-host-dashboard.md) | `/host/events` is **LIVE** but nav still shows Events/Analytics disabled — embarrassing for Roberto |
| **2** | **Event detail skeleton + a11y** | [SAN-731](https://linear.app/sanjiovani/issue/SAN-731) | `/events/[slug]` `loading.tsx` + hero `alt` | [003-event-details](tasks/events/wireframes/events/003-event-details.md) | Pure polish on PAGE-003; improves Camila/Andrés perceived quality |
| **3** | **Luma detail — Phase A only** | [SAN-135](https://linear.app/sanjiovani/issue/SAN-135) · AIE-024 | `/events/[slug]` | [PAGE-003b](tasks/events/specs/pages/PAGE-003b-event-detail-luma.md) + [Luma screen 03](tasks/events/design/luma/screens/03-event-detail.md) + 16 PNG refs | In Review on Linear; biggest tourist conversion lift; **don't** pull in EVP-033–036 yet — hero + host block + sticky buy only |

**Tier 1 exit check:** Roberto clicks Events in nav → 200; detail route has skeleton; Luma hero visible on one prod event slug.

---

### Tier 2 — 3–5 day UI shells (static OK, wire agent later)

| Priority | Task | Linear | Route | Spec | Notes |
|----------|------|--------|-------|------|-------|
| **4** | **Host analytics shell** | [SAN-729](https://linear.app/sanjiovani/issue/SAN-729) · AIE-008 | `/host/analytics` | [PAGE-M02](tasks/events/specs/pages/missing/PAGE-M02-host-analytics.md) · wire [013–014](tasks/events/wireframes/events/013-revenue-dashboard.md) | Build **layout + KPI placeholders + event selector** from real orders; generative cards wait for AIE-005–009 |
| **5** | **Venue explorer** | [SAN-765](https://linear.app/sanjiovani/issue/SAN-765) · AIE-011 | `/venues` | wire [029](tasks/events/wireframes/events/029-venue-explorer.md) | Browse grid + map column; reuse Places patterns from restaurants — no `hostOpsAgent` needed |
| **6** | **Events browse refresh** | [SAN-518](https://linear.app/sanjiovani/issue/SAN-518) | `/events` | [PAGE-002](tasks/events/specs/pages/PAGE-002-events-browse.md) | Page exists; tighten filters, empty states, evidence for QA |

---

### Tier 3 — Do **not** start yet (spec exists, wrong timing)

| Surface | Why wait |
|---------|----------|
| `/sponsors`, sponsor CRM (PAGE-M07/M10) | AIE-016–018; needs hostOps + ledger |
| Discovery approval queue (PAGE-M09) | EVP-015–028 pack; post SAN-115 |
| `/admin/events`, `/admin/bookings` | Patricia ops; no MVP host loop proof |
| Generative KPI cards on analytics | AIE-009; needs `hostOpsAgent` (AIE-005) |
| `/recommendations`, `/inbox` | AIE-015, AIE-023; MVP after Core |

---

## Suggested sprint shape

```text
Parallel track A (infra — still P0):  SAN-115 ledger + AIE-003 schema
Parallel track B (UI — safe now):     SAN-730 → SAN-731 → SAN-135 Phase A
Then:                                 SAN-729 analytics shell → SAN-765 /venues
Later (post ledger):                  AIE-005–009 hostOps chat on analytics
```

**index-events** still lists `SAN-730 → SAN-731 → SAN-135` before discovery — that **UI slice is correct**. Full AIE order keeps hostOps **before** sponsor/recs MVP intelligence.

---

## Best “get started today” pick

If you want **one screen PR today**:

**AIE-002 / SAN-730** — flip `disabled: true` on Events (and Analytics → stub route or “coming soon” sheet), fix the stale comment in `host-nav-rail.tsx`, add a 1-line Playwright assert. ~30–60 min, Roberto-visible, zero agent risk.

If you want **one page build this week**:

**SAN-135 Phase A** — Luma hero + host avatar block on `event-detail-view.tsx` using [`tasks/events/design/luma/screens/03-event-detail.md`](tasks/events/design/luma/screens/03-event-detail.md) and screenshots under `tasks/events/screenshots/luma/`.

---

## Screens inventory at a glance

| Status | Count | Examples |
|--------|------:|----------|
| **Live** | 9 routes | `/`, `/chat`, `/events`, `/events/[slug]`, `/host/*`, `/me/tickets` |
| **Spec-only, ready to build** | 10 PAGE-M* | `/host/analytics`, `/venues`, `/host` marketing |
| **Wireframed, MVP+** | 37 | Sponsors, admin, bookings, health dashboard |
| **Blocked on agents** | ~12 | Anything with CopilotKit KPI cards, sponsor match, attendee agent |

Full spec index: [`tasks/events/specs/INDEX.md`](tasks/events/specs/INDEX.md) · wireframes: [`tasks/events/wireframes/INDEX.md`](tasks/events/wireframes/INDEX.md).

Want me to implement **SAN-730** (host nav) or **SAN-731** (detail skeleton) first?








**All five hygiene fixes are applied** — local docs and [Events Platform on Linear](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues) are aligned.

## What changed

| # | Fix | Result |
|---|-----|--------|
| **1** | `PLANNING-VERIFICATION.md` | Count **78 → ~95** on EP; **AIE-first** order is canonical |
| **2** | CTEST scope | **SAN-532–544** moved to **Growth & Operations** + label `out-of-scope:events` · **0 CTEST on EP** |
| **3** | AIE frontmatter | **28 files updated** — all 32 AIE tasks now have correct `linear: SAN-###` from `LINEAR-SYNC.md` |
| **4** | Screenshot paths | Design docs → `tasks/events/screenshots/luma/` · added `screenshots/README.md` |
| **5** | EVT duplicates | Titles fixed on Linear + canonical markers on Done issues |

## Linear updates (live)

**EVT collisions resolved** (not “superseded” — different tasks had the same EVT number):

| Was | Now | Canonical |
|-----|-----|-----------|
| SAN-131 `EVT-013` | **EVP-028** (readiness) | SAN-117 = canonical EVT-013 (cards, Done) |
| SAN-132 `EVT-014` | **EVP-029** (sponsor CRM) | SAN-118 = canonical EVT-014 (host list, Done) |
| SAN-120 `EVT-002` | **EVP-016** (maps+venues) | SAN-366 = host publish proof (Done) |

**CTEST:** 13 issues off EP → [Growth & Operations](https://linear.app/sanjiovani/project/growth-and-operations-2effa6c5b651)

## Docs touched

- [`tasks/events/PLANNING-VERIFICATION.md`](tasks/events/PLANNING-VERIFICATION.md) — rewritten
- [`tasks/events/tasks/AI-native-system/LINEAR-SYNC.md`](tasks/events/tasks/AI-native-system/LINEAR-SYNC.md) — EVT + CTEST sections
- [`tasks/events/audit/02-events-audit.md`](tasks/events/audit/02-events-audit.md) — hygiene score + T16/T17
- [`tasks/events/tasks/INDEX.md`](tasks/events/tasks/INDEX.md) — snapshot count
- 7 design/luma path files + `screenshots/README.md`

## Sync status

| Layer | Status |
|-------|--------|
| AIE 000–032 ↔ Linear | ✅ 100% |
| EVP ↔ SAN mapping | ✅ |
| Specs / wireframes / screenshots | ✅ |
| EP board cleanliness | ✅ (no CTEST) |
| **Implementation** | ❌ still **4 Done** — P0 remains **SAN-115** (AIE-001) |

**EP board filter:** `project:"Events Platform" -label:out-of-scope:events`  
**AIE-only:** `project:"Events Platform" label:prefix:AIE`

Still open for execution (not doc): SAN-115 ledger, hostOps stack AIE-005–009, enable host nav AIE-002.





# Linear markdown — Phase 0 execution log

**Playbook:** [`audit-checklist.md`](./audit-checklist.md) · **Lifecycle:** `mde-task-lifecycle` Phase 2 research + Phase 5 ship (bookkeeping only — no code)

---

## Phase 0 queue (hygiene)

| # | Item | Linear action | Markdown | Status |
|---|------|---------------|----------|--------|
| 1 | **SAN-789** MAP-010 collision | Rename → **MAP-035** | ADV.md + maps.md | ✅ **2026-06-09** |
| 2 | **SAN-463/464** MAP dups | Already Duplicate of 368/369 | maps.md | ✅ **2026-06-09** |
| 3 | **SAN-780** GS-005 collision | Rename → **SEARCH-002** | ADV.md + grounding.md | ✅ **2026-06-09** |
| 4 | **SAN-563** C2 dup | Duplicate of SAN-551 | revenue.md + ADV.md | ✅ **2026-06-09** |
| 5 | **SAN-798/799** PTR-AI | Duplicate of 800/801 | partners.md | ✅ **2026-06-09** |
| 6 | **SAN-469/470** RE dup | SAN-470 → dup of SAN-469 | real-estate.md + mvp.md | ✅ **2026-06-09** |
| 7 | **SAN-437/360** UX dup | Duplicate of SAN-574 (Done) | ux.md | ✅ **2026-06-09** |
| 8 | **SAN-227/228/231** GS canceled | Reopened **GS-005/006/009** Backlog | grounding.md + ADV.md | ✅ **2026-06-09** |
| 9 | CSV re-export | MVP + All + Partners + Discovery | `audit/csv-audit-report.md` | 🟡 **partial** — UI export blocked |
| 10 | Rollup reconciliation | After #9 | `audit/rollup-validation-report.md` | 🟡 **baseline done** |
| — | VEB import plan | 18/18 filed SAN-492–509 | `audit/veb-import-plan.md` | ✅ **2026-06-09** |
| — | Launch blocker verification | MVP exit path | `audit/launch-blocker-verification.md` | ✅ **2026-06-09** |

## Execution mode (2026-06-09)

**Launch 72% · Execution ~5% · Critical: SAN-178**

Track A: `SAN-178 → SAN-546 → SAN-115`  
Track B: `SAN-730 · SAN-731 · SAN-135` (parallel)

## Phase 1 queue

| Priority | Task | Status |
|----------|------|--------|
| P0-1 | CSV export | 🔴 |
| P0-2–3 | Validate + generate.py | ⚪ |
| P0-4–6 | SAN-178 · 546 · 115 | 🔴/🟡 |
| P1 | SAN-730/731/135 | 🟢 |
| 18 | Orphan triage 92→<20 | 🟡 |
| 19 | SEARCH-003 rename (780) | 🟡 |
| 20 | VEB-000 epic | ⚪ |
| 21 | Launch scorecard | ✅ weekly |

---

## Canonical mappings (post-hygiene)

| Spec / role | Canonical SAN | Notes |
|-------------|---------------|-------|
| MAP-010 autocomplete | SAN-104 | Roberto host venue |
| MAP-035 explore intel | SAN-789 | Renamed from MAP-010 prefix |
| MAP-002B / MAP-008B P0 | SAN-368 / SAN-369 | SAN-463/464 are dups |
| GS-005 verify ticket | SAN-227 | Not SAN-780 |
| GS-006 tool spike | SAN-228 | Reopened from Canceled |
| GS-009 sponsor research | SAN-231 | Reopened from Canceled |
| SEARCH-002 hybrid confidence | SAN-780 | Renamed from GS-005 prefix |
| SEARCH-001 grounded places | SAN-790 | ADV § Search — Grounding |
| RE-003 rental indexes | SAN-469 | SAN-470 dup |
| PTR-AI-001/002 | SAN-800/801 | SAN-798/799 dup |
| REV-C2 checkout widget | SAN-551 | SAN-563 dup |
| UX-023 ResultCardShell | SAN-574 Done | SAN-437/360 dup |
| VEB-001…018 event venue booking | SAN-492–509 | Linear title EVT-033…050 · Events Platform |
| MVP exit G1 payment | SAN-178 | Hard blocker — Andrés |
| MVP exit G3 publish | SAN-366 | Done — Roberto |
| MVP exit G2 discovery | SAN-733 + SAN-546 | 733 Done · matrix open |

---

## Batch B — Partners + RE dedupe (2026-06-09)

| SAN | Action | Canonical | Linear |
|-----|--------|-----------|--------|
| SAN-798 | Partners dup | **SAN-800** | Duplicate + hygiene header |
| SAN-799 | Partners dup | **SAN-801** | Duplicate + hygiene header |
| SAN-469 | RE canonical | **SAN-469** | Todo · full RE-003 spec body |
| SAN-470 | RE dup | SAN-469 | Duplicate · archived body |

Canonical **SAN-800/801** enriched with merged PTR-AI acceptance criteria. CSV patched (All, Partners, MVP, Discovery).

## Batch C — UX + GS recovery (2026-06-09)

| SAN | Action | Result |
|-----|--------|--------|
| SAN-437 | UX dup | Duplicate of **SAN-574** Done · reconciliation note |
| SAN-574 | UX canonical | Done · supersedes 437 + 360 |
| SAN-227 | GS-005 recovery | Backlog · full spec from disk |
| SAN-228 | GS-006 recovery | Backlog · full spike spec |
| SAN-231 | GS-009 recovery | Backlog · full Patricia/admin spec |

## Batch A verification (2026-06-09 re-run)

| SAN | Linear state | duplicateOf / title | CSV patch |
|-----|--------------|---------------------|-----------|
| SAN-463 | Duplicate | SAN-368 | All + Discovery (already Duplicate in MVP) |
| SAN-464 | Duplicate | SAN-369 | All + Discovery (already Duplicate in MVP) |
| SAN-780 | Backlog | `SEARCH-002 — Hybrid rental + event search…` | All + Discovery title |
| SAN-563 | Duplicate | SAN-551 | All + AI & Intelligence |

No Linear writes needed — all four were already correct in Linear API.

## Verification notes

- **duplicateOf** in Linear API auto-moves issue to Duplicate; do not pass `state: Duplicate` without `duplicateOf` first.
- **#9 partial:** Batch A rows patched in CSV; full re-export (MVP + All + Partners + Discovery UI export) still needed for SAN-835+ and body/label sync.
- Do not run `generate.py` until full CSV re-export — markdown manual patches would be overwritten.

---

## Organization reference

Rollups: `core.md`, `mvp.md`, `ADV.md`, `CHAT.md` (CSV-driven via `generate.py`).  
Domain trackers: `maps.md`, `grounding.md`, `partners.md`, `ux.md`, `real-estate.md`, `revenue.md`, etc.  
Master queue: [`audit-checklist.md`](./audit-checklist.md).
