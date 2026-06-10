---
task_id: PR-05
title: C2 — edge functions PR from #23 + JWT justification
phase: HIGH
priority: P1
status: Done
archived: 2026-06-02
main_sha: 4de18f1
prod_sha: 4de18f1
area: data
skill: mde-supabase, security-reviewer
source: docs/03-notes.md (#23 supersession — C2)
depends_on: [PR-04]
github_pr: 23
verified: 2026-06-01
main_sha: c9e54b8
spec_accuracy_pct: 100
audit_dot: green
description: Extract the 15 edge-function files from #23 into their own PR; fix the verify_jwt justification.
---

## Summary

| Field | Value |
|-------|-------|
| Source | PR #23 (`feat/supabase-track-migrations`) — `supabase/functions/**` (15 files) |
| Why standalone | These exist **nowhere else** — not on the DATA branch, not on `main`. Losing them is the real risk of closing #23 |
| Security fix | `chat-lead-capture/config.toml:1` sets `verify_jwt = false` with **no justification comment** |

## Problem

#23 bundled edge functions with migrations. They are the only copy of the Stripe webhook, ticket-checkout, approval-commit, chat-lead-capture, and shared libs. Extract to a clean PR; while here, fix the unjustified JWT bypass.

## Change (wiring)

| Layer | File | Action |
|-------|------|--------|
| Branch | `data/c2-edge-functions` (fresh off `main`, after C1) | Create |
| Edge fns | `supabase/functions/_shared/{http,jwt,rate-limit,schedule-viewing-bridge,supabase-clients}.ts` | Create (track) |
| Edge fns | `supabase/functions/{approval-commit,chat-lead-capture,ticket-checkout,ticket-payment-webhook}/**` | Create (track) |
| Edge fns | `supabase/functions/tests/**` | Create (track) |
| Config | `supabase/functions/chat-lead-capture/config.toml` | Modify — add `# verify_jwt=false because: <reason>` comment |
| Config | `supabase/functions/ticket-checkout/config.toml` | Modify — move justification from `index.ts` into the toml |

## Skill to use

- **`mde-supabase`** — edge-function structure, service-role usage (allowed here, **never** in `src/**`).
- **`security-reviewer`** (subagent) — run it on the diff: confirm no leaked secrets (`eyJ`/`sk_live_`/`whsec_`), every `verify_jwt=false` has an adjacent justification, webhook signature-verified.

## Gates / Acceptance

- [ ] All 15 files tracked; functions importable/deployable (`get_edge_function` smoke if deployed).
- [ ] `verify_jwt=false` occurrences each carry a justification comment (webhook = signature-verified, not JWT).
- [ ] `security-reviewer` verdict: ✅ no P0/P1.
- [ ] `/verify-floor` green.

## Testing & proof

### Persona / journey

**Andrés/Miguel** — `ticket-checkout` + `ticket-payment-webhook` (Stripe). **Camila** — `chat-lead-capture` (anonymous leads). **Roberto** — `approval-commit` (HITL, JWT required).

### Pre-ship

```bash
cd mdeapp
# Config parity
grep -r verify_jwt supabase/functions/*/config.toml
# Floor + security review on diff
npm run floor
# Deploy smoke (human gate)
supabase functions deploy ticket-checkout --project-ref zkwcbyxiwklihegjhuql
```

### Implementation proof (Done · PR **#42** @ `fa263e7`)

| Function | verify_jwt | Deployed | Entrypoint |
|----------|------------|----------|------------|
| `ticket-checkout` | false | ACTIVE v33 | `mdeai/supabase/functions/...` |
| `ticket-payment-webhook` | false | ACTIVE v33 | `mdeai/supabase/functions/...` |
| `chat-lead-capture` | false | ACTIVE v19 | deployed |
| `approval-commit` | **true** | ACTIVE v3 | `mdeai/supabase/functions/...` |

**Edge logs (24h):** no C2 function errors; legacy `lead-reminder-tick` 500s are out of scope.

**Evidence:** Supabase MCP `list_edge_functions` · `tasks/PR/NOTES/notes-5.md` (C2 verify section)

## Risks / Notes

- Depends on **PR-04** (tables must exist for the functions' queries). Fresh branch off `main`.
- Persona: **Andrés/Miguel** (ticket-payment-webhook), **Camila** (chat-lead-capture) — these power real payment + lead flows.
