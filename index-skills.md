---
title: mdeai Skills Index — graded vs PRD v6.0
date: 2026-06-08
plan: ./prd.md (CopilotKit 1.55.2 + Mastra + Next.js 16 @ mdeapp root)
progress: ../progress/may30.md
task_router: todo.md § Skill + MCP gate
audit: ../plan/audit/01-plan-audit.md
enforce: .cursor/rules/mdeai-task-skill-mcp-gate.mdc
legend:
  green: "🟢 85–100 — Phase 1 essential or daily driver"
  yellow: "🟡 50–84 — keep on disk; load when topic appears"
  red: "🔴 0–49 — do not load for new plan (archive / symlink-remove / defer)"
---

# Skills index — PRD v6.0 alignment

## At a glance (2026-06-08)

| Rule | Detail |
|------|--------|
| **Scan root** | `.claude/skills/` — **58** entries (native + symlinks → `.agents/skills/` or `../../../.agents/skills/`) |
| **Per-task routing** | [`todo.md`](./todo.md) § **Skill + MCP gate** — mandatory before Done |
| **Enforcement** | [`.cursor/rules/mdeai-task-skill-mcp-gate.mdc`](../.cursor/rules/mdeai-task-skill-mcp-gate.mdc) |
| **Load cap** | **≤5 skills** per task — pick one row below or todo matrix row |
| **mdeapp stack** | CopilotKit **1.55.2 (v1)** + Mastra + Gemini **`gemini-3.5-flash`** + Supabase + vis.gl maps |
| **v2 trap** | `copilotkit-develop` = **v2** — for **mdeapp** use **`copilotkitV1`** (+ read `.agents/skills/copilotkit-integrations/` if symlink missing) |
| **100% before Done** | Skills read + MCP called + `task-verifier` Evidence Score ≥ **90** (P0) |

### Scan root audit (2026-06-08)

**Present in `.claude/skills/` (58):** Phase 1 pack restored 2026-06-08 — `copilotkit`, `copilotkit-integrations`, `copilotkit-agui`, `copilotkit-debug`, `copilotkit-setup`, `testing`, `mde-vercel`, `mde-stripe`, `mde-real-estate`, `mastra-smoke-test`, `coderabbit`, `code-review` (alias → `coderabbit`), plus `copilotkitV1`, `gemini`, `mastra`, `mde-maps`, `mde-supabase`, `mde-task-lifecycle`, `mde-worktree-pr-flow`, `task-verifier`, Mercur/mcloud/stripe/ui pack.

**Symlink paths:**

| Target | Relative from `.claude/skills/` |
|--------|----------------------------------------|
| Mercur / mcloud / shadcn | `../../.agents/skills/<name>` → `.agents/skills/` |
| Phase 1 pack (copilotkit, testing, mde-*, etc.) | `../../../.agents/skills/<name>` → repo `.agents/skills/` |
| `code-review` | `coderabbit` (compat alias per `_archive/2026-06-05-coderabbit-merge`) |

### Load by work type (authoritative routing)

| Work type | Load first | Then | MCP |
|-----------|------------|------|-----|
| **Any task / Done gate** | `mde-task-lifecycle` | `task-verifier`, `testing` | — |
| **CopilotKit runtime / chat UI** | `copilotkit` | `copilotkit-integrations` | copilotkit |
| **CK hooks / generative UI** | `copilotkitV1` | `copilotkit-integrations` (mastra.md), `copilotkit-agui` — **not** `copilotkit-develop` v2 | copilotkit |
| **Mastra agents / tools / workflows** | `mastra` | `gemini`, `mastra-smoke-test` | mastra |
| **Maps / Places / pins** | `mde-maps` | `testing` | google-maps-code-assist |
| **Supabase / RLS / edge fn** | `mde-supabase` | `task-verifier` | user-supabase |
| **Gemini models / tools** | `gemini` | — | gemini-api-docs-mcp |
| **Stripe / tickets** | `mde-stripe` | `mde-supabase` | — |
| **Ship / PR / commit** | `mde-worktree-pr-flow` | `code-review` | — |
| **UI polish (shadcn/Tailwind)** | `shadcn` | `tailwind-best-practices` | — |
| **Screens (`SCREEN-*`)** | `copilotkitV1` | `copilotkit-integrations`, `mde-maps` if pins, `testing` | — |

**Paths:** `.claude/skills/copilotkitV1` · `copilotkit` · `copilotkit-develop` (v2 reference only) · `copilotkit-integrations` · `gemini` · `mastra` · `mde-maps` · `mde-supabase` · `mde-task-lifecycle` · `tailwind-best-practices`

---

**North star:** App at `/home/sk/mdeai/mdeapp/` from `CopilotKit/examples/integrations/mastra/`. **7 Mastra agents**, 3 workflows, Supabase, Stripe, Maps. CopilotKit **1.55.2** (not v2).

**Layout:** `.claude/skills/` = scan root (**58** entries as of 2026-06-08; Phase 1 pack fully symlinked).

**Counts (active, non-`_archive`):**

| Bucket | Count | Action |
|--------|------:|--------|
| 🟢 Phase 1 pack | **22** | Enable in Cursor / Claude project skills |
| 🟡 ADK / agents-cli dev pack | **7** | Load when scaffolding `services/adk-grounding/` — see [../plan/ADK/notes.md](../plan/ADK/notes.md) |
| 🟡 Adjacent / Phase 2+ | **28** | Keep; do not auto-load in every session |
| 🔴 Drop from default load | **43+** | Archive, unlink symlink, or `disable-model-invocation` |
| `_archive/` | 18 | Already retired — ignore |

**PRD Part 0 matrix** ([../plan/prd/00-skills-reference.md](../plan/prd/00-skills-reference.md)) — all map to 🟢 below.

---

## Phase 1 recommended pack (load these)

| Skill | Score | Path |
|-------|------:|------|
| copilotkitV1 | 97 | symlink — **v1 hooks for mdeapp** (1.55.2) |
| copilotkit | 98 | `.agents` → symlink `.claude` |
| copilotkit-setup | 96 | symlink |
| copilotkit-integrations | 98 | symlink — **Mastra wiring** |
| copilotkit-develop | 88 | symlink — **v2 docs**; mdeapp uses `copilotkitV1` + integrations |
| copilotkit-agui | 92 | symlink — HITL + shared state |
| copilotkit-debug | 94 | symlink — incident response |
| mastra | 98 | `.claude/skills/mastra` native |
| mde-supabase | 96 | native |
| supabase-edge-functions | 82 | symlink — edge fn port W4–W9 |
| gemini | 90 | native — **`gemini-3.5-flash`** in mdeapp per CLAUDE.md |
| task-verifier | 88 | native — **CTI/OCL Done gates**; load before flipping tasks |
| mde-maps | 94 | native — W5–W6 rentals/chat |
| mde-task-lifecycle | 95 | native — plan→ship |
| mermaid-diagrams | 88 | native — PRD/task diagrams |
| testing | 92 | native — Vitest + Playwright |
| mde-vercel | 90 | native — deploy + Next perf |
| mde-stripe | 86 | native — W9 tickets |
| mde-worktree-pr-flow | 88 | native — PR discipline |
| mde-real-estate | 80 | native — Camila / rentals vertical |
| code-review | 82 | symlink |
| autofix | 78 | symlink |
| plan-analysis | 76 | symlink — critique plans before tasks |
| mastra-smoke-test | 74 | symlink — after agent port |

**MCPs (not skills):** `copilotkit-docs`, `mastra-docs`, `gemini-api-docs-mcp`, `google-maps-code-assist`, `user-supabase` — use per verification cadence in Part 0.

### Coffee Tour Intelligence (CTI) — load pack

| When | Skills | MCP |
|------|--------|-----|
| Schema / seed | mde-supabase, task-verifier | user-supabase |
| Tools / rank | mastra, copilotkit-integrations, gemini, testing | user-mastra, gemini-api-docs-mcp |
| Maps / place_id | mde-maps | google-maps-code-assist |
| UI / smoke | copilotkitV1, shadcn, webapp-testing | copilotkit |
| Embeddings (Phase B) | pgvector, gemini | user-supabase |
| OpenClaw crawl | open-claw, mde-hostinger | **OCL-013-mvp** — not CTI-019 |

**Audit:** [`docs/tasks/audit/31-agent-tasks.md`](docs/tasks/audit/31-agent-tasks.md) · **Tasks:** [`docs/tasks/agent/tasks/INDEX.md`](docs/tasks/agent/tasks/INDEX.md)

**ADK planning (not skills):** [../plan/ADK/prd-adk.md](../plan/ADK/prd-adk.md), [../plan/openclaw/01-openclaw-adk.md](../plan/openclaw/01-openclaw-adk.md).

---

## ADK / agents-cli dev pack (load for Phase 2 sidecar only)

**Dev assist only** per [ADK — Coding with AI](https://adk.dev/tutorials/coding-with-ai/): `agents-cli` + `google-agents-cli-*` skills (+ optional **adk-docs-mcp** on `adk.dev/llms.txt`). Installed via `uvx google-agents-cli setup` / `npx skills add google/agents-cli`. Paths: `.agents/skills/google-agents-cli-*` (and `.claude/skills/` symlinks). **Not** Camila’s runtime — Cursor uses these while building `services/adk-grounding/`. CLI: `~/.local/bin/agents-cli` (v0.2.0).

| Skill | Score | | Phase? | Notes |
|-------|------:|:---:|--------|-------|
| google-agents-cli-workflow | 92 | 🟡 | P2 dev | Scaffold-first lifecycle; entry for any ADK work |
| google-agents-cli-adk-code | 90 | 🟡 | P2 dev | `agent.py`, tools, `SkillToolset`, Maps/Search tools |
| google-agents-cli-scaffold | 88 | 🟡 | P2 dev | `agents-cli scaffold create` / `enhance` |
| google-agents-cli-eval | 86 | 🟡 | P2 dev | Golden queries — no hallucinated `place_id` |
| google-agents-cli-deploy | 84 | 🟡 | P2 dev | Cloud Run / Agent Runtime — after MAP MVP |
| google-agents-cli-observability | 78 | 🟡 | P2+ | Trace / BigQuery — Patricia ops |
| google-agents-cli-publish | 72 | 🟡 | P2+ | Gemini Enterprise registration |

**Runtime ADK skills (different):** file-based `SKILL.md` under `services/adk-grounding/skills/` loaded by ADK `SkillToolset` at request time — see [Google ADK Skills blog](https://developers.googleblog.com/developers-guide-to-building-adk-agents-with-skills/) and [../plan/ADK/prd-adk.md](../plan/ADK/prd-adk.md) §12. Optional coding pack: `npx skills add google/adk-docs -y`.

**mdeai rule:** Mastra stays orchestrator in this repo (`mdeapp`); do not replace `/api/copilotkit` with ADK `HttpAgent` for production concierge.

---

## Grading rubric (vs new plan)

| Score | Dot | Need for PRD v6.0 |
|------:|:---:|-------------------|
| 85–100 | 🟢 | Explicit in PRD, W1–W10 delivery, or blocking ops (deploy/test/review) |
| 50–84 | 🟡 | Real value but Phase 2+, ops-only, meta/tooling, or duplicate of a greener skill |
| 0–49 | 🔴 | Wrong stack (Vite chat, v2-only, vendor SaaS), superseded, deferred feature, or duplicate |

---

## A — `.claude/skills` native (24)

| Skill | Score | | Phase 1? | Notes |
|-------|------:|:---:|----------|-------|
| mastra | 98 | 🟢 | Yes | Agents, memory, tools — core |
| mde-supabase | 96 | 🟢 | Yes | RLS, migrations, edge patterns |
| mde-task-lifecycle | 95 | 🟢 | Yes | Replaces 9 task-* skills |
| mde-maps | 94 | 🟢 | W5–W6 | Places, ChatMap, grounding |
| testing | 92 | 🟢 | Yes | 21→90 tests per PRD |
| gemini | 90 | 🟢 | Yes | Use **`gemini-3.5-flash`** (CLAUDE.md registry) |
| task-verifier | 88 | 🟢 | CTI/OCL | Forensic Done gates — [`agent-cti`](.claude/skills/task-verifier/references/agent-cti.md) |
| mde-vercel | 90 | 🟢 | W1+ | Preview deploy, rolling release W10 |
| mde-worktree-pr-flow | 88 | 🟢 | Yes | One PR / worktree |
| mermaid-diagrams | 88 | 🟢 | Docs | PRD + task diagrams |
| mde-stripe | 86 | 🟢 | W9 | Tickets; sponsor later |
| mde-real-estate | 80 | 🟢 | W5–W7 | Rentals persona Camila |
| mde-github | 72 | 🟡 | CI | `gh` + Actions templates |
| mde-prompting | 68 | 🟡 | Meta | Skill/prompt authoring during cleanup |
| mde-firecrawl | 58 | 🟡 | Research | Not product runtime |
| mde-roadmap | 55 | 🟡 | Planning | Not implementation |
| mde-infisical | 62 | 🟡 | Ops | Secrets sync |
| mde-paperclip | 52 | 🟡 | Ops | Only if PAP-* task tracking |
| mastra-routing | 48 | 🔴 | No | Legacy router; CopilotKit + direct agents replace for P1 |
| mde-tool-use | 38 | 🔴 | No | Anthropic Messages API — not app path |
| mde-tool-use/mde-social-media | 28 | 🔴 | No | Post-MVP marketing |
| mde-whatsapp | 25 | 🔴 | Phase 2 | PRD defers WhatsApp |
| mde-hostinger | 32 | 🔴 | Ops | VPS/OpenClaw — not mdeapp |
| open-claw | 58 | 🟡 | OCL / CTI-C | VPS worker — **not** chat; see [`docs/tasks/openclaw/docs/sources.md`](docs/tasks/openclaw/docs/sources.md) |
| outcomes | 42 | 🔴 | Meta | Not delivery |
| gemini (folder) | 90 | 🟢 | — | Same as row above |

---

## B — Symlinked in `.claude/skills` (from `.agents/skills`)

| Skill | Score | | Phase 1? | Notes |
|-------|------:|:---:|----------|-------|
| copilotkitV1 | 97 | 🟢 | Yes | v1 hooks — **mdeapp default** |
| copilotkit | 98 | 🟢 | Yes | Orchestrator |
| copilotkit-integrations | 98 | 🟢 | Yes | `MastraAgent.getLocalAgents` |
| copilotkit-setup | 96 | 🟢 | W1 | Bootstrap |
| copilotkit-debug | 94 | 🟢 | Always | CORS, SSE, agent down |
| copilotkit-agui | 92 | 🟢 | W4–W6 | HITL + state |
| copilotkit-develop | 88 | 🟡 | W2–W10 | **v2-oriented** — use `copilotkitV1` + integrations for mdeapp |
| mastra-smoke-test | 74 | 🟢 | W3+ | Studio smoke |
| supabase-edge-functions | 82 | 🟢 | W4+ | Redirects to mde-supabase deep refs |
| code-review | 82 | 🟢 | PRs | CodeRabbit |
| autofix | 78 | 🟢 | PRs | CodeRabbit threads |
| plan-analysis | 76 | 🟢 | Pre-task | Plan critique |
| playwright-cli | 78 | 🟡 | W8+ | E2E |
| chrome-devtools | 76 | 🟡 | Debug | LCP/CWV |
| react-best-practices | 74 | 🟡 | UI | Next 16 |
| tailwind-best-practices | 72 | 🟡 | UI | shadcn week 2 |
| test-driven-development | 70 | 🟡 | Optional | Methodology; `testing` owns toolchain |
| working-with-claude-code | 72 | 🟡 | Meta | IDE hygiene |
| using-superpowers | 70 | 🟡 | Meta | Skill discovery |
| tech-stack-research | 60 | 🟡 | Rare | Stack picks done |
| brainstorming | 65 | 🟡 | Design | Upstream of build |
| wireframe-prototyping | 68 | 🟡 | Design | Roberto/Camila flows |
| skill-creator | 55 | 🟡 | Meta | This index cleanup |
| skill-development | 55 | 🟡 | Meta | Authoring |
| hook-development | 58 | 🟡 | Meta | Hooks vs skills |
| command-development | 52 | 🟡 | Meta | Slash commands |
| agent-development | 55 | 🟡 | Meta | `.claude/agents` not product |
| dispatching-parallel-agents | 60 | 🟡 | Meta | Parallel subagents |
| mde-agents | 40 | 🔴 | No | Managed Agents API ≠ Mastra path |
| google-maps-api | 45 | 🔴 | No | Use **mde-maps** |
| react-google-maps | 42 | 🔴 | No | Deprecated stub → mde-maps |
| supabase-audit-functions | 40 | 🔴 | Rare | Pentest-only |
| pgvector | 72 | 🟡 | CTI-011 | Embeddings pipeline only — not Phase A |
| postiz | 28 | 🔴 | Phase 2+ | Social scheduling |
| xml-sitemap | 35 | 🔴 | SEO | Post-cutover |
| create-payment-credential | 18 | 🔴 | No | Agent checkout experiments |
| create-github-action-workflow-specification | 58 | 🟡 | CI | Workflow specs |
| playwright-best-practices | 72 | 🟡 | W8 | E2E patterns |
| playwright-generate-test | 65 | 🟡 | W8 | Test gen |
| chrome-devtools-cli | 64 | 🟡 | CI | Headless smoke |
| troubleshooting | 50 | 🟡 | MCP | Chrome MCP failures only |
| chatbot-conversation-design | 45 | 🔴 | No | CopilotKit UX replaces |
| ai-chatbot | 22 | 🔴 | No | **Vite** legacy — wrong stack |
| copilotkit-upgrade | 32 | 🔴 | No | **Pinned 1.55.2** — v2 is Phase 2 exploration |
| copilotkit-contribute | 20 | 🔴 | No | OSS contrib only |
| copilotkit-self-update | 38 | 🔴 | No | Refresh skills manually when CK releases |

---

## C — `.agents/skills` only (not symlinked to `.claude`)

> **Note:** `google-agents-cli-*` (7) are symlinked in `.claude/skills/` — listed in **ADK / agents-cli dev pack** above, not here.

| Skill | Score | | Phase 1? | Notes |
|-------|------:|:---:|----------|-------|
| ai-sdk | 28 | 🔴 | No | Vercel AI SDK — not primary (CopilotKit + Mastra) |
| browser-automation | 30 | 🔴 | No | Chinese Playwright; use `playwright-cli` |
| buildchatbot | 12 | 🔴 | No | IBM Watson SaaS |
| chatbot-builder | 12 | 🔴 | No | chatbot.com CRM |
| sales-chatbot | 18 | 🔴 | No | SendPulse-style; not product |
| dogfood | 42 | 🔴 | No | Generic dogfood |
| shopify | 0 | 🔴 | No | Out of scope |
| hermes-agent | 22 | 🔴 | No | VPS agent; Phase 3 sponsors |
| hostinger-tools | 35 | 🔴 | Ops | Duplicate of mde-hostinger |
| infisical-agent | 50 | 🟡 | Ops | Overlaps mde-infisical |
| infisical-api | 50 | 🟡 | Ops | |
| infisical-secret-syncs | 52 | 🟡 | Ops | |
| paperclip | 48 | 🟡 | Ops | Use **mde-paperclip** if needed |
| paperclip-ai-orchestration | 45 | 🟡 | Ops | |
| paperclip-converting-plans-to-tasks | 50 | 🟡 | Ops | Overlaps mde-task-lifecycle |
| paperclip-create-agent | 35 | 🔴 | Ops | |
| paperclip-create-plugin | 35 | 🔴 | Ops | |
| tasks | 18 | 🔴 | No | Superseded by mde-task-lifecycle |
| create-tasks | 18 | 🔴 | No | |
| generate-tasks | 18 | 🔴 | No | |
| executing-tasks | 18 | 🔴 | No | |
| spec-tasks | 18 | 🔴 | No | |
| tasks-generator | 20 | 🔴 | No | |
| prd-taskmaster | 20 | 🔴 | No | |
| task-prd-creator | 15 | 🔴 | No | |
| stripe-best-practices | 15 | 🔴 | No | → **mde-stripe** |
| stripe-integration | 15 | 🔴 | No | |
| stripe-projects | 15 | 🔴 | No | |
| roadmap-update | 42 | 🔴 | No | → **mde-roadmap** |
| mermaid-diagram-specialist | 52 | 🟡 | Docs | Duplicate of mermaid-diagrams |
| wireframe-to-spec | 65 | 🟡 | Design | Overlaps wireframe-prototyping |
| debug-optimize-lcp | 62 | 🟡 | Perf | W7+ polish |
| github-actions-docs | 58 | 🟡 | CI | Overlaps mde-github |
| github-actions-templates | 58 | 🟡 | CI | |
| gemini-api-dev | 55 | 🟡 | Partial | Overlaps native **gemini** |
| gemini-interactions-api | 50 | 🟡 | Later | Interactions API not P1 chat path |
| gemini-live-api-dev | 35 | 🔴 | No | Voice — not MVP |
| prompt-engineer | 30 | 🔴 | No | → mde-prompting |
| prompt-lookup | 28 | 🔴 | No | |
| prompt-master | 28 | 🔴 | No | |
| prompt-optimizer | 28 | 🔴 | No | |
| agents | 38 | 🔴 | No | Generic |
| agentic-coding | 40 | 🔴 | No | PACT — not P1 |
| skill-factory | 35 | 🔴 | Meta | Auto-generate skills |
| testing-strategy | 55 | 🟡 | QA | High-level; `testing` executes |

**Duplicate tree:** `copilotkit/skills/copilotkit-*` mirrors top-level copilotkit skills — **do not register twice**.

---

## D — `_archive/` (already retired)

| Path | Score | | Action |
|------|------:|:---:|--------|
| `_archive/2026-05-14/*` | 10 | 🔴 | Keep archived |
| `_archive/2026-05-07/*` | 10 | 🔴 | Keep archived |

Includes: `ai-building-chatbots-vendor`, `better-chatbot-vendor`, `google-maps-stub`, old `roadmap`, `hostinger-vps`, real-estate one-offs, vitest/preview splits.

---

## E — Plan vs skills gap analysis

| PRD requirement | Skill status | Gap |
|-----------------|-------------|-----|
| CopilotKit 1.55.2 + Mastra | 🟢 Full pack | Route UI via **`copilotkitV1`** + **`copilotkit-integrations`** — not v2-only `copilotkit-develop` |
| Supabase reuse | 🟢 mde-supabase | Edge fn forensic W5 — use symlink + MCP |
| Gemini **`3.5-flash`** | 🟢 gemini + MCP | CLAUDE.md registry; CTI-004/011 use `@ai-sdk/google` |
| Maps W5–W6 | 🟢 mde-maps | Remove `google-maps-api` / `react-google-maps` from default load |
| ADK grounding service (Phase 2) | 🟡 google-agents-cli-* | Phase 1 = Mastra + Grounding Lite MCP ([MAP-002](docs/tasks/maps/MAP-002-grounding-attribution.md)); ADK HTTP sidecar after pins ship |
| Stripe W9 | 🟢 mde-stripe | Drop deprecated stripe-* symlinks |
| WhatsApp | 🔴 mde-whatsapp | Correctly deferred Phase 2 |
| OpenClaw (OCL-013) | 🟡 open-claw | VPS crawl **after** CTI-001A–010; not chat runtime |
| Custom ai-router | 🔴 mastra-routing | Replaced by CopilotKit agent selection |
| 20–50 enabled skills (PDF BP1) | 🔴 **~74 enabled** | **Load Phase 1 pack only (~22)** |

---

## F — Recommended actions (priority)

1. **Session load list:** Pin the 22-row Phase 1 pack; add **google-agents-cli-*** only when working on `services/adk-grounding/` ([../plan/ADK/notes.md](../plan/ADK/notes.md)).
2. **Unlink red symlinks** from `.claude/skills/` (ai-chatbot, copilotkit-upgrade, google-maps-api, react-google-maps, stripe-*, task-*, supabase-audit-functions) — files stay in `.agents` for reference.
3. **Set `disable-model-invocation: true`** on: `mastra-routing`, `ai-chatbot`, `mde-tool-use`, `mde-whatsapp`, deprecated stripe/* — **load `open-claw` only for OCL-* tasks**, not CTI Phase A chat.
4. **Symlink or document** `copilotkit` paths in PRD — already correct via `.claude` → `.agents`.
5. **Deduplicate:** delete or ignore `copilotkit/skills/*` duplicate copies; single source in `.agents/skills/copilotkit-*`.
6. **Merge maps:** one entry point `mde-maps` only.
7. **Update** [../plan/prd/00-skills-reference.md](../plan/prd/00-skills-reference.md) §matrix: add `mde-vercel`, `testing`, `mde-stripe`; note `mastra-routing` deprecated for P1.

---

## G — Summary scorecard

| Category | Avg score | Verdict |
|----------|----------:|---------|
| Phase 1 pack (22 skills) | **91** | 🟢 Ship with these |
| Native mde-* (non-archive) | 68 | Mixed — 10 green, 8 yellow, 6 red |
| CopilotKit cluster | 86 | 🟢 minus upgrade/contribute/self-update |
| google-agents-cli dev pack (7) | 86 | 🟡 Phase 2 ADK service only |
| Legacy chat / vendor | 15 | 🔴 Archive candidates |
| Task/paperclip cluster | 22 | 🔴 Superseded by mde-task-lifecycle / mde-paperclip |
| Ops (hostinger, openclaw, whatsapp) | 29 | 🔴 Defer |

**Overall inventory health vs new plan: 62/100** — strong core, too many loaded skills. **After applying Phase 1 pack + unlink reds: ~94/100** for day-to-day dev.

---

## Quick reference — dot legend

- 🟢 **Keep & load** for mdeapp Phase 1  
- 🟡 **Keep on disk** — load on topic  
- 🔴 **Do not load** for new plan (archive / unlink / defer)

*Last filesystem scan: 2026-06-08 — `.claude/skills/` (58) + `.agents/skills/` (~191). Phase 1 symlinks restored. Per-task gates: [`todo.md`](./todo.md). Enforced by [`mdeai-task-skill-mcp-gate.mdc`](../.cursor/rules/mdeai-task-skill-mcp-gate.mdc).*
