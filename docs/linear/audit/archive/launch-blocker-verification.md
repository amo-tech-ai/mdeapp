# Launch blocker verification — MVP exit path

**Date:** 2026-06-09  
**Cycle:** 1 · Jun 8–22, 2026  
**North star:** Camila cards + pins · **Andrés paid ticket** · **Roberto host publish** @ mdeai.co  
**Source:** Linear API + [`LAUNCH-READINESS-2026-06-08.md`](./LAUNCH-READINESS-2026-06-08.md) + [`markdown/CHAT.md`](../markdown/CHAT.md)

---

## Verdict

| Persona | Exit proof | Linear status | Launch-ready? |
|---------|------------|---------------|---------------|
| **Andrés** | G1 — live Stripe ticket → QR in `/me/tickets` | SAN-178 **Todo** | 🔴 **Hard blocker** |
| **Roberto** | G3 — host publish on prod | SAN-366 **Done** | 🟢 Proof shipped |
| **Camila** | G2 — discovery chat → cards + pins | SAN-733 **Done** · sprint open | 🟡 **Soft blockers** remain |

**MVP ledger:** [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) AIE-001 stays **Todo** until G1 + G2 + G3 evidence filed.

---

## Exit sequence (canonical)

```text
SAN-178 PAY-001 (Andrés G1)
  → SAN-546 OPS-JOURNEY G2 (Camila prod matrix)
  → SAN-115 AIE-001 ledger close
Parallel quality (not ledger gates):
  SAN-548 F13 · SAN-823 · SAN-824 · SAN-368 MAP-002B
Post-launch / parallel track:
  VEB-001…018 (Roberto event-venue booking — NOT launch gate)
```

---

## Persona 1 — Andrés (payment proof)

| Step | Linear | Status | Notes |
|------|--------|--------|-------|
| Buy ticket on prod | **SAN-178** PAY-001 | Todo · Urgent · `phase:launch` | **#1 P0** — blocks SAN-115 G1 |
| Checkout states | SAN-715 | Done | Decline/3DS/wallet covered |
| Webhook isolation | SAN-116 | Done | Stripe finalize path |
| Event browse API | SAN-586 | Done | `/events` list |
| Waitlist (secondary) | SAN-841 | Backlog | Andrés lead capture — post-MVP nice |

**Action:** Run real Stripe test checkout on `https://www.mdeai.co` → confirm QR in `/me/tickets` → attach evidence to SAN-178.

---

## Persona 2 — Roberto (host publish)

| Step | Linear | Status | Notes |
|------|--------|--------|-------|
| Host publish prod proof | **SAN-366** EVT-002 | **Done** · PR #64–66 | G3 north-star met |
| Host events list | SAN-118 | Done | `/host/events` on main |
| Host wizard | EVP-010 / SCREEN-016 | Live | `preview_and_publish` HITL |
| MAP-010 autocomplete | SAN-104 | Todo | Venue pick in wizard — polish |
| **VEB-009** venue step | SAN-500 | Todo | **Post-launch** — blocked SAN-497 |

**Action:** None for launch — capture G3 screenshot row in SAN-115 ledger. VEB track does **not** block Roberto publish.

---

## Persona 3 — Camila (discovery)

| Step | Linear | Status | Notes |
|------|--------|--------|-------|
| Home → `/chat?q=` handoff | **SAN-733** | **Done** · PR #134 | US-C1 ✅ |
| Rentals fast-path | **SAN-823** | Todo · CHAT sprint | US-C2 — `apartments in laureles` |
| Event pin coverage ≥95% | **SAN-824** | Todo · blocked SAN-828 | US-A1 — Andrés map pins |
| Thread persistence | **SAN-548** F13 | **In Progress** | Turn 11 after cold-start |
| Prod journey matrix | **SAN-546** OPS-JOURNEY | Todo | G2 evidence for SAN-115 |
| Rental embed 403 | SAN-545 DATA-EMBED | Todo | Hybrid search degraded |
| ADK grounding prod | SAN-368 MAP-002B | In Progress | Café/rental quality |
| CHAT sprint exit | **SAN-831** | Todo | Epic SAN-822 children |

**Action:** Close SAN-546 prod matrix (4 verticals) → unblocks SAN-115 G2. Prioritize SAN-823 + SAN-548 in Cycle 1.

---

## Active queue vs launch (filtered)

### Hard blockers (must close for MVP exit)

| Priority | SAN | Title | phase:launch |
|----------|-----|-------|--------------|
| P0 | **178** | PAY-001 live ticket purchase | ✅ |
| P0 | **115** | AIE-001 proof ledger | ✅ |
| P0 | **546** | OPS-JOURNEY prod matrix | ✅ |

### In flight (Cycle 1 — quality, not ledger)

| SAN | Title | Status |
|-----|-------|--------|
| 548 | F13 thread persistence | In Progress |
| 368 | MAP-002B ADK prod | In Progress |
| 823 | Rentals fast-path | Todo |
| 824 | Event pin coverage | Todo |
| 545 | DATA-EMBED 403 fix | Todo |

### Explicitly NOT launch blockers

| Track | Why |
|-------|-----|
| VEB-001…018 (SAN-492–509) | Event-venue **booking** — post north-star |
| Revenue R2–R5 import | Gated on SAN-178 |
| GS-005…009 reopen | Post-MVP grounding |
| SAN-850–854 AI insights | Post-MVP filings |

---

## SAN-115 ledger checklist

| Proof | Persona | Gate issue | Status |
|-------|---------|------------|--------|
| **G1** paid ticket | Andrés | SAN-178 | ⏳ Todo |
| **G2** discovery chat | Camila | SAN-546 + CHAT sprint | ⏳ partial (733 Done) |
| **G3** host publish | Roberto | SAN-366 | ✅ Done |

**Evidence path:** `tasks/testing/evidence/YYYY-MM-DD/aie-001-ledger.md`

---

## Recommended next 5 (Cycle 1)

1. **SAN-178** — Prod Stripe ticket purchase proof  
2. **SAN-546** — Prod journey matrix (events · restaurants · cafés · rentals)  
3. **SAN-548** — F13 cold-start turn-11 evidence  
4. **SAN-823** — Rental pattern fast-path (CHAT sprint #1)  
5. **SAN-545** — Fix rental embed 403 for hybrid search  

---

## References

- CHAT sprint: [`markdown/CHAT.md`](../markdown/CHAT.md)
- Revenue gate: [`markdown/revenue.md`](../markdown/revenue.md) (SAN-178, 115, 368)
- VEB track: [`veb-import-plan.md`](./veb-import-plan.md) — parallel, not launch
- Prior audit: [`LAUNCH-READINESS-2026-06-08.md`](./LAUNCH-READINESS-2026-06-08.md)
