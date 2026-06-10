#!/usr/bin/env bash
# tidy-worktrees.sh — Weekly maintenance: prune stale worktrees and remote-tracking refs.
# Safe read-mostly; does not delete unmerged local branches or dirty trees.
# Usage: bash .agents/skills/mde-worktree-pr-flow/scripts/tidy-worktrees.sh [--dry-run]
set -euo pipefail

DRY=0
[ "${1:-}" = "--dry-run" ] && DRY=1

ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"

BOLD=$'\033[1m'; DIM=$'\033[2m'; CYAN=$'\033[36m'; RESET=$'\033[0m'

echo "${BOLD}tidy-worktrees — $ROOT${RESET}"
[ "$DRY" -eq 1 ] && echo "${DIM}(dry-run — no prune executed)${RESET}"
echo

run() {
  if [ "$DRY" -eq 1 ]; then
    echo "${CYAN}would run:${RESET} $*"
  else
    echo "${CYAN}running:${RESET} $*"
    "$@"
  fi
}

run git fetch origin --prune
run git remote prune origin
run git worktree prune

echo
echo "${BOLD}Current worktrees:${RESET}"
git worktree list

echo
echo "${BOLD}Gone branches (remote prune may have removed):${RESET}"
git branch -vv | grep ': gone]' || echo "  (none)"

echo
echo "${DIM}Next: audit dirty trees before remove — backup-worktree.sh + audit-worktrees.sh${RESET}"
echo "${DIM}Do not git worktree remove --force on trees with uncommitted work.${RESET}"
