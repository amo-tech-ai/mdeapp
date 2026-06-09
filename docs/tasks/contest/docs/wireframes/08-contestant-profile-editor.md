---
title: Contestant Profile Editor Wireframe
status: Draft
date: 2026-06-03
screen_id: CONT-WF-08
path: /me/contestant-profile
persona: Contestant
task: CTEST-009
phase: MVP
repo_refs:
  - shadcn React Hook Form docs
  - CopilotKit Mastra Integration
code_refs:
  - /home/sk/mdeai/mdeapp/src/components/auth/auth-status.tsx
  - /home/sk/mdeai/mdeapp/src/lib/supabase/user-scoped.ts
  - /home/sk/mdeai/mdeapp/src/components/copilot/copilot-kit-provider.tsx
---

# Contestant Profile Editor

## Purpose

Contestants edit the profile that becomes their voting page and see approval/completion status.

## Wireframe

```text
+------------------------------------------------------------------+
| My contestant profile                         Save | Request review|
+-------------------------------+----------------------------------+
| Profile fields                | Completion checklist             |
| Display name, bio, platform   | Photos, consent, event schedule  |
| Division, social URL, contact | Approval status and notes        |
| Promotion message             | Coach shortcut                   |
+-------------------------------+----------------------------------+
```

## Components And Code To Use

- Use shadcn `Form`, `Field`, `Input`, `Textarea`, `Select`, `Button`, `Card`, `Badge`.
- Use Supabase user-scoped helpers for ownership.
- Use CopilotKit only for guided suggestions, never auto-publish.

## States

No application, draft, unsaved changes, validation error, submitted for review, approved, rejected with notes, role denied.

## Responsive

Mobile uses tabs for `Profile`, `Checklist`, and `Review notes`. Desktop uses two columns.

## Tests / Proof

Owner-only access, form validation, save draft, request review, rejected-notes rendering, responsive screenshots.

## Confidence

High. Needs RLS and storage policies from schema tasks.
