
Updated all three trackers (plus a light sync on [`tasks/INDEX.md`](tasks/INDEX.md) header).

### [`changelog`](changelog)
New top entry **2026-05-26 — MAP-030/031/009**:
- Category markers + `SelectedPlaceOverlayCard`
- MAP-031 “Pins on the map” copy
- MAP-009 clustering (`@googlemaps/markerclusterer`)
- Hydration fix on `ChatResultsColumn`
- **256** Vitest · smoke pass · evidence links

### [`todo.md`](todo.md)
- Phase → **Maps polish Done**
- Checked: MAP-030, MAP-031, MAP-009
- Gates table updated (hydration ✅, clustering ✅)
- Vitest **256**
- Next: MAP-002E → MAP-002D + GS-*

### [`tasks/progres.md`](tasks/progres.md)
- North star + maps priority table (030/031/009 marked Done)
- Maps table rows for **MAP-030**, **MAP-031**, **MAP-009** 🟢
- Metrics: maps ~98%, **19 Done** map tasks
- Production checks: `smoke:grounding-attribution` 🟢
- Critical path updated through P1 polish

**Note:** [`tasks/INDEX.md`](tasks/INDEX.md) maps subsection (lines ~140+) is still stale on individual MAP rows — authoritative status is [`tasks/maps/INDEX.md`](tasks/maps/INDEX.md). Header metrics were bumped to match.

**You’re in good shape on the maps café slice (MAP-030/031 verified).** Here’s a practical order from highest leverage to “later.”

---

### 1. Quick polish (same session, &lt;1 day)

| Step | Task | Why |
|------|------|-----|
| **A** | Fix **hydration** on `chat-results-column.tsx` | Dev overlay still complains; can confuse QA |
| **B** | **MAP-009** clustering | 5 café pins already overlap in Poblado — unblocked after MAP-030 |
| **C** | Overlay polish | Photo **author attributions** in `SelectedPlaceOverlayCard`; multi-photo carousel if meta has &gt;1 `photoName` |

Re-verify: `list best cafes in medellin` → ☕ pins + overlay + **“Pins on the map”** strip.

---

### 2. Phase 1 exit / revenue (this week)

| Step | Task | Persona |
|------|------|---------|
| **D** | **F32** production smoke + `npm run floor` on preview | Sofía |
| **E** | **EVT-01** E2E if not done on preview — Stripe test ticket → `event_orders.paid` | Andrés |
| **F** | **F11** separate webhook secrets (tickets vs sponsor) | Patricia / security |
| **G** | **F35** `/host/events` list | Roberto sees published events |

Bundle check:

```bash
cd mdeapp && npm run verify:grounding && npm run smoke:map-pins && npm run floor
```

---

### 3. Maps — next sprint (per `todo.md`)

```text
MAP-002E (ops runbook) → MAP-002D + GS-* (Search grounding) → MAP-005 → MAP-006 → MAP-012A spike
```

| Pick | Effect |
|------|--------|
| **MAP-002E** | Patricia knows when ADK falls back to Gemini Maps vs hard fail |
| **MAP-002D** | Time-sensitive “this weekend” queries without wrong tool mix |
| **MAP-005/006** | Nearby / proxy cache — less duplicate Places spend |

**F50b is Done** — wire **viewport → `locationBias`** in a quick audit if café results still feel Laureles-heavy when the map is on Poblado.

---

### 4. Events (you have `events-roadmap.md` open — empty)

**Don’t start EVT-D01–D11 yet** — that’s Phase 2 discovery pack ([`F42`](tasks/events/EVP-018-mvp-event-web-discovery-task-pack.md)).

**Do now:**

1. Fill [`tasks/events/docs/events-roadmap.md`](tasks/events/docs/events-roadmap.md) from [`plan/events/10-events-plan.md`](plan/events/10-events-plan.md) + [`tasks/events/INDEX.md`](tasks/events/INDEX.md) (MVP vs discovery).
2. **F35** host list + **SCREEN-014** regression on `/events/[slug]`.
3. Tame **event web citations** on pure café turns (browser still showed event citation chips alongside grounded cards — prompt/routing, not MAP-031).

**Roberto hero** (`/host/event/new` + HITL) is largely specced Done — focus on **publish → list → buy** path, not new discovery agents.

---

### 5. Coffee tours (parallel content track)

[`tasks/agent/08-cafe-prompt.md`](tasks/agent/08-cafe-prompt.md) + [`tasks/listings/cafes/`](tasks/listings/cafes/) are **data + agent design**, not wired product yet.

Sensible sequence:

1. Curate verified tour rows (05/06 listings docs).
2. Supabase table + RLS (if missing).
3. New tool or extend `search-grounded-places` with `primaryType`/query bias for tours.
4. Reuse **grounded cards + ☕ pins** — no new map chrome.

---

### Recommended “pick one” for tomorrow

| If goal is… | Do |
|-------------|-----|
| **Best UX on `/`** | **MAP-009** + hydration fix |
| **Ship / money** | **F32** + Andrés ticket smoke on Vercel preview |
| **Events clarity** | Populate **events-roadmap.md** + **F35** |
| **Ops safety** | **MAP-002E** + **F11** |

I’d do **MAP-009 → hydration → F32** unless Roberto/Andrés paths are blocking a deploy. Want a one-task spec cut for MAP-009 or the events roadmap skeleton?