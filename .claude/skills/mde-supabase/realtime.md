---
parent: mde-supabase
name: supabase-realtime
description: >
  Use whenever working with Supabase Realtime — live channels, subscriptions,
  WebSocket events, broadcast, presence, postgres_changes, or any feature
  requiring real-time data push to clients. Trigger on: "realtime", "live
  updates", "subscribe", "channel", "broadcast", "presence",
  "postgres_changes", "websocket", "leaderboard live", "notifications push",
  "event counter", "typing indicator". This skill is authoritative on
  Supabase Realtime architecture: when to use broadcast vs. postgres_changes
  (answer: always broadcast via DB triggers), how to secure channels with RLS,
  private channel config, topic naming, React cleanup, and migration paths.
  Use this skill proactively any time the user adds or modifies live-data
  features, even if they don't explicitly say "Realtime".
---

# Supabase Realtime

Build live features the right way: broadcast via DB triggers for all database
changes, private channels for security, granular topics for scalability.

---

## Critical Rules (R1–R8)

| ID | Rule | Why it matters |
|----|------|----------------|
| **R1** | Never use `postgres_changes` for new features | Single-threaded under the hood — it doesn't fan-out. Breaks under load. Use broadcast via DB trigger instead. |
| **R2** | Always set `private: true` on channels that touch DB triggers | Without it, any authenticated user can subscribe to `realtime.broadcast_changes` topics. |
| **R3** | Always call `supabase.realtime.setAuth()` before `.subscribe()` | Without it, private channel auth silently fails and the client never receives messages. |
| **R4** | Add RLS policy on `realtime.messages` for every private channel | This is the actual access gate. Without it, `private: true` is cosmetic. |
| **R5** | One channel per logical scope — never global channels | `global:updates` fans out to every connected client. Use `event:123:tickets` instead. |
| **R6** | Topic naming: `scope:id:subtopic` — never generic strings | Generic topics like `"updates"` or `"changes"` can't be RLS-scoped and leak data. |
| **R7** | Always unsubscribe in React cleanup (`supabase.removeChannel`) | Leaked channels accumulate WebSocket subscriptions and cause memory leaks + billing. |
| **R8** | In DB trigger functions: use `SECURITY DEFINER` + `SET search_path = ''` | Prevents privilege escalation. Required for `realtime.broadcast_changes` and `realtime.send`. |

---

## Architecture Decision: broadcast vs postgres_changes vs presence

```
Q: I need live data from the database → broadcast via DB trigger (R1)
Q: I need user online/typing status → presence (sparingly)
Q: I need client-to-client messages without DB → broadcast (no trigger)
Q: Legacy code uses postgres_changes → migrate (see reference file)
```

**Never use `postgres_changes` for new code.** It's a legacy API with a
single-threaded bottleneck. The table below replaces it entirely.

| Use Case | Pattern | Channel Config |
|----------|---------|---------------|
| DB row changes → all subscribers | `realtime.broadcast_changes()` trigger | `private: true` |
| Custom payload with business logic | `realtime.send()` trigger | `private: true` |
| Client-to-client (no DB) | `channel.send({ type: 'broadcast' })` | `private: true` or public |
| Online status / cursors | `channel.track()` / presence | `private: true` |

---

## Topic Naming

Pattern: **`scope:id:subtopic`**

```
conversation:abc123:messages    ← messages in a specific conversation
trip:xyz789:items               ← trip planner items
event:evt123:tickets            ← live ticket count for event
user:uid456:notifications       ← personal push channel
vote:tally:contest123           ← leaderboard for a contest
staff-checkin:event_id          ← door scanner counter
job:jobid:status                ← async job progress
```

**Never do:** `messages`, `updates`, `global_feed`, `all_events`

The scope+id combination is what makes RLS policies possible and efficient.
Without an ID in the topic, you can't write a `WHERE user_id = auth.uid()`
style check.

---

## Event Naming

Pattern: **`entity_action`** (snake_case)

```sql
-- Good
'message_created', 'ticket_sold', 'job_status_changed', 'user_joined'

-- Bad
'update', 'change', 'event', 'INSERT'  ← too generic, can't filter
```

---

## React Pattern (useEffect + cleanup)

```tsx
const channelRef = useRef<RealtimeChannel | null>(null);

useEffect(() => {
  if (!entityId || !user) return;
  // Prevent duplicate subscriptions
  if (channelRef.current?.state === 'subscribed') return;

  const channel = supabase.channel(`scope:${entityId}:events`, {
    config: { private: true },
  });
  channelRef.current = channel;

  // Auth MUST come before subscribe
  supabase.realtime.setAuth().then(() => {
    channel
      .on('broadcast', { event: 'entity_action' }, (payload) => {
        // handle payload
      })
      .subscribe((status, err) => {
        if (status === 'CHANNEL_ERROR') console.error('[RT]', err);
      });
  });

  return () => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  };
}, [entityId, user?.id]);
```

Key things:
- Check `channelRef.current?.state === 'subscribed'` to prevent doubles
- `setAuth()` before `subscribe()` — always
- Cleanup returns `supabase.removeChannel(channel)`
- Dependencies are minimal IDs, not whole objects (prevents churn)

---

## DB Trigger: broadcast_changes (for table mirroring)

Use this when clients need to react to standard INSERT/UPDATE/DELETE on a table.

```sql
CREATE OR REPLACE FUNCTION broadcast_my_table_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM realtime.broadcast_changes(
    'scope:' || COALESCE(NEW.parent_id, OLD.parent_id)::text || ':events',
    TG_OP,           -- event name: INSERT | UPDATE | DELETE
    TG_OP,           -- operation type (used by client-side filtering)
    TG_TABLE_NAME,
    TG_TABLE_SCHEMA,
    NEW,
    OLD
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER my_table_broadcast
  AFTER INSERT OR UPDATE OR DELETE ON public.my_table
  FOR EACH ROW EXECUTE FUNCTION broadcast_my_table_changes();
```

**Conditional broadcasting** (only on meaningful field changes):

```sql
-- Only broadcast when status actually changes (avoids noise)
IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
  PERFORM realtime.broadcast_changes(...);
END IF;
```

---

## DB Trigger: realtime.send (for custom payloads)

Use when you need custom payload structure, sanitization, or computed fields.

```sql
CREATE OR REPLACE FUNCTION broadcast_job_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Send ONLY safe fields — never include secrets or large blobs
  PERFORM realtime.send(
    jsonb_build_object(
      'job_id',     NEW.id,
      'status',     NEW.status,
      'progress',   NEW.progress,
      'updated_at', NEW.updated_at
      -- Deliberately excludes: input_json, result_json, internal fields
    ),
    'job_status_changed',           -- event name
    'job:' || NEW.id::text || ':status',  -- topic
    false                           -- false = private channel required
  );
  RETURN NEW;
END;
$$;
```

---

## RLS on realtime.messages (security gate)

Every private channel needs TWO policies on `realtime.messages`:

```sql
-- 1. Who can SUBSCRIBE (SELECT)
CREATE POLICY "users_can_subscribe_own_scope"
ON realtime.messages
FOR SELECT TO authenticated
USING (
  -- Example: user can only receive messages for their own conversations
  realtime.topic() LIKE 'conversation:%' AND
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id::text = split_part(realtime.topic(), ':', 2)
      AND c.user_id = auth.uid()
  )
);

-- 2. Who can PUBLISH (INSERT) — only if clients broadcast to each other
CREATE POLICY "users_can_publish_own_scope"
ON realtime.messages
FOR INSERT TO authenticated
WITH CHECK (
  realtime.topic() LIKE 'conversation:%' AND
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id::text = split_part(realtime.topic(), ':', 2)
      AND c.user_id = auth.uid()
  )
);

-- Required indexes for RLS performance (critical — missing = full table scan per message)
CREATE INDEX idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX idx_conversations_id ON public.conversations(id);
```

For DB-trigger-only channels (no client publishing), only the SELECT policy
is needed. Broadcasts from `realtime.send()` / `realtime.broadcast_changes()`
bypass the INSERT policy since they come from SECURITY DEFINER functions.

---

## Performance Rules

- **One channel per logical scope** — not one per user. `event:123:tickets` is shared by all dashboard viewers for that event. Don't create `user:456:event:123:tickets`.
- **Filter at the trigger** — don't broadcast all rows then filter client-side. Use `WHERE` in the trigger body.
- **Sanitize payload size** — large JSON payloads (>8 KB) cause latency. Strip blobs and large text from trigger payloads.
- **Prefer cache invalidation over full-state push** — send a small event like `{ type: 'ticket_sold', count: 1 }` and let the client refetch, rather than pushing the entire updated record.
- **Presence is expensive** — every track/untrack cycles all presence state for all members. Only use for genuine online-status features (typing indicators, active users). Not for counters.

---

## Reference files

- `references/migration-from-postgres-changes.md` — step-by-step migration guide
- `references/rls-policy-cookbook.md` — RLS patterns for common mdeai scenarios (conversations, trips, events, votes)
