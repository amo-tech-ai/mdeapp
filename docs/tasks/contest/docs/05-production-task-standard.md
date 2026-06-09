---
title: Contest Production Task Standard
status: Draft
date: 2026-06-03
skills:
  - mde-task-lifecycle
  - task-verifier
  - mermaid-diagrams
  - mde-supabase
  - testing
---

# Contest Production Task Standard

Every `CTEST-*` task must include enough detail for a production implementer to execute, verify, and sync the task without guessing. This standard applies to local task files and their linked Linear issues.

## Required Task Sections

Each contest task must cover these topics, either as numbered task-template sections or a clearly named production addendum:

| Required topic | What the task must say |
|---|---|
| Create tasks | Concrete implementation steps and any child/subtasks needed before coding. |
| Tech stack | Frameworks, packages, Supabase/Stripe/CopilotKit/Mastra/Gemini/shadcn/Playwright pieces used by the task. |
| Feature | User-facing or admin-facing capability being created. |
| Problem solving | The real problem, failure modes, and guardrails the task solves. |
| Agents, workflows, automations | Agents/workflows/tools/jobs involved; explicitly state when none are allowed. |
| User journey | Persona path from entry point to completed outcome. |
| Mermaid diagrams | Diagram(s) to create or reference: ERD, sequence, state, flowchart, or architecture. |
| Skills to run | Local skills that must be loaded before implementation or verification. |
| MCP / official docs | Official docs or MCP source to verify before implementation; cite the exact docs checked. |
| Verify task steps | Disk, SQL, MCP, browser, or Linear probes needed before execution and before Done. |
| Real-world examples | Domain references, repos, or products to study, with copy/no-copy guardrails. |
| Data | Tables, RLS policies, storage buckets, RPCs, jobs, and audit events. |
| Frontend/backend wiring | Routes, components, APIs, server actions, webhooks, RPCs, and generated types. |
| Success criteria | Independently provable acceptance criteria. |
| Production-ready checklist | Security, privacy, accessibility, observability, rollback, rate limiting, and role gates. |
| Testing | Unit, component, SQL, API, Playwright, negative, responsive, and evidence capture. |

## Official Docs To Verify

Use current official docs or the matching MCP before implementation. At minimum:

| Surface | Official docs |
|---|---|
| Supabase RLS | https://supabase.com/docs/guides/database/postgres/row-level-security |
| Supabase Auth RLS performance/security | https://supabase.com/docs/guides/auth/auth-deep-dive/auth-row-level-security |
| Supabase Storage access control | https://supabase.com/docs/guides/storage/security/access-control |
| Stripe webhooks | https://docs.stripe.com/webhooks |
| shadcn React Hook Form | https://ui.shadcn.com/docs/forms/react-hook-form |
| shadcn components | https://ui.shadcn.com/docs/components |
| shadcn CLI | https://ui.shadcn.com/docs/cli |
| CopilotKit Mastra | https://docs.copilotkit.ai/mastra/ |
| Mastra workflows | https://mastra.ai/workflows |
| Playwright locators/assertions | https://playwright.dev/docs/locators |
| TanStack Table | https://tanstack.com/table/latest/docs/framework/react/guide/table-state |

## Production-Ready Checklist

- [ ] Task frontmatter includes `id`, `title`, `status`, `priority`, `phase`, `effort`, `owner`, `depends_on`, `skill`, `labels`, `linear_project`, `linear`, and `verified_against`.
- [ ] Linked Linear issue has labels `CONT` and `EVT`, project `events-platform-46150ec19346`, and links back to the task file/docs.
- [ ] Any table exposed through Supabase has RLS enabled, policies documented, and negative tests.
- [ ] Any payment-derived state is webhook-derived, idempotent, and never fulfilled from success URLs.
- [ ] Any AI/agent output is draft-only unless a deterministic approved API/RPC commits it.
- [ ] Public profile/vote pages expose only approved/public contestant data.
- [ ] Admin routes have role gates and audit events.
- [ ] Forms use React Hook Form, Zod, shadcn accessible field patterns, and mobile validation states.
- [ ] UI tasks run `npx shadcn@latest info --json`, `npx shadcn@latest docs <components> --json`, and `npx shadcn@latest add <components> --dry-run` before installing missing components.
- [ ] UI tasks use existing shadcn components first and install missing source components through the CLI, not hand-written replacement markup.
- [ ] Playwright proof covers `375`, `414`, `768`, `1024`, and `1440` widths for user-facing routes.
- [ ] Evidence file is written under `tasks/contest/notes/<TASK-ID>-evidence.md`.

## Verification Commands

Run the relevant subset before marking any task ready or Done:

```bash
cd /home/sk/mdeai/mdeapp
npm run lint
npm run typecheck
npm run test
npm run build
npm run floor
npm run test:e2e -- --project=chromium
```

For docs-only updates, record runtime proof as N/A and still run Markdown link/frontmatter checks.
