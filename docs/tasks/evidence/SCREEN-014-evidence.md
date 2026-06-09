# SCREEN-014 evidence — 2026-05-24

## Commands

```text
npm run floor                              → exit 0 (106 tests)
npx playwright test e2e/screens/SCREEN-014 → 5/5
curl :3001/events/reina-de-antioquia-2026-finals → 200
curl :3001/events/not-a-real-slug                → 404
curl :3001/events/22222222-2222-2222-2222-000000000001 → 200 (UUID fallback)
```

## Route + data

- `mdeapp/src/app/events/[slug]/page.tsx` — server fetch via `getPublicEvent`
- `mdeapp/src/lib/events/get-public-event.ts` — slug or UUID, published/live + active
- Tiers from `event_tickets` (4 tiers on Reina de Antioquia seed event)

## Playwright

- Spec: `mdeapp/e2e/screens/SCREEN-014-event-detail.spec.ts`
- Desktop: tiers, Buy → `booking-checkout-modal`, UUID route
- Mobile: sticky buy bar → checkout modal
- Console clean on both viewports (no critical page errors)
- Screenshots:
  - `mdeapp/tmp/screenshots/SCREEN-014/desktop-event-detail.png`
  - `mdeapp/tmp/screenshots/SCREEN-014/mobile-event-detail.png`

## Persona impact

Andrés opens Buy tickets from chat (`/events/{id}`) or share link (`/events/reina-de-antioquia-2026-finals`) → sees tiers + checkout shell (Stripe blocked on F11/EVT-01 until SCREEN-009).

## Files added

- `src/lib/events/{types,event-lookup,format-event,get-public-event}.ts`
- `src/components/events/event-detail-view.tsx`
- `src/components/modals/booking-checkout-modal.tsx`
- `src/app/events/[slug]/{page,not-found}.tsx`
