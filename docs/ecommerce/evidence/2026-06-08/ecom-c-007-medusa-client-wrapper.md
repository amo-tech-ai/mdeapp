# ECOM-C-007 — Medusa Client Wrapper evidence

**Date:** 2026-06-08  
**Linear:** [SAN-635](https://linear.app/sanjiovani/issue/SAN-635)  
**SDK:** `@medusajs/js-sdk@2.13.4` (matches Mercur 2.13.4)  
**Docs:** [Medusa JS SDK](https://docs.medusajs.com/resources/js-sdk)

## Scope delivered

| Item | Path |
|------|------|
| Env validation | `src/lib/commerce/commerce-env.ts` |
| Server client | `src/lib/commerce/medusa-client.ts` |
| Unit tests | `src/lib/commerce/__tests__/*.test.ts` |
| Env verifier | `scripts/verify-commerce-mdeapp-env.mjs` |
| Live smoke | `scripts/smoke-commerce-client.ts` |

## Env vars (mdeapp server-side)

| Variable | Example | Notes |
|----------|---------|-------|
| `COMMERCE_API_URL` | `http://localhost:9000` | Mercur Store API base |
| `COMMERCE_PUBLISHABLE_KEY` | `pk_…` | Same as `MEDUSA_PUBLISHABLE_KEY` in `commerce/.env` |

**Forbidden in mdeapp:** `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET`, `sk_*`, `whsec_*`, `NEXT_PUBLIC_*` commerce secrets.

## Proof commands

```bash
cd mdeapp

# Unit tests
npm test -- src/lib/commerce
# → 11 passed

# Env contract
COMMERCE_API_URL=http://localhost:9000 \
COMMERCE_PUBLISHABLE_KEY="<from commerce/.env MEDUSA_PUBLISHABLE_KEY>" \
npm run verify:commerce-mdeapp-env
# → PASS

# Live (Mercur on :9000)
COMMERCE_API_URL=http://localhost:9000 \
COMMERCE_PUBLISHABLE_KEY="<from commerce/.env>" \
npm run smoke:commerce-client
# → health 200 · region_id set · products.count 24 · getProduct OK · PASS
```

## Safe field mask (`COMMERCE_PRODUCT_FIELDS`)

Default on `listProducts` / `getProduct` — **no** `*seller.reviews*`:

```text
*variants.calculated_price,+variants.inventory_quantity,*seller,*variants,*seller.products,*seller.products.variants,*attribute_values,*attribute_values.attribute
```

Seller `reviews` normalized to `[]` when absent (`seller?.reviews ?? []`). Full policy doc: SAN-725 / B2C evidence `2026-06-07/b2c-reference-storefront.md`.

## Read-only API surface

- `listProducts(params?)` → `sdk.store.product.list` (safe `fields` default)
- `getProduct(id, params?)` → `sdk.store.product.retrieve` (safe `fields` default)
- `listRegions(params?)` → `sdk.store.region.list`
- `getVariant(productId, variantId)` → product retrieve + variant lookup

No cart/checkout writes in C-007.

## Acceptance

| Criterion | Status |
|-----------|--------|
| No browser secret exposure | ✅ server env only |
| No writes | ✅ read-only methods |
| Product list from Mercur | ✅ count 24 live |
| Safe field mask (no seller.reviews) | ✅ `COMMERCE_PRODUCT_FIELDS` |
| Test coverage | ✅ 14 vitest |
| Official SDK methods | ✅ verified against SDK types |

## Blockers

- None for C-007 Done gate.
- Redis warnings on local Mercur (`ECONNREFUSED :6379`) — non-blocking for Store API reads.
