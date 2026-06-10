# F50 evidence — 2026-05-20 (Done)

## Status: **Done**

## Automated

```bash
cd mdeapp && npm test      # 82/82
npm run lint && npm run typecheck && npm run build
npm run smoke:f50-pin-sync   # card ↔ pin sync
npm run verify:console         # 0 critical
npm run floor                  # exit 0 (incl. audit --audit-level=high)
```

### `npm run smoke:f50-pin-sync`

```text
✅ Card click → selected card (rental-a0000000-0000-4000-a000-000000000001)
   map pin transform: matrix(1.15, 0, 0, 1.15, 0, 0)
✅ Pin click → card stays selected (F50 pin ↔ card sync)
```

## Implementation

| Path | Purpose |
|------|---------|
| `platform/contracts/map-ui-state.ts` | `MapUiStateSchema` |
| `components/copilot/map-ui-sync.tsx` | debounced `mapUi` → `useCoAgent` |
| `components/copilot/focus-map-pin-action.tsx` | `focusMapPin` (+ `rental-` id resolve) |
| `components/maps/MapFocusController.tsx` | `useMap().panTo` |
| `components/copilot/rental-card.tsx` | click + `data-selected` highlight |
| `components/copilot/search-tool-renders.tsx` | `rentalPinId`, card click → `panToPin`, scroll-into-view |
| `scripts/smoke-f50-pin-sync.mjs` | Playwright proof |

## Pin ID contract

Map pins use `rental-{listingUuid}` (`normalize-tool-output.ts`). Rental cards now use the same id for `data-pin-id`, selection, and `panToPin`.

## Manual (optional)

1. `http://localhost:3001/` → rental query → click card → map pin scales up.
2. Click map pin → card ring + scroll into view in sidebar.
