# Recommended Stack (Best Overall)

| Layer              | Tech                                                                                                                     | Purpose                    | Score |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ | -------------------------- | ----: |
| Customer channel   | WhatsApp                                                                                                                 | Main user interface        |    98 |
| Communication CRM  | [Chatwoot](https://github.com/chatwoot/chatwoot?utm_source=chatgpt.com)                                                  | Inbox + human handoff      |    96 |
| AI workflow brain  | [Mastra](https://mastra.ai/guides/guide/whatsapp-chat-bot?utm_source=chatgpt.com)                                        | AI orchestration/workflows |    95 |
| Database           | [Supabase](https://github.com/supabase/supabase?utm_source=chatgpt.com)                                                  | Marketplace truth/memory   |    96 |
| Maps/Places        | [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview?utm_source=chatgpt.com) | Real-world place data      |    97 |
| Payments           | [Stripe](https://stripe.com/?utm_source=chatgpt.com)                                                                     | Deposits/bookings/payments |    95 |
| Browser automation | [OpenClaw](https://github.com/simstudioai/OpenClaw?utm_source=chatgpt.com)                                               | Website actions/workflows  |    88 |
| Hosting            | [Coolify](https://coolify.io/?utm_source=chatgpt.com)                                                                    | Self-hosting manager       |    94 |
| Server             | [Hetzner Cloud](https://www.hetzner.com/cloud/?utm_source=chatgpt.com)                                                   | Cheapest strong infra      |    96 |

# What the System Actually Does

```text
User on WhatsApp
↓
Chatwoot receives message
↓
Mastra AI analyzes request
↓
Google Places/Maps provides venue data
↓
Supabase stores memory/leads/bookings
↓
OpenClaw performs actions if needed
↓
Chatwoot sends response
↓
Human joins if needed
↓
Stripe handles payments/deposits
```

# Main Use Cases

| Use Case             | Revenue                 |
| -------------------- | ----------------------- |
| Rental leads         | Broker lead fees        |
| Restaurant bookings  | Reservation commissions |
| Nightlife concierge  | VIP/table commissions   |
| Event bookings       | Ticket commissions      |
| Relocation concierge | Premium service fees    |
| Featured placements  | Venue/broker ads        |

# Core MVP Features

| Priority | Feature                     |
| -------- | --------------------------- |
| P0       | WhatsApp AI concierge       |
| P0       | Restaurant recommendations  |
| P0       | Rental recommendations      |
| P0       | Chatwoot inbox              |
| P0       | Human handoff               |
| P1       | Restaurant bookings         |
| P1       | Rental lead routing         |
| P1       | AI summaries                |
| P2       | Stripe deposits/payments    |
| P2       | OpenClaw booking automation |
| P3       | Medellín intelligence graph |

# Recommended GitHub Repos

| Repo                                                                                                               | Purpose                 |
| ------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| [chatwoot/chatwoot](https://github.com/chatwoot/chatwoot?utm_source=chatgpt.com)                                   | Main CRM/inbox          |
| [chatwoot/chatwoot-sdk-python](https://github.com/chatwoot/chatwoot-sdk-python?utm_source=chatgpt.com)             | Automation SDK          |
| [hugoblanc/chatwoot-mcp](https://github.com/hugoblanc/chatwoot-mcp?utm_source=chatgpt.com)                         | Claude MCP tools        |
| [fazer-ai/chatwoot-skills](https://github.com/fazer-ai/chatwoot-skills?utm_source=chatgpt.com)                     | Claude skills           |
| [evolution-foundation/evolution-api](https://github.com/evolution-foundation/evolution-api?utm_source=chatgpt.com) | WhatsApp infrastructure |
| [simstudioai/OpenClaw](https://github.com/simstudioai/OpenClaw?utm_source=chatgpt.com)                             | Browser automation      |
| [supabase/supabase](https://github.com/supabase/supabase?utm_source=chatgpt.com)                                   | Backend/database        |
| [n8n-io/n8n](https://github.com/n8n-io/n8n?utm_source=chatgpt.com)                                                 | Automation glue         |

# Claude Code Setup

| Tool                | Purpose                    |
| ------------------- | -------------------------- |
| Claude Code         | Dev/operator assistant     |
| Chatwoot MCP        | Manage conversations/leads |
| Chatwoot Skills     | Better workflows           |
| Supabase MCP        | Database operations        |
| Playwright/OpenClaw | Browser automation         |

# Easiest Hosting Setup

# BEST OPTION

## Hetzner + Coolify

Why:

* cheapest
* scalable
* Docker-native
* easy deployments
* production-ready

# Suggested Server

| Stage      | Server |
| ---------- | ------ |
| MVP        | CPX21  |
| Growth     | CPX31  |
| Production | CPX41  |

# Why NOT Hostinger

| Hostinger              | Hetzner                   |
| ---------------------- | ------------------------- |
| Easier initially       | Better long-term          |
| Shared-hosting mindset | Real cloud infrastructure |
| Less flexible          | Better Docker support     |
| Weaker scaling         | Better performance        |
| More limitations       | Full control              |

# Easiest Deployment Path

# Step 1

Create Hetzner server.

Ubuntu 24.

---

# Step 2

Install Coolify.

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

---

# Step 3

Deploy:

* Chatwoot
* Supabase
* n8n
* OpenClaw
* Mastra app

through Coolify UI.

Very easy.

# Simplest MVP Architecture

```text
WhatsApp
↓
Meta Cloud API
↓
Chatwoot
↓
Mastra
↓
Google Places
↓
Supabase
```

STOP THERE FIRST.

Do NOT start with:

* OpenClaw
* advanced agents
* voice AI
* multi-agent orchestration

# Phase Roadmap

# Phase 1 — MVP (2–4 weeks)

Goal:

```text
AI concierge in WhatsApp
```

Build:

* Chatwoot
* Mastra
* WhatsApp
* Google Places
* Supabase

Features:

* restaurant recommendations
* rental recommendations
* AI summaries
* human handoff

# Phase 2 — Monetization

Build:

* booking workflows
* broker routing
* Stripe deposits
* restaurant reservations

# Phase 3 — Intelligence Layer

Build:

* embeddings
* Medellín signals
* vibe intelligence
* personalization

# Phase 4 — Automation Layer

Add:

* OpenClaw
* workflow execution
* cross-site aggregation
* browser automation

# Important Technical Insight

# Chatwoot

Handles:

* inbox
* conversations
* humans
* routing
* statuses
* CRM

---

# Mastra

Handles:

* AI reasoning
* workflows
* orchestration
* recommendations

---

# OpenClaw

Handles:

* websites
* forms
* browser automation

---

# Stripe

Handles:

* deposits
* payments
* booking fees
* commissions

# Recommended First Milestone

## Goal

User can:

```text
Message WhatsApp
→ get restaurant recommendations
→ ask follow-up questions
→ human concierge joins if needed
```

THAT is the correct MVP.

# Overall Recommended Order

| Order | Build                         |
| ----- | ----------------------------- |
| 1     | Hetzner + Coolify             |
| 2     | Chatwoot                      |
| 3     | WhatsApp Cloud API            |
| 4     | Mastra                        |
| 5     | Google Places                 |
| 6     | Supabase                      |
| 7     | AI recommendations            |
| 8     | Human handoff                 |
| 9     | Stripe                        |
| 10    | OpenClaw                      |
| 11    | Embeddings/intelligence graph |

# Final Recommendation

Start SIMPLE:

```text
WhatsApp
+
Chatwoot
+
Mastra
+
Google Places
+
Supabase
```

That alone is already a very strong AI concierge platform.
