# MDE AI — Revenue Plan v2

> **Version 2.** Builds on the [v1 master](revenue-strategy.md) and the [chunked plan](strategy/00-index.md). v2 adopts the services-first, scorecard-driven structure and **adds the pieces v1's exec summary was missing**: nightlife + cafés as channels, competitor benchmarking, full unit economics, partnerships, lead-gen CAC, compliance, KPIs, risks, GTM beachhead, and a $1M/year path.
> **Currency:** USD; planning FX 4,000 COP/USD. Numbers are benchmark + modeled estimates — replace with signed-partner actuals as they land.

---

## What's new in v2 (gaps added)

| # | Added section | Why it was needed |
|---|---|---|
| 1 | **Nightlife channel** (VIP tables, guest list) | Highest AOV per transaction in Medellín — missing from the 10-channel list |
| 2 | **Cafés channel** | Entire SMB segment with cheap, high-frequency revenue |
| 3 | **Competitor benchmarking** | Justifies pricing & commissions externally |
| 4 | **Unit economics** (LTV, CAC, churn, NRR, EBITDA, 3-yr P&L) | Revenue paths had no margin/retention math |
| 5 | **Partnerships (scored)** | The supply + distribution engine |
| 6 | **Lead-gen engine** (CAC, conversion by channel) | "Get clients" was assumed, not planned |
| 7 | **Compliance & legal** (Ley 1581 Habeas Data, WhatsApp ToS) | OpenClaw + WhatsApp need guardrails |
| 8 | **KPI dashboard** | What to instrument from day one |
| 9 | **Risks & mitigations** | Execution guardrails |
| 10 | **GTM beachhead + $1M/year path** | Where to start; the third milestone |

---

## Executive Summary

**The fastest path is not tickets first. It is high-margin AI services first**, with the marketplace compounding underneath.

| Rank | Revenue Channel | Time to Revenue | Margin |
|---|---|---|---|
| 1 | AI Marketing Agency | 1–2 weeks | 80–95% |
| 2 | Restaurant Marketing Retainers | 2–4 weeks | 80–90% |
| 3 | WhatsApp Automation Services | 2–4 weeks | 75–90% |
| 4 | Real Estate Lead Generation | 1–2 months | 70–90% |
| 5 | **Nightlife VIP / Guest List** 🆕 | 1–2 months | 85–95% |
| 6 | Event Ticket Commissions | 1–3 months | 20–40% |
| 7 | Tourism Experience Commissions | 1–3 months | 20–40% |
| 8 | Premium Listings | 2–4 months | 90%+ |
| 9 | **Cafés (listings/loyalty)** 🆕 | 2–4 months | 85–95% |
| 10 | Business Subscriptions | 3–6 months | 90% |
| 11 | Stripe Marketplace Fees | 6–12 months | 85% |
| 12 | Fashion Marketplace | 6–12 months | 60–80% |

---

## Revenue Opportunity Scorecard

| Revenue Stream | Difficulty | Time | Margin | Scale | Score |
|---|---|---|---|---|---|
| AI Agency | Easy | Fast | 95% | High | **98/100** |
| WhatsApp Automation | Easy | Fast | 90% | High | **96/100** |
| Restaurant Marketing | Easy | Fast | 90% | High | **95/100** |
| Real Estate Leads | Medium | Fast | 85% | High | **94/100** |
| **Nightlife VIP** 🆕 | Easy | Fast | 90% | Medium | **93/100** |
| Tourism Leads | Medium | Fast | 80% | High | **92/100** |
| Premium Listings | Easy | Medium | 95% | High | **92/100** |
| Event Tickets | Medium | Medium | 35% | High | **88/100** |
| Business SaaS | Hard | Medium | 90% | Very High | **87/100** |
| **Cafés** 🆕 | Easy | Medium | 90% | Medium | **86/100** |
| Stripe Marketplace | Hard | Long | 85% | Massive | **86/100** |
| Fashion Marketplace | Hard | Long | 70% | Massive | **84/100** |

---

## Revenue Channel 1 — AI Agency

**Stack:** CopilotKit · Gemini · OpenAI · Mastra · WhatsApp · Supabase

| Vertical | Services |
|---|---|
| Restaurants | AI concierge, WhatsApp booking, review automation, lead generation |
| Real Estate | AI lead qualification, viewing automation, WhatsApp follow-up |
| Events | Event marketing, ticket-sales automation, sponsor outreach |

**Pricing**

| Package | Monthly | Setup |
|---|---|---|
| Starter | $299 | $150 |
| Growth | $599 | $400 |
| Pro | $999 | $900 |
| Enterprise | $2,500+ | $3k–$15k |

**Goal:** 10 clients × $500 = **$5,000 MRR**

🆕 **Delivery economics:** target < 1 hr human time/client/week; COGS ~$30–$220/mo depending on tier → 80–95% gross margin. Monthly auto-generated ROI report is the retention weapon. Annual prepay (2 months free) to crush churn.

---

## Revenue Channel 2 — WhatsApp Automation

**Stack:** AiSensy · n8n · Supabase · Gemini (🆕 + official WhatsApp Business API — see Compliance)

**Example — Restaurant**
```
Customer: "Book table for 4 tonight"
WhatsApp → AI → Reservation → Confirmation
```

**Monthly fee:** $100–$500 · 20 customers = **$2,000–$10,000/month**

🆕 **Guardrail:** opt-in numbers only, approved templates, honor STOP. Cold-blasting scraped numbers = WhatsApp ban + anti-spam liability.

---

## Revenue Channel 3 — Real Estate Leads

**Stack:** Maps · AI Concierge · Rental Cards · Lead Capture

**Flow:** Camila searches "2 bedroom Laureles" → AI → Rental Cards → Schedule Viewing → Lead Captured

| Lead type | Price |
|---|---|
| Per lead | $10–$50 |
| Qualified lead | $50–$200 |
| Closed lease | $500–$2,000 |

**Example:** 50 leads/month × $100 avg = **$5,000/month**

🆕 **Wedge:** expat/digital-nomad **mid-term rentals** (El Poblado, Laureles, Envigado) — USD-paying, high WTP. A qualified expat rental lead is worth more than a local sale lead early on. Add **premium agent subscription** $99–$299/mo for lead flow + AI listing tools.

---

## Revenue Channel 4 — Event Tickets

**Stack:** Stripe · Apple Pay · Google Pay · QR Tickets

**Flow:** "Salsa events" → AI → Event Card → Ticket Purchase → Stripe Checkout → QR Ticket

**Revenue:** $20 ticket × 10% = $2 · 500 tickets/month = **$1,000/month**

🆕 **Recommended take:** 5% + $0.40/ticket **buyer-paid** (organizer keeps face price, undercuts Eventbrite's ~10% all-in). Stack a **$150–$600 AI event-promo package** on top — that's where the real margin is, not the commission.

---

## Revenue Channel 5 — Tourism Experiences

**Examples:** Coffee tours · Comuna 13 · ATV · Guatapé

**Flow:** AI Concierge → Tour Recommendation → Booking → Stripe

**Revenue:** 10–20% commission · 200 bookings × $50 × 15% = **$1,500/month**

🆕 **Recommended take:** 15–20% (undercut Viator's ~25% to win operators). Add **airport transfers** (15–20%, high frequency) and **hotel concierge-desk rev-share** — warm, high-intent tourist demand.

---

## Revenue Channel 6 — Premium Listings

| Placement | Monthly |
|---|---|
| Featured Venue | $49 |
| Featured Restaurant | $99 |
| Featured Event | $99 |
| Featured Rental | $149 |

20 customers × $100 avg = **$2,000/month** · 90%+ margin (no fulfillment)

---

## Revenue Channel 7 — Business Subscriptions

| Segment | Features |
|---|---|
| Restaurants | Analytics, lead dashboard, booking management, AI marketing |
| Event hosts | Ticket + attendee analytics, marketing automation |
| Rental agencies | Lead CRM, showing management, AI qualification |

| Plan | Price |
|---|---|
| Starter | $49 |
| Growth | $149 |
| Pro | $299 |

50 businesses × $100 avg = **$5,000/month**

🆕 **Target NRR > 110%** via tier upgrades, add-on agents, multi-location, and take-rate stacking on top of the base subscription.

---

## Revenue Channel 8 — Stripe Marketplace (future phase)

User pays $100 → Organizer $85 / **MDE $15**

**Architecture:** Stripe Connect + Destination Charges + Transfers. Works for events, tours, rentals, fashion shows. Operators onboard as Connect accounts; MDE takes an application fee per charge.

---

## Revenue Channel 9 — Fashion Marketplace

**Revenue:** ticket sales, vendor booths, sponsorships, premium profiles
**Potential:** $10,000–$50,000/month during **Colombiamoda** season

🆕 **Treat as a PR/credibility flywheel, not near-term cash** — slowest to monetize, logistics-heavy. Defer to Yr2; use Colombiamoda for designer relationships and case studies now.

---

## Revenue Channel 10 — OpenClaw Revenue Engine (discovery only)

| Vertical | Find |
|---|---|
| Restaurants | New restaurants, reviews, influencers |
| Events | Organizers, sponsors, venues |
| Fashion | Models, designers, brands |
| Real Estate | Brokers, agencies, property managers |

**Revenue impact:** not direct — improves lead generation, sales pipeline, business acquisition.

🆕 **Compliance is mandatory (see §Compliance):** official APIs (Instagram Graph, Google Places, Meta) + public registries (RNT, Cámara de Comercio) + opt-in lead magnets only. **No scraping.** Monetizable spin-offs: influencer-discovery brokerage ($200–$1,000/campaign), market-intelligence reports ($500–$2,500).

---

## 🆕 Revenue Channel 11 — Nightlife (VIP & Guest List)

Highest AOV transaction in the early portfolio.

| Stream | Recommended | Worked example |
|---|---|---|
| VIP table fee | 10–15% of min spend | 12% × $1,000 table = **$120/booking** |
| Guest-list commission | $3–$8/head | 50 heads × $5 = $250/night |
| Sponsored placement | $99–$499/mo | "Tonight in Medellín" slot |
| Event promotion | $100–$800/event | DJ nights, openings |

**Example:** 30 VIP tables/month × $120 = **$3,600/month** from one revenue line.

---

## 🆕 Revenue Channel 12 — Cafés

Small budgets → keep cheap, high frequency, high margin.

| Stream | Recommended |
|---|---|
| Featured placement | $29–$99/mo |
| Loyalty (white-label WhatsApp punch-card) | $29–$79/mo |
| Pro café bundle | $49–$149/mo |
| AI promo blast (happy hour) | $19–$49/blast |

**Example:** 25 cafés × $60 avg = **$1,500/month** recurring.

---

## 🆕 Competitor Benchmarking (pricing justification)

| Competitor | Take / price | MDE position |
|---|---|---|
| Eventbrite | ~10% all-in tickets | 5% + $0.40 buyer-paid → cheaper |
| Viator / GetYourGuide | ~20–30% tours | 15–20% → win operators |
| Airbnb Experiences | ~20% | 15–18% |
| Booking.com | ~15–25% hotels | 10–15% direct deals |
| OpenTable | $149–$449/mo + cover fees | WhatsApp reservations, SMB-priced |
| Yelp | CPC ads | One AI answer that books |

**Read:** OTAs win on demand aggregation (15–30%); SaaS wins on workflow lock-in ($150–$450/mo); MDE's wedge is **combining operator AI tooling + demand origination** — a hybrid nobody runs in Medellín. Setting take *below* OTA norms is the supply-acquisition weapon.

---

## 🆕 Pricing & Commission Master Reference

| Line | Recommended |
|---|---|
| Ticket commission | 5% + $0.40, buyer-paid |
| Tours / experiences | 15–20% |
| Airport transfers | 15–20% |
| Nightlife VIP | 10–15% |
| Real-estate qualified lead | $30–$75 |
| Real-estate closed lease | 50% of first month |
| Restaurant retainer | $300–$1,200/mo |
| Featured listing | $29–$199/mo |
| Café bundle | $49–$149/mo |
| Business subscription | $49–$299/mo |
| Enterprise | $1k–$8k/mo |

---

## 🆕 Partnerships (scored: Priority = Revenue × Strategic value ÷ Effort)

| Partner | Revenue opportunity | Ease (1–5) | Priority |
|---|---|---|---|
| Stripe (Connect) | Enables take-rate + payouts | 5 | ⭐ 5 |
| WhatsApp Business API | Automation revenue + channel | 3 | ⭐ 5 |
| Hotels (El Poblado/Laureles) | Experience/transfer commissions | 3 | ⭐ 5 |
| Restaurants | Retainers + reservations + featured | 4 | ⭐ 5 |
| Event organizers | Ticket comm. + promo packages | 4 | ⭐ 5 |
| Tour operators / DMCs | 15–20% commission | 4 | ⭐ 4 |
| Expat / nomad communities | Rentals + experiences | 4 | ⭐ 4 |
| Google Maps / Places | Powers concierge + credits | 4 | 4 |
| OpenAI / Gemini / Claude | Startup credits cut COGS | 5 | 4 |
| Colombiamoda / designers | Sponsorships + credibility | 2 | 3 |
| Procolombia / Ruta N | Grants + ecosystem | 2 | 3 |

**First-90-days stack:** Stripe Connect + WhatsApp API + 5 hotels + 20 restaurants + 5 event organizers + 3 tour operators → unlocks every Stage-1 revenue line.

---

## 🆕 Lead Generation Engine

| Channel | Type | Est. CAC | Conv. | Note |
|---|---|---|---|---|
| Local + programmatic SEO | Organic | $10–$60 | 2–6% | One page per venue/tour/event |
| Instagram / TikTok | Social | $20–$80 | 1–3% | Dogfoods the AI-marketing product |
| Facebook expat/nomad groups | Social | $25–$70 | 2–4% | Medellín expat groups are gold |
| Hotel concierge desks | Partnership | rev-share | 10–25% | Warm, high-intent tourists |
| WhatsApp referral loops | Owned | very low | 5–15% | Built-in virality |
| AI-search (ChatGPT/Gemini, GEO) | AI | low | — | Optimize for citation |
| Paid (high-AOV only) | Paid | $40–$120 | — | Nightlife/real estate ROI only |

**Two funnels:** consumer (SEO/social → concierge → booking → re-engage) and business (free AI audit → call → subscription → transactions). **Cheapest CAC = dogfooding:** content MDE makes for itself proves the product and pulls the next client.

---

## 🆕 Financial Model & Unit Economics

**Formulas**
```
MRR = Σ(subs × price)   ARR = MRR × 12
LTV = (ARPA × GM%) ÷ monthly churn      LTV:CAC ≥ 3:1 healthy
CAC payback = CAC ÷ (ARPA_mo × GM%)     EBITDA = Gross profit − OpEx
```

**3-year scenarios (USD)**

| Metric | Yr1 Conservative | Yr2 Expected | Yr3 Aggressive |
|---|---|---|---|
| Paying clients (EoY) | 60 | 280 | 750 |
| Services/subscription rev | $150k | $760k | $2,400k |
| GMV | $250k | $1,800k | $7,500k |
| Take-rate rev (~12%) | $30k | $216k | $900k |
| Ads/sponsorship | $10k | $90k | $400k |
| **Total revenue** | **$190k** | **$1,066k** | **$3,700k** |
| Gross profit (78%) | $148k | $832k | $2,886k |
| OpEx | $180k | $620k | $1,700k |
| **EBITDA** | **−$32k** | **+$212k** | **+$1,186k** |

**Unit economics**

| Metric | Yr1 | Yr2 | Yr3 |
|---|---|---|---|
| ARPA/yr | $3,600 | $4,080 | $4,560 |
| Monthly churn | 6% | 5% | 4% |
| LTV | ~$3,900 | ~$5,304 | ~$7,410 |
| CAC | $250 | $200 | $180 |
| LTV:CAC | ~15:1 | ~27:1 | ~41:1 |
| CAC payback | ~1.1 mo | ~0.9 mo | ~0.7 mo |

> Economics are dominated by high-margin services MRR. **The #1 risk is churn, not CAC** — stress-test at 8–10% churn before quoting these ratios externally.

---

## 🆕 Compliance & Legal (do this before any outreach)

| Area | Requirement |
|---|---|
| **Data (Ley 1581/2012 Habeas Data)** | Publish privacy policy, register processing purpose, documented lawful basis per contact, support deletion |
| **WhatsApp** | Official Business API, opt-in only, approved templates, honor STOP |
| **OpenClaw / discovery** | Official APIs + public registries + opt-in only. **No scraping** (ToS bans, Meta litigation precedent) |
| **Payments** | Stripe Connect KYC for operator payouts; clear refund/dispute flows |
| **Reviews** | Solicit via post-visit WhatsApp ask — never generate fake reviews |

---

## 🆕 KPI Dashboard (instrument from day one)

| Metric | Why | Target |
|---|---|---|
| MRR / ARR | North star | grow MoM |
| Logo churn | Survival | < 5%/mo |
| NRR | Expansion health | > 110% |
| CAC by channel | Kill losers | payback < 3 mo |
| Audit → retainer rate | Supply funnel | track + improve |
| Concierge → booking rate | Demand funnel | track + improve |
| GMV + take-rate | Marketplace health | grow as Stage 2 opens |
| Gross margin | Model integrity | > 70% |

---

## 🆕 Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Marketplace liquidity never forms | Services-led revenue is liquidity-independent; transactions are upside |
| High retainer churn | Monthly ROI reports, automation, annual prepay |
| WhatsApp/Meta bans | Official API, opt-in, approved templates |
| Privacy (Ley 1581) | First-party + official APIs only; no scraping |
| Incumbent enters | Local depth, Spanish-first, WhatsApp-native, operator loyalty |
| Model COGS spikes | Multi-model routing, caching, startup credits |
| Over-scope | Strict sequencing; defer fashion to Yr2 |

---

## 🆕 Go-to-Market Beachhead

1. **Geography:** El Poblado + Laureles (dense, high-value, expat-facing).
2. **Wedge:** free AI audit → paid retainer. Land services, expand to marketplace.
3. **Distribution:** dogfood IG/TikTok content, expat Facebook groups, hotel concierge desks, programmatic SEO.
4. **Proof loop:** monthly ROI per client → testimonials → referrals.
5. **Vertical order:** restaurants → events → nightlife → real estate → tourism → fashion.

---

## 90-Day Plan

| Month | Focus | Goal |
|---|---|---|
| 1 | AI Agency + WhatsApp Automation | **$3,000 MRR** |
| 2 | + Real Estate Leads + Tourism Leads 🆕 + Nightlife VIP pilot | **$7,500 MRR** |
| 3 | + Event Tickets + Premium Listings 🆕 + Cafés | **$12,500 MRR** |

---

## Path to $10k/month

| Source | Revenue |
|---|---|
| AI Agency | $5,000 |
| WhatsApp | $2,000 |
| Real Estate | $2,000 |
| Premium Listings | $1,000 |
| **Total** | **$10,000/month** |

## Path to $50k/month

| Source | Revenue |
|---|---|
| Agency | $15,000 |
| SaaS | $10,000 |
| Real Estate | $10,000 |
| Tourism | $5,000 |
| Events | $5,000 |
| Listings | $5,000 |
| **Total** | **$50,000/month** |

## Path to $100k/month

| Source | Revenue |
|---|---|
| Agency | $20,000 |
| SaaS | $25,000 |
| Real Estate | $20,000 |
| Tourism | $10,000 |
| Events | $10,000 |
| Marketplace | $15,000 |
| **Total** | **$100,000/month** |

## 🆕 Path to $1M/year (~$83k/month)

Matches the **Yr2 "Expected"** P&L ($1.066M total revenue). Composition:

| Source | Monthly |
|---|---|
| Services MRR (agency + SaaS) | ~$45,000 |
| Take-rate (events/tours/nightlife/rentals) | ~$30,000 |
| Premium listings + ads/sponsorship | ~$8,000 |
| **Total** | **~$83,000/month → $1M/year** |

Driver: **retention (NRR > 110%) + GMV ramp**, not just new logos.

---

## Recommended Execution Order

**Phase 1 — Immediate Cash:** AI Agency · WhatsApp Automation · Restaurant Marketing
**Phase 2 — Lead Engine:** Real Estate Leads · Tourism Leads · Premium Listings · 🆕 Nightlife VIP · 🆕 Cafés
**Phase 3 — Marketplace:** Event Ticketing · Business Subscriptions · Stripe Connect
**Phase 4 — Scale:** Fashion Marketplace · Full Tourism Marketplace · Multi-city Expansion

---

## Highest ROI Right Now

| Opportunity | Score |
|---|---|
| AI Agency | 98/100 |
| WhatsApp Automation | 96/100 |
| Restaurant Marketing | 95/100 |
| Real Estate Leads | 94/100 |
| 🆕 Nightlife VIP | 93/100 |
| Tourism Experiences | 92/100 |

These channels can realistically get MDE AI to its first **$10k–$20k MRR** long before the larger marketplace and ticketing ecosystem reaches scale.

---

## The one decision that matters most

> **Do not build the marketplace first. Build the AI agency first.** It funds the company, acquires the supply for free, proves the product, and de-risks the marketplace — which then compounds underneath it. Every channel above serves that single sequencing decision.

> _v2 — revisit quarterly; replace benchmark estimates with signed-partner actuals._
