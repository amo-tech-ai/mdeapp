---
title: Commit Split — INDEX (June 4, 2026)
branch: docs/venues-index-canonical-order
remote: github.com/amo-tech-ai/mdeai
plan: ./COMMIT-PLAN.md
status: finish line — Slices 1–7 in branch history; one small uncommitted docs commit + PR left
---

# Commit Split — INDEX (June 4, 2026)

Break the dirty working tree into focused commits. **No `git add -A`. Explicit paths only. Run `git diff --cached --name-only` before every commit.**

Rule: **one concern = one commit = one PR.**
Dots: 🟢 safe/ready · 🟡 review · 🟠 risky · 🔴 blocked

## Slice table

| # | Commit | Scope (paths) | Files | Type | Indep. of `main`? | Status | Dot |
|---|---|---|---:|---|---|---|---|
| 1 | `chore: gitignore + untrack .obsidian` | `.gitignore`, `git rm --cached docs/.obsidian` | 5 | hygiene | yes | ✅ committed `6b81fdf` | 🟢 |
| 2 | `docs(venues): SAN-491 nightlife + SCREEN-022` | evidence + `INDEX-VENUE.md`, `sitemap.md` | 4 | docs | **no** (builds on 10 prior commits) | ✅ `e037ed0` pushed | 🟢 |
| 3 | `chore(docs): relocate plan/ → docs/plan/` | `plan/**` (del) + `docs/plan/**` (add) | 494 del + 438 add | pure move (byte-identical) | yes | ✅ `bc2cbf3` | 🟢 |
| 4 | `docs(tasks): import task library` | rest of `tasks/**` (venues backlog, contest, ux, data, revenue, PR, notes) | ~721 new + ~270 mod | docs | partly | ✅ `e5ef969` (+ related) | 🟢 |
| 5 | `chore(mcp): config + wrapper scripts` | `.mcp.json`, `scripts/mcp-copilotkit.sh`, `scripts/mcp-chatwoot.sh`, `CLAUDE.md` | 4 | config | yes | ✅ `f25ef39` | 🟢 |
| 6 | `chore(scripts): remove one-shot linear scripts` | `scripts/` deletions only | 29 | cleanup | yes | ✅ `2e38245` | 🟢 |
| 7 | `docs(process): commit plan + CONVENTIONS.md` | `tasks/commit/june-4/**`, `tasks/CONVENTIONS.md` | ~4 | process | yes | ✅ `e3a60a2` (tail docs → see `next-steps.md`) | 🟢 |

Leftover root files to route per-slice (do **not** sweep blindly): `DESIGN.MD`, `plan.md`, `linear.md`, `linear-reference.md`, `README.md`, `changelog`, `index-skills.md`, `skills-lock.json`, `tasks.md`, `todo.md`.

## Never commit (already handled in Slice 1)

| Item | Size | Status |
|---|---|---|
| `.worktrees/` | ~3 GB | 🟢 `.gitignore`-blocked |
| `github` symlink | — | 🟢 `.gitignore`-blocked |
| `.env*` / secrets | — | 🟢 not in this repo (live under gitignored `mdeapp/`) |

## Why this is NOT a clean 6-way main split

1. **Branch is 10 commits ahead of `main`.** SAN-491's uncommitted edits modify files those commits created → **Slice 2 can't be a standalone main-based PR** without them.
2. **Independent of history (can be separate main-based PRs):** Slices 3, 5, 6.
3. **Root repo = docs/specs only.** App code lives in the separate, gitignored `mdeapp/` repo → **lint / typecheck / build / Playwright / Vercel do not apply** to these commits. Run that gauntlet on `mdeapp/` branches, not here.

## Recommended PR strategy

- **Option A (simplest):** push this branch with Slices 1–7 as clean commits → one reviewable docs PR.
- **Option B (more PRs):** cherry-pick independent Slices 3, 5, 6 onto fresh `main`-based branches; keep Slices 2 + 4 on this branch (they depend on its history).

## Checklist

- [x] Slice 1 — gitignore + untrack obsidian (`6b81fdf`)
- [x] Slice 2 — SAN-491 nightlife (`e037ed0` + prior)
- [x] Slice 3 — plan → docs/plan (`bc2cbf3`)
- [x] Slice 4 — task library import (`e5ef969` et al.)
- [x] Slice 5 — mcp config + scripts (`f25ef39`)
- [x] Slice 6 — script deletions (`2e38245`)
- [x] Slice 7 — process docs (`e3a60a2`); **tail:** `next-steps.md`, worktrees, 007 spec edits — see [`next-steps.md`](next-steps.md)
- [ ] Final small commit + push + PR
- [ ] Final audit report (optional)

> Sibling files in this folder: `COMMIT-PLAN.md` (the how), `index-june4.md` (duplicate of this table — both are populated on disk).
