---
title: Testing layers — frameworks and workflows
impact: HIGH
impactDescription: Unit → E2E → visual → mobile → agentic → evals → perf/security
tags: testing, vitest, playwright, evals, automation
---

# Testing layers — categories and tools

**When to read:** you need a **concise map** of where Claude Code / Claude API fit across **test layers**, typical **frameworks**, and **advanced workflows** (agentic loops, LLM evals).

---

## Primary categories

| Layer | What it verifies | Claude shines at |
|-------|------------------|------------------|
| **Unit** | Functions, hooks, ViewModels, pure logic | Exhaustive cases, boundary conditions, property-style edge cases humans skip |
| **Integration** | Modules + DB/API mocks, contract boundaries | Wiring tests, fixture design, deterministic setup/teardown |
| **E2E / UI** | Full user flows (login, checkout, forms) | Spec authoring for Playwright/Cypress; retries and stable selectors |
| **Visual / functional regression** | Layout, navigation, themed UI | Scripted navigation + screenshot baselines + diff narrative |
| **Mobile** | iOS/Android flows | Simulator/emulator flows, Appium/XCUITest/Espresso scaffolding (project-dependent) |
| **Performance** | Latency, list scroll, cold start | Lightweight benchmarks; CI thresholds — not a substitute for dedicated perf tooling |
| **Security (light)** | Injection, obviously unsafe patterns | Heuristic sweeps — **not** a formal pentest; pair with dedicated security review |

---

## Framework quick map

| Level | Common stacks |
|-------|----------------|
| **Unit** | Jest, **Vitest**, JUnit 5, XCTest, Kotlin test |
| **Web UI** | **Playwright**, Cypress |
| **Mobile UI** | Detox, Appium, Espresso, XCUITest |
| **API** | REST Assured, Supertest, contract/OpenAPI checks |

Pick **one** runner convention per repo and align generated tests to it.

---

## Advanced workflows

### Agentic testing loop

Claude acts as an **agent**: gather context → run tests → interpret failures → patch → re-run until green or stop budget.

**Sharp edges:** long-lived threads accumulate **context rot**; prefer **fresh sessions** or explicit compaction between iterations when running many cases ([workflow write-up](https://www.nathanonn.com/claude-code-testing-task-management-workflow/)).

### LLM-based evaluations (“evals”)

For **subjective** or **generative** outputs (tone, summarization, chatbot quality):

- Maintain a **golden** case set (inputs + rubric + optional reference outputs).
- Use **LLM-as-judge** or Likert-style scoring **consistently** — document the rubric in-repo.
- Prefer official docs: [Evaluation Tool](https://docs.anthropic.com/en/docs/test-and-evaluate/eval-tool) · [Develop tests](https://docs.anthropic.com/en/docs/build-with-claude/develop-tests).

### CI/CD

- Gate on **lint → unit → build → e2e (smoke)** with parallel shards where possible.
- Keep **flake rate** visible; quarantine flaky specs instead of silent retries only.

---

## Subagent pattern (community)

The **[test-automator](https://github.com/VoltAgent/awesome-claude-code-subagents/blob/main/categories/04-quality-security/test-automator.md)** subagent spec covers framework architecture, API/UI/mobile automation, CI integration, and reporting — useful as a **checklist**, not mandatory boilerplate.

---

## Repo-specific note (mdeai.co)

For **this** codebase’s commands, Vitest/Playwright layout, and browser MCP surfaces → **`testing`** skill (`vitest.md`, `playwright.md`, `preview-mcp.md`).
