# F01 evidence — 2026-05-19

## Acceptance test results

| # | Test | Result |
|---|---|---|
| T1 | route.ts exists | ✅ OK |
| T2 | name=mdeapp | ✅ `mdeapp` |
| T3 | no .git inherited | ✅ OK |
| T4 | docker stripped | ✅ OK |
| T5 | .env stripped (contained real OpenAI key from example/test) | ✅ OK |
| T6 | README is mdeai | ✅ OK |
| T7 | CopilotKit pin intact | ✅ `1.55.2` |

**Pass rate: 7/7.**

## What was removed

- `.git/` (no commits; F06 will run fresh `git init`)
- `docker/`, `Dockerfile`, `.dockerignore`, `docker-compose.test.yml` (example tooling)
- `fixtures/` (example test fixtures)
- `.env` (**contained a real OpenAI key — recommend rotating in OpenAI dashboard**)
- `.mastra/` (build artifact from prior F01b dev run)

## Final `ls -la mdeapp/`

```
.gitignore       491
LICENSE         1067
.next/          (build artifact — gitignored)
next.config.ts   313
next-env.d.ts    251 (auto-generated; commit per Next.js convention)
node_modules/   (from F01b install; gitignored)
package.json    1256
package-lock.json 645897
postcss.config.mjs 81
public/
README.md       3512 (mdeai-rewritten)
src/
tsconfig.json    654
```

## Follow-ups

- **Action item:** rotate the OpenAI key that was in `mdeapp/.env`. It was present in the inherited example since 2026-05-19. The key was not committed (no `.git/`) but was readable on disk.
- F02 will swap `@ai-sdk/openai` → `@ai-sdk/google` so the key is fully unused.
