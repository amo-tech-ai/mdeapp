# MVP proof ledger

**Date:** 2026-06-09  
**Owner issue:** [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) AIE-001  
**Evidence root:** `tasks/testing/evidence/YYYY-MM-DD/aie-001-ledger.md`

---

## Ledger table

| Gate | Persona | Proof statement | Key SAN | Status | Evidence file |
|------|---------|-----------------|---------|--------|---------------|
| **G1** | Andrés | Paid ticket on prod → QR in `/me/tickets` | SAN-178 | ⏳ Todo | — |
| **G2** | Camila | Chat query → cards + pins (4 verticals prod) | SAN-546, SAN-733 | ⏳ Partial | SAN-733 PR #134 |
| **G3** | Roberto | Host publish event visible on prod | SAN-366 | ✅ Done | PR #64–66 |

**Ledger close:** SAN-115 → Done when G1 + G2 + G3 rows have evidence paths filled.

---

## G1 — Andrés (payment)

| Step | Command / action | Expected | Done |
|------|------------------|----------|------|
| 1 | Navigate `https://www.mdeai.co/events` | Event list loads | ☐ |
| 2 | Select event with paid tier | Buy CTA visible | ☐ |
| 3 | Complete Stripe test checkout | Payment succeeds | ☐ |
| 4 | Open `/me/tickets` | QR code visible | ☐ |
| 5 | Attach screenshot + order ID to SAN-178 | Linear comment | ☐ |

---

## G2 — Camila (discovery)

| Vertical | Prompt | Assert | SAN | Done |
|----------|--------|--------|-----|------|
| Events | `salsa events this weekend in Medellín` | ≥1 event-card + pin | SAN-387/546 | ☐ |
| Restaurants | `quiet rooftop dinner in Provenza` | ≥1 restaurant-card | SAN-546 | ☐ |
| Cafés | `quiet specialty coffee in Laureles` | ≥1 grounded-card cafe | SAN-368/546 | ☐ |
| Rentals | `1BR in Laureles under $80/night` | ≥1 rental-card | SAN-823/546 | ☐ |

**Handoff:** SAN-733 `/` → `/chat?q=` ✅

---

## G3 — Roberto (publish)

| Step | Action | Expected | Done |
|------|--------|----------|------|
| 1 | `/host/event/new` on prod | Wizard loads | ✅ |
| 2 | Complete HITL publish | Event live | ✅ |
| 3 | `/host/events` | Event listed | ✅ |
| 4 | Public `/events/[slug]` | Visible to Andrés | ✅ |

Evidence: SAN-366 completion 2026-06-04.

---

## Cycle 1 priority (proof order)

```text
1. SAN-178 — G1 (hard blocker)
2. SAN-546 — G2 matrix
3. SAN-548 — F13 quality
4. SAN-823 — rentals fast-path
5. SAN-115 — close ledger
```

---

## References

- [`launch-blocker-verification.md`](./launch-blocker-verification.md)
- [`mvp-proof-audit.md`](./mvp-proof-audit.md)
- [`LAUNCH-READINESS-2026-06-08.md`](./LAUNCH-READINESS-2026-06-08.md)
