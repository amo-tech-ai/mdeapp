---
task_id: PR-14
title: Relocate/remove nested .wt-wave1-pr-* worktrees
phase: MEDIUM
priority: P2
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
description: Inspect and relocate the nested .wt-wave1-pr-a/b/c worktrees out of mdeapp/ after confirming no in-progress work.
---

## Summary

| Field | Value |
|-------|-------|
| Finding | Nested git worktrees `.wt-wave1-pr-a/`, `.wt-wave1-pr-b/`, `.wt-wave1-pr-c/` live **inside** the repo (under `mdeapp/`) |
| Risk | Nested worktrees confuse tooling (globs, builds, scans), can double-count files, and may hide uncommitted work |
| Fix | Inspect each → relocate outside the repo (or `git worktree remove`) **only after** confirming it holds no in-progress work |

## Problem

Worktrees nested inside the main tree are a footgun: `npm run build`, skill scans, and `git status` can pick up the nested copies; an agent can silently `cd` into one. Clean them up — but **inspect-before-remove**: a worktree may carry uncommitted changes that are someone's live work.

## Change (wiring)

| Layer | Action |
|-------|--------|
| Inspect | for each `.wt-wave1-pr-{a,b,c}`: `git -C <wt> status` + `git -C <wt> log --oneline main..HEAD` — uncommitted? unpushed commits? |
| Preserve | any uncommitted/unpushed work → commit to its branch or push **before** removal (never discard) |
| Relocate | move worktrees **outside** `mdeapp/` (e.g. a sibling `../.worktrees/`) or `git worktree remove <wt>` if confirmed empty/merged |
| Verify | `git worktree list` clean; `git worktree prune` to clear stale admin entries |

## Skill to use

- **`mde-worktree-pr-flow`** — correct worktree placement (outside the scanned tree); safe `worktree remove`/`prune` sequence.

## Gates / Acceptance

- [x] Each `.wt-wave1-pr-*` inspected: wave-1 merged (#35–#37); commits preserved on `main`.
- [x] `.wt-ux-020` relocated to `/home/sk/mdeai/.worktrees/wt-ux-020` (UX-020 in progress @ `861070b`).
- [x] Worktrees no longer nested under `mdeapp/`; `git worktree list` clean.
- [x] `git worktree prune` run.
- [ ] No change to tracked source — this is filesystem/worktree hygiene only.

## Testing & proof

### Persona / journey

**Sofía** — trustworthy `npm run build`, glob scans, and agent cwd (no nested duplicate trees).

### Pre-ship / verify

```bash
cd mdeapp
git worktree list                    # no paths under mdeapp/.wt-*
test ! -d .wt-wave1-pr-a
test -d /home/sk/mdeai/.worktrees/wt-ux-020 || echo "UX-020 worktree optional"
git worktree prune
npm run floor   # unchanged — hygiene only
```

### Implementation proof (Done)

| Check | Evidence | Result |
|-------|----------|--------|
| Nested wave-1 worktrees removed | `.wt-wave1-pr-{a,b,c}` gone from `mdeapp/` | ✅ |
| UX-020 relocated | `/home/sk/mdeai/.worktrees/wt-ux-020` | ✅ |
| `git worktree list` clean | no nested entries | ✅ |

**Evidence:** `tasks/PR/INDEX.md` Wave 4 · SAN-447 adjacent cleanup

## Risks / Notes

- **Agent-branch-safety / inspect-before-delete** is the whole point — a nested worktree can be holding live work. Default to relocate/preserve over remove.
- Pairs with **PR-13** (both clean the messy working tree); can run right after it.
- Persona: **Sofía** (dev) — nested worktrees corrupt local build/scan signal; this restores a trustworthy tree.
