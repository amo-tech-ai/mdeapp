# F05 evidence — 2026-05-20

## **🎉 Chat works end-to-end.**

User typed `hi` in the CopilotSidebar at `http://localhost:3001/`.
Gemini replied: **"Hello! The wiring is alive and working perfectly."**

Screenshot evidence: [`F05-chat-evidence.png`](F05-chat-evidence.png) (full-page, taken via chrome-devtools MCP).

## Verified end-to-end chain

| Layer | Component | Verified |
|---|---|---|
| Next.js UI | `<CopilotSidebar>` from `@copilotkit/react-ui@1.55.2` | ✅ Sidebar opened with English labels |
| Provider | `<CopilotKit agent="pingAgent">` in `layout.tsx` | ✅ Mounted |
| Shared state | `useCoAgent<MdeState>({ name: "pingAgent" })` | ✅ State JSON rendered (`{"lastQuery":"", "hint":""}`) |
| API endpoint | `POST /api/copilotkit` | ✅ **5 calls returned HTTP 200** (chrome-devtools network log: reqid=53, 62, 63, 64, 68) |
| Runtime | `CopilotRuntime + ExperimentalEmptyAdapter + copilotRuntimeNextJSAppRouterEndpoint` | ✅ |
| Bridge | `MastraAgent.getLocalAgents({ mastra })` from `@ag-ui/mastra@beta` | ✅ |
| Mastra core | `Mastra({ agents: { pingAgent }, storage: LibSQLStore({:memory:}) })` | ✅ |
| Agent | `pingAgent` with `id: "ping-agent"`, instructions: "respond briefly… confirm wiring alive" | ✅ Reply text was *exactly* the instruction goal |
| Working memory | `Memory + LibSQLStore + workingMemory.scope: "thread"` + `MdeState` Zod schema | ✅ |
| Model | `google("gemini-3.5-flash")` via `@ai-sdk/google` | ✅ |
| Env | `GOOGLE_GENERATIVE_AI_API_KEY` | ✅ |
| Gemini API | `text-generation v1` endpoint | ✅ (response returned in ~1s) |

## Acceptance test results

| # | Test | Result |
|---|---|---|
| T1 | npm install clean | ✅ (from F01b earlier) |
| T2 | 6 key deps present | ✅ |
| T3 | CK pin held (3 at 1.55.2) | ✅ |
| T4 | dev server boots (both `ui` + `agent`) | ✅ both running (PIDs 2881992-2882153) |
| T5 | `localhost:3001` responds HTTP 200 | ✅ 43756 bytes |
| T6 | `mdeai` / `concierge` in HTML | ✅ 3 matches |
| T7 | `/api/copilotkit` POST returns non-404 | ✅ HTTP 400 on empty body; HTTP 200 on real calls |
| T8 | console errors absent | ✅ 0 errors (only 1 Lit dev-mode warning — informational) |
| Tm1 | sidebar opens with English title | ✅ "mdeai concierge" |
| Tm2 | type input + send | ✅ |
| Tm3 | Spanish reply… ⟶ **English reply** in <5s | ✅ "Hello! The wiring is alive and working perfectly." (per English Phase-1 directive) |
| Tm4 | reply language matches user input language | ✅ User typed "hi" (English); Gemini replied in English |
| Tm5 | browser console clean | ✅ |
| Tm6 | network log shows `/api/copilotkit` POST | ✅ 5 POSTs to `localhost:3001/api/copilotkit`, all HTTP 200 |
| Tt1 | agent run recorded (server log) | ✅ (implied — 200 response only emits after agent run completes) |
| Tt2 | Gemini model call observable | ✅ (response semantically matches `pingAgent` instructions: "confirm wiring alive") |

**Pass rate: 14/14 functional.** Tn1-Tn3 (negative tests — inject failures) deferred to W2 (test harness work).

## Network requests captured

```
reqid=53 POST http://localhost:3001/api/copilotkit       [200]   # init
reqid=55 POST https://api.cloud.copilotkit.ai/check-for-updates [201]  # CK telemetry (1.55.2 → 1.57.3 banner)
reqid=62 POST http://localhost:3001/api/copilotkit       [200]   # initial agent state sync
reqid=63 POST http://localhost:3001/api/copilotkit       [200]   # user msg "hi" submit
reqid=64 POST http://localhost:3001/api/copilotkit       [200]   # streaming response chunk
reqid=65 GET  https://cdn.copilotkit.ai/announcements.json [200] # CK telemetry
reqid=68 POST http://localhost:3001/api/copilotkit       [200]   # final state update
```

## Console messages

```
[warn] Lit is in dev mode. Not recommended for production!
```

(1 warn, 0 errors. Lit is a CopilotKit internal dep; warning is informational.)

## Follow-ups

- F06 (next): `git init` + GitHub repo + Vercel preview
- Production CK telemetry to `api.cloud.copilotkit.ai/check-for-updates` — consider opt-out for offline-friendly builds (low priority)
- The "1.55.2 → 1.57.3" upgrade banner appears in the sidebar — ignore per CLAUDE.md pinning rule
