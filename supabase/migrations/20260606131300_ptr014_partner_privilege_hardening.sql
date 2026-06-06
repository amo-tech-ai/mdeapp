-- PTR-014 / SAN-683 — partner privilege hardening (PR #105 review F1, F4)
-- Purpose: close member self-elevation on partners.status and partner_services.tier.
-- Depends: ptr003 (partners), ptr007 (partner_services)
-- Storage F2/F3: fixed in ptr009 (member-scoped folder paths — not yet on remote).
--
-- DESIGN NOTE: privileged column writes route through service_role (edge functions),
-- consistent with F13 — no service-role keys in mdeapp/src/**.

begin;

-- F1: partners — members may edit settings only (RLS cannot restrict columns)
revoke update on public.partners from authenticated;
grant update (settings) on public.partners to authenticated;

-- F4: partner_services — members toggle enabled/config; tier is service_role-only
revoke insert, update on public.partner_services from authenticated;
grant insert (partner_id, service_key, enabled, config) on public.partner_services to authenticated;
grant update (enabled, config) on public.partner_services to authenticated;

commit;
