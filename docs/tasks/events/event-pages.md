---
title: Events — screens, pages & dashboards inventory
updated: 2026-06-08
canonical_audit: ./pages-ui-inventory.md
audit_checklist: ./prompts/03-checklist.md
spec_pack: ./specs/INDEX.md
diagrams: ./specs/DIAGRAMS.md
sitemap: ../../sitemap.md
summary: ./summary.md
full_tracker: ./index-events.md
design_inventory: ../design/DESIGN-INVENTORY.md
---

> **Run audit:** [`prompts/03-checklist.md`](03-checklist.md) · **Prompts:** [`01--events-prompt.md`](./prompts/01--events-prompt.md) · [`02-fix.md`](./prompts/02-fix.md)  
> **Canonical forensic audit + spec pack:** [`pages-ui-inventory.md`](./pages-ui-inventory.md) · [`specs/INDEX.md`](./specs/INDEX.md)

# Events — pages & UI inventory

**One line:** **8 live routes** cover the core loop (find → detail → buy → host → wallet). **12+ surfaces** are still missing — mostly marketing landings, Patricia admin queues, Luma-style detail, and venue-booking flows.

**Status legend:** 🟢 Live · 🟡 Partial (works, gaps) · ⚪ Not built · 🔵 Shell/placeholder only

---

## Summary — what you can do on mdeai today

| Persona | Real-world action | Where | Status |
|---------|-------------------|-------|--------|
| **Camila** | *"Salsa this weekend"* → event cards in chat | `/` or `/chat` | 🟢 |
| **Tourist / Andrés** | Browse events without chat | `/events` | 🟢 |
| **Andrés** | Open event → buy ticket | `/events/[slug]` + checkout modal | 🟢 |
| **Andrés** | Show QR at door | `/me/tickets/[id]` | 🟢 |
| **Roberto** | Create event in plain English → approve | `/host/event/new` | 🟢 |
| **Roberto** | See his published events | `/host/events` | 🟢 |
| **Patricia** | Moderate events / approve venue requests | `/admin/events` | ⚪ |
| **Sponsor** | Learn about event sponsorship | `/sponsors` | ⚪ |

**Coverage:** **8 / ~20** planned event-facing routes are live (**~40%**). Overlays (cards, HITL, checkout modal) add **5 more shipped UI surfaces**.

**Known UX gap:** Host sidebar **Events** link disabled — fix tracked as [SAN-730](https://linear.app/sanjiovani/issue/SAN-730).

---

## Representation matrix — MVP & future capabilities

Verify every surface appears in planning artifacts (Phase 1 audit):

| Surface group | Linear | PRD | Spec | Wireframe | Route/code | Tests |
|---------------|--------|-----|------|-----------|------------|-------|
| Consumer routes (8) | ✅ UX+EP | ✅ | PAGE-001–005 | ✅ | 🟢 8/8 live | 🟡 partial |
| Host routes (5) | ✅ | ✅ | PAGE-006/007, M01–02 | ✅ | 🟢 2/5 live | 🟡 |
| Overlays (6) | ✅ | ✅ | OVL-001–005 | ✅ | 🟢 4/6 | 🟡 |
| Admin (5) | ✅ | ✅ | PAGE-M04–06, M09–10 | partial | ⚪ 0/5 | ⚪ |
| Marketing (5) | ✅ Partners | ✅ | PAGE-M01,M07,M08 | ✅ HTML | 🟢 1/5 | ⚪ |
| Venue booking (11) | ✅ SAN-492–514 | ✅ | VEN-001–007 | SAN-510–514 | ⚪ | ⚪ |
| Luma upgrades (9) | ✅ SAN-135–150 | ✅ | PAGE-003b | 003-wire | 🟡 1/9 | ⚪ |
| Discovery workflows | ✅ SAN-119–131 | ✅ | EVP-015–028 | 003-discovery | stub | ⚪ |

**Gaps:** Implementation lags planning for admin, marketing, venue, discovery — not missing from Linear/specs.

---

## 1. Consumer pages (public + logged-in)

| Route | Screen / wire | Persona example | Status | % | ✅ What exists | ⚠️ Missing / polish |
|-------|---------------|-----------------|--------|--:|----------------|---------------------|
| `/` | SCREEN-001 home | Camila asks for events in hero chat | 🟢 | 95% | Chat + event cards + map pins | — |
| `/chat` | Same shell as `/` | Full concierge workspace | 🟢 | 95% | Geo chat shell, tool renders | — |
| `/events` | [SCREEN-027](../screens/SCREEN-027-events-browse.md) | Andrés filters *this weekend · music · Laureles* | 🟢 | 90% | `events/page.tsx`, filters, `EventBrowseView`, nav links enabled | Playwright evidence refresh; spec still said "missing" |
| `/events/[slug]` | SCREEN-014 · [003-wire](../wireframes/003-wire-event-detail-page.md) | Opens *Manda MoorFLOW – Live* → ticket tiers | 🟡 | 70% | Commerce layout, tiers, sticky buy, checkout modal | Luma layout ([SAN-135](https://linear.app/sanjiovani/issue/SAN-135)): vibe, host, attendees, map |
| `/me/tickets` | SCREEN-015 · [015-wire](../wireframes/015-wire-my-tickets-qr.md) | Andrés sees upcoming + past orders | 🟢 | 90% | Wallet list, auth gate | — |
| `/me/tickets/[id]` | SCREEN-015 | QR code scanned at venue door | 🟢 | 90% | Single ticket + QR | — |
| `/login` · `/signup` | — | Roberto signs in before host wizard | 🟢 | 100% | Auth for host + buyer | — |
| `/trips` · `/trips/[id]` | — | Add confirmed event booking to trip ([SAN-503](https://linear.app/sanjiovani/issue/SAN-503)) | 🟡 | 20% | Trips shell exists | Event booking → trip not wired |

---

## 2. In-chat & overlay UI (not full routes)

| Surface | Component | Persona example | Status | % | ✅ Confirmed | ⚠️ Missing |
|---------|-----------|-----------------|--------|--:|-------------|------------|
| Event card in chat | `event-card.tsx` (SCREEN-006) | Card with **Buy** + **Details** after search | 🟢 | 100% | `data-testid="event-card"` | — |
| Event detail sheet | `venue-detail-sheet` + `event-venue-detail-body` | Tap card pin → slide-over detail in map column | 🟢 | 85% | Event body in sheet | Full Luma sections |
| Host HITL approval | `event-publish-approval-panel` | Roberto reviews AI draft before publish | 🟢 | 95% | `renderAndWaitForResponse` | — |
| Ticket checkout modal | `booking-checkout-modal` | Andrés picks tier → Stripe session | 🟢 | 90% | Modal on detail page | Prod paid-ticket proof (EVP-001) |
| Web citation (discovery) | `event-web-citation-fetch` | Camila sees cited web sources in chat | 🟡 | 30% | Fetch hook + API | Save-after-approval UI ([SAN-128](https://linear.app/sanjiovani/issue/SAN-128)) |
| Discovery cards + save | EVP-025 / SAN-128 | Patricia approves scraped event before DB write | ⚪ | 0% | Spec only | Full CopilotKit discovery UI |

---

## 3. Host pages & dashboards (Roberto)

| Route | Screen / wire | Persona example | Status | % | ✅ Confirmed | ⚠️ Missing |
|-------|---------------|-----------------|--------|--:|-------------|------------|
| `/host/event/new` | SCREEN-016 · [004-wire](../wireframes/004-wire-host-event-wizard.md) | *"Jazz night Friday, 200 cap, El Poblado"* | 🟢 | 95% | CopilotKit wizard + `hostEventAgent` | Venue step ([SAN-500](https://linear.app/sanjiovani/issue/SAN-500)) |
| `/host/events` | EVP-014 · [EVP-014-wire](../wireframes/EVP-014-wire-host-events-list.md) | List of Roberto's drafts + published events | 🟢 | 88% | Server page, RLS, `HostEventsGrid` | [SAN-730](https://linear.app/sanjiovani/issue/SAN-730) nav link; Playwright spec |
| `/host/analytics` | PAGE-M02 | Roberto sees ticket sales KPIs | ⚪ | 0% | Nav item exists (disabled) | [SAN-729](https://linear.app/sanjiovani/issue/SAN-729) |
| `/host` | [SAN-660](https://linear.app/sanjiovani/issue/SAN-660) | Marketing: *"Host events in Medellín with AI"* | ⚪ | 0% | Wireframe HTML only | Landing page route |
| `/dashboard` (host tab) | [SAN-690](https://linear.app/sanjiovani/issue/SAN-690) | Unified partner dashboard — Events + Bookings tabs | ⚪ | 0% | Spec in `tasks/partners/06-dashboards.md` | Entire `/dashboard` shell |

---

## 4. Marketing & growth pages (events vertical)

| Route | Linear | Persona example | Status | Wireframe |
|-------|--------|-----------------|--------|-----------|
| `/host` | [SAN-660](https://linear.app/sanjiovani/issue/SAN-660) | Host signup funnel from Google ad | ⚪ | `host-wireframe.html` |
| `/sponsors` | [SAN-664](https://linear.app/sanjiovani/issue/SAN-664) | Brand learns sponsorship packages | ⚪ | `sponsors-wireframe.html` (shell planned) |
| `/business/event-marketing` | [SAN-701](https://linear.app/sanjiovani/issue/SAN-701) | Agency services for event promotion | ⚪ | — |
| `/partners/signup?type=host` | [SAN-723](https://linear.app/sanjiovani/issue/SAN-723) | Roberto onboards as event host partner | 🟢 | Live MVP picker + wizard |
| `/contests` | [SAN-694](https://linear.app/sanjiovani/issue/SAN-694) | Event/contest crossover (separate track) | ⚪ | Backlog |

---

## 5. Admin & ops (Patricia)

| Route | Linear | Persona example | Status | Notes |
|-------|--------|-----------------|--------|-------|
| `/admin/events` | [SAN-515](https://linear.app/sanjiovani/issue/SAN-515) | Patricia moderates flagged events | ⚪ | No `page.tsx` under `mdeapp/src/app/admin/` |
| `/admin/bookings` | [SAN-502](https://linear.app/sanjiovani/issue/SAN-502) / [SAN-514](https://linear.app/sanjiovani/issue/SAN-514) | Approve Mamacita venue proposal for Roberto | ⚪ | Wire spec EVT-055 only |
| `/admin/leads` | [SAN-516](https://linear.app/sanjiovani/issue/SAN-516) | CRM for inbound host/sponsor leads | ⚪ | Shared ops surface |
| Discovery approval queue | [SAN-129](https://linear.app/sanjiovani/issue/SAN-129) | Approve web-scraped event before publish | ⚪ | Reuse HITL pattern — no admin UI yet |
| Sponsor CRM-lite | [SAN-132](https://linear.app/sanjiovani/issue/SAN-132) | Draft sponsor proposal for an event | ⚪ | EVP-029 — no UI |

---

## 6. Venue booking UI (SAN-492→514)

Specs: [`specs/venue-booking/`](./specs/venue-booking/) (VEN-001–007) · Diagram: [`specs/DIAGRAMS.md`](./specs/DIAGRAMS.md)

| Surface | Linear | Persona example | Status |
|---------|--------|-----------------|--------|
| Restaurant card **Event Venue** CTA | [SAN-494](https://linear.app/sanjiovani/issue/SAN-494) | Tourist sees *Book this space for your event* on Mamacita card | ⚪ |
| Event offerings panel | [SAN-495](https://linear.app/sanjiovani/issue/SAN-495) | Packages: dinner + DJ + capacity | ⚪ |
| Request proposal modal (HITL) | [SAN-496](https://linear.app/sanjiovani/issue/SAN-496) | Roberto requests quote → Patricia approves | ⚪ |
| AI venue match panel | [SAN-498](https://linear.app/sanjiovani/issue/SAN-498) | *Best rooftops for 80 guests in Provenza* | ⚪ |
| Compare venues side-by-side | [SAN-499](https://linear.app/sanjiovani/issue/SAN-499) | Roberto picks between two restaurants | ⚪ |
| Host wizard **venue step** | [SAN-500](https://linear.app/sanjiovani/issue/SAN-500) | Wizard step: pick or search venue | ⚪ |
| Wire: offerings + CTA | [SAN-510](https://linear.app/sanjiovani/issue/SAN-510) | Design-only | ⚪ wire |
| Wire: proposal modal | [SAN-511](https://linear.app/sanjiovani/issue/SAN-511) | Design-only | ⚪ wire |
| Wire: venue match + compare | [SAN-512](https://linear.app/sanjiovani/issue/SAN-512) | Design-only | ⚪ wire |
| Wire: host wizard venue step | [SAN-513](https://linear.app/sanjiovani/issue/SAN-513) | Design-only | ⚪ wire |
| Wire: admin booking queue | [SAN-514](https://linear.app/sanjiovani/issue/SAN-514) | Design-only | ⚪ wire |

---

## 7. Post-MVP event page upgrades (Luma layer)

From [luma-inspired UX review](luma-inspired-event-ux-review.md) — all **⚪** except base detail page.

| Feature on `/events/[slug]` | Task | Example | Status |
|----------------------------|------|---------|--------|
| Hero + host block | [SAN-135](https://linear.app/sanjiovani/issue/SAN-135) EVP-032 | *Hosted by Medellín Tech Collective* | 🟡 In Review |
| Vibe tags + AI summary | [SAN-136](https://linear.app/sanjiovani/issue/SAN-136) | *Startup · Networking · Casual dress* | ⚪ |
| Ask Host Q&A | [SAN-137](https://linear.app/sanjiovani/issue/SAN-137) | *Is parking available?* | ⚪ |
| Attendee avatars / breakdown | [SAN-138](https://linear.app/sanjiovani/issue/SAN-138) | *42 going · 12 from your network* | ⚪ |
| Community map + nearby | [SAN-139](https://linear.app/sanjiovani/issue/SAN-139) | Map + cafés after the event | ⚪ |
| Safety / transit / weather | [SAN-146](https://linear.app/sanjiovani/issue/SAN-146) | *Uber zone · rain at 9pm* | ⚪ |
| WhatsApp / community links | [SAN-147](https://linear.app/sanjiovani/issue/SAN-147) | Host-posted WA group link | ⚪ |
| Live updates feed | [SAN-149](https://linear.app/sanjiovani/issue/SAN-149) | *Doors open — room on the left* | ⚪ |
| Live chat / networking rooms | [SAN-142](https://linear.app/sanjiovani/issue/SAN-142) | In-event chat (post-MVP) | ⚪ |

---

## 8. Coverage snapshot

| Group | Total surfaces | 🟢 Live | 🟡 Partial | ⚪ Missing |
|-------|---------------:|--------:|-----------:|-----------:|
| Consumer routes | 8 | 6 | 2 | 0 |
| Chat / overlays | 6 | 4 | 1 | 1 |
| Host routes | 5 | 2 | 0 | 3 |
| Marketing | 5 | 1 | 0 | 4 |
| Admin / ops | 5 | 0 | 0 | 5 |
| Venue booking UI | 11 | 0 | 0 | 11 |
| Luma detail upgrades | 9 | 0 | 1 | 8 |
| **Total** | **49** | **13** | **4** | **32** |

**Rough UI completion:** **~35%** of planned event screens (core loop heavily weighted — that's the part that mostly works).

---

## 9. Priority build list (what's missing that matters most)

| Priority | Surface | Why | Linear |
|----------|---------|-----|--------|
| **P0** | Launch proof (not a page — evidence) | Sign-off before calling MVP done | [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) |
| **P1** | Enable `/host/events` in host nav rail | Roberto can't click Events in sidebar | [SAN-730](https://linear.app/sanjiovani/issue/SAN-730) |
| **P1** | Detail a11y + loading skeleton | Hero alt + perceived perf | [SAN-731](https://linear.app/sanjiovani/issue/SAN-731) |
| **P1** | Luma-style `/events/[slug]` | Biggest tourist-facing UX gap vs Luma | [SAN-135](https://linear.app/sanjiovani/issue/SAN-135) |
| **P1** | `/host` marketing landing | Host acquisition funnel | [SAN-660](https://linear.app/sanjiovani/issue/SAN-660) |
| **P2** | Discovery save UI in chat | Web events with human approval | [SAN-128](https://linear.app/sanjiovani/issue/SAN-128) |
| **P2** | `/admin/events` moderation | Patricia ops | [SAN-515](https://linear.app/sanjiovani/issue/SAN-515) |
| **P2** | `/dashboard` host module | Revenue, bookings, campaigns in one place | [SAN-690](https://linear.app/sanjiovani/issue/SAN-690) |
| **P3** | Venue booking modals + wizard step | Roberto books Mamacita for private event | [SAN-494→500](https://linear.app/sanjiovani/issue/SAN-494) |
| **P3** | `/sponsors` landing | Sponsor revenue track | [SAN-664](https://linear.app/sanjiovani/issue/SAN-664) |

---

## 10. Wireframes & SCREEN specs (reference)

| Spec | Path | Route |
|------|------|-------|
| Event discovery in chat | [003-wire-event-discovery.md](./wireframes/003-wire-event-discovery.md) | `/` in-thread |
| Event detail | [003-wire-event-detail-page.md](./wireframes/003-wire-event-detail-page.md) | `/events/[slug]` |
| Host wizard | [004-wire-host-event-wizard.md](./wireframes/004-wire-host-event-wizard.md) | `/host/event/new` |
| My tickets + QR | [015-wire-my-tickets-qr.md](./wireframes/015-wire-my-tickets-qr.md) | `/me/tickets` |
| Host events list | [EVP-014-wire-host-events-list.md](./wireframes/EVP-014-wire-host-events-list.md) | `/host/events` |
| Events browse | [SCREEN-027](../screens/SCREEN-027-events-browse.md) | `/events` |
| Done SCR archive | [archive/events-A/wireframes/](../../archive/events-A/wireframes/) | SCREEN-006, 014, 015, 016 |

---

## Related docs

- **Audit checklist:** [`prompts/03-checklist.md`](03-checklist.md)
- **Flow diagrams:** [`specs/DIAGRAMS.md`](./specs/DIAGRAMS.md)
- Plain summary: [summary.md](./summary.md)
- Full task tracker: [index-events.md](./index-events.md)
- Planning verification: [PLANNING-VERIFICATION.md](./PLANNING-VERIFICATION.md)
- All marketing pages: [../design/website-pages.md](../design/website-pages.md)
- Live route map: [sitemap.md](../../sitemap.md)

**Bottom line:** mdeai already has the **full money path** as real pages — browse, detail, checkout, wallet, host wizard, host list. What's missing is ** prettier event pages**, **marketing landings**, **Patricia admin**, and the **venue-booking** UI layer — none of which block the core loop today.
