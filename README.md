# mdeapp

The mdeai application — an AI-first, chat-first, map-first discovery and ticketing platform for Medellín. Built on Next.js 16 + CopilotKit 1.55.2 + Mastra + Gemini 3.5 Flash + Supabase.

> Phase 1, Week 1. This repo is the **new** mdeai codebase. The legacy app at `/home/sk/mde/` is frozen reference only.

## Architecture

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 (App Router, React 19, Turbopack, Tailwind v4) |
| AI chat shell | CopilotKit 1.55.2 (pinned — see `plan/prd/03-architecture.md` §12) |
| AG-UI bridge | `@ag-ui/mastra` (beta) |
| Agent runtime | Mastra (beta) — agents in `src/mastra/agents/` |
| Model | Gemini 3.5 Flash via `@ai-sdk/google` (env: `GOOGLE_GENERATIVE_AI_API_KEY`) |
| Data | Supabase project `zkwcbyxiwklihegjhuql` — reused from legacy mdeai (122 tables, RLS-tight) |
| Maps | `@vis.gl/react-google-maps` + `@googlemaps/js-markerclusterer` (W5+) |
| Payments | Stripe (W9+) |

## Hard rules (from `/home/sk/mdeai/CLAUDE.md`)

- Production AI is Gemini only. No `@anthropic-ai/*` SDK. No `@ai-sdk/openai` in `mdeapp/src/**`.
- Never put service-role keys in `mdeapp/src/**` — they live in `mdeapp/supabase/functions/` only.
- Every new Supabase table needs RLS enabled + ≥ 1 policy.
- Every Places API New call includes `X-Goog-FieldMask`.
- Every `<AdvancedMarker>` has a `mapId` on its parent `<Map>`.
- CopilotKit pinned at `1.55.2` for Phase 1.

## Local development

```bash
npm install
npm run dev          # concurrently: next dev --turbopack (ui :3000) + mastra dev (agent)
npm run dev:debug    # LOG_LEVEL=debug npm run dev
npm run build
npm run audit        # npm audit --audit-level=high
```

Requires `mdeapp/.env.local` populated with: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID`, `GOOGLE_GENERATIVE_AI_API_KEY`, `LOG_LEVEL`. See `.env.example`.

## Project layout

```
mdeapp/
├── src/
│   ├── app/
│   │   ├── api/copilotkit/route.ts   ← CopilotRuntime + MastraAgent bridge
│   │   ├── layout.tsx                ← <CopilotKit agent="pingAgent">
│   │   ├── page.tsx                  ← W1 ping shell · W3+ Roberto host event · W6 Camila chat
│   │   └── globals.css
│   ├── components/                   ← shadcn cards land here from W2
│   ├── lib/
│   │   └── types.ts                  ← MdeState (W1) → EventDraftState (W3) → ...
│   └── mastra/
│       ├── index.ts                  ← Mastra({ agents: { pingAgent } })
│       ├── agents/index.ts           ← pingAgent (W1), hostEventAgent (W3), ...
│       └── tools/index.ts            ← empty W1; set_event_basics, set_venue, etc. W3+
├── public/
├── package.json                      ← pins CK 1.55.2 + Next 16.2.6 + Mastra beta
└── next.config.ts                    ← serverExternalPackages: ["@copilotkit/runtime"]
```

## Status

- W1 — `pingAgent` proves CopilotKit ↔ AG-UI ↔ Mastra ↔ Gemini wiring (this week)
- W3 — Roberto host event flow (HITL via `renderAndWaitForResponse`)
- W5 — Maps + rentals
- W6 — Camila chat + read-only map state
- W9 — Stripe ticket flow
- W10 — Cutover from legacy mde

See `/home/sk/mdeai/plan/prd.md` for the full Phase 1 plan and `/home/sk/mdeai/tasks/INDEX.md` for current task status.

## License

MIT (inherited from CopilotKit Mastra example, retained per their license).
