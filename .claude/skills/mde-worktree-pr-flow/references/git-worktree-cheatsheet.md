# Git worktree cheatsheet (mdeAI layout)

**North star:** Small branch → focused PR → tested → merged → deployed → verified → next branch.

## Merge gate (before "done")

`git status` clean · `npm run lint` · `npm run build` · `npm run test` · `npm run floor` · Vercel preview · GitHub checks · merged · production verified.

## Layout convention

```text
/home/sk/mde                                        ← canonical main checkout
/home/sk/mde/.claude/worktrees/<name>/              ← Claude-managed worktrees (default)
```

`.claude/worktrees/` is in `.gitignore`. Paths outside that need explicit user approval.

## Daily commands

| Action | Command |
|--------|---------|
| List worktrees | `git worktree list` |
| Forensic table | `bash .claude/skills/mde-worktree-pr-flow/scripts/audit-worktrees.sh` |
| Quick status table | `bash .claude/skills/mde-worktree-pr-flow/scripts/list-worktrees.sh` |
| Preflight (new work) | `bash .claude/skills/mde-worktree-pr-flow/scripts/verify-clean.sh` |
| Backup before cleanup | `bash .claude/skills/mde-worktree-pr-flow/scripts/backup-worktree.sh [path]` |
| Create on new branch | `git worktree add -b feat/xyz ../wt-feat-xyz origin/main` |
| Remove (clean only) | `git worktree remove ../wt-feat-xyz` |
| Force remove | `git worktree remove --force …` — **only after backup + user OK** |
| Prune stale | `git worktree prune` |
| Lock | `git worktree lock ../wt-long-running --reason "…"` |

## Production SHA (always first in cleanup)

```bash
git fetch origin
git rev-parse --short origin/main
git log -1 --oneline origin/main
# local main must match:
git rev-parse --short main
```

## Forensic per-worktree checks

```bash
WT=/path/to/worktree
git -C "$WT" branch --show-current
git -C "$WT" rev-parse --short HEAD
git -C "$WT" status --short | wc -l          # dirty lines
git -C "$WT" ls-files --others --exclude-standard | wc -l   # untracked paths
git -C "$WT" rev-list --left-right --count origin/main...HEAD
git -C "$WT" diff --stat origin/main | tail -5
git -C "$WT" log --oneline origin/main..HEAD
```

## Never run blindly

```bash
git add .
git clean -fd
git reset --hard
git stash pop
git worktree remove --force
git branch -D
```

Requires: `backup-worktree.sh` done, diff reviewed, user go/no-go.

## Cleanup ritual (before remove)

```bash
cd <worktree-path>
bash .claude/skills/mde-worktree-pr-flow/scripts/backup-worktree.sh .
git status --short
git stash list
git log --oneline origin/main..HEAD
```

If dirty/untracked/local commits exist → stop unless user approved after backup.

After approved removal:

```bash
cd /home/sk/mde
git worktree remove <worktree-path>    # or --force if backed up + approved
git worktree prune
```

## Claude-Code-native flow

```bash
claude --worktree feature-auth
claude --worktree "#1234"
```

Honors `.worktreeinclude` for `.env` copies. Non-Claude shell: `git worktree add` + copy `.env` manually.

## When NOT to use worktrees

- One-line edits on current branch
- Shared dev server state (`.mastra/output/`)
- Third parallel worktree while two are already dirty
