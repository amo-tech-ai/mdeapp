# PR A — Runtime stabilization tasks

**Branch:** `fix/copilotkit-runtime-stability`  
**Blocks:** Production CopilotKit POST storm / `ERR_INSUFFICIENT_RESOURCES`

## Implementation checklist

- [ ] `git fetch origin main`
- [ ] Branch from `origin/main` (not from #14 head)
- [ ] Cherry-pick `8fa5f10` only
- [ ] Resolve `search-tool-renders.tsx` conflict without café imports
- [ ] Confirm `useSingleEndpoint: true` in `copilotkit-client-props.ts` + tests
- [ ] Confirm catch-all `src/app/api/copilotkit/[[...path]]/route.ts`; old `route.ts` removed
- [ ] Confirm Maps `Script` in `layout.tsx` `<head>`
- [ ] No café / Places / SCREEN-021 files in diff vs `main`

## Skills (load before review)

- [ ] `copilotkit` → `copilotkit-integrations` → `references/integrations/mastra.md` (Pattern 1, v1.55.2, disabled tool render)
- [ ] `copilotkit-debug` — stable renders / `/info` / idle POST (`.agents/skills/copilotkit-debug` if not symlinked)
- [ ] See [SKILLS-COMPLIANCE-AUDIT.md](./SKILLS-COMPLIANCE-AUDIT.md)

## Verification checklist

- [ ] **Fresh** `npm run dev` before live probes (stale route manifest → false 404)
- [ ] `npm test` — **313/313** (current floor; was 312 in older audits)
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run floor`
- [ ] `npm run dev` — clean boot
- [ ] `GET /` → 200
- [ ] `POST /api/copilotkit` `{"method":"info"}` → 200, agents list includes `conciergeAgent`
- [ ] `GET /api/copilotkit/info` → 405 (expected with `useSingleEndpoint`)
- [ ] 60s idle → POST delta **0** (after 15s settle)
- [ ] Rental prompt → cards + map pins; bounded CK POST
- [ ] No `ERR_INSUFFICIENT_RESOURCES` in browser console

## Rollback checks

- [ ] Single revert commit possible
- [ ] Document: reverting A restores unstable renders (known regression)

## PR hygiene

- [ ] PR body links `tasks/ux/audit/01-copilotkit-audit.md`
- [ ] ≤8 files, ~200 lines (match `8fa5f10`)
- [ ] Request review from Sofía (floor) + Lucía (idle smoke)
- [ ] Merge before PR B
- [ ] **CI:** minimal GitHub Actions running `npm run floor` (P0 — split alone does not add this)

## Skills / MCP

- [ ] `copilotkit` → `copilotkit-integrations` (mastra.md) — **not** v2 `copilotkit-develop` examples
- [ ] `copilotkit-debug` if POST storm returns
- [ ] CopilotKit MCP: confirm `useSingleEndpoint` if questioned
