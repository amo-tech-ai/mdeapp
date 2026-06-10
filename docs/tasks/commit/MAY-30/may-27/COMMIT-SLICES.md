---
title: Small commit slices — C-010d → C-012 → C-013
updated: 2026-05-28
main_tip: e8d2a60
---

# Small commit slices

Strict order. **Never `git add .`**

## Slice 0 — chore helpers (optional first commit on C-012 branch)

```bash
cd /home/sk/mdeai/mdeapp
git add scripts/commit-staged-guard.mjs scripts/restore-wip-c012.sh scripts/test-prod-gate.mjs package.json
git commit -m "$(cat <<'EOF'
chore(scripts): prod gate + C-012 restore and staged-path guard

Refs tasks/commit/may-27/COMMIT-SLICES.md
EOF
)"
```

## Slice 1 — C-010d (optional test PR)

```bash
git checkout main && git pull
git checkout -b test/c010d-prod-pin-clear-e2e
git cherry-pick f5b18d9   # if on test/rentals-prod-qa-may28
npm run floor
npm run test:prod-gate      # skips unless SMOKE_BASE_URL=https://www.mdeai.co
# open PR — test only
```

## Slice 2 — rental parser fix (separate PR, not C-012)

```bash
git checkout main
git checkout -b fix/rental-nightly-phrase
git cherry-pick 0660507
npm run test -- --run src/lib/__tests__/rental-query-parser.test.ts
npm run floor
```

## C-012 — five small commits

```bash
git checkout main
git checkout -b feat/c012-cafe-places-detail
bash scripts/restore-wip-c012.sh
```

| # | Commit | Files |
|---|--------|-------|
| C12-1 | `feat(cafe): place-details lib and Places detail API` | `src/lib/place-details*`, `src/lib/cafe-ask-prompts.ts`, `src/app/api/places/detail/` |
| C12-2 | `feat(cafe): CafeResultCard and usePlaceDetails hook` | `cafe-result-card*`, `use-place-details.ts` |
| C12-3 | `feat(cafe): detail panel and booking sheet` | `cafe-detail-panel`, `cafe-booking-sheet` |
| C12-4 | `feat(chat): wire café UI in map column and tool renders` | `rental-ui-context`, `chat-map-panel`, `search-tool-renders`, `geo-chat-shell`, `search-grounded-places.ts` |
| C12-5 | `test(cafe): SCREEN-021 and grounding quality filter` | `e2e/screens/SCREEN-021*`, `search-grounded-places-quality.test.ts` |

Before each commit:

```bash
node scripts/commit-staged-guard.mjs c012
npm run floor   # or subset tests for early slices
```

## C-013 — after C-012 merges

```bash
git checkout main && git pull
git checkout -b feat/c013-event-fast-path-panel
# copy event-fast-path-* from WIP only
node scripts/commit-staged-guard.mjs c013
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-006-event-card.spec.ts
npm run floor
```
