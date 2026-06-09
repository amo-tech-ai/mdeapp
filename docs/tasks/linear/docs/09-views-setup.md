# MDEAPP — Saved views (copy-paste setup)

**Project:** [MDEAPP](https://linear.app/sanjiovani/project/mdeapp-099cd7795071)  
**Rule:** Filter on **labels** only — never title text.

**Full view list:** [`10-mvp-module-views.md`](10-mvp-module-views.md) · **Dashboard:** [`../MVP-EXECUTION.md`](MVP-EXECUTION.md)

---

## Fix existing views

### UX tasks

- **URL:** https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725  
- **Filter:**

```text
project:MDEAPP label:track:ux
```

- **Description note:** `Filter contract: label:track:ux`

### Data

- **URL:** https://linear.app/sanjiovani/view/data-54425dec37b9  
- **Filter:**

```text
project:MDEAPP label:track:data
```

- **Description note:** `Filter contract: label:track:data`

### MVP / Launch (primary dashboard)

- **URL:** https://linear.app/sanjiovani/view/mvp-b4f1afdff207  
- **Name:** MVP EXECUTION
- **Filter (recommended — shows all launch work):**

```text
project:MDEAPP label:phase:launch
```

- **Filter (active queue only):**

```text
project:MDEAPP milestone:"🚨 Launch Critical" state:Todo,"In Progress","In Review"
```

- **Dashboard:** [`../MVP-EXECUTION.md`](MVP-EXECUTION.md) · **Module views:** [`10-mvp-module-views.md`](10-mvp-module-views.md)

---

## Create new views (Project → Views → New)

### Blocked

```text
project:MDEAPP has:blocked-by state:Todo,"In Progress"
```

### Stale WIP (In Progress > 7 days)

```text
project:MDEAPP state:"In Progress" updated:< -P7D
```

### Stack — Supabase

```text
project:MDEAPP label:stack:supabase
```

### Stack — AI (Mastra + CopilotKit + Gemini)

```text
project:MDEAPP (label:stack:mastra OR label:stack:copilotkit OR label:stack:gemini)
```

### Phase 1 active (no deferred 🔮)

```text
project:MDEAPP (milestone:"🚨 Launch Critical" OR milestone:"🎟️ Events — Polish" OR milestone:"🍽️ Discovery — UI" OR milestone:"🗺️ Maps — Growth")
```

---

## Do not use (broken after PREFIX migration)

| Bad filter | Why |
|------------|-----|
| `title~"UX-"` | Titles are `AIA-*`, `RNT-001`, … |
| `milestone:"P0 — MVP gates"` | Renamed to **🚨 Launch Critical** |
| `milestone:"P1 — Screens & café"` | Renamed to **🍽️ Discovery — UI** |

---

## After bulk Linear scripts

```bash
node scripts/linear-restore-track-labels.mjs
```
