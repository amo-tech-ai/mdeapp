#!/usr/bin/env bash
# audit-worktrees.sh — Forensic read-only audit of all worktrees vs origin/main.
# Usage: bash .claude/skills/mde-worktree-pr-flow/scripts/audit-worktrees.sh
set -euo pipefail

BOLD=$'\033[1m'; DIM=$'\033[2m'; RED=$'\033[31m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'; CYAN=$'\033[36m'; RESET=$'\033[0m'

ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"

git fetch origin 2>/dev/null || true

if git rev-parse --verify origin/main >/dev/null 2>&1; then
  MAIN_SHA=$(git rev-parse --short origin/main)
  MAIN_LINE=$(git log -1 --oneline origin/main)
else
  MAIN_SHA="?"
  MAIN_LINE="(no origin/main)"
fi

LOCAL_MAIN=""
if git rev-parse --verify main >/dev/null 2>&1; then
  LOCAL_MAIN=$(git rev-parse --short main)
fi

STASH_COUNT=$(git stash list | wc -l | tr -d ' ')

echo "${BOLD}mdeai worktree forensic audit${RESET}"
echo "${DIM}Repo: $ROOT${RESET}"
echo "${BOLD}origin/main:${RESET} $MAIN_SHA  $MAIN_LINE"
if [ -n "$LOCAL_MAIN" ] && [ "$LOCAL_MAIN" != "$MAIN_SHA" ]; then
  echo "${YELLOW}⚠ local main ($LOCAL_MAIN) ≠ origin/main ($MAIN_SHA) — reset local main before new branches${RESET}"
elif [ -n "$LOCAL_MAIN" ]; then
  echo "${GREEN}✓ local main matches origin/main${RESET}"
fi
echo "${BOLD}Stashes (repo-wide):${RESET} $STASH_COUNT"
if [ "$STASH_COUNT" -gt 0 ]; then
  git stash list | sed 's/^/  /'
fi
echo

printf "${BOLD}%-45s %-22s %-8s %-6s %-6s %-6s %-12s${RESET}\n" \
  "WORKTREE" "BRANCH" "HEAD" "DIRTY" "UNTR" "STASH" "MAIN b/a"
printf "%s\n" "$(printf '%.0s-' {1..115})"

git worktree list --porcelain | awk '
  /^worktree / { path=$2 }
  /^HEAD /     { head=$2 }
  /^branch /   { branch=$2; print path "|" head "|" branch }
  /^detached/  { print path "|" head "|" }
' | while IFS='|' read -r path head branch; do
  short_branch="${branch#refs/heads/}"
  [ -z "$short_branch" ] && short_branch="(detached)"

  if [ ! -d "$path" ]; then
    printf "%-45s %-22s %-8s %-6s %-6s %-6s %-12s\n" \
      "$(basename "$path")" "$short_branch" "?" "?" "?" "$STASH_COUNT" "MISSING"
    continue
  fi

  dirty=$(git -C "$path" status --short 2>/dev/null | wc -l | tr -d ' ')
  untr=$(git -C "$path" ls-files --others --exclude-standard 2>/dev/null | wc -l | tr -d ' ')
  short_head=$(git -C "$path" rev-parse --short HEAD 2>/dev/null || echo "?")

  if git -C "$path" rev-parse --verify origin/main >/dev/null 2>&1; then
    read -r behind ahead <<<"$(git -C "$path" rev-list --left-right --count origin/main...HEAD 2>/dev/null | tr '\t' ' ')"
    main_track="${behind}b/${ahead}a"
  else
    main_track="—"
  fi

  display_path="$path"
  if [ "${#display_path}" -gt 43 ]; then
    display_path="...${display_path: -40}"
  fi

  printf "%-45s %-22s %-8s %-6s %-6s %-6s %-12s\n" \
    "$display_path" "$short_branch" "$short_head" "$dirty" "$untr" "$STASH_COUNT" "$main_track"
done

echo
echo "${BOLD}Legend:${RESET} DIRTY = status --short lines; UNTR = untracked paths (ls-files); MAIN b/a = behind/ahead vs ${CYAN}origin/main${RESET}; STASH = repo-wide count."
echo "${DIM}Next: classify domains, run backup-worktree.sh before any destructive command.${RESET}"
echo "${DIM}Reference: .claude/skills/mde-worktree-pr-flow/references/forensic-cleanup.md${RESET}"
