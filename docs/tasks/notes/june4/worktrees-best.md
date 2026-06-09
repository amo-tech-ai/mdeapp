# Worktree best practices — mdeai (2026-06-04, v0.4.1)

**Status:** Canonical operator guide for this monorepo layout.  
**Quick cheat sheet:** [`07-worktree-organization-v040.md`](./07-worktree-organization-v040.md)  
**Skill (deep scripts):** `.claude/skills/mde-worktree-pr-flow/`  
**Live inventory:** [`tasks/commit/june-4/worktrees.md`](../../commit/june-4/worktrees.md)  
**Strategy / automation target:** [`.claude/docs/best-practices/lean-plan.md`](../../../.claude/docs/best-practices/lean-plan.md) § Worktree Strategy

---

## Canonical paths (non-negotiable)

| Role | Path |
|------|------|
| App git root | `/home/sk/mdeai/mdeapp` |
| New app worktrees | `/home/sk/mdeai/mdeapp/.worktrees/wt-san-NNN-slug` |
| Planning git root | `/home/sk/mdeai` |
| New planning worktrees | `/home/sk/mdeai/.worktrees/wt-san-NNN-slug` |
| Cursor shortcuts | `/home/sk/mdeai/wt-visibility/` — **symlinks only**; never `git worktree add` |
| Legacy clean `main` | `/home/sk/mde-wt-search-clean` — **not** for new feature work |

**Golden rule:** One task → one folder → one branch → one PR → remove tree after merge.

---

## Efficiency updates (2026-06-04, from a real session)

Lived corrections after a session lost ~80% of its time to worktree/git friction (not compile time):

1. **Active cap = 2–3, not 5.** One primary + 1–2 feature trees. The old "5" cap is how the chaos accumulates. (Reconciles `lean-plan.md`, which says 2.)
2. **`node_modules`: `npm ci` for feature trees you'll develop in; symlink for short-lived verify-only trees.** A throwaway "run the tests then delete" tree can `ln -s` the primary's `node_modules` + `.env.local` (+ `workspace/`) — ~1 min vs 3–5 min `npm ci` + ~1 GB. Never symlink into a tree you'll keep editing.
3. **Never `git stash` to carry edits across `git checkout` in a shared tree.** The stash stack is **repo-global across all worktrees** — a `pop` can apply another branch's stash and inject conflict markers. Commit first, or work in a dedicated tree.
4. **The `rm -rf mdeapp/.next` `dist-leak-scan` workaround is obsolete.** The hook was fixed (skips build caches, allowlists the public `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` from `*.env.local.bak`/`process.env` — PR #43). Don't delete `.next` to push.
5. **Lean loop wins over more gates:** read → implement → T1 targeted test (~2s) → `tsc --noEmit` → commit → push → PR. Full `floor`/`build` are CI's job, not every local change.

---

## TL;DR

| Rule | Detail |
|------|--------|
| **Two git roots** | `mdeai` = plans/tasks · `mdeapp` = app code — **never one PR across both** |
| **One worktree → one task → one branch → one PR** | Matches [Linear](https://linear.app/sanjiovani) + [`linear.md`](../../../linear.md) |
| **App feature trees** | `/home/sk/mdeai/mdeapp/.worktrees/wt-san-NNN-slug` only |
| **Planning trees** | `/home/sk/mdeai/.worktrees/wt-san-NNN-slug` (docs/tasks only) |
| **Active app cap** | **≤2–3** under `mdeapp/.worktrees/` (1 primary + 1–2 feature) |
| **Legacy main** | `/home/sk/mde-wt-search-clean` = temporary clean `main`; new work starts from `/home/sk/mdeai/mdeapp` |
| **After merge** | `git worktree remove` + `git branch -d` |
| **Dependencies** | `npm ci` per feature tree; **symlink `node_modules`** for short-lived verify-only trees; **pnpm** only after deliberate repo migration |
| **Env** | Prefer **Infisical** into gitignored `mdeapp/.env.local`; local copy OK if never committed |

---

## Recommended layout

```text
/home/sk/mdeai/
│
├── mdeapp/                          ← canonical app git root (amo-tech-ai/mdeapp)
│   ├── .worktrees/                  ← ONLY place for new app feature worktrees
│   │   ├── wt-san-549-nightlife/
│   │   ├── wt-san-546-ops/
│   │   └── wt-san-550-rentals/
│   └── (main checkout — branch main @ /home/sk/mdeai/mdeapp)
│
├── .worktrees/                      ← planning repo only
│   ├── wt-san-docs/
│   └── wt-san-planning/
│
└── wt-visibility/                   ← symlinks for Cursor/Explorer (NOT git worktrees)
    ├── main-clean → /home/sk/mde-wt-search-clean
    └── README.md
```

### Why this layout

- **App vs planning stay separate** — avoids committing `tasks/` into `mdeapp` or `src/` into `mdeai`.
- **Everything under the repo** — do not create new `/home/sk/mde-wt-*` siblings.
- **Aligns with agent tooling** — [Claude Code worktrees](https://code.claude.com/docs/en/common-workflows#run-parallel-sessions-with-worktrees) and [Cursor worktrees](https://cursor.com/docs/configuration/worktrees) assume isolated checkouts per task.
- **Matches Git** — one working directory per branch ([`git worktree`](https://git-scm.com/docs/git-worktree)); remove with `git worktree remove`.

**Convention:** Use **`mdeapp/.worktrees/`** only (not `mdeapp/workspace/` — pick one; we use `.worktrees/`).

---

## Naming

| Piece | Pattern | Example |
|-------|---------|---------|
| Directory | `wt-san-<NNN>-<short-slug>` | `wt-san-549-nightlife` |
| Branch | `ai/san-<NNN>-<short-slug>` | `ai/san-549-concierge-nightlife-intent` |
| Linear | `SAN-NNN` in branch + PR body `Closes SAN-NNN` | [`linear.md`](../../../linear.md) |

**Avoid:** `wt-san-491-events-rentals-trips` (multiple tasks in one tree).

---

## Create an app worktree (canonical)

Run from **`/home/sk/mdeai/mdeapp` on `main`** — not from inside another worktree, not from `/home/sk/mde-wt-search-clean` for new features.

```bash
# 0 — guards (must pass)
bash .claude/skills/mde-worktree-pr-flow/scripts/guard-gitignore-worktrees.sh
bash .claude/skills/mde-worktree-pr-flow/scripts/guard-worktree-context.sh
bash .claude/skills/mde-worktree-pr-flow/scripts/verify-clean.sh

# 1 — vars
SAN=549
SLUG=nightlife-intent
BRANCH="ai/san-${SAN}-${SLUG}"
WT=".worktrees/wt-san-${SAN}-${SLUG}"

# 2 — canonical app root
cd /home/sk/mdeai/mdeapp
git switch main
git fetch origin main
git worktree add "$WT" -b "$BRANCH" origin/main

# 3 — deps (per tree; do not symlink node_modules)
cd "/home/sk/mdeai/mdeapp/${WT}"
npm ci
# pnpm install — only after deliberate mdeapp migration to pnpm (lockfile + CI)

# 4 — env (gitignored only; never commit)
# Prefer: Infisical → mdeapp/.env.local in this tree
# Optional local copy from another machine checkout — must stay gitignored
```

**Result path:**

```text
/home/sk/mdeai/mdeapp/.worktrees/wt-san-549-nightlife-intent
```

Before adding a sixth app tree, remove a merged one (max **5** active).

---

## Create a planning worktree (docs only)

```bash
cd /home/sk/mdeai
git fetch origin
git worktree add .worktrees/wt-san-docs-slice -b docs/san-docs-slice origin/main
# edit tasks/** plan/** only — no mdeapp/src/**
```

Planning repo gitignores `/.worktrees/` at repo root.

---

## Cleanup after merge

```bash
cd /home/sk/mdeai/mdeapp
git worktree remove .worktrees/wt-san-549-nightlife-intent
git branch -d ai/san-549-nightlife-intent
git worktree prune
git fetch origin --prune
```

**Audit before bulk delete:**

```bash
bash .claude/skills/mde-worktree-pr-flow/scripts/audit-worktrees.sh
bash .claude/skills/mde-worktree-pr-flow/scripts/tidy-worktrees.sh
```

---

## Tooling: Claude Code vs Cursor vs raw Git

| Tool | Worktree location | Notes |
|------|-------------------|--------|
| **Git (mdeai standard)** | `/home/sk/mdeai/mdeapp/.worktrees/wt-san-*` | Shippable app PRs use `ai/san-*` branches |
| **Claude Code** | May use `.claude/worktrees/<name>/` | See [Claude worktree guide](https://claudefa.st/blog/guide/development/worktree-guide). For **mdeapp PRs**, still use `mdeapp/.worktrees/`. |
| **Cursor Agents** | `.cursor/` worktrees + [`.cursor/worktrees.json`](https://cursor.com/docs/configuration/worktrees) | Setup: `npm ci`, env via Infisical or gitignored `.env.local` |

---

## Visibility (Cursor / Explorer)

`/home/sk/mdeai/wt-visibility/` holds **symlinks only** — not real git worktrees.

| Shortcut | Typical target |
|----------|----------------|
| `wt-main-clean` | Legacy `/home/sk/mde-wt-search-clean` (clean `main`) |
| Other entries | See [`worktrees.md`](../../commit/june-4/worktrees.md) |

Do not run `git worktree add` inside `wt-visibility/`.

---

## Avoid (hard rules)

| ❌ Don't | Why |
|--------|-----|
| New feature work under `/home/sk/mde-wt-*` | Use `mdeapp/.worktrees/` only |
| Worktree inside a worktree | `guard-worktree-context.sh` blocks nested adds |
| `git worktree add` inside `wt-visibility/` | Symlinks folder, not a git root |
| Symlink `node_modules` into a tree you'll **develop** in | `npm ci` per feature tree (symlink only for throwaway verify trees) |
| `git stash` to move edits across `checkout` in a shared tree | Stash is repo-global; commit first or use a dedicated tree |
| >3 active app worktrees | Disk + index bloat + confusion; delete merged first |
| One tree for multiple SAN issues | PR scope creep |
| Mix `mdeai` + `mdeapp` in one commit | Two remotes |
| Commit `.env.local` | Secrets; use Infisical or local gitignored copy |
| `git add .` with `.worktrees/` not ignored | ~3 GB leak risk — `mdeapp/.gitignore` has `.worktrees/` |
| Long-lived merged trees | Run `worktree remove` + `branch -d` |

---

## Migrate from legacy paths

Do **not** create new trees here:

```text
/home/sk/mde-wt-nightlife        → cherry-pick / reopen under mdeapp/.worktrees/
/home/sk/mdeai/.wt-ux-003-*      → fresh tree from main; don't merge ancient branch
/tmp/mdeai-*                     → git worktree prune
```

**Keep temporarily:** `/home/sk/mde-wt-search-clean` as legacy clean `main` (browse/verify prod parity). **New features:** `/home/sk/mdeai/mdeapp/.worktrees/wt-san-*` only.

---

## Pre-flight checklist (new task)

- [ ] Linear `SAN-NNN`; branch `ai/san-NNN-slug`
- [ ] Ledger row in [`COMMIT-LEDGER.md`](../../commit/COMMIT-LEDGER.md) if app slice (C-###)
- [ ] Guards via `.claude/skills/mde-worktree-pr-flow/scripts/` (all three)
- [ ] Tree: `/home/sk/mdeai/mdeapp/.worktrees/wt-san-NNN-slug` from `origin/main`
- [ ] Active app trees ≤5
- [ ] `npm ci` in that tree; env via Infisical or gitignored `.env.local`
- [ ] One PR. (`dist-leak-scan` no longer false-blocks the public Maps key — PR #43 fixed it; the old `rm -rf mdeapp/.next` workaround is obsolete.)

---

## References

### Internal

- [`07-worktree-organization-v040.md`](./07-worktree-organization-v040.md)
- [`08-worktree-paths-visible.md`](./08-worktree-paths-visible.md)
- `.claude/skills/mde-worktree-pr-flow/references/worktree-safety-v040.md`
- `.claude/skills/mde-worktree-pr-flow/references/git-worktree-cheatsheet.md`
- [`CLAUDE.md`](../../../CLAUDE.md) — one worktree, one PR

### External

- [Git — git-worktree](https://git-scm.com/docs/git-worktree)
- [Claude Code — common workflows](https://code.claude.com/docs/en/common-workflows)
- [Claude Fast — worktree guide](https://claudefa.st/blog/guide/development/worktree-guide)
- [Cursor — worktrees](https://cursor.com/docs/configuration/worktrees)
- [pnpm + git worktrees](https://pnpm.io/git-worktrees) — future, after migration

---

## Grade rubric (is your setup healthy?)

| Signal | Healthy | Unhealthy |
|--------|---------|-----------|
| Active app trees | ≤3 under `/home/sk/mdeai/mdeapp/.worktrees/` | 4+ or scattered `/home/sk/mde-wt-*` |
| New feature path | `mdeapp/.worktrees/wt-san-*` | New work in `mde-wt-search-clean` |
| Merged PR trees | `worktree remove` + branch delete within 48h | Stale `wt-san-*` after merge |
| Primary `mdeapp/` | `main` @ `origin/main` | Feature branch posing as main |
| `wt-visibility/` | Symlinks only | `git worktree add` there |
| Env | Infisical or gitignored `.env.local` | `.env` committed or pasted in docs |

**Target:** 9/10 — canonical paths only, ≤3 active app trees, legacy `mde-wt-search-clean` not used for new features.
