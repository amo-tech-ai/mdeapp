# SCREEN-021 evidence — 2026-05-27

## Scope

Phase A only: ranked café cards from `search-grounded-places`, map pin sync, café venue detail sheet, and booking stub UI. Phase B pgvector rerank and Phase C Supabase booking writes remain pending.

## Implementation proof

Changed app files:

- `mdeapp/src/components/copilot/cafe-result-card.tsx`
- `mdeapp/src/components/copilot/search-tool-renders.tsx`
- `mdeapp/src/components/chat/rental-ui-context.tsx`
- `mdeapp/src/components/sheets/venue-detail-sheet.tsx`
- `mdeapp/src/components/sheets/cafe-booking-sheet.tsx`
- `mdeapp/e2e/screens/SCREEN-021-cafe-listings.spec.ts`
- `mdeapp/e2e/helpers/maps-layout.ts`

## Automated checks

```bash
cd /home/sk/mdeai/mdeapp
npm test -- --run src/components/copilot/__tests__/cafe-result-card.test.tsx src/components/copilot/__tests__/grounded-place-card.test.tsx
# 2 files passed, 7 tests passed

npm run typecheck
# exit 0

npm run lint
# exit 0

npx playwright test e2e/screens/SCREEN-021-cafe-listings.spec.ts --project=chromium --workers=1
# 2 passed

npx playwright test e2e/maps-grounding.spec.ts --project=chromium --workers=1
# 1 passed

npm run floor
# lint, typecheck, build, 70 test files / 280 tests, audit gate: exit 0
```

Audit note: `npm audit --audit-level=high` exits 0. It still reports existing moderate advisories for Next/PostCSS and CopilotKit transitive `uuid`; no new high/critical advisory blocked the floor gate.

## Runtime proof

```bash
cd /home/sk/mdeai/mdeapp
npm run dev
# Next.js ready at http://localhost:3001
# Mastra ready at http://localhost:4111/api

curl -s -o /tmp/mdeapp-home.out -w '%{http_code}' http://localhost:3001/
# 200

curl -s -o /tmp/mdeapp-copilotkit.out -w '%{http_code}' \
  -X POST http://localhost:3001/api/copilotkit \
  -H 'content-type: application/json' \
  --data '{}'
# 400 expected for malformed empty payload; browser/runtime traffic in dev log returned 200

curl -s -o /tmp/mdeapp-mastra.out -w '%{http_code}' http://localhost:4111/api
# 200
```

Dev server was stopped after proof. Ports `3001` and `4111` were clear afterward.

## Product acceptance

- Café query renders ranked grounded cards with `data-testid="grounded-card"` and `data-result-kind="cafe"`.
- Card hover/focus sets `data-selected="true"` and highlights the matching `data-testid="map-pin"`.
- Detail CTA opens `data-testid="venue-detail-sheet"` with `data-venue-kind="cafe"`.
- Booking CTA opens `data-testid="cafe-booking-sheet"` and states that no request is sent yet.
- SCREEN-021 e2e asserts café query does not hit `/api/events/search`.
- Mobile e2e verifies café cards remain usable without horizontal overflow.

## Remaining work

- Phase B: VEC-004 + VEC-005, then semantic rerank/fit scores.
- Phase C: CAFE-001 schema/RLS, then real booking request inserts and status chips.
