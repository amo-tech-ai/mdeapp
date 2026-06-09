# Venues MVP Forensic Audit

Date: 2026-05-28  
Auditor: Codex  
Scope: `tasks/venues/`, `tasks/venues/tasks/mvp/`, `tasks/venues/tasks/post-mvp/`, `tasks/venues/tasks/tasks-intelligent/`, and `tasks/data/tasks-data/`.

## Verdict

Not 100% correct.

The original Venues task pack had a strong product shape, but it was not production-safe. The user-supplied audit was directionally correct on the major missing safety layers: booking retry/idempotency, RLS penetration proof, WhatsApp consent/template controls, Places field-mask/cache enforcement, tool/action registry proof, and admin audit logs.

The one correction: the proposed IDs `VEN-025` through `VEN-031` were not available. Those IDs already exist in `tasks/venues/tasks/post-mvp/`. The missing MVP hardening tasks were added as `VEN-025` through `VEN-030`.

## Evidence Probes

| Probe | Result |
|---|---|
| `find /home/sk/mdeai/tasks/venues -maxdepth 4 -type f` | Found MVP, post-MVP, CTI, wireframe, docs, and superseded CAFE files. |
| `find /home/sk/mdeai/tasks/data -maxdepth 4 -type f` | Confirmed canonical data tasks are in `tasks/data/tasks-data/`, not `tasks/venues/tasks/mvp/data/`. |
| `rg -n "idempot|duplicate|retry|opt-in|consent|field.?mask|X-Goog-FieldMask|RLS|UPDATE|DELETE|admin"` | Confirmed partial coverage existed, but core MVP tasks lacked dedicated hardening gates. |
| Link audit against `tasks/venues/tasks/mvp/mvp-index.md` and `tasks/venues/tasks/mvp/data/README.md` | Found broken data links to missing `tasks/venues/tasks/mvp/data/data-00*.md` files. |
| Duplicate/title scan over 84 task files | Found real ID collision risk for proposed VEN-025-031, superseded CAFE-001 overlap, and non-fatal VEN-031/VEN-031 similarity. |

## Official-Doc Checks

| Surface | Finding | Source |
|---|---|---|
| Supabase RLS | RLS should be enabled on exposed schema tables; policies must cover role-specific access. UPDATE needs a SELECT policy, and service keys must not be exposed to customers. | <https://supabase.com/docs/guides/database/postgres/row-level-security> |
| Google Places API New | Place Details requests require a field mask; `X-Goog-FieldMask: *` is discouraged in production because it can return too much data and increase cost. | <https://developers.google.com/maps/documentation/places/web-service/place-details> |
| Twilio WhatsApp templates | WhatsApp templates can be paused/deactivated after negative feedback; Twilio can alert on paused/disabled/rejected template states. | <https://www.twilio.com/docs/whatsapp/tutorial/send-whatsapp-notification-messages-templates> |
| Twilio WhatsApp opt-in | WhatsApp messaging requires explicit opt-in; Twilio/WhatsApp may ask for proof and accounts can be affected by non-consensual messaging. | <https://help.twilio.com/articles/360017773294-Rules-and-Best-Practices-for-WhatsApp-Messaging-on-Twilio> |

## Critical Findings

| Severity | Finding | Evidence | Fix |
|---|---|---|---|
| P0 | Booking flow can fail silently | VEN-031 only required row creation and honest copy. It did not require rollback, duplicate prevention, retry, or failed state. | Added VEN-026 and VEN-028; patched VEN-031 acceptance. |
| P0 | RLS proof too shallow | VEN-031 acceptance only required migration and broad insert tests. | Added VEN-025; patched VEN-031 with SELECT/UPDATE/admin/anon negative proof. |
| P0 | WhatsApp compliance risk | VEN-031 had approval and outbox, but no consent, suppression, template, or Twilio failure requirements. | Added VEN-027; patched VEN-031. |
| P0 | Places cost and quota risk | VEN-010/VEN-013 depended on detail hydration; cache/field-mask enforcement lived only indirectly in data tasks. | Added VEN-031. |
| P0 | Tool/action render mismatch risk | VEN-031 identified naming risk, but no CI/local registry gate existed in MVP. | Added VEN-029. |
| P0 | Admin approval lacks durable audit trail | VEN-031 says audited, but no explicit audit-row acceptance existed. | Added VEN-030. |
| P1 | Broken index links | `mvp-index.md` and `mvp/data/README.md` pointed to missing local data files. | Updated links to `tasks/data/tasks-data/`. |
| P1 | ID collision in suggested fixes | VEN-025-031 already exist under post-MVP. | Added hardening as VEN-025-041 and updated numbering. |

## Duplicate Task Audit

| Candidate | Verdict | Notes |
|---|---|---|
| `tasks/venues/CAFE-001-booking-requests-schema.md` and VEN-031 | Superseded duplicate | VEN-031 is canonical because it unifies cafe, restaurant, and nightlife in `venue_booking_requests`. |
| VEN-031 and VEN-031 | Not duplicate | VEN-031 is the sheet UI; VEN-031 persists it. Added hardening tasks for missing reliability. |
| Proposed VEN-025-031 hardening tasks and existing post-MVP VEN-025-031 | ID collision | Existing post-MVP tasks keep their IDs; new hardening tasks use VEN-025-041. |
| VEN-019-ARCHIVED and OCL-013 | Intentional cancellation | VEN-019-ARCHIVED is cancelled and points to OCL-013. No action. |
| Data task local pointers vs canonical data tasks | Broken pointer, not duplicate | Canonical data tasks are under `tasks/data/tasks-data/`; `tasks/venues/tasks/mvp/data/` is now documented as a pointer folder only. |

## Corrected Release Order

The corrected MVP order is:

```text
DATA-001 -> DATA-002 -> DATA-003/DATA-004/DATA-005 -> DATA-006 -> DATA-007 -> DATA-008
-> VEN-009 -> VEN-010 -> VEN-011 -> VEN-012 -> VEN-013 -> VEN-031
-> VEN-031 -> VEN-031 -> VEN-031 -> VEN-031 -> VEN-031 -> VEN-031
-> VEN-026 -> VEN-028 -> VEN-031
-> VEN-031 -> VEN-027 -> VEN-031 -> VEN-031 -> VEN-030
-> VEN-025 -> VEN-029 -> VEN-031
```

See the canonical table with per-task scores in [`../INDEX.md`](../INDEX.md).

## Scorecard

| Area | Before | After task corrections | Notes |
|---|---:|---:|---|
| Planning | 88 | 88 | Structure was good; index links needed repair. |
| Architecture | 84 | 85 | Good vertical split; still needs proof in code. |
| Security | 70 | 78 | RLS/admin gates are now explicit, not implemented. |
| Reliability | 65 | 76 | Idempotency/retry/recovery tasks now exist. |
| Production readiness | 68 | 74 | Better release gate, no runtime evidence yet. |
| Overall | 78 | 84 | Correct as a task pack, not yet safe to ship. |

## Production Checklist

- [ ] RLS enabled on `venue_booking_requests`.
- [ ] User ownership SELECT/UPDATE/DELETE negative tests pass.
- [ ] Non-admin cannot approve or send WhatsApp.
- [ ] No service role in browser/client code.
- [ ] Places field masks enforced.
- [ ] Wildcard Places field masks blocked in production.
- [ ] Place details cached and error fallback visible.
- [ ] Booking insert idempotent.
- [ ] Duplicate booking prevented by server/database.
- [ ] Booking failure rolls back UI and offers retry.
- [ ] WhatsApp opt-in recorded.
- [ ] Suppression list blocks outbound sends.
- [ ] Approved template IDs used where required.
- [ ] Twilio failures logged.
- [ ] Approval/send audit events are queryable.
- [ ] CopilotKit action names and Mastra tool names tested.
- [ ] Playwright covers cafe, restaurant, nightlife, booking success/failure, RLS, and admin send path.
- [ ] Console errors are zero.
- [ ] `npm run floor` passes.

## Stop Condition

Do not call Venues MVP production-ready until VEN-031 passes after VEN-025, VEN-031, VEN-028, VEN-029, and VEN-030 have evidence attached.
