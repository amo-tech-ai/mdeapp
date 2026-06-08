# ECOM-C-022 — Seller reviews field-mask policy evidence

**Date:** 2026-06-08  
**Linear:** [SAN-725](https://linear.app/sanjiovani/issue/SAN-725)  
**Decision:** **Option B — Policy** (document unsupported `*seller.reviews*`; no Mercur seed)  
**Policy doc:** [`commerce-store-api-fields.md`](../../docs/commerce-store-api-fields.md)

---

## Scope delivered

| Item | Path |
|------|------|
| Field-mask policy | `docs/ecommerce/docs/commerce-store-api-fields.md` |
| B2C auditable patch | `docs/ecommerce/evidence/2026-06-07/b2c-products-field-mask.patch` (SAN-724) |
| B2C local apply | `commerce/b2c-storefront/src/lib/data/products.ts` (gitignored clone) |
| SDK constants (main, not activated in chat) | `src/lib/commerce/medusa-client.ts` — LIST/DETAIL fields |
| Recipes map update | `docs/ecommerce/docs/05-medusa-recipes-map.md` |

**Standalone ecommerce only** — no mdeapp API proxy, no CopilotKit ProductCards.

---

## Root cause

| Mask | HTTP | Notes |
|------|------|-------|
| Upstream B2C with `*seller.reviews*` | **500** | Reviews relation not seeded in local Mercur |
| Approved LIST mask | **200** | Safe for browse |
| Approved DETAIL mask | **200** | Safe for PDP |
| `*seller.reviews*` only | **500** | Documented **unsupported** |

---

## Proof commands (2026-06-08)

Mercur on `:9000`, `verify-commerce-env.mjs` PASS.

```bash
source commerce/.env
REG=reg_01KTHTXVGSPF1F6V33D3KSCQXX
PK="$MEDUSA_PUBLISHABLE_KEY"
LIST='*variants.calculated_price,+variants.inventory_quantity,*seller,*variants,*attribute_values,*attribute_values.attribute'
DETAIL='*variants.calculated_price,+variants.inventory_quantity,*seller,*variants,*seller.products,*seller.products.variants,*attribute_values,*attribute_values.attribute'
```

| Check | Result |
|-------|--------|
| `GET /health` | **200** |
| LIST mask | **200** |
| DETAIL mask | **200** |
| `*seller.reviews*` mask | **500** (expected unsupported) |
| Product count (LIST) | **24** |

---

## Acceptance (Option B)

| Criterion | Status |
|-----------|--------|
| `*seller.reviews*` documented unsupported (500) | ✅ |
| Approved LIST/DETAIL masks return 200 | ✅ |
| B2C patch in evidence (not lost on upgrade) | ✅ SAN-724 patch file |
| mdeapp SDK uses approved masks (on `main`) | ✅ not activated in UI |
| `05-medusa-recipes-map.md` updated | ✅ |
| Blocks C-008 only after this Done | ✅ |

---

## Next

**SAN-636 ECOM-C-008 Commerce API Proxy** may start — proxy must use LIST/DETAIL masks from policy doc. Still **no** embeddings, Mastra product search, or ProductCards until proxy exists.
