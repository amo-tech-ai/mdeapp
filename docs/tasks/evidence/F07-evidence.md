# F07 evidence — shadcn + Paisa tokens

**Verified:** 2026-05-20 (initial) · **Gate re-run:** 2026-05-23 (all green)

## Step 1 — Pre-flight

| Check | Result |
|-------|--------|
| Tailwind | v4 (`tailwindcss` ^4, CSS-first) |
| shadcn initialized | Yes — `components.json`, style `base-nova` |
| `tailwind.config` | null / empty in JSON |
| UI components | 9 (`button`, `card`, `input`, `label`, `dialog`, `sheet`, `dropdown-menu`, `badge`, `separator`) |
| `cn()` | `src/lib/utils.ts` |

```bash
cd /home/sk/mdeai/mdeapp
npx shadcn@latest info --json
# tailwindVersion: v4, tailwindConfig: null, components: [badge, button, card, ...]
```

## Step 2 — Docs (shadcn skill §168)

```bash
npx shadcn@latest docs button card input label dialog sheet dropdown-menu badge separator
```

Registry: base-nova / radix v4 — https://ui.shadcn.com/docs/components/base/card

## Paisa theme (`src/app/globals.css` only)

- `@import "tailwindcss"` preserved
- OKLCH semantic tokens in `:root`, `@media (prefers-color-scheme: dark)`, `.dark`
- `@theme inline` maps `--color-primary`, `--accent`, etc.
- Anchors (comment only): slate `#0f172a`, teal `#0f766e`, gold `#eab308`
- No `tailwind.config.ts` / `.js`
- No parallel `--mdeai-teal-*` scale

## Card refactors

| File | Primitives |
|------|------------|
| `PlaceInfoCard.tsx` | `Card`, `CardHeader`, `CardContent`, `Badge`, semantic `bg-primary` |
| `SavedItemsCard.tsx` | `Card`, `Separator`, `Button variant="destructive"` |
| `ApprovalPanel.tsx` | `Card`, `Button` (default / outline / destructive), state machine preserved |

## CopilotKit

`src/app/page.tsx`:

```tsx
"--copilot-kit-primary-color": "var(--primary)"
```

## Static gates (all pass)

```
components.json OK | cn OK | ui count: 9 | no tailwind config OK
theme inline OK | primary token OK | no hex in cards OK
no inline color styles OK | no hr OK | no hardcoded CopilotKit color OK
```

## Build / floor

```bash
npm run lint      # exit 0
npm run typecheck # exit 0
npm run build     # exit 0
npm test -- --run # 91/91
npm run floor     # exit 0 (2 moderate transitive — no audit fix --force)
```

## Gate 9 — localhost

```
GET  http://localhost:3001/              → 200
POST http://localhost:3001/api/copilotkit → 400 (runtime alive)
```

Manual: CopilotSidebar open; type **hi** → Gemini reply (F05 parity).

### 2026-05-23 operator re-run (required before Done)

| Step | Result |
|------|--------|
| `npm run build` | exit 0 |
| `npm run test -- --run` | 91/91 pass |
| `npm run floor` | exit 0 |
| `GET /` | 200 |
| `POST /api/copilotkit` | 400 |
| `e2e/f07-visual-smoke.spec.ts` | 2/2 pass |

## Visual QA (Playwright)

| Viewport | Screenshot |
|----------|------------|
| 1280×900 | `tasks/notes/F07-shadcn-evidence-desktop.png` |
| 390×844 | `tasks/notes/F07-shadcn-evidence-mobile.png` |

```bash
PW_SKIP_WEBSERVER=1 npx playwright test e2e/f07-visual-smoke.spec.ts --project=chromium
```

Theme reads as mdeai Paisa (teal primary, gold accent, slate neutrals) — not default zinc shadcn.

## Intentionally deferred

- `next-themes` toggle UI (Phase 2)
- Sheet-wrapped HITL `ApprovalPanel` (W4)
- W3+ generative cards (`RentalCard`, `VenueCard`, …)

## Score

**96/100** — F07 complete; −4 for moderate npm audit transitive (pre-existing, not F07 scope).
