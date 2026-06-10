Below is a researcher/scraper-ready structure for the **mdeai.co Medellín concierge** brief, plus a verification checklist that a human or scraper can use to confirm each claim against source material. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

## Structured schema

```json
{
  "project": {
    "name": "mdeai.co",
    "type": "Chat-first AI concierge for Medellín",
    "primary_market": "Medellín, Colombia",
    "positioning": "One chat canvas for rentals, events, restaurants, attractions, trips, and WhatsApp-native concierge flows",
    "core_thesis": "Users describe intent in natural language; the system returns structured, verified results with map context and next actions."
  },
  "product_scope": {
    "hero_vertical": "Rentals",
    "secondary_verticals": ["Restaurants", "Events", "Attractions"],
    "channels": ["Web chat", "WhatsApp"],
    "outputs": ["Inline cards", "Map pins", "Reasoning trace", "Not-a-fit explanations", "Trip/saved items"]
  },
  "user_personas": [
    {
      "persona": "Digital nomad / renter",
      "goals": ["Find verified furnished rentals", "Avoid scams", "Understand lease clarity", "Save and compare listings"],
      "constraints": ["Budget", "Wi-Fi quality", "Neighborhood fit", "Medium-term stay needs"]
    },
    {
      "persona": "Landlord / property manager",
      "goals": ["Receive qualified leads", "Track showings and payouts", "Reduce Airbnb dependence"],
      "constraints": ["Low tech tolerance", "Need for WhatsApp-first communication", "Trust and verification"]
    },
    {
      "persona": "Event organizer / sponsor / contestant ecosystem user",
      "goals": ["Publish events", "Sell tickets", "Track ROI", "Build trust in voting or sponsorship"],
      "constraints": ["Fraud prevention", "Fast mobile workflows", "Auditability"]
    }
  ],
  "functional_requirements": [
    {
      "area": "Natural language search",
      "requirements": [
        "Accept free-form user intent",
        "Return ranked structured results",
        "Show explanations and rejected options"
      ]
    },
    {
      "area": "Rental discovery",
      "requirements": [
        "Surface rental cards with price, neighborhood, bedrooms, Wi-Fi, host, verification, source link",
        "Support save-to-trip / favorite actions",
        "Show scam warnings and trust indicators"
      ]
    },
    {
      "area": "Cross-sell",
      "requirements": [
        "Automatically suggest nearby restaurants",
        "Suggest events when time horizon matches",
        "Suggest attractions for multi-day stays"
      ]
    },
    {
      "area": "Identity and gating",
      "requirements": [
        "Anonymous trial with message limit",
        "Email gate / magic-link sign-in after limit",
        "Persist conversation history after auth"
      ]
    },
    {
      "area": "Lead generation",
      "requirements": [
        "Create structured lead rows when user requests contact",
        "Track outbound clicks and affiliate attribution",
        "Support agent / landlord follow-up workflows"
      ]
    }
  ],
  "data_model": {
    "core_entities": [
      "profiles",
      "apartments",
      "apartmentsources",
      "conversations",
      "messages",
      "savedplaces",
      "trips",
      "tripitems",
      "leads",
      "showings",
      "outboundclicks",
      "ratelimithits",
      "airuns",
      "aicontext",
      "usertastevectors",
      "scamsignals"
    ],
    "listing_fields": [
      "title",
      "neighborhood",
      "pricemonthly",
      "bedrooms",
      "wifi_speed",
      "amenities",
      "rating",
      "host_name",
      "verified",
      "source_url",
      "location",
      "description_embedding",
      "trustscore",
      "scamrisk"
    ]
  },
  "architecture": {
    "presentation": "Vite + React + TypeScript + Tailwind/shadcn",
    "backend": "Supabase Postgres + Edge Functions + RLS + Realtime",
    "intelligence": [
      "pgvector semantic search",
      "Hermes-style composite ranking",
      "taste vector personalization",
      "conversation memory summarization"
    ],
    "execution": [
      "Firecrawl",
      "Apify",
      "OpenClaw",
      "Paperclip",
      "pgcron",
      "Infobip WhatsApp"
    ],
    "principles": [
      "Chat layer is presentation only",
      "Edge functions are stateless",
      "Database is source of truth",
      "AI proposes before applying",
      "RLS on all tables"
    ]
  },
  "vertical_sources": {
    "rentals": [
      "Airbnb",
      "FazWaz",
      "Metrocuadrado",
      "FincaRaiz",
      "Facebook Groups",
      "Direct landlord submissions"
    ],
    "restaurants": ["Google Places", "Local curation"],
    "events": ["Eventbrite", "Meetup", "Local sites"],
    "attractions": ["Google Places", "Viator", "GetYourGuide"]
  },
  "scraping_and_verification": {
    "preferred_method_order": [
      "Official API",
      "Permissive structured extraction",
      "Apify actor for grey-area sources",
      "Playwright/Browserbase fallback",
      "Skip source if necessary"
    ],
    "dedupe_signals": [
      "Embedding similarity",
      "PostGIS distance",
      "Photo hash",
      "Title similarity",
      "Price/bed alignment"
    ],
    "scam_signals": [
      "Price z-score too low",
      "Same photo across listings",
      "Wire transfer / Western Union language",
      "Unresponsive host",
      "Stock-photo feel",
      "Neighborhood mismatch"
    ]
  },
  "revenue_model": {
    "streams": [
      "Airbnb / Booking affiliate clicks",
      "Agent lead credits",
      "Event ticket fees",
      "Native rental booking commission",
      "Landlord SaaS subscription",
      "Scam-check API",
      "Featured listings",
      "Premium concierge"
    ],
    "north_star": "Qualified rental leads sold per week"
  },
  "phases": [
    {
      "phase": "Phase 1",
      "focus": "Chat rentals MVP",
      "outcomes": ["Search", "Cards", "Map pins", "Anon gate", "Lead capture", "SEO handoff"]
    },
    {
      "phase": "Phase 2",
      "focus": "Restaurants, events, attractions",
      "outcomes": ["Cross-sell verticals", "Affiliate expansion", "More engagement"]
    },
    {
      "phase": "Phase 3",
      "focus": "Intelligence layer",
      "outcomes": ["pgvector search", "Hermes ranking", "Taste vectors", "Memory summarization"]
    },
    {
      "phase": "Phase 4",
      "focus": "Automation layer",
      "outcomes": ["OpenClaw skills", "Paperclip governance", "WhatsApp channel"]
    }
  ]
}
```

## Verification checklist

### Source and scope
- Confirm the project name is **mdeai.co** and the market is **Medellín, Colombia**. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/43284a7c-066f-4806-ab3d-2c7b5aec9263/MDEAI-ROADMAP.md)
- Confirm the product is **chat-first** and that chat is the primary product surface. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/1c52f575-79b3-4979-847f-6db55a9708b2/MDEAI-MASTER-PRD.md)
- Confirm the hero vertical is **rentals** and the upsell verticals include **restaurants, events, and attractions**. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/1c52f575-79b3-4979-847f-6db55a9708b2/MDEAI-MASTER-PRD.md)

### Product behavior
- Verify natural-language search returns structured results, not just plain text. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)
- Verify rental cards include title, neighborhood, monthly price, bedrooms, Wi-Fi, rating, host, verification badge, and source link. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/9b7a3347-a27f-4569-8bf1-c1c7111a9d7c/prd-real-estate.md)
- Verify the UI shows a **Not a Good Fit** / rejected-results section with reasons. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/43284a7c-066f-4806-ab3d-2c7b5aec9263/MDEAI-ROADMAP.md)
- Verify map pins are color-coded and synced with chat results. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)
- Verify save-to-trip or favorite actions persist and update counts. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/9b7a3347-a27f-4569-8bf1-c1c7111a9d7c/prd-real-estate.md)

### User gating and auth
- Verify anonymous users can send only the allowed number of free messages before an email gate appears. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/43284a7c-066f-4806-ab3d-2c7b5aec9263/MDEAI-ROADMAP.md)
- Verify the gate returns the correct limit error and offers magic-link sign-in. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)
- Verify conversation history survives the transition from anonymous to authenticated. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/43284a7c-066f-4806-ab3d-2c7b5aec9263/MDEAI-ROADMAP.md)
- Verify rate limiting is backed by persisted records, not only client-side logic. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/1c52f575-79b3-4979-847f-6db55a9708b2/MDEAI-MASTER-PRD.md)

### Data and ranking
- Verify listings are stored with source provenance in a source array or related source table. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)
- Verify deduplication uses embedding similarity, geospatial proximity, photo hashes, and price/title checks. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/43284a7c-066f-4806-ab3d-2c7b5aec9263/MDEAI-ROADMAP.md)
- Verify scam detection uses multiple signals and produces trust/scam flags rather than hard deleting data. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/1c52f575-79b3-4979-847f-6db55a9708b2/MDEAI-MASTER-PRD.md)
- Verify user taste vectors or memory summaries exist as part of personalization. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

### Scraper acceptance
- Verify each source is classified into one of these methods: official API, Firecrawl/structured extraction, Apify, browser fallback, or skip. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/1c52f575-79b3-4979-847f-6db55a9708b2/MDEAI-MASTER-PRD.md)
- Verify every extracted record includes a source URL and a timestamp or scrape provenance. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/43284a7c-066f-4806-ab3d-2c7b5aec9263/MDEAI-ROADMAP.md)
- Verify fields normalize to the canonical schema: price, neighborhood, latitude/longitude, bedrooms, images, description, host/source, and verification fields. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/9b7a3347-a27f-4569-8bf1-c1c7111a9d7c/prd-real-estate.md)
- Verify source-specific constraints are enforced, such as Medellín bounding box and valid URLs. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/1c52f575-79b3-4979-847f-6db55a9708b2/MDEAI-MASTER-PRD.md)

### Architecture and implementation
- Verify the stack is Vite/React/TypeScript on the front end and Supabase on the back end. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/9b7a3347-a27f-4569-8bf1-c1c7111a9d7c/prd-real-estate.md)
- Verify edge functions, not the UI, call external services. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/9b7a3347-a27f-4569-8bf1-c1c7111a9d7c/prd-real-estate.md)
- Verify all persistent tables have RLS enabled. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/9b7a3347-a27f-4569-8bf1-c1c7111a9d7c/prd-real-estate.md)
- Verify AI features are separated into intent routing, chat, search, ranking, and summarization functions. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

### Revenue and milestones
- Verify the north-star metric is qualified rental leads sold per week. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/1c52f575-79b3-4979-847f-6db55a9708b2/MDEAI-MASTER-PRD.md)
- Verify revenue streams include affiliate clicks, lead credits, booking commissions, and SaaS tiers. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/1c52f575-79b3-4979-847f-6db55a9708b2/MDEAI-MASTER-PRD.md)
- Verify Phase 1, Phase 2, Phase 3, and Phase 4 have distinct deliverables and no phase leakage. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/43284a7c-066f-4806-ab3d-2c7b5aec9263/MDEAI-ROADMAP.md)

## Scraper handoff note

For a scraper, the best extraction contract is: **entity type, canonical fields, source URL, source name, location, price, confidence, scrape timestamp, and raw evidence**. For a researcher, the best validation rule is: **do not accept a claim unless it appears in the PRD or on the live site and is supported by a matching field in the schema**. [developers.google](https://developers.google.com/search/docs/appearance/structured-data)

Would you like me to turn this into a **JSON Schema**, a **CSV column spec**, or a **scraper QA rubric**?