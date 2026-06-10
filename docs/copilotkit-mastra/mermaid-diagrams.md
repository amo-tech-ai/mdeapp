# AI-Native Marketplace — Mermaid Diagrams
> CopilotKit + Mastra + Supabase + Stripe + Google Maps + ADK

---

## Diagram 1 — Full System Architecture

```mermaid
flowchart LR
    subgraph Browser["Browser — Next.js App Router"]
        UI["Three-Panel UI\nLeft: Nav + Saved\nCenter: Chat + Cards\nRight: Map + Detail"]
        CK["CopilotKit 1.55.2\nuseCoAgent\nuseCopilotReadable\nrenderAndWaitForResponse"]
    end

    subgraph APILayer["Next.js API Layer — Vercel Edge"]
        RT["/api/copilotkit\nCopilotRuntime\nExperimentalEmptyAdapter\ngetLocalAgentsWithLogging"]
    end

    subgraph Mastra["Mastra Agent Server :4111"]
        direction TB
        Router["routerAgent\nintent classifier"]
        Agents["Specialist Agents\neventAgent · rentalAgent · venueAgent\nrestaurantAgent · cafeAgent · bookingAgent\ncrmAgent · sponsorAgent · analyticsAgent\nmarketingAgent · mapsAgent"]
        WF["Workflows\ncreateEvent · ticketSetup\nrentalLead · venueBooking\nsponsoryProposal · postEventReport"]
        Mem["Working Memory\nZod MdeState\nLibSQL thread store"]
        Router --> Agents
        Agents --> WF
        Agents --> Mem
    end

    subgraph Data["Data Layer"]
        SB["Supabase\nevents · venues · rentals\nrestaurants · bookings\ntickets · leads · sponsors\nRLS on all tables"]
        STR["Stripe\nCheckout Sessions\nPrice Objects\nWebhooks"]
    end

    subgraph External["External APIs"]
        GM["Google Maps Platform\nPlaces API New\nX-Goog-FieldMask enforced"]
        GEM["Gemini 3.5 Flash\nProduction LLM\nno @anthropic-ai SDK"]
        ADK["Google ADK\nAdvanced geo tools\nPhase 3+"]
        MCP["MCP Servers\nGoogle Maps MCP\nStripe MCP\nResend MCP\nWhatsApp MCP"]
    end

    UI --> CK
    CK -->|AG-UI protocol| RT
    RT -->|MastraAgent bridge| Router
    Agents -->|anon client| SB
    WF -->|ticketSetup| STR
    Agents --> GM
    Router --> GEM
    ADK -->|Phase 3| Agents
    MCP --> Agents
```

---

## Diagram 2 — Consumer User Journey

```mermaid
journey
    title Consumer — Discover, Book, Attend
    section Discovery
        Open app on mobile: 5: Camila
        Type intent in chat: 5: Camila
        Agent returns ranked cards: 4: Camila, conciergeAgent
        View map pins in right panel: 5: Camila
        Ask follow-up question: 5: Camila
    section Evaluation
        Read AI recommendation card: 4: Camila
        Compare two options in chat: 5: Camila, conciergeAgent
        Check venue on map: 5: Camila
        Save to collection: 4: Camila
    section Booking
        Say book it in chat: 5: Camila
        Review HITL approval card: 5: Camila, bookingAgent
        Confirm booking: 5: Camila
        Stripe payment processed: 4: Camila, bookingAgent
        Calendar invite received: 5: Camila
    section Attendance
        Reminder 2 hours before: 5: Camila
        Arrive at venue: 5: Camila
        Check in with QR code: 4: Camila
        Leave rating in chat: 3: Camila
        AI suggests similar event: 4: Camila, conciergeAgent
```

---

## Diagram 3 — Partner User Journey

```mermaid
journey
    title Partner — Onboard, List, Manage, Grow
    section Onboarding
        Open partner signup: 4: Roberto
        Chat with partnerAgent: 5: Roberto, partnerAgent
        Answer 5 AI questions: 5: Roberto, partnerAgent
        AI generates full profile: 5: partnerAgent
        Review and approve profile: 5: Roberto
    section Creating a Listing
        Describe event in one sentence: 5: Roberto
        Agent fills all fields: 5: Roberto, hostEventAgent
        Agent suggests venue options: 4: Roberto, venueAgent
        Select venue via HITL card: 5: Roberto
        Agent suggests ticket tiers: 4: Roberto, hostEventAgent
        Approve and publish: 5: Roberto
    section Managing Bookings
        View booking dashboard: 4: Roberto
        Receive new booking alert: 5: Roberto
        AI drafts attendee reply: 5: Roberto, crmAgent
        Approve and send reply: 5: Roberto
        Move lead to confirmed: 4: Roberto, crmAgent
    section Analytics and Growth
        Ask revenue question in chat: 5: Roberto
        Agent generates chart inline: 5: Roberto, analyticsAgent
        Review post-event report: 4: Roberto, analyticsAgent
        Agent suggests next event: 4: Roberto, marketingAgent
        Approve marketing campaign: 5: Roberto
```

---

## Diagram 4 — Data Flow: Chat to Response

```mermaid
sequenceDiagram
    actor User
    participant Chat as CopilotKit Chat
    participant API as /api/copilotkit
    participant Router as routerAgent
    participant Agent as venueAgent
    participant Tool as search_venues tool
    participant SB as Supabase
    participant Maps as Google Places API
    participant RightPanel as Right Panel Map

    User->>Chat: Find rooftop venues for 200 people in El Poblado
    Chat->>API: POST /api/copilotkit (AG-UI protocol)
    API->>Router: MastraAgent bridge — classify intent
    Router->>Agent: route_to_agent(venueAgent)
    Agent->>Tool: search_venues(type=rooftop, capacity_min=200, location=El_Poblado)
    Tool->>SB: SELECT from venues WHERE capacity_max >= 200 AND city = El Poblado
    SB-->>Tool: 8 owned venues returned
    Tool->>Maps: searchNearby(query=rooftop event venue, fields=[name,photos,rating,price_level])
    Note over Maps: X-Goog-FieldMask applied on every call
    Maps-->>Tool: 6 enriched Place results
    Tool-->>Agent: merged and ranked top 4 venues
    Agent->>Chat: render VenueCard x4 (generative UI via useCopilotAction)
    Agent->>RightPanel: place_pins(4 venue coordinates via useCoAgent state)
    Note over RightPanel: Map updates without page reload
    Chat-->>User: 4 venue cards visible plus 4 map pins
    User->>Chat: Tell me more about Casa Bali
    Agent->>Tool: get_venue_detail(venue_id=casa_bali, fields=[amenities,catering,av,parking])
    Tool->>SB: SELECT from venue_details WHERE id = casa_bali
    SB-->>Tool: full venue record
    Agent->>Chat: render VenueDetailCard (capacity, catering, rate, availability)
```

---

## Diagram 5 — Booking Flow: Request to Payment

```mermaid
sequenceDiagram
    actor User
    participant Chat as CopilotKit Chat
    participant Agent as bookingAgent
    participant HITL as HITL Approval Card
    participant Tool as Booking Tools
    participant SB as Supabase
    participant STR as Stripe
    participant Webhook as Stripe Webhook Handler
    participant Confirm as Confirmation Card

    User->>Chat: Book Jazz Night — 2 general admission tickets
    Chat->>Agent: create_booking_intent(event_id, ticket_tier=GA, qty=2)
    Agent->>Tool: check_availability(event_id, qty=2)
    Tool->>SB: SELECT available_capacity FROM events WHERE id = event_id
    SB-->>Tool: 48 seats remaining
    Agent->>HITL: renderAndWaitForResponse(BookingConfirmCard)
    Note over HITL: Shows event name, date, venue, 2x GA $25, total $50
    HITL-->>User: Approval card rendered in chat — Confirm or Cancel
    User->>HITL: Click Confirm
    HITL-->>Agent: respond(confirmed)
    Agent->>Tool: process_payment(amount=5000, currency=usd, idempotency_key=booking_uuid)
    Tool->>STR: checkout.session.create(line_items, success_url, cancel_url)
    STR-->>Tool: payment_intent_id confirmed
    Tool->>SB: INSERT INTO bookings (user_id, event_id, qty, stripe_pi_id, status=confirmed)
    Tool->>SB: INSERT INTO tickets x2 (event_id, user_id, tier=GA, price=25, status=active)
    SB-->>Tool: records created
    Webhook->>SB: payment.succeeded — update payment status
    Agent->>Confirm: render ConfirmationCard (booking_id, QR code, venue map link, calendar link)
    Confirm-->>User: Booking confirmed — tickets in your account
```

---

## Diagram 6 — Agent Routing Workflow

```mermaid
flowchart TD
    Input["User Message\nany route or surface"] --> Router["routerAgent\nclassify intent + route"]

    Router -->|event discovery or detail| EA["eventAgent\nsearch_events\nget_event_detail\ncheck_availability"]
    Router -->|event creation or editing| HEA["hostEventAgent\nset_event_basics\nset_venue\nadd_ticket_tier\npreview_and_publish HITL"]
    Router -->|rental search or inquiry| RA["rentalAgent\nsearch_rentals\nget_rental_detail\nsubmit_inquiry\nschedule_viewing"]
    Router -->|venue search or shortlist| VA["venueAgent\nsearch_venues\nget_venue_detail\nshortlist_venue HITL\nsend_booking_inquiry"]
    Router -->|restaurant or reservation| ResA["restaurantAgent\nsearch_restaurants\ncreate_reservation\nsuggest_alternatives"]
    Router -->|cafe or nomad workspace| CA["cafeAgent\nsearch_cafes\nfilter_by_amenity\ncheck_wifi_hours"]
    Router -->|nightlife or guestlist| NA["nightlifeAgent\nsearch_nightlife\nbook_vip_table\nadd_to_guestlist"]
    Router -->|sponsor or brand fit| SA["sponsorAgent\nscore_brand_fit\nsearch_events_for_sponsor\ngenerate_proposal HITL"]
    Router -->|leads or CRM stage| CRM["crmAgent\nqualify_lead\nmove_stage\ndraft_reply HITL\nschedule_followup"]
    Router -->|analytics or data question| AN["analyticsAgent\nquery_supabase\ngenerate_chart\nexplain_trend\nexport_report"]
    Router -->|maps or local discovery| MA["mapsAgent\nplace_pins\ncluster_places\nget_travel_time\nrank_by_proximity"]
    Router -->|booking or payment| BA["bookingAgent\ncreate_booking\nprocess_payment HITL\nadd_to_calendar\nsend_confirmation"]
    Router -->|marketing or campaigns| MK["marketingAgent\ngenerate_campaign_copy\ncreate_social_post\nsend_whatsapp HITL"]

    EA --> BA
    RA --> BA
    VA --> BA
    ResA --> BA
    HEA -->|event approved| BA
    SA -->|proposal approved| MK

    BA --> STR["Stripe API\npayment_intent.create\ncheckout.session.create"]
    BA --> SB["Supabase\nbookings · tickets · payments"]
    MA --> GM["Google Maps Platform\nPlaces API New\nX-Goog-FieldMask"]
    AN --> SB
    CRM --> SB
```

---

## Diagram 7 — Data Model (ERD)

```mermaid
erDiagram
    USERS {
        uuid id PK
        text email
        text full_name
        text role
        jsonb preferences
        timestamptz created_at
    }
    EVENTS {
        uuid id PK
        uuid host_id FK
        uuid venue_id FK
        text title
        text description
        timestamptz start_time
        int capacity
        numeric base_price
        text status
    }
    VENUES {
        uuid id PK
        uuid owner_id FK
        text name
        int capacity_min
        int capacity_max
        float8 lat
        float8 lng
        numeric price_per_hour
        jsonb amenities
        text status
    }
    RENTALS {
        uuid id PK
        uuid host_id FK
        text title
        int bedrooms
        numeric price_monthly
        float8 lat
        float8 lng
        text neighborhood
        bool furnished
        text status
    }
    RESTAURANTS {
        uuid id PK
        text google_place_id
        text name
        text cuisine
        text ambiance
        numeric avg_rating
        jsonb hours
        float8 lat
        float8 lng
    }
    CAFES {
        uuid id PK
        text google_place_id
        text name
        int wifi_speed_mbps
        text noise_level
        bool has_outlets
        jsonb hours
        float8 lat
        float8 lng
    }
    BOOKINGS {
        uuid id PK
        uuid user_id FK
        text entity_type
        uuid entity_id
        int quantity
        text status
        timestamptz booked_at
    }
    TICKETS {
        uuid id PK
        uuid event_id FK
        uuid user_id FK
        uuid booking_id FK
        text tier_name
        numeric price
        text stripe_payment_intent_id
        text status
    }
    PAYMENTS {
        uuid id PK
        uuid booking_id FK
        text stripe_payment_intent_id
        numeric amount
        text currency
        text status
        timestamptz paid_at
    }
    LEADS {
        uuid id PK
        uuid user_id FK
        text entity_type
        uuid entity_id
        int score
        text stage
        text ai_draft_reply
        timestamptz follow_up_at
    }
    SPONSORS {
        uuid id PK
        uuid user_id FK
        text brand_name
        text industry
        jsonb target_audience
        numeric budget_per_event
        text status
    }

    USERS ||--o{ EVENTS : "hosts"
    VENUES ||--o{ EVENTS : "hosts"
    USERS ||--o{ VENUES : "owns"
    USERS ||--o{ RENTALS : "lists"
    USERS ||--o{ BOOKINGS : "makes"
    BOOKINGS ||--o{ TICKETS : "includes"
    BOOKINGS ||--o{ PAYMENTS : "generates"
    EVENTS ||--o{ TICKETS : "has"
    USERS ||--o{ LEADS : "generates"
    USERS ||--o{ SPONSORS : "manages"
```

---

## Diagram 8 — Human Approval (HITL) Flow

```mermaid
flowchart TD
    A["Agent determines action requires approval\npublish event · send proposal\nconfirm booking · send campaign"] --> B["renderAndWaitForResponse\nrender React component in chat\nagent execution paused"]

    B --> C["User sees HITL card in chat\nFull context: what will happen\nconsequences and cost shown clearly"]

    C --> D{User decision}

    D -->|Approve| E["Agent receives respond confirmed\nexecution resumes"]
    D -->|Reject| F["Agent receives respond cancelled\nexecution stopped"]
    D -->|Request edit| G["User types changes in chat\ne.g. change ticket price to 30"]

    G --> H["Agent re-generates action\nwith user corrections applied"]
    H --> B

    E --> I["Execute the action"]

    I --> J1["Supabase write\nINSERT or UPDATE record"]
    I --> J2["Stripe API call\npayment or price creation"]
    I --> J3["External send\nemail or WhatsApp or proposal"]

    J1 & J2 & J3 --> K["Audit log written to Supabase\naction · user · timestamp · payload"]
    K --> L["Confirmation card rendered in chat\naction completed summary"]

    F --> M["No database write\nNo charge\nNo external send\nAgent offers alternative"]
```

---

## Diagram 9 — Maps and Location Intelligence Flow

```mermaid
flowchart LR
    subgraph Intent["User Intent"]
        Q1["Natural language query\ne.g. rooftop venues for 200 in El Poblado"]
        Q2["Follow-up refinement\ne.g. show only ones with catering"]
    end

    subgraph AgentLayer["mapsAgent + specialist agent"]
        Parse["Parse location, entity type,\ncapacity, and constraints"]
        FieldMask["Apply X-Goog-FieldMask\nselect only needed fields\ncontrol API cost"]
        Merge["Merge and deduplicate results\nrank by relevance + distance + rating"]
    end

    subgraph DataSources["Data Sources"]
        OwnedDB["Supabase — Owned Inventory\nvenues · rentals · events\ncafes · restaurants"]
        PlacesNew["Google Places API New\nthird-party restaurants\ncafes · nightlife\npublic venues"]
        ADKGeo["Google ADK Phase 3\nadvanced geo tools\nisochrones · heatmaps\ntravel time polygons"]
    end

    subgraph Output["Result Surface"]
        Cards["Generative cards in chat\nname · photo · rating\nprice · distance · fit score"]
        Pins["Map pins in Right Panel\nupdated via useCoAgent state\nno page reload"]
        Cluster["Neighborhood clusters\nfor area-level discovery"]
    end

    subgraph Refinement["Refinement Loop"]
        Filter["User refines in chat\nagent re-queries"]
        Save["User saves result\nto collection or shortlist"]
        Book["User says book it\nbookingAgent takes over"]
    end

    Q1 --> Parse --> FieldMask
    FieldMask --> OwnedDB & PlacesNew
    ADKGeo --> Merge
    OwnedDB --> Merge
    PlacesNew --> Merge
    Merge --> Cards & Pins & Cluster
    Cards & Pins --> Refinement
    Q2 --> Filter --> Parse
    Save --> Book
```

---

## Diagram 10 — Product Roadmap: Core → MVP → Advanced

```mermaid
flowchart TD
    subgraph Core["PHASE 1 — CORE  |  Weeks 1–4  |  5 agents  |  3 workflows"]
        direction LR
        C1["Three-panel layout\nCopilotSidebar + Map Right Panel"]
        C2["routerAgent\nintent classification and routing"]
        C3["conciergeAgent\ngeneral discovery and Q-A"]
        C4["hostEventAgent\ncreate event HITL wizard"]
        C5["eventAgent\ndiscovery and availability"]
        C6["venueAgent\nsearch shortlist and map pins"]
        C7["createEventWorkflow\npublishEventWorkflow\nticketSetupWorkflow"]
        C8["Supabase data layer\nBasic booking request\nno Stripe yet"]
        C1 --> C2 --> C3 --> C4 --> C5 --> C6 --> C7 --> C8
    end

    Gate1{{"✅ Gate 1\nRoberto creates event in 3 min\nTicket purchase works end to end\nPlaywright spec passes"}}

    subgraph MVP["PHASE 2 — MVP  |  Weeks 5–10  |  8 agents  |  6 workflows"]
        direction LR
        M1["Stripe checkout and ticketing\nbookingAgent + payments table"]
        M2["rentalAgent + rentalLeadWorkflow\nCamila search and viewing"]
        M3["restaurantAgent + cafeAgent\ndiscovery and reservation"]
        M4["sponsorAgent + sponsorDiscoveryWorkflow\nbrand fit scoring"]
        M5["crmAgent + crmLeadWorkflow\nlead pipeline and stage moves"]
        M6["partnerOnboardingWorkflow"]
        M7["analyticsAgent\ndata Q-A on admin routes\nsalesInsightWorkflow"]
        M8["postEventReportWorkflow\nauto-generated on event close"]
        M1 --> M2 --> M3 --> M4 --> M5 --> M6 --> M7 --> M8
    end

    Gate2{{"✅ Gate 2\nCamila finds rental in 1 chat\n10 sponsors in pipeline\nCRM stage moves from chat\nPost-event report in 10 seconds"}}

    subgraph Advanced["PHASE 3 — ADVANCED  |  Weeks 11–16  |  12 agents  |  10 workflows"]
        direction LR
        A1["marketingAgent\nmarketingCampaignWorkflow\nemail and WhatsApp and social"]
        A2["Google ADK advanced geo tools\nisochrones and heatmaps and demand signals"]
        A3["MCP integrations\nResend · WhatsApp Business · Typeform · Slack"]
        A4["multiAgentPlanningWorkflow\nparallel specialist agents with result merge"]
        A5["RAG semantic search\nvenue and restaurant vibe matching"]
        A6["AI personalization engine\ntaste model per user across sessions"]
        A7["AI demand forecasting\nrevenue predictions per event type"]
        A1 --> A2 --> A3 --> A4 --> A5 --> A6 --> A7
    end

    Gate3{{"✅ Gate 3\n40 percent of campaigns sent without manual copy\nWhatsApp open rate 85 percent\nAI recommendations drive 30 percent of bookings"}}

    Core --> Gate1 --> MVP --> Gate2 --> Advanced --> Gate3
```

---

*Cross-reference: [`ai-native-marketplace-plan.md`](./ai-native-marketplace-plan.md) · [`ai-dashboard-plan.md`](./ai-dashboard-plan.md)*
