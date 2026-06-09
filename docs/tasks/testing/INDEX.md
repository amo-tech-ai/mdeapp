# mdeai testing — runnable prompts

> **Strict mandate:** Agents **must** restart dev, test **localhost**, and test **`https://www.mdeai.co/`** — you own QA, not the user.  
> Read first: [**00-agent-testing-mandate.md**](./00-agent-testing-mandate.md)

**Proof-driven queue:** [**mdeapp/todo.md**](../../mdeapp/todo.md) · [**mdeapp/changelog.md**](../../mdeapp/changelog.md) · [**evidence/TASK-LEDGER.md**](./evidence/TASK-LEDGER.md) · [**personas/**](./personas/) · [**../dashboard/project-health.md**](../dashboard/project-health.md)

Executable browser test packs for **localhost** (`http://localhost:3001` when 3000 is occupied) and **prod** (`https://www.mdeai.co/`).

## Run locally

```bash
cd /home/sk/mdeai/mdeapp
# Always restart — do not rely on hot reload for CopilotKit tool renders / map sync
pkill -f "next dev" 2>/dev/null; pkill -f "mastra dev" 2>/dev/null; sleep 2
# ChunkLoadError on copilotkit web-inspector? Clear Turbopack cache then restart:
rm -rf .next
npm run dev
# Note actual port from [ui] line — often :3001
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/
```

**ChunkLoadError** (`_app-pages-browser_node_modules_copilotkit_web-inspector_…`): stale `.next` after kill/restart, or inspector chunk 404. Fix: `rm -rf mdeapp/.next`, restart dev, hard-refresh browser. App sets `showDevConsole={false}` so inspector is not loaded in normal dev.

**Rules:**

1. **Restart** `npm run dev` before browser/Playwright — HMR leaves stale CopilotKit mirrors.
2. **Localhost** — HTTP 200 on `/` + pack or Playwright proof.
3. **Production** — repeat on `https://www.mdeai.co/` before ship/Done claims.

Cursor rule: [`.cursor/rules/mdeai-testing.mdc`](../../.cursor/rules/mdeai-testing.mdc) · Live prod: [`.cursor/rules/mdeai-live-prod-check.mdc`](../../.cursor/rules/mdeai-live-prod-check.mdc) · Mandate: [00-agent-testing-mandate.md](./00-agent-testing-mandate.md)

## Tools

| Tool | Use for |
|------|---------|
| Chrome DevTools MCP (`user-chrome-devtools`) | Console, network, a11y snapshot, screenshots |
| Cursor Browser MCP | Interactive lock/unlock flows |
| Playwright CLI | Scripted regression (`tasks/testing/scripts/`) |

## Test packs

| File | Scope |
|------|-------|
| [01-event-discovery-smoke.md](./01-event-discovery-smoke.md) | 10-point event card + pin checklist |
| [02-rental-search-smoke.md](./02-rental-search-smoke.md) | Rental API + SCREEN-005 + map pins |
| [02-multi-intent-stress.md](./02-multi-intent-stress.md) | 10 Camila/Tourist/Roberto prompts |
| [03-cafe-detail-smoke.md](./03-cafe-detail-smoke.md) | Phase A.5 café cards → right-column detail → close restores map |
| [04-rich-card-dedup-smoke.md](./04-rich-card-dedup-smoke.md) | One listing surface per vertical |
| [05-mastra-copilot-routing-smoke.md](./05-mastra-copilot-routing-smoke.md) | Fast-path classifiers + CopilotKit |
| [06-map-pin-sync-smoke.md](./06-map-pin-sync-smoke.md) | Pin/geo API + Playwright sync |
| [07-supabase-data-smoke.md](./07-supabase-data-smoke.md) | Read-only SQL inventory checks |
| [08-response-quality-rubric.md](./08-response-quality-rubric.md) | /100 scoring for prompts |
| [09-prod-live-journey-matrix.md](./09-prod-live-journey-matrix.md) | **Prod live** — events/restaurants/cafés/rentals + J05–J20 journeys |
| [scripts/chat-smoke.mjs](./scripts/chat-smoke.mjs) | API shape + timing smoke |
| [scripts/mastra-routing-smoke.mjs](./scripts/mastra-routing-smoke.mjs) | Routing unit tests + APIs |
| [scripts/maps-smoke.mjs](./scripts/maps-smoke.mjs) | lat/lng + geo backing smoke |
| [prompts/bucket-verification-may27.md](./prompts/bucket-verification-may27.md) | Per-PR bucket test prompts (May 27 breakup) |
| [prompts/C-010d-prod-pin-clear.md](./prompts/C-010d-prod-pin-clear.md) | Prod Playwright gate for PR #12 pin clear |
| [prompts/C-012-cafe-places.md](./prompts/C-012-cafe-places.md) | Café Places detail — localhost + prod (PR #13) |
| [prompts/C-013-event-fast-path-panel.md](./prompts/C-013-event-fast-path-panel.md) | Event inline cards — SCREEN-006 (PR #15) |
| [prompts/01-rentals-prompt.md](./prompts/01-rentals-prompt.md) | Camila rental prod manual (Tests A/B) |
| [../e2e/rich-card-dedup.spec.ts](../mdeapp/e2e/rich-card-dedup.spec.ts) | One listing surface — no duplicate Map results across cafés/events/rentals |

## Rich card dedup (global)

When a vertical renders generative cards in chat, **suppress** generic "Map results" pin lists and duplicate source/venue lists. See `.cursor/rules/mdeai-rich-card-dedup.mdc` and `mdeapp/src/platform/copilot/rich-card-results.ts`.

## Evidence output

**Latest audit:** [`evidence/2026-05-27/TESTING-AUDIT-SUMMARY.md`](./evidence/2026-05-27/TESTING-AUDIT-SUMMARY.md)

Save under `tasks/testing/evidence/YYYY-MM-DD/`:

- `*.png` — screenshots
- `network.json` — failed requests
- `console.txt` — errors/warnings
- `RESULTS.md` — PASS/FAIL matrix

## Production smoke (required with localhost)

```bash
curl -s -o /dev/null -w "prod GET / -> %{http_code}\n" https://www.mdeai.co/
node /home/sk/mdeai/tasks/testing/scripts/chat-smoke.mjs --base https://www.mdeai.co
```

Re-run the same Browser MCP prompts from packs `01`–`03` on prod. Log localhost vs prod in `evidence/YYYY-MM-DD/RESULTS.md`.

## Pass criteria (global)

- No console `error` on load
- `/api/copilotkit` POST returns 200 (or 400 on empty body only)
- Intent routes to correct workflow (not `pingAgent` only)
- Cards render inline (not markdown-only)
- Map pins merge by category; no wipe on second tool
- No 401/403/500 in fetch/xhr
- Gemini does not invent `place_id` / lat-lng without tool backing
- Tool calls logged (`ai_runs` or Mastra trace)
