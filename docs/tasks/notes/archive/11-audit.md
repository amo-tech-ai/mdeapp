# Audit Verdict

**Yes — the plan is mostly correct. Score: 88/100.**

The order is logical: finish **commerce proof first**, then production sign-off, then polish, then post-MVP maps/data/trips/real-estate.

# Correct Order

```text
P0 A:
079 G1 → 080 EVP-003 → 081 EVP-013 → 082 G3 → 083 EVP-001

P0 B:
084 F32 ‖ 085 AUTH-011 ‖ 091 MAP-002B ‖ 092 MAP-008B

P1:
086 EVP-014 → 087 SCREEN-017 → 088 SCREEN-010 → 089 MAP-010
090 AUTH-005 parallel
```

This matches both `todo.md` and `tasks/INDEX.md`.

# What Is Correct

| Area | Verdict |
|------|---------|
| Commerce before polish | Correct |
| EVP-001 after G1/G2/G3 proof | Correct |
| MAP-002B + MAP-008B in P0 | Correct |
| Post-MVP maps kept out of MVP sprint | Correct |
| Data/trips/real-estate separated by track | Correct |
| `plan.md` as execution plan, not full task registry | Correct |

# Red Flags / Fixes

| Issue | Risk | Fix |
|-------|------|-----|
| `MVP-REQUIRED.md` is stale | Confuses Cursor/Linear | Mark `plan.md`, `todo.md`, `tasks/INDEX.md` as canonical |
| MAP-010 appears in both P1 and ADV maps | Duplicate/confusing | Label P1 MAP-010 as “conditional only if Roberto blocked” |
| P0 B says “after row 5,” but F32/AUTH can partially start earlier | Minor delay risk | Allow read-only/prep work early; final proof after EVP-001 |
| Post-MVP plan is summary only | Cursor may miss tasks | Add “Post-MVP catalog by index” section |
| Linear sync may drift | Titles/order can desync | Re-run Linear scripts after every plan edit |
| `tasks/INDEX.md` linked `events/INDEX.md` | Broken path | Use `events/tasks/INDEX.md` |

# Critical Blockers

```text
1. IMP-079 G1 paid ticket proof
2. IMP-080 webhook secret isolation
3. IMP-081 EventCard / SCREEN-006 E2E
4. IMP-082 host publish proof
5. IMP-083 consolidated production proof
```

Do not move to P1 until these are green.

# Suggested Improvement

Add one small section to `plan.md`:

```text
Post-MVP catalog:
- Maps index
- Data index
- Trips index
- Real estate index
- Events ADV index
- Vector/venues index
```

This prevents Cursor from thinking missing ADV tasks were forgotten.

# Final Recommendation

Use this as the active order:

```text
079 → 080 → 081 → 082 → 083
then
084 ‖ 085 ‖ 091 ‖ 092
then
086 → 087 → 088 → 089
with 090 parallel
```

**Do not pull MAP-005, trips, rentals, OpenClaw, or advanced data tasks into MVP exit.**

---

# Verification (2026-05-27)

| Suggestion | Verdict | Notes |
|------------|---------|-------|
| P0 A/B order | **Correct** | Matches [`plan.md`](../../plan.md), [`todo.md`](../../todo.md), [`core-mvp-order.json`](core-mvp-order.json) |
| 88/100 score | **Fair** | −12 for stale `MVP-REQUIRED.md` P0 table (still shows 6 blockers, omits MAP-002B/008B) |
| `MVP-REQUIRED.md` stale | **Correct** | P0 table missing IMP-091/092; claims “Single source of truth” — order is **`plan.md` + `todo.md`** |
| MAP-010 P1 vs ADV duplicate | **Correct** | Intentional: P1 = conditional unblock; ADV = full spine after MAP-005. Label already in `plan.md` |
| P0 B prep early | **Correct** | F32 curl probes + AUTH-011 checklist prep can run before EVP-001; **sign-off** waits on 083 |
| Post-MVP catalog gap | **Correct** | Fixed in [`tasks/INDEX.md`](INDEX.md) § Post-MVP catalog |
| Linear drift warning | **Correct** | Operational — scripts in `plan.md` |
| Critical blockers list | **Correct** | IMP-079–083 only; P0 B is sign-off not commerce proof |
| Don’t pull ADV into MVP | **Correct** | Aligns with `MVP-REQUIRED.md` § What is NOT needed |
| Broken `events/INDEX.md` link | **Found during verify** | Canonical path is [`events/tasks/INDEX.md`](events/tasks/INDEX.md) |

**Actions taken:** expanded [`tasks/INDEX.md`](INDEX.md) with full track catalog; fixed events index path; aligned status dots (🟢🟡🔴⚪).

**Canonical docs for order:** [`plan.md`](../../plan.md) · [`todo.md`](../../todo.md) · [`tasks/INDEX.md`](INDEX.md)  
**Exit definition only:** [`MVP-REQUIRED.md`](MVP-REQUIRED.md)
