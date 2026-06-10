# SAN-178 · PAY-001 — Live ticket purchase on production

**Date:** 2026-06-09  
**Linear:** [SAN-178](https://linear.app/sanjiovani/issue/SAN-178/pay-001-live-ticket-purchase-on-production)  
**Persona:** Andrés — paid ticket on mdeai.co → QR at door  
**Verdict:** 🟡 **PARTIAL PASS** — full prod checkout→paid→QR path works; Stripe is **test mode** on prod (`cs_test_*`), not live charges.

---

## Journey (prod)

| Step | Result | Evidence |
|------|--------|----------|
| Event detail loads | 🟢 200 | `https://www.mdeai.co/events/reina-de-antioquia-2026-finals` |
| Buy GA modal | 🟢 | Name + email → Pay with Stripe |
| Stripe Checkout | 🟢 | Session `cs_test_a1QOBJrWOVNNi9IUdw1gNaYc7vGivtWytKALXDVZMmB8T5M6QIVx0TvQxN` |
| Return URL | 🟢 | `?checkout=success&session_id=cs_test_…` |
| Order row | 🟢 **paid** | `event_orders.id` `5edf83dc-b43c-4552-a834-263c0a6c3375` |
| Attendee row | 🟢 **active** | `event_attendees.id` `5c3041b4-9669-4ab5-adb1-afa9d0c3db8b` |
| QR wallet | 🟢 | `/me/tickets/{orderId}?token=…` — QR renders |
| Screenshot | 🟢 | [`SAN-178-prod-ticket-qr.png`](./SAN-178-prod-ticket-qr.png) |

**Buyer:** `andres-g1-proof+san178@mdeai.co` · **Order:** `MDE-6482852E4F` · **Tier:** GA · **Total:** COP 40,000

---

## Supabase proof (live)

```sql
-- event_orders (paid)
id: 5edf83dc-b43c-4552-a834-263c0a6c3375
status: paid
stripe_session_id: cs_test_a1QOBJrWOVNNi9IUdw1gNaYc7vGivtWytKALXDVZMmB8T5M6QIVx0TvQxN
buyer_email: andres-g1-proof+san178@mdeai.co

-- event_attendees (1)
id: 5c3041b4-9669-4ab5-adb1-afa9d0c3db8b
status: active
qr_token: present (JWT)
```

---

## Blockers / caveats

| Item | Severity | Note |
|------|----------|------|
| **Stripe test keys on prod** | 🔴 for “live” G1 | Checkout URL is `cs_test_*` — Andrés cannot pay real COP until Vercel `STRIPE_*` switched to live |
| Check-in scan | ⚪ not run | QR displayed; staff `/staff/check-in` not exercised this session |
| `/me/tickets` auth list | ⚪ | Token wallet path works without login; logged-in list not tested |

---

## Unblocks

- **SAN-115 · AIE-001** — G1 commerce section can cite this evidence **with test-mode caveat**
- **SAN-857 · AIE-025** — still blocked on SAN-115 ledger sign-off

---

## Remaining for full G1 close

1. Flip Vercel Stripe env to **live** (or document intentional test-mode prod)
2. Repeat purchase with live `cs_live_*` session OR human sign-off that test-mode prod is acceptable for launch ledger
3. Optional: staff check-in scan proof
