# SCREEN-015 evidence — 2026-05-24

## Commands

```text
npm run floor                                              → exit 0 (110 tests)
npx playwright test e2e/screens/SCREEN-015-tickets.spec.ts --project=chromium → 3/3
curl :3001/me/tickets                                      → HTTP 200
curl :3001/api/tickets/wallet                              → HTTP 400 (missing params — route live)
npm run smoke:ticket-paid-proof                            → ✅ endpoint checklist + latest pending order
```

## UI

- `/me/tickets` — signed-in list (upcoming/past) or empty state
- `/me/tickets/[id]?token=` — QR detail via `TicketDetailClient` + `react-qr-code`
- `GET /api/tickets/wallet` — server proxy to `get_anonymous_order` RPC (mockable in e2e)
- Checkout handoff: `walletAccessToken` in sessionStorage → `CheckoutWalletLink` on success banner

## Key files

- `mdeapp/src/app/me/tickets/page.tsx`
- `mdeapp/src/app/me/tickets/[id]/page.tsx`
- `mdeapp/src/app/api/tickets/wallet/route.ts`
- `mdeapp/src/components/tickets/ticket-detail-client.tsx`
- `mdeapp/src/components/tickets/ticket-qr-display.tsx`
- `mdeapp/src/lib/tickets/get-wallet-order.ts`

## Playwright

- Spec: `mdeapp/e2e/screens/SCREEN-015-tickets.spec.ts`
- Mocks: `**/api/tickets/wallet**` (client fetch — not Supabase RPC in browser)
- Desktop: empty list + QR detail with token
- Mobile: QR renders

## Acceptance

| Criterion | Status |
|-----------|--------|
| `/me/tickets` route | ✅ |
| QR from `qr_token` | ✅ mocked e2e + live RPC path |
| Token-gated anonymous access | ✅ `?token=` required |
| Post-checkout wallet link | ✅ SCREEN-009 integration |
| Paid order live QR | ⚠️ manual — complete Stripe test payment |

## Persona impact

Andrés returns from Stripe → success banner links to `/me/tickets/[orderId]?token=…` → door-ready QR at venue.

## G1 / F11 follow-ups

- **G1:** Complete test checkout (`4242…`) → verify `event_orders.status=paid` → refresh wallet QR
- **F11:** Rotate distinct `STRIPE_SPONSOR_WEBHOOK_SECRET` (see `tasks/notes/F11-evidence.md`)
