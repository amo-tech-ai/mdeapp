# Chunk 04 — Marketplace Strategy

> Goal: decide who pays, how, and in what sequence — without falling into the "lots of users, no revenue" trap.

## 4.1 Who pays?

| Actor | Pays for | WTP | Priority |
|---|---|---|---|
| **Businesses** (restaurants, venues, agents) | Leads, marketing, listings, subs | **High** (revenue-linked) | ⭐ 1 |
| **Event organizers** | Tickets, promotion, sponsorship | **High** | ⭐ 1 |
| **Vendors** (tours, fashion, transport) | Commission, featured placement | Med-High | 2 |
| **Advertisers / brands** | Sponsored placement, campaigns | Med-High | 2 |
| **Customers** (tourists, expats, locals) | Convenience fee (small), premium concierge | Low-Med | 3 |

**Rule:** charge the side that makes money from the transaction (supply). Keep the consumer side frictionless to build liquidity.

## 4.2 Three pricing architectures

| Model | How | Pros | Cons | Best for |
|---|---|---|---|---|
| **Transaction fee (take-rate)** | % per booking/ticket | Scales with GMV, no upfront friction | Needs liquidity to matter; lumpy | Tours, tickets, nightlife, rentals |
| **Subscription** | Flat monthly per business | Predictable MRR, sell before liquidity | Churn if value not felt | Marketing, listings, agent tools |
| **Hybrid** | Low/zero base sub + transaction fee + paid placement | Revenue before *and* after liquidity; multiple expansion levers | More to communicate | **MDE** |

## 4.3 Recommended: Hybrid, subscription-led

```
Stage 1 (0–6 mo):  Subscriptions + AI services dominate    → revenue WITHOUT liquidity
Stage 2 (6–18 mo): Add transaction fees as bookings grow   → revenue WITH liquidity
Stage 3 (18 mo+):  Add ads/sponsorship + take-rate at scale → margin expansion
```

### Why subscription-led for a startup

| Problem with take-rate-only | How sub-led fixes it |
|---|---|
| No GMV early → ~$0 revenue for months | Subscriptions/retainers bill from week 3 |
| Chicken-and-egg liquidity | Supply joins for *tools*, not just demand |
| Lumpy, seasonal cash | Predictable MRR smooths runway |
| Hard to forecast/fundraise | MRR is a clean north-star metric |

## 4.4 The cold-start solution (Medellín specifics)

| Side | Cold-start tactic |
|---|---|
| **Supply** | Sell AI services first → businesses onboard for tooling; listing is a byproduct. Pre-seed inventory from public/partner data (Places API, hotel desks). |
| **Demand** | Free concierge + programmatic SEO + expat/nomad Facebook groups + hotel concierge desks. |
| **Single-player value** | Each side must get value with zero other-side activity: businesses get marketing ROI; consumers get a useful AI guide — even before liquidity. |

> **Single-player mode is the moat.** If a restaurant gets ROI from MDE's marketing even with zero MDE-driven bookings yet, supply never churns waiting for demand — and that's what kills most marketplaces.

## 4.5 Payments & payouts architecture (Stripe Connect)

| Need | Stripe primitive |
|---|---|
| Collect ticket/booking from consumer | Checkout / Payment Intents |
| Split take-rate, pay operator | Connect (destination charges / transfers) |
| Recurring subscriptions | Billing |
| Multi-party (guide + venue + MDE) | Connect transfers |
| Refunds / disputes | Standard Stripe flows |

- Operators onboard as **Connect accounts**; MDE takes its fee as an application fee on each charge.
- Subscriptions on **Stripe Billing**; dunning to control involuntary churn.

## 4.6 Take-rate guardrails

| Vertical | Launch take | Ceiling (don't exceed early) | Rationale |
|---|---|---|---|
| Tickets | 5% + $0.40 | 8% all-in | Buyer-paid, undercut Eventbrite |
| Tours/experiences | 15–20% | 22% | Leave operators whole vs Viator |
| Nightlife VIP | 10–15% | 18% | High AOV absorbs it |
| Rentals (mid-term) | 8–12% or 50% first month | — | Match local agency norms |
| Hotels | 10–15% | — | Below Booking to win direct deals |

> Setting take *below* OTA norms is the supply-acquisition weapon — combined with AI tooling no incumbent offers locally, operators have every reason to switch.
