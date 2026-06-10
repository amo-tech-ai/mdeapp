# MVP proof audit

**Date:** 2026-06-09  
**North star:** Camila search+cards+pins · Andrés ticket purchase · Roberto event publish  
**Ledger:** SAN-115 AIE-001 · **Companion:** [`mvp-proof-ledger.md`](./mvp-proof-ledger.md)

---

## Verdict

| Persona | Proof required | Status | Evidence |
|---------|----------------|--------|----------|
| **Camila** | Chat → cards + map pins (4 verticals) | 🟡 Partial | SAN-733 Done · SAN-546 open |
| **Andrés** | Live Stripe ticket → QR `/me/tickets` | 🔴 **Unproven** | SAN-178 Todo |
| **Roberto** | Host publish on prod | 🟢 **Proven** | SAN-366 Done PR #64–66 |

**MVP exit:** **1/3 proofs complete** — cannot import Revenue R2+ or declare launch-ready.

---

## Camila — discovery proof (G2)

| Check | SAN | Status | Proof path |
|-------|-----|--------|------------|
| Home → `/chat?q=` | SAN-733 | ✅ Done | PR #134 |
| Events cards in chat | SAN-387 | In Review | PR #38 blocked SAN-462 |
| Rentals fast-path | SAN-823 | Todo | CHAT sprint |
| Event pins ≥95% | SAN-824 | Todo | Blocked SAN-828 |
| Prod 4-vertical matrix | SAN-546 | Todo | `tasks/testing/evidence/` |
| Thread persistence | SAN-548 | In Progress | F13 cold-start |
| Rental embed 403 | SAN-545 | Todo | Hybrid search degraded |

**Pass when:** SAN-546 prod matrix PASS + CHAT sprint SAN-831 exit.

---

## Andrés — payment proof (G1)

| Check | SAN | Status | Proof path |
|-------|-----|--------|------------|
| Live ticket purchase | **SAN-178** PAY-001 | 🔴 Todo | Real Stripe on mdeai.co |
| Checkout decline/3DS | SAN-715 | Done | — |
| Webhook finalize | SAN-116 | Done | — |
| QR in wallet | SAN-259 UIX-031 | In Review | UI ready — payment path not proven |
| Waitlist (secondary) | SAN-841 | Backlog | Post-MVP |

**Pass when:** Buy ticket on prod → QR visible in `/me/tickets` → evidence on SAN-178.

---

## Roberto — publish proof (G3)

| Check | SAN | Status | Proof path |
|-------|-----|--------|------------|
| Host publish prod | **SAN-366** EVT-002 | ✅ Done | 2026-06-04 |
| Host events list | SAN-118 | Done | `/host/events` |
| Wizard HITL | EVP-010 | Live | `/host/event/new` |
| Venue autocomplete | SAN-104 MAP-010 | Todo | Polish only |

**Pass when:** ✅ Already met — attach screenshot row to SAN-115 ledger.

---

## Launch-critical proof checklist

- [ ] SAN-178 prod Stripe purchase evidence
- [ ] SAN-546 prod journey matrix (events · restaurants · cafés · rentals)
- [ ] SAN-366 G3 screenshot in SAN-115 ledger
- [ ] `chat-smoke.mjs` prod PASS documented
- [ ] `e2e/home-to-chat.spec.ts` 7/7 PASS (SAN-831)
- [ ] Launch readiness ≥ 9.0

---

## Do not require for MVP exit

| Track | Why |
|-------|-----|
| VEB-001…018 | Event-venue booking — post north-star |
| OpenClaw OCL-* | Automation — Phase 2 |
| Revenue R2–R5 | Gated on G1 |
| AIE-000 pack | Advanced Events OS |
| Intelligence MIS/VEC | Post-MVP |

See [`launch-scope-freeze.md`](./launch-scope-freeze.md).
