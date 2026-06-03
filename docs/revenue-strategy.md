# MDE AI — Revenue, Profit & Growth Master Plan

> **Project:** MDE AI (Medellín AI Concierge) — an AI-first, chat-first, map-first discovery, booking, and ticketing platform for Medellín.
> **Audience:** founders, investors, GTM/RevOps.
> **Status:** strategy v1 (2026-06). Numbers are industry benchmarks + modeled estimates, not contractual figures. Validate commission rates against signed partner terms before quoting publicly.
> **Currency:** USD throughout, with COP context where relevant (≈ 1 USD = 4,000 COP as a planning rate).

## How to read this document

This plan moves from **market reality → revenue menu → AI services → marketplace design → pricing → partnerships → demand engine → financials → prioritization → an executable roadmap.** The single most important conclusion is in [Phase 10](#phase-10--final-recommendation): MDE should monetize as an **AI marketing + lead-gen agency first**, and let the **marketplace/commission business compound underneath it** — not the other way around. This avoids the classic marketplace trap (lots of users, no revenue in year one).

> **Chunked deep-dive:** this file is the executive master. For the detailed, per-phase working version (deeper tables, worked examples, playbooks, checklists), see [`docs/strategy/`](strategy/00-index.md) — one chunk per phase.

---

## Table of contents

1. [Phase 1 — Market Research](#phase-1--market-research)
2. [Phase 2 — Revenue Sources](#phase-2--revenue-sources)
3. [Phase 3 — AI Services](#phase-3--ai-services)
4. [Phase 4 — Marketplace Strategy](#phase-4--marketplace-strategy)
5. [Phase 5 — Subscription Plans](#phase-5--subscription-plans)
6. [Phase 6 — Partnerships](#phase-6--partnerships)
7. [Phase 7 — Lead Generation Engine](#phase-7--lead-generation-engine)
8. [Phase 8 — Financial Model](#phase-8--financial-model)
9. [Phase 9 — Prioritization](#phase-9--prioritization)
10. [Phase 10 — Final Recommendation](#phase-10--final-recommendation)

---

## Phase 1 — Market Research

### 1.1 Competitor revenue models (master comparison)

| Competitor | Primary revenue model | Take rate / commission | Subscription / ads | Lead-gen angle | Core strength | Core weakness | MDE opportunity |
|---|---|---|---|---|---|---|---|
| **Yelp** | Ads + lead-gen | N/A (CPC ads) | Business pages ~$0–$1k+/mo ad spend | Sells "request a quote" leads | Huge review corpus, SEO | Spammy ad pressure, weak in LATAM | AI concierge replaces "10 blue links" with one answer; Medellín-native |
| **Eventbrite** | Ticketing fees | ~3.7% + $1.79/ticket (US) + ~2.9% payment | Eventbrite Ads, Pro tiers | Organizer self-serve | Self-serve organizer tooling | High fees, generic discovery | Lower fee + AI promotion bundle for organizers |
| **Airbnb Experiences** | Host commission | ~20% of experience price | None | Curated host onboarding | Brand trust, global demand | Pulled back/relaunched, thin local depth | Local host curation + WhatsApp booking |
| **GetYourGuide** | OTA commission | ~20–30% of tour price | Supplier tools | SEO + paid demand | Tours/activities inventory | Commodity inventory, price-led | Be the **supply originator** in Medellín, not reseller |
| **Viator (Tripadvisor)** | OTA commission | ~20–30% (often 25%) | N/A | Tripadvisor traffic funnel | Massive activities catalog | High take rate squeezes operators | Direct operator relationships, lower take |
| **Fever** | Ticketing + own events | ~20–30%, plus "Original" events margin | Sponsorships | Performance marketing machine | Owns demand + IP events | Capital-intensive, few cities deep | Replicate "Fever Originals" model locally, asset-light |
| **OpenTable** | SaaS + cover fees | ~$1/seated cover + reservation fees | ~$149–$449/mo per restaurant | Diner network | Restaurant CRM lock-in | Expensive for SMBs, weak LATAM | WhatsApp reservations at fraction of cost |
| **Tripadvisor** | Ads + Viator commissions | Hotel meta CPC; Viator ~25% | Business Advantage ~$30–$70/mo | Review-driven intent | Brand + reviews | Declining engagement, ad-cluttered | AI trip planning vs. static reviews |
| **Google Maps** | Ads (in Search/Maps) | CPC ads, hotel/flight meta | Free listings | Local intent capture | Default discovery surface | Generic, not transactional locally | Be the **transaction layer** on top of Maps data |
| **Airbnb** | Guest + host fees | ~14–16% guest + ~3% host (≈ effective 15%+) | None | SEO + brand | Global liquidity, trust | Regulatory friction, generic stays | Medellín concierge + mid-term rentals + experiences bundle |
| **Booking.com** | Hotel commission | ~15% (up to 18–25% w/ visibility boosters) | Booster programs | Massive paid + SEO | Largest hotel inventory | Commoditized, hotel resentment | Bundle hotel + experiences + transfers as one AI itinerary |
| **Medellín tourism platforms** (e.g. local DMCs / "things to do" sites) | Tour resale + custom packages | ~15–30% reseller margin | Few subscriptions | Word of mouth, hotel desks | Local knowledge | No tech, no AI, fragmented | **Aggregate them**; give them tech + demand |
| **Fashion marketplaces** (e.g. ASOS-style / regional, plus Colombiamoda ecosystem) | Marketplace commission | ~10–30% of GMV | Vendor/seller fees | Influencer + content | Brand discovery | Low margin, logistics-heavy | Designer discovery + event ticketing, not logistics |
| **Local event discovery apps** | Ads + ticketing | Variable, often <5% effective | Promo placements | Social/organic | Niche communities | Thin monetization, no AI | Monetize via AI promotion packages, not just tickets |

> **Read of the field:** the OTAs (GetYourGuide, Viator, Booking) win on *demand aggregation* and charge 15–30%. The SaaS players (OpenTable) win on *operator workflow lock-in* and charge $150–$450/mo. The pure-discovery players (Yelp, Maps, Tripadvisor) monetize *attention* via ads. **MDE's wedge is to combine operator workflow (AI marketing/automation) with demand origination (concierge) — a hybrid almost nobody runs in Medellín.**

### 1.2 Detailed model notes

| Dimension | OTA model (Viator/GYG/Booking) | SaaS model (OpenTable) | Ad/lead model (Yelp/Maps) | Ticketing (Eventbrite/Fever) |
|---|---|---|---|---|
| Who pays | Supplier (commission) | Business (monthly) | Business (CPC) | Attendee + organizer |
| When paid | On completed booking | Recurring monthly | On click/lead | On ticket sale |
| Cash-flow shape | Lumpy, seasonal | Predictable MRR | Predictable | Spiky around events |
| CAC payback | Slow (high paid spend) | Medium | Fast | Medium |
| Defensibility | Demand liquidity | Workflow lock-in | SEO + data | Brand + IP events |
| Gross margin | 70–85% on take | 80–90% | 85%+ | 60–80% net of payment |

### 1.3 Strengths / weaknesses / MDE exploit map

| Competitor cluster | What they do well | Where they're weak | **MDE play** |
|---|---|---|---|
| Global OTAs | Liquidity, trust, conversion | High fees, no local relationship, English-first, no WhatsApp | Lower take + Spanish-first WhatsApp concierge + local operator loyalty |
| Reservation SaaS | Operator stickiness | Price, hardware, weak LATAM support | WhatsApp-native reservations at SMB-friendly price |
| Discovery/ads | Reach, default behavior | Not transactional, not personalized | Personalized AI itinerary that *books*, not just lists |
| Local players | Trust, ground truth | No tech, no scale, no AI | Be their tech + demand layer (white-label AI) |

---

## Phase 2 — Revenue Sources

Commission columns: **Industry standard** = what incumbents charge; **Startup-friendly** = what wins supply early; **Recommended** = MDE's launch rate. All "recommended" rates assume MDE is also providing AI marketing value, justifying the take.

### 2.1 Events

| Stream | Industry std | Startup-friendly | **Recommended (MDE)** | Notes |
|---|---|---|---|---|
| Ticket commission | 3.7% + fee → ~10% all-in | 2–4% | **5% + $0.40/ticket** (passed to buyer) | Undercut Eventbrite, buyer-paid so organizer keeps face price |
| Featured event placement | $50–$500/event | $20–$80 | **$30–$120/event** | Pure margin, no fulfillment |
| Sponsored events | Negotiated | — | **$200–$1,500/campaign** | Brand pays for AI reach |
| AI marketing package (event) | n/a | — | **$150–$600/event** | Posters, captions, WhatsApp blast, IG plan |
| Lead generation (organizers) | — | — | **$3–$10/qualified lead** | Attendee interest leads |
| VIP event promotion | — | — | **$100–$500/event** | Concierge pushes to high-intent users |
| WhatsApp campaign | — | — | **$50–$300/blast** + usage | Per-segment broadcast |
| Influencer promotion (managed) | 15–30% of spend | — | **20% mgmt fee** | MDE brokers local creators |
| Premium analytics | $20–$100/mo | — | **Bundled in Business tier** | Drives subscription upgrade |

### 2.2 Restaurants

| Stream | Industry std | Startup-friendly | **Recommended (MDE)** | Notes |
|---|---|---|---|---|
| Reservation commission | $0.50–$1.50/cover | $0.25–$0.75 | **$0.50/cover or $0 + retainer** | Lead with free reservations to win logos |
| Sponsored / featured listing | $50–$300/mo | $25–$100 | **$49–$199/mo** | High margin |
| AI marketing retainer | $500–$3,000/mo (agency) | — | **$300–$1,200/mo** | Core SMB cash cow |
| Reputation/review management | $100–$500/mo | — | **$99–$299/mo** | AI-assisted responses |
| WhatsApp marketing | $50–$300/mo | — | **$99–$249/mo** | Broadcasts + automated booking |
| Social content generation | $300–$1,500/mo | — | **$199–$799/mo** | AI content + light human QA |
| Review generation (compliant) | — | — | **Bundled** | Post-visit WhatsApp ask (no fake reviews) |
| Customer acquisition campaign | CPA-based | — | **$3–$8/new diner** | Performance pricing |

### 2.3 Cafés

| Stream | **Recommended (MDE)** | Notes |
|---|---|---|
| Featured placement | **$29–$99/mo** | Café budgets are small — keep it cheap |
| Loyalty program (white-label) | **$29–$79/mo** | WhatsApp punch-card |
| Subscription (Pro café bundle) | **$49–$149/mo** | Listing + content + loyalty |
| Customer acquisition campaign | **$2–$5/new customer** | Foot-traffic focused |
| AI-powered promo (happy hour blasts) | **$19–$49/blast** | Micro-spend, high frequency |

### 2.4 Nightlife

| Stream | Industry std | **Recommended (MDE)** | Notes |
|---|---|---|---|
| VIP table booking fee | 10–20% of min spend | **10–15%** of bottle/table min | High AOV, high margin |
| Guest-list commission | $2–$10/head | **$3–$8/head** | Volume nights |
| Sponsored nightlife placement | — | **$99–$499/mo** | "Tonight in Medellín" slot |
| Event promotion | — | **$100–$800/event** | DJ nights, openings |

> Nightlife = **highest AOV per transaction** in the early portfolio (VIP tables run $300–$2,000 min spend). A 12% fee on a $1,000 table = $120 per booking.

### 2.5 Real Estate

| Stream | Industry std (LATAM) | **Recommended (MDE)** | Notes |
|---|---|---|---|
| Lead generation (raw) | $5–$30/lead | **$8–$20/lead** | Inquiry forms via concierge |
| Qualified lead | $20–$80/lead | **$30–$75/qualified lead** | Budget + timeline + verified contact |
| Referral fee (closed deal) | 20–35% of agent commission | **20–25%** | High value, slow cycle |
| Rental commission (mid-term) | 50–100% of one month | **50% of first month** or 8–12% of contract | Expat/digital-nomad sweet spot |
| Premium agent subscription | $50–$300/mo | **$99–$299/mo** | Lead flow + AI listing tools |
| Featured property | $20–$100/listing | **$25–$75/listing** | Pure margin |
| AI property marketing | $200–$1,000/mo | **$199–$699/mo** | Listings, tours, WhatsApp follow-up |

> Medellín reality: huge **digital-nomad + expat** mid-term rental demand (El Poblado, Laureles, Envigado). Qualified expat rental leads are worth more than local sales leads early on.

### 2.6 Tourism

| Stream | Industry std | **Recommended (MDE)** | Notes |
|---|---|---|---|
| Tour commission | 20–30% (OTA) | **15–20%** | Undercut Viator, win operators |
| Attraction booking | 10–25% | **12–18%** | Comuna 13, Guatapé, coffee tours |
| Transportation booking | 10–20% | **12–15%** | Day trips, intercity |
| Hotel partnership | 10–18% | **10–15%** or concierge-desk rev-share | Bundle with experiences |
| Airport transfers | $5–$15/transfer or 15–25% | **15–20%** | High frequency, easy fulfillment |
| Local guides (marketplace) | 15–25% | **15–20%** | Verified guide network |
| Experience bookings | 20% (Airbnb) | **15–18%** | Curated "only-in-Medellín" |

### 2.7 Fashion

| Stream | Industry std | **Recommended (MDE)** | Notes |
|---|---|---|---|
| Designer profiles (subscription) | $20–$200/mo | **$29–$149/mo** | Discovery + portfolio |
| Marketplace commission (goods) | 10–30% | **12–20%** | Only if MDE handles checkout |
| Fashion week / Colombiamoda sponsorship | Negotiated | **$1k–$10k/campaign** | Anchor brand deals |
| Colombiamoda partnership package | — | **Rev-share / sponsorship** | Flagship credibility play |
| Vendor subscriptions | $20–$200/mo | **$29–$199/mo** | Showroom + leads |
| Fashion event ticketing | 5–10% | **5–8%** | Same engine as events |
| Fashion discovery marketplace | 10–30% | **15%** | Later-stage |

> Fashion is **brand/credibility-rich but slow-to-monetize**. Treat Colombiamoda as a *marketing flywheel* (PR, designer relationships) more than a near-term cash line.

### 2.8 Revenue-source summary (margin & speed)

| Category | Fastest line | Highest margin line | Biggest long-term line |
|---|---|---|---|
| Events | AI promo packages | Featured placement (90%+) | Ticket commissions at scale |
| Restaurants | Marketing retainer | Featured listing (90%+) | Retainers + reservations network |
| Cafés | Featured placement | Loyalty SaaS | Bundled subscription |
| Nightlife | Guest-list comm. | VIP table fee | VIP + sponsorship |
| Real estate | Qualified leads | Referral fees | Agent subscriptions + rentals |
| Tourism | Transfers/tours | Featured + commission | Experience marketplace |
| Fashion | Vendor subs | Sponsorships | Discovery marketplace |

---

## Phase 3 — AI Services

This is MDE's **fastest, highest-margin, most defensible** revenue. It uses the exact same stack (Mastra, Gemini/OpenAI/Claude, WhatsApp, Supabase, pgvector) the product already runs on — so delivery is near-zero marginal cost.

### 3.1 AI Marketing & Automation menu

| Service | What it does | Setup fee | **MRR** | Margin |
|---|---|---|---|---|
| Instagram growth + content | AI captions, posting cadence, hashtag/sound strategy | $150–$500 | **$199–$799/mo** | 80–90% |
| Content generation engine | Photos→posts, menus→carousels, video scripts | $100–$300 | **$149–$599/mo** | 85%+ |
| Local SEO / Google Business | Profile optimization, posts, Q&A, reviews | $150–$400 | **$149–$499/mo** | 85%+ |
| Review management | AI-drafted responses, sentiment alerts | $50–$150 | **$99–$299/mo** | 85%+ |
| WhatsApp automation | Booking bot, FAQ, broadcast campaigns | $200–$800 | **$149–$699/mo** | 80–90% |
| Customer support agent | 24/7 AI concierge for the business | $300–$1,000 | **$199–$899/mo** | 80%+ |
| Lead qualification agent | Scores/routes inbound, books callbacks | $300–$1,000 | **$199–$799/mo** | 80%+ |
| Booking automation | End-to-end reservation/checkout flow | $300–$1,200 | **$149–$699/mo** | 80%+ |

**Packaging (sell bundles, not à la carte):**

| Package | Includes | Setup | **MRR** | Target |
|---|---|---|---|---|
| **Starter** | Listing + 1 channel content + reviews | $150 | **$249/mo** | Cafés, small restaurants |
| **Growth** | + WhatsApp automation + SEO + analytics | $400 | **$699/mo** | Restaurants, agents, tour ops |
| **Pro Agency** | + support agent + lead qual + paid mgmt | $900 | **$1,499/mo** | Multi-location, nightlife, real estate teams |
| **Enterprise** | Custom agents, API, white-label, SLA | $3k–$15k | **$2,500–$8,000/mo** | Hotel groups, Colombiamoda, chains |

> **Why this first:** 80–90% gross margin, MRR (predictable), sold to the *same* businesses that will later list/transact on the marketplace. The agency relationship *is* the supply-acquisition channel.

### 3.2 OpenClaw / Instagram Intelligence (compliant lead discovery)

**Goal:** discover and qualify businesses, influencers, restaurants, events, and "contestants/talent" as inbound for both the marketplace (supply) and the AI agency (clients).

**Legal/ethical method — do this:**

| Allowed approach | Why it's safe |
|---|---|
| Official APIs (Instagram Graph API, Google Places API, Meta/Facebook Graph) | ToS-compliant, rate-limited, consented |
| Public business directories, government tourism registries (RNT), Cámara de Comercio data | Public records |
| Opt-in lead magnets (free audit, "claim your listing") | First-party consent |
| Partner data shares (hotels, universities, Colombiamoda) | Contractual |
| Manual research / BD outreach with documented opt-out | Standard B2B sales |

**Avoid — do not do this:**

| Risky approach | Risk |
|---|---|
| Scraping Instagram/Google against ToS | Account bans, legal exposure, Meta litigation precedent |
| Storing personal data without basis | Colombia **Ley 1581/2012** (Habeas Data) + GDPR-style obligations |
| Cold-blasting scraped contacts on WhatsApp | WhatsApp ban + **anti-spam** liability |
| Buying scraped lists | Provenance/consent unknowable |

**Revenue opportunities from compliant intelligence:**

| Use | Revenue |
|---|---|
| Sell qualified business leads to MDE agency pipeline | Internal CAC reduction |
| "Influencer discovery" service for brands | $200–$1,000/campaign brokerage |
| Market-intelligence reports (venue/event landscape) | $500–$2,500/report |
| Talent/contestant sourcing for fashion/events | Placement fee or sponsorship |

**Compliance checklist (build once):**
- Register the data-processing purpose; publish a privacy policy (Habeas Data compliant).
- WhatsApp: use **only opt-in** numbers, official Business API, approved templates, honor STOP.
- Keep a documented lawful basis for every contact record; support deletion requests.
- Default to **first-party + official-API + partner** data; treat scraping as out of bounds.

---

## Phase 4 — Marketplace Strategy

### 4.1 Who pays?

| Actor | Pays for | Willingness to pay | Priority |
|---|---|---|---|
| **Businesses** (restaurants, venues, agents) | Leads, marketing, listings, subscriptions | **High** (revenue-linked) | ⭐ 1 |
| **Event organizers** | Tickets, promotion, sponsorship | **High** | ⭐ 1 |
| **Vendors** (tours, fashion, transport) | Commission, featured placement | Medium-High | 2 |
| **Advertisers / brands** | Sponsored placement, campaigns | Medium-High | 2 |
| **Customers** (tourists, expats, locals) | Convenience fee (small), premium concierge | Low-Medium | 3 |

> **Principle:** charge the side that *makes money from the transaction* (supply/business side), keep the consumer side as frictionless as possible to build liquidity.

### 4.2 Three pricing architectures

| Model | How it works | Pros | Cons | Best for |
|---|---|---|---|---|
| **Transaction fee (take-rate)** | % of each booking/ticket | Scales with GMV, no upfront friction | Needs liquidity to matter; lumpy | Tours, tickets, nightlife, rentals |
| **Subscription** | Flat monthly per business | Predictable MRR, sell before liquidity | Churn if value not felt | Marketing services, listings, agent tools |
| **Hybrid (recommended)** | Low/zero base sub + transaction fee + paid placement | Revenue before *and* after liquidity; multiple expansion levers | More complex to communicate | **MDE** |

### 4.3 Recommended startup approach — "Hybrid, subscription-led"

```
Stage 1 (0–6 mo):  Subscriptions + AI services dominate   (revenue WITHOUT liquidity)
Stage 2 (6–18 mo): Add transaction fees as bookings grow  (revenue WITH liquidity)
Stage 3 (18 mo+):  Add ads/sponsorship + take-rate at scale (margin expansion)
```

- **Lead with subscriptions + agency retainers** so revenue does not depend on marketplace liquidity (the #1 reason marketplaces die in year one).
- **Layer transaction fees** on tickets, tours, nightlife, rentals as GMV appears.
- **Add sponsorship/ads** only once you have an audience worth advertising to.

---

## Phase 5 — Subscription Plans

### 5.1 Business-side tiers (the money tiers)

| Plan | Price | Key features | Limits | Target |
|---|---|---|---|---|
| **Free / Claim** | $0 | Claimed listing, basic profile, up to X leads/mo, reply to reviews | Capped leads, no automation, MDE branding | Long-tail supply, top-of-funnel |
| **Pro** | **$49–$99/mo** | Featured eligibility, WhatsApp inbox, analytics, unlimited leads, 1 AI content channel | 1 location, limited campaigns | Cafés, single venues, solo agents |
| **Business** | **$199–$399/mo** | Everything in Pro + AI marketing (multi-channel), reservation/booking automation, priority placement, review mgmt, 3 locations | Fair-use AI credits | Restaurants, tour operators, agencies |
| **Enterprise** | **$1,000–$8,000/mo** | Custom agents, API access, white-label, dedicated success, SLA, multi-location, data feeds | Negotiated | Hotel groups, chains, Colombiamoda, real-estate brokerages |

### 5.2 Consumer-side (keep light)

| Plan | Price | Features |
|---|---|---|
| **Free** | $0 | Full AI concierge, search, maps, booking, tickets |
| **MDE+ (optional)** | **$5–$9/mo** | Priority concierge, exclusive event access, VIP perks, no booking fees, partner discounts |

> Consumer subscription is a *later* lever and mostly a perks/loyalty play — do not gate core discovery.

### 5.3 Competitive comparison

| Capability | OpenTable | Yelp | GetYourGuide | **MDE Business ($199–399)** |
|---|---|---|---|---|
| Reservations | ✅ ($149–449/mo) | ❌ | ❌ | ✅ (WhatsApp-native) |
| Marketing/content | ❌ | Ads only | ❌ | ✅ AI-generated |
| WhatsApp automation | ❌ | ❌ | ❌ | ✅ |
| Booking/checkout | ❌ | ❌ | ✅ (25% take) | ✅ (low take + sub) |
| Leads | Add-on | ✅ (pay per) | ❌ | ✅ included |
| Spanish-first / local | Weak | Weak | Partial | ✅ Native |
| **Effective cost** | High | Variable/high | High take-rate | **Bundled, SMB-friendly** |

---

## Phase 6 — Partnerships

Scoring: **Priority = (Revenue × Strategic value) ÷ Effort.** 1–5 scale; ⭐ = pursue in first 90 days.

### 6.1 Local

| Partner | Benefit | Revenue opportunity | Ease (1=hard,5=easy) | Priority |
|---|---|---|---|---|
| **Hotels (El Poblado/Laureles)** | Concierge desk replacement, guest demand | Experience/transfer commissions + rev-share | 3 | ⭐ 5 |
| **Restaurants** | Supply + agency clients | Retainers + reservations + featured | 4 | ⭐ 5 |
| **Event organizers** | Ticketing supply + promo | Ticket comm. + promo packages | 4 | ⭐ 5 |
| **Tour operators / DMCs** | Experience inventory | 15–20% commission | 4 | ⭐ 4 |
| **Fashion designers / Colombiamoda** | Credibility, PR, content | Sponsorships + subs | 2 | 3 |
| **Universities (EAFIT, UPB, etc.)** | Student users + intern talent + events | Event promo + talent pipeline | 3 | 3 |
| **Tourism agencies / nomad communities** | Distribution to expats | Rentals + experiences | 4 | ⭐ 4 |

### 6.2 Global / platform

| Partner | Benefit | Revenue / cost angle | Ease | Priority |
|---|---|---|---|---|
| **Stripe** | Payments, Connect for marketplace payouts | Enables take-rate + payouts | 5 | ⭐ 5 |
| **Google Maps / Places** | Data, discovery, reviews | Powers concierge; ad credits | 4 | ⭐ 4 |
| **WhatsApp (Meta) Business API** | Core channel | Automation revenue | 3 | ⭐ 5 |
| **OpenAI / Gemini / Claude** | Model layer | Startup credits cut COGS | 5 | ⭐ 4 |
| **Cloudinary** | Media pipeline for content gen | Lowers content-service COGS | 5 | 3 |
| **Tourism boards (Procolombia, Medellín DMO)** | Credibility, grants, co-marketing | Grants + distribution | 2 | 3 |

> **First-90-days partnership stack:** Stripe Connect (payouts) + WhatsApp Business API (channel) + 5 hotels + 20 restaurants + 5 event organizers + 3 tour operators. That set alone unlocks every Stage-1 revenue line.

---

## Phase 7 — Lead Generation Engine

### 7.1 Source map

| Channel | Type | Est. CAC (business client) | Est. conv. | Revenue potential | Notes |
|---|---|---|---|---|---|
| **Local SEO / Google Business** | Organic | $20–$60 | 3–6% | High | "Things to do in Medellín" intent |
| **Programmatic SEO (venues/events)** | Organic | $10–$40 | 2–5% | Very high | One page per venue/tour/event |
| **Google Maps presence** | Organic | Low | — | Medium | Feeds concierge + SEO |
| **Instagram** | Social | $30–$80 | 1–3% | High | Content engine dogfoods the product |
| **TikTok** | Social | $20–$60 | 1–3% | High | Tourist/nomad discovery |
| **LinkedIn** | Social | $60–$150 | 2–5% | Medium | B2B agency clients, real estate |
| **Facebook (groups: expat/nomad)** | Social | $25–$70 | 2–4% | High | Medellín expat groups are gold |
| **AI search / ChatGPT / Gemini referrals** | AI | Low (emerging) | — | Rising | Optimize for AI answer citation (GEO) |
| **Hotels / concierge desks** | Partnership | Rev-share | 10–25% | High | Warm, high-intent tourists |
| **Universities / fashion schools** | Partnership | Low | — | Medium | Talent + event audiences |
| **Tourism operators** | Partnership | Rev-share | — | High | Supply + cross-promo |
| **WhatsApp referral loops** | Owned | Very low | 5–15% | High | Built-in virality |
| **Paid (Meta/Google) for high-AOV** | Paid | $40–$120 | — | Medium | Only for nightlife/real estate ROI |

### 7.2 Two funnels to instrument

- **Consumer funnel:** SEO/social/AI-referral → concierge chat → booking/ticket → WhatsApp re-engagement → MDE+ perks.
- **Business funnel:** "Claim your listing" / free AI audit → agency call → Pro/Business subscription → marketplace transactions.

> The cheapest CAC is **dogfooding**: every piece of content MDE generates for itself proves the AI-marketing product and pulls in the next client.

---

## Phase 8 — Financial Model

### 8.1 Formulas (definitions used below)

```
MRR            = Σ (subscribers × monthly price)
ARR            = MRR × 12
Take-rate rev  = GMV × take_rate
Gross profit   = Revenue − COGS (payments, model/API, hosting, content labor)
Gross margin % = Gross profit ÷ Revenue
CAC            = Sales & marketing spend ÷ new customers acquired
LTV            = (ARPA × Gross margin %) ÷ monthly churn      [subscription]
LTV:CAC        = LTV ÷ CAC            (healthy ≥ 3:1)
CAC payback    = CAC ÷ (ARPA × Gross margin %)   (months)
EBITDA         = Gross profit − Operating expenses (excl. D&A, interest, tax)
```

### 8.2 Assumptions

| Assumption | Value |
|---|---|
| Blended subscription ARPA | ~$300/mo (mix of Pro/Business) |
| Blended gross margin (services + take-rate) | ~78% |
| Monthly logo churn (Yr1→Yr3) | 6% → 4% → 3% |
| Blended CAC (business client) | $250 → $200 → $180 |
| Take-rate on GMV | ~12% blended |
| FX planning rate | 4,000 COP / USD |

### 8.3 Three-year P&L scenarios (USD)

| Metric | **Yr1 Conservative** | **Yr2 Expected** | **Yr3 Aggressive** |
|---|---|---|---|
| Paying business clients (EoY) | 60 | 280 | 750 |
| Blended ARPA/mo | $300 | $340 | $380 |
| **Subscription/services rev** | $150,000 | $760,000 | $2,400,000 |
| GMV (tickets/tours/bookings) | $250,000 | $1,800,000 | $7,500,000 |
| Take-rate rev (~12%) | $30,000 | $216,000 | $900,000 |
| Ads/sponsorship rev | $10,000 | $90,000 | $400,000 |
| **Total revenue** | **$190,000** | **$1,066,000** | **$3,700,000** |
| COGS (~22%) | $42,000 | $234,000 | $814,000 |
| **Gross profit** | **$148,000** | **$832,000** | **$2,886,000** |
| Gross margin | 78% | 78% | 78% |
| Operating costs | $180,000 | $620,000 | $1,700,000 |
| **EBITDA** | **−$32,000** | **+$212,000** | **+$1,186,000** |
| EBITDA margin | −17% | 20% | 32% |
| Exit MRR | ~$18,000 | ~$95,000 | ~$320,000 |
| Exit ARR | ~$216,000 | ~$1,140,000 | ~$3,840,000 |

### 8.4 Unit economics

| Metric | Yr1 | Yr2 | Yr3 |
|---|---|---|---|
| ARPA (annual) | $3,600 | $4,080 | $4,560 |
| Gross margin | 78% | 78% | 78% |
| Monthly churn | 6% | 5% | 4% |
| **LTV** = (ARPA × GM%)/(12×churn) | ($3,600×0.78)/(0.72) ≈ **$3,900** | ($4,080×0.78)/(0.60) ≈ **$5,304** | ($4,560×0.78)/(0.48) ≈ **$7,410** |
| CAC | $250 | $200 | $180 |
| **LTV:CAC** | **~15:1** | **~27:1** | **~41:1** |
| CAC payback | ~1.1 mo | ~0.9 mo | ~0.7 mo |

> Unit economics are dominated by the **high-margin AI-services MRR**. The standout risk is **churn**, not CAC — so retention (proving ROI to each business monthly) is the #1 operating metric.

### 8.5 Operating cost shape (Yr1 conservative)

| Line | Annual |
|---|---|
| Founders/core team (lean) | $90,000 |
| Contractors (content QA, BD) | $36,000 |
| Model/API + infra (Gemini/OpenAI/Claude/Supabase) | $18,000 |
| WhatsApp/Twilio/messaging | $9,000 |
| Tools/SaaS | $12,000 |
| Paid marketing | $15,000 |
| **Total** | **~$180,000** |

---

## Phase 9 — Prioritization

Scoring: each axis 1–5 (5 best). **Score = Revenue potential + Margin + Speed + Scalability − Difficulty.** Higher = pursue first.

| Revenue stream | Difficulty | Revenue potential | Margin | Time-to-rev (speed) | Scalability | **Score** | Tier |
|---|---|---|---|---|---|---|---|
| AI marketing services | 2 | 4 | 5 | 5 | 4 | **16** | 🟢 Do now |
| WhatsApp automation setup | 2 | 4 | 5 | 5 | 4 | **16** | 🟢 Do now |
| Featured listings | 1 | 3 | 5 | 5 | 5 | **17** | 🟢 Do now |
| Event promotion packages | 2 | 4 | 4 | 5 | 4 | **15** | 🟢 Do now |
| Restaurant marketing retainers | 3 | 4 | 4 | 4 | 4 | **13** | 🟢 Do now |
| Real estate lead generation | 3 | 4 | 4 | 4 | 4 | **13** | 🟢 Do now |
| Nightlife VIP/guest-list | 3 | 3 | 4 | 4 | 3 | **11** | 🟡 Next |
| Tourism lead generation | 3 | 4 | 4 | 3 | 4 | **12** | 🟡 Next |
| Ticket commissions | 3 | 4 | 3 | 3 | 5 | **12** | 🟡 Next |
| Subscriptions (Business tier) | 3 | 5 | 5 | 3 | 5 | **15** | 🟡 Next (build alongside) |
| Marketplace commissions | 4 | 5 | 4 | 3 | 5 | **13** | 🟠 Later |
| Hotel booking commissions | 4 | 4 | 2 | 2 | 4 | **8** | 🟠 Later |
| Fashion marketplace | 5 | 4 | 3 | 1 | 4 | **7** | 🔴 Latest |

### 9.1 Callouts

| Question | Answer |
|---|---|
| **Fastest revenue** | AI marketing services, WhatsApp setup, featured listings, event promo |
| **Highest margin** | Featured listings (90%+), AI services (80–90%) |
| **Most scalable** | Subscriptions + marketplace commissions + ticketing |
| **Best startup opportunities** | AI agency retainers (MRR before liquidity) |
| **Best MDE-specific opportunities** | Expat/nomad rentals, hotel-concierge experiences, nightlife VIP, Colombiamoda credibility |

---

## Phase 10 — Final Recommendation

### 10.1 Strategic thesis (one paragraph)

**Sell AI marketing + automation services to Medellín businesses from day one (high-margin MRR), use those relationships to acquire marketplace supply for free, and layer transaction fees (tickets, tours, nightlife, rentals) as liquidity builds.** Keep the consumer concierge free to build demand. This sequences revenue *before* liquidity, dodging the marketplace death-trap, and compounds into a defensible local platform.

### 10.2 Best-likely revenue order (from the brief, confirmed)

1. AI marketing agency services
2. Restaurant / event marketing retainers
3. Real-estate lead generation
4. Featured listings & sponsorships
5. Ticketing commissions
6. Full marketplace commissions (later)

### 10.3 90-day revenue plan

| Weeks | Focus | Actions | Target |
|---|---|---|---|
| 1–2 | Foundation | Stripe Connect, WhatsApp Business API, pricing live, 3 service packages defined | Infra ready |
| 3–4 | First cash | Sell 5 AI-marketing retainers (warm restaurants/cafés) | **$2.5–4k MRR** |
| 5–6 | Listings + events | Featured-listing self-serve; 2 event-promo packages sold | +$1–2k |
| 7–8 | Real estate | Qualified-lead product to 3 agencies; nightlife VIP pilot (2 venues) | +$1.5k |
| 9–10 | Scale services | 15 total retainers; case studies/testimonials | **$8–10k MRR** |
| 11–12 | Marketplace seed | Onboard 3 tour operators + ticketing pilot; instrument take-rate | First GMV |

**90-day exit target: ~$10k MRR (services-led) + first marketplace GMV.**

### 10.4 12-month roadmap

| Quarter | Theme | Key milestones | Revenue target (MRR) |
|---|---|---|---|
| Q1 | Services beachhead | 15–25 retainers, featured listings, event promo | $10k |
| Q2 | Transactions on | Ticketing + tours live, nightlife VIP, real-estate leads scaling | $20–25k |
| Q3 | Subscriptions + density | Business tier push, hotel concierge deals, 100+ clients | $35–45k |
| Q4 | Marketplace flywheel | Take-rate at volume, sponsorships, MDE+ perks | **$50–65k** |

### 10.5 MVP vs. advanced revenue model

| | **MVP revenue model** | **Advanced revenue model** |
|---|---|---|
| Core | AI services MRR + featured listings | Hybrid: subs + take-rate + ads/sponsorship |
| Transactions | Manual/assisted, low volume | Automated checkout, Stripe Connect payouts |
| Pricing | 3 fixed packages | Tiered subs + dynamic take-rate + placement auctions |
| Data moat | Basic listings | Behavioral + booking + intelligence products |
| Revenue lines | 3–4 | 15+ across 7 verticals |

### 10.6 Three paths

| Target | Composition | How |
|---|---|---|
| **$10k/mo** | ~15 retainers @ $500–700 | Pure services. Achievable in 90 days, no liquidity needed. |
| **$100k/mo** | ~120 business clients (~$50k MRR) + ~$400k GMV @12% (~$48k) + ads | Services + transactions + subscriptions; ~12–18 months. |
| **$1M/year (~$83k/mo)** | Blend: ~$45k services MRR + ~$30k take-rate + ~$8k ads | Hit during Yr2 "Expected" ($1.06M revenue). Driven by retention + GMV ramp. |

### 10.7 Pricing & commission recommendations (quick reference)

| Line | Recommended |
|---|---|
| Ticket commission | 5% + $0.40, buyer-paid |
| Tours/experiences | 15–20% |
| Nightlife VIP | 10–15% |
| Real-estate qualified lead | $30–$75 |
| Restaurant retainer | $300–$1,200/mo |
| Featured listing | $29–$199/mo |
| Business subscription | $199–$399/mo |
| Enterprise | $1k–$8k/mo |

### 10.8 Go-to-market

1. **Beachhead:** El Poblado + Laureles restaurants/cafés/nightlife (dense, high-value, expat-facing).
2. **Wedge product:** free AI audit → paid retainer. Land with services, expand to marketplace.
3. **Distribution:** dogfood content (IG/TikTok), expat Facebook groups, hotel concierge desks, programmatic SEO.
4. **Proof loop:** publish monthly ROI per client → testimonials → referral engine.
5. **Expand verticals:** restaurants → events → nightlife → real estate → tourism → fashion.

### 10.9 Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Marketplace liquidity never forms | High | High | Services-led revenue doesn't depend on liquidity; transactions are upside |
| High churn on retainers | Medium | High | Monthly ROI reporting, automation reduces delivery cost, annual prepay discount |
| WhatsApp/Meta policy or bans | Medium | High | Official Business API only, opt-in, approved templates, honor STOP |
| Data/privacy (Ley 1581) | Medium | High | First-party + official APIs only; no scraping; documented lawful basis |
| Incumbent (Google/Booking) enters | Low-Med | Medium | Local depth, Spanish-first, WhatsApp-native, operator relationships |
| AI/model COGS spikes | Medium | Medium | Multi-model (Gemini/OpenAI/Claude) routing, caching, startup credits |
| Founder bandwidth / over-scope | High | Medium | Sequence strictly per Phase 9; say no to fashion marketplace until Yr2 |
| FX / macro volatility (COP) | Medium | Medium | Price services in USD where possible; keep COGS variable |

### 10.10 Actionable implementation checklist

- [ ] Stand up Stripe Connect + WhatsApp Business API.
- [ ] Publish 3 service packages (Starter/Growth/Pro) with public pricing.
- [ ] Build "Claim your listing" + "Free AI audit" lead magnets.
- [ ] Sign first 5 retainer clients (warm El Poblado/Laureles list).
- [ ] Ship featured-listing self-serve (90%+ margin line).
- [ ] Launch event-promo + ticketing pilot with 3 organizers.
- [ ] Stand up qualified-lead product for 3 real-estate agencies.
- [ ] Instrument churn, ARPA, CAC, GMV, take-rate dashboards from day one.
- [ ] Codify privacy/Habeas Data + WhatsApp compliance before any outreach.
- [ ] Sequence verticals per Phase 9; defer fashion marketplace to Yr2.

---

### Appendix — Medellín-specific advantages MDE should lean on

- **Digital-nomad / expat surge** (El Poblado, Laureles, Envigado) → premium mid-term rental + experience demand, USD-denominated, high willingness to pay.
- **WhatsApp is the default channel** in Colombia → MDE's WhatsApp-native concierge and automation are *table stakes locally* but a *moat vs. global OTAs*.
- **Colombiamoda / Medellín fashion identity** → credibility and PR flywheel.
- **Tourism growth + strong "things to do" intent** (Comuna 13, Guatapé, coffee region) → high-margin experience commissions.
- **Spanish-first, locally-grounded AI** → structural advantage over English-first global incumbents.

> _Document v1 — revisit quarterly. Replace benchmark estimates with signed-partner actuals as they land._
