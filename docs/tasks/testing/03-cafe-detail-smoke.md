# 03 — Café detail panel smoke (Phase A.5)

**Target:** `http://localhost:3001/` (restart dev first — see `INDEX.md`)

**Tools:** Cursor Browser MCP · Playwright `e2e/screens/SCREEN-021-cafe-listings.spec.ts`

## Setup (required)

```bash
cd /home/sk/mdeai/mdeapp
pkill -f "next dev" 2>/dev/null; pkill -f "mastra dev" 2>/dev/null; sleep 2
npm run dev
curl -s -o /dev/null -w "GET / -> %{http_code}\n" http://localhost:3001/
```

## Primary prompt

```
Quiet cafés near Laureles
```

## Browser flow

1. Navigate to `http://localhost:3001/`
2. Send primary prompt in CopilotKit textarea
3. Wait for `[data-testid="grounded-card"][data-result-kind="cafe"]` (up to 120s)
4. Click **Details** on first card
5. Assert `[data-testid="map-panel"][data-right-column-mode="detail"]`
6. Assert `[data-testid="cafe-detail-panel"]` with tabs Overview / Reviews / Location
7. Click `[data-testid="cafe-detail-close"]` → map mode returns
8. Re-open detail → click first `[data-testid="cafe-ask-prompt"]` → panel stays open, user message in chat

## Pass matrix

| # | Check | Pass criteria |
|---|-------|---------------|
| 1 | Dev boot | `npm run dev` clean; GET `/` 200 |
| 2 | Cards | Ranked `grounded-card` in center; no duplicate Map results strip |
| 3 | Right column | Detail replaces map slot, not modal sheet |
| 4 | Places enrich | `/api/places/detail?placeId=` 200 when placeId present |
| 5 | Close | × restores map instantly |
| 6 | Ask prompts | Injects chat; panel stays open |
| 7 | Siblings | `cafe-sibling-rail` from same search only |
| 8 | No invented facts | Hours/phone/website only from Places or grounding |
| 9 | Mobile | Bottom sheet detail below `lg`; no duplicate desktop panel |
| 10 | Console | No critical errors |

## Playwright

```bash
cd /home/sk/mdeai/mdeapp
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-021-cafe-listings.spec.ts --project=chromium --workers=1
```

## Evidence

Save under `tasks/testing/evidence/YYYY-MM-DD/`:

- `cafe-detail-before.png` — cards + map
- `cafe-detail-open.png` — right column panel
- `cafe-detail-closed.png` — map restored
- `RESULTS.md` — PASS/FAIL matrix
