---
title: AIE ↔ Linear sync verification
updated: 2026-06-08
parent_epic: https://linear.app/sanjiovani/issue/SAN-757
project: https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues
labels: [prefix:AIE, phase:core, phase:mvp, phase:advanced]
verified: 2026-06-08
---

# AIE ↔ Linear sync

**Status: ✅ COMPLETE** — 33 issues (000 parent + 001–032 children) in Events Platform under [SAN-757](https://linear.app/sanjiovani/issue/SAN-757).

## Labels

| Phase | Linear label | Count |
|-------|--------------|------:|
| Core | `phase:core` (+ `phase:launch` on P0 gates) | 12 |
| MVP | `phase:mvp` | 14 |
| Advanced | `phase:advanced` + `FROZEN` | 6 |
| All | `prefix:AIE` | 33 |

## Stack verification (skills + MCP)

| Check | Source | Result |
|-------|--------|--------|
| CopilotKit v2 hooks | `copilotkit` skill + [Mastra shared-state](https://docs.copilotkit.ai/integrations/mastra/shared-state) | ✅ `useAgent`, `useFrontendTool` (logic/actions), `useRenderTool` (UI approval/review cards), `useHumanInTheLoop` |
| v2 adopted | CopilotKit MCP | ✅ frontend migrated to v2 `useAgent` (the `/v2` subpath of pinned 1.55.2) — landed on `main` |
| Mastra Pattern 1 | `copilotkit-integrations/mastra.md` | ✅ in-process `/api/copilotkit` |
| Workflows | Mastra local docs | ✅ deterministic steps before LLM narrate |
| Agent cap | `04-AI-native-system.md` §4 | ✅ 5 / 8 / 12 enforced in epic |

## Full mapping (implementation order)

| Order | AIE | Linear | Phase |
|------:|-----|--------|-------|
| — | 000 | [SAN-757](https://linear.app/sanjiovani/issue/SAN-757) | Epic |
| 1 | 001 | [SAN-115](https://linear.app/sanjiovani/issue/SAN-115) | Core |
| 2 | 002 | [SAN-730](https://linear.app/sanjiovani/issue/SAN-730) | Core |
| 3 | 003 | [SAN-758](https://linear.app/sanjiovani/issue/SAN-758) | Core |
| 4 | 004 | [SAN-704](https://linear.app/sanjiovani/issue/SAN-704) | Core |
| 5 | 005 | [SAN-760](https://linear.app/sanjiovani/issue/SAN-760) | Core |
| 6 | 006 | [SAN-762](https://linear.app/sanjiovani/issue/SAN-762) | Core |
| 7 | 007 | [SAN-759](https://linear.app/sanjiovani/issue/SAN-759) | Core |
| 8 | 008 | [SAN-729](https://linear.app/sanjiovani/issue/SAN-729) | Core |
| 9 | 009 | [SAN-761](https://linear.app/sanjiovani/issue/SAN-761) | Core |
| 10 | 010 | [SAN-763](https://linear.app/sanjiovani/issue/SAN-763) | Core |
| 11 | 011 | [SAN-765](https://linear.app/sanjiovani/issue/SAN-765) | Core |
| 12 | 012 | [SAN-764](https://linear.app/sanjiovani/issue/SAN-764) | Core |
| 13 | 013 | [SAN-766](https://linear.app/sanjiovani/issue/SAN-766) | MVP |
| 14 | 014 | [SAN-767](https://linear.app/sanjiovani/issue/SAN-767) | MVP |
| 15 | 015 | [SAN-769](https://linear.app/sanjiovani/issue/SAN-769) | MVP |
| 16 | 016 | [SAN-770](https://linear.app/sanjiovani/issue/SAN-770) | MVP |
| 17 | 017 | [SAN-768](https://linear.app/sanjiovani/issue/SAN-768) | MVP |
| 18 | 018 | [SAN-771](https://linear.app/sanjiovani/issue/SAN-771) | MVP |
| 19 | 019 | [SAN-772](https://linear.app/sanjiovani/issue/SAN-772) | MVP |
| 20 | 020 | [SAN-773](https://linear.app/sanjiovani/issue/SAN-773) | MVP |
| 21 | 021 | [SAN-774](https://linear.app/sanjiovani/issue/SAN-774) | MVP |
| 22 | 022 | [SAN-775](https://linear.app/sanjiovani/issue/SAN-775) | MVP |
| 23 | 023 | [SAN-777](https://linear.app/sanjiovani/issue/SAN-777) | MVP |
| 24 | 024 | [SAN-135](https://linear.app/sanjiovani/issue/SAN-135) | MVP |
| 25 | 025 | [SAN-778](https://linear.app/sanjiovani/issue/SAN-778) | MVP |
| 26 | 026 | [SAN-779](https://linear.app/sanjiovani/issue/SAN-779) | MVP |
| 27 | 027 | [SAN-781](https://linear.app/sanjiovani/issue/SAN-781) | Advanced |
| 28 | 028 | [SAN-782](https://linear.app/sanjiovani/issue/SAN-782) | Advanced |
| 29 | 029 | [SAN-783](https://linear.app/sanjiovani/issue/SAN-783) | Advanced |
| 30 | 030 | [SAN-784](https://linear.app/sanjiovani/issue/SAN-784) | Advanced |
| 31 | 031 | [SAN-785](https://linear.app/sanjiovani/issue/SAN-785) | Advanced |
| 32 | 032 | [SAN-786](https://linear.app/sanjiovani/issue/SAN-786) | Advanced |

## Linear view filter

```text
project:"Events Platform" label:prefix:AIE
```

Sort by title → natural AIE-001…032 order.

## Related legacy issues (not replaced)

EVT/SAN issues remain as `relatedTo` links — e.g. SAN-498/499 (venue panels), SAN-132 (sponsor CRM umbrella).
