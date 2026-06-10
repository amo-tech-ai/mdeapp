---
title: "Mindtrip → mdeai — full page-by-page comparison (plain English)"
updated: 2026-06-06
owner: sanjiovani
audience: anyone — no jargon
screenshots: /home/sk/mdeai/screenshots/mindtrip/
sibling: ./1-design-summary.md
---

# Mindtrip vs mdeai — every page, side by side

> **How to read this:** for each Mindtrip screen, what it is, the page it maps to on our side, whether we've built it, and whether we still need to design it. ✅ have it · 🔄 in progress · ☐ need to design · ⏭️ later (post-launch) · ❌ not our model.

## The full map

| # | Mindtrip screen | What it does | Our page | Status | Verdict |
|---|---|---|---|---|---|
| 1 | `marketing/home-mindtrip.png` | **Marketing home** — sells the product, scroll page | `/` home | wireframe done | ☐ build (new Mindtrip-style wireframe added — see below) |
| 2 | `01-mindtrip.png` | **App** — chat answer + rental cards + map | `/rentals` + `/chat` | wireframes done this session | ☐ build next |
| 3 | `explore.png` · `21-explore.png` | **Explore** — card grid + filters + map | `/restaurants` `/cafes` `/nightlife` `/events` | ✅ live on prod | ✅ done |
| 4 | `04-mindtrip_itinerary.png` | **Trip workspace** — chat + day-by-day itinerary + tabs (Bookings, Media, Calendar) | `/trips/[id]` | ⚠️ SHELL | ☐ **needs design** |
| 5 | `11-mindtrip_trip.png` | **Trip dashboard** — one trip: ideas, itinerary, bookings, map, "get trip-ready" | `/trips` | ⚠️ SHELL | ☐ **needs design** |
| 6 | `05-mindtrip_calendar.png` | **Trip calendar** — day/date planning | part of `/trips/[id]` | ⚠️ SHELL | ☐ design with trip workspace |
| 7 | `08-mindtrip_collections.png` | **Collections** — saved places grouped (restaurants/stays/events), photo mosaics | `/saved` | ✅ live | 🔄 re-skin only (D-10) |
| 8 | `10-mindtrip_places.png` | **Saved places list** | `/saved` (Places tab) | ✅ live | 🔄 re-skin |
| 9 | `13-mindtrip_profile.png` · `26-profile.png` | **Profile / account** — name, bio, social links | `/me/profile` | ⚫ POST | ⏭️ Phase 2 |
| 10 | `30-settings-memory.png` | **Memory** — facts the AI learned about you; toggle personalized chats | `/me/profile` (AI memory) | ⚫ POST | ⏭️ Phase 2 (pairs with SAN-597/603 memory work) |
| 11 | `31/32/33-settings-*.png` | **Settings** — notifications, payment, account, cookies | `/me/*` settings | ⚫ POST | ⏭️ Phase 2 |
| 12 | `12-mindtrip_updatespng.png` | **Updates** — notifications feed (slide-over) | (no route yet) | — | ⏭️ post-launch |
| 13 | `22-create.png` | **Create Hub** — build & monetize travel *guides* (creator economy, earnings) | — | — | ❌ **not our model** — see note |
| 14 | `07-mindtrip_chat.png` · `20-chat.png` | **Pure chat thread** | `/chat` | ✅ live | ✅ have it |
| 15 | `20-trips.png` · `25-next.png` | **Trips list / next steps** | `/trips` list | ⚠️ SHELL | ☐ needs design |

## What this tells us (the short version)

**Three real design gaps**, all in one area — **the Trips/planning surface**:
- **Trip dashboard** (`/trips`) — like Mindtrip's `11-trip.png`
- **Trip workspace + itinerary** (`/trips/[id]`) — like Mindtrip's `04-itinerary.png`
- **Trip calendar** — part of the same workspace

These are all ⚠️ SHELL today and map to our **D-10 (dashboard re-skin)** + the trips screens. For **Camila**, this is the "save what the concierge found, then plan the trip" loop — our retention surface.

**Already covered (no new design needed):**
- Explore/browse → live (restaurants, cafés, nightlife, events).
- Collections/Saved → live, only needs the re-skin.
- Chat → live.

**Deliberately later (Phase 2 / post-launch):** profile, memory, settings, updates/notifications. Fine to defer — they don't block launch.

**One thing we should NOT copy:** Mindtrip's **Create Hub** (`22-create.png`) is a *creator-economy* feature — users write travel guides and earn commissions. That's not the mdeai model. Our "create" is **Roberto publishing an event** at `/host/event/new` (already live) — a host/supply tool, not a creator-monetization program. Skip it.

## Suggested priority for the gaps

1. **Trip dashboard `/trips`** (Camila opens her saved plan) — highest retention value.
2. **Trip workspace `/trips/[id]`** (itinerary + bookings + calendar).
3. **Saved/Collections re-skin** (`/saved` already works — just apply the new look).

Profile, memory, settings, updates → bundle into a Phase-2 "account & personalization" design pass after launch.
