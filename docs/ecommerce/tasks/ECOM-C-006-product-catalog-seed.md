---
id: ECOM-C-006
title: Product Catalog Seed
phase: 1
priority: P0
complexity: M
status: Done
linear_issue: SAN-634
linear_url: https://linear.app/sanjiovani/issue/SAN-634
github_repos:
  - https://github.com/mercurjs/mercur
  - https://github.com/medusajs/examples
---

# ECOM-C-006

# Title

Product Catalog Seed — 20 Medellín-Relevant SKUs

# Goal

Seed ≥20 published products owned by demo seller, visible via Store API with publishable key.

# Business Value

Checkout proof needs real variants with price + inventory. Fixes current blocker: DB has products but Store API returns `count: 0`.

# Scope

**In scope**

- Idempotent seed script: 20 SKUs — Medellín lifestyle (designer shirts, coffee, souvenirs, event merch, local goods)
- Prices as Medusa **display amounts** (not cents)
- Each product: title, description, ≥1 variant, price, inventory, images (placeholder OK)
- Products linked to **mdeai seller** (C-005)
- Products assigned to **default sales channel**
- Publishable API key linked to sales channel
- `bun run seed:catalog` or extend existing `seed`
- Document publishable key in `BOOT.md`

**Out of scope**

- Supabase `product_embeddings` (Phase 3)
- Algolia index
- mdeapp ProductCard rendering
- Multi-seller catalog split

# Files Likely Touched

| Path | Action |
|---|---|
| `commerce/mercur/packages/api/src/scripts/seed-catalog.ts` | Create |
| `commerce/mercur/packages/api/src/scripts/seed.ts` | Orchestrate seller + catalog |
| `commerce/mercur/package.json` | `seed:catalog` script |
| `commerce/mercur/BOOT.md` | Publishable key + seed command |

# Official Documentation

| Topic | URL |
|---|---|
| Medusa product module | https://docs.medusajs.com/resources/commerce-modules/product |
| Medusa sales channels | https://docs.medusajs.com/resources/commerce-modules/sales-channel |
| Medusa publishable API keys | https://docs.medusajs.com/resources/commerce-modules/api-key |
| Store list products API | https://docs.medusajs.com/api/store#products_getproducts |
| Mercur installation seed | https://docs.mercurjs.com/getting-started/installation |
| Medusa seeding guide | https://docs.medusajs.com/learn/fundamentals/custom-cli-scripts#seed-data |

# Dependencies

| Depends on | Blocks |
|---|---|
| ECOM-C-002 (API + migrate) | ECOM-C-016 |
| ECOM-C-005 (seller id) | ECOM-C-016 |

# Acceptance Criteria

- [ ] `bun run seed:catalog` (or `bun run seed`) exits 0, idempotent on re-run
- [ ] `GET /store/products` with `x-publishable-api-key` returns `count >= 20`
- [ ] Each product has ≥1 variant with `calculated_price` or price in region
- [ ] Products linked to `mdeai` seller
- [ ] Sales channel ↔ publishable key linkage verified in admin
- [ ] No product rows inserted into Supabase

# Proof Commands

```bash
cd commerce/mercur
bun run seed:catalog

PK="pk_42c83cc5daa68b27dcd0e98ea5e3f70bd380acbbab514879d71d57a0d2cf3cb5"  # dev key from BOOT.md
curl -s -H "x-publishable-api-key: $PK" \
  "http://localhost:9000/store/products?limit=25" | jq '{count, titles: [.products[].title]}'

# Must show count >= 20
```

# Test Plan

1. Run seed twice — no duplicate slug errors (upsert)
2. Store API returns products with variants + prices
3. Admin → Products → 20 items, published, correct seller
4. Admin → Settings → Publishable Key → sales channel includes storefront channel
5. Add one variant to cart via Store API (precursor to C-016)

# Risks

| Risk | Mitigation |
|---|---|
| Store API empty despite DB rows | Fix sales channel + API key + product status (known current bug) |
| Mercur seller-product link API | Use Mercur workflows or admin patterns from MCP docs |
| Image URLs broken | Use placeholder `https://placehold.co` or Medusa default |
| Region/currency mismatch | Seed products in same region as Stripe config (C-004) |

# Rollback Plan

```bash
# Dev only: reset catalog tables or re-migrate
cd commerce/mercur/packages/api && bunx medusa db:migrate:revert  # if needed
bunx medusa db:migrate && bun run seed
```

# Estimated Complexity

**M** — sales channel wiring is the tricky part

# Priority

**P0**

# Known blocker (workspace)

Default seed created 4 products in DB but Store API `count: 0` — root cause likely sales channel / publishable key / publish status. This task explicitly fixes that.
