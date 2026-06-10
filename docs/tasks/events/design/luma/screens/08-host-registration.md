---
screen: Host Registration
screenshots: [host registration tab — capture needed]
route: /host/event/new (wizard)
persona: Roberto
mdeai_status: partial
---

# Wireframe — Luma Host Registration Config

## Goals

Configure registration fields, capacity, approval mode, ticket tiers.

## ASCII — Luma registration tab

```text
┌─────────────────────────────────────┐
│ Registration settings               │
├─────────────────────────────────────┤
│ Capacity: [250]                     │
│ Approval: [Auto ▼]                  │
├─────────────────────────────────────┤
│ Form fields                         │
│ ☑ Name  ☑ Email  ☐ Phone            │
├─────────────────────────────────────┤
│ Ticket types                        │
│ GA $25 · 200 cap                    │
│ VIP $80 · 50 cap                    │
│ [+ Add tier]                        │
└─────────────────────────────────────┘
```

## ASCII — mdeai wizard (LIVE)

```text
Steps: Basics → Venue → Tickets → Preview → HITL Publish
Tool: add_ticket_tier via hostEventAgent + form
```

## mdeai mapping

| Luma | mdeai | Status |
|------|-------|--------|
| Tier editor | wizard tickets step | 🟢 |
| Custom fields | limited | 🟡 |
| Capacity | DB column | 🟢 |
| Approval mode | HITL publish | 🟢 |

## Wireframe prompt

Diff Luma registration tab vs mdeapp host wizard ticket step.
