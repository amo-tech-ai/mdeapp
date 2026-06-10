---
id: AIE-001-core
title: Production proof ledger (Core exit gate)
status: Not Started
priority: P0
phase: core
persona: sofia
linear: SAN-115
percent: 10
blocked_by: []
blocks: [AIE-005, AIE-011, AIE-013]
depends_on: [EVP-001-core, G3-core-host-publish-proof]
wireframe: —
plan: ../../../plans/04-AI-native-system.md §15
---

# AIE-001-core — Production proof ledger

## Objective

Sign the Core commerce + host loop with dated evidence before expanding agents or venues. Same gate as EVP-001 — AIE pack **blocks** on this.

## Scope

| Proof | Persona | Surface |
|-------|---------|---------|
| G1 paid ticket | Andrés | Stripe webhook + `/me/tickets` |
| G2 discovery | Camila | Chat → event cards on prod |
| G3 host publish | Roberto | Wizard → HITL → row in `events` |
| CopilotKit | Sofía | `/api/copilotkit` POST 200 local + prod |

## Acceptance criteria

- Evidence file at `tasks/testing/evidence/YYYY-MM-DD/aie-001-ledger.md`
- Linear SAN-115 → Done
- EVP-001 frontmatter `status: Done`
- No AIE implementation tasks marked Done until this passes

## Next action

Run prod smoke matrix · capture SQL for G3 · file ledger
