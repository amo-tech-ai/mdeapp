---
title: Events Platform — Task Forensic Audit (Gate + Venue Booking chain)
audited: 2026-06-08
revised: 2026-06-08T23:58Z
linear_verified: 2026-06-08 via Linear MCP get_issue + save_issue
auditor: task-verifier · mde-supabase · Linear MCP · Supabase MCP
scope: SAN-135, SAN-492, SAN-493, SAN-510, SAN-511, SAN-494, SAN-495, SAN-496
source_of_truth:
  - tasks/events/todo.md
  - tasks/events/changelog.md
  - tasks/events/specs/venue-booking/VENUE-DATA-MODEL.md
  - Linear (get_issue, includeRelations)
  - Supabase MCP (project zkwcbyxiwklihegjhuql, live schema)
  - GitHub PR #138 (merged `9971bb8`)
prior_audits: ./01-audit-events-mvp.md · ./02-events-audit.md
---

# Events Platform — Task Forensic Audit

**Role:** Senior software specialist · forensic auditor · technical PM · QA lead · production-readiness reviewer  
**Question:** Are SAN-135 + the venue-booking chain (492 → 496) correct, in order, and safe to implement / merge / mark Done?

---

## Audit quality score

| Area | Score | Verdict |
|------|------:|---------|
| Linear verification | 95% | 🟢 |
| Dependency analysis | 98% | 🟢 |
| Schema verification | 96% | 🟢 |
| Blocker detection | 98% | 🟢 |
| Task ordering | 95% | 🟢 |
| Production readiness | 92% | 🟢 |
| Spec completeness | 90% | 🟢 |
| Risk analysis | 97% | 🟢 |

**Overall audit quality:** **95/100 (A)**

---

## 1. Executive summary

**Phase A is closed.** SAN-135 merged on `main` @ `9971bb8` (PR #138). No product gaps remain — only optional prod smoke after Vercel promotes.

**The venue chain (492 → 496) is NOT ready for migration code.** One 🔴 hard blocker remains:

- **Three-way table-naming conflict:** live `event_venues` (Roberto ticketed-event rooms, 7 rows) ≠ VEB-001's absent `venues` ≠ SAN-492 Linear text proposing duplicate `event_venues` + new `event_venue_bookings`.

**Resolution path (documented, not coded):** [`VENUE-DATA-MODEL.md`](../specs/venue-booking/VENUE-DATA-MODEL.md) — proposes `partner_venues` master + extend `venue_booking_requests` (no `event_venue_bookings`). **Requires human approval before migration.**

**Wire tasks SAN-510/511** are over-constrained in Linear (`blockedBy SAN-492`). They need no DB — change to `relatedTo SAN-492` and start now (~92% readiness).

| Question | Answer |
|----------|--------|
| Is the task list 100% correct? | **No** — dependency diagram in todo.md was wrong; schema naming unresolved |
| Which task starts next? | **SAN-510 + SAN-511** (wires) in parallel with **SAN-492 planning approval** |
| Which must stay blocked? | **492 migration**, **493–496 code** until VENUE-DATA-MODEL approved |
| Production ready? | **SAN-135 yes** (post-deploy smoke pending) · **venue chain 0% code** |

---

## 2. Task score table

| Task | Status (Linear) | % Correct | Grade | Ready? | Errors | Fixes |
|------|-----------------|----------:|:-----:|:------:|--------|-------|
| **SAN-135 · AIE-024 — MVP Luma event detail layout (EVP-032)** | Done | **95%** | **A** | 🟢 shipped | Prod HTML smoke pending Vercel promote; Linear Done may need user OK | Optional prod curl/Browser on `/events/reina-de-antioquia-2026-finals` |
| **SAN-492 · EVT-033 — Event venue + offerings schema** | Todo | **62%** | **D** | 🔴 blocked | B1/B2 naming conflict; draft SoT created — **not approved** | Approve [`VENUE-DATA-MODEL.md`](../specs/venue-booking/VENUE-DATA-MODEL.md) → re-run verifier → migrate |
| **SAN-493 · EVT-034 — Seed Mamacita + 5 event partners** | Todo | **70%** | **C** | 🔴 blocked by 492 | Seeds into undefined tables | Gate on 492 + dedupe `venue_anchors` |
| **SAN-510 · EVT-051 — Wire: Event offerings panel + CTA** | Todo (Urgent) | **92%** | **A-** | 🟢 start now | `blockedBy SAN-492` over-constrains wire-only work | `relatedTo SAN-492`; VEB-W01 exists |
| **SAN-511 · EVT-052 — Wire: Request proposal modal** | Todo (Urgent) | **92%** | **A-** | 🟢 start now | Same as 510 | `relatedTo SAN-492`; VEB-W02 exists |
| **SAN-494 · EVT-035 — Restaurant card Event Venue CTA** | Todo | **72%** | **C** | 🔴 blocked by 492+493 | VEN-001 stub | Resolve 492/493; full spec |
| **SAN-495 · EVT-036 — Event offerings detail panel** | Todo | **70%** | **C** | 🔴 blocked by 510+494 | Reads absent tables | Resolve 492; promote VEN-002 |
| **SAN-496 · EVT-037 — Request proposal modal (HITL)** | Todo | **66%** | **D+** | 🔴 blocked by 511+494+495 | AC targets `event_venue_bookings` (absent) | Rewrite AC → `venue_booking_requests` + `booking_kind` |

Dots: 🟢 ready · 🟡 partial/risk · 🔴 blocker

---

## 3. Critical blockers

| # | Severity | Blocker | Evidence | Impact | Status |
|---|----------|---------|----------|--------|--------|
| **B1** | 🔴 P0 | Venue table naming/semantics conflict | Supabase MCP: `event_venues` EXISTS (7 rows, organizer-owned); `venues` ABSENT; VEB-001 ≠ Linear ≠ disk | Migration collision | 🟡 **Draft fix** in VENUE-DATA-MODEL |
| **B2** | 🔴 P0 | Booking table undecided | `venue_booking_requests` EXISTS (1 row, 3 RLS policies); `event_venue_bookings` ABSENT | SAN-496 HITL wrong target | 🟡 **Recommend reuse + extend** |
| ~~**B3**~~ | ~~🟡 P0~~ | ~~Phase A gate open~~ | PR #138 merged `9971bb8` | — | ✅ **Resolved** |
| **B4** | 🟡 | SAN-135 stale `blockedBy SAN-120` | SAN-120 = Backlog/post-mvp | False signal | ✅ **Removed** (Linear MCP 2026-06-08) |
| **B5** | 🟡 | VEB-001 "Disk reality" stale | Dated 2026-06-02; asserts greenfield `venues` | Wrong implementer path | Superseded by VENUE-DATA-MODEL |

---

## 4. SAN-492 schema audit (live DB)

**Project:** `zkwcbyxiwklihegjhuql` · probed 2026-06-08 via Supabase MCP

| Table | Exists | Rows | RLS | Domain |
|-------|:------:|-----:|:---:|--------|
| `event_venues` | ✅ | 7 | 2 policies | Roberto ticketed-event physical venue |
| `venue_booking_requests` | ✅ | 1 | 3 policies | Table/café booking spine |
| `restaurants` | ✅ | — | 6 policies | Dining discovery |
| `venue_anchors` | ✅ | — | — | Map/chat anchor seeds |
| `bookings` | ✅ | — | — | Generic booking (separate) |
| `venues` | ❌ | — | — | VEB-001 proposed — **do not create** |
| `partner_venues` | ❌ | — | — | **Recommended** in VENUE-DATA-MODEL |
| `venue_event_offerings` | ❌ | — | — | Safe to create post-approval |
| `venue_event_packages` | ❌ | — | — | Safe to create post-approval |
| `event_venue_bookings` | ❌ | — | — | **Do not create** — duplicate |

### `event_venues` columns (live)

`id`, `organizer_id`, `name`, `address`, `city`, `postal_code`, `country`, `latitude`, `longitude`, `capacity`, `notes`, `created_at`, `updated_at`

### `venue_booking_requests` columns (live)

`id`, `user_id`, `venue_kind`, `place_id`, `restaurant_id`, `venue_anchor_id`, `party_size`, `requested_at`, `contact_*`, `notes`, `status`, `source`, `idempotency_key`, `metadata`, timestamps

**Missing for event proposals (extend, don't fork):** `booking_kind`, `partner_venue_id`, `event_type`, `budget`

---

## 5. Correct implementation order

**Linear true dependency graph:**

```text
SAN-492 ─┬─> SAN-493 (seed) ──> SAN-494 (CTA) ──> SAN-495 (panel) ──> SAN-496 (HITL)
         ├─> SAN-510 (wire) ────────────────────────────────────────> (510 blocks 495)
         └─> SAN-511 (wire) ────────────────────────────────────────> (511 blocks 496)
```

**510/511 are parallel to 493** (all gated only by 492 for *code* — wires de-coupled).

**Approved next steps:**

```text
1. ✅ SAN-135 merged — Phase A gate closed
2. 🟢 SAN-510 + SAN-511 — start wireframe work (relatedTo 492)
3. 🟡 SAN-492 — approve VENUE-DATA-MODEL.md → pre-impl audit ≥80 → migration
4. SAN-493 → 494 → 495 → 496 (code chain)
```

---

## 6. SAN-492 readiness

| Criterion | Score | Notes |
|-----------|------:|-------|
| Spec SoT exists | 85 | VENUE-DATA-MODEL.md drafted |
| Naming resolved | 70 | Option B proposed — **not approved** |
| RLS plan | 80 | Per-table policies documented |
| Migration order | 85 | 5-step order + rollback |
| Test plan | 75 | RLS smoke + SCREEN-014 regression |
| Blockers cleared | 40 | B1/B2 open until approval |

**Readiness:** **78/100** — **NO-GO for migration SQL** · **GO for planning doc review**

**Verdict:** 🛑 **HOLD migration** until VENUE-DATA-MODEL approved and readiness ≥ 80

---

## 7. Production readiness

| Dimension | Verdict | Evidence |
|-----------|:-------:|----------|
| SAN-135 on main | 🟢 | `9971bb8` · Vitest 112/112 · SCREEN-014 5/5 · cubic clean |
| SAN-135 prod | 🟡 | Host/venue testids pending Vercel deploy |
| Venue chain code | 🔴 | 0% — no migration, no UI |
| Schema foundation | 🔴 | B1/B2 — draft SoT only |
| RLS (existing) | 🟢 | event_venues + venue_booking_requests enabled |

---

## 8. Next actions

1. **Optional:** Prod smoke SAN-135 after Vercel promotes `9971bb8`
2. **Start SAN-510 + SAN-511** — wire tasks (VEB-W01/W02 on disk)
3. **Review + approve** [`VENUE-DATA-MODEL.md`](../specs/venue-booking/VENUE-DATA-MODEL.md)
4. **Linear:** SAN-510/511 — ✅ relations verified (`blockedBy` empty, `relatedTo` 492); descriptions updated
5. **Re-run task-verifier** on SAN-492 post-approval → GO at ≥80 → then migration branch

---

## 9. Corrections applied (2026-06-08 revision)

Prior audit draft scored SAN-135 **B+ / 89%**, listed PR #138 as OPEN, and lacked a canonical schema doc. This revision incorporates user feedback + doc sync.

| Correction | Before | After | Verified in |
|------------|--------|-------|-------------|
| SAN-135 grade | B+ · 89–91% | **A · 95%** | [`changelog.md`](../changelog.md) · Linear **Done** · §11 |
| SAN-135 ship state | PR #138 OPEN, merge-pending | **Merged** `9971bb8` on `main` | `git log -1 main` |
| Phase A gate (B3) | Open | **Closed** | todo gate 5/5 · Linear SAN-135 Done · [`PHASE-A-GATE-AUDIT.md`](../../testing/evidence/2026-06-08/PHASE-A-GATE-AUDIT.md) |
| Schema SoT | Missing / VEB-001 only | **`VENUE-DATA-MODEL.md`** drafted | disk · [`EVT-033-schema.md`](../specs/venue-booking/EVT-033-schema.md) canonical pointer |
| SAN-510/511 readiness | 80% · blockedBy 492 | **92% · GO** (wire-only) | todo B.3/B.4 · audit §2 |
| todo blocker diagram | `492→493→510+511→494…` | **Linear-accurate** (510/511 ∥ 493) | todo § Blocker chain |
| SAN-492 Linear | Generic desc | Gate + Option B + link | Linear SAN-492 · §11 |
| SAN-510/511 Linear | blockedBy 492 | relatedTo 492 · GO 92% | Linear relations + desc · §11 |
| SAN-496 booking table | `event_venue_bookings` | `venue_booking_requests` | Linear desc updated · VENUE-DATA-MODEL |
| Platform readiness | — | **96/100** (Phase A closed) | todo § Current state |

### SAN-135 changelog dimension check

Weighted score from [`changelog.md`](../changelog.md) entry:

```text
0.25×95 + 0.25×95 + 0.20×94 + 0.20×94 + 0.10×95 = 94.6 → 95% (A) ✓
```

| Dimension | Changelog | Audit §2 |
|-----------|----------:|---------|
| Spec / AC | 95 | aligns |
| Tests | 95 | Vitest 112/112 · SCREEN-014 5/5 |
| Review | 94 | cubic clean · floor at merge |
| Runtime | 94 | localhost proof · prod optional |
| Process | 95 | PR merged · evidence filed |

### Cross-doc consistency matrix

| Field | Audit | Changelog | Todo | Match |
|-------|------:|----------:|-----:|:-----:|
| SAN-135 grade | A | A | A | ✅ |
| SAN-135 % correct | 95% | 95% | 95% | ✅ |
| SAN-135 SHA | 9971bb8 | 9971bb8 | 9971bb8 | ✅ |
| SAN-492 readiness | 78 | — | 78 | ✅ |
| SAN-510 readiness | 92 | — | 92 | ✅ |
| SAN-511 readiness | 92 | — | 92 | ✅ |
| VENUE-DATA-MODEL | referenced | — | linked | ✅ |
| Phase A status | closed | — | closed | ✅ |

### Outstanding (not blocking doc sync)

| Item | Status |
|------|--------|
| Prod smoke SAN-135 on mdeai.co | ⬜ pending Vercel deploy |
| Linear SAN-510/511 `blockedBy` removal | ✅ relations empty; descriptions updated |
| Linear SAN-135 user Done approval | ✅ Linear status Done · completedAt set |
| Linear SAN-135 stale `blockedBy SAN-120` | ✅ removed via MCP |
| VENUE-DATA-MODEL human approval | ⬜ draft — blocks migration |
| Changelog platform readiness line | ✅ updated to 96/100 |

---

## 11. Linear verification (2026-06-08 MCP)
 
Probed via `get_issue` + `save_issue` on project **Events Platform**.

| Issue | Status | Relations vs audit | Description / attachments | Verdict |
|-------|--------|-------------------|---------------------------|---------|
| **SAN-135** | **Done** · PR #138 attached | `blockedBy`: SAN-117 only (Done) · SAN-120 **removed** | Original spec desc | ✅ |
| **SAN-492** | Todo | `blocks` 493,494,513,514 · `relatedTo` 510,511,135 | Gate + Option B + VENUE-DATA-MODEL link | ✅ |
| **SAN-510** | Todo Urgent | `blockedBy`: **[]** · `relatedTo` 492 · `blocks` 495 | Readiness 92% GO · wire-only | ✅ fixed |
| **SAN-511** | Todo Urgent | `blockedBy`: **[]** · `relatedTo` 492 · `blocks` 496 | Readiness 92% GO · wire-only | ✅ fixed |
| **SAN-493** | Todo | `blockedBy` 492 · `blocks` 494 | Seed after schema | ✅ |
| **SAN-494** | Todo | `blockedBy` 492+493 · `blocks` 495,496 | CTA impl gated correctly | ✅ |
| **SAN-495** | Todo | `blockedBy` 510+494 · `blocks` 496 | Panel after wire+CTA | ✅ |
| **SAN-496** | Todo | `blockedBy` 511+494+495 | **Updated** → `venue_booking_requests` not `event_venue_bookings` | ✅ fixed |

### Dependency graph (Linear live)

```text
SAN-492 ─┬─> SAN-493 ──> SAN-494 ──┬─> SAN-495 ──> SAN-496
         │                         │
         ├─ relatedTo SAN-510 ─────┘ (510 blocks 495)
         └─ relatedTo SAN-511 ───────────────> (511 blocks 496)
```

**Matches** [`todo.md`](../todo.md) § Blocker chain and audit §5.

### Linear fixes applied this session

1. SAN-135 — `removeBlockedBy SAN-120` (post-mvp maps, descoped)
2. SAN-510/511 — descriptions: relatedTo not blocked; readiness 92% GO
3. SAN-496 — booking target aligned to VENUE-DATA-MODEL

### Remaining (non-Linear)

| Item | Status |
|------|--------|
| Prod smoke SAN-135 on mdeai.co | ⬜ post-deploy |
| VENUE-DATA-MODEL human approval | ⬜ blocks SAN-492 migration |

---

## 10. Final answer

- **SAN-135:** **95% (A)** — merged, tests green, evidence complete. Process-only: prod smoke.
- **SAN-492:** **NO-GO for code** — create/approve VENUE-DATA-MODEL first (done as draft).
- **SAN-510/511:** **92% — start now** (wireframes, no schema).
- **Venue chain code (493–496):** blocked until 492 migration lands.

### Claims verified (this revision)

- PR #138 **merged** `9971bb8` on `main` — `git log -1 main`
- SAN-135 **A · 95%** — matches [`changelog.md`](../changelog.md) weighted dimensions
- [`todo.md`](../todo.md) Phase A closed · SAN-135 row · 510/511 GO at 92
- [`VENUE-DATA-MODEL.md`](../specs/venue-booking/VENUE-DATA-MODEL.md) + [`EVT-033-schema.md`](../specs/venue-booking/EVT-033-schema.md) on disk
- `event_venues`, `venue_booking_requests` exist with RLS — Supabase MCP
- `venues`, `venue_event_offerings`, `event_venue_bookings` **absent**
- VEB-W01, VEB-W02 wire files exist on disk
- Linear SAN-492/510/511/496 descriptions + relations verified via MCP (§11)
- Linear SAN-135 **Done** · SAN-120 blocker removed

### Claims NOT verified

- Prod `/events/[slug]` host + venue testids post-merge deploy
