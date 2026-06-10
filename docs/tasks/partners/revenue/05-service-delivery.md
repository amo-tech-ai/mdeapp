---
title: "Service Delivery System"
updated: 2026-06-06
parent: ./00-INDEX.md
---

# Service Delivery System (Part 11)

How a purchased service actually gets done. Pattern = **trigger → task → AI drafts → HITL → execute → track**. One engine (Mastra workflows), many service types.

## Universal delivery loop

```mermaid
flowchart LR
  TRIG["Trigger<br/>lead · purchase · schedule · event"] --> TASK["Task created (queue)"]
  TASK --> DRAFT["AI drafts output"]
  DRAFT --> GATE{"Money / public?"}
  GATE -- yes --> HITL["Partner approves (HITL)"]
  GATE -- no --> EXEC["Execute"]
  HITL --> EXEC
  EXEC --> PUB["Publish / send / book"]
  PUB --> TRACK["Track performance"]
  TRACK --> OPP["Dashboard 'Opportunities' → next action"]
```

## Per-service workflows

**AI marketing package**
```mermaid
flowchart LR
  L["Schedule / event"] --> T["Task"] --> D["AI drafts posts"] --> A["Partner approves"] --> P["Postiz publishes"] --> R["Report (reach/clicks)"]
```

**AI concierge (hotel/venue embed)**
```mermaid
flowchart LR
  G["Guest asks"] --> AI["Concierge (grounded, partner-scoped)"] --> REC["Recommend partner inventory"] --> BOOK["Book / lead"] --> FEE["Fee + guest delight"]
```

**Lead generation service**
```mermaid
flowchart LR
  IN["Inbound lead"] --> Q["AI qualify + score"] --> RT["Route to partner"] --> RP["AI drafts reply"] --> AP["Partner approves/sends"] --> CL["Close → commission"]
```

**Sponsorship delivery**
```mermaid
flowchart LR
  C["Campaign live"] --> MATCH["AI matches events/audience"] --> PLACE["Labeled placements"] --> MEAS["Measure reach/clicks"] --> ROI["ROI report → renew"]
```

**Marketplace order (P3)**
```mermaid
flowchart LR
  O["Order/booking"] --> CONF["Vendor confirms"] --> PAY["Escrow/pay"] --> DEL["Deliver"] --> REV["Review + payout split"]
```

## Notes
- Every workflow is a **Mastra workflow** with retries + compensation (AGT-07/11/15 patterns).
- HITL gate is mandatory on anything public or money.
- Output + metrics logged → dashboard Analytics + Opportunities (closes the loop to upsell).
