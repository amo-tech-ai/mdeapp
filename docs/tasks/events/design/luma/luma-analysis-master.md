---
title: Luma Platform Analysis — Master Document
date: 2026-06-08
status: active
prompt_source: ./01-prompt-luma.md
wireframes: ./02-wireframe-prompts.md
diagrams: ./03-diagrams.md
screenshots: /home/sk/mdeai/screenshots/luma
ux_review: ../../docs/luma-inspired-event-ux-review.md
---

# Luma Platform Analysis — Master Document

**Verdict:** Luma wins on **social proof before arrival** — host personality, attendee visibility, vibe, and community continuity. mdeai should copy the **emotional layout**, not the stack, then exceed with **AI concierge + Medellín map intelligence**.

**Evidence base:** Screenshot filenames in [`01-prompt-luma.md`](01-prompt-luma.md) · existing [`luma-inspired-event-ux-review.md`](luma-inspired-event-ux-review.md) · mdeapp disk audit 2026-06-08.

---

## 1. Executive summary

| Dimension | Luma | mdeai today | Gap |
|-----------|------|-------------|-----|
| Discovery | City/category feeds, calendars | Chat cards + `/events` browse | Luma browse polish; mdeai AI stronger |
| Event detail | Hero, host, guests, community | Commerce-first detail | EVP-032 / SAN-135 |
| Checkout | Simple Stripe-style pay | Stripe modal LIVE | Parity OK |
| Host OS | Tabbed dashboard + insights | Wizard LIVE; list LIVE; analytics missing | `hostOpsAgent` + PAGE-M02 |
| AI | Minimal native AI | Mastra + CopilotKit LIVE | mdeai advantage |
| Community | Recurring groups, blasts | Not built | EVP-044+ |

---

## 2. Screen inventory

| Screen | Purpose | Primary user | Luma screenshot | mdeai status |
|--------|---------|--------------|-----------------|--------------|
| Discover | Find events by city/category | Camila | `Events-discover-1.png`, `Events-medelin1.png` | 🟢 chat; 🟡 browse |
| Event list | Calendar/list views | Andrés | `Events-list-1.png` | 🟢 `/events` |
| Event detail | Convert browse → RSVP | Camila, Andrés | `Events-details-1.png`, `E-1.png` | 🟡 commerce only |
| Checkout | Pay for ticket | Andrés | `Events-pay.png` | 🟢 Stripe |
| Profile / Me | Hosting + attending history | Andrés, Roberto | `Events-profile.png`, `me-1`–`me-6` | 🟢 tickets; 🟢 host list |
| Host overview | Event list + quick stats | Roberto | me-* host views | 🟢 `/host/events` |
| Guests | CRM table, check-in | Roberto | host guests tab | ⚪ |
| Registration | Form fields, tiers, limits | Roberto | host registration | 🟡 wizard |
| Blasts | Email/SMS to guests | Roberto | host blasts | ⚪ |
| Insights | Revenue, funnel, sources | Roberto | host insights | ⚪ SAN-729 |
| Settings | Event + org settings | Roberto | host settings | ⚪ |
| Community | Group identity on event | Camila | event community block | ⚪ EVP-044 |

Per-screen wireframes: [`screens/`](./screens/) · index: [`02-wireframe-prompts.md`](02-wireframe-prompts.md).

---

## 3. UX review — what Luma does well

1. **Mobile-first hero** — one scroll to trust (image, title, date, host, price).
2. **Attendee visibility** — “who’s going” reduces solo-anxiety.
3. **Host as person** — not a logo; bio + social links.
4. **Vibe before venue** — tags sell the night, not just the address.
5. **Sticky register** — CTA always reachable.
6. **Location reveal** — neighborhood public; exact address after RSVP (premium feel).
7. **Host OS tabs** — predictable mental model: Overview → Guests → Insights.

**mdeai additions:** AI “should I go?”, map pins, nearby after-party, Medellín safety/transit cards.

---

## 4. Layout patterns

### Consumer mobile stack (Luma)

```text
[Hero 16:9]
[Title + host + datetime]
[Vibe chips]
[Register CTA]
[About]
[Guests preview]
[Location map]
[Sticky bar]
```

### mdeai target — see PAGE-003b

[`../../specs/pages/PAGE-003b-event-detail-luma.md`](PAGE-003b-event-detail-luma.md)

### Host dashboard (Luma)

```text
[Event selector dropdown]
[Tab: Overview | Guests | Registration | Blasts | Insights | Settings]
[Tab content — table or KPI cards]
[Optional: compose blast / export CSV]
```

### mdeai host target

```text
/host/events        — list (LIVE)
/host/analytics     — KPI + Copilot (planned)
/host/event/new     — wizard (LIVE)
```

---

## 5. Information architecture

See [`03-diagrams.md` §1–2](03-diagrams.md) for Mermaid sitemaps (Luma vs mdeai).

---

## 6. User journeys

| Persona | Journey | Diagram |
|---------|---------|---------|
| Camila | Discover → detail → register → attend | [`03-diagrams.md` §4](03-diagrams.md) |
| Andrés | Find paid event → Stripe → QR | [`03-diagrams.md` §5](03-diagrams.md) |
| Roberto | Create → publish → guests → analyze | [`03-diagrams.md` §6](03-diagrams.md) |

---

## 7. Host workflows

| Step | Luma | mdeai |
|------|------|-------|
| Create | Web form + duplicate event | AI wizard + HITL (`hostEventAgent`) |
| Configure tiers | Registration tab | `add_ticket_tier` in wizard |
| Invite | Share link + blasts | Share link LIVE; blasts post-MVP |
| Check-in | Guest list + scan | QR wallet LIVE; staff scan post-MVP |
| Analyze | Insights charts | **`hostOpsAgent`** + PAGE-M02 |

---

## 8. Ticketing workflows

| Step | Owner | mdeai |
|------|-------|-------|
| Tier definition | Host | Supabase `ticket_tiers` |
| Inventory | DB | RLS + atomic decrement |
| Checkout | Stripe | `/api/tickets/checkout` LIVE |
| Fulfillment | Webhook | ticket row + QR |
| Refund | Host/admin | post-MVP |

---

## 9. Marketing workflows (Luma blasts)

| Capability | Luma | mdeai phase |
|------------|------|-------------|
| Email blast to guests | Native | Phase 3 — draft via AI, send HITL |
| SMS | Native | Phase 3 — WhatsApp opt-in only |
| Social | Share OG image | Postiz post-MVP |

---

## 10. CRM workflows

Luma Guests tab = lightweight CRM: name, email, ticket tier, check-in status, notes.

mdeai MVP: export CSV from Supabase; full CRM post-MVP (sponsor CRM-lite in PRD).

---

## 11. AI opportunities

| Agent | Luma gap | mdeai tool/workflow |
|-------|----------|---------------------|
| Concierge | No chat discovery | `conciergeAgent` + `search_events` 🟢 |
| Host create | Manual forms | `hostEventAgent` + HITL 🟢 |
| Host ops | Basic charts only | **`hostOpsAgent`** + `salesInsightWorkflow` 🔴 |
| Marketing | Template emails | `marketingAgent` Phase 3 |
| Venue | Manual venue pick | `venueShortlistWorkflow` SAN-500 |
| Sponsor | None | `sponsorAgent` Phase 2 |

---

## 12. mdeai mapping table

| Luma feature | mdeai equivalent | Status | Linear |
|--------------|------------------|--------|--------|
| Discover feed | `/events` + chat cards | 🟢 | SAN-117 |
| Event detail hero | `/events/[slug]` | 🟡 | SAN-135 |
| Vibe tags | `EventVibeTags` | ⚪ | SAN-136, EVP-033 |
| AI summary | `EventAiSummary` | ⚪ | EVP-033 |
| Ask host | `EventAskHost` | ⚪ | EVP-034 |
| Attendee strip | `EventAttendeeStrip` | ⚪ | EVP-035 |
| Map nearby | `EventDetailMap` | ⚪ | EVP-036 |
| Checkout | Stripe modal | 🟢 | SAN-248 |
| Wallet QR | `/me/tickets` | 🟢 | — |
| Host wizard | `/host/event/new` | 🟢 | SAN-366 |
| Host list | `/host/events` | 🟢 | SAN-118 |
| Host insights | `/host/analytics` | ⚪ | SAN-729 |
| Blasts | — | ⚪ | SAN-660+ |
| Community link | event section | ⚪ | EVP-044 |

---

## 13. Missing screens (mdeai should add)

| Screen | User | Priority | Phase |
|--------|------|----------|-------|
| Host analytics + AI copilot | Roberto | P0 | MVP 1.5 |
| Event marketing drafts | Roberto | P1 | Growth |
| Sponsor dashboard | Patricia | P2 | Advanced |
| Discovery review queue | Patricia | P2 | EVP-015 |
| Staff check-in | Venue staff | P2 | post-MVP |
| Live event updates feed | Camila | P2 | EVP-046 |

---

## 14. Recommended roadmap

```text
1. EVP-032 — Luma detail layout (hero, host, placeholders)
2. EVP-033–035 — vibe, AI summary, attendees
3. hostOpsAgent + /host/analytics (Phase 1.5)
4. EVP-036–037 — map + decision concierge
5. EVP-044–046 — community, live updates
6. Blasts + sponsor CRM — post-MVP
```

Full Gantt: [`03-diagrams.md` §9](03-diagrams.md).

---

## 15. Feature tables

### Top 25 Luma features (copy-worthy)

| # | Feature |
|---|---------|
| 1 | Mobile hero + sticky CTA |
| 2 | Host avatar + bio block |
| 3 | Attendee count + avatars |
| 4 | Vibe / category chips |
| 5 | Clean datetime + timezone |
| 6 | Neighborhood-first location |
| 7 | Map embed on detail |
| 8 | Share link + OG preview |
| 9 | Calendar add (.ics) |
| 10 | Guest list for hosts |
| 11 | Registration form builder |
| 12 | Free + paid tiers |
| 13 | Waitlist |
| 14 | Check-in from guest list |
| 15 | Email blasts |
| 16 | Insights: registrations over time |
| 17 | Insights: revenue |
| 18 | Duplicate event |
| 19 | Co-hosts |
| 20 | Community branding on event |
| 21 | City discovery pages |
| 22 | Category browse |
| 23 | Profile: hosting vs attending |
| 24 | Past events archive |
| 25 | Simple onboarding for hosts |

### Top 25 mdeai should copy (MVP subset)

First 12 from above + **ticket Stripe flow** + **AI wizard** + **map pins in chat** — see EVP-032–035.

### Top 25 AI enhancements (mdeai-only)

| # | Enhancement |
|---|-------------|
| 1 | “Should I go?” concierge |
| 2 | AI vibe tag generation |
| 3 | AI event summary |
| 4 | Ask Host with draft answers |
| 5 | Audience breakdown inference |
| 6 | Compatibility score |
| 7 | Nearby café/bar after-party |
| 8 | Safety/transit Medellín cards |
| 9 | hostOpsAgent sales Q&A |
| 10 | Pricing suggestions (HITL) |
| 11 | Marketing blast drafts |
| 12 | Sponsor fit scoring |
| 13 | Venue shortlist workflow |
| 14 | Night itinerary builder |
| 15 | Icebreaker prompts |
| 16 | Live schedule AI updates |
| 17 | Grounded web discovery queue |
| 18 | WhatsApp circle suggestions |
| 19 | Post-event follow-up email draft |
| 20 | Attendee networking matches |
| 21 | Host analytics narrative |
| 22 | Fraud/refund risk flags |
| 23 | Multilingual host replies (Phase 2) |
| 24 | Trip save from event |
| 25 | Map-based event comparison |

---

## Related

- [`02-wireframe-prompts.md`](02-wireframe-prompts.md) — per-screen specs
- [`../../events-roadmap.md`](events-roadmap.md)
- [`../../docs/01a-copilotkit-mastra-plan.md`](01a-copilotkit-mastra-plan.md)
