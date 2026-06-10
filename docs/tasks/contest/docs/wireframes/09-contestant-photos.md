---
title: Contestant Photos Wireframe
status: Draft
date: 2026-06-03
screen_id: CONT-WF-09
path: /me/contestant-profile/photos
persona: Contestant
task: CTEST-009
phase: MVP
repo_refs:
  - shadcn components
  - Supabase Storage
code_refs:
  - /home/sk/mdeai/mdeapp/src/lib/supabase/user-scoped.ts
  - /home/sk/mdeai/mdeapp/src/components/ui/dialog.tsx
  - /home/sk/mdeai/mdeapp/src/components/ui/skeleton.tsx
---

# Contestant Photos

## Purpose

Contestants upload profile photos, choose a primary image, and see moderation status before public display.

## Wireframe

```text
+------------------------------------------------------------------+
| Profile photos                                      Upload        |
+---------------------------+--------------------------------------+
| Upload zone               | Photo grid                           |
| Requirements              | Primary, pending, approved, rejected |
| Consent reminder          | Admin notes per rejected photo       |
+---------------------------+--------------------------------------+
```

## Components And Code To Use

- Use shadcn `Button`, `Card`, `Badge`, `Dialog`, `Skeleton`, `Tooltip`.
- Use Supabase Storage with user-owned paths and admin approval before public display.
- Add image aspect-ratio constraints so grid does not shift.

## States

No photos, upload pending, upload failed, pending review, approved, rejected, primary selected, storage quota exceeded.

## Responsive

Mobile two-column photo grid. Desktop four-column grid with side requirements panel.

## Tests / Proof

Upload validation, storage permission test, public-hidden-until-approved test, primary image test, responsive screenshot.

## Confidence

Medium-high. Storage policy proof is required.
