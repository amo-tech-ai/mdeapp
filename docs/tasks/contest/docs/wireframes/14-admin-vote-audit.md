---
title: Admin Vote Audit Wireframe
status: Draft
date: 2026-06-03
screen_id: CONT-WF-14
path: /admin/contests/[id]/votes
persona: Patricia
task: CTEST-006
phase: MVP
repo_refs:
  - Helios Server
  - TanStack Table
code_refs:
  - /home/sk/mdeai/mdeapp/src/lib/supabase/service.ts
  - /home/sk/mdeai/mdeapp/src/components/ui/badge.tsx
  - /home/sk/mdeai/mdeapp/src/components/ui/dialog.tsx
---

# Admin Vote Audit

## Purpose

Patricia reviews vote ledger health, fraud flags, receipt hashes, and tally freeze state.

## Wireframe

```text
+------------------------------------------------------------------+
| Vote audit                              Freeze tally | Export     |
+------------------------------------------------------------------+
| KPI strip: total votes | paid votes | flagged | receipts         |
+------------------------------------------------------------------+
| Vote ledger table: time, contestant, voter hash, source, status  |
| Detail drawer: receipt hash, Stripe event, risk flags, notes      |
+------------------------------------------------------------------+
```

## Components And Code To Use

- Use Helios for receipt/tally concepts only.
- Use TanStack Table and shadcn `Badge`, `Button`, `Dialog`, `Tooltip`, `Skeleton`.
- All vote truth must come from Supabase ledgers/RPCs, not client state.

## States

Loading, no votes, flagged votes, Stripe mismatch, tally frozen, export pending, role denied.

## Responsive

Mobile uses filter cards and detail drawer. Desktop uses dense table with pinned risk/status columns.

## Tests / Proof

Ledger query test, freeze permission test, duplicate/fraud flag rendering, receipt detail test, responsive proof.

## Confidence

Medium. Depends strongly on CTEST-002 ledger design.
