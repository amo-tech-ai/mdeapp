---
task_id: PR-11
title: Close obsolete #19 (superseded by merged #32) + retire deferred #20
phase: MEDIUM
priority: P2
status: Done
archived: 2026-06-02
main_sha: 4de18f1
prod_sha: 4de18f1
area: process
skill: mde-worktree-pr-flow
source: docs/02-pr-audit.md (#20 stacked on #19) + Linear SAN-432 (UX-017, Canceled)
depends_on: []
linear_issue: SAN-432
github_pr: [19, 20, 32]
verified: 2026-06-01
main_sha: c9e54b8
spec_accuracy_pct: 100
audit_dot: green
not_the_same_as: SEARCH-002 / PR #38
description: #19's hybrid-search work already merged via #32; Linear already decided "do not rebase #19". Close #19 as obsolete and retire the [DEFERRED] #20 stacked on it.
---

> **CORRECTED 2026-06-01 after Linear cross-reference.** The original plan ("rebase #19 → main, merge, then #20") was **wrong** — it would re-land already-merged work. Verified facts below.

## Summary

| Field | Value |
|-------|-------|
| #19 | `feat/mis-rental-event-search` → base `feat/search-003-restaurants` (**not main**). OPEN, **`mergeable: CONFLICTING`** (2026-06-01). "SEARCH-001, INT-002 hybrid search". |
| #32 | `fix/search-001-002-clean` → main. **MERGED 2026-06-01 @ `3af7ea0`**. "SEARCH-001 rentals + SEARCH-002 events hybrid search" — the **clean replacement** for #19. |
| #20 | `feat/vec-embedding-cache` → base `feat/mis-rental-event-search` (stacked on #19). OPEN, title literally tagged **`[DEFERRED]`** (embedding registry + grounding verify). |
| Linear | **SAN-432 (UX-017) = Canceled** — body: *"Do **not** rebase, force-push, or merge #19. PR #19 is historical only."* Decision already made. |

## Problem

The audit framed #20/#19 as a stack to un-tangle by merging the base. That premise is dead: **#19's content is already in `main` via the merged #32**. Re-merging #19 duplicates merged code and creates conflicts. Linear's SAN-432 already adjudicated this ("#19 historical only; do not rebase/merge"). The correct action is cleanup: **close #19 as obsolete** (point at #32) and **retire #20** — it's `[DEFERRED]` *and* stacked on an obsolete base, so it can't cleanly rebase and shouldn't merge now.

## Change (wiring)

| Layer | File / Target | Action |
|-------|---------------|--------|
| GitHub | PR **#19** | **Close** (not merge) with a comment: superseded by merged #32 @ `3af7ea0`; cite SAN-432. Human-gated. |
| GitHub | PR **#20** | **Close** (or keep explicitly parked) — `[DEFERRED]`, stacked on obsolete #19. If embedding-cache is ever revived, **re-cut fresh off `main`**, not by reviving this stack. Human-gated. |
| Note (future) | `SUPABASE_SECRET_KEY` fallback (lived in #20) | Capture as a known concern for the *future* embedding-cache PR — fail-loud over silent service-role fallback. **Not actionable now** (no code revival in this task). |

## Skill to use

- **`mde-worktree-pr-flow`** — close-as-obsolete + supersede-comment pattern (same shape as PR-09 for #23). **No rebase, no force-push, no merge** of #19/#20.

## Gates / Acceptance

- [ ] Re-confirm at execution (`gh pr view 19 20 32 --repo amo-tech-ai/mdeapp`): #32 still merged, #19/#20 still open.
- [ ] #19 **closed** with a supersede comment linking #32 and SAN-432 (never rebased/merged).
- [ ] #20 **closed or explicitly parked** with a note that revival = fresh branch off `main`.
- [ ] **No force-push, no rebase** of either branch (PR-recovery + SAN-432 rule).
- [ ] **Human go** obtained before closing each PR (shared-state action).

## Testing & proof

### Persona / journey

**Camila** — hybrid rental/event search already on `main` via #32. This task is **board hygiene only** — no code path change.

### Pre-ship (verify search still works after close)

```bash
cd mdeapp
gh pr view 19 20 32 --repo amo-tech-ai/mdeapp --json state,mergedAt,mergeable
# Confirm #32 merged; #19/#20 still open before close
PROD_SMOKE_BASE_URL=https://www.mdeai.co PW_SKIP_WEBSERVER=1 npm run test:e2e:prod-synthetic
npm test -- --run src/mastra/tools
```

**Pass criteria:** prod synthetic rentals + events cards > 0; #19 closed with supersede comment citing #32 @ `3af7ea0` + SAN-432.

**Evidence artifact:** `tasks/testing/evidence/PR-11-close-19-20.md` — `gh pr view` output + supersede comment URL.

## Risks / Notes

- **This corrects a duplication the original plan would have caused.** Rebasing #19 was the exact thing Linear flagged "do not do."
- The remaining real search work is tracked elsewhere: **SAN-387 (SEARCH-002)** is *In Review* — leave it; this task does **not** touch it.
- Human-gated + no-force-push both apply. Mirror PR-09's close-and-supersede flow.
- Persona: **Sofía** (dev) — open obsolete PRs rot the board; closing them with a pointer to #32 keeps the PR list honest. No persona-facing code change.
