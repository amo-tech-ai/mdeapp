-- C03: Extend leads table for chat-sourced lead capture
-- Makes user_id nullable (anonymous chat users generate leads too)
-- Adds conversation_id, intent, name for the capture_lead tool.
-- Practices: FK indexes, RLS already enabled on table.

ALTER TABLE public.leads ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS conversation_id uuid REFERENCES public.conversations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS intent text,
  ADD COLUMN IF NOT EXISTS name text;

CREATE INDEX IF NOT EXISTS idx_leads_conversation_id ON public.leads (conversation_id);
CREATE INDEX IF NOT EXISTS idx_leads_intent ON public.leads (intent);

COMMENT ON COLUMN public.leads.user_id IS 'NULL for anonymous chat leads; profiles.id for authenticated users';
COMMENT ON COLUMN public.leads.conversation_id IS 'Chat conversation that triggered this lead';
COMMENT ON COLUMN public.leads.intent IS 'What the user wants: rental | host | buyer | event_organizer | sponsor';
COMMENT ON COLUMN public.leads.name IS 'Name provided voluntarily in chat';
