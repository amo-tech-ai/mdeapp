#!/usr/bin/env bash
# list-worktrees.sh — Every worktree: branch, HEAD, dirty/untracked counts, vs origin/main.
# Usage: bash .claude/skills/mde-worktree-pr-flow/scripts/list-worktrees.sh
set -euo pipefail

BOLD=$'\033[1m'; DIM=$'\033[2m'; RED=$'\033[31m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'; RESET=$'\033[0m'

ROOT=$(git rev-parse --show-toplevel)
cd "$ROOT"
git fetch origin 2>/dev/null || true

MAIN_SHA=""
if git rev-parse --verify origin/main >/dev/null 2>&1; then
  MAIN_SHA=$(git rev-parse --short origin/main)
fi
STASH_COUNT=$(git stash list | wc -l | tr -d ' ')

echo "${DIM}origin/main: ${MAIN_SHA:-?}  |  repo stashes: $STASH_COUNT${RESET}"
echo

printf "${BOLD}%-42s %-20s %-7s %-5s %-5s %-10s %-10s${RESET}\n" \
  "PATH" "BRANCH" "HEAD" "DIRTY" "UNTR" "UPSTREAM" "MAIN"
printf "%s\n" "$(printf '%.0s-' {1..110})"

git worktree list --porcelain | awk '
  /^worktree / { path=$2 }
  /^HEAD /     { head=$2 }
  /^branch /   { branch=$2; print path "|" head "|" branch }
  /^detached/  { print path "|" head "|" }
' | while IFS='|' read -r path head branch; do
  short_branch="${branch#refs/heads/}"
  [ -z "$short_branch" ] && short_branch="(detached)"
  short_head="${head:0:7}"

  if [ ! -d "$path" ]; then
    printf "%-42s %-20s %-7s %-5s %-5s %-10s %-10s\n" \
      "$(basename "$path")" "$short_branch" "?" "?" "?" "—" "MISSING"
    continue
  fi

  dirty_n=$(git -C "$path" status --short 2>/dev/null | wc -l | tr -d ' ')
  untr_n=$(git -C "$path" ls-files --others --exclude-standard 2>/dev/null | wc -l | tr -d ' ')

  if [ "$dirty_n" -eq 0 ]; then
    dirty_col="${GREEN}0${RESET}"
  elif [ "$dirty_n" -gt 50 ]; then
    dirty_col="${RED}${dirty_n}${RESET}"
  else
    dirty_col="${YELLOW}${dirty_n}${RESET}"
  fi

  if [ "$untr_n" -gt 200 ]; then
    untr_col="${RED}${untr_n}${RESET}"
  elif [ "$untr_n" -gt 0 ]; then
    untr_col="${YELLOW}${untr_n}${RESET}"
  else
    untr_col="${GREEN}0${RESET}"
  fi

  upstream=$(git -C "$path" rev-parse --abbrev-ref --symbol-full-name '@{u}' 2>/dev/null || echo "")
  if [ -n "$upstream" ]; then
    up_short="${upstream#origin/}"
    up_short="${up_short:0:9}"
    ahead=$(git -C "$path" rev-list --count "$upstream"..HEAD 2>/dev/null || echo "?")
    behind=$(git -C "$path" rev-list --count HEAD.."$upstream" 2>/dev/null || echo "?")
    up_track="${ahead}/${behind}"
  else
    up_short="—"
    up_track="—"
  fi

  if git -C "$path" rev-parse --verify origin/main >/dev/null 2>&1; then
    read -r behind_main ahead_main <<<"$(git -C "$path" rev-list --left-right --count origin/main...HEAD 2>/dev/null | tr '\t' ' ')"
    main_track="${behind_main}b/${ahead_main}a"
    if [ "${behind_main:-0}" != "0" ] && [ "$behind_main" != "?" ]; then
      main_track="${YELLOW}${main_track}${RESET}"
    fi
  else
    main_track="—"
  fi

  display_path="$path"
  if [ "${#display_path}" -gt 40 ]; then
    display_path="...${display_path: -37}"
  fi

  printf "%-42s %-20s %-7s %-12s %-12s %-10s %-21s\n" \
    "$display_path" "$short_branch" "$short_head" "$dirty_col" "$untr_col" "$up_track" "$main_track"
done

echo
echo "${DIM}DIRTY = status --short lines | UNTR = untracked path count | MAIN = behind/ahead vs origin/main${RESET}"
echo "${DIM}Forensic audit: bash .claude/skills/mde-worktree-pr-flow/scripts/audit-worktrees.sh${RESET}"
