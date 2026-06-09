---
title: OpenClaw — verified sources for OCL tasks
updated: 2026-05-27
claude_skills:
  - ../../../.claude/skills/open-claw/SKILL.md
  - ../../../.claude/skills/task-verifier/SKILL.md
  - ../../../.claude/skills/mde-hostinger/SKILL.md
---

# OpenClaw sources (verified for mdeai OCL tasks)

Use these **before** implementing any `tasks/openclaw/tasks/OCL-*.md` spec. Prefer fetched docs over training memory — OpenClaw changes fast.

## Official entry points

| Resource | URL | Use for |
|----------|-----|---------|
| **Docs (human)** | [https://docs.openclaw.ai/](https://docs.openclaw.ai/) | Overview, quick start, Control UI |
| **Docs index (agents)** | [https://docs.openclaw.ai/llms.txt](https://docs.openclaw.ai/llms.txt) | Discover the right `.md` page |
| **OpenAPI** | [https://docs.openclaw.ai/api-reference/openapi.json](https://docs.openclaw.ai/api-reference/openapi.json) | HTTP gateway / tools invoke |
| **Docs source (GitHub)** | [https://github.com/openclaw/openclaw/tree/main/docs](https://github.com/openclaw/openclaw/tree/main/docs) | Offline browse, PRs upstream |

## GitHub org (use / avoid)

| Repo | URL | mdeai role |
|------|-----|------------|
| **openclaw** | [https://github.com/openclaw/openclaw](https://github.com/openclaw/openclaw) | Gateway, CLI, Pi agent, channels |
| **clawhub** | [https://github.com/openclaw/clawhub](https://github.com/openclaw/clawhub) | Public skill registry + `clawhub` CLI — **OCL-004: no prod installs** |
| **agent-skills** | [https://github.com/openclaw/agent-skills](https://github.com/openclaw/agent-skills) | Shared workflows (`autoreview`, `crabbox`, `handoff`) — patterns for **custom** `mde-*` skills, not ClawHub |
| **lobster** | [https://github.com/openclaw/lobster](https://github.com/openclaw/lobster) | Typed workflow shell — optional post-MVP; doc: [tools/lobster](https://docs.openclaw.ai/tools/lobster) |
| **skills** (archive) | [https://github.com/openclaw/skills](https://github.com/openclaw/skills) | Historical ClawHub backups — **do not** treat as vetted for prod |

## mdeai event research artifacts

| File | Use for |
|------|---------|
| [`events-use-cases.md`](./events-use-cases.md) | Events, venues, sponsors, vendors, Apify, Postiz, WhatsApp expansion |
| [`event-repos-skills-scorecard.md`](./event-repos-skills-scorecard.md) | Web research scorecard: top 20 event GitHub repos, top 20 ClawHub/OpenClaw skills, and 40 mdeai Events use cases |
| [`task-context-matrix.md`](./task-context-matrix.md) | Descriptions, real-world examples, user stories, journeys/workflows, and agents for every OCL task |

## mdeai Claude skills (local)

| Skill | Path | When |
|-------|------|------|
| **open-claw** | `.claude/skills/open-claw/` | Gateway, CLI, providers, tools, ClawHub policy, skills authoring |
| **mde-hostinger** | `.claude/skills/mde-hostinger/` | VPS Docker, Traefik, restarts (pairs with OCL-001, 007) |
| **gemini** | `.claude/skills/gemini/` | Model IDs for **mdeapp** Mastra — verify VPS separately via `openclaw models list` |
| **task-verifier** | `.claude/skills/task-verifier/` | Before any OCL task → **Done** (probe disk + VPS evidence) |

**open-claw** hub file: [`links..md`](../../../.claude/skills/open-claw/links..md) (full URL list).

## Doc topics by OCL task

| OCL ID | Primary docs | GitHub / extras |
|--------|--------------|-----------------|
| **001-core** | [gateway/health](https://docs.openclaw.ai/gateway/health), [cli/health](https://docs.openclaw.ai/cli/health), [gateway](https://docs.openclaw.ai/gateway) | `openclaw` |
| **002-core** | (mdeapp) `plan/diagrams/06-openclaw-integration.md` | Supabase skill — not OpenClaw |
| **003-core** | [automation/hooks](https://docs.openclaw.ai/automation/hooks), [gateway/tools-invoke-http-api](https://docs.openclaw.ai/gateway/tools-invoke-http-api) | Mastra seam |
| **004-core** | [tools/clawhub](https://docs.openclaw.ai/tools/clawhub), [clawhub/](https://docs.openclaw.ai/clawhub), [security](https://docs.openclaw.ai/gateway/security) | **clawhub**, `plan/.../19C` |
| **005-core** | [gateway/configuration](https://docs.openclaw.ai/gateway/configuration) | Env kill flag in mdeapp + gateway |
| **006-core** | [providers/google](https://docs.openclaw.ai/providers/google) | `open-claw/references/gemini.md` |
| **007-core** | [gateway/secrets](https://docs.openclaw.ai/gateway/secrets), [auth-credential-semantics](https://docs.openclaw.ai/auth-credential-semantics) | Rotate tokens — never commit |
| **008-mvp** | (mdeapp) `/admin/approvals` — CopilotKit/shadcn | No VPS |
| **009-mvp** | [tools/gemini-search](https://docs.openclaw.ai/tools/gemini-search) | Re-verify model via `openclaw models list` |
| **010-mvp** | [tools/skills](https://docs.openclaw.ai/tools/skills), [tools/creating-skills](https://docs.openclaw.ai/tools/creating-skills) | **agent-skills** (patterns), VPS `skills/mde-tour-enrich/` |
| **011-mvp** | [gateway/tools-invoke-http-api](https://docs.openclaw.ai/gateway/tools-invoke-http-api), [concepts/openclaw-sdk](https://docs.openclaw.ai/concepts/openclaw-sdk) | Mastra enqueue |
| **012-mvp** | — | **task-verifier** + Playwright; evidence `tasks/notes/OCL-mvp-evidence.md` |
| **013-mvp** | [tools/browser](https://docs.openclaw.ai/tools/browser), [tools/web](https://docs.openclaw.ai/tools/web) | CTI-019, `prompt-tours.md` |
| **014-postmvp** | [tools/browser](https://docs.openclaw.ai/tools/browser) | `openclaw-restaurant.md` |
| **015-postmvp** | [tools/browser](https://docs.openclaw.ai/tools/browser), [tools/firecrawl](https://docs.openclaw.ai/tools/firecrawl) | mde-firecrawl optional |
| **016–017-postmvp** | [tools/browser](https://docs.openclaw.ai/tools/browser) | events-openclaw-prd |
| **018-postmvp** | [tools/browser](https://docs.openclaw.ai/tools/browser), [tools/web-fetch](https://docs.openclaw.ai/tools/web-fetch) | RE enrichment |
| **019–020-postmvp** | [tools/gemini-search](https://docs.openclaw.ai/tools/gemini-search) | Sponsor / SEO |
| **021-postmvp** | [logging](https://docs.openclaw.ai/logging), [gateway/diagnostics](https://docs.openclaw.ai/gateway/diagnostics) | Trace correlation |
| **022-advanced** | [channels/whatsapp](https://docs.openclaw.ai/channels/whatsapp), [cli/approvals](https://docs.openclaw.ai/cli/approvals) | WA allowlist |
| **023–025-advanced** | [automation/cron-jobs](https://docs.openclaw.ai/automation/cron-jobs), [automation/tasks](https://docs.openclaw.ai/automation/tasks) | Events ops |
| **026-advanced** | [channels/whatsapp](https://docs.openclaw.ai/channels/whatsapp) | contests PRD — no vote writes |
| **027-advanced** | [automation/tasks](https://docs.openclaw.ai/automation/tasks) | Postiz on VPS |
| **028–029-advanced** | — | Paperclip **deferred** — prefer OCL-008 admin path |
| **030-postmvp** | [Apify OpenClaw integration](https://docs.apify.com/platform/integrations/openclaw) | Apify plugin sandbox; `discover -> start -> collect` |
| **031-postmvp** | [Apify OpenClaw integration](https://docs.apify.com/platform/integrations/openclaw) | Sponsor decision-maker research |
| **032-postmvp** | — | Sponsor proposal draft pack; uses Supabase/Mastra/Gemini |
| **033-postmvp** | [Apify OpenClaw integration](https://docs.apify.com/platform/integrations/openclaw) | Vendor recruitment research |
| **034-postmvp** | [Apify OpenClaw integration](https://docs.apify.com/platform/integrations/openclaw) | Public social intelligence |
| **035-advanced** | [channels/whatsapp](https://docs.openclaw.ai/channels/whatsapp), [automation/tasks](https://docs.openclaw.ai/automation/tasks) | Approved WhatsApp/Postiz/social campaign execution |
| **036-postmvp** | [`event-repos-skills-scorecard.md`](./event-repos-skills-scorecard.md), [tools/skills](https://docs.openclaw.ai/tools/skills), [clawhub](https://docs.openclaw.ai/clawhub) | GitHub repo / ClawHub skill intake gate |
| **037-postmvp** | [`event-repos-skills-scorecard.md`](./event-repos-skills-scorecard.md) | Event-planner checklist adapter |
| **038-postmvp** | [`event-repos-skills-scorecard.md`](./event-repos-skills-scorecard.md), [Apify OpenClaw integration](https://docs.apify.com/platform/integrations/openclaw) | Public event source connector adapters |
| **039-postmvp** | [logging](https://docs.openclaw.ai/logging), [gateway/diagnostics](https://docs.openclaw.ai/gateway/diagnostics) | Source health and connector drift monitor |
| **040-postmvp** | [tools/browser](https://docs.openclaw.ai/tools/browser) | Event page QA crawler |
| **041-advanced** | [`event-repos-skills-scorecard.md`](./event-repos-skills-scorecard.md), [automation/tasks](https://docs.openclaw.ai/automation/tasks) | Live ops ticker and role-specific updates |

## Apify OpenClaw integration notes

Apify's plugin is useful for mdeai only as a sandboxed, approval-gated research tool.

| Plugin detail | mdeai rule |
|---|---|
| Install command | `openclaw plugins install @apify/apify-openclaw-plugin` only in non-prod until OCL-030 passes. |
| Setup | Use `openclaw apify setup` or `APIFY_API_KEY`; never commit API keys. |
| Tool allowlist | The `apify` tool must be explicitly allowed; do not use broad `group:plugins` in production. |
| Actions | `discover`, `start`, `collect`; persist `runId` and collect asynchronously. |
| Batch inputs | Batch only approved targets to control cost and rate limits. |
| Result handling | Raw dataset snapshot first, normalized draft second, human approval before any truth write. |

## Lobster (optional, post-MVP)

[Lobster](https://github.com/openclaw/lobster) composes skills/tools into typed pipelines the gateway can call in one step. mdeai **MVP** uses Mastra approval → single job type; consider Lobster for **021+** multi-step crawls after **013-mvp** is green.

- Doc: [https://docs.openclaw.ai/tools/lobster](https://docs.openclaw.ai/tools/lobster)
- Repo: [https://github.com/openclaw/lobster](https://github.com/openclaw/lobster)

## task-verifier gates (OCL)

Before `status: Done` on any OCL task that touches VPS or secrets:

1. Load **task-verifier** — prove acceptance criteria on disk/VPS, not from memory.
2. **OCL-001/007:** `curl` gateway health; token in Infisical only.
3. **OCL-004:** zero ClawHub skills in prod compose; custom `mde-*` only.
4. **OCL-012:** E2E — no `openclaw_jobs` row without `approval_id`.
5. **OCL-013:** 5 tours → `coffee_tour_sources` rows with citations.

N/A for pure mdeapp UI tasks (**008-mvp**) if zero VPS/config change — record explicitly in evidence.

## Control UI defaults (upstream)

Per [OpenClaw docs](https://docs.openclaw.ai/): local dashboard default `http://127.0.0.1:18789/`; config `~/.openclaw/openclaw.json`; workspace `~/.openclaw/workspace`. mdeai VPS may use a different port/URL — always probe **OCL-001** acceptance URL, not assume 18789 on Hostinger.
