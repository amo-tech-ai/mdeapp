# design-sync NOTES — mdeapp

Repo-specific gotchas for syncing `src/components/ui` to Claude Design.

## Context
- This repo is a **Next.js 16 application**, NOT a publishable component library. No `dist/`, no
  `package.json` `main`/`module`/`exports`. The converter runs in **synth-entry mode** (bundles
  straight from `src/`). `shape: "package"`.
- Scope is deliberately **`src/components/ui` only** (21 shadcn-style primitives). The feature
  components under `src/components/**` (host, rentals, chat, maps…) are app/provider/Supabase-coupled
  and out of scope by user decision.
- Components are built on `@base-ui/react` primitives + `class-variance-authority` (cva) + `cn`
  (`src/lib/utils.ts`, clsx + tailwind-merge).

## CRITICAL: separate Claude Design project
- There is a pre-existing, RICH, hand-built `mdeai Design System` project
  (`c8dbf17a-1cb3-4e10-9a1d-8a29be18316b`) — full `ui_kits/`, `patterns/`, docs, screenshots.
  **DO NOT sync into it** — the reconciliation delete would wipe all of that. This sync targets a
  dedicated NEW project `mdeapp UI Primitives` (`8da446a8-8976-45ce-9e35-3b5929174d82`).

## Styling / CSS (the hard part)
- Styling is **Tailwind v4 utility classes** baked into className strings; design tokens (oklch) live
  in `src/app/globals.css` (`@theme inline` + `:root`/`.dark` custom properties). There is NO
  standalone compiled stylesheet — Tailwind generates CSS at `next build` time.
- `globals.css` imports: `tailwindcss`, `tw-animate-css`, `shadcn/tailwind.css`.
- Tooling available: `tailwindcss@4.3.0`, `@tailwindcss/node`, `@tailwindcss/postcss`,
  `@tailwindcss/oxide`. No `tailwindcss` CLI bin in node_modules/.bin.
- Plan: compile a standalone stylesheet from `globals.css` scanning `src/components/ui` + authored
  previews, emit to a file, point `cfg.cssEntry` at it. Without this the cards render unstyled.
- **CSS build is TWO steps** (run both before `package-build`): (1) Tailwind CLI compile
  `css-src.css → .cache/compiled.css`; (2) `node .design-sync/tag-framework-vars.mjs
  .design-sync/.cache/compiled.css`. Step 2 appends `/* @kind other */` to Tailwind
  framework-internal custom-property declarations (`--tw-*`, `--animate-*`, `--ease-*`,
  `--default-transition-*`, `--aspect-*`) so Claude Design's `check_design_system` stops flagging
  them as unclassifiable tokens. It ONLY tags — never removes them (utilities reference them at
  runtime; deleting breaks translate/transition/animate/aspect). Idempotent.
- `--font-serif` is intentionally bound to the sans stack (DESIGN.MD §3 is sans-only).

## Re-sync risks
- The compiled CSS is a build artifact of a content scan — if new utility classes appear in authored
  previews, recompile so the stylesheet covers them, or those classes render unstyled.
- Heavy/interactive primitives (Sonner, Sidebar, Command, Carousel, Dialog, Sheet, DropdownMenu,
  Tooltip) need open-state composition or providers to render statically; expect some floor cards.
- synth-entry mode = weaker `.d.ts` contracts than a real library build would give.
