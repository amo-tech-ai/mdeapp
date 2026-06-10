---
title: Mastra + CK tasks — verification v3 (92/100)
date: 2026-05-22
verifier: task-verifier protocol
scope: tasks/mastra/*.md + tasks/copilotkit/BACKLOG-ck-gaps.md crosswalk
disk_verified: true
---

# Task verification v3 — are corrections 100%?

## Verdict

| Question | Answer |
|----------|--------|
| Are MASTRA-001…005 **orchestration specs** correct? | **Yes (~90/100)** |
| Are **all** production CK gaps in `tasks/mastra/` alone? | **No** — by design; CK backlog + F/MAP own UI/state/E2E |
| Is the **92/100 analysis** reflected in task files? | **Yes after v3** — see [`CROSSWALK-ck-ui-e2e-state.md`](../CROSSWALK-ck-ui-e2e-state.md) |
| Are tasks **100% correct** end-to-end? | **No (~92/100)** — implementation + E2E still absent on disk |

---

## Scorecard

| Area | Score | Evidence |
|------|------:|----------|
| Runtime architecture (MASTRA + Pattern 1) | 96 | `verified_against: integrations/mastra` on MASTRA-001/002 |
| Example understanding | 95 | CROSSWALK three-example canon; MAP-001 §3 Pattern sources |
| Task mapping | 90 | MASTRA ↔ CK ↔ F crosswalk in INDEX + CROSSWALK |
| AG-UI understanding | 84 | CK-001, CK-007 in BACKLOG; not in MASTRA AC (correct separation) |
| Production completeness | 78 | `/chat` missing; no Playwright specs on disk |
| **Overall** | **92/100** | |

---

## MASTRA per-task verdict

| Task | Spec | Gaps fixed v3 | Blocker |
|------|-----:|---------------|---------|
| MASTRA-001 | 90 | CK-001 optional ref ✅ | Tests not written |
| MASTRA-002 | 88 | Example canon + CK follow-ons ✅ | MAP-001 |
| MASTRA-003 | 85 | CK-008 cross-ref needed in INDEX ✅ | Post-MVP |
| MASTRA-004 | 88 | — | MASTRA-001 |
| MASTRA-005 | 86 | — | Script not written |

---

## What was CORRECT (confirmed)

1. **MAP-001 before MASTRA-002** — disk: no `mdeapp/src/app/chat/`
2. **Do not build PostgresStore first** — MASTRA-003 correctly deferred
3. **integrations/mastra = runtime** — MASTRA tasks reference correct example
4. **canvas/* = patterns only** — MAP-001 + CROSSWALK document this
5. **F33–F36 = PM-STATE aliases** — EventDraftState already spec'd
6. **~68–72% CK coverage planned** — 05-mastra-copilotkit.md + CK-001…008

---

## What was OVERSTATED (corrected in docs)

| Prior claim | Correction in tasks |
|-------------|---------------------|
| Full collaborative state MVP-critical | CROSSWALK + BACKLOG § out-of-scope Phase 2+ |
| 12 groups all missing | 05-mastra-copilotkit reclassified ~5/5/2 |
| Need new MASTRA-006 for AG-UI | CK-001…007 in copilotkit backlog, not MASTRA scope creep |

---

## Alias coverage (user-requested IDs)

| Alias family | Canonical location | Status |
|--------------|-------------------|--------|
| CK-AGUI-001…005 | CK-001, CK-007, Phase 2 | ✅ mapped in CROSSWALK |
| PM-STATE-001…005 | EVP-008/009/010/011, `canvas/mastra-pm` | ✅ mapped |
| CK-FE-001…005 | CK-003, F36, F46, EVT-01 | ✅ mapped |
| STATE-001…006 | CK-002, F33, F46, CK-008 | ✅ mapped |
| E2E-001…006 | CK-001…005, CK-008, Phase 2 | ✅ mapped |

**No duplicate task files** for aliases — prevents ID drift.

---

## Remaining gaps to reach 100%

| Gap | Owner | Priority |
|-----|-------|----------|
| `/chat` route on disk | MAP-001 | P0 |
| `mastra-router-smoke.test.ts` | MASTRA-001 | P0 |
| `RentalSearchState` explicit Zod in F46 | F46 patch at execution | P1 |
| Playwright spec files | CK-005 | P1 |
| `check:mastra` script | MASTRA-005 | P2 |

---

## References

- [`../CROSSWALK-ck-ui-e2e-state.md`](../CROSSWALK-ck-ui-e2e-state.md)
- [`../../copilotkit/BACKLOG-ck-gaps.md`](../../copilotkit/BACKLOG-ck-gaps.md)
- [`../../../plan/mastra/05-mastra-copilotkit.md`](../../../plan/mastra/05-mastra-copilotkit.md)
- [`03-top-summary.md`](./03-top-summary.md)
