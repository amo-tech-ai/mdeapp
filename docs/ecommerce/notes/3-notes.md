**SAN-724 is closed.** Evidence is written, Linear is Done, PR #116 is open.

---

## 1. Evidence file path

`docs/ecommerce/evidence/2026-06-07/b2c-reference-storefront.md`

Screenshots: `docs/ecommerce/evidence/2026-06-07/screenshots/` (categories, PDP, cart, checkout)

PR: https://github.com/amo-tech-ai/mdeapp/pull/116

---

## 2. SAN-724 status

**Done** — [SAN-724](https://linear.app/sanjiovani/issue/SAN-724) updated with evidence link.

---

## 3. URLs verified

| Surface | URL | Result |
|---------|-----|--------|
| Mercur API | `http://localhost:9000` | health **200** |
| Mercur products | `GET /store/products?region_id=…&fields=<safe>` | **200**, count **24** |
| B2C categories | `http://localhost:3000/fr/categories` | **200**, 12 listings + EUR prices |
| B2C PDP | `http://localhost:3000/fr/products/mdeai-boutique-sandals` | **200**, ADD TO CART |
| B2C cart | `http://localhost:3000/fr/cart` | **200**, 2 items, **€20.00** |
| B2C checkout | `http://localhost:3000/fr/checkout?step=address` | **200**, address + payment |
| mdeapp (unchanged) | `http://localhost:3001/` | **200** |

---

## 4. Field-mask policy documented

| Item | Detail |
|------|--------|
| **Issue** | `*seller.reviews*` in product `fields` → Store API **500** (reviews not seeded) |
| **Removed** | `*seller.reviews,*seller.reviews.customer,*seller.reviews.seller` |
| **Workaround** | Patch in `commerce/b2c-storefront/src/lib/data/products.ts` + `reviews?.filter` guard |
| **Safe mask** | `*variants.calculated_price,+variants.inventory_quantity,*seller,*variants,*seller.products,*seller.products.variants,*attribute_values,*attribute_values.attribute` |
| **Follow-on** | Formalize in **SAN-725** (C-022) as `COMMERCE_PRODUCT_FIELDS` in `medusa-client.ts` |

---

## 5. SAN-635 status

**Implemented locally — not committed, not Done.**

| Check | Status |
|-------|--------|
| `src/lib/commerce/medusa-client.ts` | ✅ exists |
| `src/lib/commerce/commerce-env.ts` | ✅ exists |
| Vitest `src/lib/commerce` | ✅ **11 passed** |
| Live smoke `scripts/smoke-commerce-client.ts` | ✅ health 200, products.count 24 |
| Git committed | ❌ `?? src/lib/commerce/` (untracked) |
| `package.json` / lockfile | ❌ `@medusajs/js-sdk` missing (only in `node_modules`) |
| Linear SAN-635 | Still **Todo** |

**Verdict:** Ready to **finish + PR** — wire deps into `package.json`, add `verify:commerce-mdeapp-env` / `smoke:commerce-client` scripts, commit, open PR, then mark SAN-635 Done.

---

## 6. Recommended next task

```
SAN-635 ECOM-C-007 Medusa Client Wrapper  ← NEXT (commit + PR)
    ↓
SAN-725 ECOM-C-022 Seller Reviews Policy
    ↓
SAN-636 ECOM-C-008 Commerce API Proxy
```

**SAN-635 PR slice should include:**
- `src/lib/commerce/*` + tests
- `@medusajs/js-sdk` + `@medusajs/types` in `package.json`
- `scripts/smoke-commerce-client.ts`, `scripts/verify-commerce-mdeapp-env.mjs`
- `docs/ecommerce/evidence/2026-06-08/ecom-c-007-medusa-client-wrapper.md`
- Shared safe field mask (partial C-022) in `medusa-client.ts`

Want me to open the **SAN-635 PR** next?