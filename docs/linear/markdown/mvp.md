# 🚀 MVP — Full Feature Tracker
> Phase 1 MVP Launch | Updated: 2026-06-08 (SAN-835–849 sync) | Cycle 1: Jun 8–22 2026

**Legend:** 🟢 Complete · 🟡 In Progress · ⚪ Not Started · 🔴 Failed/Canceled

> **Correct build order:** Foundation → Maps/Search → AI/Agents → Products → UX → Testing → Launch

---

## 🔐 Foundation
> 14 issues · 🟢 5 done · 🟡 1 WIP · ⚪ 8 not started · Score: **52/100 F**

| Status | ID | Title / Purpose | Tech | Priority | Score | Grade | Notes |
|--------|----|--------------------|------|----------|-------|-------|-------|
| 🟢 | [SAN-298](https://linear.app/sanjiovani/issue/SAN-298) | venue_booking_requests migration + RLS | Supabase RLS | Urgent | 100 | A+ | ✓ Jun 03 |
| 🟢 | [SAN-379](https://linear.app/sanjiovani/issue/SAN-379) | venue_signals polymorphic + seed (human QA top 30) | PostgreSQL | Urgent | 100 | A+ | ✓ Jun 03 |
| 🟢 | [SAN-367](https://linear.app/sanjiovani/issue/SAN-367) | Production auth checklist | Supabase Auth | High | 100 | A+ | ✓ Jun 06 |
| 🟢 | [SAN-585](https://linear.app/sanjiovani/issue/SAN-585) | Author events browse scr + wire on disk | Supabase Auth | High | 100 | A+ | ✓ Jun 05 |
| 🟢 | [SAN-586](https://linear.app/sanjiovani/issue/SAN-586) | Public published-events list API for /events brows… | PostgreSQL | High | 100 | A+ | ✓ Jun 06 |
| 🟡 | [SAN-338](https://linear.app/sanjiovani/issue/SAN-338) | Places backfill cron / edge job | PostgreSQL | High | 85 | B | 🗺️ Maps — Growth |
| ⚪ | [SAN-313](https://linear.app/sanjiovani/issue/SAN-313) | Venue booking RLS penetration tests | Supabase RLS | Urgent | 20 | F | Blocked: SAN-311 |
| ⚪ | [SAN-467](https://linear.app/sanjiovani/issue/SAN-467) | Supabase schema audit — rentals cluster | PostgreSQL | Urgent | 20 | F | 🏠 Rental Cards MVP |
| ⚪ | [SAN-547](https://linear.app/sanjiovani/issue/SAN-547) | JWT → Mastra RequestContext for tools | Supabase Auth | Urgent | 20 | F | — |
| ⚪ | [SAN-277](https://linear.app/sanjiovani/issue/SAN-277) | Itinerary tab hardening | Google Maps JS | High | 20 | F | Blocked: SAN-276 |
| ⚪ | [SAN-482](https://linear.app/sanjiovani/issue/SAN-482) | Playwright + RLS tests | Supabase RLS | High | 20 | F | 🔮 RE Browse & Detail |
| ⚪ | [SAN-492](https://linear.app/sanjiovani/issue/SAN-492) | Event venue + offerings schema | PostgreSQL | High | 20 | F | 🎟️ Events — MVP Gates |
| ⚪ | [SAN-545](https://linear.app/sanjiovani/issue/SAN-545) | Fix rental embed API 403 (hybrid search) | PostgreSQL | High | 20 | F | — |
| ⚪ | [SAN-527](https://linear.app/sanjiovani/issue/SAN-527) | Mobile auth stability (OAuth + deep links) | Supabase Auth | High | 10 | F | Blocked: SAN-529 |

## 🗺️ Maps & Search
> 53 issues · 🟢 11 done · 🟡 5 WIP · ⚪ 34 not started · Score: **40/100 F**

| Status | ID | Title / Purpose | Tech | Priority | Score | Grade | Notes |
|--------|----|--------------------|------|----------|-------|-------|-------|
| 🟢 | [SAN-294](https://linear.app/sanjiovani/issue/SAN-294) | Nightlife intent in search-grounded-places | Google Maps JS | Urgent | 100 | A+ | ✓ Jun 04 |
| 🟢 | [SAN-295](https://linear.app/sanjiovani/issue/SAN-295) | Grounded render café vs nightlife kind split | Google Maps JS | Urgent | 100 | A+ | ✓ Jun 03 |
| 🟢 | [SAN-296](https://linear.app/sanjiovani/issue/SAN-296) | NightlifeDetailPanel + mobile sheet | Google Maps JS | Urgent | 100 | A+ | ✓ Jun 03 |
| 🟢 | [SAN-297](https://linear.app/sanjiovani/issue/SAN-297) | Places cache and field-mask enforcement | Google Maps JS | Urgent | 100 | A+ | ✓ Jun 03 |
| 🟢 | [SAN-520](https://linear.app/sanjiovani/issue/SAN-520) | VEN-014b — Places detail retry guard | Google Maps JS | Urgent | 100 | A+ | ✓ Jun 02 |
| 🟢 | [SAN-605](https://linear.app/sanjiovani/issue/SAN-605) | Grounding-coverage Scorer | ADK + Cloud Run | Urgent | 100 | A+ | ✓ Jun 06 · 🛡️ AGT — Phase 0: Production Safety |
| 🟢 | [SAN-304](https://linear.app/sanjiovani/issue/SAN-304) | VenueBookingSheet + DB persist | Google Maps JS | High | 100 | A+ | ✓ Jun 02 |
| 🟢 | [SAN-307](https://linear.app/sanjiovani/issue/SAN-307) | Booking status chips on detail panels | Google Maps JS | High | 100 | A+ | ✓ Jun 03 |
| 🟢 | [SAN-369](https://linear.app/sanjiovani/issue/SAN-369) | Map ID on production | Google Maps JS | High | 100 | A+ | ✓ Jun 03 |
| 🟢 | [SAN-491](https://linear.app/sanjiovani/issue/SAN-491) | Nightlife Listings + Map | Google Maps JS | High | 100 | A+ | ✓ Jun 04 |
| 🟢 | [SAN-518](https://linear.app/sanjiovani/issue/SAN-518) | Events browse listing (/events) | Google Maps JS | Medium | 100 | A+ | ✓ Jun 06 |
| 🟡 | [SAN-386](https://linear.app/sanjiovani/issue/SAN-386) | Wire hybrid_search_listings + rental_signals | pgvector + Supabase | High | 85 | B | — |
| 🟡 | [SAN-387](https://linear.app/sanjiovani/issue/SAN-387) | Wire hybrid_search_events + event_signals | pgvector + Supabase | High | 85 | B | — |
| 🟡 | [SAN-111](https://linear.app/sanjiovani/issue/SAN-111) | Map exploration panel | Google Maps JS | Medium | 85 | B | Blocked: SAN-113 |
| 🟡 | [SAN-368](https://linear.app/sanjiovani/issue/SAN-368) | ADK grounding on production | Google Maps JS | High | 65 | D | — |
| 🟡 | [SAN-549](https://linear.app/sanjiovani/issue/SAN-549) | Wire conciergeAgent intent:nightlife for search-gr… | Google Maps JS | High | 65 | D | — |
| ⚪ | [SAN-273](https://linear.app/sanjiovani/issue/SAN-273) | Trips Supabase audit + evidence | Google Maps JS | Urgent | 20 | F | — |
| ⚪ | [SAN-274](https://linear.app/sanjiovani/issue/SAN-274) | Trips dashboard polish (SCREEN-012) | Google Maps JS | Urgent | 20 | F | Blocked: SAN-273 |
| ⚪ | [SAN-275](https://linear.app/sanjiovani/issue/SAN-275) | Create trip modal + server action | Google Maps JS | Urgent | 20 | F | Blocked: SAN-274 |
| ⚪ | [SAN-292](https://linear.app/sanjiovani/issue/SAN-292) | RestaurantResultCard + search-tool-renders | Google Maps JS | Urgent | 20 | F | — |
| ⚪ | [SAN-293](https://linear.app/sanjiovani/issue/SAN-293) | RestaurantDetailPanel + rental-ui-context | Google Maps JS | Urgent | 20 | F | Blocked: SAN-292 |
| ⚪ | [SAN-299](https://linear.app/sanjiovani/issue/SAN-299) | requestVenueBooking Mastra tool | Google Maps JS | Urgent | 20 | F | — |
| ⚪ | [SAN-300](https://linear.app/sanjiovani/issue/SAN-300) | VenueBookingSheet component | Google Maps JS | Urgent | 20 | F | — |
| ⚪ | [SAN-301](https://linear.app/sanjiovani/issue/SAN-301) | mastra-tool-action-names booking keys | Google Maps JS | Urgent | 20 | F | Blocked: SAN-299 |
| ⚪ | [SAN-303](https://linear.app/sanjiovani/issue/SAN-303) | Tool and CopilotKit action registry CI test | Google Maps JS | Urgent | 20 | F | Blocked: SAN-302, SAN-301 |
| ⚪ | [SAN-305](https://linear.app/sanjiovani/issue/SAN-305) | Venue booking idempotency and duplicate prevention | Google Maps JS | Urgent | 20 | F | Blocked: SAN-299 |
| ⚪ | [SAN-306](https://linear.app/sanjiovani/issue/SAN-306) | Booking retry and optimistic UI recovery | Google Maps JS | Urgent | 20 | F | Blocked: SAN-305, SAN-302, SAN-300 |
| ⚪ | [SAN-308](https://linear.app/sanjiovani/issue/SAN-308) | draftVenueWhatsApp Mastra tool | Google Maps JS | Urgent | 20 | F | Blocked: SAN-299 |
| ⚪ | [SAN-309](https://linear.app/sanjiovani/issue/SAN-309) | WhatsApp consent and suppression list | Google Maps JS | Urgent | 20 | F | Blocked: SAN-308 |
| ⚪ | [SAN-312](https://linear.app/sanjiovani/issue/SAN-312) | Admin audit log for approval and send actions | Google Maps JS | Urgent | 20 | F | Blocked: SAN-309, SAN-311, SAN-310 |
| ⚪ | [SAN-469](https://linear.app/sanjiovani/issue/SAN-469) | Rental search indexes (price_daily) | Next.js 16 + Tailwind v4 | Urgent | 20 | F | 🏠 Rental Cards MVP |
| 🔴 | [SAN-470](https://linear.app/sanjiovani/issue/SAN-470) | Rental search indexes (dup REAL-003) | Next.js 16 + Tailwind v4 | Urgent | 0 | F | Dup: SAN-469 ✅ |
| ⚪ | [SAN-776](https://linear.app/sanjiovani/issue/SAN-776) | MAP-005 — FieldMask enforcement + places cache audit | Google Maps JS | High | 20 | F | MAP-005 slice · maps.md |
| ⚪ | [SAN-788](https://linear.app/sanjiovani/issue/SAN-788) | MAP-008B — CI Map ID env guard + Vercel check | Google Maps JS | High | 20 | F | MAP-008B slice · maps.md |
| ⚪ | [SAN-104](https://linear.app/sanjiovani/issue/SAN-104) | Place autocomplete for Roberto host venue | Google Maps JS | High | 20 | F | 🗺️ Maps — P1 Hardening |
| ⚪ | [SAN-278](https://linear.app/sanjiovani/issue/SAN-278) | Saved collections page (SCREEN-011) | Google Maps JS | High | 20 | F | Blocked: SAN-277 |
| ⚪ | [SAN-280](https://linear.app/sanjiovani/issue/SAN-280) | Trip map Google pins tab | Google Maps JS | High | 20 | F | Blocked: SAN-277 · 🧳 Trips — MVP |
| ⚪ | [SAN-281](https://linear.app/sanjiovani/issue/SAN-281) | Conflict detection persist + CopilotKit HITL | Google Maps JS | High | 20 | F | Blocked: SAN-277 |
| ⚪ | [SAN-310](https://linear.app/sanjiovani/issue/SAN-310) | WhatsApp approval + wa_outbox | Google Maps JS | High | 20 | F | Blocked: SAN-309, SAN-308 |
| ⚪ | [SAN-323](https://linear.app/sanjiovani/issue/SAN-323) | Clear stale AdvancedMarker DOM after empty search | Google Maps JS | High | 20 | F | — |
| ⚪ | [SAN-443](https://linear.app/sanjiovani/issue/SAN-443) | Retire orphaned GroundedPlaceCard and dead groundi… | ADK + Cloud Run | High | 20 | F | — |
| ⚪ | [SAN-472](https://linear.app/sanjiovani/issue/SAN-472) | Map pin sync with rental cards | Google Maps JS | High | 20 | F | 🏠 Rental Cards MVP |
| ⚪ | [SAN-486](https://linear.app/sanjiovani/issue/SAN-486) | Rental search availability + date filters | Next.js 16 + Tailwind v4 | High | 20 | F | 🏠 Rental Cards MVP |
| ⚪ | [SAN-497](https://linear.app/sanjiovani/issue/SAN-497) | eventVenueAgent + search/rank tools | Gemini 3.5 Flash | High | 20 | F | 🎟️ Events — Polish |
| ⚪ | [SAN-824](https://linear.app/sanjiovani/issue/SAN-824) | Events: pin coverage via upstream coords + geocode… | Google Maps JS | High | 20 | F | Blocked: SAN-828 |
| ⚪ | [SAN-825](https://linear.app/sanjiovani/issue/SAN-825) | Restaurants: measure placeholders, warm cache if n… | Google Maps JS | Low | 20 | F | Blocked: SAN-827 |
| ⚪ | [SAN-826](https://linear.app/sanjiovani/issue/SAN-826) | Cafés: Place ID audit + graceful booking degrade (… | Google Maps JS | Low | 20 | F | Blocked: SAN-825 |
| ⚪ | [SAN-524](https://linear.app/sanjiovani/issue/SAN-524) | Mobile map interaction system | Google Maps JS | Urgent | 10 | F | Blocked: SAN-530, SAN-528 |
| ⚪ | [SAN-311](https://linear.app/sanjiovani/issue/SAN-311) | Admin booking queue (/admin/bookings) | Google Maps JS | High | 10 | F | Blocked: SAN-310 |
| ⚪ | [SAN-606](https://linear.app/sanjiovani/issue/SAN-606) | Grounding-assertion output processor | ADK + Cloud Run | High | 10 | F | Blocked: SAN-592 · 🔧 AGT — Phase 1: Core Reliability |
| ⚪ | [SAN-627](https://linear.app/sanjiovani/issue/SAN-627) | Search Logs Source Attribution + Unified Search La… | Mastra + LibSQL | High | 10 | F | 🔧 AGT — Phase 1: Core Reliability |
| ⚪ | [SAN-519](https://linear.app/sanjiovani/issue/SAN-519) | Cafes browse listing (/cafes) | Google Maps JS | Medium | 10 | F | — |
| 🔴 | [SAN-463](https://linear.app/sanjiovani/issue/SAN-463) | Production ADK sidecar — Cloud Run + Vercel env | Google Maps JS | Urgent | 0 | F | Dup: SAN-368 · 🗺️ Maps — P1 Hardening |
| 🔴 | [SAN-464](https://linear.app/sanjiovani/issue/SAN-464) | Vercel Map ID + API key restriction verify | Google Maps JS | Urgent | 0 | F | Dup: SAN-369 · 🗺️ Maps — P1 Hardening |
| 🔴 | [SAN-558](https://linear.app/sanjiovani/issue/SAN-558) | Cafés page → live (listings + detail + map) | Google Maps JS | High | 0 | F | Dup: SAN-519 |

## 🤖 AI & Intelligence
> 34 issues · 🟢 3 done · 🟡 1 WIP · ⚪ 29 not started · Score: **23/100 F**

| Status | ID | Title / Purpose | Tech | Priority | Score | Grade | Notes |
|--------|----|--------------------|------|----------|-------|-------|-------|
| 🟢 | [SAN-589](https://linear.app/sanjiovani/issue/SAN-589) | Mastra Telemetry & AI Tracing | Mastra + LibSQL | Urgent | 100 | A+ | ✓ Jun 06 · 🛡️ AGT — Phase 0: Production Safety |
| 🟢 | [SAN-590](https://linear.app/sanjiovani/issue/SAN-590) | Hallucination / Faithfulness Scorer | Mastra + LibSQL | Urgent | 100 | A+ | ✓ Jun 06 · 🛡️ AGT — Phase 0: Production Safety |
| 🟢 | [SAN-591](https://linear.app/sanjiovani/issue/SAN-591) | Runtime Agent Allowlist | Mastra + LibSQL | High | 100 | A+ | ✓ Jun 06 · 🛡️ AGT — Phase 0: Production Safety |
| 🟡 | [SAN-521](https://linear.app/sanjiovani/issue/SAN-521) | CopilotKit v1 mobile best practices | CopilotKit 1.55.2 | Urgent | 65 | D | — |
| ⚪ | [SAN-302](https://linear.app/sanjiovani/issue/SAN-302) | requestVenueBooking CopilotKit action | CopilotKit 1.55.2 | Urgent | 20 | F | Blocked: SAN-301, SAN-300, SAN-299 |
| ⚪ | [SAN-406](https://linear.app/sanjiovani/issue/SAN-406) | Neighborhood clarify — not generic budget/dates re… | Google Maps JS | Urgent | 20 | F | Blocked: SAN-412, SAN-407 |
| ⚪ | [SAN-407](https://linear.app/sanjiovani/issue/SAN-407) | Remove canned rental clarify bypass before concier… | Gemini 3.5 Flash | Urgent | 20 | F | — |
| ⚪ | [SAN-484](https://linear.app/sanjiovani/issue/SAN-484) | Rental parser intelligence (dates, city, confidenc… | Vercel + Next.js | Urgent | 20 | F | 🏠 Rental Cards MVP |
| ⚪ | [SAN-485](https://linear.app/sanjiovani/issue/SAN-485) | Gemini rental clarify routing (stop canned bypass) | Gemini 3.5 Flash | Urgent | 20 | F | 🏠 Rental Cards MVP |
| ⚪ | [SAN-548](https://linear.app/sanjiovani/issue/SAN-548) | Thread persistence across Vercel cold-start | CopilotKit 1.55.2 | Urgent | 20 | F | — |
| ⚪ | [SAN-501](https://linear.app/sanjiovani/issue/SAN-501) | eventVenueBookingWorkflow | Mastra + LibSQL | High | 20 | F | Blocked: SAN-496 · 🎟️ Events — Polish |
| ⚪ | [SAN-848](https://linear.app/sanjiovani/issue/SAN-848) | Explain Results — AI reasoning cards for search | Gemini 3.5 Flash | High | 10 | F | Camila trust · rental cards first |
| ⚪ | [SAN-822](https://linear.app/sanjiovani/issue/SAN-822) | Concierge improvements sprint (post SAN-733) | CopilotKit 1.55.2 | High | 20 | F | — |
| ⚪ | [SAN-823](https://linear.app/sanjiovani/issue/SAN-823) | Rentals: pattern-based fast-path (neighborhood + i… | Google Maps JS | High | 20 | F | — |
| ⚪ | [SAN-828](https://linear.app/sanjiovani/issue/SAN-828) | CopilotKit: audit empty POST 401 vs 400 (order 2) | CopilotKit 1.55.2 | High | 20 | F | Blocked: SAN-823 |
| ⚪ | [SAN-522](https://linear.app/sanjiovani/issue/SAN-522) | Mobile chat composer + keyboard UX | CopilotKit 1.55.2 | Urgent | 10 | F | Blocked: SAN-530, SAN-529, SAN-528, SAN-526, SAN-525, SAN-523 |
| ⚪ | [SAN-588](https://linear.app/sanjiovani/issue/SAN-588) | Mastra Agent Feature Adoption (epic) | Mastra + LibSQL | Urgent | 10 | F | — |
| ⚪ | [SAN-592](https://linear.app/sanjiovani/issue/SAN-592) | Structured Output for evaluationAgent / scorer jud… | Mastra + LibSQL | High | 10 | F | 🔧 AGT — Phase 1: Core Reliability |
| ⚪ | [SAN-593](https://linear.app/sanjiovani/issue/SAN-593) | Input-processor coverage (hostEventAgent + Unicode… | Mastra + LibSQL | High | 10 | F | 🔧 AGT — Phase 1: Core Reliability |
| ⚪ | [SAN-594](https://linear.app/sanjiovani/issue/SAN-594) | ResponseCache + CostGuardProcessor | Mastra + LibSQL | High | 10 | F | 🔧 AGT — Phase 1: Core Reliability |
| ⚪ | [SAN-595](https://linear.app/sanjiovani/issue/SAN-595) | Native tool-approval (host publish + checkout) | Mastra + LibSQL | High | 10 | F | 🔧 AGT — Phase 1: Core Reliability |
| ⚪ | [SAN-766](https://linear.app/sanjiovani/issue/SAN-766) | AIE-013 [MVP] revenueForecastWorkflow + forecast c… | Mastra + LibSQL | High | 10 | F | Blocked: SAN-115, SAN-729 |
| ⚪ | [SAN-767](https://linear.app/sanjiovani/issue/SAN-767) | AIE-014 [MVP] attendeeAgent on /me/tickets | Gemini 3.5 Flash | High | 10 | F | Blocked: SAN-729 |
| ⚪ | [SAN-768](https://linear.app/sanjiovani/issue/SAN-768) | AIE-017 [MVP] Sponsor pipeline screens + sponsorAg… | Gemini 3.5 Flash | High | 10 | F | — |
| ⚪ | [SAN-770](https://linear.app/sanjiovani/issue/SAN-770) | AIE-016 [MVP] sponsorMatchWorkflow + fit scores | Mastra + LibSQL | High | 10 | F | Blocked: SAN-729 |
| ⚪ | [SAN-771](https://linear.app/sanjiovani/issue/SAN-771) | AIE-018 [MVP] crmLeadScoreWorkflow + /host/crm | Mastra + LibSQL | High | 10 | F | Blocked: SAN-768 |
| ⚪ | [SAN-775](https://linear.app/sanjiovani/issue/SAN-775) | AIE-022 [MVP] Global UX — ⌘K, FAB, pills, Copilot … | CopilotKit 1.55.2 | High | 10 | F | Blocked: SAN-729 |
| ⚪ | [SAN-596](https://linear.app/sanjiovani/issue/SAN-596) | System Prompt Scrubber (output processor) | Mastra + LibSQL | Medium | 10 | F | 🔧 AGT — Phase 1: Core Reliability |
| ⚪ | [SAN-598](https://linear.app/sanjiovani/issue/SAN-598) | PII protection (output PIIDetector) | Mastra + LibSQL | Medium | 10 | F | 🔧 AGT — Phase 1: Core Reliability |
| ⚪ | [SAN-611](https://linear.app/sanjiovani/issue/SAN-611) | Golden query evaluation suite | Mastra + LibSQL | Medium | 10 | F | 🔧 AGT — Phase 1: Core Reliability |
| ⚪ | [SAN-833](https://linear.app/sanjiovani/issue/SAN-833) | CoAgentsProvider + AvailableAgents enum for multi-… | Gemini 3.5 Flash | Medium | 10 | F | 🔧 AGT — Phase 1: Core Reliability |
| ⚪ | [SAN-834](https://linear.app/sanjiovani/issue/SAN-834) | Agent running status badge in consumer chat (useCo… | CopilotKit 1.55.2 | Low | 10 | F | Blocked: SAN-833 · 🔧 AGT — Phase 1: Core Reliability |
| 🔴 | [SAN-564](https://linear.app/sanjiovani/issue/SAN-564) | create_checkout transact tool (agents can book + p… | Mastra + LibSQL | Urgent | 0 | F | Dup: SAN-551 |

## 📅 Events Platform
> 29 issues · 🟢 1 done · 🟡 1 WIP · ⚪ 27 not started · Score: **21/100 F**

| Status | ID | Title / Purpose | Tech | Priority | Score | Grade | Notes |
|--------|----|--------------------|------|----------|-------|-------|-------|
| 🟢 | [SAN-118](https://linear.app/sanjiovani/issue/SAN-118) | Host events list page | Next.js 16 + Tailwind v4 | High | 100 | A+ | ✓ Jun 04 |
| 🟡 | [SAN-730](https://linear.app/sanjiovani/issue/SAN-730) | AIE-002 Host nav — enable Events link + shell | Next.js 16 + Tailwind v4 | High | 85 | B | `/host/events` LIVE · Analytics deferred |
| 🟡 | [SAN-135](https://linear.app/sanjiovani/issue/SAN-135) | AIE-024 [MVP] Luma event detail layout (EVP-032) | Next.js 16 + Tailwind v4 | High | 85 | B | Blocked: SAN-120 |
| ⚪ | [SAN-510](https://linear.app/sanjiovani/issue/SAN-510) | Wire: Event offerings panel + Event Venue CTA | Next.js 16 + Tailwind v4 | Urgent | 20 | F | 🎟️ Events — Polish |
| ⚪ | [SAN-511](https://linear.app/sanjiovani/issue/SAN-511) | Wire: Request proposal modal | Next.js 16 + Tailwind v4 | Urgent | 20 | F | 🎟️ Events — Polish |
| ⚪ | [SAN-279](https://linear.app/sanjiovani/issue/SAN-279) | Add-to-trip from rental/event cards | Next.js 16 + Tailwind v4 | High | 20 | F | Blocked: SAN-278 · 🧳 Trips — MVP |
| ⚪ | [SAN-438](https://linear.app/sanjiovani/issue/SAN-438) | Hover and focus → pin highlight on RentalCard and … | Google Maps JS | High | 20 | F | — |
| ⚪ | [SAN-493](https://linear.app/sanjiovani/issue/SAN-493) | Seed Mamacita + 5 event partners | Vercel + Next.js | High | 20 | F | 🎟️ Events — MVP Gates |
| ⚪ | [SAN-494](https://linear.app/sanjiovani/issue/SAN-494) | Restaurant card Event Venue CTA | Next.js 16 + Tailwind v4 | High | 20 | F | 🎟️ Events — Polish |
| ⚪ | [SAN-495](https://linear.app/sanjiovani/issue/SAN-495) | Event offerings detail panel | Next.js 16 + Tailwind v4 | High | 20 | F | Blocked: SAN-494 · 🎟️ Events — Polish |
| ⚪ | [SAN-496](https://linear.app/sanjiovani/issue/SAN-496) | Request proposal modal (HITL) | Next.js 16 + Tailwind v4 | High | 20 | F | Blocked: SAN-495 · 🎟️ Events — Polish |
| ⚪ | [SAN-498](https://linear.app/sanjiovani/issue/SAN-498) | AI venue match score panel | Next.js 16 + Tailwind v4 | High | 20 | F | Blocked: SAN-497 · 🎟️ Events — Polish |
| ⚪ | [SAN-499](https://linear.app/sanjiovani/issue/SAN-499) | Compare venues side-by-side | Next.js 16 + Tailwind v4 | High | 20 | F | Blocked: SAN-498 · 🎟️ Events — Polish |
| ⚪ | [SAN-500](https://linear.app/sanjiovani/issue/SAN-500) | Host wizard venue step (Roberto) | Next.js 16 + Tailwind v4 | High | 20 | F | Blocked: SAN-497 · 🎟️ Events — Polish |
| ⚪ | [SAN-502](https://linear.app/sanjiovani/issue/SAN-502) | Patricia admin queue (event requests) | Vercel + Next.js | High | 20 | F | Blocked: SAN-501 · 🎟️ Events — Polish |
| ⚪ | [SAN-503](https://linear.app/sanjiovani/issue/SAN-503) | Add confirmed booking to trip | Next.js 16 + Tailwind v4 | High | 20 | F | Blocked: SAN-501 · 🎟️ Events — Polish |
| ⚪ | [SAN-512](https://linear.app/sanjiovani/issue/SAN-512) | Wire: Venue match panel + compare | Next.js 16 + Tailwind v4 | High | 20 | F | 🎟️ Events — Polish |
| ⚪ | [SAN-513](https://linear.app/sanjiovani/issue/SAN-513) | Wire: Host wizard venue step | Next.js 16 + Tailwind v4 | High | 20 | F | 🎟️ Events — Polish |
| ⚪ | [SAN-514](https://linear.app/sanjiovani/issue/SAN-514) | Wire: Admin event booking queue | Next.js 16 + Tailwind v4 | High | 20 | F | 🎟️ Events — Polish |
| ⚪ | [SAN-731](https://linear.app/sanjiovani/issue/SAN-731) | Event detail loading skeleton + hero alt (a11y) | Next.js 16 + Tailwind v4 | High | 10 | F | — |
| ⚪ | [SAN-769](https://linear.app/sanjiovani/issue/SAN-769) | AIE-015 [MVP] Recommendations hub /recommendations | Next.js 16 + Tailwind v4 | High | 10 | F | Blocked: SAN-766 |
| ⚪ | [SAN-772](https://linear.app/sanjiovani/issue/SAN-772) | AIE-019 [MVP] Approvals + notifications + host inb… | Next.js 16 + Tailwind v4 | High | 10 | F | Blocked: SAN-758 |
| ⚪ | [SAN-773](https://linear.app/sanjiovani/issue/SAN-773) | AIE-020 [MVP] Host bookings /host/bookings | Next.js 16 + Tailwind v4 | High | 10 | F | Blocked: SAN-764 |
| ⚪ | [SAN-839](https://linear.app/sanjiovani/issue/SAN-839) | Event Health Score (tickets · views · CTR) | PostgreSQL | High | 10 | F | Server RPC 0–100 · Roberto |
| ⚪ | [SAN-840](https://linear.app/sanjiovani/issue/SAN-840) | Event Insights dashboard for hosts | Next.js 16 + Tailwind v4 | High | 10 | F | `/host/events/[slug]` panel |
| ⚪ | [SAN-841](https://linear.app/sanjiovani/issue/SAN-841) | Waitlist system for sold-out events | Next.js 16 + Tailwind v4 | Medium | 10 | F | Andrés lead capture |
| ⚪ | [SAN-774](https://linear.app/sanjiovani/issue/SAN-774) | AIE-021 [MVP] Event health dashboard | Next.js 16 + Tailwind v4 | High | 10 | F | UI shell · pairs SAN-839 RPC |
| ⚪ | [SAN-777](https://linear.app/sanjiovani/issue/SAN-777) | AIE-023 [MVP] Attendee inbox /inbox | Next.js 16 + Tailwind v4 | Medium | 10 | F | Blocked: SAN-772 |
| ⚪ | [SAN-778](https://linear.app/sanjiovani/issue/SAN-778) | AIE-025 [MVP] Admin dashboard + moderation | Next.js 16 + Tailwind v4 | Medium | 10 | F | Blocked: SAN-758 |
| ⚪ | [SAN-779](https://linear.app/sanjiovani/issue/SAN-779) | AIE-026 [MVP] Admin AI runs observability UI | Next.js 16 + Tailwind v4 | Medium | 10 | F | Blocked: SAN-704, SAN-758 |

## 🏠 Rentals
> 10 issues · 🟢 2 done · 🟡 2 WIP · ⚪ 6 not started · Score: **45/100 F**

| Status | ID | Title / Purpose | Tech | Priority | Score | Grade | Notes |
|--------|----|--------------------|------|----------|-------|-------|-------|
| 🟢 | [SAN-242](https://linear.app/sanjiovani/issue/SAN-242) | SCREEN-005 — Rental Card Polish + CTAs | Next.js 16 + Tailwind v4 | Urgent | 100 | A+ | ✓ May 28 |
| 🟢 | [SAN-478](https://linear.app/sanjiovani/issue/SAN-478) | Rental browse page (/rentals) | Next.js 16 + Tailwind v4 | Medium | 100 | A+ | ✓ Jun 08 |
| 🟡 | [SAN-471](https://linear.app/sanjiovani/issue/SAN-471) | Rental cards in chat (SCREEN-005) | Next.js 16 + Tailwind v4 | Urgent | 65 | D | 🏠 Rental Cards MVP |
| 🟡 | [SAN-473](https://linear.app/sanjiovani/issue/SAN-473) | Schedule viewing modal (SCREEN-008) | Next.js 16 + Tailwind v4 | Urgent | 65 | D | 🏠 Rental Cards MVP |
| ⚪ | [SAN-474](https://linear.app/sanjiovani/issue/SAN-474) | Lead capture edge proof (G2) | Next.js 16 + Supabase | Urgent | 20 | F | 🏠 Rental Cards MVP |
| ⚪ | [SAN-468](https://linear.app/sanjiovani/issue/SAN-468) | Apartment inventory quality | Next.js 16 + Tailwind v4 | High | 20 | F | 🏠 Rental Cards MVP |
| ⚪ | [SAN-475](https://linear.app/sanjiovani/issue/SAN-475) | Landlord inbox MVP | Next.js 16 + Tailwind v4 | High | 20 | F | 🏠 Rental Cards MVP |
| ⚪ | [SAN-476](https://linear.app/sanjiovani/issue/SAN-476) | Showing bridge (leads → showings) | Next.js 16 + Supabase | High | 20 | F | 🏠 Rental Cards MVP |
| ⚪ | [SAN-477](https://linear.app/sanjiovani/issue/SAN-477) | Saved + trips integration | Next.js 16 + Tailwind v4 | High | 20 | F | 🏠 Rental Cards MVP |
| ⚪ | [SAN-483](https://linear.app/sanjiovani/issue/SAN-483) | Production smoke + floor | Vitest + Playwright | High | 20 | F | 🔮 RE Browse & Detail |

## 🏢 Venues
> 5 issues · 🟢 2 done · 🟡 0 WIP · ⚪ 3 not started · Score: **52/100 F**

| Status | ID | Title / Purpose | Tech | Priority | Score | Grade | Notes |
|--------|----|--------------------|------|----------|-------|-------|-------|
| 🟢 | [SAN-314](https://linear.app/sanjiovani/issue/SAN-314) | Playwright SCREEN-021/022/023 | Vitest + Playwright | High | 100 | A+ | ✓ Jun 03 |
| 🟢 | [SAN-490](https://linear.app/sanjiovani/issue/SAN-490) | Restaurant Listings Page | Next.js 16 + Tailwind v4 | High | 100 | A+ | ✓ Jun 03 |
| ⚪ | [SAN-842](https://linear.app/sanjiovani/issue/SAN-842) | Venue Readiness Score (0–100) | PostgreSQL | High | 10 | F | Data completeness gate |
| ⚪ | [SAN-843](https://linear.app/sanjiovani/issue/SAN-843) | Booking Pipeline CRM for venue inquiries | Next.js 16 + Supabase | High | 10 | F | Kanban · venue managers |
| ⚪ | [SAN-827](https://linear.app/sanjiovani/issue/SAN-827) | Nightlife: prod-synthetic 5th query (order 4) | Gemini 3.5 Flash | Medium | 20 | F | Blocked: SAN-824 |

## 🛒 Payments
> 1 issues · 🟢 0 done · 🟡 0 WIP · ⚪ 1 not started · Score: **10/100 F**

| Status | ID | Title / Purpose | Tech | Priority | Score | Grade | Notes |
|--------|----|--------------------|------|----------|-------|-------|-------|
| ⚪ | [SAN-526](https://linear.app/sanjiovani/issue/SAN-526) | Mobile checkout UX (Stripe + Apple/Google Pay + QR… | Stripe + Next.js | Urgent | 10 | F | — |

## 🤝 Partners (P0 launch)
> 12 issues · 🟢 3 done · 🟡 4 WIP · ⚪ 5 not started · Full tracker: [`partners.md`](./partners.md)

| Status | ID | Title / Purpose | Tech | Priority | Score | Grade | Notes |
|--------|----|--------------------|------|----------|-------|-------|-------|
| 🟡 | [SAN-667](https://linear.app/sanjiovani/issue/SAN-667) | Partner Ecosystem Master Plan (epic) | Next.js 16 + Supabase | High | 65 | D | — |
| 🟢 | [SAN-683](https://linear.app/sanjiovani/issue/SAN-683) | Partner database schema + RLS (ERD) | Supabase RLS | High | 100 | A+ | ✓ Blocks signup/dashboard |
| 🟢 | [SAN-665](https://linear.app/sanjiovani/issue/SAN-665) | POST /api/partners/activate | Next.js 16 + Supabase | High | 100 | A+ | ✓ Activate API |
| 🟢 | [SAN-723](https://linear.app/sanjiovani/issue/SAN-723) | Partner signup wizard (/partners/signup) | Supabase Auth | High | 100 | A+ | ✓ Jun 08 · M1 |
| 🟡 | [SAN-660](https://linear.app/sanjiovani/issue/SAN-660) | For Event Hosts landing (/host) | Next.js 16 + Tailwind v4 | High | 65 | D | MKT P0 |
| ⚪ | [SAN-661](https://linear.app/sanjiovani/issue/SAN-661) | For Venues landing (/venues) | Next.js 16 + Tailwind v4 | High | 10 | F | MKT P0 |
| 🟡 | [SAN-691](https://linear.app/sanjiovani/issue/SAN-691) | For Rentals / Brokers (/partners/rentals) | Next.js 16 + Tailwind v4 | High | 65 | D | MKT P0 |
| 🟡 | [SAN-692](https://linear.app/sanjiovani/issue/SAN-692) | Partner hub marketing page (/partners) | Next.js 16 + Tailwind v4 | High | 65 | D | MKT P0 |
| ⚪ | [SAN-693](https://linear.app/sanjiovani/issue/SAN-693) | Contact / Book a demo (/contact) | Next.js 16 + Tailwind v4 | High | 10 | F | MKT P0 |
| ⚪ | [SAN-674](https://linear.app/sanjiovani/issue/SAN-674) | Partner UX pack: wireframes + mermaid SVGs | Next.js 16 + Tailwind v4 | High | 10 | F | — |
| ⚪ | [SAN-690](https://linear.app/sanjiovani/issue/SAN-690) | Partner dashboard (/dashboard) | Next.js 16 + Tailwind v4 | High | 10 | F | Blocked: SAN-683 · see ADV |
| ⚪ | [SAN-832](https://linear.app/sanjiovani/issue/SAN-832) | Partner settings + background workflows | Mastra + LibSQL | Medium | 10 | F | CRM-012 · M3 |

## 🤝 Partner CRM (trips crossover)
> 1 issue · ⚪ 1 not started

| Status | ID | Title / Purpose | Tech | Priority | Score | Grade | Notes |
|--------|----|--------------------|------|----------|-------|-------|-------|
| ⚪ | [SAN-282](https://linear.app/sanjiovani/issue/SAN-282) | Booking confirm → trip_items sync | Next.js 16 + Tailwind v4 | Urgent | 20 | F | Blocked: SAN-279 · 🧳 Trips — MVP |

## 🧭 UX / Concierge
> 17 issues · 🟢 4 done · 🟡 2 WIP · ⚪ 10 not started · Tracker: [`ux.md`](./ux.md)

| Status | ID | Title / Purpose | Tech | Priority | Score | Grade | Notes |
|--------|----|--------------------|------|----------|-------|-------|-------|
| 🟢 | [SAN-321](https://linear.app/sanjiovani/issue/SAN-321) | UX-032 — New chat reset thread + map | CopilotKit 1.55.2 | High | 100 | A+ | ✓ Jun 01 · PR #36 |
| 🟢 | [SAN-322](https://linear.app/sanjiovani/issue/SAN-322) | UX-034 — Nightly prod synthetic monitor | Vitest + Playwright | High | 100 | A+ | ✓ Jun 01 · PR #37 |
| 🟢 | [SAN-440](https://linear.app/sanjiovani/issue/SAN-440) | UX-028 — Restaurant Places photos | Google Maps JS | High | 100 | A+ | ✓ Jun 01 · PR #35 |
| 🟢 | [SAN-489](https://linear.app/sanjiovani/issue/SAN-489) | Mobile Responsive 3-Panel Shell | Next.js 16 + Tailwind v4 | Urgent | 100 | A+ | ✓ Jun 02 |
| ⚪ | [SAN-436](https://linear.app/sanjiovani/issue/SAN-436) | UX-020 — CardInteractionProps types | Next.js 16 + Tailwind v4 | Medium | 10 | F | — |
| 🟡 | [SAN-112](https://linear.app/sanjiovani/issue/SAN-112) | Login and signup polish | Supabase Auth | High | 85 | B | — |
| 🟡 | [SAN-584](https://linear.app/sanjiovani/issue/SAN-584) | SCR-002b — Explore sidebar: enable nav links at br… | Next.js 16 + Tailwind v4 | High | 65 | D | — |
| ⚪ | [SAN-276](https://linear.app/sanjiovani/issue/SAN-276) | Trip workspace shell (SCREEN-013) | Next.js 16 + Tailwind v4 | Urgent | 20 | F | Blocked: SAN-275 · 🧳 Trips — Core |
| ⚪ | [SAN-290](https://linear.app/sanjiovani/issue/SAN-290) | Playwright suite (SCREEN-011/012/013) | Vitest + Playwright | High | 20 | F | Blocked: SAN-274, SAN-289, SAN-278, SAN-281, SAN-276, SAN-282, SAN-284 · 🧳 Trips — MVP |
| ⚪ | [SAN-829](https://linear.app/sanjiovani/issue/SAN-829) | Concierge sprint: full validation gate (order 7) | Gemini 3.5 Flash | High | 20 | F | Blocked: SAN-826 |
| ⚪ | [SAN-831](https://linear.app/sanjiovani/issue/SAN-831) | Concierge sprint: ship single PR (order 9) | Gemini 3.5 Flash | High | 20 | F | Blocked: SAN-830 |
| ⚪ | [SAN-830](https://linear.app/sanjiovani/issue/SAN-830) | Concierge sprint: documentation update (order 8) | Gemini 3.5 Flash | Medium | 20 | F | Blocked: SAN-829 |
| ⚪ | [SAN-835](https://linear.app/sanjiovani/issue/SAN-835) | Recently Viewed (rentals, events, restaurants, ven… | Next.js 16 + Tailwind v4 | High | 10 | F | localStorage · `/` + `/chat` |
| ⚪ | [SAN-836](https://linear.app/sanjiovani/issue/SAN-836) | Saved Searches (rentals, events, restaurants) | Supabase RLS | High | 10 | F | `saved_searches` table |
| ⚪ | [SAN-523](https://linear.app/sanjiovani/issue/SAN-523) | Mobile AI concierge UX (chips + contextual prompts… | Gemini 3.5 Flash | High | 10 | F | — |
| ⚪ | [SAN-525](https://linear.app/sanjiovani/issue/SAN-525) | Mobile card system (touch + carousels) | Next.js 16 + Tailwind v4 | High | 10 | F | Blocked: SAN-530, SAN-528 |
| 🔴 | [SAN-437](https://linear.app/sanjiovani/issue/SAN-437) | Extract ResultCardShell and card primitives from C… | Next.js 16 + Tailwind v4 | High | 0 | F | Dup: SAN-574 |

## 🧪 Testing & Quality
> 5 issues · 🟢 1 done · 🟡 1 WIP · ⚪ 3 not started · Score: **45/100 F**

| Status | ID | Title / Purpose | Tech | Priority | Score | Grade | Notes |
|--------|----|--------------------|------|----------|-------|-------|-------|
| 🟢 | [SAN-462](https://linear.app/sanjiovani/issue/SAN-462) | Stable Beta soak gate (3× scheduled prod synthetic… | PostgreSQL | Urgent | 100 | A+ | ✓ Jun 05 |
| 🟡 | [SAN-458](https://linear.app/sanjiovani/issue/SAN-458) | Floor + review branch protection | Vitest + Playwright | High | 65 | D | — |
| ⚪ | [SAN-546](https://linear.app/sanjiovani/issue/SAN-546) | Prod live journey matrix J05–J20 | Vitest + Playwright | Urgent | 20 | F | — |
| ⚪ | [SAN-291](https://linear.app/sanjiovani/issue/SAN-291) | Production smoke + floor gate | Vitest + Playwright | High | 20 | F | Blocked: SAN-286, SAN-283, SAN-288, SAN-290, SAN-285, SAN-287 · 🧳 Trips — MVP |
| ⚪ | [SAN-460](https://linear.app/sanjiovani/issue/SAN-460) | SHA-pin GitHub Actions | Google Maps JS | Medium | 20 | F | — |

## 🏛️ Admin & Ops
> 7 issues · 🟢 0 done · 🟡 0 WIP · ⚪ 7 not started · Score: **10/100 F**

| Status | ID | Title / Purpose | Tech | Priority | Score | Grade | Notes |
|--------|----|--------------------|------|----------|-------|-------|-------|
| ⚪ | [SAN-837](https://linear.app/sanjiovani/issue/SAN-837) | Launch Command Center (Patricia admin ops) | Vercel + Next.js | Urgent | 10 | F | `/admin/ops` · phase:launch |
| ⚪ | [SAN-838](https://linear.app/sanjiovani/issue/SAN-838) | Universal Activity Feed (admin + partner + host) | PostgreSQL | High | 10 | F | Append-only `activity_events` |
| ⚪ | [SAN-844](https://linear.app/sanjiovani/issue/SAN-844) | Data Quality Dashboard for admins | Next.js 16 + Tailwind v4 | High | 10 | F | `/admin/data-quality` |
| ⚪ | [SAN-845](https://linear.app/sanjiovani/issue/SAN-845) | Audit Log Viewer for admin actions | Next.js 16 + Tailwind v4 | Medium | 10 | F | `/admin/audit` |
| ⚪ | [SAN-846](https://linear.app/sanjiovani/issue/SAN-846) | Background Jobs Dashboard | Next.js 16 + Tailwind v4 | Medium | 10 | F | `/admin/jobs` |
| ⚪ | [SAN-847](https://linear.app/sanjiovani/issue/SAN-847) | Error Tracking Dashboard (API/AI/payments) | Next.js 16 + Tailwind v4 | High | 10 | F | `/admin/errors` |
| ⚪ | [SAN-849](https://linear.app/sanjiovani/issue/SAN-849) | Missing Data Detection — incomplete listings | PostgreSQL | Medium | 10 | F | Feeds SAN-844 · scheduled scan |


## 📊 MVP Summary

| Section | Issues | 🟢 Done | 🟡 WIP | ⚪ Not Started | 🔴 Failed | Avg Score | Grade |
|---------|--------|---------|--------|--------------|-----------|-----------|-------|
| 🔐 Foundation | 14 | 5 | 1 | 8 | 0 | 52 | F |
| 🗺️ Maps & Search | 53 | 11 | 5 | 34 | 3 | 40 | F |
| 🤖 AI & Intelligence | 34 | 3 | 1 | 29 | 1 | 23 | F |
| 📅 Events Platform | 29 | 1 | 1 | 27 | 0 | 21 | F |
| 🏠 Rentals | 10 | 2 | 2 | 6 | 0 | 45 | F |
| 🏢 Venues | 5 | 2 | 0 | 3 | 0 | 52 | F |
| 🛒 Payments | 1 | 0 | 0 | 1 | 0 | 10 | F |
| 🤝 Partner CRM | 2 | 1 | 0 | 1 | 0 | 60 | D |
| 🧭 UX / Concierge | 13 | 1 | 2 | 9 | 1 | 32 | F |
| 🧪 Testing & Quality | 5 | 1 | 1 | 3 | 0 | 45 | F |
| 🏛️ Admin & Ops | 7 | 0 | 0 | 7 | 0 | 10 | F |
| **TOTAL** | **173** | **27** | **13** | **128** | **5** | **33** | **F** |

**Overall Score: 33/100 — Grade: F | Completion: 16%**

> **New 2026-06-08 (phase:mvp):** SAN-835–849 — retention, launch ops, event/venue intelligence, admin dashboards  
> **CSV stale:** `CSV/MVP issues.csv` max **SAN-834** — re-export Linear before running `generate.py`; markdown is ahead of CSV by 15 issues


### 🔴 Top 10 MVP Blockers (not Done, Urgent/High)
1. ⚪ **SAN-837** — Launch Command Center (Patricia admin ops) `Urgent`
2. ⚪ **SAN-273** — Trips Supabase audit + evidence `Urgent`
3. ⚪ **SAN-274** — Trips dashboard polish (SCREEN-012) `Urgent`
4. ⚪ **SAN-275** — Create trip modal + server action `Urgent`
5. ⚪ **SAN-276** — Trip workspace shell (SCREEN-013) `Urgent`
6. ⚪ **SAN-282** — Booking confirm → trip_items sync `Urgent`
7. ⚪ **SAN-292** — RestaurantResultCard + search-tool-renders `Urgent`
8. ⚪ **SAN-293** — RestaurantDetailPanel + rental-ui-context `Urgent`
9. ⚪ **SAN-299** — requestVenueBooking Mastra tool `Urgent`
10. ⚪ **SAN-300** — VenueBookingSheet component `Urgent`

### ✅ Top 10 Ready to Start (unblocked, not started)
1. ⚪ **SAN-273** — Trips Supabase audit + evidence `Urgent`
2. ⚪ **SAN-292** — RestaurantResultCard + search-tool-renders `Urgent`
3. ⚪ **SAN-299** — requestVenueBooking Mastra tool `Urgent`
4. ⚪ **SAN-300** — VenueBookingSheet component `Urgent`
5. ⚪ **SAN-407** — Remove canned rental clarify bypass before concier… `Urgent`
6. ⚪ **SAN-467** — Supabase schema audit — rentals cluster `Urgent`
7. ⚪ **SAN-469** — Rental search indexes (price_daily) `Urgent` (canonical; SAN-470 dup)
8. ⚪ **SAN-474** — Lead capture edge proof (G2) `Urgent`
9. ⚪ **SAN-484** — Rental parser intelligence (dates, city, confidenc… `Urgent`