# 34 — Turbopack PostCSS worker explosion (dev server SIGTERM)

**Date:** 2026-05-27  
**App:** `/home/sk/mdeai/mdeapp`  
**Branch:** `ship/may27-maps-events`  
**Related:** CopilotKit Input fix (`cf5df05`) — **separate issue**; Input crash is fixed.

---

## Executive summary

| Item | Finding |
|------|---------|
| **KEY MOMENT** | First **`GET /`** after `next dev --turbopack` → log shows **`○ Compiling /`** → PostCSS workers spawn under `.next/dev/build/postcss.js` |
| **FIRST BAD FILE** | `src/app/layout.tsx` (root CSS entry for every route) |
| **FIRST BAD LINE** | Line **7**: `import "@copilotkit/react-ui/styles.css";` **plus** line **6**: `import "./globals.css";` |
| **Amplifier** | `src/app/globals.css` lines **1–3** (`@import "tailwindcss"` / `tw-animate-css` / `shadcn/tailwind.css`) + lines **155–173** (`.copilotKit*` overrides, added `410ddc8`) |
| **Not the trigger** | `concierge-chat-input.tsx` (Input import fix) — TS only, no CSS |
| **Minimal fix** | `dev:ui`: `next dev --webpack -p 3001` (already in **working tree**, uncommitted) |
| **Safe to move on?** | **Yes**, after committing webpack dev script + documenting port **3001** (not 3000) |

---

## KEY MOMENT

```
[ui] ✓ Ready in ~300ms
[ui] ○ Compiling /          ← first browser GET / (or curl localhost:3001/)
     → Turbopack lazy-compiles app/layout + app/page
     → PostCSS transform runs on global CSS assets
     → .next/dev/build/postcss.js worker processes multiply
     → RAM/swap spike → node (next dev) SIGTERM 143
     → concurrently --kill-others → Mastra killed
```

**Port note:** `dev:ui` binds **3001** (`package.json`). `http://localhost:3000` is usually **not** mdeapp.

---

## Import chain for `GET /`

```
app/layout.tsx
  ├── ./globals.css                    ← Tailwind v4 + @apply + .copilotKit* overrides
  └── @copilotkit/react-ui/styles.css  ← ~37KB prebuilt CSS (1,749 lines)

app/page.tsx ("use client")
  └── GeoChatShell
        └── ChatCanvas → ChatCenterPanel → CopilotChat (@copilotkit/react-ui)
        └── MapsShell, SearchToolRenders, MapUiSync, sheets, …
```

~**296** files under `src/`; ~**27** chat/maps/copilot TSX files with `className=`. Tailwind scans sources when processing `globals.css`.

---

## FIRST BAD FILE / LINE

### Primary: `src/app/layout.tsx`

```tsx
import "./globals.css";
import "@copilotkit/react-ui/styles.css";
```

Two global CSS entry points. Next runs **both** through `postcss.config.mjs` → `@tailwindcss/postcss`. Under Turbopack, each asset can spawn **separate** `postcss.js` Node workers; Tailwind/Next issues document **double invocation** per CSS update.

### Amplifier: `src/app/globals.css`

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
/* … */
.mde-center-copilot-chat.copilotKitChat { … }
.mde-center-copilot-chat .copilotKitMessages { … }
.mde-center-copilot-chat .copilotKitInput { … }
```

Added in **`410ddc8`** (MAP-007B chat shell). Forces Tailwind to reconcile app tokens with CopilotKit class names on every full scan.

### Not the root: CopilotKit TS imports

`CopilotChat` / `Input={ConciergeChatInput}` in `chat-center-panel.tsx` add JS bundle size but are **not** the PostCSS worker source. `concierge-chat-input.tsx` uses local `<textarea>` — no `react-ui` CSS import.

---

## WHY TURBOPACK EXPLODES

1. **Lazy route compile** — `/` pulls layout + heavy client graph (`GeoChatShell`) on first request.
2. **Tailwind v4 PostCSS** — `@import "tailwindcss"` in `globals.css` scans the project for utilities; expensive on first compile.
3. **Turbopack PostCSS model** — spawns Node workers per CSS transform; known **double-call** race with `@tailwindcss/postcss` (fixed in Tailwind ≥4.1.2; repo has **4.3.0** but parallel workers + large graph still hurt).
4. **Second global CSS** — `@copilotkit/react-ui/styles.css` is large prebuilt CSS still piped through the same PostCSS plugin chain.
5. **Memory** — hundreds of workers × full Tailwind scan → swap → OOM killer → **exit 143** on UI process → `concurrently --kill-others` stops Mastra (4111 was healthy).

**This machine (2026-05-27):** controlled test peaked at **~5** `postcss.js` processes, `GET /` → **200**. User “hundreds” likely reflects **lower RAM**, **swap thrashing**, or **retry/fork storm** under load — same trigger, worse collapse.

---

## WHY WEBPACK SURVIVES

| Turbopack | Webpack (`next dev --webpack`) |
|-----------|--------------------------------|
| Per-CSS-chunk parallel PostCSS workers | More centralized CSS bundling |
| Known double-transform races | Class/CSS HMR stable in reports |
| `○ Compiling /` fans out aggressively | Log: `○ Compiling /` but ~5 workers in test |

**Working tree fix (uncommitted):**

```diff
- "dev:ui": "next dev --turbopack -p 3001",
+ "dev:ui": "next dev --webpack -p 3001",
```

---

## MINIMAL FIX

1. **Commit** `package.json` `dev:ui` → `--webpack -p 3001`.
2. **Optional:** `concurrently` use `--kill-others-on-fail` so UI OOM does not kill Mastra during investigation.
3. **Do not** re-enable `--turbopack` on `dev:ui` until bisection passes below on your hardware.

Production `npm run build` is unaffected (uses production CSS pipeline; tested OK).

---

## TEMPORARY DEV FIX

```bash
cd /home/sk/mdeai/mdeapp
fuser -k 3001/tcp 4111/tcp 2>/dev/null
npm run dev:ui    # webpack, port 3001 only
# separate terminal:
npm run dev:agent # Mastra 4111
```

Or full stack after webpack commit: `npm run dev`.

Open **`http://localhost:3001`** (not 3000).

---

## Bisection checklist (isolate smallest trigger)

Run with **`next dev --turbopack -p 3001`** only. After each step: `curl -s -o /dev/null http://localhost:3001/` then:

```bash
pgrep -c -f "postcss.js" || echo 0
free -h
```

| Step | Change | Pass if workers stay low & GET / 200 |
|------|--------|--------------------------------------|
| A0 | Baseline turbopack | Record worker count |
| A1 | Comment `layout.tsx` line 7 (`@copilotkit/react-ui/styles.css`) | **Primary isolate** |
| A2 | Restore 7; comment `globals.css` lines 155–173 (`.copilotKit*`) | MAP-007B overrides |
| A3 | Comment `globals.css` line 2 (`tw-animate-css`) | |
| A4 | Replace `page.tsx` body with `<main>ping</main>` (no `GeoChatShell`) | JS graph isolate |
| A5 | Restore page; keep A1 fix | Confirm dual-CSS theory |

**Expected winner:** **A1** (remove separate CopilotKit CSS import) or **A1+A2**.

---

## Commands reference

```bash
cd /home/sk/mdeai/mdeapp

grep -R 'Input } from "@copilotkit/react-ui"' -n src
grep -R 'InputProps' -n src
grep -R '@copilotkit/react-core/v2' -n src
grep -R "copilot" -n src app .
grep -R "@import" -n src app .

git log --oneline -- src/app/page.tsx src/components/chat src/app/globals.css package.json postcss.config.mjs
git diff HEAD~5..HEAD -- src/app/layout.tsx src/app/globals.css package.json

ps aux | grep postcss
pstree -ap | grep postcss
free -h
```

---

## Git timeline (CSS-related)

| Commit | Change |
|--------|--------|
| `f309f76` | Bootstrap: `layout.tsx` adds **both** `globals.css` + `@copilotkit/react-ui/styles.css`; `dev:ui` = `--turbopack` |
| `410ddc8` | `globals.css` adds `.mde-center-copilot-chat` / `.copilotKit*` rules; full **GeoChatShell** |
| `cf5df05` | Input TS fix only (no CSS) |
| *(working tree)* | `dev:ui` → `--webpack` (not committed) |

---

## Verification checklist (post-fix)

- [ ] `dev:ui` uses `--webpack -p 3001` (committed)
- [ ] `npm run dev` → UI stays up after `GET /`
- [ ] `pgrep -c -f postcss.js` stays **&lt; 20** during compile
- [ ] No `Input is not exported` in log
- [ ] `curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/` → **200**
- [ ] `POST /api/events/search` → **200**
- [ ] Mastra **4111** not killed by `concurrently` during UI work
- [ ] CopilotKit Input fix still in place (`concierge-chat-input.tsx`)

---

## FINAL VERDICT

**Can we move on safely?** **YES**, after:

1. **Commit** `package.json` webpack `dev:ui` workaround.
2. Treat Turbopack dev as **known-bad** for this stack until A1 bisection is run on your machine.
3. CopilotKit Input fix remains valid — unrelated to PostCSS workers.

**STATUS:** Root cause **identified** (layout dual global CSS + Tailwind v4 PostCSS under Turbopack on first `GET /`). **Mitigation ready** (webpack dev). Full Turbopack fix deferred (optional: merge Copilot styles into single CSS entry after A1 confirms).
