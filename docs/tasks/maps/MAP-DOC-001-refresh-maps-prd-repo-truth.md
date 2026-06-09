---
id: MAP-DOC-001
title: Refresh maps-prd repo truth + §1.2 gap table
status: Done
priority: P0
phase: Documentation
effort: 1h
owner: cursor
depends_on: []
blocks: []
skill: [mde-task-lifecycle, mde-maps]
prd_ref: ./docs/maps-prd.md
related:
  - ./docs/maps-audit-plan.md
description: Correct stale "not started" claims in maps-prd after forensic audit 2026-05-27.
---

# MAP-DOC-001 — Refresh maps-prd repo truth

## Context

Forensic audit ([`maps-audit-plan.md`](./docs/maps-audit-plan.md)) found `maps-prd.md` §1.2 contradicted disk — vis.gl, MapContext, grounding, attribution, and tests were marked missing but are **shipped** (archived MAP-001–004, 007B, 008, 009, 018B–F).

## Changes applied

1. **§Repo truth** table — updated 2026-05-27 snapshot
2. **§1.1** — mdeapp paths reflect shipped components
3. **§1.2** — gap table lists only **real** blockers (MAP-005+, prod ADK)
4. **Readiness score** — 74/100 MVP localhost; 58/100 prod cost-safe

## Acceptance criteria

- [x] maps-prd.md §Repo truth matches `tasks/maps/INDEX.md`
- [x] No false "not started" for MAP-002/004/008/009
- [x] Cross-link to maps-audit-plan.md
- [x] Audit plan footer updated

## Evidence

This task file + git diff on `tasks/maps/docs/maps-prd.md`.
