# MAP-001 evidence — 2026-05-23

## Commands

```bash
cd /home/sk/mdeai/mdeapp
npm install @vis.gl/react-google-maps@^1.8.3
npm run floor   # lint + typecheck + build + test OK; audit 503 transient
npm test        # 74 passed (includes platform/maps + contracts)
npm run dev
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/  # 200
```

## Artifacts on disk

- `src/platform/contracts/` — MapPin + ToolResponse Zod
- `src/platform/maps/` — normalize, merge, map-context, map-config
- `src/components/maps/MapProvider.tsx`, `ChatMap.tsx`
- Vitest: `contracts/__tests__/`, `maps/__tests__/`

## Grep gates

- `setPins` only in `map-context.tsx` (internal)
- No `loadGoogleMapsLibrary` / `react-wrapper`
- No `useRenderTool` / `CopilotKitProvider` in src

## Runtime

- `@vis.gl/react-google-maps` **1.8.3** in package.json
- Mock pin seeded via `MOCK_LAYOUT_PIN` in MapContext
- Map requires `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` + `MAP_ID` in `mdeapp/.env.local`

## Persona

Camila/Tourist: `/` map column renders when keys present; otherwise `data-testid="map-env-error"`.
