---
id: ECOM-C-004
title: Stripe Test Checkout
phase: 1
priority: P0
complexity: M
status: Done
linear_issue: SAN-632
linear_url: https://linear.app/sanjiovani/issue/SAN-632
---

# ECOM-C-004

# Title

Stripe Test Checkout — Single-Vendor Payment Provider (No Connect)

# Goal

Configure Stripe as Medusa payment provider in Mercur so a test cart can initialize a payment session and accept card `4242…`.

# Business Value

Unlocks paid order proof — the Phase 1 north star. Validates payment isolation from mdeai events Stripe before any marketplace payout complexity.

# Scope

**In scope**

- Stripe **test** API key in Infisical `/commerce`
- Medusa payment provider in `medusa-config.ts` — **standard Stripe**, not `@mercurjs/payment-stripe-connect`
- Region (Colombia or US) has Stripe enabled in admin
- Webhook endpoint for Mercur only (e.g. `http://localhost:9000/hooks/payment/stripe` or Medusa default)
- `stripe listen --forward-to` documented for local dev
- `STRIPE_WEBHOOK_SECRET` in env

**Out of scope**

- Stripe Connect / seller payouts
- `STRIPE_PAYOUT_WEBHOOK_SECRET`
- mdeapp checkout UI
- Production live keys
- Affiliates / split payments

# Files Likely Touched

| Path | Action |
|---|---|
| `commerce/mercur/packages/api/medusa-config.ts` | Payment provider block |
| `commerce/mercur/packages/api/.env.template` | Stripe vars |
| `commerce/mercur/BOOT.md` | Stripe listen + webhook section |
| `docs/ecommerce/tasks/testing/stripe-checkout.md` | Optional flow doc |

# Official Documentation

| Topic | URL |
|---|---|
| Medusa Stripe payment provider | https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider/stripe |
| Medusa payment module | https://docs.medusajs.com/resources/commerce-modules/payment |
| Initialize payment session (Store API) | https://docs.mercurjs.com/api-reference/store-payment-collections/initialize-payment-session-of-a-payment-collection |
| Mercur Stripe Connect (reference only — defer) | https://docs.mercurjs.com/how-to-guides/stripe-connect-integration |
| Stripe test cards | https://docs.stripe.com/testing |
| Stripe CLI webhooks | https://docs.stripe.com/webhooks#test-webhooks |

# Dependencies

| Depends on | Blocks |
|---|---|
| ECOM-C-003 (secrets template) | ECOM-C-016 |
| ECOM-C-006 (products to add to cart) | ECOM-C-016 (parallel start after C-003) |

# Acceptance Criteria

- [ ] `STRIPE_API_KEY` (test) loads from env; server starts without payment config error
- [ ] Admin → Region → payment providers includes Stripe
- [ ] Store API: create cart → add variant → create payment collection → initialize Stripe session → returns client secret or session id
- [ ] Webhook signature verified locally via `stripe listen`
- [ ] **No** Stripe Connect provider in `medusa-config.ts` for Phase 1
- [ ] Webhook path documented as separate from mdeai events webhooks
- [ ] Region has default shipping option for cart complete
- [ ] `rg` confirms commerce webhook secrets isolated from events Stripe

# Proof Commands

```bash
cd commerce/mercur/packages/api
# With API running and PK from admin:
PK="${MEDUSA_PUBLISHABLE_KEY:-pk_...}"

# List products (need C-006)
curl -s -H "x-publishable-api-key: $PK" http://localhost:9000/store/products | jq '.products[0].id'

# Create cart
CART=$(curl -s -X POST -H "x-publishable-api-key: $PK" \
  -H "Content-Type: application/json" \
  http://localhost:9000/store/carts -d '{"region_id":"reg_..."}' | jq -r '.cart.id')

# Stripe CLI (separate terminal)
stripe listen --forward-to localhost:9000/hooks/payment/stripe_stripe

# Complete checkout per Medusa Store API docs — document in evidence file
```

# Test Plan

1. Admin: confirm Stripe in region settings
2. Store API cart + line item + payment session init → no 5xx
3. Stripe Dashboard (test mode): payment intent created
4. Webhook event `payment_intent.succeeded` received and verified
5. Negative: wrong webhook secret → 400 (proves verification works)

# Risks

| Risk | Mitigation |
|---|---|
| Accidental Connect setup | Code review: only `@medusajs/medusa/payment-stripe` |
| Webhook collision with events app | Unique endpoint + separate Stripe webhook in dashboard |
| Zero-amount payment session | Ensure cart has priced variant (C-006) |
| Colombia region currency | Match Stripe account capabilities; use USD test region if needed |

# Rollback Plan

Remove payment provider block from `medusa-config.ts`; unset Stripe env vars. Orders remain creatable via manual payment provider for debugging only.

# Estimated Complexity

**M**

# Priority

**P0**
