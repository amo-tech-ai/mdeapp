# Launch scope freeze

**Date:** 2026-06-09  
**Purpose:** Prevent MVP scope creep before exit · Align with Events PRD guardrails

---

## ALLOWED — Cycle 1 execution (Track A + B)

### Track A — MVP exit (must ship)

| SAN | Persona | Proof |
|-----|---------|-------|
| **SAN-178** PAY-001 | Andrés | Live ticket purchase |
| **SAN-546** OPS-JOURNEY | Camila | Prod journey matrix |
| **SAN-115** AIE-001 | All | Ledger close |

### Track B — UI momentum (parallel)

| SAN | Persona | Why allowed |
|-----|---------|-------------|
| **SAN-730** AIE-002 | Roberto | Host nav rail — no new AI |
| **SAN-731** UI-004 | Andrés/Tourist | Event detail skeleton + a11y |
| **SAN-135** AIE-024 | Andrés | Luma detail Phase A — conversion |

### Track A support (quality, not new scope)

| SAN / pack | Persona | Why keep |
|------------|---------|----------|
| **SAN-368** MAP-002B | Camila | ADK prod grounding |
| **SAN-733** | Camila | Home handoff Done |
| **SAN-548** F13 | Camila | Thread persistence |
| **SAN-822–831** CHAT sprint | Camila | Discovery polish |
| **SAN-366** EVT-002 | Roberto | G3 Done |
| **EVP core** (wizard, publish) | Roberto | Live |
| **SAN-478/479** REAL-011/012 | Camila | `/rentals` P0 |
| **SAN-545** DATA-EMBED | Camila | Rental hybrid fix |
| **Core payments** SAN-116, 715 | Andrés | Stripe spine Done |

---

## FROZEN — do not pull into Cycle 1

| Pack | Approx count | Gate |
|------|-------------:|------|
| **OpenClaw** | 40+ | Phase 2 |
| **Sponsors** / GS-009 | 1+ | Events PRD defer |
| **Revenue R2+** | 32 | SAN-178 Done |
| **Advanced Intelligence** | 20+ | `phase:intel-*` |
| **Admin CRM** | W8 | Patricia |
| **Recommendation engine** | MIS/VEC | Post-MVP |
| **AIE-000 pack** (except 730/135) | SAN-757+ | Advanced Events OS |
| **VEB-001…018** | 18 | Post north-star |
| **Vector expansion** | 7 | Post-MVP |
| **New trackers / imports** | — | After MVP exit |

---

## FREEZE rules (enforce in Linear)

1. No new `phase:mvp` issues without `phase:launch` or persona P0 justification
2. No import of Revenue R2–R5 until SAN-178 evidence filed
3. No VEB implementation sprint until MVP ledger closed
4. Intelligence issues stay `phase:intel-*` — not Cycle 1 Todo
5. Cancel/dup **SAN-792–796** venue orphan track before any VEN work

---

## Exceptions (may stay in MVP views)

| Issue | Exception reason |
|-------|------------------|
| SAN-387 SEARCH-002 | Event cards — Camila G2 |
| SAN-824 event pins | Andrés map pins — G2 quality |
| SAN-823 rentals fast-path | Camila G2 |

---

## Exit criteria for lifting freeze

- [ ] SAN-115 ledger closed (G1+G2+G3)
- [ ] SAN-831 CHAT sprint exit
- [ ] Launch readiness ≥ 9.0
- [ ] Prod smoke 4/4 verticals PASS

Then: VEB hygiene → Revenue R2 import → Intelligence Phase 2.
