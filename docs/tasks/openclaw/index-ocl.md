---
title: OpenClaw (OCL) — master task index
updated: 2026-05-27
roadmap: ./docs/100-openclaw-plan.md
task_specs: ./tasks/
research: ./docs/11-openclaw.md
plan_index: ../../plan/openclaw/INDEX.md
related_chat: ../agent/10-cafeintelligence-plan.md
---

# OpenClaw tasks — index

> **Role:** OpenClaw = approved **background worker** on Hostinger VPS. **Not** the chat brain (CopilotKit + Mastra + ADK on `mdeapp`).

**Approve jobs in:** `/admin/approvals` (Supabase) — **not** Paperclip on the MVP path.

**ID scheme:** `OCL-{NNN}-{tier}` — **one global build order** (001 → 041). Tier suffix = when to ship, not a second counter.

| Block | IDs | Tier suffix |
|-------|-----|-------------|
| Platform seam | **001–007** | `-core` |
| First app (coffee tours) | **008–013** | `-mvp` |
| More Medellín graph | **014–021** | `-postmvp` |
| WA / contests / Paperclip | **022–029** | `-advanced` |
| Events expansion | **030–040** | `-postmvp` |
| Advanced event ops | **041** | `-advanced` |

---

## Implementation order (all 41)

### core (001–007)

| ID | Task | Real-world why |
|----|------|----------------|
| [OCL-001-core](./tasks/OCL-001-core-gateway-health.md) | Gateway health | Crawls can run at all |
| [OCL-002-core](./tasks/OCL-002-core-jobs-schema.md) | Jobs + approvals tables | Patricia has audit trail |
| [OCL-003-core](./tasks/OCL-003-core-approval-workflow.md) | Approve before queue | No silent browser jobs |
| [OCL-004-core](./tasks/OCL-004-core-clawhub-safety.md) | No random ClawHub skills | VPS stays trustworthy |
| [OCL-005-core](./tasks/OCL-005-core-kill-switch.md) | `OPENCLAW_DISABLED` | Stop bad deploy fast |
| [OCL-006-core](./tasks/OCL-006-core-gemini-vps-config.md) | VPS Gemini API key | Worker can reason |
| [OCL-007-core](./tasks/OCL-007-core-gateway-token-rotate.md) | Rotate gateway token | Stolen token ≠ open VPS |

### mvp (008–013)

| ID | Task | Real-world why |
|----|------|----------------|
| [OCL-008-mvp](./tasks/OCL-008-mvp-admin-approvals-ui.md) | `/admin/approvals` | Patricia clicks Approve |
| [OCL-009-mvp](./tasks/OCL-009-mvp-gemini-web-search.md) | Gemini `web_search` | Verify booking/official URLs |
| [OCL-010-mvp](./tasks/OCL-010-mvp-tour-enrich-skill.md) | `mde-tour-enrich` skill | Browser + search steps |
| [OCL-011-mvp](./tasks/OCL-011-mvp-enqueue-openclaw-job.md) | `enqueueOpenClawJob` | Mastra → VPS |
| [OCL-012-mvp](./tasks/OCL-012-mvp-e2e-approval-safety.md) | E2E safety test | No job without approval |
| [OCL-013-mvp](./tasks/OCL-013-mvp-coffee-tour-crawler.md) | **Coffee tour crawl** | Tourist: source badges + confidence |

**MVP outcome:** verified tour links on cards (needs **CTI-001A**, CTI-003 with ≥3 `place_id`).

**Events outcome:** after event commerce and event cards are green, OpenClaw can enrich venues, identify sponsor decision-maker types, draft sponsor proposals, research vendors, and collect public social signals. It still cannot send outreach, publish posts, or mutate event truth without approval.

### post-mvp (014–021)

| ID | Vertical | Persona | Result |
|----|----------|---------|--------|
| [OCL-014-postmvp](./tasks/OCL-014-postmvp-menu-extraction.md) | Restaurants | Tourist | Real menu dishes |
| [OCL-015-postmvp](./tasks/OCL-015-postmvp-instagram-cafe-discovery.md) | Cafés | Tourist | IG hidden gems |
| [OCL-016-postmvp](./tasks/OCL-016-postmvp-venue-intelligence.md) | Events | Roberto | Richer host wizard venue |
| [OCL-017-postmvp](./tasks/OCL-017-postmvp-event-directory-import.md) | Events | Tourist | More map events |
| [OCL-018-postmvp](./tasks/OCL-018-postmvp-listing-enrichment.md) | Rentals | Camila | Listing copy from public pages |
| [OCL-019-postmvp](./tasks/OCL-019-postmvp-sponsor-prospect-research.md) | Marketing | Patricia | Sponsor leads + citations |
| [OCL-020-postmvp](./tasks/OCL-020-postmvp-seo-competitor-monitor.md) | Marketing | Patricia | SEO vs city guides |
| [OCL-021-postmvp](./tasks/OCL-021-postmvp-correlation-observability.md) | Platform | Sofía | One trace id per failed crawl |

### post-mvp event expansion (030–040)

| ID | Vertical | Persona | Result |
|----|----------|---------|--------|
| [OCL-030-postmvp](./tasks/OCL-030-postmvp-apify-plugin-sandbox.md) | Platform | Sofia / Patricia | Apify `discover -> start -> collect` sandbox with approval, actor allowlist, run IDs |
| [OCL-031-postmvp](./tasks/OCL-031-postmvp-event-sponsor-decision-maker-map.md) | Sponsors | Patricia | Sponsor decision-maker type map with public evidence |
| [OCL-032-postmvp](./tasks/OCL-032-postmvp-sponsor-proposal-draft-pack.md) | Sponsors | Patricia / Roberto | Approval-ready proposal drafts, never auto-sent |
| [OCL-033-postmvp](./tasks/OCL-033-postmvp-event-vendor-recruitment-research.md) | Vendors | Roberto | Vetted vendor shortlists for event planning |
| [OCL-034-postmvp](./tasks/OCL-034-postmvp-event-social-intelligence.md) | Marketing | Patricia | Public Instagram/Facebook/TikTok intelligence, source-labeled drafts |
| [OCL-036-postmvp](./tasks/OCL-036-postmvp-repo-skill-intake-audit.md) | Platform | Sofia / Patricia | Intake audit gate for GitHub repos, ClawHub skills, Apify Actors, and OpenClaw skills |
| [OCL-037-postmvp](./tasks/OCL-037-postmvp-event-planner-checklist-adapter.md) | Events | Roberto | Event-planner checklist adapter for timelines, vendors, sponsors, staffing, and post-event tasks |
| [OCL-038-postmvp](./tasks/OCL-038-postmvp-event-source-connector-adapters.md) | Events | Patricia / Tourist | Public event source connector adapters for Luma-like, Ticketmaster-like, Meetup-like, and Apify sources |
| [OCL-039-postmvp](./tasks/OCL-039-postmvp-event-source-health-monitor.md) | Platform | Sofia / Patricia | Source health, connector drift, zero-result, and cost monitor |
| [OCL-040-postmvp](./tasks/OCL-040-postmvp-event-page-qa-crawler.md) | Events | Patricia / Roberto | Event page QA crawler before launch or campaign approval |

### advanced (022–029, 035, 041) — defer

| ID | Notes |
|----|-------|
| [OCL-022-advanced](./tasks/OCL-022-advanced-wa-templates-allowlist.md) | WA template allowlist |
| [OCL-023-advanced](./tasks/OCL-023-advanced-event-reminders.md) | T-24h reminders (after G1–G5) |
| [OCL-024-advanced](./tasks/OCL-024-advanced-sponsor-roi-screenshots.md) | Sponsor renewal assets |
| [OCL-025-advanced](./tasks/OCL-025-advanced-external-publish-draft.md) | FB/IG drafts — human publishes |
| [OCL-026-advanced](./tasks/OCL-026-advanced-contest-wa-ops.md) | Contest WA — **no votes/payments** |
| [OCL-027-advanced](./tasks/OCL-027-advanced-postiz-handoff.md) | Postiz scheduling |
| [OCL-028-advanced](./tasks/OCL-028-advanced-paperclip-gates-deferred.md) | Paperclip gates — **deferred** |
| [OCL-029-advanced](./tasks/OCL-029-advanced-paperclip-wa-deferred.md) | Paperclip WA — **deferred** |
| [OCL-035-advanced](./tasks/OCL-035-advanced-approved-channel-campaigns.md) | Approved WhatsApp/Postiz/social campaign execution |
| [OCL-041-advanced](./tasks/OCL-041-advanced-live-ops-ticker.md) | Live ops ticker and role-specific event updates |

---

## Prerequisite (mdeapp — not OCL)

| Work | Persona | Path |
|------|---------|------|
| MAP-002, F48–F50 | Map + grounded chat | `tasks/maps/` |
| CTI-001A–010 | Tour cards in chat | `tasks/agent/tasks/` |

OpenClaw **refreshes** sources; CTI **shows** them.

---

## Critical path

```text
CTI-001A → CTI-003 (≥3 place_id) → CTI-006 → CTI-004–008 → CTI-010
OCL-001-core → … → 006-core → 008-mvp → … → 012-mvp → 013-mvp
```

Evidence: `tasks/notes/OCL-mvp-evidence.md`

---

## Legacy ID map

| Old | Current |
|-----|---------|
| `OCL-CORE-001` | `OCL-001-core` |
| `OCL-MVP-006` / `OCI-CAFE-002` | `OCL-013-mvp` |
| `OCL-POSTMVP-001` | `OCL-014-postmvp` |
| `OCL-ADV-008` | `OCL-029-advanced` |
| Apify / sponsor decision-maker / vendor research | `OCL-030-postmvp` → `OCL-034-postmvp` |
| GitHub repo / ClawHub skill adaptation | `OCL-036-postmvp` → `OCL-041-advanced` |
| Flat `OCI-001` … `OCI-037` | See git history / prior `index-ocl` |

---

## By application

| Application | First OCL task |
|-------------|----------------|
| Coffee tours (Tourist) | **013-mvp** |
| Restaurants | 014-postmvp |
| Cafés IG | 015-postmvp |
| Events host | 016–017-postmvp |
| Rentals | 018-postmvp |
| Sponsors / SEO | 019–020-postmvp |
| Contests | 026-advanced |
| Events Apify sandbox | 030-postmvp |
| Sponsor decision-makers | 031-postmvp |
| Sponsor proposal drafts | 032-postmvp |
| Event vendors | 033-postmvp |
| Event social intelligence | 034-postmvp |
| Repo / ClawHub skill intake | 036-postmvp |
| Event planner checklist adapter | 037-postmvp |
| Event source connectors | 038-postmvp |
| Event source health | 039-postmvp |
| Event page QA crawler | 040-postmvp |
| Approved channel campaigns | 035-advanced |
| Live ops ticker | 041-advanced |

---

## Verified sources (skills + upstream)

| Resource | Link |
|----------|------|
| **OCL sources hub** | [`docs/sources.md`](./docs/sources.md) — per-task docs + GitHub + verifier gates |
| **Event repo/skill scorecard** | [`docs/event-repos-skills-scorecard.md`](./docs/event-repos-skills-scorecard.md) — top 20 GitHub repos, top 20 ClawHub/OpenClaw skills, 40 events use cases |
| **Task context matrix** | [`docs/task-context-matrix.md`](./docs/task-context-matrix.md) — descriptions, real-world examples, user stories, journeys, workflows, and agents for every OCL task |
| **open-claw skill** | `.claude/skills/open-claw/` · [`llms.txt`](https://docs.openclaw.ai/llms.txt) |
| **task-verifier** | `.claude/skills/task-verifier/` · [`references/openclaw-ocl.md`](../../.claude/skills/task-verifier/references/openclaw-ocl.md) |
| **openclaw** | [github.com/openclaw/openclaw](https://github.com/openclaw/openclaw) |
| **docs (git)** | [github.com/openclaw/openclaw/tree/main/docs](https://github.com/openclaw/openclaw/tree/main/docs) |
| **clawhub** | [github.com/openclaw/clawhub](https://github.com/openclaw/clawhub) — registry; **prod ban** (OCL-004) |
| **agent-skills** | [github.com/openclaw/agent-skills](https://github.com/openclaw/agent-skills) — patterns for custom `mde-*` skills |
| **lobster** | [github.com/openclaw/lobster](https://github.com/openclaw/lobster) — optional pipelines (post-MVP) |

Each task file includes `sources_index`, `openclaw_docs`, and `github` frontmatter where applicable.

## Docs (mdeai plan tree)

| If implementing… | Read |
|------------------|------|
| **001–007** | `01-openclaw-adk.md`, `06-openclaw-integration`, `08K`, `19C` |
| **013-mvp** | `11-openclaw`, `10-cafeintelligence-plan`, `06-coffee-tours` |
| **014-postmvp** | `openclaw-restaurant.md` |
| **016–017, 023–025** | `events-openclaw-prd.md` |
| **022+ WA** | `plan/openclaw/whatsapp/*` |

Full roadmap: [`100-openclaw-plan.md`](./docs/100-openclaw-plan.md) · [`plan/openclaw/INDEX.md`](../../plan/openclaw/INDEX.md)

Per-task product context: [`task-context-matrix.md`](./docs/task-context-matrix.md)

---

## Verify

```bash
curl -sS "$OPENCLAW_GATEWAY_URL/health"
openclaw status
cd mdeapp && npm test -- openclaw
```
