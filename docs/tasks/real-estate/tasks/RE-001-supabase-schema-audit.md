---
task_id: RE-001
title: Supabase schema audit — rentals cluster
layer: DATA
priority: P0
phase: core
status: Not Started
persona: Sofía
depends_on: []
unblocks: [RE-002, RE-003, RE-008, RE-009]
skills: [mde-supabase, mde-task-lifecycle, task-verifier]
related:
  - ../real-estate-prd.md
  - ../../data/tasks-data/data-019-rentals-data-inventory.md
description: MCP inventory of rental tables; CORE = no new tables; evidence file.
---

# RE-001 — Supabase schema audit

## Goal

Pair with **data-019** — produce app-facing evidence at `tasks/real-estate/evidence/RE-001-schema.md`.

## Live baseline (2026-05-26)

44 `apartments`, 11 `leads`, 0 `showings`, RLS on cluster ✅.

## Acceptance criteria

- [ ] Table matrix: exists / missing / renamed (PRD §6)
- [ ] CORE verdict: zero new MVP tables
- [ ] Gap list feeds data-020, data-021, data-009 M3
- [ ] No migrations in this task
