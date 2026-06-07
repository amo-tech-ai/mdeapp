---
id: ECOM-REPO-AUDIT-004
title: Commerce repo forensic audit (Mercur + Medusa)
status: Complete
created_at: 2026-06-07
updated_at: 2026-06-07
owner: mdeai-commerce
auditor: marketplace-architect-review
repos_audited:
  mercur:
    - https://github.com/mercurjs/mercur
    - https://github.com/mercurjs/clean-medusa-starter
    - https://github.com/mercurjs/b2c-marketplace-storefront
    - https://github.com/mercurjs/vendor-panel
    - https://github.com/mercurjs/admin-panel
  medusa:
    - https://github.com/medusajs/medusa
    - https://github.com/medusajs/dtc-starter
    - https://github.com/medusajs/b2b-starter
    - https://github.com/medusajs/b2b-starter-medusa
    - https://github.com/medusajs/medusa-starter-default
    - https://github.com/medusajs/medusa-starter-plugin
    - https://github.com/medusajs/examples
related_docs:
  - 01-ecommerce-plan.md
  - 03-marketplace-starter-repo-review.md
---

# Commerce Repo Forensic Audit — Mercur + Medusa

Forensic review of **12 commerce repos** against the mdeai stack (Next.js 16, CopilotKit, Mastra, Gemini, Supabase, Stripe, Maps, pgvector, Cloudinary, WhatsApp/Chatwoot, Events/Trips/Venues/Rentals/AI Concierge).

**North-star flow:** AI search → ProductCard → cart → Stripe checkout → Medusa/Mercur order.

---

## Master summary — all repos at a glance

**One-line verdict:** Start with **`mercur`** backend. Keep **`mdeapp`** as buyer UI. Use **`medusajs/examples`** + **`dtc-starter`** as pattern libraries. Avoid deprecated starters, B2B starters, and any second storefront.

| # | Repo | Family | Grade | Score | Use level | Phase | Use it for | Do NOT use for |
|---:|---|---|---:|---:|---|---|---|---|
| 1 | [**mercur**](https://github.com/mercurjs/mercur) | Mercur | **A** | **91** | **FOUNDATION** | Core → MVP | Marketplace backend (`apps/api` + `@mercurjs/core`), vendor/admin dashboards in MVP, Stripe Connect, multi-vendor orders | Replacing mdeapp buyer UI; colocating into Supabase |
| 2 | [**medusajs/examples**](https://github.com/medusajs/examples) | Medusa | **A** | **88** | **REFERENCE** | Core → Advanced | Copy modules/workflows/API layout: `restaurant-marketplace`, `agentic-commerce`, `ticket-booking`, `product-rentals`, `marketplace`, `product-reviews` | Installing whole examples as production apps |
| 3 | [**medusajs/medusa**](https://github.com/medusajs/medusa) | Medusa | **A-** | **85** | **REFERENCE** | Always | Framework docs, module architecture, upgrade notes (v2.15.5 core) | Deploying the monorepo itself — use a starter |
| 4 | [**mercurjs/b2c-marketplace-storefront**](https://github.com/mercurjs/b2c-marketplace-storefront) | Mercur | **B** | **74** | **REFERENCE** | Core → MVP | SDK wiring, cart UX, seller pages, fashion PLP/PDP patterns in mdeapp | Production storefront (conflicts with mdeapp) |
| 5 | [**medusajs/dtc-starter**](https://github.com/medusajs/dtc-starter) | Medusa | **B+** | **82** | **REFERENCE** / Core fallback | Core | Official DTC backend layout if Mercur spike blocked; cart/checkout SDK patterns | Marketplace/multi-vendor (no vendor module) |
| 6 | [**medusajs/medusa-starter-plugin**](https://github.com/medusajs/medusa-starter-plugin) | Medusa | **B** | **72** | **REFERENCE** | Advanced | Scaffolding custom Medusa plugins (event-product links, affiliate module) | Core checkout or marketplace foundation |
| 7 | [**mercurjs/clean-medusa-starter**](https://github.com/mercurjs/clean-medusa-starter) | Mercur | **C+** | **68** | **REFERENCE** / fallback | Core only | Bare Medusa 2.11 if Mercur + dtc both blocked | Long-term marketplace base |
| 8 | [**mercurjs/vendor-panel**](https://github.com/mercurjs/vendor-panel) | Mercur | **D+** | **58** | **DEFER** | — | Legacy vendor UX screenshots | Production — superseded by `mercur` `apps/vendor` |
| 9 | [**mercurjs/admin-panel**](https://github.com/mercurjs/admin-panel) | Mercur | **D+** | **56** | **DEFER** | — | Legacy admin UX screenshots | Production — superseded by `mercur` `apps/admin-test` |
| 10 | [**medusajs/medusa-starter-default**](https://github.com/medusajs/medusa-starter-default) | Medusa | **D** | **55** | **AVOID** | — | — | **Deprecated** — README says use `dtc-starter` |
| 11 | [**medusajs/b2b-starter**](https://github.com/medusajs/b2b-starter) | Medusa | **D** | **45** | **AVOID** | — | — | B2B quotes/approvals — wrong model for lifestyle marketplace |
| 12 | [**medusajs/b2b-starter-medusa**](https://github.com/medusajs/b2b-starter-medusa) | Medusa | **D-** | **40** | **AVOID** | — | — | **Deprecated** — use `b2b-starter`; still B2B anyway |

### What to use — quick pick

| Goal | Repo | Why |
|---|---|---|
| **Start commerce backend now** | `mercur` | Only repo with marketplace + Stripe Connect + vendor/admin APIs out of the box |
| **Keep buyer experience** | `mdeapp` (not a repo here) | AI concierge + ProductCards already live; no second Next storefront |
| **Copy code patterns safely** | `medusajs/examples` | Official v2 examples for restaurant/events/rentals/AI-agent commerce |
| **Fallback if Mercur blocked** | `dtc-starter` | Official maintained single-vendor starter (replaces deprecated `medusa-starter-default`) |
| **Fashion/cart UX ideas** | `b2c-marketplace-storefront` | Multi-vendor cart + seller page patterns only |
| **Custom mdeai plugins later** | `medusa-starter-plugin` | Event-product links, affiliate commissions, venue menus as Medusa modules |

### What to avoid

| Repo | Reason |
|---|---|
| `medusa-starter-default` | Deprecated → use [`dtc-starter`](https://github.com/medusajs/dtc-starter) |
| `b2b-starter-medusa` | Deprecated → replaced by [`b2b-starter`](https://github.com/medusajs/b2b-starter), but B2B is out of scope anyway |
| `b2b-starter` | Company spending limits + quote approvals — not Camila's lifestyle shopping model |
| `vendor-panel` / `admin-panel` (standalone) | Mercur 1.x drift — use Mercur 2.0 monorepo apps |
| Any Medusa/Mercur **storefront** repo | mdeapp is the storefront |

### Top `medusajs/examples` folders for mdeai

| Example folder | mdeai vertical | Phase |
|---|---|---|
| `agentic-commerce` | AI agent selling via CopilotKit/Mastra | Core |
| `marketplace` | Official vendor module pattern (Mercur supersedes in MVP) | MVP reference |
| `restaurant-marketplace` | Restaurants + venue menus | MVP |
| `ticket-booking` | Events / Colombiamoda tickets | MVP |
| `product-rentals` | Rentals vertical | Advanced |
| `product-reviews` | Designer product reviews | MVP |
| `wishlist-plugin` | Saved collections | MVP |
| `bundled-products` | Trip/experience packages | Advanced |

---

## 1. Executive verdict

**Recommendation:** Spike **`mercur` 2.0 monorepo backend** (`apps/api` + `@mercurjs/core`) as a **bounded commerce service** beside mdeapp. Keep mdeapp as the only buyer-facing AI UI. Do **not** adopt `b2c-marketplace-storefront` as production code.

| Role | Repo | Verdict |
|---|---|---|
| **Best repo to start with** | `mercur` | Clone/spike `apps/api` via `mercurjs create` or monorepo template — marketplace-ready Medusa 2.13 backend |
| **Best repo for backend** | `mercur` | `@mercurjs/core` plugin: sellers, commissions, payouts, order-groups, vendor/admin APIs |
| **Best buyer storefront reference** | `b2c-marketplace-storefront` | SDK wiring, cart, seller pages, fashion UX — copy patterns into mdeapp only |
| **Best vendor dashboard** | `mercur` (in-monorepo `apps/vendor`) | **Not** standalone `vendor-panel` — that repo is Mercur 1.x (v1.5.4) |
| **Best admin dashboard** | `mercur` (in-monorepo `apps/admin-test`) | **Not** standalone `admin-panel` — same v1.x drift risk |
| **Repos to avoid for Core** | `b2c-marketplace-storefront`, standalone `vendor-panel`, standalone `admin-panel` | Second storefront or legacy panels that fight mdeapp ownership |

**Core constraint unchanged:** Core = one internal seller, one paid Stripe order, ProductCards in existing chat — **no** multi-vendor split, **no** Stripe Connect, **no** vendor onboarding yet.

Your pre-audit instinct is **mostly right**, with one correction: use **Mercur 2.0 in-monorepo** vendor/admin surfaces in MVP, not the standalone `vendor-panel` / `admin-panel` repos.

---

## 2. Repo comparison table

| Repo | Purpose | Use level | Phase | Score | Why | Main risk |
|---|---|---|---:|---:|---|---|
| `mercur` | Mercur 2.0 Turborepo: Medusa API + `@mercurjs/core` marketplace plugin + admin/vendor Vite apps + CLI/blocks | **FOUNDATION** (backend) / **REFERENCE** (dashboards in Core) | Core backend spike → MVP production backend | **91** | Only repo with full marketplace domain (seller, commission, payout, order-group, Stripe Connect provider, 141 test files, AI MCP/llms.txt/skills) | Second Postgres + Redis; Bun toolchain; Medusa 2.13 ≠ mdeai Supabase; over-adoption if whole monorepo replaces mdeapp |
| `clean-medusa-starter` | Vanilla Medusa 2.11.3 starter, no marketplace | **REFERENCE** / lean **Core fallback** | Core only if Mercur spike fails | **68** | Smallest Medusa surface for “one paid order” proof | 0 stars, stale (Dec 2025), no marketplace path — rebuild later |
| `b2c-marketplace-storefront` | Next.js 15 B2C buyer storefront for Mercur backend | **REFERENCE** | Core (SDK patterns) / MVP (UX ideas) | **74** | `@medusajs/js-sdk` wiring, cart, wishlist, seller pages, fashion demo | **AVOID as foundation** — duplicates mdeapp; Next 15 vs mdeai Next 16; separate auth/cart state |
| `vendor-panel` | Standalone Vite vendor dashboard (Mercur 1.x line) | **DEFER** → **REFERENCE** only | MVP+ (only if pinned to matching backend) | **58** | Product/order/payout UX reference | **Version drift** — v1.5.4, `@medusajs/js-sdk` ^2.5; superseded by `mercur` `apps/vendor` + `@mercurjs/vendor` |
| `admin-panel` | Standalone Vite admin dashboard (Mercur 1.x line) | **DEFER** → **REFERENCE** only | MVP+ | **56** | Seller approval, commissions, attributes UX reference | Same drift; forked from Medusa admin; 17 stars; use monorepo admin instead |

---

## 3. Per-repo forensic audit

### 3.1 `mercurjs/mercur`

| # | Question | Answer |
|---|---|---|
| 1 | What is this repo for? | Mercur 2.0 open-source multi-vendor marketplace **platform** on Medusa 2.13. Turborepo (Bun): `apps/api` (Medusa server), `packages/core` (marketplace plugin), `packages/admin` / `packages/vendor` (dashboard UI libs), `apps/admin-test` (:7000), `apps/vendor` (:7001), `@mercurjs/cli`, blocks registry, Stripe Connect payout provider. |
| 2 | Foundation, reference, or avoid? | **FOUNDATION** for commerce backend; **REFERENCE** for dashboards during Core. |
| 3 | Core, MVP, or Advanced? | **Core** — spike `apps/api` only. **MVP** — vendor/admin apps + Connect. **Advanced** — blocks registry, Algolia/Meilisearch, subscriptions. |
| 4 | Features provided | Sellers/members, commissions, payouts (Stripe Connect), order-groups (multi-vendor cart split), vendor-scoped catalog/inventory/shipping/promotions, admin + vendor APIs (`/admin/*`, `/vendor/*`, `/store/*`), typed `@mercurjs/client`, dashboard SDK (file-based routes), AI docs (MCP, llms.txt, AGENTS.md, `.claude/skills/`). |
| 5 | What to copy | `withMercur()` config pattern; Store API cart/checkout flows; commission/payout **workflows** (MVP+); dashboard page patterns from `@mercurjs/admin` / `@mercurjs/vendor`; Stripe Connect provider setup (MVP). |
| 6 | What not to copy | Entire monorepo as mdeapp replacement; Redis/Postgres assumptions into Supabase; TalkJS chat (mdeai has Chatwoot); Algolia (mdeai has pgvector + Mastra). |
| 7 | mdeai UI fit | **Headless by design.** mdeapp renders ProductCards in CopilotKit chat + map column; Mercur serves JSON via Store API — same model as events/rentals APIs today. |
| 8 | CopilotKit + Mastra fit | **Excellent.** Add Mastra tools: `search_products`, `get_product`, `add_to_cart`, `create_checkout_session` calling Medusa/Mercur Store API + `@medusajs/js-sdk` in mdeapp API routes. CopilotKit `useCopilotAction` renders ProductCards from tool results — mirrors event/rental cards. |
| 9 | Supabase + pgvector fit | **Complementary, not merged.** Keep Supabase as mdeai system of record (users, events, trips, venues, embeddings). Store `medusa_product_id` + `medusa_variant_id` in Supabase `product_embeddings` / link tables. Semantic search in pgvector → hydrate price/stock from Mercur at card render. **Do not** point Mercur at Supabase as its commerce DB without a dedicated migration project. |
| 10 | Stripe fit | Built-in payment + **Stripe Connect** payout provider (`@mercurjs/payout-stripe-connect`). mdeai already uses Stripe for events — use **separate** Stripe objects/webhooks for commerce (`STRIPE_SECRET_KEY` in Mercur API env). Core: standard Stripe checkout. MVP: Connect Express for vendors. |
| 11 | Risks | Dual-database ops; Redis dependency; Bun vs mdeapp npm; Medusa 2.13 upgrade cadence; accidental full-monorepo adoption; Stripe webhook collision with event checkout if not namespaced. |
| 12 | Implementation complexity | **Core spike:** Medium (2–4 days). **MVP marketplace:** High (2–4 weeks). **Advanced AI lifestyle:** High ongoing. |
| 13 | Score | **91/100** as backend foundation; **45/100** if interpreted as “replace mdeapp frontend too.” |

---

### 3.2 `mercurjs/clean-medusa-starter`

| # | Question | Answer |
|---|---|---|
| 1 | What is this repo for? | Bare Medusa 2.11.3 starter — official `medusa-starter-default` clone with no Mercur marketplace layer. |
| 2 | Foundation, reference, or avoid? | **REFERENCE** / emergency **Core fallback**. |
| 3 | Phase | **Core only** (single-vendor paid order). |
| 4 | Features | Products, variants, cart, orders, Medusa admin SDK — no sellers, commissions, splits. |
| 5 | Copy | Project layout, `medusa-config.ts`, seed script, integration test harness. |
| 6 | Do not copy | As long-term marketplace base — you would re-implement Mercur modules manually. |
| 7 | mdeai UI fit | Same headless fit as any Medusa backend. |
| 8 | CopilotKit + Mastra | Same tool pattern as Mercur — fewer marketplace tools needed in Core. |
| 9 | Supabase + pgvector | Same dual-DB pattern as Mercur. |
| 10 | Stripe | Standard Medusa Stripe provider — simpler than Connect for Core. |
| 11 | Risks | Dead-end for Colombiamoda multi-vendor; version lag (2.11.3 vs Mercur 2.13.4); 0 GitHub stars signals low maintenance. |
| 12 | Complexity | **Low** for Core (1–2 days). |
| 13 | Score | **68/100** |

---

### 3.3 `mercurjs/b2c-marketplace-storefront`

| # | Question | Answer |
|---|---|---|
| 1 | What is this repo for? | Official Mercur **buyer** Next.js storefront — multi-vendor browse, cart, checkout, seller pages, wishlist. Fashion industry demo at [b2c.mercurjs.com](https://b2c.mercurjs.com/). |
| 2 | Foundation, reference, or avoid? | **REFERENCE** for buyer UX. **AVOID** as production foundation. |
| 3 | Phase | **Core** — SDK/env patterns only. **MVP** — cart/checkout UX ideas. |
| 4 | Features | Home, PLP, PDP, cart, seller storefront, wishlist; `@medusajs/js-sdk`; Stripe Elements; TalkJS; next-intl (Spanish — **conflicts** with mdeai Phase 1 English-only rule). |
| 5 | Copy | `src/lib/config.ts` SDK setup; cart session handling; multi-vendor cart grouping concepts; seller page layout ideas for designer storefronts (Advanced). |
| 6 | Do not copy | Full app shell, routing, i18n layer, TalkJS, or deploy as second frontend. |
| 7 | mdeai UI fit | **Poor as replacement** — mdeai is chat-first concierge + map, not catalog-first ecommerce. Good **pattern** source for ProductCard fields (variant, seller badge, price). |
| 8 | CopilotKit + Mastra | No CopilotKit — traditional ecommerce navigation. mdeapp must own AI orchestration. |
| 9 | Supabase + pgvector | No vector search — catalog browse only. mdeai AI search stays in Mastra + Supabase. |
| 10 | Stripe | Client-side Stripe.js — reuse concepts in mdeapp checkout modal, not whole flow. |
| 11 | Risks | Two Next apps; design system drift from mdeai DESIGN.MD; Next 15.5.9 vs 16; maintenance of duplicate cart/auth. |
| 12 | Complexity | **Low** to read; **Very high** if adopted as production storefront. |
| 13 | Score | **74/100** as reference; **25/100** as foundation. |

---

### 3.4 `mercurjs/vendor-panel`

| # | Question | Answer |
|---|---|---|
| 1 | What is this repo for? | Standalone **Mercur 1.x** vendor dashboard — products, orders, store settings, reviews, analytics. Demo: [vendor.mercurjs.com](https://vendor.mercurjs.com/). |
| 2 | Foundation, reference, or avoid? | **DEFER**. **REFERENCE** for UX until MVP. **Avoid** as production code against Mercur 2.0 API. |
| 3 | Phase | **MVP** (vendor onboarding) — prefer `mercur` `apps/vendor`. |
| 4 | Features | Product CRUD, order tracking, store customization, review handling, analytics, TalkJS. |
| 5 | Copy | Form layouts, product wizard steps, payout onboarding screens (after API match). |
| 6 | Do not copy | Package versions, API client assumptions, deploy as-is against Mercur 2.0. |
| 7 | mdeai UI fit | Separate Vite app on subdomain (`vendors.mdeai.co`) — acceptable for Roberto-style hosts / designers, not inside mdeapp chat. |
| 8 | CopilotKit + Mastra | None — vendors use traditional dashboard. Future: Mastra “vendor assistant” can call same vendor APIs. |
| 9 | Supabase + pgvector | Vendor auth should map to Supabase user IDs via link table — not built-in. |
| 10 | Stripe | Payout onboarding UI — reference only; backend is Mercur payout module. |
| 11 | Risks | **API version mismatch** with Mercur 2.0 (`js-sdk` ^2.5 vs ^2.13); duplicate of monorepo `apps/vendor`. |
| 12 | Complexity | Medium if forced to integrate standalone; **Low** if using monorepo vendor app instead. |
| 13 | Score | **58/100** |

---

### 3.5 `mercurjs/admin-panel`

| # | Question | Answer |
|---|---|---|
| 1 | What is this repo for? | Standalone **Mercur 1.x** marketplace **operator** admin — sellers, requests, commissions, attributes, payouts. |
| 2 | Foundation, reference, or avoid? | **DEFER** / **REFERENCE**. Prefer `mercur` `apps/admin-test` + `@mercurjs/admin`. |
| 3 | Phase | **MVP** (Patricia ops) — can coexist with mdeai `/admin/*` for non-commerce ops. |
| 4 | Features | Seller management, product moderation, commission config, attribute management, payout inspection. |
| 5 | Copy | Commission rule UI, seller approval queue, attribute taxonomy patterns. |
| 6 | Do not copy | Whole admin shell — mdeai already has `/admin/*` shell; merge commerce admin as module or iframe subdomain. |
| 7 | mdeai UI fit | Patricia admin: either embed Mercur admin routes or run `admin.commerce.mdeai.co` linked from mdeai admin nav. |
| 8 | CopilotKit + Mastra | Not applicable to admin panel directly. |
| 9 | Supabase + pgvector | Product moderation could cross-reference Supabase embedding quality scores — custom bridge. |
| 10 | Stripe | Commission + payout admin views — requires Connect (MVP). |
| 11 | Risks | Same 1.x drift; 17 stars; overlaps mdeai admin investment. |
| 12 | Complexity | Medium–high for merge into mdeai admin. |
| 13 | Score | **56/100** |

---

## 4. Recommended architecture

### Options evaluated

| Option | Summary | Verdict |
|---|---|---|
| **A** — `mercur` monorepo as marketplace foundation | Full monorepo (API + admin + vendor + future storefront) | **Partial yes** — backend + MVP dashboards only |
| **B** — `clean-medusa-starter` + Mercur pieces | Lean Medusa, add `@mercurjs/core` later | Valid **Core fallback** if Mercur spike blocked |
| **C** — Official Medusa first, Mercur panels later | Medusa recipe + manual marketplace module | Safe but **slower**; duplicates Mercur 2.0 work |
| **D** — Mercur repos reference only | Study, build custom | **Too slow** — Mercur 2.0 block/CLI model exists to avoid this |

### **Pick: Modified Option A**

```text
commerce/mercur/          ← mercurjs create (or clone apps/api + packages/core)
  packages/api/           ← Medusa + withMercur() — PRODUCTION commerce backend
  apps/vendor/            ← MVP: designer dashboard (subdomain)
  apps/admin-test/        ← MVP: Patricia commerce admin (subdomain or linked)

mdeapp/                   ← UNCHANGED buyer AI surface
  Mastra tools → Mercur Store API
  CopilotKit ProductCards
  Supabase pgvector → medusa_product_id hydration
```

**Why not full Option A:** Do not run `b2c-marketplace-storefront` or merge standalone `vendor-panel`/`admin-panel`. Do not colocate commerce Postgres inside Supabase for v1.

**Why not Option B for primary path:** `clean-medusa-starter` saves ~1 day in Core but forces marketplace re-work in MVP. Mercur 2.0 `apps/api` is already a clean Medusa server **plus** marketplace plugin — spike cost is similar, upside much higher.

**Why not Option C:** [03-marketplace-starter-repo-review.md](./03-marketplace-starter-repo-review.md) recommended official Medusa recipe first. That remains valid for risk-averse teams. For mdeai, Mercur 2.0 **is** the marketplace recipe — maintained, tested (141 tests), Stripe Connect included — copying Medusa recipe by hand is reimplementation.

### Integration diagram

```text
Camila (buyer)                    Roberto / Designer (seller)
      │                                      │
      ▼                                      ▼
 mdeapp /chat                     vendors.mdeai.co (Mercur vendor app)
 CopilotKit + ProductCards                │
      │                                  │
      ▼                                  ▼
 Mastra conciergeAgent              Mercur /vendor/* API
 search_products / checkout               │
      │                                  │
      ├──────── Store API ───────────────┤
      │                                  │
      ▼                                  ▼
           commerce/mercur packages/api (:9000)
           @mercurjs/core + Medusa 2.13
           Postgres + Redis + Stripe
      │
      ▼
 Supabase (parallel)
 - auth users
 - product_embeddings (pgvector)
 - medusa_product_id links
 - events / trips / venues (unchanged)
```

---

## 5. Practical implementation plan

### Core

**Goal:** One AI-assisted paid order (single internal seller).

| Task | Detail | Repo source |
|---|---|---|
| Spike backend | `npx @mercurjs/cli@latest create` → `commerce/mercur` OR clone `mercur` and run `apps/api` | `mercur` |
| Infra | Postgres (Neon/Supabase dedicated DB or local), Redis, env secrets via Infisical | `mercur` template |
| Stripe | Medusa Stripe provider, test mode, webhook endpoint `commerce/*` separate from events | `mercur` docs |
| Seed products | 10–20 Medellín lifestyle SKUs (fashion + event merch), one seller | `mercur` seed + mdeai catalog plan |
| SDK bridge | `@medusajs/js-sdk` in `mdeapp/src/lib/commerce/` | `b2c-marketplace-storefront` `config.ts` pattern |
| Supabase links | `product_embeddings.medusa_product_id`, `medusa_variant_id` | mdeai architecture |
| Mastra tools | `search_products`, `get_product`, `add_to_cart`, `create_checkout` | Medusa Store API docs + Mercur store routes |
| ProductCards | New `data-testid="product-card"` in chat results column | mdeai components (Agilo/fashion UX refs) |
| Paid proof | Stripe test payment → Mercur order in Postgres | ECOM-C-016 gate |
| **Explicitly skip** | Stripe Connect, vendor onboarding, `b2c-marketplace-storefront` deploy, standalone panels | — |

**Core exit criteria:** Prompt *"white linen shirt for dinner in Provenza"* → ProductCard → checkout → paid order → order ID in Mercur admin.

---

### MVP

**Goal:** Real multi-vendor marketplace (Colombiamoda, local designers).

| Task | Detail | Repo source |
|---|---|---|
| Vendor onboarding | Seller apply → admin approve workflow | `mercur` seller workflows |
| Vendor panel | Deploy `apps/vendor` at `vendors.mdeai.co` | `mercur` (not standalone `vendor-panel`) |
| Admin panel | Deploy `apps/admin-test` or merge Patricia nav | `mercur` (not standalone `admin-panel`) |
| Stripe Connect | Express onboarding, split payouts | `@mercurjs/payout-stripe-connect` |
| Multi-vendor orders | Order-group split at checkout | `mercur` order-group module |
| Designer storefronts | Public seller pages in mdeapp (`/shop/[handle]`) | `b2c-marketplace-storefront` seller page UX |
| Product moderation | Admin approve product publish | `mercur` admin product routes |
| Maps | Boutique pins from seller addresses | mdeai Maps + Mercur seller geo |
| WhatsApp | Order confirmation via Chatwoot template | mdeai existing |

---

### Advanced

**Goal:** AI lifestyle marketplace (fashion + events + trips + venues unified).

| Task | Detail |
|---|---|
| AI stylist | Mastra agent with wardrobe + event context + product embeddings |
| AI recommendations | pgvector similarity + Mercur collection rules |
| Event product links | Link `events.slug` → Mercur product collections (Colombiamoda) |
| Trip product links | Packaged experience products tied to trip itineraries |
| Venue product links | Restaurant tasting menus, nightlife table packages |
| Creator storefronts | Seller = designer/influencer; AI-generated lookbooks |
| Affiliate commissions | Mercur commission rules + referral metadata |
| Featured listings | Admin campaigns + paid placement workflow |
| AI vendor assistant | CopilotKit in vendor panel for catalog copy, pricing suggestions |

---

## 6. Final recommendation

### Which GitHub repo should we use first?

**`mercur`** — spike `apps/api` (via CLI `mercurjs create`) as the bounded commerce backend service.

### Which repos should we clone locally?

| Clone | Path | Purpose |
|---|---|---|
| **`mercur`** | `github/mercur/` or `commerce/mercur/` | Backend spike + MVP dashboards |
| **`b2c-marketplace-storefront`** | `github/mercur/b2c-marketplace-storefront/` | Read-only UX/SDK reference |
| ~~`clean-medusa-starter`~~ | Only if Mercur spike fails | Fallback |
| ~~`vendor-panel`~~ | Optional read-only | Legacy UX screenshots only |
| ~~`admin-panel`~~ | Optional read-only | Legacy UX screenshots only |

### Which repo should become production code?

| Layer | Production code |
|---|---|
| Commerce API + marketplace logic | **`mercur`** → `commerce/mercur/packages/api` + `@mercurjs/core` |
| Buyer AI UI | **`mdeapp`** (existing) |
| Vendor dashboard (MVP) | **`mercur`** `apps/vendor` |
| Admin commerce ops (MVP) | **`mercur`** `apps/admin-test` or extracted `@mercurjs/admin` pages |

### Which repos are reference only?

| Repo | Reference for |
|---|---|
| `b2c-marketplace-storefront` | SDK setup, cart UX, seller pages, fashion PLP/PDP |
| `clean-medusa-starter` | Minimal Medusa layout if Mercur blocked |
| `vendor-panel` (standalone) | Legacy vendor UX — do not ship |
| `admin-panel` (standalone) | Legacy admin UX — do not ship |

### Do not custom-build marketplace infrastructure unless Mercur cannot satisfy

Mercur 2.0 already ships: sellers, members, commissions, payouts, order-groups, vendor/admin APIs, Stripe Connect, dashboard SDK, CLI blocks. **Custom-build only:**

- mdeai-specific **AI ProductCard** rendering in CopilotKit
- **Supabase pgvector** semantic search + `medusa_product_id` bridge
- **Cross-vertical links** (event/trip/venue → product) in Supabase metadata
- **Chatwoot/WhatsApp** notification templates

---

## 7. Decision vs prior doc 03

| Topic | [03-marketplace-starter-repo-review.md](./03-marketplace-starter-repo-review.md) | This audit (04) |
|---|---|---|
| Mercur role | Reference/accelerator **after** Core | **Spike backend in Core**, dashboards in MVP |
| First backend | Official Medusa create | `mercurjs create` (Medusa + marketplace plugin) |
| Standalone panels | Mercur vendor portal as reference | **Avoid** — use Mercur 2.0 monorepo apps |
| Buyer UI | mdeapp only | **Unchanged** |
| Risk posture | Most conservative | **Pragmatic** — Mercur 2.0 reduces MVP re-work if Core spike validates in ≤4 days |

**Reconciliation:** Doc 03 is correct that you must not adopt Mercur's storefront or full marketplace on day one. Doc 04 adds that Mercur's **API layer** is the fastest safe backend — not slower than plain Medusa once you account for MVP marketplace work.

---

## 8. Immediate next commands

```bash
# 1. Clone for local study (reference + spike)
cd /home/sk/mdeai/mdeapp
mkdir -p github/mercur
git clone --depth 1 https://github.com/mercurjs/mercur.git github/mercur/mercur
git clone --depth 1 https://github.com/mercurjs/b2c-marketplace-storefront.git github/mercur/b2c-marketplace-storefront

# 2. Spike bounded backend (when ready — separate Infisical path)
npx @mercurjs/cli@latest create commerce-mercur-spike
# Configure DATABASE_URL, REDIS_URL, Stripe keys
# bun dev → verify :9000 store API, seed one product, POST cart/checkout

# 3. mdeapp SDK wrapper (after API up)
# npm install @medusajs/js-sdk in mdeapp
# src/lib/commerce/medusa-client.ts — copy pattern from b2c-storefront config.ts
```

---

## 9. Medusa repo audit

### 9.1 `medusajs/medusa` — core framework

| Field | Value |
|---|---|
| **What** | Medusa v2 commerce framework monorepo (34k★). Not a deployable app — the engine under all starters. |
| **Use level** | **REFERENCE** |
| **Phase** | Always — docs, architecture, version alignment |
| **Score** | **85/100 (A-)** |
| **Use for** | Understanding modules, workflows, payment providers, admin SDK; tracking releases (latest v2.15.5). |
| **Avoid** | Cloning as mdeai commerce service — use `mercur` or `dtc-starter` instead. |
| **mdeai fit** | Commerce truth lives in Medusa Postgres; mdeai reads via Store API. Supabase stays parallel for AI/verticals. |
| **Risk** | Low as reference; high if team tries to fork/contribute to core instead of building on starters. |

### 9.2 `medusajs/dtc-starter` — official DTC starter

| Field | Value |
|---|---|
| **What** | Official maintained DTC monorepo: `apps/backend` + `apps/storefront` (Next.js). Replaces deprecated `medusa-starter-default`. |
| **Use level** | **REFERENCE** / **Core fallback** |
| **Phase** | Core — if Mercur spike fails or team wants leanest single-vendor path |
| **Score** | **82/100 (B+)** |
| **Use for** | Backend folder layout, `medusa-config.ts`, seed/migrate scripts, `@medusajs/js-sdk` storefront patterns. |
| **Avoid** | Deploying `apps/storefront` — mdeapp owns buyer UI. No marketplace/vendor features. |
| **mdeai fit** | Good 2–3 day Core proof path: backend only + mdeapp ProductCards. |
| **Risk** | Medium — you'll rebuild marketplace layer in MVP that Mercur already ships. |

### 9.3 `medusajs/medusa-starter-default` — deprecated

| Field | Value |
|---|---|
| **What** | Old single-app Medusa starter. README: **"deprecated — use dtc-starter."** |
| **Use level** | **AVOID** |
| **Score** | **55/100 (D)** |
| **Why avoid** | Superseded, 375 forks of stale pattern. Use `dtc-starter` or `mercur` instead. |

### 9.4 `medusajs/b2b-starter` + `b2b-starter-medusa` — B2B

| Field | Value |
|---|---|
| **What** | Official B2B starters: company accounts, spending limits, quote negotiation, approval workflows. `b2b-starter-medusa` (414★) is **deprecated** → `b2b-starter` (25★). |
| **Use level** | **AVOID** for mdeai |
| **Score** | `b2b-starter` **45 (D)** · `b2b-starter-medusa` **40 (D-)** |
| **Why avoid** | mdeai is a **B2C lifestyle marketplace** (Camila shops, designers sell). B2B company/quote flows are wrong model. |
| **Exception** | Advanced B2B if mdeai later sells wholesale to boutiques — defer to Phase 2+. |

### 9.5 `medusajs/medusa-starter-plugin` — plugin scaffold

| Field | Value |
|---|---|
| **What** | Minimal Medusa v2 plugin template (modules, workflows, API routes). |
| **Use level** | **REFERENCE** |
| **Phase** | Advanced — custom mdeai commerce extensions |
| **Score** | **72/100 (B)** |
| **Use for** | Scaffolding: `event-product-link` module, `venue-menu` module, `affiliate-commission` module inside Mercur/Medusa backend. |
| **Avoid** | Using as commerce foundation — no products/cart/checkout out of the box. |

### 9.6 `medusajs/examples` — official example library

| Field | Value |
|---|---|
| **What** | 40+ Medusa v2 examples: marketplace, restaurant-marketplace, agentic-commerce, ticket-booking, product-rentals, reviews, wishlist, etc. |
| **Use level** | **REFERENCE** (high value) |
| **Phase** | Core → Advanced |
| **Score** | **88/100 (A)** |
| **Use for** | Copy `src/modules`, `src/links`, `src/workflows`, `src/api` folders into `commerce/mercur` — **not** whole repos. |
| **Top picks for mdeai** | See master table above. |
| **Avoid** | Installing examples as separate deployed services; duplicating search (use pgvector, not Algolia/Meilisearch examples unless needed later). |
| **AI fit** | `agentic-commerce` is the closest official pattern to CopilotKit/Mastra product tools — study for Core. |

### 9.7 Medusa vs Mercur — when to use which

| Need | Use | Not |
|---|---|---|
| Core: one paid order | `mercur` API **or** `dtc-starter` backend | B2B starters |
| MVP: multi-vendor + payouts | `mercur` only | `medusajs/examples/marketplace` alone (less complete than Mercur 2.0) |
| Copy module/workflow patterns | `medusajs/examples` | Rebuilding from Medusa docs from scratch |
| Framework understanding | `medusajs/medusa` docs | Forking core |
| Buyer storefront | `mdeapp` | `dtc-starter` storefront, `b2c-marketplace-storefront` |
| Custom vertical links | `medusa-starter-plugin` + examples | Custom tables in Supabase without Medusa module |

---

## 10. Full score summary (all 12 repos)

| Rank | Repo | Score | Grade | Verdict |
|---:|---|---:|---|---|
| 1 | `mercurjs/mercur` | 91 | A | **Production backend** |
| 2 | `medusajs/examples` | 88 | A | **Pattern library** |
| 3 | `medusajs/medusa` | 85 | A- | **Framework reference** |
| 4 | `medusajs/dtc-starter` | 82 | B+ | **Core fallback backend** |
| 5 | `mercurjs/b2c-marketplace-storefront` | 74 | B | **UX/SDK reference** |
| 6 | `medusajs/medusa-starter-plugin` | 72 | B | **Plugin scaffold** |
| 7 | `mercurjs/clean-medusa-starter` | 68 | C+ | **Last-resort fallback** |
| 8 | `mercurjs/vendor-panel` | 58 | D+ | **Defer** |
| 9 | `mercurjs/admin-panel` | 56 | D+ | **Defer** |
| 10 | `medusajs/medusa-starter-default` | 55 | D | **Avoid (deprecated)** |
| 11 | `medusajs/b2b-starter` | 45 | D | **Avoid (wrong model)** |
| 12 | `medusajs/b2b-starter-medusa` | 40 | D- | **Avoid (deprecated + B2B)** |

**Architecture choice score: 88/100** — `mercur` backend + `mdeapp` buyer UI + `medusajs/examples` patterns + Supabase pgvector sidecar.

### Clone locally (recommended)

```bash
cd /home/sk/mdeai/mdeapp
mkdir -p github/commerce

# Production spike + MVP
git clone --depth 1 https://github.com/mercurjs/mercur.git github/commerce/mercur

# Pattern library (read-only)
git clone --depth 1 https://github.com/medusajs/examples.git github/commerce/medusa-examples

# Optional references
git clone --depth 1 https://github.com/medusajs/dtc-starter.git github/commerce/dtc-starter
git clone --depth 1 https://github.com/mercurjs/b2c-marketplace-storefront.git github/commerce/b2c-storefront
```
