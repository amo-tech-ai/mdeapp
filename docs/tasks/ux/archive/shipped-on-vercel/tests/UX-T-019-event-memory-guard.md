---
id: UX-T-019
title: Vitest + Playwright — event fast-path memory guard (B-09)
status: Done
priority: P0
implements: UX-019
depends_on: []
blocks: [UX-019 Done gate, UX-T-031 scenario 3]
skill: [testing, vitest, playwright-cli]
output:
  - mdeapp/src/lib/__tests__/event-search-fast-path.test.ts
  - mdeapp/e2e/live-audit-verticals.spec.ts (scenario 3)
source_audit: ../../tests/23-live-audit.md §2c
description: After event search, "quiet rooftop dinner in Provenza" must NOT use lastEventQuery.category memory — buildEventSearchParams L55/L81 guard.
---

# UX-T-019 — event memory guard tests

## Root cause (audit B-09)

After `"salsa events this weekend"`, memory holds `lastEventQuery.category = "music"`.  
`"quiet rooftop dinner in Provenza"` → `buildEventSearchParams` memory fallback fires → event fast-path hijacks restaurant intent.

## Vitest cases — add to `event-search-fast-path.test.ts`

### Case A — dinner after event memory (primary bug)

```typescript
it("does not fast path dinner query when stale event category in memory", () => {
  const memory: ConciergeWorkingMemory = {
    lastEventQuery: { category: "music", dateWindow: "any" },
  };
  expect(
    canFastPathEventSearch("quiet rooftop dinner in Provenza", memory),
  ).toBe(false);
  expect(
    buildEventSearchParams("quiet rooftop dinner in Provenza", memory),
  ).toBeNull();
});
```

### Case B — Option A regex (if shipped)

```typescript
it("treats dinner/rooftop as non-event food venue", () => {
  expect(canFastPathEventSearch("quiet rooftop dinner in Provenza", {})).toBe(false);
});
```

### Case C — genuine event still works after memory

```typescript
it("still fast paths explicit event follow-up", () => {
  const memory: ConciergeWorkingMemory = {
    lastEventQuery: { category: "music", dateWindow: "any" },
  };
  expect(canFastPathEventSearch("more salsa this weekend", memory)).toBe(true);
});
```

### Case D — Option B L55 (expected fail until UX-019 ships)

Use `it.fails` in `event-search-fast-path.test.ts` — remove `.fails` when L55 fix lands:

```typescript
it.fails("L55: Provenza tonight does not inherit stale category", () => {
  const memory = { lastEventQuery: { category: "music", dateWindow: "any" } };
  expect(buildEventSearchParams("Provenza tonight", memory)?.category).toBeUndefined();
});
```

### Case E — Option B L81 (expected fail until UX-019 ships)

```typescript
it.fails("L81: bare follow-up does not replay last event query", () => {
  const memory = { lastEventQuery: { category: "music" } };
  expect(buildEventSearchParams("ok", memory)).toBeNull();
});
```

## Status (2026-05-31)

- ✅ Option A regression lock in `event-search-fast-path.test.ts`
- 🟡 Option B L55/L81 — `it.fails` (2 expected failures); flip to `it` when UX-019 Option B merges

## Playwright pairing

[UX-T-031](UX-T-031-live-audit-verticals.spec.md) scenario 3 — integration proof in same session after real event search.

## Files to read before implementing guard

- `mdeapp/src/lib/event-search-fast-path.ts` — L55, L81 (memory fallback)
- `mdeapp/src/hooks/use-event-search-fast-path.ts`

## Acceptance criteria

- [ ] Vitest cases A–C pass after UX-019 code change
- [ ] Cases A fails before fix (red → green)
- [ ] UX-T-031 scenario 3 passes in same PR or immediately after

## Command

```bash
cd mdeapp && npm test -- event-search-fast-path
```
