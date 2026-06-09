---
screen: Discover
screenshots: [Events-discover-1.png, Events-medelin1.png]
route: /events, /
persona: Camila
mdeai_status: partial
linear: SAN-117
---

# Wireframe — Luma Discover

## Goals

| User | Goal | Business value |
|------|------|----------------|
| Camila | Find relevant events fast | MAU, chat engagement |
| Tourist | Browse by city without chat | SEO, direct traffic |

## ASCII — mobile (Luma pattern)

```text
┌─────────────────────────────────────┐
│ [≡]  Discover          [Search 🔍]  │
├─────────────────────────────────────┤
│ Featured in Medellín                  │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │ card    │ │ card    │ │ card    │ │  ← horizontal scroll
│ └─────────┘ └─────────┘ └─────────┘ │
├─────────────────────────────────────┤
│ Categories                          │
│ [Music] [Tech] [Food] [Wellness]    │
├─────────────────────────────────────┤
│ This week                           │
│ ┌─────────────────────────────────┐ │
│ │ thumb │ Title · Thu 7pm         │ │
│ │       │ Host · Poblado · Free   │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ thumb │ ...                     │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ [Discover] [Calendars] [Me]         │  ← bottom nav
└─────────────────────────────────────┘
```

## ASCII — mdeai `/` (3-panel desktop)

```text
┌──────┬──────────────────────────┬────────────┐
│ Nav  │ CopilotChat + event cards│ Map + pins │
└──────┴──────────────────────────┴────────────┘
```

## Component inventory

| Component | Type | Purpose |
|-----------|------|---------|
| CityHeader | page | Medellín context |
| CategoryChips | domain | Filter intent |
| EventCardHorizontal | domain | Featured scroll |
| EventListRow | domain | Dense list |
| BottomNav | design-system | Mobile IA |

## States

| State | Behavior |
|-------|----------|
| Default | Cards + categories |
| Loading | Skeleton rows |
| Empty | “No events this week” + chat CTA |
| Error | Retry + fallback to chat |

## mdeai mapping

| Luma | mdeai | Status |
|------|-------|--------|
| Discover feed | `/events` + chat cards | 🟢 |
| City page | Geo filter in search | 🟡 |
| Calendars | post-MVP | ⚪ |

## Wireframe prompt

See [`../02-wireframe-prompts.md`](02-wireframe-prompts.md) — attach `Events-discover-1.png`.
