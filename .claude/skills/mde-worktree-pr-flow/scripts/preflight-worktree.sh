#!/usr/bin/env bash
# preflight-worktree.sh — MUST pass before `git worktree add`.
# Prevents the large-worktree leak at the source: refuses to create a worktree
# in a location that isn't gitignored, and blocks nested/dirty creation.
#
# Usage: bash .claude/skills/mde-worktree-pr-flow/scripts/preflight-worktree.sh <target-path>
#   e.g. preflight-worktree.sh .worktrees/wt-san-491
# Exit 0 = safe to create. Non-zero = do NOT run `git worktree add`.
set -euo pipefail

BOLD=$'\033[1m'; RED=$'\033[31m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'; RESET=$'\033[0m'
fail=0

TARGET="${1:-}"
if [ -z "$TARGET" ]; then
  echo "${RED}Usage: preflight-worktree.sh <target-path>${RESET}"; exit 2
fi

ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"

echo "${BOLD}Preflight for new worktree → $TARGET${RESET}"
echo

# 1) Detection-first: am I already inside a linked worktree or a submodule?
gitdir=$(git rev-parse --git-dir)
commondir=$(git rev-parse --git-common-dir)
if [ "$gitdir" != "$commondir" ]; then
  echo "${YELLOW}⚠ You appear to be INSIDE a linked worktree already.${RESET}"
  echo "  Create new trees from the MAIN checkout, not nested inside another worktree."
  fail=1
fi
if [ -f "$(git rev-parse --show-toplevel)/.git" ]; then
  echo "${RED}✗ This looks like a submodule (.git is a file). Run from the superproject.${RESET}"
  fail=1
fi

# 2) THE leak guard — target's base dir must be gitignored.
base="${TARGET%%/*}/"            # e.g. ".worktrees/"
case "$TARGET" in
  /*|../*)
    echo "${GREEN}✓ Target is outside the repo ($TARGET) — sibling layout, no in-repo leak risk.${RESET}"
    ;;
  *)
    if git check-ignore -q "$base" || git check-ignore -q "$TARGET"; then
      echo "${GREEN}✓ Target base '$base' is gitignored — worktree contents cannot be staged.${RESET}"
    else
      echo "${RED}✗ Target base '$base' is NOT gitignored.${RESET}"
      echo "  Creating a worktree here is the 3 GB-leak condition. Fix first:"
      echo "    printf '\\n# git worktrees — never track\\n/%s\\n' '$base' >> .gitignore"
      fail=1
    fi
    ;;
esac

# 3) Current tree must be clean (don't carry uncommitted work into a new tree).
if [ -n "$(git status --short)" ]; then
  echo "${RED}✗ Current worktree is dirty — commit/stash before creating a new tree.${RESET}"
  echo "  See: scripts/verify-clean.sh (full preflight)"
  fail=1
else
  echo "${GREEN}✓ Current worktree clean.${RESET}"
fi

# 4) Base on fresh origin/main.
git fetch origin --quiet 2>/dev/null || true
if git rev-parse --verify origin/main >/dev/null 2>&1; then
  echo "  Tip: create from origin/main → git worktree add -b <branch> '$TARGET' origin/main"
fi

echo
if [ "$fail" -eq 0 ]; then
  echo "${GREEN}${BOLD}OK — safe to create the worktree.${RESET}"
  echo "  git worktree add -b <branch> '$TARGET' origin/main"
  exit 0
else
  echo "${RED}${BOLD}BLOCKED — fix the failures above before 'git worktree add'.${RESET}"
  exit 1
fi
