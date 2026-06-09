---
title: Luma → mdeai — Mermaid Diagrams
date: 2026-06-08
skill: mermaid-diagrams
parent: ./luma-analysis-master.md
---

# Luma → mdeai Diagrams

Validated syntax for GitHub/Linear markdown. Split by concept — do not merge into one mega-diagram.

---

## 1. Information architecture (Luma)

```mermaid
flowchart TD
  subgraph Public["Public — Discovery"]
    D[Discover Home]
    D --> E[Events Feed]
    D --> C[Calendars]
    D --> CT[Cities]
    D --> CAT[Categories]
  end

  subgraph Event["Event Page"]
    EP[Event Detail]
    EP --> OV[Overview]
    EP --> REG[Registration]
    EP --> TIX[Tickets]
    EP --> LOC[Location]
    EP --> HOSTS[Hosts]
    EP --> COM[Community]
    EP --> GUESTS[Guests preview]
  end

  subgraph Host["Host OS"]
    HO[Host Dashboard]
    HO --> HOV[Overview]
    HO --> HG[Guests]
    HO --> HREG[Registration]
    HO --> BL[Blasts]
    HO --> INS[Insights]
    HO --> SET[Settings]
  end

  subgraph Profile["Profile"]
    P[Me]
    P --> PH[Hosting]
    P --> PA[Attending]
    P --> PP[Past Events]
  end

  E --> EP
  PH --> HO
  PA --> EP
```

---

## 2. mdeai events IA (target)

```mermaid
flowchart TD
  subgraph Consumer["Consumer — LIVE partial"]
    HOME["/ — concierge chat"]
    EV["/events browse"]
    DET["/events/slug"]
    WAL["/me/tickets"]
  end

  subgraph Host["Host — LIVE partial"]
    WIZ["/host/event/new wizard"]
    LIST["/host/events list"]
    ANA["/host/analytics — spec"]
  end

  subgraph AI["AI layer"]
    CON["conciergeAgent"]
    HE["hostEventAgent"]
    OPS["hostOpsAgent — planned"]
  end

  HOME --> CON
  HOME --> DET
  EV --> DET
  DET --> WAL
  WIZ --> HE
  LIST --> OPS
  ANA --> OPS
```

---

## 3. Three-panel architecture

```mermaid
flowchart LR
  subgraph P1["Panel 1 — Discovery"]
    S[Search]
    F[Feed / categories]
    CI[City filter]
  end

  subgraph P2["Panel 2 — Event experience"]
    ED[Detail]
    CH[Checkout]
    MAP[Map + nearby]
    SOC[Social proof]
  end

  subgraph P3["Panel 3 — Host OS"]
    MGMT[Event management]
    CRM[Guests]
    MKT[Blasts]
    KPI[Insights]
  end

  P1 --> P2
  P2 --> P3
```

**mdeai mapping:** Panel 1 = `/` + `/events` · Panel 2 = `/events/[slug]` + map column on chat · Panel 3 = `/host/*` + Copilot sidebar ([`01a-copilotkit-mastra-plan.md`](01a-copilotkit-mastra-plan.md)).

---

## 4. Camila — discover to attend

```mermaid
sequenceDiagram
  participant C as Camila
  participant Chat as CopilotChat
  participant Agent as conciergeAgent
  participant Page as Event detail
  participant DB as Supabase

  C->>Chat: salsa events this weekend Poblado
  Chat->>Agent: tool search_events
  Agent->>DB: hybrid_search_events
  DB-->>Agent: event rows
  Agent-->>Chat: event cards + map pins
  C->>Page: open card / slug link
  Page-->>C: hero host vibe map CTA
  C->>Page: Register / Buy
  Note over C,Page: Wallet + QR on /me/tickets
```

---

## 5. Andrés — paid checkout

```mermaid
sequenceDiagram
  participant A as Andrés
  participant Detail as /events/slug
  participant API as /api/tickets/checkout
  participant Stripe as Stripe Checkout
  participant WH as webhook finalize
  participant Wallet as /me/tickets

  A->>Detail: Select tier + Buy
  Detail->>API: POST checkout session
  API->>Stripe: create session
  Stripe-->>A: hosted checkout
  A->>Stripe: pay
  Stripe->>WH: checkout.session.completed
  WH->>Wallet: ticket + QR row
  Wallet-->>A: show QR at door
```

---

## 6. Roberto — create to analyze

```mermaid
flowchart TD
  A[Open /host/event/new] --> B[hostEventAgent chat + wizard]
  B --> C[set_event_basics venue tiers]
  C --> D[HITL preview_and_publish]
  D --> E{Approved?}
  E -->|Yes| F[Supabase events row]
  E -->|No| B
  F --> G[/host/events list]
  G --> H[/host/analytics — planned]
  H --> I[hostOpsAgent Q&A]
  I --> J[salesInsightWorkflow]
```

---

## 7. Event detail content flow (Luma sections)

```mermaid
flowchart TD
  H[Hero image + title] --> M[Meta date venue price]
  M --> HB[Host block]
  HB --> V[Vibe tags]
  V --> AI[AI summary]
  AI --> ATT[Attendee social proof]
  ATT --> ABT[About + agenda]
  ABT --> TIX[Ticket tiers]
  TIX --> ASK[Ask Host]
  ASK --> MAP[Map + nearby]
  MAP --> STK[Sticky CTA]

  style STK fill:#e8f5e9
```

Maps to PAGE-003b section order.

---

## 8. Host dashboard tabs (Luma vs mdeai)

```mermaid
stateDiagram-v2
  [*] --> Overview
  Overview --> Guests: tab
  Overview --> Registration: tab
  Overview --> Blasts: tab
  Overview --> Insights: tab
  Overview --> Settings: tab

  note right of Overview
    mdeai: /host/events (LIVE)
  end note
  note right of Insights
    mdeai: /host/analytics (SAN-729)
  end note
  note right of Blasts
    mdeai: post-MVP marketing
  end note
```

---

## 9. MVP vs growth roadmap

```mermaid
gantt
  title Luma-inspired mdeai rollout
  dateFormat YYYY-MM-DD
  section MVP
  Event detail layout EVP-032     :a1, 2026-06-08, 14d
  Vibe + AI summary EVP-033       :a2, after a1, 10d
  Ask Host EVP-034                :a3, after a2, 10d
  Attendee proof EVP-035          :a4, after a2, 10d
  section Host ops
  hostOpsAgent + analytics        :b1, 2026-06-15, 21d
  section Growth
  Map nearby EVP-036              :c1, after a4, 14d
  Community links EVP-044         :c2, after c1, 7d
  Host blasts                     :c3, 2026-08-01, 21d
```

---

## 10. Data ownership (non-negotiable)

```mermaid
flowchart LR
  subgraph Truth
    SB[(Supabase events tickets orders)]
    ST[Stripe payments]
  end

  subgraph AI
    GK[Gemini drafts]
    MA[Mastra agents]
  end

  subgraph UI
    CK[CopilotKit cards]
    NX[Next.js pages]
  end

  MA --> GK
  MA --> SB
  CK --> MA
  NX --> SB
  NX --> ST
  GK -.->|draft only| NX
```

AI never publishes or mutates paid state without HITL.
