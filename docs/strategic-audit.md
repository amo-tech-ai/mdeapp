# MDE AI — Strategic Audit, Monetization & Product Roadmap

> **CTO-level audit grounded in the actual codebase** (not generic). Every finding references real files: 7 Mastra agents, 11 tools, 3 workflows, ~33 routes, 80 Supabase migrations, 5 edge functions, ticketing + sponsor monetization subsystems.
> **Companion docs:** business strategy → [`revenue-strategy-v2.md`](revenue-strategy-v2.md); monetization workflows → [`prd/revenue-engine-prd.md`](prd/revenue-engine-prd.md). This doc is the **honest gap analysis + revenue-first roadmap**.
> **Date:** 2026-06 · **Currency:** USD (FX 4,000 COP/USD).

---

## 0. TL;DR — the brutal version

**MDE has over-built discovery and under-built revenue.** The team has shipped a genuinely sophisticated grounding/search engine (pgvector hybrid FTS, ADK grounding, oversell-safe ticketing, RLS lockdown, idempotent edges) and a real **ticketing + sponsor** monetization base. But:

1. **All 7 agents can only *search*.** None can *sell*. There is no checkout tool, no lead-qualify tool, no upsell tool in `src/mastra/tools/`. The AI is a concierge that can't close.
2. **There is no marketplace rail.** No Stripe Connect, no `application_fee`, no destination charges, no operator payouts. You cannot pay a tour operator or restaurant today. "Marketplace" is aspirational.
3. **There is no recurring-revenue infra.** No `subscriptions` table, no Stripe Billing. The highest-margin, fastest-cash line (AI agency retainers + business SaaS) needs almost none of the complex grounding work already done — yet it isn't productized.
4. **The stack is over-claimed.** `package.json` wires **Gemini only** — no OpenAI, no OpenClaw, no Cloudinary, no ADK SDK as app deps (ADK is a sidecar). WhatsApp exists as *tables* (`whatsapp_*`, `wa_outbox`) but no live send loop in the app.

**If revenue is the goal, the next 90 days should add almost no new discovery features.** They should productize the agency, add Stripe Connect + subscriptions, and give agents tools that transact.

**Overall score: 57/100** (detail in §Final/1).

---

## Phase 1 — Audit of the Current System

### 1.1 What actually exists (verified)

| Layer | Reality (files) | Verdict |
|---|---|---|
| **Agents** | `pingAgent, routerAgent, rentalAgent, conciergeAgent, eventAgent, evaluationAgent, hostEventAgent` (`src/mastra/agents/`) | Discovery-strong, **revenue-blind** |
| **Tools** | `classify-intent, extract-intent-slots, search-{attractions,events,rentals,restaurants,grounded-places,venue-anchors,web-grounded-events}, audit-wrapper, risk-levels` | **100% read/search. Zero transact tools.** |
| **Workflows** | `concierge-routing, event-discovery, rental-search` | No checkout/lead/upsell workflow |
| **Ticketing** | `ticket-checkout` + `ticket-payment-webhook` edges; oversell guard via `qty_pending`; QR JWTs; idempotency_keys; `event_taxes_and_fees` | **Genuinely good. Production-grade.** |
| **Wallets** | `api/tickets/wallet` (Apple/Google Pay) | ✅ live on tickets |
| **Sponsors/Ads** | `sponsor.{organizations,applications,assets,invoices,contracts,placements,roi_daily}` + `event_sponsor_placements` + `outbound_clicks` | **Real monetization subsystem — underused** |
| **Rentals/leads** | `leads, showings, rental_applications, property_verifications, landlord_profiles, landlord_inbox`, atomic RPCs | Strong lead base; **not billed** |
| **Bookings** | `bookings, venue_booking_requests` + `venue-booking/request` route | Request flow exists; **no payment/commission** |
| **Trips** | `trips, collections, trip_items, budget_tracking, conflict_resolutions, proactive_suggestions` | Rich data model, **no trip agent, no monetization** |
| **WhatsApp** | `whatsapp_conversations, whatsapp_messages, whatsapp_subscriptions, wa_outbox` | Scaffolded; **no productized service** |
| **Intelligence** | `venue_signals, rental_signals, neighborhood_profiles`, pgvector embeddings (`listing/event/restaurant`), hybrid FTS | Sophisticated; under-monetized |
| **Search/grounding** | ADK sidecar, grounded routes, `places_cache`, quota logs | **Over-invested relative to revenue** |
| **Payments** | `payments` table; Stripe in ticket edges only (`stripe@14.21.0` in Deno) | **Single-merchant. No Connect.** |

### 1.2 Product audit

| | Finding |
|---|---|
| **Good** | One conversational surface routing all verticals; real ticketing; trips retention layer; maps-first with single-pin-writer discipline; strong grounding/anti-hallucination |
| **Missing** | Agents that transact; upsells/bundles; subscription/billing UX; business/partner portals; analytics dashboards; productized AI-agency offering |
| **Unnecessary / over-built** | Breadth of grounding tooling (4 search variants + web-grounded events) relative to *zero* revenue tools; multiple intelligence/signals tables with no monetized consumer |
| **Should remove/park** | `pingAgent` (W1 relic) from prod registration; defer `evaluationAgent` (W8, "not prod"); park fashion until Yr2 |
| **Should simplify** | Collapse 4 discovery agents' overlap (see §4); one router + thin per-vertical tools beats parallel agents |

### 1.3 Revenue audit (current state)

| Revenue opportunity | Built? | Gap |
|---|---|---|
| Ticket commissions | **Partial** | Checkout works; commission/fee logic via taxes table, but **no platform take-rate ledger** |
| Sponsor/advertising | **Yes (schema)** | `sponsor.*` exists with invoices/ROI — **no sell-side agent, no self-serve buy** |
| Rental leads | **Capture only** | `leads` captured; **never billed** (no `lead_billing`, no qualify gate) |
| Booking commissions | **No** | `bookings`/`venue_booking_requests` have no payment or fee |
| Premium listings / featured | **Partial** | sponsor placements exist; not exposed as SMB self-serve product |
| AI services / WhatsApp automation | **No product** | tables exist; **no offering, pricing, or delivery** |
| Business subscriptions | **No** | no `subscriptions`, no Billing |
| Marketplace commissions | **No** | no Connect |

> **The monetization gap is not discovery — it's the rails and the agents.** You can find anything in Medellín and buy a ticket. You cannot subscribe, get billed for a lead, pay an operator, or be upsold.

### 1.4 Technical audit

| Area | Score | Note |
|---|---|---|
| CopilotKit | 8/10 | Pinned 1.55.2, Pattern-1 clean; good discipline |
| Mastra | 7/10 | Agents/workflows solid; **tools are read-only** |
| Supabase | 8/10 | 80 migrations, RLS lockdown, atomic RPCs, idempotency — strong |
| Stripe | 4/10 | Ticketing-grade; **no Connect/Billing** |
| Maps | 8/10 | Single-pin-writer invariant, field masks, mapId discipline |
| Search/grounding | 9/10 | Over-engineered vs revenue maturity |
| Agents | 5/10 | Discovery only; overlap; no revenue roles |
| Workflows | 5/10 | No transactional workflows |
| Automations | 3/10 | WhatsApp scaffolded, not wired to a product |

---

## Phase 2 — Feature Gap Analysis

### 2.1 Events — vs Eventbrite / Fever / Luma / TicketTailor

| Capability | MDE | Gap |
|---|---|---|
| Checkout + QR | ✅ | — |
| Wallets | ✅ | — |
| Tiered pricing / promo codes | partial | **promo/discount codes, comps** |
| Reserved seating | ❌ | low priority for Medellín |
| Organizer payouts (Connect) | ❌ | **critical for marketplace** |
| Recurring/series events | ❌ | Luma-style |
| Waitlist | ✅ (`event_wait_list`) | surface it |
| Analytics for organizer | partial (`roi_daily`) | **organizer dashboard** |

**Roadmaps** — *Core:* promo codes + organizer payout (Connect) + organizer dashboard. *MVP:* series events, refunds/transfers, sponsor self-serve. *Advanced:* dynamic pricing agent, reserved seating.

### 2.2 Rentals — vs Airbnb / Zillow / Realtor / Booking

| Capability | MDE | Gap |
|---|---|---|
| Search + map + cards | ✅ | — |
| Schedule viewing → lead | ✅ (`showings`, G2) | **lead not billed / scored** |
| Lead scoring/qualify | ❌ | **lead-qualify agent + billing** |
| Broker CRM | partial (`landlord_inbox`) | follow-up automation |
| Online booking/deposit | ❌ | mid-term rental deposits (Connect) |
| Application flow | ✅ (`rental_applications`) | monetize |

*Core:* lead qualification + metered billing. *MVP:* agent subscriptions + property marketing package. *Advanced:* deposit/booking via Connect.

### 2.3 Restaurants — vs OpenTable / Yelp / Tripadvisor

| Capability | MDE | Gap |
|---|---|---|
| Discovery + cards | ✅ | — |
| Booking request | ✅ (`venue_booking_requests`) | **confirmation loop, no-show handling** |
| Reservation management | ❌ | venue inbox/calendar |
| Marketing tools | ❌ | **retainer product (biggest $)** |
| Analytics | partial | venue dashboard |

*Core:* featured listing + marketing retainer (services, no infra). *MVP:* reservation mgmt + WhatsApp confirm. *Advanced:* reputation/review automation.

### 2.4 Tourism — vs Viator / GetYourGuide / Airbnb Experiences

| Capability | MDE | Gap |
|---|---|---|
| Experience discovery | ✅ (`search-attractions`) | — |
| Booking + payment | ❌ | **commission checkout (Connect)** |
| Operator onboarding | ❌ | **Connect Express** |
| Trip planning | ✅ data model | **no trip agent** |
| Featured experiences | partial (sponsor) | expose |

*Core:* experience checkout + 15–20% take via Connect. *MVP:* operator subscriptions + trip bundles. *Advanced:* full tourism marketplace.

### 2.5 Fashion — vs fashion-week / marketplace / event platforms

Effectively greenfield. *Core:* fashion-event ticketing (reuse G1). *MVP:* designer/vendor profiles + sponsorship (reuse `sponsor.*`). *Advanced:* discovery marketplace. **Defer to Yr2 — credibility flywheel, not near-term cash.**

---

## Phase 3 — Revenue Audit & Scorecard

| Feature | Revenue Type | User Pays | Business Pays | Commission | Subscription | Margin | Score /100 |
|---|---|---|---|---|---|---|---|
| AI agency services | Service | — | ✅ | — | ✅ retainer | 80–95% | **98** |
| WhatsApp automation | Service | — | ✅ | — | ✅ | 75–90% | **96** |
| Restaurant/venue marketing | Service | — | ✅ | — | ✅ | 85–90% | **95** |
| Rental qualified leads | Lead | — | ✅ | — | metered | 85% | **94** |
| Nightlife VIP | Transaction | ✅ deposit | ✅ | 10–15% | — | 90% | **93** |
| Premium listings / sponsored pins | Placement | — | ✅ | — | ✅ | 95% | **92** |
| Tourism experiences | Commission | ✅ | — | 15–20% | — | 80% take | **90** |
| Sponsorships/advertising | Sponsorship | — | ✅ | — | campaign | 90%+ | **89** |
| Event tickets | Commission+fee | ✅ fee | ✅ comm. | 5%+$0.40 | — | 35% net | **88** |
| Business subscriptions | SaaS | — | ✅ | — | ✅ | 90% | **87** |
| Cafes | Listing/loyalty | — | ✅ | — | ✅ | 90% | **86** |
| Marketplace (Connect) | Take-rate | ✅ | from GMV | 12% | — | 85% | **86** |
| Fashion marketplace | Mixed | ✅ | ✅ | 15% | ✅ | 70% | **84** |

**Rankings:** *Fastest* — agency, WhatsApp, marketing retainers (live in weeks). *Highest margin* — premium listings/sponsored pins (95%), AI services. *Highest ROI* — agency (near-zero marginal cost on existing stack). *Most scalable* — marketplace (Connect), business SaaS, ticketing.

---

## Phase 4 — Agent Architecture Review

### 4.1 Existing agents — overlap & gaps

| Agent | Role | Issue |
|---|---|---|
| `conciergeAgent` | Default `/` router+answer | Overlaps `routerAgent` (both classify/dispatch) |
| `routerAgent` | Intent classify + dispatch | **Redundant** with concierge routing workflow |
| `rentalAgent` | Rental search | Thin over `search-rentals` |
| `eventAgent` | Event discovery | Thin over `search-events` |
| `evaluationAgent` | Scorers (W8) | Not prod — park |
| `pingAgent` | W1 echo | **Remove from prod registration** |
| `hostEventAgent` | Roberto wizard | Keep (supply-side) |

> **Verdict:** the discovery agents are over-decomposed and **none generate revenue.** Collapse routing into one path; invest the saved surface area in **revenue agents** below.

### 4.2 New agents (ranked by ROI)

| # | Agent | Inputs | Outputs | Tools | Workflow | Revenue impact | ROI |
|---|---|---|---|---|---|---|---|
| 1 | **Sales Agent** | cart/session, user intent, inventory | upsell/bundle offer, checkout link | `create_checkout`, `apply_promo`, `bundle_builder` | upsell→checkout | Lifts AOV + conversion on **every** transaction | ⭐⭐⭐⭐⭐ |
| 2 | **Lead Agent** | G2 capture, business CRM | qualified lead, enriched record, route | `qualify_lead`, `enrich_contact`, `meter_lead_billing` | capture→qualify→bill | Turns free leads into billed revenue | ⭐⭐⭐⭐⭐ |
| 3 | **Marketing Agent** | business profile, channels | IG/WhatsApp/email content, campaign | `gen_content`, `wa_campaign`, `schedule_post` | campaign run | **Powers the AI agency** (fastest cash) | ⭐⭐⭐⭐⭐ |
| 4 | **Sponsor Agent** | event/venue, brand pool | sponsor match + proposal + invoice | `match_sponsor`, `gen_proposal`, `create_invoice` (uses `sponsor.*`) | discover→match→contract | Activates dormant `sponsor.*` subsystem | ⭐⭐⭐⭐ |
| 5 | **Trip Agent** | dates, budget, prefs | itinerary + bookable bundle | `build_itinerary`, `bundle_builder`, `budget_plan` | plan→bundle→checkout | Monetizes trips retention layer | ⭐⭐⭐⭐ |
| 6 | **Neighborhood Agent** | location, lifestyle prefs | safety/walkability/lifestyle score | `score_neighborhood` (uses `neighborhood_profiles`) | enrich | Premium content; rental conversion | ⭐⭐⭐ |

> The single highest-leverage build is the **Sales Agent + `create_checkout` tool** — it makes every existing discovery flow capable of closing, unlocking ticketing/tourism/nightlife revenue that the search agents currently dead-end.

---

## Phase 5 — Workflow Review

| Workflow | Current | Missing | Fix |
|---|---|---|---|
| **Event purchase** | search → event → ticket → checkout → QR | upsell (VIP/bundle), abandoned-cart WhatsApp, post-event review/rebook | Sales Agent upsell node + `wa_outbox` recovery |
| **Rental lead** | search → rental → viewing → lead | **scoring, follow-up automation, billing** | Lead Agent: qualify → meter → CRM follow-up via `landlord_inbox` |
| **Restaurant booking** | search → booking request | confirmation loop, no-show, upsell, retainer hook | venue inbox + WhatsApp confirm + featured upsell |
| **Tourism** | search → (dead end) | **booking + payment + operator payout** | add checkout + Connect |
| **Sponsor** | manual (`sponsor.*`) | discovery → match → proposal → invoice automation | Sponsor Agent |

> Pattern: **every discovery workflow dead-ends before money changes hands.** The audit's #1 structural fix is adding a transaction node to each.

---

## Phase 6 — UI/UX Audit

### 6.1 Existing surfaces

`/` (chat), `/chat`→`/`, `/events/[slug]`, `/rentals`, `/restaurants`, `/cafes`, `/nightlife`, `/trips`, `/trips/[id]`, `/saved`, `/me/tickets`, `/host/event/new`, `/login`, `/signup`. **Consumer side is well-covered.**

### 6.2 Missing pages (confirmed absent) — ranked by ROI

| Page | Purpose | ROI |
|---|---|---|
| `/business` | Business onboarding + dashboard (subs, leads, analytics) | ⭐⭐⭐⭐⭐ |
| `/advertise` | Self-serve sponsored listings/pins (activates `sponsor.*`) | ⭐⭐⭐⭐⭐ |
| `/partners` | Operator/agency onboarding (Connect Express) | ⭐⭐⭐⭐ |
| `/analytics` | Business revenue/lead dashboards | ⭐⭐⭐⭐ |
| `/sponsors` | Sponsor marketplace | ⭐⭐⭐ |
| `/neighborhoods` | Premium lifestyle content (rental funnel) | ⭐⭐⭐ |
| `/marketplace` | Unified vertical marketplace | ⭐⭐ (later) |
| `/explore` | Editorial discovery (SEO) | ⭐⭐ |

### 6.3 Missing components

Recommendation cards w/ monetizable CTA · comparison views · AI insight panels · **booking/checkout widgets reusable across verticals** · **business revenue dashboard** · subscription/billing UI · featured-placement badge (through `MapContext.mergePins`, honoring single-pin-writer invariant).

---

## Phase 7 — Supabase Audit

**Strong base** (80 migrations, RLS lockdown, atomic RPCs). Missing **revenue/CRM/marketing** tables:

| Domain | Have | Add |
|---|---|---|
| CRM | `leads`, `landlord_inbox`, `sponsor.applications` | `opportunities` (pipeline), `lead_billing`, unify `contacts` |
| Revenue | `payments`, `sponsor.invoices`, `event_taxes_and_fees` | **`subscriptions`, `commissions`/`platform_fees`, `payouts`/`connect_transfers`, `connect_accounts`** |
| Marketing | `whatsapp_*`, `wa_outbox`, `email_outbox` | `campaigns`, `audiences`, `automations` |
| Intelligence | `venue_signals`, `rental_signals`, `neighborhood_profiles` | `recommendation_signals`, `user_preferences` (personalization → conversion) |
| Placement | `sponsor.placements`, `event_sponsor_placements`, `outbound_clicks` | `featured_placements` (SMB self-serve, time-boxed) |

> Indexes/analytics are healthy. The gap is **billing + CRM pipeline + campaign** tables — the data model for *making* money, not *finding* things.

---

## Phase 8 — Stripe Monetization Audit

| Capability | State | Action |
|---|---|---|
| Checkout (tickets) | ✅ idempotent, oversell-safe | reuse as shared checkout widget across verticals |
| Wallets (Apple/Google Pay) | ✅ tickets | extend to all checkouts (+20–50% mobile conversion) |
| **Connect** | ❌ **absent** | **add Connect Express + destination charges + `application_fee_amount`** |
| **Billing** | ❌ absent | add for subscriptions/retainers + metered leads |
| Split payments | ❌ | destination charges (single op) / separate charges & transfers (trip bundles) |
| Webhook truth | ✅ (`ticket-payment-webhook`) | generalize: one webhook edge writes `platform_fees`/`payouts` |

**Recommended rails:** event/tourism/nightlife → **destination charges**; rental deposits → destination charges; trip bundles → **separate charges & transfers**; subscriptions/retainers/leads → **Billing**. (Flows detailed in [`prd/revenue-engine-prd.md §3`](prd/revenue-engine-prd.md).)

---

## Phase 9 — Roadmap

### Core (0–3 mo) — revenue-first, lowest complexity, highest ROI
1. **Productize AI agency** (Marketing Agent + service packages) → first cash, ~no infra.
2. **Stripe Billing** → business subscriptions + retainers + **metered rental-lead billing** (`lead_billing`).
3. **Sales Agent + `create_checkout` tool** → make every discovery flow close.
4. **Activate `sponsor.*`** via `/advertise` self-serve + Sponsor Agent.
5. Remove `pingAgent` from prod; park `evaluationAgent`.

### MVP (3–6 mo) — marketplace expansion
6. **Stripe Connect Express** + destination charges → tourism/nightlife/rental payouts.
7. **`/business` portal** (subs, leads, analytics dashboards).
8. **Lead Agent** (qualify → bill → CRM follow-up) + `opportunities` pipeline.
9. WhatsApp automation productized (wire `wa_outbox` to campaigns).

### Advanced (6–18 mo)
10. Trip bundles (separate charges & transfers) + Trip Agent.
11. Fashion + full tourism marketplace.
12. Personalization (`user_preferences`/`recommendation_signals`) → conversion lift.
13. "AI operating system" — agents orchestrate cross-vertical bundles.

---

## Final Deliverables

### 1. Executive Audit (scores)

| Dimension | Score | Rationale |
|---|---|---|
| **Product** | 68/100 | Strong discovery + real ticketing/trips; shallow transaction depth, no business surfaces |
| **Revenue** | 45/100 | Ticketing + sponsor live; no Connect/subscriptions/agency; agents can't sell |
| **Technical** | 80/100 | Sophisticated, disciplined (RLS, idempotency, grounding) — genuinely strong |
| **UX** | 70/100 | Polished consumer chat/maps; missing business/partner/analytics surfaces |
| **Marketplace** | 30/100 | No payouts/Connect/operator onboarding — not yet a marketplace |
| **Growth** | 50/100 | Lead capture + `outbound_clicks` + WhatsApp scaffold; no productized funnel/agency |
| **Overall** | **57/100** | World-class plumbing, under-built register. Revenue rails are the unlock. |

### 2. Critical Fixes — Top 25

| # | Fix | Why |
|---|---|---|
| 1 | Add `create_checkout` tool → agents can transact | Unblocks all transaction revenue |
| 2 | Stripe Connect Express + destination charges | Enables marketplace payouts |
| 3 | `subscriptions` table + Stripe Billing | Recurring revenue |
| 4 | Productize AI agency (packages + Marketing Agent) | Fastest cash |
| 5 | Meter + bill rental leads (`lead_billing`) | Monetize existing `leads` |
| 6 | `/advertise` self-serve over `sponsor.*` | Activate dormant subsystem |
| 7 | `platform_fees`/`payouts` ledger + reconciliation | Marketplace accounting |
| 8 | Sales Agent (upsell/bundle) | AOV + conversion lift |
| 9 | `/business` portal | Self-serve onboarding |
| 10 | Tourism/nightlife checkout | New transaction lines |
| 11 | Lead Agent (qualify/enrich/route) | Lead quality + billing |
| 12 | Extend wallets to all checkouts | +20–50% mobile conversion |
| 13 | Restaurant retainer/featured product | Highest-volume SMB cash |
| 14 | Sponsor Agent (match/proposal/invoice) | Scales sponsorship |
| 15 | Remove `pingAgent` from prod; park `evaluationAgent` | Reduce surface/cost |
| 16 | Collapse `routerAgent`/concierge overlap | Simplify, cut latency/cost |
| 17 | Promo/discount codes on tickets | Conversion + campaigns |
| 18 | Abandoned-cart WhatsApp recovery (`wa_outbox`) | Recover lost revenue |
| 19 | Organizer/venue analytics dashboards | Retention (NRR) |
| 20 | `campaigns`/`audiences`/`automations` tables | Marketing engine |
| 21 | Trip bundles (separate charges & transfers) | Multi-operator monetization |
| 22 | `user_preferences` personalization | Conversion lift |
| 23 | Featured-placement badge via `mergePins` | Map monetization (honors invariant) |
| 24 | Booking confirmation + no-show loop | Restaurant reliability |
| 25 | Consumer Pro/VIP (trips perks) | Consumer ARPU |

### 3. New Features — ranked (Revenue Impact / Difficulty / Time-to-Revenue)

| Feature | Rev impact | Difficulty | TTR |
|---|---|---|---|
| AI agency packages | ⭐⭐⭐⭐⭐ | Low | 1–2 wk |
| Stripe Billing subs | ⭐⭐⭐⭐⭐ | Med | 2–4 wk |
| `create_checkout` + Sales Agent | ⭐⭐⭐⭐⭐ | Med | 3–5 wk |
| Lead billing | ⭐⭐⭐⭐ | Low | 2–3 wk |
| `/advertise` (sponsor self-serve) | ⭐⭐⭐⭐ | Med | 3–4 wk |
| Stripe Connect | ⭐⭐⭐⭐ | High | 6–10 wk |
| Tourism/nightlife checkout | ⭐⭐⭐⭐ | Med | 4–6 wk |
| `/business` portal | ⭐⭐⭐ | Med | 4–6 wk |

### 4. New Agents — by ROI
Sales ⭐⭐⭐⭐⭐ · Lead ⭐⭐⭐⭐⭐ · Marketing ⭐⭐⭐⭐⭐ · Sponsor ⭐⭐⭐⭐ · Trip ⭐⭐⭐⭐ · Neighborhood ⭐⭐⭐.

### 5. New Workflows — by ROI
Checkout/upsell (all verticals) ⭐⭐⭐⭐⭐ · Lead qualify→bill ⭐⭐⭐⭐⭐ · Sponsor match→invoice ⭐⭐⭐⭐ · Trip bundle→checkout ⭐⭐⭐⭐ · Abandoned-cart recovery ⭐⭐⭐.

### 6. New Pages — by ROI
`/business` ⭐⭐⭐⭐⭐ · `/advertise` ⭐⭐⭐⭐⭐ · `/partners` ⭐⭐⭐⭐ · `/analytics` ⭐⭐⭐⭐ · `/sponsors` ⭐⭐⭐ · `/neighborhoods` ⭐⭐⭐ · `/marketplace` ⭐⭐ · `/explore` ⭐⭐.

### 7. Revenue Roadmap

| Window | Focus | Exit MRR |
|---|---|---|
| 0–3 mo | Agency + WhatsApp + Billing + Sales Agent + sponsor self-serve | **$10–12.5k** |
| 3–6 mo | Connect + `/business` + lead billing + tourism/nightlife checkout | **$25k** |
| 6–12 mo | Marketplace density + subscriptions + analytics | **$50k** |
| 12–24 mo | Trip bundles + fashion + personalization + multi-city | **$80–100k** |

### 8. Financial Model — paths

| Milestone | Composition | Timing |
|---|---|---|
| **$10k MRR** | 15 agency retainers @ ~$667 (no infra) | ~90 days |
| **$25k MRR** | + subscriptions + lead billing + sponsored listings | ~6 mo |
| **$50k MRR** | + Connect take-rate (tickets/tours/nightlife) + SaaS density | ~12 mo |
| **$100k MRR** | + marketplace GMV + ads/sponsorship + multi-vertical | ~18–24 mo |
| **$1M ARR** | ~$83k/mo blended (≈ Yr2 "Expected" P&L) | within Yr2 |

Unit economics (services-led): GM ~78%, LTV:CAC ~15–41:1, CAC payback ~1 mo. **Risk #1 = churn, not CAC.**

### 9. Final Recommendation — if I were CEO + CTO

**Build first (next 90 days):**
1. **The AI agency, productized** — packages, Marketing Agent, WhatsApp automation. It's the fastest cash, it funds everything, and it needs almost none of the complex infra you've already built. This is your wedge.
2. **`create_checkout` tool + Sales Agent** — the cheapest way to turn your existing discovery engine into a revenue engine. Today your AI finds things and stops; make it close.
3. **Stripe Billing + metered lead billing** — recurring revenue and monetize the `leads` you already capture for free.

**Stop building:** more discovery/grounding sophistication. You have a 9/10 search engine bolted to a 4/10 revenue system. Every additional grounding feature widens that gap.

**Postpone:** Stripe Connect marketplace until Q2 (services + leads don't need it), full tourism/fashion marketplaces to 6–18 mo.

**Remove:** `pingAgent` from prod; park `evaluationAgent`; collapse `routerAgent` into the concierge routing path; shelve fashion as anything but a PR flywheel until Yr2.

**Focus for max revenue/growth:** *services-led, agent-assisted selling.* Your moat isn't the best Medellín search — it's being the **AI marketing + booking layer** that local businesses pay monthly for and that closes transactions inside one Spanish-first, WhatsApp-native concierge. Point every agent, page, and table you build next at **"who pays, and how does the money move,"** not "what else can we find."

**The one-line verdict:** *You've built a beautiful engine and forgotten the fuel pump. Add the rails (checkout tool, Billing, Connect) and the register (agency, leads), stop polishing the search, and you convert a 57/100 product into a cash-generating marketplace without a rewrite.*

> _Strategic Audit v1 — pairs with [`revenue-strategy-v2.md`](revenue-strategy-v2.md) (business) and [`prd/revenue-engine-prd.md`](prd/revenue-engine-prd.md) (workflows). Re-audit quarterly._
