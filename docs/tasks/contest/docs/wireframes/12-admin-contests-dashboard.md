---
title: Admin Contests Dashboard Wireframe
status: Draft
date: 2026-06-03
screen_id: CONT-WF-12
path: /admin/contests
persona: Patricia
task: CTEST-006
phase: MVP
repo_refs:
  - TanStack Table
  - shadcn components
code_refs:
  - /home/sk/mdeai/mdeapp/src/components/ui/card.tsx
  - /home/sk/mdeai/mdeapp/src/components/ui/badge.tsx
  - /home/sk/mdeai/mdeapp/src/lib/supabase/service.ts
---

# Admin Contests Dashboard

## Purpose

Patricia monitors all contests, approvals, vote windows, sponsor tasks, and operational risk.

## Wireframe

```text
+------------------------------------------------------------------+
| Admin contests                         Filters | Export          |
+------------------------------------------------------------------+
| KPI strip: drafts | applications | votes | revenue | risk        |
+------------------------------------------------------------------+
| Contest table: name, status, applicants, votes, tickets, actions |
+------------------------------------------------------------------+
```

## Components And Code To Use

- Use TanStack Table for filtering/sorting/pagination.
- Use shadcn `Card`, `Badge`, `Button`, `DropdownMenu`, `Skeleton`.
- Use Supabase service/server helpers only in server-protected admin routes.

## States

Loading, no contests, high-risk contest, export pending, role denied, stale data warning.

## Responsive

Mobile shows KPI cards and contest cards with compact actions. Desktop uses dense table.

## Tests / Proof

Admin role gate, table filter/sort, export action guard, empty state, responsive screenshots.

## Confidence

Medium-high. Requires admin role schema/RLS.
