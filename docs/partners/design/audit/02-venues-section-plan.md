# SAN-661 · MKT — For Venues Landing: Section-by-Section Improvement Plan

**Auditor role:** Senior product designer, UX architect, conversion specialist, frontend lead  
**Date:** 2026-06-11  
**Source files:** `src/components/partners/partner-landing-shell.tsx` · `src/components/partners/venues-landing.tsx` · `src/app/venues/page.tsx`  
**Prior audit:** `docs/partners/design/audit/01-venues-audit.md` (forensic audit, overall grade D+, 38/100)  
**Build order:** See § Final Deliverables → Build Order

---

## Section 1 — Hero

### Current implementation

```
[ Badge: "FOR RESTAURANTS · CAFÉS · NIGHTLIFE · SPACES" ]
h1: "Fill your tables. Fill your nights."
p:  "mdeai puts your venue inside Medellín's AI concierge..."
[ Button: "List your venue →" ] [ Button: "Book a demo" ]
```

Background: `relative overflow-hidden border-b`, faint accent radial from `MarketingPageShell`. Centered layout, `max-w-3xl`, no visual elements, no product proof.

### Weaknesses

| Weakness | Severity |
|---|---|
| No product visualization — pure text | Critical |
| Accent radial glow is near-invisible (55% opacity over light bg) | High |
| Kicker badge wraps to 2 lines at 375px, breaks pill shape | High |
| Trust pills are buried at the bottom of the page (demo band) | High |
| "Book a demo" → `/contact` (separate page, 40-60% dropout) | High |
| No visual anchor — eye has nowhere to land | Medium |
| Hero section background is indistinguishable from the rest of the page | Medium |
| Secondary CTA text "Book a demo" competes with primary "List your venue" | Low |

### Missing product proof

- No concierge chat UI showing a venue answer
- No venue card showing what a listing looks like to a customer
- No booking approval chip showing the HITL control

### Conversion blockers

1. A venue owner reads the headline, has no idea what the product looks like, bounces
2. Secondary CTA routes away from the page — loses all engagement momentum
3. Trust pills not visible at conversion moment (hero) — only visible 1500px of scroll later

### Proposed layout

**Desktop (1280px+) — split left/right:**

```
┌─────────────────────────────────────────────────────────────────────┐
│ NAV                                                  [List your venue]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  ACCENT SLAB  bg-accent/10, rounded-b-[3rem], w-full, py-28  │  │
│  │                                                               │  │
│  │   LEFT 52%                      RIGHT 48%                    │  │
│  │                                                               │  │
│  │   FOR RESTAURANTS · CAFÉS        ┌─────────────────────┐    │  │
│  │   (text-xs tracking-widest       │  CHAT UI MOCKUP     │    │  │
│  │    uppercase muted)              │  rounded-2xl         │    │  │
│  │                                  │  shadow-lg           │    │  │
│  │   Fill your tables.              │                      │    │  │
│  │   Fill your nights.              │ "Where to eat in    │    │  │
│  │   (text-5xl font-bold)           │  El Poblado         │    │  │
│  │                                  │  tonight?"          │    │  │
│  │   mdeai puts your venue in the   │ ──────────────────  │    │  │
│  │   AI answer — not buried in      │ [El Balcón card]    │    │  │
│  │   search results.                │ ★4.8 · Reservar     │    │  │
│  │   (text-lg text-muted)           │                      │    │  │
│  │                                  │ ✓ Booking approved  │    │  │
│  │   [List your venue →]  ←filled  │   Tonight 8pm       │    │  │
│  │   [See how it works]   ←ghost   └─────────────────────┘    │  │
│  │                                                               │  │
│  │   ✓ Free to list  ✓ No setup fees  ✓ Cancel anytime         │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

**Mobile (375px) — stacked:**

```
┌─────────────────────────────┐
│ ACCENT SLAB  py-20          │
│                             │
│  FOR RESTAURANTS · CAFÉS    │
│  NIGHTLIFE                  │
│  (truncated or 2-line ok)   │
│                             │
│  Fill your tables.          │
│  Fill your nights.          │
│  (text-4xl font-bold)       │
│                             │
│  mdeai puts your venue in   │
│  the AI answer — not buried.│
│  (text-base)                │
│                             │
│  [List your venue →] ←full │
│  [See how it works ] ←full │
│                             │
│  ✓ Free  ✓ No fees          │
│                             │
│  ┌───────────────────────┐  │
│  │  CHAT UI MOCKUP       │  │
│  │  "Where to eat?"      │  │
│  │  [El Balcón card]     │  │
│  │  ✓ Booking approved   │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

### Implementation plan

**Task H-1: Accent slab background**
- Remove `relative overflow-hidden border-b` from hero `<section>`
- Add `bg-accent/10 rounded-b-[3rem]` to the hero section
- Increase vertical padding to `py-20 sm:py-28`
- Replace centered `max-w-3xl flex-col items-center` with `max-w-7xl grid grid-cols-1 lg:grid-cols-[52fr_48fr] items-center gap-12`
- Remove `text-center` — left-align on desktop

**Task H-2: Kicker fix**
- Shorten default kicker to `"FOR RESTAURANTS · CAFÉS · NIGHTLIFE"` (remove `· SPACES`)
- Each variant already has its own kicker — the default is the only one that overflows
- Alternatively add `truncate` class to the Badge if shortening is not desired

**Task H-3: Product UI mockup (HTML/CSS, no screenshots)**

New component `<ConciergePreviewMockup />` — build with pure HTML + Tailwind:

```tsx
// src/components/partners/concierge-preview-mockup.tsx
export function ConciergePreviewMockup() {
  return (
    <div className="rounded-2xl border border-border bg-background shadow-xl p-4 w-full max-w-sm">
      {/* Chat bubble */}
      <div className="mb-4 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
        "Where should we eat in El Poblado tonight?"
      </div>
      {/* Venue card */}
      <div className="rounded-xl border border-border bg-background-elevated p-3 flex gap-3 items-start">
        <div className="size-14 rounded-lg bg-accent/20 shrink-0" aria-hidden />
        <div>
          <p className="text-sm font-semibold text-foreground">El Balcón Mediterráneo</p>
          <p className="text-xs text-muted-foreground">★4.8 · Rooftop · Tapas · El Poblado</p>
          <button className="mt-1.5 text-xs font-medium text-accent">Reserve table →</button>
        </div>
      </div>
      {/* Approval chip */}
      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs text-success">
        <span aria-hidden>✓</span> Booking approved · Tonight 8 pm · Party of 4
      </div>
    </div>
  )
}
```

**Task H-4: Trust pills to hero**
- Cut the 3 trust pills from the demo band
- Add them directly below the CTA buttons in the hero
- Keep them in the demo band too (duplicate is fine — they do different jobs at different scroll depths)

**Task H-5: Secondary CTA**
- Change `secondaryHref` from `/contact` to `#how-it-works`
- Change `secondaryLabel` from `"Book a demo"` to `"See how it works"`
- "Book a demo" belongs in the sticky nav (P1) and demo band — not competing with the primary in the hero

**Task H-6: `<section>` aria update**
- Add `id="hero"` to the hero section for anchor navigation

### Impact · Effort · Risk

| Task | Impact | Effort | Risk |
|---|---|---|---|
| H-1 Accent slab + split layout | 9 | M | 2 |
| H-2 Kicker fix | 5 | S | 1 |
| H-3 Concierge mockup | 10 | M | 2 |
| H-4 Trust pills to hero | 7 | S | 1 |
| H-5 Secondary CTA → anchor | 8 | S | 1 |
| H-6 Aria update | 2 | S | 1 |

### Acceptance criteria

- [ ] Hero occupies a visually distinct color slab (accent/10 background)
- [ ] Desktop: left copy + right product UI panel (2-col grid)
- [ ] Mobile: copy then product UI, stacked
- [ ] `ConciergePreviewMockup` renders chat bubble + venue card + approval chip
- [ ] Trust pills visible without scrolling on desktop (in hero, below CTAs)
- [ ] Secondary CTA anchors to `#how-it-works`, does not navigate away
- [ ] Kicker badge does not wrap/overflow at 375px
- [ ] Playwright: H1 visible, primary CTA has `?type=venue`, trust pills in hero

---

## Section 2 — Value Proposition

### Current implementation

```
h2: "Why partner with mdeai"
3-column icon grid:
  [MapPin]  "Be the answer"
            "When a traveller asks..."
  [Shield]  "Bookings, not just browsing"
            "Reservations come through..."
  [Sparkle] "Marketing that writes itself"
            "AI drafts your listing..."
```

Background: white. Small `size-11` icon circles. Text-center on mobile, text-left on `sm+`. `text-sm` body.

### Weaknesses

| Weakness | Severity |
|---|---|
| Generic heading "Why partner with mdeai" — says nothing | High |
| Body text at `text-sm` — too small for skimmable scanning | Medium |
| No stat/number anchoring any claim ("marketing takes me 4 hours/week") | High |
| Icon circles too small to carry visual weight | Medium |
| No visual element separating this from the hero slab above | Low |
| Section does not feel different from a features section | Medium |

### Missing product proof

- "Be the answer" — no chat screenshot showing a venue as the answer
- "Bookings, not just browsing" — no booking counter or approval screen
- "Marketing that writes itself" — no before/after or post preview

### Conversion blockers

- All 3 value props describe what the product does, not what the owner gains
- No quantification: "Save 4 hours/week on marketing" beats "AI drafts your listing"

### Proposed layout

Replace the 3-col icon grid with 3 large benefit blocks that each carry:
1. A stat (or strong outcome phrase)
2. A short explanation
3. A mini product element (1-2 line CSS mockup or icon illustration)

**Desktop:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  section label: ─────────── WHY MDEAI ───────────                  │
│                                                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│  │ [icon large]    │  │ [icon large]    │  │ [icon large]    │    │
│  │                 │  │                 │  │                 │    │
│  │ "Be the answer" │  │ You stay in     │  │ Marketing on    │    │
│  │                 │  │ control         │  │ autopilot       │    │
│  │ When travellers │  │ Every booking   │  │ AI writes your  │    │
│  │ ask the AI      │  │ waits for your  │  │ listing, social │    │
│  │ concierge where │  │ approval before │  │ posts, and      │    │
│  │ to eat, your    │  │ it confirms.    │  │ review replies. │    │
│  │ restaurant is   │  │ No surprises.   │  │ You spend       │    │
│  │ the answer.     │  │ No double-      │  │ minutes, not    │    │
│  │                 │  │ bookings.       │  │ hours.          │    │
│  │ ─────────────── │  │ ─────────────── │  │ ─────────────── │    │
│  │ chat mockup     │  │ approve chip    │  │ post preview    │    │
│  │ (2 lines)       │  │ (1 line)        │  │ (2 lines)       │    │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

**Changes to heading:** Replace "Why partner with mdeai" with:

```
[small-caps label]  THE BENEFITS
[h2]  Three things that make the difference
```

Or more direct for B2B: **"Three things no other platform gives you"**

**Changes to body size:** `text-sm` → `text-base leading-relaxed` for all 3 value prop bodies.

**Changes to icons:** `size-11` → `size-14` or `size-16`, using the full accent color fill (not `bg-accent/15` — use `bg-accent` with `text-accent-foreground`).

### Implementation plan

**Task VP-1: Section label pattern**
- Add `<p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">The benefits</p>` above the h2
- Update h2 to `"Three things that change your week"` or similar

**Task VP-2: Icon sizing**
- `size-11` → `size-14`
- `bg-accent/15` → `bg-accent`  
- `text-accent` → `text-accent-foreground`

**Task VP-3: Body text size**
- `text-sm` → `text-base` throughout value props

**Task VP-4: Mini product elements (no images needed)**
Each value prop gets a 2-line CSS element at the bottom of the column:

- "Be the answer": `<div>` with chat bubble + "El Balcón — ★4.8" mini card
- "You stay in control": `<div>` with `"✓ Booking approved · Party of 4"` approval chip
- "Marketing on autopilot": `<div>` with `"📱 Post drafted — approve to share?"` social prompt

**Task VP-5: Heading rewrite (copy only)**
Change `h1` id text from "Why partner with mdeai" to `"Three things that change your week"`.

### Impact · Effort · Risk

| Task | Impact | Effort | Risk |
|---|---|---|---|
| VP-1 Section label | 4 | S | 1 |
| VP-2 Icon sizing | 5 | S | 1 |
| VP-3 Body text size | 4 | S | 1 |
| VP-4 Mini product elements | 7 | M | 2 |
| VP-5 Heading rewrite | 6 | S | 1 |

### Acceptance criteria

- [ ] Section label ("THE BENEFITS") appears above the h2
- [ ] h2 updated to a benefit-first headline
- [ ] Icon circles at least `size-14` with full accent fill
- [ ] Body text at `text-base`
- [ ] Each column has a mini product element below the description

---

## Section 3 — Product Gallery (NEW SECTION)

### Current state

**This section does not exist.** There is no product screenshot or UI demonstration anywhere on the page. This is the single largest conversion gap — a venue owner cannot see the product at all.

### Why it matters

The #1 reason B2B SaaS landing pages fail with SMB audiences: the prospect cannot visualize using the product. Carlos from El Poblado doesn't know what "mdeai puts your venue in the AI answer" looks like. No amount of copy fixes this — only showing it does.

This section should be inserted between Value Props and Features.

### 5 required product moments

#### Gallery item 1 — Concierge Chat Answer (highest conversion impact)

**Screenshot content:** Chat interface showing user question "Where should we eat in Provenza tonight?" with AI response including a venue card (photo placeholder, name, star rating, 2-line description, "Reserve table" button).

**What it proves:** "When someone asks the AI where to eat, your restaurant is the answer" — the core value proposition made visible.

**Placement:** First item, full-width or hero position in the gallery.

**Conversion impact: 10/10** — This is the entire value proposition in one image.

**Caption:** "Your venue in the concierge answer — complete with booking link."

---

#### Gallery item 2 — Venue Listing Card + Map Pin (discovery proof)

**Screenshot content:** Medellín map with a highlighted venue pin and the venue card that appears (name, category, rating, short AI description, "Ask about this place" CTA).

**What it proves:** "Your venue appears on the map and in browse" — the discoverability claim.

**Conversion impact: 8/10** — Answers the "what does my listing look like?" question.

**Caption:** "Your venue on the discovery map, ready to answer every 'where to go' question."

---

#### Gallery item 3 — Booking Approval Notification (HITL trust)

**Screenshot content:** Mobile notification or in-app panel: "New booking request · El Balcón · María García · Party of 4 · Tonight 8 pm" with [Approve] [Decline] buttons.

**What it proves:** "You approve every booking — AI doesn't book without you." This removes the #1 fear of SMB owners about AI: losing control.

**Conversion impact: 9/10** — This removes the highest-risk objection in one image.

**Caption:** "Every booking waits for your approval. You stay in control."

---

#### Gallery item 4 — AI Social Post Preview (content proof)

**Screenshot content:** Instagram-style card: venue photo + AI-written caption (30 words, local hashtags) + "Approve to post" chip above it.

**What it proves:** "Marketing that writes itself" — the content creation claim made tangible.

**Conversion impact: 7/10** — Content creation is the #1 time sink for SMB owners.

**Caption:** "AI drafts the post. You approve it in one tap."

---

#### Gallery item 5 — Weekly Report Email (reporting proof)

**Screenshot content:** Clean email card: "This week at El Balcón · 23 profile views · 4 booking requests · 2 confirmed · Est. revenue: $340." Simple 2-row data table.

**What it proves:** "Weekly reporting — one email every Monday, no dashboard required."

**Conversion impact: 6/10** — Removes the "do I need to learn a dashboard?" fear.

**Caption:** "Your Monday email — views, bookings, and estimated revenue. No dashboard."

---

### Gallery layout

**Desktop: 2+2+1 masonry or simple 3-col with items 1 and 3 spanning 2 rows:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  section label: ─────────── THE PRODUCT ───────────               │
│  h2: "See exactly how it works"                                     │
│                                                                       │
│  ┌──────────────────────────┐  ┌─────────┐  ┌─────────┐          │
│  │  CONCIERGE CHAT ANSWER   │  │ BOOKING │  │   MAP   │          │
│  │  (large, 2/3 width)      │  │ APPROVAL│  │   PIN   │          │
│  │                          │  │         │  │         │          │
│  │  chat + venue card +     │  │ approve │  │ map +   │          │
│  │  booking approved        │  │ chip    │  │ card    │          │
│  │                          │  └─────────┘  └─────────┘          │
│  │  "Your venue in the      │  ┌─────────┐  ┌─────────┐          │
│  │   concierge answer"      │  │ SOCIAL  │  │ WEEKLY  │          │
│  └──────────────────────────┘  │  POST   │  │ REPORT  │          │
│                                │         │  │         │          │
│                                └─────────┘  └─────────┘          │
└─────────────────────────────────────────────────────────────────────┘
```

**Simpler option (3-col grid, equal):** Items 1-3 in row 1, items 4-5 centered in row 2. Easier to implement, good enough for Phase 1.

**Mobile: 1-col stack, all items full width.**

### Implementation plan

**Task G-1: Section slot in PartnerLandingShell**
- Add `gallery?: React.ReactNode` optional slot between value props and features
- VenuesLanding passes the gallery; future D-PTR-03/04 can pass their own or `undefined`

**Task G-2: `<ProductGallerySection />` component**

```tsx
// src/components/partners/product-gallery-section.tsx
// Pure CSS mockups, no real screenshots needed initially
// Items 1-5 as described above, each as a <GalleryCard> sub-component
```

**Task G-3: `<ChatAnswerMockup />` (gallery item 1)**
- Reuse `<ConciergePreviewMockup />` from hero (H-3) with slight size adjustment

**Task G-4: `<BookingApprovalMockup />` (gallery item 3)**
```tsx
<div className="rounded-xl border bg-background-elevated p-4">
  <p className="text-xs text-muted-foreground mb-2">New booking request</p>
  <p className="font-semibold">El Balcón · María García</p>
  <p className="text-sm text-muted-foreground">Party of 4 · Tonight 8pm</p>
  <div className="mt-3 flex gap-2">
    <button className="flex-1 rounded-lg bg-success/10 text-success text-sm py-2">Approve</button>
    <button className="flex-1 rounded-lg bg-destructive/10 text-destructive text-sm py-2">Decline</button>
  </div>
</div>
```

**Task G-5: `<SocialPostMockup />` (gallery item 4)**
**Task G-6: `<WeeklyReportMockup />` (gallery item 5)**

### Impact · Effort · Risk

| Task | Impact | Effort | Risk |
|---|---|---|---|
| G-1 Shell slot | 3 | S | 1 |
| G-2 Gallery section | 8 | M | 2 |
| G-3 Chat mockup (reuse) | 10 | S | 1 |
| G-4 Booking approval mockup | 9 | S | 1 |
| G-5 Social post mockup | 7 | S | 1 |
| G-6 Weekly report mockup | 6 | S | 1 |

### Acceptance criteria

- [ ] Product gallery section exists between value props and features
- [ ] Concierge chat answer mockup renders with venue card + approval chip
- [ ] Booking approval mockup has Approve + Decline buttons (non-functional, UI only)
- [ ] All 5 gallery items have captions
- [ ] Mobile: all items stack to single column
- [ ] No real images or screenshots required — all CSS/HTML mockups

---

## Section 4 — Features

### Current implementation

6 cards in a `grid gap-4 sm:grid-cols-2 lg:grid-cols-3` using shadcn `<Card>`:

1. AI listing drafts (AI badge)
2. Booking approvals (HITL)
3. Listing + map pin
4. AI social posts (AI badge)
5. AI review replies (AI badge)
6. Weekly reporting

Each card: small `size-9` icon circle + optional AI badge + `CardTitle` (text-base) + `CardDescription` (text-sm). No CTA after the section.

### Weaknesses

| Weakness | Severity |
|---|---|
| No CTA at the end of the section — highest-intent scroll moment has no action | Critical |
| All 6 cards are equally weighted — no clear "most important" feature | High |
| Icon only — no visual proof for any feature | High |
| Cards 4, 5, 6 (social, reviews, reporting) feel like bonus features not differentiators | Medium |
| `text-base` CardTitle is small for a feature claim | Medium |
| AI badges look like labels, not differentiators | Low |

### Missing product proof (by card)

| Card | Missing | Priority |
|---|---|---|
| AI listing drafts | Before/after: raw input → polished listing | High |
| Booking approvals | Approve/Decline UI (covered in gallery) | High |
| Listing + map pin | Map pin preview (covered in gallery) | Medium |
| AI social posts | Post draft preview (covered in gallery) | Medium |
| AI review replies | Reply draft preview | Low |
| Weekly reporting | Email preview (covered in gallery) | Low |

### Proposed layout

**Key changes:**
1. Reorder cards: most differentiated first (Booking approvals, AI listing, Listing+map, AI social, AI reviews, Weekly reporting)
2. Increase `CardTitle` to `text-lg font-semibold`
3. Add `<CardContent>` mini-mockup to the top 3 cards
4. Add a CTA button below the grid

**Reordered card priority:**

| Order | Card | Reason |
|---|---|---|
| 1 | Booking approvals (HITL) | Removes #1 fear (loss of control) — lead with trust |
| 2 | AI listing drafts | Core onboarding value — what happens first |
| 3 | Listing + map pin | The visibility claim — shows the outcome |
| 4 | AI social posts | Content creation differentiation |
| 5 | AI review replies | Reputation management bonus |
| 6 | Weekly reporting | Data transparency |

**After-features CTA:**

```tsx
<div className="mt-10 text-center">
  <Button size="lg" nativeButton={false} render={<Link href={signupHref} data-testid={`${testId}-features-cta`} />}>
    Start listing your venue
    <ArrowRightIcon data-icon="inline-end" aria-hidden />
  </Button>
</div>
```

**Desktop wireframe:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  h2: "Everything your venue needs"                                   │
│                                                                       │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐                       │
│  │ BOOKING   │  │ AI LISTING│  │ MAP PIN   │                       │
│  │ APPROVALS │  │ DRAFTS    │  │           │                       │
│  │           │  │           │  │           │                       │
│  │ [approve  │  │ raw→AI→   │  │ [pin icon]│                       │
│  │  chip]    │  │ polished  │  │           │                       │
│  └───────────┘  └───────────┘  └───────────┘                       │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐                       │
│  │ AI SOCIAL │  │ AI REVIEW │  │ WEEKLY    │                       │
│  │ POSTS     │  │ REPLIES   │  │ REPORTING │                       │
│  └───────────┘  └───────────┘  └───────────┘                       │
│                                                                       │
│              [ Start listing your venue → ]                         │
└─────────────────────────────────────────────────────────────────────┘
```

### Implementation plan

**Task F-1: Reorder features**
Update `SHARED_FEATURES` array in `venues-landing.tsx` to booking-first order. The `getFeatures()` function inserts variant extras as card[0] — verify this still works after reorder.

**Task F-2: CardTitle size**
In `partner-landing-shell.tsx`, change `CardTitle className="text-base leading-snug"` to `text-lg leading-snug`.

**Task F-3: Add mid-section CTA**
Add after the features grid (but inside the `<section>`), before the closing `</div>`:
```tsx
<div className="mt-10 text-center">
  <Button size="lg" ...>Start listing your venue <ArrowRightIcon /></Button>
</div>
```

**Task F-4: Mini-mockup in booking card**
Since booking approval mockup is built in G-4, optionally surface a `<BookingApprovalMockup size="sm" />` inside `<CardContent>` for the booking approvals card. Requires `features` type to accept optional `mockup?: React.ReactNode` or handled via slot map.

**Task F-5: AI listing card — before/after hint**
Inline CSS before/after in the card:
```tsx
<CardContent className="text-xs text-muted-foreground border-t border-border pt-3 mt-2">
  <p className="line-through">cafe in laureles with wifi</p>
  <p className="mt-1 text-foreground font-medium">Specialty coffee meets quiet focus in Laureles...</p>
</CardContent>
```
This is purely CSS — no image needed.

### Impact · Effort · Risk

| Task | Impact | Effort | Risk |
|---|---|---|---|
| F-1 Reorder cards | 6 | S | 1 |
| F-2 CardTitle size | 4 | S | 1 |
| F-3 Mid-section CTA | 8 | S | 1 |
| F-4 Mockup in booking card | 7 | M | 2 |
| F-5 Before/after in listing card | 6 | S | 1 |

### Acceptance criteria

- [ ] Booking approvals card appears first in the grid
- [ ] `CardTitle` renders at `text-lg`
- [ ] "Start listing your venue" CTA button is visible below the features grid
- [ ] Playwright: `venues-landing-features-cta` testId is present and has correct href
- [ ] Mobile: 1-col stack, CTA full-width below

---

## Section 5 — How It Works

### Current implementation

5-step vertical timeline with numbered amber circles, `flex-col gap-0`, connecting `w-px flex-1 bg-border` line between steps. Text only — no icon, no illustration per step.

```
① List your venue
② AI creates your listing
③ Travellers discover you
④ You approve each booking
⑤ Guests arrive, you grow
```

### Weaknesses

| Weakness | Severity |
|---|---|
| Steps are text-only — no visual for any step | High |
| Step ③ "Travellers discover you" is passive — no proof of discovery | Medium |
| Step ④ is the most important (HITL) but has no visual differentiation | High |
| Section background `bg-background-elevated/50` may not render if token unregistered | Medium |
| `w-px flex-1 bg-border` connector line collapses if steps have variable content height on Safari iOS | Low |
| Step 2 ("AI creates your listing") doesn't show the AI working — abstract | Medium |

### Missing product proof

- Step ① — "List your venue": no signup/onboarding UI hint
- Step ③ — "Travellers discover you": no concierge chat or map discovery visual
- Step ④ — "You approve each booking": no approval chip visual

### Proposed layout

Keep the vertical timeline (it's mobile-friendly). Add per-step mini-visuals on the right for desktop.

**Desktop: 2-col per step (number+text left, visual right):**

```
┌─────────────────────────────────────────────────────────────────────┐
│  h2: "How it works"                                                  │
│                                                                       │
│  ① List your venue          [blank/form icon hint, 80px]           │
│  │  Sign up and describe...                                         │
│  │                                                                   │
│  ② AI creates your listing  [before→after text, small]            │
│  │  The concierge writes...                                         │
│  │                                                                   │
│  ③ Travellers discover you  [mini chat bubble, 80px]              │
│  │  Your venue surfaces...                                          │
│  │                                                                   │
│  ④ You approve each booking [approve chip, 80px]   ← HIGHLIGHT    │
│  │  Every reservation...                                            │
│  │                                                                   │
│  ⑤ Guests arrive, you grow  [report email, 80px]                  │
│                                                                       │
│             → Step 4 visually highlighted (ring/accent bg)          │
└─────────────────────────────────────────────────────────────────────┘
```

**Step ④ visual highlight:** Add `ring-2 ring-accent` or `bg-accent/5 rounded-lg px-4 py-3` to step 4's `<li>` to visually emphasize the HITL control step as the key differentiator.

**Mobile:** Keep 1-col. Add inline visual elements below the `<p>` sub-text for steps 3 and 4 only (the two most important). No changes to the timeline connector.

### Implementation plan

**Task H-1 (HiW): Section id**
Add `id="how-it-works"` to the section element so the hero secondary CTA (`href="#how-it-works"`) anchors correctly.

**Task H-2 (HiW): Step 4 accent highlight**
In the `{howItWorks.map(...)}`, detect `n === 4` and apply:
```tsx
className={`flex gap-6 pb-8 last:pb-0 ${n === 4 ? 'rounded-xl bg-accent/5 px-4 py-3 -mx-4' : ''}`}
```

**Task H-3 (HiW): Step visual micro-elements (desktop only)**
Restructure each `<li>` to a 3-col layout on `lg+`:
```
[number + connector] [text content] [optional visual, hidden on mobile]
```
Visual slot populated for steps 2, 3, 4:
- Step 2: before/after CSS lines (same pattern as F-5)
- Step 3: 1-line chat bubble
- Step 4: approval chip

**Task H-4 (HiW): Connector line fix for Safari iOS**
Change connector from `w-px flex-1 bg-border` (which depends on flex height) to `w-px min-h-[40px] bg-border`. This prevents the collapse on variable-height step content.

### Impact · Effort · Risk

| Task | Impact | Effort | Risk |
|---|---|---|---|
| H-1 Section id | 6 | S | 1 |
| H-2 Step 4 highlight | 7 | S | 1 |
| H-3 Step visuals | 8 | M | 2 |
| H-4 Connector fix | 4 | S | 1 |

### Acceptance criteria

- [ ] Section has `id="how-it-works"` — hero secondary CTA anchors here
- [ ] Step 4 has visual accent highlight (background tint + ring or border)
- [ ] Steps 2, 3, 4 have mini visual elements on desktop (hidden mobile)
- [ ] Timeline connector line stable on 375px + Safari iOS (manual QA)
- [ ] Playwright: `page.getByRole("list", { name: /steps to get started/i })` still has 5 items

---

## Section 6 — Pricing

### Current implementation

```
h2: "Free to list. Growth when you grow."
p:  "Flexible plans for every venue size. Contact us to see what fits."
Button: "Talk to us about pricing" → /contact
```

Background: white. `border-b border-border`. Single CTA navigates away from the page.

### Weaknesses

| Weakness | Severity |
|---|---|
| "Talk to us about pricing" → `/contact` — another page, loses momentum | Critical |
| No concrete pricing information reduces trust — sounds like enterprise sales | High |
| No risk reduction elements beyond a single contact CTA | High |
| Section is the quietest on the page — visually invisible | Medium |
| "Growth when you grow" is vague — what does that mean? | Medium |

### Missing product proof

- No tier structure hint (even "Free / Pro / Enterprise" without numbers helps)
- No "what's included in Free" checklist

### Proposed layout

Show 3 tier hints (no prices) with a clear "Free forever" anchor and a "Contact us for Pro" signal. Change the CTA to anchor to the inline form (`#demo`).

```
┌─────────────────────────────────────────────────────────────────────┐
│  h2: "Free to list. Grow when you're ready."                        │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  FREE                PRO              ENTERPRISE               │ │
│  │  Always free         Small %          Custom                   │ │
│  │  to list your        per confirmed    for multi-location        │ │
│  │  venue               booking          venues                   │ │
│  │                                                                │ │
│  │  ✓ AI listing        ✓ Priority        ✓ Dedicated             │ │
│  │  ✓ Map pin           discovery          account mgmt           │ │
│  │  ✓ 3 bookings/mo     ✓ Unlimited bkgs  ✓ Custom integrations   │ │
│  │  ✓ Weekly report     ✓ AI social posts                         │ │
│  │                      ✓ AI review mgmt                          │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│              [Start free →]    [Talk to us about Pro]               │
│                                                                       │
│  ✓ No credit card  ✓ No setup fees  ✓ Cancel anytime              │
└─────────────────────────────────────────────────────────────────────┘
```

**Note:** If showing tier hints is not approved, minimum change: add a feature checklist for Free and change the CTA to anchor `#demo`.

**Minimum viable P0 version (no tier table):**

```
h2: "Free to list. No catch."
[checklist]
  ✓ AI-written listing and map pin — included free
  ✓ Up to 3 booking approvals per month — free
  ✓ Weekly performance email — free
  ✓ No credit card required to start

Growth tools (AI social posts, priority discovery, unlimited bookings) — contact us.

[Start listing free →]   [Talk to us about plans ↓]  ← anchors to #demo
```

### Implementation plan

**Task P-1: CTA anchor change**
Change `href="/contact"` to `href="#demo"` on the pricing CTA button. This is 1 line.

**Task P-2: Add feature checklist for Free**
Add 4 `<li>` items with checkmark icons below the `pricingLine` heading. Hardcoded in `PartnerLandingShell` for now — add as an optional `pricingChecklist?: string[]` prop later (P1).

**Task P-3: Pricing section trust line**
Add below the CTA: `"No credit card required · Cancel anytime · Listing stays live"` in `text-xs text-muted-foreground`.

**Task P-4 (P1): 3-tier hint table**
Build `<PricingTierHints />` component with Free / Pro / Enterprise columns. No prices — tier names + 3-bullet features each + CTA per tier.

### Impact · Effort · Risk

| Task | Impact | Effort | Risk |
|---|---|---|---|
| P-1 CTA to #demo anchor | 8 | S | 1 |
| P-2 Free checklist | 7 | S | 1 |
| P-3 Trust line | 5 | S | 1 |
| P-4 Tier table (P1) | 8 | M | 2 |

### Acceptance criteria

- [ ] Pricing CTA does not navigate to `/contact` — anchors to `#demo` on same page
- [ ] 4-item "included free" checklist visible below the h2
- [ ] Trust line ("No credit card required") visible below the CTA
- [ ] Playwright: `venues-landing-pricing-cta` href updated to `#demo` (update existing test expectation)

---

## Section 7 — Demo / Lead Capture

### Current implementation

```
id="demo" section
h2: "Ready to grow your venue?"
p:  "Join mdeai and put your venue inside Medellín's AI concierge today."
[List your venue free →]  [Book a demo]
--- separator ---
✓ Free to list  ✓ No setup fees  ✓ Cancel anytime
```

Background: `bg-foreground/[0.03]` — 3% opacity tint, effectively white. Both CTAs route to other pages. No inline form.

### Weaknesses

| Weakness | Severity |
|---|---|
| No inline form — primary conversion moment requires leaving the page | Critical |
| `bg-foreground/[0.03]` is visually identical to white — no section differentiation | High |
| "Ready to grow your venue?" heading is generic — low specificity | Medium |
| Both primary and secondary CTAs navigate away | High |
| Nothing captures the "not ready to sign up but interested" user | High |

### Missing lead capture

Every warm lead who isn't ready to create an account is lost. There is no middle-of-funnel option: it's "sign up now" or "call us." An inline form ("tell us about your venue") captures interest and feeds a CRM or Chatwoot inbox.

### Proposed layout

**Two-column: heading + form**

```
┌─────────────────────────────────────────────────────────────────────┐
│  id="demo"  bg: dark (bg-foreground/[0.08]) or accent slab          │
│                                                                       │
│  LEFT 45%                          RIGHT 55%                        │
│                                                                       │
│  Get your venue in front of         ┌───────────────────────────┐  │
│  Medellín's visitors.               │ Your name                 │  │
│                                     │ ─────────────────────     │  │
│  Join 120+ venues already           │ Email                     │  │
│  listed in the AI concierge.        │ ─────────────────────     │  │
│                                     │ Venue name                │  │
│  ✓ Free to list                     │ ─────────────────────     │  │
│  ✓ Live in under 30 minutes         │ Venue type       [select] │  │
│  ✓ Human approval on every          │ ─────────────────────     │  │
│    booking                          │ Message (optional)        │  │
│                                     │                           │  │
│  Questions first?                   │ [Request access →]        │  │
│  hello@mdeai.co                     │ ─────────────────────     │  │
│                                     │ No credit card required.  │  │
│                                     └───────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

**Mobile: stacked (heading above form)**

**Form fields:**
1. Name — `<Input type="text" placeholder="Your name" required />`
2. Email — `<Input type="email" placeholder="your@email.com" required />`
3. Venue name — `<Input type="text" placeholder="El Balcón Mediterráneo" required />`
4. Venue type — `<Select>` with options: Restaurant, Café, Nightclub / Bar, Event space, Other
5. Message — `<Textarea placeholder="Tell us about your venue (optional)" rows={3} />`
6. Submit — `<Button type="submit">Request access →</Button>`

**Form action options (Phase 1):**

| Option | Effort | Tradeoff |
|---|---|---|
| `mailto:` fallback (`action="mailto:hello@mdeai.co" method="post"`) | S | Opens email client — low UX but zero backend |
| Supabase edge function `/api/partners/leads` → Chatwoot | M | Best — leads in CRM immediately |
| Formspree / Netlify Forms | S | Third-party, fast, no backend needed |
| `/api/contact` route (POST) → email via Resend | M | Clean, stays in our infra |

**Recommended for Phase 1:** POST to `/api/partners/leads` → inserts a row to a `partner_leads` Supabase table (RLS: insert-only for anon, read requires service role) + triggers Chatwoot conversation via webhook. If that route doesn't exist yet, `mailto:` fallback is acceptable as a 2-hour workaround.

**Validation:**
- Name: required, min 2 chars
- Email: required, valid email format
- Venue name: required
- Venue type: required
- Message: optional
- Client-side only for Phase 1 (add server-side in Phase 2)
- On success: replace form with: "We'll be in touch within 1 business day." + "In the meantime, you can [list your venue now →]."

### Implementation plan

**Task D-1: Section background**
Change `bg-foreground/[0.03]` to `bg-accent/5` or `bg-background-elevated`. Needs to visually distinguish from the white sections above.

**Task D-2: Two-column layout**
Replace centered `max-w-3xl text-center` with `max-w-7xl grid grid-cols-1 lg:grid-cols-[45fr_55fr] gap-12 items-start`.

**Task D-3: Left column**
- New h2: `"Get your venue in front of Medellín's visitors"`
- 3-bullet trust list (Free / Live in 30 min / Human approval)
- Email address link: `hello@mdeai.co`

**Task D-4: Inline form**
New component `<PartnerLeadForm testId={testId} signupHref={signupHref} />`. Accepts `signupHref` for the success state CTA.

**Task D-5: Form submission handler**
`POST /api/partners/leads` or `mailto:` fallback. If Chatwoot MCP is available, wire to a new Chatwoot inbox "Partner Leads."

**Task D-6: Success state**
On successful submit, replace form with confirmation message. No page navigation.

### Impact · Effort · Risk

| Task | Impact | Effort | Risk |
|---|---|---|---|
| D-1 Section background | 4 | S | 1 |
| D-2 Two-column layout | 7 | S | 1 |
| D-3 Left column copy | 6 | S | 1 |
| D-4 Inline form | 9 | M | 3 |
| D-5 Form submission | 8 | M | 4 |
| D-6 Success state | 5 | S | 1 |

### Acceptance criteria

- [ ] Inline form visible in `#demo` section — no page navigation required to express interest
- [ ] Form has 5 fields: name, email, venue name, venue type (select), message (optional)
- [ ] Submit button disabled while submitting
- [ ] On success: form replaced with confirmation message
- [ ] On error: inline error state, form re-enabled
- [ ] Mobile: form is full-width, inputs are `min-h-[44px]`, `text-[16px]` (prevents iOS zoom)
- [ ] Playwright: `venues-landing-lead-form` testId present; form renders; submit button visible

---

## Section 8 — Footer

### Current implementation

`MarketingPageShell` renders `<MarketingFooter />` automatically. This is shared across all marketing pages and is not specific to the venues landing or partner pages.

### Weaknesses (specific to venues context)

| Weakness | Severity |
|---|---|
| No partner-specific links in footer (for venues, rental hosts, sponsors) | Medium |
| No direct "hello@mdeai.co" email link in footer | Medium |
| Footer likely does not link to `/contact` or `/partners/signup` — unverified | Low |
| No WhatsApp CTA for Medellín SMB audience (culturally appropriate) | Low |

### Recommendations

These are footer improvements that benefit all partner landings, not just venues. Low priority for the venues PR — these belong in a shared footer update task.

**Task FT-1: "For Partners" footer column**
Add to `MarketingFooter`: a column titled "For Partners" with:
- For Venues (`/venues`)
- For Rental Hosts (`/partners/rentals`)
- For Sponsors (`/partners/sponsors`)
- Book a demo (`#demo` or `/contact`)

**Task FT-2: Contact in footer**
Add: `hello@mdeai.co` as a `mailto:` link.

**Task FT-3 (P2): WhatsApp CTA**
If the team has a WhatsApp Business number, a floating WhatsApp button on the venues page would be high-conversion for Medellín SMB owners. Out of scope for Phase 1.

### Impact · Effort · Risk

| Task | Impact | Effort | Risk |
|---|---|---|---|
| FT-1 Partner column | 4 | S | 1 |
| FT-2 Email in footer | 3 | S | 1 |
| FT-3 WhatsApp (P2) | 5 | M | 2 |

### Acceptance criteria

- [ ] Footer has a "For Partners" navigation column
- [ ] `hello@mdeai.co` is a clickable `mailto:` link in the footer
- [ ] All partner links in footer point to correct routes (`/venues`, `/partners/rentals`, `/partners/sponsors`)

---

## Final Deliverables

### Executive Summary

The `/venues` page is structurally sound but commercially incomplete. The architecture (PartnerLandingShell, variant system, server components) is correct and reusable. The copy is solid — especially the headline and variant-specific H1s. But the page cannot convert because:

1. **No product on screen** — venue owners cannot see the concierge, the listing, or the booking approval
2. **No inline form** — every interested lead must navigate to another page or sign up immediately
3. **No visual differentiation** — all 7 sections look identical; no color contrast communicates importance or section identity
4. **No mid-page CTAs** — the 3 highest-intent moments (after value props, after features, after how-it-works) have no action point

After P0 fixes: estimated conversion rate moves from ~2–4% to ~8–12%.

---

### Section-by-Section Scores

| Section | Current | After P0 | After P0+P1 |
|---|---|---|---|
| 1. Hero | 3/10 | 8/10 | 9/10 |
| 2. Value Proposition | 5/10 | 7/10 | 8/10 |
| 3. Product Gallery (new) | 0/10 | 7/10 | 9/10 |
| 4. Features | 5/10 | 7/10 | 8/10 |
| 5. How It Works | 5/10 | 7/10 | 8/10 |
| 6. Pricing | 3/10 | 7/10 | 8/10 |
| 7. Demo / Lead Capture | 2/10 | 8/10 | 9/10 |
| 8. Footer | 4/10 | 6/10 | 7/10 |
| **Overall** | **3.4/10** | **7.1/10** | **8.3/10** |

---

### P0 — Must Ship Before Merge

| # | Section | Task | Impact | Effort | Risk |
|---|---|---|---|---|---|
| 1 | Hero | H-3: `ConciergePreviewMockup` — chat + venue card + approval chip | 10 | M | 2 |
| 2 | Hero | H-1: Accent slab + desktop 2-col split layout | 9 | M | 2 |
| 3 | Demo | D-4: Inline lead form (5 fields) | 9 | M | 3 |
| 4 | Hero | H-5: Secondary CTA → `#how-it-works` anchor | 8 | S | 1 |
| 5 | Pricing | P-1: Pricing CTA → `#demo` anchor (not `/contact`) | 8 | S | 1 |
| 6 | Features | F-3: Mid-section CTA after features grid | 8 | S | 1 |
| 7 | Hero | H-4: Trust pills into hero (below CTAs) | 7 | S | 1 |
| 8 | Demo | D-5: Form submission handler | 8 | M | 4 |
| 9 | Hero | H-2: Kicker overflow fix at 375px | 5 | S | 1 |
| 10 | HowItWorks | HiW-H-1: `id="how-it-works"` on section | 6 | S | 1 |
| 11 | HowItWorks | HiW-H-2: Step 4 accent highlight | 7 | S | 1 |
| 12 | Pricing | P-2: Free checklist (4 items with checkmarks) | 7 | S | 1 |
| 13 | Gallery | G-1–G-6: Product gallery section (5 CSS mockups) | 9 | M | 2 |

---

### P1 — Should Ship (next PR)

| # | Section | Task | Impact | Effort | Risk |
|---|---|---|---|---|---|
| 1 | Value Props | VP-4: Mini product elements per column | 7 | M | 2 |
| 2 | Value Props | VP-2: Icon sizing increase | 5 | S | 1 |
| 3 | Value Props | VP-3: Body text → `text-base` | 4 | S | 1 |
| 4 | Value Props | VP-1: Section label "THE BENEFITS" | 4 | S | 1 |
| 5 | Value Props | VP-5: Heading rewrite | 6 | S | 1 |
| 6 | Features | F-1: Reorder cards (booking first) | 6 | S | 1 |
| 7 | Features | F-2: `CardTitle` → `text-lg` | 4 | S | 1 |
| 8 | Features | F-5: Before/after in AI listing card | 6 | S | 1 |
| 9 | HowItWorks | HiW-H-3: Step mini-visuals (desktop) | 8 | M | 2 |
| 10 | HowItWorks | HiW-H-4: Connector line Safari fix | 4 | S | 1 |
| 11 | Demo | D-1: Section background differentiation | 4 | S | 1 |
| 12 | Demo | D-2+D-3: Two-column demo section | 7 | S | 1 |
| 13 | Footer | FT-1+FT-2: Partner column + email in footer | 4 | S | 1 |
| 14 | Pricing | P-4: 3-tier pricing hint table | 8 | M | 2 |

---

### P2 — Future Enhancements

| # | Section | Task | Impact | Effort |
|---|---|---|---|---|
| 1 | Hero | Real concierge screenshot (replace CSS mockup) | 10 | M |
| 2 | All | Sticky nav with persistent "List your venue" pill | 7 | M |
| 3 | Features | Booking approval UI mockup in feature card | 7 | M |
| 4 | Gallery | Swap CSS mockups for real product screenshots | 9 | S |
| 5 | All | Scroll-driven section indicators (dot nav) | 5 | M |
| 6 | Demo | Chatwoot inbox integration for partner leads | 8 | M |
| 7 | Footer | WhatsApp Business CTA | 5 | M |
| 8 | All | A/B test headline variants ("Fill your tables" vs "Be in every AI answer") | 8 | L |
| 9 | Gallery | Video embed (product demo, 90 seconds) | 9 | L |
| 10 | Gallery | Real testimonial card (first venue partner) | 9 | S |

---

### Build Order Recommendation

Execute in this sequence to maximize conversion gain per hour of work:

```
SPRINT 1 — HERO + FORM (est. 4h)
  1. H-2: Accent slab + 2-col split layout
  2. H-3: ConciergePreviewMockup component
  3. H-4: Trust pills into hero
  4. H-5: Secondary CTA → anchor
  5. H-2: Kicker fix (mobile overflow)
  6. D-4+D-5: Inline lead form + submission handler

SPRINT 2 — CONVERSION PLUMBING (est. 2h)
  7.  F-3: Features section CTA
  8.  P-1: Pricing CTA → #demo
  9.  P-2: Free checklist
  10. HiW-H-1: Section id
  11. HiW-H-2: Step 4 highlight

SPRINT 3 — PRODUCT GALLERY (est. 3h)
  12. G-1: Shell gallery slot
  13. G-3: ChatAnswerMockup (reuse hero component)
  14. G-4: BookingApprovalMockup
  15. G-5: SocialPostMockup
  16. G-6: WeeklyReportMockup
  17. G-2: ProductGallerySection layout

SPRINT 4 — VALUE PROPS + FEATURES POLISH (est. 2h)
  18. VP-1+VP-2+VP-3+VP-5: Section label, icons, body size, heading
  19. VP-4: Mini product elements
  20. F-1: Card reorder
  21. F-2: CardTitle size
  22. F-5: Before/after in listing card

SPRINT 5 — HOW IT WORKS + FOOTER (est. 1.5h)
  23. HiW-H-3: Step visuals (desktop)
  24. HiW-H-4: Connector line fix
  25. D-1+D-2+D-3: Demo section background + 2-col
  26. FT-1+FT-2: Footer partner column + email
```

**Total estimated effort for full P0+P1: ~12.5 hours of implementation.**

After Sprint 1 + 2 (P0 core, ~6h): estimated conversion rate from 2–4% to 8–12%.  
After all 5 sprints (P0+P1, ~12.5h): estimated 14–18% conversion rate + Mindtrip parity at ~80/100.
