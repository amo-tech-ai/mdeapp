# SCREEN-012 evidence — trips dashboard

**Date:** 2026-05-20  
**Task:** [`tasks/screens/SCREEN-012-trips-dashboard.md`](../screens/SCREEN-012-trips-dashboard.md)

## Deliverables

| File | Purpose |
|------|---------|
| `mdeapp/src/app/trips/page.tsx` | Dashboard shell + empty/sign-in states |
| `mdeapp/src/app/trips/[id]/page.tsx` | Workspace stub (`trips-workspace`) for SCREEN-013 |
| `mdeapp/src/lib/trips/load-user-trips.ts` | RLS-scoped trip load + date formatter |
| `mdeapp/src/components/trips/trips-dashboard-grid.tsx` | Trip cards → `/trips/[id]` |
| `mdeapp/src/components/chat/chat-nav-rail.tsx` | `nav-trips-link` |
| `mdeapp/e2e/screens/SCREEN-012-trips.spec.ts` | Playwright 3/3 |

## Verification

```bash
cd mdeapp
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/trips   # 200
npm test                                    # 151/151
npm run floor                               # exit 0
npx playwright test e2e/screens/SCREEN-012-trips.spec.ts  # 3/3
```

## Runtime proof

- Dev server: `E2E_BYPASS_AUTH=1 npm run dev` — UI `:3001`
- Browser MCP: `/trips` shows `trips-dashboard` + `trips-empty-signin`; nav `nav-trips-link` from `/` works

## Persona impact

**Camila** sees trip hub at `/trips` (empty until she creates trips from chat shortlists in Phase 2). Click-through lands on workspace stub pending SCREEN-013 itinerary panel.

## Grade: **A** (spec met, tests green, RLS via server client)
