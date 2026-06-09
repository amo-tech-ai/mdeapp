---
title: "Commerce & Payments Architecture"
updated: 2026-06-06
parent: ./00-INDEX.md
note: builds on live Stripe ticketing; expands ../07-revenue.md
---

# Commerce & Payments (Part 10)

All money on **Stripe** (live for tickets). Revenue types unified; HITL on partner-initiated charges.

## Revenue types

| Type | Payer | Model | Status |
|---|---|---|---|
| Subscription fees | partner | recurring $/mo (Growth/Pro) | new |
| Lead fees | partner | per qualified lead | live path |
| Ticket fees | consumer | % per ticket | **live** |
| Booking fees | consumer | % / flat per booking | new |
| Marketplace fees | consumer | % of vendor sale | P3 |
| Sponsored placements | sponsor | flat / performance | new |
| AI service packages | partner | $/mo add-on | new |
| White-label services | B2B | contract | P4 |

## Consumer payment flow (live)

```mermaid
flowchart LR
  C["Consumer"] --> CO["Checkout (Stripe)"]
  CO --> CAP["Capture"]
  CAP --> WH["Webhook → finalize order"]
  WH --> SPLIT{"Split"}
  SPLIT -- payout --> P["Partner"]
  SPLIT -- fee --> M["mdeai"]
  WH --> FUL["Fulfill: ticket+QR / booking confirm"]
```

## Partner payment flow (subscriptions + AI packages)

```mermaid
flowchart LR
  P["Partner"] --> PICK["Pick plan / AI package (signup or dashboard)"]
  PICK --> SUB["Stripe subscription"]
  SUB --> ENT["Entitlements unlock<br/>services · automations · featured"]
  ENT --> USE["Partner uses services"]
  USE --> RENEW{"Renew?"}
  RENEW -- yes --> SUB
  RENEW -- churn --> WINBACK["Win-back automation"]
```

## Platform revenue flow (consolidated)

```mermaid
flowchart TD
  TKT["Ticket/booking fees"] --> LEDGER["Revenue ledger"]
  LEAD["Lead fees"] --> LEDGER
  SUBS["Subscriptions + AI packages"] --> LEDGER
  SPON["Sponsorships"] --> LEDGER
  MKT["Marketplace fees (P3)"] --> LEDGER
  LEDGER --> PAYOUT["Partner payouts (Stripe Connect)"]
  LEDGER --> REPORT["Revenue dashboard + invoices"]
  LEDGER --> REINVEST["Reinvest → demand"]
```

## Notes
- **Reuse the live ticket rail** (Stripe + webhook finalize); add subscriptions + Connect payouts on top.
- **HITL** on partner-initiated charges; idempotent webhooks (existing pattern).
- Edge-function isolation for webhooks (service-role only there, per F13).
- Full stream table + flow detail: `../07-revenue.md`.
