# mdeai — Production-ready checklist (success criteria)

**Updated:** 2026-05-30 · **Auditor:** Cursor · **Scope:** `/home/sk/mdeai` (app git root: `mdeapp/`)

> **Tracker tables:** [`tasks/progres.md`](tasks/progres.md) · **Queue:** [`todo.md`](todo.md) · **Index:** [`tasks/INDEX.md`](tasks/INDEX.md)

## Status legend

| Dot | Meaning |
|-----|---------|
| 🟢 | Complete — verified with command/log/evidence path |
| 🟡 | In progress — partial proof |
| 🟥 | Blocked / failed — critical gap |
| ⚪ | Not started — planned, no proof |

## Scoring (production readiness)

| Score | Meaning |
|------:|---------|
| 90–100 | Production-ready for that area |
| 75–89 | Strong; minor gaps |
| 50–74 | Partial; needs work before exit |
| 25–49 | Weak / risky |
| 0–24 | Not implemented |

---

## MVP exit gates (persona — must all be 🟢)

| Gate | Persona | Success criteria (proof required) | Status |
|------|---------|-----------------------------------|:------:|
| **G2** | Camila | `/` chat → rental **or** café cards + map pins + lead modal on **prod** | 🟢 |
| **G1** | Andrés | Live Stripe → `event_orders.status=paid` + wallet QR on **prod** | 🟡 |
| **G3** | Roberto | `/host/event/new` HITL publish → row in Supabase on **prod** | 🟡 |
| **EVP-001** | Sofía | Consolidated ledger linking G1+G2+G3 evidence files | 🟥 |
| **F32** | Sofía | `tasks/notes/F32-prod-smoke-*.md` + curl matrix @ www.mdeai.co | ⚪ |
| **AUTH-011** | Patricia | OAuth + env checklist signed on Vercel preview/prod | 🟡 |
| **MAP-002B** | Camila | `ADK_GROUNDING_URL` on Vercel + grounded search on prod | ⚪ |
| **MAP-008B** | Camila | `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` on prod; AdvancedMarker renders | ⚪ |

**MVP exit command bundle (Sofía):**

```bash
cd mdeapp && npm run smoke:map-pins && npm run smoke:f50-pin-sync && npm run verify:console && npm run test:e2e:screens && npm run floor
```

---

## Platform floor (must pass before any “Done”)

| Check | Command | Pass criteria | 2026-05-30 |
|-------|---------|---------------|:----------:|
| Lint | `npm run lint` | exit 0 | 🟢 |
| Unit tests | `npm run test` | all pass | 🟢 **313/313** |
| Build | `npm run build` | exit 0 | 🟢 |
| Floor | `npm run floor` | exit 0 (lint+typecheck+test+build+audit) | 🟢 |
| Localhost boot | `npm run dev` + `curl :3001/` | HTTP 200 | required for UI Done |
| Prod surface | `curl https://www.mdeai.co/` | HTTP 200 | 🟢 |
| CopilotKit runtime | `POST /api/copilotkit` | not 5xx (415 without body OK) | 🟢 |

---

## Stack areas — success criteria

### CopilotKit + Mastra + Gemini

| Item | Success criteria | Status |
|------|------------------|:------:|
| Runtime route | `src/app/api/copilotkit/route.ts` builds `CopilotRuntime` per request | 🟢 |
| Agent registry | `useCoAgent({ name })` keys match `Mastra({ agents })` | 🟢 |
| Gemini models | Production agents use `gemini-3.5-flash` via `@ai-sdk/google` | 🟢 |
| Agents wired | ping, router, rental, concierge, event, hostEvent, evaluation | 🟢 |
| Workflows | rentalSearch, eventDiscovery, conciergeRouting registered | 🟢 |
| Tools | classify-intent, search-rentals/events/restaurants/attractions, grounded places, web-grounded events | 🟢 |
| HITL host publish | `hostEventAgent` + `renderAndWaitForResponse` path on `/host/event/new` | 🟡 G3 proof |
| Prod concierge | Non-rental intents return cards (not silent RUN_ERROR) | 🟡 UX-001 🟢; UX-002–009 open |

### Supabase + edge + RLS

| Item | Success criteria | Status |
|------|------------------|:------:|
| Client RLS | No service-role in `mdeapp/src/**` except F13 carve-out | 🟢 hook |
| Edge fns | ticket-checkout, ticket-payment-webhook, chat-lead-capture, approval-commit deployed | 🟢 code |
| Webhook isolation | Distinct Stripe secrets ticket vs sponsor (EVP-003) | 🟥 audit open |
| Migrations | Schema matches task specs; new tables have RLS + ≥1 policy | 🟡 data-001+ open |

### Maps + Places + ADK grounding

| Item | Success criteria | Status |
|------|------------------|:------:|
| vis.gl Map + mapId | Every `<Map>` has `mapId`; hook enforces AdvancedMarker | 🟢 |
| Field masks | Every Places API (New) call sends `X-Goog-FieldMask` | 🟢 |
| ADK client | `invokeAdkGrounding` + tests; `ADK_GROUNDING_URL` on prod | 🟡 localhost 🟢 prod ⚪ |
| MAP-005+ proxy | Edge Places proxy + nearby (post-MVP) | ⚪ |

### pgvector / semantic search

| Item | Success criteria | Status |
|------|------------------|:------:|
| Extension + tables | `vector` 0.8.0; listing/event/restaurant embeddings 768d | 🟢 DB exists |
| Hygiene | Duplicate HNSW indexes removed (VEC-001) | ⚪ |
| Eval harness | Semantic eval before scaling embeddings (VEC-005) | ⚪ |
| Product wiring | Camila chat uses hybrid search in prod | ⚪ Phase 2 |

### Events + commerce

| Item | Success criteria | Status |
|------|------------------|:------:|
| Event detail | `/events/[slug]` loads | 🟢 |
| Checkout | Stripe session + edge fn | 🟢 code |
| G1 paid proof | Manual prod payment evidence | 🟡 |
| EventCard E2E | `SCREEN-006` Playwright passes on prod | 🟥 |
| Host wizard | `/host/event/new` E2E + G3 SQL row | 🟡 |

### Rentals + venues + trips

| Item | Success criteria | Status |
|------|------------------|:------:|
| Rental fast-path | Cards + pins; no event hijack (PR #7) | 🟢 |
| Café Phase A.5 | SCREEN-021 spec + e2e | 🟢 |
| Lead capture G2 | Modal → Supabase lead | 🟢 |
| `/rentals` app (F41) | Full rentals surface | ⚪ deferred |
| Trips | `/trips`, `/saved` routes + data-026 chain | 🟡 UI 🟢 schema ⚪ |

### Auth + dashboards

| Item | Success criteria | Status |
|------|------------------|:------:|
| Login/signup | `/login`, `/signup`, OAuth callback | 🟢 |
| AUTH-005 E2E | `e2e/auth-*.spec.ts` | ⚪ |
| Patricia `/admin/*` | Ops dashboards | ⚪ W8+ |

### Automations (Phase 2+ — do not start without gates)

| Item | Success criteria | Status |
|------|------------------|:------:|
| OpenClaw OCL-001–013 | Gateway health + approval workflow + kill switch | ⚪ |
| WhatsApp auto-send | Template + rate limits + human handoff | ⚪ |
| Postiz scheduling | Connected to approval gate | ⚪ |

### Testing + evidence

| Item | Success criteria | Status |
|------|------------------|:------:|
| Vitest | `npm run test` green | 🟢 313 tests |
| Playwright | 23 specs under `e2e/`; screen specs match SCREEN-* | 🟢 exists |
| SCREEN-006 | Event card testid on prod | 🟥 |
| UX prod monitor | UX-009 synthetic concierge | ⚪ |
| Evidence files | `tasks/testing/evidence/YYYY-MM-DD/*` per Done | required |

---

## Go / No-Go (MVP exit)

| Verdict | **No-Go** (2026-05-30) |
|---------|-------------------------|
| Reason | Floor 🟢 but **G1 + EVP-003 + EVP-013 + EVP-001** and **6 UX P0** rows open; prod maps hardening (MAP-002B/008B) unverified |
| Next | [`todo.md`](todo.md) P0 A → B → Tier 1C UX (093–102) |
