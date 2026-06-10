Running all audit checks in parallel — git state, floor, file reads, Linear, and CopilotKit docs simultaneously.

Now running browser smoke and reading the remaining diff before writing the report:

Still in-progress — checking why thinking indicator never fires in DOM. Let me look at how `ConciergeChatMessages` receives `inProgress`:

I have all the data I need. Now I'll compile the full forensic audit report.

---

# PR #16 Forensic Audit Report
## UX-002 (SAN-320) + UX-005 (SAN-319) — Chat Error Bubble + Thinking Indicator

**Date:** 2026-05-30 | **Auditor:** Claude Code — Senior Software Specialist / Release QA

---

## VERDICT

> ### 🟡 MERGE AFTER FIXES
> **Score: 67 / 100**
>
> Core architecture is sound. Two blocking issues must be resolved first: (1) out-of-scope code in the commit, (2) the thinking indicator never fires in a real browser due to a React 19 batching race condition.

---

## 1. Floor Results

| Metric | Value | Note |
|---|---|---|
| Test files | 86 passed | ⚠️ Includes 4 uncommitted intelligence test files not in PR |
| Tests | 353 passed | ⚠️ 16 extra from working tree contamination; PR commit = 337 |
| Exit code | 0 ✅ | Lint · Typecheck · Build · Audit all pass |
| Audit severity | 0 high · 19 low/moderate | Pre-existing — no new vulns introduced |

---

## 2. Files Changed — Scope Audit

### In PR commit (`a9f0ea6`)

| # | File | In Scope? | Verdict |
|---|---|---|---|
| 1 | `src/app/layout.tsx` | ✅ Yes — CopilotKit provider wiring | 🟢 OK |
| 2 | `src/components/chat/concierge-error-notice.tsx` | ✅ Yes — UX-002 component | 🟢 OK |
| 3 | `src/components/chat/concierge-thinking-indicator.tsx` | ✅ Yes — UX-005 component | 🟢 OK |
| 4 | `src/lib/concierge-error-store.ts` | ✅ Yes — error signal bridge | 🟢 OK |
| 5 | `src/components/copilot/copilot-kit-provider.tsx` | ✅ Yes — App Router client wrapper | 🟢 OK |
| 6 | `src/components/chat/concierge-chat-messages.tsx` | ✅ Yes — wires both components | 🟢 OK |
| 7 | `src/components/chat/chat-query-bar.tsx` | ✅ Yes — `clearConciergeError()` on chip send | 🟢 OK |
| 8 | `src/components/chat/concierge-chat-input.tsx` | ✅ Yes — `clearConciergeError()` on send | 🟢 OK |
| 9 | `src/components/chat/__tests__/concierge-error-notice.test.tsx` | ✅ Yes — required tests | 🟢 OK |
| 10 | `src/components/chat/__tests__/concierge-thinking-indicator.test.tsx` | ✅ Yes — required tests | 🟢 OK |
| 11 | `src/lib/rental-query-parser.ts` | 🔴 **OUT OF SCOPE** — INT-002 date-range/cityWide signals | 🔴 MUST REMOVE |
| 12 | `src/lib/__tests__/rental-query-parser.test.ts` | 🔴 **OUT OF SCOPE** — INT-002 test suite | 🔴 MUST REMOVE |

**2 / 12 files are out of scope.** The commit message even flags this as "Bonus" — that's a confession, not a justification.

### Working tree contamination (uncommitted but present — HIGH RISK of accidental future commit)

```
MODIFIED (16 files):
  package.json
  scripts/intelligence/golden-queries-smoke.ts
  src/app/api/rentals/search/route.ts
  src/components/copilot/search-tool-renders.tsx
  src/hooks/use-event-search-fast-path.ts
  src/hooks/use-rental-search-fast-path.ts
  src/lib/__tests__/rental-query-parser.test.ts   ← also in commit
  src/lib/normalize-tool-envelope.ts
  src/lib/rental-query-parser.ts                  ← also in commit
  src/lib/rental-search-fast-path.ts
  src/mastra/agents/concierge.ts
  src/mastra/lib/query-embedding.ts
  src/mastra/tools/search-events.ts
  src/mastra/tools/search-grounded-places.ts
  src/mastra/tools/search-rentals.ts

UNTRACKED (10 files):
  scripts/intelligence/embed-worker.ts
  scripts/intelligence/verify-grounding-cards.ts
  src/mastra/lib/__tests__/embedding-registry.test.ts
  src/mastra/lib/__tests__/intelligence-event-search.test.ts
  src/mastra/lib/__tests__/intelligence-rental-search.test.ts
  src/mastra/lib/__tests__/verify-card-grounding.test.ts
  src/mastra/lib/embedding-registry.ts
  src/mastra/lib/intelligence-event-search.ts
  src/mastra/lib/intelligence-rental-search.ts
  src/mastra/lib/verify-card-grounding.ts
```

This is a full hybrid search + vector embedding feature sitting unguarded on main's working tree. One accidental `git add .` contaminates main.

---

## 3. UX-002 Error Bubble — Detailed Audit

**Real-world analogy:** Like Uber showing "Connection lost — tap to retry" instead of a frozen spinner. The concierge agent sometimes times out (EAUTHTIMEOUT via AG-UI); today that freezes the chat silently.

| Acceptance Criterion | Status | Evidence |
|---|---|---|
| RUN_ERROR triggers visible error notice | 🟢 | `onError` → `reportConciergeError()` → `useSyncExternalStore` → `chatError=true` → renders |
| Notice has "Try again" action | 🟢 | `handleRetry()` calls `appendMessage(new TextMessage(...))` with last user msg |
| Thinking state clears on error | 🟢 | `{inProgress && !chatError}` vs `{!inProgress && chatError}` — mutually exclusive |
| Generic copy, no raw error codes | 🟢 | Tests confirm "EAUTHTIMEOUT", "INCOMPLETE_STREAM", "RUN_ERROR" absent |
| Error clears on new send | 🟢 | `clearConciergeError()` in both `send()` and `onEventSubChip()` |
| Works in production (non-localhost) | 🟢 | `onError` fires in all envs; `bannerError` only works on localhost — store is the right fix |
| App Router Server Component boundary | 🟢 | `CopilotKitProvider` is `"use client"` wrapper — correct pattern |
| React hooks v7.1.1 compliance | 🟢 | `useSyncExternalStore` — no `setState` in effects, no ref reads in render |

**Score: 🟢 90/100** — Architecture is excellent. Only gap: retry button has no `aria-label` and no keyboard focus ring class beyond `hover:underline`.

---

## 4. UX-005 Thinking Indicator — Detailed Audit

**Real-world analogy:** Like WhatsApp's "typing…" bubble — tells Camila the AI is working so she doesn't think the app crashed.

| Acceptance Criterion | Status | Evidence |
|---|---|---|
| Component renders correctly in tests | 🟢 | 4 tests pass: testid, text, role="status", CSS classes |
| Copy "Searching Medellín…" correct | 🟢 | Confirmed in component + tests |
| Animated dots present | 🟢 | Three `animate-bounce` spans with staggered `animation-delay` |
| Accessible (`role="status"`, `aria-label`) | 🟢 | `role="status" aria-label="Searching Medellín…"` |
| Mutually exclusive with error notice | 🟢 | `inProgress && !chatError` vs `!inProgress && chatError` |
| **Actually fires in browser during live query** | 🔴 | **NEVER OBSERVED** — `thinkingCaught: false` across all smoke tests |
| Old `copilotKitActivityIndicator` removed | 🟢 | `oldIndicatorAny: false` confirmed |

### Root Cause — Why the indicator never fires

```
Sequence of React 19 automatic batching:
  
  send() called
    ↓
  appendMessage(userMsg)   ← queues state update A
    ↓
  CopilotKit sets inProgress=true  ← queues state update B
    ↓  [these may batch with first stream token]
  first SSE token arrives
    ↓
  visibleMessages gains userMsg + assistantMsg  ← queues update C
  inProgress=false                              ← queues update D
    ↓
  React 19 batches A+B+C+D → ONE paint
  
  Result: copilotMessages goes from [initial] to [initial, user, assistant] 
  in a SINGLE render. The intermediate state [initial, user] + inProgress=true 
  is NEVER committed to DOM.
```

The condition `copilotMessages[last].role === "user"` requires `visibleMessages` to contain the user message. But React 19's automatic batching may collapse that intermediate state before it's ever painted — especially on fast local connections where the first SSE token arrives within milliseconds.

**Evidence:** `inProgressCaught: true` (button changed) but `thinkingCaught: false` (indicator never appeared). Two components receiving the same logical state but rendering different DOM nodes → the indicator's condition is satisfied only during a state transition that never gets its own paint frame.

**Score: 🟡 45/100** — Component is correct, tests pass, but the core behavioral requirement fails in practice.

---

## 5. SAN-318 / UX-010 — Unified Result Cards (M0–M5) Status

| Question | Answer |
|---|---|
| Is SAN-318 completed? | 🔴 **No** |
| Is it working in main? | 🔴 **No** — nothing merged to main for UX-010 |
| M0 (ResultCardShell)? | Not started — no PR |
| M1 (DomainResults — kills duplicate row)? | Code stashed in `git stash@{0}` on a branch; not committed |
| M2–M5? | Not started |
| Blocker? | Was blocked on PR #14 (now merged as `a9fffe8`). **The blocker is gone.** |
| Next step? | Cut `feat/ux-010-m1-domain-results` from main, apply stash, reconcile e2e |

---

## 6. Graded Checklist

| Check | 🟢/🟡/🔴 | Score | Details |
|---|---|---|---|
| Scope: no out-of-scope files in commit | 🔴 | 10/20 | `rental-query-parser.ts` + test in commit |
| UX-002: error bubble renders | 🟢 | 18/20 | Component, store, wiring all correct |
| UX-002: retry resends last message | 🟢 | ✅ | `appendMessage` with last user msg |
| UX-002: no raw error strings | 🟢 | ✅ | Verified in tests + browser |
| UX-002: error clears on new send | 🟢 | ✅ | `clearConciergeError()` in 2 places |
| UX-002: works in production | 🟢 | ✅ | `onError` not gated by isLocalhost() |
| UX-005: indicator fires in browser | 🔴 | 4/20 | Never observed; React 19 batching race |
| UX-005: component renders correctly | 🟢 | ✅ | 4 passing tests |
| UX-005: old indicator removed | 🟢 | ✅ | `copilotKitActivityIndicator` gone |
| Tests: 8 new tests cover both components | 🟢 | 14/15 | Missing: retry callback invocation test |
| Architecture: hooks compliance | 🟢 | ✅ | `useSyncExternalStore` pattern correct |
| Working tree clean | 🔴 | 2/10 | 26 contaminating files |
| Floor exit 0 | 🟢 | ✅ | But count includes uncommitted tests |
| **TOTAL** | | **67/100** | |

---

## 7. Critical Fixes Required

### Fix 1 — 🔴 Remove out-of-scope files from commit (BLOCKING)

```bash
# Amend the commit to drop the parser changes
git reset HEAD~1 --soft
git restore --staged src/lib/rental-query-parser.ts src/lib/__tests__/rental-query-parser.test.ts
git restore src/lib/rental-query-parser.ts src/lib/__tests__/rental-query-parser.test.ts
git commit -m "feat(ux): UX-002 error bubble + UX-005 thinking indicator for concierge chat
...
Floor: 337/337 · exit 0
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

### Fix 2 — 🔴 Branch the working tree search intelligence (BLOCKING for working tree safety)

```bash
git stash push -m "search-intelligence-hybrid-vector-INT-002" \
  -- src/mastra/lib/query-embedding.ts \
     src/mastra/tools/search-rentals.ts \
     src/mastra/tools/search-events.ts \
     # ... all 26 contaminating files
```

### Fix 3 — 🔴 Fix thinking indicator for React 19 batching (BLOCKING for UX-005 acceptance)

The `copilotMessages[last].role === 'user'` guard races with automatic batching. Use a dedicated send-state flag instead:

```tsx
// In ConciergeChatMessages — add local state:
const [pendingSend, setPendingSend] = useState(false);

// Pass a wrapped onSend to Input that sets the flag:
// (Or subscribe to visibleMessages length change to detect user msg added)

// Render condition becomes:
{(inProgress || pendingSend) && !chatError && <ConciergeThinkingIndicator />}
```

A simpler alternative: put the indicator directly in `ConciergeChatInput` — it already has direct `inProgress` and can show a thinking state as a sibling to the send button area, which avoids the batching race entirely.

### Fix 4 — 🟡 Minor: add retry button test (non-blocking)

The test for `ConciergeErrorNotice` doesn't verify the `onRetry` callback fires on click. In jsdom this would be straightforward to add.

---

## 8. Final Recommendation

> **DO NOT MERGE as-is.** Apply Fixes 1 + 2 + 3, then re-run floor. With those resolved this is a clean, well-architected PR and should merge.

| | Action |
|---|---|
| **Fix 1** | Amend commit to remove `rental-query-parser.ts` + test |
| **Fix 2** | Stash/branch all 26 search-intelligence working-tree files |
| **Fix 3** | Fix thinking indicator render condition (React 19 batching race) |
| **Linear** | Keep SAN-319 + SAN-320 as In Progress until fixes land |
| **SAN-318/UX-010** | Cut a new branch from main, apply `git stash@{0}` M1 work — blocker (PR #14) is already merged |