# Events UI — flow diagrams

**Updated:** 2026-06-08 · **Checklist:** [`../prompts/03-checklist.md`](03-checklist.md)

---

## 1. Events UI route map

```mermaid
flowchart TB
  subgraph Consumer
    HOME["/  /chat"]
    BROWSE["/events"]
    DETAIL["/events/slug"]
    WALLET["/me/tickets"]
    QR["/me/tickets/id"]
  end
  subgraph Host
    WIZ["/host/event/new"]
    LIST["/host/events"]
    ANALYTICS["/host/analytics ⚪"]
  end
  subgraph Overlays
    CARD[Event card]
    CHECKOUT[Checkout modal]
    HITL[Approval panel]
  end
  HOME --> CARD --> DETAIL
  BROWSE --> DETAIL
  DETAIL --> CHECKOUT --> WALLET --> QR
  WIZ --> HITL --> LIST
  LIST --> DETAIL
```

---

## 2. Buyer ticket journey (Andrés)

```mermaid
sequenceDiagram
  participant A as Andrés
  participant Chat as /chat
  participant Detail as /events/slug
  participant Stripe as Stripe Checkout
  participant Wallet as /me/tickets

  A->>Chat: Salsa this weekend
  Chat->>A: Event cards + map pins
  A->>Detail: Open event
  Detail->>A: Ticket tiers + Buy CTA
  A->>Stripe: Checkout session
  Stripe->>Wallet: Paid → QR ticket
  A->>Wallet: Show QR at door
```

---

## 3. Host publish journey (Roberto)

```mermaid
sequenceDiagram
  participant R as Roberto
  participant Wiz as /host/event/new
  participant Agent as hostEventAgent
  participant HITL as ApprovalPanel
  participant API as /api/approval-commit
  participant DB as Supabase events
  participant List as /host/events

  R->>Wiz: Jazz night Friday, 200 cap
  Wiz->>Agent: NL → EventDraftState
  Agent->>HITL: preview_and_publish
  R->>HITL: Approve
  HITL->>API: commit
  API->>DB: insert row organizer_id
  R->>List: See published event
```

---

## 4. Discovery approval — future (Patricia)

```mermaid
flowchart LR
  Q[Camila query] --> WF[eventDiscoveryWorkflow]
  WF --> WEB[Web grounding]
  WEB --> CARD[Discovery card cited]
  CARD --> HITL[Human approval]
  HITL -->|Approve| DB[(public.events)]
  HITL -->|Reject| AUDIT[Audit log]
  DB --> CHAT[Live in chat + /events]
```

**Linear:** SAN-119 → SAN-128 → SAN-129

---

## 5. Venue booking — future (Roberto + Patricia)

```mermaid
flowchart TB
  REST[Restaurant card] --> CTA[Event Venue CTA]
  CTA --> PANEL[Offerings panel]
  PANEL --> MODAL[Proposal modal HITL]
  MODAL --> WF[eventVenueBookingWorkflow]
  WF --> ADMIN[Patricia admin queue]
  ADMIN -->|Confirm| TRIP[Add to trip SAN-503]
  WIZ2[Host wizard venue step] --> PANEL
```

**Linear:** SAN-492 → SAN-494–502

---

## Missing workflow matrix

| Workflow | Trigger | Status | Linear |
|----------|---------|--------|--------|
| Event DB search | Chat query | 🟢 LIVE | EVP-005 |
| Host publish | HITL approve | 🟢 LIVE | SAN-366 |
| Ticket checkout | Buy CTA | 🟢 LIVE | EVP-002 |
| Web discovery | Stale catalog | ⚪ Stub | SAN-125 |
| Discovery save | Patricia approve | ⚪ | SAN-129 |
| Venue booking | Proposal modal | ⚪ | SAN-501 |
| Social promo draft | Host publish | ⚪ | SAN-133 |
