---
title: mdeai task numbering (hub)
date: 2026-05-27
---

# Task numbering hub

**Cursor rule:** [`.cursor/rules/mdeai-task-numbering.mdc`](../.cursor/rules/mdeai-task-numbering.mdc)

## Global tier order

```text
core → mvp → post-mvp → advanced
```

## Domain indexes

| Domain | Index | Numbering doc |
|--------|-------|---------------|
| Platform | [`INDEX.md`](./INDEX.md) (F01–Fxx) | — |
| Venues | [`venues/INDEX.md`](./venues/INDEX.md) | [`venues/tasks/INDEX.md`](./venues/tasks/INDEX.md) (numbering in § Numbering) |
| Events | [`events/INDEX.md`](./events/INDEX.md) | tier in filename (`EVP-NNN-core\|mvp\|advanced`) |
| Maps | [`maps/INDEX.md`](./maps/INDEX.md) | [`maps/NUMBERING.md`](./maps/NUMBERING.md) |
| OpenClaw | [`openclaw/index-ocl.md`](./openclaw/index-ocl.md) | [`openclaw/tasks/INDEX.md`](./openclaw/tasks/INDEX.md) |

## Venues quick reference

| Step | Folder | Pattern |
|------|--------|---------|
| 01–08 | `venues/tasks/mvp/data/` | `data-00N-*` |
| 09–24 | `venues/tasks/mvp/` | `00N-ven-*` |
| 25–34 | `venues/tasks/post-mvp/` | `0NN-ven-{layer}-*` |
| 35+ | `venues/tasks/advanced/` (future) | `0NN-ven-*` |
| design | `venues/tasks/mvp/wireframes/` | `005–008 scr/wire` |
