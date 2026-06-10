# SCREEN-009 evidence — 2026-06-06 (updated; original 2026-05-24)

## Commands

```text
npm run floor                                              → exit 0 (110 tests)
npx playwright test e2e/screens/SCREEN-009-checkout.spec.ts → 3/3
npm run smoke:ticket-checkout                              → ✅ stripeSessionUrl + orderId
curl :3001/events/reina-de-antioquia-2026-finals?checkout=success → success notice
```

## UI

- `mdeapp/src/components/modals/booking-checkout-modal.tsx` — buyer name/email, POST `/api/tickets/checkout`, `window.location.assign(stripeSessionUrl)`
- `mdeapp/src/components/events/event-checkout-notice.tsx` — post-return banner (`checkout=success|cancelled`)
- `data-testid`: `booking-checkout-modal`, tier buy buttons on event detail

## Playwright

- Spec: `mdeapp/e2e/screens/SCREEN-009-checkout.spec.ts`
- Desktop: buy flow mocks API → redirect; success notice on query param
- Mobile: sticky buy bar → checkout modal

## Vitest

- `commerce-schemas.test.ts` — ticket checkout Zod

## Acceptance

| Criterion | Status |
|-----------|--------|
| Modal never calls Stripe from browser | ✅ server proxy only |
| POST returns session URL | ✅ smoke + live edge |
| Return URL confirmation UX | ✅ EventCheckoutNotice |
| Webhook → paid | ✅ **live end-to-end proof (2026-06-06)** — see below |

## Live E2E proof — 2026-06-06

Full browser run on localhost:3001 using Stripe test card `4242 4242 4242 4242`.

| Step | Evidence |
|---|---|
| Event page + ticket tiers | `SCREEN-009-checkout-modal.png` |
| Stripe hosted checkout | `SCREEN-009-stripe-card.png` — card `4242…4242`, expiry `12/28`, CVC `123` |
| Success redirect | `http://localhost:3001/events/reina-de-antioquia-2026-finals?checkout=success&session_id=cs_test_a10RHa9v6...` |
| Success banner | `SCREEN-009-success-banner.png` — "Payment received — check your email for tickets" |
| Wallet QR | `SCREEN-009-wallet-qr.png` — "Order MDE-6823C09861 · Paid COP 40,000 · Andrés Test · scan at door" |

**DB proof (live query 2026-06-06T10:52 UTC):**

| Field | Value |
|---|---|
| `event_orders.id` | `f587dc66-c9fc-40f4-a983-b333fd3dd465` |
| `short_id` | `MDE-6823C09861` |
| `status` | `paid` |
| `stripe_session_id` | `cs_test_a10RHa9v6xBfSH5V9jc3NrF36pvpi0wH5zJI6au3NXaDhABNwxqRbkMijH` |
| `buyer_email` | `andres+test@mdeai.co` |
| `attendee_status` | `active` |
| `has_qr_token` | `true` |
| Webhook event | `stripe_evt_1TfHqVFAkFMiToA1uUnczmGd` (logged in `idempotency_keys` at 10:52:56 UTC) |
| Time to finalize | ~2 min (session created 10:50:50 → paid 10:52:55 UTC) |

## Persona impact

Andrés on `/events/reina-de-antioquia-2026-finals` picks GA tier → Stripe Checkout → success banner → QR wallet at `/me/tickets/{order_id}?token={access_token}` — scan at door.
