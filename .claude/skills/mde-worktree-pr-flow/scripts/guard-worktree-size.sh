#!/usr/bin/env bash
# guard-worktree-size.sh — Detect a large-worktree build BEFORE it becomes a 3 GB commit hazard.
# Read-only. Run anytime (and ideally on a weekly tidy). Flags two things:
#   (a) any in-repo worktree dir that is NOT gitignored  (the actual leak condition)
#   (b) any worktree whose STAGEABLE footprint (untracked, not-ignored) is large
#
# Usage: bash .claude/skills/mde-worktree-pr-flow/scripts/guard-worktree-size.sh
# Env:   STAGEABLE_WARN=200  STAGEABLE_FAIL=500  (untracked-file counts)
set -euo pipefail

BOLD=$'\033[1m'; RED=$'\033[31m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'; RESET=$'\033[0m'
WARN="${STAGEABLE_WARN:-200}"; FAIL="${STAGEABLE_FAIL:-500}"
rc=0

ROOT=$(git rev-parse --show-toplevel); cd "$ROOT"
echo "${BOLD}Worktree size guard${RESET}  (warn ≥ $WARN untracked, fail ≥ $FAIL)"
echo

while IFS= read -r line; do
  wt_path=$(echo "$line" | awk '{print $1}')
  [ -d "$wt_path" ] || continue

  # disk size (informational — includes node_modules/.next which are gitignored)
  size=$(du -sh "$wt_path" 2>/dev/null | awk '{print $1}')

  # the number that matters: files git WOULD stage (untracked, not ignored)
  stageable=$(git -C "$wt_path" ls-files --others --exclude-standard 2>/dev/null | wc -l | tr -d ' ')

  # leak condition: this tree lives inside the repo but isn't ignored
  leak=""
  case "$wt_path" in
    "$ROOT") : ;;
    "$ROOT"/*)
      rel=${wt_path#"$ROOT"/}
      git check-ignore -q "$rel" || leak="NOT-IGNORED"
      ;;
  esac

  flag="${GREEN}ok${RESET}"
  if [ -n "$leak" ]; then flag="${RED}LEAK: in-repo + not gitignored${RESET}"; rc=1
  elif [ "$stageable" -ge "$FAIL" ]; then flag="${RED}FAIL: $stageable stageable${RESET}"; rc=1
  elif [ "$stageable" -ge "$WARN" ]; then flag="${YELLOW}WARN: $stageable stageable${RESET}"
  fi

  printf "  %-45s size %-7s stageable %-6s %b\n" "${wt_path/#$HOME/~}" "$size" "$stageable" "$flag"
done < <(git worktree list | grep -v '^$')

echo
if [ "$rc" -ne 0 ]; then
  echo "${RED}${BOLD}Action: gitignore any in-repo worktree base, or remove the leaking/oversized tree.${RESET}"
  echo "  Never 'git add .' / 'git add -A' while a LEAK or FAIL row is present."
else
  echo "${GREEN}${BOLD}All worktrees within bounds.${RESET}"
fi
exit "$rc"
