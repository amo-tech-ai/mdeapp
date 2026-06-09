---
id: EVP-012-core
legacy_id: F38
title: /api/approval-commit edge fn wrapping decide_approval() RPC (PRD §51 #18)
status: Done
priority: P0
phase: W4 — Day 2 (event publish persistence)
effort: 2h (edge fn + RPC wiring + Vitest mock + localhost smoke)
owner: claude
depends_on: [F08, EVP-008-core, EVP-011-core]
skill: [mde-supabase, supabase-edge-functions, copilotkit-integrations]
prd_ref: §51 task 18 · §17 RUNTIME-008 strict state machine
verified_against:
  - Supabase RPC `decide_approval(uuid, text, text)` (already exists; search_path pinned 2026-05-19)
  - PRD §24 ticketing architecture (similar idempotency pattern)
  - EVP-003-core (sibling Stripe webhook secret audit — same edge-fn discipline)
  - F12 chat-lead-capture v7 (existing edge-fn pattern in repo)
---

# EVP-012-core — `/api/approval-commit` edge fn

## 1. Purpose

When Roberto clicks Aprobar/Editar/Rechazar in EVP-011-core ApprovalPanel, the `respond` callback returns a decision string but does NOT persist it. EVP-012-core ships the persistence: a Supabase Edge Function at slug `approval-commit` that wraps the existing `decide_approval(approval_id uuid, decision text, actor_id text)` RPC. The EVP-011-core panel posts to it; the RPC writes to `approval_requests` + updates `events.status`. Per PRD §17 RUNTIME-008 strict state machine.

## 2. Goals

- `mdeapp/supabase/functions/approval-commit/index.ts` — Deno edge fn, `verify_jwt: true` (Roberto must be logged in)
- `mdeapp/supabase/functions/approval-commit/config.toml` — `verify_jwt = true`
- EVP-011-core panel `respond` callback → also calls `fetch('/api/approval-commit', { method: 'POST', body: { approvalId, decision } })` before unblocking
- Edge fn validates input via Zod (EVP-008-core already has `EventDraftStatus` enum — reuse for `decision` validation)
- Edge fn calls `decide_approval(approval_id, decision, actor_id)` RPC
- Edge fn returns `{ status: 200, body: { events_status, approval_status } }` on success; structured 400 on validation; 401 on missing JWT; 5xx on RPC failure
- Idempotency: a second commit for the same `approval_id` returns the prior decision (`decide_approval` already idempotent per Supabase audit 04 §9)
- ≥ 3 Vitest tests (success path · invalid decision · unauthenticated 401)
- Localhost gate 9 + production smoke (curl POST against `/api/approval-commit` with mock JWT)

## 3. Features (persona value)

| Persona | What they get |
|---|---|
| **Roberto** | His Aprobar click actually writes to the database; `events.status` flips from `pending_approval` → `approved` |
| **Patricia** | `approval_requests` audit trail per decision — same RPC the legacy app used |
| **Camila / Tourist** | Once an event is `approved`, EVP-004-core eventAgent's `search-events` tool surfaces it |
| **Lucía** | EVP-006-core e2e asserts an event row went `draft → published` end-to-end |

## 4. Workflows

1. **Pre-flight (Supabase MCP):**
   ```sql
   SELECT proname, pronargs, prosrc FROM pg_proc WHERE proname = 'decide_approval';
   SELECT column_name, data_type FROM information_schema.columns
     WHERE table_schema='public' AND table_name IN ('approval_requests','events');
   ```
   Confirm `decide_approval(uuid, text, text)` exists with `search_path = public, pg_temp` (per audit 04 cleanup).
2. Create `mdeapp/supabase/functions/approval-commit/config.toml`:
   ```toml
   verify_jwt = true
   import_map = ""
   ```
3. Create `mdeapp/supabase/functions/approval-commit/index.ts`:
   ```ts
   import { serve } from "https://deno.land/std/http/server.ts";
   import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
   import { z } from "https://esm.sh/zod@3";

   const Body = z.object({
     approvalId: z.string().uuid(),
     decision: z.enum(["approved", "edit", "rejected"]),
   });

   serve(async (req) => {
     if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
     const auth = req.headers.get("Authorization") ?? "";
     if (!auth.startsWith("Bearer ")) return new Response("Unauthorized", { status: 401 });

     let parsed;
     try { parsed = Body.parse(await req.json()); }
     catch (e) { return Response.json({ error: "invalid_request", details: String(e) }, { status: 400 }); }

     const supabase = createClient(
       Deno.env.get("SUPABASE_URL")!,
       Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
       { global: { headers: { Authorization: auth } } },
     );
     // Get actor from JWT
     const { data: { user }, error: authErr } = await supabase.auth.getUser();
     if (authErr || !user) return Response.json({ error: "unauthorized" }, { status: 401 });

     const { data, error } = await supabase.rpc("decide_approval", {
       p_approval_id: parsed.approvalId,
       p_decision: parsed.decision,
       p_actor_id: user.id,
     });
     if (error) return Response.json({ error: "rpc_failed", details: error.message }, { status: 500 });

     return Response.json(data, { status: 200 });
   });
   ```
   (Adjust RPC argument names per actual signature — confirm via Supabase MCP pre-flight.)
4. Wire EVP-011-core `ApprovalPanel.onClick` → also POSTs to `/api/approval-commit` (Next.js route handler proxies to Supabase edge fn; OR call edge fn URL directly — pick based on Vercel ↔ Supabase wire).
5. Vitest at `mdeapp/supabase/functions/approval-commit/__tests__/index.test.ts`:
   - T-A: missing Bearer → 401
   - T-B: invalid decision `"maybe"` → 400 with structured error
   - T-C: valid input → 200 + body has `events_status` (mock RPC)
6. Deploy via Supabase MCP `deploy_edge_function`.
7. Gate 9 localhost: `curl -X POST :3001/api/approval-commit -H 'Content-Type: application/json' -d '{}'` → 400 (alive, parsing).
8. Production smoke: curl against `https://<project>.supabase.co/functions/v1/approval-commit` with a real test JWT → 200 + decision visible in `approval_requests`.
9. Evidence at `tasks/notes/EVP-012-core-evidence.md`.

## 5. User journeys

- **Roberto** clicks Aprobar → EVP-011-core panel calls `respond("approved")` AND `fetch('/api/approval-commit')` → edge fn writes `approval_requests` + flips `events.status='approved'` → agent confirms "¡Publicado!".
- **Patricia** queries `SELECT * FROM approval_requests WHERE actor_id = '<roberto-uuid>' ORDER BY created_at DESC` → audit trail.
- **Camila** (after Roberto's event approved) types "salsa tonight" → EVP-004-core eventAgent search surfaces the new event.

## 6. Agents

None directly. Consumed by EVP-011-core panel's `respond` callback.

## 7. Integrations

| Integration | Purpose |
|---|---|
| Supabase Edge Function | Server compute |
| `decide_approval()` RPC | Existing logic (mdeai legacy used this) |
| `verify_jwt: true` | Roberto must be authenticated |
| `EventDraftStatus` (EVP-008-core) | Decision enum validation (subset: approved/edit/rejected) |
| EVP-011-core ApprovalPanel | Triggers the POST |
| Supabase MCP `deploy_edge_function` | Deploys this fn |

## 8. Summary

Ship the Supabase edge fn that persists Roberto's Aprobar/Editar/Rechazar decision via the existing `decide_approval()` RPC. Idempotent. JWT-gated. ~2h. Closes the Roberto W3-W4 hero loop: type → fill → preview → approve → DB → Camila sees it.

## 9. Definition of Done

- [ ] `mdeapp/supabase/functions/approval-commit/index.ts` exists with Zod input validation + JWT check
- [ ] `mdeapp/supabase/functions/approval-commit/config.toml` sets `verify_jwt = true`
- [ ] Edge fn deployed to Supabase (verified via MCP `get_edge_function` returning `verify_jwt: true` + version ≥ 1)
- [ ] EVP-011-core panel POSTs to `/api/approval-commit` on every decision
- [ ] ≥ 3 Vitest tests pass (mocked Supabase client)
- [ ] Idempotency verified: same `approvalId` + `decision` twice returns same decision row
- [ ] `npm run floor` exit 0
- [ ] Localhost smoke: bad-payload POST returns structured 400
- [ ] Production smoke: real test JWT + valid `approvalId` returns 200 + `approval_requests` row visible via Supabase MCP
- [ ] Evidence at `tasks/notes/EVP-012-core-evidence.md`

## 10. Tests

| # | Test | Expected |
|---|---|---|
| T1 | Edge fn file exists | `test -f mdeapp/supabase/functions/approval-commit/index.ts` |
| T2 | config.toml verify_jwt | `grep -q 'verify_jwt = true' .../config.toml` |
| T3 | Vitest ≥ 3 new | `npm test` |
| T4 | Deployed | Supabase MCP `get_edge_function approval-commit` → version ≥ 1, verify_jwt true |
| T5 | Anonymous → 401 | curl without Bearer header |
| T6 | Bad payload → 400 | curl with empty body |
| T7 | Valid → 200 + row | curl with real JWT + valid approvalId; `SELECT count(*) FROM approval_requests WHERE id = …` ≥ 1 |
| T8 | Idempotent | same POST twice → same decision row |
| T9 | Floor green | `npm run floor` |

### Negative test

| Tn1 | Submit `decision: "maybe"` | T6 fails — confirms Zod enum guards against state-machine violations (PRD §17) |

## 11. Rollback

1. Supabase MCP: re-deploy previous version of `approval-commit` OR delete the function slug.
2. `git revert` the EVP-012-core commit to remove the edge fn dir.
3. EVP-011-core panel's POST fails gracefully if the route 404s — Roberto sees an error toast (acceptable rollback state).

## Notes

- **Stripe webhook discipline (EVP-003-core):** EVP-012-core is a webhook of sorts (Roberto's decision triggers DB write). Follow the same Zod validation + idempotency pattern.
- **F12 chat-lead-capture v7** is the closest existing pattern in repo — same Deno + Supabase setup; reference its config.toml shape.
- **No service-role key in mdeapp/src/**:** the SERVICE_ROLE key lives only inside the edge fn process (Deno env) — never in src/. Hook `no-service-role-in-src.mjs` enforces.
- **EVP-006-core Playwright e2e (next):** asserts an event row goes `draft → published` end-to-end through EVP-010-core → EVP-011-core → EVP-012-core.
