#!/usr/bin/env bash
# verify-clean.sh — Preflight: clean state + production alignment + sibling worktree scan.
# Exits 0 only when safe to START new work (not for forensic cleanup — use audit-worktrees.sh).
# Usage: bash .claude/skills/mde-worktree-pr-flow/scripts/verify-clean.sh
set -euo pipefail

BOLD=$'\033[1m'; RED=$'\033[31m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'; RESET=$'\033[0m'

fail=0
warn=0
UNTR_WARN_THRESHOLD="${UNTR_WARN_THRESHOLD:-100}"
UNTR_FAIL_THRESHOLD="${UNTR_FAIL_THRESHOLD:-500}"

ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# --- v0.4.0: block worktree leaks before any other preflight ---
if [ -f "$SCRIPT_DIR/guard-gitignore-worktrees.sh" ]; then
  bash "$SCRIPT_DIR/guard-gitignore-worktrees.sh" "$ROOT" || exit 1
fi

git fetch origin 2>/dev/null || true

cwd=$(pwd)
branch=$(git branch --show-current 2>/dev/null || echo "(detached)")
status=$(git status --short)
dirty_count=$(echo "$status" | sed '/^$/d' | wc -l | tr -d ' ')
untr_count=$(git ls-files --others --exclude-standard | wc -l | tr -d ' ')

echo "${BOLD}Location${RESET}"
echo "  pwd:    $cwd"
echo "  branch: $branch"
echo "  dirty:  $dirty_count status lines | untracked: $untr_count paths"
echo

# --- Production / main alignment ---
echo "${BOLD}Production alignment${RESET}"
if git rev-parse --verify origin/main >/dev/null 2>&1; then
  origin_main=$(git rev-parse --short origin/main)
  echo "  origin/main: $origin_main $(git log -1 --oneline origin/main)"
  if git rev-parse --verify main >/dev/null 2>&1; then
    local_main=$(git rev-parse --short main)
    if [ "$local_main" != "$origin_main" ]; then
      echo "  ${RED}✗ local main ($local_main) ≠ origin/main ($origin_main)${RESET}"
      echo "    Fix: git checkout main && git reset --hard origin/main"
      fail=1
    else
      echo "  ${GREEN}✓ local main matches origin/main${RESET}"
    fi
  else
    echo "  ${YELLOW}⚠ no local main branch${RESET}"
    warn=1
  fi
else
  echo "  ${YELLOW}⚠ origin/main not found — run git fetch origin${RESET}"
  warn=1
fi
echo

# --- Current worktree clean ---
echo "${BOLD}Current worktree${RESET}"
if [ -n "$status" ]; then
  echo "${RED}✗ Working tree is dirty (${dirty_count} lines):${RESET}"
  echo "$status" | head -20 | sed 's/^/    /'
  [ "$dirty_count" -gt 20 ] && echo "    ... ($dirty_count total — run audit-worktrees.sh)"
  fail=1
else
  echo "${GREEN}✓ Working tree clean${RESET}"
fi

if [ "$untr_count" -ge "$UNTR_FAIL_THRESHOLD" ]; then
  echo "${RED}✗ Untracked path count ($untr_count) ≥ $UNTR_FAIL_THRESHOLD — run forensic cleanup; never git add .${RESET}"
  fail=1
elif [ "$untr_count" -ge "$UNTR_WARN_THRESHOLD" ]; then
  echo "${YELLOW}⚠ High untracked count ($untr_count) — backup before cleanup${RESET}"
  warn=1
fi
echo

# --- Sibling dirty worktrees ---
echo "${BOLD}Sibling worktrees${RESET}"
sibling_dirty=0
while IFS= read -r line; do
  wt_path=$(echo "$line" | awk '{print $1}')
  [ "$wt_path" = "$cwd" ] && continue
  [ ! -d "$wt_path" ] && continue
  n=$(git -C "$wt_path" status --short 2>/dev/null | wc -l | tr -d ' ')
  if [ "$n" -gt 0 ]; then
    echo "  ${YELLOW}⚠ DIRTY ($n): $wt_path${RESET}"
    sibling_dirty=1
  fi
done < <(git worktree list | grep -v '^$')

if [ "$sibling_dirty" -eq 0 ]; then
  echo "  ${GREEN}✓ No dirty sibling worktrees${RESET}"
else
  echo "  ${YELLOW}Run: bash .claude/skills/mde-worktree-pr-flow/scripts/audit-worktrees.sh${RESET}"
  warn=1
fi
echo

# --- Upstream ---
upstream=$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)
if [ -n "$upstream" ]; then
  ahead=$(git rev-list --count "$upstream"..HEAD 2>/dev/null || echo 0)
  behind=$(git rev-list --count HEAD.."$upstream" 2>/dev/null || echo 0)
  echo "${BOLD}Upstream${RESET} ($upstream): ahead $ahead | behind $behind"
  if [ "$behind" -gt 0 ]; then
    echo "  ${YELLOW}⚠ Behind upstream — fetch/rebase before opening a PR.${RESET}"
    warn=1
  fi
  echo
fi

# --- Stashes ---
stashes=$(git stash list)
stash_n=$(echo "$stashes" | sed '/^$/d' | wc -l | tr -d ' ')
if [ "$stash_n" -gt 0 ]; then
  echo "${YELLOW}⚠ $stash_n stash(es) — review before worktree remove; avoid blind stash pop:${RESET}"
  echo "$stashes" | head -5 | sed 's/^/    /'
  [ "$stash_n" -gt 5 ] && echo "    ..."
  warn=1
  echo
fi

# --- Staged secrets ---
staged_env=$(git diff --cached --name-only | grep -E '(^|/)\.env($|\.)|credentials|secrets\.json' || true)
if [ -n "$staged_env" ]; then
  echo "${RED}✗ Secret-like files staged — unstage immediately:${RESET}"
  echo "$staged_env" | sed 's/^/    /'
  fail=1
fi

staged_any=$(git diff --cached --name-only)
if [ -n "$staged_any" ]; then
  echo "${YELLOW}⚠ Staged files present (not necessarily wrong):${RESET}"
  echo "$staged_any" | sed 's/^/    /'
  warn=1
fi

echo
if [ "$fail" -eq 0 ] && [ "$warn" -eq 0 ]; then
  echo "${GREEN}${BOLD}OK — safe to start new work.${RESET}"
  exit 0
elif [ "$fail" -eq 0 ]; then
  echo "${YELLOW}${BOLD}WARN — proceed with caution (see above).${RESET}"
  exit 0
else
  echo "${RED}${BOLD}NOT CLEAN — fix failures above. For large mess: forensic-cleanup.md + audit-worktrees.sh${RESET}"
  exit 1
fi
