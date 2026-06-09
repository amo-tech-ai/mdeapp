---
id: OVL-002
title: Ticket checkout modal
route: overlay on /events/[slug]
status: Live
linear: SAN-237
persona: andres
updated: 2026-06-08
implementation:
  component: mdeapp/src/components/modals/booking-checkout-modal.tsx
  api: POST /api/tickets/checkout
---

# OVL-002 — Booking checkout modal

## Purpose

Collect buyer name/email, quantity, submit Stripe Checkout session for event tier.

## Persona example

Andrés picks *General Admission* → modal → Continue to Stripe → returns to event with wallet link.

## Components

`BookingCheckoutModal`, `BookingCheckoutForm`, `useModalA11y`, `submitTicketCheckout`

## UI states

| State | testId |
|-------|--------|
| Form | default |
| Submitting | disabled submit |
| Error network | `booking-checkout-error` |
| Error validation | inline |

## Accessibility

- Focus trap via `useModalA11y`
- `role="alert"` on errors
- Close on Escape

## Mobile

Full-width modal; safe-area padding on bottom

## Gaps

- Prod paid ticket proof (EVP-001 / G1)
- Auth optional — guest checkout supported?

## Acceptance

- [x] Modal opens from tier + mobile bar
- [x] Error classification (network vs API)
- [ ] E2E Stripe test mode proof on prod
