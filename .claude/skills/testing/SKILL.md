---
name: testing
description: "mdeai testing: Vitest, Playwright, browser MCP, smoke, CI, evals. Use routing table. NOT for: TDD-only workflow (test-driven-development), MCP server failures (troubleshooting), dedicated load-test design."
title: Testing — mdeai.co toolchain + Claude-assisted layers
impact: HIGH
impactDescription: Vitest/Playwright/MCP recipes + generic layers + evals
tags: testing, vitest, playwright, evals, claude-code, e2e, mdeai
paths:
  - "src/**"
  - "tests/**"
  - "**/*.test.*"
  - "**/*.spec.*"
  - "playwright/**"
  - "e2e/**"
  - "vitest.config.*"
---

# testing — mdeai.co + cross-stack test layers

## When NOT to use

- **Pure TDD discipline** as the only goal → **`test-driven-development`** skill
- **Chrome DevTools MCP won’t connect** → **`troubleshooting`** skill
- **Load / soak testing** as the primary ask (no mdeai harness yet)—keep scope to shipped gates in CLAUDE.md

Pick the topic that matches the work, then load it.

| Intent | Read |
|--------|------|
| Component tests, unit tests, jsdom, Vitest config, mocks | [vitest.md](vitest.md) |
| Playwright e2e, real browser, login flow, multi-step | [playwright.md](playwright.md) |
| Chrome DevTools MCP — traces, network panel, real-browser inspection | **`chrome-devtools`** skill + MCP (`chrome-devtools-mcp` @latest via `claude mcp` / plugin) |
| LCP / Core Web Vitals tuning under DevTools | **`debug-optimize-lcp`** skill when installed |
| MCP-driven preview-server browser testing (Claude Preview) | [preview-mcp.md](preview-mcp.md) |
| Manual exploratory testing, dogfood session, bug discovery | [exploratory.md](exploratory.md) |
| Choosing what to test (pyramid, ROI, coverage strategy) | [references/testing-strategy.md](references/testing-strategy.md) |
| Common bug patterns / triage taxonomy | [references/issue-taxonomy.md](references/issue-taxonomy.md) |
| Map of layers (unit → E2E → visual → mobile → agentic → evals) | [references/testing-layers.md](references/testing-layers.md) |
| Curated external links (subagents, marketplace, Anthropic eval docs) | [references/resource-hub.md](references/resource-hub.md) |
| MCP server itself failing to connect | **`troubleshooting`** skill |

---

## Browser surfaces — pick one

Three distinct browser-control systems are available in this repo. They are NOT interchangeable; pick by the question being asked.

| Surface | Tool namespace | When to pick |
|---------|----------------|--------------|
| **chrome-devtools-mcp** (Google's Chrome team, 29 tools) | requires install: `claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest` (or `/plugin install chrome-devtools-mcp`) | Numbers/perf required: performance traces, Lighthouse audits, network panel inspection, console error capture during a navigation, memory snapshots, repeatable headless flows that don't need login. |
| **Claude in Chrome** (`--chrome` flag + browser extension) | `mcp__Claude_in_Chrome__*` | Real signed-in browser state required: Supabase auth, Google OAuth, Stripe Link wallet, Gmail/Notion drafting, anything behind a login or CAPTCHA. |
| **Claude Preview MCP** | `mcp__Claude_Preview__*` | Stateless preview-server smoke tests during a Vite feature loop — the four-state pattern, the 3-panel layout, mobile collapse, AI proposal cards. |

**Picking rule:** state required → Claude in Chrome · numbers/perf required → chrome-devtools-mcp · stateless verify → Claude Preview.

**Claude in Chrome docs:** [Use Claude Code with Chrome (beta)](https://code.claude.com/docs/en/chrome) — prerequisites (`claude --chrome`, extension), VS Code, troubleshooting.

Specialists for each surface (install separately — paths vary by Claude plugins / global skills):

- **`chrome-devtools`** / **`chrome-devtools-cli`** — same MCP server; CLI variant for bash/CI
- **`troubleshooting`** — when an MCP server fails to start

---

## mdeai recipes

| Job | Surface | Owner skill |
|-----|---------|-------------|
| LCP regression on `/coffee` | chrome-devtools-mcp (`performance_start_trace` → `performance_analyze_insight LCPBreakdown`) | `debug-optimize-lcp` |
| Lighthouse audit on a Vercel preview URL | chrome-devtools-mcp (`lighthouse_audit --mode navigation --device mobile`) | `mde-vercel` |
| Bundle / Core Web Vitals trace | chrome-devtools-mcp | `mde-vercel`, `debug-optimize-lcp` |
| Supabase email/OAuth sign-in regression | Claude in Chrome | `testing` → [playwright.md](playwright.md) |
| Stripe Link checkout end-to-end | Claude in Chrome | `mde-stripe`, `create-payment-credential` |
| Shopify cart → checkout smoke | Claude in Chrome | `mde-stripe` (plus `mdeai-commerce.md`) |
| AI-proposal card four-state visual verify | Claude Preview MCP | `testing` → [preview-mcp.md](preview-mcp.md) |
| RLS / 403 debugging during a UI flow | chrome-devtools-mcp (`list_console_messages --types error` + `list_network_requests --resourceTypes Fetch`) | `mde-supabase`, `systematic-debugging` |
| Console-error sweep before commit | chrome-devtools-cli inside `/ship` step 3 | `testing` (this skill) |

---

## Repo-specific pointers (mdeai.co)

- Vitest entry: `npm run test` (run once) / `npm run test:watch`
- Playwright is configured but no e2e tests exist yet (see CLAUDE.md "Known Issues")
- Required-states pattern in [.claude/rules/style-guide.md](../../rules/style-guide.md): every data-fetching component handles loading/error/empty/success — tests must cover all four
- Preview server runs on port 8080 (`npm run dev`)

---

## Route by intent (task lifecycle)

| User need | Open |
|-----------|------|
| Task lifecycle Phase 4 routing | [mde-task-lifecycle/testing.md](../mde-task-lifecycle/testing.md) |
| TDD discipline (red/green/refactor) | **test-driven-development** skill |
| Ship checklist + deploy gates | **mde-task-lifecycle** + `/deploy-check` command |

---

## Decision tree (thin)

```
Goal
 ├─ Only choosing framework / layer / CI shape for a greenfield app → testing-layers.md
 ├─ External guides + subagent checklist → resource-hub.md
 ├─ This repo (Vitest, Playwright, Preview MCP, npm scripts) → vitest.md / playwright.md / preview-mcp.md
 └─ Ship checklist + deploy gates → mde-task-lifecycle + /deploy-check
```

---

## Principles (always)

1. **Fast feedback first** — unit + lint before heavy E2E.
2. **One golden runner per layer** per repo; don't mix incompatible assertion styles.
3. **Flakes are defects** — fix or quarantine; don't mask with infinite retries.
4. **Agentic loops need fresh context** — long chains degrade quality; reset or compact between batches ([workflow notes](https://www.nathanonn.com/claude-code-testing-task-management-workflow/)).
5. **LLM evals need frozen rubrics** — version the judge prompt and golden set like code.
6. **Security "light sweeps" ≠ pentest** — escalate real assurance to specialists.

---

## Quick framework peek

| Layer | Typical tools |
|-------|----------------|
| Unit | Vitest, Jest, JUnit, XCTest |
| Web UI | Playwright, Cypress |
| Mobile | Detox, Appium, Espresso, XCUITest |
| API | Supertest, REST Assured, contract checks |

Full table + workflows → **testing-layers.md**.

---

## Resources in this folder

- `examples/` — console logging, element discovery, static HTML automation snippets
- `scripts/with_server.py` — wrap test runs around a dev server
- `templates/` — dogfood session templates

---

## Skill composition note

Authored using **[skill-creator](../skill-creator/SKILL.md)** conventions: thin **`SKILL.md`**, progressive disclosure via **`references/`**, explicit **anti-triggers** in YAML `description`.
