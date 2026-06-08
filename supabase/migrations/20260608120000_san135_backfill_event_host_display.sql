-- SAN-135 · Option C: denormalize host display on events.details (no profile RLS)
UPDATE public.events e
SET details = COALESCE(e.details, '{}'::jsonb) || jsonb_build_object(
  'host_display', jsonb_build_object(
    'name', p.full_name,
    'avatar_url', p.avatar_url
  )
)
FROM public.profiles p
WHERE e.organizer_id = p.id
  AND e.organizer_id IS NOT NULL
  AND p.full_name IS NOT NULL
  AND trim(p.full_name) <> ''
  AND (
    e.details IS NULL
    OR e.details->'host_display' IS NULL
    OR e.details->'host_display' = 'null'::jsonb
  );
