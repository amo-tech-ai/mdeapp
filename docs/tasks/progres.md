---
title: mdeai Progress Task Tracker
updated: 2026-06-04T21:00Z
auditor: Cursor systems architect
scope: /home/sk/mdeai
main_sha: 57adf17
prod_sha: bf40ef9
prod_url: https://www.mdeai.co
mvp_view: https://linear.app/sanjiovani/view/mvp-48ab105e7f0a
queue: tasks.md rows 1–50 (Discovery Beta)
evidence: tasks/notes/1/MAP-008B-evidence.md · tasks/testing/evidence/
linear_soak: SAN-462 (1/3 scheduled PASS)
vitest: 485/486 (1 smoke fail @ 2026-06-04)
---

# mdeai Progress Task Tracker

**North star:** Camila on `/` cards + pins · Andrés paid ticket · Roberto host publish @ https://www.mdeai.co

**Active track:** **Discovery Beta** (`tasks.md` rows 1–50) · **Commerce exit deferred** (D1–D5)

**Legend:** 🟢 complete · 🟡 in progress · 🟥 blocked/failed · ⚪ not started · ⏸ deferred

---

## Executive score (2026-06-04)

| Area | % | Dot | ✅ Confirmed | ⚠️ Missing / failing | 💡 Next action |
|------|--:|:---:|--------------|----------------------|----------------|
| **Discovery Beta (overall)** | **~68%** | 🟡 | Chat + venues UI on prod; DATA-041; AUTH-011; MAP-008B Done | Soak 1/3; ADK prod; booking HITL spine | Finish SAN-462 2/3; ship MAP-002B env |
| **Production readiness (Discovery Beta exit)** | **~55%** | 🟡 | Nightly synthetic workflow live | J05–J20 matrix; VEN-031 gate; MAP-002B | OPS-JOURNEY after soak |
| **Full MVP exit (commerce ledger)** | **~45%** | ⏸ | Host wizard + wallet shell | PAY-001 prod proof; EVT-001 | Reopen D1–D5 when Discovery Beta stops |
| **Local test floor** | **99.8%** | 🟡 | 485/486 Vitest | `smoke.test.ts` gemini-3.5-flash agent check | Fix model registry in smoke or agent file |
| **Linear MVP board** | **~95%** | 🟢 | New view `phase:mvp` · 89 tagged issues | Legacy `phase-1` on VEB pack (19) | Filter `phase:mvp OR phase-1` or bulk retag |

---

## Release gates — Discovery Beta (rows 1–10)

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next action |
|------|-------------|--------|--:|--------------|---------------------|----------------|
| **SAN-462** soak | 3× nightly prod synthetic PASS | 🟡 | 33% | Run [26820069434](https://github.com/amo-tech-ai/mdeapp/actions/runs/26820069434) ✅ | Need **2** more **scheduled** greens | Wait nights; no manual dispatch |
| **AUTH-011** | Prod login/signup/Vercel env | 🟢 | 100% | Linear Done · [PR #56](https://github.com/amo-tech-ai/mdeapp/pull/56) | — | Update `tasks.md` row 2 → 🟢 |
| **DATA-041** | `venue_signals` seed top 30 | 🟢 | 100% | SAN-379 Done · GQ-S01 evidence | Patricia editorial spot-check optional | — |
| **DATA-008** | Places backfill cron | 🟡 | 40% | SAN-338 In Review · migration drafted | Hours/phone still empty on some panels | Merge + cron proof |
| **PR-16** | Branch protection + Floor CI | 🟡 | 70% | SAN-458 In Progress · workflow exists | GitHub admin: require Floor + review | Flip branch protection |
| **MAP-008B** | Map ID on Vercel prod | 🟢 | 100% | SAN-369 Done · [PR #57](https://github.com/amo-tech-ai/mdeapp/pull/57) · [evidence](tasks/notes/1/MAP-008B-evidence.md) | — | — |
| **MAP-002B** | ADK grounding on prod | 🟡 | 30% | Code on `main` · sidecar scripts | Vercel `ADK_*` env + prod café cards | Set env → redeploy → `verify:task MAP-002B` |
| **F13 / SAN-548** | Thread persistence cold-start | 🟡 | 50% | `ai_runs` observability shipped | `mastra_threads` survive redeploy unproven | Implement + prod proof |
| **DATA-EMBED** | Rental embed 403 → hybrid | 🟡 | 30% | SAN-545 Todo · signal path OK | Embed API 403 → `hybridUsed=false` | Fix key / route · verify hybrid |
| **OPS-JOURNEY** | Prod journeys J05–J20 | 🟡 | 25% | Spec + partial e2e | Full matrix not logged on mdeai.co | Blocked on soak; run J05–J08 first |

**Gate rule:** Rows 11–16 (chat UX polish) stay frozen until **SAN-462 3/3**.

---

## AI stack — agents, tools, workflows

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next action |
|------|-------------|--------|--:|--------------|---------------------|----------------|
| **CopilotKit 1.55.2** | Runtime + provider + HITL | 🟢 | 92% | `/api/copilotkit` POST 200 · agent name match | POST storm regression watch | Monitor after deploys |
| **Mastra + Gemini** | Product agents on `gemini-3.5-flash` | 🟡 | 88% | `conciergeAgent`, `rentalAgent`, `eventAgent`, `hostEventAgent`, `routerAgent` | Smoke test 1 fail on model assertion | Align smoke with agent exports |
| **conciergeAgent tools** | Rentals, events, grounded places, HITL | 🟢 | 85% | `search_rentals`, `search_events`, `search_grounded_places` wired | ADK not live on prod yet | MAP-002B |
| **Host wizard agent** | Roberto `/host/event/new` | 🟢 | 90% | `hostEventAgent` + wizard tools + HITL publish | Prod publish proof deferred (D3) | EVT-002 when commerce reopens |
| **Fast paths** | Café/restaurant/event shortcuts | 🟢 | 95% | G2d café #33 · restaurant photos #35 | Do not refactor during soak | — |
| **ADK / Grounding Lite** | Cloud Run sidecar → Mastra | 🟡 | 35% | `adk-grounding-client.ts` + verify scripts + vitest | Prod env + grounded café UI | SAN-368 |
| **Router / INT agents** | Multi-intent + clarify | ⚪ | 15% | Router agent exists | INT-003/004 not started | After soak + UX shell |
| **pgvector / SEARCH hybrid** | Semantic rental/event rank | 🟡 | 45% | DATA stack + hybrid RPC partial | Embed 403 · PR #38 frozen | DATA-EMBED then SEARCH-002 |
| **OpenClaw / WhatsApp** | Hostinger gateway ops | ⚪ | 5% | VPS docs · Phase 2 skill | Not in Discovery Beta | Defer post VEN-023 |

**Real-world:** Camila asks *"1BR Laureles under $80"* → rental cards + map pins (prod ✅). *"Specialty coffee Laureles"* → needs MAP-002B for full grounded café path on prod (🟡).

---

## Maps & Places

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next action |
|------|-------------|--------|--:|--------------|---------------------|----------------|
| **AdvancedMarker + mapId** | Pins on `/` and `/chat` | 🟢 | 100% | MAP-008B Done · prod Map ID set | — | — |
| **Places field masks** | Cost-safe API calls | 🟢 | 90% | Field masks in search routes | DATA-008 backfill incomplete | SAN-338 |
| **Grounding Lite sidecar** | ADK MCP search_places | 🟡 | 30% | Local verify scripts | Cloud Run + Vercel token | SAN-368 |
| **MAP-011 mobile map** | Single map instance mobile | ⚪ | 0% | Spec SAN-524 | Not started | After MOB-CHAT-001 |
| **Venue autocomplete** | MAP-010 | ⚪ | 0% | Blocked on MAP-005 chain | Post-MVP maps chain | `todo.md` P2 |

---

## Supabase, schema, edge, RLS

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next action |
|------|-------------|--------|--:|--------------|---------------------|----------------|
| **DATA migrations C1–C4** | #40–#44 on `main` | 🟢 | 97% | 79/79 replay · prod repair B1–B3 | B4 alias documented only | — |
| **Venue booking schema** | `venue_booking_requests` + RLS | 🟡 | 85% | VEN-015 persist path | HITL + admin queue not wired | AUTH-009 → VEN-019 |
| **Trips schema** | trips / trip_items RPC | 🟡 | 40% | DATA-026–030 Done | UI mostly shell | Phase 2 (T1–T19) |
| **RLS pen tests** | VEN-025 / TRIP-014 | ⚪ | 0% | Policies exist ad hoc | No CI pen suite | Before VEN-031 Done |
| **Edge functions** | Backfill, grounding proxy | 🟡 | 55% | Functions in repo from #42 | DATA-008 cron not prod-proven | Merge SAN-338 |

---

## Screens, chat, wizards, dashboards

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next action |
|------|-------------|--------|--:|--------------|---------------------|----------------|
| **Home `/` chat + map** | SCREEN-001/002 | 🟢 | 100% | Thread nav · map column · concierge | — | — |
| **Host event wizard** | SCREEN-004 `/host/event/new` | 🟢 | 95% | AI form-fill + HITL publish UI | Prod publish proof deferred | D3 EVT-002 |
| **Event cards in chat** | SCREEN-006 | 🟢 | 100% | EVT-013 evidence | SEARCH-002 UI merge frozen | After soak |
| **Café browse + book** | SCREEN-021 `/cafes` | 🟢 | 100% | Map + booking path | — | — |
| **Restaurant browse** | SCREEN-023 `/restaurants` | 🟡 | 95% | SAN-490 · PR merge pending prod smoke | Confirm on prod post-deploy | Quick prod check |
| **Nightlife browse** | SCREEN-022 | 🟡 | 20% | Shell route | Blocked on VEN-013 panel | Finish VEN-013 |
| **Rentals browse** | SCREEN-005 | 🟥 | 25% | Redirect to chat today | No `/rentals` grid | SAN-242 + SEARCH-001 |
| **Ticket wallet** | SCREEN-015 `/me/tickets` | 🟡 | 80% | UI + QR shell | Live Stripe proof deferred | D1 PAY-001 |
| **Admin bookings** | Patricia `/admin/bookings` | ⚪ | 0% | Wireframes VEB-W05 | No queue UI | VEN-024 after outbox |
| **Trips dashboard** | `/trips` workspace | 🟡 | 30% | Shell + partial polish | Add-to-trip not wired | Phase 2 |

---

## Venues booking spine (rows 17–37)

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next action |
|------|-------------|--------|--:|--------------|---------------------|----------------|
| **Restaurant/nightlife UI** | VEN-009…013 + browse pages | 🟡 | 75% | Panels + cards largely shipped | Nightlife browse thin | VEN-013 → SCREEN-022 |
| **Booking persist** | VEN-021 + status chips | 🟢 | 100% | DB write + Pending chip | — | — |
| **AUTH-009** | JWT → Mastra user context | ⚪ | 0% | SAN-547 created | Blocks VEN-019 HITL | Ship before booking approval |
| **VEN-019 HITL booking** | CopilotKit confirm before write | ⚪ | 0% | Tool registry partial (VEN-029 70%) | No approval UI | After AUTH-009 |
| **WA outbox + admin** | VEN-023/024 Patricia | ⚪ | 0% | Specs on disk | No outbox worker | Phase 5 rows 28–30 |
| **VEN-031 e2e gate** | Playwright venue suite | 🟡 | 40% | Partial specs | Not full stop gate green | After J05–J08 prod |

**Venues MVP stop:** VEN-031 + VEN-025 + OPS-JOURNEY J05–J08 on prod.

---

## Mobile (rows 42–48)

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next action |
|------|-------------|--------|--:|--------------|---------------------|----------------|
| **SCREEN-018** | 3-panel mobile shell | 🟢 | 100% | SAN-489 Done | — | — |
| **MOB-CK-001** | CopilotKit mobile baseline | 🟡 | 60% | Touch targets partial | 44px send not everywhere | SAN-521 |
| **MOB-CHAT-001** | Keyboard-safe composer | ⚪ | 0% | — | iOS keyboard overlap | SAN-522 |
| **MAP-011-M / cards / AIM-010** | Map + carousel + chips | ⚪ | 0% | — | All post-soak polish | Rows 44–47 |

---

## Commerce & automations (deferred ⏸)

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next action |
|------|-------------|--------|--:|--------------|---------------------|----------------|
| **PAY-001** | Live ticket on prod | ⏸ | 70% | Checkout code paths exist | No prod paid proof | D1 when track reopens |
| **PAY-003** | Webhook secret isolation | ⏸ | 40% | SAN-116 In Progress | Sponsor vs ticket secret | Finish before ledger |
| **EVT-002** | Roberto publish prod | ⏸ | 85% | Wizard works localhost | Prod row proof missing | D3 |
| **EVT-001** | MVP ledger sign-off | ⏸ | 0% | — | Blocked on D1–D3 | D4 |
| **Stripe mobile checkout** | PAY-005 | ⏸ | 0% | — | Phase 2 | D5 |

---

## CI, PR train, observability

| Task | Description | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next action |
|------|-------------|--------|--:|--------------|---------------------|----------------|
| **Vitest floor** | Unit + integration | 🟡 | 99.8% | 485/486 @ `57adf17` | 1 smoke agent model test | Fix smoke or agents |
| **Playwright e2e** | Local + prod synthetic | 🟢 | 90% | UX-034 workflow · venue specs partial | Full VEN-031 suite | Expand after booking HITL |
| **PR remediation** | track:pr SAN-447+ | 🟢 | 85% | PR-13/14 Done · #40–44 merged | PR-16 admin gate open | SAN-458 |
| **Prod synthetic monitor** | 4-query nightly | 🟢 | 100% | #37 merged · schedule active | Soak counting 1/3 | Wait 2 nights |
| **Branch protection** | Floor required on `main` | 🟡 | 70% | CI runs on PRs | Not required to merge yet | GitHub settings |

---

## Persona journeys (production @ `bf40ef9`)

| Persona | Journey | Status | % | ✅ Confirmed | ⚠️ Missing/Failing | 💡 Next action |
|---------|---------|--------|--:|--------------|---------------------|----------------|
| **Camila** | *"1BR Laureles under $80"* | 🟢 | 95% | Prod synthetic PASS | Embed hybrid degraded | DATA-EMBED |
| **Camila** | *"specialty coffee Laureles"* | 🟡 | 70% | Fast path / fallback | Full ADK grounding on prod | MAP-002B |
| **Carlos** | *"rooftop cocktails Provenza"* | 🟡 | 75% | Nightlife routing + panel | Browse page thin | VEN-013 |
| **Sarah** | Book café → Pending chip | 🟢 | 90% | Persist + chip | HITL approval not shipped | VEN-019 |
| **Roberto** | Host publish event | 🟡 | 85% | Wizard on prod UI | Signed prod publish deferred | D3 |
| **Andrés** | Buy ticket → QR wallet | 🟡 | 70% | UI shell | Live payment proof | D1 |
| **Patricia** | Admin booking queue | ⚪ | 0% | — | No `/admin/bookings` | VEN-024 |
| **Lucía** | Prod journey matrix | 🟡 | 25% | J05–J08 spec | J05–J20 not all PASS | SAN-546 |

---

## Production readiness verdict

| Gate | Verdict | Dot |
|------|---------|:---:|
| **Discovery Beta declare** | **No-Go** — soak 1/3, MAP-002B, booking HITL, J05–J20 | 🟡 |
| **Stable chat on prod** | **Conditional Go** — synthetic 1/3, concierge live | 🟡 |
| **Venues stop (book + browse)** | **No-Go** — AUTH-009 + VEN-019 + VEN-031 | 🟥 |
| **Full MVP ledger (EVT-001)** | **No-Go** — commerce track deferred | ⏸ |
| **Open beta tourist traffic** | **Conditional Go** — chat/rentals/events usable; maps pins OK | 🟡 |

---

## Top 5 next actions (operator order)

1. **Wait for SAN-462** — 2 more **scheduled** prod synthetic greens (no manual runs).
2. **SAN-368 MAP-002B** — Vercel `ADK_GROUNDING_URL` + `ADK_INTERNAL_TOKEN` → redeploy → prod café query proof.
3. **SAN-458 PR-16** — GitHub branch protection: require **Floor** + 1 approval.
4. **SAN-547 AUTH-009** — JWT into Mastra context (unblocks VEN-019 HITL booking).
5. **SAN-545 DATA-EMBED** — fix embed 403 so Camila gets full hybrid rental search.

---

*Sources: [`tasks.md`](../tasks.md) · [`todo.md`](../todo.md) · Linear SAN-* · `npm test -- --run` · prod `bf40ef9` · MVP view [`mvp-48ab105e7f0a`](https://linear.app/sanjiovani/view/mvp-48ab105e7f0a)*
