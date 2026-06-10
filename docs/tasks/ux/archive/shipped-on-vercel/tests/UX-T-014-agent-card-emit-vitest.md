---
id: UX-T-014
title: Vitest — agent tool cards without writer.custom
status: Done
priority: P0
implements: UX-014
depends_on: []
blocks: [UX-014 Done gate]
skill: [testing, vitest, copilotkit-integrations]
output:
  - extend mdeapp/src/platform/copilot/__tests__/mastra-tool-action-names.test.ts
  - optional grep CI guard
source_audit: ../../tests/24-mde-audit.md
description: Guard that search tool renders use CopilotKit generative UI path — no writer.custom in restaurants/rentals/events/attractions render files.
---

# UX-T-014 — agent card emit tests

## Static guard (extend existing test)

File: `mdeapp/src/platform/copilot/__tests__/mastra-tool-action-names.test.ts`

Add test:

```typescript
it("search tool render files do not use writer.custom", () => {
  const files = [
    "src/mastra/agents/concierge.ts", // or render modules
    "src/components/copilot/search-tool-renders.tsx",
  ];
  for (const f of files) {
    const text = readFileSync(join(process.cwd(), f), "utf8");
    expect(text).not.toMatch(/writer\.custom\s*\(/);
  }
});
```

**Verify paths on disk** — audit cited `writer.custom` at restaurants:327, rentals:368, events:294, attractions:291.

## Grep floor (optional hook)

```bash
cd mdeapp && rg 'writer\.custom\s*\(' src/ --glob '!**/__tests__/**' && exit 1 || exit 0
```

Add to `package.json` as `"test:ux014:writer-custom": "..."` only if UX-014 ships.

## Playwright smoke (after UX-014)

Send rental query → cards appear **without** duplicate generic results panel (pair with `e2e/rich-card-dedup.spec.ts`).

## Acceptance criteria

- [ ] Vitest fails while `writer.custom` present in search render paths
- [ ] Vitest passes after UX-014 migration to `useCopilotAction` / tool render registry
- [ ] `mastra-tool-action-names` still matches concierge tool keys

## Command

```bash
cd mdeapp && npm test -- mastra-tool-action-names
```
