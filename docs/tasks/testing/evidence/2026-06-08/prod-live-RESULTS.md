# Prod live — /chat + home handoff (2026-06-08)

**Base:** https://www.mdeai.co/

| Check | Result |
|---|---|
| `GET /` | ✅ 200 |
| `GET /chat` | ✅ 200 (`chat-canvas`, `copilot-chat-ready` in HTML) |
| Playwright `prod-synthetic-smoke` | ✅ 4/4 queries + POST budget (2.7m) |
| Browser `/chat` cafés prompt | ✅ 5 cards |
| Browser home → Search | ✅ `/chat`, auto-send, query in thread |
| Console errors (browser CDP) | ✅ none captured |

## Playwright 4-query matrix

| Vertical | Prompt | Cards |
|---|---|---|
| Rentals | `1BR apartment in Laureles under 80 dollars per night` | ✅ (fast-path) |
| Events | `salsa events this weekend in Medellín` | ✅ |
| Restaurants | `suggest restaurants medellin` | 5 |
| Cafés | `good specialty coffee in Laureles` | 5 grounded |

Report: `tasks/testing/evidence/2026-06-08/prod-chrome-verify/report.json`

## Browser manual (Cursor IDE browser)

- `/chat` — GeoChatShell: nav, CopilotChat input, map region
- `suggest cafes in medellin` → 5 café cards
- Home hero `apartments in laureles` → `/chat`, message auto-sent, URL `/chat`

## Note

Chrome DevTools MCP was **not connected** (stale profile lock). Tests ran via **Playwright prod smoke** + **IDE browser CDP** instead.
