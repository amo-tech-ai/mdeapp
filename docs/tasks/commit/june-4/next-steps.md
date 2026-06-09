# Next steps — finish June 4 commits (easy guide)

**You are here:** Planning repo `/home/sk/mdeai`, branch `docs/venues-index-canonical-order`.

**Good news:** The big June-4 work is **already committed** on this branch (20 commits ahead of `main`): gitignore, plan move, task import, MCP, scripts, SAN-491 evidence, and more. See `git log main..HEAD`.

**What’s left:** A small pile of **uncommitted** files (~18 lines). Finish that, push, open one PR. App code is a **separate** step.

---

## Two repos — don’t mix them

| Repo | Folder | What you commit |
|------|--------|-----------------|
| **Planning** | `/home/sk/mdeai` | Docs, tasks, sitemap, commit plans — **this guide** |
| **App** | `wt-main-clean` → `/home/sk/mde-wt-search-clean` | TypeScript in `src/` — **only when you build new features** |

**Production app (nightlife + restaurants already shipped):** open **`wt-main-clean`** — that *is* `main` @ `ae9a1e6`. Nothing more to commit there unless you add new code.

---

## Step 1 — One last planning commit (≈10 minutes)

Goal: commit the leftover docs **without** local symlink junk.

### A. Stage only real docs (copy/paste)

From `/home/sk/mdeai`:

```bash
cd /home/sk/mdeai

git add \
  tasks/commit/june-4/next-steps.md \
  tasks/commit/june-4/worktrees.md \
  tasks/commit/june-4/feature-tree-main-clean.md \
  tasks/commit/june-4/COMMIT-PLAN.md \
  tasks/venues/tasks/mvp/007-scr-nightlife-listings-map.md \
  tasks/venues/tasks/mvp/007-wire-nightlife-listings-map.md \
  tasks/venues/tasks/mvp/007a-ven-nightlife-grounding-intent.md \
  tasks/venues/tasks/mvp/007b-ven-grounded-kind-split.md \
  tasks/venues/tasks/mvp/07c-ven-nightlife-detail-panel.md \
  tasks/notes/june4/06-san-491-nightlife-summary.md \
  tasks/notes/june4/07-worktree-organization-v040.md \
  tasks/notes/june4/08-worktree-paths-visible.md \
  skills-lock.json
```

Optional (only if you want workspace file in git):

```bash
# git add mdeai-worktrees.code-workspace
```

### B. Safety check (must print nothing)

```bash
git diff --cached --name-only | grep -E '\.worktrees/|^github|wt-main-clean|wt-san521|worktrees-all|wt-visibility' && echo "STOP" || echo "OK to commit"
```

### C. Commit

```bash
git commit -m "$(cat <<'EOF'
docs(june-4): worktree map, feature tree, MVP spec status, SAN-491 notes

- Add next-steps, worktrees.md, feature-tree-main-clean.md
- Sync 007/007a/007b/07c frontmatter after SAN-491 merge
EOF
)"
```

### D. Do **not** commit these (local helpers only)

- `wt-main-clean`, `wt-san521`, `worktrees-all`, `wt-visibility/` — symlinks for Cursor; stay untracked.

If they keep showing up in `git status`, add to `.gitignore` later:

```text
/wt-main-clean
/wt-san521
/worktrees-all
/wt-visibility/
```

---

## Step 2 — Push and open the docs PR

```bash
cd /home/sk/mdeai
git push -u origin docs/venues-index-canonical-order
gh pr create --base main --title "docs: June 4 planning corpus + venue index (venues branch)" --body "$(cat <<'EOF'
## Summary
- Planning/docs backlog: plan→docs/plan, task library, MCP, commit hygiene
- SAN-491 venue evidence + MVP spec status updates
- Worktree + feature-tree docs for operators

## Test plan
- [ ] No `.worktrees/` or `github` in diff
- [ ] Markdown links sane
- [ ] No `mdeapp/src/**` (docs-only PR)
EOF
)"
```

**Merge strategy:** One PR for this branch is fine (Option A in `INDEX.md`). You do **not** need to re-do slices 3–6 — they’re already in the 20 commits.

---

## Step 3 — Update the checklist (30 seconds)

In [`INDEX.md`](INDEX.md), mark slices 3–7 done and check “Push + PR”. (INDEX was written before those commits landed.)

---

## Step 4 — App work (after docs PR, separate)

Only if you still want **007a nightlife `intent`** on the grounded-places tool:

| Do | Where |
|----|--------|
| 1. Stash WIP | `/home/sk/mdeai/mdeapp` (stale SAN-491 checkout) |
| 2. New branch off `main` | `/home/sk/mde-wt-search-clean` (`wt-main-clean`) |
| 3. Pop stash, test, commit, PR | `ai/san-294-…` or similar |

```bash
git -C /home/sk/mdeai/mdeapp stash push -m "007a intent" -- \
  src/mastra/tools/search-grounded-places.ts \
  src/mastra/tools/__tests__/search-grounded-places-fallback.test.ts \
  src/mastra/tools/__tests__/search-grounded-places-quality.test.ts

cd /home/sk/mde-wt-search-clean
git pull origin main
git switch -c ai/san-294-nightlife-grounding-intent
git stash pop
# npm test, commit, push, PR
```

Other app branches (when ready):

| Worktree | When |
|----------|------|
| `wt-san521` | SAN-521 mobile composer PR |
| `worktrees-all/wt-ux-020` | Maps API key warn PR |
| `.wt-ux-003-night-parser` | Only if test change still needed |

---

## Step 5 — Optional cleanup

```bash
# Remove dead worktree registration
git -C /home/sk/mdeai/mdeapp worktree prune

# Point primary mdeapp at main (after 007a moved)
cd /home/sk/mde-wt-search-clean
git -C /home/sk/mdeai/mdeapp fetch origin
git -C /home/sk/mdeai/mdeapp switch main   # only if nothing left uncommitted
git -C /home/sk/mdeai/mdeapp pull
```

---

## “Am I done?” checklist

| Done when… |
|------------|
| ✅ `git status` clean on `/home/sk/mdeai` (except optional symlinks) |
| ✅ Docs PR open or merged |
| ✅ `wt-main-clean` still on `main` — prod matches Vercel |
| ⏳ 007a / SAN-521 / ux-020 — separate app PRs if still in progress |

---

## Where to read more

| Doc | Purpose |
|-----|---------|
| [`worktrees.md`](worktrees.md) | Which folder is which branch |
| [`feature-tree-main-clean.md`](feature-tree-main-clean.md) | Nightlife / restaurants file paths on `main` |
| [`COMMIT-PLAN.md`](COMMIT-PLAN.md) | Original slice design (mostly executed) |
| [`INDEX.md`](INDEX.md) | Slice table + PR options |

---

*Last updated: 2026-06-04 — branch already has slices 1–7 content in history; this file is the finish line.*
