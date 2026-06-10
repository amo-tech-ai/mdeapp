---
title: "Part 10 — Marketplace Expansion"
updated: 2026-06-06
parent: ./00-INDEX.md
phase: 3+
note: aligns to existing COMM track (Medusa + mdeai AI commerce)
---

# Part 10 — Marketplace Expansion

Phase 3+ — after supply + B2B are proven. Aligns to the existing `COMM` commerce track (Medusa). Don't build early.

## Vendor categories

| Group | Vendors | Booking type | Revenue |
|---|---|---|---|
| **Vendors (goods)** | Fashion · Food · Merchandise | product order | commission + sub |
| **Experiences** | Activities · classes · tastings | timed booking | commission |
| **Services** | local services | quote/booking | commission |
| **Event services** | Photographers · DJs · Decorators · Security · Catering | event booking | commission |
| **Tourism services** | Guides · Transportation · Activities | booking | commission/affiliate |

## Marketplace architecture

```mermaid
flowchart TD
  U["User / Event host needs a service"] --> AI["AI concierge"]
  AI --> CAT["Marketplace catalog (Supabase + Medusa)"]
  CAT --> MATCH["Match vendors by type · date · budget · area"]
  MATCH --> QUOTE["Request quote / instant book"]
  QUOTE --> PAY["Stripe (escrow optional)"]
  PAY --> DELIV["Service delivered"]
  DELIV --> REV["Review + payout split"]
  REV --> VDASH["Vendor dashboard"]
```

## Event-services bundle (high-value tie-in)

```mermaid
flowchart LR
  HOST["Event host publishes"] --> NEED["Needs DJ · photographer · catering"]
  NEED --> AI["AI suggests vendor bundle"]
  AI --> BOOK["Book vendors in one flow"]
  BOOK --> COMM["Commission per vendor → mdeai"]
  BOOK --> EVENT["Better event → more tickets"]
```

## Build notes
- Sits on existing COMM/Medusa track — reuse, don't rebuild a cart.
- Entry wedge = **event services** (DJs/photographers/catering) because event hosts are already on-platform and have budget.
- Keep AI as the matcher/concierge, not a new browse UI at first.
