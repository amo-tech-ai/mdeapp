---
parent: mde-supabase
title: Realtime RLS Policy Cookbook
description: RLS policies on realtime.messages for mdeai channel topics (conversations, trips, staff check-in, votes, host dashboard).
load_when: realtime.messages RLS, private channel policy, broadcast topic security
---

# RLS Policy Cookbook — mdeai Realtime

These policies match the actual mdeai channel topics and table structure.
Apply to `realtime.messages` in a migration file.

---

## 1. Conversations (chat messages)

Topic pattern: `conversation:{uuid}:messages`

```sql
CREATE POLICY "rt_conversation_messages_select"
ON realtime.messages FOR SELECT TO authenticated
USING (
  realtime.topic() LIKE 'conversation:%:messages' AND
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id::text = split_part(realtime.topic(), ':', 2)
      AND c.user_id = (SELECT auth.uid())
  )
);

CREATE INDEX IF NOT EXISTS idx_rt_conversations_user
  ON public.conversations(user_id, id);
```

---

## 2. Trips (items + metadata)

Topic patterns: `trip:{uuid}:items`, `trip:{uuid}:meta`

```sql
CREATE POLICY "rt_trip_items_select"
ON realtime.messages FOR SELECT TO authenticated
USING (
  realtime.topic() LIKE 'trip:%' AND
  EXISTS (
    SELECT 1 FROM public.trips t
    WHERE t.id::text = split_part(realtime.topic(), ':', 2)
      AND t.user_id = (SELECT auth.uid())
  )
);

CREATE INDEX IF NOT EXISTS idx_rt_trips_user
  ON public.trips(user_id, id);
```

---

## 3. Agent Jobs (progress tracking)

Topic pattern: `job:{uuid}:status`

```sql
CREATE POLICY "rt_job_status_select"
ON realtime.messages FOR SELECT TO authenticated
USING (
  realtime.topic() LIKE 'job:%:status' AND
  EXISTS (
    SELECT 1 FROM public.agent_jobs j
    WHERE j.id::text = split_part(realtime.topic(), ':', 2)
      AND j.user_id = (SELECT auth.uid())
  )
);

CREATE INDEX IF NOT EXISTS idx_rt_agent_jobs_user
  ON public.agent_jobs(user_id, id);
```

---

## 4. User Notifications (personal push channel)

Topic pattern: `user:{user_uuid}:notifications`

```sql
-- Direct self-check: topic must contain the user's own UUID
CREATE POLICY "rt_user_notifications_select"
ON realtime.messages FOR SELECT TO authenticated
USING (
  realtime.topic() LIKE 'user:%:notifications' AND
  split_part(realtime.topic(), ':', 2) = (SELECT auth.uid())::text
);
-- No index needed — direct UUID comparison
```

---

## 5. Staff Check-In Counter

Topic pattern: `staff-checkin:{event_uuid}`

```sql
-- Staff have a custom JWT (not Supabase auth) so check is done
-- in the edge function, not here. The channel is kept semi-public
-- OR you can scope to event organizers:
CREATE POLICY "rt_staff_checkin_select"
ON realtime.messages FOR SELECT TO authenticated
USING (
  realtime.topic() LIKE 'staff-checkin:%' AND
  EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id::text = split_part(realtime.topic(), ':', 2)
      AND e.organizer_id = (SELECT auth.uid())
  )
);

CREATE INDEX IF NOT EXISTS idx_rt_events_organizer
  ON public.events(organizer_id, id);
```

Note: Door staff use a custom HS256 JWT (not Supabase auth) to access
`ticket-validate`. The staff-checkin channel counter is primarily for the
organizer dashboard, not the staff PWA.

---

## 6. Host Event Dashboard

Topic pattern: `host-event-dashboard:{event_uuid}`

```sql
CREATE POLICY "rt_host_event_dashboard_select"
ON realtime.messages FOR SELECT TO authenticated
USING (
  realtime.topic() LIKE 'host-event-dashboard:%' AND
  EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id::text = split_part(realtime.topic(), ':', 2)
      AND e.organizer_id = (SELECT auth.uid())
  )
);
-- Reuses idx_rt_events_organizer from above
```

---

## 7. Contest Leaderboard / Vote Tally

Topic pattern: `vote:tally:{contest_uuid}`

```sql
-- Leaderboards are public read — any authenticated user can view
CREATE POLICY "rt_vote_tally_select"
ON realtime.messages FOR SELECT TO authenticated
USING (
  realtime.topic() LIKE 'vote:tally:%'
  -- No ownership check — public leaderboard
);
```

If the contest is invite-only, add an enrollment check similar to the
conversation pattern above.

---

## 8. Catch-all combined policy (alternative approach)

Instead of per-topic policies, one policy handles all mdeai topics:

```sql
CREATE POLICY "rt_combined_mdeai_access"
ON realtime.messages FOR SELECT TO authenticated
USING (
  CASE split_part(realtime.topic(), ':', 1)
    WHEN 'conversation' THEN EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id::text = split_part(realtime.topic(), ':', 2)
        AND user_id = (SELECT auth.uid())
    )
    WHEN 'trip' THEN EXISTS (
      SELECT 1 FROM public.trips
      WHERE id::text = split_part(realtime.topic(), ':', 2)
        AND user_id = (SELECT auth.uid())
    )
    WHEN 'job' THEN EXISTS (
      SELECT 1 FROM public.agent_jobs
      WHERE id::text = split_part(realtime.topic(), ':', 2)
        AND user_id = (SELECT auth.uid())
    )
    WHEN 'user' THEN
      split_part(realtime.topic(), ':', 2) = (SELECT auth.uid())::text
    WHEN 'vote' THEN true  -- public leaderboard
    ELSE false
  END
);
```

This is simpler to maintain but harder to audit. Prefer per-topic policies
for production — they're easier to reason about under audit.
