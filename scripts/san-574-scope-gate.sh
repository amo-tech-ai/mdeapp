#!/usr/bin/env bash
# SAN-574 — fail if diff touches out-of-scope paths.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

BASE="${1:-origin/main}"
MERGE_BASE="$(git merge-base "$BASE" HEAD 2>/dev/null || echo "$BASE")"
CHANGED="$(
  {
    git diff --name-only "$MERGE_BASE"...HEAD 2>/dev/null
    git diff --name-only
    git diff --name-only --cached
    git ls-files --others --exclude-standard
  } | sort -u
)"

if [[ -z "$CHANGED" ]]; then
  echo "SAN-574 scope gate: no changed files vs $BASE"
  exit 0
fi

BLOCKED="$(echo "$CHANGED" | rg \
  '^src/.*(app/.+/page\.tsx|mastra/|api/copilotkit|chat-nav-rail|events/page|cafes/page|rentals/page)' || true)"

if [[ -n "$BLOCKED" ]]; then
  echo "FAIL SAN-574 scope gate — out-of-scope paths:"
  echo "$BLOCKED"
  exit 1
fi

echo "SAN-574 scope gate: PASS"
