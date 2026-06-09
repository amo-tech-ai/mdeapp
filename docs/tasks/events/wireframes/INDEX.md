---
title: Events Wireframes — Index
updated: 2026-06-08-post-audit
skill: mde-wireframe
master: ./00-MASTER.md
audit: ./WIREFRAME-AUDIT-RESPONSE.md
shell: ./000-three-panel-workspace.md
shared_state: ./038-shared-state.md
plan: ../plans/04-AI-native-system.md
screen_count: 37
---

# Events — Wireframe Documentation

**37 screens** + global patterns + journeys. Grade **96/100** post-audit fixes.

---

## Master docs

| Doc | Contents |
|-----|----------|
| [**00-MASTER**](./00-MASTER.md) | Competitive analysis, inventory, data schema, impl order |
| [**WIREFRAME-AUDIT-RESPONSE**](./WIREFRAME-AUDIT-RESPONSE.md) | Audit validation + corrections |
| [**038-shared-state**](./038-shared-state.md) | CopilotKit `useCoAgent` TypeScript schemas |
| [**000-three-panel-workspace**](./000-three-panel-workspace.md) | Desktop / tablet / mobile shell |
| [**journeys/**](./journeys/) | Creation, discovery, ticketing, host, **venues** |

---

## Per-screen wireframes (`events/`)

### Consumer (001–007, 023, 035–036)

| # | Screen | Phase |
|---|--------|-------|
| 001–007 | Discovery → profile | Core/MVP |
| 023 | Notifications | MVP |
| 035 | Recommendations hub `/recommendations` | MVP |
| 036 | Attendee inbox `/inbox` | MVP |

### Venues (029–030, 025, 031) — audit P0 gap closed

| # | Screen | Route | Phase |
|---|--------|-------|-------|
| 029 | **Venue explorer** | `/venues` | Core |
| 030 | **Venue details** | `/venues/[slug]` | Core |
| 025 | Venue comparison (wizard) | host wizard | MVP |
| 031 | Host bookings | `/host/bookings` | MVP |

### Host (008–014, 024, 026, 032)

| # | Screen | Phase |
|---|--------|-------|
| 008–012 | Dashboard → attendees | Core/MVP |
| 013–014 | **Revenue + analytics** | Core 🔴 build |
| 024 | Host inbox | MVP |
| 026 | Revenue forecast | MVP |
| 032 | **Event health** | MVP |

### Sponsors (015–018, 033)

| # | Screen | Phase |
|---|--------|-------|
| 015–018 | Dashboard → proposals | MVP |
| 033 | Sponsor ROI | Advanced |

### Admin (019–022, 034)

| # | Screen | Phase |
|---|--------|-------|
| 019–022 | Dashboard → ops | MVP/Adv |
| 034 | **Exception center** | MVP |

### Platform (027–028, 037)

| # | Screen | Phase |
|---|--------|-------|
| 027 | Campaign center | Advanced |
| 028 | AI recs overlay | MVP |
| 037 | **⌘K · FAB · pills · tasks** | MVP |

**Template:** [events/_TEMPLATE.md](./events/_TEMPLATE.md)

---

## Audit quick reference

| Audit said missing | Status |
|--------------------|--------|
| Host analytics | ✅ 013–014 |
| Notifications | ✅ 023 |
| Sponsor/CRM | ✅ 015–017 |
| Approval center | ✅ 021 |
| Venue explorer/detail | ✅ **029–030** (added) |
| Attendee inbox | ✅ **036** (024 = host) |
| Recommendations route | ✅ **035** + 028 |
| Event health | ✅ **032** |
| Exception center | ✅ **034** |

---

## Legacy wire specs

| Legacy | Maps to |
|--------|---------|
| [003-wire-event-discovery](./003-wire-event-discovery.md) | 001 |
| [003-wire-event-detail-page](./003-wire-event-detail-page.md) | 003 |
| [004-wire-host-event-wizard](./004-wire-host-event-wizard.md) | 009 |
| [015-wire-my-tickets-qr](./015-wire-my-tickets-qr.md) | 005 |
| [EVP-014-wire-host-events-list](./EVP-014-wire-host-events-list.md) | 008 |

Hub: [003-events-README.md](./003-events-README.md)
