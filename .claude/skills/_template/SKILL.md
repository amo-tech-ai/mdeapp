---
name: mde-EXAMPLE
disable-model-invocation: true
description: TEMPLATE — not a real skill. Copy this folder to `.claude/skills/mde-<domain>/` and remove `disable-model-invocation`. One-line WHAT + WHEN + at least 6 trigger phrases users would actually say. Trigger when the user says "phrase A", "phrase B", "phrase C", "phrase D", "phrase E", or "phrase F". Does NOT handle <out-of-scope topic 1> (use <other-skill>) or <out-of-scope topic 2> (use <other-skill>). Replaces the legacy skills <list>.
---

# mde-EXAMPLE — superskill template

> Copy this folder to `.claude/skills/mde-<domain>/` and fill in the four sections below. Keep this file ≤300 lines (PDF best practice: SKILL.md under 5,000 words). Move deep how-to to `references/`.

---

## When to invoke

| Trigger phrase | Action |
|----------------|--------|
| "<obvious phrase 1>" | Route to `<topic-1>.md` |
| "<obvious phrase 2>" | Route to `<topic-2>.md` |
| "<paraphrased phrase>" | Route via decision tree below |

### Don't invoke for

- <Anti-trigger 1> → `<sibling-skill>`
- <Anti-trigger 2> → `<sibling-skill>`

---

## Sub-modules at a glance

| Module | Purpose | Specialist used |
|--------|---------|-----------------|
| [topic-1.md](topic-1.md) | <one line> | (none) |
| [topic-2.md](topic-2.md) | <one line> | <other-skill> |
| [topic-3.md](topic-3.md) | <one line> | (none) |

---

## Routing decision tree

```
User intent
  │
  ├─ <decision 1>?
  │   ├─ Yes → topic-1.md
  │   └─ No  → continue
  │
  ├─ <decision 2>?
  │   ├─ Yes → topic-2.md
  │   └─ No  → topic-3.md
```

---

## Quick links

| Resource | Path |
|----------|------|
| Module 1 | [topic-1.md](topic-1.md) |
| Module 2 | [topic-2.md](topic-2.md) |
| Module 3 | [topic-3.md](topic-3.md) |
| Deep reference | [references/<topic>.md](references/<topic>.md) |

---

## Author checklist (delete before commit)

- [ ] `name:` is kebab-case, ≤64 chars, no `claude` / `anthropic`
- [ ] `description:` ≤1024 chars, includes WHAT + WHEN + 6+ trigger phrases + negative triggers
- [ ] SKILL.md body ≤300 lines (1k–1.5k tokens loaded when triggered)
- [ ] All deep how-to moved to `references/<topic>.md`
- [ ] No `README.md` inside this folder (forbidden by spec)
- [ ] PDF p.15 trigger test: 3 obvious + 3 paraphrased fire; 3 unrelated do NOT fire
- [ ] Each sub-module has clear entry/exit and routes back to SKILL.md or onward
- [ ] Originals soft-deprecated (`DEPRECATED <date> — superseded by mde-<domain>`) and `disable-model-invocation: true`
