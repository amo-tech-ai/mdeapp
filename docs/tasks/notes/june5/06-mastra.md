The panel doesn't render prices at all — nothing to fix there. Scope is clean. Let me run the full test suite now.

3 failures — all pre-existing, unrelated to my changes (workspace folder-path artifact in worktree, and a DATABASE_URL env issue in storage.test.ts). Let me verify my new tests pass specifically.

All 12 tests pass — 4 `ai-runs` (including the new timer-cleanup test) and 8 `format-event` (including the 3 new COP/USD tests). The 3 pre-existing failures are worktree environment artifacts (skills folder path, DATABASE_URL env). Now the build check.

Build passes clean — all routes compiled, zero TypeScript errors. Let me now stage and commit.

Branch is 1 commit behind main — need to fast-forward before committing. Let me check what that commit is first, then pull.

Fast-forwarded cleanly over the D-07 shadcn commit. My edits are unaffected. Now stage and commit — excluding `package-lock.json` (npm install artifact, not a real change for this PR).

Clean 8-file diff, no lockfile noise. Let me stage and commit.

PR is open: **https://github.com/amo-tech-ai/mdeapp/pull/77**

---

Here's what landed and why.

## What's in PR #77 — 8 files, 96 insertions

| File | What changed | Why |
|---|---|---|
| `src/mastra/lib/ai-runs.ts` | Capture `timeoutId`, `clearTimeout` in `finally` | 500ms timer kept Node event loop warm on every insert under chat load |
| `src/mastra/lib/ai-runs.test.ts` | New test: `vi.useFakeTimers()` + `vi.getTimerCount() === 0` | Proves the timer is cleared — would fail without the fix |
| `src/mastra/tools/search-events.ts` | Schema `z.literal('USD')` → `z.enum(['USD','COP'])`, add `normalizeEventCurrency()`, use it in `rowToCard` | DB has 32 USD + 17 COP rows; old code silently mislabeled all COP as USD |
| `src/mastra/lib/intelligence-event-search.ts` | Add `currency` to `HybridEventRow`, structured SELECT, mapper; use `normalizeEventCurrency` | Same currency lie on the hybrid path |
| `src/lib/events/format-event.ts` | New `formatEventCardPrice(price, currency)` | Whole-unit sibling of `formatTicketPrice` (which takes cents); USD output is byte-identical to before; COP → `$80,000 COP` |
| `src/lib/events/__tests__/format-event.test.ts` | 3 new `formatEventCardPrice` cases | USD unchanged, COP suffixed, null→USD default |
| `src/components/copilot/event-card.tsx` | Add `currency?` prop, import formatter, use at price line | Concierge chat card — Camila/Tourist's primary view of event prices |
| `src/components/copilot/search-tool-renders.tsx` | `currency?` in rows type + `<EventCard currency={e.currency}>` | Threads the DB value from the API envelope to the card |

## Kept out (documented in PR body)

- **Fast-path telemetry** — no `ai_runs` logging added to the fast-path; documented as a follow-up decision.
- **Secondary `$` render sites** — `domain-results.tsx`, venue detail sheets, workflow priceLabels — documented as a follow-up once this lands.

## Test results

- 12/12 on the two touched test files. The 3 pre-existing failures (`workspaces.test.ts` + `storage.test.ts`) are worktree filesystem/env artifacts; they also fail on main.
- `npm run build` → clean, zero TS errors.

You are a senior software specialist and forensic auditor.

Create a follow-up cleanup PR for the real issues discovered after the PR #38 audit.

Context:
- PR #38 is already merged.
- The old audit was mostly wrong because it claimed changes were in `my-mastra-app`.
- Ground truth: current live repo is `mdeapp`.
- Do not edit or reference `my-mastra-app`; it does not exist as the active app.

Tasks:
1. Fix `mdeapp/src/mastra/lib/ai-runs.ts`
   - Find the `Promise.race` timeout logic.
   - Store the timeout ID.
   - Clear it in `finally`.
   - Add or update a unit test if practical.

2. Investigate event currency before changing code.
   - Run:
     select currency, count(*) from events group by currency;
   - Report the actual values.
   - Do not default to COP unless DB proof confirms that is correct.
   - If needed, update the Zod schema from `z.literal("USD")` to a safe enum/string.
   - Align `search-events`, fast-path event search, and UI rendering.

3. Check observability gap:
   - PR #38 fast-path calls `/api/events/search` directly.
   - Confirm whether these searches should log to `ai_runs`.
   - If yes, propose a minimal logging design.
   - If no, document the tradeoff.

4. Run verification:
   - npm test -- --run
   - npm run build
   - relevant event-search tests
   - any available smoke test for `/api/events/search`

Output:
- List files changed.
- Explain each fix in simple terms.
- Include risks.
- Confirm whether this is production-ready.
- Do not overengineer.


This is the big one — the audit's own #1 red flag ("changes are in `my-mastra-app`, not `mdeapp`") is the thing I have to resolve *before* any fix means anything. If PR #38 touched a dead scaffold, every proposed fix is pointed at code nobody runs. Let me establish ground truth: pull the **actual** PR #38 file list, check whether `my-mastra-app` even exists here, and load the mastra skill the user pointed me to.

Forensic bombshell. Let me read the audit's two findings against ground truth before I write the verdict.

**PR #38's actual changed files (from GitHub):**
```
package.json, package-lock.json, playwright.config.ts
src/hooks/use-event-search-fast-path.ts
src/lib/event-search-fast-path.ts
src/lib/__tests__/event-search-fast-path.test.ts
```
All in **`mdeapp`** (`src/…`). **Zero `my-mastra-app` files. Zero `ai_runs` files. Zero `search-events` tool files.** PR #38's real title is *"SEARCH-002 events live in concierge fast-path UI."* The pasted audit describes `recordMastraRun()`, `ai_runs` timeout, mock→Supabase swap, workflow await changes — **none of those files are in PR #38.** I need to confirm what PR #38 *actually* did, and separately check whether the audit's bug claims are real *anywhere* in the live tree.

The picture is now conclusive. The single `my-mastra-app` reference is line 10 of `models.ts` — a **comment** that literally says *"Legacy aliases (my-mastra-app used string IDs; mdeapp uses AI SDK)"*. So `my-mastra-app` is the dead scaffold name; `mdeapp` is live. There is no `my-mastra-app` directory at all.

Before I write the verdict, let me verify the audit's three *checkable* bug claims against the real files they'd actually live in (not PR #38) — the `ai_runs` timer, the "mock events," and the currency handling — so I can tell you which are real-but-mislabeled vs. invented.

I have everything I need. The audit's three checkable claims are now verified against the real files. Here's the forensic verdict.

---

# Forensic Audit — "PR #38 audit" verification

## Verdict: the pasted audit is auditing the **wrong code**. ~20% correct as an audit of PR #38.

PR #38 (**SAN-387 — SEARCH-002: events live in concierge fast-path UI**) changed **6 files, all in `mdeapp`**. The pasted audit describes a different body of work entirely — `ai_runs`, `recordMastraRun()`, mock→Supabase swaps, workflow awaits, and a `my-mastra-app` directory. **None of those are in PR #38's diff, and `my-mastra-app` does not exist in this repo.**

### Ground truth — what PR #38 actually touched
```
package.json · package-lock.json · playwright.config.ts
src/hooks/use-event-search-fast-path.ts      ← React hook (calls /api/events/search)
src/lib/event-search-fast-path.ts            ← pure classifier/param-builder functions
src/lib/__tests__/event-search-fast-path.test.ts  ← unit tests (PR ships tests)
```
It's a **client-side fast-path UI** PR: classify an event query, call the search API, render cards + map pins *without* a Gemini round-trip. No Mastra tool, no `ai_runs`, no currency mapping, no workflow.

---

## Claim-by-claim: real-here / real-elsewhere / stale / invented

| Audit claim | Verdict | Evidence |
|---|---|---|
| "Changes are in `my-mastra-app`, not `mdeapp`" | ❌ **Invented** | No `my-mastra-app` dir exists. Its only mention is a *comment* in `models.ts:10`: "Legacy aliases (my-mastra-app used string IDs; mdeapp uses AI SDK)". PR #38 is 100% `mdeapp`. |
| "Added `recordMastraRun()` for `ai_runs`" | ❌ **Wrong PR** | Lives in `src/mastra/lib/ai-runs.ts` — pre-existing, not in PR #38. |
| "Replaced mock event search with Supabase" | ⚠️ **Stale** | Already done in `search-events.ts` (line 4 comment documents it). No `MOCK_EVENTS` remains. Not PR #38. |
| "Updated workflows to await async search" | ❌ **Wrong PR** | No workflow file in PR #38's diff. |
| **`ai_runs` timer not cleared after `Promise.race`** | ✅ **Real bug — but in `ai-runs.ts`, not PR #38** | Verified `ai-runs.ts:51-80`: `setTimeout` 500ms deadline is never `clearTimeout`'d. |
| "Currency hardcoded USD, DB ignored" | ⚠️ **Real-elsewhere; proposed fix is UNSAFE** | True in the *tool* layer (`search-events.ts:28,190`, `intelligence-event-search.ts:106`). But PR #38 itself **passes `currency: e.currency` through** (`event-search-fast-path.ts:167`). |
| "Neighborhood comma parsing fragile" | ⚠️ **Real-elsewhere** | `split(',')` exists in `event-row-to-host-card.ts`, not PR #38. Fragility unverified. |
| "No live Supabase proof / missing tests" | ❌ **Partly wrong** | PR #38 **ships** `event-search-fast-path.test.ts`. |
| "Don't reopen #38 — it's merged" | ✅ **Correct** | GitHub: MERGED 2026-06-04. |
| "Create a follow-up cleanup task" | ✅ **Reasonable** | Sound process. |

---

## The 2 genuinely real findings (mislabeled, but worth fixing)

**1. `ai-runs.ts` timer leak — VALID, the audit's fix is correct (wrong location).**
`ai-runs.ts:51` creates a 500ms `setTimeout` for the `Promise.race` deadline and never clears it. When the insert wins (the normal case), the timer still lives ~500ms. Not an unhandled rejection (race holds a handler) and self-limiting, but untidy and keeps the event loop warm under load — real in serverless. The audit's `clearTimeout` in `finally` is the right fix. **Apply it to `src/mastra/lib/ai-runs.ts`, not `my-mastra-app/ai-runs.ts`.**

**2. Currency inconsistency — REAL, but the audit's `?? "COP"` fix would BREAK things.**
The DB `currency` column is selected (`search-events.ts:262`) then **overwritten** to `'USD'` (line 190), and the schema *forces* `currency: z.literal('USD')` (line 28). Meanwhile PR #38's fast-path passes the DB value through. So tool-layer and fast-path disagree. **But** the audit's one-liner `currency: row.currency ?? "COP"` is unsafe:
- It violates `z.literal('USD')` → Zod throws at runtime.
- Defaulting to `"COP"` *assumes* the DB stores COP. The whole codebase assumes USD ("Max ticket price in **USD**"). If events are actually priced in USD, defaulting COP **mislabels every price** — creating the exact bug the audit claims to fix.

**Correct fix order:** (1) query `select currency, count(*) from events group by currency` to learn the real values, (2) change the schema from `z.literal('USD')` to a real enum/string, (3) align tool + fast-path. **Data question first.**

---

## What the audit missed (the *real* PR #38 review)

PR #38 is a clean, tested UI PR. The legitimate observations it should have made:
- **Observability gap (the real one):** the fast-path skips the agent, so these searches **never hit `ai_runs`** — fast-path event searches are invisible in telemetry. Design call, but undocumented.
- **Double network fetch:** empty dated search re-calls `/api/events/search` with `dateWindow:"any"` (`use-event-search-fast-path.ts:121`) — a second round-trip for the fallback. Intentional for UX, minor latency.
- **Error path clears results:** on fetch failure it `setToolResult(null)` then returns `false` to fall back to the agent — a prior result list vanishes mid-session. Minor UX.

---

## Blockers / red flags
- **No code blocker.** PR #38 is merged and CI-green.
- **Process red flag:** acting on this audit as written would send someone editing **`my-mastra-app/ai-runs.ts`** (doesn't exist) and shipping `currency ?? "COP"` (breaks Zod + mislabels prices). **Do not apply the audit verbatim.**
- **My own staleness to fix:** my earlier SAN-462 edit kept "PR #38 stays open until sign-off" — GitHub says it **merged June 4**. I should correct that line.

---

## Percent correct
**~20% as an audit of PR #38.** Right on "it's merged, don't reopen" and "make a follow-up," and it *gestured* at 2 real issues (ai-runs timer ✅, currency inconsistency ⚠️) — but it misidentified the repo path, ~4 of 5 "what it did" claims, the files, and its headline currency fix is actively unsafe. As a *targeted PR review* it fails; as a *loose subsystem smell-test* it surfaced one genuine minor bug.

---

## Recommendation — a corrected follow-up task
**Title:** `fix(mastra): clear ai_runs timeout + resolve event currency source-of-truth`
**Scope (corrected):**
1. `src/mastra/lib/ai-runs.ts` — capture timer id, `clearTimeout` in `finally`. ✅ safe now.
2. **Currency:** run the DB currency check **first**; then fix schema (`z.literal('USD')` → enum) + align tool/fast-path. ❌ do *not* blindly default COP.
3. Decide + document whether fast-path searches should log to `ai_runs`.
4. Drop the `my-mastra-app` references — there is no such tree.

**Two quick things I can do now:**
- **(a)** Fix the stale "PR #38 stays open" line in **SAN-462 (OPS-001 — Stable Beta soak gate)** to "merged Jun 4."
- **(b)** Run the `events.currency` DB query so the currency fix is grounded in real data, not a guess.

Want me to do (a), (b), or both?