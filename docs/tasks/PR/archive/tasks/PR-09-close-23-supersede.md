---
task_id: PR-09
title: Close #23 with supersede comment linking C1–C4
phase: MEDIUM
priority: P2
status: Done
archived: 2026-06-02
main_sha: 4de18f1
prod_sha: 4de18f1
area: process
skill: mde-worktree-pr-flow
source: docs/03-notes.md (#23 supersession — close)
depends_on: [PR-05, PR-06, PR-07]
github_pr: 23
verified: 2026-06-01
main_sha: c9e54b8
spec_accuracy_pct: 100
audit_dot: green
human_gate: required before gh pr close
description: After C1–C4 land, close #23 with a comment mapping every extracted file to its replacement PR. Human-gated.
---

## Summary

| Field | Value |
|-------|-------|
| Action | Close PR **#23** (`feat/supabase-track-migrations`, +21423/-9, 100 files) — **do not merge** |
| Precondition | C1 (PR-04), C2 (PR-05), C3 (PR-06), C4 (PR-07) all merged — **every file in #23 must exist elsewhere first** |
| Artifact | A supersede comment on #23 mapping each of the 100 files → the PR that now carries it |

## Problem

#23 is the only home for 26 files (edge fns, seeds, rollbacks) but bundles them with a stale, collision-carrying migration set that the DATA branch already superseded. Once C1–C4 have re-homed every still-needed file, #23 has nothing unique left — close it with a traceable comment so no reviewer ever wonders where its contents went.

## Change (wiring)

| Layer | File | Action |
|-------|------|--------|
| Verify | the 100 files of #23 | Audit — each maps to C1/C2/C3/C4 (or is intentionally dropped, e.g. the colliding `20260520120000` migration) |
| GitHub | PR #23 | Comment (supersede map) → **close** (not merge) |
| Tracking | `tasks/PR/INDEX.md` | Update — mark #23 closed, link the 4 replacement PRs |

## Skill to use

- **`mde-worktree-pr-flow`** — supersede-via-clean-extraction pattern; the comment-then-close (never force-merge) discipline.

## Gates / Acceptance

- [ ] **Coverage proof:** every file in #23 is accounted for — landed in C1–C4 **or** explicitly listed as intentionally dropped (with reason). No file silently lost.
- [ ] C1, C2, C3, C4 are **merged** (not just open) before #23 closes.
- [ ] Supersede comment posted: file → replacement-PR table + the "dropped: colliding migration" note.
- [ ] **Human go** obtained before closing (shared-state action — no auto-close).
- [ ] #23 **closed**, never merged (its migration set is the P0 collision we're escaping).

## Testing & proof

### Persona / journey

Process-only — **Sofía** audit trail so no engineer re-opens #23's unsafe migration bundle.

### Pre-ship (before close)

```bash
cd mdeapp
gh pr view 23 --json state,files
# Every #23 file must exist on main via #40–#44 or be listed as intentionally dropped
git ls-tree -r origin/main --name-only supabase/ | wc -l
gh pr list --state merged --search "supabase" --limit 10
```

### Implementation proof (Done)

| Check | Evidence | Result |
|-------|----------|--------|
| C1–C4 merged | #40, #42, #43, #44 | ✅ |
| #23 closed | GitHub issue state | ✅ superseded |
| INDEX updated | `tasks/PR/INDEX.md` Wave 2 | ✅ |

**Evidence:** `tasks/PR/INDEX.md` · `tasks/PR/NOTES/notes-5.md`

## Risks / Notes

- **Human-gated.** Closing a PR is visible shared-state — confirm with the user immediately before the `gh pr close`.
- **No force-push, no merge of #23.** The whole point is that #23's migration timeline is unsafe; merging it re-introduces the collision.
- Order: this is the **last** step of the #23 chain. If any of C1–C4 is still open, stop.
- Persona: this is **Sofía** (dev) hygiene — a clean, auditable supersession so the next engineer trusts the schema history in git.
