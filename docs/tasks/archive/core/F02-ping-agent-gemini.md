---
id: F02
title: Replace weatherAgent with pingAgent (Gemini 3.5 Flash + scope:"thread")
status: Done
completed_at: 2026-05-19
priority: P0
effort: 45 min
owner: claude
depends_on: [F01]
skill: [mastra, copilotkit-integrations, gemini-api-docs-mcp]
evidence: /home/sk/mdeai/tasks/notes/F02-evidence.md
test_pass_rate: 10/10
verified_against:
  - /home/sk/mdeai/.claude/skills/copilotkit-integrations/references/integrations/mastra.md
  - /home/sk/mdeai/.claude/skills/mastra/SKILL.md
  - /home/sk/mdeai/CopilotKit/examples/integrations/mastra/src/mastra/agents/index.ts
  - gemini-api-docs-mcp (verify gemini-3.5-flash is current; gemini-2.0-flash-exp is deprecated)
---

# F02 — Replace `weatherAgent` with `pingAgent` (Gemini 3.5 Flash)

## 1. Purpose

The example ships with a `weatherAgent` that calls OpenAI `gpt-4o` and Open-Meteo. mdeai uses Gemini (existing `GEMINI_API_KEY` budget) and has no weather use case. This task swaps the demo agent for a minimal echo agent (`pingAgent`) that proves the CopilotKit ↔ AG-UI ↔ Mastra ↔ Gemini wiring is alive. It's the smallest possible agent we can ship and verify in week 1.

## 2. Goals

- `src/mastra/agents/index.ts` exports `pingAgent` (no `weatherAgent`)
- Agent uses `google("gemini-3.5-flash")` from `@ai-sdk/google` (env var: `GOOGLE_GENERATIVE_AI_API_KEY`)
- `Memory.workingMemory.options` includes `scope: "thread"` (matches actual example exactly)
- `Memory.workingMemory.options.schema` is a small Zod placeholder (`MdeState` with 2 string fields, replaced in week 3 by `EventDraftState`)
- `src/mastra/tools/index.ts` is emptied (no `weatherTool`)
- `src/mastra/index.ts` registers `pingAgent` instead of `weatherAgent`
- `src/lib/types.ts` exports a placeholder `MdeState` matching the Zod schema
- `package.json` swaps `@ai-sdk/openai` → `@ai-sdk/google` (in deps, do NOT npm-install yet — that's F05)

## 3. Features (what the user gets)

- **Sofía (dev):** an agent registered with Mastra that responds to any prompt with a brief echo, using mdeai's existing Gemini budget. No OpenAI key needed.
- **Roberto / Camila:** nothing yet.

## 4. Workflows

1. Open `src/mastra/agents/index.ts`; replace contents with:
   ```ts
   import { google } from "@ai-sdk/google";
   import { Agent } from "@mastra/core/agent";
   import { LibSQLStore } from "@mastra/libsql";
   import { Memory } from "@mastra/memory";
   import { z } from "zod";

   export const MdeState = z.object({
     lastQuery: z.string().default(""),
     hint: z.string().default(""),
   });

   export const pingAgent = new Agent({
     id: "ping-agent",
     name: "Ping Agent",
     tools: {},
     model: google("gemini-3.5-flash"),
     instructions:
       "You are mdeai's day-1 ping agent. Respond briefly in the same language the user wrote in. Confirm the wiring is alive. Do not call any tools.",
     memory: new Memory({
       storage: new LibSQLStore({ id: "ping-agent-memory", url: "file::memory:" }),
       options: {
         workingMemory: {
           enabled: true,
           schema: MdeState,
           scope: "thread",
         },
       },
     }),
   });
   ```
2. Replace `src/mastra/tools/index.ts` contents with `export {};` and a TODO comment pointing to F-W3 (host event tool registration)
3. Open `src/mastra/index.ts`; change the import + agents map: `weatherAgent` → `pingAgent`
4. Open `src/lib/types.ts`; replace `AgentState` type with:
   ```ts
   export type MdeState = { lastQuery: string; hint: string };
   ```
5. Open `package.json`; swap dep: remove `@ai-sdk/openai`, add `"@ai-sdk/google": "^1.0.0"`
6. **Do NOT run `npm install` yet** (that's F05)

## 5. User journeys

- **Sofía:** edits 5 files; total LoC delta ~80 lines. Re-reads the agent file once to confirm `scope: "thread"`.
- **Lucía (QA):** confirms the diff against `examples/integrations/mastra/src/mastra/agents/index.ts` — only the model, agent id/name, and OpenAI→Google swap differ.

## 6. Agents

| Agent | Where | Model | What it does |
|---|---|---|---|
| `pingAgent` | `src/mastra/agents/index.ts` | Gemini 3.5 Flash | Replies to any prompt with a short echo. No tools. |

## 7. Integrations

| Integration | Purpose | Auth |
|---|---|---|
| `@ai-sdk/google` | Gemini SDK for Vercel AI SDK | `GOOGLE_GENERATIVE_AI_API_KEY` env var (F04 sets it) |
| `@mastra/core` `Agent` | Agent definition | — |
| `@mastra/memory` + `@mastra/libsql` | In-memory working state | — |

## 8. Summary

We swap the example's OpenAI weather agent for a minimal Gemini echo agent. It helps Sofía verify the CopilotKit + Mastra + Gemini wiring without needing an OpenAI key. We'll know it worked when (in F05) typing "hola" gets a Spanish reply.

## 9. Definition of Done

- [ ] `src/mastra/agents/index.ts` exports `pingAgent` only (no `weatherAgent`)
- [ ] Model is `google("gemini-3.5-flash")` — **not** `gemini-2.0-flash-exp` (deprecated)
- [ ] `scope: "thread"` present in `workingMemory.options`
- [ ] `src/mastra/tools/index.ts` exports `{}` (no `weatherTool`)
- [ ] `src/mastra/index.ts` registers `pingAgent` in the agents map
- [ ] `src/lib/types.ts` exports `MdeState` type matching the Zod schema
- [ ] `package.json` has `@ai-sdk/google` (not `@ai-sdk/openai`)
- [ ] Evidence: diff vs the example shows only intended changes (no accidental edits to `route.ts`, `layout.tsx`, etc.)
- [ ] Evidence: `gemini-api-docs-mcp search_docs "gemini 3.5 flash current model"` confirms the model id is current

## 10. Tests

Each test maps 1:1 to a DoD checkbox. Run all before marking Done. Run from `mdeapp/`.

### Acceptance tests (automated)

| # | Maps to DoD | Command | Expected |
|---|---|---|---|
| T1 | pingAgent exported | `grep -q "export const pingAgent" src/mastra/agents/index.ts && echo OK` | `OK` |
| T2 | weatherAgent gone | `! grep -r "weatherAgent\|weather-agent" src/mastra/ && echo OK` | `OK` |
| T3 | Gemini model correct | `grep -q 'google("gemini-3.5-flash")' src/mastra/agents/index.ts && echo OK` | `OK` |
| T4 | Deprecated models absent | `! grep -E "gemini-2\\.[05]-flash\|gemini-3-flash-preview\|gpt-4o\|gpt-4-turbo" src/mastra/agents/index.ts && echo OK` | `OK` |
| T5 | `scope: "thread"` present | `grep -q 'scope:\s*"thread"' src/mastra/agents/index.ts && echo OK` | `OK` |
| T6 | tools/index emptied | `grep -q "export {}" src/mastra/tools/index.ts && ! grep -q "weatherTool" src/mastra/tools/index.ts && echo OK` | `OK` |
| T7 | mastra/index swapped | `grep -q "pingAgent" src/mastra/index.ts && ! grep -q "weatherAgent" src/mastra/index.ts && echo OK` | `OK` |
| T8 | MdeState type exported | `grep -q "export type MdeState" src/lib/types.ts && echo OK` | `OK` |
| T9 | `@ai-sdk/google` in deps | `node -p "require('./package.json').dependencies['@ai-sdk/google']"` | non-empty version string |
| T10 | `@ai-sdk/openai` removed | `node -p "require('./package.json').dependencies['@ai-sdk/openai'] \|\| 'absent'"` | `absent` |
| T11 | hook pass — gemini-model-pin | `echo '{"tool_input":{"file_path":"/home/sk/mdeai/mdeapp/src/mastra/agents/index.ts","content":"'"$(cat src/mastra/agents/index.ts)"'"}}' \| node /home/sk/mdeai/.claude/hooks/gemini-model-pin.mjs; echo exit=$?` | `exit=0` |
| T12 | hook pass — copilotkit-version-pin | as T11 but for `copilotkit-version-pin.mjs` against `package.json` | `exit=0` |

### Negative tests (prove the rules bite)

| # | Inject | Expected |
|---|---|---|
| Tn1 | swap model to `gemini-2.5-flash` | T4 fails AND `gemini-model-pin.mjs` hook blocks the edit |
| Tn2 | restore `weatherAgent` import in `src/mastra/index.ts` | T2 + T7 fail |
| Tn3 | drop `scope: "thread"` | T5 fails — confirms PRD §13 invariant is enforced |

### MCP verification (per CLAUDE.md cadence)

- Before any code, query the model registry via `gemini-api-docs-mcp` search-docs "gemini 3.5 flash" to confirm `gemini-3.5-flash` is still current. If MCP is down, fall back to CLAUDE.md Gemini registry table (last verified 2026-05-19).

### Evidence to capture in `tasks/notes/F02-evidence.md`

- Diff of `src/mastra/agents/index.ts` (before vs after)
- T11 + T12 hook test output
- Output of `node -p "require('./package.json').dependencies"` showing only `@ai-sdk/google`

## Notes / verification

- **P0-1 correction (from `plan/audit/01-plan-audit.md`):** `gemini-2.0-flash-exp` is a deprecated preview. Use `gemini-3.5-flash`. Verified via `gemini-api-docs-mcp` skill.
- **P0-4 correction:** `scope: "thread"` matches the example at `/home/sk/mdeai/CopilotKit/examples/integrations/mastra/src/mastra/agents/index.ts:27`. Without it, working memory scope defaults differ from the example.
- The `mastra` skill explicitly says "Do not trust internal knowledge" — verify any Mastra API via `mcp__mastra__searchMastraDocs` or `mcp__mastra__readMastraDocs` before any change.
