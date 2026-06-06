-- PTR-014 / SAN-683 — partner privilege hardening (PR #105 review F1, F2, F3, F4)
-- Purpose: close member self-elevation paths and scope partner-assets storage to membership.
-- Depends: ptr003 (partners), ptr005 (partner_ids_for_user), ptr007 (partner_services), ptr009 (storage)
-- Review: https://github.com/amo-tech-ai/mdeapp/pull/105
--
-- DESIGN NOTE (admin/service path): admins authenticate as the `authenticated` role,
-- so column-level grants below intentionally route privileged transitions
-- (partners.status / completion_score / bridges, partner_services.tier) through
-- service_role — i.e. Supabase edge functions, consistent with the repo invariant
-- "no service-role keys in src/**; privileged writes via edge functions only".
-- If admins must set these from the browser instead, replace the column grants
-- with a BEFORE UPDATE guard trigger that allows `auth.role() = 'service_role'
-- OR public.is_admin()` and rejects member-driven changes to those columns.

begin;

-- ── F1: partners — members may edit `settings` only ─────────────────────────
-- ptr003 did `grant all ... to authenticated`, which (with the row-scoped
-- partners_update_member policy) let a member set status='active' /
-- completion_score=100, bypassing the draft → pending_review → active gate.
-- RLS cannot restrict columns; column privileges can.
revoke update on public.partners from authenticated;
grant update (settings) on public.partners to authenticated;
-- status, completion_score, activated_at, type, organization_id,
-- sponsor_organization_id, landlord_profile_id → service_role / edge only.

-- ── F4: partner_services — members toggle enabled/config, never `tier` ───────
-- Prevents self-upgrade to a paid tier when entitlement reads this table.
revoke insert, update on public.partner_services from authenticated;
grant insert (partner_id, service_key, enabled, config) on public.partner_services to authenticated;
grant update (enabled, config) on public.partner_services to authenticated;
-- `tier` omitted on insert → defaults 'free'; only service_role can change it.

-- ── F2 / F3: partner-assets storage — scope by `{partner_id}/…` path ─────────
-- ptr009 allowed any authenticated user to INSERT (F2) and only the uploader to
-- READ (F3, owner-scoped) — out of sync with the member-scoped table RLS.
-- Object name convention: '{partner_id}/{kind}/{filename}'. Compare the first
-- path segment (text) against the member's partner_ids cast to text — avoids
-- casting a possibly-malformed folder name to uuid.
drop policy if exists partner_assets_storage_insert on storage.objects;
create policy partner_assets_storage_insert
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'partner-assets'
    and (storage.foldername(name))[1] in (
      select pid::text from public.partner_ids_for_user() as pid
    )
  );

drop policy if exists partner_assets_storage_select_member on storage.objects;
create policy partner_assets_storage_select_member
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'partner-assets'
    and (
      (storage.foldername(name))[1] in (
        select pid::text from public.partner_ids_for_user() as pid
      )
      or (select public.is_admin())
    )
  );

-- replace the owner-scoped update/delete with member-scoped equivalents
drop policy if exists partner_assets_storage_update_own on storage.objects;
drop policy if exists partner_assets_storage_update_member on storage.objects;
create policy partner_assets_storage_update_member
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'partner-assets'
    and (storage.foldername(name))[1] in (
      select pid::text from public.partner_ids_for_user() as pid
    )
  )
  with check (
    bucket_id = 'partner-assets'
    and (storage.foldername(name))[1] in (
      select pid::text from public.partner_ids_for_user() as pid
    )
  );

drop policy if exists partner_assets_storage_delete_own on storage.objects;
drop policy if exists partner_assets_storage_delete_member on storage.objects;
create policy partner_assets_storage_delete_member
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'partner-assets'
    and (storage.foldername(name))[1] in (
      select pid::text from public.partner_ids_for_user() as pid
    )
  );

-- (partner_assets_storage_service_role from ptr009 is left intact.)

commit;
