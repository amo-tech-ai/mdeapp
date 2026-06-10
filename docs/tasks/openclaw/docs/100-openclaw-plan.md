---
id: OCL-ROADMAP
title: OpenClaw — mdeai implementation roadmap
status: Planning
priority: P2 (Phase 2+ execution; Phase 1 = design + gates only)
phase: Post–Phase-1 MVP (enrichment after MAP/F48–F50 green)
owner: claude
depends_on:
  - MAP-002
  - F48-F50
  - G1-G5-events-ticketing
  - 15A-paperclip-security-foundation
blocks: []
skill:
  - mde-hostinger
  - open-claw
  - mde-paperclip
  - mastra
  - mde-supabase
sources:
  - ./11-openclaw.md
  - ./12-openclaw.md
  - ./13-openclaw.md
  - ../tasks/INDEX.md
  - ../../plan/openclaw/tasks/01-openclaw-adk.md
  - ../../plan/openclaw/INDEX.md
  - ../../plan/diagrams/06-openclaw-integration.md
  - ../../plan/real-estate/openclaw/14-openclaw-user-stories.md
  - ../../plan/real-estate/openclaw/AI Agents for Real Estate.md
  - ../../plan/restaurants/openclaw-restaurant.md
  - ../../plan/restaurants/restaurant.md
  - ../../plan/events/openclaw/events-openclaw-prd.md
  - ../../plan/events/openclaw/README.md
  - ../../agent/10-cafeintelligence-plan.md
external_research:
  - https://docs.openclaw.ai/providers/google
  - https://docs.openclaw.ai/tools/gemini-search
  - https://docs.openclaw.ai/channels/whatsapp
  - https://fast.io/resources/openclaw-gemini-integration-guide/
  - https://www.openclawplaybook.ai/guides/how-to-use-openclaw-gemini-search/
  - https://haimaker.ai/blog/best-gemini-models-for-openclaw/
  - https://mastra.ai/workshops/mastra-the-next-3-months
skills_index: ../../../index-skills.md
updated: 2026-05-27
---

# OpenClaw — implementation roadmap

> **One sentence:** OpenClaw is mdeai’s **approved execution worker** on the Hostinger VPS — browser research, enrichment crawls, draft outbound, and event ops — **never** the product brain, never payments, never booking commits without human approval.

**Strategic rule (non-negotiable):**

```text
CopilotKit = UI
Mastra      = orchestration + HITL gates
Supabase    = source of truth
pgvector    = semantic intelligence
Google ADK  = grounded geo facts (sync, :8000)
Gemini      = reasoning on VPS (OpenClaw) + mdeapp (Mastra @ai-sdk/google)
OpenClaw    = async browser / channel / Gemini web_search (after approve)
```

**Two Gemini surfaces (do not conflate):**

| Surface | Runtime | Model policy | Search grounding |
|---------|---------|--------------|------------------|
| **mdeapp** (Camila/Roberto chat) | Mastra + CopilotKit | `gemini-3.5-flash` per [`CLAUDE.md`](../../../CLAUDE.md) | ADK Grounding Lite + MAP-002D |
| **OpenClaw VPS** (enrichment jobs) | Hostinger gateway | See § Gemini below | `tools.web.search.provider: gemini` |

---

## Executive summary

| Question | Answer |
|----------|--------|
| **What is OpenClaw for mdeai?** | Build and refresh the **Medellín intelligence graph** — listings, menus, tours, events, social signals — via controlled browser automation |
| **What is it NOT?** | Primary chat brain, Stripe, vote tallies, autonomous bookings, unvetted ClawHub skills |
| **When to ship?** | **Phase 2+** after Phase 1 CopilotKit + Mastra + Maps MVP is green; events ticketing gate G1–G5 before outbound at scale |
| **Where it runs?** | Hostinger VPS (`openclaw-vmjg` Docker) — skill: `mde-hostinger` |
| **How jobs start?** | Mastra `openclaw-approval-workflow` → `automation_approvals` → `openclaw_jobs` → worker |
| **Best P0 wedge?** | Coffee-tour crawler + café/restaurant enrichment + event-directory import (scores 93–96 in [`11-openclaw.md`](./11-openclaw.md)) |

**Moat:** Not “another chatbot” — a **living city graph** (Maps + websites + Instagram + events + neighborhoods) that compounds as OpenClaw refreshes sources ([`13-openclaw.md`](./13-openclaw.md)).

---

## Source documents (read order)

### Tasks / research (this folder)

| File | Role |
|------|------|
| [`11-openclaw.md`](./11-openclaw.md) | Top 10 use cases, scorecard, MVP vs later, architecture DO/DON’T |
| [`12-openclaw.md`](./12-openclaw.md) | GitHub repos, café/restaurant features, dish intelligence, creator maps |
| [`../tasks/INDEX.md`](../tasks/INDEX.md) | **Executable tasks** — OCL-001-core … OCL-041-advanced (tiered) |
| [`13-openclaw.md`](./13-openclaw.md) | Startup/OSS synthesis, use-case matrix, three-loop architecture |
| [`events-use-cases.md`](./events-use-cases.md) | Events, venues, sponsors, vendors, Apify, Postiz, WhatsApp expansion |
| [`event-repos-skills-scorecard.md`](./event-repos-skills-scorecard.md) | Web research scorecard: top event GitHub repos, ClawHub skills, and 40 mdeai use cases |
| [`task-context-matrix.md`](./task-context-matrix.md) | Per-task descriptions, real-world examples, user stories, journeys/workflows, and agents |
| [`../agent/10-cafeintelligence-plan.md`](../../agent/10-cafeintelligence-plan.md) | Coffee tours — Phase A without OpenClaw; Phase B crawler = **OCL-013-mvp** |

### Plan — platform

| File | Role |
|------|------|
| [`plan/openclaw/INDEX.md`](../../../plan/openclaw/INDEX.md) | Doc index |
| [`plan/openclaw/events-openclaw/01-openclaw-adk.md`](../../../plan/openclaw/events-openclaw/01-openclaw-adk.md) | **Master PRD** — ADK + OpenClaw + vertical tables §7–13 |
| [`plan/diagrams/06-openclaw-integration.md`](../../../plan/diagrams/06-openclaw-integration.md) | Approval → outbox seam (Phase 2+) |

### Plan — verticals

| Vertical | Canonical doc | OpenClaw focus |
|----------|---------------|----------------|
| **Real estate** | [`plan/openclaw/real-estate/`](../../../plan/openclaw/real-estate/) · [`14-openclaw-user-stories.md`](../../../plan/openclaw/real-estate/14-openclaw-user-stories.md) | **OCL-018-postmvp** listing enrich |
| **Restaurants** | [`plan/openclaw/restaurants/`](../../../plan/openclaw/restaurants/) | **OCL-014-postmvp** menu extract |
| **Cafés** | [`tasks/listings/cafes/`](../../listings/cafes/) | **OCL-015-postmvp** IG discovery |
| **Coffee tours** | [`tasks/agent/10-cafeintelligence-plan.md`](../../agent/10-cafeintelligence-plan.md) | **OCL-013-mvp** crawler |
| **Events** | [`plan/openclaw/events-openclaw/`](../../../plan/openclaw/events-openclaw/) | **OCL-016-postmvp–017-postmvp**, **OCL-030-postmvp–041-advanced** |
| **Contests** | [`plan/openclaw/openclaw-contests.md`](../../../plan/openclaw/openclaw-contests.md) | **OCL-026-advanced** |
| **Marketing** | [`plan/openclaw/tasks/11-influencers.md`](../../../plan/openclaw/tasks/11-influencers.md) | **OCL-019-postmvp–020-postmvp**, **035** |

### Executable tasks

All promoted to [`../tasks/INDEX.md`](../tasks/INDEX.md). Legacy specs remain under `plan/openclaw/tasks/` and `drafts/tasks/openclaw/tasks/` for detail.

---

## OpenClaw scorecard (from research)

| Area | Score /100 | mdeai stance |
|------|----------:|--------------|
| Browser automation | 96 | Core enrichment |
| Research automation | 94 | Listings, tours, sponsors |
| Event operations | 90 | After ticketing green |
| Rental lead workflows | 89 | WA concierge Phase 3 |
| Maps intelligence automation | 88 | Feeds Supabase + pgvector |
| Autonomous reliability | 63 | **HITL required** |
| Security safety | 48 | Kill switch + approvals + no ClawHub |
| Production autonomy | 58 | Patricia / Roberto approve |

---

## Architecture

```mermaid
flowchart TB
  subgraph P1["Phase 1 — mdeapp (no OpenClaw prod)"]
    CK[CopilotKit /chat]
    MA[Mastra agents + tools]
    ADK[ADK Grounding Lite :8000]
    SB[(Supabase truth)]
    CK --> MA --> ADK
    MA --> SB
  end

  subgraph P2["Phase 2+ — approved automation"]
    APR[automation_approvals]
    ADM[/admin/approvals — Patricia]
    JOB[openclaw_jobs]
    OC[OpenClaw VPS gateway]
    RES[openclaw_job_results]
    MA --> APR
    APR --> ADM
    ADM -->|approved| JOB
    JOB --> OC
    OC -->|browser / draft only| WEB[Maps · sites · IG public]
    OC --> RES
    RES --> SB
  end

  subgraph Forbidden["Never OpenClaw"]
    PAY[Stripe / payments]
    VOTE[votes / winners]
    BOOK[booking commit]
  end
```

**Sync vs async:**

| Path | Latency | Examples |
|------|---------|----------|
| Mastra → ADK / Places | &lt; 8s | Camila asks “cafés in Laureles” |
| Mastra → enqueue OpenClaw | minutes–hours | Scrape menu, crawl coffee tours, event import |

---

## Vertical plans (what OpenClaw does per persona)

### Real estate — Camila & Andrés

**Stories:** [`14-openclaw-user-stories.md`](../../../plan/openclaw/real-estate/14-openclaw-user-stories.md) (WA concierge 11pm, host morning dashboard).

| Use case | OpenClaw role | Approval | Supabase target | Phase |
|----------|---------------|----------|-----------------|-------|
| Listing enrichment | Scrape public listing → draft copy/amenities | Host + Patricia | `openclaw_job_results` → listing draft | P2 |
| Comp pricing snapshot | Airbnb/Fincaraíz **public** pages | Internal | `research_snapshots` | P2 |
| Neighborhood intel | Blogs/reddit → chunks | Patricia | `research_chunks` + pgvector P2 | P2 |
| WA rental concierge | Reply & qualify leads | **High** — Paperclip + allowlist | `leads`, `contacts` | P3 |
| Host lead enrichment | Public contact discovery | Patricia only | `leads` | P3 |

**mdeapp surface:** `/rentals`, `/` — Mastra `rental-search-workflow`; OpenClaw **never** writes rentals without edge/RLS path.

---

### Events — Roberto & Patricia

**PRD:** [`events-openclaw-prd.md`](../../../plan/openclaw/events-openclaw/events-openclaw-prd.md).

| Use case | ROI | OpenClaw | Approval | Phase |
|----------|-----|----------|----------|-------|
| Venue research | Host wizard quality | Browser enrich `venue_intelligence` | Roberto review | P2 |
| Event directory import | Discovery map | Crawl MDE / public calendars | Scheduled internal | P2 |
| Sponsor prospecting | B2B revenue | Research → lead list | Patricia | P2 |
| External publish | Distribution | Draft posts → outbox | Roberto + Patricia | P3 |
| WA leaderboard / reminders | Contest virality | Scheduled sends | Patricia + G1–G5 | P3 |
| No-show recovery | [`070-openclaw-no-show-recovery.md`](../../../plan/openclaw/events-openclaw/070-openclaw-no-show-recovery.md) | Template drafts | Patricia | P3 |

**Forbidden:** payments, votes, ticket validation — Supabase edges only.

---

### Restaurants & cafés — Tourist / Camila on `/chat`

**References:** [`openclaw-restaurant.md`](../../../plan/openclaw/restaurants/openclaw-restaurant.md) (personal `/resi` pattern — adapt ideas, not Medellín reservation bots in MVP).

| Use case | Value | OpenClaw | Phase |
|----------|-------|----------|-------|
| Menu extraction | Dish-level search | PDF/HTML → structured | P2 |
| Instagram café discovery | Hidden gems | Public profile / location tags | P2 |
| Review theme harvest | Trust summaries | Crawl → grounded summaries | P2 |
| Best-dish extraction | Differentiation | OCR + Gemini structure | P2 |
| Competitor / SEO monitor | Ops | Weekly diff | P2 |
| Autonomous table booking | — | **Defer P5** — HITL only | P5 |

**Product path:** Mastra `restaurant-discovery-workflow` + `search-grounded-places` (Phase 1) → OpenClaw **feeds** `restaurant_profiles` / embeddings (Phase 2).

---

### Coffee tours — links CTI roadmap

| Step | Owner | Doc |
|------|-------|-----|
| Chat MVP (SQL seed) | Mastra + CopilotKit | [`10-cafeintelligence-plan.md`](../../agent/10-cafeintelligence-plan.md) CTI-001A–010 |
| Crawl + verify IG/booking | OpenClaw | **OCL-013-mvp** ([`index-ocl.md`](../index-ocl.md)) |
| Embeddings | Server job | CTI-011 |

OpenClaw fills: authenticity signals, duplicate operators, source confidence — Maps alone insufficient ([`11-openclaw.md`](./11-openclaw.md) §3).

---

### MDE Community & growth

| Use case | Phase | Notes |
|----------|-------|-------|
| Community event import | P2 | Low risk, scheduled |
| Sponsor lead lists | P2 | ADK research handoff → OpenClaw enrich |
| Postiz draft campaigns | P3 | After approval |
| SEO guide drafts (“Best Coffee Tours 2026”) | P2 | Human publish |

---

## Recommended OpenClaw agents (VPS — Phase 2)

From production plan — **custom SKILL.md only**, no unvetted ClawHub installs ([`19C`](../../../drafts/tasks/openclaw/tasks/19C-clawhub-skill-safety-review.md)).

| Agent | Purpose | Channels |
|-------|---------|----------|
| `mde-discovery` | Listing / venue / tour crawl | Browser |
| `mde-enrichment` | Menu, hours, social links | Browser |
| `mde-events-ops` | Reminders, ROI screenshots | WA (approved) |
| `mde-outreach` | Sponsor / partner drafts | WA / email drafts |
| `mde-content` | Postiz-bound copy | Internal |

**Not in Phase 2:** fully autonomous `mde-concierge` booking executor.

---

## Supabase schema (Phase 2 migrations)

Design in [`01-openclaw-adk.md`](../../../plan/openclaw/events-openclaw/01-openclaw-adk.md) §10 — implement together:

| Table | Purpose |
|-------|---------|
| `automation_approvals` | HITL queue — Patricia / Roberto / host |
| `openclaw_jobs` | `job_type`, `payload`, `status`, `approval_id` |
| `openclaw_job_results` | Normalized scrape output + errors |
| `agent_tool_logs` | Audit trail |
| `outbox_events` | Planned external actions (may lag DB) |

**RLS:** user-facing tables unchanged; job tables **service role + admin UI** only.

**Kill switch:** `OPENCLAW_DISABLED=1` in mdeapp + VPS compose stop.

---

## Gemini + Google Search on OpenClaw (VPS)

Verified against [OpenClaw Google provider](https://docs.openclaw.ai/providers/google), [Gemini search tool](https://docs.openclaw.ai/tools/gemini-search), and operator guides ([Fast.io](https://fast.io/resources/openclaw-gemini-integration-guide/), [OpenClaw Playbook — Gemini Search](https://www.openclawplaybook.ai/guides/how-to-use-openclaw-gemini-search/), [haimaker model routing](https://haimaker.ai/blog/best-gemini-models-for-openclaw/)).

### Auth (VPS only)

```bash
openclaw onboard --auth-choice gemini-api-key
# ~/.openclaw/.env
GEMINI_API_KEY=...   # or GOOGLE_API_KEY; GEMINI_API_KEY wins
```

**Avoid** production reliance on `google-gemini-cli` OAuth — unofficial path; account restrictions reported ([provider docs](https://docs.openclaw.ai/providers/google)).

### Recommended model routing (mdeai VPS)

| Role | OpenClaw model ref | Why |
|------|-------------------|-----|
| **Default agent** | `google/gemini-3.5-flash` | Align with mdeapp; verify `openclaw models list --provider google` |
| **Hard reasoning** | `google/gemini-3.1-pro-preview` | Multi-step crawl plans, dedupe |
| **Heartbeat / cron** | `google/gemini-2.5-flash-lite` or `gemini-2.0-flash-001` | Cost control ([heartbeat tax](https://haimaker.ai/blog/best-gemini-models-for-openclaw/)) |
| **web_search** | `gemini-2.5-flash` (plugin default) | One **synthesized** answer + citations — not a SERP list |

```json5
// ~/.openclaw/openclaw.json (sketch — OCL-006-core)
{
  agents: { defaults: { model: { primary: "google/gemini-3.5-flash" } } },
  tools: { web: { search: { provider: "gemini" } } },
  plugins: {
    entries: {
      google: {
        config: {
          webSearch: { model: "gemini-2.5-flash" },
        },
      },
    },
  },
}
```

**Credential precedence (web search):** `plugins.entries.google.config.webSearch.apiKey` → `GEMINI_API_KEY` → `models.providers.google.apiKey` ([gemini-search](https://docs.openclaw.ai/tools/gemini-search)).

### When OpenClaw Gemini search vs Mastra/ADK

| Need | Use | Not |
|------|-----|-----|
| Camila chat + map pins &lt;8s | Mastra → ADK Grounding Lite | OpenClaw |
| Cited blog/IG/booking verify (async) | OpenClaw `web_search` gemini | Raw Gemini in concierge |
| Places facts (`place_id`, hours) | Places API via mdeapp/ADK | OpenClaw inventing coords |
| Operator research memo | OpenClaw gemini search | Unlabeled synthesis in product UI |

Gemini search returns **one synthesized answer** with citations; `count` is ignored ([docs](https://docs.openclaw.ai/tools/gemini-search)). Label results as model output in job logs.

### Mastra + OpenClaw (workshop alignment)

[Mastra workshop — Build an OpenClaw Agent with Mastra](https://mastra.ai/workshops/mastra-the-next-3-months) (2026-04-23): map OpenClaw “claws” to Mastra primitives — **memory** (working/observational), **workspace tools** (browser/files), **skills**, **channel adapters**. mdeai implements the **seam** first (OCL-003-core/011): Mastra enqueues; OpenClaw executes; Supabase stores results. Full Mastra-hosted OpenClaw runtime is **Phase 3+** exploration, not Phase 1.

### WhatsApp (Phase 3)

Channel config per [OpenClaw WhatsApp docs](https://docs.openclaw.ai/channels/whatsapp). mdeai: pairing runbook in [`plan/openclaw/whatsapp/`](../../../plan/openclaw/whatsapp/); outbound only after Paperclip + allowlist (OCL-029-advanced).

---

## Implementation roadmap (OCI tasks)

> **Reorganized:** [`../tasks/INDEX.md`](../tasks/INDEX.md) — **MVP** (tour enrich only) → **Post-MVP** (menus, events, rentals, SEO) → **Advanced** (WA, Paperclip, Postiz). **No Paperclip on MVP path.**

### MVP (real-world)

One loop: Patricia approves → OpenClaw verifies **coffee tour sources** → Tourist sees better cards (CTI + **OCL-013-mvp**). Platform: **core** 001–006 → **mvp** 008–012 → **013**.

### Post-MVP

OCL-014-postmvp–021-postmvp (menus, cafés IG, events, rentals, sponsors, SEO, traces).

### Advanced (defer)

OCL-022-advanced–029-advanced (WA templates, event ops, contests, Postiz, Paperclip deferred).

---

## Legacy task table (reference)

> **Canonical IDs (2026-05-27):** [`../index-ocl.md`](../index-ocl.md) — **core** 001–007 · **mvp** 008–013 · **post-mvp** 020–027 · **advanced** 030–037. Tables below group by delivery phase; task numbers match the canonical index.

> **Full task specs:** [`../tasks/INDEX.md`](../tasks/INDEX.md)

### Phase 0 — Gates & infra (before any enrichment job)

| ID | Task | Depends | Acceptance | Effort | Risk |
|----|------|---------|------------|--------|------|
| **OCL-028-advanced** | Paperclip security foundation (15A) | — | No bypass flags; board approve works | L | High if skipped |
| **OCL-001-core** | Gateway health stub (05M) | VPS up | `GET /health` 200 from mdeapp probe | S | Low |
| **OCL-002-core** | Rotate gateway token → Infisical | OCL-001-core | Old token revoked | S | **Critical** |
| **OCL-003-core** | Migrations: `automation_approvals`, `openclaw_jobs`, `openclaw_job_results` | F08 patterns | RLS + advisors clean | M | Med |
| **OCL-004-core** | `openclaw-approval-workflow` in Mastra | OCL-003-core | Job **rejected** without `approved` | M | Med |
| **OCL-005-core** | Admin preview UI (`/admin/approvals`) | OCL-004-core | Diff JSON before approve | M | Low |
| **OCL-006-core** | ClawHub policy doc + 19C review | — | Zero unvetted skills in prod compose | S | High |
| **OCL-007-core** | `OPENCLAW_DISABLED` kill switch wired | OCL-001-core | E2E: enqueue blocked when set | S | Low |

**Verify Phase 0:**

```bash
# VPS (from mde-hostinger skill)
curl -sS "$OPENCLAW_GATEWAY_URL/health"
cd mdeapp && npm test -- src/mastra/**/openclaw*
```

---

### Phase 1 — mdeapp MVP (OpenClaw **design only**)

| Rule | Action |
|------|--------|
| No `openclaw_jobs.insert` in production paths | Code review gate |
| Maps + chat work without OpenClaw | MAP-002, F48–F50 Done |
| Document job types | This file + `01-openclaw-adk.md` |

**Parallel content work (human/Firecrawl):** listings seeds — no VPS required.

---

### Phase 2 — Enrichment worker (core OpenClaw value)

| ID | Task | Vertical | Files (likely) | Acceptance | Effort | Risk |
|----|------|----------|----------------|------------|--------|------|
| **OCL-010-mvp** | `mde-tour-enrich` skill + job runner | mvp | VPS `skills/mde-tour-enrich/` | One job completes, logs to `openclaw_job_results` | L | Med |
| **OCL-018-postmvp** | Listing enrichment job | post-mvp | payload `{ listing_id }` | Draft amenities visible in admin | M | Med |
| **OCL-014-postmvp** | Menu / profile extraction | post-mvp | `restaurant_profiles.payload` | Owner-approved structured menu | M | TOS |
| **OCL-017-postmvp** | Event directory import | post-mvp | `events` / cache | 10 events imported with `place_id` | M | Low |
| **OCL-016-postmvp** | Venue intelligence enrich | post-mvp | `venue_intelligence` | Roberto sees enriched venue card | M | Low |
| **OCL-036-postmvp** | Repo/skill intake audit gate | post-mvp | source register + decision records | 5 sources reviewed before adaptation | S | Low |
| **OCL-037-postmvp** | Event planner checklist adapter | post-mvp | checklist model + approval cards | Roberto approves generated checklist | M | Low |
| **OCL-038-postmvp** | Event source connector adapters | post-mvp | `event_candidates` draft shape | Luma/Ticketmaster/Meetup-like outputs normalize | M | Med |
| **OCL-039-postmvp** | Source health monitor | post-mvp | connector run health | Drift/zero-result/cost alerts surface | M | Med |
| **OCL-040-postmvp** | Event page QA crawler | post-mvp | QA reports + screenshots | Bad CTA/date/map blocks campaign approval | M | Med |
| **OCL-013-mvp** | Coffee tour crawler | mvp | CTI-003 schema | 5 tours gain `source_confidence` + sources rows | M | Scrape fragility |
| **OCL-011-mvp** | Mastra tool `enqueueOpenClawJob` | mvp | `mastra/tools/enqueue-openclaw-job.ts` | Concierge can **propose** job; not auto-run | S | Low |
| **OCL-021-postmvp** | Correlation IDs (08G) | post-mvp | logs across Mastra ↔ OC | Single trace id per job | M | Low |
| **OCL-012-mvp** | E2E: reject without approval | mvp | Playwright / script | No result row without `approval_id` | S | **Critical** |

**Phase 2 verify:** Job dry-run on staging VPS → result lands in Supabase → Patricia approves → Camila sees updated card on next chat (cache TTL).

---

### Phase 3 — Outbound & ops (after G1–G5 events)

| ID | Task | Depends | Acceptance |
|----|------|---------|------------|
| **OCL-029-advanced** | Paperclip `openclaw_gateway` adapter (05H) — **deferred** | OCL-001-core, 15A | Idempotent WA test |
| **OCL-022-advanced** | WA template library + allowlist | OCL-029-advanced | No send outside allowlist |
| **OCL-023-advanced** | Event reminder skill | G1–G5 | T-24h draft → approve → send |
| **OCL-024-advanced** | Sponsor ROI screenshot job | Events PRD | PNG in Storage + admin link |
| **OCL-027-advanced** | Postiz handoff (approved) | Postiz VPS | Scheduled post after board approve |
| **OCL-025-advanced** | External event publish draft | Roberto | `outbox_events` only |
| **OCL-035-advanced** | Approved WhatsApp/Postiz/social campaign execution | OCL-022, OCL-027, OCL-032, OCL-034 | Approved send/schedule only |
| **OCL-041-advanced** | Live ops ticker | OCL-022, OCL-023, OCL-035, OCL-040 | Role-specific internal updates replay from logs |

---

### Phase 4–5 — Advanced (explicit defer)

| Feature | Priority | Notes |
|---------|----------|-------|
| Autonomous restaurant booking | P5 | HITL only — [`openclaw-restaurant.md`](../../../plan/openclaw/restaurants/openclaw-restaurant.md) |
| Full social posting automation | P3 | Postiz + approval |
| Real-browser user-account control | P4 | Credential risk |
| Fully autonomous city agents | P5 | Reject |

---

## Build NOW vs LATER (from [`11-openclaw.md`](./11-openclaw.md))

### Build NOW (Phase 2 P0)

| Feature | OCI | Vertical |
|---------|-----|----------|
| Coffee-tour crawler | OCL-013-mvp | Tours |
| Café / restaurant enrichment | OCL-014-postmvp, 021 | Restaurants / cafés |
| Event-directory crawler | OCL-017-postmvp, 022 | Events |
| Platform seam + enqueue | OCL-001-core … OCL-012-mvp | Platform |
| SEO research workflows | MDE content agent | P2 |

### Build LATER

| Feature | Phase |
|---------|-------|
| Sponsor research automation | P2–P3 |
| WA rental concierge 24/7 | P3 (OCL-014-postmvp+) |
| Autonomous bookings | P5 |
| Creator-food-map extraction | P2 advanced |

---

## CopilotKit + Mastra interaction (how OpenClaw surfaces to users)

| User action | Phase 1 | Phase 2+ |
|-------------|---------|----------|
| “Best coffee farm tour” | Mastra `searchCoffeeTours` (SQL/ADK) | Same + background crawl refreshes data |
| “Why is this tour recommended?” | `ai_summary` from DB | Sources from `coffee_tour_sources` |
| “Refresh this listing” | N/A — manual admin | Host triggers → approval → OCL-018-postmvp |
| “Post my event to Instagram” | HITL wizard only | Approve → OCL-025-advanced outbox |

**UI components (Phase 2):**

- `OpenClawJobPreviewCard` — diff before approve ([`01-openclaw-adk.md`](../../../plan/openclaw/events-openclaw/01-openclaw-adk.md) §9)
- Source badges on tour/restaurant cards (CTI / restaurant profiles)

---

## Safety, quality, production rules

| Rule | Enforcement |
|------|-------------|
| No client-side OpenClaw tokens | Gateway URL + secret server/VPS only |
| No service role in `mdeapp/src/**` | Edge functions + VPS worker |
| Cache Google API responses | `place_details_cache`, tour cache |
| Store source provenance | `*_sources` tables |
| Never hallucinate facts | Tool/DB fields only; AI text labeled |
| Uncertain fields | `unknown` + low `source_confidence` |
| RLS on user interactions | Saves, compares |
| No payments / votes / bookings via OpenClaw | Architecture review CI |
| ClawHub skills | **Banned** in prod without 19C review |
| Rate limits | Job queue concurrency caps on VPS |
| localhost Done gate | Smoke only for **mdeapp** paths; VPS jobs need staging evidence |

---

## Dependencies & sequencing

```text
Phase 1 mdeapp (no OpenClaw)
  MAP-002 → F48–F50 → CTI-001A–010 (tours in chat)
       ↓
OpenClaw MVP
  OCL-001-core → … → 006-core → 008-mvp → … → 012-mvp → 013-mvp
       ↓
Post-MVP enrichment (menus, events, rentals, SEO)
       ↓
Advanced (WA, Paperclip optional, Postiz, contests)
```

| Upstream | Blocks OpenClaw |
|----------|----------------|
| Phase 1 chat/map green | Any user-visible dependency on crawl |
| CTI-001A schema + CTI-003 seed | OCL-013-mvp writes |
| Paperclip | **Not required** — defer OCL-028-advanced, 029-advanced |
| Events G1–G5 | OCL-023-advanced reminders at scale |

---

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| OpenClaw as second brain | Split memory, RLS bypass | Mastra-only orchestration |
| ClawHavoc / malicious skills | VPS compromise | Custom skills only (19C) |
| Instagram/Maps ToS | Account ban | Public pages only; rate limits |
| CAPTCHA / bot blocks | Failed jobs | Retry + human fallback queue |
| Credential in browser profile | Leak | Dedicated profile; no prod passwords |
| Unapproved WA send | Spam / legal | Paperclip + allowlist |
| Stale crawl data | Wrong recommendations | `freshness_at` + confidence decay |

---

## Final recommendation

1. **Treat OpenClaw as infrastructure**, not a feature flag in Phase 1 — ship [`plan/openclaw/events-openclaw/01-openclaw-adk.md`](../../../plan/openclaw/events-openclaw/01-openclaw-adk.md) MVP track first (MAP + CopilotKit).
2. **Execute Phase 0 (OCL-001-core … OCL-007-core)** on VPS + Supabase before first real crawl.
3. **First production job:** **OCL-013-mvp** coffee-tour crawler — highest score, feeds CTI roadmap and listings moat.
4. **Second wave:** OCL-014-postmvp menu extraction + OCL-017/OCL-036–040 event import, adapter, and QA tasks — direct Tourist/Roberto value without copying unvetted repos.
5. **Defer WA** until Advanced tier — use `/admin/approvals` + direct OpenClaw API; Paperclip optional.

**Success metrics (Phase 2):**

- ≥50 enriched entities/month with provenance
- 0 jobs without `approval_id`
- p95 job failure visible in Patricia admin
- Camila sees fresher tour/restaurant cards without agent-invented URLs

---

## Evidence (when phases Done)

| Phase | Evidence file |
|-------|----------------|
| Phase 0 | `tasks/notes/OCL-0-evidence.md` |
| Phase 2 | `tasks/notes/OCL-2-evidence.md` |
| Phase 3 | `tasks/notes/OCL-3-evidence.md` |

---

## Related indexes

- **Tasks:** [`../tasks/INDEX.md`](../tasks/INDEX.md)
- **Research index:** [`plan/openclaw/INDEX.md`](../../../plan/openclaw/INDEX.md)
- Maps (Phase 1): [`tasks/maps/INDEX.md`](../../maps/INDEX.md)
- Coffee tours (Mastra): [`tasks/agent/10-cafeintelligence-plan.md`](../../agent/10-cafeintelligence-plan.md) · CTI-019 = OCL-013-mvp
- Skills: `open-claw`, `mde-hostinger`, `mastra`, `copilotkit-integrations`, `gemini`, `mde-supabase`, `mde-maps` — [`index-skills.md`](../../../index-skills.md)
