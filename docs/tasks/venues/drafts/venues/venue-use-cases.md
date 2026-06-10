# Venue use cases

**PRD:** [venue-management-prd-v1.md](./venue-management-prd-v1.md) · **Workflows:** [venue-workflows.md](./venue-workflows.md)

Each scenario: **journey** → **ops workflow** → **automation** → **AI** → **revenue** → **sponsor** → **WhatsApp** → **mobile**.

---

## 1. Beauty pageant (Miss Elegance Colombia)

| Dimension | Detail |
|-----------|--------|
| **Journey** | Sofía books Teatro venue once → reuses for finals; Laura (contestant) sees venue on apply; fans see map on vote page |
| **Ops** | Same venue for ticketed finals + contest; Roberto scans at door; backstage list from check-ins |
| **Automation** | T-24h WA directions; OpenClaw finals timeline ([contests](../contests/openclaw-contests.md)) |
| **AI** | Layout proposal for runway + judges table; moderation separate |
| **Revenue** | Ticket tiers + sponsor packages tied to venue visibility |
| **Sponsor** | Logo on venue map panel + WA broadcast subtitle |
| **WhatsApp** | Community leaderboard + “finals at Teatro” |
| **Mobile** | Wizard picker 📱; scan PWA; vote page map |

---

## 2. Fashion event / runway

| Dimension | Detail |
|-----------|--------|
| **Journey** | Pop-up venue in Poblado; quick inline venue create |
| **Ops** | Short availability hold; AV resource checklist (036) |
| **Automation** | Day-of staff ping |
| **AI** | Layout zones: runway, backstage, VIP |
| **Revenue** | Limited capacity tickets |
| **Sponsor** | Brand lounge zone in layout proposal |
| **WhatsApp** | VIP list reminder |
| **Mobile** | Host dashboard sales realtime |

---

## 3. Conference / corporate

| Dimension | Detail |
|-----------|--------|
| **Journey** | Hotel ballroom; dietary profiles (032) |
| **Ops** | Multi-room later; MVP single hall |
| **Automation** | Attendee directions email + WA |
| **AI** | Concierge “coffee near venue” |
| **Revenue** | Tiered passes |
| **Sponsor** | Session sponsors on agenda — link 031 |
| **WhatsApp** | Session reminder (optional) |
| **Mobile** | Check-in QR |

---

## 4. Concert / nightlife

| Dimension | Detail |
|-----------|--------|
| **Journey** | Camila buys on phone; Uber to `placeUri` |
| **Ops** | High throughput scan; capacity enforcement on tiers |
| **Automation** | No-show recovery ([070](../070-openclaw-no-show-recovery.md)) |
| **AI** | Nearby bars after show (044) |
| **Revenue** | Volume tickets |
| **Sponsor** | Drink brand nearby POI co-marketing |
| **WhatsApp** | Last-minute “doors open” (approved blast) |
| **Mobile** | Wallet QR offline-tolerant |

---

## 5. Coworking / hybrid space

| Dimension | Detail |
|-----------|--------|
| **Journey** | Organizer runs networking event in coworking partner space |
| **Ops** | Low capacity; simple venue row |
| **Automation** | Minimal |
| **AI** | Capacity coach in wizard |
| **Revenue** | Small ticket or free RSVP |
| **Sponsor** | Coworking brand as sponsor |
| **WhatsApp** | RSVP confirm |
| **Mobile** | RSVP QR |

---

## 6. Wedding (private organizer)

| Dimension | Detail |
|-----------|--------|
| **Journey** | Family organizer; needs clear address for guests |
| **Ops** | Phase 2: layout tables; MVP: map + directions |
| **Automation** | T-48h guest directions |
| **AI** | Seating layout proposal only |
| **Revenue** | Gifts/donations out of scope |
| **Sponsor** | N/A |
| **WhatsApp** | Family group directions link |
| **Mobile** | Guest QR optional |

---

## 7. Sports venue / stadium

| Dimension | Detail |
|-----------|--------|
| **Journey** | Large capacity; multiple gates later |
| **Ops** | Staff links per gate (034); scan audit |
| **Automation** | High-volume scan monitoring |
| **AI** | Entry flow narrative for ops |
| **Revenue** | High volume |
| **Sponsor** | Stadium naming in sponsor tile |
| **WhatsApp** | Match day alert |
| **Mobile** | Staff PWA critical |

---

## 8. Hotel / convention center (enterprise)

| Dimension | Detail |
|-----------|--------|
| **Journey** | Venue manager + event organizer roles split |
| **Ops** | 041 booking EXCLUDE; 038 availability |
| **Automation** | B2B inquiry workflow (Phase 4) |
| **AI** | Utilization forecast narrative |
| **Revenue** | Room rental + ticketing split |
| **Sponsor** | Hotel chain package |
| **WhatsApp** | B2B coordinator thread |
| **Mobile** | Manager tablet dashboard |

---

## 9. Multi-room venue / festival

| Dimension | Detail |
|-----------|--------|
| **Journey** | Multiple stages — **Phase 4** (child events per stage) |
| **Ops** | Per-stage ticket + shared venue parent |
| **Automation** | Per-stage ops digests |
| **AI** | Cross-venue routing for attendees |
| **Revenue** | Multi-ticket bundles |
| **Sponsor** | Stage sponsors |
| **WhatsApp** | Stage-specific channels |
| **Mobile** | Map with multiple pins |

---

## 10. Convention center + expo

| Dimension | Detail |
|-----------|--------|
| **Journey** | Plaza Mayor style; long multi-day |
| **Ops** | Resources 036 critical; vendor 029 |
| **Automation** | Daily organizer digest |
| **AI** | Floor plan for booth zones |
| **Revenue** | Exhibitor tickets |
| **Sponsor** | Expo title sponsor |
| **WhatsApp** | Exhibitor briefing |
| **Mobile** | Exhibitor check-in |

---

## Competitor comparison (summary)

| Platform | Strength | Weakness vs mdeai |
|----------|----------|-------------------|
| **VenuePro** | Layouts, BEO, sales | No LATAM WA contests/tickets |
| **iVvy** | Unified cal | No contest OS |
| **Momentus** | Enterprise ops, AI roadmap | Heavy $; no Medellín SMB |
| **Cvent** | Scale, AI articles | US-centric |
| **Zoho Backstage** | Registration | Weak COP/WA |
| **Artifax** | Arts venues | No ticketing spine |
| **Eventtia** | AI marketing copy | No deterministic vote layer |
| **Sparkit AI** | AI ops narratives | No Supabase truth |

**mdeai wedge:** **Event + ticket + contest + sponsor + maps + WA** on one `event_venues` spine.

---

## Production architecture (summary)

Full stack recommendations — extend existing patterns only.

| Area | Recommendation |
|------|----------------|
| **Schema** | Extend `event_venues`; add 036–041 tables in one migration wave |
| **RLS** | `(select auth.uid()) = organizer_id` on venues; public read via published events join |
| **Realtime** | `host-venue:{venueId}` for dashboard KPIs when 039 ships |
| **Stripe** | Unchanged ticket flow; venue not on checkout line item MVP |
| **Ticketing** | `events.venue_id` required before `status=live` (edge publish gate) |
| **QR** | `ticket-validate` unchanged; show `venue.name` in response |
| **Staffing** | 037 venue roster ≠ 034 event staff JWT |
| **Offline scan** | PWA caches attendee list hash + venue name |
| **Queues** | `venue.agent_proposals` for AI; no OpenClaw in booking path |
| **Cache** | `places_cache` join; CDN for layout images |
| **Observability** | `ai_runs`, edge logs, OpenClaw `delivery_logs` |
| **Analytics** | SQL views: `venue_utilization_daily` |
| **Audit** | `audit_log` on layout apply, booking confirm |
| **Security** | Edge-only Places; Map ID in env; no service role client |
| **Approvals** | UI Apply; Paperclip enterprise |
| **Scale** | Index FKs; partition `event_check_ins` by month if &gt;10M rows |

**Acceptance:** See [venue-roadmap.md](./venue-roadmap.md) exit criteria per phase.
