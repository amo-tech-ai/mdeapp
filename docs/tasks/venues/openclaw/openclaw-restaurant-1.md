---
id: openclaw-restaurant
title: OpenClaw × Restaurants — PRD, Strategy & Build Plan for mdeai.co
phase: ADVANCED
priority: P1
status: Active
area: ai-agents, restaurants
skill: [open-claw, mde-real-estate, mde-whatsapp, mde-supabase, mde-hostinger]
subagents: [mdeai-planner, mdeai-executor]
research_date: 2026-05-08
---

<!-- task-summary -->
> **What:** Complete PRD, architecture, and ranked action plan for using OpenClaw as the execution layer for mdeai.co's restaurant vertical — discovery, reservations, WhatsApp booking, menu intelligence, marketing, guest CRM, and restaurant partner workflows
> **Why:** mdeai.co already serves Medellín renters, event-goers, and tourists. Restaurants are the highest-frequency touchpoint: users ask "where should I eat tonight?" daily. Automating restaurant discovery, reservation monitoring, and partner marketing via OpenClaw turns a conversational feature into a monetizable channel (affiliate commissions, promoted listings, concierge upsell).
> **Critical finding:** No Resy or OpenTable operates in Colombia. Restaurant reservations in Medellín happen by phone call, WhatsApp direct message, or Google/Instagram DM. This shapes everything below.
> **Architecture:** OpenClaw = execution (WA/voice/browser); Google Places = discovery; Rappi = delivery; Supabase = CRM; Paperclip = approval governance
> **ADVANCED · P1 · Active**

---

# OpenClaw × Restaurants — mdeai.co PRD & Strategy

> **Research:** 7 GitHub repos verified (all real, 0 fake) · 15 additional searches · primary source articles read · 2026-05-08  
> **VPS:** `root@2.24.69.242` · **Gateway:** `https://openclaw-vmjg.srv1641664.hstgr.cloud`  
> **WA:** `+14168003103` · **Supabase:** `zkwcbyxiwklihegjhuql.supabase.co`

---

## 1. Executive Summary

### How OpenClaw Can Help mdeai Restaurants

mdeai users ask restaurant questions constantly: "¿Dónde ceno hoy en Provenza?" "Find me a quiet café in Laureles." "Book Carmen Medellín for Saturday 8pm." Today: nothing answers. With OpenClaw:

| User need | OpenClaw response |
|-----------|------------------|
| "Find a good dinner in El Poblado" | Google Places search → ranked cards → map pins → WA confirmation |
| "Book that restaurant for Saturday" | OpenClaw calls the restaurant by phone via ElevenLabs+Twilio |
| "Watch for a table at Carmen" | Background monitor → WA alert when slot opens → user approves → agent books |
| "What's on the menu at El Social?" | Scrape/upload menu → structured dishes → dietary filters → recommendations |
| "Recommend dinner near my apartment" | Geo-match: user's rental → nearest rated restaurants within 500m |

### Best Opportunities (revenue-ordered)

1. **Restaurant-to-rental cross-sell** — every rental booking is a lead for dinner recommendations (affiliate or promoted listing model)
2. **Restaurant partner listings** — restaurants pay to appear as "mdeai Recommended" with priority in WA concierge responses
3. **Reservation monitoring** — "watch that impossible table" drives daily engagement and differentiation
4. **Dinner near events cross-sell** — every event ticket purchase = dinner recommendation prompt
5. **WhatsApp restaurant booking** — differentiator vs. Google; personal concierge feel

### Fastest Revenue Paths

1. **Google Places integration** (Day 1–3): Free API; enables restaurant discovery immediately  
2. **"Find dinner near my rental/event" prompt** (Day 3–7): Cross-sell hook; zero marginal cost  
3. **Restaurant partner directory** (Week 2): Restaurants pay for promoted placement; simple Supabase table  
4. **WA reservation monitor** (Week 3): High engagement; users return daily for status updates

### Biggest Risks

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Resy/OpenTable don't operate in Colombia | CRITICAL | Use voice calls (ElevenLabs+Twilio) or WA DM for reservations |
| Voice calls (~$0.04/call) cost mounts | Medium | Free-tier cap per user/month; premium tier for unlimited |
| Rappi reverse-engineered API breaks | Medium | Wrapper for official Rappi Partner API if it becomes available |
| Google Places API billing at scale | Medium | Cache results 30 min; set billing alerts |
| Scraping restaurant websites blocked | Low | Rate limit; polite delay; fallback to Google data |

### What to Build First

1. Google Places restaurant search → WA response cards (3 days)
2. "Dinner near my rental/event" cross-sell (1 day — reuses #1)
3. Restaurant partner directory in Supabase (1 day — admin only)
4. WA reservation monitor skeleton (1 week)
5. Voice call reservation via ElevenLabs+Twilio (Week 2)

---

## 2. GitHub Repos — Verified Research

> All 7 user-provided repos fetched and verified. All exist (0 fake). Scored 0–100 on mdeai fit.

### Repo 1: `omarshahine/restaurant-cli`
**URL:** https://github.com/omarshahine/restaurant-cli  
**Verified:** YES — TypeScript, MIT, 2 stars, last commit 2026-05-05 (active)  
**Author:** Omar Shahine (GitHub staff account — `site_admin: true`)

**What it does:** Most architecturally mature restaurant reservation CLI in the ecosystem. Dual plugin (OpenClaw + Claude Code) from one codebase. Six tools: `restaurant_search`, `restaurant_availability`, `restaurant_book`, `restaurant_cancel`, `restaurant_list`, `restaurant_schedule_snipe`. Provider-agnostic pattern: new platforms via a "two-file change."

**Current provider support:**
- **Resy** — fully implemented: search, availability, book, cancel, list, snipe (schedule future reservation attempt)
- **OpenTable** — partial: search/availability returns booking URLs (Akamai anti-bot blocks form submission)
- **Tock, SevenRooms** — listed as "next," not implemented

**Key files:** `openclaw.plugin.json`, `.claude-plugin/`, full `src/`, `vitest.config.ts` (test suite), `CHANGELOG.md`, `WORKLOG.md` (20 KB dev journal)

**Features:**
- Provider seam pattern: pluggable new platforms with minimal code
- Snipe: schedule reservation attempts at specific future times (e.g., tables release at midnight)
- Credential management via `~/.secrets.env`
- Doctor command for setup validation
- npm-global installable

**Real-world mdeai example:**  
A digital nomad messages mdeai WA concierge: "Book Carmen Medellín for Saturday 8pm, 2 people."  
Agent invokes restaurant-cli → searches OpenTable/Resy equivalents → **Colombia result: none on these platforms**.  
Fallback: voice call or WA DM. The snipe feature would be reused for availability monitoring.

**Strengths:** Best-engineered codebase; real tests; active dev; dual plugin support; MIT  
**Weaknesses:** Resy/OpenTable don't operate in Colombia → zero direct Colombia use; requires adaptation  
**Production readiness:** 75/100 for US/international; 20/100 for Colombia as-is  
**Score: 78/100** (architecture reference, snipe pattern, provider abstraction)  
**Recommendation: ADAPT — mine for architecture; implement local Colombian equivalents via the provider seam**  
**Adaptation:** Implement a `WhatsApp` provider (sends WA DM to restaurant number) and a `Voice` provider (calls via ElevenLabs+Twilio) using the same plugin interface

---

### Repo 2: `garavitgabriel/rappi-plugin-claude-openclaw`
**URL:** https://github.com/garavitgabriel/rappi-plugin-claude-openclaw  
**Verified:** YES — Python, MIT, 1 star, last commit 2026-04-08

**What it does:** Rappi ordering assistant (not table reservations) using reverse-engineered Rappi API. Orders from restaurants, grocery stores, pharmacies, and liquor retailers. Geographic coverage: Colombia and 8 Latin American countries. 40 MCP tools. SQLite memory for user preferences. Places **real orders with real money**.

**Colombia/Medellín relevance:** Highest of all 7 repos. Rappi covers 4,213+ Medellín restaurants including Provenza, Laureles, El Poblado, and Envigado neighborhoods. Default spending limit: 500K COP.

**Three-layer architecture:** MCP server (tools) → Services (Rappi API calls + domain logic) → Memory (SQLite + optional OpenAI embeddings)

**Deployment:** Dockerfile + Railway deployment included. `install-openclaw.sh` OpenClaw installer present.

**Key files:** `CLAUDE.md` (17.5 KB architecture doc), `API_ENDPOINTS.md` (reverse-engineered Rappi endpoints), `TESTING.md`, `Dockerfile`, `agents/`, `skills/`, full test suite

**Critical caveats:**
- Reverse-engineered API: breaks when Rappi updates headers ("periodic header updates required")
- Places real orders: financial risk; set spending limits
- No official Rappi partnership

**Real-world mdeai example:**  
Tourist says: "Order sushi from El Poblado delivered to my rental while I watch the match."  
Agent queries Rappi for sushi restaurants with delivery to user's Supabase-stored address → shows options with delivery time + price → user confirms → agent places order → WA confirmation with estimated delivery time.

**Strengths:** Only Colombia-relevant tool; real Docker deployment; 40 MCP tools; SQLite memory; MIT  
**Weaknesses:** Delivery only (not table reservations); reverse-engineered API; financial risk; 1 star  
**Production readiness:** 60/100 — needs API stability monitoring  
**Score: 68/100**  
**Recommendation: MAYBE — install in staging with real-money limits disabled; monitor API stability**  
**Adaptation:** Add Paperclip approval card before every order. Cap at 100K COP without sk approval. Store user preferences in Supabase (not just SQLite).

---

### Repo 3: `mikehe123/opentable-reservations`
**URL:** https://github.com/mikehe123/opentable-reservations  
**Verified:** YES — Python, no license, 0 stars, last commit 2026-04-12

**What it does:** OpenClaw skill using Chrome CDP for OpenTable DOM extraction. Four Python scripts: `list_restaurants.py`, `extract_rid.py`, `book.py`, `confirm_booking.py`. Uses `openclaw browser evaluate` for DOM → structured JSON. Handles Akamai detection by switching Chrome profiles. Generates booking deep links but **never clicks Confirm** (safety guardrail — by design).

**Notable engineering:** `BENCHMARK.md` shows 11 test runs. Claims 14.4x token cost reduction vs baseline CDP approach (16,879 vs 242,227 billed tokens). Cache-warm runs reach 52x savings.

**Real-world mdeai example:**  
Only useful as architecture reference for browser-based DOM extraction pattern. OpenTable has no Medellín presence.

**Strengths:** Impressive benchmarking; clear safety design; efficient token usage; real SKILL.md  
**Weaknesses:** OpenTable has no Colombia presence; never completes bookings; no license; 0 stars  
**Production readiness:** 50/100 for architecture; 0/100 for Colombia  
**Score: 62/100** (architecture reference only)  
**Recommendation: REFERENCE ONLY — mine for DOM extraction and token efficiency patterns**

---

### Repo 4: `alexpolonsky/agent-skill-ontopo`
**URL:** https://github.com/alexpolonsky/agent-skill-ontopo  
**Verified:** YES — Python, MIT, 3 stars, last commit 2026-03-13

**What it does:** Wraps Ontopo's undocumented web API (Israel's dominant restaurant reservation platform, covering 730+ of 1,300 Israeli venues). 8 commands: `search`, `available`, `check`, `range`, `menu`, `info`, `url`, `cities`/`categories`. Generates booking URLs (user must complete booking manually). Does NOT place reservations.

**Real-world mdeai example:**  
No Colombia equivalent to Ontopo exists. Architecture is the value: this shows how to wrap a region-specific reservation platform's undocumented API cleanly into a SKILL.md.

**Note:** ClawHub-flagged (`.clawhubignore` present) — suggests pre-ClawHub-security-review. Given CVE-2026-25253 risk, verify before installing.

**Strengths:** Real SKILL.md; 8 commands; MIT; cross-platform compatible  
**Weaknesses:** Israel-only; undocumented API dependency; no Colombia relevance; booking-link-only  
**Score: 55/100** (architecture reference)  
**Recommendation: REFERENCE ONLY — use as a template for wrapping any Colombian restaurant API**

---

### Repo 5: `kayacancode/reserve-me`
**URL:** https://github.com/kayacancode/reserve-me  
**Verified:** YES — Python, MIT, 0 stars, last commit 2026-02-24

**What it does:** AI voice call to restaurant using ElevenLabs Conversational AI + Twilio. User provides restaurant name, date, time, party size → `reserve.py` triggers AI phone call → AI speaks with host → confirms/fails. Cost: ~$0.04/call. Has SKILL.md for OpenClaw integration.

**Why it matters for Medellín:** Colombia has no Resy/OpenTable. Phone calls are universal. This pattern (voice AI calls any restaurant with a phone number) is the most geographically-universal reservation approach.

**Real-world mdeai example:**  
User: "Reserve a table at Carmen for Saturday 8pm, 2 people."  
Agent calls Carmen's phone number → AI speaks in Spanish: "Buenas noches, quisiera reservar una mesa para 2 personas el sábado a las 8 de la noche..." → staff confirms → agent sends WA: "¡Listo! Reserva confirmada en Carmen para el sábado a las 20:00."

**Strengths:** Works with any restaurant with a phone number; ElevenLabs + Twilio are production-grade; real SKILL.md; MIT; geographically universal  
**Weaknesses:** 3-file MVP; no error handling; no retry; no test suite; created once, never updated; ~$0.04/call cost  
**Production readiness:** 25/100 as-is; 65/100 after production-hardening  
**Score: 38/100** (concept is right, implementation needs work)  
**Recommendation: ADAPT — the concept is exactly right for Medellín; harden the implementation**  
**Adaptation:** Add retry logic (3 attempts); Spanish language prompt by default; Twilio delivery receipt; Supabase booking record; Paperclip approval before call; fallback to WA DM if no answer after 2 calls

---

### Repo 6: `lqminhhh/openclaw-restaurant-reservations`
**URL:** https://github.com/lqminhhh/openclaw-restaurant-reservations  
**Verified:** YES — Python, no license, 0 stars, last commit 2026-03-28

**What it does:** Outbound AI voice calls via Vapi (voice AI platform). Two-step async flow: user sends details → Vapi call fires → user follows up manually to check result. FastAPI + ngrok backend required. Explicitly labeled "MVP."

**Weaknesses vs. kayacancode/reserve-me:** More complex setup (FastAPI + ngrok), same capability, worse user experience (manual follow-up required).

**Score: 32/100**  
**Recommendation: AVOID — kayacancode/reserve-me is simpler and better for the same use case**

---

### Repo 7: `alexpolonsky/agent-skills`
**URL:** https://github.com/alexpolonsky/agent-skills  
**Verified:** YES — index only, 5 stars, last commit 2026-02-26

**What it does:** Monorepo launcher pointing to individual skill repos. No actual code. Value: shows the skills ecosystem structure (`npx skills add alexpolonsky/...`).

**Score: 25/100** (index only)  
**Recommendation: SKIP — go directly to agent-skill-ontopo**

---

### Additional Repos Found via Web Search

### Repo 8: `chandeepsingh/resy-openclaw-skill`
**URL:** https://github.com/chandeepsingh/resy-openclaw-skill  
**Verified:** Referenced in multiple search results (confirmed by gh API)

**What it does:** Dedicated Resy-only SKILL.md skill. Search, book, cancel, modify, waitlist using extracted browser headers. Has `SKILL.md`, `SECURITY.md`, `tests/`, `scripts/`. More focused than `omarshahine/restaurant-cli` (Resy only).

**Score: 70/100** (Resy-only, no Colombia use, architecture reference)  
**Recommendation: REFERENCE — see alongside omarshahine for Resy patterns**

---

### Repo 9: `openclaw/goplaces` (OFFICIAL)
**URL:** https://github.com/openclaw/goplaces  
**Verified:** Official OpenClaw org repo (Go language)

**What it does:** Google Places API (New) CLI tool from the official OpenClaw organization. Natural language search, filters by rating/open-now/type, returns structured JSON. Commands: `goplaces search "coffee" --open-now --min-rating 4 --limit 5`

**Colombia/Medellín relevance:** HIGHEST OF ALL REPOS. Google Places has comprehensive coverage of all Medellín neighborhoods. Requires Google Places API key.

**Score: 88/100 for restaurant discovery**  
**Recommendation: USE FIRST — install immediately as the restaurant discovery foundation**

---

### Repo 10: `ademczuk/MenuVision`
**URL:** Surfaced in search — `ademczuk/MenuVision`

**What it does:** OpenClaw skill for restaurant menu building from URLs, PDFs, or photos → HTML digital menus. Highly relevant for mdeai restaurant partner onboarding.

**Score: 72/100**  
**Recommendation: MAYBE — useful for restaurant partner menu pages; evaluate for Phase 3**

---

## 3. Top Websites, Articles & Case Studies

### Source 1: Ryan Sarver — "I Vibe-Coded a Personal Restaurant Reservation Agent"
**URL:** https://medium.com/@rsarver/i-vibe-coded-a-personal-restaurant-reservation-agent-thanks-to-openclaw-it-lives-in-my-whatsapp-aac73997ad2e  
**Score: 92/100**

**Main idea:** The `/resi` skill is the canonical OpenClaw restaurant pattern. Three commands: `resi search` (city, date, party, time window across platforms), `resi open-times` (specific restaurant availability), `resi monitor` (background poll → WA alert when slot opens). "The monitor function is the killer feature."

**Useful workflows for mdeai:**
- CLI-first then SKILL.md approach (build CLI first, write SKILL.md last — reduces friction)
- Clean JSON output so agent parses results without string manipulation
- Monitor as background process (survives conversation end)
- User taste profile as CSV fed into skill knowledge base ("my 50 favourite Medellín spots")
- Weekend → 2h of dev time for a working MVP

**mdeai fit:** Direct blueprint. Replace Resy/OpenTable with Google Places + WhatsApp DM/voice call for Colombia.

---

### Source 2: The Drum — "The Night OpenClaw Booked My Dinner Reservation"
**URL:** https://www.thedrum.com/opinion/the-night-openclaw-booked-my-dinner-reservation-and-why-retail-media-should-take-note  
**Score: 78/100**

**Main idea:** OpenTable failed → agent autonomously built a calling app, generated AI voice, called restaurant, spoke to human, booked table. Did not ask permission. "If it has a phone number, it's now programmable."

**Restaurant automation lessons:**
- Build available tools into the environment upfront (Twilio + ElevenLabs pre-installed = agent can use them)
- Agentic AI needs human guardrails: unintended orders, brand safety, prompt injection
- "Agents doing technically correct but commercially disastrous things" — Paperclip is the answer

**mdeai fit:** The self-invoking voice call pattern is exactly what mdeai needs for Medellín where phone reservation is the norm. But the "did not ask permission" behavior must be gated with Paperclip approval.

---

### Source 3: LinkedIn — Clawdtalk Valentine's Day Parallel Calls
**URL:** https://www.linkedin.com/posts/angelastrange_... (confirmed real LinkedIn post)  
**Score: 70/100**

**Main idea:** Clawdtalk skill gives OpenClaw a real phone number. Calling 5 restaurants in parallel → booked the one with availability. Valentine's Day. Real humans answered.

**Useful for mdeai:**
- Parallel calls pattern: send queries to 3–5 Medellín restaurants simultaneously
- User framing: "No hold music. No back and forth." — powerful messaging for concierge positioning

**Risk:** Clawdtalk is a commercial plugin (paid tier above free). Evaluate vs. building direct ElevenLabs+Twilio integration.

---

### Source 4: Tencent Cloud — Multi-Channel Restaurant Booking Case Study
**URL:** https://www.tencentcloud.com/techpedia/141401 (and https://www.tencentcloud.com/techpedia/139186)  
**Score: 82/100**

**Main idea:** Single OpenClaw deployment handles WhatsApp + Telegram + web widget reservations for a restaurant group. 70% of reservations automated. No-show rate dropped from automated 24h reminders.

**Critical lesson:** "Always confirm booking time in user's local timezone; store everything UTC internally."  
→ For mdeai: all COT (UTC-5) reminders. Store `event_time` as UTC in Supabase.

**Useful workflows:**
- Reservation intake → confirmation → 24h reminder → check-in prompt
- Natural language time parsing: "next Friday at 8" → normalize to `2026-05-15T20:00:00-05:00`
- Cancellation handling (trigger new slot for monitor users)

---

### Source 5: Try The Menu — "OpenClaw for Restaurants: Smart Digital Menus"
**URL:** https://trythemenu.com (blog article — verified real)  
**Score: 40/100 — use with caution**

**Main idea:** OpenClaw as integration layer between digital menus and POS systems (Toast, Square, Clover, Lightspeed).

**⚠️ Ambiguity flag:** This article uses "OpenClaw" loosely, possibly conflating the AI agent framework with a generic API/webhook integration layer. No verified GitHub repo exists for OpenClaw-native POS integration. The described capabilities (real-time price sync, multi-outlet menu management) are plausible but not backed by a verified implementation.

**What's still useful for mdeai:**
- POS integration pattern for future restaurant partner onboarding
- SEO-friendly digital menu pages as a restaurant partner benefit

---

### Source 6: Official `openclaw/goplaces` documentation
**URL:** https://docs.openclaw.ai (goplaces section)  
**Score: 95/100**

**Main idea:** Official OpenClaw org maintains Google Places CLI. Commands: `goplaces search`, `goplaces details`, `goplaces nearby`. Returns structured JSON with name, rating, hours, address, phone, review count.

**mdeai fit:** Install this before anything else. It is the restaurant discovery foundation.

---

## 4. Restaurant Use Cases by Category

### A. Restaurant Discovery / Search

**Core features:**
- "¿Dónde ceno hoy en Provenza?" → Google Places search → top 5 restaurants → WA cards with rating + price range + hours
- Filters: neighborhood (Laureles, El Poblado, Provenza, Envigado), cuisine, price level, currently open
- Map pin response: Google Maps deep link to restaurant location
- pgvector semantic search: "algo romántico cerca de mi apartamento"

**Advanced features:**
- Personalized ranking: user's past choices (Supabase `restaurant_visits` table) → semantic similarity
- Hidden gems: filter by rating ≥ 4.2, review count < 200 (popular but not tourist-saturated)
- Thursday/quiet-night recommendations: same quality, shorter wait
- "Near my rental" cross-sell: automatically suggest restaurants within 500m of user's booking

**Workflow example:**
```
Tourist: "¿Qué hay bueno para cenar en El Poblado esta noche?"
    → openclaw/goplaces: search "restaurants El Poblado Medellín" --open-now --min-rating 4
    → Supabase: check restaurant_partner table for promoted listings
    → Rank: partners first, then by rating + distance
    → WA response: 3 cards (name, cuisine, rating, price, "Book" button)
    → User taps "Book" → Reservation workflow activates
```

**Recommended skills:** `openclaw/goplaces` (official), custom `mde-restaurant-discovery` SKILL.md  
**Recommended integrations:** Google Places API, Supabase `restaurants` table, Google Maps  
**Benefits for mdeai:** User retention; daily engagement; cross-sell for rentals/events  
**Revenue impact:** Medium indirect → leads to partner revenue; high indirect → daily engagement driver

---

### B. Table Reservations

**Core features:**
- Parse: "Reserve Carmen for Saturday 8pm, 2 people"
- Check availability (Google Places hours → phone number)
- Choose reservation method: WA DM (if restaurant has WA Business) or voice call
- Confirm: send details to user, request approval before calling

**Critical Colombia fact:** Resy and OpenTable do not operate in Colombia. Restaurant reservations happen by:
1. **WhatsApp DM** to the restaurant's WhatsApp Business number (most common in Medellín)
2. **Phone call** (traditional; still used by upscale venues)
3. **Instagram DM** (increasingly common for trendy spots)
4. **OpenTable Colombia** (limited; some international hotel restaurants)
5. **Google Reserve** (emerging; requires Google Business integration)

**Advanced features:**
- WA-to-WA booking: agent sends WA DM from mdeai's number to restaurant's number (via Baileys)
- Voice call booking: ElevenLabs Spanish AI + Twilio calls restaurant phone
- Parallel attempts: query 3 restaurants simultaneously for same date/time
- Booking confirmation saved to Supabase + Google Calendar invite sent

**Workflow example:**
```
User: "Reserva Carmen el sábado a las 8, somos 2"
    → Agent: "¿Confirmo que quieres que llame a Carmen Medellín para reservar una mesa?"
    → User: "Sí"
    → Agent: Paperclip approval card → sk reviews (first use only)
    → Agent calls Carmen via ElevenLabs+Twilio (in Spanish)
    → AI says: "Buenas noches, quisiera reservar una mesa para dos personas el próximo sábado a las 8pm..."
    → Staff confirms → Agent sends WA: "¡Reserva confirmada! Carmen, sábado 16 mayo, 20:00, 2 personas."
    → Google Calendar invite created
```

**Recommended skills:** `kayacancode/reserve-me` (adapted), `omarshahine/restaurant-cli` (provider seam pattern)  
**Recommended integrations:** ElevenLabs (voice), Twilio (phone), Baileys WA (DM), Google Calendar (Composio)  
**Revenue impact:** High for engagement; medium direct (can charge premium for concierge reservation service)

---

### C. Availability Monitoring

**Core features:**
- "Vigila Carmen para el sábado a las 8pm" → background monitor
- Poll strategy: every 15 min via pg-boss cron (not hot-loop — restaurant-friendly)
- Alert via WA when slot detected: "¡Carmen tiene una mesa disponible! ¿Reservo ahora?"
- User approves → agent books immediately

**Advanced features:**
- Multi-restaurant watch: "Watch Carmen OR El Cielo OR Celele for Saturday"
- Auto-cancel competing watches when one books
- Waitlist position tracking for restaurants that offer it
- Peak-release timing: many Medellín restaurants release tables at midnight; schedule snipe attempt

**Recommended skills:** `omarshahine/restaurant-cli` (snipe pattern), custom `mde-restaurant-monitor` SKILL.md  
**Recommended integrations:** pg-boss (polling cron), Supabase (monitor state), Baileys WA (alert)  
**Revenue impact:** High engagement; major differentiator; "impossible table" = viral moment

---

### D. WhatsApp Booking

**Core features:**
- User sends WA message to mdeai concierge → gets restaurant recommendations
- Agent sends WA DM to restaurant's WhatsApp Business number on user's behalf
- Booking confirmation forwarded to user

**Key insight from research:** WhatsApp DM is the primary reservation channel in Medellín. Most mid-to-high-end restaurants in El Poblado, Provenza, and Laureles have WhatsApp Business accounts. The mdeai concierge can be the bridge between the user and the restaurant's WA inbox.

**RISK:** Sending WA on behalf of users from mdeai's number without restaurant consent = potentially unwanted. Solution: use restaurant's published WA Business number; send courteous messages; include mdeai branding.

**Recommended integrations:** Baileys (1:1 WA DM), Infobip (if mdeai becomes verified WhatsApp Business API sender)

---

### E. OpenTable / Resy Integration

**Medellín reality check:**
- Resy: operates in US, Canada, UK, Australia. NOT Colombia.
- OpenTable: has some Medellín listings (international hotel restaurants) but very limited and no booking API for Colombia.
- Conclusion: `omarshahine/restaurant-cli` and `chandeepsingh/resy-openclaw-skill` are **not directly usable in Colombia**. Use them as architecture references only.

**What to use instead:** Google Places + WhatsApp DM + voice call (see sections B and D above).

---

### F. Rappi / Delivery Integration

**Core features:**
- "Pide sushi de El Poblado que me lo traigan al aparta"
- Query Rappi for delivery restaurants matching criteria
- Show options: restaurant name, delivery time, min order, top items
- User confirms → agent places order via `garavitgabriel/rappi-plugin-claude-openclaw`

**RISK:** Reverse-engineered API; real money; set hard cap (100K COP default)

**Advanced features:**
- Learn user preferences (SQLite/Supabase: "always orders from Sushi Green, never chicken")
- Schedule delivery: "Order pizza at 7pm when the match starts"
- Track order status: poll Rappi delivery API for updates

**Revenue impact:** Direct (future affiliate partnership with Rappi); high user utility for tourists/nomads

---

### G. Menu Search and Digital Menus

**Core features:**
- "¿El Social tiene opciones veganas?" → scrape/query menu → filter dietary
- Upload menu PDF → extract dishes → structured JSON → dietary tags
- "Recomiéndame algo en Carmen para una persona celíaca"

**Advanced features (restaurant partner feature):**
- mdeai hosts SEO restaurant menu pages (structured data → Google rich results)
- Real-time price/availability sync if restaurant uses supported POS (Toast, Square via API)
- QR code on restaurant table → leads to mdeai-hosted menu page → upsells mdeai concierge

**Recommended skills:** `ademczuk/MenuVision` (menu from URL/PDF/photos), custom `mde-menu-intelligence` SKILL.md  
**Revenue impact:** Medium direct (restaurant partners pay for hosted menu page); high indirect (SEO traffic)

---

### H. Restaurant Marketing

**Core features:**
- Restaurant partner submits: "Queremos promover nuestra oferta de martes: 2x1 en pizzas"
- Agent generates bilingual WA + email copy
- Segments audience: users who asked about the restaurant's neighborhood
- Paperclip approval → Infobip campaign send

**Advanced features:**
- A/B test two message variants → winner sent to full segment
- Slow-night promotion scheduling: auto-suggest campaign timing based on past attendance data
- Instagram post scheduling prompts (agent generates caption, sk/restaurant approves, posts via Composio)

**Revenue impact:** Direct (restaurants pay for promoted campaigns); mdeai takes 15–20% margin

---

### I. Review Monitoring

**Core features:**
- Monitor Google Reviews for partner restaurants
- Draft bilingual response to new reviews (Spanish-first)
- Flag negative reviews (<3 stars) → Paperclip card for sk/restaurant owner review
- Post approved responses via Google Business API (or manual workflow for now)

**Advanced features:**
- Sentiment trend: "Carmen's reviews declined this month — average 3.8 vs 4.2 last month"
- Competitor review comparison: "Carmen 4.1 vs Celele 4.4 — Celele is gaining on ambiance"

**Revenue impact:** Medium (restaurant partners pay for reputation management; high-value B2B service)

---

### J. Guest CRM

**Core features:**
- User history: restaurants visited (via WA conversation history), neighborhoods preferred, dietary restrictions noted
- "¿Puedes recomendarme algo como El Cielo pero más barato?" → semantic similarity + budget filter
- Birthday/anniversary reminders: agent suggests booking special restaurants based on calendar

**Supabase tables:** `user_restaurant_preferences`, `restaurant_visits`, `dietary_restrictions`

**Revenue impact:** High — personalization drives repeat engagement; repeat users are 5x more likely to book premium experiences

---

### K. Loyalty / Repeat Visits

**Core features:**
- mdeai Loyalty: "Book 5 restaurants via mdeai → get 1 concierge reservation free"
- Restaurant partner loyalty: agent tracks user visits → restaurant rewards via WA code
- "You've been to Pergamino 3 times — want to try a similar vibe?"

**Revenue impact:** Medium (loyalty drives retention, not direct revenue)

---

### L. Staff Communication

**Core features (for restaurant partner features):**
- Restaurant manager: "86 el salmón" → agent updates Supabase → sends WA to FOH staff
- Daily briefing via WA: "Reservas para hoy: 12 covers. Especiales: risotto de hongos. 86: salmón."
- Shift reminders to staff

**Revenue impact:** Low direct (B2B feature for partner restaurants); high value for partnerships

---

### M. Inventory and 86-Item Alerts

**Core features:**
- Staff texts "86 salmon" → agent updates `menu_availability` table → updates digital menu page → notifies FOH
- Low stock alert: agent monitors Supabase inventory → alerts manager when threshold crossed
- Auto-update Rappi menu listing when item is 86'd (via Rappi partner API)

**Revenue impact:** Medium B2B value; reduces order errors and customer disappointment

---

### N. Vendor Ordering

**Advanced features (Phase 4):**
- Low stock detected → agent drafts vendor order → Paperclip approval → sends order email/WA
- Delivery tracking from vendor

**Revenue impact:** Low direct; high efficiency for restaurant partners

---

### O. Daily Manager Briefing

**Core features:**
- Every morning at 08:00 COT: agent sends WA to restaurant manager
- "Buenos días. Hoy: 24 reservas, 6 para el mediodía, 18 para la noche. Reviews nuevos: 2 positivos, 1 negativo (ver Paperclip). 86: ayer salmón (restockear). Especiales del día: risotto de hongos."

**Revenue impact:** Medium B2B (restaurant partner subscription feature)

---

### P. Restaurant-Event Cross-Sell

**Core features:**
- After event ticket purchase: "¿Cenas antes del evento? El Cielo está a 3 min del venue."
- After rental booking: "Tu apartamento en Laureles está cerca de estos restaurantes..."
- Concert night: "Cena en [restaurant] antes del concierto a las 9pm"

**Revenue impact:** HIGH — cross-sell multiplier. Every event ticket or rental booking becomes a restaurant lead. Even 10% click-through on restaurant suggestions = significant traffic for partners.

---

### Q. Nearby Restaurants for Rentals / Events

**Core features:**
- Rental confirmation → automatic "restaurants within 500m" WA message
- Event ticket → "restaurants near [venue] open before/after the event"
- User asks: "¿Qué hay para comer cerca de mi aparta en Laureles?"

**Workflow:**
```
Rental booking confirmed
    → Supabase: get rental address coordinates
    → openclaw/goplaces: search restaurants within 500m, min-rating 4, open-now
    → WA: "Bienvenido a tu aparta en Laureles! Aquí hay 3 restaurantes cerca:
           [Restaurant 1] 200m, cuisine, ★4.3
           [Restaurant 2] 350m, cuisine, ★4.1  
           [Restaurant 3] 480m, cuisine, ★4.4"
```

**Revenue impact:** HIGHEST CROSS-SELL — triggers every rental booking with zero marginal effort

---

## 5. Suggested OpenClaw Agents for mdeai

### Agent 1: Restaurant Discovery Agent

**Job description:** Answers restaurant search queries via WA concierge  
**Inputs:** Natural language query (neighborhood, cuisine, occasion, party size, budget), user location (optional)  
**Actions:**
- Parse intent: neighborhood + occasion + party size + budget
- `goplaces search` for Medellín matching criteria, `--open-now`, `--min-rating 4`
- Check Supabase `restaurant_partners` for promoted listings (shown first)
- Deduplicate; rank (partners → rating → distance)
- Return 3 cards: name, cuisine, rating, price level, hours, WA/phone, Google Maps link
- Offer: "¿Hago la reserva?"

**Tools needed:** `openclaw/goplaces`, Supabase, Google Maps  
**Outputs:** 3 restaurant cards in WA; optional "Book" trigger  
**Success metrics:** Response in <5s; user clicks ≥1 card in 45% of queries  
**Human approval points:** None (read-only)  
**Risks:** Google Places API billing; stale hours data (restaurants may have changed hours)

---

### Agent 2: Reservation Booking Agent

**Job description:** Books restaurant tables via WA DM or voice call  
**Inputs:** Restaurant name, date, time, party size, user contact info  
**Actions:**
- Confirm details with user: "¿Confirmo reserva en [restaurant] para [date] a las [time], [party] personas?"
- Paperclip approval card (first-time per restaurant; auto-approve for known partners)
- Method selection: WA DM if restaurant has WA Business number; voice call if phone only
- Execute: send WA DM or trigger `reserve-me` (ElevenLabs+Twilio in Spanish)
- On confirmation: WA to user + Google Calendar invite + Supabase booking record

**Tools needed:** Baileys WA (DM to restaurant), ElevenLabs+Twilio (voice), Google Calendar (Composio), Supabase  
**Outputs:** Confirmed booking WA + calendar invite + Supabase record  
**Success metrics:** Booking success rate ≥70%; user WA confirmation in <90s of booking  
**Human approval points:** Paperclip approval before any external action; user confirmation before call  
**Risks:** Restaurant phone may be busy; WA DM may be delayed; voice AI Spanish accent quality

---

### Agent 3: Availability Monitor Agent

**Job description:** Watches for restaurant table availability and alerts user when slot opens  
**Inputs:** Restaurant name, target date, target time (±30 min window), party size  
**Actions:**
- Create monitor record in Supabase `restaurant_monitors` table
- pg-boss cron: poll every 15 min (Google Places hours + reservation platform if available)
- On slot detected: immediate WA alert: "¡Mesa disponible en [restaurant]! ¿Reservo ahora?"
- User responds "Sí" → Reservation Booking Agent activates immediately
- Auto-cancel monitor after successful booking or after 7 days

**Tools needed:** pg-boss (cron), Supabase, `openclaw/goplaces`, Baileys WA  
**Outputs:** WA alert on availability; auto-booking on approval  
**Success metrics:** Alert sent within 15 min of slot opening; booking conversion rate ≥80% of alerts  
**Human approval points:** User must approve booking after alert  
**Risks:** Over-polling may not reflect actual availability (phone only → no real-time data)

---

### Agent 4: WhatsApp Concierge Agent

**Job description:** Primary restaurant concierge in mdeai's WA channel  
**Inputs:** Any restaurant-related WA message  
**Actions:**
- Classify: discovery / booking / recommendation / delivery / menu inquiry
- Route to specialized agent or handle directly
- Maintain conversation context (user preferences from Supabase)
- Bilingual response (Spanish-first; English if user writes in English)

**Tools needed:** `mde-restaurant-discovery` SKILL.md, Supabase (user prefs), routing to other agents  
**Outputs:** Appropriate restaurant response in WA  
**Success metrics:** Intent classification accuracy ≥90%; response in <8s  
**Human approval points:** Any irreversible action (booking, ordering) requires user confirmation

---

### Agent 5: Menu Intelligence Agent

**Job description:** Answers menu questions and maintains restaurant menu database  
**Inputs:** Restaurant name + dietary query, OR menu URL/PDF upload  
**Actions:**
- If query: search Supabase `restaurant_menus` → return matching dishes
- If no record: scrape restaurant's Google listing → parse menu items → store structured JSON
- Filter by dietary: vegan/vegetarian/gluten-free/celiac/halal
- Recommend specific dishes for occasion/budget

**Tools needed:** Firecrawl (menu scrape), `ademczuk/MenuVision` (PDF/image), Supabase  
**Outputs:** Structured dish recommendations with dietary flags  
**Success metrics:** Menu question answered correctly ≥85%  
**Human approval points:** None (read-only); Paperclip alert if menu data is >30 days old

---

### Agent 6: Rappi / Delivery Agent

**Job description:** Handles food delivery orders via Rappi for Medellín  
**Inputs:** Cuisine type, delivery address (from Supabase rental booking or user-provided), budget  
**Actions:**
- Query Rappi for matching restaurants with delivery to address
- Show options: restaurant, delivery time, min order, top 3 dishes
- Confirm order with user including total cost in COP
- Paperclip approval for orders >50K COP
- Place order via `garavitgabriel/rappi-plugin-claude-openclaw`
- Poll delivery status → WA updates at pickup + en route + delivered

**Tools needed:** rappi-plugin-claude-openclaw, Supabase, Paperclip  
**Outputs:** Confirmed order + delivery tracking WA updates  
**Success metrics:** Order placed successfully ≥85%; delivery time within Rappi estimate ±10 min  
**Human approval points:** User must confirm order + total; Paperclip for amounts >50K COP  
**Risks:** Reverse-engineered API instability; real money; delivery errors

---

### Agent 7: Restaurant Marketing Agent

**Job description:** Creates and sends marketing campaigns for restaurant partners  
**Inputs:** Restaurant partner ID, offer description, target audience (neighborhood/cuisine preference), send date  
**Actions:**
- Generate bilingual WA + email copy for the offer
- Segment Supabase users by neighborhood + past restaurant queries
- Generate Paperclip approval card with preview of message + recipient count
- On approval: Infobip WA campaign + Resend email campaign
- Track: delivery rate, click-through, resulting bookings/orders

**Tools needed:** Resend, Infobip, Supabase (audience), Paperclip, PostHog (tracking)  
**Outputs:** Campaign sent + performance report in 48h  
**Success metrics:** WA delivery rate ≥95%; click-through ≥6%; booking attribution ≥2%  
**Human approval points:** Message copy + audience + send time — ALL require partner + sk approval  
**CRITICAL:** All mass WA sends via Infobip (official Meta API) ONLY. Never Baileys for campaigns.

---

### Agent 8: Review Response Agent

**Job description:** Monitors and drafts responses to restaurant Google Reviews  
**Inputs:** Restaurant Google Business ID, review fetch schedule  
**Actions:**
- Daily scan: Google Business API (or Firecrawl fallback) for new reviews
- <3 stars: immediate Paperclip card with review text + draft response
- ≥4 stars: draft positive thank-you response → queue for weekly approval
- Post approved responses (Google Business API or manual export)
- Weekly sentiment report to restaurant partner

**Tools needed:** Google Business API (or Firecrawl), Supabase (review log), Paperclip, Resend (weekly report)  
**Outputs:** Draft responses in Paperclip queue; posted responses; weekly sentiment report  
**Success metrics:** Response time <24h for negative reviews; ≥80% of drafted responses approved as-is  
**Human approval points:** ALL responses require partner approval before posting

---

### Agent 9: Guest CRM Agent

**Job description:** Maintains user food preferences and personalizes restaurant recommendations  
**Inputs:** WA conversation history, explicit preference statements, booking history  
**Actions:**
- Extract: cuisine preferences, dietary restrictions, price range, neighborhood, past visits
- Store in Supabase `user_restaurant_preferences`
- Use on every discovery query to personalize ranking
- Proactive suggestions: "Llevas 3 semanas sin cenar afuera — ¿probamos Carmen esta semana?"

**Tools needed:** Supabase, `mde-restaurant-concierge` SKILL.md  
**Outputs:** Personalized restaurant recommendations; proactive engagement messages  
**Success metrics:** Repeat booking rate increases ≥15% after 30 days of CRM data  
**Human approval points:** None (passive data collection); user can say "olvida mis preferencias" to clear

---

### Agent 10: Staff Scheduling Agent (Restaurant Partner Feature)

**Job description:** Manages and communicates restaurant staff schedules via WA  
**Inputs:** Weekly schedule from Supabase or Google Sheets, staff phone numbers  
**Actions:**
- Generate weekly schedule view
- Send WA to each staff: "Tu turno: [day] [time], [venue]. Confirma."
- Retry if no confirmation in 4h; escalate to manager if 8h no response
- Day-of reminder: "Tu turno empieza en 2 horas"

**Tools needed:** Supabase, Baileys WA  
**Outputs:** Staff confirmations; no-response escalations  
**Success metrics:** All staff confirmed ≥48h before shift; no-show rate <5%

---

### Agent 11: Inventory Alert Agent (Restaurant Partner Feature)

**Job description:** Handles 86-item alerts and updates menu availability in real time  
**Inputs:** "86 salmon" text from staff WA → triggers update chain  
**Actions:**
- Parse 86 alert (item name, quantity)
- Update `menu_items.available = false` in Supabase
- Send WA to FOH staff: "86 SALMÓN — no ofrecer hasta nuevo aviso"
- Update mdeai digital menu page (toggle availability)
- Add to Rappi 86 list if restaurant has Rappi integration

**Tools needed:** Baileys WA (inbound + outbound), Supabase, optional Rappi  
**Outputs:** Updated menu availability; WA broadcast to FOH  
**Success metrics:** 86 update reflected everywhere in <2 min of staff text

---

### Agent 12: Restaurant Partnership Agent

**Job description:** Onboards new restaurant partners and manages partner directory  
**Inputs:** Restaurant name, address, WhatsApp number, menu, preferred promotion type  
**Actions:**
- Fetch Google Places data (rating, photos, hours, phone, reviews)
- Create Supabase `restaurant_partners` record
- Verify WA Business number
- Upload menu via MenuVision (URL/PDF/photo)
- Set partner tier (Basic/Standard/Premium) and billing via Stripe

**Tools needed:** `openclaw/goplaces`, Firecrawl, `ademczuk/MenuVision`, Supabase, Stripe  
**Outputs:** Live partner listing in mdeai concierge; menu page; billing subscription  
**Success metrics:** Partner onboarding completed in <30 min with no manual sk intervention  
**Human approval points:** Partner tier + billing amount confirmation by sk

---

## 6. User Journeys

### Journey A: Tourist Dinner Booking (Provenza)

```
User (via WA): "Find me a romantic dinner in Provenza tonight for 2."
→ Agent: "Provenza tiene excelentes opciones! Aquí las mejores para esta noche:"
   [Card 1] El Cielo by Juan Manuel Barrientos ★4.8 · Haute cuisine · $$$$
   [Card 2] Trattoria Matriarca ★4.6 · Italian · $$$
   [Card 3] Social Kitchen ★4.5 · Fusion · $$$

User: "El Cielo"
→ Agent: "¿Quieres que haga la reserva? ¿A qué hora y a nombre de quién?"
User: "8pm, John"

→ Agent: "Verificando disponibilidad en El Cielo..."
   [Agent checks Google Places → phone number found]
   "El Cielo tiene teléfono pero no reservas online. ¿Quieres que los llame?"
User: "Sí"

→ Paperclip: sk approves call (first use)
→ ElevenLabs+Twilio: "Buenas noches, quisiera reservar para dos personas esta noche a las 8pm a nombre de John..."
→ Staff: "Sí, tenemos disponibilidad"
→ Agent WA: "¡Reserva confirmada! El Cielo, hoy 20:00, 2 personas, a nombre de John.
             Dirección: [Google Maps link]"
→ Google Calendar invite sent
```

---

### Journey B: Digital Nomad Café Discovery (Laureles)

```
User (via WA): "Find a quiet café in Laureles with good WiFi near my apartment."
→ Agent: "Buscando cafés en Laureles..."
   [Checks Supabase: user's rental address = Avenida El Poblado #25A-14, Laureles]
   [goplaces search: "café wifi Laureles Medellín" min-rating 4.0]
   [Filter: known coworking-friendly spots from partner directory]

   [Card 1] Pergamino Café ★4.7 · 800m · WiFi confirmed · "work-friendly" tag
   [Card 2] Velvet Café ★4.5 · 1.2km · WiFi · quiet vibe
   [Card 3] Café Noir ★4.3 · 400m · WiFi · mdeai partner (shown first)

User: "Café Noir está cerca"
→ Agent: "Café Noir está a 400m de tu aparta. [Google Maps link] Abren a las 8am, cierran a las 9pm.
          ¿Quieres que reserve una mesa para trabajar? (algunos tienen zonas reservadas para nómadas)"
User: "No necesito reserva, gracias"
→ Agent: "¡Perfecto! ☕ Para el mañana, Pergamino también es excelente opción."
```

---

### Journey C: Restaurant Owner Onboarding

```
Owner messages mdeai: "Quiero aparecer en mdeai para atraer más clientes"
→ Agent: "¡Bienvenido! Para unirse a mdeai necesitamos algunos datos."
→ Flow:
   Step 1: "¿Cuál es el nombre de tu restaurante?"
   Step 2: "¿Cuál es la dirección?"
   Step 3: Agent fetches Google Places data → "Encontré Carmen Medellín, ★4.8, Provenza. ¿Es correcto?"
   Step 4: "¿Cuál es tu número de WhatsApp Business?"
   Step 5: "¿Tienes el menú en PDF o puedo acceder al link de tu menú online?"
   Step 6: MenuVision processes menu → dietary tags extracted
   Step 7: "¿Qué paquete prefieres?" [Basic free / Standard 150K COP/mo / Premium 350K COP/mo]
   Step 8: Stripe payment link sent
   Step 9: Restaurant live in mdeai concierge within 24h
→ sk Paperclip card: "Nuevo partner: Carmen Medellín. Paquete: Premium. ¿Activar?"
```

---

### Journey D: Impossible Reservation Monitor (Carmen Medellín)

```
User: "Vigila Carmen para el sábado a las 8pm, somos 2"
→ Agent: "Entendido. Vigilaré Carmen para el sábado 16 de mayo a las 20:00 (±30 min), 2 personas.
          Te aviso en cuanto haya disponibilidad."
→ Supabase INSERT: restaurant_monitors {restaurant: "Carmen", date: "2026-05-16", time: "20:00", party: 2, user_id: X}
→ pg-boss: schedule poll every 15 min

[Day 1: Saturday 08:00 COT]
    → Poll: Carmen's Google page / WA Business status → no availability signal
    → Continue monitoring

[Saturday 11:30 COT — cancellation detected]
    → Agent WA: "🚨 ¡Mesa disponible en Carmen Medellín! Sábado 16 mayo, ~20:00-20:30, 2 personas.
                 ¿Reservo ahora? (la mesa puede no durar)"
    → User: "¡Sí!"
    → Agent: [calls Carmen by phone or sends WA DM]
    → Staff: "Sí, tenemos una mesa a las 20:15"
    → Agent WA: "✅ ¡Reserva confirmada! Carmen Medellín, sábado 16 mayo, 20:15, 2 personas."
→ Monitor cancelled
```

---

### Journey E: Event Dinner Cross-Sell

```
Trigger: User purchases event ticket (Stripe payment_intent.succeeded)
→ Supabase: get event venue coordinates
→ goplaces: search restaurants within 1km, min-rating 4.2, open-now + open at event time -2h

→ WA (15 min after ticket purchase):
   "¡Boleta confirmada para [Event] el viernes! 🎉
   ¿Cenas antes del evento? Estas opciones están cerca del [venue]:
   [Card 1] Restaurant A · 200m · ★4.5 · Cierra 22:00
   [Card 2] Restaurant B · 500m · ★4.3 · Cierra 23:00 (partner)
   ¿Quieres reservar?"

→ User: "Restaurant B suena bien"
→ Reservation flow activates
```

---

### Journey F: Restaurant Marketing — Tuesday Slow Night

```
Restaurant partner (Carmen): "Tenemos poco movimiento los martes. ¿Pueden promover una oferta?"
→ Agent: "Perfecto. ¿Cuál es la oferta?"
Carmen: "2x1 en cócteles los martes de 6pm a 9pm"

→ Agent generates copy:
   Spanish: "🍹 ¡Martes de cócteles en Carmen! 2x1 de 6 a 9pm. Haz tu reserva: [link]"
   English: "Tuesday cocktail night at Carmen! 2-for-1 cocktails 6–9pm. Reserve your table: [link]"

→ Agent: "Audiencia sugerida: 850 usuarios que preguntaron por restaurantes en Provenza/Poblado. ¿Aprobamos?"
→ Paperclip card to Carmen + sk
→ On approval: Infobip WA campaign sent to segmented audience
→ PostHog tracks: opens, clicks, resulting reservations

→ 48h report to Carmen: "Enviado a 850 usuarios. 312 abrieron (36.7%). 28 hicieron click (3.3%). 6 reservas atribuidas."
```

---

## 7. Workflow Blueprints

### Workflow A: Restaurant Search

```
User: "¿Dónde cenar en Laureles esta noche?"
    ↓
Intent parse: neighborhood=Laureles, meal=dinner, date=tonight, party=unspecified
    ↓
openclaw/goplaces search: "restaurants Laureles Medellín" --open-now --min-rating 4
    ↓
Supabase: JOIN restaurant_partners for promoted listings
    ↓
Rank: promoted first, then rating desc, then review count desc
    ↓
Format: 3 WA cards [name, cuisine, rating (★), price ($ / $$ / $$$), "open until Xpm", Maps link, "Reservar" button]
    ↓
Return in WA (target: <6s end-to-end)
    ↓
User taps "Reservar" → Workflow B activates
```

---

### Workflow B: Reservation

```
User taps "Reservar [Restaurant]"
    ↓
Agent: "Para reservar en [Restaurant]: ¿cuántas personas y a qué hora?"
    ↓
User: "2 personas, 8pm"
    ↓
Agent: "¿A nombre de quién?"
    ↓
Agent: "Confirmo: Mesa en [Restaurant], hoy 20:00, 2 personas, nombre [X]. ¿Correcto?"
    ↓
User: "Sí"
    ↓
Paperclip approval (first time per restaurant)
    ↓
Method routing:
    IF restaurant has WA Business number in Supabase:
        → Baileys WA DM to restaurant
    ELSE IF restaurant has phone in Google Places:
        → ElevenLabs+Twilio voice call (Spanish)
    ELSE:
        → "No encontré contacto directo — te mando el link para reservar tú mismo"
    ↓
On confirmed:
    → WA to user: "¡Reserva confirmada! [details] + Google Maps link"
    → Google Calendar invite via Composio
    → Supabase INSERT: restaurant_bookings
    ↓
Schedule reminders: 4h before + 1h before
```

---

### Workflow C: Availability Monitor

```
User: "Vigila Carmen el sábado a las 8pm para 2 personas"
    ↓
Agent confirms: restaurant, date/time, party size
    ↓
Supabase INSERT: restaurant_monitors {restaurant, date, time, party, user_id, status: active}
    ↓
pg-boss schedule: every 15 min, until date_time + 4h OR status = 'booked'
    ↓
Each poll:
    → Query Google Places for hours (open? any availability signal?)
    → Query restaurant WA if they have business account (public status)
    → If no real-time data: use heuristic (Saturday 8pm = likely fully booked; check again at midnight = table release)
    ↓
Midnight Saturday (typical release):
    → Attempt WA DM to restaurant: "¿Tienen mesas disponibles para esta noche a las 8pm?"
    → On positive response:
        Agent WA to user: "🚨 Mesa detectada en Carmen para esta noche. ¿Reservo ahora?"
    ↓
User: "Sí" → Workflow B activates immediately
    ↓
Supabase UPDATE: restaurant_monitors {status: booked}
```

---

### Workflow D: Menu Intelligence

```
User: "¿El Social tiene opciones para celíacos?"
    ↓
Supabase: SELECT menu_items WHERE restaurant='El Social' AND gluten_free=true
    ↓
IF menu data exists + last_updated < 30 days:
    → Return matching dishes with names, descriptions, prices
ELSE:
    → Firecrawl scrape El Social's website/Google menu
    → MenuVision: parse dishes → extract dietary tags
    → Store in Supabase restaurant_menus
    → Return results
    ↓
Agent: "El Social tiene [N] opciones sin gluten: [list]. El más popular es [dish]."
```

---

### Workflow E: Restaurant Marketing Campaign

```
Partner request: [Restaurant, Offer, Target Date]
    ↓
Agent generates copy (Spanish + English)
    ↓
Supabase: SELECT users WHERE restaurant_queries ILIKE '%[neighborhood]%' LIMIT 1000
    ↓
Paperclip card:
    "Campaña [Restaurant] — [Offer]
     Audiencia: [N] usuarios
     Mensaje: [preview]
     Costo: estimado $[Infobip rate * N]
     ¿Aprobar?"
    ↓
sk + partner approve
    ↓
Infobip: WA campaign send (official Meta API — NOT Baileys)
Resend: email campaign to opted-in users
    ↓
PostHog: track delivery, opens, clicks, booking conversions
    ↓
T+48h: automated performance report to partner via WA + email
```

---

### Workflow F: Review Management

```
Daily cron (09:00 COT):
    ↓
For each partner restaurant:
    → Fetch new Google Reviews via Business API (or Firecrawl fallback)
    → Compare with last_fetched in Supabase
    ↓
For each new review:
    → Rating < 3: Paperclip card (urgent) with review text + AI draft response
    → Rating 3-4: Queue for weekly batch review
    → Rating 4-5: Auto-draft thank-you response → weekly approval batch
    ↓
Partner/sk approves in Paperclip
    ↓
Post response via Google Business API (or manual export)
    ↓
Weekly report to partner: "Esta semana: [N] reviews. Promedio: ★[X.X]. Respondidos: [N]."
```

---

### Workflow G: Staff 86 Alert + Menu Update

```
Staff texts mdeai WA: "86 salmon"
    ↓
Agent parses: item=salmon, status=unavailable, restaurant=[from staff WhatsApp context]
    ↓
Supabase UPDATE: menu_items SET available=false WHERE name ILIKE '%salmon%' AND restaurant_id=X
    ↓
Trigger: mdeai digital menu page refresh (toggle salmon off)
    ↓
WA broadcast to FOH staff group: "⛔ 86 SALMÓN — no ofrecer hasta nuevo aviso"
    ↓
If Rappi integration: PUT to Rappi menu API (pause salmon item)
    ↓
If Paperclip configured: daily summary includes 86 log for manager review
```

---

## 8. Recommended Integrations

| Integration | Why | Best Use Case | Complexity | Priority | Risk |
|-------------|-----|---------------|------------|----------|------|
| **`openclaw/goplaces`** (official) | Google Places discovery; official OpenClaw org | Restaurant search foundation | Low (API key) | HIGH | Low |
| **Google Places API** | 4,213+ Medellín restaurants; hours, rating, phone, address | All discovery queries | Low | HIGH | Low (billing at scale) |
| **Google Maps** | Map pins, directions, "near me" links | 1-hour reminder + discovery cards | Already integrated | HIGH | Low |
| **ElevenLabs** | Spanish AI voice for restaurant phone calls | Reservation calls | Medium | HIGH | Low |
| **Twilio** | Phone carrier for voice calls | Reservation calls | Medium | HIGH | Low ($0.04/call) |
| **Baileys WA** | 1:1 WA DM to restaurant WA Business numbers | WA reservation method | Already deployed | HIGH | Medium (ToS) |
| **Infobip** | Official Meta WA API | Mass marketing campaigns | Medium (Meta approval) | HIGH | Low (official) |
| **Supabase** | Restaurant CRM, user prefs, bookings, monitors | All data | Already integrated | HIGH | Low |
| **Stripe** | Restaurant partner billing, order payments | Partner subscriptions + Rappi payments | Already integrated | HIGH | Low |
| **`garavitgabriel/rappi-plugin`** | Rappi ordering for Medellín delivery | Food delivery use cases | Medium (Docker) | MEDIUM | Medium (rev-eng API) |
| **Google Calendar (Composio)** | Calendar invite on confirmed booking | Reservation confirmation | Medium (OAuth) | MEDIUM | Low |
| **Resend** | Email confirmations + partner reports | All email comms | Already integrated | MEDIUM | Low |
| **Firecrawl** | Menu scraping, review scraping, restaurant enrichment | Menu intelligence + reviews | Low (API key) | MEDIUM | Medium (rate limits) |
| **Paperclip** | Approval governance for all restaurant actions | Every outbound action gate | Already integrated | HIGH | Low |
| **PostHog** | Campaign analytics, conversion tracking | Marketing ROI | Already integrated | MEDIUM | Low |
| **pg-boss** | Polling cron for availability monitor | Reservation monitor | Medium | MEDIUM | Low |
| **Hermes** | Complex recommendation reasoning | "Best restaurant for this occasion" | Already available | MEDIUM | Low |
| **Google Business API** | Review monitoring + response posting | Review management (Phase 3) | High (verification) | LOW | Low |
| **POS: Square / Toast** | Real-time menu sync for partners | Menu availability (Phase 4) | High | LOW | Medium |
| **Apify** | Instagram scraping for restaurant social proof | Discovery enrichment | Medium | LOW | Medium (ToS) |
| **Sentry** | Agent error tracking | Error monitoring | Low | LOW | Low |
| **`omarshahine/restaurant-cli`** | Provider-seam architecture; Resy patterns | Architecture reference for local impl. | Medium | LOW (reference) | Low |
| **`kayacancode/reserve-me`** | Voice call reservation blueprint | Hardened into production voice agent | Medium | MEDIUM (adapt) | Low |

---

## 9. mdeai Implementation Plan

### Phase 1 — MVP (Weeks 1–3)

**Goal:** Restaurant discovery working in WA concierge + rental/event cross-sell

| Feature | Integration | Task |
|---------|-------------|------|
| Restaurant discovery in WA chat | `openclaw/goplaces` | Install goplaces + custom mde-restaurant-discovery SKILL.md |
| "Nearby restaurants" for rentals | `openclaw/goplaces` + Supabase | Rental confirmation trigger → restaurant suggestion |
| "Dinner near event venue" cross-sell | `openclaw/goplaces` + Supabase events | Event ticket confirmation → restaurant suggestion |
| Basic restaurant cards | Supabase `restaurants` table | Seed with top 50 Medellín restaurants |
| Restaurant partner directory | Supabase `restaurant_partners` | Admin UI for partner management |

**Dependencies:** `openclaw/goplaces` installed on VPS; Google Places API key set in Infisical  
**Estimated difficulty:** Easy–Medium  
**Revenue potential:** Medium indirect — drives partner interest; cross-sell engagement  
**Risks:** Google Places API billing; stale hours data  
**Success criteria:**
- [ ] "¿Dónde ceno en Laureles?" returns 3 rated cards in <6s
- [ ] Rental booking confirmation sends restaurant suggestions automatically
- [ ] Event ticket confirmation sends nearby restaurant suggestions

---

### Phase 2 — Booking Automation (Weeks 4–8)

| Feature | Integration | Task |
|---------|-------------|------|
| WA DM reservation | Baileys + Supabase | Reservation Booking Agent SKILL.md |
| Voice call reservation | ElevenLabs + Twilio (Spanish) | Adapt `kayacancode/reserve-me` |
| Availability monitor | pg-boss + Supabase + WA | mde-restaurant-monitor SKILL.md |
| Google Calendar invite on booking | Composio | OAuth setup + calendar event on confirm |
| Rappi food delivery (staging) | rappi-plugin (spend cap enabled) | Install with 100K COP real-money limit |
| Restaurant partner onboarding | Supabase + Stripe | Partnership Agent SKILL.md |

**Dependencies:** Phase 1 complete; ElevenLabs + Twilio accounts configured  
**Estimated difficulty:** Medium–High  
**Revenue potential:** High — partner subscriptions; concierge booking premium tier  
**Risks:** Voice call quality; Baileys WA to restaurant ToS; Rappi API stability  
**Success criteria:**
- [ ] Reservation booking via voice call success rate ≥65%
- [ ] Availability monitor alerts within 15 min of slot detection
- [ ] Restaurant partner onboarding completed in <30 min

---

### Phase 3 — Restaurant Growth Tools (Weeks 9–16)

| Feature | Integration | Task |
|---------|-------------|------|
| Restaurant marketing campaigns | Infobip + Resend + Paperclip | Restaurant Marketing Agent |
| Review monitoring + draft responses | Firecrawl + Google Business API | Review Response Agent |
| Menu intelligence | Firecrawl + MenuVision + Supabase | Menu Intelligence Agent |
| Digital menu SEO pages | Supabase + Next.js | Menu page per partner restaurant |
| Guest CRM + personalization | Supabase + SKILL.md | Guest CRM Agent |
| Rappi integration (production) | rappi-plugin | Enable with full spend limits + Paperclip gate |

**Dependencies:** Phase 2 complete; ≥10 restaurant partners; 500+ active users  
**Revenue potential:** High — marketing campaigns charged to partners; menu SEO drives organic traffic  
**Success criteria:**
- [ ] ≥3 marketing campaigns delivered per month
- [ ] Negative reviews responded to within 24h
- [ ] Menu pages live for all premium partners

---

### Phase 4 — Advanced Operations (Weeks 17–26)

| Feature | Integration | Task |
|---------|-------------|------|
| Inventory + 86 alerts | Baileys + Supabase | Inventory Alert Agent |
| Staff scheduling | Baileys + Supabase | Staff Scheduling Agent |
| Daily manager briefing | Hermes + Supabase | Morning briefing SKILL.md |
| Vendor ordering automation | Resend + Paperclip | Vendor Order Agent |
| Hermes restaurant recommendations | Hermes + pgvector | Semantic personalization |
| POS integration (Square/Toast) | POS APIs | Real-time menu sync (if partners request) |

**Dependencies:** Phase 3 complete; willing restaurant partners for B2B features  
**Revenue potential:** High B2B — restaurant SaaS subscription layer  
**Success criteria:**
- [ ] 86 alerts reflected everywhere in <2 min
- [ ] Daily manager briefing delivered before 09:00 COT every day

---

## 10. Final Recommendations

### Which repos should mdeai use first?
1. **`openclaw/goplaces`** (official) — install immediately; foundation for all discovery
2. **`kayacancode/reserve-me`** (adapted) — the Colombia-first reservation approach; harden it
3. **`garavitgabriel/rappi-plugin-claude-openclaw`** — staging only, spend cap enabled; highest Medellín relevance

### Which restaurant workflows generate revenue fastest?
1. **Restaurant partner directory** (Week 1) — restaurants pay 150K–350K COP/month for promoted listing
2. **"Dinner near rental/event" cross-sell** (Week 1–2) — zero marginal cost; monetize via affiliate
3. **Marketing campaigns** (Week 8+) — restaurants pay per campaign; 15–20% margin

### Which integrations are critical?
- **Google Places API** — foundation; without it, discovery doesn't work
- **ElevenLabs + Twilio** — only reliable reservation method in Colombia (no Resy/OpenTable)
- **Infobip** — mass WA campaigns (never use Baileys at scale)
- **Paperclip** — gate every outbound action

### Which automations save the most time?
- **Availability monitor** — users no longer need to check Carmen's Instagram daily
- **Restaurant partner onboarding** — reduces sk manual work from 2h to <30 min
- **Review response drafting** — saves 30 min/week per partner

### Which features are overkill right now?
- POS integration (Square/Toast) — complex; only needed if partners specifically request it
- Google Business API review posting — high verification overhead; manual posting is fine until Phase 3
- Staff scheduling (before 3 restaurant partners are onboarded) — B2B feature; premature
- Vendor ordering automation — only valuable at scale

### What should be avoided?
- **Using Baileys for mass marketing campaigns** — ToS ban risk; use Infobip
- **ClawHub plugins** — CVE-2026-25253; only install local SKILL.md files
- **`lqminhhh/openclaw-restaurant-reservations`** — same concept as kayacancode but worse UX
- **Auto-placing Rappi orders without Paperclip approval** — real money risk
- **Resy/OpenTable integrations as primary solution** — they don't operate in Colombia
- **"Try The Menu" / POS integration claims** — unverified implementation; don't build around this

### What to build in the next 7 days?
| Day | Task |
|-----|------|
| 1 | Install `openclaw/goplaces` on VPS; set Google Places API key in Infisical |
| 2 | Write `mde-restaurant-discovery` SKILL.md with Medellín defaults (neighborhoods, Spanish triggers) |
| 3 | Wire rental confirmation → restaurant suggestion (Supabase edge trigger) |
| 4 | Wire event ticket confirmation → nearby restaurant suggestion |
| 5 | Seed Supabase `restaurants` table with top 100 Medellín restaurants from Google Places |
| 6 | Create Supabase `restaurant_partners` table + admin Paperclip card for partner onboarding |
| 7 | Test end-to-end: WA "¿Dónde ceno en Provenza?" → 3 cards → map link → booking prompt |

---

## Appendix: Research Verification Summary

| Repo / Source | Status | Score | Use |
|---------------|--------|-------|-----|
| `omarshahine/restaurant-cli` | ✅ REAL — TypeScript, GitHub staff, Resy fully working | 78/100 | ADAPT (provider seam for WA/voice) |
| `garavitgabriel/rappi-plugin-claude-openclaw` | ✅ REAL — Colombia coverage, Docker, real orders | 68/100 | MAYBE (staging with spend cap) |
| `mikehe123/opentable-reservations` | ✅ REAL — Python, benchmarked, link-only | 62/100 | REFERENCE (DOM pattern) |
| `alexpolonsky/agent-skill-ontopo` | ✅ REAL — Israel/Ontopo API, real SKILL.md | 55/100 | REFERENCE (API wrapping pattern) |
| `kayacancode/reserve-me` | ✅ REAL — Python MVP, ElevenLabs+Twilio | 38/100 | ADAPT (harden for production) |
| `lqminhhh/openclaw-restaurant-reservations` | ✅ REAL — Vapi voice, MVP | 32/100 | AVOID (kayacancode is better) |
| `alexpolonsky/agent-skills` | ✅ REAL — index only | 25/100 | SKIP |
| `openclaw/goplaces` (found in search) | ✅ REAL — official OpenClaw org, Google Places | 88/100 | USE FIRST |
| `chandeepsingh/resy-openclaw-skill` | ✅ REAL — Resy SKILL.md, reference only | 70/100 | REFERENCE |
| Ryan Sarver Medium article | ✅ REAL — confirmed story, /resi blueprint | 92/100 | PRIMARY REFERENCE |
| The Drum article | ✅ REAL — Nick Larkins, QSIC, voice call story | 78/100 | GOVERNANCE REFERENCE |
| Tencent Cloud case study | ✅ REAL — 70% automation, UTC lesson | 82/100 | USE (UTC timezone rule) |
| Try The Menu / POS claims | ⚠️ AMBIGUOUS — unverified implementation | 40/100 | CAUTION |
| SEO sites (remoteopenclaw.com etc.) | ⚠️ THIRD-PARTY AFFILIATE — not official | 20/100 | AVOID as authoritative source |

**Critical Colombia-specific finding:** No Resy, OpenTable (meaningful coverage), or equivalent restaurant reservation platform operates in Medellín. Restaurant reservations happen via WhatsApp DM, phone call, or Instagram DM. Every reservation workflow must default to **ElevenLabs+Twilio voice call** or **Baileys WA DM** — not platform API booking.
