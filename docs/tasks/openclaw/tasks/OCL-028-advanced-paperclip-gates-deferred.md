---
id: OCL-028-advanced
tier: advanced
title: Paperclip 15A — security gates before OpenClaw outbound
status: Open
priority: P4
phase: advanced
status: Deferred
effort: L
owner: claude
depends_on: []
blocks: [OCL-029-advanced, OCL-026-advanced]
skill: [open-claw, mde-paperclip, mde-task-lifecycle]
mcp: []
sources_index: ../docs/sources.md
---

# OCL-028-advanced — Paperclip gates (DEFERRED)

## At a glance

**Not on MVP path.** Only needed if Paperclip is already your VPS control plane for WA. Otherwise use OCL-003-core + `/admin/approvals` + direct OpenClaw API (OCL-029-advanced deferred).

## Acceptance criteria

1. Board approve path works for test issue.
2. Documented in `100-openclaw-plan.md` Phase 3 gate.
3. OCL-029-advanced blocked until Done.

## Ref

`tasks/prompts/advanced/15A-paperclip-security-foundation.md` (if present) or plan/openclaw production notes.
