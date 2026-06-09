# F49 evidence — 2026-05-20

## Automated — pass

```bash
cd mdeapp && npm test                    # 80/80
npm run verify:rental-pins               # 1 Laureles row + coords
npm run verify:maps-env                  # MAP-013 gate
```

## Implementation

- `search-tool-renders.tsx` — registry + kebab `useCopilotAction` mirrors (4 search tools)
- `rental-card.tsx` — `data-testid="rental-card"`

## Browser smoke — pass (2026-05-20)

```bash
cd mdeapp && npm run dev   # :3001
npm run smoke:map-pins
```

| Check | Result |
|-------|--------|
| `/` HTTP 200 | ✅ |
| Chat input + response | ✅ |
| `rental-card` count | **5** |
| `map-pin` count | **6** (mock + rental listing pins) |
| Rental pin on map | ✅ (e.g. Cozy Studio Apartment in Laureles) |

**Smoke query:** `1BR apartment in Laureles under 80 dollars per night`

**Fixes applied:** concierge gate (neighborhood + budget → search now); wildcard `useCopilotAction("*")` fallback; smoke waits on `[data-testid="rental-card"]`.

## Grep

- `rg setPins mdeapp/src/mastra` → 0
- `rg useRenderTool mdeapp/src/components/copilot` → 0

## Status

**Done** — anti-fake-done gate 9 satisfied (localhost dev + smoke).
