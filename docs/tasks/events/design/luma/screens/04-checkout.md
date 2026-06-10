---
screen: Checkout
screenshots: [Events-pay.png]
route: Stripe Checkout + BookingCheckoutModal
persona: Andrés
mdeai_status: live
linear: SAN-248
---

# Wireframe — Luma Checkout / Pay

## Goals

Frictionless pay; clear tier + total; trust signals.

## ASCII — mdeai flow

```text
Event detail
    │
    ▼
┌─────────────────────────┐
│ BookingCheckoutModal    │
│ Tier: GA · qty 1        │
│ Total: $25 + fees       │
│ [Continue to Stripe]    │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│ Stripe Hosted Checkout  │  ← Events-pay.png pattern
│ Card · Apple Pay        │
│ Order summary           │
│ [Pay $27.50]            │
└─────────────────────────┘
    │
    ▼
/me/tickets — confirmation + QR
```

## Component inventory

| Component | Type | Purpose |
|-----------|------|---------|
| BookingCheckoutModal | domain | Tier/qty summary |
| Stripe embedded/hosted | external | Payment |
| OrderConfirmation | page | Success redirect |

## States

| State | Behavior |
|-------|----------|
| Default | Modal open |
| Processing | Disable CTA |
| Success | Redirect wallet |
| Payment failed | Stripe error surface |

## mdeai mapping

**LIVE:** checkout API + modal. Luma parity on UX — ensure mobile modal doesn’t cover tier info.

## Wireframe prompt

Attach `Events-pay.png` — document field order vs Stripe hosted page.
