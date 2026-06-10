# MVP module views — Linear setup (frozen)

**Dashboard:** [`../MVP-EXECUTION.md`](MVP-EXECUTION.md) · **Hub:** [`linear.md`](linear/docs/linear.md)

**Rule:** Filter on **labels only**. Never `title~` or prefix text in titles.

---

## Required views

### MVP EXECUTION (primary)

```text
project:MDEAPP label:phase:launch
```

Active queue only:

```text
project:MDEAPP milestone:"🚨 Launch Critical" state:Todo,"In Progress","In Review"
```

Sort: Manual — order in [`mvp-queue.json`](mvp-queue.json) `p0_queue`.

### BLOCKERS

```text
project:MDEAPP has:blocked-by state:Todo,"In Progress","In Review"
```

Optional: add `label:blocker` on issues with external blockers (webhook rotation, e2e red).

### MAPS

```text
project:MDEAPP label:prefix:MAP
```

### EVENTS

```text
project:MDEAPP label:prefix:EVT
```

### PAYMENTS

```text
project:MDEAPP label:prefix:PAY
```

### UX

```text
project:MDEAPP label:track:ux
```

[UX view](https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725) — verify filter matches above.

### DATA

```text
project:MDEAPP label:track:data
```

[Data view](https://linear.app/sanjiovani/view/data-54425dec37b9)

### INTELLIGENCE (MIS)

```text
project:MDEAPP label:track:intelligence
```

Phase 1 frozen queue only:

```text
project:MDEAPP label:phase:intel-1 state:Todo,"In Progress","In Review"
```

Sort: Manual — [`intelligence-queue.json`](intelligence-queue.json) `execution_order`.

Full setup: [`11-intelligence-views.md`](11-intelligence-views.md) · Import: `node scripts/linear-import-intelligence-tasks.mjs`

### AUTH

```text
project:MDEAPP (label:prefix:ATH OR label:stack:supabase) label:phase:launch
```

Broader (all auth work):

```text
project:MDEAPP label:stack:supabase
```

### POST-MVP

```text
project:MDEAPP label:phase:post-mvp
```

Hide deferred:

```text
project:MDEAPP label:phase:post-mvp -milestone:"🔮 Platform — Vector"
```

---

## Stack cross-cut (optional)

| Stack | Filter |
|-------|--------|
| CopilotKit | `label:stack:copilotkit` |
| Mastra | `label:stack:mastra` |
| Supabase | `label:stack:supabase` |
| Google Maps | `label:stack:maps` |
| Stripe | `label:stack:stripe` |
| Testing | `label:stack:playwright OR label:stack:vitest` |

---

## Do not use

| Bad filter | Why |
|------------|-----|
| `title~"EVT-"` | Titles change; labels stable |
| `milestone:"P0 — MVP gates"` | Renamed |
| `IMP-*` in titles | Removed |
| Persona projects | Removed |

---

## Verify after title sync

1. MVP view ≥ 17 issues with `phase:launch`
2. Top manual sort = SAN-178 (PAY-001)
3. Titles match [`mvp-canonical-titles.json`](mvp-canonical-titles.json)
