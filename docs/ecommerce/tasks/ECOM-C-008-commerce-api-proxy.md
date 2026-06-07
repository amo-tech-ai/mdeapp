---
id: ECOM-C-008
task_id: ECOM-C-008
title: Commerce API proxy routes
status: Not Started
priority: P0
phase: 2
milestone: M2 - mdeapp commerce bridge
linear_issue: SAN-636
linear_url: https://linear.app/sanjiovani/issue/SAN-636
depends_on: [ECOM-C-007, ECOM-C-018]
blocks: [ECOM-C-010, ECOM-C-011, ECOM-C-012, ECOM-C-013]
github_repos:
  - https://github.com/mercurjs/b2c-marketplace-storefront
  - https://github.com/medusajs/medusa
official_refs:
  - https://docs.medusajs.com/api/store
  - https://docs.medusajs.com/resources/js-sdk
description: "Server-only /api/commerce/* proxy to Mercur Store API — publishable key never in browser."
---

# ECOM-C-008 — Commerce API proxy routes

## Goal

mdeapp exposes `/api/commerce/products`, `/api/commerce/cart`, `/api/commerce/checkout` that call Mercur via [ECOM-C-007](./ECOM-C-007-medusa-client-wrapper.md) SDK wrapper.

## Persona impact

**Camila** on `/chat` — Mastra tools and ProductCards fetch live catalog through mdeapp, not direct `:9000` calls from the browser.

## Scope

**In scope**

- `mdeapp/src/app/api/commerce/products/route.ts`
- `mdeapp/src/app/api/commerce/cart/route.ts`
- `mdeapp/src/app/api/commerce/checkout/route.ts`
- Publishable key server-side only; no `SUPABASE_SERVICE_ROLE` for commerce reads

**Out of scope**

- CopilotKit actions (Phase 3)
- Supabase embeddings ([ECOM-C-009](./ECOM-C-009-product-embedding-sync.md))

## Acceptance Criteria

- [ ] `curl localhost:3001/api/commerce/products` returns Mercur JSON (≥1 product after C-006)
- [ ] No admin secret in client bundle (`rg MEDUSA_ mdeapp/src/components` empty)
- [ ] Routes use `@medusajs/js-sdk` via C-007 wrapper — no raw `fetch` to Store API

## Proof Commands

```bash
cd mdeapp && npm run dev
curl -s http://localhost:3001/api/commerce/products | jq 'length // .products | length'
```

## Dependencies

| Depends on | Blocks |
|---|---|
| ECOM-C-007, ECOM-C-018 | ECOM-C-010, C-011, C-012, C-013 |

## Rollback

Delete `mdeapp/src/app/api/commerce/`.

> **Note:** SAN-636 was originally "Supabase extensions" — repurposed to API proxy per [roadmap.md](./roadmap.md). Supabase link tables live in [ECOM-C-009](./ECOM-C-009-product-embedding-sync.md).
