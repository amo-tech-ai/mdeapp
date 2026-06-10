# Camila — Apartment seeker + concierge chat

**Persona priority:** #1 (Phase 1)  
**Surfaces:** `/` · `/chat` · `/rentals`  
**Ledger:** [`../evidence/TASK-LEDGER.md`](../evidence/TASK-LEDGER.md)

## Journey 1 — Rental Discovery

| Task | Full name | Proof | Status |
|------|-----------|-------|--------|
| SAN-545 | DATA-EMBED — Fix rental embed API 403 (hybrid search) | L1✓ L4✓ prod `embedStatus: ok` @ `1c2d2f8` | In Review — Done-eligible |
| SAN-823 | UX-038 — Rentals: pattern-based fast-path (neighborhood + intent) | L1✓ L4✓ 8 cards · 8 pins · no clarify on `/chat` | In Review — Done-eligible |

## Journey 2 — Cafés

| Task | Full name | Proof | Status |
|------|-----------|-------|--------|
| SAN-519 | (cafés surface — verify spec id) | prod-synthetic PASS | Live |

## Journey 3 — Restaurants

| Task | Full name | Proof | Status |
|------|-----------|-------|--------|
| — | — | prod-synthetic PASS | Live |

## Journey 4 — Launch QA (SAN-546)

| Journey | Description | Status |
|---------|-------------|--------|
| J05–J09 | Automated slice | Partial |
| J06 | Rentals fast-path prod | **PASS** 2026-06-08 |
| J10–J15 | Detail / pin / mobile | Manual pending |

**Completion:** ~82% (rental discovery prod proof PASS; hero Playwright follow-up optional)
