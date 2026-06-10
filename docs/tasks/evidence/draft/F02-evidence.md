# F02 evidence — 2026-05-19

## Acceptance test results

| # | Test | Result |
|---|---|---|
| T1 | pingAgent exported | ✅ OK |
| T2 | weatherAgent gone | ✅ OK (grep returned nothing) |
| T3 | Gemini model = `gemini-3.5-flash` | ✅ OK |
| T4 | No deprecated models | ✅ OK |
| T5 | `scope: "thread"` present | ✅ OK |
| T6 | tools/index.ts emptied | ✅ OK (`export {}` + TODO comment for W3/W5 tools) |
| T7 | mastra/index.ts swapped | ✅ OK |
| T8 | MdeState type exported | ✅ OK |
| T9 | `@ai-sdk/google` in deps | ✅ `^1.0.0` |
| T10 | `@ai-sdk/openai` removed | ✅ absent |

**Implicit hook tests:** PreToolUse `gemini-model-pin.mjs` + `copilotkit-version-pin.mjs` approved every Write (no exit=2). Confirmed by file write success.

**Pass rate: 10/10.**

## Files changed (5)

| File | LoC | Change |
|---|---|---|
| `mdeapp/src/mastra/agents/index.ts` | 28 | weatherAgent (OpenAI gpt-4o) → pingAgent (Gemini 3.5 Flash). New `MdeState` Zod schema. |
| `mdeapp/src/mastra/tools/index.ts` | 5 | `weatherTool` removed; placeholder `export {}` with W3/W5 TODO. |
| `mdeapp/src/mastra/index.ts` | 19 | Import + agents map: `weatherAgent` → `pingAgent`. |
| `mdeapp/src/lib/types.ts` | 7 | `AgentState{proverbs}` → `MdeState{lastQuery,hint}`. Mirrors Zod schema. |
| `mdeapp/package.json` | 1 line | `@ai-sdk/openai ^2.0.42` → `@ai-sdk/google ^1.0.0`. |

## Deferred (per F02 spec)

- `npm install` deferred to F05 — node_modules currently has `@ai-sdk/openai` from F01b install; F05 install will refresh with `@ai-sdk/google`.

## Follow-ups

- F03 (next): strip demos + Spanish shell + agent="pingAgent"
- F04: workspace `.env.local` has GEMINI_API_KEY value → copy to `mdeapp/.env.local` as `GOOGLE_GENERATIVE_AI_API_KEY`
