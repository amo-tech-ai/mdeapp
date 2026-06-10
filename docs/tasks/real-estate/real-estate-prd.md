---
title: mdeai Real Estate Management System — PRD
version: 2.0.0
date: 2026-05-26
status: Implementation-ready (forensic audit 2026-05-26)
owners: Product + Engineering
stack_lock: Next.js 16 · CopilotKit 1.55.2 · Mastra · Gemini · Supabase · Google Maps/Places · Stripe (rental commerce POST-MVP)
canonical_roadmap: ./real-estate-roadmap.md
task_index: ./tasks/INDEX.md
data_audit: ../data/audit-supabase.md
reviewed_paths:
  - /home/sk/mdeai/tasks/real-estate/wireframes
  - /home/sk/mdeai/mdeapp/src/mastra
  - /home/sk/mdeai/mdeapp/src/components/copilot
  - /home/sk/mdeai/mdeapp/src/app/api/leads
  - /home/sk/mdeai/supabase/functions/chat-lead-capture
  - /home/sk/mdeai/tasks/archive/real-estate-A
  - /home/sk/mdeai/tasks/data/tasks-data/data-019-rentals-data-inventory.md
supabase_project: zkwcbyxiwklihegjhuql
---

# mdeai Real Estate — Product Requirements Document

## How to read

| Part | Sections | Audience |
|------|----------|----------|
| **Product** | §1–§5 | PM, design, eng |
| **Data + rules** | §6–§7 | Supabase, backend |
| **AI stack** | §8–§11 | Mastra, CopilotKit, Maps, Gemini |
| **Growth + future** | §12–§14 | POST-MVP / ADVANCED only |
| **Ship** | §15–§18 | Task authors, Sofía |

**Companion:** [`real-estate-roadmap.md`](./real-estate-roadmap.md) · **Tasks:** [`tasks/INDEX.md`](./tasks/INDEX.md)

---

# 1. Executive summary

## What it is

The **Real Estate Management System** is mdeai's **Medellín furnished-rental wedge** — chat-first discovery, map-backed trust, qualified leads, showings, applications, and (later) booking with commission. It shares one platform with events and trips but follows **CHAT-CENTRAL**: Camila searches on `/` or `/chat`; listings come only from **`apartments`** (never LLM-invented).

```text
CopilotKit UI (cards, modals, HITL)
  → Mastra (rentalAgent, rental-search-workflow, tools)
  → Supabase truth (apartments, leads, showings, applications)
  → Edge (chat-lead-capture — guest rate limit, service role)
  → Stripe (POST-MVP rental booking only)
  → Maps (AdvancedMarker + mapId, Places field masks)
```

## Why Medellín rentals are the wedge

| Factor | Why it matters |
|--------|----------------|
| **Inventory exists** | 44 active `apartments` with embeddings — enough for demo, not enough for scale |
| **Persona fit** | Camila (expat move) + Andrés (landlord) loop is simpler than full MLS |
| **Chat differentiation** | Mindtrip does hotels; mdeai does **schedule viewing** + landlord CRM |
| **Commission path** | Lead → showing → application → Stripe booking (12% target) — **after** lead loop proven |
| **Shared infra** | Same CopilotKit + Mastra + Supabase as events — no second stack |

## What ships now vs later

| Now (CORE + MVP) | Later (POST-MVP / ADVANCED) |
|------------------|----------------------------|
| In-chat rental search + cards | `/rentals` catalog page (F41 — frozen) |
| Schedule viewing → `leads` | Landlord inbox UI |
| Map pin sync on chat canvas | `showings` calendar |
| Saved + trips (TRIP-006/007) | Application wizard |
| Search indexes (`price_daily`) | Stripe rental booking |
| RLS proof | WhatsApp nurture, OpenClaw, Hermes scoring |
| | Sales/buyers/sellers CRM |

## Current readiness — **74/100**

| Lens | Score | Evidence |
|------|------:|----------|
| **Schema** | 78 | Tables + RLS ✅; gaps: `leads.apartment_id`, `price_daily` index, empty `showings` |
| **Backend / agents** | 82 | F17/F46/F47 archived — `rentalAgent`, `search-rentals`, lead API on disk |
| **UI / surfaces** | 58 | RentalCard + modal ✅; `/rentals` ❌; landlord UI ❌; Save stub |
| **Commerce** | 45 | Ticket Stripe ✅ (events); rental `bookings`/`payments` empty |
| **Automation** | 35 | `wa_outbox` + `suppression_list` exist; no rental automation wired |
| **Maps** | 70 | Pin sync in chat; MAP-008 AdvancedMarker gate for browse page |

**Verdict:** Architecture is correct. **Do not overbuild.** Ship lead loop + data fixes before landlord dashboard or WhatsApp.

---

# 2. Personas and real-world stories

| Persona | Role | Story (MVP) |
|---------|------|-------------|
| **Camila** | Expat renter | "2BR Laureles under $80/night, good WiFi" → real cards → schedule viewing Sat 10am → lead in DB |
| **Andrés** | Landlord | Receives qualified lead with listing context → confirms showing (POST-MVP inbox) |
| **Carlos** | Local budget renter | Filters by COP/month in chat; same `search-rentals` path |
| **Tourist** | Short-stay | Concierge routes to rental cards for 1–2 week stays |
| **Patricia** | Admin | Moderates scam listings via `property_verifications` (POST-MVP queue) |
| **Juan** | Ops | Monitors lead volume, webhook failures (POST-MVP dashboards) |
| **Future buyer/seller** | Sales | ADVANCED — not Phase 1 |

### Core stories (acceptance narratives)

1. **Camila search** — Query returns rows from `apartments` only; card shows photo, `$X/night`, neighborhood.
2. **Camila viewing** — Modal → `/api/leads/schedule-viewing` → `chat-lead-capture` → `leads` row; no browser service role.
3. **Camila save** — Heart → `saved_places` → add to trip (`TRIP-007`).
4. **Andrés lead** — Landlord sees lead tied to listing (needs **data-020** `apartment_id`).
5. **Patricia moderation** — Flag listing → admin action (POST-MVP).

---

# 3. Product scope

## CORE (inventory + CRM truth — minimal LLM)

| In | Out |
|----|-----|
| 44+ verified `apartments` (photos, price_daily, neighborhood, lat/lng) | Scraping / MLS ingest |
| RLS on rental cluster | OpenClaw production sends |
| `search-rentals` → real rows | AI-generated listings |
| `chat-lead-capture` edge (rate limit 20/hr/IP guest) | Hermes in hot path |
| `listing_embeddings` semantic search (optional path) | Multi-city |
| Lead in `leads` | Stripe rental checkout |

## MVP (CopilotKit + Mastra + landlord loop start)

| In | Out |
|----|-----|
| RentalCard polish + pin sync (SCREEN-005) | Full `/rentals` catalog (defer F41) |
| Schedule viewing HITL (SCREEN-008) | WhatsApp concierge |
| `data-020` leads FK + **data-021** showings bridge | Dynamic pricing |
| Landlord inbox read MVP | Application wizard full |
| Saved + trips integration | Stripe Connect payouts |
| `price_daily` indexes (data-009 M3) | Sales module |
| Playwright + RLS tests | Postiz auto-post |

## POST-MVP

| Area | Features |
|------|----------|
| `/rentals` + `/rentals/[id]` browse | F41 wireframe — after MAP-001 |
| Application wizard → `rental_applications` | 4-step, landlord summary |
| Neighborhood intel on map | commute, coworking proximity |
| Hermes batch scoring | data-025 tables |
| Landlord assistant chat | triage, draft replies (approval) |
| Rental Stripe booking | data-024 + RE-014 |
| SEO neighborhood guides | content, not agent truth |

## ADVANCED

| Area | Features |
|------|----------|
| OpenClaw WhatsApp | viewing reminders, nurture — approval queue |
| Sales/buyers/sellers CRM | buyer leads, offers, valuations |
| Marketing automation | campaigns, Postiz, creator partnerships |
| Lease review AI | PDF summary — **not legal advice** |
| AI negotiation | human-only for offers |

---

# 4. Required screens

| Route / surface | Wireframe / screen | Phase | Disk status |
|-----------------|-------------------|-------|-------------|
| `/` chat rental cards | [009-wire-rental-search](./wireframes/009-wire-rental-search.md) SCREEN-005 | CORE | ✅ cards + tool render |
| Schedule viewing modal | [017-scr-schedule-viewing-modal](./wireframes/017-scr-schedule-viewing-modal.md) SCREEN-008 | CORE | ✅ modal + API |
| Rental detail panel | inline / slide-in on chat | MVP | Partial (Details CTA) |
| `/rentals` browse | [009-wire-rentals-browse](./wireframes/009-wire-rentals-browse.md) | POST-MVP | ❌ Frozen |
| `/rentals/[id]` | same wire | POST-MVP | ❌ |
| `/saved` | TRIP-006 / SCREEN-011 | MVP | ❌ |
| `/trips`, `/trips/[id]` | TRIP tasks | MVP | ✅ shells |
| Landlord inbox | — | MVP | ❌ no route |
| Landlord lead detail | — | MVP | ❌ |
| Landlord listing manager | — | POST-MVP | ❌ |
| Showing calendar | — | POST-MVP | ❌ |
| Application wizard | — | POST-MVP | ❌ |
| Booking checkout modal | trips 010-wire | POST-MVP rental | Events ✅ |
| Admin moderation queue | — | POST-MVP | ❌ |
| Analytics dashboard | — | ADVANCED | ❌ |
| WhatsApp/automation settings | — | ADVANCED | ❌ |
| Buyer/seller dashboards | — | ADVANCED | ❌ |

**MVP hero path:** `/` → cards → schedule viewing → (later) saved → trip itinerary.

---

# 5. Feature matrix

| Feature | Tier | Owner system | Persona | Tables | Agents/tools |
|---------|------|--------------|---------|--------|--------------|
| Rental search | CORE | Supabase + Mastra | Camila | `apartments`, `listing_embeddings` | `search-rentals`, `rental-search-workflow` |
| Rental cards | CORE | CopilotKit | Camila | read `apartments` | `useCopilotAction` render |
| Map pin sync | MVP | Maps + UI | Camila | `apartments.lat/lng` | MapContext |
| Schedule viewing | CORE | Edge | Camila | `leads` | `capture_lead` thin / API route |
| Lead capture edge | CORE | Supabase edge | Camila | `leads` | `chat-lead-capture` |
| Showings | MVP | Supabase | Andrés | `showings`, `leads` | data-021 bridge |
| Landlord inbox | MVP | Supabase | Andrés | `landlord_inbox`, `leads` | read API |
| Saved / trips | MVP | Supabase | Camila | `saved_places`, `trip_items` | TRIP-007 |
| Semantic search | POST-MVP | Supabase RPC | Camila | `listing_embeddings` | hybrid RPC |
| Applications | POST-MVP | Supabase | Camila, Andrés | `rental_applications` | `applicationAgent` |
| Rental booking | POST-MVP | Stripe + edge | Camila | `bookings`, `payments` | webhook only |
| Neighborhood intel | POST-MVP | Places + ADK | Camila | `neighborhoods`, cache | read-only tools |
| Hermes scoring | ADVANCED | Batch | Juan | data-025 | offline job |
| WhatsApp reminders | ADVANCED | OpenClaw | Camila | `wa_outbox`, `suppression_list` | approval queue |
| Sales CRM | ADVANCED | Supabase | future | new tables TBD | buyerAgent/sellerAgent |

---

# 6. Supabase data requirements

Live project `zkwcbyxiwklihegjhuql` · Full rental audit: **data-019**.

| Table | Exists | Rows | Purpose | Gap / action |
|-------|:------:|-----:|---------|--------------|
| `apartments` | ✅ | 44 | Listing truth | **data-009 M3** `price_daily` index |
| `listing_embeddings` | ✅ | 44 | Semantic/hybrid search | ✅ |
| `neighborhoods` | ✅ | 12 | Hood facts | **data-022** FK on apartments |
| `leads` | ✅ | 11 | CRM leads | **data-020** `apartment_id`, `preferred_showing_at` |
| `showings` | ✅ | 0 | Scheduled viewings | **data-021** populate from modal |
| `rental_applications` | ✅ | 0 | Application wizard | POST-MVP UI |
| `landlord_inbox` | ✅ | 0 | Landlord notify | RE-008 UI |
| `landlord_profiles` | ✅ | — | Host identity | read for cards |
| `bookings` | ✅ | 0 | Commerce | **data-024** rental prep |
| `payments` | ✅ | 3 | Payment truth | webhook only |
| `saved_places` | ✅ | 0 | Hearts | TRIP-006 |
| `collections` | ✅ | 0 | Named lists | TRIP-006 |
| `trips` / `trip_items` | ✅ | 2 / 4 | Itinerary | TRIP-007, data-028 |
| `places_search_cache` | ✅ | 33 | Places cost control | field masks |
| `place_details_cache` | ✅ | 45 | Place hydration | field masks |
| `places_cache` | ❌ | — | Renamed | use cache tables above |
| `contacts` | ❌ | — | Defer | `mastra_threads` + `leads` |
| `conversations` | ❌ | — | Defer | `mastra_threads` |
| `ai_runs` | ✅ | — | Agent audit (F13) | ✅ |
| `approval_requests` | ✅ | — | HITL gates | host/event pattern reuse |
| `automation_jobs` | ❌ | — | ADVANCED | defer |
| `outreach_messages` | ❌ | — | Defer | `wa_outbox` |
| `suppression_list` | ✅ | — | WhatsApp opt-out | ADVANCED |
| `scoring_logs` | ❌ | — | **data-025** | Hermes P2 |
| `market_snapshots` | ❌ | — | **data-025** | Hermes P2 |
| `property_verifications` | ✅ | — | Scam/freshness | admin POST-MVP |
| `rental_freshness_log` | ✅ | — | Stale listing audit | batch |
| `wa_outbox` | ✅ | — | Outbound WA queue | ADVANCED |

### Per-table notes (MVP-critical)

**`apartments`** — Public SELECT active only. Indexes: GIST location, FTS; **missing** `price_daily` partial index. FK: host/landlord. No `google_place_id` required.

**`leads`** — Insert via **edge/API only** for guests; authenticated insert own row. `listing_id` today in **metadata only** — migrate to `apartment_id` UUID FK (data-020).

**`showings`** — RLS ✅; link `lead_id`, `apartment_id`, landlord; never populated — data-021.

**`bookings`/`payments`** — Rental commerce POST-MVP; Stripe webhook + idempotency_keys pattern from events.

**CORE verdict:** **Zero new tables** for rental MVP. Column + index + workflow gaps only.

---

# 7. Critical Supabase rules

| Rule | Enforcement |
|------|-------------|
| Renters read **active** listings only | RLS `apartments.status = 'active'` |
| Landlords read **own** listings + leads | RLS via `host_id` / assignment |
| Leads inserted via **secure path** | `/api/leads/schedule-viewing` → `chat-lead-capture`; not raw browser INSERT |
| Showings link lead + apartment + landlord | data-021 FK + edge validation |
| Bookings/payments finalized by **webhook only** | No LLM, no client Stripe secret |
| **No service role in browser** | `mdeapp/src/**` hook enforced |
| RLS tests required | Two-user Playwright or SQL negative tests |
| Search indexes | `(neighborhood, bedrooms, price_daily) WHERE active` — data-009 M3 |
| Places API | Every call includes **X-Goog-FieldMask** |
| Maps | Every `<AdvancedMarker>` has parent `<Map mapId=...>` |
| Idempotency | `leads.idempotency_key`, checkout idempotency, webhook `idempotency_keys` |
| Guest abuse | `chat-lead-capture` 20 req/hr/IP when unauthenticated |

---

# 8. Mastra workflows and agents

**Principle:** Extend existing agents — do not spawn 12 new ones for MVP.

| Agent / workflow | Responsibility | Tools | Allowed writes | Forbidden | Approval |
|------------------|----------------|-------|----------------|-----------|----------|
| **conciergeAgent** | Route rental vs event vs places | `classify-intent` | none | insert leads | — |
| **rentalAgent** | Rental dialog + tool calls | `search-rentals` | none | invent listings | — |
| **rentalSearchWorkflow** | Search → rank → cards | workflow steps | none | DB writes | — |
| **leadCaptureWorkflow** | Thin — UI submits to edge | — | none | bypass edge | — |
| **showingSchedulerWorkflow** | POST-MVP slot propose | read calendars | `showings` via RPC | auto-confirm without host | HITL |
| **landlordAssistantAgent** | POST-MVP inbox triage | read leads | draft only | send WA | HITL |
| **neighborhoodIntelAgent** | Explain hood tradeoffs | read `neighborhoods`, Places cache | none | invent stats | — |
| **applicationAgent** | POST-MVP form fill | read listing | `rental_applications` draft | submit without user | HITL |
| **bookingAgent** | POST-MVP checkout bridge | read booking state | none | set paid status | Stripe webhook |
| **marketingAgent** | ADVANCED copy drafts | read listings | none | Postiz publish | HITL |
| **WhatsAppAgent** | ADVANCED | read wa_outbox | queue draft | autonomous send | HITL + suppression |
| **OpenClawAutomationAgent** | ADVANCED enrichment | filesystem | draft files only | insert listings/leads | HITL |
| **buyerAgent / sellerAgent** | ADVANCED sales | TBD | TBD | — | — |

**Example:** Camila asks "Laureles 2BR" → `conciergeAgent` → `rentalSearchWorkflow` → `search-rentals` queries `apartments` → CopilotKit renders `RentalCard` → user clicks Schedule → **UI** POSTs edge → **no** agent INSERT.

---

# 9. CopilotKit integration

| Pattern | Phase | Implementation |
|---------|-------|----------------|
| Rental cards in chat | CORE | `search-tool-renders.tsx` + `RentalCard` |
| Schedule viewing | CORE | Modal + optional `renderAndWaitForResponse` ack |
| Save to trip | MVP | `useCopilotAction` + TRIP-007 |
| Landlord lead summary card | MVP | POST-MVP generative card from inbox API |
| Application form-fill | POST-MVP | form-filling pattern + HITL |
| Booking confirmation | POST-MVP | mirror events ticket card |
| Admin moderation card | POST-MVP | Patricia approve/reject |
| Marketing campaign approval | ADVANCED | draft → approve → Postiz |

**Stack lock:** CopilotKit **1.55.2** only — no v2 mix. Agent names must match Mastra registry keys.

---

# 10. Google ADK + Maps plan

| Capability | Phase | Notes |
|------------|-------|-------|
| Map pins on chat canvas | MVP | F50 pin sync; numbered markers |
| Advanced Markers | MVP | MAP-008 before F41 |
| Clustering | POST-MVP | browse `/rentals` map split |
| Neighborhood intelligence | POST-MVP | `neighborhoods` table + Places nearby |
| Commute / routes | POST-MVP | Routes API; cache in metadata |
| Places API New | MVP | field masks on every request |
| Source attribution | Always | Google ToS on map surfaces |
| Places cache | MVP | `place_details_cache`, `places_search_cache` |
| Route cache | ADVANCED | defer dedicated table |

---

# 11. Gemini tools

| Use | Guardrail |
|-----|-----------|
| Parse renter intent (neighborhood, budget, beds) | Flash model; fallback to workflow filters |
| Summarize listing from row data | Read-only |
| Explain neighborhood tradeoffs | Cite `neighborhoods` or Places — no invented crime stats |
| Draft landlord lead summary | Draft only; Andrés approves |
| Draft follow-up message | No send — WA ADVANCED |
| Marketing copy | HITL before Postiz |
| Score lead quality | Evidence from `score_breakdown` — advisory only |
| Explain rejected listings | Admin context only |

**Hard rules:** Gemini **cannot** invent listings, decide payments, send WhatsApp, or give legal lease advice.

---

# 12. OpenClaw + WhatsApp automation

| Tier | Allowed |
|------|---------|
| **MVP** | None — manual drafts in thread only |
| **POST-MVP** | Approved viewing reminders (template WA) |
| **ADVANCED** | Nurture, no-show recovery, landlord alerts, campaigns |

Requirements when enabled: opt-in, STOP/`suppression_list`, rate limits, templates, `wa_outbox` audit, **approval queue**, no autonomous spam.

---

# 13. Marketing system (POST-MVP / ADVANCED)

| Channel | MVP | Later |
|---------|-----|-------|
| Listing promotion | — | Postiz drafts (approve) |
| Landlord acquisition | — | OpenClaw research draft-only |
| Renter nurture | — | WA templates |
| Neighborhood guides | — | SEO pages + grounded Places |
| Creator partnerships | — | ADVANCED |

---

# 14. Sales / buyers / sellers (ADVANCED)

All modules **ADVANCED** unless explicitly pulled forward:

- Buyer/seller leads, agent CRM, valuations, showing/offer pipelines, document checklist, mortgage referrals, compliance notes.
- **Do not** block rental MVP on sales schema.

---

# 15. Implementation roadmap

See [`real-estate-roadmap.md`](./real-estate-roadmap.md) and [`tasks/INDEX.md`](./tasks/INDEX.md).

| Order | ID | Title |
|------:|-----|-------|
| 1 | RE-001 | Supabase schema audit |
| 2 | RE-002 | Apartment inventory quality |
| 3 | RE-003 | Rental search indexes |
| 4 | RE-004 | Rental cards in chat |
| 5 | RE-005 | Map pin sync |
| 6 | RE-006 | Schedule viewing modal proof |
| 7 | RE-007 | Lead capture edge proof |
| 8 | RE-008 | Landlord inbox MVP |
| 9 | RE-009 | Showing bridge |
| 10 | RE-010 | Saved/trips integration |
| 11 | RE-011 | Rental browse page (POST-MVP gate) |
| 12 | RE-012 | Rental detail page |
| 13 | RE-013 | Application wizard |
| 14 | RE-014 | Booking/payment prep |
| 15 | RE-015 | Playwright + RLS tests |
| 16 | RE-016 | Production smoke |

**Data layer parallels:** data-019 → data-020 → data-021 → data-009 M3 → data-023.

---

# 16. Acceptance criteria (MVP Done)

- [ ] `search-rentals` returns real `apartments` rows (no hallucination)
- [ ] Rental card: photo, price, neighborhood, schedule CTA
- [ ] Schedule viewing creates `leads` row via edge
- [ ] Landlord can view assigned lead (RE-008)
- [ ] User A cannot read User B leads/showings (RLS)
- [ ] Map pins sync with cards (smoke:f50 or equivalent)
- [ ] Saved item → trip (`TRIP-007`)
- [ ] No service role in browser
- [ ] No direct client Stripe mutation for rentals
- [ ] `npm run floor` exit 0

---

# 17. Risk audit

| Risk | Severity | Mitigation |
|------|----------|------------|
| Overbuilding (Mindtrip clone) | 🔴 | Chat-first; defer `/rentals`, sales, WA |
| Dual-router (edge ai-router + Mastra) | 🟠 | Mastra primary in mdeapp |
| RLS exposure | 🟠 | Two-user tests; edge-only lead insert |
| Fake / scam listings | 🟠 | `property_verifications`; admin queue |
| AI hallucinated listings | 🔴 | Tool-only search; Zod on tool output |
| WhatsApp compliance | 🟠 | Templates + suppression; ADVANCED |
| Landlord privacy | 🟠 | RLS on inbox; no public lead PII |
| OpenClaw abuse | 🟠 | Draft-only; no auto writes |
| Places API cost | 🟡 | Field masks + cache tables |
| Payment drift | 🟠 | Webhook truth only |
| Empty inventory (44 rows) | 🟡 | Product ops — seed quality RE-002 |

---

# 18. Final output summary

| Artifact | Path |
|----------|------|
| PRD | this file |
| Roadmap | [`real-estate-roadmap.md`](./real-estate-roadmap.md) |
| Tasks | [`tasks/INDEX.md`](./tasks/INDEX.md) RE-001–016 |
| Data tasks | [`../data/tasks-data/`](../data/tasks-data/) data-019–025 |
| Trips integration | [`../trips/tasks/`](../trips/tasks/) TRIP-006–010 |
| Archived backend Done | [`../archive/real-estate-A/`](../archive/real-estate-A/) |

### Critical fixes before new features

1. **data-020** — `leads.apartment_id` FK  
2. **data-021** — schedule viewing → `showings`  
3. **data-009 M3** — `price_daily` indexes  
4. **RE-006/007** — SCREEN-008/005 Done evidence refresh  
5. **RE-008** — landlord inbox read path  

### MVP vs Advanced

| MVP | Advanced |
|-----|----------|
| Chat search + cards + viewing | `/rentals` catalog at scale |
| Leads + showings bridge | Applications + Stripe rental |
| Saved + trips | WhatsApp + OpenClaw |
| Indexes + RLS | Sales CRM, Hermes, marketing automation |

---

*Last updated: 2026-05-26 · MCP + disk forensic audit*
