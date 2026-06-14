---
title: "Partner Marketing Pages — Design Task Pack (D-PTR)"
updated: 2026-06-10
owner: sanjiovani
status: ready to execute
linear_epic: SAN-667 · PTR — Partner Ecosystem Master Plan
parent_docs:
  - ../../docs/03-landing-pages.md      # per-page goals/CTAs/features
  - ../../prd-partners.md               # PRD §6.1 marketing website
  - ../../wireframes/                   # HTML wireframes (shared Mindtrip B2B shell)
build_skills:
  - .claude/skills/shadcn               # registry search/install/audit
  - .claude/skills/21st-dev-builder-v2  # 21st.dev marketplace components
---

# D-PTR — Partner Marketing Pages Design Tasks

> **One line:** design + build the partner-facing marketing pages (events · real estate · venues/restaurants · sponsors · AI/marketing services) on the shared Mindtrip-B2B shell, using shadcn/ui primitives + 21st.dev marketplace sections. Every CTA funnels to the live wizard at `/partners/signup?type=…`.

## Common contract (applies to EVERY task below — do not repeat per file)

1. **Read first:** `DESIGN.MD` (oklch tokens, layout, do/don't) · `sitemap.md` row for the route · the task's wireframe.
2. **Shared shell** (from `venues-wireframe.html`): hero + dual CTA → value props → feature/services grid → how-it-works (3 steps) → dark trust band → pricing teaser → demo form → footer. Per-page deltas in each task file.
3. **Components:** shadcn/ui base (`button card badge tabs accordion avatar`) + 21st.dev sections installed as source:
   `npx shadcn@latest add "https://21st.dev/r/{author}/{component}"`
   Browse live before picking (hero, feature-grid, pricing, testimonial, logo-cloud, CTA categories). Re-token every install to `globals.css` oklch vars — **no hardcoded `gray-*`/hex; respect `prefers-reduced-motion`; skeletons on any async block.**
4. **CTAs:** primary → `/partners/signup?type={type}` (live, SAN-723 · MKT — Partner signup wizard). Secondary → "Book a demo" → `/contact` (until SAN-693 ships, `mailto:` fallback).
5. **English only** (Phase 1). Static marketing pages — no service-role, no new tables, SSR/SSG preferred.
6. **Done gate:** route 200 on localhost (`npm run dev`) + lighthouse-clean console + floor green (`/verify-floor`) + Playwright smoke (route renders hero + CTA href correct). One worktree, one PR per task.

## Task table

| Task file | Route | Linear | Wireframe | Priority |
|---|---|---|---|---|
| [D-PTR-01](./D-PTR-01-partners-hub.md) | `/partners` | SAN-692 · MKT — Partner hub marketing page | ✅ `partners-hub-wireframe.html` | **P0** (live but basic) |
| [D-PTR-02](./D-PTR-02-venues-landing.md) | `/venues` (+`?v=`) | SAN-661 · MKT — For Venues landing | ✅ `venues-wireframe.html` | **P0** |
| [D-PTR-03](./D-PTR-03-rentals-brokers.md) | `/partners/rentals` | SAN-691 · MKT — For Rentals / Brokers landing | ✅ `partners-rentals-wireframe.html` | **P0** (404 today) |
| [D-PTR-04](./D-PTR-04-business-ai.md) | `/business/ai` | SAN-663 · MKT — AI Services for companies | ✅ `business-ai-wireframe.html` | P1 (404 today) |
| [D-PTR-05](./D-PTR-05-sponsors.md) | `/sponsors` | SAN-664 · MKT — Sponsors / Sponsorship | ✅ `sponsors-wireframe.html` | P1 (404 today) |
| [D-PTR-06](./D-PTR-06-pricing.md) | `/pricing` | SAN-695 · MKT — Partner pricing | ✅ `pricing-wireframe.html` | P1 |
| [D-PTR-07](./D-PTR-07-contact.md) | `/contact` | SAN-693 · MKT — Contact / Book a demo | ✅ `contact-wireframe.html` | P1 |
| [D-PTR-08](./D-PTR-08-vertical-landings.md) | `/partners/{restaurants,cafes,nightlife}` | SAN-713 / SAN-714 / SAN-712 · MKT — vertical landings | ⚠️ shared shell `?v=` variants | P2 |
| [D-PTR-09](./D-PTR-09-business-hub.md) | `/business` | SAN-726 · MKT — mdeai for Business hub | ✅ `business-hub-wireframe.html` | P2 |
| [D-PTR-10](./D-PTR-10-about.md) | `/about` | SAN-662 · MKT — About page | ✅ `about-wireframe.html` | P2 |

## Wireframe coverage verdict (2026-06-10, updated same day)

✅ **Every D-PTR page now has a wireframe** (11 of 11): signup · host · venues · rentals · sponsors · business-ai · about (pre-existing) + partners-hub · pricing · contact · business-hub (authored 2026-06-10, each annotated with its 21st.dev category per section). Vertical landings (D-PTR-08) intentionally reuse `venues-wireframe.html` `?v=` variants.
❌ Still no wireframes (P3, out of this pack): contests · business/social · event-marketing · creator · vendor · venues/features — tracked under SAN-674 · PTR — Partner UX pack.

## Verified 21st.dev picks (live browse, 2026-06-10)

Browsed the live registry in Chrome; these are the concrete top picks per category for our premium-B2B (Mindtrip/Linear) aesthetic. Builders start here, only substituting if a pick has rotted. Install: `npx shadcn@latest add "https://21st.dev/r/{author}/{slug}"`.

| Use | Pick | Why | Runner-up |
|---|---|---|---|
| Hero | `tailark/hero-section-5` | clean typographic marketing hero; everything ranked above it is flashy (3D robots, glowy waves) | other `tailark` hero sections |
| Features grid | `kokonutd/bento-grid` (338 uses) | the signature Linear/Mindtrip bento pattern | `shadcnblockscom/shadcnblocks-com-feature108` (tabbed, safe) |
| Logo wall (trust band) | `shadcnblockscom/logos3` (235) | canonical auto-scrolling "trusted by" strip | `motion-primitives/progressive-blur/with-logos` (edge-fade) |
| Card carousel (event/venue rail) | `shadcnblockscom/gallery4` (291) | embla card rail with arrows — Mindtrip-style | `shadcnblockscom/gallery6` |
| Content card | `Ali-Hussein-dev/card` | plain + clean; frosted-glass/shine options too effect-heavy | shadcn/ui `card` primitive |
| Comparison/data table (pricing) | `shadcn/data-table` | canonical TanStack shadcn table | `haydenbleasel/data-table` |
| CTA | shadcn/ui `button` + a `shadcnblockscom` CTA *section* | the call-to-action category's top results are animated button gimmicks; `serafim/fey-button` is the only tasteful accent button | — |
| Imagery block | `anurag-mishra22/interactive-bento-gallery` (262) | the only real marketing imagery layout in its category; tasteful photo bento | — |

| How-it-works timeline | search 21st.dev for "timeline" (no dedicated category in the catalog); fallback: build a stepper on shadcn `separator` + `badge` primitives | a numbered timeline communicates the 5-step venue journey better than plain cards (owner review) | step-styled `/s/features` block |

**Author rule (updated 2026-06-10):** primary = `shadcnblockscom` (marketing blocks) with `tailark`/`kokonutd` accents — NOT `bundui`/`magicui` as earlier drafts said; magicui's top-ranked entries are flashy effects that fail the high-end bar. Re-token every install to oklch.

**Owner review rulings (2026-06-10 — stack approved, avg 9.5/10):**
- **Logo wall:** Phase 1 = hide the band completely; Phase 2 = real logos only. **No placeholders, ever** (supersedes "placeholder-gated" wording elsewhere, incl. high-end bar rule 5).
- **Gallery rail (`gallery4`) shows mdeai product screenshots, NOT venue photos** — concierge chat, booking approval, event publish wizard, venue dashboard, map discovery. The page sells mdeai; venue photos support the story, they aren't the story.
- **Canonical `PartnerLandingShell` slot order:** Hero (`tailark/hero-section-5`) → VenueTypeTabs (shadcn `tabs`) → BentoFeatures (`kokonutd/bento-grid`) → ProductGallery (`gallery4`, product screenshots) → HowItWorks (timeline) → PricingTeaser (`shadcn/data-table`, contact-gated) → FAQ (shadcn `accordion`) → DemoBand (shadcn `form`) → Footer.
- **Top remaining risk is not design — it's building `PartnerLandingShell` correctly** so the rentals/AI-services/sponsors pages become configuration, not new builds. Shell quality gates in D-PTR-02.

## The high-end bar — Mindtrip patterns (reviewed 2026-06-10, MANDATORY for every D-PTR page)

Source: `docs/screenshots/mindtrip/marketing/` (business overview · hotels · destinations · packages · how-it-works). What makes those pages feel premium, translated into rules for ours:

1. **Closing dark demo band on EVERY page** — Mindtrip ends every business page with the same full-width black band ("See Mindtrip for Business in action.") with the **demo form embedded right there** (name/email/company/interest/message), not a link to a contact page. Ours: every D-PTR page ends with the dark band + embedded short lead form posting to the D-PTR-07 lead endpoint. `/contact` remains the canonical page; the band is the inline version.
2. **Persistent "Book a demo" pill** in the partner-pages nav (top-right, filled, always visible) — mirror with our accent token.
3. **Gradient hero band + oversized display type** — soft duotone gradient hero (their pink/peach; ours from our oklch palette), 2–3-word-per-line headline, kicker line above, dual CTA (filled pill + ghost). No stock photos in heroes.
4. **Outcome stats, not feature counts** — dark band with 2–3 gradient stat cards ("3–10%", "2–3x", "100k+"). Ours: real numbers only (leads routed, events published, tickets sold) — omit the band until we have them; never fake.
5. **Trust = logo wall + "In Their Own Words" quote cards** — white logos on the dark band; one large pastel quote card with attribution. Placeholder-gated until real partners exist.
6. **Feature cards as soft illustrated tiles** — white cards, generous padding, small colored illustration per card, 2-line max copy. Matches our `21st.dev/s/features` picks; padding/whitespace is the luxury signal.
7. **Pricing = contact-gated packages** — Mindtrip's Packages page shows 3 tiers (middle one black/highlighted) with "Contact us for pricing" — **no public numbers** — followed by a feature-comparison checkmark table. D-PTR-06 adopts this exactly; resolves the "no pricing strategy" problem in notes/03-design.md.
8. **Audience-segmented footer** — columns by audience (For Travelers / For Partners / Company), same on every page.
9. **Art direction accent** — Mindtrip uses playful 3D renders (megaphone, clouds, pyramid). We don't have a 3D pipeline: substitute restrained illustrated/iconographic accents from one 21st.dev author + our accent tokens. Do NOT imitate the 3D style with emoji or clip-art.
