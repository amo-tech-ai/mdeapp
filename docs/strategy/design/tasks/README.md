# Design track — canonical task specs

**Single source of truth** for Track B (D-01…D-14). Execution status lives in Linear epic [SAN-566](https://linear.app/sanjiovani/issue/SAN-566); these files are the spec + proof gate.

| Was scattered | Now |
|---------------|-----|
| `../index-design.md` task table | [`INDEX.md`](INDEX.md) + `D-*.md` per task |
| `../wireframes/**` SCR/WIRE pairs | Cross-linked in each `D-*.md` under **Legacy wireframes**; not duplicate specs |
| `../wireframe/*.html` annotated maps | Linked as **Wireframe artifacts** per task |
| Linear SAN-567…580 | Frontmatter `linear:` on each file |

## Rules

1. **Edit tasks here first** — then sync Linear description if AC changes.
2. **Do not create new D-15+** without updating `INDEX.md` and SAN-566 epic.
3. **Legacy `wireframes/`** = historical SCR/WIRE archive; superseded items stay for grep/Linear links only.
4. **Track A owns function** (SAN-478, 490, 491, 519); D-09 is skin-only input to those issues.

## Queue

```
D-01…07 ✅  →  SAN-462 sign-off  →  D-08  →  parallel D-13/D-10  →  D-09…D-14
```

See [`INDEX.md`](INDEX.md) for assignability and blockers.
