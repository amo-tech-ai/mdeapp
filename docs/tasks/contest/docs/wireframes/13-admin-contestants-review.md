---
title: Admin Contestants Review Wireframe
status: Draft
date: 2026-06-03
screen_id: CONT-WF-13
path: /admin/contests/[id]/contestants
persona: Patricia
task: CTEST-008
phase: MVP
repo_refs:
  - Firecrawl
  - TanStack Table
code_refs:
  - /home/sk/mdeai/mdeapp/src/mastra/lib/search-logs.ts
  - /home/sk/mdeai/mdeapp/src/components/ui/dialog.tsx
  - /home/sk/mdeai/mdeapp/src/components/ui/badge.tsx
---

# Admin Contestants Review

## Purpose

Patricia reviews applications, profile extractions, media, and public profile approval.

## Wireframe

```text
+--------------------------------------------------------------------------------+
| Contestants review                                      Filter | Bulk action     |
+------------------------------+-------------------------------------------------+
| Applicant table              | Review drawer                                   |
| Name, division, status       | Profile fields, public URL evidence            |
| Extraction risk flags        | Photos, consent, admin notes, approve/reject    |
+------------------------------+-------------------------------------------------+
```

## Components And Code To Use

- Use TanStack Table for desktop review queue.
- Use shadcn `Sheet`, `Dialog`, `Badge`, `Button`, `Textarea`, `Skeleton`.
- Show Firecrawl/OpenClaw extraction source and risk flags before approval.

## States

No applications, pending review, extraction flagged, photo rejected, approved, rejected, role denied, save note failed.

## Responsive

Mobile list opens full-height `Sheet` for review. Desktop uses table plus side drawer.

## Tests / Proof

Role gate, approve/reject transitions, extraction source display, private-field redaction, mobile drawer screenshot.

## Confidence

Medium-high. Needs extraction schema and RLS proof.
