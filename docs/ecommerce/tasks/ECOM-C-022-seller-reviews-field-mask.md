---
id: ECOM-C-022
task_id: ECOM-C-022
title: Seller reviews seed or Store API field-mask policy
status: Done
priority: P1
phase: 2
milestone: M2 - mdeapp commerce bridge
effort: S
estimated_effort: 0.5 day
owner: mdeai-commerce
area: backend
linear_project: Commerce Platform
linear_project_url: https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues
linear_label: COMM
linear_issue: SAN-725
linear_url: https://linear.app/sanjiovani/issue/SAN-725
depends_on: [ECOM-C-007, ECOM-C-018, ECOM-C-006]
blocks: [ECOM-C-008]
skill: medusa
skills: [building-with-medusa]
verified_against:
  - docs/ecommerce/docs/05-medusa-recipes-map.md
  - https://github.com/medusajs/examples/tree/main/product-reviews
  - https://docs.medusajs.com/resources/recipes/ecommerce
official_refs:
  - https://github.com/medusajs/examples/tree/main/product-reviews
  - https://docs.medusajs.com/api/store
description: "Fix Store API 500 on *seller.reviews* — seed reviews in Mercur OR document slim field-mask policy for mdeapp and B2C reference."
---

# ECOM-C-022 — Seller reviews seed or field-mask policy

## 1. Problem

B2C reference storefront and upstream Mercur B2C default field mask include `*seller.reviews*`. Local Mercur returns **500** when those fields are requested (reviews not seeded).

**Workaround in place (reference only):** `commerce/b2c-storefront/src/lib/data/products.ts` — reviews removed from `fields` + optional chaining on `reviews?.filter`.

mdeapp C-007 SDK must **not** repeat the upstream mask blindly.

## 2. Goal

Pick **one** bounded approach and document it:

| Option | Effort | Outcome |
|--------|--------|---------|
| **A — Seed** | Medium | Copy `medusajs/examples/product-reviews` patterns into Mercur seed; Store API returns reviews |
| **B — Policy** | Small | ADR note + shared `COMMERCE_PRODUCT_FIELDS` constant; no `*seller.reviews` until seeded |

Default recommendation: **B now**, **A** when seller reviews are persona-visible in mdeapp ProductCards.

## 3. Acceptance criteria

- [x] `GET /store/products?fields=…*seller.reviews…` documented **unsupported** (Option B — 500 on local Mercur)
- [x] mdeapp `medusa-client.ts` (C-007) uses LIST/DETAIL field lists — no 500 on list/get product
- [x] B2C reference patch in evidence (`b2c-products-field-mask.patch`, SAN-724)
- [x] Entry in [`05-medusa-recipes-map.md`](../docs/05-medusa-recipes-map.md) updated
- [x] Policy doc: [`commerce-store-api-fields.md`](../docs/commerce-store-api-fields.md)
- [x] Evidence: [`evidence/2026-06-08/ecom-c-022-seller-reviews-field-mask.md`](../evidence/2026-06-08/ecom-c-022-seller-reviews-field-mask.md)

## 4. Files likely touched

**Option A**

- `commerce/mercur/packages/api/src/scripts/` (review seed)
- `commerce/mercur/package.json` (seed script)

**Option B**

- `docs/ecommerce/docs/commerce-store-api-fields.md` (new, short)
- `src/lib/commerce/medusa-client.ts` (C-007 — shared fields constant)
- `docs/ecommerce/evidence/YYYY-MM-DD/ecom-c-022-reviews-policy.md`

## 5. Proof commands

```bash
# Option B — slim mask must 200
PK="<MEDUSA_PUBLISHABLE_KEY>"
REG="<region_id>"
curl -s -o /dev/null -w "%{http_code}\n" \
  -H "x-publishable-api-key: $PK" \
  "http://localhost:9000/store/products?country_code=fr&limit=1&region_id=$REG&fields=*seller,*variants.calculated_price"

# Option A — full B2C mask must 200
curl -s -o /dev/null -w "%{http_code}\n" \
  -H "x-publishable-api-key: $PK" \
  "http://localhost:9000/store/products?country_code=fr&limit=1&region_id=$REG&fields=*seller.reviews,*seller"
```

## 6. Rollback

Revert seed migration/script (A) or delete field policy doc (B). B2C reference keeps local patch regardless until upstream Mercur demo seed is replicated.

## 7. Summary

| Field | Value |
|-------|-------|
| Phase | 2 |
| Depends on | C-018, C-006 |
| Parallel with | C-007, C-021 |
| Pattern source | `medusajs/examples/product-reviews` |
