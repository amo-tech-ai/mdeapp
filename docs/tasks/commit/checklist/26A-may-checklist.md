# 26A — CopilotKit Input crash fix + events/sheet verification

**Date:** 2026-05-27  
**Branch:** `ship/may27-maps-events`  
**URL:** `http://localhost:3001` (not 3000) · Mastra `4111`

---

## Root cause

| Item | Detail |
|------|--------|
| **Symptom** | Turbopack: `Input` is not exported from `@copilotkit/react-ui` |
| **Trace** | `concierge-chat-input.tsx` → `chat-center-panel.tsx` → `geo-chat-shell` |
| **Cascade** | Frontend compile fail → broken page → `POST /api/events/search` **500** (not a Supabase bug) |
| **ADK / Maps** | **Not involved** — pure CopilotKit v1.55.2 export mismatch |

**Fix:** Remove all `@copilotkit/react-ui` imports from `concierge-chat-input.tsx`. Use local `ConciergeChatInputProps` + `<textarea>` + inline send/stop/spinner icons (chat is multiline; shadcn `Input` is wrong control).

**Commit:** `cf5df05` — `fix(chat): remove invalid CopilotKit Input import`

---

## Repo search (task 1)

| Pattern | Result |
|---------|--------|
| `Input from "@copilotkit/react-ui"` | **None** in `mdeapp/src` |
| `InputProps from "@copilotkit/react-ui"` | **None** (only comment in fixed file) |
| Valid `@copilotkit/react-ui` | `CopilotChat`, `CopilotKitCSSProperties`, `AssistantMessage`, `UserMessage`, `MessagesProps` — **OK** |

---

## CopilotKit / Mastra integration (task 2)

| Check | Status |
|-------|--------|
| Packages `@copilotkit/*` all **1.55.2** | ✅ |
| No `react-core/v2` in `src/` | ✅ |
| Dev provider `runtimeUrl="/api/copilotkit"` | ✅ `getCopilotKitClientProps` |
| `useCoAgent({ name: "conciergeAgent" })` | ✅ matches `Mastra({ agents: { conciergeAgent } })` |
| Route: `CopilotRuntime` + `ExperimentalEmptyAdapter` + `getLocalAgentsWithLogging` | ✅ |
| Custom slots: local `ConciergeChatInput` / `ConciergeChatMessages` | ✅ |
| No service-role in `mdeapp/src/**` | ✅ |

---

## Dirty WIP separation (task 3)

| Bucket | Files | Action taken for verification |
|--------|-------|-------------------------------|
| **Input fix (this commit)** | `src/components/chat/concierge-chat-input.tsx` | Committed |
| **Committed C-005 / C-005b** | fast path, sheet, `api/events/search`, `[id]/public` | On branch |
| **C-004 WIP** | `search-tool-renders`, `copilotkit/route`, citation fetch/sync, chat shell panels | **Stashed** + untracked citations moved to `/tmp/mdeai-c004-isolate/` |
| **C-006 WIP** | `package.json`, `.env.example`, docs, scripts | **Stashed** with C-004 |

**Typecheck:** Passes on **committed + Input fix** only.  
**Typecheck with C-004 WIP restored:** Fails on `webCitations` / `event-web-citation-*` (4 errors) — **isolated blocker**, not Input.

---

## Restart + runtime (tasks 4–5)

```bash
fuser -k 3001/tcp 4111/tcp 2>/dev/null; sleep 2
cd /home/sk/mdeai/mdeapp && npm run dev
```

| Check | Result |
|-------|--------|
| `GET http://localhost:3001/` | **200** |
| Turbopack `Input is not exported` | **None** in dev log |
| Console errors (Playwright) | **0** on events + sheet flow |
| `list events in medellin` → clarify | ✅ `event-clarify` |
| `filter-chip-ev-all` → cards | ✅ `event-card` ×10 |
| `POST /api/events/search` | **200** |
| Map pins | ✅ (perf + prior audit) |
| **Buy tickets** → sheet checkout | ✅ stays on `/` |
| **Back** → detail | ✅ `venue-detail-buy-cta` visible |
| **Full event page** link | ✅ **200** |

---

## Automated checks (task 6)

| Command | Result (clean tree + Input commit) |
|---------|-------------------------------------|
| `npm run typecheck` | ✅ pass (C-004 WIP isolated) |
| `npm test -- --run` | ✅ **264** tests (68 files; C-004 tests not in tree) |
| `npm test -- --run event-search-fast-path event-clarify event-query-classifier` | ✅ **11** tests |
| `npm run build` | ✅ pass |
| `node scripts/perf-events-chat-latency.mjs` | ✅ PASS (T1 0 copilotkit, T2 1 search) |

---

## Acceptance matrix

| Criterion | Status |
|-----------|--------|
| No invalid `Input` import from `@copilotkit/react-ui` | ✅ |
| `localhost:3001` loads | ✅ |
| `/api/events/search` **200** | ✅ |
| Event cards + map pins | ✅ |
| Buy tickets → checkout sheet, no nav away | ✅ |
| Back → detail | ✅ |
| `npm test` passes | ✅ |
| `npm run build` passes | ✅ |
| `typecheck` / floor | ✅ **or** fail only on known C-004 WIP files listed above |

---

## Remaining blockers

1. **Restore C-004 stash** when ready: `git stash pop` + restore `/tmp/mdeai-c004-isolate/*.tsx` into `src/components/copilot/`.
2. **C-004 must land atomically** with `webCitations` on `event-search-results-context` + shell mounts.
3. **C-006** still stashed (`package.json`, docs) — separate commit.
4. **Production** [mdeai.co](https://www.mdeai.co/) unchanged until PR merge + deploy.

---

## Safe next actions

1. `git push` Input-fix commit on `ship/may27-maps-events` (if not already).
2. Land **C-004** next (citations + tool renders) — do not `git add .`.
3. Re-run `npm run floor` after C-004.
4. Manual smoke on **3001** after each commit.

---

## Evidence commands (repeat)

```bash
cd /home/sk/mdeai/mdeapp
fuser -k 3001/tcp 4111/tcp 2>/dev/null; sleep 2
npm run dev
# other terminal:
npm run typecheck
npm test -- --run
npm run build
node scripts/perf-events-chat-latency.mjs
```

---

## Latest commit on branch

```
cf5df05 fix(chat): remove invalid CopilotKit Input import
```
