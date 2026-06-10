---
title: Sponsor CRM Wireframe
status: Draft
date: 2026-06-03
screen_id: CONT-WF-16
path: /sponsors
persona: Patricia
task: CTEST-006
phase: MVP
repo_refs:
  - TanStack Table
  - React Email
code_refs:
  - /home/sk/mdeai/mdeapp/src/components/ui/card.tsx
  - /home/sk/mdeai/mdeapp/src/components/ui/dropdown-menu.tsx
  - /home/sk/mdeai/mdeapp/src/mastra/lib/ai-runs.ts
---

# Sponsor CRM

## Purpose

Patricia tracks sponsors, packages, proposal status, and approved outreach next steps.

## Wireframe

```text
+------------------------------------------------------------------+
| Sponsors                                  New sponsor | Proposal  |
+------------------------------------------------------------------+
| Pipeline: Lead | Contacted | Proposal | Approved | Closed        |
+------------------------------------------------------------------+
| Sponsor table/cards: company, contact, tier, status, next action |
+------------------------------------------------------------------+
```

## Components And Code To Use

- Use TanStack Table for pipeline/table mode.
- Use React Email for proposal email templates after approval.
- Use shadcn `Card`, `Badge`, `Button`, `DropdownMenu`, `Dialog`.

## States

No sponsors, draft lead, proposal pending, approved proposal, sent manually, stale follow-up, role denied.

## Responsive

Mobile uses status tabs and sponsor cards. Desktop uses table plus pipeline filters.

## Tests / Proof

Role gate, proposal status transition, table filtering, no autonomous send guard, responsive screenshot.

## Confidence

Medium-high. Sponsor DB fields need final schema.
