---
title: "Design summary — what we're doing (plain English)"
updated: 2026-06-06
owner: sanjiovani
audience: anyone — no design jargon
references:
  - ../../wireframe/home-wireframe.html              # our home (D-13)
  - ../../wireframe/rentals-browse-wireframe.html     # new
  - ../../wireframe/rental-detail-wireframe.html      # new
  - ../../wireframe/map-workspace-wireframe.html      # new
  - ../../docs/component-mapping.md                   # which shadcn parts to use
  - /home/sk/mdeai/screenshots/mindtrip/marketing/home-mindtrip.png  # Mindtrip HOME (marketing)
  - /home/sk/mdeai/screenshots/mindtrip/01-mindtrip.png              # Mindtrip APP (chat + rentals + map)
  - /home/sk/mdeai/screenshots/mindtrip/explore.png                 # Mindtrip EXPLORE (browse grid + map)
---

# Design summary — what we're doing

## In one sentence

We are designing mdeai's pages to look and work like **Mindtrip** (our closest competitor), but for **Medellín** — same proven shapes, our brand (teal + gold, light, clean), and our own twist (real-estate rentals + a "host an event" side that Mindtrip doesn't have).

---

## Mindtrip is our reference. Here's how their pages line up with ours.

You sent three Mindtrip screenshots. They are **three different kinds of page**, and each one matches a page we're building:

| Mindtrip screenshot | What it is | Our matching page | Status |
|---|---|---|---|
| `marketing/home-mindtrip.png` | **Marketing home** — the public landing page that sells the product (hero, "how it works", inspiration, press logos, footer) | **Our `/` home** — `home-wireframe.html` (D-13) | wireframe done, build pending |
| `01-mindtrip.png` | **The app** — you've asked a question and it answers with rental cards on the left and a **map** on the right | **Our `/rentals` + `/chat`** — `rentals-browse-wireframe.html` + `map-workspace-wireframe.html` | wireframes done (this session) |
| `explore.png` | **Explore** — a grid of place cards with filters + a map | **Our browse pages** (`/restaurants`, `/cafes`, `/nightlife`, `/events`) | already live on prod |

So: **the home page is the marketing page**, and the other two are the **working app** (chat/rentals and browse). That's the part that was confusing earlier — I first compared our home to Mindtrip's *app*, but you meant their *marketing* home. Fixed below.

---

## The question you asked: is our HOME page similar to Mindtrip's home?

**Yes — about 80% the same shape.** Both are a long scrolling marketing page with the same building blocks, top to bottom:

| Section | Mindtrip home | Our home (`home-wireframe.html`) |
|---|---|---|
| Big hero + a chat/search box | ✅ "Travel differently." | ✅ "Ask anything about Medellín" (concierge) |
| "How it works" steps | ✅ | ✅ (band 12) |
| Category tiles | ✅ "New at Mindtrip" | ✅ Verticals strip — Rentals · Restaurants · Nightlife · Events (band 4) |
| Inspiration / popular | ✅ Popular itineraries, Get inspired | ✅ Trending + discovery rows (bands 6–7) |
| Social proof | ✅ "As featured in", "Tag us" | ✅ Trust band + testimonials (bands 9, 11) |
| Big footer | ✅ "Our adventure cities" | ✅ Large wordmark footer (band 13) |

**Where we are deliberately different (our advantages):**
- 🏠 **A "Host" band** (band 10) — Roberto can publish an event. Mindtrip has no supply/host side; we're a two-sided marketplace.
- 🗺️ **A live mini-map on the home page** (band 3) — "see it on the map", our anti-"list of links" promise.
- 📍 **Neighborhood intelligence** (band 8) — editorial "Laureles vs El Poblado" content. Mindtrip leans on trip-collaboration/receipts features instead; we lean on local Medellín knowledge.

**Plain takeaway:** our home is the right shape already. It's not a copy — it keeps the parts that work (hero chat, how-it-works, inspiration, footer) and adds the two things that make us *us*: the **map** and the **host** side.

---

## What we just produced this session

Three new **wireframes** (blueprints — grey boxes showing layout + notes, not the final coloured page) and one **component list**:

1. **`/rentals` catalog** (`rentals-browse-wireframe.html`) — the apartment list with a map, like Mindtrip's app (`01-mindtrip.png`). Today `/rentals` just bounces you to chat; this is the real page. For **Camila**. The main button is **"Schedule viewing"** (we capture a lead — we don't send people to another site).
2. **`/rentals/[id]` detail** (`rental-detail-wireframe.html`) — one apartment: photos, price, specs, and the same "Schedule viewing" button.
3. **Map workspace** (`map-workspace-wireframe.html`) — the shared map where **hovering a card lights up its pin, and hovering a pin lights up its card**. Reused by rentals, browse, and chat.
4. **Component map** (`docs/component-mapping.md`) — exactly which shadcn UI parts each page uses, and the 9 new ones to install.

> We did **not** redo the home page — it already has a finished wireframe (`home-wireframe.html`). We built the three pages that were still missing.

---

## Where we are (design track, 14 steps)

- ✅ **Done:** foundations + wireframes + the browse pages (restaurants, cafés, nightlife, events are live).
- 🔄 **In progress:** the shared **VenueCard** (one card design used everywhere) — SAN-574.
- ☐ **Next to build:** `/rentals` catalog + detail, the map sync, then re-skin the home page.

## What's next (suggested order)

1. Finish the shared **VenueCard** (everything below reuses it).
2. Install the 9 shadcn parts (one small PR).
3. Build **`/rentals`** catalog + detail (Camila's #1 missing page).
4. Wire the **map hover sync**.
5. Re-skin the **home page** from its wireframe.

---

## The honest caveat

The earlier on-screen comparison I did was against Mindtrip's **logged-in app** home (it greeted "Where to today, Mde?"), which is their *workspace*, not their *marketing* home. Comparing the right pages (above), our **marketing home is closely aligned** and our **app pages (rentals chat + browse) match Mindtrip's app and explore almost one-to-one** — which is good: it means our blueprints follow a pattern that's already proven to work.
