# EVT-01 evidence — 2026-05-24

## Commands

```text
supabase functions deploy ticket-checkout --no-verify-jwt       → OK
supabase functions deploy ticket-payment-webhook --no-verify-jwt → OK
npm run smoke:ticket-checkout                                 → ✅ orderId=f02d5a09-0d14-4243-9465-c4fc465d2794
```

## Production edges (repo root)

- `supabase/functions/ticket-checkout/index.ts` + `config.toml` (verify_jwt=false)
- `supabase/functions/ticket-payment-webhook/index.ts` + `config.toml`
- `supabase/functions/_shared/jwt.ts`

## App proxy

- `mdeapp/src/app/api/tickets/checkout/route.ts` — builds success/cancel URLs with `{CHECKOUT_SESSION_ID}`
- `mdeapp/src/lib/tickets/{ticket-checkout-schema,submit-ticket-checkout}.ts`

## DB proof (checkout session created)

```sql
SELECT id, status, stripe_session_id, buyer_email
FROM event_orders WHERE id = 'f02d5a09-0d14-4243-9465-c4fc465d2794';
-- status=pending, stripe_session_id=cs_test_*
```

## Remaining for full G1

- **F11** — rotate/separate ticket vs sponsor webhook secrets (not executed)
- Manual Stripe test payment → `event_orders.status=paid` via `ticket-payment-webhook` (webhook deployed; paid row proof for SCREEN-015)

## Persona impact

Andrés POST checkout → pending `event_orders` row + Stripe Checkout redirect URL; webhook finalizes ticket after payment.
