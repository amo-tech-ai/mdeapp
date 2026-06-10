

Done â and to answer your question directly: we have wireframes for 7 of the 12 business-service pages; the 5 gaps are now covered by the task files I just created. Sitemap fixed, 11 design task files written and committed (b0919ee), and all 12 Linear tasks updated.

Real-world: any designer or agent can now pick up a partner page â rentals brokers, venues, sponsors, AI services â and build it the same way (shadcn base + 21st.dev marketplace sections, mdeai's oklch color tokens, every CTA funneling into the already-live signup wizard from SAN-723 Â· MKT â Partner signup wizard).

Wireframe coverage (verified on disk)

ââââââââââââââââââââââââââââââââââââââââââ¬âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
â        Have HTML wireframes â         â            Missing â (now spec'd in task files)             â
ââââââââââââââââââââââââââââââââââââââââââ¼âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ¤
â signup Â· host Â· venues Â· rentals Â·     â partners hub Â· pricing Â· contact Â· /business hub Â· vertical  â
â sponsors Â· business-ai Â· about         â landings (covered by the venues shell ?v= variants)          â
ââââââââââââââââââââââââââââââââââââââââââ´âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

Note: the three files in wireframes/pages/ turned out to be consumer browse specs (restaurants/cafes/nightlife pages), not partner wireframes â don't count them as B2B coverage.

What shipped this turn

1. Sitemap fixed (4 rows): /partners/rentals, /sponsors, /business/ai were listed as "shell, 200" but are 404 on production â corrected with verification date; /partners hub re-marked as live-but-basic.
2. Task pack created: docs/partners/tasks/design/ â INDEX + 10 files (D-PTR-01â¦10), each with route, Linear link, wireframe path, page sections from the landing-pages doc, a 21st.dev/shadcn component shopping list, and acceptance criteria including the floor gate (the repo's pass/fail quality check). A shared contract in the INDEX keeps them DRY: one reusable PartnerLandingShell gets extracted in D-PTR-02 â For Venues landing and reused everywhere.
3. Linear updated: evidence comments on all 12 page tasks (SAN-692 hub Â· SAN-661 venues Â· SAN-691 rentals Â· SAN-663 business-ai Â· SAN-664 sponsors Â· SAN-695 pricing Â· SAN-693 contact Â· SAN-712/713/714 verticals Â· SAN-726 business hub Â· SAN-662 about â full titles in each comment).

One drift flag needing a human decision: SAN-691 Â· MKT â For Rentals / Brokers landing (/partners/rentals) is In Review in Linear, yet the page 404s on production â there's unmerged or undeployed work somewhere. The task file's first step says find that branch/PR before building anything new.

Next step: build order is D-PTR-02 â /venues first (it creates the shared shell), then D-PTR-03 â rentals/brokers and D-PTR-01 â the hub. Say the word and I'll start D-PTR-02 in a fresh worktree.

â Ran 2 stop hooks
  â¿ Â Stop hook error: [node $CLAUDE_PROJECT_DIR/.claude/hooks/stop-plain-language-gate.mjs]: ð´ stop-plain-language-gate: bare task ID(s) in the reply â SAN-692, SAN-661, SAN-663, SAN-664, SAN-695, SAN-693, SAN-712, SAN-726, SAN-662.
     CLAUDE.md "Response style": every task number must carry its name at least once: `SAN-NNN Â· SPEC-ID â full task name` (e.g. `SAN-178 Â· PAY-001 â Live ticket purchase on prod`).
     Look the name up (Linear MCP or docs/linear/) and restate the reply with IDs named.


âââââââââââââââââââââââââââââââââââââââââââââââ 1 new message ââââââââââââââââââââââââââââââââââââââââââââââââ5 gaps are now covered by the task files I just created. Sitemap fixed, 11 design task files written and committed (b0919ee), and all 12 Linear tasks updated.

  Real-world: any designer or agent can now pick up a partner page â rentals brokers, venues, sponsors, AI services â and build it the same way (shadcn base + 21st.dev marketplace sections, mdeai's oklch color tokens, every CTA funneling into the already-live signup wizard from SAN-723 Â· MKT â Partner signup wizard).

  Wireframe coverage (verified on disk)

  ââââââââââââââââââââââââââââââââââââââââââ¬âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
  â        Have HTML wireframes â         â            Missing â (now spec'd in task files)             â
  ââââââââââââââââââââââââââââââââââââââââââ¼âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ¤
  â signup Â· host Â· venues Â· rentals Â·     â partners hub Â· pricing Â· contact Â· /business hub Â· vertical  â
  â sponsors Â· business-ai Â· about         â landings (covered by the venues shell ?v= variants)          â
  ââââââââââââââââââââââââââââââââââââââââââ´âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

  Note: the three files in wireframes/pages/ turned out to be consumer browse specs (restaurants/cafes/nightlife browse pages), not partner wireframes â don't count them as B2B coverage.

  What shipped this turn

  1. Sitemap fixed (4 rows): /partners/rentals, /sponsors, /business/ai were listed as "shell, 200" but are 404 on production â corrected with verification date; /partners hub re-marked as live-but-basic.
  2. Task pack created: docs/partners/tasks/design/ â INDEX + 10 files (D-PTR-01â¦10), each with route, Linear link, wireframe path, page sections from the landing-pages doc, a 21st.dev/shadcn component shopping list, and acceptance criteria including the floor gate (the repo's pass/fail quality check). A shared contract in the INDEX keeps them lean: one reusable PartnerLandingShell gets extracted in the venues task and reused everywhere.everywhere.
3. Linear updated â evidence comments posted on all 12 page tasks:
  - SAN-692 Â· MKT â Partner hub marketing page (/partners)
  - SAN-661 Â· MKT â For Venues landing (/venues)
  - SAN-691 Â· MKT â For Rentals / Brokers landing (/partners/rentals)
  - SAN-663 Â· MKT â AI Services for companies (/business/ai)
  - SAN-664 Â· MKT â Sponsors / Sponsorship (/sponsors)
  - SAN-695 Â· MKT â Partner pricing (/pricing)
  - SAN-693 Â· MKT â Contact / Book a demo (/contact)
  - SAN-712 Â· MKT â For Nightlife landing, SAN-713 Â· MKT â For Restaurants landing, SAN-714 Â· MKT â For CafÃ©s landing (shared task file, decision noted: thin shell-config pages vs redirect to /venues?v=â¦)
  - SAN-726 Â· MKT â mdeai for Business hub (/business)
  - SAN-662 Â· MKT â About page (/about)

One drift flag needing a human decision: SAN-691 Â· MKT â For Rentals / Brokers landing is In Review in Linear, yet /partners/rentals 404s on production â there's unmerged or undeployed work somewhere. The task file's first step says find that branch/PR before building anything new.

Next step: build order is D-PTR-02 (SAN-661 Â· MKT â For Venues landing) first â it creates the shared shell â then D-PTR-03 (SAN-691 Â· MKT â For Rentals / Brokers landing) and D-PTR-01 (SAN-692 Â· MKT â Partner hub marketing page). Say the word and I'll start the venues landing in a fresh worktree.

Tip: Use /btw to ask a quick side question without interrupting Claude's current work

## Partner Pages Audit

### Current Reality

| Page                | Status  | Priority |
| ------------------- | ------- | -------- |
| `/partners`         | 🟢 Live | Keep     |
| `/host`             | 🟢 Live | Keep     |
| `/partners/signup`  | 🟢 Live | Keep     |
| `/partners/rentals` | 🔴 404  | P0       |
| `/venues`           | 🔴 404  | P0       |
| `/business/ai`      | 🔴 404  | P1       |
| `/sponsors`         | 🔴 404  | P1       |
| `/pricing`          | 🔴 404  | P2       |
| `/contact`          | 🔴 404  | P2       |

Source audit confirms only 2 marketing pages are actually deployed while the rest are planned or missing. 

---

# Most Important Pages

These generate revenue fastest.

## 1. SAN-691 — Rentals & Brokers Landing

**Route:** `/partners/rentals`

### Audience

* Property managers
* Rental brokers
* Apartment owners

### Value Proposition

Instead of:

* Answering WhatsApp manually
* Scheduling viewings manually
* Writing listings manually

mdeai:

* Creates listings
* Qualifies leads
* Schedules viewings
* Captures prospects

### Sections

1. Hero
2. How it works
3. AI listing creation
4. Lead qualification
5. Viewing scheduling
6. Success metrics
7. CTA → Signup

### Score

**Business impact: 95/100**

---

## 2. SAN-661 — Venues Landing

**Route:** `/venues`

### Audience

* Restaurants
* Cafes
* Bars
* Nightclubs
* Event venues

Matches the active Venues PRD. 

### Value Proposition

Instead of:

* Paying agencies
* Managing reservations manually
* Running promotions manually

mdeai:

* Generates bookings
* Creates marketing content
* Improves venue visibility
* Handles booking requests

### Sections

1. Hero
2. Venue types
3. Booking flow
4. AI marketing
5. Featured placement
6. Customer stories
7. CTA

### Score

**Business impact: 93/100**

---

# Design Recommendations

Both pages should share:

### Hero

Large headline:

> Grow your business with AI-powered marketing and bookings

### Social Proof

* Events
* Rentals
* Restaurants
* Venues

### AI Workflow Diagram

```text
Lead
 ↓
AI qualifies
 ↓
AI drafts response
 ↓
Human approves
 ↓
Customer booked
```

### CTA

Single destination:

`/partners/signup`

Avoid multiple forms.

---

# Design Problems

### 1. Too Many Partner Categories

Current:

* Events
* Rentals
* Restaurants
* Nightlife
* Sponsors
* AI Services
* Marketing Services

This is confusing.

### Better

#### Discovery Businesses

* Rentals
* Restaurants
* Venues
* Events

#### Growth Services

* AI Marketing
* Sponsorships

---

### 2. No Pricing Strategy

Do not build `/pricing` first.

Users want:

* More bookings
* More leads
* More ticket sales

---

# Status update — 2026-06-10 (supersedes the audit above where they differ)

## What changed today

| Item | State |
|---|---|
| Sitemap drift | Fixed in `sitemap.md` — `/partners/rentals`, `/sponsors`, `/business/ai` were marked "shell 200", all three are **404 on prod** (verified by curl 2026-06-10) |
| Design task pack | `docs/partners/tasks/design/` — INDEX + D-PTR-01…10, one per marketing page, committed `b0919ee` |
| Pinned components | Every D-PTR file now names exact shadcn/ui components + 21st.dev categories (`21st.dev/s/hero`, `/s/features`, `/s/pricing`, `/s/testimonials`, `/s/cta`, …) with the install command and a one-author-per-page coherence rule |
| Wireframe coverage | Was 7 of 12; the 4 missing ones authored 2026-06-10: `partners-hub-wireframe.html` · `pricing-wireframe.html` · `contact-wireframe.html` · `business-hub-wireframe.html`. Vertical landings reuse `venues-wireframe.html` `?v=` variants by design |
| Linear | Evidence comments on all 12 MKT page tasks; SAN-691 (rentals landing) flagged: **In Review in Linear but 404 on prod** — find the unmerged branch/PR before building |

## Build-order reconciliation

The audit above says rentals first (95/100 impact); the task pack says venues first (it creates the shared `PartnerLandingShell`). Resolution: **build D-PTR-02 `/venues` first** — it is one page that ships the shell every other landing configures — **then D-PTR-03 `/partners/rentals` immediately after in the same week.** Rentals-first without the shell would fork the layout and double the work.

## Open decisions (need owner)

1. **SAN-691 drift** — locate the In-Review branch/PR for `/partners/rentals`; finish or close it.
2. **Hub card grouping (SAN-692)** — adopt the audit's two-group IA (Discovery Businesses / Growth Services) for the 6-card grid? Recommended: yes.
3. **Vertical landings (SAN-712/713/714)** — thin shell-config pages (SEO) vs 301 to `/venues?v=…`. Recorded in D-PTR-08; decide before building.

## Next steps

1. Ship D-PTR-02 — `/venues` (SAN-661): shell + page, wireframe + pinned components ready.
2. Ship D-PTR-03 — `/partners/rentals` (SAN-691) right behind it (resolve drift first).
3. Ship D-PTR-01 — `/partners` hub upgrade (SAN-692) with the two-group card IA.
4. Hold `/pricing` until interest exists (audit's call, agreed) — but the wireframe is ready when needed.
