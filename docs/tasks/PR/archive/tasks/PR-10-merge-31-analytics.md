---
task_id: PR-10
title: #31 mark ready + merge (Vercel analytics)
phase: MEDIUM
priority: P2
status: Done
archived: 2026-06-02
main_sha: 4de18f1
prod_sha: 4de18f1
area: frontend
skill: mde-vercel
source: docs/02-pr-audit.md (#31)
depends_on: []
github_pr: 31
verified: 2026-06-01
main_sha: c9e54b8
spec_accuracy_pct: 100
audit_dot: green
human_gate: merge
description: Take #31 (Vercel Analytics) out of draft, verify it's clean, human-merge.
---

## Summary

| Field | Value |
|-------|-------|
| PR | **#31** — adds `@vercel/analytics@2.0.1`, mounts `<Analytics/>` at `layout.tsx:49` |
| State | OPEN **draft** — small, low-risk, but parked |
| Action | Re-verify against latest `main`, mark ready, **human-merge** |

## Problem

#31 is a tiny, self-contained analytics PR sitting in draft. The audit flagged it as safe-to-land. Before merging: confirm it still applies cleanly on current `main` (the merge train has moved — #34/#36/#37 landed since), the dep version is current, and the mount point is correct.

## Change (wiring)

| Layer | File | Action |
|-------|------|--------|
| Verify | PR #31 diff vs latest `main` | Re-check — clean apply, no conflict, `<Analytics/>` still belongs at `layout.tsx:49` |
| Dep | `@vercel/analytics@2.0.1` | Confirm — current major, no advisory (`npm audit`) |
| GitHub | PR #31 | Mark ready → **human-merge** |

## Skill to use

- **`mde-vercel`** — Vercel Analytics wiring (App-Router `<Analytics/>` placement, env/project binding); confirm it doesn't need a Vercel-side toggle to actually collect.

## Gates / Acceptance

- [ ] `@vercel/analytics` pinned, no high/critical advisory.
- [ ] `<Analytics/>` mounted once, in the root layout, below `<body>` children (App-Router pattern).
- [ ] Clean rebase on latest `main` (no conflict with post-audit merges).
- [ ] `/verify-floor` green on the rebased branch.
- [ ] **Human go** before merge (no auto-merge).

## Testing & proof

### Persona / journey

**Patricia** (ops) — page-traffic in Vercel dashboard after `<Analytics/>` mount. No chat/agent/map journey.

### Pre-ship

```bash
cd mdeapp
gh pr view 31 --json mergeable,files,state
git fetch origin pull/31/head:pr-31-test && git diff origin/main...pr-31-test --stat
npm run floor   # on rebased branch
npm run build
# Preview: load / — Network tab shows vercel/analytics script (no console errors)
```

**Pass criteria:** single `<Analytics/>` in root layout; `@vercel/analytics` no high/critical advisory; floor green.

**Evidence artifact (on merge):** `tasks/testing/evidence/PR-10-vercel-analytics.md` — preview URL + Vercel dashboard screenshot.

## Risks / Notes

- Low risk, but **human-merge** — it's a shared-state action and the user holds the merge gate.
- Re-verify the PR number/state at execution (`gh pr view 31`) — draft PRs can change.
- Persona: analytics is **Patricia** (ops/admin) visibility — page-traffic signal for the dashboards, not a persona-facing UI change.
