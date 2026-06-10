# Worktrees — mde-task-lifecycle hook

**Operator docs:** [`tasks/notes/june4/worktrees-best.md`](../../../../tasks/notes/june4/worktrees-best.md) · quick: [`07-worktree-organization-v040.md`](../../../../tasks/notes/june4/07-worktree-organization-v040.md)  
**Deep skill:** `mde-worktree-pr-flow` · scripts: `.claude/skills/mde-worktree-pr-flow/scripts/`

---

## Golden rule

One Linear task → one folder → one branch → one PR → remove tree after merge.

---

## Canonical paths

| Role | Path |
|------|------|
| App git root | `/home/sk/mdeai/mdeapp` |
| New app worktrees | `/home/sk/mdeai/mdeapp/.worktrees/wt-san-NNN-slug` |
| Planning worktrees | `/home/sk/mdeai/.worktrees/wt-san-NNN-slug` |
| Cursor shortcuts | `/home/sk/mdeai/wt-visibility/` — symlinks only |
| Legacy clean `main` | `/home/sk/mde-wt-search-clean` — not for new feature work |

**Cap:** max **5** active app worktrees under `mdeapp/.worktrees/`.

---

## Phase 3 — before coding (app changes)

```bash
cd /home/sk/mdeai/mdeapp && git switch main && git fetch origin main

bash .claude/skills/mde-worktree-pr-flow/scripts/guard-gitignore-worktrees.sh
bash .claude/skills/mde-worktree-pr-flow/scripts/guard-worktree-context.sh
bash .claude/skills/mde-worktree-pr-flow/scripts/verify-clean.sh

SAN=NNN SLUG=short-slug
git worktree add ".worktrees/wt-san-${SAN}-${SLUG}" -b "ai/san-${SAN}-${SLUG}" origin/main
cd "/home/sk/mdeai/mdeapp/.worktrees/wt-san-${SAN}-${SLUG}"
npm ci
# env: Infisical → gitignored mdeapp/.env.local (never commit)
```

Planning-only tasks: worktree under `/home/sk/mdeai/.worktrees/` — no `mdeapp/src/` edits.

---

## Phase 5 — after PR merge

```bash
cd /home/sk/mdeai/mdeapp
git worktree remove .worktrees/wt-san-NNN-slug
git branch -d ai/san-NNN-slug
git worktree prune
```

---

## Hard avoids

- New features under `/home/sk/mde-wt-*`
- Worktree inside a worktree
- `git worktree add` in `wt-visibility/`
- Mixed `mdeai` + `mdeapp` in one PR
- Symlinked `node_modules` (use `npm ci` per tree; pnpm only after repo migration)
