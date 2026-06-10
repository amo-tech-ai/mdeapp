---
parent: mde-supabase
title: Migrate postgres_changes to Broadcast
description: Step-by-step migration from legacy postgres_changes to DB-trigger broadcast for scalable Realtime on mdeai.co.
load_when: postgres_changes, migrate realtime, broadcast trigger, realtime bottleneck
---

# Migration: postgres_changes → broadcast

`postgres_changes` is a legacy Supabase API that routes through a single
Elixir GenServer per project. Under sustained load it becomes the bottleneck
for ALL realtime events — one slow subscriber can delay messages for
unrelated channels. `broadcast` via DB triggers is horizontally scalable.

---

## Step 1 — Identify postgres_changes usages

```bash
grep -r "postgres_changes" src/ --include="*.ts" --include="*.tsx" -l
```

For each file, note:
- Table being subscribed to
- Filter applied (e.g. `event_id=eq.${id}`)
- Event types (INSERT | UPDATE | DELETE | *)
- What the callback does (state update, cache invalidation, etc.)

---

## Step 2 — Create the DB trigger

Pick the right method based on what you need:

### Case A: Standard table mirroring

```sql
-- Replaces postgres_changes on `my_table` filtered by `parent_id`
CREATE OR REPLACE FUNCTION broadcast_my_table_changes()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM realtime.broadcast_changes(
    'my_table:' || COALESCE(NEW.parent_id, OLD.parent_id)::text,
    TG_OP, TG_OP, TG_TABLE_NAME, TG_TABLE_SCHEMA, NEW, OLD
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER my_table_broadcast_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.my_table
  FOR EACH ROW EXECUTE FUNCTION broadcast_my_table_changes();
```

### Case B: Custom / sanitized payload

```sql
CREATE OR REPLACE FUNCTION broadcast_my_table_safe()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  PERFORM realtime.send(
    jsonb_build_object('id', NEW.id, 'status', NEW.status),
    'row_updated',
    'my_table:' || NEW.parent_id::text,
    false  -- false = requires private channel on client
  );
  RETURN NEW;
END;
$$;
```

---

## Step 3 — Add RLS policy

```sql
-- Allow authenticated users to subscribe to topics they own
CREATE POLICY "owner_can_subscribe_my_table"
ON realtime.messages FOR SELECT TO authenticated
USING (
  realtime.topic() LIKE 'my_table:%' AND
  EXISTS (
    SELECT 1 FROM public.parent_table p
    WHERE p.id::text = split_part(realtime.topic(), ':', 2)
      AND p.user_id = auth.uid()
  )
);

-- Index the lookup column
CREATE INDEX IF NOT EXISTS idx_parent_table_user_id ON public.parent_table(user_id);
```

---

## Step 4 — Update client code

```typescript
// BEFORE (postgres_changes — delete this)
const channel = supabase
  .channel('my-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'my_table',
    filter: `parent_id=eq.${parentId}`,
  }, callback)
  .subscribe();

// AFTER (broadcast — use this)
const channel = supabase
  .channel(`my_table:${parentId}`, {
    config: { private: true },
  })
  .on('broadcast', { event: 'INSERT' }, callback)
  .on('broadcast', { event: 'UPDATE' }, callback)
  .on('broadcast', { event: 'DELETE' }, callback)
  .subscribe();

// Don't forget auth before subscribe
await supabase.realtime.setAuth();
await channel.subscribe();
```

---

## Step 5 — Handle event payload shape difference

`postgres_changes` payload:
```json
{ "schema": "public", "table": "my_table", "eventType": "INSERT",
  "new": { ...row }, "old": {} }
```

`broadcast_changes` payload via broadcast:
```json
{ "type": "broadcast", "event": "INSERT",
  "payload": { "schema": "public", "table": "my_table",
               "type": "INSERT", "new": { ...row }, "old": {} } }
```

Adjust your callback to read from `payload.new` instead of direct `.new`.

---

## Checklist

- [ ] DB trigger created and deployed
- [ ] RLS policy added to `realtime.messages`
- [ ] Index added for RLS lookup column
- [ ] Client updated: topic string changed, `private: true` added
- [ ] `setAuth()` called before `subscribe()`
- [ ] Cleanup `removeChannel` still present
- [ ] Old `postgres_changes` listener removed
- [ ] Tested end-to-end in dev
