task_id: ven-042
mvp_step: 042
id: VEN-042
title: Phase A evidence + task-verifier closeout
status: Open
priority: P1
phase: CTI-A
effort: 1h
owner: claude
depends_on: [VEN-040]
blocks: [VEN-044]
skill: [mde-task-lifecycle, task-verifier]
mcp: []
---

# VEN-042 — Phase A evidence

## In plain English

Collect **proof** (logs, screenshots, curl, smoke output) that Phase A actually works — then flip tasks to Done only if task-verifier agrees. No “fake Done.”

## User story

**As Sofía (dev/QA),** I need a single evidence file Patricia can skim, **so that** we know Tourist-facing tour search shipped — without claiming embeddings or OpenClaw that are not built yet.

## Real-world example

`tasks/notes/CTI-A-evidence.md` includes: `curl localhost:3001` → 200, smoke output showing 5 tour cards, Vitest pass count, note “VEN-044 not started — SQL rank only.”

## Goals

1. `tasks/notes/CTI-A-evidence.md` with:
   - `npm run dev` clean boot (:3001)
   - `npm run smoke:coffee-tours` output
   - Vitest count
   - Screenshot or browser note (5 tour cards + pins)
2. Update `tasks/agent/tasks/INDEX.md` statuses.
3. Optional: `CHANGELOG.md` + `tasks/todo.md` via Phase 5 ship.

## Success criteria

1. task-verifier checklist passes for VEN-032/B + 002–009 claims.
2. Evidence notes ≥3 verified `place_id` in seed + routing test green.
3. Phase A explicitly **excludes** semantic/embedding search (VEN-044 not Done).
4. No task marked Done without evidence file row.
5. Agent does not list tour names in prose on smoke query (MAP-018).
6. `npm run floor` + `npm test` + `npm run smoke:coffee-tours` all green in evidence.

## Verify bundle

```bash
cd mdeapp
npm run floor
npm test
npm run smoke:coffee-tours
curl -sS -o /dev/null -w "%{http_code}" http://localhost:3001/
```

## Lifecycle

Run **Phase 5** ([mde-task-lifecycle/shipping.md](../../../.claude/skills/mde-task-lifecycle/shipping.md)) when user requests ship.
---

## Verification gate

> **Standard:** [VEN-VERIFY-STANDARD.md](VEN-VERIFY-STANDARD.md) · **Scorecard:** [VEN-VERIFY-MATRIX § VEN-042](../evidence/VEN-VERIFY-MATRIX.md)

| Field | Value |
|-------|-------|
| Evidence | `tasks/venues/tasks/evidence/VEN-042-verify-YYYY-MM-DD.md` |
| Grade | ⚪ Pending (optional track) |
| Production ready | No |

### Verify before Done

| Layer | Probe |
|-------|-------|
| **Local** | See VEN-VERIFY-MATRIX § VEN-042 |
| **MCP** | Supabase / mastra / maps per task |
| **Chrome DevTools** | Tour UI routes when implemented |
| **Playwright** | Tour specs when implemented |
| **Floor** | `cd mdeapp && npm run floor` |

### Improvements needed

- Optional coffee-tour track — verify after implementation

