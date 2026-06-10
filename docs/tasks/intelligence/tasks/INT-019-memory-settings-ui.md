---
id: INT-019
title: Memory settings UI
phase: ADVANCED
priority: P2
status: Not Started
owner_system: [CopilotKit, App]
personas: [Patricia, Camila]
depends_on: [INT-011, INT-016]
unblocks: []
linear_title: "INT-019 — Memory settings UI"
linear_labels: [intelligence, advanced, p2, ui, privacy]
implements: []
related_re: []
related_vec: []
---

# INT-019 — Memory settings UI

## Problem

Users cannot view/edit/delete stored prefs or embeddings (GDPR-style control).

## User story

As **Camila**, I can remove “party hostel” ephemeral pref that expired wrong.

## Example

Settings page lists: neighborhood, budget style, semantic memories (summarized text).

## Workflow

```mermaid
flowchart TD
    U["Camila visits<br/>/settings/memory"] --> LIST["List user_preferences<br/>RLS: own rows only"]
    LIST --> PREFS["Pref cards<br/>neighborhood, budget style<br/>semantic summaries"]
    PREFS --> DEL["Delete pref<br/>cascades to embeddings row"]
    PREFS --> EXP["expires_at shown<br/>ephemeral prefs flagged"]
    DEL --> VERIFY["retrieve-user-preferences<br/>no longer returns deleted pref"]
    VERIFY --> CLEAN["Next search<br/>no stale bias"]
```

## Implementation steps

1. Route `/settings/memory` or Patricia admin slice
2. List `user_preferences` + delete
3. Delete cascades embeddings rows
4. Export optional (POST-MVP+)

## Files likely touched

- `mdeapp/src/app/settings/memory/page.tsx`
- `mdeapp/src/lib/supabase/preferences-client.ts`

## Data requirements

INT-011, INT-016 tables.

## RLS / security

User sees only own rows; admin separate RLS if Patricia scope.

## Tests

- Delete pref removes from retrieve tool
- Playwright: edit flow

## Acceptance criteria

- [ ] View + delete works authenticated
- [ ] Evidence in testing folder

## Failure points

- Exposing other users’ prefs (RLS bug)

## Dependencies

INT-011, INT-016

## Verify

### Component tests

```bash
cd mdeapp && npx vitest run src/components/settings/
# Expected: MemorySettingsPage renders preference list; delete button fires DELETE /api/user/preferences/:id;
#           "Clear all" shows confirmation modal before deleting
```

### Full suite + types

```bash
cd mdeapp && npm run test && npx tsc --noEmit
```

### Browser proof (requires `npm run dev` + auth)

```
1. Navigate to http://localhost:3001/settings/memory
2. Assert: list of saved preferences is shown (neighborhood, budget, dietary etc.)
3. Click delete on a single preference
4. Assert: preference disappears from list (no page reload needed)
   Network: DELETE /api/user/preferences/:id → 200
5. Click "Clear all memory"
6. Assert: confirmation dialog appears ("Are you sure?")
7. Confirm → all preferences deleted, list shows empty state
   Network: DELETE /api/user/preferences → 200
8. Navigate away, come back
9. Assert: empty state persists (not re-populated from stale cache)
```

### RLS check — user can only delete own prefs

```bash
# Attempt to DELETE another user's pref ID via API — must return 404 or 403
curl -s -X DELETE http://localhost:3001/api/user/preferences/ANOTHER-USER-PREF-ID \
  -H "Authorization: Bearer $USER_A_TOKEN" -o /dev/null -w "%{http_code}"
# Expected: 404 (row not found under RLS) or 403
```
