# PR A runbook — `fix/copilotkit-runtime-stability`

**Purpose:** Cherry-pick **only** commit `8fa5f10` onto current `main`.  
**Do not** include café files.

> **Heads-up (verified 2026-05-30):** `8fa5f10` is the **remote tip** of `origin/feat/c012-cafe-places-detail` — safe to cherry-pick after `git fetch`. The local merge `8c99ded` seen on a dev machine is **unpushed/local-only**; it will not exist in a fresh clone, so do not reference it. Always cherry-pick the remote SHA `8fa5f10`.

## Files (exact — from `git show 8fa5f10 --stat`)

```text
scripts/check-mastra.mjs
src/app/api/copilotkit/[[...path]]/route.ts   # delete old route.ts
src/app/layout.tsx
src/components/copilot/event-web-citation-sync.tsx
src/components/copilot/focus-map-pin-action.tsx
src/components/copilot/search-tool-renders.tsx
src/lib/__tests__/copilotkit-client-props.test.ts
src/lib/copilotkit-client-props.ts
```

## Git commands

```bash
cd /home/sk/mdeai/mdeapp
git fetch origin main

# RECOMMENDED: isolate in a worktree so the café working tree stays untouched
# (this is exactly how the audit-1 dry-run proved the cherry-pick applies cleanly).
git worktree add ../mdeapp-pr-a -b fix/copilotkit-runtime-stability origin/main
cd ../mdeapp-pr-a
# …or, in place (only if no café WIP to protect):
# git checkout -b fix/copilotkit-runtime-stability origin/main

# Atomic runtime commit (parent = 76abde1 on old branch; patch applies to main's search-tool-renders)
git cherry-pick 8fa5f10

# If conflict in search-tool-renders.tsx:
#   - Keep module-level *ToolRender functions + useDisabledToolRender pattern
#   - Do NOT add CafeResultCard / GroundedCafeResults (those belong in PR B)
#   - Keep useSingleEndpoint in copilotkit-client-props.ts + tests

git add -u
git cherry-pick --continue   # if conflict was resolved

npm run floor
```

### Verify (localhost)

```bash
# Step 0 — kill stale next from branch switches (avoids 404 on /api/copilotkit)
fuser -k 3001/tcp 2>/dev/null || true
npm run dev   # :3001
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3001/api/copilotkit \
  -H 'Content-Type: application/json' -d '{"method":"info"}'
# 60s idle: POST /api/copilotkit delta = 0 after 15s settle
# Rental prompt: cards + map pins
```

### Push + PR

```bash
git push -u origin fix/copilotkit-runtime-stability

gh pr create --base main --head fix/copilotkit-runtime-stability \
  --title "fix(copilotkit): stabilize runtime transport and tool renders" \
  --body "$(cat <<'EOF'
## Summary
- Stable module-level tool render/action refs (stops POST /api/copilotkit loops)
- `useSingleEndpoint: true` on CopilotKit client
- Catch-all `/api/copilotkit/[[...path]]` route (GET+POST)
- Maps auth `Script` moved to `<head>`

## Why separate from café PR
Platform/runtime fix — should not wait on C-012 UI review.

## Verified
- [ ] `npm run floor` pass
- [ ] GET / 200, POST /api/copilotkit 200
- [ ] 60s idle: no request storm
- [ ] Rental search: cards + pins

## Refs
- tasks/ux/audit/01-copilotkit-audit.md UX-COPILOT-RUNTIME-001
- tasks/commit/may29/PR-14-SPLIT-FORENSIC-AUDIT.md
EOF
)"
```

## CI gate — land WITH PR A (open P0)

The split fixes the conflict + review tangle but adds **no automated test gate**. There is still no `.github/workflows/` in the repo, so "tests pass" relies on a human. Add a minimal workflow **in this PR** so the runtime fix is the first thing CI protects:

```yaml
# .github/workflows/floor.yml
name: floor
on: { pull_request: { branches: [main] } }
jobs:
  floor:
    runs-on: ubuntu-latest
    defaults: { run: { working-directory: mdeapp } }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm, cache-dependency-path: mdeapp/package-lock.json }
      - run: npm ci
      - run: npm run floor        # vitest 313 + lint + tsc + build
```

> Keep it `floor`-only for PR A (fast, deterministic). E2E/Playwright is heavier — gate that separately with PR B, not here.

## Commit message (if cherry-pick re-authored)

```text
fix(copilotkit): stabilize runtime transport and tool renders

- Stable module-level useCopilotAction renders to stop POST /api/copilotkit loops
- useSingleEndpoint on client; catch-all runtime route with GET+POST
- Maps auth Script in layout head; focusMapPin ref-stable registration

Refs tasks/commit/may29 PR-A
```

## Rollback

```bash
git revert <merge-sha>   # single revert on main
```

## Must NOT include

- `src/components/copilot/cafe-result-card.tsx`
- `src/app/api/places/detail/route.ts`
- `e2e/screens/SCREEN-021-cafe-listings.spec.ts`
- `src/mastra/tools/search-grounded-places.ts` (B1 café filter — PR B)
