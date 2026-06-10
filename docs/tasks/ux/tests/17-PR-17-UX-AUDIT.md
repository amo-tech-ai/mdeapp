---
title: PR #17 forensic audit — UX-002 + UX-005
date: 2026-05-30
last-verified: 2026-05-31
pr: https://github.com/amo-tech-ai/mdeapp/pull/17
branch: feat/ux-002-005-chat → main
auditor: cursor (forensic PR audit) + claude-sonnet-4-6 (re-verify 2026-05-31)
refs: SAN-319, SAN-320
---

# PR #17 — `feat(ux): UX-002 error bubble + UX-005 thinking`

## 1. Summary

| Item | Detail |
|------|--------|
| **What it does** | UX-002 inline error bubble + retry via `concierge-error-store` and `CopilotKitProvider onError`. UX-005 Fix 3: `concierge-pending-store` sets pending before `onSend()` so the thinking indicator paints under React 19 batching. Replaces contaminated PR #16. |
| **Scope** | **Focused** — 13 files, chat UX only. No search/intelligence bleed. |
| **Merge readiness** | **82%** ↓ (needs rebase + 3 open fixes) |

## 2. Scorecard

| Area | Score | Status | Notes |
|------|------:|:------:|-------|
| Scope control | 95% | 🟢 | UX-only; replaces #16 cleanly |
| Code correctness | 78% | 🟡 | Pending flag sticks on `onSend` throw; duplicate thinking in transcript |
| Test coverage | 90% | 🟢 | 16 targeted component/store tests; full suite 329/329 (see note below) |
| Security/privacy | 95% | 🟢 | No secrets; error store is client-only signal |
| Runtime safety | 80% | 🟡 | Stuck "Searching…" if send throws before `inProgress` |
| Best practices | 80% | 🟡 | Hardcoded smoke screenshot path; timeout-specific error copy |
| **Merge readiness** | **82%** | 🟡 | Rebase on main (3 CI commits diverge) + 3 open code fixes |

## 3. Errors found

| File | Issue | Severity | Status | Exact fix |
|------|-------|----------|--------|-----------|
| `scripts/smoke-ux005-thinking.mjs:33` | Hard-coded absolute screenshot path `/home/sk/mdeai/tasks/...` | Medium | 🔴 **OPEN** | `join(process.cwd(), '..', 'tasks/testing/evidence/...')` + `mkdirSync(..., { recursive: true })` |
| `src/components/chat/concierge-chat-input.tsx:108` | No try/catch around `await onSend(trimmed)` after `setConciergePendingSend(true)` | Medium | 🔴 **OPEN** | Wrap in try/finally; call `clearConciergePendingSend()` on failure |
| `src/components/chat/concierge-chat-messages.tsx:148` | Duplicate `ConciergeThinkingIndicator` when transcript empty | Low | 🔴 **OPEN** | Remove messages-level thinking branch; keep only in input |
| `src/components/chat/concierge-error-notice.tsx:17` | Copy says "timed out" for all RUN_ERROR types | Low | 🔴 **OPEN** | Generic: "The concierge encountered an error — please try again." |

> **Verified 2026-05-31:** All four issues confirmed still open via `git show origin/feat/ux-002-005-chat`.

## 4. Red flags

**Stuck thinking spinner.** `clearConciergePendingSend()` is called at line 94 on the _happy_ path, but if `onSend()` throws (runtime disconnect, CopilotKit auth fail) the pending flag is never cleared and Camila sees "Searching Medellín…" indefinitely.

**Duplicate thinking UI.** `concierge-chat-messages.tsx:148` renders the indicator when `localMessages.length === 0 && showThinking`. `concierge-chat-input.tsx` renders it independently. Both fire on the first message — visible duplicate on empty chat.

**Rebase required.** Main has 3 commits post branch-cut (`ci.yml`, `workspaces.test.ts` CI skip, Node 24 flag). GitHub reports `mergeable: CONFLICTING / mergeStateStatus: DIRTY`. None of the 3 commits touch UX files — rebase should be clean but must happen before merge.

## 5. Critical fixes (before merge)

1. try/finally + `clearConciergePendingSend()` on send failure (`concierge-chat-input.tsx:108`)
2. Remove duplicate thinking indicator in `concierge-chat-messages.tsx:148`
3. Rebase on `main` and re-run CI

Nice-to-have same PR: repo-relative smoke path, generic error copy (not blocking if merged with fix 1–3).

## 6. Test proof

**Branch:** `feat/ux-002-005-chat` @ HEAD `d620a9f` (2026-05-30) — re-verified 2026-05-31

| Command | Result |
|---------|--------|
| `npm run lint` | ✅ 0 warnings |
| `npm run typecheck` | ✅ clean |
| `npm test` | ✅ **329/329** (81 files) |
| `npm run build` | ✅ clean |
| Targeted: `concierge-pending-store` + `concierge-error-notice` + `concierge-thinking-indicator` | ✅ **16/16** |

> **Note on test count:** Main added `workspaces.test.ts` CI-skip (`test.skipIf`) after branch cut. Post-rebase test count will remain 329 (skip doesn't change pass count in local env).

**CI (GitHub):** Branch predates CI workflow addition. After rebase, PR will run `lint · test · build` automatically.

**Unverified:** `node scripts/smoke-ux005-thinking.mjs` (requires dev server). Prior session evidence: `tasks/testing/evidence/UX-005-thinking-2026-05-30.md` — `thinkingCaught: true`.

## 7. Task corrections

| Task | Correct | Wrong | Fix | % | Status |
|------|---------|-------|-----|--:|:------:|
| **UX-002** error bubble + retry | Store, provider `onError`, retry via `appendMessage`, tests | Error copy implies timeout only | Generic message | 90% | 🟡 |
| **UX-005** thinking indicator | Pending store + input wiring; React 19 batching fix | Duplicate indicator in messages; pending leak on throw | Dedupe + try/finally | 82% | 🟡 |
| **UX-005** browser proof | Smoke script exists; prior pass logged | Hardcoded evidence path | Repo-relative path | 80% | 🟡 |
| **Merge hygiene** | Branch scoped, no contamination | 3 CI commits on main diverge | Rebase required | 0% | 🔴 |

## 8. Best-practice recommendations

- Close PR #16 after #17 merges (same scope, contaminated history).
- Add smoke script to `package.json` as `smoke:ux005-thinking` for repeatable evidence.
- Keep thinking indicator in **one** surface (input, not transcript).
- Add `GOOGLE_GENERATIVE_AI_API_KEY` etc. to GitHub repo secrets so CI build step passes on PRs.

## 9. Final verdict

### 🟡 Merge after rebase + 3 fixes

Floor is green; scope is clean. Fix the try/finally, dedupe the indicator, rebase on main. Then merge first in the stack.

## 10. Recommended merge order

**#17 first** — independent of search stack; unblocks UX Linear SAN-319/SAN-320.
