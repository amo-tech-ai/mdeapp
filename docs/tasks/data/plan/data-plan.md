---
title: mdeai data architecture — diagrams + schema roadmap index
date: 2026-05-24
status: active
companion: tasks/audit/19-product-schema-roadmap-audit.md
sources: tasks/data/17-edge-audit.md · tasks/data/18-supabase-audit.md · plan/prd · plan/mvp.md
---

# Data plan — architecture diagrams

Visual companion to [`19-product-schema-roadmap-audit.md`](../audit/19-product-schema-roadmap-audit.md). All diagrams assume **new architecture only** — no AI chat edge functions.

---

## 1. Overall architecture (current → target)

```mermaid
flowchart TB
  subgraph browser["Browser (mdeapp)"]
    CHAT["/chat · CopilotSidebar"]
    CARDS["Generative cards · useCopilotAction"]
    MAP["vis.gl Map · AdvancedMarker · mapId"]
  end

  subgraph vercel["Vercel mdeapp"]
    CK["POST /api/copilotkit"]
    MA["Mastra agents + workflows + tools"]
    ADKCLI["adk-grounding-client HTTP"]
  end

  subgraph sidecar["ADK sidecar :8000"]
    MAPSAG["MapsAgent → Grounding Lite MCP"]
  end

  subgraph google["Google"]
    GEM["Gemini 3.5 Flash"]
    GL["Grounding Lite"]
    PLACES["Places API New + field masks"]
  end

  subgraph supa["Supabase zkwcbyxiwklihegjhuql"]
    PG[("Postgres\n114 public + vote schema")]
    AUTH["Auth · profiles"]
    EDGE["Edge: tickets · leads · webhooks"]
    CACHE["places_*_cache · grounding_quota_log"]
  end

  CHAT --> CK
  CARDS --> CK
  MAP --> CHAT
  CK --> MA
  MA --> GEM
  MA --> ADKCLI --> MAPSAG --> GL
  MA -->|"pg Pool / service role"| PG
  MA --> CACHE
  EDGE --> PG
  MA -.->|"optional enrich"| PLACES
  AUTH --> PG
```

---

## 2. Rentals workflow (Camila)

```mermaid
sequenceDiagram
  participant C as Camila /chat
  participant CK as CopilotKit
  participant CON as conciergeAgent
  participant TR as search-rentals tool
  participant PG as apartments + neighborhoods
  participant UI as RentalCard + map pins
  participant LE as chat-lead-capture edge
  participant LD as leads table

  C->>CK: "2BR Laureles under $80/night"
  CK->>CON: AG-UI turn
  CON->>TR: structured filters
  TR->>PG: SQL SELECT (DATABASE_URL)
  PG-->>TR: ≤5 rows lat/lng/slug
  TR-->>CON: rental cards JSON
  CON-->>CK: tool result + prose
  CK->>UI: useCopilotAction render
  C->>CK: "contact host"
  CK->>LE: POST lead payload
  LE->>LD: INSERT leads
```

---

## 3. Events workflow (Roberto + Andrés)

```mermaid
sequenceDiagram
  participant R as Roberto /host/event/new
  participant HE as hostEventAgent (F33+)
  participant AR as approval_requests
  participant EV as events + event_tickets
  participant A as Andrés buyer
  participant TC as ticket-checkout edge
  participant WH as ticket-payment-webhook
  participant EO as event_orders

  R->>HE: NL describe event
  HE->>EV: draft tools (working memory)
  HE->>AR: preview_and_publish HITL
  R->>AR: approve
  Note over AR,EV: approval-commit edge (F38) not deployed yet
  AR->>EV: publish RPC / edge commit
  A->>TC: Stripe Checkout
  TC->>EO: pending order
  WH->>EO: status=paid + QR
```

---

## 4. Restaurants + tourism workflow

```mermaid
flowchart LR
  subgraph chat["/chat concierge"]
    Q["User query"]
    CON["conciergeAgent"]
  end

  subgraph tools["Mastra tools"]
    SR["search-restaurants"]
    SA["search-attractions"]
    SG["search-grounded-places"]
  end

  subgraph db["Supabase inventory"]
    REST[("restaurants\n44 rows")]
    TOUR[("tourist_destinations\n23 rows")]
  end

  subgraph adk["ADK when inventory miss"]
    GL["Grounding Lite pins"]
  end

  Q --> CON
  CON --> SR --> REST
  CON --> SA --> TOUR
  CON --> SG --> GL
  REST --> PIN["MapPin contract"]
  TOUR --> PIN
  GL --> PIN
  PIN --> MAP["vis.gl AdvancedMarker"]
```

---

## 5. Maps grounding workflow (MAP-002B)

```mermaid
sequenceDiagram
  participant AG as conciergeAgent
  participant T as search-grounded-places
  participant Q as grounding_quota_log
  participant ADK as ADK :8000
  participant GL as Grounding Lite MCP
  participant UI as Map + attribution badge

  AG->>T: NL place query
  T->>Q: increment daily cap
  alt quota exceeded
    Q-->>T: blocked
    T-->>AG: empty + reason
  else allowed
    T->>ADK: POST /v1/grounding/invoke
    ADK->>GL: search_places
    GL-->>ADK: pins + placeUri
    ADK-->>T: strict JSON
    T-->>AG: results + attribution
    AG-->>UI: cards + MAP-002 badge
  end
```

---

## 6. Payments / tickets workflow (W9)

```mermaid
flowchart TB
  BUY["Andrés · event page"]
  TC["ticket-checkout edge"]
  STR["Stripe Checkout"]
  WH["ticket-payment-webhook"]
  IDEM["idempotency_keys"]
  EO["event_orders"]
  ET["event_tickets"]
  VAL["ticket-validate edge"]
  STAFF["Staff PWA scan"]

  BUY --> TC
  TC --> STR
  STR --> WH
  WH --> IDEM
  WH --> EO
  WH --> ET
  STAFF --> VAL
  VAL --> EO
```

---

## 7. Leads / CRM workflow

```mermaid
flowchart LR
  CHAT["/chat CTA"]
  FORM["Marketing form"]
  CLC["chat-lead-capture edge"]
  LFF["lead-from-form edge"]
  RL["rate_limit_hits"]
  LD[("leads")]
  CRM["Patricia /admin"]

  CHAT --> CLC
  FORM --> LFF
  CLC --> RL
  CLC --> LD
  LFF --> LD
  LD --> CRM
```

---

## 8. Agent / tool workflow

```mermaid
flowchart TB
  CK["CopilotKit runtime"]
  subgraph agents["Mastra agents (mdeapp)"]
    ROUTER["routerAgent"]
    CON["conciergeAgent"]
    RENT["rentalAgent"]
    EVT["eventAgent"]
    EVAL["evaluationAgent"]
  end

  subgraph wf["Workflows"]
    RW["rental-search-workflow"]
    EW["event-discovery-workflow"]
    CW["concierge-routing-workflow"]
  end

  subgraph tools["Tools"]
    T1["search-rentals → apartments"]
    T2["search-events → events"]
    T3["search-restaurants"]
    T4["search-attractions"]
    T5["search-grounded-places → ADK"]
    T6["classify-intent"]
  end

  subgraph audit["Audit (no duplicate hot path)"]
    AIR["ai_runs"]
    SPAN["mastra_ai_spans"]
    MSG["mastra_messages"]
  end

  CK --> ROUTER
  ROUTER --> CON
  CON --> T1 & T2 & T3 & T4 & T5
  CON --> RW & EW & CW
  CON --> AIR
  CON --> SPAN
  CON --> MSG
```

---

## 9. Supabase schema ERD (MVP core)

```mermaid
erDiagram
  profiles ||--o{ user_roles : has
  profiles ||--o{ events : hosts
  profiles ||--o{ leads : captures
  neighborhoods ||--o{ apartments : filters
  apartments {
    uuid id PK
    text slug
    numeric latitude
    numeric longitude
    text neighborhood
  }
  events ||--o{ event_tickets : has
  events ||--o{ event_orders : sells
  events ||--o{ event_venues : at
  event_tickets ||--o{ event_orders : tier
  events {
    uuid id PK
    numeric latitude
    numeric longitude
    text maps_url
  }
  restaurants {
    uuid id PK
    numeric latitude
    numeric longitude
    text maps_url
  }
  tourist_destinations {
    uuid id PK
    numeric latitude
    numeric longitude
    text maps_url
  }
  approval_requests ||--o{ approval_decisions : resolves
  leads {
    uuid id PK
    text email
    text source
  }
  ai_runs {
    uuid id PK
    text agent_name
    int duration_ms
  }
  mastra_threads ||--o{ mastra_messages : contains
  places_search_cache {
    text cache_key PK
    jsonb payload
  }
  place_details_cache {
    text place_id PK
    jsonb payload
  }
  grounding_quota_log {
    date quota_date PK
    int count
  }
```

---

## 10. Schema roadmap phases

| Phase | Weeks | Schema focus | Edge focus |
|-------|-------|--------------|------------|
| **MVP** | W1–10 | `apartments`, `events*`, `restaurants`, `tourist_destinations`, `leads`, `mastra_*`, cache tables, `ai_runs` | `chat-lead-capture`, `ticket-*`, deploy `approval-commit` |
| **Post-MVP** | W11–18 | `showings`, `rental_applications`, `saved_places`, eval tables | `event-staff-link-generator`, optional `places-proxy` |
| **Advanced** | W19+ | `vote.*` contests, sponsor stack, WhatsApp | Phase B delete legacy sponsor/OpenClaw fns |
| **Cutover cleanup** | After MVP proof | Drop `rentals`, `agent_*`, freeze `conversations`/`messages` | Phase B delete 27 legacy edges |

**Full table grades:** [`19-product-schema-roadmap-audit.md` §8](../audit/19-product-schema-roadmap-audit.md)
