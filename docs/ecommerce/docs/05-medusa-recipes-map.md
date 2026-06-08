# Medusa recipes & modules → mdeai tasks

**Date:** 2026-06-08  
**Sources:** [Recipes](https://docs.medusajs.com/resources/recipes) · [Commerce modules](https://docs.medusajs.com/resources/commerce-modules) · [Infrastructure modules](https://docs.medusajs.com/resources/infrastructure-modules) · [Storefront development](https://docs.medusajs.com/resources/storefront-development)  
**Task index:** [`../tasks/INDEX.md`](../tasks/INDEX.md) · **Linear:** [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues)

Maps official Medusa docs to **ECOM-C/M** tasks and **SAN-*** Linear issues. Mercur (`commerce/mercur/`) is the runtime backend; mdeapp is the production buyer UI.

---

## Recipes

| Medusa recipe | mdeai use | Task(s) | Linear | Status |
|---------------|-----------|---------|--------|--------|
| [Ecommerce](https://docs.medusajs.com/recipes/ecommerce) | DTC product → cart → Stripe | C-004, C-006, C-016 | SAN-632, 634, 644 | **Done** |
| [Marketplace](https://docs.medusajs.com/recipes/marketplace) | Multi-vendor via **Mercur** (not Medusa recipe install) | M-001…M-007 | SAN-647–653 | Backlog |
| [Multi-Region Store](https://docs.medusajs.com/recipes/multi-region-store) | EU region today; Colombia later | C-002, C-006, C-021 | SAN-630, 634, 724 | Partial — **no CO region task** |
| [Commerce Automation](https://docs.medusajs.com/recipes/commerce-automation) | AI sells in chat | C-010…C-015, C-019 | SAN-638–643, 720 | Backlog |
| [OMS](https://docs.medusajs.com/recipes/oms) | Ops / refunds after first paid order | C-017 | SAN-645 | Backlog |
| [Bundled Products](https://docs.medusajs.com/recipes/bundled-products) | Trip/event bundles | — | — | **Gap** (Phase 5+) |
| [Digital Products](https://docs.medusajs.com/recipes/digital-products) | Event tickets / passes | M-009 (links only) | SAN-655 | Backlog — not full recipe |
| [Personalized Products](https://docs.medusajs.com/recipes/personalized-products) | Custom merch | — | — | **Gap** |
| [Subscriptions](https://docs.medusajs.com/recipes/subscriptions) | AMO SaaS (out of scope) | — | — | Skip |
| [B2B](https://docs.medusajs.com/recipes/b2b) | Wrong model | — | — | Avoid |
| [POS](https://docs.medusajs.com/recipes/pos) | No retail POS | — | — | Skip |
| [Omnichannel](https://docs.medusajs.com/recipes/omnichannel) | WhatsApp payment links only | M-008 | SAN-654 | Backlog |
| [Integrate ERP](https://docs.medusajs.com/recipes/erp) | No ERP Phase 1 | — | — | Defer |

### `medusajs/examples` folders (pattern library)

| Example folder | Vertical | Task(s) | Linear | Status |
|----------------|----------|---------|--------|--------|
| [agentic-commerce](https://github.com/medusajs/examples/tree/main/agentic-commerce) | AI agent checkout | C-010…C-013 | SAN-638–641 | Backlog |
| [marketplace](https://github.com/medusajs/examples/tree/main/marketplace) | Vendor module reference | M-001 (verify only) | SAN-647 | Backlog — Mercur supersedes |
| [restaurant-marketplace](https://github.com/medusajs/examples/tree/main/restaurant-marketplace) | Venue menus | — | — | **Gap** |
| [ticket-booking](https://github.com/medusajs/examples/tree/main/ticket-booking) | Events / tickets | M-009 | SAN-655 | Backlog — links only |
| [product-rentals](https://github.com/medusajs/examples/tree/main/product-rentals) | Rentals bridge | — | — | **Gap** |
| [product-reviews](https://github.com/medusajs/examples/tree/main/product-reviews) | Seller/product reviews — **Option B policy** (no seed) | **C-022** | SAN-725 | **Done** |
| [wishlist-plugin](https://github.com/medusajs/examples/tree/main/wishlist-plugin) | Saved products | — | — | **Gap** (post-MVP) |
| [bundled-products](https://github.com/medusajs/examples/tree/main/bundled-products) | Experience packs | — | — | **Gap** |

---

## Commerce modules

| Module | Role in mdeai | Task(s) | Status |
|--------|---------------|---------|--------|
| Product | Catalog SKUs | C-005, C-006 | Done |
| Pricing | Variant `calculated_price` | C-006 | Done |
| Inventory | Stock / locations | C-006 | Done |
| Region | EU (`fr`, `de`, …) | C-002, C-021 | Partial |
| Cart | Chat add-to-cart | C-012, C-015 | Backlog |
| Customer | Guest + linked auth | C-008+ | Backlog |
| Payment | Stripe test (`payment-stripe`) | C-004, C-016 | Done |
| Order | Paid order proof | C-016 | Done |
| Fulfillment | Checkout shipping | C-004, B2C ref | Partial |
| API Key | Publishable key | C-003, C-007 | Done / Todo |
| Sales Channel | Default store | C-002 | Done |
| Store | Store metadata | C-002 | Done |
| Promotion | Promo codes | — | **Gap** — B2C UI only |
| Tax | Colombia rules | — | **Gap** |
| Translation | Spanish UI | — | Phase 2 deferred |
| Loyalty / Store Credit | Retention | — | Post-MVP |

**Mercur-only (not vanilla Medusa recipe):** seller, commission, order-group, payout — M-001…M-007.

---

## Infrastructure modules

| Module | mdeai setup | Task(s) | Status |
|--------|-------------|---------|--------|
| Event (Redis) | `mercur-dev-redis` | C-002 | Dev only |
| Workflow Engine (Redis) | Same Redis | C-002 | Dev only |
| Caching (Redis) | Prod recommended | C-020 | Checklist in C-020 |
| Locking (Redis/Postgres) | Multi-vendor safety | C-020, M-006 | Backlog |
| File (S3 / local) | Product images | C-020 | Checklist in C-020 |
| Notification (SendGrid/local) | Order email | C-020 | Checklist in C-020 |
| Analytics (PostHog/local) | Funnel | M-012 | Backlog |

Prod hardening gates live in **C-020** (`verify-commerce-readiness.mjs`).

---

## Storefront development

| Medusa guidance | mdeai implementation | Task(s) | Linear | Status |
|-----------------|----------------------|---------|--------|--------|
| JS SDK | `src/lib/commerce/medusa-client.ts` | C-007 | SAN-635 | **Done** (not activated in chat) |
| Field-mask policy | [`commerce-store-api-fields.md`](./commerce-store-api-fields.md) | C-022 | SAN-725 | **Done** |
| Server proxy | `/api/commerce/*` | C-008 | SAN-636 | **Next** |
| UX reference | `commerce/b2c-storefront` on `:3000` | C-021 | SAN-724 | **Done** |
| ProductCards in chat | CopilotKit generative UI | C-014 | SAN-642 | Backlog |
| `storefront-best-practices` skill | ProductCard / cart build | C-014, C-015 | SAN-642, 643 | Backlog |

**Rule:** No second production storefront — [ADR-001](../adr/001-standalone-mercur.md).

---

## Active execution order (2026-06-08)

Locked in [ADR-001 § Commerce Module and Recipe Policy](../adr/001-standalone-mercur.md).

| P | Task | Linear | Column |
|---|------|--------|--------|
| 1 | C-007 Medusa SDK wrapper | SAN-635 | **Done** |
| 2 | C-021 B2C evidence closeout | SAN-724 | **Done** |
| 3 | C-022 Field-mask policy | SAN-725 | **Done** |
| 4 | C-008 API proxy | SAN-636 | **Next** |
| 5 | C-010 Mastra product_search | SAN-638 | Backlog (after C-008) |

```text
C-007 → C-022 → C-008 → Phase 3 (C-010…)
         ↑
    ADR field-mask rules propagate to proxy + all Store API callers
```

---

## Open gaps (no task yet)

| Gap | Suggested phase | Notes |
|-----|-----------------|-------|
| Colombia region (`co`) | Phase 2+ | Multi-Region recipe |
| `restaurant-marketplace` | Phase 5 | Venue menus beyond M-011 links |
| `product-rentals` | Phase 5 | Camila rentals ↔ Mercur |
| `wishlist-plugin` | Post-MVP | `/saved` integration |
| Promotion module | C-020 or post-MVP | B2C checkout has UI |
| Bundled / personalized | Phase 5+ | Lifestyle packs |

---

## Related docs

- [`04-repos.md`](./04-repos.md) — repo forensic audit  
- [`../notes/2-notes.md`](../notes/2-notes.md) — recipes/modules narrative  
- [`../tasks/ECOM-C-022-seller-reviews-field-mask.md`](../tasks/ECOM-C-022-seller-reviews-field-mask.md)
