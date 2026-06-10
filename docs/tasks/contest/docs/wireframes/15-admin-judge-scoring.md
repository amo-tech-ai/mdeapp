---
title: Admin Judge Scoring Wireframe
status: Draft
date: 2026-06-03
screen_id: CONT-WF-15
path: /admin/contests/[id]/scores
persona: Judge / Patricia
task: CTEST-006
phase: MVP
repo_refs:
  - PageantOS product reference
  - TanStack Table
code_refs:
  - /home/sk/mdeai/mdeapp/src/components/ui/input.tsx
  - /home/sk/mdeai/mdeapp/src/components/ui/button.tsx
  - /home/sk/mdeai/mdeapp/src/lib/supabase/user-scoped.ts
---

# Admin Judge Scoring

## Purpose

Judges enter round scores and Patricia locks the score set after review.

## Wireframe

```text
+------------------------------------------------------------------+
| Judge scoring                              Round | Lock scores    |
+-----------------------------+------------------------------------+
| Contestant list             | Score grid                         |
| Filter by division/round    | Criteria columns, comments, save   |
| Status: complete/incomplete | Totals, lock warning, audit notes  |
+-----------------------------+------------------------------------+
```

## Components And Code To Use

- Use React Hook Form/Zod for score entry and numeric bounds.
- Use shadcn `Input`, `Button`, `Card`, `Badge`, `Dialog`, `Tooltip`.
- Use PageantOS only as product reference for pageant scoring shape.

## States

No round selected, unsaved scores, validation error, judge submitted, score locked, Patricia override, role denied.

## Responsive

Mobile uses contestant-by-contestant scoring cards. Desktop uses a grid/table with sticky contestant column.

## Tests / Proof

Numeric bounds test, judge ownership/role test, lock prevents edits, audit entry proof, responsive screenshot.

## Confidence

Medium. Needs scoring schema and judge role model.
