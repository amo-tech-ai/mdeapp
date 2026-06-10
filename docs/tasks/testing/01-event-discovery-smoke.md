# 01 — Event discovery smoke (10-point checklist)

**Target:** `http://localhost:3001/` (or `:3000`) · prod: `https://www.mdeai.co/`

**Tool:** Chrome DevTools MCP (`navigate_page`, `take_snapshot`, `evaluate_script`, `list_console_messages`, `list_network_requests`, `take_screenshot`)

## Setup

```bash
cd /home/sk/mdeai/mdeapp && npm run dev
# Confirm port from [ui] log — often 3001
```

## Primary prompt

```
List up to 10 events in Medellín (any date). Show event cards with title, date, venue, neighborhood, price, ticket/source link, and map pins. Use inventory only — do not invent venues or coordinates.
```

> Avoid bare "this week" in automation — DB `dateWindow=this_week` currently returns 1 row (Bad Bunny). Use **Show all** chip or `dateWindow=any` for 10-card proof.

## Improved prompt (recommended)

```
Show 10 upcoming Medellín events from inventory (any category). Render event cards + map pins. Include date, venue, neighborhood, price, and source link. If fewer than 10 match a date filter, say so and offer "Show all".
```

## Chrome DevTools send helper

React controlled textarea — `fill()` alone disables Send. Use:

```javascript
(el) => {
  const msg = 'YOUR PROMPT';
  const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
  setter.call(el, msg);
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.closest('.copilotKitInput')?.querySelector('button')?.click();
}
```

Pass textarea `uid` from `take_snapshot` as `args[0]`.

## 10-point matrix

| # | Check | Pass criteria | 2026-05-27 localhost |
|---|-------|---------------|----------------------|
| 1 | Page load | No console `error` | **PASS** (Lit/font preload warns only) |
| 2 | CopilotKit | POST `/api/copilotkit` 200 on chat boot | **PASS** (6×200) |
| 3 | Agent path | `conciergeAgent` / event workflow, not `pingAgent` | **PARTIAL** — event fast-path hits `/api/events/search` directly; co-agent state updated, no Mastra tool trace |
| 4 | Intent | Routes to events, not rentals/restaurants | **PASS** for event prompt |
| 5 | Real results | DB-backed events, not prose hallucination | **PASS** (Bad Bunny, Salsa Night, Feria 2 Ruedas, etc.) |
| 6 | Fields | title, date, venue, neighborhood, link | **PASS** on cards |
| 7 | Cards UI | Inline event cards, not markdown-only | **PASS** (`EVENTS (10)` region) |
| 8 | Map pins | Pins appear; merge on chip change | **PARTIAL** — 10 pins after Show all; stale Bad Bunny pin remained in side panel (11 entries) |
| 9 | Network | No 401/403/500 on fetch/xhr | **PASS** |
| 10 | Terminal | No Mastra/Gemini/Supabase/AG-UI errors | **PASS** |

## Chip flow (fast path)

1. Tap **Events** → sub-chips appear
2. Prompt with "this week" → **1 event** (data limit, not UI bug)
3. Tap **Show all** → **10 events** + pins + map recenter

## Evidence

- `tasks/testing/evidence/2026-05-27/event-smoke-01.png`
- `tasks/testing/evidence/2026-05-27/event-smoke-10-cards.png`

## API sanity (curl)

```bash
curl -s -X POST http://localhost:3001/api/events/search \
  -H 'Content-Type: application/json' \
  -d '{"dateWindow":"this_week","limit":10}' | jq '.results|length'
# → 1

curl -s -X POST http://localhost:3001/api/events/search \
  -H 'Content-Type: application/json' \
  -d '{"dateWindow":"any","limit":10}' | jq '.results|length'
# → 10
```
