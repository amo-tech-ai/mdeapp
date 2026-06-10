# SAN-574 — D-08 VenueCardShell + BrowseLayout

**Date:** 2026-06-05 · **Branch:** `ai/san-574-d-08-shared-browse-system`

## Scope gate

```bash
cd mdeapp && bash scripts/san-574-scope-gate.sh origin/main
# SAN-574 scope gate: PASS
```

No changes to: routes, nav, Mastra, CopilotKit, maps, APIs.

## Vitest

| Suite | Result |
|-------|--------|
| `venue-card-shell` | PASS |
| `browse-layout` | PASS |
| `restaurant-card` | PASS |
| `cafe-result-card` | PASS |
| `rental-card-copy` | PASS |
| `domain-results` | PASS |

## Playwright (selectors unchanged)

| Spec | Result |
|------|--------|
| `SCREEN-023-restaurant-listings.spec.ts` | 2/2 PASS |
| `SCREEN-022-nightlife-browse.spec.ts` | 3/3 PASS |
| `san-574-visual-evidence.spec.ts` (browse) | 6/6 PASS |

## Screenshots (post-migration)

| File | Viewport |
|------|----------|
| `375-restaurants.png` | mobile |
| `768-restaurants.png` | tablet |
| `1280-restaurants.png` | desktop |
| `375-nightlife.png` | mobile |
| `768-nightlife.png` | tablet |
| `1280-nightlife.png` | desktop |

Chat card screenshots (`1280-chat-*.png`) — run:

```bash
cd mdeapp
SAN574_EVIDENCE_DIR=../tasks/testing/evidence/2026-06-05/san-574 \
  npx playwright test e2e/san-574-visual-evidence.spec.ts --grep "chat cards" --project=chromium
```

## Files touched

- `src/components/browse/venue-card-shell.tsx` (internal)
- `src/components/browse/BrowseLayout.tsx`
- Wrappers: `restaurant-card`, `cafe-result-card`, `rental-card`, `nightlife-browse-card`
- Views: `restaurant-browse-view`, `nightlife-browse-view`
- `scripts/san-574-scope-gate.sh`
- `e2e/san-574-visual-evidence.spec.ts`
