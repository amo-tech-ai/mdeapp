---
id: ECOM-C-021
task_id: ECOM-C-021
title: B2C reference storefront (local UX study)
status: Done
priority: P2
phase: 2
milestone: M2 - mdeapp commerce bridge
effort: S
estimated_effort: 0.5 day
owner: mdeai-commerce
area: reference
linear_project: Commerce Platform
linear_project_url: https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues
linear_label: COMM
linear_issue: SAN-724
linear_url: https://linear.app/sanjiovani/issue/SAN-724
depends_on: [ECOM-C-018]
blocks: []
skill: medusa
skills: [building-storefronts]
verified_against:
  - docs/ecommerce/adr/001-standalone-mercur.md
  - docs/ecommerce/docs/05-medusa-recipes-map.md
  - https://github.com/mercurjs/b2c-marketplace-storefront
official_refs:
  - https://github.com/mercurjs/b2c-marketplace-storefront
description: "Reference-only Mercur B2C storefront on :3000 for UX patterns — never merged into mdeapp/src."
---

# ECOM-C-021 — B2C reference storefront (local UX study)

## Goal

Run [mercurjs/b2c-marketplace-storefront](https://github.com/mercurjs/b2c-marketplace-storefront) locally at `commerce/b2c-storefront` on **`:3000`** to study ProductCards, cart, and checkout patterns for mdeapp (production buyer on **`:3001`**).

**Hard rule:** Reference only — do **not** copy components into `mdeapp/src/`. Patterns inform C-007/C-008 and future ProductCards.

## Persona impact

**Camila** — no direct change. This task de-risks how mdeapp will render marketplace products and checkout without building a second buyer storefront.

## Depends on

- [ECOM-C-018](./ECOM-C-018-core-commerce-exit-gate.md) — Mercur + Stripe proof complete

## Scope

**In scope**

- Clone repo to `commerce/b2c-storefront`
- `.env.local` from `commerce/.env` (publishable key, `MEDUSA_BACKEND_URL=http://localhost:9000`)
- Local field-mask patch for `*seller.reviews*` 500 (see [ECOM-C-022](./ECOM-C-022-seller-reviews-field-mask.md))
- Verify categories, PDP, cart, checkout address step with Stripe test key
- Evidence doc under `docs/ecommerce/evidence/YYYY-MM-DD/b2c-reference-storefront.md`

**Out of scope**

- Merging B2C UI into mdeapp
- Production deploy of B2C storefront
- Seller reviews seed (tracked in C-022)

## Local setup

```bash
# Terminal 1 — Mercur backend
cd commerce/mercur && yarn dev

# Terminal 2 — B2C reference
cd commerce/b2c-storefront && yarn install && yarn dev
```

**Env (`commerce/b2c-storefront/.env.local`, gitignored):**

| Variable | Value |
|----------|-------|
| `MEDUSA_BACKEND_URL` | `http://localhost:9000` |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` |
| `NEXT_PUBLIC_DEFAULT_REGION` | `fr` (or seeded region) |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | from `commerce/.env` |
| `NEXT_PUBLIC_STRIPE_KEY` | Stripe test publishable key |

## Known patch (reference tree only)

`commerce/b2c-storefront/src/lib/data/products.ts`:

- Remove `*seller.reviews*` from Store API `fields` mask (500 when reviews not seeded)
- Use `prod.seller?.reviews?.filter(...) ?? []` for optional reviews

Document patch in evidence — upstream may change on `yarn upgrade`.

## Acceptance criteria

- [ ] `GET http://localhost:3000/fr/categories` → 200 with product links
- [ ] PDP loads for a seeded product
- [ ] Add-to-cart works; cart page shows line item
- [ ] Checkout reaches address step with Stripe test key configured
- [ ] Evidence doc written with screenshots or curl proof
- [ ] No files under `mdeapp/src/` added from B2C clone

## Proof commands

```bash
curl -s -o /dev/null -w "categories %{http_code}\n" http://localhost:3000/fr/categories
curl -s -o /dev/null -w "store products %{http_code}\n" \
  "http://localhost:9000/store/products?limit=1" \
  -H "x-publishable-api-key: $MEDUSA_PUBLISHABLE_KEY"
```

## References

- ADR: [001-standalone-mercur.md](../adr/001-standalone-mercur.md)
- Recipe map: [05-medusa-recipes-map.md](../docs/05-medusa-recipes-map.md)
- Field-mask follow-up: [ECOM-C-022](./ECOM-C-022-seller-reviews-field-mask.md)
- Index: [INDEX.md](./INDEX.md)
