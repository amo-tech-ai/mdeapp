# MAP-002 evidence — 2026-05-20 (Done)

## Status: **Done**

Phase 1 accepts **FastAPI + Grounding Lite MCP sidecar** per [`plan/ADK/adk-roadmap.md`](../../plan/ADK/adk-roadmap.md). Full ADK `LlmAgent` package deferred to [`MAP-002A-ADK-agent-package.md`](../maps/MAP-002A-ADK-agent-package.md).

| Done gate | State |
|-----------|--------|
| `verify:grounding` → **grounding-lite** | ✅ |
| Chat `GroundingAttribution` same turn | ✅ `smoke:grounding-attribution` |
| `npm run floor` exit 0 | ✅ (playwright GHSA fixed) |
| No Gemini fallback for proof | ✅ sidecar asserts grounding-lite |

---

## Playwright audit fix

```bash
npm install -D playwright@^1.55.1   # resolved to playwright@1.60.0
npx playwright install chromium
npm audit --audit-level=high        # exit 0 (no high advisories)
```

**Before:** `playwright@1.52.0` — GHSA-7mvr-c777-76hp (high)  
**After:** `playwright@1.60.0` — high cleared; 10 **moderate** transitive (next/postcss, copilotkit/uuid) — documented, no `audit fix --force`

---

## Floor (2026-05-20 final)

```text
lint ✅  typecheck ✅  build ✅  test 82/82 ✅  audit --audit-level=high ✅
npm run floor → exit 0
```

---

## Automated proof

### `npm run verify:grounding`

```text
source: grounding-lite
pins: 5
✅ MAP-002 sidecar invoke OK
```

### `npm run smoke:grounding-attribution`

Prompt: **Quiet cafés near Laureles**

```text
grounded-card count: 5
grounding-attribution count: 1
map-pin count: 6
console errors (critical): 0
screenshot: /home/sk/mdeai/mdeapp/tmp/map-002-grounding-attribution-1779526181811.png
✅ MAP-002 smoke: grounding attribution + pins (grounding-lite)
```

### Regression suite (same pass)

- `smoke:map-pins` — 5 cards, 6 pins ✅
- `verify:console` — 0 critical ✅

---

## Architecture note (Phase 1 ADR)

| Layer | Implementation |
|-------|----------------|
| 002A | `services/adk-grounding/` FastAPI + `grounding_mcp.py` (`search_places` via Grounding Lite MCP) |
| 002B | `adk-grounding-client.ts`, `search-grounded-places.ts`, `conciergeAgent` |
| 002C | `GroundingAttribution.tsx`, `search-tool-renders` grounded mirror |

**Follow-up:** MAP-002A-ADK — optional `google-adk` `LlmAgent` / `McpToolset` scaffold; **prod:** gate `gemini_maps_grounding.py` fail-closed.

---

## Health (no duplicate services)

```text
UI: 200  :3001
{"status":"ok"}  :8000/health
```
