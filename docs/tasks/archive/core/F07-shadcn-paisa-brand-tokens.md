---
id: F07
title: shadcn/ui init + Paisa brand tokens
status: Done
completed_at: 2026-05-20
test_pass_rate: 14/14 automated + gate 9 localhost
priority: P1
phase: W2 — Day 1
effort: 2-3h (init + theme + 9 components + card refactors)
owner: claude
depends_on: [F06]
skill: [shadcn]
evidence: /home/sk/mdeai/tasks/notes/F07-evidence.md
audited_against: /home/sk/mdeai/tasks/audit/07-task-audit.md
verified_against:
  - /home/sk/mdeai/.agents/skills/shadcn/SKILL.md
  - /home/sk/mdeai/.agents/skills/shadcn/customization.md
  - https://ui.shadcn.com/docs/tailwind/v4
  - /home/sk/mdeai/plan/prd/03-architecture.md §20 (Generative UI architecture)
  - /home/sk/mdeai/plan/prd/08-delivery.md §51 W2 task 7
  - mdeapp: Tailwind v4 (`tailwindcss` ^4), Next 16.2.6, `npx shadcn@latest info` → `tailwindConfig: null`
---

# F07 — shadcn/ui init + Paisa brand tokens

## 1. Purpose

Phase 1 ships product surfaces (W3–W7: Roberto host event, Camila rentals + chat). Per PRD §20, every card primitive is a **composition of shadcn primitives + CopilotKit `useCopilotAction({ render })`**. F07 lands the shadcn baseline and maps mdeai’s **Paisa** palette onto shadcn **semantic CSS variables** (teal primary, gold accent, slate neutrals), then refactors the three amended-demo cards (`PlaceInfoCard`, `SavedItemsCard`, `ApprovalPanel`) to follow the shadcn skill Critical Rules.

**Phase 1 UI copy is English** (`CLAUDE.md` Language scope). PRD §20 “Spanish labels” applies at W3+ surfaces, not this task.

## 2. Goals

- `npx shadcn@latest init` completes in `mdeapp/` → `components.json` with **empty** `tailwind.config` path (Tailwind v4 CSS-first)
- `src/lib/utils.ts` exports `cn()` (installed by shadcn)
- **9** baseline components: `button`, `card`, `input`, `label`, `dialog`, `sheet`, `dropdown-menu`, `badge`, **`separator`**
- **Paisa theme** in `src/app/globals.css` only (`tailwindCssFile` per CLI):
  - Map brand anchors to shadcn vars: `--primary` (teal `#0f766e`), `--accent` (gold `#eab308`), `--foreground` / `--background` (slate family)
  - Use **OKLCH** in `:root` and `.dark` per `customization.md`
  - Register utilities via `@theme inline { --color-primary: var(--primary); … }`
  - **Do not** add `tailwind.config.ts` or a parallel `--mdeai-teal-{50..900}` scale
- Refactor 3 cards (shadcn Critical Rules):
  - `PlaceInfoCard` → full `<Card>` + `<Badge>` + semantic `bg-primary` (no `style={{ backgroundColor }}`, no `themeColor` hex prop)
  - `SavedItemsCard` → `<Card>` + nested rows + `<Button variant="destructive" size="icon">` + `<Separator />` (no `<hr>`, no `bg-red-500`)
  - `ApprovalPanel` → inline **`<Card>` + 3 `<Button>`** for W1 generative UI (Approve / Edit / Reject). **Do not** wrap in Dialog/Sheet here — W4 PRD #17 adds Sheet + `renderAndWaitForResponse` HITL chrome
- `src/app/page.tsx`: `--copilot-kit-primary-color` uses `hsl(var(--primary))` or equivalent CSS var (no hex literal)
- `npm run floor` exits 0; localhost chat smoke unchanged (gate 9)
- **Dark mode:** keep existing `@media (prefers-color-scheme: dark)` in `globals.css`. **Defer** `next-themes` toggle to Phase 2

## 3. Features (what the user gets)

- **Sofía (dev):** `import { Button } from "@/components/ui/button"` works; W3 cards compose from installed primitives
- **Camila / Roberto:** consistent mdeai-branded generative UI in chat (teal primary, readable contrast)

## 4. Workflows

**Read first:** `/home/sk/mdeai/.agents/skills/shadcn/SKILL.md` (Critical Rules + workflow §168–177).

### Step 0 — Pre-flight

```bash
cd /home/sk/mdeai/mdeapp
node -p "require('./package.json').devDependencies.tailwindcss"   # expect ^4
npx shadcn@latest info --json   # expect tailwindVersion v4, tailwindConfig null, components []
```

### Step 1 — Docs (mandatory before coding)

```bash
npx shadcn@latest docs button card input label dialog sheet dropdown-menu badge separator
```

Save command output in `tasks/notes/F07-evidence.md`.

### Step 2 — Init (non-interactive)

```bash
npx shadcn@latest init --defaults --yes
```

Expected: `components.json`, updates to `src/app/globals.css` (preserve `@import "tailwindcss"`), `src/lib/utils.ts`, empty tailwind config in JSON.

**Do not** overwrite a hand-tuned `.env.local`. **Do not** create `tailwind.config.ts`.

### Step 3 — Add components

```bash
npx shadcn@latest add button card input label dialog sheet dropdown-menu badge separator -y
```

### Step 4 — Paisa theme (`src/app/globals.css` only)

After init, edit **only** `src/app/globals.css`. Merge with CLI output — do not delete `@import "tailwindcss"` or break existing `@theme inline` font vars.

Example shape (tune OKLCH with [oklch.com](https://oklch.com) if needed):

```css
:root {
  --background: oklch(0.985 0.002 247);
  --foreground: oklch(0.208 0.042 265);       /* slate anchor ~ #0f172a */
  --card: oklch(1 0 0);
  --card-foreground: var(--foreground);
  --primary: oklch(0.508 0.118 175);          /* teal anchor ~ #0f766e */
  --primary-foreground: oklch(0.985 0.002 247);
  --accent: oklch(0.795 0.184 86);             /* gold anchor ~ #eab308 */
  --accent-foreground: oklch(0.208 0.042 265);
  --muted: oklch(0.968 0.007 247);
  --muted-foreground: oklch(0.554 0.046 257);
  --border: oklch(0.929 0.013 255);
  --ring: var(--primary);
}

.dark {
  --background: oklch(0.208 0.042 265);
  --foreground: oklch(0.985 0.002 247);
  --card: oklch(0.279 0.041 260);
  --card-foreground: var(--foreground);
  --primary: oklch(0.696 0.17 175);
  --primary-foreground: oklch(0.208 0.042 265);
  --accent: oklch(0.795 0.184 86);
  --accent-foreground: oklch(0.208 0.042 265);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-ring: var(--ring);
  /* keep existing --font-sans / --font-mono from init */
}
```

Optional chart token for “Best for X” badges later: `--chart-1: var(--accent);`

### Step 5 — Refactor cards (Critical Rules checklist)

| File | Required changes |
|------|------------------|
| `PlaceInfoCard.tsx` | `Card`/`CardHeader`/`CardContent`; `Badge` for category; remove `themeColor` + inline `style`; `toLocaleString("en-US")` for COP |
| `SavedItemsCard.tsx` | Outer `Card`; `Separator` not `<hr>`; remove buttons → `Button`; no raw `bg-slate-*` / `bg-red-*` on actions — use `bg-muted`, `variant="destructive"` |
| `ApprovalPanel.tsx` | `Card` shell; three `Button` variants (`default`, `outline`, `destructive` or `secondary`); remove `themeColor` + inline `style`; keep `respond` / state machine |

**Remove** default props like `themeColor = "#0f766e"`. Agents must not pass hex — cards use semantic tokens only.

### Step 6 — CopilotKit primary color

In `src/app/page.tsx`, replace hex with CSS variable, e.g.:

```tsx
style={{ "--copilot-kit-primary-color": "var(--primary)" } as CopilotKitCSSProperties}
```

(If CopilotKit requires a resolved color at runtime, use `hsl(from var(--primary) h s l)` only after verifying in browser — prefer `var(--primary)` first.)

### Step 7 — Post-add review (skill §7)

For each file under `src/components/ui/`:

- [ ] Imports use `@/` alias from `components.json`
- [ ] Overlay components unused in F07 cards (dialog/sheet installed for W3+ only)
- [ ] No `space-y-*` in refactored cards — use `flex flex-col gap-*`
- [ ] Icons from `lucide-react` per `iconLibrary` in `shadcn info`

### Step 8 — Verify

```bash
cd /home/sk/mdeai/mdeapp
npm run floor
npm run dev
# GET http://localhost:3001/ → 200
# POST http://localhost:3001/api/copilotkit {} → 400 (alive)
# Sidebar: type "hi" → English Gemini reply (F05 parity)
```

Screenshot → `tasks/notes/F07-shadcn-evidence.png`. Log probes in `tasks/notes/F07-evidence.md`.

### Rollback

```bash
cd /home/sk/mdeai/mdeapp
git checkout -- components.json src/app/globals.css src/lib/utils.ts package.json package-lock.json
git checkout -- src/components/cards src/components/approvals src/app/page.tsx
rm -rf src/components/ui
npm install
```

## 5. User journeys

- **Sofía (dev):** non-interactive init + add in ~20 min; tokens in one CSS file; W3 `EventDraftCard` = Card + Input + Badge
- **Lucía (QA):** tab through ApprovalPanel buttons; contrast on `bg-primary`; floor green; localhost + Vercel prod shell load

## 6. Agents

None — pure frontend.

## 7. Integrations

| Integration | Purpose |
|---|---|
| `npx shadcn@latest` | init, docs, add (only documented flags: `--defaults`, `--yes`, `-y`) |
| Tailwind v4 + `@tailwindcss/postcss` | Already in `mdeapp` — CSS-first tokens |
| `clsx` + `tailwind-merge` + `cva` | Via shadcn install |
| `lucide-react` | Icons per CLI `iconLibrary` |
| `@copilotkit/react-ui` | Keep `styles.css` import in `layout.tsx` after `globals.css` |

## 8. Summary

Initialize shadcn on the existing Next 16 + Tailwind v4 app, map Paisa colors to shadcn semantic OKLCH variables in `globals.css`, install nine primitives, refactor three generative-UI cards to Card/Button/Badge/Separator patterns, and wire CopilotKit primary to `--primary`. Done when `npm run floor` passes and localhost chat still echoes “hi”.

## 9. Definition of Done

- [x] `components.json` exists; `tailwind.config` field empty or absent in JSON (v4)
- [x] `src/components/ui/{button,card,input,label,dialog,sheet,dropdown-menu,badge,separator}.tsx` exist
- [x] `src/lib/utils.ts` exports `cn()`
- [x] `src/app/globals.css` sets `--primary` / `--accent` OKLCH + `@theme inline` color registrations (light + `.dark`)
- [x] **No** `tailwind.config.ts` at repo root or in `mdeapp/`
- [x] Three cards refactored; exports unchanged (`PlaceInfoCard`, `SavedItemsCard`, `ApprovalPanel`)
- [x] No hex in `src/components/cards/` or `src/components/approvals/` (T5)
- [x] No `style={{` with color in `src/components/**` (Ts1)
- [x] `page.tsx` CopilotKit primary uses CSS var, not `#0f766e` (T9)
- [x] `npm run floor` exit 0 (lint + typecheck + build + test + audit)
- [x] **Gate 9:** `npm run dev` → GET `/` 200, POST `/api/copilotkit` alive, sidebar “hi” → reply
- [x] Evidence: `tasks/notes/F07-evidence.md` (screenshot optional)
- [x] `tasks/INDEX.md` row `F07` = Done matches this file frontmatter

## 10. Tests

Run from repo root or `mdeapp/` as indicated.

### Acceptance tests

| # | Test | Command | Expected |
|---|---|---|---|
| T1 | shadcn init | `test -f mdeapp/components.json && echo OK` | `OK` |
| T2 | ≥ 9 UI components | `ls mdeapp/src/components/ui/*.tsx 2>/dev/null \| wc -l` | `≥ 9` |
| T3 | `cn()` helper | `grep -q 'export function cn' mdeapp/src/lib/utils.ts && echo OK` | `OK` |
| T4 | Theme in globals | `grep -q '@theme inline' mdeapp/src/app/globals.css && grep -q -- '--primary:' mdeapp/src/app/globals.css && echo OK` | `OK` |
| T5 | No hex in card dirs | `! grep -rE '#[0-9a-fA-F]{3,8}' mdeapp/src/components/cards mdeapp/src/components/approvals && echo OK` | `OK` |
| T6 | Export names | `grep -q 'export function PlaceInfoCard' mdeapp/src/components/cards/PlaceInfoCard.tsx && grep -q 'export function SavedItemsCard' mdeapp/src/components/cards/SavedItemsCard.tsx && grep -q 'export function ApprovalPanel' mdeapp/src/components/approvals/ApprovalPanel.tsx && echo OK` | `OK` |
| T7 | Floor green | `cd mdeapp && npm run floor; echo exit:$?` | `exit:0` |
| T8 | v4 no tailwind.config | `test ! -f mdeapp/tailwind.config.ts && test ! -f mdeapp/tailwind.config.js && echo OK` | `OK` |
| T9 | CopilotKit var | `! grep -q '#0f766e' mdeapp/src/app/page.tsx && grep -q 'copilot-kit-primary-color' mdeapp/src/app/page.tsx && echo OK` | `OK` |

### shadcn skill sentinels (Ts)

| # | Test | Command | Expected |
|---|---|---|---|
| Ts1 | No inline style colors | `! grep -rE 'style=\{\{[^}]*background|style=\{\{[^}]*color' mdeapp/src/components/cards mdeapp/src/components/approvals && echo OK` | `OK` |
| Ts2 | No raw palette on actions | `! grep -rE 'bg-(red|blue|emerald)-[0-9]' mdeapp/src/components/cards mdeapp/src/components/approvals && echo OK` | `OK` |
| Ts3 | No `<hr>` | `! grep -r '<hr' mdeapp/src/components/ && echo OK` | `OK` |
| Ts4 | Card composition | `grep -q 'CardHeader\|CardContent' mdeapp/src/components/cards/PlaceInfoCard.tsx && echo OK` | `OK` |
| Ts5 | Docs run recorded | `grep -q 'shadcn@latest docs' tasks/notes/F07-evidence.md && echo OK` | `OK` |

### Manual / localhost (gate 9)

| # | Test | How | Expected |
|---|---|---|---|
| Tm1 | Chat smoke | `npm run dev` → type **hi** in sidebar | English reply within 8s (F05 parity) |
| Tm2 | Visual | Screenshot localhost shell | Cards use teal primary; no regression |
| Tm3 | Prod sanity (optional) | `curl -s -o /dev/null -w '%{http_code}' https://mdeapp.vercel.app/` | `200` (after deploy of F07 commit) |

### Negative tests

| # | Inject | Expected |
|---|---|---|
| Tn1 | `style={{ color: '#ff0000' }}` in a card | Ts1 or T5 fails |
| Tn2 | Delete `cn()` from `utils.ts` | UI imports throw at build |

### Evidence (`tasks/notes/F07-evidence.md`)

- `npx shadcn@latest info --json` output (before + after)
- `npx shadcn@latest docs …` output
- `components.json` excerpt (empty tailwind config)
- `globals.css` diff (OKLCH tokens)
- Card refactor diffs (3 files)
- `npm run floor` tail + gate 9 curl/log lines
- Screenshot path

## Notes / verification

- **Audit:** Forensic pass in [`tasks/audit/07-task-audit.md`](../audit/07-task-audit.md) — this spec incorporates all 🔴 patches (2026-05-20).
- **PRD §20:** W3+ cards (`RentalCard`, `VenueCard`, …) reuse same token + composition patterns.
- **Defer:** `next-themes` UI toggle (Phase 2); Sheet-wrapped HITL ApprovalPanel (W4 #17); `AlertDialog` on reject; responsive polish (W6+).
- **Hook:** Before `vercel deploy`, remove `mdeapp/.next` if `dist-leak-scan` blocks (dev turbopack cache) — not required for F07 Done (localhost gate 9 only).
