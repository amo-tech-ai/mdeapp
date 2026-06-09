# 06 — User & Operator Dashboards

Covers **#13 User saved places / personal dashboard**, **#20 AI memory & personalization**, **#15 Broker / venue dashboard**, **#16 Admin operations dashboard**. Shared components → [00-foundations.md](00-foundations.md). User-facing surfaces are MVP-adjacent; operator surfaces (#15, #16) are **Post-MVP** per [`docs/roadmap.md`](../../../docs/roadmap.md) (Patricia/admin = W8, broker self-serve = Advanced).

> Principle: dashboards are **views over the same Supabase truth** the chat writes to (`leads`, `saved_places`, `tickets`, `listings`, `ai_runs`). No new brain — just authenticated read/write surfaces with RLS. Operator screens add HITL (approve/takeover) on top of what the AI already drafted.

---

## #13 User saved places / personal dashboard  ·  `/me`  ·  persona: Camila + Tourist

**Goals:** one home for everything a logged-in (or phone-identified) user accumulated — Saved (♡), bookings (tickets/viewings), and a shortcut back into chat. The lightweight precursor to the full Trip workspace (#9).

### Desktop

```text
┌──────────────────────────────────────────────────────────────────┐
│ TopNav                                              Camila ◑      │
├──────────┬─────────────────────────────────────────────────────────┤
│ LEFT     │ Hi Camila 👋  ·  Medellín                                │
│ ◌ Chat   │ [Saved] [Bookings] [Alerts] [Profile]                    │ segmented tabs
│ ─ Saved  │ ── Saved (12) ──            Filter: [All▾][Rentals][Food] │
│  12      │ ┌rec① rental┐ ┌rec② café┐ ┌rec③ event┐                  │ saved card grid
│ ─ Trips  │ │$1,320 tot  │ │★4.6 ☕   │ │Fri 9pm  │                  │ (ResultCard compact)
│  · Jun   │ │[Schedule]♥ │ │[Add trip]│ │[Buy]♥   │                  │
│ ─ Tickets│ └────────────┘ └──────────┘ └─────────┘                  │
│  2       │  …grid continues…                                        │
│ ─ Profile│ ▣ from Google Maps · saved items keep their grounding    │
└──────────┴─────────────────────────────────────────────────────────┘
```

### Mobile: bottom-tab `Me`; segmented `[Saved][Bookings][Alerts]`; 1-col card list; tap → detail/`/chat`.

| Tab | Contents |
|---|---|
| Saved | ♡ bucket — all verticals, filterable; each card keeps its CTA (Schedule / Buy / Add to trip) + grounding |
| Bookings | tickets (QR → `/me/tickets/:id`), rental viewings (status: requested/confirmed), reservations (Post-MVP) |
| Alerts | opt-in saved searches ("new in Laureles ≤$1.5M", "salsa this weekend") — the re-engagement hook (Post-MVP) |
| Profile | name · phone · language · theme · learned prefs (→ #20) · sign-out; account optional, phone = identity |

**Monetization:** Saved → re-surfaced transactional CTAs; alerts drive return visits → bookings. **Retention:** this page *is* the retention object pre-Trip-workspace; "pick up where you left off" → resume thread. **States:** default grid · loading skeleton cards · **empty "Nothing saved yet — start a chat to find your spots →"** (CTA to `/chat`, never dead-end) · error retry banner keeping last-loaded items.

---

## #20 AI memory & personalization  ·  `/me/profile` (memory section)  ·  persona: Camila + Tourist

**Goals:** make the per-contact profile the AI builds **visible, editable, and trustworthy** — the user sees what mde "remembers" and can correct/delete it. Transparency turns memory from creepy into a feature (and is the GDPR-friendly posture).

```text
┌── WHAT MDE REMEMBERS ABOUT YOU ──────────────────────────────────┐
│ ℹ mde personalizes results from your chats. Edit or clear anytime. │
│                                                                    │
│ ── Neighborhoods you like ──   Laureles ✕   Envigado ✕   [+ add]   │ editable chips
│ ── Budget ──                   Rentals ≤ $1.5M/mo        ✎          │
│ ── Vibe / preferences ──       quiet · laptop-friendly · ☕  ✕      │
│ ── Languages ──                English                  ✎          │
│ ── Recent intents (last 5) ──  cafés to work · furnished studio …  │ read-only trace
│                                                                    │
│ [ Clear all memory ]   [ Pause personalization ]                   │ controls
│ ⓘ We never store payment details here. Profile = phone-scoped.     │ trust line
└────────────────────────────────────────────────────────────────────┘
```

### Mobile: same list, full-width rows; chips wrap; controls pinned at bottom.

| Element | Behavior |
|---|---|
| Memory chips | each learned attribute (neighborhood/budget/vibe/lang) editable + removable; writes back to `saved_places`/profile row |
| Recent intents | last N queries (read-only) — shows *why* recs are shaped this way (explainability) |
| Clear all | wipes the personalization profile (keeps bookings/tickets — those are records, not preferences) |
| Pause | toggle: AI stops personalizing, treats user as cold-start, without deleting |
| Trust line | explicit scope: phone-scoped, no payment data, editable — anti-creepy |

**How it feeds the brain:** profile attributes inject into the Mastra router's context so "find me a place" pre-fills neighborhood/budget/vibe. Editing here changes the *next* turn's grounding inputs, not the rendered past. **Monetization:** better personalization → higher booking conversion + smarter alerts. **Retention:** visible memory = "it knows me" stickiness (the GuideGeek-beats-cold-search advantage), made safe by control. **States:** default (populated) · empty "mde hasn't learned preferences yet — keep chatting" · saving spinner on edit · error "couldn't update — retry". **Avoid:** silent profiling with no off-switch; storing anything sensitive (payment, ID) in the preference profile.

---

## #15 Broker / venue dashboard  ·  `/host/*` (broker + venue)  ·  persona: broker (rentals) + venue/organizer (nightlife/events)  ·  **Post-MVP**

**Goals:** give supply-side partners a self-serve home to (a) see incoming **leads / reservations / ticket sales** the AI generated, (b) manage their **listings/events**, and (c) act on HITL items (confirm a viewing slot, approve an AI-drafted reply). Roberto's `/host/event/new` wizard (MVP) is the *create* path; this is the *manage* surface that grows around it.

### Desktop

```text
┌──────────────────────────────────────────────────────────────────┐
│ TopNav · Host                                       Roberto ◑     │
├──────────┬─────────────────────────────────────────────────────────┤
│ LEFT     │ ── This week ──                                          │
│ ─ Home   │ ┌Leads 8┐ ┌Viewings 3┐ ┌Tickets sold 124┐ ┌Revenue $3.1k┐│ KPI stat cards
│ ─ Listings│└───────┘ └──────────┘ └────────────────┘ └─────────────┘│
│ ─ Events │ ── Inbox (AI-handled, needs you) ──                      │
│ ─ Leads  │ ┌──────────────────────────────────────────────────┐    │
│ ─ Tickets│ │ ⚠ Hot lead · Studio Laureles · Camila · 2 slots  │    │ HITL queue
│ ─ Inbox  │ │   mde drafted: "Thu 3pm works…"  [Edit][Send][↪]  │    │ (draft+approve)
│ ─ Payouts│ ├──────────────────────────────────────────────────┤    │
│          │ │ ✔ Auto-resolved · "is parking included?" (logged) │    │
│          │ └──────────────────────────────────────────────────┘    │
│          │ ── Your listings ──  [+ New listing] [+ New event]       │
│          │ ┌Studio Laureles ✔Verified · 12 views · 3 leads  ✎⏸┐    │ listing rows
│          │ └Salsa Night Jun6 · 124/200 sold · ✔ live        ✎┘    │
└──────────┴─────────────────────────────────────────────────────────┘
```

### Mobile: KPI cards stack 2×2; Inbox = priority list; Listings = card list; create via FAB `[+]`.

| Section | Detail |
|---|---|
| KPIs | leads · viewings · tickets sold · revenue (period-scoped) — pulled from `leads`/`showings`/`tickets` |
| Inbox (HITL) | AI handles 90%; **hot lead / money / low-confidence** items surface with **AI-drafted reply** → broker `[Edit][Send]` or `[Takeover]` (Chatwoot model, mirrors WA handoff in [05](05-whatsapp-mobile.md)) |
| Listings | manage rentals: edit · pause · verified status · per-listing views/leads |
| Events | manage events: tiers · sold/cap · live/draft · edit (links Roberto's wizard) |
| Payouts | Stripe Connect balance + history (Advanced) |

**Monetization:** this is the supply retention engine — brokers/venues stay because leads + sales land here; commission/lead-fee accounting lives in Payouts. **Trust/HITL:** AI never *sends* money-adjacent or lead replies unattended — broker approves (matches booking-UX principle in [04](04-detail-booking.md)). **States:** default dashboard · loading skeleton KPIs+rows · **empty "No leads yet — your verified listing is live and being shown in chat"** · error retry. **Permissions:** RLS-scoped to the broker's own org rows only.

---

## #16 Admin operations dashboard  ·  `/admin/*`  ·  persona: Patricia (ops)  ·  **Post-MVP (W8)**

**Goals:** Patricia's control room — moderate supply (verify/approve listings & events), work the **leads CRM**, take over hot/stuck threads, and watch **observability** (AI runs, grounding health, cost). The internal counterpart to #15.

### Desktop

```text
┌──────────────────────────────────────────────────────────────────┐
│ TopNav · Admin                                      Patricia ◑    │
├──────────┬─────────────────────────────────────────────────────────┤
│ LEFT     │ ── Ops overview ──                                       │
│ ─ Overview│┌Leads 42┐┌Pending approvals 7┐┌Live threads 5┐┌Errors 2┐│ KPI row
│ ─ Leads  ││ open    ││ listings+events   ││ human-active ││ 24h    ││
│ ─ Approvals└────────┘└───────────────────┘└─────────────┘└────────┘│
│ ─ Listings│ ── Approvals queue ──                                   │
│ ─ Threads │ ┌ Rental "Loft Provenza" · broker X · ⚠ price unverified│ moderation
│ ─ Observ. │ │  [View][Approve ✔][Reject][Request edit]            │ │
│ ─ Users   │ └──────────────────────────────────────────────────────┘│
│           │ ── Leads CRM ──   [All][New][Contacted][Won][Lost]      │
│           │ ┌Camila · Studio Laureles · new · 2m ago   [Assign▾]┐  │ pipeline rows
│           │ └Andrés · VIP table · contacted · broker Y         ┘  │
│           │ ── Observability ──  ai_runs 1.2k/24h · grounding 99.1% │ health strip
│           │  p95 latency 2.4s · Gemini cost $4.10/24h · [Logs →]    │
└──────────┴─────────────────────────────────────────────────────────┘
```

### Mobile: ops is desktop-first; mobile = read-only KPIs + approvals/threads triage (Patricia mostly on laptop).

| Section | Detail |
|---|---|
| Overview | open leads · pending approvals · live human-active threads · 24h errors |
| Approvals | moderate listings/events before they go live; **verify flag** (anti-scam, the trust moat) → flips `✔ Verified` |
| Leads CRM | pipeline (New→Contacted→Won/Lost); assign to broker; source = chat/WA; backs the `leads` table |
| Threads | live conversations; **takeover** any thread (AI → human in same thread); see AI confidence |
| Observability | `ai_runs` volume · grounding success % · p95 latency · Gemini cost · error feed → links to logs |
| Users | phone-identified contacts, profile/memory (#20) for support; RLS admin-scoped |

**Monetization:** ops efficiency = AI handles 90%, Patricia handles the 10% that converts (hot leads, money, scams blocked). **Trust:** verification queue is where "no scams" is *enforced* — the homepage promise made operational. **Observability ties to hard rules:** grounding health surfaces when grounding is down (chips disabled UX-004); cost panel watches the Gemini/Places spend levers (X-Goog-FieldMask, on-open fetches). **States:** default · loading skeleton panels · empty per-queue ("No pending approvals — supply is clean") · error (degrade panel, keep others). **Permissions:** admin role only; service-role data access stays server-side (edge functions), never client.

---

## Dashboard UX principles (all four)
- **Views over the same truth** — every panel reads Supabase rows the chat already writes; no parallel data model.
- **HITL where it matters** — AI drafts, human approves on money/lead/scam actions (#15, #16); pure info auto-resolves and logs.
- **Transparency as a feature** — users see + control their memory (#20); operators see AI confidence + grounding health (#16).
- **RLS-scoped** — users see their own; brokers see their org; admins see all. No service-role on the client.
- **Never dead-end** — empty states route forward (start a chat, your listing is live, supply is clean).
- **Desktop-first for operators, mobile-first for users** — Patricia/brokers work on laptops; Camila lives on her phone.
