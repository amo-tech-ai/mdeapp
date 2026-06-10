# SCREEN-022 / SAN-491 evidence — 2026-06-04

## Scope

`/nightlife` browse page (SAN-491) — mirror SAN-490 `/restaurants`.

## Merge

| Field | Value |
|-------|-------|
| PR | https://github.com/amo-tech-ai/mdeapp/pull/67 |
| Squash SHA | `ae9a1e6` |
| Production deploy | `ae9a1e6` @ 2026-06-04T10:30:31Z |
| Linear | SAN-491 → **Done** (auto on merge) |

## Production smoke (`https://www.mdeai.co`)

| Check | Result | Proof |
|-------|--------|-------|
| `/nightlife` loads | ✅ | `nightlife-page`, 13 cards unfiltered |
| Provenza filter | ✅ | 6 Provenza-only cards; chip `aria-pressed=true` |
| Safety notice | ✅ | `nightlife-safety-notice` copy visible |
| Google Maps links | ✅ | Card `href` → `google.com/maps/search/?api=1&query_place_id=…` |
| Back to Chat | ✅ | Header link `aria-label="Back to chat"` → `/` |
| Anonymous booking gate | ✅ | Chat E2E: `venue-booking-sign-in-gate` or `venue-booking-form` |

### Commands (production)

```bash
cd mdeapp
PROD_SMOKE_BASE_URL=https://www.mdeai.co PW_SKIP_WEBSERVER=1 \
  npx playwright test e2e/screens/SCREEN-022-nightlife-browse.spec.ts --project=chromium
PROD_SMOKE_BASE_URL=https://www.mdeai.co PW_SKIP_WEBSERVER=1 \
  npx playwright test e2e/screens/SCREEN-022-nightlife-listings.spec.ts --project=chromium -g "renders nightlife"
npm test -- --run src/lib/nightlife-browse.test.ts
```

All passed 2026-06-04.

### Screenshots

| File | What |
|------|------|
| [screenshots/SCREEN-022-prod-provenza-2026-06-04.png](./screenshots/SCREEN-022-prod-provenza-2026-06-04.png) | Prod `/nightlife?neighborhood=Provenza` — filters + safety + cards |

Linear comment: production smoke table on SAN-491 (2026-06-04).

## Shipped files (mdeapp)

- `src/lib/nightlife-browse.ts` + `nightlife-browse.test.ts` (4 tests)
- `src/components/nightlife/nightlife-browse-view.tsx`
- `src/components/nightlife/nightlife-browse-card.tsx`
- `src/app/nightlife/page.tsx` + `loading.tsx`
- `src/mastra/tools/search-venue-anchors.ts` (`searchNightclubVenueAnchorsForBrowse`)
- `e2e/screens/SCREEN-022-nightlife-browse.spec.ts`

## Persona

Carlos opens `/nightlife`, filters Provenza, picks a reggaeton club without typing in chat.

## Not in this slice

- Map column on browse (deferred — same as SAN-490)
- Mobile bottom sheet on browse card tap (chat panel unchanged)
