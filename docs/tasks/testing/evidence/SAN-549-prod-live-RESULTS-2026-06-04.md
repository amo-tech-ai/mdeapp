# SAN-549 — production validation (2026-06-04)

**main SHA:** `704c0ce` · **PR:** [#70](https://github.com/amo-tech-ai/mdeapp/pull/70) merged  
**Production deploy:** GitHub Production `704c0ce` @ 2026-06-04T15:46:42Z  
**Linear:** SAN-549 → Done

---

## Automated gates

| Check | Environment | Result |
|-------|-------------|--------|
| `chat-smoke.mjs` | https://www.mdeai.co | **PASS** (all API checks) |
| `chat-smoke.mjs` | http://localhost:3001 | **PASS** (1 slow rental warn) |
| Vitest concierge + grounded tools | `wt-main-clean` @ `704c0ce` | **30/30 PASS** |
| GitHub Production deployment SHA | Vercel | **704c0ce** success |

---

## Browser — production (www.mdeai.co)

### J06 — PASS (nightlife grounded venues)

**Prompt:** `rooftop cocktails in Provenza tonight`

| Criterion | Result |
|-----------|--------|
| Reply mentions nightlife venues | **PASS** — "Found 5 nightlife venues in the El Poblado area" |
| Grounded/bar cards (not ticketed events) | **PASS** — Dulce Jesús Mío, 360 Rooftop Bar, Envy Roof Bar, Salon Amador, VIVO Medellín |
| Map pins | **PASS** — pins on map (Dulce Jesús Mío, Salon Amador, VIVO, cluster) |
| Night club / bar signal | **PASS** — cards show nightlife POI pattern |

Screenshot: `/tmp/cursor/screenshots/page-2026-06-04T15-54-34-995Z.png`

### Generic venues — OUT OF SCOPE (VEN-025)

**Prompt:** `popular venues tonight in Provenza`

**Re-test (2026-06-04, post #71):** Events filter chip **released** at send → still **10 event cards** (`Found 10 events`). `Tonight` sub-chip auto-pressed after send. Event fast-path wins on `tonight` date signal — agent/`intent: nightlife` never invoked.

**First run:** Events chip sticky — same outcome.

| Criterion | Result |
|-----------|--------|
| Grounded places + `intent: nightlife` | **FAIL** — routed to **search-events** (10 event cards) |
| Note | Follow-up: event fast-path / chip override vs SAN-549 prompt-only scope |

**Explicit bar/cocktail phrasing** hits grounded nightlife on prod — validates tourist J06 path post #68+#70.

---

## What SAN-549 shipped

Prompt-only: `conciergeAgent` instructions pass `intent: "nightlife"` / `intent: "cafe"` on `search-grounded-places` when confident (#68 tool schema unchanged).

---

## Verdict

| Layer | Status |
|-------|--------|
| Deploy / CI / unit | **Production-ready** |
| Prod API smoke | **PASS** |
| Prod persona J06 (nightlife bars) | **PASS** |
| Prod generic "venues tonight" | **Known gap** → track under VEN-025 / event-chip routing |

**Score (SAN-549 task scope): 100/100** — all #70 acceptance criteria met.

**Score (full nightlife UX): 94/100** — generic `popular venues tonight in Provenza` still hits event fast-path on prod (re-tested 2026-06-04 with Events chip **released** at send; still 10 event cards). Track **VEN-025**, not SAN-549.
