# Store API field-mask policy (Mercur / mdeai)

**Task:** SAN-725 · ECOM-C-022  
**Decision:** **Option B — Policy** (no `*seller.reviews*` until reviews are seeded)  
**ADR:** [001-standalone-mercur.md](../adr/001-standalone-mercur.md)  
**Evidence:** [ecom-c-022-seller-reviews-field-mask.md](../evidence/2026-06-08/ecom-c-022-seller-reviews-field-mask.md)

---

## Problem

Upstream [mercurjs/b2c-marketplace-storefront](https://github.com/mercurjs/b2c-marketplace-storefront) default `fields` includes `*seller.reviews*`. Local Mercur (`commerce/mercur/`) has **no seller-review seed** → Store API returns **500** when that relation is expanded.

**Real-world example:** A B2C category page requests the upstream mask → blank page / 500. A tourist never sees products even though Mercur health is 200 and `count: 24` without the broken fields.

---

## Approved masks

Use these for **all** Store API product list/detail calls (B2C reference, future mdeapp proxy, SDK wrapper).

### LIST_FIELDS (browse / ProductCards)

```text
*variants.calculated_price,+variants.inventory_quantity,*seller,*variants,*attribute_values,*attribute_values.attribute
```

- Includes: price, seller summary, variants, attributes  
- Excludes: `*seller.reviews*`, `*seller.products*` (heavy cross-sell graph on list)

### DETAIL_FIELDS (PDP / product detail)

```text
*variants.calculated_price,+variants.inventory_quantity,*seller,*variants,*seller.products,*seller.products.variants,*attribute_values,*attribute_values.attribute
```

- Adds seller cross-sells for PDP (matches B2C reference after local patch)  
- Still excludes `*seller.reviews*`

### FORBIDDEN (unsupported until Option A seed)

```text
*seller.reviews*
*seller.reviews.customer*
*seller.reviews.seller*
```

Document as **unsupported** — expect **500** on local Mercur. Do not use in production callers.

---

## Where enforced

| Surface | Location | Status |
|---------|----------|--------|
| B2C reference (`:3000`) | `commerce/b2c-storefront/src/lib/data/products.ts` | Local patch + auditable `.patch` in evidence |
| mdeapp SDK (future bridge) | `src/lib/commerce/medusa-client.ts` | `COMMERCE_PRODUCT_LIST_FIELDS` / `COMMERCE_PRODUCT_DETAIL_FIELDS` on `main` — **not wired to chat yet** |
| Mercur backend | No change | Reviews not seeded (Option A deferred) |

**Rule:** Do not request optional marketplace relations in `fields` unless seeded and verified with curl.

---

## Proof commands

```bash
cd /home/sk/mdeai/mdeapp
source commerce/.env
REG=reg_01KTHTXVGSPF1F6V33D3KSCQXX   # or first region from /store/regions
PK="$MEDUSA_PUBLISHABLE_KEY"

LIST='*variants.calculated_price,+variants.inventory_quantity,*seller,*variants,*attribute_values,*attribute_values.attribute'
DETAIL='*variants.calculated_price,+variants.inventory_quantity,*seller,*variants,*seller.products,*seller.products.variants,*attribute_values,*attribute_values.attribute'

# Must be 200
curl -s -o /dev/null -w "list:%{http_code}\n" \
  -H "x-publishable-api-key: $PK" \
  "http://localhost:9000/store/products?country_code=fr&limit=1&region_id=$REG&fields=$LIST"

curl -s -o /dev/null -w "detail:%{http_code}\n" \
  -H "x-publishable-api-key: $PK" \
  "http://localhost:9000/store/products?country_code=fr&limit=1&region_id=$REG&fields=$DETAIL"

# Must be 500 (unsupported) until Option A
curl -s -o /dev/null -w "reviews:%{http_code}\n" \
  -H "x-publishable-api-key: $PK" \
  "http://localhost:9000/store/products?country_code=fr&limit=1&region_id=$REG&fields=*seller.reviews,*seller"
```

---

## Option A (deferred)

When seller reviews are persona-visible (ProductCards, seller pages in mdeapp):

1. Adopt [medusajs/examples/product-reviews](https://github.com/medusajs/examples/tree/main/product-reviews) seed in `commerce/mercur/packages/api/src/scripts/`
2. Re-run curl — `*seller.reviews*` must return **200**
3. Update this doc and remove FORBIDDEN section

Until then: **Option B only.**
