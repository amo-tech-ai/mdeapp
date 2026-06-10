#!/usr/bin/env bash
# guard-gitignore-worktrees.sh — Fail if agent worktree dirs are not gitignored.
# Prevents multi-GB .worktrees/ leaks into git status / accidental staging.
# Usage: bash .agents/skills/mde-worktree-pr-flow/scripts/guard-gitignore-worktrees.sh [REPO_ROOT]
set -euo pipefail

ROOT="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
cd "$ROOT"

RED=$'\033[31m'; GREEN=$'\033[32m'; BOLD=$'\033[1m'; RESET=$'\033[0m'

# Paths that must never be tracked (June 4 incident: .worktrees/ was 3 GB untracked noise)
# Test paths relative to repo root (not .gitignore pattern syntax)
REQUIRED_IGNORES=(
  ".worktrees"
  ".worktrees/"
  "github"
)

fail=0
for pattern in "${REQUIRED_IGNORES[@]}"; do
  if git check-ignore -q "$pattern" 2>/dev/null; then
    echo "${GREEN}✓ ignored:${RESET} $pattern"
  else
    echo "${RED}✗ NOT IGNORED:${RESET} $pattern"
    fail=1
  fi
done

# If .worktrees exists on disk, confirm the directory itself is ignored
if [ -d ".worktrees" ]; then
  if git check-ignore -q ".worktrees/" 2>/dev/null; then
    echo "${GREEN}✓ .worktrees/ on disk and ignored${RESET}"
  else
    echo "${RED}✗ .worktrees/ exists but is NOT ignored — add /.worktrees/ to .gitignore${RESET}"
    fail=1
  fi
fi

if [ "$fail" -ne 0 ]; then
  echo
  echo "${RED}${BOLD}STOP — fix .gitignore before git worktree add or staging.${RESET}"
  echo "  Add to ${ROOT}/.gitignore:"
  echo "    /.worktrees/"
  echo "    /github"
  echo "  Then: git add .gitignore && commit (see tasks/commit/june-4/COMMIT-PLAN.md slice 1)"
  exit 1
fi

echo "${GREEN}${BOLD}OK — worktree leak paths are gitignored.${RESET}"
exit 0
