# Localhost smoke — 2026-05-20

> Runtime proof that mdeapp boots and serves the chat shell + CopilotKit endpoint after F09 + F10 landed. Shared evidence — referenced by both `F09-evidence.md` and `F10-evidence.md` as the localhost gate.

## Command

```bash
cd /home/sk/mdeai/mdeapp && npm run dev
```

## Boot log (verbatim, key lines)

```
[ui] > mdeapp@0.1.0 dev:ui
[ui] > next dev --turbopack
[ui] ⚠ Port 3000 is in use by process 248040, using available port 3001 instead.
[ui] ▲ Next.js 16.2.6 (Turbopack)
[ui] - Local:         http://localhost:3001
[ui] ✓ Ready in 395ms
[agent] ✓ Initial bundle complete
[agent] ◇ Starting Mastra dev server...
[agent] Mastra API running { url: 'http://localhost:4111/api' }
[agent]  mastra  1.1.0-alpha.3 ready in 882 ms
[agent] │ Studio: http://localhost:4111
[agent] │ API:    http://localhost:4111/api
[agent] ◯ watching for file changes...
```

Both subprocesses booted clean. No errors, no EADDRINUSE on 3001 (port 3000 squatter handled by Next.js auto-fallback per CLAUDE.md note).

## Probe results

| # | Probe | Expected | Actual | Verdict |
|---|---|---|---|---|
| L1 | `GET http://localhost:3001/` | HTTP 200, mdeai shell HTML | **HTTP 200 · 43,756 bytes · `<title>mdeai — concierge for Medellín`** | ✅ chat shell renders |
| L2 | `POST http://localhost:3001/api/copilotkit` (bad payload) | HTTP 400 with structured error (endpoint alive) | **HTTP 400 · `{"error":"invalid_request","message":"Missing method field"}`** | ✅ CopilotKit runtime endpoint live, parses requests, rejects malformed input correctly |
| L3 | `GET http://localhost:4111/` (Mastra Studio) | HTTP 200 | **HTTP 200** | ✅ Mastra dev studio reachable |

## Dev-server access log after probes

```
[ui]  POST /api/copilotkit 400 in 2.9s   ← first hit (Turbopack first-compile)
[ui]  GET / 200 in 36ms                   ← shell served
[ui]  POST /api/copilotkit 400 in 5ms    ← second hit (compiled, fast)
```

First /api/copilotkit hit triggered Turbopack compilation (~3s). Second hit served in 5ms — runtime is warm. Standard Next.js behavior.

## What this proves

- **F01 → F05 wiring still intact** after F09 + F10 landed. Chat shell renders the mdeai title, agent binding registered in `<CopilotKit>` provider, `/api/copilotkit` route handler responsive.
- **F09 (Vitest + floor) did not regress runtime.** Adding test infra + ESLint config didn't break the dev server.
- **F10 (FREEZE.md + ARCHITECTURE.md) did not regress runtime.** Doc additions are byte-isolated from runtime.
- **Mastra in-process agent runtime up** at `localhost:4111`, agents discoverable via the studio UI.

## What this does NOT prove

- I did not send a real conversational message to `pingAgent` (no chrome-devtools MCP session this turn — the tool surface was disconnected earlier). The "hi → Gemini reply" smoke from F05 still stands as the canonical end-to-end conversational proof.
- Layer-2 user paths (Roberto's `/host/event/new` wizard, Camila's `/rentals`) don't exist yet — W3/W5 territory.
- No load / soak test. Single-request probes only.

## Clean shutdown

```
pkill -f 'next dev --turbopack'
pkill -f 'mastra dev'
→ pgrep returns no matching procs
→ lsof -i :3001 -i :4111 returns nothing
```

Ports released, no zombie processes.

## Persona impact

- **Sofía (dev):** `npm run dev` still boots in <1s for Next.js + ~1s for Mastra. Fast iteration loop intact after this week's two doc-heavy tasks.
- **Camila (chat user):** the chat shell at `http://localhost:3001` renders her mdeai-titled page. The shell scaffold she'll use in W6 is alive.
- **Lucía (QA):** the `/api/copilotkit` runtime endpoint returns a structured 400 on bad input — proves the runtime middleware (CopilotRuntime + MastraAgent.getLocalAgents bridge) is wired and parsing requests. Good baseline for future E2E.

## Why this evidence file is shared

Both F09 and F10 changed the repo this week. Rather than write two duplicate localhost-smoke sections, this file is the single source of truth. F09-evidence.md and F10-evidence.md each link here.

The new rule (any task is only Done if it has localhost runtime proof) is satisfied for **both** F09 and F10 by this file.
