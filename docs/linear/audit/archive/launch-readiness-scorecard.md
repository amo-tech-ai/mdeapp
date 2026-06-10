# Launch readiness scorecard

**Date:** 2026-06-09 (Week 1 Cycle 1)  
**Update cadence:** Weekly · after each Track A proof  
**Prior audit:** [`LAUNCH-READINESS-2026-06-08.md`](./LAUNCH-READINESS-2026-06-08.md) (52/100)

---

## Executive dashboard

| Area | Score | Δ vs Jun 8 | Blocker |
|------|------:|------------|---------|
| **Payments** | 35 | — | SAN-178 unproven |
| **Events** | 80 | +5 | PAY-001 checkout shell |
| **Maps** | 88 | — | SAN-368 ADK in flight |
| **Grounding** | 70 | — | ADK prod + embed 403 |
| **Venues** | 75 | — | VEN-016–019 open |
| **Real Estate** | 78 | — | SAN-478 catalog P0 |
| **Trips** | 55 | — | Shell only |
| **Auth** | 90 | — | Polish only |
| **UI** | 82 | +4 | SAN-731 skeleton |
| **Launch Overall** | **72** | **+20** | **SAN-178** |

| Planning | 95 |
| Tracker coverage | 95 |
| Linear hygiene | 100 |
| Documentation | 95 |
| **MVP proof** | **33** |
| **Launch readiness** | **72** |

**Proof-constrained** — not documentation-constrained.

---

## North-star proofs (single column)

| Persona | Proof | Score | SAN | Status |
|---------|-------|------:|-----|--------|
| **Camila** | Cards + pins | 65 | SAN-546, SAN-733 | 733 ✅ · matrix open |
| **Roberto** | Publish | 95 | SAN-366 | ✅ Done |
| **Andrés** | Payment | 25 | SAN-178 | 🔴 Todo |

**Ledger SAN-115:** Open until all three ≥80.

---

## Track A — MVP exit (must ship)

| # | SAN | Title | Status | Score impact |
|---|-----|-------|--------|--------------|
| 1 | **SAN-178** | PAY-001 live ticket | Todo | Payments → 90 |
| 2 | **SAN-546** | OPS-JOURNEY prod matrix | Todo | Camila → 85 |
| 3 | **SAN-115** | AIE-001 ledger close | Todo | Launch → 85+ |

---

## Track B — UI momentum (parallel, allowed)

| # | SAN | Title | Status | Score impact |
|---|-----|-------|--------|--------------|
| 4 | **SAN-730** | Host navigation rail | Backlog | Events UI +5 |
| 5 | **SAN-731** | Event detail skeleton | Backlog | UI +3 |
| 6 | **SAN-135** | Luma detail Phase A | In Review | Events +5 |

No new AI systems · no new infra.

---

## Critical risks

| Risk | Severity |
|------|----------|
| SAN-178 unproven | 🔴 |
| 92 open orphans | 🔴 |
| generate.py before CSV export | 🔴 |
| Stale CSV | 🟡 |
| SEARCH-002 collision | 🟡 |
| Missing VEB-000 epic | 🟡 |

---

## Weekly update template

```markdown
## Week N — YYYY-MM-DD
- Launch overall: __/100
- SAN-178: [ ] proof attached
- SAN-546: [ ] 4/4 verticals PASS
- SAN-115: [ ] ledger closed
- Orphans open: __
```

---

## References

- [`mvp-proof-ledger.md`](./mvp-proof-ledger.md)
- [`launch-scope-freeze.md`](./launch-scope-freeze.md)
- [`launch-blocker-verification.md`](./launch-blocker-verification.md)
