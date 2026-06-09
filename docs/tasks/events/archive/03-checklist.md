---
title: Events Platform — forensic audit checklist
updated: 2026-06-08
prompts:
  - ./01--events-prompt.md
  - ./02-fix.md
outputs:
  tracker: ../index-events.md
  pages: ../event-pages.md
  planning: ../PLANNING-VERIFICATION.md
  ui_audit: ../pages-ui-inventory.md
  specs: ../specs/INDEX.md
---

# Events Platform — audit & fix checklist

**Role:** Senior EventTech Product Architect · AI Systems Engineer · UX Architect · Technical PM  
**Project:** mdeai Events Platform  
**Rule:** MVP first — do not optimize future features before MVP completeness is verified.

**How to run:** Execute phases **in order**. Mark `[x]` only with disk/Linear/prod evidence. Re-run after each major PR.

| Prompt | Purpose |
|--------|---------|
| [`01--events-prompt.md`](01--events-prompt.md) | Full forensic audit (10 phases) |
| [`02-fix.md`](02-fix.md) | Spec-pack fix pass before implementation |

---

## Pre-flight — read first

- [x] `tasks/events/docs/events-prd.md`
- [x] `tasks/events/docs/events-roadmap.md`
- [x] `tasks/events/index-events.md`
- [x] `tasks/events/PLANNING-VERIFICATION.md`
- [x] `tasks/events/specs/INDEX.md` + `LINEAR-COVERAGE.md`
- [x] `tasks/events/pages-ui-inventory.md`
- [x] `tasks/events/event-pages.md`
- [x] `tasks/events/wireframes/INDEX.md`
- [x] `sitemap.md` · `DESIGN.MD` · `CLAUDE.md`
- [x] `tasks/events/specs/DIAGRAMS.md`

**Skills to load:** task-verifier · mde-task-lifecycle · testing · mermaid-diagrams · copilotkit-integrations · shadcn · ui-ux-pro-max

---

## Phase 1 — Current state audit

Analyze PRD, roadmap, tracker, specs, wireframes, Linear, routes, APIs, schema, agents, workflows.

### Capability grade matrix

| Area | Complete % | Grade | Status | Linear | Spec | Evidence |
|------|----------:|-------|--------|--------|------|----------|
| Event discovery | 88% | B+ | 🟡 | SAN-117 Done | PAGE-001, OVL-001 | Chat cards + prod search |
| Event detail | 70% | C+ | 🟡 | SAN-237, SAN-135 | PAGE-003, 003b | Commerce LIVE; Luma pending |
| Ticketing | 85% | B | 🟡 | SAN-248, EVP-002 | PAGE-004/005, OVL-002 | APIs LIVE; G1 ledger open |
| Stripe | 90% | A- | 🟢 | SAN-116 Done | EVP-003 | Webhook isolation Done |
| Host tools | 92% | A- | 🟢 | SAN-366,118 Done | PAGE-006/007 | Wizard + list LIVE |
| AI agents | 95% | A | 🟢 | — | Mastra disk | concierge + event + host |
| Chat booking | 90% | A- | 🟢 | SAN-117 | OVL-001 | CopilotKit 1.55.2 |
| Marketing | 15% | F | ⚪ | SAN-660,664,701 | PAGE-M01,M07,M08 | Spec-only |
| Analytics | 0% | F | ⚪ | SAN-729 | PAGE-M02 | Nav stub only |
| Admin | 5% | F | ⚪ | SAN-515,502,516 | PAGE-M04–06 | No routes |
| Venue booking | 0% | F | ⚪ | SAN-492–514 | VEN-001–007 | Spec-only |
| Discovery workflows | 8% | F | ⚪ | SAN-119–131 | EVP-015–028 | Stub workflow |
| Social promotion | 0% | F | ⚪ | SAN-133,134 | EVP-030/031 | Post-MVP |
| WhatsApp | 0% | F | ⚪ | SAN-147 | EVP-044 | Phase 2+ |
| CRM | 0% | F | ⚪ | SAN-132 | PAGE-M10, EVP-029 | Spec-only |
| Automation | 0% | F | ⚪ | SAN-133 | EVP-030 | OpenClaw sandbox |
| Maps | 45% | D+ | 🟡 | SAN-120 | EVP-016 | Pins exist; bind unproven |
| Search | 85% | B+ | 🟢 | — | hybrid_search_events | PG vector RPC |
| AI infrastructure | 90% | A- | 🟢 | — | Mastra + Gemini | Vitest green |

- [x] Grade matrix populated with evidence
- [ ] Refresh after SAN-115 ledger signed

**Legend:** 🟢 Complete · 🟡 Partial · 🔴 Missing · ⚪ Future

---

## Phase 2 — Verify core MVP platform

### Event discovery

- [x] Chat discovery (`/`, `/chat`) — Camila: *"Salsa this weekend"*
- [x] Event cards in thread (SCREEN-006 / SAN-117)
- [x] `/events` browse + filters (SCREEN-027 / SAN-518)
- [x] Map pins after card search
- [ ] Recommendations engine UI
- [ ] Save event / wishlist
- [ ] Web discovery + cited sources (SAN-119+)

### Event detail

- [x] Description, venue, pricing, ticket tiers, buy CTA
- [x] Mobile bottom buy bar
- [ ] Hero (Luma) — SAN-135
- [ ] Host block, vibe tags, agenda, attendees
- [ ] Share button (disabled today)
- [ ] a11y: hero alt — SAN-731
- [ ] loading.tsx skeleton — SAN-731
- [ ] Compare vs Luma / Eventbrite / Partiful / Meetup — PAGE-003b

### Ticketing (Andrés)

- [x] Ticket tiers on detail page
- [x] Checkout modal → Stripe session
- [x] Wallet `/me/tickets` + QR `/me/tickets/[id]`
- [ ] Promo codes (SAN-561 / revenue)
- [ ] G1 prod paid-ticket proof → SAN-115 ledger
- [ ] Door validation flow documented

### Host platform (Roberto)

- [x] AI wizard `/host/event/new` + HITL publish
- [x] `/host/events` list (SAN-118 Done)
- [x] G3 prod publish path (SAN-366 Done)
- [ ] Host nav Events link enabled — SAN-730
- [ ] Host onboarding landing `/host` — SAN-660
- [ ] Host analytics — SAN-729
- [ ] Revenue reporting / dashboard — SAN-690

---

## Phase 3 — AI architecture audit

### Gemini agents

| Agent | Purpose | Tools | UI | Verified |
|-------|---------|-------|-----|----------|
| `conciergeAgent` | Multi-intent chat | search_events, rentals, places | `/`, `/chat` | [x] |
| `eventAgent` | Event Q&A | search_events | Chat | [x] |
| `hostEventAgent` | NL → draft | set_event_*, preview | `/host/event/new` | [x] |

- [x] Agent names match Mastra registry ↔ CopilotKit `useCoAgent`
- [x] Working memory / EventDraftState synced (EVP-008)
- [ ] Mermaid agent flow diagram in `specs/DIAGRAMS.md`

### CopilotKit

- [x] Chat UI + generative cards
- [x] HITL approval panel (`renderAndWaitForResponse`)
- [x] Host wizard tool rendering
- [ ] Prod empty POST `/api/copilotkit` — investigate 401 vs 400

### Mastra

- [x] `search_events` tool + DB workflow
- [x] Host publish tools (wizard)
- [ ] `event-discovery-workflow` — web merge + save (SAN-125)
- [ ] Ticket purchase workflow (deferred commerce proof)
- [ ] Venue booking workflow (SAN-501)
- [ ] Mermaid workflow diagrams

### ADK (SearchAgent + MapsAgent)

- [x] Classified Phase 2 — SAN-126 Todo
- [ ] Not in `mdeapp/` runtime — confirm no accidental wiring

---

## Phase 4 — Maps & discovery

- [x] Map panel + event pins in chat
- [x] Places patterns elsewhere in app
- [ ] Event ↔ venue binding proven E2E (EVP-016 / SAN-120)
- [ ] Venue discovery / match UI (SAN-498+)
- [ ] Grounding citations in discovery UI (SAN-128)

---

## Phase 5 — Database & infrastructure

### Supabase tables (events domain)

| Table / RPC | Exists | RLS | Prod ready | Notes |
|-------------|--------|-----|------------|-------|
| `events` | [x] | [x] | [x] | Core catalog |
| tickets / orders | [x] | [x] | [x] | Checkout path |
| `hybrid_search_events` | [x] | [x] | [x] | PG vector |
| `discovered_events` | [ ] | — | — | SAN-123 |
| venue offerings | [ ] | — | — | SAN-492 |
| analytics | [ ] | — | — | Future |

### Edge functions

- [x] `approval-commit` — Vitest 9/9
- [x] `ticket-payment-webhook` — Vitest pass
- [ ] Discovery approval edge path
- [ ] Prod evidence in SAN-115 ledger

### Vitest floor

- [x] `npm test -- --run event` — 97/97
- [x] `approval-commit` — 9/9
- [x] `grounding` — 25/25
- [x] `host-events` — 1/1

---

## Phase 6 — Event marketing system

| Page | Spec | Wireframe | Linear | Built |
|------|------|-----------|--------|-------|
| `/host` | PAGE-M01 | host-wireframe.html | SAN-660 | [ ] |
| `/events` | PAGE-002 | SCREEN-027 | SAN-518 | [x] |
| `/sponsors` | PAGE-M07 | sponsors-wireframe | SAN-664 | [ ] |
| `/business/event-marketing` | PAGE-M08 | — | SAN-701 | [ ] |
| Partner signup | — | — | SAN-723 | [x] |

- [ ] Lead capture forms audited
- [ ] CRM follow-up flows (SAN-516, SAN-132)
- [ ] Social distribution roadmap (Postiz/OpenClaw) — EVP-030+

---

## Phase 7 — WhatsApp & chat commerce

- [ ] Classify each flow: MVP / Phase 2 / Phase 3
- [ ] Discover events via WA — Phase 2
- [ ] Buy tickets via WA — Phase 3
- [ ] QR delivery via WA — Phase 3
- [ ] Chatwoot integration audit — deferred

---

## Phase 8 — Missing screens & dashboards

### Consumer — verify spec + route

- [x] Home `/` — PAGE-001
- [x] Chat `/chat` — PAGE-001
- [x] Browse `/events` — PAGE-002
- [x] Detail `/events/[slug]` — PAGE-003
- [x] Wallet `/me/tickets` — PAGE-004
- [x] Ticket QR `/me/tickets/[id]` — PAGE-005

### Host

- [x] Create `/host/event/new` — PAGE-006
- [x] Events `/host/events` — PAGE-007
- [ ] Analytics `/host/analytics` — PAGE-M02 / SAN-729
- [ ] Marketing `/host` — PAGE-M01
- [ ] Dashboard tab — PAGE-M03 / SAN-690

### Admin

- [ ] `/admin/events` — PAGE-M04
- [ ] `/admin/bookings` — PAGE-M05
- [ ] `/admin/leads` — PAGE-M06
- [ ] Discovery queue — PAGE-M09 / SAN-129
- [ ] Sponsor CRM — PAGE-M10 / SAN-132

- [x] Missing screen matrix in [`event-pages.md`](../event-pages.md)

---

## Phase 9 — Linear validation

- [x] All EVP-001–047 + G3 map to SAN-115–150 + SAN-366
- [x] UI spec pack maps to Linear ([`LINEAR-COVERAGE.md`](../specs/LINEAR-COVERAGE.md))
- [x] Venue SAN-492–514 on Events Platform
- [x] Gaps filed: SAN-729,730,731,732
- [ ] Move CTEST SAN-532–544 off Events Platform
- [x] Implementation order documented ([`events-order.md`](../../notes/events/events-order.md))

### MVP order (verified)

1. [x] Discovery in chat — SAN-117
2. [x] Detail + commerce — disk LIVE
3. [x] Ticketing + wallet — disk LIVE
4. [x] Host publish — SAN-366
5. [x] Host list — SAN-118
6. [ ] **Launch ledger — SAN-115** ← P0 exit gate

### Growth order (post-MVP)

1. [ ] Luma UX — SAN-135 (In Review)
2. [ ] UI polish — SAN-730, SAN-731
3. [ ] Discovery approval — SAN-128, SAN-129
4. [ ] Admin tools — SAN-515+
5. [ ] Host analytics — SAN-729
6. [ ] Venue booking — SAN-492+
7. [ ] Sponsors — SAN-664, SAN-132
8. [ ] WhatsApp — SAN-147+
9. [ ] Social automation — SAN-133+

---

## Phase 10 — Fix pass ([`02-fix.md`](02-fix.md))

### 10.1 Spec correctness

- [x] Every PAGE/OVL spec has route, persona, Linear, acceptance criteria
- [x] No duplicate task ownership (UX vs EP documented)
- [x] MVP scope creep flagged (venue/admin not in MVP)
- [ ] All UX canonical issues link to spec paths in Linear descriptions

### 10.2 Task flow / PR order

- [ ] **PR-1** SAN-730 — enable `/host/events` nav
- [ ] **PR-2** SAN-731 — detail a11y + loading skeleton
- [ ] **PR-3** SAN-135 — Luma hero + host block
- [ ] **PR-4** SAN-732 — docs + drift fixes
- [ ] **PR-5** SAN-115 — launch proof ledger

### 10.3 Live page verification (code vs spec)

| Route | loading | empty | error | mobile | a11y | tests |
|-------|---------|-------|-------|--------|------|-------|
| `/events` | partial | [x] | [x] | [x] | partial | SCREEN-027 |
| `/events/[slug]` | [ ] | [x] | [x] | [x] | [ ] alt | SCREEN-014 |
| `/host/event/new` | [x] | [x] | partial | [x] | [x] | SCREEN-016 |
| `/host/events` | [ ] | [x] | [x] | [x] | [x] | 016b only |
| `/me/tickets` | [x] | [x] | [x] | [x] | [x] | SCREEN-015 |
| `/me/tickets/[id]` | [x] | — | partial | [x] | partial | partial |

### 10.4 Diagrams (`specs/DIAGRAMS.md`)

- [x] Events UI route map
- [x] Buyer ticket journey
- [x] Host publish journey
- [x] Admin discovery approval (future)
- [x] Venue booking (future)

### 10.5 Test matrix

| Layer | Command / spec | Linear | Status |
|-------|----------------|--------|--------|
| Vitest events | `npm test -- --run event` | — | [x] 97/97 |
| Vitest approval | `npm test -- --run approval-commit` | SAN-366 | [x] 9/9 |
| Vitest host list | `npm test -- --run host-events` | SAN-118 | [x] 1/1 |
| Playwright cards | SCREEN-006 | SAN-117 | [ ] flake |
| Playwright browse | SCREEN-027 | SAN-518 | [ ] refresh |
| Playwright detail | SCREEN-014 | SAN-237 | [ ] |
| Playwright host | SCREEN-016/016b | SAN-240 | partial |
| Prod smoke | `chat-smoke.mjs` | SAN-115 | [x] events / [ ] copilotkit 401 |
| a11y | hero alt, focus rings | SAN-731 | [ ] |
| Mobile | bottom buy bar, nav | — | [x] detail |

### 10.6 Deliverables checklist

- [x] Executive summary — [`index-events.md`](../index-events.md)
- [x] Feature matrix — Phase 1 table (this file)
- [x] Missing task matrix — [`PLANNING-VERIFICATION.md`](../PLANNING-VERIFICATION.md)
- [x] Missing screen matrix — [`event-pages.md`](../event-pages.md)
- [x] Missing workflow matrix — [`specs/DIAGRAMS.md`](../specs/DIAGRAMS.md)
- [x] Missing schema matrix — Phase 5 above
- [x] AI agent matrix — Phase 3 above
- [x] Mermaid diagrams — [`specs/DIAGRAMS.md`](../specs/DIAGRAMS.md)
- [x] Linear structure + order — [`events-order.md`](../../notes/events/events-order.md)
- [x] Top 25 priorities — [`index-events.md`](../index-events.md) § Top 25

---

## Readiness scores (2026-06-08)

| Dimension | % | Grade |
|-----------|--:|-------|
| **MVP readiness** | 72% | C+ — code shipped; ledger blocks sign-off |
| **Production readiness** | 55% | D+ — prod smoke partial; no G1 proof |
| **UX readiness** | 68% | C — core loop OK; Luma/admin missing |
| **AI readiness** | 90% | A- — agents + tools LIVE |
| **Planning completeness** | 95% | A — Linear ↔ local mapped |

**Confidence score:** **82/100** — planning and specs are implementation-ready; execution ~38% overall.

---

## Sign-off gate

Audit checklist is **complete for planning** when:

- [ ] SAN-115 ledger file exists with prod evidence
- [ ] PR-1 through PR-4 merged or explicitly deferred
- [ ] CTEST issues moved off Events Platform
- [x] `specs/DIAGRAMS.md` published
- [ ] Playwright SCREEN-006 + 027 green with dev server

**Next run:** After each PR merge, re-check Phase 10.3 row for touched routes only.
