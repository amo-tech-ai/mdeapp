---
title: MASTRA-001…005 task spec verification (v2)
date: 2026-05-22
verifier: task-verifier + disk probes + CopilotKit/Mastra refs
spec_score_avg: 92
execution_readiness_avg: 88
safe_to_execute: conditional
supersedes: 01-mastra-tasks-verification.md
---

# Mastra tasks verification v2

Post-correction audit after patching all `MASTRA-*.md` specs.

## Verdict

| Task | Spec | Exec ready | Safe? | Grade |
|------|------:|-----------:|-------|-------|
| MASTRA-001 | 94 | 92 | ✅ Yes | A |
| MASTRA-002 | 93 | 85 | ⚠️ After MAP-001 | A- |
| MASTRA-003 | 91 | 80 | ⏸ Post MVP exit | A- |
| MASTRA-004 | 93 | 90 | ✅ After MASTRA-001 | A |
| MASTRA-005 | 90 | 90 | ✅ Yes | A- |

**Specs are production-safe to execute** (not the platform itself). Remaining blockers are **implementation**, not spec gaps.

---

## Corrections applied (2026-05-22)

| Area | Fix |
|------|-----|
| depends_on | Full paths: `../core/F09-…`, `../maps/MAP-001-…` |
| MASTRA-001 | classify-intent + search-rentals tests; no live Gemini; concierge WF scope |
| MASTRA-002 | MAP-001 pingAgent handoff; integration_surface table; CK #3426 note; verification cmds |
| MASTRA-003 | @mastra/pg install; route.ts thread/resource; cold-start gate; F20 split |
| MASTRA-004 | logging-mastra-agent primary; enum probe; anonymous regression; full depends_on |
| MASTRA-005 | Removed ci.yml; check:mastra script; CK/Gemini pin checks |
| INDEX | MAP-001 in sequence; crosswalk updated |
| coverage matrix | Workflows/tools/agents aligned to disk |

---

## Disk probes (unchanged facts)

- `/chat` — ❌ absent
- `mastra-router-smoke.test.ts` — ❌ (MASTRA-001 deliverable)
- `search-rentals-logic.test.ts` — ❌ (MASTRA-001 deliverable)
- `@mastra/pg` — ❌ not installed (MASTRA-003)
- `userId: null` in logging-mastra-agent — ✅ (MASTRA-004 target)
- `npm run floor` — may fail pre-existing ESLint in search-rentals; MASTRA-001 AC includes fix

---

## Execution order

```text
MAP-001 → MASTRA-001 → MASTRA-002
              ↘ MASTRA-004 (parallel; /chat proof after 002)
MASTRA-005 anytime after F09
MASTRA-003 after mvp.md exit + MASTRA-002
```

---

## References

- [task-verifier SKILL](../../.claude/skills/task-verifier/SKILL.md)
- [copilotkit×mastra ref](../../.claude/skills/copilotkit-integrations/references/integrations/mastra.md)
- [Mastra storage docs](https://mastra.ai/docs/memory/storage)
- [CopilotKit #3426](https://github.com/CopilotKit/CopilotKit/issues/3426)
