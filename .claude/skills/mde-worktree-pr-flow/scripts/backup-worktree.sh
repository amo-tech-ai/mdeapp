#!/usr/bin/env bash
# backup-worktree.sh — Mandatory backup before cleanup / worktree removal / hard reset.
# Usage: bash .claude/skills/mde-worktree-pr-flow/scripts/backup-worktree.sh [worktree-path]
# Default: current directory's worktree.
set -euo pipefail

BOLD=$'\033[1m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'; RESET=$'\033[0m'

WT_PATH="${1:-$(pwd)}"
cd "$WT_PATH"
ROOT=$(git rev-parse --show-toplevel)
BRANCH=$(git branch --show-current 2>/dev/null || echo "detached")
HEAD=$(git rev-parse --short HEAD)
TS=$(date +%Y%m%d-%H%M%S)
SAFE_BRANCH=$(echo "$BRANCH" | tr '/' '-')
BACKUP="${BACKUP_DIR:-$HOME/mde-dirty-backup-$TS}"

mkdir -p "$BACKUP"
echo "${BOLD}Backing up worktree${RESET}"
echo "  path:   $WT_PATH"
echo "  branch: $BRANCH @ $HEAD"
echo "  dest:   $BACKUP"
echo

git status --porcelain > "$BACKUP/status.txt"
git diff > "$BACKUP/tracked-uncommitted.patch" 2>/dev/null || true
git diff --cached > "$BACKUP/staged.patch" 2>/dev/null || true
git stash list > "$BACKUP/stash-list.txt"
git log -20 --oneline > "$BACKUP/recent-log.txt"
git rev-parse origin/main > "$BACKUP/origin-main-sha.txt" 2>/dev/null || true
echo "$HEAD" > "$BACKUP/head-sha.txt"
echo "$BRANCH" > "$BACKUP/branch.txt"

# Bundle current branch if not detached
if [ "$BRANCH" != "detached" ] && [ -n "$BRANCH" ]; then
  git bundle create "$BACKUP/branch-${SAFE_BRANCH}.bundle" "$BRANCH" 2>/dev/null || \
    echo "${YELLOW}⚠ bundle failed (shallow or empty branch) — patches still saved${RESET}"
fi

# Untracked: rsync top-level dirs that commonly hold WIP (avoid copying entire github/ mirrors)
UNTRACKED_LIST="$BACKUP/untracked-paths.txt"
git ls-files --others --exclude-standard > "$UNTRACKED_LIST" || true
UNTR_COUNT=$(wc -l < "$UNTRACKED_LIST" | tr -d ' ')

if [ "$UNTR_COUNT" -gt 0 ] && [ "$UNTR_COUNT" -le 2000 ]; then
  mkdir -p "$BACKUP/untracked"
  while IFS= read -r f; do
    [ -f "$f" ] || continue
    mkdir -p "$BACKUP/untracked/$(dirname "$f")"
    cp -a "$f" "$BACKUP/untracked/$f" 2>/dev/null || true
  done < "$UNTRACKED_LIST"
elif [ "$UNTR_COUNT" -gt 2000 ]; then
  echo "${YELLOW}⚠ $UNTR_COUNT untracked paths — copying selected prefixes only${RESET}"
  for prefix in .agents .cursor supabase/migrations tasks tests/smoke src; do
    [ -e "$prefix" ] && rsync -a "$prefix" "$BACKUP/untracked-$prefix/" 2>/dev/null || true
  done
fi

cat > "$BACKUP/ROLLBACK.txt" <<EOF
Rollback notes ($(date -Iseconds))
Worktree: $WT_PATH
Branch: $BRANCH @ $HEAD
Origin/main: $(cat "$BACKUP/origin-main-sha.txt" 2>/dev/null || echo unknown)

Restore tracked changes:
  cd $WT_PATH && git apply "$BACKUP/tracked-uncommitted.patch"

Restore one untracked file:
  cp -a $BACKUP/untracked/<path> $WT_PATH/<path>

Restore branch from bundle:
  git clone $BACKUP/branch-${SAFE_BRANCH}.bundle -b restored-$SAFE_BRANCH /tmp/restored-$SAFE_BRANCH

Reflog (if reset --hard):
  git reflog
EOF

echo "${GREEN}${BOLD}Backup complete:${RESET} $BACKUP"
echo "  status lines: $(wc -l < "$BACKUP/status.txt" | tr -d ' ')"
echo "  untracked:    $UNTR_COUNT paths (see untracked/ or untracked-*)"
echo "  rollback:     $BACKUP/ROLLBACK.txt"
echo
echo "${YELLOW}Do not run git clean, reset --hard, worktree remove --force, or branch -D until rollback path is understood.${RESET}"
