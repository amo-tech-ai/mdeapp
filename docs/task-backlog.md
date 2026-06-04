# MDE AI — Prioritized Task Backlog

> Actionable backlog derived from the [Strategic Audit](strategic-audit.md), grounded in the real codebase (7 Mastra agents, 11 read-only tools, 80 migrations, live ticketing + `sponsor.*`, no Connect/Billing). Pairs with [`revenue-strategy-v2.md`](revenue-strategy-v2.md) (business) and [`prd/revenue-engine-prd.md`](prd/revenue-engine-prd.md) (workflows).
> **Optimized for:** revenue, simplicity, product-market fit, execution speed. **Currency:** USD (FX 4,000 COP/USD).

## Legend

- **Priority Score /100** = (Revenue Impact × Speed-to-cash × Strategic fit) ÷ Complexity. Higher = do sooner.
- **Complexity:** S (≤1wk) · M (1–3wk) · L (3–6wk) · XL (6wk+).
- **Revenue Impact:** ⭐ (enabler) → ⭐⭐⭐⭐⭐ (direct, large).
- **Phase order is the recommended execution order.** Core is revenue-first; nothing in MVP/Advanced should jump the queue without a revenue reason.
- **Grounding tags:** `[exists]` build on shipped code · `[gap]` net-new · `[remove]` delete/park.

---

## CORE — 0–3 Months (revenue-first, highest ROI)

> Theme: **turn the discovery engine into a revenue engine without a rewrite.** Productize the agency, give agents a checkout tool, add Billing, monetize leads & sponsorship that already exist in the schema.

### C1 — Productize the AI Marketing Agency `[gap]` · **Score 98**
- **Description:** Package AI marketing/automation services (content, reviews, WhatsApp, concierge setup) into Starter/Growth/Pro tiers with public pricing + a "free AI audit" lead magnet. Delivered on the existing stack.
- **Business value:** Fastest cash; acquires marketplace supply for free; dogfoods the product.
- **Revenue impact:** ⭐⭐⭐⭐⭐ ($300–$1,500/mo per client; target 10–15 → $5–10k MRR)
- **Complexity:** M · **Dependencies:** none (manual delivery OK; C7 Marketing Agent later *enhances scale*, not a prerequisite) · **Stack:** Next.js landing, WhatsApp, Supabase · **Effort:** 2–3 wk
- **Why first:** 80–95% margin, no infra, bills from week 3.

### C2 — `create_checkout` Mastra tool + shared checkout widget `[exists→extend]` · **Score 96**
- **Description:** A transact tool agents can call to open a Stripe Checkout session (reuse the proven `ticket-checkout` edge pattern) for any vertical. Reusable React checkout/wallet widget.
- **Business value:** Every discovery flow currently dead-ends; this lets agents *close*.
- **Revenue impact:** ⭐⭐⭐⭐⭐ (unblocks tourism/nightlife/experience transactions)
- **Complexity:** M · **Dependencies:** ticket edge (done) · **Stack:** Mastra tool, Stripe Checkout, Apple/Google Pay, webhook edge · **Effort:** 3–4 wk
- **Note:** webhook is source of truth (extend `ticket-payment-webhook`).

### C3 — Stripe Billing + `subscriptions` table `[gap]` · **Score 95**
- **Description:** Recurring billing for business subscriptions + agency retainers; `subscriptions` table mirroring Stripe; dunning.
- **Business value:** Predictable MRR — the fundable backbone.
- **Revenue impact:** ⭐⭐⭐⭐⭐ · **Complexity:** M · **Dependencies:** C1 · **Stack:** Stripe Billing, Supabase migration, webhook edge · **Effort:** 2–4 wk

### C4 — Metered rental-lead billing (`lead_billing`) `[exists→monetize]` · **Score 94**
- **Description:** Charge agents per qualified lead. Add `lead_billing` table + meter on the existing G2 `leads`/`chat-lead-capture` flow; bill at `qualified`, not capture.
- **Business value:** Monetizes leads already captured for free.
- **Revenue impact:** ⭐⭐⭐⭐ ($30–$200/qualified lead) · **Complexity:** S–M · **Dependencies:** C3 (billing), C8 (Lead Agent) · **Stack:** edge `lead-billing-meter`, Stripe Billing metered · **Effort:** 2 wk

### C5 — `/advertise` self-serve over `sponsor.*` `[exists→activate]` · **Score 92**
- **Description:** Self-serve UI to buy sponsored listings/pins/featured placements on top of the dormant `sponsor.{organizations,placements,invoices,roi_daily}` schema. Featured flag flows through `MapContext.mergePins` (honors single-pin-writer invariant).
- **Business value:** Activates a built-but-unused monetization subsystem; 95% margin.
- **Revenue impact:** ⭐⭐⭐⭐ · **Complexity:** M · **Dependencies:** none · **Stack:** Next.js page, `sponsor.*`, Stripe Checkout · **Effort:** 3–4 wk

### C6 — Sales Agent (upsell / bundle / convert) `[gap]` · **Score 90**
- **Description:** Agent that proposes VIP upgrades, bundles, and promo codes at the right moment; drives the checkout tool.
- **Business value:** Lifts AOV + conversion on every transaction.
- **Revenue impact:** ⭐⭐⭐⭐⭐ · **Complexity:** M · **Dependencies:** C2 · **Stack:** Mastra agent + `apply_promo`/`bundle_builder` tools · **Effort:** 2–3 wk

### C7 — Marketing Agent + WhatsApp automation `[exists→wire]` · **Score 89**
- **Description:** Agent that generates IG/email/WhatsApp content + runs campaigns; wire `wa_outbox`/`whatsapp_*` to a live send loop (official Business API, opt-in, approved templates).
- **Business value:** Delivery engine for C1 (agency).
- **Revenue impact:** ⭐⭐⭐⭐ · **Complexity:** M · **Dependencies:** C1 · **Stack:** Mastra agent, WhatsApp Business API, Supabase `wa_outbox` · **Effort:** 3 wk

### C8 — Lead Agent (qualify / enrich / route) `[gap]` · **Score 88**
- **Description:** Scores + enriches G2 leads, routes to broker via `landlord_inbox`, triggers `lead_billing`.
- **Business value:** Lead quality → higher qualified-lead price + close rate.
- **Revenue impact:** ⭐⭐⭐⭐ · **Complexity:** M · **Dependencies:** C4 · **Stack:** Mastra agent + `qualify_lead`/`enrich_contact` tools · **Effort:** 2–3 wk

### C9 — Restaurant/venue marketing retainer + featured product `[gap]` · **Score 87**
- **Description:** Productized featured listing ($49–$199/mo) + marketing retainer ($300–$1,200/mo) for restaurants/cafes/nightlife.
- **Business value:** Highest-volume SMB cash line.
- **Revenue impact:** ⭐⭐⭐⭐ · **Complexity:** S–M · **Dependencies:** C3, C5 · **Stack:** subscription + featured placement · **Effort:** 2 wk

### C10 — Nightlife VIP booking + deposit `[gap]` · **Score 85**
- **Description:** VIP table request → Stripe deposit → confirmation; 10–15% fee. Highest AOV transaction.
- **Revenue impact:** ⭐⭐⭐⭐ · **Complexity:** M · **Dependencies:** C2 · **Stack:** checkout widget, booking flow · **Effort:** 2–3 wk

### C11 — Extend wallets (Apple/Google Pay) to all checkouts `[exists→extend]` · **Score 84**
- **Description:** Generalize the ticket wallet route to every checkout.
- **Business value:** +20–50% mobile conversion (mobile/WhatsApp-first market).
- **Revenue impact:** ⭐⭐⭐ (multiplier) · **Complexity:** S · **Dependencies:** C2 · **Stack:** Stripe Payment Element · **Effort:** 1 wk

### C12 — `platform_fees` ledger + reconciliation `[gap]` · **Score 82**
- **Description:** Record platform take per transaction; nightly reconciliation to Stripe balance.
- **Business value:** Accounting integrity before marketplace scale.
- **Revenue impact:** ⭐⭐ (enabler) · **Complexity:** S–M · **Dependencies:** C2 · **Stack:** Supabase, webhook edge · **Effort:** 1–2 wk

### C13 — Remove `pingAgent` from prod; collapse `routerAgent` overlap; park `evaluationAgent` `[remove]` · **Score 80**
- **Description:** Reduce agent surface, latency, and model cost; one routing path via concierge.
- **Business value:** Simplicity + lower COGS.
- **Revenue impact:** ⭐ (cost) · **Complexity:** S · **Dependencies:** none · **Stack:** Mastra `index.ts` · **Effort:** 3–5 days

### C14 — Abandoned-cart / lead WhatsApp recovery `[exists→wire]` · **Score 78**
- **Description:** Auto re-engage incomplete checkouts/unconverted leads via `wa_outbox`.
- **Revenue impact:** ⭐⭐⭐ (recovers lost revenue) · **Complexity:** S–M · **Dependencies:** C7 · **Effort:** 1–2 wk

### C15 — Promo/discount codes on tickets `[exists→extend]` · **Score 76**
- **Description:** Code engine for campaigns/comps on the existing ticket flow.
- **Revenue impact:** ⭐⭐ (conversion/marketing) · **Complexity:** S · **Dependencies:** C2 · **Effort:** 1 wk

**Core exit target: ~$10–12.5k MRR (services-led) + first marketplace GMV.**

---

## MVP — 3–6 Months (growth, subscriptions, bookings, marketplace)

> Theme: **add the marketplace rail + business surfaces** so transactions and SaaS scale.

| ID | Task | Description | Biz value | Rev | Complexity | Deps | Stack | Effort | Score |
|---|---|---|---|---|---|---|---|---|---|
| M1 | **Stripe Connect Express + destination charges** `[gap]` | Operator onboarding + payouts + `application_fee` | Enables true marketplace | ⭐⭐⭐⭐ | XL | C2,C12 | Stripe Connect, edges | 6–10wk | 90 |
| M2 | **`/business` portal** `[gap]` | Onboarding, subs, leads, analytics dashboard | Self-serve scaling | ⭐⭐⭐⭐ | L | C3,C8 | Next.js, Supabase | 4–6wk | 88 |
| M3 | **Tourism experience checkout + operator subs** `[gap]` | 15–20% take via Connect + operator subscriptions | New transaction line | ⭐⭐⭐⭐ | L | M1 | checkout, Connect | 4–6wk | 87 |
| M4 | **Business subscription tiers (all verticals)** `[gap]` | Restaurant/cafe/nightclub/operator/agency/organizer tiers | Recurring revenue density | ⭐⭐⭐⭐ | M | C3 | Stripe Billing | 3–4wk | 86 |
| M5 | **Sponsor Agent (match/proposal/invoice)** `[exists→agent]` | Automates `sponsor.*` discovery→contract | Scales sponsorship | ⭐⭐⭐⭐ | M | C5 | Mastra agent | 3wk | 84 |
| M6 | **`opportunities` CRM pipeline** `[gap]` | Sales pipeline over leads/sponsors | Conversion + forecasting | ⭐⭐⭐ | M | C8 | Supabase | 2–3wk | 82 |
| M7 | **Restaurant reservation management + confirm loop** `[exists→extend]` | Venue inbox/calendar, WhatsApp confirm, no-show | Restaurant reliability/retention | ⭐⭐⭐ | M | C7 | venue_booking_requests | 3wk | 80 |
| M8 | **`campaigns`/`audiences`/`automations` tables + engine** `[gap]` | Marketing automation backbone | Powers agency at scale | ⭐⭐⭐ | M | C7 | Supabase, Mastra | 3–4wk | 79 |
| M9 | **Organizer/venue analytics dashboards** `[exists→surface]` | Surface `roi_daily`, `analytics_events_daily`, `outbound_clicks` | Retention (NRR) | ⭐⭐⭐ | M | M2 | Next.js, Supabase | 3wk | 78 |
| M10 | **Rental deposit/booking via Connect** `[gap]` | Mid-term rental deposits/commission | Expat/nomad revenue | ⭐⭐⭐ | L | M1 | Connect | 4wk | 77 |
| M11 | **`/partners` operator onboarding** `[gap]` | Connect Express onboarding UX | Supply acquisition | ⭐⭐⭐ | M | M1 | Next.js, Connect | 2–3wk | 75 |
| M12 | **Consumer Pro/VIP (trips perks)** `[exists→monetize]` | Premium itineraries, concierge, no fees | Consumer ARPU | ⭐⭐ | M | C3 | Stripe Billing, trips | 2–3wk | 72 |

**MVP exit target: ~$25k MRR.**

---

## ADVANCED — 6–18 Months (marketplaces, automation, AI OS)

| ID | Task | Description | Biz value | Rev | Complexity | Deps | Stack | Effort | Score |
|---|---|---|---|---|---|---|---|---|---|
| A1 | **Trip bundles (separate charges & transfers)** `[gap]` | Multi-operator itinerary, one checkout, many payouts | Monetizes trips retention layer | ⭐⭐⭐⭐ | XL | M1 | Stripe transfers, Trip Agent | 6–8wk | 85 |
| A2 | **Trip Agent (itinerary/budget/bundle)** `[exists→agent]` | Builds bookable itineraries over trips data model | Conversion + AOV | ⭐⭐⭐ | L | A1 | Mastra agent | 4wk | 82 |
| A3 | **Full tourism marketplace** `[gap]` | Operator catalog, availability, reviews | Scalable GMV | ⭐⭐⭐⭐ | XL | M3 | Connect, catalog | 8wk+ | 80 |
| A4 | **Fashion marketplace + Colombiamoda** `[gap]` | Designer/vendor profiles, fashion-event ticketing, sponsorship | Credibility flywheel → GMV | ⭐⭐⭐ | XL | M1,C5 | Connect, sponsor.* | 8wk+ | 76 |
| A5 | **Personalization (`user_preferences`/`recommendation_signals`)** `[gap]` | Tie signals to ranking + offers | Conversion lift across platform | ⭐⭐⭐ | L | — | pgvector, signals | 4–6wk | 78 |
| A6 | **Neighborhood Agent (safety/walkability/lifestyle)** `[exists→agent]` | Scores over `neighborhood_profiles` | Rental conversion, premium content | ⭐⭐ | M | — | Mastra agent | 3wk | 70 |
| A7 | **"AI operating system" — cross-vertical orchestration** `[gap]` | Agents compose bundles across verticals autonomously | Differentiation, AOV | ⭐⭐⭐ | XL | A1,A2 | Mastra workflows | 8wk+ | 74 |
| A8 | **OpenClaw compliant discovery engine** `[gap]` | Official-API/registry/opt-in discovery → agency + intel products | Lowers CAC, intel revenue | ⭐⭐⭐ | L | C8 | APIs, compliance | 4–6wk | 73 |
| A9 | **Multi-city expansion framework** `[gap]` | City-scoped data + config | TAM expansion | ⭐⭐⭐ | XL | A3 | platform-wide | 8wk+ | 68 |
| A10 | **Reputation/review automation** `[gap]` | Compliant post-visit review asks + AI responses | Retainer upsell | ⭐⭐ | M | C7 | WhatsApp, Mastra | 3wk | 66 |

**Advanced exit target: ~$50–100k MRR.**

---

## Top 25 — Revenue-Generating Tasks

| # | Task | Phase | Rev | Score |
|---|---|---|---|---|
|1|Productize AI agency (C1)|Core|⭐⭐⭐⭐⭐|98|
|2|`create_checkout` tool (C2)|Core|⭐⭐⭐⭐⭐|96|
|3|Stripe Billing + subscriptions (C3)|Core|⭐⭐⭐⭐⭐|95|
|4|Metered lead billing (C4)|Core|⭐⭐⭐⭐|94|
|5|`/advertise` sponsor self-serve (C5)|Core|⭐⭐⭐⭐|92|
|6|Sales Agent upsell/bundle (C6)|Core|⭐⭐⭐⭐⭐|90|
|7|Stripe Connect (M1)|MVP|⭐⭐⭐⭐|90|
|8|Marketing Agent + WhatsApp (C7)|Core|⭐⭐⭐⭐|89|
|9|Lead Agent (C8)|Core|⭐⭐⭐⭐|88|
|10|Restaurant retainer/featured (C9)|Core|⭐⭐⭐⭐|87|
|11|Tourism checkout + operator subs (M3)|MVP|⭐⭐⭐⭐|87|
|12|Business subscription tiers (M4)|MVP|⭐⭐⭐⭐|86|
|13|Nightlife VIP deposit (C10)|Core|⭐⭐⭐⭐|85|
|14|Trip bundles (A1)|Adv|⭐⭐⭐⭐|85|
|15|Sponsor Agent (M5)|MVP|⭐⭐⭐⭐|84|
|16|Wallets everywhere (C11)|Core|⭐⭐⭐|84|
|17|`platform_fees` ledger (C12)|Core|⭐⭐|82|
|18|`opportunities` CRM (M6)|MVP|⭐⭐⭐|82|
|19|Full tourism marketplace (A3)|Adv|⭐⭐⭐⭐|80|
|20|Reservation mgmt + confirm (M7)|MVP|⭐⭐⭐|80|
|21|Abandoned-cart recovery (C14)|Core|⭐⭐⭐|78|
|22|Rental deposit/booking (M10)|MVP|⭐⭐⭐|77|
|23|Fashion marketplace (A4)|Adv|⭐⭐⭐|76|
|24|Promo codes (C15)|Core|⭐⭐|76|
|25|Consumer Pro/VIP (M12)|MVP|⭐⭐|72|

## Top 25 — UX Improvements

| # | Improvement | Surface | Score |
|---|---|---|---|
|1|Monetizable CTA on every result card|chat/cards|92|
|2|Reusable checkout/wallet widget|all verticals|90|
|3|`/business` dashboard|new page|88|
|4|`/advertise` self-serve flow|new page|87|
|5|One-tap Apple/Google Pay above card form|checkout|86|
|6|Booking/reservation widget|venues|84|
|7|Comparison view (rentals/tours/events)|cards|82|
|8|AI insight panel (why recommended)|chat|80|
|9|Featured/sponsored badge on pins|maps|80|
|10|Trip itinerary builder UX|trips|79|
|11|Lead status tracker (consumer)|rentals|77|
|12|Organizer analytics dashboard|host|77|
|13|Saved → rebook prompts|saved|75|
|14|WhatsApp deep-link CTAs|all|75|
|15|Neighborhood lifestyle cards|rentals|73|
|16|Mobile bottom-sheet polish (cafe/nightlife exist)|mobile|72|
|17|Empty-state → revenue prompts|chat|70|
|18|Promo-code field at checkout|checkout|70|
|19|Multi-step trip planning wizard|trips|69|
|20|Review request flow (compliant)|post-visit|68|
|21|Onboarding tour for businesses|/business|67|
|22|Skeleton/loading on map results|maps|65|
|23|Concierge "next best action" chips|chat|65|
|24|Localized Spanish-first copy pass|all|64|
|25|Accessibility + perf audit|all|60|

## Top 25 — AI Agent Opportunities

| # | Agent / capability | Score |
|---|---|---|
|1|Sales Agent (upsell/bundle)|95|
|2|Lead Agent (qualify/enrich/route)|94|
|3|Marketing Agent (content/campaigns)|93|
|4|Sponsor Agent (match/proposal/invoice)|88|
|5|Trip Agent (itinerary/bundle)|86|
|6|`create_checkout` transact tool|96|
|7|`qualify_lead` tool|90|
|8|`bundle_builder` tool|85|
|9|`gen_proposal` tool (sponsors)|82|
|10|`wa_campaign` tool|84|
|11|Neighborhood Agent (scoring)|72|
|12|Support/concierge agent (business-facing)|80|
|13|Booking automation tool|82|
|14|`apply_promo` tool|74|
|15|Reputation/review agent|70|
|16|Pricing/yield agent (dynamic ticket pricing)|68|
|17|Abandoned-cart recovery agent|78|
|18|Enrichment agent (CRM)|76|
|19|Itinerary budget planner tool|73|
|20|Cross-sell recommender|80|
|21|Sponsor ROI reporting agent|71|
|22|Compliance/opt-in guard tool|70|
|23|Multi-operator settlement orchestrator|72|
|24|Personalization ranking agent|75|
|25|Collapse router/concierge overlap|80|

## Top 25 — Automation Opportunities

| # | Automation | Score |
|---|---|---|
|1|WhatsApp booking/reservation bot|92|
|2|Abandoned-cart WhatsApp recovery|88|
|3|Lead qualify → bill → route|90|
|4|Monthly ROI report per client (auto)|86|
|5|Sponsor invoice generation|82|
|6|Subscription dunning|80|
|7|Post-visit review request|75|
|8|Event reminder + rebook|76|
|9|Social content scheduling|78|
|10|Payout reconciliation (nightly)|80|
|11|Lead enrichment pipeline|77|
|12|Featured-placement expiry/renewal|74|
|13|Waitlist → ticket release|72|
|14|No-show follow-up|70|
|15|Trip itinerary auto-assembly|73|
|16|Price-drop/availability alerts|68|
|17|Onboarding drip (businesses)|71|
|18|Sponsor matching alerts|70|
|19|Churn-risk detection + save flow|76|
|20|SEO page auto-generation (programmatic)|79|
|21|Review sentiment alerts|66|
|22|Campaign performance auto-optimization|72|
|23|Inventory sync (operators)|70|
|24|Referral loop triggers|74|
|25|Compliance opt-out honoring (STOP)|75|

## Top 25 — Business Features

| # | Feature | Score |
|---|---|---|
|1|`/business` portal + dashboard|90|
|2|Self-serve advertising (`/advertise`)|88|
|3|Subscription management|87|
|4|Lead CRM + pipeline (`opportunities`)|85|
|5|Featured listings/placement|86|
|6|Analytics dashboards (revenue/leads)|84|
|7|Reservation/booking management|82|
|8|WhatsApp campaign console|81|
|9|Operator onboarding (`/partners`, Connect)|80|
|10|Marketing content studio|80|
|11|Sponsor marketplace (`/sponsors`)|76|
|12|Payout/statements view|78|
|13|Review management console|72|
|14|Multi-location management|74|
|15|Promo/discount management|70|
|16|Team/role management|66|
|17|API access (Enterprise)|68|
|18|White-label option|67|
|19|Inventory/availability calendar|73|
|20|Lead scoring controls|71|
|21|Audience segmentation|70|
|22|Billing/invoice history|72|
|23|ROI reporting export|69|
|24|Notification preferences|62|
|25|Onboarding wizard|70|

## Top 25 — Growth Opportunities

| # | Lever | Score |
|---|---|---|
|1|Free AI audit lead magnet|90|
|2|Programmatic SEO (venue/event/rental pages)|89|
|3|Dogfooded IG/TikTok content|85|
|4|Expat/nomad Facebook group distribution|84|
|5|Hotel concierge-desk partnerships|86|
|6|WhatsApp referral loops|85|
|7|"Claim your listing" supply capture|83|
|8|Local + Maps SEO|82|
|9|AI-search citation optimization (GEO)|78|
|10|Case studies / testimonials engine|80|
|11|Tour operator partnerships|81|
|12|University/event audience deals|72|
|13|Procolombia/Ruta N grants + co-marketing|70|
|14|Annual prepay (2 months free)|79|
|15|Referral incentives (B2B)|76|
|16|Stripe/Google/OpenAI startup credits|74|
|17|Colombiamoda PR flywheel|71|
|18|Influencer brokerage (OpenClaw)|73|
|19|Email/WhatsApp re-engagement|77|
|20|Sponsored neighborhood content|68|
|21|Cross-vertical bundle promos|75|
|22|Consumer MDE+ perks loyalty|70|
|23|Multi-city playbook|66|
|24|Marketplace seed via partner data|72|
|25|Conversion-rate optimization program|78|

---

## Strategic Cuts

### What to build now (next 90 days)
**C1–C9** — agency, `create_checkout`, Billing, lead billing, `/advertise`, Sales Agent, Marketing Agent, Lead Agent, restaurant retainers. These are the revenue rails + register that need almost none of the complex grounding work already shipped.

### What to postpone
Stripe Connect marketplace (M1) → Q2 (services/leads don't need it). Full tourism (A3) and fashion (A4) marketplaces → 6–18 mo. "AI operating system" (A7) and multi-city (A9) → Advanced. Personalization (A5) after revenue rails exist.

### What to remove / park
`pingAgent` from prod registration (C13). Park `evaluationAgent` (scorer agent, not production-wired). Collapse `routerAgent` into the concierge routing path. Stop adding discovery/grounding sophistication — the search engine is already 9/10 against a 4/10 revenue system. Shelve fashion as anything but a PR flywheel until Yr2.

### What generates revenue fastest
1. **AI agency retainers (C1)** — bills in weeks, 80–95% margin, no infra.
2. **Restaurant/venue marketing + featured (C9, C5)** — high-volume SMB cash.
3. **Metered lead billing (C4)** — monetizes leads already captured.
4. **`create_checkout` + Sales Agent (C2, C6)** — unlocks ticketing/tourism/nightlife transactions sitting idle today.

---

## Revenue Paths

### Path to $10k MRR (~90 days, services-led, no marketplace infra)
| Source | Tasks | Monthly |
|---|---|---|
| AI agency retainers (15 × ~$667) | C1, C7 | $10,000 |
| (early) featured listings + lead billing | C5, C4, C9 | upside |

**Gate:** C1, C3, C7. **No Connect needed.**

### Path to $50k MRR (~6 months)

| Source | Tasks | Monthly |
|---|---|---|
| Agency (services) | C1,C7 | $15,000 |
| Business subscriptions/SaaS | M4,M2 | $10,000 |
| Rental leads (qualified) | C4,C8 | $10,000 |
| Tourism + nightlife transactions | M3,C10 | $10,000 |
| Featured listings + sponsorship | C5,M5 | $5,000 |

**Gate:** C-series complete + M1 (Connect), M2 (`/business`), M3, M4.

### Path to $100k MRR (~12–18 months)

| Source | Tasks | Monthly |
|---|---|---|
| Agency | C1,C7 | $20,000 |
| Business SaaS (density) | M4,M2,M9 | $25,000 |
| Real-estate leads + deposits | C4,C8,M10 | $20,000 |
| Tourism marketplace | M3,A3 | $10,000 |
| Events (tickets + promo) | C2,C15 | $10,000 |
| Marketplace take-rate (Connect) | M1,A1 | $15,000 |

**Gate:** full MVP + A1 (bundles), A3 (tourism marketplace). **Driver: NRR > 110% + GMV ramp — retention, not just new logos.**

---

> _Task Backlog v1 — execution order = phase order. Re-prioritize on real conversion/churn data. Pairs with [`strategic-audit.md`](strategic-audit.md)._
