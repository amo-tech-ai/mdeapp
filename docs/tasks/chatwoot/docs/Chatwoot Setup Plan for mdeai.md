# Chatwoot Setup Plan for mdeai

## Best Stack

| Layer         | Tool                       | Purpose                      |
| ------------- | -------------------------- | ---------------------------- |
| Inbox + CRM   | Chatwoot                   | Manage all conversations     |
| AI brain      | Mastra                     | Qualify leads + workflows    |
| Database      | Supabase                   | Store leads, bookings, users |
| Channel       | WhatsApp                   | Main user communication      |
| Channels      | Instagram + Facebook       | Social lead capture          |
| Dev assistant | Claude Code + Chatwoot CLI | Operate/debug conversations  |
| Automation    | Webhooks + n8n             | Sync events and workflows    |

Chatwoot supports open-source/self-hosted customer support, omnichannel conversations, WhatsApp, Instagram, Facebook, automation, APIs, and agent bots. ([Chatwoot][1])

---

# Main Goal

Use Chatwoot as:

**mdeai communication operating system**

Not just live chat.

It should handle:

* rental leads
* restaurant booking requests
* nightlife/VIP requests
* event support
* human handoff
* WhatsApp/Instagram/Facebook inboxes

---

# Phase Plan

| Phase       | Goal                    | Build First                                |
| ----------- | ----------------------- | ------------------------------------------ |
| Core        | Get inbox working       | Chatwoot + agents + labels + web chat      |
| MVP         | WhatsApp concierge      | WhatsApp + Agent Bot + Mastra              |
| Growth      | Social channels         | Instagram + Facebook                       |
| Advanced    | Automations + analytics | routing, SLA, campaigns, dashboards        |
| AI Advanced | Deep AI ops             | custom Mastra agents, memory, lead scoring |

---

# Phase 1 — Core Setup

## Features

| Feature           | Use Case                                             |
| ----------------- | ---------------------------------------------------- |
| Website live chat | Users ask questions from mdeai.co                    |
| Shared inbox      | Patricia/brokers manage conversations                |
| Agents            | Team members reply                                   |
| Teams             | Rentals, Restaurants, Nightlife, Events              |
| Labels            | “rental-lead”, “restaurant-booking”, “VIP”, “urgent” |
| Custom attributes | Store budget, date, area, party size                 |
| Canned responses  | Fast replies for bookings/viewings                   |

Chatwoot docs list labels, contacts, canned responses, custom attributes, priority, access control, and business hours as core features. ([Chatwoot][2])

## Setup Order

| Step | Action                |
| ---- | --------------------- |
| 1    | Deploy Chatwoot       |
| 2    | Create agents         |
| 3    | Create teams          |
| 4    | Create labels         |
| 5    | Add web chat inbox    |
| 6    | Add canned replies    |
| 7    | Add custom attributes |

---

# Phase 2 — WhatsApp MVP

## Features

| Feature             | Use Case                   |
| ------------------- | -------------------------- |
| WhatsApp channel    | Main Medellín user channel |
| Agent Bot           | AI handles first response  |
| Mastra webhook      | AI qualifies user          |
| Human handoff       | Broker/concierge joins     |
| Conversation status | Pending → Open → Resolved  |
| Lead summary        | AI summarizes user intent  |

Agent Bots can listen to Chatwoot events, process messages with external AI systems, reply through Chatwoot APIs, and hand off to humans by changing conversation status. ([Chatwoot][2])

## Flow

```text
User sends WhatsApp message
→ Chatwoot receives it
→ Agent Bot sends event to Mastra
→ Mastra understands request
→ Supabase stores lead
→ Chatwoot replies
→ Human joins if needed
```

## WhatsApp Setup Options

| Option                    | Best For             | Notes                               |
| ------------------------- | -------------------- | ----------------------------------- |
| WhatsApp Embedded Signup  | Easiest Cloud setup  | Chatwoot Cloud flow with Meta login |
| Manual WhatsApp Cloud API | More control         | Better for self-hosting             |
| Twilio WhatsApp           | Faster managed setup | Easier but higher cost              |

Chatwoot documents Embedded Signup, manual WhatsApp Cloud setup, and Twilio WhatsApp setup. Embedded Signup connects Meta/WABA credentials through a browser-based flow. ([Chatwoot][3])

---

# Phase 3 — Instagram + Facebook

## Features

| Channel            | Use Case                                 |
| ------------------ | ---------------------------------------- |
| Instagram DM       | Tourists ask about restaurants/nightlife |
| Facebook Messenger | Older local users + groups               |
| WhatsApp           | Serious booking/lead conversion          |

Chatwoot has official setup docs for Facebook, Instagram, and WhatsApp channels. ([Chatwoot][4])

## Real Example

```text
User sees Instagram reel
→ sends DM
→ Chatwoot creates contact
→ AI qualifies request
→ user moves to WhatsApp for booking
```

---

# Phase 4 — Workflows + Automations

## Automations to Add

| Automation      | Example                                    |
| --------------- | ------------------------------------------ |
| Auto-label      | “Laureles rental”                          |
| Auto-assign     | Send rental leads to broker team           |
| Auto-priority   | VIP/high-budget leads become high priority |
| Auto-reply      | “Thanks, what date and party size?”        |
| Business hours  | After-hours response                       |
| SLA tracking    | Measure broker response time               |
| Required fields | Do not resolve until budget/date captured  |

Chatwoot’s advanced feature docs include automation, assignment rules, custom attributes, macros, SLAs, webhooks, agent capacity, required conversation attributes, and audit logs. ([Chatwoot][5])

---

# Phase 5 — AI Advanced

## AI Agents

| Agent            | Job                              |
| ---------------- | -------------------------------- |
| Rental Agent     | Budget, area, move date, viewing |
| Restaurant Agent | Date, time, party size, vibe     |
| Nightlife Agent  | music, area, VIP/table           |
| Event Agent      | ticket/support                   |
| Concierge Agent  | premium handoff                  |
| Ops Agent        | summaries + routing              |

Chatwoot’s Agent Bot pattern supports external AI models and tools; Chatwoot also has an `ai-agents` repo for multi-agent workflows, but for mdeai, Mastra should stay the AI brain. ([Chatwoot][2])

---

# GitHub Repos to Use

| Repo                                                                                                           | Use                                          |
| -------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| [https://github.com/chatwoot/chatwoot](https://github.com/chatwoot/chatwoot)                                   | Main self-hosted Chatwoot                    |
| [https://github.com/chatwoot/cli](https://github.com/chatwoot/cli)                                             | Manage Chatwoot from terminal                |
| [https://github.com/chatwoot/docs](https://github.com/chatwoot/docs)                                           | Docs source/reference                        |
| [https://github.com/chatwoot/chatwoot-mobile-app](https://github.com/chatwoot/chatwoot-mobile-app)             | Mobile app reference                         |
| [https://github.com/chatwoot/ai-agents](https://github.com/chatwoot/ai-agents)                                 | AI agent concepts/reference                  |
| [https://github.com/fazer-ai/chatwoot-skills](https://github.com/fazer-ai/chatwoot-skills)                     | Claude Code skills for Chatwoot              |
| [https://github.com/chatwoot/chatwoot-sdk-python](https://github.com/chatwoot/chatwoot-sdk-python)             | API automation                               |
| [https://github.com/evolution-foundation/evolution-api](https://github.com/evolution-foundation/evolution-api) | Optional WhatsApp infrastructure experiments |

Chatwoot CLI supports login with base URL, API key, and account ID, and the CLI includes an agent skill for Claude Code/Cursor/Codex-style tools. ([GitHub][6])

---

# Best mdeai Workflows

## 1. Rental Lead

```text
WhatsApp: “Need 2BR Laureles under $1500”
→ AI asks move date + budget
→ lead saved in Supabase
→ Chatwoot labels “rental-lead”
→ broker assigned
```

## 2. Restaurant Booking

```text
Instagram/WhatsApp: “Dinner for 4 tonight”
→ AI collects time + area + cuisine
→ creates booking request
→ concierge/restaurant confirms
```

## 3. Nightlife VIP

```text
WhatsApp: “Reggaeton tonight”
→ AI recommends clubs
→ asks group size + budget
→ human concierge joins
```

## 4. Event Support

```text
User: “Where is my ticket?”
→ AI checks Supabase/Stripe
→ sends ticket link
→ human joins if payment issue
```

---

# Core vs Advanced Features

| Core               | Advanced             |
| ------------------ | -------------------- |
| Inbox              | SLA                  |
| WhatsApp           | Automation rules     |
| Instagram/Facebook | Advanced assignment  |
| Labels             | Campaigns            |
| Teams              | Audit logs           |
| Agent Bot          | AI lead scoring      |
| Canned replies     | Captain AI/custom AI |
| Custom attributes  | Required attributes  |
| Webhooks           | Deep analytics       |

---

# Paid vs Open Source

| Need                         |  Open Source Self-host | Paid/Cloud |
| ---------------------------- | ---------------------: | ---------: |
| Basic inbox                  |                    Yes |        Yes |
| Web chat                     |                    Yes |        Yes |
| API/webhooks                 |                    Yes |        Yes |
| Custom Mastra Agent Bot      |                    Yes |        Yes |
| Managed hosting              |                     No |        Yes |
| Built-in Captain AI          | Limited/plan-dependent |     Easier |
| Advanced enterprise features |                Limited |     Better |

Chatwoot self-hosted plans allow deploying on your own infrastructure, while Cloud pricing has plan-based limits and paid AI/automation features. ([Chatwoot][7])

---

# Recommended Order

| Order | Task                                                  |
| ----: | ----------------------------------------------------- |
|     1 | Self-host Chatwoot                                    |
|     2 | Create teams: Rentals, Restaurants, Nightlife, Events |
|     3 | Add web chat inbox                                    |
|     4 | Create labels + custom attributes                     |
|     5 | Add WhatsApp channel                                  |
|     6 | Connect Agent Bot webhook to Mastra                   |
|     7 | Save qualified leads to Supabase                      |
|     8 | Add Instagram                                         |
|     9 | Add Facebook                                          |
|    10 | Add automations/routing                               |
|    11 | Add SLA + reports                                     |
|    12 | Add campaigns/follow-ups                              |

---

# Best MVP

Start with this only:

```text
Chatwoot
+ WhatsApp
+ Agent Bot
+ Mastra
+ Supabase
```

That gives you the real business flow:

```text
message
→ qualify
→ route
→ human handoff
→ lead/booking stored
```

[1]: https://www.chatwoot.com/llms.txt?utm_source=chatgpt.com "llms.txt"
[2]: https://www.chatwoot.com/hc/user-guide/articles/1677497472-how-to-use-agent-bots "How to use Agent bots? | User Guide | Chatwoot"
[3]: https://www.chatwoot.com/hc/user-guide/articles/1752129193-how-to-use-whatsapp-embedded-signup "How to setup a WhatsApp channel (Embedded signup) | User Guide | Chatwoot"
[4]: https://www.chatwoot.com/hc/user-guide/articles/1677778588-how-to-setup-a-facebook-channel "How to setup a Facebook channel? | User Guide | Chatwoot"
[5]: https://www.chatwoot.com/hc/user-guide/en/categories/advanced-features-explained?utm_source=chatgpt.com "Advanced features explained | User Guide"
[6]: https://github.com/chatwoot/cli?utm_source=chatgpt.com "CLI for Chatwoot"
[7]: https://www.chatwoot.com/pricing/self-hosted-plans/?utm_source=chatgpt.com "Self-Hosted Pricing"
