-- PTR-001 / SAN-683a — partner enums
-- Purpose: shared partner_type and partner_status enums
-- Audit: tasks/design/partners/audit/06b-supabase-audit.md

begin;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'partner_type') then
    create type public.partner_type as enum (
      'host',
      'venue',
      'broker',
      'sponsor',
      'agency',
      'vendor',
      'tour',
      'creator'
    );
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'partner_status') then
    create type public.partner_status as enum (
      'draft',
      'pending_review',
      'active',
      'suspended',
      'churned'
    );
  end if;
end
$$;

comment on type public.partner_type is
  'Supply-side partner vertical aligned with Linear ptr:* labels (SAN-683).';

comment on type public.partner_status is
  'Partner lifecycle: draft → pending_review → active; suspended/churned for ops.';

commit;
