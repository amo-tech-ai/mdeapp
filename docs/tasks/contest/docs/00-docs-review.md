---
title: Contest Docs Review
status: Draft
date: 2026-05-25
reviewed_paths:
  - /home/sk/mdeai/tasks/contest/docs
  - /home/sk/mdeai/plan/contests/docs
---

# Contest Docs Review

## Verdict

The contest docs are directionally correct and safe enough for task planning, but the task-side copy is not complete enough to be the sole implementation source.

Use this source order:

| Priority | Source | Use |
|---:|---|---|
| 1 | `tasks/contest/docs/MVP-SCOPE.md` | Short execution boundary for the contest task pack. |
| 2 | `tasks/contest/docs/01-mermaid-diagrams.md` | First-read technical diagrams for implementation order. |
| 3 | `tasks/contest/tasks/*.md` | Build tasks and acceptance criteria. |
| 4 | `plan/contests/docs/*.md` | Full planning source material and advanced/post-MVP strategy. |

## What Is Correct

| Area | Status | Evidence |
|---|---|---|
| MVP boundary | Correct | MVP keeps OpenClaw, Postiz, livestream overlays, and influencer automation out of first release. |
| Deterministic truth | Correct | Architecture says Supabase owns votes, scores, approvals, audit, and payment-derived rows. |
| Payment boundary | Correct | Stripe owns money; webhooks must derive paid state. |
| AI governance | Correct | AI drafts and recommends; humans approve sensitive actions. |
| Repo strategy | Correct | GitHub repos are reference architectures, not copy/paste apps. |

## Corrections Made

| Issue | Fix |
|---|---|
| `MVP-SCOPE.md` linked to missing local `11`, `12`, `13` docs | Relinked to the canonical files under `plan/contests/docs`. |
| No contest task index existed | Added `tasks/contest/tasks/INDEX.md`. |
| No Mermaid-first task-side diagram doc existed | Added `01-mermaid-diagrams.md`. |
| No task-side GitHub repo usage guide existed | Added `02-github-repos-use.md`. |
| No task-side screen/wireframe plan existed | Added `03-screens-wireframes.md`. |

## Remaining Red Flags

| Severity | Red flag | Required handling |
|---|---|---|
| High | Contest scope is larger than current Phase 1 mdeapp work | Treat as future vertical unless user explicitly prioritizes it. |
| High | Voting and paid voting are trust-sensitive | Implement ledger/RPC/tests before UI polish. |
| High | Hi.Events and Postiz are AGPL | Do not copy source code; use patterns or API integration only. |
| Medium | OpenClaw scraping has compliance risk | Post-MVP only with allowlists, quotas, legal/TOS review, and approval gates. |
| Medium | CopilotKit docs may show v2 APIs | mdeapp is pinned to CopilotKit 1.55.2; use v1 hooks on Phase 1 surfaces. |
| Medium | Gemini model names can drift | Re-verify current model IDs immediately before implementation. |

## Implementation Rule

No contest task moves to `Done` without:

| Proof | Required |
|---|---|
| Local runtime | `cd mdeapp && npm run dev` boots and target route responds. |
| Route proof | HTTP status and browser proof for every page. |
| SQL proof | Tables, RLS, policies, constraints, and audit rows verified. |
| API proof | Happy path and at least one negative path. |
| Browser proof | Playwright or Browser/Chrome proof for primary user workflow. |
| Sensitive action proof | Approval id, audit event, and rollback/fail-closed behavior. |
