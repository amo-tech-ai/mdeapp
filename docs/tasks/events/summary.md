---
title: Events Platform — plain-English summary
updated: 2026-06-08
full_tracker: ./index-events.md
linear: https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues
---

# Events on mdeai — what’s done, what’s left

**One line:** The core loop **works in code on [mdeai.co](https://www.mdeai.co)** — discover in chat, view an event, buy a ticket, host creates and publishes — but we have **not signed the launch checklist** yet. Roughly **38%** of the full events roadmap is done; the rest is polish, web discovery, Luma-style pages, and venue booking.

---

## The loop we’re building

```text
Camila finds an event in chat → opens detail → Andrés buys ticket → QR in wallet
Roberto creates an event in plain English → approves → it appears on his host list
```

That loop is **mostly built**. What’s missing is formal proof that every step works on production, plus the “nice” layers (Luma layout, scraped web discovery, venue booking for restaurants).

---

## What works today (real mdeai examples)

### Camila — find events in chat 🟢

**Example:** Camila opens `/` and asks *“salsa events this weekend in Medellín.”*

**What happens:** The concierge agent calls `search_events`, returns **event cards** in chat, and can show **map pins** for venues.

**Status:** Live on prod. Event search API returns real inventory (verified 10 events on mdeai.co).

---

### Andrés — view event and buy a ticket 🟡

**Example:** Andrés taps **Manda MoorFLOW – Live** on a card, lands on `/events/[slug]`, hits **Buy ticket**, pays with Stripe, gets a **QR in `/me/tickets`**.

**What works:** Event detail page, checkout APIs, webhook handler, wallet UI — all on disk and deployed.

**What’s missing:** A signed **production proof** that a real paid ticket completed end-to-end (tracked as part of [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) launch ledger). Code is there; the ops sign-off is not.

---

### Roberto — create and publish an event 🟢

**Example:** Roberto goes to `/host/event/new`, types *“Tech meetup in Laureles, Friday 7pm, free entry, 80 capacity,”* the AI fills the wizard, he **approves in the HITL panel**, and the event is written to Supabase.

**What works:**

- AI host agent (`hostEventAgent`) + CopilotKit wizard
- Human approval before publish (same pattern as ticket safety)
- `organizer_id` set correctly so the event shows on his list

**Status:** [SAN-366](https://linear.app/sanjiovani/issue/SAN-366) marked Done in Linear. Screenshot/SQL evidence should still be filed for the launch ledger.

---

### Roberto — see his events 🟢

**Example:** After publishing, Roberto opens **`/host/events`** and sees *Medellín Tech Meetup* with status, date, and image.

**What works:** Server page, RLS (only his rows), grid component, unit test pass.

**Small gap:** Automated browser test for this page not added yet; task spec status on disk is stale vs Linear.

---

### Patricia — ops / launch sign-off 🟥

**Example:** Before calling MVP “launched,” Patricia needs one markdown table: *chat events ✅ · paid ticket ✅ · host publish ✅ · prod URLs ✅* with evidence links.

**Status:** [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) is still **Todo** — this is the **P0 exit gate** for the whole events milestone.

---

## What’s not built yet (and why it matters)

### Web event discovery (Camila + Patricia) ⚪ ~8%

**Example we want:** *“What’s happening tonight in Provenza that’s not already in our database?”* → AI searches the web with **citations**, Patricia **approves** before anything is saved.

**Today:** Partial pieces only (`/api/grounding/event-web`, citation UI hooks, a DB-only discovery workflow stub). No `discovered_events` table, no save-after-approval flow.

**When:** After launch ledger is green — tasks [SAN-119 → SAN-131](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues).

---

### Luma-style event pages (Tourist / Camila) 🟡 ~15%

**Example we want:** Open *Visionarios Night* and instantly see **host, vibe, who’s going, map context**, not just price + buy button.

**Today:** Commerce-first `/events/[slug]` works. Rich layout is spec + [SAN-135 In Review](https://linear.app/sanjiovani/issue/SAN-135).

---

### Venue booking for events (Roberto + restaurants) ⚪ 0%

**Example we want:** Roberto picks **Mamacita** as a venue from a restaurant card, requests a proposal, Patricia sees it in an admin queue.

**Today:** 23 Linear issues ([SAN-492 → SAN-514](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues)) — **no local task specs yet**. Separate track from core MVP.

---

### OpenClaw / Postiz automation ⚪ 0%

**Example we want:** Approved social posts and WhatsApp **drafts** after an event is published — never auto-send without human OK.

**Today:** Planned for Phase 4. Hostinger VPS exists; product wiring not started.

---

## By persona — quick scorecard

| Persona | Can they…? | Example | Status |
|---------|------------|---------|--------|
| **Camila** | Find events in chat | “Salsa this weekend” → cards + pins | 🟢 Works |
| **Andrés** | Pay and get QR | Buy ticket on mdeai.co | 🟡 Code live, prod proof open |
| **Roberto** | Create + publish + list | Wizard → approve → `/host/events` | 🟢 Works |
| **Tourist** | Rich event page | Hero, vibe, attendees | ⚪ Basic page only |
| **Patricia** | Sign launch + run discovery ops | One proof ledger + approval queue | 🟥 Ledger missing |

---

## Tech stack — what’s wired

| Piece | Role in events | Status |
|-------|----------------|--------|
| **Gemini** | Powers host + concierge agents | 🟢 Live |
| **Mastra** | `search_events`, workflows, tools | 🟢 Live (discovery workflow stub only) |
| **CopilotKit** | Chat UI, event cards, HITL approval | 🟢 Live |
| **Supabase** | Events, tickets, RLS, hybrid search | 🟢 Live |
| **PG Vector** | `hybrid_search_events` semantic search | 🟢 Used in chat |
| **Google Maps** | Event pins on map panel | 🟡 Pins work; venue binding incomplete |
| **Stripe** | Ticket payments + webhooks | 🟢 Live ([SAN-116](https://linear.app/sanjiovani/issue/SAN-116) Done) |
| **ADK sidecar** | Advanced web/maps agents | ⚪ Phase 2 |

---

## What to do next (in order)

1. **Finish [SAN-115](https://linear.app/sanjiovani/issue/SAN-115)** — one evidence ledger: chat, ticket, host publish, all on prod with screenshots/SQL.
2. **Capture prod proof for Roberto** — publish one test event on mdeai.co, confirm row in Supabase + visible on `/host/events`.
3. **Capture prod proof for Andrés** — one real or test-mode paid ticket → QR in wallet.
4. **Ship [SAN-135](https://linear.app/sanjiovani/issue/SAN-135)** — Luma-style detail page (biggest visible UX gap).
5. **Then** start web discovery pack (SAN-119+) — only after launch is signed.

---

## Where to go deeper

| Doc | Use when |
|-----|----------|
| [index-events.md](./index-events.md) | Full task table with Linear links + verification log |
| [tasks/INDEX.md](./tasks/INDEX.md) | EVP spec index (001–047) |
| [docs/events-prd.md](./docs/events-prd.md) | Product scope |
| [audit/01-audit-events-mvp.md](./audit/01-audit-events-mvp.md) | Forensic spec vs disk audit |

**Bottom line for stakeholders:** mdeai can already **find, sell, and host events** in production code. The team is in **Discovery Beta**, not “launched,” until Patricia’s proof ledger ([SAN-115](https://linear.app/sanjiovani/issue/SAN-115)) is complete. Everything after that is better discovery, prettier pages, and venue/sponsor revenue layers.
