# ADR-001: Standalone Mercur Commerce (Phase 1)

**Status:** Accepted  
**Date:** 2026-06-07  
**Linear:** [SAN-629](https://linear.app/sanjiovani/issue/SAN-629) · **Gate:** [ECOM-C-018](../tasks/ECOM-C-018-core-commerce-exit-gate.md)

## Context

mdeai needs a marketplace commerce backend for Camila (buyer) and future sellers. Phase 1 must prove **paid checkout** before any AI bridge, embeddings, or multi-vendor payouts. The team chose [Mercur](https://docs.mercurjs.com/getting-started/introduction) (Medusa 2 + marketplace modules) scaffolded at `commerce/mercur/`, not a second buyer storefront.

## Decision

| Layer | Owner | Path / rule |
|-------|--------|-------------|
| **Commerce truth** | Mercur (Medusa 2) | `commerce/mercur/` |
| **Buyer UI (Phase 2+)** | mdeapp | `mdeapp/src` — AI concierge only after C-018 |
| **Embeddings, trips, events, venues** | Supabase | Link via `medusa_product_id` — **read-only mirror** |
| **Payment state** | Stripe (via Medusa payment module) | `STRIPE_*` in `/commerce` namespace |
| **Communication** | HTTP Store/Admin API + `@medusajs/js-sdk` | No shared DB between mdeapp and Mercur |

### Data ownership

| Domain | System of record | Notes |
|--------|------------------|-------|
| Products, variants, prices | Mercur | 20+ SKUs seeded for seller `mdeai` |
| Inventory, stock locations | Mercur | Seller-linked locations for shipping |
| Carts, orders, fulfillments | Mercur | Paid order proof: `payment_status: captured` |
| Sellers, commissions (later) | Mercur | Phase 1: single demo seller only |
| Product embeddings | Supabase | Phase 2+ sync from Mercur — not source of price/stock |
| Events, venues, trips | Supabase | Existing mdeai verticals — separate from commerce cart |
| Payment intents, charges | Stripe | Medusa webhook `/hooks/payment/stripe_stripe` |

**Invariant:** No mutable commerce truth in Supabase (no product/price/inventory tables as authority).

### Architecture boundary

```text
Camila (Phase 2)          Roberto / sellers
      │                           │
      ▼                           ▼
  mdeapp /chat              Mercur vendor UI
  (CopilotKit)              :9000/seller
      │                           │
      │    @medusajs/js-sdk       │
      └──────────┬────────────────┘
                 ▼
         commerce/mercur :9000
         (products, carts, orders)
                 │
                 ▼
            Stripe test
         (no Connect Phase 1)
```

### Phase 1 payment

- Provider: `@medusajs/medusa/payment-stripe` only
- **No** `@mercurjs/payout-stripe-connect` until post–single-vendor proof and explicit Phase 4+ decision
- Webhook: `http://localhost:9000/hooks/payment/stripe_stripe` (separate from mdeai events `ticket-payment-webhook`)

## Non-goals (Phase 1)

- CopilotKit / Mastra product search or ProductCards in mdeapp
- Supabase product catalog or cart tables
- Stripe Connect / seller payouts
- Second buyer storefront (`b2c-marketplace-storefront` clone)
- `medusajs/medusa` monorepo clone (use Mercur CLI + npm `@medusajs/*`)
- Vendor self-registration flows beyond demo seller `mdeai`
- Production live Stripe keys in `commerce/.env`

## Consequences

**Positive**

- Clear audit boundary for Phase 1 evidence (boot, catalog, Stripe, paid order)
- Events Stripe and commerce Stripe namespaces stay isolated
- Phase 2 (C-007 SDK wrapper, C-008 proxy) has a signed prerequisite (C-018)

**Negative / trade-offs**

- Mercur requires seller-linked shipping options (not stock Medusa seed alone)
- Local dev needs Postgres (`mercur` DB), Redis, Bun, and `stripe listen`
- ADR must be updated before enabling Connect or Supabase commerce mirrors

## References

- Mercur installation: https://docs.mercurjs.com/getting-started/installation
- Medusa Stripe provider: https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider/stripe
- Boot + proof: `commerce/mercur/BOOT.md`
- Task index: `docs/ecommerce/tasks/INDEX.md`
