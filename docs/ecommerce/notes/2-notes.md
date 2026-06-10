**Short answer:** You already have the right foundation via Mercur (Medusa v2 + marketplace). Use a small slice of [Medusa recipes](https://docs.medusajs.com/resources/recipes) and [commerce modules](https://docs.medusajs.com/resources/commerce-modules) as pattern libraries; wire the buyer UI through [storefront development](https://docs.medusajs.com/resources/storefront-development) into **mdeapp**, not a second Next app.

---

## Recipes — what to use

From [Medusa Recipes](https://docs.medusajs.com/resources/recipes):

| Recipe | Use for mdeai? | How |
|--------|----------------|-----|
| **[Marketplace](https://docs.medusajs.com/recipes/marketplace)** | ✅ **Yes (MVP+)** | Mercur *is* this — seller, commission, multi-vendor orders. Copy patterns from `medusajs/examples/marketplace` only where Mercur gaps. |
| **[Ecommerce](https://docs.medusajs.com/recipes/ecommerce)** | ✅ **Yes (now)** | Phase 1 DTC: product → cart → Stripe. You’ve done this. |
| **[Multi-Region Store](https://docs.medusajs.com/recipes/multi-region-store)** | ✅ **Yes (now)** | Europe region + `fr` locale in B2C ref. Medellín/colombia region later. |
| **[Commerce Automation](https://docs.medusajs.com/recipes/commerce-automation)** | ✅ **Yes (Phase 3)** | Mastra tools: `product_search`, cart, checkout_link. See `medusajs/examples/agentic-commerce`. |
| **[Bundled Products](https://docs.medusajs.com/recipes/bundled-products)** | 🟡 **Later** | Trip packs, event + merch bundles (M-009…M-013). |
| **[Digital Products](https://docs.medusajs.com/recipes/digital-products)** | 🟡 **Later** | Event tickets / digital passes — overlap with `ticket-booking` example. |
| **[Personalized Products](https://docs.medusajs.com/recipes/personalized-products)** | 🟡 **Later** | Custom merch, AI-personalized listings. |
| **[OMS](https://docs.medusajs.com/recipes/oms)** | 🟡 **Ops phase** | Patricia admin after first paid orders (C-017 playbook). |
| **[Subscriptions](https://docs.medusajs.com/recipes/subscriptions)** | ❌ **Skip Phase 1** | AMO SaaS is separate; not Camila’s lifestyle buyer flow. |
| **[B2B](https://docs.medusajs.com/recipes/b2b)** | ❌ **Avoid** | Quotes/approvals — wrong model. |
| **[POS](https://docs.medusajs.com/recipes/pos)** | ❌ **Skip** | No in-person retail. |
| **[Omnichannel](https://docs.medusajs.com/recipes/omnichannel)** | ❌ **Defer** | WhatsApp links (M-008) are lighter than full omnichannel. |
| **[Integrate ERP](https://docs.medusajs.com/recipes/erp)** | ❌ **Defer** | No ERP in Phase 1. |

**Best non-recipe reference:** [`medusajs/examples`](https://github.com/medusajs/examples) folders already mapped in your audit:

- `agentic-commerce` → C-010…C-013 (AI sells in chat)
- `restaurant-marketplace` → venues/restaurants
- `ticket-booking` → events/Andrés tickets
- `product-rentals` → Camila rentals bridge
- `product-reviews` → fixes your `*seller.reviews` 500 (seed or slimmer field mask)

---

## Commerce modules — what you actually need

From [Commerce Modules](https://docs.medusajs.com/resources/commerce-modules):

### Phase 1–2 (active)

| Module | Role in mdeai |
|--------|----------------|
| **Product** | Catalog (24 SKUs, seller `mdeai`) |
| **Pricing** | EUR prices, variant `calculated_price` |
| **Inventory** | Stock per variant/location |
| **Region** | Europe (`fr`, `de`, …) — match `NEXT_PUBLIC_DEFAULT_REGION` |
| **Cart** | Chat → add-to-cart (C-012) |
| **Customer** | Buyer identity (guest + auth later) |
| **Payment** | Stripe test (`payment-stripe`) — no Connect yet |
| **Order** | Paid order proof (C-016) |
| **Fulfillment** | Shipping options at checkout |
| **API Key** | Publishable key for Store API |
| **Sales Channel** | Default store channel |
| **Store** | Store metadata |

### Phase 3+ (selective)

| Module | When |
|--------|------|
| **Promotion** | Promo codes in checkout (B2C already has UI) |
| **Tax** | Colombia tax rules if selling locally |
| **Translation** | Phase 2 Spanish — deferred per ADR |
| **Loyalty / Store Credit** | Post-MVP retention |

### Skip for now

**Auth** (use mdeapp Supabase auth + link customer), **User** (admin is Mercur dashboard), heavy **Translation** until Phase 2 locale.

Mercur adds marketplace layers on top: **seller, commission, order-group, payout** — not in vanilla Medusa recipes; that’s why you chose Mercur over the [Marketplace recipe](https://docs.medusajs.com/recipes/marketplace) alone.

---

## Infrastructure modules — what you need

From [Infrastructure Modules](https://docs.medusajs.com/resources/infrastructure-modules):

| Module | mdeai setup | Notes |
|--------|-------------|-------|
| **Event (Redis)** | ✅ `mercur-dev-redis` | Required for Mercur dev/prod queues |
| **Workflow Engine (Redis)** | ✅ Same Redis | Order/cart workflows |
| **Caching (Redis)** | ✅ Recommended prod | Store API hot paths |
| **Locking (Redis)** | ✅ Prod | Multi-vendor order safety |
| **File (S3 or local)** | 🟡 Local now | Product images on S3/Cloudinary later |
| **Notification (SendGrid/local)** | 🟡 Later | Order confirmations; WhatsApp is separate |
| **Analytics (PostHog/local)** | 🟡 Later | Commerce funnel in Patricia dashboards |

**Do not duplicate:** Supabase Realtime, Stripe webhooks (Mercur owns `/hooks/payment/stripe_stripe`), Mastra memory (agent state stays in mdeapp).

---

## Storefront development — how it applies

From [Storefront Development](https://docs.medusajs.com/resources/storefront-development):

Medusa’s model: **backend separate from storefront**. For mdeai that means:

| Medusa guidance | mdeai decision |
|-----------------|----------------|
| Build storefront with JS SDK | ✅ `src/lib/commerce/medusa-client.ts` (C-007) |
| Next.js starter optional | ❌ Don’t adopt Medusa’s DTC starter as prod |
| Store API + publishable key | ✅ Server-side in mdeapp; C-008 proxy |
| Reference: b2c-marketplace-storefront | ✅ **Reference only** on `:3000` ([SAN-724](https://linear.app/sanjiovani/issue/SAN-724)) |

**Copy from B2C ref into mdeapp (Phase 2–3):**

- Locale-prefixed routes (`/fr/products/[handle]`)
- Variant picker → add to cart
- Multi-seller cart grouping
- Checkout steps (address → delivery → Stripe Elements)
- Seller block on PDP (“More from this seller”)

**Do not copy:** Full catalog-first IA, Algolia dependency (optional), Fleek branding, second deployable app.

Medusa’s [storefront AI plugin](https://docs.medusajs.com/resources/storefront-development) (`storefront-best-practices` skill) is useful when building ProductCards/cart in **mdeapp**, not when maintaining the B2C clone.

---

## Practical stack map

```text
RECIPES (patterns)          MODULES (runtime)           STOREFRONT (UI)
──────────────────          ─────────────────           ────────────────
Ecommerce ✅                Product, Pricing ✅         mdeapp /chat (prod)
Marketplace ✅ (Mercur)     Cart, Order, Payment ✅     /shop preview (thin)
Multi-Region ✅             Region, Inventory ✅        B2C ref :3000 (UX only)
Commerce Automation →       Customer, Fulfillment ✅    JS SDK + /api/commerce/*
agentic-commerce example

INFRA
─────
Redis Event + Workflow + Cache (prod)
Stripe via Payment module (test keys only Phase 1)
```

---

## What to do next (aligned with Linear Todo)

1. **C-007** — Medusa JS SDK in mdeapp ([storefront dev + JS SDK](https://docs.medusajs.com/resources/storefront-development))
2. **C-008** — `/api/commerce/*` proxy
3. **Seed or skip reviews** — `product-reviews` example or keep slim field mask (your `*seller.reviews` workaround)
4. **Phase 3** — `agentic-commerce` recipe for Mastra tools

**Task map:** [`docs/ecommerce/docs/05-medusa-recipes-map.md`](../docs/05-medusa-recipes-map.md) · **C-022 reviews gap:** [SAN-725](https://linear.app/sanjiovani/issue/SAN-725)