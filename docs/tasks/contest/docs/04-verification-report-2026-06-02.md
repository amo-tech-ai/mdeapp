---
title: Contest Task Verification Report
status: Draft
date: 2026-06-02
auditor: Codex
skills_used:
  - task-verifier
  - responsive-design
  - tailwind-responsive-ui
  - mermaid-diagrams
  - mde-supabase
  - shadcn
  - mde-firecrawl
linear_project: https://linear.app/sanjiovani/project/events-platform-46150ec19346
---

# Contest Task Verification Report - 2026-06-02

## Verdict

Not ready. These blockers must be fixed first:

1. Existing CTEST specs do not all match the required ten-section task template.
2. The current app has no `/contests` or contestant profile routes on disk.
3. The current Supabase migration tree has no contest core schema migration.
4. The Linear project had zero issues before sync, and `prefix:CONT` did not exist before this pass. This pass created `prefix:CONT` plus SAN-532 through SAN-544.
5. Wireframes initially did not cover every contestant signup, edit, coach, invite, and admin review screen. This pass expanded `03-screens-wireframes.md`.

## Verification Matrix

| Task | Spec score /100 | Execution readiness /100 | Blockers | Safe to execute? | Required fixes |
|---|---:|---:|---:|---|---|
| CTEST-000 | 82 | 60 | 1 | No | Normalize to ten-section template; add Mermaid validation evidence. |
| CTEST-001 | 86 | 35 | 1 | No | Add migration/RLS proof and generated type proof. |
| CTEST-002 | 85 | 25 | 1 | No | Add SQL/RPC implementation and negative vote tests. |
| CTEST-003 | 87 | 25 | 1 | No | Add Stripe fixture/webhook proof for paid tickets and paid votes. |
| CTEST-004 | 83 | 30 | 1 | No | Add contest routes and CopilotKit approval card proof. |
| CTEST-005 | 82 | 30 | 1 | No | Add Mastra agents/workflows and `ai_runs` proof. |
| CTEST-006 | 78 | 40 | 2 | No | Add missing screen wireframes and responsive test plan. |
| CTEST-007 | 88 | 40 | 1 | No | Add test files after implementation lands. |
| CTEST-008 | 84 | 20 | 1 | No | New task; implement contestant signup and URL extraction proof. |
| CTEST-009 | 83 | 20 | 1 | No | New task; implement profile editor, storage, and coach proof. |
| CTEST-010 | 82 | 20 | 1 | No | New task; implement public voting/share page proof. |
| CTEST-011 | 80 | 15 | 2 | No | New task; add sandbox, allowlists, and no-autonomous-contact proof. |
| CTEST-012 | 86 | 70 | 0 | Yes | Docs/Linear normalization task is safe to execute first. |

## Claims Verified

| Claim | Probe | Result |
|---|---|---|
| mdeapp stack exists and is current enough for planning | `node -p` over `mdeapp/package.json` | Next.js `16.2.6`, React `19.2.1`, CopilotKit `1.55.2`, Mastra beta, Supabase JS `2.106.1`, shadcn `4.7.0`. |
| shadcn project config exists | `npx shadcn@latest info --json` | Next App Router, Tailwind v4, base-nova, lucide, alias `@/components/ui`; installed components include badge, button, card, dialog, dropdown-menu, input, label, separator, sheet, skeleton, tooltip. |
| shadcn form docs are React Hook Form + Zod + Field-based | `https://ui.shadcn.com/docs/forms/react-hook-form` | Current docs use React Hook Form, `Controller`, Zod resolver, `Field`, `FieldLabel`, `FieldError`, and `aria-invalid`. |
| Contest routes are not implemented | `find mdeapp/src/app -name page.tsx -o -name route.ts` | Event/ticket/auth routes exist; no `/contests`, `/host/contests`, `/admin/contests`, or `/me/contestant-profile` routes. |
| Contest DB is not implemented | `rg "contests|contestants|vote_ledger|judge_scores" mdeapp/supabase/migrations` | No contest core schema migration found. Only a Realtime function conditionally references future `vote.entity_tally`. |
| Linear Events Platform project exists | Linear `get_project` | Project exists and points to events MVP docs, not contest tasks. |
| Linear project issue list before sync | Linear `list_issues(project=events-platform-46150ec19346)` | Empty issue list. |
| Linear contest search before sync | Linear search for `CTEST OR contest OR CONT OR "Miss Medellin"` | No results. |
| Linear label status | Linear label lookup | `prefix:EVT` existed; `prefix:CONT` was missing and was created in this pass. |
| Linear issue sync after patch | Linear issue creation | CTEST-000..012 were created as SAN-532..SAN-544 in Events Platform with CONT/EVT labels. |
| Local link check after patch | Node markdown link probe over `tasks/contest` | Contest docs touched in this pass resolved; 7 remaining misses are pre-existing `tasks/contest/core/*` archive/core references. |
| Mermaid static check | `rg '^```mermaid'` and reserved-label/gotcha scan | 25 Mermaid fences found; no obvious `note inside state`, `end[`, or `class[` gotchas found. |

## Claims Not Verified

| Claim | Reason |
|---|---|
| Live Supabase remote catalog has or lacks contest tables | This pass inspected repo migrations only; no remote SQL catalog query was run. |
| Browser rendering of contest screens | Routes do not exist yet. |
| Mermaid render proof | Static scan passed, but no Mermaid MCP/render CLI was available in this pass. |
| OpenClaw outreach implementation | Not implemented; should remain approval-only and sandboxed. |

## Required Corrections

1. Normalize CTEST-000..007 to the repo task template: Purpose, Goals, Features, Workflows, User journeys, Agents, Integrations, Summary, Definition of Done, Tests.
2. Keep both labels on every Linear issue: `prefix:CONT` and `prefix:EVT`, plus `track:contest`, `track:events`, and `phase:phase2`.
3. Add Supabase catalog proof before saying database setup is correct.
4. Implement routes and run browser proof before saying screen work is Done.
5. Add Playwright proof for mobile widths 375, 414, 768, 1024, and 1440, with no horizontal overflow and minimum 44px touch targets.

## Source Notes

- Hi.Events is the best event/ticketing reference for ticket tiers, QR check-in, attendee management, promo codes, reporting, and affiliate/referral ideas, but its AGPL terms mean use patterns only, not source copy.
- Helios is a voting integrity reference for receipts/freeze/tally concepts, not a direct beauty contest voting implementation.
- CopilotKit Mastra starter remains a runtime wiring reference, but mdeapp must stay on its installed CopilotKit `1.55.2` surface.
- OpenClaw or Firecrawl can support public discovery and structured extraction, but invites must remain drafts until a human approves them.

## Commands To Run Before Execution

1. `cd mdeapp && npx shadcn@latest info --json` - refresh component/base state.
2. `cd mdeapp && npm run typecheck` - confirm app baseline before adding routes.
3. `cd mdeapp && rg "contest|vote_ledger|contestant" supabase/migrations src` - re-check drift.
4. Linear list issues for the Events Platform project - prevent duplicate sync.

## Commands To Run After Execution

1. `cd mdeapp && npm run test`
2. `cd mdeapp && npm run lint`
3. `cd mdeapp && npm run typecheck`
4. `cd mdeapp && npm run build`
5. `cd mdeapp && npx playwright test e2e/contest --project=chromium`
6. SQL catalog proof for contest tables, policies, storage buckets, and RLS.

## Stop Condition

Not ready. These blockers must be fixed first: task template normalization for CTEST-000..007, route implementation, contest schema implementation, and post-implementation SQL/browser/test evidence.
