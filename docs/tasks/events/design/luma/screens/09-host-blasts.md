---
screen: Host Blasts
screenshots: [host blasts tab — capture needed]
route: /host/marketing (planned)
persona: Roberto
mdeai_status: not-built
linear: SAN-660+
phase: growth
---

# Wireframe — Luma Host Blasts (Email)

## Goals

Send updates to registered guests; track opens (Luma); mdeai = **draft-only AI** + HITL send.

## ASCII

```text
┌─────────────────────────────────────┐
│ Blasts · Fashion Night              │
├─────────────────────────────────────┤
│ [Compose blast]                     │
├─────────────────────────────────────┤
│ Sent · Reminder · Jun 10            │
│ 38% opened · 120 recipients         │
├─────────────────────────────────────┤
│ Draft · Venue change                │
│ [Edit] [Send]                       │
└─────────────────────────────────────┘
```

## Compose modal

```text
Subject: [Reminder: tomorrow 7pm]
Body:    [AI draft — host edits]
Audience:[All guests ▼]
         [Send blast — requires confirm]
```

## mdeai mapping

**Post-MVP.** `marketingAgent` drafts; Postiz/email integration approval-gated per PRD.

## Wireframe prompt

Capture Luma blasts UI — note recipient selector + preview pane.
