---
id: AIE-028-advanced
title: Marketing agents split — campaign, content, social
status: Not Started
priority: P2
phase: advanced
persona: roberto
linear: —
percent: 0
blocked_by: [AIE-019, AIE-003]
blocks: [AIE-031]
depends_on: []
wireframe: ../../wireframes/events/027-campaign-center.md
plan: ../../../plans/04-AI-native-system.md §10
---

# AIE-028-advanced — Marketing agents split

## Objective

Replace monolithic `marketingAgent` with three specialists — all writes → `approval_logs`.

| Agent | Job |
|-------|-----|
| `campaignAgent` | Blast structure, audience |
| `contentAgent` | Copy, subject lines |
| `socialAgent` | Postiz HITL handoff |

## Acceptance criteria

- No auto-send without HITL
- Resend MCP for email (Advanced)
- Agent cap ≤ 12
