---
title: Host Contest Wizard Wireframe
status: Draft
date: 2026-06-03
screen_id: CONT-WF-01
path: /host/contests/new
persona: Roberto
task: CTEST-006
phase: MVP
repo_refs:
  - CopilotKit Mastra Integration
  - Existing mdeapp host event flow
code_refs:
  - /home/sk/mdeai/mdeapp/src/app/host/event/new/page.tsx
  - /home/sk/mdeai/mdeapp/src/components/host/host-event-shell.tsx
  - /home/sk/mdeai/mdeapp/src/components/host/host-event-form.tsx
  - /home/sk/mdeai/mdeapp/src/components/host/host-event-copilot-bridge.tsx
---

# Host Contest Wizard

## Purpose

Roberto creates a contest draft with AI assistance, approves generated setup suggestions, and reaches a publish-ready review state.

## Wireframe

```text
+--------------------------------------------------------------------------------+
| Header: New contest                                      Save draft | Review    |
+----------------------+-------------------------------------+-------------------+
| Steps                | Wizard form                         | Copilot assistant |
| Basics               | Name, slug, description             | Setup summary     |
| Venue/date           | Venue, schedule, casting dates      | Missing fields    |
| Divisions/rounds     | Categories, judging rounds          | Approval cards    |
| Tickets/voting       | Ticket tiers, vote window, pricing  | Suggested rules   |
| Review               | Public preview, risk checklist      | Publish advice    |
+----------------------+-------------------------------------+-------------------+
```

## Components And Code To Use

- Adapt the host event shell and workflow strip for the left step rail and review state.
- Use shadcn `Card`, `Button`, `Input`, `Label`, `Badge`, `Sheet`, `Skeleton`, and add `Form`, `Field`, `Textarea`, `Select`, `Tabs`.
- Use React Hook Form and Zod for validation.
- Use CopilotKit `useCoAgent` and `useCopilotAction` patterns through the existing Copilot bridge.

## States

Loading draft, empty new draft, invalid fields, Copilot suggestion pending, approval required, save failed, publish blocked, publish-ready.

## Responsive

Desktop uses three columns. Tablet collapses assistant below the form. Mobile uses step tabs and a bottom `Sheet` for assistant/review.

## Tests / Proof

Route smoke, form validation tests, Copilot approval card rendering, mobile screenshot at `375`, desktop screenshot at `1440`.

## Confidence

High. The existing host event flow is the correct local code pattern.
