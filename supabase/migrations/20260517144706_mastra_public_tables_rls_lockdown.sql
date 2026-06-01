-- Mastra public schema tables: enable RLS + service_role-only access.
-- Mastra runtime (Vercel) uses service role / direct Postgres — not browser anon JWT.
-- Blocks PostgREST anon/authenticated reads of threads, messages, spans, etc.

DO $$
DECLARE
  t text;
BEGIN
  FOR t IN
    SELECT c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'
      AND c.relname LIKE 'mastra\_%'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', t);

    EXECUTE format(
      'DROP POLICY IF EXISTS service_role_manage ON public.%I',
      t
    );
    EXECUTE format(
      $p$
        CREATE POLICY service_role_manage ON public.%I
          FOR ALL TO service_role
          USING (true)
          WITH CHECK (true)
      $p$,
      t
    );

    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon, authenticated', t);
  END LOOP;
END $$;
