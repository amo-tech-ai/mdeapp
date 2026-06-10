Verdict: **substantively correct on the Done gates, not 100% clean on repo/process hygiene.** Re-verified live via Supabase MCP today.

---

## Overall score

| Task | Done gate | Process / evidence hygiene | My score |
|------|-----------|---------------------------|----------|
| **DATA-010** | ✅ PASS | 🟡 2 red flags | **92/100** |
| **DATA-011** | ✅ PASS | 🟡 3 yellow flags | **94/100** |

Both tasks are **safe to treat as Done for the advisor/matrix scope**. They are **not** flawless against full mde-supabase discipline.

---

## DATA-010 — what holds up (live MCP)

| Check | Result |
|-------|--------|
| `function_search_path_mutable` | **0** (was 10) — re-confirmed today |
| All 10 flagged fns `search_path = ''` | ✅ |
| P0 fns absent from mutable list | ✅ |
| SECURITY DEFINER bodies use `public.*` | ✅ (no unqualified DML detected) |
| `compute_lead_score` live body | ✅ works; has explicit `::jsonb` casts |
| Migration applied on remote | ✅ `20260530012233` `data010_search_path_hardening` in `list_migrations` |

**Core security outcome is real** — Andrés ticket RPCs and lead trigger are pinned correctly on prod.

---

## DATA-010 — red flags / blockers

### 🔴 1. Migration history drift (blocker for CI / `supabase db push`)

| Location | Version |
|----------|---------|
| **Remote (applied)** | `20260530012233_data010_search_path_hardening` |
| **Repo file** | `20260530120000_data010_search_path_hardening.sql` |

Evidence and INDEX reference `20260530120000`, but MCP `apply_migration` wrote a **different timestamp**. Per mde-supabase workflow:

> iterate with `execute_sql` → when ready, **`supabase db pull`** → `migration list`

Using `apply_migration` directly created a **remote/local mismatch**. Next `supabase db push` from repo may attempt a **second** migration with the same body under a new version — idempotent on function bodies, but **corrupts migration history**.

**Fix before Sofía runs floor/CI:** rename repo file to `20260530012233_...` *or* pull remote migration and delete the orphan `20260530120000` file.

### 🟡 2. Repo migration ≠ live function body (minor)

Live `compute_lead_score` has `::jsonb` casts; repo SQL file does **not**. Postgres accepts both (`'{}'::jsonb || '{"email":30}'` works), but **repo is not a faithful replay** of what's deployed.

### 🟡 3. P0 siblings still on weaker pin (in scope defer, not a fail)

These revenue-path helpers were **verify-only** and remain on `public, pg_temp` or `public`:

- `ticket_payment_finalize`
- `check_rate_limit`
- `insert_trip_item_for_user`

Advisor doesn't flag them today — acceptable per spec, but **not** the preferred `search_path = ''` standard for all DEFINER revenue RPCs.

---

## DATA-011 — what holds up

| Check | Result |
|-------|--------|
| ACTIVE edge fn count | **39** — matches matrix row count |
| KEEP/FREEZE/DEFER | **6 / 21 / 12 = 39** ✅ |
| Every MCP slug in matrix | ✅ none missing |
| `verify_jwt` column vs MCP | ✅ **0 mismatches** across all 39 |
| Deploy source (MCP `entrypoint_path`) | ✅ mdeai paths confirmed for 4 fns on disk |
| `chat-lead-capture` `verify_jwt=false` | ✅ config.toml + MCP |
| Anon rate limit 20/hr/IP | ✅ code |
| Intent enum | ✅ 5 values |
| `leads` insert via service role only | ✅ no anon INSERT policy on `leads` |
| Showings bridge excluded | ✅ correct boundary |

---

## DATA-011 — yellow flags / failure points

### 🟡 1. Authenticated users skip rate limit

```28:42:supabase/functions/chat-lead-capture/index.ts
  if (!userId) {
    const rl = await allowRateDurable(
      serviceClient,
      `chat-lead:${clientIp(req)}`,
      20,
      3600,
    );
```

Logged-in Camila can spam `leads` without IP throttle. Service-role insert still works; abuse risk is **lower severity** but real. Evidence marks Turnstile as P2 — correct, but audit **passes a control that only covers anon**.

### 🟡 2. DATA-020 columns not written (expected gap → DATA-021)

Edge fn writes `metadata.listing_id` but **not** `leads.apartment_id` or `preferred_showing_at`. Audit correctly defers to DATA-021, but **schedule-viewing is incomplete end-to-end** today.

### 🟡 3. Phase 1 attack surface >> KEEP count

Only **6 KEEP**, but **39 ACTIVE** edge functions remain deployed (21 FREEZE + 12 DEFER still callable). Matrix documents this; it does **not** disable FREEZE fns. Read-only scope is fine — but **operational risk** remains until deploy freeze or gateway rules.

### 🟡 4. Classification judgment calls (not errors)

- `notify-entity-approved` → **DEFER** (could argue FREEZE with sponsor stack)
- `google-directions` → **DEFER** with `verify_jwt=false` (in-handler JWT may exist — matrix doesn't audit handler auth)

### 🟡 5. Skill/doc drift (outside task scope)

`mde-supabase/references/edge-functions-inventory.md` still says **16 in-repo** functions; mdeai tree has **4** (`ticket-checkout`, `ticket-payment-webhook`, `chat-lead-capture`, `approval-commit`). Matrix is accurate; inventory doc is stale.

---

## Advisor snapshot (unchanged post-DATA-010)

| Lint | Count | Blocks Phase 1? |
|------|------:|-----------------|
| `function_search_path_mutable` | **0** | No ✅ |
| `anon_security_definer_function_executable` | 43 | Phase 2 |
| `authenticated_security_definer_function_executable` | 68 | Phase 2 |
| `rls_disabled_in_public` | 1 (`spatial_ref_sys`) | PostGIS known issue |
| `auth_leaked_password_protection` | 1 | AUTH-011 |

---

## Pass/fail vs "100% correct"

| Gate | DATA-010 | DATA-011 |
|------|----------|----------|
| Task acceptance criteria | ✅ PASS | ✅ PASS |
| Live MCP verification | ✅ PASS | ✅ PASS |
| mde-supabase migration hygiene | ❌ **FAIL** (version drift) | N/A |
| Repo = remote fidelity | 🟡 partial | ✅ (read-only) |
| Security posture complete | 🟡 advisor gate only | 🟡 documented gaps |

---

## Blockers before calling it perfect

1. ~~**Fix migration filename/history**~~ — **Done (DATA-010b, 2026-05-30):** repo `20260530012233`; orphan archived.
2. ~~**Sync repo SQL**~~ — **Done (DATA-010b):** `compute_lead_score` `::jsonb` casts in repo migration.
3. **Optional hardening** — rate-limit authenticated `chat-lead-capture` (P2); upgrade P0 sibling RPCs to `search_path = ''` in a follow-up slice.

---

## DATA-021 — can it start?

**Yes** — migration drift resolved (DATA-010b). DATA-020 cols exist, `showings` table ready, chat-lead path confirmed leads-only.

---

**Bottom line:** The **security outcomes are real and verified** (search_path 10→0, edge matrix complete, guest-lead controls mostly sound). Calling it **100% correct** is overstated because of **migration history drift** and a few **documented-but-unfixed abuse gaps**. I'd mark both Done for DATA-track purposes, then open a small **DATA-010b hygiene slice** before the next `supabase db push`.**Short answer:** The task *direction* is right — order, dependencies, and split (010/011 parallel → 021 → 028; 007/008 behind MAP-005) all hold up against mde-supabase + live MCP. Several specs still have **stale numbers or schema drift** and should be patched before execution, especially **DATA-021**.

---

## Verdict by task

| Task | Correct? | Execute now? | Must-fix before coding |
|------|----------|--------------|------------------------|
| **DATA-010** | ✅ Yes | ✅ Yes | Patch spec (see below) |
| **DATA-011** | ✅ Yes | ✅ Yes | Minor spec updates |
| **DATA-021** | ⚠️ Gap real, spec wrong | ❌ Patch first | **Required fixes** |
| **DATA-028** | ✅ Yes | After 021 | None |
| **DATA-007** | ✅ Yes | After MAP-005 | Optional: add baseline cache % |
| **DATA-008** | ✅ Yes | After 007 | Optional: prioritize golden place_ids |
| **DATA-006** | ✅ Layer A done | — | Layer B = app (MSV-012) |

---

## Required corrections

### DATA-010 — patch spec, then ship

**Wrong today:**
- `"80+ WARN"` → live MCP has **10** `function_search_path_mutable` (not 80+)
- P0 list is incomplete/outdated:
  - `ticket_payment_finalize` — **already pinned**, not flagged
  - `check_rate_limit` — **already pinned**, not flagged
  - **Missing from P0:** `get_anonymous_order`, `ticket_payment_finalize_response`, `ticket_payment_refund`
- P2 list (`fts_spanish`, `fts_array_to_text`) is actually in the flagged set — fine as P2, but P0 should lead with revenue RPCs above

**Improve acceptance criteria:**
- P0 = Andrés path: `get_anonymous_order`, `ticket_payment_finalize_response`, `ticket_payment_refund`
- For new/edited `SECURITY DEFINER` funcs: prefer `SET search_path = ''` + `public.*` qualified names (skill), not only `SET search_path = public`
- Evidence should also **note** (out of scope for Done): 43 anon + 68 auth `security_definer_function_executable` lint items

**Effort:** 8h is high for 10 functions — **3–4h** is more realistic if scoped to the 10 flagged names only.

---

### DATA-011 — minor patches

**Wrong today:**
- Hard-coded **37** edge fns → live count is **39** (`approval-commit` + others)
- Acceptance should say “all ACTIVE fns from MCP at task start” not a fixed number

**Improve:**
- Matrix columns: **slug | verify_jwt | deploy source (mdeai vs legacy mde) | KEEP/FREEZE/DEFER**
- Many deployed entrypoints still point at `/home/sk/mde/` — flag that in the matrix (ops risk, not a spec error)
- Optionally add acceptance row: identify the **1** `rls_disabled_in_public` table from advisor export

Otherwise task is solid — read-only, skill-aligned, correctly doesn’t duplicate EVP-003 or DATA-021.

---

### DATA-021 — **must patch before implementation**

**Wrong today (spec vs live DB):**

| Spec says | Live Supabase |
|-----------|---------------|
| Status `proposed \| confirmed \| …` | CHECK uses **`scheduled`**, not `proposed` |
| Need migration for indexes | **Already exist** (`idx_showings_*`, composite on lead+scheduled) |
| Schema list omits `trip_id` | **`trip_id` FK + index** live (DATA-029) |
| Evidence in `data-019` folder | Should be `tasks/data/evidence/data-021-showings-bridge.md` |
| `chat-lead-capture` → showings | Only inserts `leads`; writes `metadata.listing_id`, **not** `leads.apartment_id` |

**Rewrite goals to:**
1. Status contract: `scheduled | confirmed | cancelled | completed | no_show` (match CHECK — no migration unless you intentionally rename `scheduled` → `proposed`, which I wouldn’t)
2. Extend `chat-lead-capture` (or thin sibling edge fn): on schedule-viewing with `preferred_at` + listing/apartment id → insert **both** `leads` (populate `apartment_id`, `preferred_showing_at`) **and** `showings` (`status = 'scheduled'`)
3. Pass through `trip_id` when present (for DATA-028)
4. Drop index/RLS goals (already done); keep edge wiring + evidence SQL

**Add to frontmatter:** `skills: [mde-supabase, mde-task-lifecycle]` and `depends_on: ["data-020"]` is correct.

---

### DATA-028 — mostly correct

- Dependency chain `027 + 021 + 029` is right
- Using `insert_trip_item_for_user` from edge webhooks is the right pattern per skill
- No spec changes required beyond cross-linking DATA-021’s `trip_id` + `scheduled` status

---

### DATA-007 / DATA-008 — correct, blocked

- MAP-005 gate is correct — without proxy read-through, cache audit is misleading
- Optional spec add: baseline from MCP (café ~70%, nightclub ~8%, restaurant **0%** cached) so DATA-008 priority queue is obvious

---

### INDEX-data.md — small stale lines

Still says **44/44 restaurants** in pack summary; live is **43/43** with place_id. Worth a one-line fix so Patricia doesn’t chase a ghost row.

---

## What’s already correct (don’t change)

- Critical path order after DATA-006 Layer A
- DATA-011 vs DATA-021 scope split (audit vs bridge)
- DATA-007 blocked on MAP-005
- DATA-006 Layer A Done / Layer B open split
- Service-role-only edge pattern for leads/showings
- Migration workflow: MCP `execute_sql` iterate → `supabase/migrations/` → `get_advisors` (not `apply_migration` for iteration)

---

## Recommended next step

Patch **DATA-010**, **DATA-011**, and **DATA-021** specs (and INDEX restaurant count) — then execute 010 + 011 in parallel. **Don’t start DATA-021 coding** until the status enum and evidence path are fixed.

Want me to apply those spec patches directly?
Forensic pass against **mde-supabase** + live Supabase MCP (`zkwcbyxiwklihegjhuql`, 2026-05-30). No code or DDL was run.

---

## Recommended order (DATA critical path)

```text
NOW (parallel, unblocked)
  ├── DATA-010  search_path hardening
  └── DATA-011  edge freeze matrix + guest-lead audit

THEN (rentals/trips — Camila / Andrés)
  └── DATA-021  showings bridge  →  DATA-028  trip_items sync

BLOCKED (maps cost path)
  └── MAP-005  →  DATA-007  →  DATA-008

APP (not DATA DDL)
  └── MSV-012, AUTH-005/009/011
```

---

## DATA-010 — Postgres `search_path` hardening

**Readiness: 82/100** — correct task, stale spec numbers, tighten acceptance to match skill + MCP.

| Check | Spec | Live MCP | Verdict |
|-------|------|----------|---------|
| Advisor lint | “80+ WARN” | **10** `function_search_path_mutable` | ⚠️ Fix spec — count is 10, not 80+ |
| P0 `get_anonymous_order` | Listed | **FLAGGED** (`search_path` unset) | ✅ Real P0 |
| P0 `ticket_payment_finalize` | Listed | **Not flagged** (`search_path = public, pg_temp`) | ⚠️ Already partially fixed; siblings still open |
| P0 `check_rate_limit` | Listed | Not flagged (`public, pg_temp`) | ✅ Done |
| P0 `insert_trip_item_for_user` | “already pinned” | `search_path = public`, not flagged | ✅ Confirmed |
| Actual flagged set | Incomplete | `ticket_payment_finalize_response`, `ticket_payment_refund`, `compute_lead_score`, `record_check_in`, trigger helpers, FTS | ⚠️ Expand P0/P1 list |

**mde-supabase best practice gap**

Skill [`supabase-database-functions.md`](.agents/skills/mde-supabase/references/project-rules/supabase-database-functions.md) prefers:

```sql
SET search_path = ''  -- + fully qualified public.* names
```

DATA-010 allows `SET search_path = public`. That satisfies the linter for some funcs (e.g. `check_rate_limit`) but is **weaker** than the skill for `SECURITY DEFINER` revenue RPCs.

**Recommendation before execution**

1. Patch spec: “10 mutable search_path WARNs” + export full advisor CSV (also note 43 anon + 68 auth `security_definer_function_executable` — separate backlog).
2. P0 batch: `get_anonymous_order`, `ticket_payment_finalize_response`, `ticket_payment_refund` (+ verify `ticket_payment_finalize` body uses qualified names if keeping `public`).
3. Workflow per skill: iterate with MCP `execute_sql` → one migration ≤20 funcs in `supabase/migrations/` → re-run `get_advisors security`.
4. Do **not** use `apply_migration` for iteration.

---

## DATA-011 — Edge freeze matrix + guest-lead audit

**Readiness: 88/100** — good read-only audit task; re-count edge fns at start.

| Check | Spec | Live | Verdict |
|-------|------|------|---------|
| Edge fn count | **37** | **39 ACTIVE** (incl. `approval-commit`, newer fns) | ⚠️ Update spec to “re-count via MCP” |
| `chat-lead-capture` `verify_jwt: false` | Required | ✅ `config.toml` + MCP | ✅ |
| Anon rate limit 20/hr/IP | Required | ✅ `allowRateDurable(..., 20, 3600)` | ✅ |
| Intent enum | Required | ✅ 5 intents validated | ✅ |
| Service-role → `leads` only | Required | ✅ `getServiceClient().from('leads').insert` | ✅ |
| Schedule-viewing → `showings` | Out of scope here | ❌ Not implemented (DATA-021) | ✅ Correct split |

**Best-practice notes (skill-aligned)**

- ✅ Service role only in edge, not `mdeapp/src`.
- ✅ UPDATE/SELECT pairing on `showings` already exists (5 policies + `service_role` ALL).
- P2 follow-ups in spec (Turnstile, suppression_list) are correctly deferred.
- Matrix should tag **mdeai-deployed** vs **legacy `/home/sk/mde/`** entrypoints (many MCP paths still point at legacy tree).

**Recommendation:** Run DATA-011 in parallel with DATA-010 — zero DDL, high signal for Patricia/Sofía.

---

## DATA-021 — Showings lead bridge

**Readiness: 65/100** — real gap, but spec drifts from live schema.

| Check | Spec | Live MCP | Verdict |
|-------|------|----------|---------|
| `showings` exists | ✅ | ✅ 0 rows | ✅ |
| RLS | Required | ✅ 5 policies + service_role | ✅ |
| Indexes `(apartment_id, scheduled_at)`, `(lead_id)` | Goal | ✅ `idx_showings_apartment_id`, `idx_showings_scheduled_at`, `idx_showings_lead_id`, composite | ⚠️ **Already done** — drop from scope |
| Status enum | `proposed \| confirmed \| …` | **`scheduled`** not `proposed` | ❌ **Spec bug — fix before coding** |
| `trip_id` on showings | Not mentioned | ✅ FK + index (DATA-029) | ⚠️ Add to spec for DATA-028 |
| Edge creates `showings` | Goal | `chat-lead-capture` only inserts `leads` | ✅ Gap confirmed |
| `leads.apartment_id` | Implied | Column exists; edge writes `metadata.listing_id` only | ⚠️ Bridge must map listing → `apartment_id` |

**Best-practice implementation path (mde-supabase)**

1. **Extend `chat-lead-capture`** (or new `schedule-showing` edge fn) — service client, same rate limit — not anon RPC from browser.
2. Single transaction: insert `leads` + insert `showings` with `status = 'scheduled'` (match CHECK).
3. Populate `leads.apartment_id` + `preferred_showing_at` (DATA-020 cols), not only metadata.
4. Optional RPC only if you need atomicity beyond edge; if RPC is `SECURITY DEFINER`, use `SET search_path = ''` + qualified names (DATA-010 pattern).
5. Evidence SQL in `tasks/data/evidence/data-021-showings-bridge.md` (not data-019 folder — wrong path in spec).

---

## DATA-028 — Booking → `trip_items` sync

**Readiness: 72/100** — design sound, blocked correctly on DATA-021.

| Check | Spec | Live | Verdict |
|-------|------|------|---------|
| `insert_trip_item_for_user` | Use RPC | ✅ exists, pinned `search_path` | ✅ |
| `trip_id` on commerce | Required | ✅ DATA-029 applied | ✅ |
| Webhook → trip_items | Gap | Not wired in `ticket-payment-webhook` | ✅ Accurate |
| Showings path | After DATA-021 | Blocked | ✅ |

**Skill alignment:** Prefer **`insert_trip_item_for_user`** from edge webhook (service role), idempotent upsert — matches skill “DB is source of truth” and avoids duplicate logic in `mdeapp/src`.

---

## DATA-007 / DATA-008 — Cache audit / backfill

**Readiness: DATA-007 70/100 spec · 0/100 execution** — correctly blocked on **MAP-005**.

| Kind | place_ids | Cached | Hit rate |
|------|----------:|-------:|---------:|
| café | 20 | 14 | ~70% |
| nightclub | 13 | 1 | ~8% |
| restaurant | 43 | 0 | **0%** |

`place_details_cache`: RLS ✅, 4 policies.

**Verdict:** DATA-007 dependency on MAP-005 is **correct**. Running audit before mdeapp read-through proxy would mislead Sofía — every restaurant detail click will miss cache today. DATA-008 should prioritize **restaurant + nightclub** place_ids from DATA-006 golden set.

**Skill/maps:** Every backfill call needs `X-Goog-FieldMask` (already in DATA-008 spec) — align with mde-maps, not raw Places from browser.

---

## Cross-cutting MCP security (not in DATA specs — flag for DATA-010/011 follow-on)

| Lint | Count | Action |
|------|------:|--------|
| `function_search_path_mutable` | 10 | DATA-010 |
| `anon_security_definer_function_executable` | 43 | Document in DATA-011 matrix / Phase 2 |
| `rls_disabled_in_public` | 1 | Identify table in advisor export |
| `auth_leaked_password_protection` | 1 | AUTH-011 / prod checklist |

---

## Auth next tasks (parallel track)

| Task | Skill fit | Note |
|------|-----------|------|
| AUTH-005 Playwright | testing + supabase auth skill | No DDL; run after F08 |
| AUTH-009 JWT → Mastra RequestContext | client-and-auth.md | Tools need `(SELECT auth.uid())`-aware RLS, not service role in src |
| AUTH-011 prod checklist | mde-supabase security checklist | Pairs with DATA-011 edge audit |

---

## Summary scores

| Task | Ready to execute? | Spec accuracy | Best-practice fit | Score |
|------|-------------------|---------------|-------------------|------:|
| **DATA-010** | ✅ Yes (first) | ⚠️ Stale “80+” count; incomplete P0 list | ⚠️ Prefer `search_path = ''` for DEFINER | **82** |
| **DATA-011** | ✅ Yes (parallel) | ⚠️ 37 → 39 fns | ✅ Read-only, skill-aligned | **88** |
| **DATA-021** | ⚠️ Patch spec first | ❌ `proposed` vs `scheduled`; wrong evidence path; indexes redundant | ✅ Edge + service role pattern | **65** |
| **DATA-028** | 🟥 After 021 | ✅ | ✅ RPC idempotency | **72** |
| **DATA-007** | 🟥 After MAP-005 | ✅ blocker correct | ✅ | **70** (spec) |
| **DATA-008** | 🟥 After 007 | ✅ | ✅ field mask | **75** (spec) |

**Pack next action:** Ship **DATA-010 + DATA-011** in parallel (security, no feature risk). Patch **DATA-021** enum + evidence path before implementation. Keep **DATA-007/008** behind **MAP-005**.

Want me to patch the DATA-010/011/021 specs with these MCP findings (counts, P0 function list, `scheduled` enum, edge fn count)?

## DATA-006 Layer A — finalized

### SQL evidence
**Path:** [`tasks/data/evidence/data-006-venue-golden-queries.md`](tasks/data/evidence/data-006-venue-golden-queries.md)  
**Pack:** [`tasks/data/evidence/data-006-venue-golden-queries.sql`](tasks/data/evidence/data-006-venue-golden-queries.sql)  
**Method:** Supabase MCP `execute_sql` — read-only SELECT, **no DDL/mutation**

### Pass/fail counts

| Section | Pass | Fail |
|---------|-----:|-----:|
| Café persona queries (7) | 7 | 0 |
| Restaurant persona queries (6) | 6 | 0 |
| Nightclub persona queries (6) | 6 | 0 |
| Contract asserts (G0, G6–G7, R7–R8, N7–N8) | 7 | 0 |
| **Total** | **26** | **0** |

### Confirmations
- ✅ 7 café → `venue_anchors` (12 golden anchor IDs resolve)
- ✅ 6 nightclub → `venue_anchors` (10 golden anchor IDs resolve)
- ✅ 6 restaurant → `public.restaurants` (9 golden IDs, all with `google_place_id`)
- ✅ R7: `missing_place_id = 0`
- ✅ Restaurant JSON/SQL use `restaurants` only — zero `venue_anchors` dependency
- ✅ No DDL or mutation run

**Note:** Live restaurant count is **43/43** with place_id (was 44 at DATA-004 audit; dedupe migration). Contract still passes.

### Updates applied
- [`data-006-golden-queries.md`](../data/archive/data-006-golden-queries.md) → `status: Done`, `layer_a: Done`, `layer_b: Open`
- [`INDEX-data.md`](./INDEX-data.md) → DATA-006 🟢 Layer A 100%; active specs in this folder
- **Linear [SAN-336](https://linear.app/sanjiovani/issue/SAN-336/imp-166-data-006-golden-eval-queries-cafe-restaurant-nightclub)** → Done

### Remaining Layer B (app track — does not block DATA-006 Layer A)
1. **MSV-012** — CopilotKit harness reads `golden-queries-venues.json`
2. **Tool eval** — `search-restaurants` returns `source: 'supabase'` (not fallback)
3. **Lucía QA** — live `/api/copilotkit` prompt regression per persona

### Score

| Scope | Score |
|-------|------:|
| **Layer A (DATA Done gate)** | **100/100** |
| **Full DATA-006 incl. Layer B** | **75/100** |