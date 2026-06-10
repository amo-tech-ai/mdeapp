---
screen: Host Overview
screenshots: [me-2.png, me-5.png]
route: /host/events
persona: Roberto
mdeai_status: live
linear: SAN-118, SAN-730
---

# Wireframe — Luma Host Overview

## Goals

See all hosted events, status, quick actions (duplicate, share, view insights).

## ASCII — mobile

```text
┌─────────────────────────────────────┐
│ Host · Events                       │
├─────────────────────────────────────┤
│ [+ Create event]                    │
├─────────────────────────────────────┤
│ Live                                │
│ ┌─────────────────────────────────┐ │
│ │ Fashion Night · 42 registered   │ │
│ │ Jun 12 · Published              │ │
│ │ [Manage] [Insights] [Share]     │ │
│ └─────────────────────────────────┘ │
│ Draft                               │
│ ┌─────────────────────────────────┐ │
│ │ Rooftop Jazz · draft            │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## ASCII — mdeai with Copilot (target)

```text
┌──────────┬────────────────────────────┐
│ Host nav │ Event grid + stats         │
│ · New    │                            │
│ · Events │ ┌─ Copilot sidebar ─────┐  │
│ · Analytics│ "Revenue this week?"  │  │
└──────────┴────────────────────────────┘
```

## Component inventory

| Component | Type | Purpose |
|-----------|------|---------|
| HostEventCard | domain | Title, date, reg count |
| CreateEventCTA | page | → wizard |
| HostNavRail | layout | SAN-730 enable links |

## mdeai mapping

**LIVE:** `/host/events` grid. **Gap:** nav link disabled (SAN-730); no per-event insights shortcut.

## Wireframe prompt

Map Luma manage row actions to mdeai host grid cards.
