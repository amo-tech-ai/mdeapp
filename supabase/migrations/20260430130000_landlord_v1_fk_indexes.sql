-- Landlord V1 D4 audit follow-up — backfill missing FK indexes.
-- Caught during the post-D4 audit pass; both columns were FKs without
-- a covering index. Per the existing "schema-foreign-key-indexes"
-- convention used by the P1 CRM tables.

-- CREATE INDEX IF NOT EXISTS landlord_inbox_events_actor_idx
--   ON public.landlord_inbox_events(actor_user_id)
--   WHERE actor_user_id IS NOT NULL;
-- NOTE: landlord_inbox_events table was never created; index commented out to
-- allow supabase db reset to complete. Restore when/if table is added.

-- CREATE INDEX IF NOT EXISTS verification_requests_reviewed_by_idx
--   ON public.verification_requests(reviewed_by)
--   WHERE reviewed_by IS NOT NULL;
-- NOTE: verification_requests table was never created in migrations; index commented
-- out to allow supabase db reset. Restore when/if table migration is added.
