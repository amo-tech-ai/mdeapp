-- SAN-135 follow-up: normalize existing host_display snapshots (original backfill applied live)
UPDATE public.events e
SET details = jsonb_set(
  COALESCE(e.details, '{}'::jsonb),
  '{host_display}',
  jsonb_build_object(
    'name', trim(e.details->'host_display'->>'name'),
    'avatar_url', nullif(trim(e.details->'host_display'->>'avatar_url'), '')
  ),
  true
)
WHERE e.details->'host_display' IS NOT NULL
  AND e.details->'host_display' != 'null'::jsonb
  AND trim(e.details->'host_display'->>'name') <> ''
  AND (
    e.details->'host_display'->>'name' IS DISTINCT FROM trim(e.details->'host_display'->>'name')
    OR nullif(trim(e.details->'host_display'->>'avatar_url'), '')
      IS DISTINCT FROM e.details->'host_display'->>'avatar_url'
  );
