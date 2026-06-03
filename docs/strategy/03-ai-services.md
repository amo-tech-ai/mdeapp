# Chunk 03 — AI Services (first & fastest revenue)

> Goal: the highest-margin, fastest-to-cash, most defensible line. Same stack as the product (Mastra, Gemini/OpenAI/Claude, WhatsApp, Supabase, pgvector) → near-zero marginal delivery cost. The agency relationship *is* the marketplace supply-acquisition channel.

## 3.1 Service catalogue

| Service | What it does | Setup | **MRR** | Margin | Delivery (automation %) |
|---|---|---|---|---|---|
| Instagram growth + content | AI captions, cadence, hashtag/sound strategy | $150–$500 | **$199–$799** | 80–90% | High |
| Content generation engine | Photos→posts, menus→carousels, video scripts | $100–$300 | **$149–$599** | 85%+ | High |
| Local SEO / Google Business | Profile, posts, Q&A, reviews | $150–$400 | **$149–$499** | 85%+ | Med-High |
| Review management | AI-drafted replies, sentiment alerts | $50–$150 | **$99–$299** | 85%+ | High |
| WhatsApp automation | Booking bot, FAQ, broadcast | $200–$800 | **$149–$699** | 80–90% | High |
| Customer support agent | 24/7 AI concierge for the business | $300–$1,000 | **$199–$899** | 80%+ | High |
| Lead qualification agent | Scores/routes inbound, books callbacks | $300–$1,000 | **$199–$799** | 80%+ | High |
| Booking automation | End-to-end reservation/checkout | $300–$1,200 | **$149–$699** | 80%+ | High |

## 3.2 Packaging — sell bundles, not à la carte

| Package | Includes | Setup | **MRR** | Target | COGS/mo (est.) | GP/mo |
|---|---|---|---|---|---|---|
| **Starter** | Listing + 1 content channel + reviews | $150 | **$249** | Cafés, small restaurants | ~$30 | ~$219 |
| **Growth** | + WhatsApp automation + SEO + analytics | $400 | **$699** | Restaurants, agents, tour ops | ~$90 | ~$609 |
| **Pro Agency** | + support agent + lead qual + paid mgmt | $900 | **$1,499** | Multi-location, nightlife, RE teams | ~$220 | ~$1,279 |
| **Enterprise** | Custom agents, API, white-label, SLA | $3k–$15k | **$2,500–$8,000** | Hotel groups, Colombiamoda, chains | varies | 75%+ |

> COGS = model/API + WhatsApp/messaging + media + light human QA. Routing across Gemini (cheap default) / OpenAI / Claude keeps it variable; cache aggressively.

## 3.3 Why this is the wedge

| Property | Why it matters |
|---|---|
| 80–90% gross margin | Funds everything else |
| MRR, not one-off | Predictable, fundable, compounding |
| No liquidity required | Revenue from day one, unlike marketplace |
| Same buyer as marketplace supply | One sale → client *and* future listing/transaction supply |
| Dogfoods the product | Content MDE makes for itself proves the product and pulls the next client |

## 3.4 Delivery model (keep margin high)

```
Intake (free AI audit) → onboarding wizard → AI generates assets →
human QA (15 min/client/week) → publish via WhatsApp/IG/GBP →
monthly ROI report (auto-generated) → renewal/upsell
```

- Target **< 1 hour human time per client per week** at Starter/Growth.
- Monthly ROI report is the retention weapon — automate it from Supabase analytics.
- Annual prepay (2 months free) to crush churn and pull cash forward.

## 3.5 OpenClaw / Instagram Intelligence — compliant lead discovery

**Goal:** discover & qualify businesses, influencers, restaurants, events, and talent as inbound for both marketplace supply and agency clients — legally.

### Allowed (do this)

| Approach | Why safe |
|---|---|
| Official APIs (Instagram Graph, Google Places, Meta Graph) | ToS-compliant, consented |
| Public registries (RNT tourism, Cámara de Comercio), directories | Public records |
| Opt-in lead magnets (free audit, "claim your listing") | First-party consent |
| Partner data shares (hotels, universities, Colombiamoda) | Contractual |
| Manual BD outreach w/ documented opt-out | Standard B2B |

### Prohibited (do not)

| Approach | Risk |
|---|---|
| Scraping IG/Google vs ToS | Bans, Meta litigation precedent |
| Storing personal data w/o lawful basis | **Ley 1581/2012 (Habeas Data)** |
| Cold-blasting scraped numbers on WhatsApp | WhatsApp ban + anti-spam liability |
| Buying scraped lists | Unknowable consent/provenance |

### Revenue from compliant intelligence

| Use | Revenue |
|---|---|
| Feed qualified leads into MDE agency pipeline | Lowers internal CAC |
| Influencer discovery service for brands | $200–$1,000/campaign brokerage |
| Market-intelligence reports (venue/event landscape) | $500–$2,500/report |
| Talent/contestant sourcing (fashion/events) | Placement fee or sponsorship |

### Compliance checklist (build once)

- [ ] Publish Habeas-Data-compliant privacy policy; register processing purpose.
- [ ] WhatsApp: official Business API, opt-in only, approved templates, honor STOP.
- [ ] Documented lawful basis per contact; support deletion requests.
- [ ] Default to first-party + official-API + partner data; scraping is out of bounds.

## 3.6 First-90-days service plan

| Week | Action | Target |
|---|---|---|
| 1–2 | Publish 3 packages + pricing; build free-audit lead magnet | Live |
| 3–4 | Close first 5 retainers (warm El Poblado/Laureles list) | **$2.5–4k MRR** |
| 5–8 | Case studies + referral asks; reach 15 retainers | **$8–10k MRR** |
| 9–12 | Add lead-qual + support-agent upsells | Expansion revenue |
