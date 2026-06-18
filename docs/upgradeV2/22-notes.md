# CK-V2 notes — 2026-06-17

## SAN-886 Follow-up — `check:mastra` Fix

**Refs:** [SAN-886 · CK-V2-000 — CopilotKit v1→v2 Migration (frontend-only, subpath path)](https://linear.app/sanjiovani/issue/SAN-886/ck-v2-000-copilotkit-v1v2-migration-frontend-only-subpath-path) · **PR:** [#247](https://github.com/amo-tech-ai/mdeapp/pull/247) (`ai/ck-v2-stale-v1-guard-cleanup`)

**Skills:** `.claude/skills/copilotkit` · `.claude/skills/mastra`  
**MCP verified (2026-06-17):** CopilotKit `search-docs` — `/v2` subpath + `useFrontendTool` are canonical v2 APIs ([Frontend Tools](https://docs.copilotkit.ai/integrations/built-in-agent/frontend-tools), [Migrate to V2](https://docs.copilotkit.ai/migrate/v2)).

### 17 failures

They are all the same false-positive pattern:

```text
imports @copilotkit/react-core/v2 (Phase 1 = v1 only)
```

Likely command to list them:

```bash
cd /home/sk/mdeai/mdeapp
node scripts/check-mastra.mjs
```

Or isolate only CopilotKit v2 imports:

```bash
grep -R "@copilotkit/react-core/v2" src/app src/components -n
```

### Why this is wrong

CopilotKit’s current v2 docs explicitly use:

```ts
import { CopilotKit } from "@copilotkit/react-core/v2";
```

and document `useFrontendTool` from the same `/v2` subpath. ([CopilotKit Docs — API Reference](https://docs.showcase.copilotkit.ai/reference/v2) · [useFrontendTool](https://docs.showcase.copilotkit.ai/reference/v2/hooks/useFrontendTool))

So the guard should **allow** `/v2`, not fail it.

| Layer | State @ `main` (pre-#247) |
|-------|---------------------------|
| Shipped `src/**` | ✅ 17 files on `@copilotkit/react-core/v2` |
| `scripts/check-mastra.mjs` | ❌ Inverted — fails `/v2` as “v1 only” |
| `npm run floor` (CI) | ✅ Green — **does not run** `check:mastra` |
| `.claude/hooks/copilotkit-version-pin.mjs` | ❌ Blocks `useFrontendTool` (3 live files) |
| `.claude/hooks/session-start.mjs` | ❌ Reminder still says “v1 only” |

**Mastra note:** `check:mastra` is the mdeapp Mastra PR gate (`agent` name sync, Gemini deprecations, LibSQL warn, **plus** this CopilotKit import check). The Mastra runtime bridge (`@copilotkit/runtime` + `getLocalAgents`) is unchanged — server package stays **bare** `@copilotkit/runtime` (no `/v2` subpath). Do not block runtime in the hook fix.

---

## Task 1 — Fix `scripts/check-mastra.mjs`

Replace this bad logic:

```js
if (content.includes("@copilotkit/react-core/v2")) {
  failures.push(`${relFromRoot(file)} imports @copilotkit/react-core/v2 (Phase 1 = v1 only)`);
}
```

With this (regex — catches single + double quotes):

```js
if (/from\s+["']@copilotkit\/react-core["']/.test(content)) {
  failures.push(
    `${relFromRoot(file)} imports bare @copilotkit/react-core — use @copilotkit/react-core/v2`,
  );
}
```

**Status:** ✅ in [#247](https://github.com/amo-tech-ai/mdeapp/pull/247)

---

## Task 2 — Fix hook rule

In:

```text
.claude/hooks/copilotkit-version-pin.mjs
```

**Stop blocking** (v2 subpath APIs used in shipped code):

- `useFrontendTool`
- `CopilotKitProvider` (false positive — v2 `<CopilotKit>` from `/v2` is allowed)
- `@copilotkit/react-core/v2`

**Also block** bare frontend import:

- `from "@copilotkit/react-core"` (no `/v2`)

**Keep blocking** (v2 full-rewrite line — breaks Mastra AG-UI runtime):

- `@copilotkit/react` · `@copilotkit/core` · `@copilotkit/agent` · `@copilotkit/sdk-js`
- `BuiltInAgent` · `createCopilotEndpoint`

**Still allow** (server, no `/v2`):

- `@copilotkit/runtime` in `src/app/api/copilotkit/**`

**Status:** ✅ in [#247](https://github.com/amo-tech-ai/mdeapp/pull/247)

---

## Task 3 — Fix session reminder

In:

```text
.claude/hooks/session-start.mjs
```

Change:

```text
v1 CopilotKit imports only
```

To:

```text
CopilotKit v2 /v2 subpath imports only (no bare v1 @copilotkit/react-core).
Use @copilotkit/react-core/v2. Do not reintroduce bare v1 imports.
```

**Status:** ✅ in [#247](https://github.com/amo-tech-ai/mdeapp/pull/247)

---

## Task 4 — Verify

Run:

```bash
cd /home/sk/mdeai/mdeapp
node --check .claude/hooks/copilotkit-version-pin.mjs
node --check .claude/hooks/session-start.mjs
node --check scripts/check-mastra.mjs
node scripts/check-mastra.mjs
npm run floor
grep -R '@copilotkit/react-core"' src -n
grep -R "@copilotkit/react-core'" src -n
```

Expected after merge:

```text
check-mastra: exit 0
floor: pass
no bare @copilotkit/react-core imports in src/**
```

**Status:** ⏳ pending merge of #247 (floor already green on PR branch; mark PR **Ready** — CodeAnt-AI was pending).

---

## Task 5 — (Backlog) Wire `check:mastra` into floor

`check:mastra` is **not** in `npm run floor` today — that is why CI stayed green while local runs showed 17 false failures.

| Option | Action |
|--------|--------|
| A | Add `npm run check:mastra` to `floor` script in `package.json` |
| B | Add a Floor workflow step in `.github/workflows/floor.yml` |

Do **after** #247 merges so the gate is not inverted on CI.

---

### Bottom line

Merge **PR #247**. The app is not broken. The guard is stale after **SAN-886**. Sofía’s local `check:mastra` and agent PreToolUse hooks were fighting the code Camila/Roberto already ship on `/chat` and `/host/event/new`.
