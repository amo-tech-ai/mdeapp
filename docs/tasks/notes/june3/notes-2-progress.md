# Progress snapshot — June 4, 2026

**One-line summary:** Tourist chat and rental search work on [mdeai.co](https://www.mdeai.co) today. We are **not** ready to call Discovery Beta “done” until three nightly health checks pass, café search is fully grounded on production, and venue booking gets human approval flows.

**Full detail:** [`tasks/progres.md`](../../progres.md) · **What to do next:** [`notes-1-next.md`](notes-1-next.md)

| Checked | Value |
|---------|--------|
| Production deploy | `bf40ef9` |
| Local `main` | `57adf17` |
| Automated tests | **485 / 486** pass (1 minor smoke check failing) |
| Nightly prod health | **1 of 3** green runs (need 2 more automatic nights) |
| Linear board | [MVP view — `phase:mvp`](https://linear.app/sanjiovani/view/mvp-48ab105e7f0a) |

**Legend:** 🟢 done · 🟡 in progress · 🟥 blocked · ⚪ not started · ⏸ paused on purpose

---

## Where we are (plain English)

| Big bucket | Simple meaning | How far | Dot |
|------------|----------------|--------:|:---:|
| **Discovery Beta** | Chat, maps, restaurants, cafés, nightlife — what Camila and Carlos use today | ~**68%** | 🟡 |
| **Ready to announce Beta** | Prod stable 3 nights in a row + café grounding + booking approval path | ~**55%** | 🟡 |
| **Full paid MVP** | Live ticket purchase + host publish sign-off (Stripe ledger) | ~**45%** | ⏸ paused |
| **Code quality gate** | Automated tests before merge | **99.8%** | 🟡 |

**Who cares right now**

- **Camila** — can search rentals and chat on prod; semantic search and café grounding still tightening.
- **Carlos / Sarah** — can browse and book venues in many flows; Patricia cannot approve WhatsApp sends yet.
- **Roberto** — host event wizard works; “published on prod” proof is in the deferred commerce track.
- **Andrés** — ticket UI exists; live paid purchase proof is deferred.
- **Sofía / Lucía** — CI and nightly prod smoke exist; branch protection and full journey tests still open.

---

## Executive score (with summaries)

| Area | What it is (simple) | Status | % | ✅ Working today | ⚠️ Still broken or missing | 💡 Do this |
|------|---------------------|--------|--:|------------------|----------------------------|------------|
| **Discovery Beta** | Main product queue: chat + venues + maps | 🟡 | ~68% | Login on prod, map pins, venue cards, ranking data | 2/3 soak nights; ADK on prod; booking approve step | Wait + wire ADK env |
| **Beta exit readiness** | “Safe to stop adding features and harden” | 🟡 | ~55% | Nightly bot checks mdeai.co chat | Full user-journey checklist not run; booking HITL missing | After soak: run journey tests |
| **Full MVP ledger** | Signed checklist incl. paid tickets | ⏸ | ~45% | Event wizard + wallet screens | Stripe live proof intentionally deferred | Ignore until Beta stops |
| **Test floor** | `npm test` before ship | 🟡 | 99.8% | 485 tests green | 1 test about Gemini model names | Fix smoke or agent config |

---

## Systems stack (what each piece does for users)

| System | Plain description | Status | % | ✅ Confirmed | ⚠️ Gap | 💡 Next |
|--------|-------------------|--------|--:|--------------|--------|---------|
| **Chat UI (CopilotKit)** | Text box + streaming replies on `/chat` | 🟢 | 92% | Chat loads and talks to AI | Watch for too many API calls after deploys | Monitor |
| **AI brain (Mastra + Gemini)** | Routes “rentals vs events vs places” and calls tools | 🟡 | 88% | 6 agents; search tools work | One unit test out of sync | Fix smoke test |
| **Grounded places (ADK)** | Real Google-backed café/restaurant results in chat | 🟡 | 35% | Code written; test scripts exist | **Not turned on in Vercel prod yet** | SAN-368: add env vars |
| **Maps** | Pins on map when you search | 🟢 | 90% | Map ID fixed on prod (MAP-008B) | Some place details still empty until backfill cron | DATA-008 |
| **Database (Supabase)** | Saves bookings, events, users; blocks cross-user leaks | 🟢 | 90% | Big migration stack merged; booking saves | Admin queue + approve-before-send not built | AUTH-009 then booking HITL |
| **Smart search (vectors)** | “Find apartments like this” semantic match | 🟡 | 45% | Hybrid search partly wired | Embedding API returns 403 → falls back to keywords only | SAN-545 |
| **Host wizard** | Roberto creates event via AI form at `/host/event/new` | 🟢 | 90% | Wizard + approve step in UI | “Published on production” proof deferred | Later (commerce track) |
| **Venue booking** | Book table / café from chat or browse pages | 🟡 | 65% | Form saves; user sees “Pending” | No “Confirm with agent?” step; no WhatsApp to venue | Rows 26–30 in tasks.md |
| **Trips** | Save places into a trip itinerary | ⚪ | 30% | DB tables ready | “Add to trip” button not fully wired | Phase 2 |
| **Mobile** | Usable on phone | 🟡 | 55% | 3-panel layout shipped | Keyboard covers send button sometimes | MOB-CHAT-001 |
| **Stripe tickets** | Buy event ticket with card | ⏸ | 55% | Checkout code in repo | No production payment proof run | Deferred D1–D5 |
| **WhatsApp / OpenClaw** | Auto-message venues | ⚪ | 5% | Planned on VPS | Out of current Beta scope | Phase 2+ |
| **Patricia admin** | `/admin/bookings` approve requests | ⚪ | 0% | Wireframes only | No live admin screen | VEN-024 |
| **CI & nightly smoke** | Robot opens mdeai.co and asks 4 test questions | 🟡 | 85% | Runs every night | Only 1/3 passes counted; merges not fully protected | Wait 2 nights + SAN-458 |

---

## Release gates — the 10 things blocking “Beta done”

Each row is a **proof task**, not a feature. All must be green before we freeze chat UX polish (rows 11–16).

| Code | Plain English | Status | % | ✅ Proof we have | ⚠️ Still need | 💡 Next |
|------|---------------|--------|--:|-----------------|---------------|---------|
| **SAN-462** | Robot checks prod chat **3 nights in a row** | 🟡 | 33% | Night 1 passed | Nights 2 and 3 (automatic only) | Wait — don’t click “Run workflow” manually |
| **AUTH-011** | Sign up / log in works on **mdeai.co** | 🟢 | 100% | PR #56 merged | — | — |
| **DATA-041** | “Quiet rooftop Provenza” ranks real venues | 🟢 | 100% | 30 seeded signals | — | — |
| **DATA-008** | Place panels show **hours & phone** from Google | 🟡 | 40% | Cron code in review | Not running on prod yet | Merge SAN-338 |
| **PR-16** | **Broken tests can’t merge** to main | 🟡 | 70% | Tests run on PRs | GitHub still allows merge without them | Turn on branch protection |
| **MAP-008B** | **Map pins show** on prod (not blank map) | 🟢 | 100% | PR #57 + screenshot evidence | — | — |
| **MAP-002B** | *“Specialty coffee Laureles”* returns **real café cards** on prod | 🟡 | 30% | App code ready | Cloud + Vercel secrets not set | SAN-368 |
| **F13** | Chat **remembers earlier messages** after server restart | 🟡 | 50% | Logging exists | Memory across redeploy not proven | SAN-548 |
| **DATA-EMBED** | Rental search uses **meaning**, not just keywords | 🟡 | 30% | Basic search works | Smart layer errors with 403 | SAN-545 |
| **OPS-JOURNEY** | **Lucía runs 16 prod user stories** and logs pass/fail | 🟡 | 25% | Test plan written | Most journeys not run on mdeai.co yet | After soak |

---

## Production readiness (decisions)

| Question | Answer in plain English |
|----------|-------------------------|
| Can we **declare Discovery Beta done**? | **Not yet** — need 2 more soak nights, ADK on prod, booking approval, journey tests. |
| Can **tourists use the site** today? | **Mostly yes** for chat, rentals, events, map pins — café grounding and booking ops still rough. |
| Can we **sign full MVP ledger** (paid ticket + ledger)? | **No — intentionally paused** until Discovery Beta finishes (commerce track D1–D5). |

---

## Top 5 actions (operator order)

| # | Task | Why it matters (simple) |
|--:|------|-------------------------|
| 1 | **SAN-462** | Prove prod chat stays healthy — **wait for 2 automatic nightly greens**. |
| 2 | **SAN-368** | Turn on Google grounding so **coffee search uses real places on prod**. |
| 3 | **SAN-458** | Stop accidental merges that **break the live site**. |
| 4 | **SAN-547 AUTH-009** | Bookings must run **as the logged-in user**, not anonymous — required before approve step. |
| 5 | **SAN-545** | Fix smart rental search so **“2BR near Estadio”** isn’t keyword-only. |

---

## Real-world snapshot

| Persona | Try this on mdeai.co | Today |
|---------|----------------------|-------|
| **Camila** | *“1BR Laureles under $80”* | 🟢 Works — cards + pins |
| **Camila** | *“Specialty coffee Laureles”* | 🟡 Partial — full grounding needs MAP-002B |
| **Sarah** | Book a café → see **Pending** | 🟢 Saves to database |
| **Sarah** | Patricia approves → WhatsApp to venue | 🔴 Not built yet |
| **Roberto** | Create event in wizard | 🟢 UI works · prod publish proof deferred |
| **Andrés** | Buy ticket → QR in wallet | 🟡 UI only · live payment deferred |

---

*Sources: disk audit 2026-06-04 · [`tasks/progres.md`](../../progres.md) · Linear SAN-* · `npm test -- --run`*
