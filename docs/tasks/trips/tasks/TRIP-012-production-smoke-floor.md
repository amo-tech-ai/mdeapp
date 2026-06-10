---
task_id: TRIP-012
title: Production smoke + floor gate
layer: OPS
priority: P1
phase: ship
status: Not Started
estimated_effort: 2h
persona: Sofía
depends_on: [TRIP-011, TRIP-013, TRIP-015, TRIP-016, TRIP-017, TRIP-018]
unblocks: []
skills: [mde-task-lifecycle, task-verifier, deploy-to-vercel]
description: Vercel /trips + /saved smoke; floor; anti-fake-done evidence.
---

# TRIP-012 — Production smoke + floor

## Goal

Prove trips surfaces survive deploy — localhost proof is insufficient for Done on ship track.

## Checks

| Check | Command / action | Pass |
|-------|------------------|------|
| Floor | `cd mdeapp && npm run floor` | exit 0 |
| Local routes | `curl -L :3001/trips`, `/saved` | 200 or auth redirect |
| Preview deploy | Vercel preview URL `/trips` | 200 |
| RLS | Two-user manual or script note in evidence | isolated |
| Repair backstop | invoke/check TRIP-013 repair function evidence | no missing paid trip items |
| Cache | Places/details hydration read uses cache/proxy | no direct browser Places call |
| Observability | failed sync/agent/tool-call logs visible | trace id recorded |

## Evidence

- **Create** `tasks/trips/evidence/TRIP-012-ship.md`
- Dev restart log, curl codes, Playwright pass count, preview URL, floor exit code

## Acceptance criteria

- [ ] All TRIP-001–011 acceptance criteria met
- [ ] All TRIP-013–019 operational hardening criteria met or explicitly deferred from the ship gate
- [ ] Evidence committed
- [ ] INDEX frontmatter statuses updated only after proof

## Do not do

- Do not mark SCREEN-012/013 Done without Browser MCP + Playwright per standard
