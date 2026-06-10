---
id: AIE-017-mvp
title: Sponsor pipeline screens + sponsorAgent
status: Not Started
priority: P1
phase: mvp
persona: roberto
linear: —
percent: 0
blocked_by: [AIE-016]
blocks: []
depends_on: []
wireframe: ../../wireframes/events/015-sponsor-dashboard.md through 018-proposal-center.md
evp: EVP-029-advanced-sponsor-crm-lite
---

# AIE-017-mvp — Sponsor pipeline

## Objective

Ship `/host/sponsors`, opportunities, proposals with `sponsorAgent` (agent #7 of 8).

## Routes

| Route | Wire |
|-------|------|
| `/host/sponsors` | 015 |
| `/host/sponsors/opportunities` | 016 |
| `/host/sponsors/proposals` | 018 |

## Schema

`sponsors`, `sponsor_deals`, `sponsor_opportunities`, `sponsor_proposals` — migration + RLS

## Acceptance criteria

- Research → score → proposal draft → HITL
- Agent cap ≤ 8
- No auto-send email/WhatsApp
