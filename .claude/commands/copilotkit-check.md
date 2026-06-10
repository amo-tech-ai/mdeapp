---
description: Verify CopilotKit v1.55.2 hygiene — single mount, no v2 mix, agent name matches Mastra
allowed-tools: Bash, Read, Grep, Glob, Agent
---

# /copilotkit-check — CopilotKit 1.55.2 hygiene audit

Verify the four invariants of the Phase 1 CopilotKit + Mastra integration:

1. **One `<CopilotKit>` mount** (in `mdeapp/src/app/layout.tsx`)
2. **All `@copilotkit/*` packages pinned to `1.55.2`** in `mdeapp/package.json`
3. **No v2 imports** (`@copilotkit/react`, `@copilotkit/core`, `@copilotkit/agent`, `useFrontendTool`, `BuiltInAgent`, `CopilotKitProvider`)
4. **`agent={name}` prop matches a key in `Mastra({ agents })`** in `mdeapp/src/mastra/index.ts`

## Workflow

1. `Read mdeapp/package.json` — list all `@copilotkit/*` entries; flag any not == `1.55.2`.
2. `Grep -rn "@copilotkit/" mdeapp/src` — flag imports of `@copilotkit/react`, `@copilotkit/core`, `@copilotkit/agent`, `@copilotkit/sdk-js`.
3. `Grep -rn "<CopilotKit" mdeapp/src` — must find exactly one match in `layout.tsx`.
4. `Read mdeapp/src/app/layout.tsx` — extract `agent="…"` value (call it `X`).
5. `Read mdeapp/src/mastra/index.ts` — extract keys of `agents: { … }` (call them `Y`).
6. Assert `X ∈ Y`. If not, flag the mismatch with line refs.
7. `Grep -rn "useFrontendTool\|BuiltInAgent\|CopilotKitProvider" mdeapp/src` — must be 0 matches.

## Expected output

```
## CopilotKit hygiene — 2026-05-19

| Check | Result | Detail |
|-------|--------|--------|
| 1.55.2 pin | ✅/❌ | "@copilotkit/react-core": "1.55.2", "@copilotkit/react-ui": "1.55.2", "@copilotkit/runtime": "1.55.2" |
| v1 import only | ✅/❌ | 0 v2 imports found |
| Single <CopilotKit> mount | ✅/❌ | mdeapp/src/app/layout.tsx:32 |
| agent name matches Mastra | ✅/❌ | layout.tsx uses "pingAgent", mastra/index.ts exports {pingAgent} ✅ |

(If any ❌, escalate to copilotkit-reviewer subagent for line-level fixes.)
```

## Anti-patterns

- Do not auto-fix v2 import drift here — surface the issue for human decision (might be intentional migration in progress).
- Do not bump `@copilotkit/*` version — that's an explicit Phase 2 decision.
- Do not assume the agent name; always parse from `mastra/index.ts` to avoid stale memory.
