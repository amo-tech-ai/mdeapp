---
id: ECOM-C-016
title: Paid Order Proof
phase: 1
priority: P0
complexity: M
status: Done
linear_issue: SAN-644
linear_url: https://linear.app/sanjiovani/issue/SAN-644
---

# ECOM-C-016

# Title

Paid Order Proof — End-to-End Test Card Purchase

# Goal

Complete one real checkout in Mercur using Stripe test mode: cart → payment → order with captured payment.

# Business Value

Phase 1 north star. Proves commerce engine works before any AI or mdeapp investment. Unblocks ECOM-C-018 exit gate and Phase 2 bridge work.

# Scope

**In scope**

- Full Store API checkout sequence OR documented admin-assisted flow with Stripe
- Test card `4242 4242 4242 4242`
- Order visible in Mercur admin with payment status captured/paid
- Evidence file: `tasks/testing/evidence/YYYY-MM-DD/commerce-paid-order.md` (Store API flow — **not** CopilotKit/AI)
- Stripe Dashboard screenshot or payment intent id recorded
- Webhook delivery confirmed

**Out of scope**

- mdeapp UI checkout
- CopilotKit cart actions
- Multi-item multi-seller carts
- Stripe Connect transfers
- Refunds / disputes
- Email notifications (Resend optional)

# Files Likely Touched

| Path | Action |
|---|---|
| `tasks/testing/evidence/YYYY-MM-DD/commerce-paid-order.md` | Evidence |
| `commerce/mercur/BOOT.md` | Checkout proof command section |
| `scripts/commerce/paid-order-smoke.mjs` | Optional automation |

# Official Documentation

| Topic | URL |
|---|---|
| Medusa store cart complete | https://docs.medusajs.com/api/store#carts_postcartsidcomplete |
| Medusa checkout flow | https://docs.medusajs.com/resources/storefront-development/checkout |
| Initialize payment session | https://docs.mercurjs.com/api-reference/store-payment-collections/initialize-payment-session-of-a-payment-collection |
| Stripe test cards | https://docs.stripe.com/testing |
| Medusa order concept | https://docs.medusajs.com/resources/commerce-modules/order |

# Dependencies

| Depends on | Blocks |
|---|---|
| ECOM-C-004 (Stripe provider + webhook) | ECOM-C-018 |
| ECOM-C-006 (products + variants in Store API) | ECOM-C-018 |
| ECOM-C-005 (seller on products) | — |

# Acceptance Criteria

- [ ] One order created via checkout flow (not manual admin order without payment)
- [ ] Order payment status = captured or equivalent paid state in admin
- [ ] Stripe test mode shows matching PaymentIntent succeeded
- [ ] Webhook `payment_intent.succeeded` (or Medusa equivalent) logged/verified
- [ ] Evidence file contains: `order_id`, `cart_id`, `payment_intent_id`, timestamp
- [ ] Single seller on order (no split-order complexity)
- [ ] No mdeapp code changed for this proof

# Proof Commands

```bash
# Automated smoke (if script added):
node scripts/commerce/paid-order-smoke.mjs --base http://localhost:9000

# Manual Store API sequence (document variant_id, region_id):
PK="${MEDUSA_PUBLISHABLE_KEY}"
# 1. POST /store/carts
# 2. POST /store/carts/:id/line-items
# 3. POST /store/carts/:id/payment-collections
# 4. POST /store/payment-collections/:id/payment-sessions (provider: stripe)
# 5. Confirm payment with Stripe test card (client-side or stripe CLI)
# 6. POST /store/carts/:id/complete

# Verify order in admin:
curl -s "http://localhost:9000/admin/orders/$ORDER_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '{id, payment_status, total}'
```

# Test Plan

1. Happy path: one variant, one quantity, test card → order paid
2. Admin UI: order detail shows line items + payment
3. Stripe Dashboard: payment in test mode
4. Re-run with new cart — second order succeeds (no state leak)
5. Failure injection: decline card `4000 0000 0000 0002` → no paid order (optional)

# Risks

| Risk | Mitigation |
|---|---|
| Cart complete without webhook | Ensure `stripe listen` running; check Medusa payment module logs |
| Split-order payment module interference | Single seller cart only |
| Region/shipping missing | Seed default shipping option for region |
| Inventory reservation failures | Seed adequate inventory in C-006 |

# Rollback Plan

Cancel/refund test payment in Stripe Dashboard; delete test orders in admin. No production impact.

# Estimated Complexity

**M**

# Priority

**P0**
