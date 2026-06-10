---
title: Contestant Coach Wireframe
status: Draft
date: 2026-06-03
screen_id: CONT-WF-10
path: /me/contestant-profile/coach
persona: Contestant
task: CTEST-009
phase: MVP
repo_refs:
  - CopilotKit Mastra Integration
  - Mastra
code_refs:
  - /home/sk/mdeai/mdeapp/src/components/chat/chat-canvas.tsx
  - /home/sk/mdeai/mdeapp/src/components/chat/concierge-chat-input.tsx
  - /home/sk/mdeai/mdeapp/src/app/api/copilotkit/[[...path]]/route.ts
  - /home/sk/mdeai/mdeapp/src/mastra/lib/ai-runs.ts
---

# Contestant Coach

## Purpose

The coach guides contestants through profile quality, casting prep, event schedule, and promotion steps.

## Wireframe

```text
+------------------------------------------------------------------+
| Contestant coach                                                  |
+-----------------------------+------------------------------------+
| Chat thread                 | Next steps                         |
| Profile advice              | Complete profile                   |
| Casting preparation         | Upload photos                      |
| Promotion message drafts    | Attend casting / rehearsals        |
+-----------------------------+------------------------------------+
```

## Components And Code To Use

- Adapt existing chat canvas/input components.
- Use CopilotKit actions for profile suggestions and approval cards.
- Log agent runs through existing `ai-runs` pattern.

## States

No profile context, chat loading, answer with citations, action pending, user approval required, model/tool error, saved suggestion.

## Responsive

Mobile prioritizes chat with a `Sheet` for next steps. Desktop uses chat and task sidebar.

## Tests / Proof

Agent action test, approval-required test, ai_runs logging proof, profile update suggestion test, mobile screenshot.

## Confidence

Medium-high. Needs dedicated contest coach prompt/workflow.
