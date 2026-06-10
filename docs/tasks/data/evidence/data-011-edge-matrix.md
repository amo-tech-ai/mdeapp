---
task: data-011
date: 2026-05-30
project: zkwcbyxiwklihegjhuql
method: Supabase MCP list_edge_functions + get_advisors security + disk read chat-lead-capture
mutation: none
status: pass
---

# DATA-011 — edge hardening evidence

## Verdict

**PASS** — Read-only audit complete. **39 ACTIVE** edge functions classified. Guest lead controls verified on disk + MCP. No code changes. Showings bridge explicitly deferred to DATA-021.

| Check | Result |
|-------|--------|
| Edge matrix (39 fns) | ✅ |
| chat-lead-capture `verify_jwt: false` | ✅ |
| Anon rate limit 20/hr/IP | ✅ |
| Intent enum enforced | ✅ |
| Service-role → `leads` only | ✅ |
| Showings bridge | ⏭️ DATA-021 (not in scope) |

---

## Edge function count

**ACTIVE at task start:** **39** (MCP `list_edge_functions`, 2026-05-30)

| Class | Count |
|-------|------:|
| **KEEP** | 6 |
| **FREEZE** | 21 |
| **DEFER** | 12 |
| **Total** | 39 |

---

## MVP edge freeze matrix

| slug | verify_jwt | deploy_source | class | phase1_notes |
|------|:----------:|---------------|-------|--------------|
| `ticket-checkout` | false | **mdeai** | KEEP | Andrés checkout — Phase 1 revenue |
| `ticket-payment-webhook` | false | **mdeai** | KEEP | Stripe finalize webhook |
| `ticket-validate` | false | legacy-mde | KEEP | Door scan / ticket validate |
| `chat-lead-capture` | false | **mdeai** | KEEP | Camila anon leads + schedule-viewing |
| `approval-commit` | true | **mdeai** | KEEP | HITL approval commit |
| `event-staff-link-generator` | true | legacy-mde | KEEP | Roberto door-staff JWT links |
| `vote-cast` | false | legacy-mde | FREEZE | Contest — Phase 2 |
| `fraud-scan` | false | hosted/tmp | FREEZE | Fraud scan — not Phase 1 |
| `sponsor-contract-sign` | true | legacy-mde | FREEZE | Sponsor stack frozen |
| `sponsor-optimize` | true | legacy-mde | FREEZE | Sponsor stack frozen |
| `sponsor-audience-match` | true | legacy-mde | FREEZE | Sponsor stack frozen |
| `sponsor-moderate` | true | legacy-mde | FREEZE | Sponsor stack frozen |
| `sponsor-roi-explain` | true | legacy-mde | FREEZE | Sponsor stack frozen |
| `sponsor-creative-gen` | true | legacy-mde | FREEZE | Sponsor stack frozen |
| `sponsor-checkout` | true | legacy-mde | FREEZE | Sponsor stack frozen |
| `sponsor-payment-webhook` | false | legacy-mde | FREEZE | Sponsor stack frozen |
| `sponsor-impression` | false | legacy-mde | FREEZE | Sponsor stack frozen |
| `sponsor-click` | false | legacy-mde | FREEZE | Sponsor stack frozen |
| `sponsor-contract-generate` | false | legacy-mde | FREEZE | Sponsor stack frozen |
| `sponsor-application-create` | true | legacy-mde | FREEZE | Sponsor stack frozen |
| `sponsor-cancel` | true | legacy-mde | FREEZE | Sponsor stack frozen |
| `openclaw-delivery-webhook` | false | hosted/tmp | FREEZE | OpenClaw — VPS Phase 2 |
| `openclaw-outreach` | false | hosted/tmp | FREEZE | OpenClaw outreach |
| `postiz-approval-webhook` | true | legacy-mde/worktree | FREEZE | Postiz frozen |
| `postiz-schedule-posts` | false | hosted/tmp | FREEZE | Postiz scheduler |
| `failed-deliveries-digest` | false | hosted/tmp | FREEZE | Delivery digest cron |
| `google-directions` | false | hosted/tmp | DEFER | Maps directions |
| `whatsapp-webhook` | false | hosted/tmp | FREEZE | WhatsApp Phase 2 |
| `rules-engine` | false | hosted/tmp | DEFER | Rules engine |
| `p1-crm` | true | legacy-mde | DEFER | Legacy P1 CRM |
| `listing-create` | true | legacy-mde | DEFER | Landlord listing post-MVP |
| `listing-moderate` | false | legacy-mde | DEFER | Listing moderation |
| `lead-from-form` | false | legacy-mde | DEFER | Form leads; chat-lead canonical |
| `lead-reminder-tick` | false | legacy-mde | DEFER | Cron reminder |
| `contestant-social-enrich` | true | hosted/tmp | DEFER | Contest enrichment |
| `moderate-asset` | true | hosted/tmp | DEFER | Asset moderation |
| `notify-entity-approved` | false | legacy-mde | DEFER | Notify on approval |
| `event-photo-moderate` | true | legacy-mde | DEFER | Event photo moderation |
| `outbox-dispatch` | false | hosted/tmp | DEFER | Outbox dispatch |

**Deploy source key:** `mdeai` = entrypoint under `/home/sk/mdeai/supabase/functions/` · `legacy-mde` = `/home/sk/mde/` · `hosted/tmp` = Supabase-deployed bundle (source tree not mdeai canonical)

**Phase 1 KEEP (6):** ticket checkout/webhook/validate, chat-lead-capture, approval-commit, event-staff-link-generator

---

## Guest lead abuse audit — `chat-lead-capture`

| Control | Expected | Verified | Pass |
|---------|----------|----------|:----:|
| `verify_jwt` | `false` (anon schedule-viewing) | `supabase/functions/chat-lead-capture/config.toml` + MCP | ✅ |
| Anon rate limit | 20 req / 3600s / IP | `allowRateDurable(..., 20, 3600)` when `!userId` | ✅ |
| Intent enum | 5 values | `VALID_INTENTS`: rental, host, buyer, event_organizer, sponsor | ✅ |
| DB write surface | `leads` only | `.from("leads").insert(...)` — no `showings` | ✅ |
| Service role | edge only | `getServiceClient()` from `_shared/supabase-clients.ts` | ✅ |

### P2 follow-ups (documented, not implemented)

- Turnstile on `/api/leads/schedule-viewing`
- `suppression_list` check before insert
- Structured abuse log / `ai_runs` metadata

### DATA-021 boundary

Schedule-viewing currently creates **`leads` only**. `showings` bridge + `leads.apartment_id` population → **DATA-021** (spec patched 2026-05-30).

---

## Advisor cross-link (read-only)

| Lint | Count | Table / note |
|------|------:|--------------|
| `rls_disabled_in_public` | 1 | `public.spatial_ref_sys` (PostGIS extension table) |
| `anon_security_definer_function_executable` | 43 | Phase 2 hardening backlog |
| `authenticated_security_definer_function_executable` | 68 | Phase 2 backlog |

Post-DATA-010: `function_search_path_mutable` = **0** (see [`data-010-search-path.md`](data-010-search-path.md)).

---

## EVP-003 cross-link

Stripe webhook **implementation** on disk (`ticket-payment-webhook`) — signed + idempotent. Secret isolation proof remains **EVP-003** (not duplicated here).

---

## Pass/fail summary

| Item | Pass | Fail |
|------|-----:|-----:|
| Matrix rows | 39 | 0 |
| Guest lead checks | 5 | 0 |
| Code mutations | 0 | — |
| **Total audit gates** | **44** | **0** |

## Score

| Scope | Score |
|-------|------:|
| DATA-011 acceptance | **100/100** |
