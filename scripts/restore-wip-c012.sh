#!/usr/bin/env bash
# Copy C-012 café files from drafts/wip-pr4-off-src — does not commit.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WIP="${ROOT}/../drafts/wip-pr4-off-src"
APP="${ROOT}"

if [[ ! -d "$WIP" ]]; then
  echo "Missing WIP dir: $WIP" >&2
  exit 1
fi

copy() {
  local src="$1" dest="$2"
  mkdir -p "$(dirname "$dest")"
  cp "$WIP/$src" "$dest"
  echo "  $dest"
}

echo "Restoring C-012 café paths from WIP..."
copy place-details.ts "${APP}/src/lib/place-details.ts"
copy place-details.test.ts "${APP}/src/lib/place-details.test.ts"
copy cafe-ask-prompts.ts "${APP}/src/lib/cafe-ask-prompts.ts"
copy places/detail/route.ts "${APP}/src/app/api/places/detail/route.ts"
copy use-place-details.ts "${APP}/src/hooks/use-place-details.ts"
copy cafe-result-card.tsx "${APP}/src/components/copilot/cafe-result-card.tsx"
copy cafe-result-card.test.tsx "${APP}/src/components/copilot/__tests__/cafe-result-card.test.tsx"
copy cafe/cafe-detail-panel.tsx "${APP}/src/components/cafe/cafe-detail-panel.tsx"
copy cafe-booking-sheet.tsx "${APP}/src/components/sheets/cafe-booking-sheet.tsx"
copy SCREEN-021-cafe-listings.spec.ts "${APP}/e2e/screens/SCREEN-021-cafe-listings.spec.ts"
copy search-grounded-places-quality.test.ts "${APP}/src/mastra/tools/__tests__/search-grounded-places-quality.test.ts"
echo "Done. Run wiring + floor before commit."
