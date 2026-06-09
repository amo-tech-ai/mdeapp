
---

# mdeai — AI Concierge Platform Plan

Based on:
- CopilotKit
- Mastra
- Supabase
- Gemini
- Google Maps + Places
- ADK Grounding
- Chatwoot
- Stripe
- WhatsApp
- OpenClaw
- Hetzner + Coolify

Architecture aligned with:
- `prd-mastra.md` :contentReference[oaicite:0]{index=0}
- `mastra-roadmap.md` :contentReference[oaicite:1]{index=1}
- `maps-adk-prd.md` :contentReference[oaicite:2]{index=2}
- `maps-prd.md` :contentReference[oaicite:3]{index=3}
- `real-estate-prd.md` :contentReference[oaicite:4]{index=4}
- `events-prd.md` :contentReference[oaicite:5]{index=5}
- `trips-plan.md` :contentReference[oaicite:6]{index=6}
- `prd-venues.md` :contentReference[oaicite:7]{index=7}

---

# 1. Vision

Build a Medellín-first AI operating system for:
- rentals
- restaurants
- cafés
- nightlife
- events
- trips
- concierge services

Main interface:
- WhatsApp
- `/chat`
- map-first conversational UI

Core idea:
```

User asks naturally
→ AI understands intent
→ tools fetch grounded truth
→ cards + pins render
→ booking / lead / ticket workflow starts

````

---

# 2. Core Product Areas

| Vertical | Purpose |
|---|---|
| Rentals | Apartment discovery + lead capture |
| Events | Event hosting + ticketing |
| Venues | Restaurants, cafés, nightlife |
| Trips | Saved places + itineraries |
| Concierge | AI recommendations + workflows |
| Maps | Spatial intelligence layer |

---

# 3. Core Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 |
| AI UI | CopilotKit 1.55.2 |
| AI orchestration | Mastra |
| AI model | Gemini 3.5 Flash |
| Database | Supabase |
| Maps | Google Maps + Places |
| Grounding | ADK + Grounding Lite |
| Map rendering | vis.gl |
| Payments | Stripe |
| CRM | Chatwoot |
| Automation | n8n |
| Browser automation | OpenClaw |
| Hosting | Hetzner + Coolify |

---

# 4. Core Architecture

```text
User
↓
WhatsApp / Web Chat
↓
CopilotKit UI
↓
/api/copilotkit
↓
Mastra agents + workflows
↓
Google Maps / Places / ADK
↓
Supabase
↓
Cards + Pins + Actions
````

---

# 5. AI Agent Structure

| Agent          | Purpose                     |
| -------------- | --------------------------- |
| routerAgent    | Detect user intent          |
| rentalAgent    | Rentals                     |
| conciergeAgent | Recommendations             |
| hostEventAgent | Event creation              |
| venueAgent     | Restaurants/cafés/nightlife |
| tripAgent      | Saved plans + itineraries   |

Architecture follows:

* one orchestrator
* workflow-first
* avoid agent sprawl

Aligned with Mastra PRD recommendations. 

---

# 6. Maps Architecture

Maps are:

* evidence
* grounding
* spatial trust

NOT the AI brain.

Rules:

* Gemini never invents coordinates
* all geo comes from:

  * Places API
  * Grounding tools
  * Supabase inventory

Architecture aligned with:

* `maps-prd.md`
* `maps-adk-prd.md`

---

# 7. Main User Flow

## Example — Restaurant Search

User:

```
Best romantic restaurant in Provenza tonight
```

System:

1. routerAgent classifies request
2. Grounding tools fetch places
3. Places API enriches details
4. Mastra ranks results
5. CopilotKit renders:

   * cards
   * pins
   * detail sheet

Result:

* map
* recommendations
* booking request

---

# 8. Rental Flow

User:

```
2 bedroom apartment in Laureles under $1500
```

System:

* search-rentals tool
* Supabase apartments
* map pins
* RentalCard render
* schedule viewing workflow

Lead captured into:

* `leads`
* `showings`

Aligned with:
`real-estate-prd.md` 

---

# 9. Event Flow

User:

```
What events are happening this Friday?
```

System:

* event workflow
* grounded event search
* EventCards
* map venue pins
* ticket checkout

Host flow:

```
Roberto creates event
→ AI drafts event
→ human approval
→ publish
```

Aligned with:
`events-prd.md` 

---

# 10. Trips System

Purpose:
persistent planning workspace.

Features:

* saved places
* itineraries
* tickets
* viewing schedules
* collections
* map planning

Example:

```
Move to Medellín trip
→ apartments
→ cafés
→ coworking
→ nightlife
```

Aligned with:
`trips-plan.md` 

---

# 11. Venues System

Supports:

* cafés
* restaurants
* nightlife
* booking requests

Features:

* grounded place search
* venue detail panels
* AI recommendations
* map pin sync
* WhatsApp booking workflows

Aligned with:
`prd-venues.md` 

---

# 12. Core MVP

True MVP:

1. Camila searches rentals
2. Map pins render
3. Lead captured
4. Roberto publishes event
5. Andrés buys ticket
6. Venue recommendations work
7. `/chat` becomes central UI

This matches canonical MVP definitions in:

* `mvp.md`
* `prd-mastra.md`
* `plan.md`

---

# 13. Recommended Development Order

## Phase 1 — Core MVP

Build:

* `/chat`
* routerAgent
* map shell
* rentals
* event publish
* ticketing
* venue cards
* lead capture

## Phase 2 — Intelligence

Build:

* venue_signals
* hybrid ranking
* personalization
* saved places
* trips

## Phase 3 — Automation

Build:

* WhatsApp workflows
* OpenClaw enrichment
* AI followups
* broker workflows

## Phase 4 — Advanced

Build:

* itinerary AI
* neighborhood intelligence
* sponsor workflows
* advanced operations

---

# 14. Strategic Direction

Do NOT become:

* generic chatbot
* agent swarm
* over-engineered travel SaaS

Become:

```
Medellín AI operating system
```

Focused on:

* grounded local intelligence
* conversational workflows
* maps + recommendations
* bookings + commerce
* operational AI tooling
