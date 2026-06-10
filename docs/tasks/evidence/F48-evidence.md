# F48 evidence — 2026-05-23

## Commands

```bash
cd /home/sk/mdeai/mdeapp && npm run dev
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/  # 200
```

## Layout

- `CopilotSidebar` wraps `GeoChatShell` on `/`
- `ChatCanvas` — nav stub (240px) + map panel on lg+
- `MapsShell` → `APIProvider` + `MapContextProvider`
- `/chat` unchanged redirect to `/`

## Files

- `src/components/chat/chat-canvas.tsx`
- `src/components/chat/geo-chat-shell.tsx`
- `src/app/page.tsx` refactored

## CopilotKit

- Single provider in `layout.tsx` — `agent="conciergeAgent"`
- No v2 imports
