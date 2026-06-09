---
title: What to build next — real-world summary
updated: 2026-06-03
track: Discovery Beta (active)
source: tasks.md rows 1–52
companion: tasks.md · improve.md
---

> **Summary:** Full Discovery Beta guide in plain English — who uses what, what already works, workflows (chat, booking, restaurants), and the ordered build list with Linear links.

# What we’re building (plain English)

**Discovery Beta** = people can **find places, talk to the concierge, and request a table** on [mdeai.co](https://www.mdeai.co) — without selling tickets or building trip planners yet.

**Not this cycle:** buying event tickets (Andrés/Stripe), trip itineraries, saved collections, WhatsApp to venues, admin booking queues.

Full ordered list → [`tasks.md`](../../tasks.md)

---

## Who uses what

| Person | What they do on mdeai.co |
|--------|-------------------------|
| **Camila** | Rents in Medellín — chat, map, mobile phone |
| **Carlos** | Tourist — restaurants, rooftops, nightlife, brunch |
| **Sarah** | Books cafés/restaurants — form + “pending” status |
| **Tourist** | Browses without chat when `/restaurants` exists |
| **Andrés** | Buys event tickets — **later** (Commerce track) |
| **Roberto** | Hosts events — wizard exists; prod publish **later** |
| **Patricia** | Ops — approves bookings, ledger — **later** |
| **Lucía / Sofía** | QA — prod journeys, CI, nightly health checks |

---

## Features already working (don’t rebuild)

| What users see | Example |
|----------------|---------|
| Chat + map home | Camila opens `/` — concierge beside map |
| Smart restaurant picks | Carlos: *“quiet rooftop Provenza”* → Relato, O.C.I. rank well |
| Nightlife vs café | *“Rooftop cocktails”* opens nightlife panel, not café tabs |
| Book a table (form) | Sarah submits — request saved with her account |
| **Pending** on panel | After booking Relato, she sees “Request pending” |
| Mobile shell | Camila on iPhone — drawer, map button, layout fits screen |
| Host event wizard | Roberto drafts an event with AI help (localhost/prod shell) |
| Café browse | Tourist at `/cafes` — map + book quiet workspace |

---

## Main workflows (Discovery Beta)

### 1. Concierge chat → places on the map

**Camila or Carlos** types in chat → **concierge agent** searches rentals, events, or grounded places → **cards appear** in chat and **pins on the map**.

| Step | What should happen |
|------|-------------------|
| Ask | *“Italian dinner El Poblado”* or *“1BR Laureles under $80”* |
| Agent | Routes to the right search (restaurant / rental / event / café) |
| UI | Cards with photo, rating, CTA; map pins in the right neighborhood |
| Memory | Long chats should **remember budget and neighborhood** (not done on prod redeploy yet) |

**Agent involved:** concierge on Gemini — tools for rentals, events, grounded places, venue booking.

---

### 2. Restaurant & nightlife discovery

**Carlos** explores Medellín food and nightlife.

| Step | What should happen |
|------|-------------------|
| Chat | *“Rooftop cocktails Provenza tonight”* → nightlife cards + panel |
| Chat | *“Best brunch El Poblado”* → restaurant cards |
| Browse | **`/restaurants` page** — map + filters, no chat required (**not live yet**) |
| Detail | Tap venue → hours, photos, **Book table** |
| Map | Pins show on prod map in Provenza (**prod map config still weak**) |

---

### 3. Book a table (venue booking)

**Sarah** wants a table at Pergamino or Relato.

| Step | What happens today | What’s next |
|------|-------------------|-------------|
| Open venue | Detail panel from chat or browse | Hours from Google cache (backfill improving) |
| Fill form | Date, party size, note | Same form for café / restaurant / nightlife |
| Submit | Request saved — **works** | — |
| Status | **Pending** chip on panel — **works** | — |
| Agent confirm | — | Agent asks *“Send this request?”* before save (**VEN-019**) |
| Venue WhatsApp | — | Draft message for host — **Phase 2 ops** |

---

### 4. Events in chat (after stability gate)

**Andrés** asks *“salsa events this weekend”*.

| Step | Status |
|------|--------|
| Backend search | Built |
| **Event cards in chat** | Ready to ship — **wait for 3 nightly prod health passes** |
| Buy ticket | **Deferred** — Commerce track |

---

### 5. Rentals (partial — not Beta focus)

**Camila** wants Laureles apartments.

| Today | Gap |
|-------|-----|
| Search works in chat | `/rentals` page redirects to chat |
| Schedule viewing from card | Works in chat overlay |
| Browse + filter page | **Blocked** — row 38 in queue |

---

## Automations & agents (no jargon)

| What runs | Who it helps | Purpose |
|-----------|--------------|---------|
| **Nightly prod chat check** | Sofía | Three nights in a row: prod answers sample rental + event questions with no crashes — **then** we merge risky chat UI |
| **Places backfill job** | Sarah | Fills in hours/phone on venue panels so users aren’t staring at empty details |
| **Concierge agent** | Everyone on `/chat` | Understands intent, calls search tools, shows cards, will ask approval before booking |
| **Prod journey scripts** | Lucía | Carlos nightlife + Sarah brunch scenarios tested on live site before we call venues “done” |
| **CI test suite** | Sofía | Blocks broken code from reaching Camila on prod |
| **Hybrid search ranking** | Carlos | Editorial “signals” boost quiet rooftops, cocktails — not just generic Google order |

**Not active yet:** trip sync workers, Stripe webhooks, WhatsApp outbox, Patricia admin queue.

---

## Suggested next steps (from `tasks.md`)

Do **one feature at a time**. Order matches rows 1–37 + mobile polish.

### Now — platform trust (rows 1–7, 2)

| Priority | Feature | Real-world outcome | Task row |
|:--------:|---------|-------------------|----------|
| **1** | **Login works on prod** | Camila signs up on her phone at mdeai.co, stays logged in after refresh | row 2 · AUTH-011 |
| **2** | **Map shows pins on prod** | Tourist sees restaurant pins in Provenza, not empty map | row 6 · MAP-008B |
| **3** | **Café search on prod** | *“Specialty coffee Laureles”* returns real café cards on live site | row 7 · MAP-002B |
| — | **Wait: 3 green nightly checks** | Before merging big chat UI changes | row 1 · SAN-462 |

### Next — browse & finish venues (rows 21, 26–27, 37)

| Priority | Feature | Real-world outcome | Task row |
|:--------:|---------|-------------------|----------|
| **4** | **`/restaurants` page** | Tourist browses restaurants with map — no chat | row 21 · SCREEN-023 |
| **5** | **Booking tied to user** | Sarah’s request is clearly *hers* when agent helps | row 26 · AUTH-009 |
| **6** | **Agent asks before send** | *“Confirm booking request?”* — she taps yes | row 27 · VEN-019 |
| **7** | **End-to-end proof** | Lucía: chat → book → pending → browse — all green | row 37 · VEN-031 |

### After nightly gate passes (rows 11–12)

| Feature | Real-world outcome | Task row |
|---------|-------------------|----------|
| Event cards in chat | Andrés sees salsa events as cards, not hidden backend | row 11 · SEARCH-002 |
| Same card design everywhere | Rental, event, restaurant look consistent | row 12 · UX-023 |

### Fill gaps (rows 8–10)

| Feature | Real-world outcome | Task row |
|---------|-------------------|----------|
| Chat remembers earlier turns | Camila’s budget from message 1 still there at message 11 | row 8 · F13 |
| Better apartment search | *“2BR near Estadio”* uses full smart search | row 9 · DATA-EMBED |
| Live site journey log | Carlos + Sarah flows PASS on mdeai.co | row 10 · OPS-JOURNEY |

### Polish when core is green (rows 4, 17–20, 23, 42–48)

| Feature | Example | Task row |
|---------|---------|----------|
| Richer venue hours | Pergamino hours on panel without wait | row 4 · DATA-008 |
| Restaurant/nightlife UI polish | Better cards and panels | rows 17–20 |
| Mobile keyboard + send button | Camila types without Send hidden | rows 43–44 |

---

## Stop line — Discovery Beta is “done” when

1. Three nightly prod chat checks pass in a row  
2. Camila can log in on prod and stay logged in  
3. Map pins and grounded café search work on prod  
4. `/restaurants` browse works  
5. Sarah can book → see **Pending** → Lucía’s live journeys pass  
6. Chat remembers context across redeploys (F13)

**Then** reopen: ticket sales (D1–D5), trips (T1–T19), saved collections.

---

## Ignore for now

| Area | Why |
|------|-----|
| Stripe / tickets | Andrés checkout — Commerce MVP Exit |
| Trip planner / `/saved` | Phase 2 after venues |
| Smarter rental clarify | Nice polish — rows 49–50 |
| Roberto publish on prod | Row D3 — with commerce |
| WhatsApp to venues | Patricia ops — rows 28–30 |

---

## One-line “start Monday”

**Merge prod login fix → turn on prod map + café search → ship `/restaurants` → agent booking approval → prove the full Sarah/Carlos journey on mdeai.co.**

Details & specs → [`tasks.md`](../../tasks.md) · How to ship safely → [`improve.md`](./improve.md)

---

## Cursor agent status (Linear)

**Project update:** [Core Foundation — Cursor current work](https://linear.app/sanjiovani/project/core-foundation-3a69b76c57ca/activity#project-update-6638f84c)

| Label | Meaning |
|-------|---------|
| `cursor:active` | Cursor is coding this now |
| `cursor:queued` | Next after active task |

| Status | Issue | Task |
|--------|-------|------|
| 🟡 Active | [SAN-367](https://linear.app/sanjiovani/issue/SAN-367) | Prod login — Camila on iPhone |
| ⏳ Waiting | [SAN-462](https://linear.app/sanjiovani/issue/SAN-462) | Nightly soak 1/3 |
| 📋 Queued | [SAN-369](https://linear.app/sanjiovani/issue/SAN-369) · [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) · [SAN-490](https://linear.app/sanjiovani/issue/SAN-490) | Map pins · cafés on prod · `/restaurants` |

*Updated 2026-06-03*
