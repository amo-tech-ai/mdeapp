-- SAN-683 / 06c schema gate — run after ptr001–ptr014 + partners.seed.sql
-- Expectations documented inline.

-- §A — schema shape
select count(*) as partner_tables from information_schema.tables
 where table_schema = 'public'
   and table_name in (
     'partner_organizations', 'partners', 'partner_members', 'partner_drafts',
     'partner_services', 'partner_locations', 'partner_assets', 'revenue_ledger'
   );

select count(*) as leads_partner_cols from information_schema.columns
 where table_schema = 'public' and table_name = 'leads'
   and column_name in ('partner_id', 'listing_kind', 'listing_id');

select count(*) as bookings_partner_cols from information_schema.columns
 where table_schema = 'public' and table_name = 'bookings'
   and column_name in ('partner_id', 'approved_by', 'approved_at', 'partner_notes', 'partner_status');

select count(*) as partner_enums from pg_type
 where typname in ('partner_type', 'partner_status');

select count(*) as partner_rls_tables from pg_tables
 where schemaname = 'public'
   and tablename in (
     'partner_organizations', 'partners', 'partner_members', 'partner_drafts',
     'partner_services', 'partner_locations', 'partner_assets', 'revenue_ledger'
   )
   and rowsecurity = true;

select count(*) as partner_helpers from pg_proc p
 join pg_namespace n on n.oid = p.pronamespace
 where n.nspname = 'public'
   and p.proname in ('partner_ids_for_user', 'is_admin', 'update_updated_at');
