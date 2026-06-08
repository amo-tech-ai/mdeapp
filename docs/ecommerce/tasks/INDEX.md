# Commerce Tasks — Master Index

**Roadmap:** [ECOM-ROADMAP-001](../ECOM-ROADMAP-001.md) · [roadmap.md](./roadmap.md)  
**Audit:** [../audit/1-tasks-audit.md](../audit/1-tasks-audit.md)  
**ADR:** [001-standalone-mercur.md](../adr/001-standalone-mercur.md)  
**Env:** [env-commerce.md](../docs/env-commerce.md)  
**Phase 1 overview:** [PHASE-1-OVERVIEW.md](./PHASE-1-OVERVIEW.md)

**Foundation repo:** [mercurjs/mercur](https://github.com/mercurjs/mercur) at `commerce/mercur/`  
**Reference repos:** [medusajs/examples](https://github.com/medusajs/examples) · [mercurjs/b2c-marketplace-storefront](https://github.com/mercurjs/b2c-marketplace-storefront)

## Hard rules

- No second buyer storefront — mdeapp owns Camila's UI
- No mutable product/cart/order truth in Supabase
- No Stripe Connect before single-vendor paid order ([ECOM-C-016](./ECOM-C-016-paid-order-proof.md))
- No AI/embeddings before Phase 1 exit gate ([ECOM-C-018](./ECOM-C-018-core-commerce-exit-gate.md))
- Use `@medusajs/js-sdk` for Store API — no raw `fetch` in mdeapp

---

## Implementation order (canonical)

```text
Phase 0 (optional):  C-000
Phase 1 (NOW):       C-001 → C-002 → C-003 → C-005 → C-006 → C-004 → C-016 → C-018
Phase 2:             C-007 → C-008
Phase 3:             C-009 → C-010 → C-011 → C-012 → C-013 → C-014 → C-015 → C-019
                     C-017 (parallel after C-016) → C-020
Phase 4:             M-001 → M-002 → M-003 → M-004 → M-005 → M-006 → M-007
Phase 5:             M-008…M-013 (after C-020)
```

---

## Phase 0 — Pre-flight (optional)

| Order | ID | Title | Linear | Status |
|---:|---|---|---|---|
| 0 | [ECOM-C-000](./ECOM-C-000-verification-floor.md) | mdeapp verification floor | [SAN-628](https://linear.app/sanjiovani/issue/SAN-628) | In Progress |

---

## Phase 1 — Commerce standalone proof (execute now)

| Order | ID | Title | Linear | Depends | Status |
|---:|---|---|---|---|---|
| 1 | [ECOM-C-001](./ECOM-C-001-commerce-adr.md) | Commerce ADR | [SAN-629](https://linear.app/sanjiovani/issue/SAN-629) | — | **Done** |
| 2 | [ECOM-C-002](./ECOM-C-002-mercur-backend-spike.md) | Mercur backend spike | [SAN-630](https://linear.app/sanjiovani/issue/SAN-630) | C-001 | **Done** |
| 3 | [ECOM-C-003](./ECOM-C-003-commerce-env-secrets.md) | Env & secrets | [SAN-631](https://linear.app/sanjiovani/issue/SAN-631) | C-002 | **Done** |
| 4 | [ECOM-C-005](./ECOM-C-005-demo-seller.md) | Demo seller | [SAN-633](https://linear.app/sanjiovani/issue/SAN-633) | C-002 | **Done** |
| 5 | [ECOM-C-006](./ECOM-C-006-product-catalog-seed.md) | Product catalog seed | [SAN-634](https://linear.app/sanjiovani/issue/SAN-634) | C-005 | **Done** |
| 6 | [ECOM-C-004](./ECOM-C-004-stripe-test-checkout.md) | Stripe test checkout | [SAN-632](https://linear.app/sanjiovani/issue/SAN-632) | C-003, C-006 | **Done** |
| 7 | [ECOM-C-016](./ECOM-C-016-paid-order-proof.md) | Paid order proof | [SAN-644](https://linear.app/sanjiovani/issue/SAN-644) | C-004, C-006 | **Done** |
| 8 | [ECOM-C-018](./ECOM-C-018-core-commerce-exit-gate.md) | Core commerce exit gate | [SAN-646](https://linear.app/sanjiovani/issue/SAN-646) | C-016 | **Done** |

> C-004 after C-006: Stripe provider can be configured earlier, but **paid order** needs priced variants in Store API.

---

## Phase 2 — mdeapp bridge (post C-018)

| Order | ID | Title | Linear | Depends | Status |
|---:|---|---|---|---|---|
| 8b | [ECOM-C-021](./ECOM-C-021-b2c-reference-storefront.md) | B2C reference storefront (local UX study) | [SAN-724](https://linear.app/sanjiovani/issue/SAN-724) | C-018 | **Done** |
| 9 | [ECOM-C-007](./ECOM-C-007-medusa-client-wrapper.md) | Medusa JS SDK wrapper | [SAN-635](https://linear.app/sanjiovani/issue/SAN-635) | C-018, C-006 | **Done** |
| 9b | [ECOM-C-022](./ECOM-C-022-seller-reviews-field-mask.md) | Seller reviews field-mask policy | [SAN-725](https://linear.app/sanjiovani/issue/SAN-725) | C-007, C-018, C-006 | **Done** |
| 10 | [ECOM-C-008](./ECOM-C-008-commerce-api-proxy.md) | Commerce API proxy | [SAN-636](https://linear.app/sanjiovani/issue/SAN-636) | C-007, C-022, C-018 | Todo |

> **Standalone ecommerce gate:** Mercur `:9000` + B2C `:3000` + field-mask policy ([`commerce-store-api-fields.md`](../docs/commerce-store-api-fields.md)). **C-008 next** — still no chat ProductCards until proxy ships.

---

## Phase 3 — AI commerce (post Phase 2)

| Order | ID | Title | Linear | Depends |
|---:|---|---|---|---|
| 11 | [ECOM-C-009](./ECOM-C-009-product-embedding-sync.md) | Supabase links + embedding sync | [SAN-637](https://linear.app/sanjiovani/issue/SAN-637) | C-006, C-018 |
| 12 | [ECOM-C-010](./ECOM-C-010-mastra-product-search.md) | Mastra product_search | [SAN-638](https://linear.app/sanjiovani/issue/SAN-638) | C-008, C-009 |
| 13 | [ECOM-C-011](./ECOM-C-011-mastra-product-detail.md) | Mastra product_detail | [SAN-639](https://linear.app/sanjiovani/issue/SAN-639) | C-008 |
| 14 | [ECOM-C-012](./ECOM-C-012-mastra-cart-tools.md) | Mastra cart tools | [SAN-640](https://linear.app/sanjiovani/issue/SAN-640) | C-008 |
| 15 | [ECOM-C-013](./ECOM-C-013-mastra-checkout-link.md) | Mastra checkout_link | [SAN-641](https://linear.app/sanjiovani/issue/SAN-641) | C-004, C-012 |
| 16 | [ECOM-C-014](./ECOM-C-014-copilotkit-product-card.md) | CopilotKit ProductCard | [SAN-642](https://linear.app/sanjiovani/issue/SAN-642) | C-010, C-011, C-006 |
| 17 | [ECOM-C-015](./ECOM-C-015-cart-state-ui.md) | Cart state UI | [SAN-643](https://linear.app/sanjiovani/issue/SAN-643) | C-012, C-014 |
| 18 | [ECOM-C-019](./ECOM-C-019-ai-checkout-proof.md) | AI E2E checkout proof | [SAN-720](https://linear.app/sanjiovani/issue/SAN-720) | C-013, C-015, C-016 |
| — | [ECOM-C-017](./ECOM-C-017-manual-ops-refund-playbook.md) | Ops & refund playbook | [SAN-645](https://linear.app/sanjiovani/issue/SAN-645) | C-016 |
| 19 | [ECOM-C-020](./ECOM-C-020-production-readiness.md) | Production readiness | [SAN-721](https://linear.app/sanjiovani/issue/SAN-721) | C-018, C-017, C-019 |

**Pattern source:** [medusajs/examples/agentic-commerce](https://github.com/medusajs/examples/tree/main/agentic-commerce)

---

## Phase 4 — Marketplace MVP (post C-020)

| Order | ID | Title | Linear | Depends |
|---:|---|---|---|---|
| 20 | [ECOM-M-001](./ECOM-M-001-mercur-marketplace-foundation.md) | Mercur marketplace verify | [SAN-647](https://linear.app/sanjiovani/issue/SAN-647) | C-020 |
| 21 | [ECOM-M-002](./ECOM-M-002-vendor-application.md) | Vendor application | [SAN-648](https://linear.app/sanjiovani/issue/SAN-648) | C-020 |
| 22+ | M-003…M-007 | Vendor, Connect, split, payouts | SAN-649–653 | M-001+ |

**Vendor UI:** `commerce/mercur/apps/vendor` — not [mercurjs/vendor-panel](https://github.com/mercurjs/vendor-panel).

---

## Phase 5 — Lifestyle (post MVP)

| ID | Title | Linear | Depends |
|---|---|---|---|
| [ECOM-M-008](./ECOM-M-008-whatsapp-payment-link.md) | WhatsApp payment link | [SAN-654](https://linear.app/sanjiovani/issue/SAN-654) | C-020 |
| M-009…M-013 | Event/trip/venue links, analytics | SAN-655–659 | C-020 |

---

## Archived / rejected

| Former ID | Reason | Location |
|---|---|---|
| C-002 medusa-service-setup | Wrong path | `tasks-draft/archive/` |
| C-005 cloudinary | Phase 1 scope creep | `tasks-draft/archive/` |
| M-001 marketplace recipe | Duplicates Mercur core | `tasks-draft/archive/` |
| C-008 supabase-only file | Merged into C-009 | removed 2026-06-07 |
| SAN-551 REV-C2 | Duplicate of C-013 | Canceled in Linear 2026-06-07 |

---

## Linear sync (2026-06-07)

**Project:** [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues)

| Action | Issue | Notes |
|---|---|---|
| Repurposed | SAN-633 | Was Cloudinary → C-005 demo seller |
| Repurposed | SAN-636 | Was Supabase extensions → C-008 API proxy |
| Repurposed | SAN-644 | Was AI E2E → C-016 paid order (Phase 1) |
| Repurposed | SAN-646 | Was prod readiness → C-018 exit gate |
| Created | SAN-720 | C-019 AI E2E checkout |
| Created | SAN-721 | C-020 production readiness |
| Canceled | SAN-551 | Duplicate of SAN-641 / C-013 |

**Phase 1:** **COMPLETE** (2026-06-07). Gate: [commerce-core-exit-gate.md](../evidence/2026-06-07/commerce-core-exit-gate.md).

**Phase 2 may start after PR merge:** C-007 SDK wrapper · C-008 API proxy.

**Do not execute** `FROZEN` Linear issues until C-018 PR is merged to `main`.

Full mapping: SAN-628…659 + SAN-720 + SAN-721 → ECOM-C/M per tables above.
