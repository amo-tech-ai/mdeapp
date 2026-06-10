---
title: PR #17 forensic audit — UX-002 + UX-005
date: 2026-05-30
last-verified: 2026-05-31
pr: https://github.com/amo-tech-ai/mdeapp/pull/17
branch: feat/ux-002-005-chat → main
auditor: cursor (forensic PR audit + live tests 2026-05-31)
refs: SAN-319, SAN-320
skills: copilotkit, copilotkit-integrations, task-verifier, testing (per index-skills.md)
mcp: copilotkit MCP attempted — session failed; verified via @copilotkit/react-core 1.55.2 source
---

# PR #17 — `feat(ux): UX-002 error bubble + UX-005 thinking`

## 1. Executive summary

| Item | Detail |
|------|--------|
| **What it does** | UX-002: inline error bubble + retry via `concierge-error-store` + `CopilotKitProvider onError`. UX-005 Fix 3: `concierge-pending-store` sets pending before `onSend()` so thinking indicator paints under React 19 batching. Replaces contaminated PR #16. |
| **Scope** | **Focused** — 13 files, +391/−13 lines, chat UX only |
| **Overall % correct** | **74%** — not 100%; UX-005 largely works; UX-002 wiring has a self-hosted CopilotKit gap |
| **Merge readiness** | **74%** 🟡 — fix blocker + 4 CodeRabbit items before merge |

### Real-world impact (personas)

| Persona | Before PR | After PR (as shipped) |
|---------|-----------|------------------------|
| **Tourist** asks "Quiet cafés near Laureles" | Silent dead chat on RUN_ERROR | **Maybe still silent** — `onError` may not fire without `publicApiKey` (see §4) |
| **Tourist** waits during agent run | No feedback | **Sees "Searching Medellín…"** — pending store + input indicator ✅ |
| **Camila** on LLM path after network blip | Stuck spinner forever if `onSend` throws | **Stuck spinner** — pending not cleared on throw 🔴 |

---

## 2. Scorecard (grading system)

Legend: 🟢 85–100% · 🟡 50–84% · 🔴 &lt;50%

| Area | Score | | Notes |
|------|------:|:-:|-------|
| Scope control | 95% | 🟢 | UX-only; no search/intelligence bleed |
| Code correctness | 68% | 🟡 | UX-002 `onError` gated on `publicApiKey`; pending leak; duplicate thinking |
| Test coverage | 72% | 🟡 | 16 component/store tests; **no** RUN_ERROR integration or Playwright e2e per task spec |
| Security/privacy | 95% | 🟢 | Client-only stores; no secrets; no raw error codes in UI |
| Runtime safety | 70% | 🟡 | Thinking works; error path unproven on self-hosted runtime |
| Best practices | 75% | 🟡 | Matches external-store pattern; smoke path hard-coded |
| **Merge readiness** | **74%** | 🟡 | 1 blocker + 4 CodeRabbit fixes + missing e2e |

---

## 3. Per-task report

### UX-002 — Render user-facing error on RUN_ERROR (SAN-320)

| Metric | Value |
|--------|-------|
| **% correct** | **62%** 🟡 |
| **Status** | Partial — UI + store exist; **error signal may never reach UI** on self-hosted |

**What’s correct ✅**

- `ConciergeErrorNotice` with generic headline, retry button, `data-testid="concierge-error-notice"`
- `concierge-error-store` + `useSyncExternalStore` (React Compiler–safe)
- `CopilotKitProvider` client wrapper (fixes Server Component function prop issue)
- Retry re-sends last user message via `appendMessage`
- Error hidden while `inProgress` (`chatError = !inProgress && errorVersion > 0`)
- 4 Vitest tests on static markup

**What’s wrong / missing 🔴**

| # | Issue | Severity | File |
|---|-------|----------|------|
| 1 | **`onError` requires `publicApiKey`** in CopilotKit 1.55.2 — mdeapp intentionally omits it (`copilotkit-client-props.ts:20`). `handleErrors` only calls user `onError` when `publicApiKey` is set (`node_modules/@copilotkit/react-core/.../copilotkit.tsx:392`). **`reportConciergeError` may never run.** | **Blocker** | `copilot-kit-provider.tsx` |
| 2 | No fallback: task spec step 2 (detect `inProgress` → false with zero assistant tokens) **not implemented** | Major | `concierge-chat-messages.tsx` |
| 3 | No Vitest/Playwright proving RUN_ERROR → error bubble (task spec §Tests required) | Major | tests gap |
| 4 | Error copy says "timed out" for all failures (CodeRabbit #4) | Minor | `concierge-error-notice.tsx:17` |
| 5 | `reportConciergeError()` ignores error event — OK for MVP, but no retry-count / duplicate-bubble guard (task spec failure case) | Low | `concierge-error-store.ts` |

**Real-world example:** Tourist on production (same-origin `/api/copilotkit`, no Cloud key) gets `RUN_ERROR INCOMPLETE_STREAM`. CopilotKit v2 bridge may receive the event, but `handleErrors` skips `reportConciergeError`. `errorVersion` stays 0 → **no bubble, same silence UX-002 was meant to fix.**

**Corrections for UX-002**

1. **Blocker fix:** Add `ConciergeErrorSubscriber` in `copilot-kit-provider.tsx` using `useCopilotKit().copilotkit.subscribe({ onError: () => reportConciergeError() })` — bypasses `publicApiKey` gate (same pattern as `CopilotKitErrorBridge`, but calls store directly).
2. **Fallback:** In `concierge-chat-messages.tsx`, on `inProgress` false → if last message is user and no new assistant content this turn → `reportConciergeError()`.
3. **Test:** Vitest with mocked store + Playwright intercept `POST /api/copilotkit` → canned `RUN_ERROR` SSE (per task spec).
4. **Copy:** Generic subtext — "Please try again." (CodeRabbit).

---

### UX-005 — Thinking indicator (SAN-319)

| Metric | Value |
|--------|-------|
| **% correct** | **86%** 🟡 |
| **Status** | Mostly done — browser smoke passes; 3 polish issues open |

**What’s correct ✅**

- `ConciergeThinkingIndicator`: `role="status"`, `data-testid="concierge-thinking"`, "Searching Medellín…"
- `concierge-pending-store` + set before `onSend()` beats React 19 batching
- Renders in `ConciergeChatInput` when `inProgress || pendingVersion > 0`
- Clears pending when `inProgress` becomes false (`useEffect` line 92–96)
- Rental/event fast-path skips pending (`handleRentalMessage` / `handleEventMessage` return early)
- 4 component tests + 3 store tests

**What’s wrong / missing 🔴**

| # | Issue | Severity | File |
|---|-------|----------|------|
| 1 | `onSend` throw leaves pending set → **infinite "Searching…"** (CodeRabbit #2) | Major | `concierge-chat-input.tsx:107-108` |
| 2 | Duplicate indicator in transcript when empty (CodeRabbit #3) | Medium | `concierge-chat-messages.tsx:148` |
| 3 | Smoke screenshot hard-coded absolute path (CodeRabbit #1) | Medium | `scripts/smoke-ux005-thinking.mjs:33` |
| 4 | No Playwright e2e in CI (task spec); smoke not in `package.json` | Low | hygiene |

**Real-world example:** Camila asks "What's the weather in Medellín?" (agent path). She immediately sees bouncing dots in the input — knows the concierge is working. **Good.**

If CopilotKit throws before `inProgress` flips true (e.g. runtime 500), dots **never clear** without refresh — **bad.**

**Corrections for UX-005**

1. Wrap `await onSend(trimmed)` in try/catch → `clearConciergePendingSend()` on failure.
2. Remove line 148 thinking branch in messages (keep error branch at 149–151).
3. Repo-relative screenshot: `join(process.cwd(), '..', 'tasks/testing/evidence/ux-005-thinking-smoke.png')` + `mkdirSync` recursive.
4. Optional: `package.json` script `"smoke:ux005-thinking"`.

---

### Merge hygiene / PR process

| Metric | Value |
|--------|-------|
| **% correct** | **88%** 🟢 |
| **Status** | GitHub MERGEABLE / CLEAN; no CI workflow on branch yet |

- 2 commits, clean scope vs #16
- GitHub: `mergeable: MERGEABLE`, `mergeStateStatus: CLEAN`, CodeRabbit SUCCESS, Vercel SUCCESS
- No `.github/workflows/` on branch — floor verified locally only
- Close #16 after merge

---

## 4. Red flags & failure points

| Flag | Severity | Detail |
|------|----------|--------|
| **UX-002 silent on self-hosted** | 🔴 Blocker | CopilotKit docs: `onError` "Requires publicApiKey" (`copilotkit-props.tsx:171`). mdeapp uses same-origin runtime only. |
| **Stuck thinking spinner** | 🟠 Major | Pending set without try/catch on `onSend` |
| **Double thinking UI** | 🟡 Medium | Input + empty transcript both render indicator |
| **No RUN_ERROR e2e** | 🟡 Medium | Task spec requires Playwright; PR only has component tests |
| **Tests assert wrong copy** | 🟡 Low | `concierge-error-notice.test.tsx:19` expects "timed out" — encodes CodeRabbit issue |

---

## 5. Critical fixes (ordered)

1. **🔴 UX-002:** Wire `reportConciergeError` via `copilotkit.subscribe({ onError })` (or inProgress-zero-token fallback) — verify on localhost with aborted/failed agent run.
2. **🟠 UX-005:** try/catch + `clearConciergePendingSend()` around `onSend`.
3. **🟡 UX-005:** Remove duplicate thinking in `concierge-chat-messages.tsx:148`.
4. **🟡 Hygiene:** Repo-relative smoke path + generic error copy.
5. **🟡 Tests:** Add RUN_ERROR Vitest/Playwright per `tasks/ux/UX-002-*.md`.

---

## 6. Test proof (2026-05-31 live run)

**Branch:** `feat/ux-002-005-chat` @ `d620a9f`

| Command | Result |
|---------|--------|
| `npm run lint` | ✅ 0 warnings |
| `npm run typecheck` | ✅ clean |
| `npm test` | ✅ **329/329** (81 files) |
| `npm run build` | ✅ clean |
| Targeted UX tests | ✅ **16/16** |
| `node scripts/smoke-ux005-thinking.mjs` | ✅ `thinkingCaught: true`, `inProgressCaught: true`, exit 0 |

**Skills/MCP:** Routed per `index-skills.md` → `copilotkit`, `task-verifier`, `testing`. CopilotKit MCP `search-docs` failed (session reinit); verified `onError` + `publicApiKey` gate from `@copilotkit/react-core@1.55.2` source.

**Not verified this session:** RUN_ERROR → error bubble in browser (blocked by finding §4).

Evidence: `tasks/testing/evidence/UX-005-thinking-2026-05-30.md`, screenshot `tasks/testing/evidence/ux-005-thinking-smoke.png`

---

## 7. Task corrections table

| Task | Correct | Wrong | Fix | % | |
|------|---------|-------|-----|--:|:-:|
| **UX-002** error bubble | Component, store, provider, retry UX | `onError` no-op without Cloud key; no fallback; no e2e | Subscribe bridge + fallback detector | **62%** | 🟡 |
| **UX-005** thinking | Pending store, input render, fast-path skip, smoke pass | Pending leak; duplicate UI; hardcoded path | try/catch; dedupe; portable path | **86%** | 🟡 |
| **UX-005** browser proof | Smoke script + evidence doc | Absolute screenshot path | Repo-relative + npm script | **80%** | 🟡 |
| **Merge hygiene** | Focused PR, MERGEABLE | No CI workflow on branch | Rebase if main adds CI | **88%** | 🟢 |

**Verify 100% correct?** **No.** Overall **74%**. UX-005 is merge-adjacent after 3 quick fixes; UX-002 needs the `publicApiKey`/subscribe fix before it satisfies SAN-320 acceptance criteria.

---

## 8. Best practices & improvements

- **One thinking surface:** input only (matches UX-005 Fix 3 intent).
- **Error detection:** never rely solely on Cloud-gated `onError` — use AG-UI subscribe or turn-level heuristic (task spec step 2).
- **Evidence:** add `smoke:ux002-run-error.mjs` with intercepted SSE (deterministic, no prod dependency).
- **Close #16** after #17 merges.
- **Stack order:** merge #17 first (independent of #18–#20).

---

## 9. Final verdict

### 🟡 Merge after blocker fix + CodeRabbit items

| Priority | Action |
|----------|--------|
| P0 | Fix UX-002 error signal for self-hosted CopilotKit |
| P1 | try/catch pending clear + dedupe thinking |
| P2 | Generic copy, portable smoke path, RUN_ERROR e2e |
| P3 | Close #16; optional npm smoke scripts |

**Next steps:** Apply P0–P1 in one commit on `feat/ux-002-005-chat`, re-run floor + browser proof for **both** thinking and error bubble, then merge before #18.
