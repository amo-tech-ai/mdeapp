# 06 — Map pin sync smoke

## API (maps-smoke.mjs)

```bash
node tasks/testing/scripts/maps-smoke.mjs --base http://localhost:3001
```

## Playwright

```bash
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-005-rental-card.spec.ts -g "pin sync" --project=chromium
PW_SKIP_WEBSERVER=1 npx playwright test e2e/maps-grounding.spec.ts --project=chromium
```

## Manual

- `mapId` on parent `<Map>`
- `[data-testid="map-pin"]` after search
- Card click → `data-selected=true` + pin visible
- Mobile 390px — `MapMobileSheet` opens
