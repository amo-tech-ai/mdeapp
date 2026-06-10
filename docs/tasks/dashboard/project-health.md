# MDEAI Project Health Dashboard

**Generated:** 2026-06-08 (launch readiness sprint run 2)  
**Rule:** [`.cursor/rules/mdeai-proof-driven-delivery.mdc`](../../.cursor/rules/mdeai-proof-driven-delivery.mdc)  
**Todo:** [`mdeapp/todo.md`](../../mdeapp/todo.md) · **Changelog:** [`mdeapp/changelog.md`](../../mdeapp/changelog.md)  
**Evidence:** [`tasks/testing/evidence/2026-06-08/launch-readiness-sprint-RESULTS.md`](../testing/evidence/2026-06-08/launch-readiness-sprint-RESULTS.md)  
**Prod SHA:** `0baeda7`

## Persona readiness

| Persona | Score | Blocker |
|---------|------:|---------|
| Camila | 92 | SAN-548 turn-11 prod proof |
| Roberto | — | Events scope — J10/J11 need authed host |
| Andrés | — | Ticketing — out of scope |
| Lucía | 78 | SAN-546 J14/J15/J17 · SAN-828 close pending |
| Patricia | — | Admin — post-MVP |
| Tourist | 88 | SAN-368 prod source attribution |

## Area readiness

| Area | Score | Notes |
|------|------:|-------|
| Rentals | 95 | `/rentals` REAL-011 prod 6/6 · embed + fast-path Done |
| Venues | 92 | Nightlife VEN-025 prod 2/2 · prod-synthetic 4/4 |
| Maps | 88 | Desktop pin sync OK; mobile FAB fail on `/rentals` |
| Platform | 82 | CopilotKit audit Done-ready; thread persistence unproven |
| Events | — | Delegated |

## Launch

| Metric | Value |
|--------|------:|
| **Overall launch score** | **89** |
| Tier-1 Done | 5/5 (SAN-545, 823, 549, 478, 828) |
| P0 open | SAN-546 (J14 harness) |
| Path to 91% | SAN-546 J14 fix + SAN-548 turn-11 |

## MVP blockers

1. **SAN-546** — J14/J15 prod chat journeys + mobile FAB (J17) + authed J10/J11
2. **SAN-548** — Prod turn-11 thread persistence after cold-start
3. **SAN-368** — Vercel `ADK_*` env confirmation + prod grounding-lite attribution
4. **Hero e2e** — `submitHomeHeroQuery` on prod `/` (optional)

## Next actions

1. **SAN-828** — Merge smoke Origin fix → Linear Done
2. **SAN-546** — Prod browser J14/J15 + host-auth J10/J11
3. **SAN-548** — `e2e/prod-thread-persistence.spec.ts`
4. **SAN-368** — Vercel env audit + prod metadata.source check
