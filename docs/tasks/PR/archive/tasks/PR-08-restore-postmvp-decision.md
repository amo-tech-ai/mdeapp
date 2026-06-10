---
task_id: PR-08
title: restore_post_mvp_* Phase-1 scope decision (GATE for C1)
phase: HIGH
priority: P1
status: Done
archived: 2026-06-02
main_sha: 4de18f1
prod_sha: 4de18f1
area: data
skill: mde-supabase, mde-real-estate
source: docs/03-notes.md (#23 supersession — scope gate)
depends_on: []
data_spec: ../tasks-data/DATA-050-out-of-band-base-table-migrations.md
linear_issue: SAN-445
verified: 2026-06-01
main_sha: c9e54b8
spec_accuracy_pct: 100
audit_dot: green
blocks: [PR-04]
description: Decide whether the restore_post_mvp_* migrations belong in C1 or get deferred — this blocks PR-04's final scope.
---

## Summary

| Field | Value |
|-------|-------|
| Trigger | The DATA branch's migration set includes `restore_post_mvp_*` migrations re-adding post-MVP tables (trip planner, sponsor, whatsapp, landlord stack) |
| Why a gate | Their **timestamps precede** later migrations — if dropped from C1, every migration after them must be re-checked for dependency on the restored objects |
| Decision needed | **Keep in C1** (ship the full realigned timeline) **or defer** (cut a trimmed C1, park the post-MVP tables for a Phase-2 PR) |
| Linear | **SAN-445 (DATA-050, In Progress, gated)** already owns this — its B1 base tables (`landlord_profiles`, `landlord_inbox`, …) are **already authored** (`20260430140000_landlord_v1_base_tables.sql`); B3 covers orphan tables. The keep-vs-defer call must be made **with** SAN-445, not independently. |

## Problem

C1 (PR-04) can't be cut until we know whether the `restore_post_mvp_*` family is in or out. They sit **early** in the timeline, so removing them is not a tail-trim — it risks orphaning later migrations that reference those tables. This is a **scope + dependency** decision, not a code change, and it must resolve **before** PR-04 opens.

## Change (wiring)

| Layer | File | Action |
|-------|------|--------|
| Analysis | `supabase/migrations/*restore_post_mvp*` (on `data/DATA-048-migration-realign`) | Inspect — list every table/object they create |
| Analysis | all migrations *after* each `restore_post_mvp_*` timestamp | Grep — do any later migrations reference those objects (FK, ALTER, policy)? |
| Decision record | `tasks/PR/docs/08-restore-scope-decision.md` | Create — keep-vs-defer verdict + dependency evidence |

## Skill to use

- **`mde-supabase`** — read the migration bodies; map object creation → later references; judge whether a defer is even safe (a referenced table can't be deferred without also deferring its dependents).
- **`mde-real-estate`** — the landlord stack is real-estate domain; confirm whether Phase-1 rentals (Camila) need any restored table, or whether it's purely post-MVP (sponsor/trip-planner/whatsapp).

## Gates / Acceptance

- [ ] Every object created by a `restore_post_mvp_*` migration is enumerated.
- [ ] Forward-dependency scan complete: no later migration silently breaks if these are deferred (or, if they do, the dependents are listed and the defer is rejected).
- [ ] A written **keep-in-C1 vs defer** verdict exists with evidence (the decision record).
- [ ] Verdict cross-checked against Phase-1 persona needs (does **Camila**'s rental flow touch any restored table? If no → safe to defer).
- [ ] **No DB mutation** — read-only analysis (`SELECT`/migration-file reads only).

## Testing & proof

### Persona / journey

No end-user journey — **Sofía/Patricia** scope gate unblocks C1 migration train without shipping post-MVP product surfaces.

### Pre-ship (read-only)

```bash
cd mdeapp
rg restore_post_mvp supabase/migrations/ | head
# Forward-dependency scan: objects created → later migration references
test -f tasks/PR/docs/08-restore-scope-decision.md || test -f tasks/PR/NOTES/notes-5.md
```

### Implementation proof (Done · SAN-445 / DATA-050)

| Check | Evidence | Result |
|-------|----------|--------|
| Verdict | **Keep in C1** — B1–B4 authored + replay green | ✅ |
| B1–B3 prod repair | `migration repair --status applied` (history only) | ✅ |
| Blocks cleared | PR-04 opened with full timeline | ✅ |

**Evidence:** `tasks/data/evidence/DATA-050-base-table-backfill.md` · `tasks/PR/NOTES/notes-5.md`

## Risks / Notes

- **Coordinate with SAN-445 (DATA-050).** It's *In Progress* and explicitly **gated** ("human-approved only; authoring B2/B3/B4 + `supabase migration repair` must not auto-run"). Don't re-decide what it already scoped — read its B1–B4 plan first, then make the C1-vs-defer call jointly.
- **This blocks PR-04.** PR-04's "scope resolved" acceptance line points here. Do this first in the #23 chain.
- Default lean: **keep in C1** unless the dependency scan proves the post-MVP tables are fully isolated — a split timeline is the exact DATA-050 drift hazard the whole supersession exists to avoid.
- Persona: post-MVP tables back **future** flows (sponsor, trip planner, whatsapp, landlord) — none ship in Phase-1 Week-1, so the *product* cost of deferring is zero; the *migration-safety* cost may not be.
