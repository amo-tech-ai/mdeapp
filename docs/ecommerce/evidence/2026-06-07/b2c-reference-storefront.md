# ECOM-C-021 — B2C reference storefront evidence

**Date:** 2026-06-07  
**Linear:** [SAN-724](https://linear.app/sanjiovani/issue/SAN-724)  
**Task spec:** [`docs/ecommerce/tasks/ECOM-C-021-b2c-reference-storefront.md`](../../tasks/ECOM-C-021-b2c-reference-storefront.md)  
**ADR:** [`docs/ecommerce/adr/001-standalone-mercur.md`](../../adr/001-standalone-mercur.md)

## Runtime URLs

| Service | URL | Role |
|---------|-----|------|
| Mercur Store API | `http://localhost:9000` | Commerce truth (backend) |
| Mercur health | `http://localhost:9000/health` | Liveness |
| B2C reference storefront | `http://localhost:3000` | Reference buyer UI only |
| mdeapp (production buyer) | `http://localhost:3001` | **Not modified** by C-021 |

**B2C env:** `commerce/b2c-storefront/.env.local` (gitignored) — `MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`, `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_DEFAULT_REGION=fr`, `NEXT_PUBLIC_STRIPE_KEY` (test).

---

## Verification results

| Check | URL / command | Result |
|-------|---------------|--------|
| Mercur health | `GET /health` | **200** |
| Product listing (Store API) | `GET /store/products?region_id=…&fields=<safe>` | **200**, `count: 24` |
| Product listing (B2C UI) | `http://localhost:3000/fr/categories` | **200**, 12+ product cards with EUR prices |
| Product detail (B2C UI) | `http://localhost:3000/fr/products/mdeai-boutique-sandals` | **200**, variant selector + **ADD TO CART** |
| Product detail (seed handles) | `http://localhost:3000/fr/products/t-shirt` | **200** |
| Cart | `http://localhost:3000/fr/cart` | **200**, 2 line items, total **€20.00** |
| Checkout address step | `http://localhost:3000/fr/checkout?step=address` | **200**, shipping form + payment section (Credit card / Manual) |
| Cart API (direct) | `POST /store/carts` + `POST …/line-items` | **200**, 1 item added |

---

## Commands used

```bash
# Health
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:9000/health

# Region (publishable key from commerce/.env — do not commit)
source commerce/.env
curl -s http://localhost:9000/store/regions \
  -H "x-publishable-api-key: $MEDUSA_PUBLISHABLE_KEY"

REGION=reg_01KTHTXVGSPF1F6V33D3KSCQXX   # example from live run

# Safe field mask (200)
SAFE='*variants.calculated_price,+variants.inventory_quantity,*seller,*variants,*seller.products,*seller.products.variants,*attribute_values,*attribute_values.attribute'
curl -s -o /dev/null -w "safe:%{http_code}\n" \
  "http://localhost:9000/store/products?limit=3&region_id=$REGION&fields=$SAFE" \
  -H "x-publishable-api-key: $MEDUSA_PUBLISHABLE_KEY"

# Broken field mask (500) — documents C-022 root cause
curl -s -o /dev/null -w "broken:%{http_code}\n" \
  "http://localhost:9000/store/products?limit=1&region_id=$REGION&fields=*seller.reviews" \
  -H "x-publishable-api-key: $MEDUSA_PUBLISHABLE_KEY"

# B2C pages
curl -sL -o /dev/null -w "%{http_code} categories\n" http://localhost:3000/fr/categories
curl -sL -o /dev/null -w "%{http_code} pdp\n" http://localhost:3000/fr/products/mdeai-boutique-sandals
curl -sL -o /dev/null -w "%{http_code} cart\n" http://localhost:3000/fr/cart
curl -sL -o /dev/null -w "%{http_code} checkout\n" http://localhost:3000/fr/checkout

# Cart create + line item
curl -s -X POST http://localhost:9000/store/carts \
  -H "x-publishable-api-key: $MEDUSA_PUBLISHABLE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"region_id\":\"$REGION\"}"
# → cart_… then POST /store/carts/{id}/line-items → 200, items: 1
```

---

## Screenshots

| Page | File |
|------|------|
| Categories / product grid | [`screenshots/b2c-categories.png`](./screenshots/b2c-categories.png) |
| PDP (Boutique Sandals) | [`screenshots/b2c-pdp-sandals.png`](./screenshots/b2c-pdp-sandals.png) |
| Cart (2 items) | [`screenshots/b2c-cart.png`](./screenshots/b2c-cart.png) |
| Checkout address step | [`screenshots/b2c-checkout-address.png`](./screenshots/b2c-checkout-address.png) |

---

## Field-mask issue (discovered)

### Symptom

Upstream Mercur B2C default product `fields` mask requests seller review relations. Local Mercur (reviews **not seeded**) returns **HTTP 500** when `*seller.reviews*` is included.

### Root cause

Store API expands `*seller.reviews`, `*seller.reviews.customer`, `*seller.reviews.seller` but no review rows exist in the local Mercur DB → server error. Confirmed:

| Mask | HTTP |
|------|------|
| `fields=*seller.reviews` (with `region_id`) | **500** |
| Safe mask (below) | **200**, 24 products |

### Upstream mask (removed)

From `mercurjs/b2c-marketplace-storefront` default in `listProducts`:

```text
*seller.reviews,*seller.reviews.customer,*seller.reviews.seller
```

Full upstream `fields` string:

```text
*variants.calculated_price,+variants.inventory_quantity,*seller,*variants,*seller.products,*seller.reviews,*seller.reviews.customer,*seller.reviews.seller,*seller.products.variants,*attribute_values,*attribute_values.attribute
```

### Safe workaround (reference tree only)

> **Repo note:** `commerce/b2c-storefront/` is a **local reference clone** (not committed to mdeapp git per ADR — no second storefront in repo). The patch below was applied on disk during SAN-724 verification. Auditable diff: [`b2c-products-field-mask.patch`](./b2c-products-field-mask.patch).

**Local path (dev machine):** `commerce/b2c-storefront/src/lib/data/products.ts`

1. **Removed** `*seller.reviews,*seller.reviews.customer,*seller.reviews.seller` from `fields`.
2. **Guarded** client filter: `prod.seller?.reviews?.filter(...) ?? []` (was throwing when `reviews` undefined).

### Recommended safe field mask (mdeapp + C-022 policy)

Use for `sdk.store.product.list` / `retrieve` until reviews are seeded (SAN-725 Option B):

```text
*variants.calculated_price,+variants.inventory_quantity,*seller,*variants,*seller.products,*seller.products.variants,*attribute_values,*attribute_values.attribute
```

**Always pass** `region_id` (or `country_code`) — bare `fields` without region returns **400**.

**Do not request** `*seller.reviews*` until Option A (seed via `medusajs/examples/product-reviews`) is complete.

**Note:** Seller profile page (`/store/seller/{handle}`) still requests `+reviews.*` in `seller.ts` — separate from product list mask; PDP shows “0 reviews” without 500 after product-list patch.

---

## UX patterns — copy vs avoid

### Copy into mdeapp (patterns only)

| Pattern | B2C reference | mdeapp target |
|---------|---------------|---------------|
| Product card grid | Category listing with price + seller | Chat ProductCards column |
| PDP variant picker | Size buttons + ADD TO CART | Product detail drawer / card expand |
| Cart line layout | Seller grouping, qty stepper, subtotal sidebar | Chat cart summary / HITL |
| Checkout steps | Address → delivery → payment accordion | C-008+ proxy + Stripe test |
| Region selector | Header “Shipping to FR” | Camila locale (EU first) |
| Seller chip on PDP | “View mdeai seller” link | Marketplace seller attribution |

### Do NOT copy into mdeapp

| Item | Reason |
|------|--------|
| Entire B2C Next.js app / routes | mdeapp is chat-first buyer; ADR § no second storefront |
| Fleek branding, footer, blog links | Out of scope |
| Algolia search UI | Not configured locally; mdeapp uses Mastra `product_search` (C-010) |
| Direct browser → `:9000` Store API | Publishable key must stay server-side (C-008 proxy) |
| Upstream `*seller.reviews*` field mask | 500 on local Mercur until SAN-725 |
| `commerce/b2c-storefront/src/**` as imports | Reference study only |

---

## Acceptance (C-021)

| Criterion | Status |
|-----------|--------|
| Categories + product links | ✅ |
| PDP loads | ✅ |
| Cart with line items | ✅ |
| Checkout address step | ✅ |
| Evidence doc | ✅ this file |
| No merge into `mdeapp/src` | ✅ |

---

## Follow-on chain

```text
SAN-635 C-007 Medusa client wrapper → SAN-725 C-022 field-mask policy → SAN-636 C-008 API proxy
```
