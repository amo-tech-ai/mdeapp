---
id: F05
title: npm install + npm run dev + verify "hi" echo from Gemini
status: Done
completed_at: 2026-05-20
priority: P0
effort: 40 min
owner: claude
depends_on: [F02, F03, F04, F01b]
skill: [copilotkit-debug, mastra, mde-task-lifecycle]
evidence: /home/sk/mdeai/tasks/notes/F05-evidence.md
screenshot: /home/sk/mdeai/tasks/notes/F05-chat-evidence.png
test_pass_rate: 14/14
gemini_response: "Hello! The wiring is alive and working perfectly."
verified_against:
  - /home/sk/mdeai/.claude/skills/copilotkit-debug/SKILL.md (diagnostic workflow if boot fails)
  - /home/sk/mdeai/CopilotKit/examples/integrations/mastra/package.json (scripts shape)
---

# F05 — Boot verification — `npm install` + `npm run dev` + "hola" echo

## 1. Purpose

First moment-of-truth. After F01–F04, the new app has the right files + env vars. F05 actually installs the ~600 npm packages, starts Next.js + Mastra concurrently, and proves end-to-end that a user message in the sidebar reaches `pingAgent`, gets routed through Gemini, and renders a reply. This is the canary that signals the bootstrap succeeded.

## 2. Goals

- `npm install` completes with zero errors (warnings tolerated)
- `node_modules/` exists with `@copilotkit/react-core`, `@ag-ui/mastra`, `@mastra/core`, `@ai-sdk/google` present
- `npm run dev` starts both `dev:ui` (Next.js) and `dev:agent` (Mastra) via `concurrently`
- `http://localhost:3000` loads the mdeai shell (Spanish sidebar visible)
- Typing "hola" into the sidebar returns a Spanish reply from Gemini within ~3 seconds
- Browser console shows zero errors (warnings OK)
- Server logs show one entry in `agent_runs`-equivalent (Mastra's in-memory `:memory:` storage logs the run)

## 3. Features (what the user gets)

- **Sofía (dev):** sees the new app live at localhost; types one Spanish message; gets a Spanish reply
- **Camila / Roberto:** nothing yet (this is local verification)

## 4. Workflows

1. `cd /home/sk/mdeai/mdeapp`
2. `npm install` (expect 2–4 min on first run)
3. Verify deps via `npm ls @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime @ag-ui/mastra @mastra/core @ai-sdk/google`
4. `npm run dev`
5. Wait for both servers (look for `ui` and `agent` colored prefixes in console)
6. Open `http://localhost:3000` in browser
7. Verify sidebar opens with Spanish labels (Hola message)
8. Type "hola" + send
9. Confirm a Spanish reply appears in 1–5 seconds
10. Check browser DevTools console — no red errors
11. Stop the dev server (`Ctrl+C`)

## 5. User journeys

- **Sofía (dev):** runs 2 commands, opens browser, types one word, sees a reply. Total ~5 min once `npm install` completes.
- **Lucía (QA):** runs the same sequence after Sofía to confirm reproducibility.
- **Camila / Roberto:** N/A (not user-facing yet).

## 6. Agents

`pingAgent` (from F02) — the only registered Mastra agent at this point.

## 7. Integrations

| Integration | Verifying |
|---|---|
| CopilotKit `<CopilotKit>` provider | renders sidebar without errors |
| `@ag-ui/mastra` `MastraAgent.getLocalAgents` | bridges agent to runtime |
| Mastra `Agent` + `Memory` + `LibSQLStore` | agent run executes |
| `@ai-sdk/google` | Gemini API key is read; model responds |
| Next.js Fluid Compute (local dev) | `/api/copilotkit` POST works |
| `concurrently` | UI + agent processes both launch |

## 8. Summary

Run `npm install` + `npm run dev` + type "hola". If Gemini responds in Spanish with no console errors, the entire foundation works end-to-end. We'll know it worked when the sidebar shows a Spanish reply.

## 9. Definition of Done

- [ ] `npm install` exit 0 (zero errors)
- [ ] `node_modules/@copilotkit/`, `node_modules/@ag-ui/`, `node_modules/@mastra/`, `node_modules/@ai-sdk/google` all populated
- [ ] `npm run dev` starts both processes (`ui` + `agent` lines visible)
- [ ] `http://localhost:3000` HTTP 200; sidebar opens automatically (`defaultOpen`)
- [ ] Sidebar labels are in Spanish ("mdeai concierge", "Hola — soy…")
- [ ] Typing "hola" → reply in Spanish within 5 s
- [ ] Browser DevTools console: no red errors (warnings OK)
- [ ] Evidence: screenshot of sidebar with the reply; copy of `npm run dev` stdout showing both server starts
- [ ] Evidence: `npm ls` output for the 6 key packages

## 10. Tests

Run from `mdeapp/`. Splits cleanly into automated (curl, npm) and manual/browser (Playwright MCP or human).

### Acceptance tests — automated

| # | Maps to DoD | Command | Expected |
|---|---|---|---|
| T1 | npm install clean | `npm install 2>&1 \| tail -3` | exit 0; warnings tolerated |
| T2 | 6 key deps present | `npm ls @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime @ag-ui/mastra @mastra/core @ai-sdk/google --depth=0` | all 6 listed with versions |
| T3 | CK pin held | `npm ls @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime --depth=0 \| grep -c '1.55.2'` | `3` |
| T4 | dev server boots | `timeout 30 npm run dev > /tmp/f05-dev.log 2>&1 &` then `grep -q "ui\|agent" /tmp/f05-dev.log` after 15s | both `[ui]` and `[agent]` lines present |
| T5 | localhost responds | `curl -sf -o /dev/null -w "%{http_code}" http://localhost:3000` | `200` |
| T6 | Spanish in HTML | `curl -s http://localhost:3000 \| grep -q "mdeai\|Hola"` | match found |
| T7 | api endpoint exists | `curl -sf -o /dev/null -X POST http://localhost:3000/api/copilotkit -H "Content-Type: application/json" -d '{}' -w "%{http_code}"` | non-404 (400/422/200 all OK) |
| T8 | console errors absent (Node side) | `! grep -iE "error\|throw" /tmp/f05-dev.log` | no errors in dev log |

### Acceptance tests — manual / Playwright MCP

| # | Maps to DoD | How | Expected |
|---|---|---|---|
| Tm1 | sidebar opens with Spanish title | `mcp__playwright-test__browser_navigate http://localhost:3000` → `browser_snapshot` | snapshot shows "mdeai concierge" text |
| Tm2 | type "hola" | `browser_type` into chat input | input filled |
| Tm3 | Spanish reply within 5s | `browser_wait_for { text: "hola\|Hola" }` against the assistant message area | passes within 5s |
| Tm4 | reply language ≈ Spanish | `browser_snapshot` post-reply | text contains ñ, ó, á, or Spanish words (hola, mdeai, sí) |
| Tm5 | browser console clean | `browser_console_messages` | no error-level messages |
| Tm6 | network log | `browser_network_requests` | one `/api/copilotkit` POST returning 200 |

### Telemetry tests

| # | Test | How | Expected |
|---|---|---|---|
| Tt1 | agent run recorded | `grep -q "Agent.run\|pingAgent" /tmp/f05-dev.log` | match found |
| Tt2 | model call to Gemini | `grep -qE "gemini-3.5-flash\|generateContent" /tmp/f05-dev.log` | match found |

### Negative tests

| # | Inject | Expected |
|---|---|---|
| Tn1 | unset `GOOGLE_GENERATIVE_AI_API_KEY` env | Tm3 times out; dev log shows "API key missing" |
| Tn2 | rename agent to `weatherAgent` in `<CopilotKit agent>` | T5 still 200 but Tm3 fails ("agent not found") |
| Tn3 | downgrade `@copilotkit/runtime` to `1.55.1` | T3 fails — confirms pin gate |

### Evidence to capture in `tasks/notes/F05-evidence.md`

- `npm ls` output for the 6 key packages
- Screenshot or `browser_take_screenshot` of the sidebar with the Spanish reply
- Full content of `/tmp/f05-dev.log` (redact any keys)
- Network request log from Tm6

## Notes / verification

- If "hola" never gets a reply, follow `copilotkit-debug` skill diagnostic workflow:
  1. Check package versions (`npm ls @copilotkit/react-core @copilotkit/runtime @ag-ui/mastra`) — versions must match `1.55.2` + `beta`
  2. Check runtime URL — `<CopilotKit runtimeUrl="/api/copilotkit">` must match `endpoint: "/api/copilotkit"` in `route.ts`
  3. Check env var — `GOOGLE_GENERATIVE_AI_API_KEY` must be set (run `env | grep GOOGLE_GEN` in the dev shell)
  4. Check browser Network tab for `/api/copilotkit` POST response
  5. Check server console for the agent run log line
- **P2-4 note:** `npm run dev` uses `concurrently` to run both `next dev --turbopack` (UI) AND `mastra dev` (Mastra dev server). If you see only one, `concurrently` failed — re-run `npm install` and verify it's in `devDependencies`.
- If `npm install` fails with a peer-dep error, the `@ag-ui/mastra@beta` typing issue from `prd/08-delivery.md` §49 risk row likely surfaced. Add `--legacy-peer-deps` or downgrade `@mastra/*` to a matching exact version.
