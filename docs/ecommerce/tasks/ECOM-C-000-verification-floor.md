---
id: ECOM-C-000
task_id: ECOM-C-000
title: Repair mdeapp verification floor before commerce
status: Done
priority: P0
phase: 0
optional: true
milestone: M0 - Verification floor
effort: S
estimated_effort: 0.5 day
owner: mdeai-commerce
area: operations
linear_project: Commerce Platform
linear_project_url: https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues
linear_label: COMM
linear_issue: SAN-628
linear_url: https://linear.app/sanjiovani/issue/SAN-628
depends_on: []
blocks: []
skill: mde-task-lifecycle
skills: [mde-task-lifecycle, medusa]
verified_against:
  - /home/sk/mdeai/.claude/skills/medusa/SKILL.md
  - /home/sk/mdeai/.claude/skills/mde-task-lifecycle/SKILL.md
  - docs/ecommerce/audit/1-tasks-audit.md
  - https://docs.medusajs.com
  - https://nextjs.org/docs
  - https://typescript-eslint.io
official_refs:
  - https://docs.medusajs.com
  - https://nextjs.org/docs
  - https://typescript-eslint.io
description: "Fix the mdeapp lint/typecheck verification floor so every later commerce PR has trustworthy proof."
---

# ECOM-C-000 - Repair mdeapp verification floor before commerce

## 1. Purpose

**Easy description:** Fix the mdeapp lint/typecheck verification floor so every later commerce PR has trustworthy proof.

**Goal:** Make the existing mdeapp verification floor trustworthy before adding Medusa commerce work.

**Why this exists:** This task keeps the commerce rollout executable by proving one bounded step toward the first milestone: AI product search -> ProductCard -> Medusa cart -> Stripe test checkout -> Medusa order.

## 2. Goals

- Ship this as one small PR.
- Preserve the existing mdeai Next.js/CopilotKit/Mastra app surface.
- Keep Medusa as the source of truth for mutable commerce data.
- Keep Supabase limited to identity, vectors, links, analytics, and pre-commerce records.
- Leave a rollback path and proof commands in the PR.

## 3. Features

- Patch `mdeapp/eslint.config.*` so lint ignores generated nested worktree/build artifacts such as `workspace/**`, `.worktrees/**`, and `**/.next/**`.
- Patch `mdeapp/tsconfig.json` or scoped TypeScript config so typecheck does not traverse generated nested worktree artifacts.
- Keep source lint/typecheck coverage for `mdeapp/src/**`, tests, scripts, and config.
- Re-run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `npm run audit`.
- Do not add commerce features in this task.

## 4. Workflows

1. Run current floor commands.
2. Patch lint/typecheck scope for generated worktree artifacts.
3. Re-run lint, typecheck, test, and build.
4. Record remaining blockers in the task and audit docs.

### Files likely touched

- mdeapp/eslint.config.*
- workspace/**
- .worktrees/**
- **/.next/**
- mdeapp/tsconfig.json
- mdeapp/src/**
- npm run lint
- npm run typecheck
- npm test
- npm run build
- npm run audit

## 5. User Journeys

**Real-world example:** Sofia opens a commerce PR and can trust lint, typecheck, test, and build output instead of chasing generated artifact noise.

**Failure path:** If a dependency, SDK method, migration, or proof command fails, stop this task and update the task notes instead of widening scope.

## 6. Agents

- No autonomous agent behavior is added in this task; keep changes deterministic and manually verifiable.

## 7. Integrations

### Official docs/repos used

- https://docs.medusajs.com
- https://nextjs.org/docs
- https://typescript-eslint.io

### Skill guardrails

- `mde-task-lifecycle`: floor repair must be complete before implementation tasks start.
- `medusa`: do not begin Mercur backend (`commerce/mercur`) until existing app proof commands are trustworthy.

## 8. Summary

| Field | Value |
|---|---|
| Phase | core |
| Milestone | M0 - Verification floor |
| Priority | P0 |
| Estimate | S / 0.5 day |
| Depends on | None |
| Blocks | none (optional pre-flight) |
| Linear label | COMM |
| Linear project | [Commerce Platform](https://linear.app/sanjiovani/project/commerce-platform-902371cd69e8/issues) |

## 9. Definition of Done

### Acceptance Criteria

- [x] `npm run lint` no longer scans generated nested worktree artifacts.
- [x] `npm run typecheck` completes without Node heap OOM.
- [x] `npm test` remains green.
- [x] `npm run build` remains green.
- [x] Any remaining `npm run audit` findings are documented with severity and owner.

Evidence: [SAN-628 — ECOM-C-000 mdeapp verification floor](../evidence/2026-06-09/ecom-c-000-verification-floor.md)

### Proof Commands

```bash
cd mdeapp && infisical run --silent --env=dev --path=/ -- npm run lint
cd mdeapp && infisical run --silent --env=dev --path=/ -- npm run typecheck
cd mdeapp && infisical run --silent --env=dev --path=/ -- npm test
cd mdeapp && infisical run --silent --env=dev --path=/ -- npm run build
cd mdeapp && infisical run --silent --env=dev --path=/ -- npm run audit
```

### Rollback Plan

Revert the lint/TypeScript config changes and restore the previous verification behavior.

## 10. Tests

- Existing lint/typecheck/test/build/audit floor commands above are the tests for this task.
