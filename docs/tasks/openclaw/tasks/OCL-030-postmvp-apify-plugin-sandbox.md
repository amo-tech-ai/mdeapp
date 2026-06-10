---
id: OCL-030-postmvp
tier: post-mvp
title: Apify OpenClaw plugin sandbox
status: Open
priority: P1
depends_on: [OCL-004-core, OCL-005-core, OCL-007-core, OCL-008-mvp, OCL-012-mvp]
skill: [open-claw, mde-hostinger, mde-supabase]
sources_index: ../docs/sources.md
openclaw_docs:
  - https://docs.apify.com/platform/integrations/openclaw
---

# OCL-030-postmvp — Apify plugin sandbox

## Objective

Install and test the Apify OpenClaw plugin in a sandboxed profile so mdeai can use vetted Actors for event, sponsor, venue, vendor, and public social research without granting broad scraping powers to agents.

## Why this is needed

Apify's OpenClaw integration exposes one `apify` tool with three actions:

- `discover` — find Actors or fetch an Actor input schema.
- `start` — start an async Actor run and return `runId`.
- `collect` — collect results later.

This pattern fits mdeai only if it is approval-gated, allowlisted, cost-capped, and audited.

## Scope

| Area | Requirement |
|---|---|
| Install | `openclaw plugins install @apify/apify-openclaw-plugin` in non-prod profile only. |
| Config | Use `APIFY_API_KEY` from secrets, not committed config. |
| Allowlist | Allow only `apify` tool actions needed for approved job types. |
| Actor allowlist | Only approved Actor IDs for search, websites, Instagram/Facebook public pages, LinkedIn/company pages, and Google Maps-like public research. |
| Async state | Store `runId`, actor ID, input hash, status, cost estimate, dataset pointer. |
| Approval | No `start` without `automation_approvals.approved_at`. |
| Collection | `collect` writes raw result snapshots to audit storage first, then normalized drafts. |

## Forbidden

- No autonomous outbound messaging.
- No credentialed scraping of private accounts.
- No bypassing platform limits or paywalls.
- No collecting sensitive personal data that is not needed for sponsor/vendor decisions.
- No writing directly to sponsor, event, vendor, or venue truth tables.

## Acceptance Criteria

- `openclaw apify status` succeeds in sandbox.
- `tools.alsoAllow` includes `apify` only in the sandboxed worker profile.
- A test job runs `discover -> start -> collect` against a harmless public Actor.
- Supabase stores approval, `runId`, input hash, result pointer, and actor metadata.
- Kill switch blocks Apify starts.
- Documentation lists approved Actor IDs and blocked categories.
