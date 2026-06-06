-- PTR-005 / SAN-683 — RLS helpers + member-scoped policies
-- Purpose: partner_ids_for_user() and extend org/partners/members RLS for team access
-- Depends: ptr004

begin;

create or replace function public.partner_ids_for_user()
returns setof uuid
language sql
stable
security definer
set search_path = ''
as $$
  select public.partner_members.partner_id
  from public.partner_members
  where public.partner_members.profile_id = (select auth.uid());
$$;

comment on function public.partner_ids_for_user() is
  'RLS helper: partner_ids for authenticated user. SECURITY DEFINER; search_path locked.';

create or replace function public.partner_organization_ids_for_user()
returns setof uuid
language sql
stable
security definer
set search_path = ''
as $$
  select public.partners.organization_id
  from public.partners
  where public.partners.id in (select public.partner_ids_for_user())
    and public.partners.organization_id is not null;
$$;

comment on function public.partner_organization_ids_for_user() is
  'RLS helper: organization_ids visible to current partner member.';

grant execute on function public.partner_ids_for_user() to authenticated, service_role;
grant execute on function public.partner_organization_ids_for_user() to authenticated, service_role;

-- partner_organizations: member access
drop policy if exists partner_organizations_select_member on public.partner_organizations;
create policy partner_organizations_select_member
  on public.partner_organizations
  for select
  to authenticated
  using (id in (select public.partner_organization_ids_for_user()));

drop policy if exists partner_organizations_update_member on public.partner_organizations;
create policy partner_organizations_update_member
  on public.partner_organizations
  for update
  to authenticated
  using (id in (select public.partner_organization_ids_for_user()))
  with check (id in (select public.partner_organization_ids_for_user()));

-- partners: member access
drop policy if exists partners_select_member on public.partners;
create policy partners_select_member
  on public.partners
  for select
  to authenticated
  using (id in (select public.partner_ids_for_user()));

drop policy if exists partners_update_member on public.partners;
create policy partners_update_member
  on public.partners
  for update
  to authenticated
  using (id in (select public.partner_ids_for_user()))
  with check (id in (select public.partner_ids_for_user()));

-- partner_members: team visibility + owner mutations
drop policy if exists partner_members_select_team on public.partner_members;
create policy partner_members_select_team
  on public.partner_members
  for select
  to authenticated
  using (partner_id in (select public.partner_ids_for_user()));

drop policy if exists partner_members_update_owner on public.partner_members;
create policy partner_members_update_owner
  on public.partner_members
  for update
  to authenticated
  using (
    partner_id in (
      select pm.partner_id
      from public.partner_members pm
      where pm.profile_id = (select auth.uid())
        and pm.role = 'owner'
    )
  )
  with check (
    partner_id in (
      select pm.partner_id
      from public.partner_members pm
      where pm.profile_id = (select auth.uid())
        and pm.role = 'owner'
    )
  );

drop policy if exists partner_members_delete_owner on public.partner_members;
create policy partner_members_delete_owner
  on public.partner_members
  for delete
  to authenticated
  using (
    partner_id in (
      select pm.partner_id
      from public.partner_members pm
      where pm.profile_id = (select auth.uid())
        and pm.role = 'owner'
    )
  );

commit;
