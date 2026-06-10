---
title: Event Creation Journeys
screens: [009, 010, 025, 021]
---

# Event Creation · Publishing · Approval Journeys

## Creation (AI replaces forms)

```mermaid
flowchart TD
  U[Roberto: NL prompt] --> A[hostEventAgent]
  A --> B[set_event_basics]
  B --> C[set_venue Places]
  C --> D[add_ticket_tier]
  D --> E[Live preview right panel]
  E --> F[preview_and_publish]
```

## Publishing

```mermaid
sequenceDiagram
  participant R as Roberto
  participant UI as Wizard
  participant HITL as Approval panel
  participant API as approval-commit
  participant DB as Supabase

  R->>UI: Preview looks good
  UI->>HITL: renderAndWaitForResponse
  R->>HITL: Approve
  HITL->>API: POST commit
  API->>DB: insert events
  DB-->>UI: slug redirect
```

## Approval (sensitive edits)

```mermaid
flowchart TD
  A[Change price or refund] --> B[hostOpsAgent proposal]
  B --> C[HITL panel]
  C --> D{Approved?}
  D -->|Yes| E[approval_logs + write]
  D -->|No| F[Reject state]
```

Traditional vs AI:

| Step | Traditional | AI native |
|------|-------------|-----------|
| Basics | 12 form fields | One chat sentence |
| Venue | Manual address | Places + compare table |
| Tiers | 3 screens | `add_ticket_tier` tool |
| Publish | Submit button | HITL confirm |
