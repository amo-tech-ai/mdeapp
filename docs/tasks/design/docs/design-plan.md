I'll research all the links in parallel, then synthesize the two full audits. The Figma `recents-and-sharing` team URLs are your private workspace (auth-gated, not fetchable) — I'll note that and focus on the publicly auditable resources.

Let me dispatch six research agents to web-search the design tools, templates, and competitor platforms concurrently.

All six research agents returned with cross-verified findings. Before I synthesize, let me ground the screen-architecture and design recommendations in your actual current state by reading your design tokens and route status.

Grounding complete. Critical finding up front: **your existing [DESIGN.MD](DESIGN.MD) is already more premium and more AI-native than any of the four templates you asked me to audit** — and you've already correctly benchmarked Mindtrip (§13). That reframes the entire exercise. Here are both full audits.

---

# TL;DR — Read This First

**Audit 1 (Design Stack):** Your design *vision* is already right; your problem is *completion*, not redesign. Don't adopt any directory template — they'd drag [`/`](mdeapp/src/app/page.tsx) back toward the "directory website" you explicitly reject in DESIGN.MD §13. Best workflow for a code-first solo team shipping through Claude Code = **Claude Design (concept) → Claude Code + shadcn MCP + DESIGN.MD tokens (production) → Figma Dev Mode MCP only as an optional QA/reference layer.** Ban Figma-as-source-of-truth.

**Audit 2 (Competitive):** Mindtrip (88) and Wanderlog (82) are the bar. The entire field's weak spot is **monetization** (only Layla has a layered model) and **map↔itinerary sync** (most treat the map as a side panel). Your Stripe + Places + events/rentals stack lets you out-monetize everyone except Layla, and your DESIGN.MD already specifies the living-map sync that is the #1 moat. **Your competitive risk is not strategy — it's that 4 core surfaces (`/rentals`, `/restaurants` deploy, checkout webhook, `/host/events`) are unfinished.**

| | Verdict | Score |
|---|---|---:|
| Best Design Tool (generative) | Claude Design — concept only, it's a research preview | 72/100 |
| Best Design Tool (handoff) | Figma Dev Mode MCP → React+Tailwind+tokens | 80/100 |
| **Best Dev Workflow (your context)** | **Claude Code + shadcn MCP + DESIGN.MD** | **88/100** |
| Best Template | Accommo Pro — harvest parts only, never a base | 62/100 |
| Best MCP Integration | Figma Dev Mode MCP (official) | 80/100 |
| Best Overall Architecture | Your current stack | 86/100 |
| Best Benchmark to copy | Mindtrip | 88/100 |

**Evidence caveats:** The 6 repeated `figma.com/files/team/...recents-and-sharing` links are your *private* workspace (auth-gated) — not auditable; I treated them as "your own Figma files." Template link #4 (`1375505114072192161`) is **not a template** — it resolves to Figma's own "Figma AI (beta)" product page (likely a paste error). Dribbble bot-blocks scraping, so palettes for the two shots are inferred from genre. Several competitor revenue models are inferred (flagged inline).

---

# ═══════════════════════════════════════
# AUDIT 1 — MDEAI DESIGN STACK FORENSIC AUDIT
# ═══════════════════════════════════════

## Part 1 — Individual Review

### Design & build tools

| # | Name | Type | Vendor | Purpose | Key strength | Key weakness | Learning curve | Prod readiness | Score /100 |
|---|------|------|--------|---------|--------------|--------------|----------------|----------------|----:|
| 1 | **Claude Design** | Prompt-to-prototype | Anthropic Labs | AI-native concept/prototype gen, reads your repo for brand | "Your Brand, Built In" auto-derives tokens; hands off to Claude Code | **Research preview**; outputs HTML prototypes not Figma/clean React; brutal weekly caps (~3–4 prompts on Pro) | Low | **Preview** (Apr 2026) | **72** |
| 2 | **Claude Design plugin** (`/plugins/design`, Cowork) | Review/critique agent | Anthropic | UX writing, **WCAG 2.1 AA audits**, research synthesis, dev handoff | Free reviewer that catches a11y gaps (you need SCREEN-020) | Reviewer, not a generator | Low | GA | **66** |
| 3 | **Claude Figma plugin** (`/plugins/figma`) | Design→code (in Claude Code) | Figma | Reads Figma into pixel-perfect code via Code Connect | GA, ~136k installs; `/implement-design`, `/code-connect-components` | One-direction (design→code); needs a Figma source to read | Low | **GA** | **74** |
| 4 | **Figma Make** | Prompt-to-app | Figma | Prompt → working code-backed web app + prototype | Real code + Supabase wiring; clickable concepts fast | Figma-hosted runtime, **not a portable Next.js export**; lock-in | Low-Med | GA | **60** |
| 5 | **Figma AI** (suite) | In-canvas AI helpers | Figma | Layer rename, image gen (Gemini 3 Pro), copy rewrite, first draft | Removes designer grunt work; GA-stable | Designer-side only, **nothing reaches code** | Low | GA | **52** |
| 6 | **FigJam AI** | Whiteboard AI | Figma | Diagrams, sticky sorting, summarize | Fast diagramming | You already mandate **Mermaid** for repo diagrams | Low | GA | **45** |
| 7 | **Figma Agent** | Agentic canvas editor | Figma | Parallel style options, bulk component edits | Design-system-aware, @-mention tokens | **Beta**; designer-only, no code path | Med | Beta (May 2026) | **50** |
| 8 | **AI Prototype Generator** | Prototyping mode | Figma | = Figma Make's prototype mode | Interactive prototypes w/ logic | Not a separate product; same lock-in | Low | GA | **58** |
| 9 | **Canvas open to agents** (`use_figma`) | MCP write-to-canvas | Figma | Claude/Cursor write *into* Figma | Reverse shipped UI into Figma for review | **Beta → paid API**; niche | Med | Beta | **55** |
| 10 | **Claude Code ↔ Figma** | Bidirectional bridge | Figma | Snapshot localhost UI → Figma frames; design→code | Snapshot `localhost:3001` into Figma for QA without sharing dev box | Beta; only valuable with a designer in loop | Med | Beta | **70** |
| 11 | **Figma Dev Mode MCP** (official) | Design→code MCP | Figma | `get_design_context`→**React+Tailwind**, `get_variable_defs`→**tokens**, Code Connect | **Highest design→code fidelity**; native to your shadcn/Tailwind v4 | Read=all seats, **write/desktop needs paid Dev/Full seat**; needs Figma source | Med | GA (read) | **80** |
| 12 | **arinspunk/claude-talk-to-figma-mcp** | Community MCP (read+write) | OSS (MIT) | Deep write API, **works on free Figma** | Free-tier, granular write, multi-agent safe | Community support; manual websocket+plugin setup | Med-High | Stable (community) | **62** |
| 13 | **shadcn MCP** *(already in your stack)* | Component registry MCP | shadcn | Pull components/blocks/themes into code | **Native to your exact stack**; zero translation loss | Code-only (no visual canvas) | Low | GA | **88** |

### Templates (Part 5 expands)

| # | Name | Type | Verdict | Score /100 |
|---|------|------|---------|----:|
| 14 | City Guide — Business Directory (webfancy99) | Static Dribbble image | **AVOID** — 2018-era directory aesthetic | 35 |
| 15 | Zaidic — City Directory (Flowzai) | Webflow template (static preview) | **AVOID as base** / modify for marketing pages only | 55 |
| 16 | Accommo Pro | **Editable Figma community file** (free, Tailwind twin) | **MODIFY** — harvest listing/detail parts only | 62 |
| 17 | "Figma AI (beta)" `1375505114072192161` | **NOT a template** | **INVALID LINK** — re-supply if a 4th was intended | — |

> The 6 `recents-and-sharing` links = your private Figma workspace (auth-gated). Not auditable. Treated as your own source files.

---

## Part 2 — Top 10 Features (across all resources)

| # | Feature | Why it matters | How mdeai uses it | Priority | Score |
|---|---------|----------------|-------------------|----------|----:|
| 1 | **`get_variable_defs` (Figma MCP)** → token export | Keeps design tokens in lockstep with code | Sync any Figma exploration → your `globals.css` oklch tokens | P1 | 95 |
| 2 | **`get_design_context` → React+Tailwind** | Emits *your* stack, not generic HTML | Convert a card mockup → `RestaurantResultCard.tsx` directly | P1 | 92 |
| 3 | **shadcn MCP component pull** | Zero-translation into your codebase | Build SCREEN-019 empty/error states from registry | P0 | 92 |
| 4 | **Claude Design "Your Brand, Built In"** | Auto-derives brand from repo | Reads your DESIGN.MD tokens → on-brand concepts | P1 | 85 |
| 5 | **Claude Design → Claude Code handoff bundle** | Model-to-model spec, not a PNG | Concept `/trips` itinerary panel → Claude Code builds it | P2 | 82 |
| 6 | **Claude Code → Figma localhost snapshot** | Captures live UI into editable frames | Snapshot `/chat` for design QA without exposing dev box | P2 | 78 |
| 7 | **Cowork plugin WCAG 2.1 AA audit** | a11y is a launch gate (SCREEN-020) | Automated contrast/aria sweep pre-launch | P1 | 76 |
| 8 | **Code Connect mapping** | Figma component ↔ your shadcn component | Prevents drift if a designer joins Phase 2 | P3 | 70 |
| 9 | **Figma Make rapid prototype** | Clickable concept in minutes | Validate Roberto's host-wizard flow before coding | P2 | 65 |
| 10 | **arinspunk write-to-Figma (free)** | Reverse code→Figma w/o paid seat | Generate a Figma design-doc from shipped UI | P3 | 60 |

---

## Part 3 — Design Workflow Analysis

Scored **for your specific context**: code-first solo team, Claude Code as the engine, an existing shadcn/Tailwind v4 system + DESIGN.MD, fast MVP timeline, English-only Phase 1.

| Workflow | Pros | Cons | Score |
|----------|------|------|----:|
| **1. Claude Design** | AI-native concepts fast; reads your repo for brand; clean handoff to Claude Code | Research preview; HTML not Figma/clean React; metered hard | **72** |
| **2. Figma AI** | Polishes designer artifacts | No code path; you have no dedicated designer team; pure overhead | **48** |
| **3. Figma Make** | Working prototype fast; Supabase wiring | Figma-runtime lock-in; output ≠ your Next.js app; throwaway code | **55** |
| **4. Figma Agent** | Bulk canvas edits, system-aware | Beta; designer-only; zero code reach | **45** |
| **5. Claude Code + Figma** | Bidirectional; snapshot localhost → Figma for QA | Only pays off if a designer reviews in Figma | **68** |
| **6. Figma MCP (Dev Mode)** | Highest design→code fidelity (React+Tailwind+tokens) | Requires a Figma source-of-truth you don't maintain today | **74** |
| **7. Cursor + Figma MCP** | Same MCP fidelity in a strong IDE | **Redundant** — you're standardized on Claude Code | **58** |
| **8. Traditional Figma** | Highest-fidelity, best for design teams | Slow; wrong for a solo founder shipping weekly | **42** |

**Winner for mdeai = a hybrid not on the list:** **Claude Design (concept) → Claude Code + shadcn MCP + DESIGN.MD (production) → Figma Dev Mode MCP (optional reference).** Among the 8 listed, #1 and #6 rank highest, with #5 as the QA bridge.

---

## Part 4 — Ownership Matrix

| Responsibility | Best Tool | Why |
|----------------|-----------|-----|
| UX Strategy | **You + Claude (chat)** + `plan/prd.md` | Strategy lives in your PRD/personas, not a tool |
| Information Architecture | **`sitemap.md` + DESIGN.MD** | You already own a 53-route IA — authoritative |
| User Flows | **Claude Design / FigJam AI** | Fast flow sketches; Mermaid for repo-native |
| Wireframes | **Claude Design** → `tasks/wireframes/` | Already your spec home (SCREEN-xxx files) |
| Design System | **DESIGN.MD + globals.css (oklch)** | Source of truth is code, not Figma |
| Components | **shadcn MCP + Claude Code** | Native registry → your `base-nova` style |
| Variants | **shadcn + Tailwind v4** | `cva`/data-attrs in code |
| Responsive Layouts | **Claude Code + DESIGN.MD §5** | Your 3/2/1-panel grid is already specced |
| Prototypes | **Figma Make** (throwaway) or **Claude Design** | Validate flows before coding |
| User Testing | **Playwright + chrome-devtools MCP (Lucía)** | Real-journey e2e, not mockup clicks |
| Frontend Code | **Claude Code** | Your primary engine |
| React Components | **Claude Code + shadcn** | — |
| Tailwind | **Claude Code + DESIGN.MD tokens** | oklch tokens enforced by hooks |
| shadcn | **shadcn MCP** | First-party registry |
| CopilotKit | **Claude Code + `copilotkitV1` skill** | v1.55.2 pinned; skill guards v1/v2 |
| Mastra | **Claude Code + `mastra` MCP/skill** | Agent wiring |
| Supabase | **Supabase MCP + edge functions** | RLS + service-role isolation |
| Stripe | **Claude Code + edge function** | Webhook isolation (Andrés) |
| Maps | **Claude Code + `google-maps-code-assist` MCP** | FieldMask/mapId hooks |
| Backend | **Claude Code + Mastra tools** | — |
| APIs | **Claude Code** | `src/app/api/**` |
| Authentication | **Supabase Auth** | OAuth callback live |

**The throughline:** in a code-first shop with an existing system, **design tools own *exploration*; Claude Code owns *production*.** Figma never becomes the source of truth.

---

## Part 5 — Template Audit

| Template | Score | Copy | Modify | Avoid | Visual | Mobile | AI-ready | Maps-ready | Directory-ready | Design-sys |
|----------|----:|------|--------|-------|:---:|:---:|:---:|:---:|:---:|:---:|
| City Guide (webfancy99) | 35 | — | — | ✅ **Avoid** | 5 | 4 | 1 | 3 | 7 | 4 |
| Zaidic (Flowzai) | 55 | — | marketing pages only | ✅ as app base | 7 | 8 | 1 | 3 | 8 | 6 |
| Accommo Pro | 62 | cards/filters/detail anatomy | ✅ **Modify** (harvest) | — | 7 | 8 | 1 | 4 | 8 | 8 |
| #4 (invalid) | — | — | — | — | — | — | — | — | — | — |

**Per-vertical best starting point:**

| Vertical | Best template | Reality |
|----------|---------------|---------|
| Restaurants | Accommo (cards only) | But you already shipped `/restaurants` (SAN-490) |
| Nightlife | None | Already shipped `/nightlife` (SCREEN-022) — templates have no nightlife pattern |
| Rentals | Accommo (listing+detail anatomy) | Best overlap; harvest for `/rentals/[id]` |
| Events | Accommo (event listing) | You already have `/events/[slug]` LIVE |
| Trips | **None** | Itinerary/map-sync is greenfield — copy **Mindtrip/Wanderlog**, not a template |
| Home | **None** | Your chat-first 3-panel is more advanced than any template |
| Chat | **None** | No template has an AI concierge — this is your moat |

**Verdict:** **None is a viable foundation.** All four are directory-genre; copying their *information architecture* (category tiles → grid → detail) is the single biggest way to accidentally ship the "directory website" your own DESIGN.MD §13 forbids. **Take Accommo's listing-card/detail anatomy as a parts donor for `/rentals/[id]`; take Zaidic's section polish for future marketing pages; skip City Guide and the invalid #4 entirely.** Maps-first and AI-chat are 1/10 across all four — those surfaces are greenfield regardless.

---

## Part 6 — Competitive Analysis (summary — full teardown in Audit 2)

| Product | What they do better | What mdeai should copy | What to avoid |
|---------|---------------------|------------------------|---------------|
| **Mindtrip** | Living chat↔map↔list as one object; "Start Anywhere" ingestion | Real-time pin sync (you spec it — ship it); paste-IG-link→Medellín plan; like-to-pin | Curation without decisive trade-offs; English-only ceiling |
| **Layla** | Layered monetization (affiliate+sub+ads); media-rich maps | Affiliate/commission + creator program | Aggressive upsell (Trustpilot complaints) |
| **Wanderlog** | Per-day distance/time map sync; freemium scale | Distance-from-lodging on rental cards; ad-free-free + Pro | "Bolted-on AI" feel — keep chat as the spine |
| **Google Maps** | Canonical map interactions, pin density | Native map chrome (you already aim for this) | Becoming a utility with no concierge voice |
| **Airbnb Experiences** | Premium editorial photography, trust/reviews | Photo-hero density, social proof line | Pure-listing IA with no AI |

---

## Part 7 — Recommended mdeai Workflow

```
Step 1 — STRATEGY        You + Claude chat + plan/prd.md + personas
Step 2 — IA / FLOWS      sitemap.md + DESIGN.MD (already authoritative)
Step 3 — CONCEPT         Claude Design  →  explore AI-native surface (Trips, Saved)
Step 4 — PROTOTYPE       Figma Make (throwaway) for risky flows (host wizard HITL)
Step 5 — PRODUCTION      Claude Code + shadcn MCP + DESIGN.MD tokens   ← the engine
Step 6 — DESIGN QA       Figma Dev Mode MCP (optional) + Cowork WCAG audit
Step 7 — FUNCTIONAL QA   Playwright + chrome-devtools MCP (Lucía)
```

| Stage | Input | Output | Deliverable | Handoff |
|-------|-------|--------|-------------|---------|
| Concept | DESIGN.MD tokens + persona prompt | HTML prototype | Shareable concept URL | "Handoff to Claude Code" bundle |
| Prototype | Flow description | Clickable app | Validation verdict | Discard code, keep decisions |
| Production | Spec + tokens + Claude Design bundle | Next.js/shadcn code | PR on a worktree | One-worktree-one-PR → review |
| Design QA | Live `localhost:3001` | Figma frames / a11y report | SCREEN-020 sign-off | Issues → back to Claude Code |
| Functional QA | PR branch | e2e pass + screenshots | Floor-green proof | Done gate |

**Cursor is intentionally omitted** — you're standardized on Claude Code; adding Cursor splits your toolchain for no fidelity gain.

---

## Part 8 — Screen Architecture (grounded in your `sitemap.md`)

Priority reflects **what's actually unfinished and blocks the North Star** (Camila cards+pins · Andrés paid ticket · Roberto publish), not greenfield design.

| Screen | Priority | Current status | Reason |
|--------|----------|----------------|--------|
| **Home `/`** | P0 (done-ish) | ✅ LIVE | Foundation; everything renders through it. Polish, don't rebuild |
| **Chat (`/` canonical)** | P0 (done) | ✅ LIVE | The spine; `/chat` is an alias → `/` |
| **Rentals `/rentals`** | **P0 — TOP** | 🔵 redirect; **cards broken since 05-27** | Camila's main browse path shows nothing — North Star blocker |
| **Rental detail `/rentals/[id]`** | **P0** | 🔵 doesn't exist | Cards link nowhere; harvest Accommo anatomy here |
| **Checkout webhook** | **P0** | ⚠️ edge fn deployed, **e2e unproven** | Andrés can't get a paid ticket finalized — North Star blocker |
| **Restaurants `/restaurants`** | P1 | ✅ built, **prod 404 until deploy** | SAN-490 done — just ship it |
| **Host events `/host/events`** | P1 | 🔵 MVP | Roberto can't see his published events |
| **Nightlife `/nightlife`** | P1 (done) | ✅ LIVE | SCREEN-022 shipped this session |
| **Cafes `/cafes`** | P2 | ⚠️ SHELL | Fork from restaurant browse |
| **Trips `/trips`** | P2 | ⚠️ SHELL | Itinerary panel = your biggest *design* opportunity (copy Mindtrip) |
| **Saved `/saved`** | P2 (done) | ✅ LIVE | Collections exist; polish |
| **Host Dashboard (broker)** | POST | ⚫ | Out of Phase-1 scope |
| **Admin `/admin/*`** | POST (W8) | ⚫ | Patricia ops — later |

**Dependency chain:** `Home/Chat (done)` → `Rentals browse + detail` → `Checkout finalize` → `Restaurants deploy` + `Host events` → `Cafes/Trips polish` → `Admin`. **Design is not your bottleneck — these are completion/wiring tasks.**

---

## Part 9 — Production Architecture

| Layer | Tool |
|-------|------|
| Design | DESIGN.MD (oklch tokens) + Claude Design (concept) |
| Prototype | Figma Make (throwaway) |
| Components | shadcn/ui (`base-nova`) via shadcn MCP |
| Frontend | Next.js 16 + React 19 + Tailwind v4 (Claude Code) |
| Backend | Mastra tools + `src/app/api/**` |
| AI | Gemini 3.5-flash via `@ai-sdk/google` + CopilotKit 1.55.2 |
| Data | Supabase (Postgres, RLS, project `zkwcbyxiwklihegjhuql`) |
| Maps | Google Maps + Places API New (FieldMask-gated) |
| Payments | Stripe (edge-function webhook isolation) |

**The boundary lines:**

```
FIGMA STOPS ──────────► at the token/reference layer. It never owns a component you ship.
                        (Optional: Dev Mode MCP feeds tokens IN; Claude Code→Figma pushes UI OUT for QA.)

CLAUDE DESIGN STOPS ──► at the approved concept + handoff bundle. Its HTML is never committed.

CLAUDE CODE STARTS ───► the moment a concept/spec exists. Owns ALL production code:
                        components, Tailwind, CopilotKit, Mastra, API routes, tests.

CURSOR STARTS ────────► never (for this team). Standardize on Claude Code.
```

---

## Part 10 — Final Verdict (Audit 1)

| Category | Winner | Score |
|----------|--------|------:|
| Best Design Tool (generative) | Claude Design (concept only) | 72/100 |
| Best Design Tool (handoff) | Figma Dev Mode MCP | 80/100 |
| **Best Development Workflow** | **Claude Code + shadcn MCP + DESIGN.MD** | **88/100** |
| Best Template | Accommo Pro (parts donor only) | 62/100 |
| Best MCP Integration | Figma Dev Mode MCP (official) | 80/100 |
| Best Overall Architecture | Your current stack | 86/100 |

**If I were CTO + Head of Product:**
- **Use:** Claude Code (engine) · shadcn MCP · DESIGN.MD tokens · Claude Design (concepts, on a Max seat) · Figma Dev Mode MCP (reference) · Cowork WCAG plugin · Playwright/chrome-devtools (QA).
- **Start from:** your **own DESIGN.MD + Mindtrip patterns** — not a template. Harvest Accommo's card/detail anatomy for `/rentals/[id]` only.
- **Enforce:** one-worktree-one-PR · localhost runtime proof for Done · v1 CopilotKit only · Gemini-only · tokens-not-hardcoded-grays.
- **Ban:** any directory template's IA · Figma-as-source-of-truth · Cursor (toolchain split) · Claude Design's HTML as committed code · adding `/restaurants`-style catalogs that bypass chat *without* the chat spine.
- **Build first:** fix `/rentals` cards → ship `/rentals/[id]` → prove checkout finalize e2e. (North Star, not design.)

**Flags:** 🟢 design system already premium & AI-native; correct Mindtrip benchmark; strong hooks/guardrails. 🟡 Claude Design is a metered preview — don't depend on it; 4 templates are a regression risk. 🔴 Don't let a "redesign" detour you from the 4 unfinished North-Star surfaces.

---

# ═══════════════════════════════════════
# AUDIT 2 — AI TRAVEL PLATFORM COMPETITIVE UX/UI AUDIT
# ═══════════════════════════════════════

## Part 1 — Executive Summary

| Platform | Score /100 | Grade | Primary strength | Biggest weakness |
|----------|----:|-------|------------------|------------------|
| **Mindtrip** | 88 | A | Living chat↔map↔itinerary as one object | Weak at decisive trade-offs; English-only |
| **Layla** | 88 | A | Layered monetization + media-rich maps | Aggressive upsell (mixed Trustpilot) |
| **Wanderlog** | 82 | A− | Best map↔list distance/time sync; scale | AI feels bolted-on; utilitarian |
| **Stardrift** | 80 | B+ | Logistics/routing + calendar awareness | No proven revenue model |
| **TripPlanner.ai** | 78 | B+ | End-to-end plan→book w/ partner pricing | Trustworthy but not *premium*; map depth thin |
| **iMean AI** | 72 | B | 11-agent depth, surgical edits | Price contradictions; non-reproducible |
| **Airial** | 68 | B− | Frictionless social-link→trip chat | Opaque public presence; no map story |
| **EasyTripAI** | 62 | C+ | Sharp "reality-check" differentiation | No revenue model; negative framing |
| **Wonderplan** | 58 | C | Free + clean collaboration/PDF | Template, not conversational |
| **Roam Around** | 58 | C | Native iOS/Android | No map; shallow AI; brand forking to Layla |
| **RoutePerfect** | 54 | C− | Slider "equalizer" trade-off dials | Dated; not AI-native |

**mdeai's lane:** none nail all three of (a) deep conversational agent + (b) beautiful map↔itinerary sync + (c) premium/editorial visuals **for a single hyper-local city**. That's your white space.

---

## Part 2 — Homepage Analysis

| Platform | Homepage | Conversion | Mobile | UX |
|----------|----:|----:|----:|----:|
| Mindtrip | 9 | 8 | 9 | 9 |
| Layla | 9 | 9 | 8 | 8 |
| TripPlanner.ai | 8 | 9 | 7 | 8 |
| Wanderlog | 8 | 8 | 9 | 8 |
| Stardrift | 8 | 6 | 6 | 8 |
| iMean | 7 | 7 | 5 | 7 |
| Airial | 6 | 5 | 5 | 6 |
| EasyTripAI | 7 | 6 | 5 | 6 |
| Wonderplan | 5 | 5 | 6 | 5 |
| Roam Around | 6 | 6 | 8 | 6 |
| RoutePerfect | 4 | 5 | 4 | 4 |

**Patterns that convert:** single dominant CTA ("Start chatting" / "Plan my trip"); a **trust strip** (Mindtrip's CNBC/NYT + Priceline/Viator logos; TripPlanner's "8M+ trips, 4.9★, Booking/Viator/Skyscanner"); first-person AI persona (Layla). **mdeai's `/` should carry one trust line** (venue count, "grounded by Google", paisa-local credibility) — you currently have none.

---

## Part 3 — Design System Audit

| Platform | Design style | Colors | Strength | Weakness |
|----------|--------------|--------|----------|----------|
| Mindtrip | Photo-led, editorial, whitespace | Light neutral + photography | Feels like a product, not a chatbot | Can read generic-premium |
| Layla | Warm lifestyle, consumer-brand | Warm + lifestyle photography | Aspirational, AI-native first-person | Upsell-heavy chrome |
| Stardrift | Minimal SaaS, grayscale + dots | Mono + accent | Clean, "intelligent tool" | Cool/utilitarian, low warmth |
| TripPlanner | Gradient + illustration | Gradient/blue + photo | Trustworthy, card-first | Friendly-SaaS, not luxury |
| iMean | Blue/gradient template | Blue gradient | Modern, AI-native | Generic template feel |
| Wanderlog | Clean blue/white | Blue + white cards | Polished, trustworthy | "Productive tool", not premium |
| Roam Around | Photo + gradient blobs | Gradient blobs | Approachable | Directory/dated |
| EasyTripAI | Expectation-vs-reality contrast | Contrast photography | Memorable concept | Chrome unremarkable |
| Wonderplan | Form-driven | Utilitarian | Functional | Dated/form feel |
| RoutePerfect | Cartoonish | Dated palette | — | Outdated |

- **Most premium:** Mindtrip · **Most AI-native:** Layla (first-person agent) · **Most trustworthy:** TripPlanner (partner logos + 4.9★) · **Most outdated:** RoutePerfect.
- **mdeai vs field:** Your **dark city-night oklch theme + amber accent + per-vertical map glyphs** is *more distinctive than every competitor* (they're all light/blue/gradient). **This is a real edge — lean into it.** The risk is execution polish, not direction.

---

## Part 4 — User Journey Analysis

```
Landing → Search/Chat → AI conversation → Recommendations → Map → Itinerary → Booking → Payment → Share → Return
   │          │              │                 │             │        │           │          │        │        │
 Mindtrip:  chat-first, recs render as cards+pins LIVE on map, like-to-pin, book inline (Priceline/Viator), share board
 Layla:     chat-first, live-priced cards, book via affiliates, native app return
 Wanderlog: itinerary-first, map sync, Pro-gated optimize, email-import bookings, strong return (offline app)
 mdeai NOW: chat-first ✅ → cards+pins ✅(spec) → [RENTALS BROKEN] → [CHECKOUT UNPROVEN] → saved ✅ → return ⚠️
```

**Friction points (industry):** ① paywall *after* generation starts (iMean) — don't do this. ② price contradictions erode trust (iMean) — your "no inventing prices" DESIGN.MD rule already guards this. ③ map as a separate tab (Wonderplan/Roam) — your living-sync spec avoids this. **mdeai's own friction = two hard breaks: `/rentals` shows nothing, checkout finalize unproven.** Those are the journey killers to fix.

---

## Part 5 — AI Experience Audit

| Platform | AI quality | Personalization | Memory | Planning |
|----------|----:|----:|----:|----:|
| iMean | 9 (11 agents, surgical edits) | 8 | 7 | 8 |
| Mindtrip | 9 | 8 | 8 | 9 |
| Stardrift | 8 (logistics-aware) | 8 | 7 | 9 |
| Layla | 8 | 8 | 7 | 8 |
| Airial | 8 (social-link→trip) | 7 | 6 | 7 |
| TripPlanner | 7 | 6 | 6 | 8 |
| Wanderlog | 6 (assistive) | 6 | 6 | 7 |
| Roam Around | 4 (one-shot) | 4 | 3 | 4 |
| Wonderplan | 3 (template) | 3 | 2 | 4 |
| RoutePerfect | 3 (sliders+GPT) | 4 | 2 | 5 |

**Steal:** Mindtrip "Start Anywhere" ingestion · iMean's **surgical edit** ("change only Day 1") · Stardrift's **calendar-conflict awareness** · Airial's **TikTok/IG-link→itinerary**. **mdeai advantage:** Mastra working-memory + thread persistence (F13) gives you *real* cross-session memory most rivals fake — and **hyper-local Medellín grounding** (Supabase-curated venues + Google fallback) beats every generalist.

---

## Part 6 — Maps Experience Audit

| Platform | Maps score | Innovation | Notes |
|----------|----:|----:|-------|
| **Mindtrip** | 10 | 10 | Living sync — chat output renders as pins in real time; map = primary surface |
| Wanderlog | 9 | 8 | Bidirectional drag-reorder; per-day distance/time/mileage; route optimize |
| Stardrift | 8 | 7 | Live map clusters by neighborhood as you plan |
| Layla | 7 | 8 | Interactive **video map** + multi-destination route map |
| iMean | 6 | 5 | Route pins; sync depth unclear |
| TripPlanner | 6 | 5 | Map + timing/routes in one view |
| EasyTripAI | 5 | 7 | Novel **safety/scam** map (not itinerary) |
| Wonderplan | 4 | 3 | Basic place-near-hotel view |
| RoutePerfect | 4 | 4 | Red route-line for road trips |
| Roam Around | 1 | 1 | **No map** |

**vs Mindtrip specifically:** Mindtrip's magic is that **chat, list, and map are one object, not three tabs** — every recommendation carries photo+rating+review+pin together, and "like" pins it. **Your DESIGN.MD §4.2 already specs exactly this** (hover card → pin bounce; click pin → card scrolls/highlights; per-vertical glyphs; price-tier pin labels). **You are one execution cycle from matching the category leader on the single most important axis.** Ship it.

---

## Part 7 — Listings Experience

| Platform | Card quality | Photos | Social proof | AI explanation | Booking CTA |
|----------|----:|----:|----:|:---:|:---:|
| Mindtrip | 9 | 9 | ✅ rating+review | ✅ | ✅ inline (Priceline/Viator) |
| Airbnb Exp.* | 10 | 10 | ✅ | ◑ | ✅ |
| Layla | 8 | 8 | ✅ | ✅ first-person | ✅ affiliate |
| TripPlanner | 8 | 7 | ✅ | ◑ | ✅ partner deep-link |
| Wanderlog | 8 | 7 | ✅ Google/TripAdvisor | ◑ | ◑ |
| iMean | 6 | 5 | ◑ | ✅ | ◑ |
| Roam Around | 5 | 6 | ✗ | ◑ | ✗ |
| Wonderplan | 5 | 5 | ✗ | ✗ | ✗ |

*Airbnb Experiences = photography/trust benchmark.

**mdeai's card (DESIGN.MD §4.1) is already best-in-class on paper:** photo hero + vertical badge + save + name + price-tier(mono) + neighborhood + rating + **AI intent reason (italic)** + social-proof line + CTA row. **You spec the `ai_reason` field every competitor lacks except Mindtrip/Layla.** Gaps to close: real photos (Places photo proxy is live ✅), and *consistent* card identity across chat/list/map (Mindtrip's "same unit everywhere").

---

## Part 8 — Marketing Pages Audit

| Platform | SEO | Marketing | Conversion | Content |
|----------|----:|----:|----:|----:|
| Wanderlog | 9 | 8 | 8 | 9 (guides crawl massive long-tail) |
| Mindtrip | 8 | 9 | 8 | 7 |
| Layla | 8 | 9 | 9 | 7 |
| TripPlanner | 8 | 8 | 9 | 8 |
| EasyTripAI | 7 | 7 | 6 | 8 (data-transparency content) |
| Stardrift | 6 | 7 | 6 | 7 |
| Airial | 4 | 5 | 5 | 4 |

**Lesson for mdeai:** Wanderlog wins SEO via **programmatic city/venue guide pages** — for you, "best rooftop bars in Poblado", "pet-friendly rentals Laureles" = long-tail Medellín SEO that ChatGPT can't easily replicate. Your `/about`, `/partners`, `/legal/*` are all ⚫ POST — fine for MVP, but **a thin programmatic-SEO layer over your Supabase venue data is a cheap, durable acquisition moat** for Phase 2.

---

## Part 9 — Revenue Model Analysis

| Platform | Revenue streams | Strength | Score |
|----------|-----------------|----------|----:|
| **Layla** | Affiliate (Booking/Skyscanner/GYG) + sub ($9.99/mo) + planned ads + partner B2B2C | Mature/layered | 9 |
| **Mindtrip** | Hotel/flight affiliate (Priceline) + tours (Viator) + **creator program** ($1–1.5/user) + DMO B2B | Flywheel | 9 |
| TripPlanner | Sub (~$19/mo Pro) + affiliate (Booking/Skyscanner/Viator/GYG) | Dual stream | 8 |
| Wanderlog | Freemium (~$40/yr Pro) + booking affiliate | Proven | 8 |
| iMean | Sub ($27.99–43.99/mo) + inferred affiliate | Aggressive | 6 |
| RoutePerfect | Booking affiliate + GPS audio upsell | Legacy | 5 |
| Roam Around | Token micro-payments (~$5/30 plans) | Caps LTV | 4 |
| Stardrift | None disclosed (B2B/demo hints) | Unproven | 3 |
| Airial | Free now + B2B/white-label track | Unproven | 3 |
| EasyTripAI | None found | None | 2 |
| Wonderplan | None | None | 1 |

**mdeai's revenue edge (your stack enables a model only Layla/Mindtrip rival):**
1. **Ticketing take-rate** (Stripe, Andrés) — *you already have commerce most rivals lack*.
2. **Rental lead-gen / broker commission** (Camila → leads table → broker payouts, POST).
3. **Sponsored/featured venue placement** (restaurants, nightlife) — local ad inventory.
4. **Booking affiliate** (tours/experiences) — add later.
5. **Host SaaS / Pro** (Roberto analytics, Patricia ops).
6. **Creator flywheel** (local Medellín creators seed itineraries — copy Mindtrip).

**You can reach #2-strongest monetization in the field** because you own *transactions* (tickets) + *supply* (hosts/brokers), not just affiliate clicks.

---

## Part 10 — What mdeai Should Build

### Top 50 Features (ranked by ROI)

| # | Feature | Why | Revenue | Difficulty | Score |
|---|---------|-----|:---:|:---:|----:|
| 1 | Fix `/rentals` cards (broken since 05-27) | North-Star blocker; Camila sees nothing | High | Low | 99 |
| 2 | Prove checkout→finalize e2e (webhook) | Andrés can't pay; revenue=$0 until done | Direct | Low | 98 |
| 3 | `/rentals/[id]` detail page | Cards link nowhere | High | Med | 95 |
| 4 | Deploy `/restaurants` (prod 404) | Built already; just ship | Med | Low | 94 |
| 5 | Living map↔card sync (hover/click) | The #1 Mindtrip moat; already specced | High | Med | 93 |
| 6 | `/host/events` list | Roberto blind after publish | Med | Low | 90 |
| 7 | Real photos on every card (Places proxy) | Photo-hero = primary identifier | Med | Low | 89 |
| 8 | Loading/error/empty states (SCREEN-019) | Production-quality gate | Med | Low | 88 |
| 9 | "Start Anywhere" ingestion (paste IG/URL→plan) | Mindtrip/Airial signature | High | Med | 86 |
| 10 | Like-to-pin → saved collection | One-gesture save (Mindtrip) | Med | Med | 85 |
| 11 | Sponsored/featured venue slot | New ad revenue | Direct | Med | 84 |
| 12 | Persistent chat input on all pages | Retention (DESIGN.MD rule) | Med | Low | 83 |
| 13 | Surgical itinerary edit ("change Day 1 only") | iMean's best pattern | Med | Med | 82 |
| 14 | Mobile bottom-sheet polish (SCREEN-018) | Mobile is the majority surface | High | Med | 82 |
| 15 | Context chips synced to last tool result | AI-native feel | Low | Low | 80 |
| 16 | Trips itinerary panel (copy Mindtrip/Wanderlog) | Biggest design opportunity | Med | High | 79 |
| 17 | Per-day distance/time on cards (Wanderlog) | Planning utility | Med | Med | 78 |
| 18 | Creator program (local seeds itineraries) | Acquisition flywheel | High | High | 77 |
| 19 | Group/collaborative trip board | Mindtrip share-board | Med | High | 75 |
| 20 | WCAG 2.1 AA pass (SCREEN-020) | Launch gate | Low | Med | 74 |
| 21 | Programmatic city/venue SEO pages | Durable acquisition (Wanderlog) | High | Med | 73 |
| 22 | Broker leads inbox + AI-drafted replies | Rental monetization | High | High | 72 |
| 23 | Real-time price/availability on event cards | Trust + conversion | Med | Med | 71 |
| 24 | Cross-session memory surfacing ("last time you liked…") | F13 advantage made visible | Med | Med | 70 |
| 25 | Nightlife detail `/nightlife/[slug]` | Complete the vertical | Med | Med | 68 |
| 26 | Cafes full browse (fork restaurant) | Close SHELL gap | Low | Low | 67 |
| 27 | Saved → trip conversion flow | Planning loop | Med | Med | 66 |
| 28 | Receipt-forward email import (Mindtrip) | Itinerary enrichment | Low | Med | 64 |
| 29 | Map neighborhood auto-zoom on query | Already a DESIGN.MD rule | Med | Low | 63 |
| 30 | Multi-intent routing polish (rentals+dining one thread) | Concierge depth | Med | Med | 62 |
| 31 | Host analytics (sales, views) | Roberto Pro upsell | Direct | Med | 61 |
| 32 | Trust strip on `/` (venue count, grounded badge) | Conversion | Med | Low | 60 |
| 33 | Tour/experience affiliate booking | New revenue | Direct | Med | 59 |
| 34 | Preference "equalizer" dials (RoutePerfect) | Fast rec tuning | Low | Med | 57 |
| 35 | Calendar-conflict awareness (Stardrift) | Smart planning | Low | High | 55 |
| 36 | Onboarding wizard (preferences/neighborhood) | Personalization seed | Med | Med | 54 |
| 37 | Light-mode parity QA | Polish | Low | Low | 52 |
| 38 | Reviews on detail panels (Google/curated) | Social proof | Med | Med | 51 |
| 39 | "Reality-check" honesty layer (EasyTripAI) | Differentiation/trust | Low | Med | 50 |
| 40 | Push/in-app notifications | Re-engagement | Med | High | 48 |
| 41 | Itinerary PDF export (Wonderplan/Wanderlog) | Offline utility | Low | Low | 47 |
| 42 | Multi-destination route map (Layla) | Trip visualization | Low | High | 45 |
| 43 | Native mobile app (Roam/Layla advantage) | Retention | High | V.High | 44 |
| 44 | Admin ops dashboard (Patricia, W8) | Internal efficiency | Low | High | 42 |
| 45 | Venue self-serve onboarding (`/partners`) | Supply growth | Med | High | 40 |
| 46 | WhatsApp transport (Phase 2) | Local-channel reach | High | V.High | 38 |
| 47 | Spanish localization (Phase 2) | Local TAM | High | High | 36 |
| 48 | AI memory view/edit (`/me/profile`) | Trust/control | Low | Med | 34 |
| 49 | Video-map / creator clips (Layla) | Engagement | Low | V.High | 30 |
| 50 | White-label/API B2B (Airial) | Long-tail revenue | Med | V.High | 28 |

### Top 25 UX Improvements

| # | Improvement | User benefit | Example | Priority |
|---|-------------|--------------|---------|----------|
| 1 | Card hover → pin bounce sync | Spatial understanding | Mindtrip | P0 |
| 2 | Never a blank panel (skeleton/empty) | No dead-ends | Wanderlog | P0 |
| 3 | Persistent chat input everywhere | Continuous concierge | Mindtrip | P0 |
| 4 | One-gesture save (like-to-pin) | Frictionless collect | Mindtrip | P0 |
| 5 | Surgical itinerary edits | Control without redo | iMean | P1 |
| 6 | Context chips reflect last result | Orientation | Layla | P1 |
| 7 | Map auto-zoom to neighborhood | Relevance | Mindtrip | P1 |
| 8 | Distance-from-lodging on cards | Decision aid | Wanderlog | P1 |
| 9 | Mobile bottom-sheet snap states | Thumb-reachable | Mindtrip | P0 |
| 10 | Price-tier pin labels on map | Scan affordability | Mindtrip | P1 |
| 11 | No paywall mid-generation | Trust | (anti-iMean) | P1 |
| 12 | Inline booking (no app-switch) | Conversion | Mindtrip | P1 |
| 13 | Trust strip on landing | Credibility | TripPlanner | P2 |
| 14 | Collaborative trip board | Group planning | Mindtrip | P2 |
| 15 | "Start Anywhere" paste-to-plan | Magic first touch | Mindtrip | P1 |
| 16 | Preference dials | Fast tuning | RoutePerfect | P2 |
| 17 | Memory surfacing ("last time…") | Personalization | (your F13) | P1 |
| 18 | Reduced-motion compliance | Accessibility | guideline | P1 |
| 19 | Consistent card unit everywhere | Familiarity | Mindtrip | P1 |
| 20 | Detail panel = full-page on mobile | Readability | DESIGN.MD | P1 |
| 21 | Retry on errors (aria-live) | Recovery | DESIGN.MD | P1 |
| 22 | Multi-intent in one thread | Concierge feel | Layla | P2 |
| 23 | Receipt/email import | Effort removal | Mindtrip | P3 |
| 24 | PDF/offline itinerary | Travel utility | Wanderlog | P3 |
| 25 | Honest "reality" notes | Trust edge | EasyTripAI | P3 |

### Top 25 Visual Improvements

| # | Improvement | Benefit | Example |
|---|-------------|---------|---------|
| 1 | Real photo hero on every card | Premium identity | Airbnb Exp. |
| 2 | Editorial whitespace in cards | Less cramped | Mindtrip |
| 3 | Consistent vertical map glyphs | Scannability | (your DESIGN.MD) |
| 4 | Lean into dark city-night theme | Distinctiveness | (your edge) |
| 5 | Photo strip on detail panels | Richness | Airbnb |
| 6 | Skeleton loaders everywhere | Perceived speed | Wanderlog |
| 7 | AI-reason italic styling | AI-native voice | Mindtrip |
| 8 | Amber accent discipline (CTA only) | Hierarchy | (your tokens) |
| 9 | Rounded photo cards + soft shadow | Modern feel | Mindtrip |
| 10 | Rating+review density line | Trust | Airbnb |
| 11 | Map chrome that feels native | Premium | Google Maps |
| 12 | Smooth pin-bounce micro-motion | Delight | Mindtrip |
| 13 | Gradient/category photo fallback | No empty boxes | DESIGN.MD |
| 14 | Mono price tiers | Legibility | (your spec) |
| 15 | Trust logos strip | Credibility | TripPlanner |
| 16 | Light-mode parity | Choice | Wanderlog |
| 17 | Stagger card-in animation | Polish | Mindtrip |
| 18 | Neighborhood chips styling | Local flavor | Layla |
| 19 | Sticky detail CTA bar | Action clarity | Airbnb |
| 20 | Consistent iconography set | Cohesion | Mindtrip |
| 21 | Photo-forward hero on `/` | First impression | Mindtrip |
| 22 | Save-state heart animation | Feedback | Airbnb |
| 23 | Toast confirmations (Sonner) | Reassurance | — |
| 24 | Map cluster styling | Clarity at zoom | Wanderlog |
| 25 | Empty-state illustration per vertical | Warmth | Layla |

### Top 25 AI Improvements

| # | Improvement | Revenue impact | Retention impact |
|---|-------------|:---:|:---:|
| 1 | Living chat→map→card sync | High | High |
| 2 | Cross-session memory surfacing (F13) | Med | High |
| 3 | "Start Anywhere" ingestion | High | High |
| 4 | Surgical itinerary edits | Med | High |
| 5 | Hyper-local grounding (Supabase+Google) | High | High |
| 6 | Multi-intent routing (rental+dining+event) | Med | High |
| 7 | Per-card AI intent reason | Med | Med |
| 8 | Proactive constraint detection (veg/budget) | Med | Med |
| 9 | Calendar-conflict awareness | Low | Med |
| 10 | Confident decisive recs (beat Mindtrip's hedging) | High | High |
| 11 | Social-link→itinerary | High | Med |
| 12 | HITL approval for host publish (have it) | Med | Med |
| 13 | Real-time availability checks | High | Med |
| 14 | Personalized neighborhood defaults | Med | High |
| 15 | "Why not" transparency on rejections | Low | Med |
| 16 | Follow-up question quality | Low | High |
| 17 | Grounded fallback for new venues | Med | Med |
| 18 | Itinerary auto-optimize (route) | Med | Med |
| 19 | Tone = confident local expert | Low | High |
| 20 | Receipt parsing → enrich plan | Low | Med |
| 21 | Budget-aware filtering (no leaks) | Med | Med |
| 22 | Concierge memory of dislikes | Low | High |
| 23 | Voice intake (Phase 2 WhatsApp) | Med | Med |
| 24 | Group consensus suggestions | Low | Med |
| 25 | Reality-check honesty notes | Low | Med |

### Top 25 Map Improvements

| # | Feature | Benefit | Inspiration |
|---|---------|---------|-------------|
| 1 | Real-time pin render from chat | Spatial sync | Mindtrip |
| 2 | Hover card → pin bounce | Connection | Mindtrip |
| 3 | Click pin → card scroll+highlight | Bidirectional | Mindtrip |
| 4 | Per-vertical pin glyphs | Instant type ID | DESIGN.MD |
| 5 | Price-tier pin labels | Affordability scan | Mindtrip |
| 6 | Neighborhood auto-zoom | Relevance | Mindtrip |
| 7 | Pin clustering at zoom-out | Clarity | Wanderlog |
| 8 | Per-day distance/time lines | Planning | Wanderlog |
| 9 | Route optimization re-sequence | Efficiency | Wanderlog |
| 10 | Push-to-Google-Maps directions | Real navigation | Wanderlog |
| 11 | Map as mobile full-bleed base | Mobile-first | DESIGN.MD |
| 12 | Multi-stop route map | Trip viz | Layla |
| 13 | Hotel/rental position triage | Location pick | Mindtrip |
| 14 | FieldMask discipline (cost) | Margin | (your rule) |
| 15 | mapId on every Map | Advanced markers | (your rule) |
| 16 | Pin skeletons while loading | Perceived speed | DESIGN.MD |
| 17 | Active-pin expanded label | Focus | DESIGN.MD |
| 18 | Saved-places layer toggle | Collections on map | Mindtrip |
| 19 | Safety/quality overlay | Trust (optional) | EasyTripAI |
| 20 | Day-color-coded pins | Itinerary days | Wanderlog |
| 21 | Photo-thumbnail pins (premium) | Visual richness | Mindtrip |
| 22 | Drag itinerary → map updates | Direct manip | Wanderlog |
| 23 | "Explore nearby" from pin | Discovery | Google Maps |
| 24 | Map↔detail panel split (50/50) | Context keep | DESIGN.MD |
| 25 | Smooth zoom transitions | Polish | Maps SDK |

---

## Part 11 — mdeai Competitive Advantage

| Capability | Mindtrip | Layla | Airial | RoutePerfect | **mdeai** |
|------------|:---:|:---:|:---:|:---:|:---:|
| Events (ticketing) | ✗ | ◑ affiliate | ✗ | ✗ | ✅ **Stripe commerce** |
| Rentals | ✗ | ✗ | ✗ | ✗ | ✅ **native + leads** |
| Restaurants | ◑ Google | ◑ | ◑ | ✗ | ✅ **curated + grounded** |
| Cafes | ✗ | ✗ | ✗ | ✗ | ✅ vertical |
| Nightlife | ✗ | ✗ | ✗ | ✗ | ✅ **vertical (live)** |
| Trips/itinerary | ✅ | ✅ | ✅ | ✅ | ⚠️ SHELL (build) |
| Maps | ✅ best | ◑ | ✗ | ◑ | ✅ **specced to match** |
| AI Concierge | ✅ | ✅ | ✅ | ◑ | ✅ Mastra/CopilotKit |
| WhatsApp | ✗ | ✗ | ✗ | ✗ | 💫 **Phase 2 moat** |
| Cross-session memory | ◑ | ◑ | ◑ | ✗ | ✅ **F13 persistent** |
| Hyper-local depth | ✗ (global) | ✗ | ✗ | ✗ | ✅ **Medellín-only** |
| Host/supply side | ✗ | ✗ | ◑ B2B | ✗ | ✅ **Roberto/broker** |

**Your structural moat = depth, not breadth.** Generalists (Mindtrip/Layla) can't match a single-city platform that owns nightlife + cafes + rentals + events + ticketing + WhatsApp + Spanish for *one* city. ChatGPT commoditizes "plan any trip"; it cannot replicate curated paisa-local supply + transactions. **That is the Wonderplan trap avoided.**

---

## Part 12 — Final Recommendation (ranked by ROI, highest → lowest)

### Top 10 Features to Build Next
| # | Feature | Score | ROI | Revenue | Complexity | Phase | Example |
|---|---------|----:|:---:|:---:|:---:|:---:|---|
| 1 | Fix `/rentals` cards | 99 | ★★★★★ | High | Low | MVP P0 | — |
| 2 | Checkout finalize e2e proof | 98 | ★★★★★ | Direct | Low | MVP P0 | Stripe |
| 3 | `/rentals/[id]` detail | 95 | ★★★★★ | High | Med | MVP P0 | Accommo parts |
| 4 | Deploy `/restaurants` | 94 | ★★★★★ | Med | Low | MVP P1 | — |
| 5 | Living map↔card sync | 93 | ★★★★★ | High | Med | MVP P1 | Mindtrip |
| 6 | `/host/events` list | 90 | ★★★★ | Med | Low | MVP P1 | — |
| 7 | Real card photos | 89 | ★★★★ | Med | Low | MVP P1 | Airbnb |
| 8 | Loading/error/empty states | 88 | ★★★★ | Med | Low | MVP P1 | Wanderlog |
| 9 | "Start Anywhere" ingestion | 86 | ★★★★ | High | Med | MVP P2 | Mindtrip |
| 10 | Like-to-pin saved | 85 | ★★★★ | Med | Med | MVP P2 | Mindtrip |

### Top 10 Revenue Opportunities
| # | Opportunity | Revenue | Complexity | Phase |
|---|-------------|:---:|:---:|:---:|
| 1 | Event ticketing take-rate (finish checkout) | Direct | Low | MVP |
| 2 | Sponsored/featured venue placement | Direct | Med | MVP+ |
| 3 | Rental broker lead commission | High | High | POST |
| 4 | Host Pro (analytics) | Direct | Med | POST |
| 5 | Tour/experience affiliate | Direct | Med | POST |
| 6 | Creator program flywheel | High | High | POST |
| 7 | Programmatic SEO → ad/affiliate | High | Med | P2 |
| 8 | WhatsApp concierge premium | High | V.High | P2 |
| 9 | Venue SaaS subscription | Med | High | P2 |
| 10 | White-label/API (DMOs) | Med | V.High | P2 |

### Top 10 UX · Design · AI · Conversion (consolidated, highest ROI)
| Rank | UX | Design | AI Agent | Conversion |
|---|---|---|---|---|
| 1 | Map↔card sync | Real photos | Living sync | Finish checkout (revenue=0 until) |
| 2 | No blank panels | Card whitespace | Memory surfacing | Trust strip on `/` |
| 3 | Persistent chat | Vertical glyphs | Start-Anywhere | Inline booking |
| 4 | Like-to-pin | Dark-theme lean-in | Surgical edits | No mid-gen paywall |
| 5 | Surgical edits | Detail photo strip | Local grounding | Single dominant CTA |
| 6 | Context chips | Skeletons | Multi-intent | Social proof line |
| 7 | Map auto-zoom | AI-reason italic | Decisive recs | Mobile sheet polish |
| 8 | Distance on cards | Amber discipline | Availability checks | Save→return loop |
| 9 | Mobile snap states | Rounded+shadow | Constraint detect | Programmatic SEO |
| 10 | Price-tier pins | Trust logos | Calendar-aware | Creator referrals |

---

## Closing — If I Were Your CTO + Head of Product

**Green flags 🟢:** Your DESIGN.MD is more premium and more AI-native than every competitor's *and* every template audited; you've already benchmarked Mindtrip and stolen the right patterns; your stack (Stripe commerce + curated supply + WhatsApp + memory) gives a structural moat generalists can't match; strong guardrail/hook discipline.

**Yellow flags 🟡:** Claude Design is a metered research preview — useful, not dependable. Trips/itinerary is your biggest *unbuilt* design opportunity. No trust signals on `/` yet. Monetization beyond ticketing is all POST.

**Red flags 🔴:** **Four North-Star surfaces are unfinished** (`/rentals` broken, `/rentals/[id]` missing, checkout finalize unproven, `/restaurants` undeployed). Auditing directory templates risks a redesign detour away from these. Don't.

**The one-sentence verdict:** *Your design strategy is already correct and ahead of the field — stop evaluating templates, finish the four broken North-Star surfaces, ship the living-map sync you've already specced, and your single-city depth will beat every generalist in this audit on everything except global breadth (which you don't want).*

**Top 20 Action Items (do in order):**
1. Fix `/rentals` cards (Camila sees nothing).
2. Prove checkout→finalize e2e (Andrés can't pay).
3. Build `/rentals/[id]` (harvest Accommo anatomy).
4. Deploy `/restaurants` (kill the prod 404).
5. Ship living map↔card hover/click sync.
6. Build `/host/events` (Roberto's blind spot).
7. Real photos on every card via Places proxy.
8. Loading/error/empty states (SCREEN-019).
9. Add a trust strip to `/`.
10. "Start Anywhere" paste-to-plan ingestion.
11. Like-to-pin → saved collections.
12. Sponsored-venue placement (first new revenue).
13. Mobile bottom-sheet polish (SCREEN-018).
14. WCAG 2.1 AA pass (SCREEN-020) via Cowork audit.
15. Trips itinerary panel (copy Mindtrip/Wanderlog).
16. Adopt the workflow: Claude Design → Claude Code + shadcn → Figma MCP (reference only).
17. **Ban** directory-template IA + Figma-as-source-of-truth + Cursor.
18. Surgical itinerary edits (iMean pattern).
19. Programmatic Medellín SEO pages (Phase 2 acquisition).
20. Scope the creator-program flywheel (Phase 2 growth).

---

Both audits are complete and grounded in your actual `sitemap.md`, `DESIGN.MD`, and stack. **Want me to save this as `docs/audits/2026-06-04-design-stack-and-competitive-audit.md`** so it's referenceable, and/or **turn the Top-20 action items into Linear issues** under your Phase-1 MVP initiative? I held off on both since you asked for the analysis, not file/issue creation.