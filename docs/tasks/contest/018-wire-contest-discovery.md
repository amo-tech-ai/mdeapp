---
type: wireframe
id: WIRE-009
number: "009"
title: Contest Discovery
persona: Tourist
path: /contests
priority: P2
build_status: Frozen
screens:
  []
screen_ids:
  []
skill:
  - mde-wireframe
phase: Phase 2+
---
# Wireframe: Contest Discovery

**Persona:** Tourist, sponsor brands · **Surface:** chat + card · **Phase:** 3

## In-thread discovery

```text
USER: startup events with vote contests this month

ASSIST: Two fashion/startup contests in Medellín with live voting.

┌ ContestCard ──────────────────────────────────────────┐
│ Medellín Fashion Week — Startup Pitch Night             │
│ Vote for your favorite brand · ends Jun 20              │
│ 12 entrants · Sponsored by …                          │
│ [View contestants] [Cast vote] [Save event]             │
└───────────────────────────────────────────────────────┘
```

## Vote flow (HITL light)

```text
Select contestant → confirm vote → vote.* tables → leaderboard card refresh
```

## Tables

`vote.*`, `event_sponsors`, `events`

## Monetization

Sponsor tiers, contest sponsorship CTA for Patricia/admin
