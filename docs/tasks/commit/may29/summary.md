# PR #14 split — plain-English summary

## The problem in one sentence

One pull request (**#14**) accidentally bundles **two unrelated pieces of work** together, which makes it impossible to merge and unsafe to review — so we're splitting it into two clean ones.

---

## What got tangled together

PR #14 contains two jobs that have nothing to do with each other:

1. **A bug fix (urgent, platform-level).**
   The app was firing endless network calls to `/api/copilotkit` until the browser ran out of resources and **search stopped working**. In persona terms: *Camila types "1BR in Laureles under $80" and gets nothing back* because the page is too busy hammering itself. The fix makes the app register its tools **once** instead of looping forever.

2. **A new feature (café detail flow, C-012).**
   Café result cards, a detail panel, a mobile sheet, and a "booking" placeholder. In persona terms: *a tourist asks for cafés in Medellín and sees proper café cards* (not bars/nightlife) with a Details view.

Mixing a **platform fix** and a **new feature** in one PR is the root mistake.

---

## Why we can't just merge it as-is

Three plain reasons:

- **Git refuses it.** The branch has merge conflicts with `main` (status: *CONFLICTING*).
- **It's two jobs in one.** A reviewer can't cleanly approve the urgent bug fix without also signing off on a whole new feature — they're stuck reviewing 33 files at once, including one file (`search-tool-renders.tsx`) where both jobs overlap.
- **Nothing checks it automatically.** There's no CI, so no robot runs the tests before merge. (This one still needs fixing — see below.)

---

## What we're trying to accomplish

**Split #14 into two small, clean pull requests and merge them in order:**

```
   PR #14 (mixed, blocked)
            |
       split into
            |
   +--------+--------+
 PR A               PR B
 the bug fix        the cafe feature
 (small, urgent)    (depends on A)
   |                     |
 merge first        merge after A
   +--------+------------+
            |
       then close #14
```

- **PR A — runtime fix.** Just the bug fix (one commit, ~8 files). Merge this **first** because it's urgent and the rest of the app needs it.
- **PR B — café feature.** Everything café-related, rebuilt on top of A. Merge **after** A is in.
- **Then close #14.**

**Why this order:** the bug fix is platform plumbing everyone depends on; the café feature is one screen for tourists. Ship the foundation first, the feature second.

---

## One thing the split does *not* fix yet

There is still **no automated test gate (CI)** on the repo. Splitting solves the conflict and the messy review, but someone should add a small workflow that runs the tests automatically — ideally landed **with PR A**. Until then, "tests pass" depends on a human remembering to run them.

---

## Status today

- The code itself is healthy: tests pass (**313/313**), types and lint are clean.
- The split plan was independently re-checked and graded **92% — good to execute** (see [`audit-1.md`](./audit-1.md)).
- Exact steps live in the runbooks: [PR A](./PR-A-RUNBOOK.md) · [PR B](./PR-B-RUNBOOK.md).

**Bottom line:** Don't merge #14. Split it → ship **PR A** (fix) → ship **PR B** (café) → close #14.
