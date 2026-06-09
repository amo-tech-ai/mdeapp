# SCREEN-008 evidence — 2026-05-24

## Commands

```text
npm run floor                                              → exit 0
npx playwright test e2e/screens/SCREEN-008-schedule-viewing.spec.ts → 2/2
npm run smoke:lead-capture                                 → ✅ (live edge + DB row)
```

## UI

- `mdeapp/src/components/modals/schedule-viewing-modal.tsx` — name, email, phone, preferred time; POST `/api/leads/schedule-viewing`
- `mdeapp/src/components/chat/lead-confirmation-banner.tsx` — `data-testid="lead-confirmation-card"`
- CTAs: `rental-schedule-cta`, `venue-detail-schedule-cta`, `schedule-viewing-submit`

## Playwright

- Spec: `mdeapp/e2e/screens/SCREEN-008-schedule-viewing.spec.ts`
- Desktop: chat rental card → modal → mock/live submit → confirmation card
- Mobile: venue sheet schedule path

## Vitest

- `mdeapp/src/lib/leads/__tests__/commerce-schemas.test.ts` — schedule viewing Zod

## Persona impact

Camila taps Schedule viewing on a Laureles rental → confirmation banner in chat chrome; lead lands in Supabase for Patricia's CRM.
