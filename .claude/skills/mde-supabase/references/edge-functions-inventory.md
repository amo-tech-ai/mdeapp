---
parent: mde-supabase
title: Edge Functions Inventory (in-repo)
description: Canonical list of edge functions in this repository — names, verify_jwt, schema, auth, and Gemini models. Source of truth; sync when adding functions or editing supabase/config.toml.
load_when: edge function list, verify_jwt, which functions exist, deploy all functions
verified_at: 2026-05-17
---

# Edge functions — in this repo (16)

**Count:** 16 handlers under `supabase/functions/` (excluding `_shared`, `tests`, `node_modules`).

**Config:** Each must have a `[functions.<name>]` block in `supabase/config.toml`.

**Drift check:** From repo root:

```bash
.claude/skills/mde-supabase/scripts/verify-edge-inventory.sh
```

**Remote-only:** Older docs listed sponsor/vote/CRM functions deployed without local source. Those are **not** in this tree — treat this file + `supabase/functions/` as truth for development.

---

## AI (Gemini) — log to `ai_runs` where applicable

| Function | Model(s) | `verify_jwt` | Schema | Auth / notes |
|----------|----------|--------------|--------|----------------|
| `ai-router` | `gemini-3.1-flash-lite-preview` | false | public | Optional user JWT; pattern + LLM routing |
| `ai-chat` | `gemini-3-flash-preview` | false | public | Optional user JWT; tool-calling + Maps grounding |
| `ai-search` | `gemini-embedding-001`, `gemini-2.0-flash-lite` | false | public | Optional user JWT; pgvector search |
| `ai-trip-planner` | `gemini-3.1-pro-preview` | false | public | Optional user JWT |
| `ai-optimize-route` | `gemini-3-flash-preview` | false | public | Optional user JWT |
| `rentals` | `gemini-3.1-pro-preview` | false | public | `search`: optional JWT + rate limit; other actions vary |
| `ai-embed` | `gemini-embedding-001` | false | public | Service/cron-style embedding writes |
| `sponsor-roi-explain` | `gemini-3-flash-preview` | false | sponsor | User JWT **or** `SPONSOR_ROI_CRON_SECRET` Bearer |

**Secret:** `GEMINI_API_KEY` (Infisical → Supabase edge secrets). See [ai-edge-functions.md](ai-edge-functions.md).

**Planned (not in repo):** `ai-creative-gen`, `ai-audience-match` (Phase 3 sponsor) — do not document as shipped until `supabase/functions/` exists.

---

## Events + tickets

| Function | Gemini | `verify_jwt` | Schema | Auth / notes |
|----------|--------|--------------|--------|----------------|
| `ticket-checkout` | — | false | public | Stripe Checkout; inline anon/user |
| `ticket-payment-webhook` | — | false | public | `Stripe-Signature` |
| `ticket-validate` | — | false | public | `STAFF_LINK_SECRET` staff JWT (in-handler) |
| `event-staff-link-generator` | — | **true** | public | Supabase user JWT; mints staff JWT |

---

## Other (no Gemini)

| Function | `verify_jwt` | Schema | Auth / notes |
|----------|--------------|--------|----------------|
| `chat-lead-capture` | false | public | Optional user JWT; IP rate limit if anonymous |
| `google-directions` | false | public | **Bearer user JWT required** + rate limit |
| `rules-engine` | false | public | `RULES_ENGINE_SECRET` / cron secret (timing-safe) |
| `ai-suggest-collections` | false | public | Heuristic grouping only (no LLM call) |

---

## Shared code

| Path | Purpose |
|------|---------|
| `supabase/functions/_shared/` | CORS, auth, Gemini client, `ai_runs`, rate limits, Stripe helpers |
| `supabase/functions/tests/` | Deno integration tests |

---

## Related docs

- [ai-edge-functions.md](ai-edge-functions.md) — Gemini models + operational rules
- [edge-functions.md](../edge-functions.md) — Deno patterns, deploy, limits (long reference)
- [`.claude/rules/edge-function-patterns.md`](../../../rules/edge-function-patterns.md) — mdeai HTTP lifecycle (non-Supabase-specific)
