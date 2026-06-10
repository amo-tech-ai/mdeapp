---
title: Contest Task Index
status: Draft
date: 2026-06-02
scope: Future contest vertical
docs:
  - ../docs/MVP-SCOPE.md
  - ../docs/01-mermaid-diagrams.md
  - ../docs/02-contest-core-schema-erd.md
  - ../docs/02-github-repos-use.md
  - ../docs/03-screens-wireframes.md
  - ../docs/wireframes/README.md
  - ../docs/05-production-task-standard.md
  - ../docs/06-shadcn-component-audit.md
  - ../audit/2026-06-02-forensic-audit.md
---

# Contest Task Index

Core task pack for the Miss Medellín Beauty Contest vertical. **Phase 2+** only ([`tasks/INDEX.md`](../../INDEX.md)).

**Verification (2026-06-02):** Spec template normalized — **13/13 tasks** use sections 1–10. **Spec score: 100/100** (planning). **Execution readiness: ~15/100** until migrations and routes land. See [`../audit/2026-06-02-forensic-audit.md`](../audit/2026-06-02-forensic-audit.md).

## Task Order

| Order | ID | Task | Status | Track | Spec | Depends On | Primary skill |
|---:|---|---|---|---|---:|---|---|
| 0 | [CTEST-000](./CTEST-000-diagrams-repo-decisions.md) | Diagrams and scope gate | Draft | A | 100 | — | mermaid-diagrams |
| 1 | [CTEST-001](./CTEST-001-supabase-contest-core-schema.md) | Supabase core schema + RLS | Draft | A | 100 | CTEST-000 | mde-supabase |
| 2 | [CTEST-002](./CTEST-002-voting-scoring-ledgers.md) | Vote + judge ledgers | Draft | A | 100 | CTEST-001 | mde-supabase |
| 3 | [CTEST-003](./CTEST-003-ticket-paid-vote-schema.md) | Tickets + paid votes | Draft | B | 100 | CTEST-001, 002 | mde-supabase, mde-stripe |
| 4 | [CTEST-004](./CTEST-004-copilotkit-contest-workspace.md) | CopilotKit workspace | Draft | A | 100 | CTEST-001 | copilotkit |
| 5 | [CTEST-005](./CTEST-005-mastra-gemini-workflows.md) | Mastra + Gemini | Draft | A | 100 | CTEST-002, 004 | mastra, gemini |
| 6 | [CTEST-006](./CTEST-006-screens-wireframes.md) | Screens + wireframes | Draft | A | 100 | CTEST-001, 002, 004 | shadcn, responsive-design |
| 7 | [CTEST-007](./CTEST-007-playwright-proof-gates.md) | Playwright gates | Draft | A | 100 | CTEST-002, 003, 006 | testing |
| 8 | [CTEST-008](./CTEST-008-contestant-signup-url-intake.md) | Signup + URL intake | Draft | A | 100 | CTEST-001, 006 | shadcn, mde-firecrawl |
| 9 | [CTEST-009](./CTEST-009-contestant-profile-editor-coach.md) | Profile + coach | Draft | A | 100 | CTEST-001, 004, 008 | shadcn, copilotkit |
| 10 | [CTEST-010](./CTEST-010-public-profile-vote-share-growth.md) | Public vote + share | Draft | A | 100 | CTEST-002, 006, 009 | responsive-design |
| 11 | [CTEST-011](./CTEST-011-openclaw-discovery-invite-sandbox.md) | Discovery sandbox | Draft | B | 100 | CTEST-001, 005 | mde-firecrawl |
| 12 | [CTEST-012](./CTEST-012-spec-normalization-linear-sync.md) | Spec + Linear sync | In Progress | — | 100 | CTEST-000 | task-verifier |

**Pack average spec:** 100/100

## MVP Cut Line

| MVP-A (ship first) | MVP-B (after A green) |
|---|---|
| Schema, free vote ledger, host CopilotKit workspace, Mastra agents, wireframes, signup, profile, public vote page, core Playwright | Paid tickets/votes, discovery sandbox, sponsors CRM depth |

## Required Screens

See [CTEST-006](./CTEST-006-screens-wireframes.md) and [`../docs/wireframes/`](../docs/wireframes/).

## Done Rule

No task → `Done` without evidence at `tasks/contest/notes/CTEST-NNN-evidence.md` matching route/SQL/API/browser proof. CTEST-007 must be green before any UI task flips Done.
