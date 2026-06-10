# mdeai Master Plan — WhatsApp AI Concierge Platform

Based on stack:
WhatsApp + Chatwoot + Mastra + Supabase + Google Maps/Places + Stripe + OpenClaw + Coolify + Hetzner

# 1. Product Vision

Build:

```text id="jlwm1pp"
AI-powered Medellín concierge operating system
```

inside:

* WhatsApp
* web
* Instagram

focused on:

* rentals
* restaurants
* nightlife
* events
* concierge workflows
* bookings
* local intelligence

---

# 2. Core Product Experience

User messages WhatsApp:

```text id="jlwm2qq"
Need a quiet café near Laureles with strong WiFi
```

AI:

* understands intent
* searches Maps/Places
* uses Medellín intelligence
* recommends best matches
* can continue into:

  * booking
  * reservation
  * broker routing
  * concierge workflows

---

# 3. Core Tech Stack

| Layer              | Tech                    | Purpose                    |
| ------------------ | ----------------------- | -------------------------- |
| Customer interface | WhatsApp                | Main UX                    |
| Communication CRM  | Chatwoot                | Inbox + human handoff      |
| AI workflow brain  | Mastra                  | AI orchestration           |
| Maps/places        | Google Maps + Places    | Real-world truth           |
| AI grounding       | Gemini Grounding        | Fresh + accurate responses |
| Search             | Google Search Grounding | Recent/local info          |
| Database           | Supabase                | Marketplace memory         |
| Embeddings         | pgvector                | Intelligence graph         |
| Payments           | Stripe                  | Deposits/bookings          |
| Browser automation | OpenClaw                | Website workflows          |
| Hosting            | Coolify                 | Easy deployments           |
| Infrastructure     | Hetzner                 | Cheap scalable servers     |
| Automations        | n8n                     | Workflow glue              |
| AI UI              | CopilotKit              | Web AI interface           |

---

# 4. System Architecture

```text id="jlwm3rr"
User
↓
WhatsApp
↓
Meta Cloud API
↓
Chatwoot
↓
Mastra AI workflows
↓
Google Maps/Places/Grounding
↓
Supabase + embeddings
↓
AI recommendation
↓
Human handoff if needed
↓
Stripe/OpenClaw workflows
```

---

# 5. Core MVP Features

| Priority | Feature                     |
| -------- | --------------------------- |
| P0       | WhatsApp AI concierge       |
| P0       | Restaurant recommendations  |
| P0       | Rental recommendations      |
| P0       | Human handoff               |
| P0       | Chatwoot inbox              |
| P0       | AI summaries                |
| P1       | Restaurant booking requests |
| P1       | Rental lead routing         |
| P1       | Maps/cards UI               |
| P1       | Persistent conversations    |
| P2       | Stripe payments             |
| P2       | Concierge workflows         |
| P3       | OpenClaw automation         |
| P3       | Medellín intelligence graph |

---

# 6. Advanced AI Features

| Feature                      | Description                |
| ---------------------------- | -------------------------- |
| AI memory                    | User preferences/history   |
| Venue embeddings             | Semantic venue search      |
| Neighborhood intelligence    | Lifestyle scoring          |
| AI itineraries               | Daily planning             |
| AI broker assistant          | Rental workflow automation |
| AI nightlife concierge       | Clubs/events/VIP           |
| AI follow-ups                | Re-engagement              |
| Personalized recommendations | Context-aware suggestions  |
| Workflow agents              | Specialized AI agents      |
| Browser automation           | Website actions            |

---

# 7. Specialized AI Agents

| Agent            | Purpose                |
| ---------------- | ---------------------- |
| Restaurant Agent | Dining recommendations |
| Rental Agent     | Apartments + brokers   |
| Nightlife Agent  | Events/clubs           |
| Concierge Agent  | Premium users          |
| Booking Agent    | Reservations/payments  |
| Maps Agent       | Nearby intelligence    |
| Memory Agent     | Personalization        |
| Broker Ops Agent | Lead routing           |

---

# 8. Supabase Data Structure

# Core Tables

| Table         | Purpose              |
| ------------- | -------------------- |
| users         | Accounts             |
| conversations | Chat history         |
| restaurants   | Venue data           |
| rentals       | Property listings    |
| events        | Event data           |
| leads         | Rental/booking leads |
| bookings      | Reservations         |
| venue_signals | Intelligence scores  |
| embeddings    | Semantic search      |
| itineraries   | Saved trips          |
| payments      | Stripe payments      |

---

# Venue Signals Example

```json id="jlwm4ss"
{
  "quiet": 0.91,
  "wifi": 0.94,
  "touristy": 0.17,
  "date_night": 0.82
}
```

---

# 9. Revenue Models

| Revenue Stream          | Example                |
| ----------------------- | ---------------------- |
| Broker lead fees        | Qualified rental leads |
| Restaurant commissions  | Reservations           |
| VIP table commissions   | Nightlife              |
| Event commissions       | Ticketing              |
| Featured listings       | Sponsored venues       |
| Concierge memberships   | Premium service        |
| Stripe transaction fees | Deposits/payments      |

---

# 10. Restaurant Workflow Example

## User

```text id="jlwm5tt"
Best romantic restaurant tonight near Provenza
```

## AI

Mastra:

* understands request
* searches Maps/Places
* applies intelligence graph
* ranks recommendations

## Response

```text id="jlwm6uu"
Best fit:
Mombasa

Why:
- romantic atmosphere
- excellent cocktails
- quieter than Carmen tonight
```

## Booking

User:

```text id="jlwm7vv"
Book for 2 at 8pm
```

Workflow:

* Chatwoot opens booking workflow
* reservation requested
* Stripe deposit if needed
* concierge joins if needed

---

# 11. Rental Workflow Example

## User

```text id="jlwm8ww"
Need quiet 2BR apartment in Laureles under $1500
```

## AI

* extracts budget
* extracts neighborhood
* ranks apartments
* summarizes best options

## Broker Workflow

* Chatwoot assigns broker
* broker joins WhatsApp thread
* viewing scheduled

---

# 12. OpenClaw Usage

ONLY use OpenClaw when:

* no API exists
* fragmented websites
* manual forms required

Examples:

* restaurant forms
* rental site aggregation
* ticket workflows

Do NOT use OpenClaw for everything.

Use:

```text id="jlwm9xx"
APIs first
OpenClaw second
```

---

# 13. Hosting Plan

# Best Setup

## Hetzner + Coolify

Why:

* cheap
* scalable
* Docker-native
* easiest long-term

---

# Suggested Server Path

| Stage      | Server |
| ---------- | ------ |
| MVP        | CPX21  |
| Growth     | CPX31  |
| Production | CPX41  |

---

# Coolify Deployments

Deploy:

* Chatwoot
* Supabase
* n8n
* Mastra app
* OpenClaw
* CopilotKit app

through:

```text id="jlwm0yy"
Coolify UI
```

Very easy.

---

# 14. Claude Code Setup

| Tool            | Purpose                |
| --------------- | ---------------------- |
| Claude Code     | Dev/operator assistant |
| Chatwoot MCP    | Manage conversations   |
| Chatwoot Skills | Better workflows       |
| Supabase MCP    | Database ops           |
| OpenClaw        | Browser workflows      |

---

# 15. GitHub Repositories

| Repo                               | Purpose            |
| ---------------------------------- | ------------------ |
| chatwoot/chatwoot                  | Main CRM           |
| hugoblanc/chatwoot-mcp             | MCP integration    |
| fazer-ai/chatwoot-skills           | Claude skills      |
| evolution-foundation/evolution-api | WhatsApp infra     |
| simstudioai/OpenClaw               | Browser automation |
| n8n-io/n8n                         | Automations        |
| supabase/supabase                  | Backend            |
| CopilotKit/CopilotKit              | AI frontend        |

---

# 16. Phase Roadmap

# Phase 1 — MVP

Goal:

```text id="jlwm1zz"
WhatsApp AI concierge
```

Build:

* Chatwoot
* WhatsApp
* Mastra
* Google Places
* Supabase

Features:

* restaurant recommendations
* rental recommendations
* AI summaries
* human handoff

---

# Phase 2 — Monetization

Build:

* booking workflows
* broker routing
* Stripe deposits
* restaurant reservations

---

# Phase 3 — Intelligence Layer

Build:

* embeddings
* Medellín signals
* personalization
* AI memory

---

# Phase 4 — Automation Layer

Build:

* OpenClaw
* workflow automation
* cross-site aggregation
* advanced agents

---

# 17. Recommended MVP Goal

User can:

```text id="jlwm2aaa"
Message WhatsApp
→ receive smart recommendations
→ ask follow-up questions
→ get human concierge help
→ optionally book/reserve
```

That is the correct first version.

---

# 18. Strategic Moat

Do NOT become:

```text id="分快三3bbb"
generic AI travel app
```

Become:

```text id="分快三3ccc"
Medellín intelligence operating system
```

powered by:

* WhatsApp-native UX
* AI workflows
* Maps grounding
* local intelligence
* bookings
* concierge operations
* marketplace infrastructure.
