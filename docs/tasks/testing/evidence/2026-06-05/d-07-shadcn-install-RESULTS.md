# SAN-573 (D-07) — shadcn P0 install

**Date:** 2026-06-05  
**Issue:** [SAN-573](https://linear.app/sanjiovani/issue/SAN-573)

## Merge

| Item | Value |
|------|-------|
| PR #76 (install) | MERGED — squash `58b1cb7` |
| PR #78 (hotfix) | MERGED — squash `cb3deb2` — drop `next-themes` ThemeProvider (script console error) |
| Linear SAN-573 | Done |

## Pre-flight

- `npx shadcn@latest info --json` before: 11 components (six targets absent)

## Install

```bash
cd mdeapp && npx shadcn@latest add tabs command avatar carousel sonner sidebar -y -o
```

- Overwrites reviewed: `button.tsx`, `skeleton.tsx` (minor hover token changes)
- Transitive: `textarea.tsx`, `input-group.tsx`, `hooks/use-mobile.ts`

## Wiring (final)

- `src/components/app-providers.tsx` — `<Toaster theme="light" />` only (no ThemeProvider; Phase 1 forced light)
- `src/app/layout.tsx` — `MdeAppProviders` wraps `MdeCopilotKitProvider`; `suppressHydrationWarning` on `<html>`

## Post-merge proof

| Check | Result |
|-------|--------|
| `info --json` lists tabs, command, avatar, carousel, sonner, sidebar | PASS |
| Transitive files exist | PASS |
| `package.json` deps: cmdk, embla-carousel-react, sonner, next-themes | PASS |
| `npm run typecheck` (post-merge + hotfix) | PASS |
| `npm run build` (post-merge + hotfix) | PASS |
| CI floor on PR #76 | PASS |
| CodeRabbit threads on PR #76 | Resolved in `214c4de` |
| `GET /` localhost:3001 | PASS (200) |
| chat-smoke localhost | PASS |
| prod GET / + chat-smoke (`cb3deb2`) | PASS (2026-06-05) |
| ThemeProvider script console error | FIXED in PR #78 |

```bash
cd mdeapp
git log --oneline -3  # cb3deb2 hotfix, 58b1cb7 PR #76
npm run typecheck && npm run build
node ../tasks/testing/scripts/chat-smoke.mjs --base http://localhost:3001
```

## Excluded (separate work)

- `tsconfig.json`, `.vscode`, `github/` — intentionally not in SAN-573 commits

## Notes

- Local `npm run floor` may fail on vendored `github/` ESLint noise; CI floor passes on product paths.
- Vector Map → Raster warning is unrelated (Google Maps WebGL); not a SAN-573 blocker.
- **SAN-462:** Done 2026-06-05 — D-08 (SAN-574) assignable.
