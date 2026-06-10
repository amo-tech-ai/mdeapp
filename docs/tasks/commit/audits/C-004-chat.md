---
commit_id: C-004
status: shipped
sha: fa8be0c
pr: https://github.com/amo-tech-ai/mdeapp/pull/4
branch: fix/c004-web-citations
updated: 2026-05-27
note: Merged PR #4; stale-citation fix e10cec9 included
---

# C-004 — web citation wiring for event results

## What C-004 is (2026-05-27)

**Not in scope for PR #4** (already on `main` via PR #1):

- Chat shell layout (`geo-chat-shell`, center panel, map panel)
- Custom `concierge-chat-input` (CopilotKit `Input` fix)
- Event results panel structure (cards only — PR #4 adds citation display block)
- `web-citation-list.tsx` (display component; PR #4 consumes it)

**C-004 / PR #4 scope:**

```text
web citation wiring for event results
```

- Fetch sidecar after agent turn (`EventWebCitationFetch` → `/api/grounding/event-web`)
- Sync citations from AG-UI tool results (`EventWebCitationSync`)
- `webCitations` on shared context
- Tool-render + `webEvents` action names
- Clear stale citations on local fast-path search

---

## Tracker

| Field | Value |
|-------|--------|
| **Commit ID** | C-004 |
| **Intended message** | `feat(chat): wire event web citations` |
| **Percent complete** | **100%** — merged to `main` |
| **Status** | **Shipped** — [#4](https://github.com/amo-tech-ai/mdeapp/pull/4) merged @ `fa8be0c` |
| **Pass/fail (scope)** | **PASS** — lint, typecheck, 266 tests, build, floor; localhost events smoke |
| **Production readiness** | **GO** — Vercel green; stale-citation fix verified |
| **Standalone** | ✅ Atomic PR; no package / storage / Stripe churn |
| **File count** | **8** (exact list below) |

---

## Files to include (PR #4 exact — 8 paths)

```
src/components/copilot/event-web-citation-fetch.tsx
src/components/copilot/event-web-citation-sync.tsx
src/components/chat/event-search-results-context.tsx
src/components/copilot/search-tool-renders.tsx
src/platform/copilot/mastra-tool-action-names.ts
src/components/chat/geo-chat-shell.tsx
src/components/chat/event-results-panel.tsx
src/hooks/use-event-search-fast-path.ts
```

**Context path (correct):** `src/components/chat/event-search-results-context.tsx` — **not** `src/contexts/…`.

---

## Files to exclude

| Path | Reason |
|------|--------|
| `package.json`, `package-lock.json` | Out of scope |
| `src/app/api/copilotkit/route.ts` | Not changed in PR #4 |
| `concierge-chat-input.tsx`, `chat-center-panel.tsx` | Shipped PR #1 |
| `src/app/api/events/**` | C-005 |
| `src/app/chat/page.tsx`, `chat-map-panel.tsx`, `use-chat-layout.ts` | Shell — PR #1, not PR #4 |
| `200/`, `.env.local` | Never stage |

**Do not exclude** `use-event-search-fast-path.ts` — PR #4 correctly calls `setWebCitations([])` on fast path so stale citations do not linger after Music chip.

---

## Tests required

```bash
cd mdeapp
npm run lint
npm run typecheck
npm test -- --run
npm run build
npm run floor
```

**Runtime smoke (localhost):**

```bash
npm run dev   # MASTRA_DEV_LIBSQL=1 in .env.local
```

1. `list events in Medellin` → clarify (instant / no full agent turn)
2. Events chip → Music → **10 cards + 10 pins**
3. **No** `POST /api/grounding/event-web` on Music fast path when SQL ≥ 3
4. Optional agent path with freshness query → citations when `ENABLE_SEARCH_GROUNDING=1`

**Pre-merge check (stale citations):**

- After fast path: panel must not show old “From the web” from a prior agent turn
- After new agent tool result with **empty** `webGrounding`: citations should clear or stay empty (verify `EventResults` / sync does not leave previous `webCitations` indefinitely)

---

## Verification results (`main` @ `fa8be0c`, 2026-05-27)

| Test | Status |
|------|--------|
| lint / typecheck / test (266) / build / floor | **PASS** |
| Clarify → Music → 10 cards + 10 pins | **PASS** |
| Fast path: no `/api/grounding/event-web` | **PASS** |
| Stale-citation regression | **PASS** (`e10cec9` — sync + EventResults clear empty) |
| Vercel preview on PR #4 | **PASS** |

---

## Risks

| Risk | Level | Note |
|------|-------|------|
| Stale citations after new agent turn with no web results | **Closed** | Fixed in `e10cec9` — sync + EventResults always call `setWebCitations(validCitations)` |
| `ENABLE_SEARCH_GROUNDING` unset locally | Low | Sidecar returns empty; UI stays clean |
| CopilotKit `Input` | **N/A** | Fixed on `main` (PR #1); not in PR #4 |
| Unsafe `git add src/components/chat/` | **Ops** | Stages unrelated chat files — use explicit 8-path list only |

---

## Blockers

| Blocker | State |
|---------|--------|
| PR #1 shell + C-003 grounding | **Met** — on `main` |
| PR #2 dev webpack, PR #3 LibSQL | **Met** — on `main` @ `2a83425` |
| Stale-citation manual check | **Met** |
| Vercel green on PR #4 | **Met** |

---

## Rollback notes

Revert PR #4 merge only → citations UI/sync removed; events fast path and shell unchanged.

---

## Dependency notes

- **Requires on `main`:** C-001–C-003 (map/tools/grounding), C-005 fast path (chip → `/api/events/search`)
- **Does not require:** New package deps
- **Required by:** MAP-002D prod citation visibility when grounding enabled on Vercel

---

## Safe staging command

```bash
cd mdeapp

git add \
  src/components/copilot/event-web-citation-fetch.tsx \
  src/components/copilot/event-web-citation-sync.tsx \
  src/components/chat/event-search-results-context.tsx \
  src/components/copilot/search-tool-renders.tsx \
  src/platform/copilot/mastra-tool-action-names.ts \
  src/components/chat/geo-chat-shell.tsx \
  src/components/chat/event-results-panel.tsx \
  src/hooks/use-event-search-fast-path.ts

git commit -m "feat(chat): wire event web citations"
```

**Never:** `git add src/components/chat/` or `git add .` for this row.

---

## Merge checklist

- [x] Stale-citation behavior verified (fast path + agent empty `webGrounding`)
- [x] Vercel preview/build green on PR #4
- [x] Merge [#4](https://github.com/amo-tech-ai/mdeapp/pull/4)
- [x] `main` — tick C-004 in [COMMIT-LEDGER.md](../COMMIT-LEDGER.md)
- [ ] Next: Andrés Stripe live paid-path proof (ops gate — not a C-### commit)
