---
id: SPEC-ID
title: Page or overlay title
route: /path
status: Live | Spec-only | Partial
linear: SAN-XXX
persona: persona-name
phase: mvp | post-mvp
updated: YYYY-MM-DD
implementation:
  page: mdeapp/src/app/.../page.tsx
  components: []
playwright: mdeapp/e2e/...
vitest: mdeapp/src/.../__tests__/
wireframe: ../wireframes/...
design: ../../../DESIGN.MD
---

# Title

## Purpose

## Persona & real-world example

## Route & auth

| Field | Value |
|-------|-------|
| Route | |
| Auth | public / required |
| Layout shell | |

## Layout (desktop / mobile)

```text
ASCII wireframe
```

## Components (shadcn / custom)

| Component | Path | Role |
|-----------|------|------|

## Data source

| Field | Source | Notes |
|-------|--------|-------|

## UI states

| State | testId / pattern | Copy / behavior |
|-------|------------------|-----------------|
| Loading | | skeleton |
| Empty | | EmptyState |
| Error | | retry |
| Success | | |

## Mobile behavior

## Accessibility

- Focus order, labels, 44px targets, `prefers-reduced-motion`, contrast tokens only

## Test plan

| Layer | Command / spec | Pass criteria |
|-------|----------------|---------------|

## Acceptance criteria

- [ ] …

## Design rules (DESIGN.MD)

- Semantic tokens only (`bg-background`, `text-muted-foreground`, `border-border`, `--accent`)
- No `gray-*` / `zinc-*`
- base-nova shadcn primitives
- Dense premium cards; clear CTA intent
