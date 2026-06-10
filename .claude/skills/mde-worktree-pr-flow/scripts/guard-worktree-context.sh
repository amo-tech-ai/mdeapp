#!/usr/bin/env bash
# guard-worktree-context.sh — Detect linked worktree vs main checkout; block nested worktree creation.
# Usage: bash .agents/skills/mde-worktree-pr-flow/scripts/guard-worktree-context.sh [--allow-linked]
#   --allow-linked  exit 0 when already in a linked worktree (skip creation, use current path)
#   default         exit 1 when in linked worktree AND caller wants to create another
set -euo pipefail

ALLOW_LINKED=0
for arg in "$@"; do
  case "$arg" in
    --allow-linked) ALLOW_LINKED=1 ;;
  esac
done

ROOT=$(git rev-parse --show-toplevel 2>/dev/null) || {
  echo "Not a git repository."
  exit 1
}
cd "$ROOT"

GIT_DIR=$(cd "$(git rev-parse --git-dir)" && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" && pwd -P)
SUPER=$(git rev-parse --show-superproject-working-tree 2>/dev/null || true)
BRANCH=$(git branch --show-current 2>/dev/null || echo "(detached)")
PWD_NOW=$(pwd)

CYAN=$'\033[36m'; YELLOW=$'\033[33m'; GREEN=$'\033[32m'; RED=$'\033[31m'; BOLD=$'\033[1m'; RESET=$'\033[0m'

echo "${BOLD}Worktree context${RESET}"
echo "  repo root:     $ROOT"
echo "  pwd:           $PWD_NOW"
echo "  branch:        $BRANCH"
echo "  GIT_DIR:       $GIT_DIR"
echo "  GIT_COMMON:    $GIT_COMMON"

if [ -n "$SUPER" ]; then
  echo "  superproject:  $SUPER"
  echo "${YELLOW}⚠ Inside a git submodule — do not run git worktree add here.${RESET}"
  exit 1
fi

if [ "$GIT_DIR" = "$GIT_COMMON" ]; then
  echo "${GREEN}✓ Main checkout (or primary worktree) — safe to create a new linked worktree.${RESET}"
  exit 0
fi

echo "${CYAN}Already in a linked worktree${RESET} (GIT_DIR ≠ GIT_COMMON)."
git worktree list | sed 's/^/  /'

if [ "$ALLOW_LINKED" -eq 1 ]; then
  echo "${GREEN}✓ --allow-linked: use this directory; do not create a nested worktree.${RESET}"
  exit 0
fi

echo "${RED}${BOLD}STOP — do not create a worktree inside a worktree.${RESET}"
echo "  Work here, or: git worktree add from the repo that owns GIT_COMMON:"
echo "    cd \"$(dirname "$GIT_COMMON")\"  # usually main checkout"
echo "  Optional sibling pattern (see linear-worktree): ../\$(basename \"\$ROOT\")-SAN-NNN"
exit 1
