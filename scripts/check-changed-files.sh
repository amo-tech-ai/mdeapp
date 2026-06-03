#!/usr/bin/env bash
# List files changed on this branch vs a base ref (default origin/main) and
# print a test-tier hint, so you run the lowest tier that proves the change
# instead of the full floor. See the lean-dev-flow skill for tier definitions.
#
# Usage: bash scripts/check-changed-files.sh [base-ref]
BASE="${1:-origin/main}"

git fetch origin main --quiet 2>/dev/null || true

changed=$( { git diff --name-only "${BASE}...HEAD"; git diff --name-only; git diff --name-only --cached; git ls-files --others --exclude-standard; } 2>/dev/null | grep -v '^$' | sort -u )

if [ -z "$changed" ]; then
  echo "No changes vs ${BASE}."
  exit 0
fi

echo "Changed files vs ${BASE}:"
printf '  %s\n' $changed
echo

if echo "$changed" | grep -qE '^src/(mastra|lib|hooks)/'; then
  echo "Tier hint: T2 (domain) — run: npm run test:mastra  |  npm run test:lib"
elif echo "$changed" | grep -qE '\.test\.(ts|tsx)$'; then
  echo "Tier hint: T1 — run only the changed test file(s)."
elif echo "$changed" | grep -qE '(package\.json|\.config\.(ts|js|mjs))$'; then
  echo "Tier hint: config — run: npm run check"
else
  echo "Tier hint: T1 — targeted test for the changed area."
fi
