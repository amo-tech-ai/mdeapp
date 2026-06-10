---
title: SAN-366 forensic audit — EVT-002 Host publish production proof
audited: 2026-06-04
linear: https://linear.app/sanjiovani/issue/SAN-366/evt-002-host-publish-production-proof
spec: tasks/events/tasks/G3-core-host-publish-proof.md
auditor: forensic pass (disk + Linear + Vitest; branch ai/san-314-ven-035-playwright-screen-021022023)
---

# SAN-366 forensic audit — Host publish production proof

## Executive verdict

| Dimension | Score | Notes |
|-----------|------:|-------|
| **Task spec correctness** | **68%** | G3 spec is honest (“ops proof only”) but verify command, evidence path, and acceptance scope drift from Linear |
| **Linear issue quality** | **74%** | Excellent flow diagrams + checklist; **false dependency on shipped SAN-118**; EVT-002 numbering collision |
| **Code readiness (narrow)** | **82%** | Wizard → HITL → `/api/approval-commit` → `events` insert path exists and unit tests pass |
| **Code readiness (full north star)** | **48%** | `/host/events` missing on `main`; `organizer_id` not set on publish; no authed E2E |
| **Execution readiness today** | **42%** | Zero prod evidence; no documented host test account; Linear still **Todo** |
| **Will SAN-366 succeed?** | **Yes — descoped** | **High confidence** if acceptance = prod row + public `/events/[slug]` only |
| | **Conditional — full** | **Low–medium** until SAN-118 lands + `organizer_id` fix + evidence captured |

**Bottom line:** SAN-366 is **not a build task** — it is a **verification gate**. The publish pipeline is ~80% built. The task **will fail as currently written on Linear** (steps 6–7 require `/host/events`) unless you either ship [SAN-118](https://linear.app/sanjiovani/issue/SAN-118) first or **descope** acceptance to SQL + public detail only.

---

## Scope under audit

| Artifact | Role |
|----------|------|
| [SAN-366](https://linear.app/sanjiovani/issue/SAN-366) | Linear issue — EVT-002, `phase:launch`, High |
| `G3-core-host-publish-proof.md` | Repo spec — status Partial 90% |
| EVP-010/011/012 (archived) | Upstream code — marked Done |
| SAN-118 / EVP-014 | Claimed shipped in Linear desc + `events-2.md` — **not on disk** |

---

## What works (green)

| # | Finding | Evidence |
|---|---------|----------|
| G1 | `/host/event/new` route LIVE | `mdeapp/src/app/host/event/new/page.tsx` |
| G2 | Auth gate on `/host/*` | `mdeapp/src/lib/supabase/middleware.ts` → login redirect |
| G3 | `hostEventAgent` registered; name matches CopilotKit | `mdeapp/src/mastra/index.ts` · `host-event-copilot-bridge.tsx` `useCoAgent({ name: "hostEventAgent" })` |
| G4 | HITL `preview_and_publish` → `EventPublishApprovalPanel` | `host-event-copilot-bridge.tsx` L106–141 · `data-testid="host-event-approval-panel"` |
| G5 | `/api/approval-commit` proxies to edge with session JWT | `mdeapp/src/app/api/approval-commit/route.ts` — no service-role in `src/**` |
| G6 | Edge fn inserts `events` row `status='published'` + ticket tiers | `supabase/functions/approval-commit/index.ts` L121–159 |
| G7 | RLS policies exist | `20260517045810_evt001_events_rls_alignment.sql` — `events_public_select_published`, `events_organizer_select_own` |
| G8 | Vitest green on schema + agent | `approval-commit-schema.test.ts` + `host-event-agent.test.ts` — **6/6 pass** (2026-06-04) |
| G9 | Public catalog path viable | Published rows readable via `events_public_select_published` when `status IN ('published','live')` |

---

## Red flags & errors

### 🔴 P0 — Blockers

| ID | Issue | Impact | Fix |
|----|-------|--------|-----|
| **B1** | **`/host/events` does not exist** on `main` or current branch | Linear success criteria steps 6–7 impossible; `host-nav-rail.tsx` has Events link **disabled** | Ship [SAN-118](https://linear.app/sanjiovani/issue/SAN-118) **or** descope SAN-366 acceptance |
| **B2** | **Edge insert sets `created_by` but not `organizer_id`** | Service role bypasses RLS → row inserts; Roberto **cannot** SELECT own row via `events_organizer_select_own`; `/host/events` query `.eq("organizer_id", user.id)` returns **empty** | Add `organizer_id: userId` to insert in `approval-commit/index.ts` L124–141 |
| **B3** | **No prod evidence file** | Cannot mark Done per G3 spec or Linear checklist | Create `tasks/notes/G3-host-publish-evidence.md` (or Linear’s `EVT-002-host-publish-proof-evidence.md`) with SQL + screenshots |
| **B4** | **Stale “SAN-118 shipped” claims** | `events-2.md`, Linear SAN-366 description, `events-order.md` say Done — **disk contradicts** (`git show main:src/app/host/events/page.tsx` → not found) | Update Linear + notes; flip SAN-118 Linear status to match disk |

### 🟠 P1 — Failure points (likely prod pain)

| ID | Issue | Impact | Fix |
|----|-------|--------|-----|
| **F1** | **Post-approve UI state overwrite** | `onPublished` sets `status: "published"` then `respond("approved")` sets `status: "pending_approval"` | `host-event-copilot-bridge.tsx` L130–132 — on approve, keep `published` or merge state |
| **F2** | **No idempotency on approve** | Double-click approve → duplicate `events` rows (`approvalRequestId` ignored for dedupe) | Idempotency key on `request_approval` + insert; or disable button after first commit (partial — `decided` flag exists client-side only) |
| **F3** | **No authenticated E2E** | SCREEN-016 only tests **logged-out redirect** (2 tests); no wizard fill → HITL → assert slug | Add `e2e/host/host-publish.spec.ts` with host `storageState` fixture |
| **F4** | **G3 verify command wrong** | Spec says `npm run test:e2e -- host-event` — **no matching spec file** | Use `SCREEN-016-host-wizard` or add `host-publish` spec |
| **F5** | **Gemini prod dependency unverified** | Agent turns fail silently if `GOOGLE_GENERATIVE_AI_API_KEY` missing on Vercel | Pre-flight: Mastra trace or `/api/copilotkit` smoke on prod before manual run |
| **F6** | **`event_tickets` vs `details.ticket_tiers`** | Tiers inserted to `event_tickets` table AND duplicated in JSON `details` — verify checkout reads correct source | Document canonical tier source for Andrés path (EVP-002 deferred) |

### 🟡 P2 — Spec / process drift

| ID | Issue |
|----|-------|
| D1 | **EVT-002 collision** — SAN-366 (publish proof) vs SAN-120 (maps + venue) share EVT-002 prefix |
| D2 | Linear traceability table says SAN-366 **blocked by** SAN-115 — inverted; G3 **blocks** EVP-001 |
| D3 | G3 spec `percent: 90` with **zero** acceptance checkboxes ticked — optimistic |
| D4 | Linear labels include `stack:stripe` — publish path has **no Stripe** (correctly noted in description, label noise) |
| D5 | `ai_runs` observability in Linear checklist — not verified in this audit |

---

## Critical fixes (ordered)

1. **`organizer_id: userId`** in `supabase/functions/approval-commit/index.ts` insert — **1 line**, unblocks future `/host/events` and organizer RLS proof.
2. **Align acceptance scope** — pick one:
   - **Narrow (run now):** prod login → wizard → approve → SQL proof → `/events/[slug]` anon — **no `/host/events`**
   - **Full:** merge SAN-118 first, then run SAN-366
3. **Capture evidence** — dated markdown under `tasks/notes/` per G3 spec.
4. **Fix bridge status bug** — prevents confusing post-publish UI if Roberto stays on wizard.
5. **Update stale docs** — `events-2.md`, `events-order.md`, SAN-366 Linear description re SAN-118.

---

## Acceptance checklist vs disk (2026-06-04)

| Criterion (Linear / G3) | Status |
|-------------------------|--------|
| Authenticated host session on prod | ❌ Not proven |
| NL wizard fills `EventDraftState` | ⚠️ Code exists; prod not run |
| HITL approve → `respond(approved)` | ⚠️ Code exists; prod not run |
| SQL row `status=published` | ⚠️ Edge path exists; prod not run |
| `organizer_id = auth.uid()` | ❌ **Not written today** |
| `/host/events` Published card | ❌ **Route missing** |
| `/events/[slug]` public render | ⚠️ Route exists; not proven for wizard slug |
| No console/network errors | ❌ Not captured |
| `ai_runs` row | ❌ Not verified |
| Evidence file attached | ❌ Missing |
| Idempotency (Linear checklist) | ❌ Not implemented |
| Draft not visible to anon | ⚠️ Wizard skips draft state (direct `published`) |

---

## Tech stack map (publish path)

| Layer | Component | File / service |
|-------|-----------|----------------|
| UI | Host wizard shell | `src/app/host/event/new/` · `host-event-shell.tsx` |
| AI UI | CopilotKit provider | `src/app/host/event/new/layout.tsx` |
| Bridge | Frontend tools + HITL | `host-event-copilot-bridge.tsx` |
| HITL | Approval panel | `event-publish-approval-panel.tsx` |
| Agent | `hostEventAgent` | `src/mastra/agents/host-event.ts` |
| Model | Gemini Flash | `FLASH_MODEL` via Mastra |
| Runtime | CopilotKit → Mastra AG-UI | `/api/copilotkit` |
| API | Approval commit proxy | `/api/approval-commit/route.ts` |
| Edge | Persist + RPC | `supabase/functions/approval-commit` |
| DB | `public.events` + `event_tickets` | Supabase Postgres + RLS |
| Auth | SSR session | `@/lib/supabase/server` |

---

## Test coverage

| Suite | File | Coverage | Gap |
|-------|------|----------|-----|
| Vitest | `approval-commit-schema.test.ts` | Payload validation, slugify | No insert field mapping |
| Vitest | `host-event-agent.test.ts` | Agent registration | No HITL integration |
| Vitest | `approval-panel.test.tsx` | Generic panel | Not publish panel commit path |
| Playwright | `SCREEN-016-host-wizard.spec.ts` | Logged-out redirect ×2 | **No authed publish flow** |
| Playwright | `e2e/host/host-events-list.spec.ts` | — | **Spec referenced in EVP-014 — file missing** |
| Prod manual | G3 evidence | — | **Not executed** |

---

## Best practices (for closing SAN-366)

1. **Evidence-first Done gate** — SQL `SELECT id, slug, status, organizer_id, created_by, event_start_time FROM events WHERE slug = '…'` + timestamp + prod URL + screenshot chain (wizard → panel → public page).
2. **Fix data model before host list proof** — always set `organizer_id` on host-origin inserts; treat `created_by` as audit-only or drop from insert if redundant.
3. **Descope vs dependency** — don’t mark SAN-366 Done with criteria that depend on an unmerged SAN-118; split sub-issues G3.1–G3.3 as spec defines.
4. **Authed E2E fixture** — add host test user + `storageState` (pattern exists for landlord QA in SCREEN-013); replay publish on preview before prod.
5. **Idempotency** — use `approvalRequestId` or slug uniqueness constraint; handle `23505` gracefully.
6. **Negative test** — anon GET draft slug → 404 (wizard currently publishes directly — note as known deviation).
7. **Linear hygiene** — rename SAN-366 title to `G3 — Host publish production proof` to avoid EVT-002 collision with SAN-120.

---

## Suggested execution plan (minimal success)

```text
Day 0 (30 min code)
  └─ organizer_id fix in edge fn + deploy edge
  └─ bridge status bug fix (optional but recommended)

Day 0 (2 hr ops)
  └─ Prod login as host test account
  └─ /host/event/new → describe event → approve
  └─ Supabase MCP: verify row
  └─ /events/[slug] anon curl + screenshot
  └─ Write tasks/notes/G3-host-publish-evidence.md
  └─ Linear SAN-366 → In Review → Done

Later (full loop)
  └─ SAN-118 /host/events → re-run step 6 of Linear checklist
  └─ Authed Playwright publish spec
```

---

## Will the task succeed?

| Scenario | Probability | Condition |
|----------|-------------|-----------|
| **Narrow proof** (SQL + public page, no host list) | **85%** | Host prod account available; Gemini key on Vercel; edge deployed |
| **Full Linear checklist** (incl. `/host/events`) | **35%** | Requires SAN-118 + `organizer_id` fix + evidence |
| **Flake / agent failure on prod** | **Medium risk** | NL wizard depends on Gemini latency; have manual form fallback via frontend actions |
| **False Done without evidence** | **High risk if rushed** | Anti-fake-done gate 9 applies — no evidence file = not Done |

**Recommendation:** Run SAN-366 **this week** with **narrow acceptance**; open follow-up SAN-118 + SAN-366b for host-list card proof after `organizer_id` fix merges.

---

## Related issues

| Issue | Relationship |
|-------|--------------|
| [SAN-118](https://linear.app/sanjiovani/issue/SAN-118) EVT-014 | **Prerequisite for full** host-list proof — not shipped on disk |
| [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) EVT-001 | Blocked **by** G3 (launch ledger) |
| [SAN-116](https://linear.app/sanjiovani/issue/SAN-116) PAY-003 | Commerce chain — **not** blocking publish proof |
| [SAN-117](https://linear.app/sanjiovani/issue/SAN-117) | EventCard Done — used on public/chat surfaces |

---

## Audit trail

- Branch: `ai/san-314-ven-035-playwright-screen-021022023` @ `57adf17`
- Vitest: `approval-commit` + `host-event-agent` — 6/6 pass
- `main` missing: `src/app/host/events/page.tsx`, `e2e/host/host-events-list.spec.ts`
- Prior notes: [`events-2.md`](./events-2.md) (contains inaccurate SAN-118 shipped claim), [`events-order.md`](./events-order.md)
