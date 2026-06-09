---
title: Contest CTEST Pack — Spec Verification (Post-Normalization)
status: Final
date: 2026-06-02
auditor: Cursor (task-verifier)
skills_used:
  - task-verifier
  - mastra
  - copilotkit
  - mde-supabase
  - gemini
  - responsive-design
---

# Contest CTEST Pack — Spec Verification (2026-06-02)

## Verdict

| Grade type | Score | Letter |
|---|---:|---|
| **Spec quality (all 13 tasks)** | **100/100** | **A** |
| **Execution readiness (vertical)** | **15/100** | **F** |
| **Production-ready contest product** | **No** | — |

> **Safe to execute (specs):** Yes — planning pack is template-complete and internally consistent.  
> **Safe to mark any CTEST Done:** No — zero contest migrations, routes, agents, or `e2e/contest/` on disk.

**Persona impact today:** None on `/` or `/chat` — contest is Phase 2+ until CTEST-001 lands; Roberto would gain `/host/contests/new` only after CTEST-001 + CTEST-004 + CTEST-006 implementation.

---

## Changes applied (this pass)

| Fix | Tasks |
|---|---|
| Ten-section template (§1–10) | CTEST-000..012 |
| `evidence:` + `phase:phase2` + `mvp_track` frontmatter | All |
| Mastra port pack (integration surface, `ai_runs`, enum map, `gemini-3.5-flash`) | CTEST-005 |
| CopilotKit Pattern 1 + agent key contract | CTEST-004 |
| CTEST-006 depends on CTEST-002; vote route blocked until ledger | CTEST-006, 010 |
| Proof-gates path → `docs/plan/contests/docs/12-task-proof-gates.md` | CTEST-007 |
| Security checklist path → `docs/plan/contests/docs/13-security-checklist.md` | CTEST-002 |
| Skills scan root → `.claude/skills/` | All `verified_against` |
| MVP-A / MVP-B cut | `MVP-SCOPE.md`, `tasks/INDEX.md` |
| Remote catalog proof in DoD | CTEST-001 |

---

## Verification report — 2026-06-02 · Cursor

| Task | Spec /100 | Execution readiness /100 | Safe to execute spec? | Blockers (implementation) |
|---|---:|---:|---|---|
| CTEST-000 | 100 | 90 | Yes | Docs-only |
| CTEST-001 | 100 | 25 | Yes | No migration on disk |
| CTEST-002 | 100 | 20 | Yes | No vote RPCs |
| CTEST-003 | 100 | 20 | Yes | MVP-B; no Stripe contest tables |
| CTEST-004 | 100 | 15 | Yes | No contest routes |
| CTEST-005 | 100 | 15 | Yes | No contest agents |
| CTEST-006 | 100 | 40 | Yes | Wireframes exist; routes not |
| CTEST-007 | 100 | 30 | Yes | No `e2e/contest/` |
| CTEST-008 | 100 | 15 | Yes | Blocked on 001, 006 impl |
| CTEST-009 | 100 | 15 | Yes | Blocked on 001, 004, 008 |
| CTEST-010 | 100 | 15 | Yes | Blocked on 002, 006, 009 |
| CTEST-011 | 100 | 10 | Yes | MVP-B sandbox |
| CTEST-012 | 100 | 85 | Yes | Linear evidence file pending |

**Pack average spec:** 100/100 · **Pack execution readiness:** ~15/100

---

## Automated probes (this run)

| Check | Command / probe | Result |
|---|---|---|
| Sections 1–10 × 13 tasks | `rg '^## N\. '` per file | ✅ All pass |
| `evidence:` frontmatter | all `CTEST-*.md` | ✅ |
| `phase:phase2` label | all tasks | ✅ |
| Production standard ref | body references `05-production-task-standard.md` | ✅ |
| Proof-gates doc | `docs/plan/contests/docs/12-task-proof-gates.md` | ✅ exists |
| Security checklist | `docs/plan/contests/docs/13-security-checklist.md` | ✅ exists |
| Broken `plan/contests` relative paths | `rg '../../../plan/contests'` | ✅ none |
| Contest `mdeapp/src` | `rg contest src` | ✅ none (expected) |
| Contest E2E dir | `ls e2e/contest` | ✅ missing (expected) |
| mdeapp floor baseline | `npm test -- --run` | ✅ 482 passed |

---

## Rubric score breakdown (spec 100/100)

| Dimension | Weight | Score | Notes |
|---|---:|---:|---|
| Source-of-truth alignment | 20 | 20 | Phase 2+, CK 1.55.2, Gemini-only, MVP-A/B |
| Disk/MCP accuracy | 25 | 25 | Claims match probes; remote SQL deferred to CTEST-001 DoD |
| DoD provability | 25 | 25 | Each task §9–10 has commands + expected |
| Template completeness | 15 | 15 | 13/13 sections 1–10 |
| Security / hooks | 15 | 15 | RLS, RPC-only votes, service-role rules documented |

---

## Remaining work (not spec defects)

1. **Implement CTEST-001** migration + remote catalog evidence.
2. **Implement CTEST-002** before any vote UI (CTEST-010).
3. **Register contest agents** per CTEST-005 + extend `log-agent-run.ts`.
4. **Create `e2e/contest/`** when routes exist (CTEST-007).
5. **CTEST-012 evidence** — Linear list + link check output in `tasks/contest/notes/CTEST-012-evidence.md`.

---

## Stop condition

- **Specs:** ✅ Safe to execute planning and implementation in dependency order.  
- **Production:** 🛑 Not ready until CTEST-001..007 implementation proofs pass.

---

## Commands to run on first implementation slice

```bash
cd /home/sk/mdeai/mdeapp
npm run typecheck && npm test -- --run
# after migration:
rg 'contest' supabase/migrations
npm run floor
```

---

*Re-audit when `*_contest_core.sql` exists or first `/contests` route returns 200.*
