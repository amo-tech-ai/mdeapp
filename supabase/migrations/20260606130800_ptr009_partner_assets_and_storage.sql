-- PTR-009 / SAN-683 — partner_assets + partner-assets storage bucket
-- Purpose: logos, menus, contracts for partner dashboard (SAN-687 dependency)
-- Depends: ptr005

begin;

create table if not exists public.partner_assets (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners (id) on delete cascade,
  kind text not null,
  storage_path text not null,
  mime_type text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

comment on table public.partner_assets is
  'Partner-uploaded files metadata. Files live in storage bucket partner-assets.';

create index if not exists idx_partner_assets_partner_id
  on public.partner_assets (partner_id);

create index if not exists idx_partner_assets_kind
  on public.partner_assets (partner_id, kind);

alter table public.partner_assets enable row level security;

drop policy if exists partner_assets_select_member on public.partner_assets;
create policy partner_assets_select_member
  on public.partner_assets
  for select
  to authenticated
  using (
    partner_id in (select public.partner_ids_for_user())
    or (select public.is_admin())
  );

drop policy if exists partner_assets_insert_member on public.partner_assets;
create policy partner_assets_insert_member
  on public.partner_assets
  for insert
  to authenticated
  with check (partner_id in (select public.partner_ids_for_user()));

drop policy if exists partner_assets_update_member on public.partner_assets;
create policy partner_assets_update_member
  on public.partner_assets
  for update
  to authenticated
  using (partner_id in (select public.partner_ids_for_user()) or (select public.is_admin()))
  with check (partner_id in (select public.partner_ids_for_user()) or (select public.is_admin()));

drop policy if exists partner_assets_delete_member on public.partner_assets;
create policy partner_assets_delete_member
  on public.partner_assets
  for delete
  to authenticated
  using (partner_id in (select public.partner_ids_for_user()) or (select public.is_admin()));

drop policy if exists partner_assets_service_role on public.partner_assets;
create policy partner_assets_service_role
  on public.partner_assets
  to service_role
  using (true)
  with check (true);

grant all on table public.partner_assets to authenticated, service_role;

-- Storage bucket (private; member-scoped write)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'partner-assets',
  'partner-assets',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do nothing;

drop policy if exists partner_assets_storage_insert on storage.objects;
create policy partner_assets_storage_insert
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'partner-assets');

drop policy if exists partner_assets_storage_select_member on storage.objects;
create policy partner_assets_storage_select_member
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'partner-assets'
    and (
      owner = (select auth.uid())
      or (select public.is_admin())
    )
  );

drop policy if exists partner_assets_storage_update_own on storage.objects;
create policy partner_assets_storage_update_own
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'partner-assets' and owner = (select auth.uid()))
  with check (bucket_id = 'partner-assets' and owner = (select auth.uid()));

drop policy if exists partner_assets_storage_delete_own on storage.objects;
create policy partner_assets_storage_delete_own
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'partner-assets' and owner = (select auth.uid()));

drop policy if exists partner_assets_storage_service_role on storage.objects;
create policy partner_assets_storage_service_role
  on storage.objects
  to service_role
  using (bucket_id = 'partner-assets')
  with check (bucket_id = 'partner-assets');

commit;
