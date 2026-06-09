---
task_id: data-011
mvp_step: 11
title: Edge function MVP freeze matrix + guest-lead abuse audit
layer: DATA
priority: P1
status: Done
estimated_effort: 4h
depends_on: ["data-001"]
unblocks: []
skills: [mde-task-lifecycle, mde-supabase, task-verifier]
related:
  - ../plan/23-audit.md
  - ../evidence/data-011-edge-matrix.md
  - ../../events/EVP-003-core-stripe-webhook-secret-audit.md
  - ../../../supabase/functions/chat-lead-capture/index.ts
description: Document KEEP/FREEZE edge functions for Phase 1; audit chat-lead-capture abuse controls.
verified: MCP list_edge_functions 2026-05-30 — 39 ACTIVE; read-only audit
evidence: ../evidence/data-011-edge-matrix.md
---

# DATA-011 — edge hardening evidence

## At a glance

| | |
|---|---|
| **For** | sanjiovani |
| **Surface** | Supabase edge functions — ops doc + optional Turnstile |
| **Layer** | DATA / security |

## What we're building

Read-only audit artifact + minimal hardening backlog. **Does not** re-implement Stripe webhooks (already signed + idempotent on disk).

## Goals

### 1. MVP edge function matrix

Classify **all ACTIVE** edge functions from MCP `list_edge_functions` at task start (baseline **39** on 2026-05-30 — do not hard-code count).

Matrix columns:

| Column | Purpose |
|--------|---------|
| `slug` | Function name |
| `verify_jwt` | MCP + `config.toml` |
| `deploy_source` | `mdeai` vs legacy `/home/sk/mde/` (from MCP `entrypoint_path`) |
| `class` | KEEP / FREEZE / DEFER |
| `phase1_notes` | Persona surface or freeze reason |

| Class | Action | Examples |
|---|---|---|
| **KEEP** | Phase 1 load-bearing | `ticket-checkout`, `ticket-payment-webhook`, `ticket-validate`, `chat-lead-capture`, `approval-commit` |
| **FREEZE** | No deploys Phase 1 | sponsor-*, openclaw-*, postiz-*, `vote-cast`, `fraud-scan` |
| **DEFER** | Document owner | contest, enrichment crons |

Output: [`tasks/data/evidence/data-011-edge-matrix.md`](../evidence/data-011-edge-matrix.md)

### 2. Guest lead abuse audit

Verify on disk + live:

- [ ] `chat-lead-capture` `verify_jwt: false` (required for anon)
- [ ] `allowRateDurable` — 20/hr/IP for anon (confirmed 2026-05-26)
- [ ] Valid `intent` enum enforced
- [ ] Service-role insert to `leads` only (showings bridge → **DATA-021**)

Gaps to file as follow-ups (optional P2):

- Turnstile on `/api/leads/schedule-viewing`
- `suppression_list` check before insert
- Structured abuse log table or `ai_runs` metadata

### 3. Advisor cross-link (read-only)

From MCP `get_advisors` security at task start, note in evidence (no fix in this task):

- `rls_disabled_in_public` — identify table name
- `anon_security_definer_function_executable` / `authenticated_security_definer_function_executable` counts → Phase 2 / DATA-010 follow-on

### 4. EVP-003 cross-link

- Stripe webhook **implementation** verified ✅
- Remaining: secret isolation proof → EVP-003 (not duplicated here)

## Acceptance criteria

- [x] Edge matrix published — **39 ACTIVE** fns, KEEP/FREEZE/DEFER ([`../evidence/data-011-edge-matrix.md`](../evidence/data-011-edge-matrix.md))
- [x] Guest lead audit documents rate limit + P2 items
- [x] `rls_disabled_in_public` → `public.spatial_ref_sys` documented
- [x] No duplicate webhook implementation
- [x] Evidence linked from [`../plan/23-audit.md`](../plan/23-audit.md) (via evidence file)

## Real-world example

**Camila** (logged out) schedules a viewing — request hits `chat-lead-capture`, passes IP rate limit, creates `leads` row via service_role; spam farm blocked at 21st request/hour. **`showings` row** lands in DATA-021.
