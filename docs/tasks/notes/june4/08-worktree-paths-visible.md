# Worktree paths — where they live (not hidden on disk)

Git worktrees are **separate directories**, not subfolders of one checkout. Cursor’s default explorer hides them because the **planning** repo `.gitignore` ignores `/mdeapp/`, `/.worktrees/`, and `/.wt-*/` (June 4 leak fix — keep that).

## mdeapp worktrees (`git -C /home/sk/mdeai/mdeapp worktree list`)

| Full path | Branch | Notes |
|-----------|--------|--------|
| `/home/sk/mdeai/mdeapp` | `ai/san-491-screen-022-nightlife-listings-map` | Primary checkout; may be stale after SAN-491 merge |
| `/home/sk/mde-wt-search-clean` | `main` @ `ae9a1e6` | **Use this for app work on clean main** |
| `/home/sk/mdeai/.worktrees/wt-san521` | `ai/san-521-mob-ck-001-mobile-composer` | Dot + gitignored in mdeai |
| `/home/sk/mdeai/.worktrees/wt-ux-020` | `feat/pr-12-maps-key-warn` | Dot + gitignored |
| `/home/sk/mdeai/.wt-ux-003-night-parser` | `feat/ux-003-night-parser` | Dot + gitignored |
| `/home/sk/mdeai/mdeapp/workspace/wt-infra-workflow-lean` | `infra/workflow-lean-scripts` | Under ignored `mdeapp/` |
| `/tmp/mdeai-san-413` | `ai/san-413-rental-generic-ask-test` | **prunable** — may be gone after reboot |

## See them in Cursor

1. **File → Open Workspace from File…** → `/home/sk/mdeai/mdeai-worktrees.code-workspace` (multi-root + `explorer.excludeGitIgnore: false`).
2. Or **Settings** → search `exclude gitignore` → uncheck **Explorer: Exclude Git Ignore**.
3. Terminal: `ls -la /home/sk/mdeai/.worktrees/ /home/sk/mdeai/.wt-ux-003-night-parser`

## Prune stale entry

```bash
git -C /home/sk/mdeai/mdeapp worktree prune
```

## mdeai planning worktrees

```bash
git -C /home/sk/mdeai worktree list
```
