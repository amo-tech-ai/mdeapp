---
id: F01
title: Bootstrap mdeapp from CopilotKit Mastra example
status: Done
completed_at: 2026-05-19
priority: P0
effort: 30 min
owner: claude
depends_on: []
skill: [copilotkit-setup, copilotkit-integrations, mde-task-lifecycle]
evidence: /home/sk/mdeai/tasks/notes/F01-evidence.md
test_pass_rate: 7/7
verified_against:
  - /home/sk/mdeai/.claude/skills/copilotkit-setup/SKILL.md
  - /home/sk/mdeai/.claude/skills/copilotkit-integrations/references/integrations/mastra.md
  - /home/sk/mdeai/CopilotKit/examples/integrations/mastra/ (verbatim source)
---

# F01 — Bootstrap `mdeapp` from CopilotKit Mastra example

## 1. Purpose

Land a working Next.js 16 + CopilotKit 1.55.2 + Mastra tree at `/home/sk/mdeai/mdeapp/` by copying the official `examples/integrations/mastra/` folder verbatim. This is the runtime foundation for every Phase-1 task. No code rewrites in this task — pure file copy + clean. Replaces the half-built `/home/sk/mdeai-app/` from earlier exploration.

## 2. Goals

- `ls /home/sk/mdeai/mdeapp/src/app/api/copilotkit/route.ts` succeeds (file exists)
- `package.json` has exact pins: `@copilotkit/react-core@1.55.2`, `@copilotkit/react-ui@1.55.2`, `@copilotkit/runtime@1.55.2`, `@ag-ui/mastra@beta`, `mastra@beta`
- No legacy `.git` from the example (own repo initialized in F06)
- Docker test fixtures stripped (we don't need them)
- README replaced with mdeai-app context

## 3. Features (what the user gets)

- **Sofía (dev):** a clean Next.js + Mastra tree ready for edits, identical in shape to the official example so future CopilotKit upgrades are easy
- **Camila / Roberto:** nothing yet — this is plumbing

## 4. Workflows

1. `cp -r /home/sk/mdeai/CopilotKit/examples/integrations/mastra /home/sk/mdeai/mdeapp`
2. `cd /home/sk/mdeai/mdeapp`
3. `rm -rf .git docker docker-compose.test.yml Dockerfile .dockerignore fixtures`
4. Rename `package.json` `"name"` field: `"starter"` → `"mdeapp"`
5. Delete stale `README.md`; write a new one stating this is the mdeai app (defer full README to F06)
6. **Do NOT run `npm install` yet** (deferred to F05 after env + agent + page rewrites complete)

## 5. User journeys

- **Sofía (dev):** runs 4 commands; in 5 minutes the tree is in place; can open `/home/sk/mdeai/mdeapp/src/app/page.tsx` and see the (still-weather-demo) source.
- **Lucía (QA):** verifies file inventory matches the example folder (minus stripped docker bits).

## 6. Agents

None. This is pure file copy.

## 7. Integrations

| Integration | Purpose |
|---|---|
| CopilotKit example folder | Source of the copy at `/home/sk/mdeai/CopilotKit/examples/integrations/mastra/` |

## 8. Summary

We copy the official CopilotKit Mastra starter into `/home/sk/mdeai/mdeapp/` and strip docker test fixtures. It helps Sofía start every Phase-1 task from a known-good baseline. We'll know it worked when `ls /home/sk/mdeai/mdeapp/src/app/api/copilotkit/route.ts` returns the file path with no error.

## 9. Definition of Done

- [ ] `/home/sk/mdeai/mdeapp/` exists with `src/`, `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `public/`, `LICENSE`
- [ ] `package.json` `"name"` field equals `"mdeapp"`
- [ ] No `.git/` inside the copy (own repo created in F06)
- [ ] No `docker/`, `docker-compose.test.yml`, `Dockerfile`, `.dockerignore`, `fixtures/` (stripped)
- [ ] No `node_modules/` yet (deferred to F05)
- [ ] `README.md` replaced with mdeai context (full version comes in F06)
- [ ] Evidence: `ls -la /home/sk/mdeai/mdeapp/` output in task notes

## 10. Tests

Each test maps 1:1 to a DoD checkbox. Tests are ordered cheap → expensive. All must pass before marking Done.

### Acceptance tests (automated)

| # | Maps to DoD | Command | Expected output |
|---|---|---|---|
| T1 | tree exists | `test -f /home/sk/mdeai/mdeapp/src/app/api/copilotkit/route.ts && echo OK` | `OK` |
| T2 | name is mdeapp | `node -p "require('/home/sk/mdeai/mdeapp/package.json').name"` | `mdeapp` |
| T3 | no .git inherited | `test ! -d /home/sk/mdeai/mdeapp/.git && echo OK` | `OK` |
| T4 | docker stripped | `test ! -d /home/sk/mdeai/mdeapp/docker && test ! -f /home/sk/mdeai/mdeapp/Dockerfile && test ! -f /home/sk/mdeai/mdeapp/.dockerignore && test ! -f /home/sk/mdeai/mdeapp/docker-compose.test.yml && test ! -d /home/sk/mdeai/mdeapp/fixtures && echo OK` | `OK` |
| T5 | node_modules NOT present yet (deferred to F05) | `test ! -d /home/sk/mdeai/mdeapp/node_modules && echo OK` | `OK` (skip if F01b already ran install) |
| T6 | README is mdeai | `grep -qi 'mdeai' /home/sk/mdeai/mdeapp/README.md && echo OK` | `OK` |
| T7 | CopilotKit pin intact | `node -p "require('/home/sk/mdeai/mdeapp/package.json').dependencies['@copilotkit/react-core']"` | `1.55.2` |

### Negative tests (sanity-prove the strip happened)

| # | Inject | Expected |
|---|---|---|
| Tn1 | If T4 fails (docker/ still present), `ls mdeapp/docker` shows files | strip was incomplete — re-run step 3 of §4 Workflows |
| Tn2 | If T7 reports anything other than `1.55.2` | bootstrap copied from wrong source — re-run §4 step 1 |

### Evidence to capture in `tasks/notes/F01-evidence.md`

- `ls -la /home/sk/mdeai/mdeapp/` (full listing)
- Output of T1–T7 concatenated

## Notes / verification

Per the `copilotkit-integrations/references/integrations/mastra.md` skill (lines 105–131), the runtime endpoint at `src/app/api/copilotkit/route.ts` uses `MastraAgent.getLocalAgents({ mastra })` — verbatim from the example we are copying. This task does not modify that file; F02 + F03 modify other files. Verified against actual source on disk at `/home/sk/mdeai/CopilotKit/examples/integrations/mastra/src/app/api/copilotkit/route.ts`.
