---
title: Contest shadcn Component Audit
status: Draft
date: 2026-06-03
skills:
  - shadcn
  - task-verifier
---

# Contest shadcn Component Audit

This audit verifies whether contest tasks are using shadcn components correctly and records what must be installed before production UI work.

## Sources Checked

| Source | Result |
|---|---|
| `/home/sk/mdeai/.claude/skills/shadcn/SKILL.md` | Use project package runner, check `info`, use installed components first, run `docs`, preview with `add --dry-run`/`--diff`, prefer Field/FieldGroup for forms, semantic tokens, no raw custom UI when shadcn component exists. |
| `https://ui.shadcn.com/docs/components` | Current component catalog includes Field, Input Group, Select, Checkbox, Dialog, Drawer, Sheet, Table, Tabs, Textarea, Badge, Card, Button, Empty, Sonner, Spinner, Avatar. |
| `https://ui.shadcn.com/docs/forms/react-hook-form` | Forms should use React Hook Form, Zod, `Controller`, `Field`, `FieldLabel`, `FieldError`, `FieldGroup`, `data-invalid`, and `aria-invalid`. |
| `https://ui.shadcn.com/docs/cli` | Use `add` to install components, `docs` to fetch docs/API references, `info --json` for project context, `search`/`view` before registry additions, and `add --dry-run`/`--diff` before updates. |

## Current mdeapp shadcn State

Probe:

```bash
cd /home/sk/mdeai/mdeapp
npx shadcn@latest info --json
find src/components/ui -maxdepth 1 -type f -name '*.tsx' -printf '%f\n' | sort
```

Verified current state:

| Field | Value |
|---|---|
| Framework | Next.js App Router, RSC enabled, TypeScript |
| Tailwind | v4, CSS file `src/app/globals.css` |
| Base/style | `base`, `base-nova`, preset `b2fA` |
| Icon library | `lucide` |
| UI alias | `@/components/ui` |
| Installed components | `badge`, `button`, `card`, `dialog`, `dropdown-menu`, `input`, `label`, `separator`, `sheet`, `skeleton`, `tooltip` |
| Form dependencies | `zod` is installed; `react-hook-form` and `@hookform/resolvers` were not present in the package probe. |

## Missing Components Required For Contest UI

These are referenced by task specs and wireframes but are not currently installed:

| Component | Why needed | CLI docs verified |
|---|---|---|
| `field` | All React Hook Form layouts and validation states | `npx shadcn@latest docs field --json` |
| `input-group` | URL intake, textarea counters, input addons | `npx shadcn@latest docs input-group --json` |
| `textarea` | Bios, notes, sponsor proposal edits, admin notes | `npx shadcn@latest docs textarea --json` |
| `select` | Contest divisions, categories, filters, review statuses | `npx shadcn@latest docs select --json` |
| `checkbox` | Consent and eligibility acknowledgements | `npx shadcn@latest docs checkbox --json` |
| `radio-group` | Vote package/free-paid selection and scoring choices | `npx shadcn@latest docs radio-group --json` |
| `table` | Admin review/audit/sponsor queues | `npx shadcn@latest docs table --json` |
| `tabs` | Mobile profile/admin segmented views | `npx shadcn@latest docs tabs --json` |
| `drawer` | Mobile bottom-sheet workflows where `Sheet` is too desktop-like | `npx shadcn@latest docs drawer --json` |
| `avatar` | Contestant identity/profile rows | `npx shadcn@latest docs avatar --json` |
| `alert` | Validation, privacy, risk, and blocked-source notices | `npx shadcn@latest docs alert --json` |
| `empty` | Empty admin queues and no-results states | `npx shadcn@latest docs empty --json` |
| `sonner` | Toast feedback for save/share/form events | `npx shadcn@latest docs sonner --json` |
| `spinner` | Pending button and async extraction states | `npx shadcn@latest docs spinner --json` |

## Required CLI Workflow For Contest UI Tasks

Run before implementing any contest UI task:

```bash
cd /home/sk/mdeai/mdeapp
npx shadcn@latest info --json
npx shadcn@latest docs field input-group textarea select checkbox radio-group table tabs drawer avatar alert empty sonner spinner --json
npx shadcn@latest add field input-group textarea select checkbox radio-group table tabs drawer avatar alert empty sonner spinner --dry-run
```

Only after reviewing the dry run:

```bash
cd /home/sk/mdeai/mdeapp
npx shadcn@latest add field input-group textarea select checkbox radio-group table tabs drawer avatar alert empty sonner spinner
```

If React Hook Form packages are still absent:

```bash
cd /home/sk/mdeai/mdeapp
npm install react-hook-form @hookform/resolvers
```

## Dry Run Result

Probe:

```bash
cd /home/sk/mdeai/mdeapp
npx shadcn@latest add field input-group textarea select checkbox radio-group table tabs drawer avatar alert empty sonner spinner --dry-run
```

Result:

| Result | Detail |
|---|---|
| New files | 14 new UI component files: textarea, select, checkbox, radio-group, table, tabs, drawer, avatar, alert, empty, sonner, spinner, field, input-group |
| Skipped identical files | `label.tsx`, `separator.tsx`, `input.tsx` |
| Potential overwrite | `button.tsx` would be overwritten |
| New dependencies | `vaul`, `sonner`, `next-themes` |

Implementation guard: before applying, run:

```bash
cd /home/sk/mdeai/mdeapp
npx shadcn@latest add button --diff button.tsx
```

Preserve local `button.tsx` changes or split the add command to avoid overwriting `button.tsx`.

## Task Coverage Matrix

| Task | shadcn requirement | Status |
|---|---|---|
| CTEST-004 | Approval cards use installed `Card`, `Button`, `Badge`, `Dialog`/`Sheet`, `Skeleton`, `Tooltip`. | Covered; add CLI docs check before implementation. |
| CTEST-006 | Screen/wireframe task must map every route to concrete shadcn components and missing install list. | Covered after this audit; implementers must run CLI workflow. |
| CTEST-008 | Signup form requires `Field`, `InputGroup`, `Textarea`, `Select`, `Checkbox`, `Button`, `Card`, `Sheet`, `Alert`, `Spinner`, `Sonner`. | Covered; missing components must be installed first. |
| CTEST-009 | Profile editor/photos/coach require `Field`, `InputGroup`, `Textarea`, `Select`, `Avatar`, `Alert`, `Empty`, `Spinner`, plus installed `Card`, `Dialog`, `Sheet`. | Covered; missing components must be installed first. |
| CTEST-010 | Public profile/vote/share requires `Avatar`, `RadioGroup`, `Alert`, `Sonner`, plus installed `Button`, `Card`, `Badge`, `Dialog`, `Tooltip`. | Covered; missing components must be installed first. |
| CTEST-011 | Discovery sandbox requires `Table`, `Sheet`, `Dialog`, `Textarea`, `Alert`, `Empty`, `Skeleton`, `Badge`, `Button`, `Input`. | Covered; missing components must be installed first. |
| CTEST-012 | Governance task verifies shadcn docs/CLI requirements; no runtime UI. | Covered; docs-only. |

## Verification Verdict

The contest tasks are directionally using shadcn, but production UI tasks are **not ready to execute until the missing shadcn components and React Hook Form packages are installed or explicitly proven present**. CTEST-006, CTEST-008, CTEST-009, CTEST-010, and CTEST-011 must run the CLI workflow above before coding.
