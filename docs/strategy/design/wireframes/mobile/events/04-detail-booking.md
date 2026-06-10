# 04 — Detail Pages & Booking Workflow

Covers **#11 Restaurant detail**, **#12 Rental detail**, **#10 Booking workflow screens**. Detail pages open from a card/pin (full page on desktop, full sheet on mobile). Shared components → [00-foundations.md](00-foundations.md). Photos/hours/reviews fetched **on open only** (cost).

---

## #12 Rental detail  ·  `/rentals/:id`  ·  persona: Camila

**Goals:** give Camila everything to decide + commit to a **viewing** (lead) — honest total price, real location context, trust signals. No external OTA handoff.

### Desktop

```text
┌──────────────────────────────────────────────────────────────────┐
│ TopNav · ‹ Back to results                                         │
├───────────────────────────────────┬────────────────────────────────┤
│ [▢▢▢ photo gallery ●●●○]          │  ┌── sticky booking card ─────┐ │
│ Studio in Laureles  ✔ Verified    │  │ $1,200/mo                  │ │
│ ★4.8 (212) · 1 bd · furnished     │  │ ── PriceBreakdown ──       │ │
│                                    │  │ rent $1,200 · fees $120    │ │
│ ── About ──                        │  │ total $1,320/mo            │ │
│ Quiet building, 10 min to metro…   │  │ [ Schedule viewing ]       │ │ primary CTA
│ ── Amenities ── wifi·kitchen·…     │  │ [ Save ♡ ]  [ Ask mde ]    │ │
│ ── Location ──                     │  │ ✔ Verified listing         │ │
│ [▢ map · ◉ pin · 350m coffee ·    │  │ from Google Maps           │ │
│   coworking · metro]               │  └────────────────────────────┘ │
│ ── What people say ── (synthesis)  │                                  │
│  "bright, quiet, responsive host"  │  (card stays sticky on scroll)   │
│ ── Reviews ── ★ list               │                                  │
└───────────────────────────────────┴────────────────────────────────┘
```

### Mobile: gallery → title/trust → sticky bottom bar `[$1,320 total · Schedule viewing]` → about/amenities/map/reviews stacked.

| Section | Detail |
|---|---|
| Gallery | carousel; skeleton on load |
| Header | title · ✔ Verified · ★(count) · key facts |
| Booking card (sticky) | `PriceBreakdown` (**total**, anti-GuideGeek) · **Schedule viewing** · Save · Ask mde (opens `/chat` about this listing) |
| Location | map + pin + Medellín-graph context (metro/coffee/coworking distances) |
| Trust | Verified badge · `ReviewSynthesis` · reviews · grounding |

**CTA:** Schedule viewing → `LeadForm`/HITL (see booking flow below). **Monetization:** lead → commission (Advanced native booking). **Retention:** Save, "Ask mde", alert for similar. **States:** default · loading skeleton gallery+facts · empty "Listing no longer available — see similar →" · error retry.

---

## #11 Restaurant detail  ·  `/restaurants/:id`  ·  persona: Tourist + Camila

**Goals:** answer "is this my spot?" fast — vibe, best dishes, hours, location — and let user add to trip / reserve / get directions.

### Desktop

```text
┌──────────────────────────────────────────────────────────────────┐
│ ‹ Back            [▢ hero photo]                                   │
│ Café Vibe · Laureles   ★4.6 (180) · ☕ $$ · Open now · closes 8pm  │
│ vibe: quiet · bright · laptop-friendly                             │ tags
│ ┌── action bar ──────────────────────────────────────────────┐    │
│ │ [ Add to trip ] [ Reserve ] [ Directions ] [ Save ♡ ]       │    │ sticky
│ └──────────────────────────────────────────────────────────────┘  │
│ ── Best for ── focus work · espresso · solo brunch  (AI, labeled)  │
│ ── What people say ── themes: "great wifi", "slow at peak"          │ synthesis
│ ── Menu highlights ── (OpenClaw-extracted, Post-MVP) signature dish │
│ ── Hours ── Mon–Fri 7–8 · Sat 8–6      ── Location ── [▢ map ◉]    │
│ ── Photos ──  ── Reviews ── ★ list · from Google Maps              │
└──────────────────────────────────────────────────────────────────┘
```

### Mobile: hero → title/tags → sticky action bar → best-for → synthesis → hours → map → photos/reviews.

| Section | Detail |
|---|---|
| Header | name · ★(count) · price band · **Open now + closing time** · vibe tags |
| Action bar (sticky) | Add to trip · Reserve (Post-MVP) · Directions · Save |
| Best for | AI semantic line (labeled) — the differentiator |
| Menu highlights | OpenClaw-extracted signature dishes / dietary (Post-MVP) |
| Trust | `ReviewSynthesis` themes + reviews + grounding + freshness |

**Monetization:** reservation fees, promoted (labeled). **Retention:** Save/Add to trip, vibe match. **States:** default · loading skeleton · empty "Couldn't load this place — back to results" · error retry. **Avoid:** raw review dumps — synthesize.

---

## #10 Booking workflow screens

Two money paths, both **in-surface** (the GuideGeek gap):
**A. Event ticket → Stripe (MVP, O1)** · **B. Rental viewing → lead/HITL (MVP, O3)**. Restaurant/native-rental booking = Post-MVP/Advanced.

### A. Event ticket checkout  ·  `/events/:id` → checkout → `/me/tickets/:id`  ·  persona: Andrés/Miguel

```text
STEP 1 Event detail            STEP 2 Checkout              STEP 3 Confirmation
┌────────────────────┐         ┌────────────────────┐      ┌────────────────────┐
│ Salsa Night        │         │ Salsa Night · Fri 9p│      │ ✅ You're going!    │
│ Fri Jun 6 · 9pm    │         │ Tier: General  [2 ▾]│      │ ┌── QR ──┐          │
│ Provenza · ◉ map   │         │ ── PriceBreakdown ──│      │ │ ▓▓▒▒▓ │  ticket    │
│ Tiers:             │         │ 2 × $25 = $50       │      │ └────────┘          │
│  General $25       │         │ fee $4 · total $54  │      │ View in wallet →    │
│  VIP $60           │         │ [ card ····  ]      │      │ Add to trip · Share │
│ [ Buy tickets ]    │   →     │ [ Pay $54 ]  Stripe │  →   │ Reminder set (WA)   │
│ 124 going · ✔ org  │         │ 🔒 secure           │      └────────────────────┘
└────────────────────┘         └────────────────────┘
```

| Step | Detail |
|---|---|
| 1 Detail | tiers · `PriceBreakdown` · ✔ verified organizer · map · "going" social proof · **Buy tickets** |
| 2 Checkout | qty/tier · total incl fees · `StripeCheckout` · trust lock; guest checkout (email/phone), account optional |
| 3 Confirm | **QR** + wallet link (`/me/tickets/:id`) · Add to trip · reminder opt-in (WA Phase 2) |

States: 1 default/loading/sold-out("Join waitlist")/error · 2 idle/processing/**declined(retry, no double-charge — idempotent webhook)**/network · 3 success(QR)/pending("confirming payment…")/failed(support). Wallet `/me/tickets/:id`: QR · event details · transfer (Advanced) · directions.

### B. Rental viewing / lead (HITL)  ·  from rental detail  ·  persona: Camila

```text
STEP 1 Schedule viewing        STEP 2 (HITL/agent)          STEP 3 Confirmation
┌────────────────────┐         ┌────────────────────┐      ┌────────────────────┐
│ Studio · Laureles   │         │ (mde proposes slots │      │ ✅ Request sent     │
│ Pick a time:        │         │  / broker confirms) │      │ We'll confirm by    │
│ [Thu 3p][Fri 11a]…  │   →     │ ⠿ checking availabil│  →   │ WhatsApp/email.     │
│ Name [..] Phone [..]│         │  ity with host…     │      │ Meanwhile: similar →│
│ [ Request viewing ] │         │                     │      │ Saved to trip       │
└────────────────────┘         └────────────────────┘      └────────────────────┘
```

| Step | Detail |
|---|---|
| 1 | `LeadForm` — preferred slots + name/phone (minimal) → `leads` row |
| 2 | AI proposes / broker confirms slot (HITL); `showings` row (light) |
| 3 | Confirmation + fallback channel + similar listings + auto-Save |

States: 1 default/submitting/error · 2 pending(async)/no-availability("propose other times") · 3 sent/failed("retry or WhatsApp us"). **No payment** in MVP rental path. **Monetization:** qualified lead. **Trust:** clear "we'll confirm", no spam, human-in-loop.

---

## Booking UX principles (both paths)
- **Total price always shown before commit** (anti-GuideGeek hallucination).
- **Complete in-surface** — never redirect to OTA as the primary action.
- Minimal fields; guest-first, account optional.
- Idempotent payment; never double-charge on retry.
- Confirmation always offers a **next step** (wallet, trip, similar, reminder) — no dead-ends.
- HITL on money-adjacent/lead actions; user always told what happens next.
