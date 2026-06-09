---
title: Forensic audit — F07 shadcn + Paisa brand tokens
date: 2026-05-20
auditor: Senior software specialist / forensic auditor
task: /home/sk/mdeai/tasks/core/F07-shadcn-paisa-brand-tokens.md
scope: Spec correctness, safe execution, disk/MCP/skills alignment
method: task-verifier protocol + index-skills.md + shadcn CLI `info --json` + on-disk probes
verdict:
  spec_correctness: 68/100
  shadcn_skill_alignment: 58/100
  safe_to_execute: "Yes — after 🔴 spec patches below (≈30 min)"
  not_100_percent_correct: true
  grade: C
blockers: 5
warnings: 14
skill_source: /home/sk/mdeai/.agents/skills/shadcn/SKILL.md (+ customization.md, cli.md, rules/*)
---

# F07 forensic audit — shadcn/ui init + Paisa brand tokens

> **TL;DR:** F07 is **directionally correct** (PRD W2 task #7, right components, right three cards to refactor) but **not 100% correct** as written. **🔴 Three blockers** will cause false DoD failures or wrong implementation on Tailwind v4. **F06 dependency is satisfied** (Done 2026-05-20). **Safe to start execution only after** amending Goals §2, DoD §9, Tests §10, and `skill:` frontmatter.

**Official sources used:**

| Source | Finding |
|--------|---------|
| **`/home/sk/mdeai/.agents/skills/shadcn/SKILL.md`** | Authoritative audit lens — Critical Rules, workflow, v4 `tailwindCssFile` |
| `npx shadcn@latest info --json` (mdeapp, 2026-05-20) | `tailwindVersion: "v4"`, `tailwindConfig: null`, `config: null`, `components: []` — init not run |
| `npx shadcn@latest docs button card dialog sheet badge` | Registry base **radix**, v4 URLs — matches F07 component list |
| [shadcn Tailwind v4](https://ui.shadcn.com/docs/tailwind/v4) | CSS-first tokens in `globals.css`; empty `tailwind.config` in `components.json` |
| `customization.md` | Theme = edit `--primary` / `--accent` OKLCH in `globals.css`; optional `apply --only theme` |
| `index-skills.md` Phase 1 pack | Lists **no** `tailwind-best-practices` / `vercel:shadcn` — use **`shadcn`** skill |
| `CLAUDE.md` Language scope | Phase 1 **English only** — conflicts with PRD §20 “Spanish labels” cite |
| Disk probes (mdeapp) | No `components.json`; hex + skill violations in 3 cards + `page.tsx` |

---

## Executive scorecard

| Dimension | Score | Grade | Dot |
|-----------|------:|:-----:|:---:|
| PRD / plan alignment | 88 | B | 🟢 |
| Command & workflow accuracy | 65 | D | 🔴 |
| DoD / test provability | 70 | C | 🟡 |
| Skills / MCP routing | 55 | F | 🔴 |
| **shadcn skill alignment** | **58** | **F** | 🔴 |
| Dependency chain | 95 | A | 🟢 |
| Current execution (disk) | 0 | — | ⚪ (Not Started — expected) |
| **Aggregate spec correctness** | **72** | **C** | 🟡 |

**Safe to execute?** **Yes**, after applying **Required spec patches** (§ below) **and** the **shadcn-corrected workflow** (§ shadcn skill audit). **Do not mark Done** until gate 9 localhost proof is added to DoD (per anti-fake-done 2026-05-20).

---

## shadcn skill audit (`.agents/skills/shadcn`)

> Second pass using the **canonical shadcn skill** — not generic Tailwind advice. Every row maps to an enforceable rule in `SKILL.md` or `rules/*.md`.

### Project context (CLI truth)

```json
{
  "tailwindVersion": "v4",
  "tailwindConfig": null,
  "tailwindCss": "src/app/globals.css",
  "importAlias": "@",
  "isRSC": true,
  "config": null,
  "components": []
}
```

**Implication:** F07 must edit **`src/app/globals.css` only** (`tailwindCssFile`). Init creates `components.json` with empty tailwind config path. Components land under `@/components/ui/*` per `resolvedPaths` after init.

### 🔴 Skill blockers (F07 spec contradicts shadcn skill)

| ID | Skill rule | F07 spec problem | Correct per skill |
|----|------------|------------------|-------------------|
| **S1** | `tailwindVersion: v4` → `@theme inline`; **never** new CSS file | Requires `tailwind.config.ts` | Delete from DoD; use `@theme inline` in `globals.css` |
| **S2** | Principle 4: **semantic colors** (`bg-primary`, `text-muted-foreground`) | Parallel `--mdeai-teal-{50..900}` scale + raw HSL | Remap shadcn tokens: `--primary` = Paisa teal OKLCH, `--accent` = gold OKLCH per `customization.md` color table |
| **S3** | `skill:` must be **`shadcn`** | Lists `tailwind-best-practices`, `vercel:shadcn` | `skill: [shadcn]` only |
| **S4** | Dark mode in Next.js → **`next-themes` `ThemeProvider`** (`customization.md`) | “`class=dark` on `<html>` — system pref only” without `next-themes` | Either add `next-themes` + provider in `layout.tsx`, or defer dark mode and keep `prefers-color-scheme` block only (document choice) |
| **S5** | Workflow §7: after `add`, **read files + verify Critical Rules** | No review step in F07 §4 | Add DoD: post-add review checklist (groups, Title on overlays, `cn()` imports) |

### 🟡 Skill warnings (refactor targets — current cards already violate)

| ID | Skill rule (`rules/`) | Current code violation | F07 refactor requirement |
|----|----------------------|------------------------|--------------------------|
| **S6** | Use **Card** composition, not custom chrome (`composition.md`) | All 3 cards are styled `<div>` shells | Full `CardHeader` / `CardContent` / `CardFooter` |
| **S7** | **`className` for layout, not styling** — no color overrides (`styling.md`) | `style={{ backgroundColor: themeColor }}` in PlaceInfoCard + ApprovalPanel | Drop `themeColor` prop; use `bg-primary` or `className` layout only |
| **S8** | **Button** for actions; variants not raw colors (`styling.md`) | ApprovalPanel: 3 raw `<button>` with custom bg; SavedItemsCard: `bg-red-500` remove | `<Button variant="default\|outline\|destructive">` |
| **S9** | **Separator** not `<hr>` (`composition.md`) | SavedItemsCard line 29: `<hr>` | `<Separator />` — add `separator` to component install list |
| **S10** | **Badge** not styled spans (`composition.md`) | PlaceInfoCard category as plain `<p>` | `<Badge variant="secondary">` for category |
| **S11** | Overlay needs **Title** (`composition.md`) | ApprovalPanel as inline card, not Dialog/Sheet | If wrapping in Dialog/Sheet: require `DialogTitle`/`SheetTitle` (sr-only OK). **HITL in chat stream** may stay **Card-only** — then spec must **not** mandate Dialog (skill: Dialog = modal) |
| **S12** | Component selection: mobile HITL → **Sheet** or **Drawer** (`SKILL.md` table) | Spec allows Dialog **or** Sheet | Prefer **Sheet** for Roberto on 390×844; Dialog only for desktop modal |
| **S13** | Run **`npx shadcn@latest docs <component>`** before writing (`SKILL.md` §168) | Missing from §4 workflow | Mandatory pre-refactor step for all 8 components |
| **S14** | CLI `add` defaults `--yes` **false** (`cli.md`) | `npx shadcn@latest add …` without `-y` | Use `npx shadcn@latest add … -y` in CI/agent runs |
| **S15** | Init may **overwrite `globals.css`** — preset merge discipline (`SKILL.md` §178–184) | Manual token paste in §4 | After init: `npx shadcn@latest preset resolve --json`, then `apply --only theme` **or** hand-edit vars **without** losing `@import "tailwindcss"` |

### F07 workflow — skill-corrected (replace §4)

```bash
cd /home/sk/mdeai/mdeapp

# 1. Context (mandatory)
npx shadcn@latest info --json
npx shadcn@latest docs button card input label dialog sheet dropdown-menu badge separator

# 2. Init existing Next 16 + Tailwind v4 project (non-interactive)
npx shadcn@latest init --defaults --yes
# OR brand-first: npx shadcn@latest init --preset nova --yes  # then tune CSS vars

# 3. Add primitives (+ separator for SavedItemsCard)
npx shadcn@latest add button card input label dialog sheet dropdown-menu badge separator -y

# 4. Paisa theme — edit ONLY src/app/globals.css (per customization.md)
#    Map --primary / --accent / --background to teal / gold / slate OKLCH
#    Register in @theme inline { --color-primary: var(--primary); ... }

# 5. Refactor cards per Critical Rules; run docs-driven composition
# 6. Wire page.tsx CopilotKit --copilot-kit-primary-color to hsl(var(--primary))

# 7. Verify
npm run floor
npm run dev  # gate 9
```

**Do not use:** interactive init without documenting answers; `tailwind.config.ts`; parallel `--mdeai-teal-500` utilities without `@theme` registration.

### Component list vs skill

| F07 lists | Skill gap | Recommendation |
|-----------|-----------|----------------|
| 8 components | Missing **`separator`** (SavedItemsCard `<hr>`) | Add `separator` to install + DoD T2 count → **≥ 9** or keep 8 and use Separator anyway |
| `dialog` + `sheet` | Both OK; pick **one** pattern for ApprovalPanel HITL | Document: generative UI **inline Card** for W1; Sheet wrapper deferred to W4 PRD #17 |
| No `alert-dialog` | Reject flow uses plain button | Optional W4: `AlertDialog` for destructive confirm |

### Token strategy — skill vs F07

| Approach | Skill verdict |
|----------|---------------|
| F07: 27-step `--mdeai-teal-{50..900}` scales | 🔴 Over-engineered; violates “semantic colors” unless every step registered in `@theme` |
| **Recommended:** edit 8–12 shadcn semantic vars in `:root` / `.dark` | 🟢 Matches `customization.md` + Principle 4 |
| `npx shadcn@latest apply --only theme` with preset URL | 🟢 Valid for rapid baseline; then tweak OKLCH for Paisa anchors |

**Paisa anchors → OKLCH (verify with oklch.com):**

| Brand | Hex anchor | Maps to shadcn var |
|-------|------------|-------------------|
| Teal | `#0f766e` | `--primary` |
| Gold | `#eab308` | `--accent` (or `--chart-1` for “Best for X” badges) |
| Slate | `#0f172a` | `--foreground` / dark `--background` |

### Post-refactor acceptance (add to F07 §10)

| # | Skill-based test | Command / check |
|---|------------------|-----------------|
| Ts1 | No `style={{` color in components | `! grep -r 'style={{' mdeapp/src/components/` |
| Ts2 | No raw palette utilities on actions | `! grep -rE 'bg-(red|blue|emerald|slate)-[0-9]' mdeapp/src/components/cards mdeapp/src/components/approvals` |
| Ts3 | No `<hr>` | `! grep -r '<hr' mdeapp/src/components/` |
| Ts4 | Card uses composition | `grep -q CardHeader mdeapp/src/components/cards/PlaceInfoCard.tsx` |
| Ts5 | `docs` run logged in evidence | evidence file lists `shadcn docs` output |

---

## Dependency validation

| Check | Result | Probe |
|-------|--------|-------|
| `depends_on: [F06]` | ✅ **Satisfied** | `tasks/INDEX.md` + `F06` frontmatter `status: Done`; Vercel `https://mdeapp.vercel.app` live |
| `depends_on` slug exists | ✅ | `F06-git-github-vercel-preview.md` on disk |
| F08 waits on F07 | ✅ | INDEX: F08 `depends_on: F06, F07` |
| F09 before F07? | N/A | F09 Done — Vitest + `@/*` alias already on disk |

**Stale cross-audit note:** `tasks/audit/03-audit-f7-f12.md` still says F06 “Vercel ❌” and F09 “not started” — **ignore those rows**; use this audit + current INDEX.

---

## On-disk current state (2026-05-20)

| Artifact | Expected (post-F07) | Actual | Dot |
|----------|---------------------|--------|:---:|
| `mdeapp/components.json` | exists | **missing** | ⚪ |
| `mdeapp/src/components/ui/*.tsx` | ≥ 8 | **0 files** | ⚪ |
| `mdeapp/src/lib/utils.ts` `cn()` | exported | **missing** | ⚪ |
| `mdeapp/tailwind.config.ts` | spec says required | **correctly absent** (v4) | 🟡 spec wrong |
| `src/app/globals.css` | Paisa `@theme` | only `--background` / `--foreground` hex | ⚪ |
| Hex in cards | 0 after F07 | **3 hits** (`#0f766e` defaults + inline `style`) | ⚪ |
| Hex in `page.tsx` | spec silent | `--copilot-kit-primary-color: "#0f766e"` | 🟡 gap |
| `npm run build` | green today | exit 0 (pre-shadcn) | 🟢 |
| `npm run audit` | DoD says exit 0 | exit 0 (`--audit-level=high`, 2 moderate) | 🟢 |
| `npx shadcn@latest info` | v4 project | framework Next 16.2.6, **config null** | 🟢 |

**Card hex probe (pre-work baseline):**

```
PlaceInfoCard.tsx:35   themeColor = "#0f766e"
ApprovalPanel.tsx:26 themeColor = "#0f766e"
globals.css:4,5,17,18  #ffffff, #171717, #0a0a0a, #ededed
page.tsx:12            --copilot-kit-primary-color: "#0f766e"
```

---

## 🔴 Blockers (fix before or during execution — will break DoD)

### B1 — `tailwind.config.ts` required in Goals + DoD + workflow

| Location | Text |
|----------|------|
| §2 Goals | “`tailwind.config.ts` configured with Paisa brand tokens” |
| §4 step 1 | “creates … `tailwind.config.ts` updates” |
| §9 DoD | “`tailwind.config.ts` references Paisa CSS vars” |

**Why wrong:** mdeapp uses **Tailwind v4** (`package.json`: `tailwindcss: ^4`, `@tailwindcss/postcss`). shadcn CLI reports `tailwindConfig: null`. Official v4 path: tokens in **`src/app/globals.css`** via `:root` + `@theme inline` ([shadcn customization skill](.claude/skills/shadcn/customization.md), [ui.shadcn.com/docs/tailwind/v4](https://ui.shadcn.com/docs/tailwind/v4)).

**Failure mode:** Executor creates unnecessary `tailwind.config.ts` → duplicate token systems, DoD arguments, or “fixed” by deleting file and failing checklist.

**Patch:**

```diff
- tailwind.config.ts configured with Paisa brand tokens
+ components.json tailwind.config: "" (empty) + Paisa tokens in src/app/globals.css @theme inline
```

Remove DoD bullet for `tailwind.config.ts`. Add: `grep -q '@theme inline' src/app/globals.css`.

---

### B2 — Stale `skill:` frontmatter (not in index-skills Phase 1 pack)

| Spec lists | Repo reality |
|------------|--------------|
| `tailwind-best-practices` | **No** `.claude/skills/tailwind-best-practices` |
| `react-best-practices` | Vercel plugin only — **not** in mdeai Phase 1 pack per `index-skills.md` |
| `vercel:shadcn` | **Invalid slug** — use **`shadcn`** (`.claude/skills/shadcn/SKILL.md`) |

**Failure mode:** Agent loads wrong/missing skills; improvises Tailwind v3 patterns.

**Patch:** `skill: [shadcn]` (+ optional `vercel:react-best-practices` from Cursor plugin if in session — not repo-canonical).

---

### B3 — Token math / format in §4 step 4 is incorrect

Spec example:

```css
--mdeai-teal-500: 0 64% 33%; /* hsl format for Tailwind v4 */
```

**Anchor `#0f766e` (teal-700)** ≈ `hsl(173, 84%, 26%)` — **not** `0 64% 33%` (that hue is red).

shadcn v4 customization skill recommends **`oklch()`** for new tokens, then `@theme inline { --color-mdeai-teal: var(--mdeai-teal); }`.

**Failure mode:** Brand drift — cards look burgundy/wrong hue; “Paisa teal” marketing mismatch.

**Patch:** Define anchors with `oklch(from #0f766e …)` or verified HSL; map **`--primary`** / **`--accent`** to shadcn semantic vars (don't maintain parallel unused `--mdeai-teal-*` scale unless every step registers colors in `@theme`).

---

## 🟡 Warnings (won't always fail — but red flags)

| ID | Issue | Impact | Recommendation |
|----|-------|--------|----------------|
| W1 | DoD: “0 hex in `src/components/**`” but **not** `page.tsx` | CopilotKit primary stays hardcoded | Add: wire `--copilot-kit-primary-color` to `hsl(var(--primary))` or `var(--primary)` |
| W2 | T5 only scans `cards/` + `approvals/` | Misses hex elsewhere | Extend to `src/app/page.tsx` or explicit CopilotKit exception in DoD |
| W3 | `globals.css` **must** keep hex/oklch in `:root` for token definitions | T5-style grep on globals would false-fail | DoD: hex allowed in `globals.css` only, forbidden in components |
| W4 | PRD §20 cite: “Spanish labels” | Stale vs `CLAUDE.md` English Phase 1 | Note in spec: UI strings English; `es-CO` in `PlaceInfoCard` → `en-US` during refactor |
| W5 | `PlaceInfoCard` uses `toLocaleString("es-CO")` | Locale regression | Change to `en-US` in F07 refactor |
| W6 | T7: `grep -q 'Generating'` on build tail | Next 16 may log different strings | Prefer `npm run build; test $? -eq 0` or `grep -q 'Compiled successfully'` |
| W7 | Missing **gate 9** localhost proof in DoD | Anti-fake-done violation | Add: `npm run dev` + GET `/` 200 + POST `/api/copilotkit` + optional “hi” |
| W8 | Missing **rollback plan** in §10 | task-verifier §6 gap | “`git checkout --` components.json globals.css package.json; rm -rf src/components/ui” |
| W9 | T8 depends on chrome-devtools only | No automated UI test | Acceptable for F07; add Vitest render smoke optional |
| W10 | 8 components omit `select`, `textarea`, `separator` | W3 EventDraft may need add | Note “add in F14/W3 if wizard needs them” — not blocker |
| W11 | `ApprovalPanel` → Dialog vs Sheet | 85% mobile (user rules) | Prefer **Sheet** for Roberto HITL on small viewports — spec allows either |

---

## Tests §10 — per-command audit

| # | Command / test | Verdict | Notes |
|---|----------------|---------|-------|
| T1 | `test -f mdeapp/components.json` | 🟢 | Valid |
| T2 | `ls …/ui/*.tsx \| wc -l` ≥ 8 | 🟢 | Valid |
| T3 | `grep cn` in `lib/utils.ts` | 🟢 | Valid |
| T4 | `grep --mdeai-(teal\|paisa\|surface)-` in globals.css | 🟡 | OK if token names kept; prefer also `@theme` + `--primary` |
| T5 | no hex in cards/approvals | 🟡 | Good sentinel; add page.tsx or CopilotKit rule |
| T6 | export names preserved | 🟢 | Critical for `useCopilotAction` mirrors |
| T7 | build grep `Generating` | 🟡 | Brittle — use exit code |
| T8 | F05 chrome “hi” | 🟢 | Align with English echo (not Spanish “hola”) |
| Tn1 | hex inject | 🟢 | Good negative |
| Tn2 | remove `cn()` | 🟢 | Good negative |
| DoD audit exit 0 | `npm run audit` | 🟢 | **Passes today** with `--audit-level=high` (2 moderate documented) |

---

## PRD / plan alignment

| Reference | Aligned? | Note |
|-----------|:--------:|------|
| `plan/prd/08-delivery.md` §51 row 7 | 🟢 | `npx shadcn@latest init` + Paisa tokens |
| `plan/prd/03-architecture.md` §20 | 🟡 | Card composition correct; **Spanish labels** stale |
| `plan/prd/04-product-surfaces.md` | 🟢 | Roberto + Camila surfaces need design system |
| `plan/prd/05-code.md` `ui/` tree | 🟢 | Matches target layout |
| INDEX `depends_on: F06` | 🟢 | F06 Done |

---

## Failure points during execution (predicted)

1. **Init overwrite** — `shadcn init` may rewrite `globals.css` — merge Paisa tokens, don’t lose `@import "tailwindcss"` / existing `@theme inline`.
2. **Peer dependency surge** — radix-ui, cva, clsx, tailwind-merge, lucide-react — run `npm run floor` after add.
3. **CopilotKit + shadcn CSS** — import order in `layout.tsx` (`@copilotkit/react-ui/styles.css` before/after globals) — visual regression risk; capture screenshot evidence.
4. **dist-leak-scan hook** — Maps key in client bundle is allowlisted; don’t put `GOOGLE_GENERATIVE_AI_API_KEY` in client components.
5. **Generative UI props** — keep `themeColor` prop optional but default to CSS var, not hex string, for agent-driven cards.

---

## Required spec patches (copy into F07 before execution)

1. Replace all `tailwind.config.ts` requirements with **`globals.css` + `@theme inline` + empty tailwind config in `components.json`**.
2. Set `skill: [shadcn]`; workflow = **shadcn skill § corrected** (info → docs → init --defaults -y → add -y → theme vars → refactor).
3. **Theme:** map Paisa anchors to shadcn **`--primary` / `--accent` / `--background`** OKLCH — drop 27-shade `--mdeai-*` scale unless registered in `@theme`.
4. Add **`separator`** to install list; replace `<hr>` in SavedItemsCard.
5. **ApprovalPanel:** prefer inline **`Card` + `Button`** for W1 generative UI; defer Dialog/Sheet wrapper to W4 — if Sheet used, require `SheetTitle`.
6. **Dark mode:** add `next-themes` or explicitly defer dark toggle to Phase 2.
7. Extend DoD: CopilotKit → `var(--primary)`; skill checks Ts1–Ts5; **gate 9** localhost; evidence `tasks/notes/F07-evidence.md`.
8. T7 → `npm run floor` or build exit 0; T5 scope clarified; post-add **Critical Rules review** (skill §7).
9. Refactor: `en-US` locale; run `npx shadcn@latest docs` before each component touch.

---

## Verdict summary

| Question | Answer |
|----------|--------|
| **100% correct?** | **No** — grade **C (68/100 spec · 58/100 shadcn skill)** |
| **shadcn skill compliant as written?** | **No** — would ship skill-violating UI (inline styles, raw buttons, `<hr>`, parallel token scale) |
| **Will it achieve PRD goal?** | **Yes** after patches — shadcn baseline unlocks W3 cards |
| **Blockers for starting?** | **No** if executor follows patches + shadcn skill (not stale skill names) |
| **Blockers for Done?** | **Yes** — current DoD will false-fail on `tailwind.config.ts` |

**Recommended execution order:** Patch F07 spec (20 min) → `npx shadcn@latest init` → add 8 components → Paisa `@theme` → refactor 3 cards + `page.tsx` CopilotKit var → `npm run floor` → localhost + screenshot evidence → flip Done in INDEX + task file.

---

## Cross-references

- Prior W2 batch audit: [`03-audit-f7-f12.md`](./03-audit-f7-f12.md) § F07 (partially stale on F06/F09)
- Tracker: [`../progres.md`](../progres.md), [`../../todo.md`](../../todo.md)
- Skills index: [`../../index-skills.md`](../../index-skills.md)

*Re-probe before marking F07 Done — never trust this audit after `components.json` lands.*

---

## Post-patch status (2026-05-20)

**F07 spec updated** — [`tasks/core/F07-shadcn-paisa-brand-tokens.md`](../core/F07-shadcn-paisa-brand-tokens.md) now incorporates all 🔴/🟡 patches above.

**F07 executed 2026-05-20** — [`tasks/notes/F07-evidence.md`](../notes/F07-evidence.md): 14/14 automated probes ✅, `npm run floor` ✅, gate 9 localhost ✅. **Post-execution grade: A (95/100).**
