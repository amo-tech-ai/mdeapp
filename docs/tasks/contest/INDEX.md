---
title: Contest Vertical Index
status: Draft
date: 2026-05-25
scope: Future contest/voting/event vertical
---

# Contest Vertical Index

This folder contains the execution docs and task specs for the future Miss Medellin Beauty Contest vertical.

## Read First

| Doc | Purpose |
|---|---|
| [docs/MVP-SCOPE.md](./docs/MVP-SCOPE.md) | Small MVP boundary and Done standard. |
| [docs/00-docs-review.md](./docs/00-docs-review.md) | Review of task-side docs and current red flags. |
| [docs/01-mermaid-diagrams.md](./docs/01-mermaid-diagrams.md) | Mermaid-first architecture, vote, payment, AI, and screen diagrams. |
| [docs/02-github-repos-use.md](./docs/02-github-repos-use.md) | Which GitHub repos to use and how. |
| [docs/03-screens-wireframes.md](./docs/03-screens-wireframes.md) | Required screens and low-fi wireframes. |
| [docs/04-verification-report-2026-06-02.md](./docs/04-verification-report-2026-06-02.md) | Docs-pass verification (2026-06-02). |
| [audit/2026-06-02-spec-verification.md](./audit/2026-06-02-spec-verification.md) | **Spec grade A (100/100)** — post-normalization verification. |
| [audit/2026-06-02-forensic-audit.md](./audit/2026-06-02-forensic-audit.md) | Initial pre-normalization findings (superseded). |

## Tasks

**Phase 2+** · Master index: [`tasks/INDEX.md`](../INDEX.md) · **Spec score:** 100/100 (verified 2026-06-02) · **Execution:** ~15/100 until code lands · **Audit:** [`audit/2026-06-02-spec-verification.md`](./audit/2026-06-02-spec-verification.md)

| Order | Task | Spec | Purpose |
|---:|---|-----:|---|
| 0 | [CTEST-000](./tasks/CTEST-000-diagrams-repo-decisions.md) | 100 | Diagrams and repo decisions. |
| 1 | [CTEST-001](./tasks/CTEST-001-supabase-contest-core-schema.md) | 100 | Supabase core schema and RLS. |
| 2 | [CTEST-002](./tasks/CTEST-002-voting-scoring-ledgers.md) | 100 | Vote and judge scoring ledgers. |
| 3 | [CTEST-003](./tasks/CTEST-003-ticket-paid-vote-schema.md) | 100 | Ticket and paid-vote payment-derived state. |
| 4 | [CTEST-004](./tasks/CTEST-004-copilotkit-contest-workspace.md) | 100 | CopilotKit workspace and approval cards. |
| 5 | [CTEST-005](./tasks/CTEST-005-mastra-gemini-workflows.md) | 100 | Mastra + Gemini workflows. |
| 6 | [CTEST-006](./tasks/CTEST-006-screens-wireframes.md) | 100 | Screens and wireframes. |
| 7 | [CTEST-007](./tasks/CTEST-007-playwright-proof-gates.md) | 100 | Playwright proof gates. |
| 8 | [CTEST-008](./tasks/CTEST-008-contestant-signup-url-intake.md) | 100 | Contestant signup and URL intake. |
| 9 | [CTEST-009](./tasks/CTEST-009-contestant-profile-editor-coach.md) | 100 | Profile editor, photos, and coach. |
| 10 | [CTEST-010](./tasks/CTEST-010-public-profile-vote-share-growth.md) | 100 | Public vote page and share loop. |
| 11 | [CTEST-011](./tasks/CTEST-011-openclaw-discovery-invite-sandbox.md) | 100 | Discovery sandbox (MVP-B). |
| 12 | [CTEST-012](./tasks/CTEST-012-spec-normalization-linear-sync.md) | 100 | Spec normalization and Linear sync. |

## Boundaries

- Supabase owns contests, contestants, votes, scores, approvals, and audit truth.
- Stripe owns money; Supabase stores webhook-derived payment state.
- AI drafts and recommends; it does not control votes, money, winners, contracts, or bans.
- OpenClaw/Postiz automation is post-MVP unless it is a sandboxed, approval-only discovery draft with no autonomous contact.
- Contest tasks must carry both `prefix:CONT` and `prefix:EVT` in Linear because this vertical spans contests and events.
