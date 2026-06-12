# CK-V2 · CopilotKit v1→v2 migration — Changelog

Reverse-chronological log of verified program events.  
Tracker: [`todo.md`](./todo.md) · Audit: [`notes-3.md`](./notes-3.md) · [`04-copilitkit-audit.md`](./04-copilitkit-audit.md)

---

## 2026-06-12 — [SAN-889 · CK-V2-003 — Migrate /host/event/* (hostEventAgent) to v2](https://linear.app/sanjiovani/issue/SAN-889/ck-v2-003-migrate-hostevent-hosteventagent-to-v2) post-merge verify + E1 fix + [SAN-893 · CK-V1-001 — Investigate v1 host event wizard Maximum update depth loop](https://linear.app/sanjiovani/issue/SAN-893/ck-v1-001-investigate-v1-host-event-wizard-maximum-update-depth-loop)

| Change | Task | Proof |
|---|---|---|
| E1 proof-script fix (`copilotkitPost` boolean 200\|400) | [SAN-889 · CK-V2-003 — Migrate /host/event/* (hostEventAgent) to v2](https://linear.app/sanjiovani/issue/SAN-889/ck-v2-003-migrate-hostevent-hosteventagent-to-v2) | `san-889-localhost-proof.mjs` on `main` follow-up |
| Post-merge re-verify @ `0fab08f` | [SAN-889 · CK-V2-003 — Migrate /host/event/* (hostEventAgent) to v2](https://linear.app/sanjiovani/issue/SAN-889/ck-v2-003-migrate-hostevent-hosteventagent-to-v2) | unit **16/16** + **6/6** · build PASS · v2 flag-on **PASS** |
| HITL approve **PASS** · reject **PARTIAL** (`thought_signature`) | [SAN-889 · CK-V2-003 — Migrate /host/event/* (hostEventAgent) to v2](https://linear.app/sanjiovani/issue/SAN-889/ck-v2-003-migrate-hostevent-hosteventagent-to-v2) | `san-889-hitl-*.mjs` · [`RESULTS.md`](../tasks/testing/evidence/SAN-889/RESULTS.md) |
| v1 flag-off console FAIL → [SAN-893 · CK-V1-001 — Investigate v1 host event wizard Maximum update depth loop](https://linear.app/sanjiovani/issue/SAN-893/ck-v1-001-investigate-v1-host-event-wizard-maximum-update-depth-loop) (v1 bridge 0 diff) | [SAN-893 · CK-V1-001 — Investigate v1 host event wizard Maximum update depth loop](https://linear.app/sanjiovani/issue/SAN-893/ck-v1-001-investigate-v1-host-event-wizard-maximum-update-depth-loop) | `SAN-889-v2-flag-off-results.json` |
| Tracker grep **19/6** · audits updated | Program | `todo.md` · `notes-3.md` · `05-890audit.md` |

**Program % after this entry:** planning **93%** · shipped **~45%** · composite **67%**

---

## 2026-06-12 — SAN-888 merged + proof + SAN-889 scaffold started

| Change | Task | Proof |
|---|---|---|
| PR #208 merged to `main` @ `b9a4f70` | SAN-888 | Admin squash merge after resolving CodeRabbit threads |
| Localhost proof PASS flag off + flag on | SAN-888 | `san-888-localhost-proof.mjs` · "How are my sales?" → `Sales loaded ✓` |
| Evidence on `main` | SAN-888 | [`docs/tasks/testing/evidence/SAN-888/`](../tasks/testing/evidence/SAN-888/) |
| SAN-888 marked **Done** in Linear | SAN-888 | D8 complete |
| SAN-889 scaffold: flag + providers + layout gate + shell-v2 | SAN-889 | Branch `ai/san-889-ck-v2-003-migrate-hostevent-hosteventagent-to-v2` |
| Tracker: parent complete **48%** · shipped **28%** | Program | [`todo.md`](./todo.md) |

**Program % after this entry:** planning **93%** · shipped **28%** · in-flight **18%** · composite **48%**

---

## 2026-06-12 — Execution pass: floor fix + SAN-892 + SAN-890A spike

| Change | Task | Proof |
|---|---|---|
| `audit:floor` critical-only · pushed `83b8f26` | SAN-888 / CI | [Floor CI run](https://github.com/amo-tech-ai/mdeapp/actions/runs/27445847022) **pass** |
| SAN-892 tagging **12/12** `build-on-v2` | SAN-892 | Linear Done |
| SAN-890A spike doc written | SAN-890 prep | [`CK-V2-004-chat-subspike.md`](../tasks/copilotkit/CK-V2-004-chat-subspike.md) |

---

## 2026-06-12 — Tracker source-of-truth pass (prompt-verified)

| Change | Task | Proof |
|---|---|---|
| [`todo.md`](./todo.md) promoted to source-of-truth | Program | Verification Summary 6/6 PASS |
| SAN-886 scorecard: planning 93% · composite 38% | SAN-886 | Was single 95% epic % |

---

## Earlier entries

See git history for SAN-887 spike merge (PR #207), Linear step lists, and SAN-888 branch proof (`2026-06-12`).
