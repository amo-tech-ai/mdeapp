---
title: Contest Mermaid Diagrams
status: Draft
date: 2026-05-25
skills:
  - mermaid-diagrams
  - mde-task-lifecycle
---

# Contest Mermaid Diagrams

These diagrams are the first implementation reference for the Miss Medellin Beauty Contest vertical. They keep the build order clear: diagrams, database truth, Supabase/RLS, then CopilotKit/Mastra/Gemini UI workflows.

## 1. MVP Platform Architecture

```mermaid
flowchart TB
  subgraph Personas
    Roberto["Roberto organizer"]
    Contestant["Contestant"]
    Fan["Fan / ticket buyer"]
    Judge["Judge"]
    Patricia["Patricia admin"]
  end

  subgraph UI["Next.js + CopilotKit 1.55.2"]
    Public["/contests/[slug] public page"]
    Vote["/contests/[slug]/vote"]
    Host["/host/contests/new"]
    Admin["/admin/contests"]
    Tickets["/me/tickets"]
    Sponsor["/sponsors"]
  end

  subgraph Runtime["/api/copilotkit Pattern 1"]
    CK["CopilotRuntime"]
    AGUI["@ag-ui/mastra"]
    Mastra["Mastra local agents"]
    Gemini["Gemini model"]
  end

  subgraph Truth["Supabase PostgreSQL"]
    ContestDB[("contests / rounds / contestants")]
    VoteDB[("vote_ledger / vote_windows")]
    ScoreDB[("judge_scores / score_snapshots")]
    MoneyDB[("ticket_orders / paid_vote_orders")]
    ApprovalDB[("approvals / audit_events / ai_runs")]
  end

  subgraph External
    Stripe["Stripe Checkout + webhooks"]
    WhatsApp["WhatsApp provider"]
    Maps["Google Maps / Places later"]
    OpenClaw["OpenClaw post-MVP"]
    Postiz["Postiz post-MVP"]
  end

  Roberto --> Host
  Contestant --> Public
  Fan --> Public
  Fan --> Vote
  Fan --> Tickets
  Judge --> Admin
  Patricia --> Admin
  Host --> CK
  Admin --> CK
  CK --> AGUI --> Mastra --> Gemini
  UI --> Truth
  Mastra --> ApprovalDB
  Stripe --> MoneyDB
  WhatsApp --> Public
  Mastra -.post-MVP draft only.-> OpenClaw
  Mastra -.approved campaigns only.-> Postiz
  Mastra -.grounded geo.-> Maps
```

## 2. Correct Task Sequence

```mermaid
flowchart TD
  D0["CTEST-000 diagrams + repo decisions"] --> D1["CTEST-001 Supabase core schema"]
  D1 --> D2["CTEST-002 voting + scoring ledgers"]
  D2 --> D3["CTEST-003 tickets + paid votes schema"]
  D3 --> D4["CTEST-004 CopilotKit contest workspace"]
  D4 --> D5["CTEST-005 Mastra + Gemini workflows"]
  D5 --> D6["CTEST-006 screens + wireframes"]
  D6 --> D7["CTEST-007 Playwright proof gates"]

  D1 --> RLS["RLS + SQL proof"]
  D2 --> VOTE["Duplicate/late/closed vote tests"]
  D3 --> STRIPE["Stripe webhook idempotency tests"]
  D4 --> HITL["Approval card tests"]
  D5 --> AI["AI evals: draft-only sensitive actions"]
  D6 --> UI["Browser route proof"]
  D7 --> DONE["Done gate evidence"]
```

## 3. Vote Truth Flow

```mermaid
sequenceDiagram
  participant Fan
  participant UI as Vote UI
  participant API as Vote API/RPC
  participant DB as Supabase
  participant Admin as Patricia
  participant AI as votingIntegrityAgent

  Fan->>UI: Select contestant and submit vote
  UI->>API: POST vote token + contestant_id
  API->>DB: validate window, token, rate limits
  alt valid vote
    API->>DB: insert vote_ledger append-only row
    DB-->>API: receipt hash
    API-->>UI: accepted + receipt
  else invalid vote
    API->>DB: insert vote_fraud_signals/audit event
    API-->>UI: rejected reason
  end
  DB-->>AI: read anomaly summary
  AI-->>Admin: recommend review only
  Admin->>DB: approve/reject review decision
```

## 4. Stripe Paid Vote / Ticket Fulfillment

```mermaid
sequenceDiagram
  participant Fan
  participant UI as Checkout UI
  participant API as Checkout API
  participant Stripe
  participant Webhook as Stripe webhook
  participant DB as Supabase

  Fan->>UI: Buy VIP ticket or paid vote pack
  UI->>API: create checkout session
  API->>DB: create pending order
  API->>Stripe: create Checkout Session
  Stripe-->>Fan: hosted checkout
  Stripe->>Webhook: checkout.session.completed
  Webhook->>Webhook: verify signature + idempotency key
  Webhook->>DB: mark paid + issue QR/vote credits
  DB-->>Webhook: committed audit event
  Webhook-->>Stripe: 2xx
  Fan->>UI: returns to success page
  UI->>DB: read webhook-derived paid state
```

## 5. CopilotKit + Mastra Approval Flow

```mermaid
sequenceDiagram
  participant Roberto
  participant CK as CopilotKit UI
  participant API as /api/copilotkit
  participant Mastra
  participant Gemini
  participant DB as Supabase
  participant Patricia

  Roberto->>CK: "Create Miss Medellin finals"
  CK->>API: AG-UI run
  API->>Mastra: local contestHostAgent
  Mastra->>Gemini: draft structured contest setup
  Gemini-->>Mastra: JSON draft
  Mastra->>DB: insert approval request + ai_run
  Mastra-->>CK: render approval card
  Patricia->>CK: approve/edit/reject
  CK->>DB: commit only through approved API/RPC
  DB-->>CK: published draft or change request
```

## 6. Screen Map

```mermaid
flowchart LR
  Home["/"] --> HostNew["/host/contests/new"]
  HostNew --> HostList["/host/contests"]
  HostList --> PublicContest["/contests/[slug]"]
  PublicContest --> Vote["/contests/[slug]/vote"]
  PublicContest --> Contestant["/contests/[slug]/contestants/[id]"]
  PublicContest --> Checkout["Stripe Checkout"]
  Checkout --> Tickets["/me/tickets"]
  Admin["/admin/contests"] --> Fraud["/admin/contests/[id]/votes"]
  Admin --> Scores["/admin/contests/[id]/scores"]
  Sponsors["/sponsors"] --> Proposal["/sponsors/proposals/[id]"]
```

## 7. Post-MVP Boundaries

```mermaid
flowchart TD
  MVP["MVP: contest + voting + tickets + judging + sponsor drafts"] --> Stable["Proof gates green"]
  Stable --> Live["OpenStreamPoll-style live overlays"]
  Stable --> Geo["ADK/Maps sponsor geo discovery"]
  Stable --> Social["Postiz approved scheduling"]
  Stable --> Scrape["OpenClaw lead enrichment"]
  Scrape --> Approval["Human approval required"]
  Social --> Approval
  Geo --> Approval
  Live --> Producer["Producer approval before public overlay"]
```
