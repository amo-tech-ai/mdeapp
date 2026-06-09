---
task_id: PR-16
title: Make floor + 1 review a main branch-protection gate
phase: HIGH
priority: P1
status: In Progress
area: process
skill: testing, mde-vercel
source: docs/02-pr-audit.md (process hardening)
depends_on: []
verified: 2026-06-01
main_sha: 330f47e
spec_accuracy_pct: 100
audit_dot: green
note: floor may fail on generated supabase types until lint scope fixed — gate still valid
description: Add a GitHub branch-protection rule requiring /verify-floor (5 gates) + 1 review before any merge to main.
---

## Summary

| Field | Value |
|-------|-------|
| Root cause | The audit found PRs (#32, #30, #20) **merged with no floor and review skipped** — debt landed because nothing blocked it |
| Fix | A `main` branch-protection rule: required status check = floor (lint·typecheck·build·test·audit) + ≥1 approving review |
| Nature | **GitHub repo setting** (user/admin action) + a CI workflow that runs the floor on every PR |

## Problem

Floor (`/verify-floor`: lint, typecheck, build, test, audit) and code review are only as good as their enforcement. Several merged PRs skipped both, which is exactly how the live debt in Wave 1 got in. Make the floor a **required CI check** and require **1 review** so `main` can't take an unverified merge — this is the single change that would have prevented most of the audit's findings.

## Change (wiring)

| Layer | File | Action |
|-------|------|--------|
| CI | `.github/workflows/floor.yml` (new or existing PR workflow) | Add — run lint·typecheck·build·test·`npm run audit` on every PR, as a named status check |
| GitHub | `main` branch protection | Configure (**user/admin**) — require the floor check + ≥1 approving review + up-to-date-before-merge |
| Docs | `tasks/PR/docs/16-branch-protection.md` | Record the exact required-check names + settings applied |

## Skill to use

- **`testing`** — the five floor gates and how to express them as a single reliable CI status check (deterministic, no stale-server false-fails).
- **`mde-vercel`** — CI/PR-check wiring on the GitHub+Vercel setup; how the required check name must match the workflow job.

## Gates / Acceptance

- [x] Floor workflow runs on `pull_request` to `main` and reports a stable status-check name (`floor.yml` → **`Floor / floor`**).
- [ ] `main` branch protection requires: that floor check **+** ≥1 review **+** branch up-to-date before merge.
- [ ] A trial PR with a deliberately failing gate is **blocked** from merging (proves enforcement).
- [ ] Required-check names + settings recorded in the decision doc (so the config is reproducible).
- [ ] No admin-only bypass left enabled for non-admins.

## Testing & proof

### Persona / journey

**Sofía/Lucía** — unverified code cannot merge to `main` (would have blocked #32/#30 debt).

### Pre-ship

```bash
cd mdeapp
# Author workflow first
test -f .github/workflows/floor.yml || test -f .github/workflows/ci.yml
npm run floor   # local baseline green @ a9eb176
# Trial: open PR with intentional lint failure → merge blocked
gh api repos/amo-tech-ai/mdeapp/branches/main/protection 2>&1 | jq .
```

**Pass criteria:**

1. Floor workflow reports stable check name on every PR to `main`.
2. Branch protection requires floor check + ≥1 review.
3. Trial failing PR is **blocked** from merge.
4. Settings recorded in `tasks/PR/docs/16-branch-protection.md`.

**Evidence artifact:** `tasks/testing/evidence/PR-16-branch-protection.md` — required check names + trial PR screenshot.

## Risks / Notes

- **The branch-protection toggle is a GitHub admin/UI action — the user must apply it** (Claude can author the workflow + the exact settings list, not flip the org setting). Call this out explicitly when shipping.
- This is the highest-leverage Wave-5 task — it's the gate that would have caught #32/#30/#20. Prioritize within process-hardening.
- Persona: **Sofía** (dev) + **Lucía** (QA) — turns "please remember to run floor" into "main physically won't take unverified code."
