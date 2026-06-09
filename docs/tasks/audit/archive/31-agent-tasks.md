---
title: Coffee Tour Intelligence (CTI) — task audit
date: 2026-05-27
auditor: task-verifier + open-claw cross-check
roadmap: ../agent/10-cafeintelligence-plan.md
index: ../agent/tasks/INDEX.md
skills: ../../../index-skills.md
sources:
  - https://docs.openclaw.ai/
  - https://docs.openclaw.ai/llms.txt
  - https://github.com/openclaw/openclaw/tree/main/docs
---

# CTI task audit — percent correct & fixes applied

## Executive verdict

| Area | Before | After fixes |
|------|-------:|------------:|
| Architecture | 92 | 92 |
| Task sequencing | 84 | **94** |
| Data model | 86 | **93** |
| Safety / RLS | 88 | 90 |
| MVP practicality | 90 | **92** |
| Failure prevention | 80 | **91** |
| **Overall** | **87** | **92** |

**Production-ready to start Phase A coding:** yes, after this audit’s task file updates land. **Not** production-shipped until CTI-010 evidence + localhost gate 9.

**Persona impact:** Tourist gets ranked, verified coffee **farm tour** cards on `/` with map pins — not café/restaurant confusion. Patricia approves data quality via seed + logs; OpenClaw enrichment stays Phase C (**OCL-013-mvp** only).

---

## Red flags — status

| Issue | Risk | Resolution |
|-------|------|------------|
| Task order: CTI-004 vs CTI-006 | Medium | **Fixed** — INDEX + CTI-004 `depends_on` includes CTI-006; critical path documented |
| CTI-001 monolithic migration | High | **Fixed** — split **CTI-001A** (core) + **CTI-001B** (logs/cache); embeddings stay **CTI-011** |
| pgvector in Phase A | Medium | **Fixed** — CTI-004/006/010 state SQL-only until CTI-011 |
| place_id before UI | High | **Fixed** — CTI-003 requires ≥3 verified `place_id` before CTI-007+ |
| Tour vs café routing | High | **Fixed** — blocking tests in CTI-004, CTI-009; score thresholds in 006/007 |
| CTI-019 vs OCL-013 duplicate | Medium | **Fixed** — CTI-019 **Cancelled**; canonical **OCL-013-mvp** |
| index-skills gemini 2.5-flash | Low | **Fixed** in index-skills → `gemini-3.5-flash` |
| Map category only `grounded` | Medium | **Fixed** — CTI-008 requires `meta.listingType: coffee_tour` |

---

## Skills & MCP alignment

| Skill | CTI use | Verified |
|-------|---------|----------|
| **task-verifier** | Done gates, this audit | ✅ |
| **mde-supabase** | 001A/B, 003, 014 | ✅ + `user-supabase` MCP |
| **mastra** + **copilotkit-integrations** | 004, 006 | ✅ + `user-mastra` MCP |
| **mde-maps** | 003 place_id, 005, 008 | ✅ + `google-maps-code-assist` |
| **gemini** | 004, 011, 012 | ✅ `gemini-3.5-flash` per CLAUDE.md |
| **pgvector** | **011 only** | ✅ promoted in index-skills for CTI-011 |
| **open-claw** | **Not Phase A** | ✅ CTI-019 cancelled → OCL-013-mvp |
| **testing** / **webapp-testing** | 006, 009 | ✅ |

Official OpenClaw references for Phase C only: [docs.openclaw.ai](https://docs.openclaw.ai/), [agent-skills](https://github.com/openclaw/agent-skills) (authoring patterns), [clawhub](https://github.com/openclaw/clawhub) (prod ban per OCL-004).

---

## Per-task scorecard (spec quality %)

Grades use [task-spec-rubric.md](../../.claude/skills/task-verifier/references/task-spec-rubric.md). **After** column reflects post-audit task files.

| ID | Title | Before | After | Blockers fixed |
|----|-------|-------:|------:|----------------|
| CTI-001A | Core schema + RLS | 78 | **94** | Split from 001; no logs/embed in one migration |
| CTI-001B | Logs + cache | — | **90** | New; second migration |
| CTI-002 | Types + Zod | 88 | **92** | Depends 001A |
| CTI-003 | Seed tours | 82 | **95** | ≥3 `place_id` blocking rule |
| CTI-004 | searchCoffeeTours | 85 | **94** | depends CTI-006; routing + score ACs |
| CTI-005 | Places enrich | 86 | **91** | Verified place_id prerequisite |
| CTI-006 | rankCoffeeTours | 88 | **95** | Threshold tests; before 004 explicit |
| CTI-007 | CoffeeTourCard | 87 | **92** | Score/badge ACs |
| CTI-008 | Map pins | 84 | **93** | `listingType=coffee_tour` required |
| CTI-009 | Smoke | 86 | **94** | Routing + score smoke assertions |
| CTI-010 | Evidence | 90 | **93** | 001A/B; no semantic search in Phase A |
| CTI-011 | Embeddings | 88 | **92** | pgvector skill; depends 001A |
| CTI-012 | Verify sources | 85 | 88 | Minor — GS-001 dependency external |
| CTI-013 | ADK merge | 83 | 86 | Phase B; staging dedupe TBD in impl |
| CTI-014 | saveCoffeeTour | 86 | 88 | Standard RLS pattern |
| CTI-015 | Compare drawer | 84 | 86 | Phase B |
| CTI-016 | Query chips | 82 | 84 | Phase B |
| CTI-017 | Detail page | 80 | 82 | Phase C |
| CTI-018 | Workflow extract | 78 | 80 | Phase C |
| CTI-019 | OpenClaw | 70 | **95** | Cancelled → OCL-013 only |
| CTI-020 | WA handoff | 75 | 78 | Deferred skill correct |

**Phase A minimum to code:** all tasks **CTI-001A through CTI-010** should be ≥ **90** spec score — met after fixes.

---

## Suggested improvements (remaining)

| Priority | Task | Suggestion |
|----------|------|------------|
| P0 | CTI-003 | Add seed script assertion: `assert place_id_count >= 3` exits non-zero |
| P1 | CTI-004 | Add Vitest file `search-coffee-tours.routing.test.ts` in wiring plan |
| P1 | CTI-011 | Document embedding model via `gemini-api-docs-mcp` before migration |
| P2 | CTI-013 | Specify staging table name + dedupe key in spec body |
| P2 | Roadmap | ~~Replace CTI-001 refs~~ **Done** in `10-cafeintelligence-plan.md`, OCL index, notes-agent |

---

## Critical path (canonical)

```text
CTI-001A → CTI-002 → CTI-003 (≥3 place_id) → CTI-006 → CTI-004 → CTI-005 → CTI-007 → CTI-008 → CTI-009 → CTI-010
CTI-001B (before CTI-010, can parallel after 001A)
Phase B: CTI-011+ after CTI-010
OpenClaw: OCL-001-core … OCL-013-mvp only (not CTI-019)
```

---

## Verify before first PR

```bash
# Skills loaded: mde-supabase, mastra, copilotkit-integrations, task-verifier
cd mdeapp
# After CTI-001A migration:
# user-supabase get_advisors
npm test -- coffee-tour   # after CTI-002+
npm run smoke:coffee-tours  # after CTI-009
npm run floor
```

Evidence path: `tasks/notes/CTI-A-evidence.md`

---

## Changelog (this audit)

- Split CTI-001 → CTI-001A + CTI-001B
- Updated INDEX, 15+ task specs, task-verifier `agent-cti.md`, index-skills CTI pack
- Cancelled CTI-019; pointer to OCL-013-mvp
- Added `tasks/openclaw/docs/sources.md` cross-ref for OpenClaw (prior session)
