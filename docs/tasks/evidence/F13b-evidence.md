# F13b evidence — workspace + skills port

**Date:** 2026-05-22  
**Branch:** (uncommitted)  
**Verifier:** Composer agent

## Files added/changed

- `mdeapp/workspace/skills/*/SKILL.md` — 5 skills (verbatim from legacy)
- `mdeapp/src/mastra/workspaces.ts` — `Workspace` + read-only FS config
- `mdeapp/src/mastra/index.ts` — `workspace` wired into `Mastra({})`
- `mdeapp/src/mastra/workspaces.test.ts` — 3 unit tests
- `mdeapp/src/__tests__/smoke.test.ts` — workspace smoke assertion
- `mdeapp/.env.example` — optional `MDEAPP_WORKSPACE`

## Beta API check

`Mastra({ workspace })` accepted — `@mastra/core/dist/mastra/index.d.ts` line 189: `workspace?: AnyWorkspace`.

## Tests

```bash
cd mdeapp && npm run typecheck && npm test
# 7 files, 47 tests passed
```

## Runtime probes

```bash
curl -s http://localhost:4111/api/workspaces
# hasSkills: true

curl -s http://localhost:4111/api/workspaces/<id>/skills
# 5 skills: mde-event-review, mde-followup-logic, mde-prompt-qa, mde-rental-quality, mde-safe-actions

curl -s -X POST http://localhost:4111/api/agents/concierge-agent/generate \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Say hello in one word"}]}'
# {"text":"Hello"}
```

## Studio UI (localhost:4111)

Concierge Agent → Overview tab shows:

- **Skills:** mde-event-review, mde-followup-logic, mde-prompt-qa, mde-rental-quality, mde-safe-actions
- **Workspace Tools:** read_file, list_files, file_stat, grep, lsp_inspect

No regression on chat generate.

## Deferred (F19)

`WorkspaceInstructionsProcessor` not attached to agents yet — skills visible in Studio; runtime injection deferred.
