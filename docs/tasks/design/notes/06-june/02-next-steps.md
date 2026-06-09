D-08 build passes + 6/6 tests green. It's done — just needs Linear flipped. Now I have everything for the detailed breakdown.

---

## Detailed Critical Path — What, Why & How

---

### TODAY — Jun 6

---

#### Task 1 — Close the Card System *(D-08 — [SAN-574](https://linear.app/sanjiovani/issue/SAN-574))*

**Plain name:** "Finish the one universal card component"

**Why it matters:**
Every browse surface in mdeai — restaurants, cafés, rentals, events — currently shows cards built separately with different markup, different image sizing, and different spacing. A tourist using the app sees three slightly different "products." D-08 creates **one `VenueCard` + one `BrowseLayout`** that every vertical reuses. Until this is marked Done in Linear, six downstream tasks ([D-09](https://linear.app/sanjiovani/issue/SAN-575), [D-10](https://linear.app/sanjiovani/issue/SAN-576), [D-11](https://linear.app/sanjiovani/issue/SAN-577), [D-12](https://linear.app/sanjiovani/issue/SAN-578), [D-13](https://linear.app/sanjiovani/issue/SAN-579), [D-14](https://linear.app/sanjiovani/issue/SAN-580)) cannot start — they are all blocked on this single ticket.

**What's actually done (verified on disk right now):**
- `venue-card-shell.tsx` — full implementation, `legacy`/`nova` composition modes, `inline`/`cover` media layouts
- `BrowseLayout.tsx` — filter bar + results column + map slot prop
- 2 test files, **6/6 tests passing** (`npm run vitest run src/components/browse`)
- `san-574-scope-gate.sh` — PR diff guard script
- `npm run build` exits 0

**What's missing before flipping Done:**
- Linear status still says "Todo" — needs to be moved to Done
- Screenshot proof not recorded in `tasks/testing/evidence/`
- Verify `<Toaster />` from sonner is in root `layout.tsx` (D-07 wiring check)

**How to close it (15 min):**
```bash
# 1. Confirm tests pass
cd mdeapp && npx vitest run src/components/browse

# 2. Take screenshot proof
# (open localhost:3001/restaurants — confirms BrowseLayout in use)

# 3. Flip Linear SAN-574 → Done
# 4. This immediately unblocks SAN-575, 577, 578, 579, 580
```

**Impact:** Unblocks **6 tasks** worth ~3 weeks of design-build work.

---

### URGENT — By Jun 8 (2 days away)

---

#### Task 2 — Wire the Payment Finish Line *(EVP-003 — Stripe Webhook)*

**Plain name:** "Make Andrés's ticket purchase actually complete"

**Why it matters:**
Today Andrés can go through the full checkout flow — picks a ticket tier, clicks Buy, lands on Stripe's payment page, enters his card, and Stripe accepts the payment. Then **nothing happens.** The webhook that tells mdeai "payment succeeded, finalize the order" is not deployed. His ticket never appears in `/me/tickets`, the seat is never confirmed, and the event host never sees a sale. This is the only reason Andrés cannot complete a purchase end-to-end. **M5 (Transactions) target date is June 8 — two days from now.**

**What exists:**
- `/api/tickets/checkout` — creates Stripe session ✅
- `/me/tickets` wallet — displays purchased tickets ✅
- Stripe edge function v33 is deployed with `verify_jwt=false` and idempotent `finalize` RPC ✅
- Sitemap flags this as `🔵 MVP P0 blocked 🚨`

**What's missing:**
- Stripe Dashboard: event subscriptions not registered (`checkout.session.completed` + `payment_intent.payment_failed`)
- Live e2e proof: real checkout → webhook fires → order row created → ticket appears in wallet

**How to close it:**
```
1. Log in to Stripe Dashboard → Webhooks → Add endpoint
   URL: https://[project].supabase.co/functions/v1/ticket-payment-webhook
   Events: checkout.session.completed, payment_intent.payment_failed

2. Test with Stripe CLI:
   stripe trigger checkout.session.completed

3. Verify in Supabase: order row created + ticket visible at /me/tickets/[id]

4. Record evidence → flip SAN (EVP-003) → Done
```

**Impact:** Andrés can pay. Revenue flows. M5 closes on time.

---

#### Task 3 — Prove the Money Actually Works *(E2E Purchase Proof)*

**Plain name:** "Buy a real ticket start to finish as Andrés"

**Why it matters:**
Code passing tests ≠ money changing hands. The only proof that matters for launch is a human (or Playwright) going from "event page → Buy → Stripe → payment accepted → ticket in wallet → QR code on screen." This catches webhook signature mismatches, CORS issues, RLS blocks on the orders table, and any Stripe environment misconfig that unit tests can't see.

**Steps:**
```
1. Sign in as a test buyer account
2. Navigate to /events → pick any published event
3. Click "Buy Ticket" → Stripe checkout opens
4. Use Stripe test card: 4242 4242 4242 4242
5. Complete payment
6. Verify redirect to /me/tickets shows the new ticket
7. Open /me/tickets/[id] → QR code renders
8. Screenshot all 4 states as evidence
```

**Impact:** Closes the last `phase:launch` P0 blocker in the payment stack.

---

### THIS WEEK — Jun 8–13 (M3 Complete)

---

#### Task 4 — Build the Rentals Browse Page *(SAN-478)*

**Plain name:** "Give Camila somewhere to actually browse apartments"

**Why it matters:**
`/rentals` is **design-plan priority #1 (score 99)** — the highest-ROI surface in the entire app. Today, clicking "Rentals" in the nav redirects Camila to the chat screen. There is no browse grid, no filter bar, no rental listings visible without asking the AI. Rental search works (the Mastra tool + `/api/rentals/search` are live), but there is no page that surfaces those results visually. Until this exists, D-09 cannot re-skin the rentals route (you cannot skin a page that doesn't exist), and the rental detail page (`/rentals/[id]`) has nothing to link from.

**What's ready to build on:**
- `BrowseLayout.tsx` (D-08 Done) — drop-in grid + filter bar
- `VenueCard` shell (D-08 Done) — reuse for rental cards
- `/api/rentals/search` — live API endpoint
- Wireframe: `wireframe/rentals-browse-wireframe.html` on disk

**Acceptance criteria:**
- `/rentals` renders a grid of rental listings (not a redirect)
- Filter bar: price range, bedrooms, neighborhood
- Each card links to `/rentals/[id]` (shell OK for MVP)
- Uses `BrowseLayout` — no one-off layout
- `npm run build` + Vitest green

**Impact:** Camila's primary use case (apartment search) becomes visible. Unblocks D-09 rentals skin and SAN-479 detail page.

---

#### Task 5 — Apply the New Visual System to Browse Pages *(D-09 — [SAN-575](https://linear.app/sanjiovani/issue/SAN-575))*

**Plain name:** "Make restaurants, cafés, and nightlife look like one product"

**Why it matters:**
`/restaurants`, `/cafes`, and `/nightlife` are functional (they show results) but were built at different times with different card styles. After D-08 unified the card system, D-09 swaps each page's layout to use `VenueCard` + `BrowseLayout` consistently. The tourist landing on `/restaurants` and then `/cafes` should feel like the same app. This is the first task that produces **visible re-skin code** — it's the moment the light-luxury design spec stops being wireframes and becomes a real screen.

**Order:**
1. `/restaurants` first (functional + tested, SAN-490 Done)
2. `/cafes` second (functional, SAN-519 Done)
3. `/nightlife` third (functional, SAN-491 Done)
4. `/rentals` last (only after SAN-478 ships)

**What D-09 does NOT touch:**
- No API changes
- No Mastra/CopilotKit changes
- No new routes
- Skin only — if a page works today, it must still work after

**Impact:** The app's browse surfaces look polished. D-11 (map) and D-12 (concierge band) can start.

---

#### Task 6 — Re-skin the Homepage *(D-13 — [SAN-579](https://linear.app/sanjiovani/issue/SAN-579))*

**Plain name:** "Make the front door match the brand"

**Why it matters:**
`/` is the first page every new user sees at mdeai.co. It currently has the concierge entry and the basics, but the 14-band wireframe (`home-wireframe.html`, 624 lines) specifies a much richer experience: hero section, AI intro band, vertical carousels for events/restaurants/rentals, a map column, and social proof. This is the flagship first impression — what makes someone decide in 3 seconds whether mdeai feels like a serious product or a side project.

**Can run in parallel with D-09** — no shared dependency. Both only need D-08 Done (which it is).

**Wireframe ready:** `wireframe/home-wireframe.html` — 624L, fully annotated with 14 bands.

**Key bands to implement:**
1. Hero — city aerial + search entry prompt
2. AI concierge entry strip
3. "Trending in Medellín" horizontal carousel (events)
4. Restaurant picks grid
5. Rental spotlights
6. Map column viewport
7. Social proof / featured hosts

**Impact:** Tourist lands on mdeai.co and immediately understands the product. Conversion from home → chat increases.

---

### BY JUN 15 — M4 + M6

---

#### Task 7 — Sync Map Pins with Cards *(D-11 — [SAN-577](https://linear.app/sanjiovani/issue/SAN-577))*

**Plain name:** "Make the map and the cards talk to each other"

**Why it matters:**
This is **design-plan's highest-ROI UX feature (score 93)** and the primary competitive moat over Mindtrip. Today the map shows pins and the cards show results, but they are visually disconnected — hovering a card doesn't highlight the corresponding pin, and clicking a pin doesn't scroll to its card. Mindtrip nailed this interaction: the map and the card list feel like one synchronized viewport, not two side-by-side panels. When Camila hovers over "1BR Laureles" in the results column, the blue rental pin on the map should pulse. This spatial context is the core value of combining AI results + a map.

**Technical scope:**
- Pin hover state syncs with card hover (shared `selectedPinId` context)
- Map pin click scrolls result list to matching card
- Vertical-specific pin colors: blue=rentals, amber=events, orange=restaurants, yellow=cafés
- `mapId` on every `<Map>` instance (hard rule — already in AC)
- `X-Goog-FieldMask` on all Places calls (cost lever — already enforced)

**Blocked until:** D-08 ✅ + D-09 ✅ (needs re-skinned browse pages to wire into)

**Impact:** mdeai's map interaction becomes meaningfully better than the competition's. The spatial discovery experience is the product differentiator.

---

#### Task 8 — Re-skin the Dashboard Surfaces *(D-10 — [SAN-576](https://linear.app/sanjiovani/issue/SAN-576))*

**Plain name:** "Make saved places, trips, and tickets feel like one OS"

**Why it matters:**
Andrés checks `/me/tickets` after buying his salsa event tickets. Roberto looks at `/host/events` after publishing. Camila browses `/saved` to find her pinned apartments. These three surfaces — tickets, trips, saved — are the **retention layer** of the app. If they feel polished and consistent with the browse pages, users come back. If they look like afterthoughts bolted onto a chat UI, they don't. D-10 applies the dashboard wireframe (D-06) to these routes so they read as one coherent "manage your life" OS.

**Routes covered:**
- `/saved` — saved places + collections
- `/trips` — trips dashboard (currently a shell)
- `/me/tickets` — ticket wallet

**Note:** Labeled `phase:post-mvp` in Linear — it's a quality improvement, not a launch gate. Can ship in week 2 of Cycle 1.

---

#### Task 9 — Build the Trips Dashboard *(SAN-255 — M6)*

**Plain name:** "Give users a place to plan and review their trips"

**Why it matters:**
`/trips` exists as a stub (page renders, content is minimal). The trips dashboard is the **retention anchor** — it's where users come back to after their first chat session to pick up where they left off, review their saved itinerary, and continue planning. Without it, mdeai is a one-shot concierge: great first conversation, then the user has nowhere to return. The itinerary panel (SAN-251) pairs with this — Camila can save her Laureles apartment shortlist + the two restaurants she liked into a named trip.

**Wireframes ready:**
- `012-wire-trips-dashboard.md`
- `012-scr-trips-dashboard.md`
- `013-wire-itinerary-panel.md`

**Blocked until:** D-10 (dashboard re-skin provides the shell these surfaces inherit)

---

### BY JUN 22 — M7 Launch Gate

---

#### Task 10 — Final Polish + Proof Pass *(D-14 — [SAN-580](https://linear.app/sanjiovani/issue/SAN-580))*

**Plain name:** "Prove every re-skinned page is ready to ship"

**Why it matters:**
D-14 is the **quality gate** — nothing from the D-track design re-skin ships to production without passing this. It's not a vague "polish pass." The [§6 Quality Gate checklist](https://linear.app/sanjiovani/issue/SAN-580) has explicit proof requirements for every re-skinned surface: loading skeleton on slow connection, zero-results copy when no data, keyboard navigation on cards, `prefers-reduced-motion` respected, WCAG AA color contrast, and mobile layout at 375px. The deliverable is `d-14-RESULTS.md` — a table showing evidence for each check on each surface.

**8 checks per surface:**
1. Loading skeleton renders (not blank)
2. Zero-results state has copy + CTA (not empty white box)
3. Error state renders without crashing
4. Keyboard nav: Tab reaches cards, Enter activates
5. `prefers-reduced-motion` suppresses transitions
6. WCAG AA contrast on primary + muted text
7. Mobile 375px: no horizontal scroll, touch targets ≥ 44px
8. Playwright smoke: chat → result renders → card click → detail sheet

**Blocked until:** D-09, D-10, D-11, D-12, D-13 all Done.

---

#### Task 11 — Mobile + Accessibility Sweep *(SAN-521–530 — M7)*

**Plain name:** "Make sure the app works on a phone and for everyone"

**Why it matters:**
mdeai's primary users — Camila searching apartments, Andrés buying tickets, a tourist finding a restaurant — are mostly on mobile. The CopilotKit composer, chat bubbles, browse cards, map, checkout flow, and auth screens all need mobile-first treatment. Simultaneously, the accessibility pass ensures mdeai meets basic WCAG standards: screen reader labels on cards, focus rings visible, skip-to-content link, and modal focus traps. These are not optional — they are legal requirements in most markets and concrete usability improvements for real users.

**10 mobile issues (SAN-521–530):**

| Issue | What it covers | Why critical |
|---|---|---|
| SAN-521 | CopilotKit v1 mobile best practices | Composer crashes on iOS if not handled |
| SAN-522 | Chat composer — mobile input + send | Camila's primary entry point |
| SAN-523 | Chat mobile layout (bubbles, scroll) | Readable on 375px |
| SAN-524 | Concierge surface mobile | AI band usable on phone |
| SAN-525 | Map mobile (bottom sheet toggle) | Cards/map toggle on small screen |
| SAN-526 | Card touch targets + swipe | 44px minimum, no mis-taps |
| SAN-527 | Mobile checkout (Stripe embed) | Andrés pays on his phone |
| SAN-528 | Auth mobile (login/signup) | First-run experience |
| SAN-529 | Performance (LCP, INP) | Slow 4G in Medellín — real constraint |
| SAN-530 | PWA install prompt | "Add to home screen" for return users |

**Blocked until:** D-09 through D-13 complete (you test what exists, not wireframes).

---

## One-Page Summary

```
TODAY     D-08 Done gate (15 min) → Linear flip → unblocks 6 tasks
Jun 8     Stripe webhook live + Andrés buys ticket e2e → M5 closes
Jun 8–13  SAN-478 rentals page + D-09 browse reskin + D-13 home reskin
Jun 15    D-11 map↔card sync + D-10 dashboard reskin + SAN-255 trips
Jun 22    D-14 quality gate proof + SAN-521–530 mobile/a11y sweep
          → LAUNCH READY
```

**Two things determine if you hit June 22:**
1. **Stripe webhook by June 8** — revenue can't wait
2. **SAN-478 rentals page** — Camila's core use case, unblocks the entire D-09 chain