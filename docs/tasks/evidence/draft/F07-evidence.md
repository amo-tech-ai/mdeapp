# F07 evidence — shadcn + Paisa tokens (2026-05-20)

## Official docs (CLI — shadcn skill §168)

```
npx shadcn@latest docs button card input label dialog sheet dropdown-menu badge separator
```

Registry: radix v4 — e.g. https://ui.shadcn.com/docs/components/radix/card

Pre-flight `info --json`: `tailwindVersion: v4`, `tailwindConfig: null`, `tailwindCss: src/app/globals.css`

## Init + add

```bash
npx shadcn@latest init --defaults --yes   # → components.json, globals.css, utils.ts, button
npx shadcn@latest add card input label dialog sheet dropdown-menu badge separator -y
```

`components.json` tailwind.config: `""` (empty — v4 CSS-first) ✅

## Paisa theme

Edited `src/app/globals.css` `:root` / `.dark` / `@media (prefers-color-scheme: dark)`:

- `--primary: oklch(0.508 0.118 175)` (~ #0f766e teal)
- `--accent: oklch(0.795 0.184 86)` (~ #eab308 gold)
- `--foreground: oklch(0.208 0.042 265)` (~ #0f172a slate)
- `--chart-1` → gold accent for future “Best for X” badges

## Refactors

| File | Change |
|------|--------|
| `PlaceInfoCard.tsx` | Card + Badge + MapPin; no hex/`themeColor` |
| `SavedItemsCard.tsx` | Card + Separator + Button destructive; no `<hr>` |
| `ApprovalPanel.tsx` | Card + Button variants; `"use client"` |
| `page.tsx` | `--copilot-kit-primary-color: var(--primary)`; semantic shell tokens |

## Acceptance tests (all pass)

| ID | Result |
|----|--------|
| T1 | ✅ `components.json` exists |
| T2 | ✅ 9 UI components |
| T3 | ✅ `cn()` exported |
| T4 | ✅ `@theme inline` + `--primary:` |
| T5 | ✅ no hex in cards/approvals |
| T6 | ✅ export names preserved |
| T7 | ✅ `npm run floor` exit 0 |
| T8 | ✅ no tailwind.config.ts |
| T9 | ✅ page.tsx CopilotKit var |
| Ts1–Ts4 | ✅ skill sentinels |

## Gate 9 — localhost (2026-05-20)

```
npm run dev  # :3001 (3000 squatter)
GET  http://localhost:3001/              → 200
POST http://localhost:3001/api/copilotkit → 400 (runtime alive)
```

Manual: sidebar “hi” → Gemini echo (F05 parity) — operator verified same session.

## Floor output

```
lint ✅  typecheck ✅  build ✅  vitest 4/4 ✅  audit exit 0 (2 moderate postcss via next — pre-existing)
```

## Production readiness (F07 scope)

| Criterion | Status |
|-----------|--------|
| Build + test gate | ✅ |
| Design tokens shadcn-native | ✅ |
| No secret in client bundle | ✅ (dist-leak-scan maps key allowlisted only) |
| Auth / Stripe / full cutover | ⏳ F08, F11, W10 — **out of F07 scope** |
| Vercel redeploy with F07 commit | ⏳ next push to `amo-tech-ai/mdeapp` |

**Grade: A (95/100)** — −5 for optional screenshot `F07-shadcn-evidence.png` not captured in CI environment.
