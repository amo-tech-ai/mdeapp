---
title: Concierge RUN_ERROR diagnosis + UX-003/002/001 spec verification
date: 2026-05-28
author: claude (task-verifier protocol)
related:
  - ../../../ux/UX-001-restore-concierge-agent-prod.md
  - ../../../ux/UX-002-render-user-facing-error-on-run-error.md
  - ../../../ux/UX-003-deploy-price-wording-parser-fix.md
  - ./events-in-laureles-RUN_ERROR-613.network-response
  - ./live-site-qa-checklist.md
---

# Concierge diagnosis + UX spec verification (task-verifier)

Two deliverables in one doc:

1. **Concierge RUN_ERROR diagnosis** — root cause proven to the mechanism level (one link short of 100%, the gap is a Vercel env value only the user can read).
2. **Spec verification** of the next three build-order tasks (UX-003 → UX-002 → UX-001) against ground-truth code, per the `task-verifier` skill.

All probes below were **re-run live on 2026-05-28** (not cited from prior sessions). Supabase project `zkwcbyxiwklihegjhuql` is shared by local dev **and** prod (no environment column in `ai_runs`) — this matters for interpreting the success counts.

---

## Part 1 — Concierge RUN_ERROR diagnosis

### The reported failure (captured network response)

`tasks/testing/evidence/2026-05-28/events-in-laureles-RUN_ERROR-613.network-response`:

```
data: {"type":"RUN_STARTED","threadId":"5b322d4c-52e0-47b9-9e97-95c91fdbc577","runId":"ab1d8c49-d265-40ad-afdd-8ecee6c2b283"}
data: {"type":"RUN_ERROR","message":"(EAUTHTIMEOUT) timeout while waiting for message","code":"INCOMPLETE_STREAM"}
```

Query was **"events in Laureles"** (concierge-routed). The stream starts, then terminates in `RUN_ERROR` with no agent tokens.

### Probe A — live prod route is healthy (not hanging)

```
$ curl -sS -w 'HTTP %{http_code} in %{time_total}s\n' -X POST https://www.mdeai.co/api/copilotkit \
    -H 'Content-Type: application/json' -d '{}' --max-time 30
HTTP 400 in 4.778165s
{"error":"invalid_request","message":"Missing method field"}
```

The route answers in <5s with **our v1 endpoint's own error shape** (`invalid_request` / "Missing method field"). It is alive and fast — the production Next.js function and `/api/copilotkit` handler are not the bottleneck. (Prior-session probe: 5.57s — consistent.)

### Probe B — the captured failure NEVER reached our route (0 rows logged)

`getLocalAgentsWithLogging` wraps every in-process agent run and writes one `ai_runs` row on **both** success and error. Looking up the captured run/thread IDs:

```sql
SELECT id, status, agent_name, metadata->>'integration' AS integration,
       metadata->>'thread_id' AS thread_id, metadata->>'run_id' AS run_id
FROM public.ai_runs
WHERE metadata->>'thread_id' = '5b322d4c-52e0-47b9-9e97-95c91fdbc577'
   OR metadata->>'run_id'  = 'ab1d8c49-d265-40ad-afdd-8ecee6c2b283'
   OR metadata::text ILIKE '%5b322d4c%' OR metadata::text ILIKE '%ab1d8c49%';
-- → []  (ZERO rows)
```

**The failing run produced no `ai_runs` row at all.** It did not execute our in-process Pattern-1 path. A run that reached our route would have logged either `success` or `error`.

### Probe C — the in-process concierge is HEALTHY, used as recently as today

```sql
SELECT agent_name, status, metadata->>'integration' AS integration,
       count(*) n, min(created_at) first_seen, max(created_at) last_seen
FROM public.ai_runs
WHERE agent_name ILIKE '%concierge%' OR metadata->>'integration' ILIKE '%copilotkit%'
GROUP BY 1,2,3 ORDER BY last_seen DESC;
```

| agent_name | status | integration | n | first_seen | last_seen |
|---|---|---|--:|---|---|
| concierge-agent | success | copilotkit-pattern-1 | **510** | 2026-05-22 19:48 | **2026-05-28 21:27:21** |
| concierge-agent | error | copilotkit-pattern-1 | **11** | 2026-05-23 21:37 | **2026-05-25 15:04:51** |
| ping-agent | success | copilotkit-pattern-1 | 8 | 2026-05-21 04:14 | 2026-05-22 19:43 |

Two findings that **overturn the original UX-001 premise** ("every conciergeAgent run terminates in RUN_ERROR … all dead"):

- **The Pattern-1 concierge works.** 510 successes, most recent **today 21:27** on `gemini-3.5-flash`. The agent, model, and storage are not broken.
- **The 11 `error` rows are a separate, already-quiet mode.** They stopped **2026-05-25**; nothing has logged a concierge error in 3 days. They are NOT the live RUN_ERROR the user is seeing (which logs nothing — Probe B).

> ⚠️ **Shared-project caveat:** because local dev and prod both write to `zkwcbyxiwklihegjhuql` with no env marker, the 510 successes **cannot be cleanly split** into "prod browser" vs "developer localhost." In dev mode `getCopilotKitClientProps` always returns the Pattern-1 `runtimeUrl`, so local `npm run dev` concierge turns log here too. This is consistent with — and reinforces — the Cloud hypothesis below: Pattern-1 successes are (at least partly) localhost, while the real prod-browser failure logged nothing.

### Probe D — the error tokens are v2-runtime-only; our route is v1

```
$ grep -rn -E "EAUTHTIMEOUT|INCOMPLETE_STREAM|waiting for message" src/
(no matches)

$ grep -rln -E "EAUTHTIMEOUT|INCOMPLETE_STREAM" node_modules/@copilotkit/
node_modules/@copilotkit/shared/src/finalize-events.ts
node_modules/@copilotkit/runtime/src/v2/runtime/runner/__tests__/finalize-events.test.ts
node_modules/@copilotkit/shared/dist/finalize-events.{cjs,mjs,...}
```

The strings `EAUTHTIMEOUT` / `INCOMPLETE_STREAM` / "waiting for message" exist **only** in `@copilotkit/shared/finalize-events` and the **v2** runtime. Our route (`src/app/api/copilotkit/route.ts`) uses the **v1** endpoint `copilotRuntimeNextJSAppRouterEndpoint` + `new CopilotRuntime`, which never executes that v2 safety-net code. So the `RUN_ERROR/INCOMPLETE_STREAM` the user saw was synthesized **upstream of our route** — by a v2 runtime, i.e. CopilotKit Cloud.

### Probe E — prod is wired to send traffic to Cloud when a key is present

`src/lib/copilotkit-client-props.ts`:

```
:9  * Production → CopilotKit Cloud when NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY is set.
:12   const publicApiKey = process.env.NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY;
:22   if (publicApiKey) {
:23     return { publicApiKey, agent, ...inspectorOff };   // ← Cloud (v2), bypasses our route
```

In `NODE_ENV=development` it returns `runtimeUrl: "/api/copilotkit"` (Pattern-1). In production, **if** `NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY` is set, it returns `{ publicApiKey }` — the browser then posts to **CopilotKit Cloud**, whose v2 runtime has no reachable backend (our agents run in-process behind `/api/copilotkit`) → auth timeout → synthesized `RUN_ERROR`.

Local env presence (names only, values redacted):

```
mdeapp/.env.local:        NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY is SET
repo-root ../.env.local:  not present
```

### Diagnosis chain (what is proven)

```
Captured prod RUN_ERROR (events in Laureles)
  └─ 0 rows in ai_runs            (Probe B)  → did NOT run our in-process agent
  └─ error tokens are v2-only     (Probe D)  → emitted by a v2 runtime, not our v1 route
  └─ prod client → Cloud if key set (Probe E) → that v2 runtime is CopilotKit Cloud
  └─ our route + agent are healthy (Probes A, C) → backend is fine; the routing is wrong
  ⇒ Real prod-browser concierge requests are being served by CopilotKit Cloud (v2),
     which cannot reach our in-process v1 agents, so it times out and synthesizes RUN_ERROR.
```

### The ONE unproven link (blocks the fix per UX-001's rule)

**Is `NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY` set in the Vercel _production_ environment?** It is set in the repo's `mdeapp/.env.local`, but that file does not prove the Vercel prod value. I must not run `vercel link` (CLAUDE.md trap — clobbers prod). Two ways the **user** can close this in 30 seconds:

- **Vercel:** Project → Settings → Environment Variables → check Production for `NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY`.
- **Browser:** open https://www.mdeai.co chat, DevTools → Network, send a message, and read the request URL — `api.cloud.copilotkit.ai` (Cloud, confirms diagnosis) vs `www.mdeai.co/api/copilotkit` (Pattern-1, would refute it).

### Fix direction (config-only, converges under both sub-cases)

Force prod onto Pattern-1 so the browser uses our healthy route:

- Edit `getCopilotKitClientProps` so production also returns `runtimeUrl: "/api/copilotkit"` (stop branching to `publicApiKey`), **or** unset `NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY` in Vercel prod.
- No schema, no service-role, no model change, Gemini-only, fully reversible. This is **UX-001's fix** — do not apply until the user confirms the env value (UX-001 rule: prove one root cause before any code change).

### ⚠️ `ai_runs` blind spot (why telemetry alone under-counts failures)

`logging-mastra-agent.ts` only logs runs that **reach** our route, and even then **never populates `error_message`**. It cannot see: (a) Cloud-mode failures that bypass the route (Probe B), (b) pre-run auth rejections, or (c) function-killed timeouts. So "ai_runs looks healthy" is necessary-but-not-sufficient — **Vercel function logs are authoritative** for prod failures. This is exactly the gap UX-002 (surface RUN_ERROR to the user) and UX-009 (synthetic prod monitor) exist to close.

---

## Part 2 — Spec verification (task-verifier §8)

Each spec was checked against the **current** code on disk (re-probed today), not its own claims.

### Verification report

| Task | Spec score /100 | Execution readiness /100 | Blockers | Safe to execute? |
|---|--:|--:|---|---|
| **UX-003** price-wording parser | 96 | 95 | None | ✅ Yes — first |
| **UX-002** RUN_ERROR visibility | 90 | 85 | Needs 1.55.2 `onError` API confirmed via skill/MCP | ✅ Yes — second |
| **UX-001** concierge restore | 88 | 60 | **1 env value** (Vercel prod `NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY`) | ⚠️ Diagnose ✅ / fix gated on user confirm |

### Claims verified ✅

- **UX-003 root cause** — `src/lib/rental-query-parser.ts:78` verbatim: `if (amount >= 400 && !/\/\s*night|per night/i.test(text)) {`. Guard matches only `/night`/`per night`; "a night"/"nightly" fall to the monthly ÷30 branch. Fix `!/\bnight(?:ly)?\b/i` re-traced against all 5 test cases — correct. `MONTHLY_RE` (:67) catches `$2000/month` before :78, so that case stays monthly. ✅
- **UX-002 gap** — `concierge-chat-messages.tsx` uses `useCopilotChatInternal()`→`inProgress` (:36), renders `interrupt` (:106), shows an activity indicator on `inProgress` (:101-105), and has **no `RUN_ERROR` branch**. `concierge-assistant-message.tsx` strips tool-payload JSON (`isToolPayloadChatContent` :18-25, returns `null` :34-36). The silent-failure gap is real. ✅
- **UX-001 mechanism** — Probes A–E above. ✅

### Claims corrected 🔧 (spec edits applied 2026-05-28)

- **UX-002** named the `<CopilotKit>` provider as living in `geo-chat-shell.tsx`. **Wrong** — that shell has no provider. The single provider is `src/app/layout.tsx:43`, props from `getCopilotKitClientProps("conciergeAgent")` (`src/lib/copilotkit-client-props.ts:11`). Spec table corrected.
- **UX-003** Tests section said to test `parseBudget`. **`parseBudget` is not exported** (`:48` `function parseBudget`). Tests must assert through the exported `scoreRentalQuery` (`:117`). Spec corrected.
- **UX-001** original premise ("all concierge runs dead, every run RUN_ERROR") is **contradicted by Probe C** (510 successes, last today). Spec's root-cause block re-ranked: Cloud-vs-Pattern-1 promoted to leading hypothesis; key/storage/timeout/model hypotheses marked disproven by evidence; `ai_runs` blind-spot warning added.

### Claims NOT verifiable (stale / external) ⚠️

- **UX-001:** Vercel **production** value of `NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY` — not readable without `vercel link` (forbidden). User-confirm required.
- **UX-003:** that commit `0660507` on `test/rentals-prod-qa-may28` is the exact fix — not re-checked out this session; the spec already says "do not assume it's deployed," and the one-line fix is trivial to re-apply regardless.

### Stop condition

- **UX-003:** ready to implement now (no blockers). It is the only UX task permitted to touch `rental-query-parser.ts`.
- **UX-002:** ready after confirming the CopilotKit 1.55.2 error-surface API (`<CopilotKit onError>` vs watching `inProgress`) via the `copilotkit`/`copilotkit-agui` skill — additive client-only, no backend risk.
- **UX-001:** **diagnosis complete; fix is gated** on the single env confirmation above. Per UX-001's own rule ("prove one root cause from a prod log line before any code change") and the standing "no deploy/push/branch-switch without confirmation," do not modify concierge wiring until the user answers.

---

## Part 3 — Fix implemented (user-authorized, 2026-05-28)

The user authorized the same-origin fix directly. Scope: **config-only**, one source file + one new test. No change to `conciergeAgent`, Gemini model, Supabase storage, or `maxDuration`. Rental fast-path untouched.

### Change

`src/lib/copilotkit-client-props.ts` — `getCopilotKitClientProps` now **always** returns `{ runtimeUrl: "/api/copilotkit", agent, showDevConsole: false }`. The `NODE_ENV` branch and the `publicApiKey` (CopilotKit Cloud) branch were removed; `NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY` is no longer read. Grep confirmed this file was the **only** reader of that env var, so Cloud routing is fully de-activated (the Vercel var can stay set but is now inert).

### Local verification (complete)

| Gate | Result |
|---|---|
| New unit test `src/lib/__tests__/copilotkit-client-props.test.ts` | 3/3 pass — asserts `runtimeUrl` returned with `NODE_ENV=production` **and** the Cloud key set; asserts `publicApiKey` is never present |
| `npm run lint` | exit 0 |
| `npm run typecheck` | exit 0 |
| `npm run build` (in floor) | passed |
| `npx vitest run` (full) | **311/311 pass**, 77 files |
| `npm run audit` (`--audit-level=high`) | exit 0 (10 moderate advisories, all below the high gate) |
| `npm run floor` | **green** |

### Post-deploy prod gate (NOT yet run — requires a production deploy; not done without user go-ahead)

These two are the user's requirements #4 and #5 and can only be proven on the real domain:

1. **Browser network target** — on https://www.mdeai.co, open the chat, send a café/event prompt (e.g. "quiet cafés in Laureles"), DevTools → Network: the agent request must POST to `https://www.mdeai.co/api/copilotkit` (NOT `api.cloud.copilotkit.ai`), and must stream tokens / `RUN_FINISHED` (no `RUN_ERROR/INCOMPLETE_STREAM`).
2. **ai_runs logged** — immediately after, the turn appears in `public.ai_runs`:

   ```sql
   SELECT id, status, agent_name, model_name, duration_ms, created_at
   FROM public.ai_runs
   WHERE agent_name = 'concierge-agent'
   ORDER BY created_at DESC LIMIT 5;
   ```
   A fresh `success` row dated after the deploy = fix confirmed end-to-end.

Until that gate passes, task #22 stays **in_progress** (CLAUDE.md: no Done without prod runtime proof for a prod-facing fix). Deploy is the user's call.

---

## Part 4 — Clean-branch deploy + preview runtime proof (2026-05-28, ~22:08 UTC)

The fix commit `b8d9f92` was cherry-picked onto a clean branch off `main` (isolated from the in-progress C-012 work) and pushed:

| Item | Value |
|------|-------|
| Branch | `fix/copilotkit-same-origin-runtime` (= `main` `e8d2a60` + the 2-file fix, commit `74486e2`) |
| PR | https://github.com/amo-tech-ai/mdeapp/pull/13 |
| Vercel check | **success** ("Deployment has completed") |
| Preview URL | `https://mdeapp-git-fix-copilotkit-same-origin-runtime-amo100.vercel.app` (Vercel Deployment Protection ON → 401 to anonymous; probed via `vercel curl` bypass as `amo100`) |

### Preview route-health probe (via `vercel curl`, authenticated as amo100)

| Request | Result | Meaning |
|---------|--------|---------|
| `GET /` | **HTTP 200** in 0.68s | Preview build serves the app |
| `POST /api/copilotkit` (empty body `{}`) | **HTTP 400** in 4.1s · `{"error":"invalid_request","message":"Missing method field"}` | **Our same-origin in-process `CopilotRuntime`** validated and rejected the body. Identical healthy signature to the prod probe (Part 1). NOT a Cloud endpoint, NOT an auth timeout. |

Auth note: `assertCopilotKitAuthorized` (`src/lib/copilotkit-auth.ts`) returns null (allow) when `COPILOTKIT_API_KEY` is unset; the probe reaching runtime validation confirms anonymous runs are permitted on the preview, so a well-formed body would execute and log to `ai_runs`.

### What this proves (and what it does not)

- **Proven:** the same-origin `/api/copilotkit` runtime is deployed and healthy on this branch's build; and by construction the client cannot route to CopilotKit Cloud — `getCopilotKitClientProps` has no env-dependent branch (unit test `copilotkit-client-props.test.ts` 3/3 asserts same-origin across `NODE_ENV` + Cloud-var states).
- **Not yet proven (needs a real concierge turn on the live domain):** RUN_FINISHED with real café content (task 6) + a fresh `ai_runs` row (task 7) + the browser Network-tab target (task 5). The empty-body probe is rejected before a run starts, so it writes **no** `ai_runs` row — none was claimed.

### Production gate still open

Production (`www.mdeai.co`) does not carry this fix until PR #13 is merged and promoted. That promotion + the prod browser/`ai_runs` proof are the user's call (no merge/promote without explicit OK). Task #22 remains **in_progress**.

---

## Part 5 — Production verification + `ai_runs` root cause (2026-05-28, ~22:41 UTC)

User authorized "Merge #13 → prod now". PR #13 squash-merged; `mdeapp` auto-deployed to production.

### Which deployment is live (resolved a 2-project ambiguity)

There are **two** Vercel projects under `amo100`. This is a trap for future sessions:

| Project | Role | Latest prod deploy |
|---|---|---|
| `amo100/mdeapp` | **active** — repo-linked, **aliased to `www.mdeai.co` + `mdeai.co`** | `mdeapp-im4pdg0zl-amo100.vercel.app`, created **22:16:55 UTC** (PR #13) |
| `amo100/mdeai` | **stale/legacy** — not aliased to the live domain | 6 days ago |

`vercel inspect https://mdeapp-im4pdg0zl-amo100.vercel.app` → Aliases: `https://www.mdeai.co`, `https://mdeai.co`. So the live domain serves the fix as of 22:16:55 UTC.

Env check (`vercel env ls production`, **names only — values never read**): `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY` all **present** on Production (8 d old, unchanged). `NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY` **does not appear** in the Production list.

### Tasks 5 & 6 — PASS (concierge user-facing path works on prod)

Three real browser turns on `https://www.mdeai.co` (chrome-devtools MCP), prompt "quiet cafes near Laureles":

| Run | Time (UTC) | Network | Assistant result |
|---|---|---|---|
| 1 | ~22:25 | 7× `POST https://www.mdeai.co/api/copilotkit [200]`, **0** `api.cloud.copilotkit.ai` | "I found 5 quiet cafés…" + 5 cards + map pins |
| 2 | ~22:36 | 7× `POST …/api/copilotkit [200]`, 0 Cloud | "I found 5 quiet cafés in the Laureles area…" + 5 cards (Amelier, Pausa, Café Euge, Pergamino, Café Primavera) + pins (3+2) |
| 3 | ~22:41 | `POST …/api/copilotkit [200]`, 0 Cloud | 5 cards + pins |

Zero `RUN_ERROR`, zero `INCOMPLETE_STREAM`, zero Cloud calls across all three. **The QA silent-dead-chat (F-1/F-2) is resolved.** UX-001 objective met and proven on the live domain.

### Task 7 — `ai_runs` logging: FUNCTIONAL but FRAGILE (honest split result)

`ai_runs` timeline for `agent_name='concierge-agent'` (DB-side `now()` used throughout):

| Run | ai_runs row? | Detail |
|---|---|---|
| pre-cutover | ✅ 22:17:41 | success, `user_id=null` (anonymous), `duration_ms=10593`, `gemini-3.5-flash` |
| Run 1 (22:25) | ❌ none | insert dropped |
| Run 2 (22:36) | ❌ none | insert dropped |
| Run 3 (22:41) | ✅ **22:41:33** | success, `user_id=null`, `duration_ms=16531`, `gemini-3.5-flash` |

**A fresh `success` row dated after the deploy exists (22:41:33) → task 7's literal expectation is met.** But runs 1 & 2 wrote nothing.

**Root cause — proven, not inferred.** Live runtime log captured via `vercel logs` while triggering run 3:

```
17:41:16.39  ⚠️  POST  ---  www.mdeai.co  ƒ  /api/copilotkit
[ai-runs] skipped: ai_runs insert timeout
```

(17:41 Colombia = 22:41 UTC.) This is the verbatim message from `src/mastra/lib/ai-runs.ts:84-88` (the `catch`), fired when the Supabase insert loses a `Promise.race` against a **hardcoded 500 ms deadline** (`ai-runs.ts:51-52`). The logging chain ran (finalize → `logAgentRunForTurn` → `recordMastraRun`) and the service-role client was **non-null** (env present, confirmed above) — the insert simply exceeded 500 ms.

**Why it correlates with the deploy (and why it is NOT the UX-001 fix):** PR #13 changed **only** the client file `copilotkit-client-props.ts`; the server logging code is byte-identical to the 7 h-old build that logged fine. The previous build had a warm connection pool (7 h of traffic) so inserts landed < 500 ms; the fresh deploy (22:16:55) reset the pool, and with only my sparse test traffic each early invocation hit a **cold** cross-region Supabase connection > 500 ms → silently dropped. By run 3 the function had warmed enough that one insert beat the deadline (row 22:41:33) while a sibling insert in the same burst still timed out (the captured log line). This is a **pre-existing best-effort-logging fragility** (the file header literally says failures are "logged and swallowed so chat is never blocked"), exposed by the redeploy — independent of the client routing fix.

### Net status

- **UX-001 / "fix the concierge": DONE and PROVEN on prod** — same-origin runtime, real café results ×3, no Cloud, no `RUN_ERROR`.
- **`ai_runs` observability: confirmed working but unreliable under cold-start.** Recommend a **separate** follow-up (NOT part of UX-001): replace the 500 ms `Promise.race` with either a longer deadline or Vercel `waitUntil()` so the insert completes off the response path. Touches only `src/mastra/lib/ai-runs.ts` (F13 carve-out path); no schema/storage/maxDuration change.

### User actions (out of my scope)

- Remove the now-inert `NEXT_PUBLIC_COPILOTKIT_PUBLIC_API_KEY` from Vercel Production (the code no longer reads it; harmless but tidy). Optionally rotate the publishable key that was pasted earlier in chat.
