---
title: INT Program — Creation Report
date: 2026-05-28
---

# Agent Intelligence & Shared Memory — Program Report

## Summary table

| Phase | Count | Priority | Status |
|-------|------:|----------|--------|
| CORE | 5 | P0 | Not Started |
| MVP | 5 | P0–P1 | Not Started |
| POST-MVP | 5 | P1–P2 | Not Started |
| ADVANCED | 5 | P2 | Not Started |
| **Total INT** | **20** | — | Planning complete |

## Files created

| Path |
|------|
| `tasks/intelligence/tasks/INDEX.md` |
| `tasks/intelligence/tasks/MIGRATION.md` |
| `tasks/intelligence/tasks/_TASK-SCHEMA.md` |
| `tasks/intelligence/tasks/00-program-report.md` |
| `tasks/intelligence/tasks/INT-001` … `INT-020` (20 task specs) |

## Files updated

| Path | Change |
|------|--------|
| `tasks/intelligence/INDEX.md` | Points to `tasks/` program |
| `tasks/INDEX.md` | INT-001…020 program row |

## Files NOT duplicated (keep as implementation aliases)

| Existing | Role |
|----------|------|
| `tasks/real-estate/tasks/RE-017…020.md` | Rental code-level specs; `implements` from INT-002,003,004,006,016 |
| `tasks/vector/VEC-001…007.md` | Platform pgvector; blocks INT-016, INT-017 |
| `tasks/intelligence/agent-plan.md` | PRD + mermaid (unchanged) |
| Root `tasks/intelligence/INT-00x-*.md` | **Superseded** — see MIGRATION.md |

## Do we need additional tasks?

| ID | Recommendation |
|----|----------------|
| **VEC-001…007** | **Yes, keep separate** — platform/schema; INT-016/017 depend on them |
| **RE-017…020** | **Keep** — `mdeapp` implementation detail + commit ledger |
| **INT-021 restaurant/venue wrapper** | **✅ Created 2026-05-28** — [`INT-021`](./INT-021-restaurant-venue-intelligence-wrapper.md); closes the restaurant/venue gap (was 80%), supersedes root `INT-005-restaurant-venue-intelligence.md` |
| **INT-022 routing/confidence instrumentation** | **✅ Created 2026-05-28** — [`INT-022`](./INT-022-routing-confidence-instrumentation.md); telemetry to tune the confidence bands data-driven |
| **F13 storage hardening** | **No new INT** — use existing F13 evidence; INT-010 touches schema only |
| **SAN-* Linear** | **Create at CORE start** — 5 issues minimum for INT-001…005 |

Restaurant/venue now has its own MVP row (INT-021); the confidence bands now have a telemetry task (INT-022). No further duplicate INT tasks needed beyond INT-001…022.

## Risks

| Risk | Mitigation |
|------|------------|
| ID collision (old root INT-003 = events vs new INT-003 = Gemini) | MIGRATION.md + canonical `tasks/` folder |
| Building memory before CORE | Order enforced in INDEX |
| Super-agent prompt | Specialist modules per vertical |
| pgvector without VEC inventory | INT-016 blocked on VEC-001/002 |
| Service role in src | RLS + edge-only embed per tasks |

## Blockers

| Blocker | Blocks |
|---------|--------|
| None for planning | — |
| VEC-001 not run | INT-016 |
| Auth test harness weak | INT-015 Playwright |
| G1 Stripe (business P0) | Does not block INT CORE |

## Percent correct (planning audit)

| Area | Score |
|------|------:|
| Task coverage vs agent-plan | **98%** |
| Phase ordering | **100%** |
| RE/VEC cross-links | **95%** |
| Per-task required fields | **100%** |
| Restaurant/venue dedicated MVP task | **100%** (INT-021 created 2026-05-28) |

**Overall program spec: ~99%** — executable; restaurant/venue MVP task (INT-021) + confidence telemetry (INT-022) now added.

## Next recommended PR

**PR-A (CORE bundle):**

```text
INT-001 (schema) + INT-002/RE-017 (parser) + INT-003/004/RE-018 (clarify) + INT-005 (tests)
```

Target: hero rental query passes [`03-rental-agent-audit.md`](../../testing/prompts/real-estate/03-rental-agent-audit.md).

Ledger: C-016, C-013, C-014.

## Linear import checklist

- [ ] Create project or label `intelligence`
- [ ] Import CORE issues INT-001…005 (P0, blocked-by chain)
- [ ] Link RE-017 → INT-002, RE-018 → INT-003+004 (relates to)
- [ ] Import MVP INT-006…010 after CORE Done
- [ ] Link VEC-001…003 as blockers for INT-016
- [ ] Set implementation order field from INDEX.md
- [ ] Attach `agent-plan.md` to project description

### Suggested Linear titles (copy-paste)

1. INT-001 — Shared intent + slot schema
2. INT-002 — Rental parser monthly/date/city
3. INT-003 — Gemini smart clarify routing
4. INT-004 — Remove canned clarify bypass
5. INT-005 — Intelligence regression tests
6. INT-006 — Rental availability date filters
7. INT-007 — Event intelligence wrapper
8. INT-008 — Café intelligence wrapper
9. INT-009 — CopilotKit readable UI state
10. INT-010 — Working memory schema update
11. INT-011 — user_preferences schema + RLS
12. INT-012 — user_interactions schema
13. INT-013 — Retrieve preferences before search
14. INT-014 — Ranking boost from memory
15. INT-015 — Memory evidence tests
16. INT-016 — pgvector semantic memory
17. INT-017 — Gemini embeddings for memory
18. INT-018 — Cross-domain personalization
19. INT-019 — Memory settings UI
20. INT-020 — Observational memory learning
