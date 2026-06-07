---
id: ECOM-REPO-REVIEW-003
title: Marketplace starter and repository review
status: Complete
created_at: 2026-06-06
owner: mdeai-commerce
linear_project: Commerce Platform
linear_project_url: https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues
skills_reviewed:
  - /home/sk/mdeai/.claude/skills/medusa
---

# Marketplace Starter and Repository Review

## Executive Verdict

**Verdict:** Use **Medusa official recipe patterns first**, not a full marketplace starter as the Core foundation.

**Best starting point for mdeai Core:**

```text
mdeapp existing Next.js/CopilotKit UI
-> new bounded Medusa backend service
-> official Medusa marketplace recipe kept deferred
-> official restaurant marketplace example copied only when M4 starts
-> Mercur studied as marketplace accelerator/reference after Core proof
```

**Do not start by installing Mercur as the main app.** Mercur is the best full marketplace starter found, but it includes its own storefront, vendor portal, admin panel, Stripe Connect assumptions, and multi-vendor behavior. That conflicts with the current mdeai rule: do not build a separate ecommerce frontend and do not start multi-vendor before single-vendor checkout proof.

**Recommended template strategy:**

| Layer | Recommendation | Why |
|---|---|---|
| Core checkout | Medusa app from official docs | Smallest safe path to product/cart/order/Stripe proof |
| Marketplace module | Medusa official marketplace recipe + vendors example | Matches Medusa v2 modules, links, workflows, actor/auth patterns |
| Restaurant/event marketplace patterns | `medusajs/examples/restaurant-marketplace` | Has copyable modules, links, workflows, API routes |
| Full vendor dashboard reference | Mercur | Strong reference after Core; do not copy wholesale |
| Fashion UX/catalog inspiration | Agilo fashion starter + Medusa fashion page | Useful for variants, colors, collections, and visual commerce |
| Existing mdeai frontend | Keep as the storefront | CopilotKit ProductCards must live inside current mdeai UI |

## Sources Reviewed

| Source | URL | Notes |
|---|---|---|
| Medusa marketplace page | https://medusajs.com/marketplace/ | Confirms Medusa positions marketplace via recipe or Mercur starter. |
| Medusa marketplace recipe | https://docs.medusajs.com/resources/recipes/marketplace | Official architectural pattern: marketplace module, links, API routes, workflows. |
| Medusa vendors recipe | https://docs.medusajs.com/resources/recipes/marketplace/examples/vendors | Official vendor/admin/order split example. |
| Medusa examples repo | https://github.com/medusajs/examples | Official v2 examples; includes restaurant marketplace and agentic commerce. |
| Restaurant marketplace example | https://github.com/medusajs/examples/blob/main/restaurant-marketplace/README.md | Copyable modules, links, workflows, and API routes. |
| Mercur | https://github.com/mercurjs/mercur | Strong full marketplace starter built on MedusaJS. |
| Agilo fashion starter | https://github.com/Agilo/fashion-starter | Fashion/design storefront reference with Medusa backend and Next storefront. |
| Medusa fashion and apparel | https://medusajs.com/fashion-and-apparel/ | Product variant, returns, multi-region, multi-channel positioning for fashion. |
| Shahed Nasser marketplace plugin | https://github.com/shahednasser/medusa-marketplace | Deprecated Medusa Extender-era marketplace plugin. Avoid for implementation. |
| Adam Lesniak marketplace repo | https://github.com/adamlesniak/medusa-marketplace | Small/early repo, Medusa v1 compatibility note. Avoid as foundation. |
| Tameta marketplace guide | https://tameta.tech/blogs/topics/medusa-js-for-multi-vendor-marketplaces-a-complete-guide | General market/use-case guidance; use as business context only. |

## Repo and Template Scorecard

| Rank | Source | Use Level | Score | Grade | Core / Advanced | What to Use | What Not to Copy | Risk |
|---:|---|---|---:|---|---|---|---|---|
| 1 | Medusa official marketplace recipe | FOUNDATION | 95 | A | Advanced/M4 | Module, data models, module links, vendor API routes, workflows, admin extensions | Do not implement before Core checkout proof | Low |
| 2 | Medusa vendors recipe | FOUNDATION | 94 | A | Advanced/M4 | Vendor/vendor-admin model, custom actor/auth pattern, vendor product/order isolation, order split flow | Do not blindly copy routes without mdeai permissions and tests | Low |
| 3 | Medusa core | FOUNDATION | 93 | A | Core | Commerce service, products, variants, carts, orders, inventory, payments | Do not fork core | Low |
| 4 | Medusa examples repo | REFERENCE | 90 | A- | Core/Advanced | v2 example patterns: agentic commerce, Algolia, bundled products, restaurant marketplace, ticket booking | Do not import unrelated examples into Core | Low |
| 5 | Restaurant marketplace example | REFERENCE | 89 | A- | Advanced/M4-M5 | Copyable `src/modules`, `src/links`, `src/workflows`, `src/api`; good pattern for events/venues/restaurants | Do not adopt restaurant model names directly for fashion vendors | Medium |
| 6 | Mercur | REFERENCE / POSSIBLE ACCELERATOR | 86 | B+ | Advanced/M4+ | Vendor portal ideas, admin rules, commissions, B2C/B2B marketplace patterns, Stripe/Resend integration references | Do not replace mdeapp with Mercur storefront; do not start Connect/split payments from day one | High if copied wholesale |
| 7 | Medusa Next.js starter | REFERENCE | 83 | B | Core | SDK usage, cart/product page patterns, checkout UX patterns | Do not create a second storefront | Medium |
| 8 | Agilo fashion starter | REFERENCE | 81 | B | Core/Advanced | Fashion variant UX, color/material selection, collections, responsive product UI, checkout inspiration | Do not adopt its storefront as mdeai frontend | Medium |
| 9 | Medusa fashion/apparel solution page | REFERENCE | 78 | B- | Product strategy | Fashion variant, returns/exchanges, multi-region, D2C/B2B ideas | Not code; do not treat as implementation guide | Low |
| 10 | Tameta guide | REFERENCE | 70 | C+ | Strategy | MVP checklist, vendor onboarding, buyer acquisition metrics, feature framing | Not official; do not use as source for Medusa code patterns | Medium |
| 11 | Shahed Nasser medusa-marketplace plugin | AVOID FOR CODE | 45 | D | Historical only | Read feature list for old marketplace concerns: stores, invites, ACL | Deprecated, Medusa Extender-era, old migration style | High |
| 12 | Adam Lesniak medusa-marketplace | AVOID | 35 | D- | Historical only | Maybe compare old file organization | Low adoption, v1 compatibility note, tiny repo, no releases | High |

## Starter Template Recommendation

### Best Answer

There is **no single starter we should install as the mdeai marketplace foundation today**.

Use this instead:

```text
Core:
  Create bounded Medusa service from official Medusa app setup.
  Add Stripe test checkout.
  Add 20 products.
  Integrate into existing mdeapp via Medusa JS SDK.

MVP Marketplace:
  Use official marketplace/vendors recipe.
  Copy only selected patterns from restaurant-marketplace.
  Reference Mercur for vendor dashboard and commissions.

Fashion/Lifestyle UX:
  Reference Agilo fashion starter for variants, collection pages, and product UI ideas.
```

### Why Not Mercur First?

Mercur is the strongest full marketplace package, but it starts too far ahead of the current proof milestone. It includes full marketplace assumptions: vendor panel, admin panel, B2C storefront, multi-vendor shopping, Stripe integrations, and marketplace rules. mdeai still needs:

1. A trustworthy verification floor.
2. A bounded Medusa service.
3. One internal/demo seller.
4. One paid Stripe test order.
5. One Medusa order created from AI ProductCard checkout.

Mercur becomes valuable after those are proven.

## Top 10 Ways mdeai Can Use These Repos

| # | Way to Use | Source | Phase | Concrete Use | Score |
|---:|---|---|---|---|---:|
| 1 | Build the Medusa backend as bounded commerce service | Medusa core/docs | Core | Products, variants, carts, orders, inventory, Stripe payment lifecycle | 95 |
| 2 | Add marketplace module after Core | Official marketplace recipe | Advanced/M4 | Vendor data models, module links to product/order, protected vendor API routes | 94 |
| 3 | Implement vendor/admin/order split pattern | Vendors recipe | Advanced/M4 | Vendor admin actor, vendor product/order isolation, multi-vendor split workflow | 93 |
| 4 | Copy example structure, not domain names | Restaurant marketplace example | Advanced/M4-M5 | Copy `modules`, `links`, `workflows`, `api` layout into `commerce/medusa` | 89 |
| 5 | Study Mercur vendor portal | Mercur | Advanced/M4 | Vendor dashboard UX, store management, commissions, marketplace admin rules | 86 |
| 6 | Use Mercur as future accelerator | Mercur | Advanced/M4+ | Evaluate CLI/blocks after Core checkout proof, not before | 82 |
| 7 | Borrow fashion ProductCard ideas | Agilo fashion starter | Core/M2 | Variant selectors, color/material swatches, collection storytelling | 81 |
| 8 | Borrow checkout UX patterns | Agilo + Next.js starter | Core/M2-M3 | Product, cart, checkout, order confirmation UI references | 80 |
| 9 | Use examples for adjacent commerce | Medusa examples | Advanced | Agentic commerce, Algolia/search, bundled products, ticket booking, digital products | 79 |
| 10 | Use marketplace guides for business metrics | Tameta + Medusa marketplace page | Strategy | Vendor onboarding, GMV, conversion, average order value, buyer/vendor acquisition | 70 |

## Top 10 Feature / Use Case Recommendations

| # | Feature / Use Case | Core or Advanced | Real-World Example | Source Inspiration | mdeai Fit | Score |
|---:|---|---|---|---|---|---:|
| 1 | AI Product Search to ProductCard | Core | User asks: "Find a white linen shirt for dinner in Provenza" and sees live product cards | Medusa Store API + mdeai CopilotKit/Mastra | Perfect first proof | 96 |
| 2 | Single-vendor Stripe test checkout | Core | User pays for one demo product and a Medusa order is created | Medusa checkout/payment lifecycle | Required before marketplace | 95 |
| 3 | Fashion variant shopping | Core | User chooses size/color/material from a ProductCard | Medusa fashion page + Agilo | Strong Medellin fashion fit | 91 |
| 4 | Product embeddings with live hydration | Core | Semantic search finds products, but price/stock comes from Medusa at display time | Medusa + Supabase pgvector | Critical architecture fit | 90 |
| 5 | Vendor module | Advanced | Local designer gets a vendor profile after manual approval | Medusa marketplace/vendors recipe | Strong after Core | 88 |
| 6 | Vendor dashboard v1 | Advanced | Designer manages products/orders without full internal admin access | Mercur + Medusa admin extensions | Useful but not Core | 85 |
| 7 | Restaurant/venue marketplace links | Advanced | Restaurant event page shows purchasable tasting menu products | Restaurant marketplace example | Strong mdeai lifestyle fit | 84 |
| 8 | Event product commerce | Advanced | Colombiamoda event page links runway pieces or tickets/packages | Restaurant marketplace + event platform | Strong differentiation | 83 |
| 9 | Stripe Connect Express | Advanced | Approved vendors onboard for payout after single-vendor checkout works | Mercur + Stripe Connect | Needed later, risky early | 78 |
| 10 | Featured placements | Advanced/Post-MVP | Designer pays for featured placement in search results | Mercur admin rules + marketplace strategy | Monetization after liquidity | 68 |

## Code We Can Use

| Code / Pattern | Source | Use In mdeai | How to Adapt | Phase |
|---|---|---|---|---|
| Custom module data models | Medusa marketplace/vendors recipe | `commerce/medusa/src/modules/marketplace` | Create `vendor`, `vendor_admin`, later `commission_rule` | M4 |
| Module links | Medusa marketplace recipe, restaurant example | `commerce/medusa/src/links` | Link vendor to product/order; link restaurant/venue/event context later | M4-M5 |
| Workflows with rollback | Medusa docs/marketplace page | `commerce/medusa/src/workflows` | Vendor invite, order split, payout status sync | M4 |
| Custom API routes | Vendors recipe, restaurant example | `commerce/medusa/src/api` | Protected vendor/admin routes; no raw service mutation in routes | M4 |
| Copy-into-existing-app pattern | Restaurant marketplace README | `commerce/medusa` | Copy selected folders only after Core is green | M4 |
| Vendor dashboard UX | Mercur | Design/reference only | Build minimal read-heavy dashboard first; no full portal copy | M4 |
| Marketplace admin rules | Mercur | Admin planning | Vendor verification, commissions, marketplace rules | M4-M5 |
| Fashion variant UX | Agilo fashion starter | mdeapp ProductCard/ProductDetail | Adapt swatches/selectors to existing mdeai design system | Core/M2 |
| Checkout/cart UX | Medusa Next.js starter, Agilo | mdeapp cart state UI | Reuse concepts, not full storefront | Core/M2-M3 |
| Search/filter examples | Medusa examples, Mercur | Mastra product_search + Supabase vectors | Semantic first, Medusa hydration always | Core/M2 |

## Code We Should Not Use Directly

| Source | Avoid | Reason |
|---|---|---|
| Mercur storefront | Do not replace mdeapp UI | Violates "no separate ecommerce frontend" and duplicates surface area. |
| Mercur full marketplace bootstrap | Do not start Core from it | Brings vendor panel/admin/Connect complexity before paid order proof. |
| Agilo storefront | Do not adopt wholesale | Useful fashion UX, but separate storefront structure conflicts with mdeai. |
| Shahed marketplace plugin | Do not implement | Deprecated and Medusa Extender-era. |
| Adam marketplace repo | Do not implement | Too small, low adoption, older Medusa compatibility. |
| Tameta guide code assumptions | Do not implement as source truth | General blog guidance, not official implementation docs. |

## Core Feature Backlog from Repo Review

| Feature | Source | Action | Linear Task Fit |
|---|---|---|---|
| Medusa service | Medusa core/docs | Start official Medusa app under `commerce/medusa` | ECOM-C-002 |
| Stripe test checkout | Medusa + Stripe | Configure Medusa Stripe provider and proof order creation | ECOM-C-004 |
| Demo product catalog | Agilo/fashion inspiration | Seed 20 lifestyle products with variants/images | ECOM-C-006 |
| Medusa JS SDK wrapper | Medusa Next starter/docs | Use SDK, no raw fetch | ECOM-C-007 |
| Product embeddings | mdeai architecture | Store vectors/link IDs only in Supabase | ECOM-C-008/009 |
| Product search/detail tools | Medusa + Mastra | Hydrate live products from Medusa | ECOM-C-010/011 |
| Cart/checkout tools | Medusa Store API | Create cart, add item, create checkout link | ECOM-C-012/013 |
| ProductCard UI | Agilo + mdeai UI | Variant/image/price/availability card | ECOM-C-014 |
| E2E paid proof | Medusa/Stripe | One paid test order creates Medusa order | ECOM-C-016 |
| Ops playbook | Marketplace readiness | Manual support/refund/fulfillment | ECOM-C-017 |

## Advanced Feature Backlog from Repo Review

| Feature | Source | Trigger | Notes |
|---|---|---|---|
| Vendor module | Medusa marketplace/vendors recipe | ECOM-C-018 green | Use official module/link/workflow pattern. |
| Vendor admin invite | Vendors recipe | Vendor module + applications | Protected workflow, not route-only mutation. |
| Vendor dashboard v1 | Mercur reference | Vendor admin invite complete | Build minimal dashboard, not full portal. |
| Stripe Connect Express | Mercur + Stripe docs | Single-vendor checkout proven | Keep KYC in Stripe. |
| Multi-vendor split | Vendors recipe + Mercur | Connect onboarding proven | Workflow compensation required. |
| Restaurant/venue commerce | Restaurant example | Core readiness | Link context to Medusa products only. |
| Event product links | Restaurant example + events platform | Core readiness | Colombiamoda/runway commerce. |
| WhatsApp payment link | Existing mdeai Chatwoot/WhatsApp | Web checkout proven | Send web checkout link only. |
| Analytics | Tameta metrics + mdeai Supabase | Real traffic/orders | Event metadata only, no commerce truth. |
| Featured listings | Mercur admin rules | Analytics + liquidity | Manual pilot only. |

## Starter Decision Matrix

| Option | Time to First Checkout | Marketplace Completeness | Fit With Existing mdeai | Risk | Verdict |
|---|---:|---:|---:|---:|---|
| Official Medusa backend + mdeapp UI | Fast | Low initially | Excellent | Low | Best Core choice |
| Official marketplace recipe | Medium | High after Core | Excellent | Medium | Best M4 implementation path |
| Restaurant marketplace example | Medium | Medium/high by pattern | Good | Medium | Best example to copy selected folders |
| Mercur full starter | Fast for standalone marketplace | Very high | Poor for Core | High | Reference/accelerator after Core |
| Agilo fashion starter | Fast for standalone fashion store | Low marketplace | Medium | Medium | UX/catalog reference only |
| Deprecated marketplace plugin | Unknown | Old | Poor | High | Avoid |

## Recommended Implementation Order

```text
1. Finish COMM-01 verification floor.
2. Create commerce ADR.
3. Create Medusa backend service.
4. Configure Stripe test checkout.
5. Configure Cloudinary media.
6. Seed 20 products with fashion/lifestyle variants.
7. Add Medusa JS SDK wrapper to mdeapp.
8. Add Supabase embeddings/links only.
9. Add Mastra product_search and product_detail.
10. Add cart and checkout tools.
11. Render CopilotKit ProductCards.
12. Complete one paid Stripe test order -> Medusa order.
13. Only then start marketplace recipe work.
14. Use restaurant-marketplace copyable module/link/workflow/API layout.
15. Use Mercur as vendor dashboard/commission reference, not as base app.
```

## Final Recommendation

**Starter to start with now:** official Medusa backend setup plus existing mdeai frontend.

**Starter to use for marketplace later:** official Medusa marketplace/vendors recipe, with selected code layout copied from `medusajs/examples/restaurant-marketplace`.

**Best advanced accelerator/reference:** Mercur, but only after Core paid-order proof. It is strong enough to study seriously, not small enough to drop into mdeai Core safely.

**Fashion reference:** Agilo fashion starter is worth mining for visual product UX, variant controls, collection pages, and checkout polish. Do not copy the storefront architecture.

**Avoid:** the deprecated Shahed Nasser marketplace plugin and the small Adam Lesniak repo as implementation foundations.

