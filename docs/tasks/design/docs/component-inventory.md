---
title: "MDE Component Inventory — 70/20/10 tagged (D-04)"
updated: 2026-06-05
linear: SAN-570 (epic SAN-566 · project UX · labels track:ux + scr)
related:
  - ./concierge-os-direction.md   # §7 OS component map
  - ./design-system.md            # tokens (D-02)
  - ../wireframe/home-wireframe.html
  - ../wireframe/explore-wireframe.html
  - ../../mdeapp/src/components/ui
---

# MDE Component Inventory

> **One line:** Every UI building block tagged **70 % shadcn / 20 % 21st / 10 % custom**. Custom only where we have no substitute: AI Concierge · Maps · Trips · Event intelligence · Saved · unified venue cards.

**Legend:** ✅ shipped in `mdeapp/` · ☐ planned (D-07 install or D-08 build) · 📄 spec only

---

## Split summary

| Layer | Share | Rule |
|-------|------:|------|
| **shadcn** | 70 % | Primitives + layout — `button`, `card`, `dialog`, `sheet`, `tabs`, `command`, … |
| **21st** | 20 % | Premium sections — hero, CTA, gallery rows, auth, footer |
| **custom** | 10 % | CopilotKit concierge · Google Maps · VenueCard/BrowseLayout · trips/saved OS |

---

## App shell

| Component | Layer | Status | Path / link | Notes |
|-----------|-------|:------:|-------------|-------|
| Top nav + mobile drawer | shadcn | ✅ | `navigation-menu` + `sheet` | 5 primary links; avatar menu for Tickets/Settings |
| Sidebar (dashboard) | shadcn | ☐ | D-07 `sidebar` | 5-domain dashboard zones |
| ⌘K command palette | shadcn | ☐ | D-07 `command` | Jump to concierge / route / saved |
| Toasts | shadcn | ☐ | D-07 `sonner` | Replace ad-hoc alerts where needed |
| Theme tokens | shadcn | ✅ | `globals.css :root` | Documented in `design-system.md` |

---

## Discovery / Explore (shared browse system)

| Component | Layer | Status | Path / link | Notes |
|-----------|-------|:------:|-------------|-------|
| Vertical tabs | shadcn | ☐ | D-07 `tabs` | 6 tabs: For You · Eat · Do · Nightlife · Events · Stay |
| AI Concierge band | custom | ✅ | `copilot-kit-provider`, chat shell | CopilotKit v1 — restyle only (D-12) |
| `<VenueCard>` | custom | ☐ | D-08 `components/browse/` | Consolidate `restaurant-card`, `rental-card`, café cards |
| `<BrowseLayout>` | custom | ☐ | D-08 | Cards │ Map split; re-skin existing routes |
| Result cards (chat) | custom | ✅ | `copilot/restaurant-card.tsx`, `rental-card.tsx`, `cafe-result-card.tsx` | **Reuse** — D-08 merges onto one shell |
| Map panel | custom | ✅ | map components + `mapId` | D-11: pin ↔ card sync |
| Card carousel rows | shadcn + 21st | ☐ | D-07 `carousel` · 21st `gallery4` | Home + Explore editorial rows |
| AI Insight strip | custom | ☐ | D-12 | Grounded only — hide when no signal |
| Filter chips | shadcn | ✅ | `badge` + button | Neighborhood / vibe on browse pages |

---

## Home (`/` — 14 bands)

| Band | Layer | Status | Spec | Notes |
|------|-------|:------:|------|-------|
| 01 Nav | shadcn | ✅ | `home-wireframe.html` §01 | |
| 02 Hero + concierge input | 21st + custom | ✅ | §02 | CopilotKit input in hero |
| 03 Live map teaser | custom | ✅ | §03 | Elevate in D-13 re-skin |
| 04 Verticals strip | shadcn | ✅ | §04 | Links to `/restaurants`, `/cafes`, … |
| 05 Concierge suggestions | custom | ✅ | §05 | |
| 06–07 Trending / events | shadcn + 21st | ✅ | §06–07 | |
| 08 Neighborhood intel | custom | ✅ | §08 | |
| 09 Trust band | 21st | ✅ | §09 | Keep for conversion |
| 10 Host band | shadcn | ✅ | §10 | Roberto → `/host/event/new` |
| 11 Testimonials | 21st | ✅ | §11 | |
| 12 How-it-works + CTA | 21st | ✅ | §12 | |
| 13 Footer | 21st | ✅ | §13 | |
| 14 FAB / mobile nav | custom | ✅ | §14 | |

Full band → component map: [`wireframe/home-wireframe.html`](../wireframe/home-wireframe.html).

---

## Dashboard OS (5 zones — D-06 / D-10)

| Zone | Routes | Layer | Status | Notes |
|------|--------|-------|:------:|-------|
| **Upcoming** | `/me/tickets`, reservations | shadcn + 21st | 📄 | Plans + tickets + bookings folded |
| **Trips** | `/trips` (SHELL) | custom | 📄 | Itinerary workspace — not analytics |
| **Saved** | `/saved` (LIVE) | custom | ✅ partial | Collections; re-skin in D-10 |
| **For You** | concierge recs | custom | 📄 | Grounded recommendations |
| **Activity** | history | shadcn | 📄 | Recent actions — no charts |

Wireframe: [`wireframe/dashboard-wireframe.html`](../wireframe/dashboard-wireframe.html).

---

## Auth & modals

| Component | Layer | Status | Path | Notes |
|-----------|-------|:------:|------|-------|
| Sign in / sign up | 21st | ✅ partial | `/login`, `/signup` | 21st `sign-in` target pattern |
| Dialog / sheet modals | shadcn | ✅ | `ui/dialog.tsx`, `ui/sheet.tsx` | HITL + detail panels |
| Loading skeletons | shadcn | ✅ | `ui/skeleton.tsx` | SCREEN-019 patterns |
| Empty / error states | shadcn | ✅ | cross-cutting | SAN-265 — extend in D-14 |

---

## P0 shadcn install (D-07) — missing primitives

```bash
cd mdeapp && npx shadcn@latest add tabs command avatar carousel sonner sidebar
```

| Primitive | Used by |
|-----------|---------|
| `tabs` | Explore verticals |
| `command` | ⌘K palette |
| `avatar` | Nav, testimonials |
| `carousel` | Card rows |
| `sonner` | Toasts |
| `sidebar` | Dashboard shell |

**Already installed:** `button`, `card`, `dialog`, `sheet`, `badge`, `input`, `label`, `dropdown-menu`, `separator`, `tooltip`, `skeleton`.

---

## Custom-only (never replace with generic kits)

| Surface | Why custom | Owner task |
|---------|------------|------------|
| CopilotKit concierge | Agent + generative UI + HITL | D-12 |
| Google Maps (`mapId`, FieldMask) | Pins, hover sync, Places cost | D-11 |
| VenueCard + BrowseLayout | One card, three vertical skins | D-08 |
| Trips workspace | Multi-day itinerary OS | post-MVP |
| Saved collections | Cross-vertical bookmarks | D-10 |
| Event intelligence | Host wizard + ticket tiers | Track A (Roberto) |

---

## Do not build (reuse or extend)

| Avoid | Use instead |
|-------|-------------|
| New `/explore` route | Re-skin `/restaurants`, `/cafes`, `/nightlife`, `/rentals` |
| Second card shell (SAN-437 alone) | D-08 consolidates SAN-360/437 + existing rich cards |
| Rebuild Done browse pages | D-09 = visual polish on SAN-490/491; functional work stays on route issues |
| Figma-as-source-of-truth | These wireframes + `globals.css` |
