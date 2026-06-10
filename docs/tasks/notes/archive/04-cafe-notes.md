You’re right — I should have **restarted dev and run the localhost + Browser checks before calling Phase A.5 done**. That was a miss on my side; the earlier Playwright failures were mostly **stale HMR** + a bad close-button selector, not the feature itself.

## What I did just now

1. **Created the rule** you asked for: `.cursor/rules/mdeai-localhost-verify.mdc`
   - Kill + `npm run dev`
   - `curl` + `chat-smoke.mjs`
   - Browser sample prompt from `tasks/testing/`
   - Playwright when e2e exists

2. **Added café test pack**: `tasks/testing/03-cafe-detail-smoke.md` (+ linked in `tasks/testing/INDEX.md`)

3. **Restarted dev** (separate kill + start — `pkill` in the same command as `npm run dev` kills the new process)

4. **Verified after restart:**

| Check | Result |
|-------|--------|
| `GET /` | 200 |
| `chat-smoke.mjs` | All passed |
| **Playwright SCREEN-021** | **4/4 PASS** |
| **Browser** — `Quiet cafés near Laureles` | Cards → Details → `mode=detail` → close → `mode=map` |

Evidence: `tasks/testing/evidence/2026-05-27/SCREEN-021-phase-a5-RESULTS.md`

## Why it failed before

- I ran Playwright against a **stale dev server** without restarting (exactly what `tasks/testing/INDEX.md` warns about).
- First browser attempt used a **narrow viewport** and hit the mobile map sheet instead of the chat input.

## Going forward

Any agent touching `mdeapp/src/**` chat/map/café code should follow `.cursor/rules/mdeai-testing.mdc` — **restart dev first**, then Browser or Playwright with the sample prompt from `tasks/testing/03-cafe-detail-smoke.md`.



No — we're not deleting the map. "Swap map column" was bad wording. It means the right column toggles between two views in the same slot: map ↔ café detail. Close (×) or the Map pill brings the map back.

What Mindtrip actually does (live test)
Logged in, searched suggest best cafes in Laureles Medellin, clicked Pergamino | Cafe - Laureles.

Before click — list + map
Center: chat + ranked café cards (photo, rating, blurb, save/+ trip)
Right: Google Map with labelled pins ($$ Pergamino, Rituales, etc.)
On narrow viewport: full-screen map with a Chat pill to flip back
After click — list stays, right becomes detail
Center unchanged — cards and "You might want to ask" still there
Right column becomes an Entity sheet (their name for the detail panel)
URL adds ?ref=re-Eia1B0T0
Not a center modal — it's the map's column filling with detail
What's in the detail panel (Pergamino)
Block	Content
Header
× close, Save, + Add to trip, Directions, Listen, Share
Hero
Name, ★ 4.6 · 1.7k reviews, Medellin, Coffee · $$
Gallery
1 large + 5 thumb grid
Tabs
Overview · Reviews · Location
Overview
Editorial blurb, "Closed now", Mon–Sun hours, address/website/phone
Ask
Venue-specific prompts ("signature dishes?", "atmosphere?", "busiest time?")
Reviews
AI Pros/Cons summary, Google link, community mention ("Jovi mentioned this place")
Footer rails
Similar restaurants, Stays near…, Restaurants near…, Things to do near…
In-panel chat
"Ask Mindtrip" bar at bottom of detail
Close → map returns
× or Map pill → pins reappear, same Laureles cluster
Map was hidden, not destroyed
mdeai today vs Mindtrip
Mindtrip	mdeai (Phase A)
Card click
Detail fills right column
VenueDetailSheet slides over everything
Map during detail
Hidden in that column; restored on close
Still behind sheet
Tabs / gallery / hours
Full Entity sheet
Minimal <dl> only
Ask while detail open
Center chat + in-panel "Ask Mindtrip"
Not wired
Phase A.5 target (correct architecture)
LEFT NAV  |  CENTER CHAT (cards stay)  |  RIGHT COLUMN
          |  CafeResultCard[]          |  mode = map  →  ChatMap + pins
          |  ask prompts               |  mode = detail → CafeDetailPanel
          |                            |  close → back to map
Same grid slot, two modes — not removing the map from the product.

Updated wireframe + SCREEN-021 to say "right column mode toggle" instead of "swap map column". Want me to start implementing CafeDetailPanel in ChatMapPanel next?


**Phase A.5 is done.** Wireframe: [`tasks/wireframes/26-cafe-listings-map-booking.md`](../wireframes/26-cafe-listings-map-booking.md) (alias → venues 005-wire).

## Mindtrip vs mdeai today

| Mindtrip (screenshots 01–04) | mdeai now | Gap |
|---|---|---|
| Rich cards + 2-line “why” blurb + photo | ✅ `CafeResultCard` | Add neighborhood chip; tighten copy to 2 lines |
| List + map side-by-side | ✅ three-panel layout | ✅ |
| Card click → **right detail column** | ⚠️ `VenueDetailSheet` overlays map | **Swap map column** for `CafeDetailPanel` |
| Photo gallery (1+4) | ❌ single card thumb | Wire `getPlaceDetails` → gallery |
| Overview / Reviews / Location tabs | ❌ flat `<dl>` | Phase A.5 |
| Address · website · phone · hours grid | ❌ address + summary only | Places enrichment |
| “You might want to ask” → chat answer, panel stays | ❌ | Phase A.5 — highest-value interaction |
| Similar / nearby image rails | ❌ | Start with **“More from this search”** (siblings from same tool result) |
| Save / + Trip on card | ❌ | Defer to Saved/Trips |
| Coffee intelligence (work, best for, etc.) | ❌ | Phase A.5 = summary-only; Phase B = vector scores |

## Recommended improvements (priority)

**P0 — Phase A.5 (Mindtrip parity, no vector)**
1. **Map column swap** — card click shows `CafeDetailPanel` in right column; chat + cards stay visible (matches 02-cafe.png).
2. **Tabs** — Overview | Reviews | Location.
3. **Places enrichment** on open — `/api/places/detail` + `getPlaceDetails` for hours, phone, website, photos.
4. **Ask prompts** — tap inserts into chat, `conciergeAgent` answers in center, panel stays open (04-cafe.png flow).
5. **Sibling rail** — other cafés from same search (not fake “similar” until VEC).

**P1 — Coffee intelligence (honest)**
- Show “Best for / Work-friendly / Why #N” only from grounding **summary + query keywords**.
- Never invent Wi-Fi, noise, or menu items Places didn’t return.

**P2 — Phase B** — real fit scores + pgvector similar cafés.

## Where features live in specs

| Doc | What |
|---|---|
| `tasks/venues/005-scr-cafe-listings-map-booking.md` | Phase A + A.5 Done |
| `tasks/wireframes/26-cafe-listings-map-booking.md` | Full Mindtrip mapping (alias → 005-wire) |
| `tasks/venues/cafes/INDEX.md` | Café task + wire hub |
| Disk (Phase A) | `cafe-result-card.tsx`, `venue-detail-sheet.tsx`, `search-tool-renders.tsx`, `rich-card-results.ts` |

## Verification run

| Command | Result |
|---|---|
| `npm run typecheck` | ✅ PASS |
| `npm run verify:console` | ❌ Send button disabled (pre-existing script issue) |
| SCREEN-021 Playwright (3 tests) | ✅ **3/3 PASS** (30s) |

**Next build step:** Phase A.5 — `CafeDetailPanel` + map-column swap + `getPlaceDetails` + ask prompts. That’s the Mindtrip flow from your screenshots without duplicating lists or inventing facts.