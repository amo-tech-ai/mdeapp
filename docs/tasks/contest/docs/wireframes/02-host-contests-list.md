---
title: Host Contest List Wireframe
status: Draft
date: 2026-06-03
screen_id: CONT-WF-02
path: /host/contests
persona: Roberto
task: CTEST-006
phase: MVP
repo_refs:
  - Existing mdeapp host event flow
  - TanStack Table
code_refs:
  - /home/sk/mdeai/mdeapp/src/components/host/host-event-shell.tsx
  - /home/sk/mdeai/mdeapp/src/components/host/host-nav-rail.tsx
  - /home/sk/mdeai/mdeapp/src/components/ui/badge.tsx
---

# Host Contest List

## Purpose

Roberto scans drafts and published contests, sees setup risks, and jumps to the next action.

## Wireframe

```text
+------------------------------------------------------------------+
| My contests                                             New       |
+--------------------+------------------------------+--------------+
| Filters            | Contest list/table           | Next action  |
| Draft              | Name, date, venue, status    | Publish      |
| Published          | Missing items, vote window   | Edit         |
| Archived           | QR/ticket/vote summary       | View public  |
+--------------------+------------------------------+--------------+
```

## Components And Code To Use

- Adapt host nav shell for organizer IA.
- Use TanStack Table on desktop and stacked `Card` rows on mobile.
- Use shadcn `Button`, `Badge`, `Skeleton`, `DropdownMenu`, `Tooltip`.

## States

No contests, loading, drafts only, published contests, archived contests, role denied, row action error.

## Responsive

Desktop table with pinned actions. Mobile converts each contest to a fixed-height card with status and one primary action.

## Tests / Proof

Empty-state screenshot, role-denied test, keyboard row action test, responsive screenshots.

## Confidence

Medium-high. Requires new contest list data, but UI pattern is straightforward.
