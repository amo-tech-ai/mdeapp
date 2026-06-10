# Mastra Booking Audit — Architecture Diagrams

**Stack context:** mdeapp = Next.js 16 · CopilotKit 1.55.2 · Mastra in-process · Gemini 3.5 Flash · Supabase

---

## 1. Audited repos — actual architectures

### care-connect (closest booking pattern)

```mermaid
flowchart TD
  U[User in Mastra Studio]
  A[Sophia careConnectAgent]
  T1[doctorAvailabilityTool]
  T2[bookAppointmentTool]
  T3[agentGuidelinesTool RAG]
  S1[DoctorService]
  S2[AppointmentService]
  R1[DoctorRepository]
  R2[PatientRepository]
  R3[AppointmentRepository]
  PG[(PostgreSQL + pgvector)]
  OLL[Ollama llama3.2]

  U --> A
  A --> OLL
  A --> T1 & T2 & T3
  T1 --> S1 --> R1 --> PG
  T2 --> S2 --> R2 & R3 --> PG
  T3 --> PG
```

### mastra-hotel-booking-ai-agent (partial LiteAPI)

```mermaid
flowchart TD
  U[User in Mastra Studio]
  A[hotelBookingAgent GPT-4]
  T1[searchHotels]
  T2[getHotelDetails]
  T3[checkAvailability]
  T4[createBooking UNWIRED]
  API[LiteAPI v3.0]

  U --> A
  A --> T1 & T2 & T3
  T1 & T2 & T3 --> API
  T4 -.->|not on agent| API
```

### a2a-mastra-demo (delegation only)

```mermaid
flowchart TD
  U[User]
  R[travelReceptionistAgent]
  T1[a2a-get-agent-card]
  T2[a2a-send-message]
  T3[a2a-create-task]
  AGNO[External Agno A2A Server]
  H[hotel-booking-agent external]
  F[flight-booking-agent external]

  U --> R
  R --> T1 & T2 & T3
  T2 & T3 --> AGNO
  AGNO --> H & F
```

### Misnamed repos (not booking)

```mermaid
flowchart LR
  subgraph wrong["Prior audit assumed booking"]
    G[guest-booking-assistant]
    B[Booksy-Agent]
    AB[a2a-book-agent]
    M[mastravel]
  end
  G --> E1[Podcast email + Layercode voice]
  B --> E2[Reading library tracker]
  AB --> E3[Gutenberg excerpts]
  M --> E4[Static HTML in README]
```

---

## 2. mdeai MVP — recommended (Phase 1)

Aligns with [`docs/tasks/venues/docs/02-booking-whatsapp.md`](../../tasks/venues/docs/02-booking-whatsapp.md).

```mermaid
sequenceDiagram
  autonumber
  participant U as Tourist / Carlos
  participant CK as CopilotKit /chat
  participant M as conciergeAgent
  participant T as requestVenueBooking tool
  participant DB as venue_booking_requests
  participant P as Patricia admin

  U->>CK: Book table for 4 Friday 8pm at Mamasita
  M->>M: Slot fill party_size date time venue
  M->>CK: HITL confirm card renderAndWaitForResponse
  U->>CK: Send Request
  CK->>T: confirmed payload
  T->>DB: INSERT status=pending source=agent
  T->>CK: bookingRequestId + honest copy
  P->>DB: review queue approve draft WhatsApp
```

---

## 3. mdeai Phase 2 — multi-agent (adapt from a2a-mastra-demo)

```mermaid
flowchart TD
  U[User /chat]
  BA[Booking Agent conciergeAgent]
  AA[Availability Agent]
  NA[Notification Agent]
  CRM[CRM Agent Patricia queue]
  DB[(Supabase)]
  WA[WhatsApp outbox]

  U --> BA
  BA -->|check slots| AA
  AA -->|Places / partner API| DB
  BA -->|insert request| DB
  BA -->|draft message| NA
  NA --> CRM
  CRM -->|HITL approve| WA
```

---

## 4. mdeai Phase 3 — OpenClaw automation

From [`docs/restaurant/04-openclaw.md`](../../restaurant/04-openclaw.md) — **post-MVP only**.

```mermaid
flowchart TD
  U[User]
  M[Mastra Agent]
  OC[OpenClaw Agent]
  OT[OpenTable / Resy monitor]
  BR[Browser automation]
  WA[WhatsApp staff]
  DB[(venue_booking_requests)]
  P[Patricia HITL]

  U --> M
  M --> OC
  OC --> OT & BR
  OC -->|availability signal| M
  M --> DB
  P --> WA
  WA -->|venue confirms| DB
```

**Rule:** OpenClaw never auto-confirms without Patricia approval in Phase 1–2.

---

## 5. Component map — what to copy from which repo

```mermaid
flowchart LR
  subgraph mdeai["mdeai build"]
    CORE[venue-booking-core.ts]
    TOOL[requestVenueBooking tool SAN-299]
    CK[CopilotKit HITL SAN-302]
  end
  subgraph copy["Copy patterns from"]
    CC[care-connect tool→service→repo]
    HOT[mastra-hotel errorHandler + Zod tools]
    GEM[Sol_Basic Gemini prompt guardrails]
    A2A[a2a-mastra-demo Phase 2 delegation]
  end
  CC --> TOOL
  HOT --> TOOL
  GEM --> TOOL
  A2A -.->|Phase 2| TOOL
  CORE --> TOOL
  TOOL --> CK
```
