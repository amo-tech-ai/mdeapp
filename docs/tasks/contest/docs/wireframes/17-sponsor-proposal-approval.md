---
title: Sponsor Proposal Approval Wireframe
status: Draft
date: 2026-06-03
screen_id: CONT-WF-17
path: /sponsors/proposals/[id]
persona: Patricia
task: CTEST-006
phase: MVP
repo_refs:
  - React Email
  - CopilotKit Mastra Integration
code_refs:
  - /home/sk/mdeai/mdeapp/src/components/approvals/ApprovalPanel.tsx
  - /home/sk/mdeai/mdeapp/src/app/api/approval-commit/route.ts
  - /home/sk/mdeai/mdeapp/src/mastra/lib/ai-runs.ts
---

# Sponsor Proposal Approval

## Purpose

Patricia reviews an AI-generated sponsor proposal, edits terms, approves it, and prepares it for manual send.

## Wireframe

```text
+--------------------------------------------------------------------------------+
| Sponsor proposal                                      Approve | Request changes  |
+------------------------------+-------------------------------------------------+
| Sponsor/account facts        | Proposal preview                                |
| Package, amount, benefits    | Email body, sponsorship slots, terms            |
| AI sources and assumptions   | Approval notes and commit history               |
+------------------------------+-------------------------------------------------+
```

## Components And Code To Use

- Adapt `ApprovalPanel` and approval commit route patterns.
- Use React Email for preview template source.
- Use shadcn `Button`, `Card`, `Textarea`, `Badge`, `Dialog`.

## States

Draft proposal, missing facts, AI draft pending, approval required, approved, change requested, manual-send ready, role denied.

## Responsive

Mobile displays facts and preview as tabs. Desktop uses side-by-side facts and preview.

## Tests / Proof

Approval commit test, no-send-without-approval guard, template preview snapshot, change-request flow, responsive screenshot.

## Confidence

Medium-high. Existing approval infrastructure is a good fit.
