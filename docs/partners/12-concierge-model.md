---
title: "Part 11 — AI Concierge Interaction Model"
updated: 2026-06-06
parent: ./00-INDEX.md
note: how the concierge connects demand → partner → money → loyalty across every vertical
---

# Part 11 — AI Concierge Interaction Model

The concierge is the connective tissue: it turns a user intent into a partner transaction, then a relationship. Same brain (Mastra/Gemini via CopilotKit/AG-UI), many verticals.

## Universal pattern

```mermaid
flowchart LR
  U["User intent"] --> AI["✦ AI Concierge"]
  AI --> GND["Ground (Places · Supabase · signals)"]
  GND --> MATCH["Match partner / inventory"]
  MATCH --> ACT["Action: book · buy · lead · reserve"]
  ACT --> PAY["Payment / lead (Stripe · /api/leads)"]
  PAY --> FUP["Follow-up (confirm · reminder · review)"]
  FUP --> LOY["Loyalty (save · points · re-engage)"]
  LOY --> U
```

## Per-vertical mapping

| Vertical | Intent | Partner | Action | Money | Follow-up → Loyalty |
|---|---|---|---|---|---|
| Events | "what's on Friday" | host/nightclub | buy ticket | ticket fee | QR + "rate it" → points |
| Restaurants | "dinner in Provenza" | restaurant | reserve | reservation fee | "how was it" → saved |
| Cafés | "café to work from" | café | visit/save | featured | "back again?" → loyalty |
| Nightlife | "rooftop tonight" | club/bar | table booking | table % | "next weekend" → re-engage |
| Real estate | "2-bed Laureles" | broker | schedule viewing | lead fee | viewing reminder → trip |
| Trips | "plan my weekend" | many | multi-book | bundled fees | itinerary saved → return |
| Marketplace | "DJ for my event" | vendor | book service | commission | review → repeat |

## Two-sided view (concierge as router)

```mermaid
flowchart TD
  subgraph Demand
    C["Camila"] & A["Andrés"] & T["Tourist"]
  end
  C & A & T --> AI["AI Concierge"]
  AI --> R["Rentals"] & E["Events"] & V["Venues"] & TR["Trips"] & MP["Marketplace"]
  subgraph Supply
    R --> BRK["Brokers"]
    E --> HOST["Hosts"]
    V --> VEN["Venues"]
    MP --> VND["Vendors"]
  end
  BRK & HOST & VEN & VND --> $$["Transactions → mdeai fee"]
  $$ --> DASH["Partner dashboards + AI assistant"]
```

## Principles
- **Grounded** — every recommendation cites real inventory/signals; sponsored = labeled.
- **One brain, many renderers** — web, chat, future WhatsApp use the same Mastra agents.
- **HITL on money** — checkout, lead reply, publish all pause for a human.
- The **same co-pilot** spans consumer concierge → partner signup → partner dashboard (continuity is the moat).
