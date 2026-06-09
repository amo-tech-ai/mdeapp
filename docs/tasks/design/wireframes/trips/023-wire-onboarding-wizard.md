---
type: wireframe
id: WIRE-023
number: "023"
title: Onboarding Wizard
persona: New user
path: /onboarding
priority: P2
build_status: Deferred
screens:
  []
screen_ids:
  []
skill:
  - mde-wireframe
phase: Phase 2+
---
# Wireframe: Onboarding Wizard

**Source:** legacy `Onboarding.tsx`  
**Persona:** New Camila / Tourist · **Path:** `/onboarding` · **Auth:** post-signup

## 6-step flow

```text
Step 1/6 — Who are you?
┌─────────────────────────────────────────┐
│ [ ] Moving to Medellín (nomad)          │
│ [ ] Visiting (tourist)                  │
│ [ ] Local resident                      │
│ [ ] Event host / organizer              │
│                          [Next →]       │
└─────────────────────────────────────────┘

Step 2/6 — How long?
  · < 1 week · 1–4 weeks · 1–3 months · 3+ months

Step 3/6 — Neighborhoods (multi-select)
  [Laureles] [El Poblado] [Envigado] [Provenza] …

Step 4/6 — Budget
  Rentals: [≤ 2M] [2–3M] [3M+] COP/mo
  Events: casual · premium

Step 5/6 — Interests
  [Rentals] [Events] [Food] [Nightlife] [Tours] [Coffee]

Step 6/6 — Done
  → save user_preferences
  → redirect `/` with personalized greeting
  "Welcome — here are Laureles picks for nomads"
```

## Skip path

`[Skip for now]` → `/` — preferences empty, concierge uses defaults

## Data

`user_preferences`, `profiles` — feeds `rankingAgent` + working memory defaults

## Mobile

One question per screen; progress dots top
