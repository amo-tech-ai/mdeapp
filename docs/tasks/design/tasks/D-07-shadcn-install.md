---
id: D-07
linear: SAN-573
phase: 2
status: Done
blocked_by: []
outputs:
  - mdeapp/src/components/ui/{tabs,command,avatar,carousel,sonner,sidebar}.tsx
  - mdeapp/src/components/app-providers.tsx
---

# D-07 — P0 shadcn install

## Purpose

Install missing shadcn primitives for Explore tabs, ⌘K palette, dashboard shell, toasts.

## Acceptance criteria

- [x] `npx shadcn@latest add tabs command avatar carousel sonner sidebar`
- [x] Transitive: `textarea`, `input-group`, `hooks/use-mobile.ts`
- [x] Deps: `cmdk`, `embla-carousel-react`, `sonner` ( `next-themes` optional — removed from runtime; Sonner `theme="light"`)
- [x] `MdeAppProviders` + `<Toaster />` in root layout
- [x] CopilotKit v1 untouched
- [x] PR #76 merged · hotfix #78 (drop ThemeProvider script error)

## Out of scope (downstream)

- ⌘K `CommandDialog` wiring → **D-13**
- `SidebarProvider` shell → **D-10**
- `navigation-menu` → D-09/D-13

## Wireframe / spec references

- [`../docs/component-inventory.md`](../docs/component-inventory.md)
- [`../audit/san-573.md`](../audit/san-573.md)

## Proof

```bash
cd mdeapp && npx shadcn@latest info --json | jq '.components'
npm run build
```

Evidence: [`../../testing/evidence/2026-06-05/d-07-shadcn-install-RESULTS.md`](../../testing/evidence/2026-06-05/d-07-shadcn-install-RESULTS.md)

## Legacy

Not a replacement for `wireframes/screens/*` — those are route-build specs.
