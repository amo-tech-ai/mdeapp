---
screen: Profile — Me
screenshots: [Events-profile.png, me-1.png, me-2.png, me-3.png, me-4.png, me-5.png, me-6.png]
route: /me/tickets, /host/events
persona: Andrés, Roberto
mdeai_status: partial
---

# Wireframe — Luma Profile / Me

## Goals

Single place for **attending** vs **hosting** identity; quick access to tickets and hosted events.

## ASCII — Luma me-* pattern

```text
┌─────────────────────────────────────┐
│ Profile                             │
├─────────────────────────────────────┤
│ [avatar] Name                       │
│ @handle · city                      │
├─────────────────────────────────────┤
│ [Hosting] [Attending] [Past]        │  ← tabs (me-1..6)
├─────────────────────────────────────┤
│ Upcoming                            │
│ ┌─────────────────────────────────┐ │
│ │ Event thumb · date · ticket     │ │
│ └─────────────────────────────────┘ │
│ Past events                         │
│ · Event title — attended            │
└─────────────────────────────────────┘
```

## me-* screenshot mapping (inferred)

| File | Likely tab |
|------|------------|
| me-1.png | Profile home |
| me-2.png | Hosting list |
| me-3.png | Attending upcoming |
| me-4.png | Past events |
| me-5.png | Event manage entry |
| me-6.png | Settings / account |

> **Confidence ~75%** — verify when screenshots land in `/screenshots/luma/`.

## mdeai mapping

| Luma tab | mdeai route | Status |
|----------|-------------|--------|
| Attending | `/me/tickets` | 🟢 |
| Hosting | `/host/events` | 🟢 |
| Past | wallet history | 🟢 partial |
| Unified profile | — | ⚪ post-MVP |

## States

| State | Behavior |
|-------|----------|
| Logged out | Redirect login |
| No tickets | Empty + discover CTA |
| No hosted events | CTA → `/host/event/new` |

## Wireframe prompt

Attach `me-1.png` through `me-6.png` — produce tab-by-tab ASCII.
