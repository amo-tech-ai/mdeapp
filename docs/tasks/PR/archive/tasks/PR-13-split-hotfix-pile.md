---
task_id: PR-13
title: Split uncommitted hotfix/g2d pile into clean PRs
phase: HIGH
priority: P1
status: Done
archived: 2026-06-02
main_sha: 4de18f1
prod_sha: 4de18f1
area: process
skill: mde-worktree-pr-flow
source: docs/01-33pr-notes.md
depends_on: []
verified: 2026-06-01
main_sha: c9e54b8
spec_accuracy_pct: 100
audit_dot: green
execution_order: 0
linear_issue: SAN-447
description: Triage the 4 uncommitted workstreams on hotfix/g2d-cafe-fast-path; diff each against main (much already merged), split survivors into clean PRs off fresh main.
---

## Summary

| Field | Value |
|-------|-------|
| Branch | `hotfix/g2d-cafe-fast-path` — **stale** (0 ahead, **6 behind** `origin/main`; named cafe work merged as **#33**) |
| Problem | Uncommitted pile on a dead branch misleads status; blocks trustworthy new branches from primary tree |
| Workstreams | (a) restaurant place-photo, (b) concierge chat UI, (c) prod-synthetic-smoke + CI, (d) stray landlord migration |
| Post–#35–#37 expectation | Triage still mandatory; outcome is **mostly discard**, not four new PRs — see [evidence](../evidence/PR-13-triage-2026-06-01.md) |
| First move | **Diff each path vs `origin/main`** — wave-1 likely already landed; extract only genuine deltas |

## Problem

The primary working tree carries four tangled, uncommitted efforts on a branch whose original purpose is already merged. Before writing a single new PR from here, triage against **`origin/main` @ `c9e54b8`** (or newer): wave-1 merged **#35** (photos), **#36** (new chat), **#37** (prod synthetic). As of 2026-06-01, workstreams **(a)(b)(c) are byte-identical or script-reorder noise vs `main`** — **discard**, do not open PRs. **(d)** landlord migration remains the only PR-13 extract candidate, gated by **PR-08** / SAN-445. Any still-needed extract is **one branch off fresh `main`, one PR** (never one mega-commit from the hotfix tree).

### Post–#35–#37 triage expectations (2026-06-01)

| Workstream | Expected vs `main` | Action |
|------------|-------------------|--------|
| (a) restaurant photos | On `main` via #35 | Discard local copies |
| (b) concierge / new chat | On `main` via #36 | Discard dirty-only-on-hotfix-HEAD |
| (c) prod-synthetic + CI | On `main` via #37 | Discard older untracked workflow copies |
| (d) landlord migration | **Not** on `main` | Preserve SQL → PR-08 decision → optional `feat/landlord-v1-base` |
| Extras | `VISUAL_EVIDENCE_DIR` in visual e2e; `package.json` script order | Optional tiny chore or drop |
| Nested `.wt-*` | Pollution | **PR-14**, not PR-13 |
| Untracked `supabase/` tree | Overlaps **#23 / PR-05** | Do not `git add -A`; separate DATA train |
| `scripts/smoke-adk-grounding.mjs` | Phase-2 leak risk | **PR-15** |

Executed checklist: [`../evidence/PR-13-triage-2026-06-01.md`](../evidence/PR-13-triage-2026-06-01.md).

## Change (wiring)

| Layer | Action |
|-------|--------|
| Triage | `git diff main -- <path>` for each uncommitted file — classify: **already-in-main** (discard), **superseded-by-open-PR** (drop, note the PR), **still-needed** (extract) |
| (a) restaurant place-photo | If still-needed → own branch off `main` → own PR (Tourist photo enrichment) |
| (b) concierge chat UI | If still-needed → own branch → own PR; cross-check vs #38 (events fast-path UI) for overlap |
| (c) prod-synthetic-smoke + CI | Cross-check vs #37; extract only the delta not already merged |
| (d) landlord migration | **Own PR**, must include RLS + ≥1 policy; coordinate with PR-08 scope decision (post-MVP landlord stack) |
| Branch | leave `hotfix/g2d-cafe-fast-path` untouched until its content is re-homed; **do not delete** uninspected |

## Skill to use

- **`mde-worktree-pr-flow`** — one-workstream-one-PR extraction off fresh `main`; never PR from the stale hotfix tree directly.

## Gates / Acceptance

- [x] Every uncommitted file classified: already-merged / superseded-by-open-PR / still-needed — [evidence](../evidence/PR-13-triage-2026-06-01.md) @ 2026-06-01.
- [x] Each **still-needed** workstream becomes its own branch off latest `main` → its own PR (no mixed PRs). *(Only (d) landlord remains; blocked on PR-08 / DATA-050 — SQL preserved.)*
- [ ] The landlord migration PR has RLS + ≥1 policy and is reconciled with **PR-08**'s post-MVP scope call.
- [x] No still-needed change silently discarded; no already-merged change re-introduced.
- [x] Primary tree on `main` @ `c9e54b8`; hotfix pile triaged 2026-06-01.
- [ ] Retire `hotfix/g2d-cafe-fast-path` remote branch — optional after user confirms no local refs.
- [ ] `/verify-floor` green on each extracted PR.

## Testing & proof

### Persona / journey

Process triage — protects **Camila/Tourist/Sofía** from re-landing already-merged UX (#35–#37) or losing landlord SQL.

### Pre-ship (triage replay)

```bash
cd mdeapp
git fetch origin main
git diff origin/main -- <each uncommitted path>   # classify: discard | extract
test -f tasks/PR/evidence/PR-13-triage-2026-06-01.md
git worktree list   # no nested .wt-* under mdeapp/ (→ PR-14)
```

### Implementation proof (Done · SAN-447)

| Workstream | vs `main` | Action |
|------------|-----------|--------|
| (a) restaurant photos | #35 merged | discard |
| (b) new chat UI | #36 merged | discard |
| (c) prod synthetic | #37 merged | discard |
| (d) landlord migration | not on `main` | preserved → DATA-050 / PR-04 |

**Evidence:** [`tasks/PR/evidence/PR-13-triage-2026-06-01.md`](../evidence/PR-13-triage-2026-06-01.md)

## Risks / Notes

- **Do this first** (per execution order) — the messy tree blocks trustworthy new PRs from this workspace.
- **Agent-branch-safety:** this is the shared primary working tree — commit/stash or isolate before any agent touches it; don't let a spawned agent switch the branch out from under uncommitted work.
- **Don't delete uninspected** — uncommitted piles can hide the user's in-progress work; classify before discarding.
- Possible ADK Phase-2 leak (`scripts/smoke-adk-grounding.mjs`) is handled separately in **PR-15** — flag if it surfaces here.
- Personas: (a) **Tourist** photos, (b) **Camila/Tourist** chat UI, (c) **Sofía/Lucía** CI smoke, (d) **landlord** post-MVP (likely defer per PR-08).
