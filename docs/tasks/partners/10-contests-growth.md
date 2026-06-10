---
title: "Part 9 — Contests & Growth Loops"
updated: 2026-06-06
parent: ./00-INDEX.md
linear-prefix: CONT (prefix:CONT exists)
---

# Part 9 — Contests & Growth Loops

Growth = supply ↔ demand flywheel + sponsor-funded contests. Map to existing `prefix:CONT` contest vertical.

## Programs

| Program | Who | Mechanic | Loop it feeds |
|---|---|---|---|
| **Referral** | partners | invite a venue/host → both get credit | supply growth |
| **Ambassador** | power users/locals | curate guides, earn perks | content + demand |
| **Creator program** | influencers | build guides, affiliate revenue | demand + content |
| **Sponsor contests** | sponsors + consumers | brand-funded giveaway, entry = action | demand + sponsor $ |
| **Venue contests** | venues | "best Tuesday night" leaderboard | supply engagement |
| **Restaurant challenges** | restaurants + foodies | dish-of-the-month votes | demand + UGC |
| **Event attendance rewards** | attendees | points per ticket → perks | repeat purchase |
| **Loyalty system** | all consumers | tiers, streaks, saved-based perks | retention |
| **Gamification** | partners | completion score, badges, fill-rate | activation |

## Core viral loop

```mermaid
flowchart LR
  HOST["Host/venue publishes"] --> EV["More events/listings"]
  EV --> DISC["Better concierge answers"]
  DISC --> USERS["More users discover"]
  USERS --> BUY["Tickets / leads / bookings"]
  BUY --> $$["Partner earns"]
  $$ --> REF["Partner refers peers"]
  REF --> HOST
```

## Contest loop (sponsor-funded)

```mermaid
flowchart LR
  SPON["Sponsor funds prize"] --> CONTEST["Contest live (/contests)"]
  CONTEST --> ENTRY["Entry = save · attend · refer · post"]
  ENTRY --> SHARE["Users share to enter"]
  SHARE --> NEW["New users in"]
  NEW --> ENTRY
  CONTEST --> DATA["Sponsor gets reach + leads"]
  DATA --> RENEW["Sponsor renews"] --> SPON
```

## Creator loop

```mermaid
flowchart LR
  CR["Creator builds guide"] --> AUD["Audience follows"]
  AUD --> CLICK["Clicks → bookings"]
  CLICK --> EARN["Creator earns affiliate"]
  EARN --> MORE["Creator makes more guides"] --> CR
  CLICK --> GMV["Platform GMV ↑"]
```

## Guardrails
- Contests must stay **honest/grounded** (real entries, labeled sponsor content).
- Anti-abuse: dedupe entries, rate-limit referrals, verify before payout.
- Start with ONE loop (referral) — prove it before layering gamification.
