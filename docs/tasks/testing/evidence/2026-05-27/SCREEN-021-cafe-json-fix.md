# SCREEN-021 café JSON fix — localhost proof

**Date:** 2026-05-27  
**Environment:** `http://localhost:3001` (fresh `npm run dev` after kill 3001/4111)  
**Query:** `best cafes medellin`

## Restart

```bash
fuser -k 3001/tcp 4111/tcp
cd /home/sk/mdeai/mdeapp && npm run dev
# [ui] Ready on :3001 · [agent] Mastra :4111
```

## Results

| Check | Result | Notes |
|-------|--------|-------|
| GET `/` | PASS 200 | |
| POST `/api/copilotkit` empty | PASS 400 | |
| `chat-smoke.mjs` | PASS | 6/6 API checks |
| `maps-grounding.spec.ts` | PASS | 8.7s |
| SCREEN-021 desktop flow | PASS | cards + map sync + sheets |
| SCREEN-021 mobile overflow | PASS | |
| SCREEN-021 `best cafes medellin` | PASS | no JSON in assistant prose; no bar/lounge titles |
| Playwright total | **4/4 PASS** | 37.4s |

## JSON leak fix verified

- Assistant bubbles (`.copilotKitAssistantMessage`): **no** `"source":"grounding"`, **no** `ChIJ` placeIds, **no** `{"success":true}`
- Cards render: Rituales, PERGAMINO (filtered — no SKYBAR / Café-Bar)
- `Google Maps sources` footer on cards = **GroundingAttribution component** (expected), not model echo

## Filter verified

Titles on `best cafes medellin` did not match `bar & lounge|skybar|cafe bar`.

## Commands

```bash
cd /home/sk/mdeai/mdeapp
node ../tasks/testing/scripts/chat-smoke.mjs --base http://localhost:3001
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-021-cafe-listings.spec.ts e2e/maps-grounding.spec.ts --project=chromium --workers=1
```
