---
id: DATA-MODEL-AUDIT
title: Forensic audit — VENUE-DATA-MODEL.md vs live Supabase + PR #146
audited: mdeapp/docs/tasks/events/data/VENUE-DATA-MODEL.md
linear: SAN-492 · EVT-033 — Event venue + offerings schema
date: 2026-06-09
verified_via: Supabase MCP live probes (project zkwcbyxiwklihegjhuql) · get_advisors(security) (100 findings digested) · PR #146 branch diff (02a7531 + 1b10550) · mde-supabase skill rules
verdict: 94/100 audit analysis (A) · authored SQL 90/100 (A-) post-E0 · NO-GO prod apply until human ERD sign-off
reverified: 2026-06-09 post-E0 (partner_is_active + REVOKE/GRANT + RLS smoke ALL PASS)
---

# Data model audit — VENUE-DATA-MODEL.md (SAN-492 · EVT-033)

> **Prior audit (B1/B2/B3):** [`../audit/04-data-model-audit.md`](../audit/04-data-model-audit.md)  
> **SoT under review:** [`VENUE-DATA-MODEL.md`](./VENUE-DATA-MODEL.md)

## Live re-check (2026-06-09 · Supabase MCP)

| Probe | Result | Audit claim |
|-------|--------|-------------|
| Latest migration | `20260608202427` | ✅ SAN-492 not applied |
| `venue_event_offerings` / `packages` | **0 tables** | ✅ |
| `partner_is_active()` on prod | **0** | ✅ N/A until apply; must be **in migration SQL** before apply |
| `partner_locations` columns | **12** (no `accepts_event_bookings` / `is_verified`) | ✅ |
| Partners | **2 total, 2 `draft`, 0 `type=venue`** | ✅ E1 (100% draft; seed must create active venue partners) |
| `partners` anon SELECT policies | **none** (authenticated only) | ✅ E0 root cause |
| `bookings.partner_status` CHECK | `pending\|approved\|declined` | ✅ |
| Enums | `partner_type` 8 values · `partner_status` incl. `active` · `booking_type` incl. `event` (+ `showing` live) | ✅ (note: `showing` added to enum since doc written) |
| Published events / orphans | **49 / 31** | ✅ unchanged |
| `get_advisors(security)` prod | **100** (1 ERROR `spatial_ref_sys`, 99 WARN pre-existing) | ✅ E8 |
| PR #146 / disk migration SQL | **`partner_is_active()`** + 3 public policies use helper | ✅ E0 **fixed on disk** (pending commit to PR branch) |
| Local smoke (`san492-rls-smoke.sql`) | **ALL PASS** (12 checks) on disposable `:54322` | ✅ |
| EVT-034 seed spec | [`EVT-034-seed.md`](../specs/venue-booking/EVT-034-seed.md) documents `status='active'` | ✅ E1 spec written — implementation still blocked until 492 apply |

**Re-check verdict:** audit analysis **94/100 (A)** · authored SQL **90/100 (A-)** — **GO PR review** · **NO-GO prod apply** until human ERD sign-off + staging apply.

## Plain-English summary

The data model's **facts are excellent** — every claim it makes about the live database checked
out true when probed today (enums, constraints, policies, indexes, helper functions, triggers,
applied migrations). The core decision (reuse the partner stack, no duplicate venue table) is right.

But the SQL as written has **two silent ways to ship a blank feature**:

1. **The public read rules don't work for visitors (RLS trap).** The policies check
   "is the owning partner active?" by querying the `partners` table inline. Row security
   (per-row access rules) applies *inside* policy subqueries too — and `partners` has no
   public-read policy — so for a visitor that check always answers "no". Camila opens the venue
   list and sees **nothing**, even with active, verified venues. The fix (a `partner_is_active()`
   SECURITY DEFINER helper — a function that bypasses row security for exactly this check) is
   already documented in the `mde-events` skill and expected by the new smoke script — **now present in
   `20260609120000_san492_event_venue_offerings.sql` on disk** (pending commit/push to PR #146).
2. **Every live partner is status `'draft'`.** The policies and the strengthened trigger require
   `'active'` (a valid value — enum is `draft, pending_review, active, suspended, churned`).
   **Seed spec [`EVT-034-seed.md`](../specs/venue-booking/EVT-034-seed.md)** now requires
   `partners.status='active'` + verified event-capable locations; seed **implementation** still pending SAN-493.

Both failures are silent if unfixed: the migration applies cleanly, tests pass, and the feature is dark.
**Verdict: 85% (B). NO-GO for prod apply until human ERD sign-off.** E0 is fixed in authored SQL; E1 closes when SAN-493 seed lands after apply.

---

## Errors · red flags · failure points · blockers

| # | Finding | Dot | Real-world effect |
|---|---------|:---:|-------------------|
| E0 | **Anon-RLS trap** | 🟢 | **Fixed** — `partner_is_active()` + REVOKE/GRANT; smoke ALL PASS |
| E1 | **Seed gap — `partners.status` must be `'active'`.** Spec: [`EVT-034-seed.md`](../specs/venue-booking/EVT-034-seed.md). Implementation SAN-493 still blocked until 492 apply. | 🟡 | Spec closed; seed script not written yet. |
| E2 | **Doc ↔ migration sync** — Appendix A matches migration (partner_is_active, strengthened trigger, rollback drops helper). Stale duplicate `events/VENUE-DATA-MODEL.md` removed. | 🟢 | Synced 2026-06-09. |
| E3 | **Readiness self-contradiction** — unified to **85** everywhere in canonical doc. | 🟢 | Fixed. |
| E4 | **Dedupe intent vs SQL** — §Indexes says "global place uniqueness"; A.1 creates `UNIQUE (partner_id, google_place_id)` = per-partner only. Two partners can claim the same Google place. | 🟡 | Duplicate cards for one physical restaurant in the SAN-494 CTA. |
| E5 | **ERD drift** — Mermaid omits `offering_key` (the A.2 uniqueness key) and `is_primary`; the ERD is the sign-off artifact. | 🟡 | Sign-off reviews an incomplete diagram. |
| E6 | **Trigger semantics undocumented** — branch guard now blocks proposals to **unverified** locations; doc promised only "active + accepts_event_bookings". Intended business rule? | 🟡 | Needs explicit yes/no at sign-off. |
| E7 | **Naming collision unnoted** — enum type `partner_status` (on `partners.status`) vs text column `bookings.partner_status` are different things with the same name. | ⚪ | Future-bug fuel; one sentence fixes. |
| E8 | **"Advisors clean" gate unachievable as written** — baseline today: 1 pre-existing ERROR (`spatial_ref_sys`, PostGIS system table, unrelated) + 99 WARNs (incl. `is_admin`/`has_role`/`partner_ids_for_user` anon-callable via RPC — pre-existing). Also: advisors must run **post-apply** (pre-apply lint can't see new tables). | ⚪ | Reword to "no NEW findings vs 2026-06-09 baseline, on the post-apply environment". |
| E9 | **Public SELECT exposes all columns** incl. `metadata` jsonb (empty today). | ⚪ | If partner contact info ever lands in metadata, it goes public. Add a no-PII rule or a view. |

## What the doc got RIGHT (all live-verified 2026-06-09)

🟢 `partners.type` enum exactly `host, venue, broker, sponsor, agency, vendor, tour, creator` ·
🟢 `booking_type` enum contains `event` · 🟢 `bookings.status` enum exactly as listed ·
🟢 `partner_status` CHECK `pending|approved|declined` · 🟢 `partner_locations` 12 columns exact; new columns absent ·
🟢 all 4 `venue_booking_requests` CHECKs + 4 NOT NULLs verbatim · 🟢 `events_venue_fkey` real FK ·
🟢 latest applied migration `20260608202427` (SAN-135); SAN-492 **not applied** ·
🟢 bookings policies incl. own-rows INSERT/SELECT/UPDATE + partner_member pair + service role ·
🟢 indexes exactly as claimed (`google_place_id` index genuinely missing) ·
🟢 `partner_ids_for_user()` returns `SETOF uuid` (usage valid) · `is_admin()` = has_role admin/super_admin ·
🟢 `update_updated_at()` exists and already drives `partner_locations_updated_at` ·
🟢 `'active'` is a real `partner_status` enum label (the policy syntax itself can't fail) ·
🟢 PR #146 expands "(RLS identical shape)" into explicit `vep_*` policies — migration is complete where the doc abbreviates.

## Section scorecard

| Section | Dot | % | Notes |
|---------|:---:|:--:|-------|
| Domain split | 🟢 | 100 | all table claims live-verified |
| Decision matrix | 🟢 | 95 | criteria factual |
| Tables create/extend/reuse | 🟢 | 100 | — |
| RLS plan | 🟢 | 95 | E0 fixed + smoke green |
| **Overall** | 🟢 | **90 — A-** | **GO PR review · NO-GO prod until sign-off** |

## Task impact

| Task | Dot | % ready | Change required |
|------|:---:|:---:|-----------------|
| SAN-492 · EVT-033 | 🟢 | 90 | human ERD sign-off → merge → staging apply |
| SAN-493 · EVT-034 — Seed Mamacita + 5 event partners | 🟡 | 75 | spec [`EVT-034-seed.md`](../specs/venue-booking/EVT-034-seed.md) ready; blocked until 492 apply |
| SAN-496 · EVT-037 — Request proposal modal (HITL) | 🟡 | 85 | edge-fn validation mirrors the STRENGTHENED guard (verified + active + partner match) |
| SAN-502 — admin event booking queue | 🟢 | 90 | `is_admin()` path verified workable for Patricia |

## Critical fixes (ordered)

1. ~~**E0:** `partner_is_active()` in migration~~ ✅ on disk — **commit/push PR #146**
2. ~~**E1:** EVT-034 seed spec~~ ✅ [`EVT-034-seed.md`](../specs/venue-booking/EVT-034-seed.md) — implement SAN-493 after apply
3. ~~**E2/E3:** doc sync + readiness 85~~ ✅
4. **E4–E9:** place-uniqueness decision, ERD fields (`offering_key`, `is_primary` added), trigger semantics documented in A.5, naming note in audit table, advisor gate reworded in A.7, metadata PII rule (deferred)

## Next steps

1. **Commit** migration + docs to `ai/san-492-evt-033-event-venue-offerings-schema` → `gh pr ready 146`
2. **Human ERD sign-off** on [`VENUE-DATA-MODEL.md`](./VENUE-DATA-MODEL.md) Appendix A
3. Staging apply → RLS smoke ALL PASS → `get_advisors(security)` post-apply delta vs baseline
4. SAN-493 seed script per EVT-034 → SAN-494/495/496 chain

*Advisor baseline (2026-06-09, pre-apply prod): 1 ERROR (`spatial_ref_sys`, pre-existing PostGIS) ·
99 WARN — 60 authenticated-definer-RPC + 34 anon-definer-RPC (incl. `is_admin`, `has_role`,
`partner_ids_for_user`, and money-touching `ticket_payment_*` functions) + 3 extensions-in-public +
leaked-password-protection off + mutable search_path on `trigger_set_timestamps`. None mention the
SAN-492 tables. Compare post-apply output against this list — "no NEW findings" is the gate.*
