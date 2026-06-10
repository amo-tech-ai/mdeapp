# Concierge restore — SAN-733 evidence (2026-06-08)

## Summary

| Area | Local | Prod |
|---|---|---|
| `GET /chat` → 200 | ✅ 10/10 | ✅ 200 (post-deploy ~14:09 UTC) |
| GeoChatShell renders | ✅ | ✅ chat-canvas + CopilotChat |
| `?q=` auto-send | ✅ | ✅ (message appears in thread) |
| URL strip after send | ✅ | 🟡 agent-clarify path kept `?q=` on one probe |
| Cards + pins | ✅ | ✅ 5 café cards; map sheet "5 pins" |
| PR #134 merged | — | ✅ `b5c968c` on `main` |
| SAN-733 | — | ✅ Done (Linear) |
| Vitest | ✅ 747/747 | — |
| chat-smoke prod | — | 🟡 copilotkit empty POST → 401 (pre-existing; not 5xx) |

## Commits

| SHA | Message |
|---|---|
| `b5c968c` | squash merge PR #134 on `main` |
| `8d08d11` | guard URL strip + tighten pin wait (included in squash) |
| `e10dd50` | harden handoff send pipeline |

## curl — prod (post-deploy)

```text
GET https://www.mdeai.co/      → 200
GET https://www.mdeai.co/chat  → 200
```

Pre-deploy (14:05 UTC): `GET /chat` → 307 `location: /`

## Browser MCP — prod (2026-06-08)

| Query | Cards | Pins | Notes |
|---|---|---|---|
| `suggest cafes in medellin` (manual send) | 5 grounded/café | 5 (map sheet) | `/chat` loads shell |
| `/chat?q=apartments in laureles` | clarify (rental) | — | auto-send ✅; URL still had `?q=` after 15s |

## Local (prior session)

- Home hero → `/chat?q=...` → auto-send → cards + pins → URL `/chat`
- FAB → `/chat`
- `chat-smoke.mjs` localhost: all pass

## Files changed (mdeapp)

- `src/app/chat/page.tsx` — GeoChatShell mount
- `src/app/page.tsx` — `/?q=` → `/chat?q=` redirect
- `src/components/chat/concierge-initial-prompt.tsx` — `?q=` auto-send + send-then-strip
- `src/lib/concierge-send-user-message.ts` — shared send pipeline
- `src/components/chat/chat-center-panel.tsx` — mount prompt
- `src/components/chat/concierge-chat-input.tsx` — use shared send
- `e2e/helpers/maps-layout.ts` — `gotoConcierge()` → `/chat`
- `e2e/home-to-chat.spec.ts` — home handoff (headless hero flake)

## Follow-up (optional)

- Prod URL strip on slow agent-clarify handoff — verify in desktop Chrome ≥1360px
- `e2e/home-to-chat.spec.ts` hero controlled-input flake
- Prod `POST /api/copilotkit` empty body → 401 vs expected 400
