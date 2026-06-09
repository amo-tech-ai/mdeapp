This is a substantial forensic audit — 8 unique PRs (#20, #23, #30, #31, #32, #35, #36, #37). Let me work like an auditor: first establish the landscape (state, base, size, mergeability, CI) for all of them, then go deep on the diffs. Verifying repo access and pulling metadata for all 8 in one pass.

Landscape captured — and it already surfaces serious red flags. Quick triage before I go deep:

- **#23** — 🔴 21,423 additions / 100 files, CI **UNSTABLE**. A PR that size is effectively unreviewable.
- **#20** — 🔴 base is `feat/mis-rental-event-search` (a feature branch, **not main**) and titled **[DEFERRED]** → stacked + parked.
- **#31** — Vercel bot **draft**.
- **#30, #32, #35, #36, #37** — all **merged today** within ~2 hours (a rapid merge train) — audit for landed debt.

Now pulling authoritative CI status + file lists for all 8 (this gives me the concrete failure points/blockers).

Authoritative CI picture is now clear, and it sharpens the red flags:

- **#23** — `lint·test·build` **passes** but **Supabase Preview FAILS** (the migrations don't replay on a fresh preview branch — directly tied to the migration replay-debt forensics). 100 files of `supabase/` backend.
- **#30** — merged today with **CodeRabbit "Review skipped"** and **no `lint·test·build` check visible** on the PR. A 22-file CopilotKit-stability change that skipped the bots.
- **#20** — confirmed stacked on a feature branch + `[DEFERRED]`, and it has **no floor check** either.
- **#32/#35/#36/#37** — all show `lint·test·build` pass + CodeRabbit completed (clean merge train).

Now I'll go deep on the diffs. Given 23k+ lines across 8 PRs, I'm fanning out 4 read-only forensic auditors in parallel (each with the exact mdeai hard-rules checklist, evidence-quoting required, and a hard ban on branch-switching so they can't disturb your working tree). I'll synthesize their findings into the audit report myself.

# Forensic Audit Report — 8 PRs (mdeapp)

**Auditor scope:** read-only diff/metadata review of #20, #23, #30, #31, #32, #35, #36, #37 via 4 parallel agents. No branches checked out, no refs mutated. Findings below are evidence-backed with file:line citations.

---

## Verdict matrix

|PR|Title (short)|State|Size|% correct|Verdict|
|---|---|---|---|---|---|
|**#31**|Vercel Web Analytics|OPEN (draft)|+47/−171, 3f|**100%**|✅ **Merge** — mark ready|
|**#35**|Restaurant Places photo proxy|MERGED|+214/−2, 4f|**97%**|✅ **Accept** (1 follow-up)|
|**#37**|Nightly prod synthetic smoke|MERGED|+185/−2, 4f|**96%**|🟡 **Forward-fix** — SHA-pin actions|
|**#36**|New-chat resets thread/map|MERGED|+182/−5, 8f|**93%**|🟡 **Follow-up** ticket|
|**#20**|Vec embedding cache|OPEN|+456/−0, 7f|**92%**|🅿️ **Keep parked** (stacked)|
|**#32**|SEARCH-001/002 hybrid|MERGED|+1206/−106, 17f|**88%**|🟠 **Forward-fix** — **critical**|
|**#30**|CopilotKit provider props|MERGED|+534/−83, 22f|**82%**|🟠 **Forward-fix** (latent bug)|
|**#23**|Track migrations/seeds/edge fns|OPEN|+21423/−9, 100f|**78%**|🔴 **Fix-then-merge** — blocked|

**Aggregate:** 4 already merged (#30, #32, #35, #36, #37), 3 open (#20 parked, #23 blocked, #31 ready), 0 closed. Two of the merged PRs (#30) and one open (#20) **landed/stand without a visible lint·test·build check** and with CodeRabbit "Review skipped" — that is the single biggest process red flag here.

---

## Cross-PR red flags (process-level)

1. 🔴 **Merges without CI floor + review.** #30 merged and #20 stands with CodeRabbit "Review skipped" and **no lint·test·build status visible**. #32 also carries a real bug (below) past merge. The floor exists (`/verify-floor`, 5 gates) but isn't gating these merges. This is exactly the failure class `docs/LESSONS.md` row 0 warns about.
2. 🔴 **#23 is unreviewable as one unit** — 100 files / 21,423 additions. Even though ~85% is legitimately just _git-tracking_ pre-existing legacy migrations/edge functions, the ~15 genuinely-new DDL files (venue_anchors, venue_booking_requests, search_grounding_quota_log, embedding_jobs) are buried where no human will scrutinize them. Mixing "track existing files" with "author new schema" in one PR is the anti-pattern.
3. 🟠 **Stacked-branch debt on #20.** Chain is `main ← #18 (merged) ← #19 (feat/mis-rental-event-search, OPEN) ← #20`. #20's own base is still open, so #20 cannot merge until #19 does. This is the stacked-stack pattern the clean-branch recovery lesson exists to prevent.
4. 🟠 **Supply-chain: unpinned GitHub Actions.** #37's workflow uses `actions/checkout@v4`, `setup-node@v4`, `upload-artifact@v4` by floating tag, not SHA. A compromised tag runs in a workflow that has prod-smoke context.

---

## Per-PR detail

### 🔴 #23 — Track migrations/seeds/edge fns (DATA-005) · 78% · FIX-THEN-MERGE

**Blocker (P0):** Supabase Preview is **CANCELLED by a timestamp collision** — two migrations share prefix `20260520120000_`:

- `20260520120000_place_details_cache_map018e.sql`
- `20260520120000_search_grounding_quota_log.sql`

Supabase uses the timestamp as the version key; duplicate → preview aborts. CI confirms: lint·test·build PASS but **Supabase Preview FAIL**.

**P1:** `supabase/functions/chat-lead-capture/config.toml:1` sets `verify_jwt = false` with no justification comment; `ticket-checkout/config.toml:1` has its justification in `index.ts` instead of the toml (security-reviewer rule wants it adjacent). **Clean:** RLS present on new tables, no secrets. **Action:** rename one file to `20260520120001_…`, add the `verify_jwt` justification comment, rerun preview. Then split intent: this should have been "track existing" (mechanical) **separate** from "new venue/quota DDL" (needs schema review).

### 🟠 #32 — SEARCH-001/002 hybrid search (MERGED) · 88% · CRITICAL FORWARD-FIX

**This is the most important finding in the audit.** `src/mastra/tools/search-events.ts:36-50` — `searchEventsIntelligent` has **no try/catch**. If the hybrid RPC fails (pgvector hiccup, embedding timeout), it throws hard and Camila's event search dies with an error instead of degrading. Its sibling `src/mastra/tools/search-rentals.ts:57-79` **does** catch and fall back to keyword search. This asymmetry means rentals stay up but events fall over under the same failure — already merged, so it's live debt. **Fix:** ~4-line try/catch around the RPC mirroring `search-rentals.ts:57-79` (catch → fall back to keyword/non-hybrid path). **Persona impact:** Camila asks "salsa this weekend," hybrid RPC blips, she gets a stack-trace-grade failure instead of keyword results.

### 🟠 #30 — CopilotKit provider props (MERGED) · 82% · FORWARD-FIX

All hard rules clean (CopilotKit still 1.55.2, no v1/v2 mix). **Latent P1:** `src/components/chat/concierge-coagent-context.tsx:14` — `ConciergeCoAgentProvider` is mounted **only inside `GeoChatShell`**. Any `useCoAgent` consumer outside that subtree (e.g. the future `/host/event/new` wizard) throws. Not firing today, will fire when Roberto's wizard mounts. **P2:** `map-ui-sync.tsx:29-30` `setStateRef` may re-register; merged with no CI check visible. **Fix:** hoist the provider to `layout.tsx` (or the route-group layout) so it wraps every CoAgent consumer; open follow-up tickets for the re-register and the missing-CI process gap.

### 🅿️ #20 — Vec embedding cache (OPEN) · 92% · KEEP PARKED

PR body says "Do NOT merge until MIS-M2 gate … DATA-042" — **correctly parked by design.** Gemini-only PASS (`embed-worker.ts:31` uses `GOOGLE_GENERATIVE_AI_API_KEY`; `embedding-registry.ts:2` "gemini-embedding-001"). Service-role appears only in `scripts/`, not `src/**` — compliant. **Blocker is structural:** base `feat/mis-rental-event-search` (#19) is still OPEN, so #20 is stacked behind it. **Action:** rebase #19 onto main → merge #19 → rebase #20 → then merge. Remove the `SUPABASE_SECRET_KEY` fallback before un-parking. **Do not close.**

### 🟡 #36 — New-chat resets thread/map/fast-path (SAN-321, MERGED) · 93% · FOLLOW-UP

Cross-vertical pin reset is correct: `concierge-session-context.tsx:48-50` clears all 3 pin primitives (19 reset ops total) — no stale pins bleed across a new chat. **P2:** `chat-center-panel.tsx:28-56` — `EventResultsPanel` + `CenterPanelMapResultsSlot` sit **outside** the `key={sessionKey}` remount boundary, so they don't hard-remount on new-chat like the rest does. **Action:** move the `key` up to wrap them, or document why they're intentionally excluded. Ticket, not a block.

### 🟡 #37 — Nightly prod synthetic smoke (SAN-322, MERGED) · 96% · FORWARD-FIX

Secrets clean (uses `vars.*` not `secrets.*`), prod-write-safe (read-only smoke). **P2 supply-chain:** `.github/workflows/prod-synthetic-smoke.yml:21` — `actions/checkout@v4`, `setup-node@v4`, `upload-artifact@v4` not SHA-pinned. **INFO:** the CopilotKit POST-storm check is annotation-only, not an assertion — it won't fail the run if a storm appears. **Action:** SHA-pin the three actions; consider `expect.soft`/hard-assert on the POST-storm probe.

### ✅ #35 — Restaurant Places photo proxy (SAN-440, MERGED) · 97% · ACCEPT

Cleanest of the batch. `X-Goog-FieldMask` correct (`PLACE_PHOTO_FIELD_MASK=["id","photos"]`); the photo-media blob endpoint is correctly mask-exempt. SSRF-guarded: `PHOTO_NAME_RE=/^places\/[^/]+\/photos\/[^/]+$/`, host hardcoded. API key stays server-side. **Follow-up (P3):** `console.warn` when anon keys are absent so a misconfig is visible. Accept as-is.

### ✅ #31 — Vercel Web Analytics (OPEN, draft) · 100% · MERGE

`@vercel/analytics@2.0.1` + `<Analytics/>` at `layout.tsx:49`. The −171 is **package-lock libc-field churn only**, not real deletions. Bot-authored draft. Nothing to fix. **Action:** mark ready and merge.

---

## Critical fixes (priority-ordered)

1. **#23** — rename the colliding migration `20260520120000_search_grounding_quota_log.sql` → `20260520120001_…`; rerun Supabase Preview. **(unblocks the only hard blocker)**
2. **#32** — add try/catch + keyword fallback to `search-events.ts:36-50`, mirroring `search-rentals.ts:57-79`. **(live reliability bug, already merged)**
3. **#30** — hoist `ConciergeCoAgentProvider` from `GeoChatShell` to a shared layout. **(latent crash before /host/event/new ships)**
4. **#20** — rebase/merge #19 first, then un-stack #20; drop `SUPABASE_SECRET_KEY` fallback.
5. **#37** — SHA-pin the three GitHub Actions.

---

## Best-practice recommendations

- **Make the floor a merge gate.** #30 and #32 reached `main` without a visible lint·test·build pass and with review skipped. Require `/verify-floor`'s 5 gates + one review as a branch-protection rule on `main`. This would have caught #32's missing try/catch.
- **Cap PR size / split by intent.** #23's 100 files prove the "one worktree, one PR" rule (CLAUDE.md) needs a size ceiling too. "Track existing files" and "author new DDL" are two PRs.
- **Lint migration filenames in CI.** A 30-second uniqueness check on `supabase/migrations/*` timestamps would have caught #23's collision before Preview spent cycles failing.
- **SHA-pin all GitHub Actions** repo-wide, not just #37 — floating tags are a supply-chain hole in any workflow with prod context.
- **No stacked stacks.** #20-on-#19-on-#18 is the pattern the clean-branch lesson exists to kill; branch fresh off `main` and cherry-pick the delta.

---

**Bottom line:** Only #31 and #35 are ship-clean as-is. #23 is hard-blocked (1-line fix). The one finding that should worry you most is **#32's missing try/catch — it's already in `main` and will drop Camila's event search on any hybrid-RPC failure** while rentals stay up.

Want me to implement the critical fixes? I'd start with **#32** (forward-fix branch off `main`, ~4 lines) and **#23** (rename the colliding migration) — both are mechanical and low-risk. The merged-PR fixes (#30, #32, #36, #37) each need their own fresh branch off `main` since I won't touch the fenced `hotfix/g2d-cafe-fast-path` working tree. Tell me which to take and I'll open them one PR per fix.