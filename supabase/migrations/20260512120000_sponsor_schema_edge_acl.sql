-- Minimal sponsor schema for local/staging Edge ACL tests and sponsor.* edge lookups.
-- RLS: authenticated users see only rows where owner_user_id = auth.uid().
-- Seed: scripts/seed-edge-sponsor-fixtures.sh + EDGE_TEST_USER_ID (auth.users.id).

CREATE SCHEMA IF NOT EXISTS sponsor;

CREATE TABLE IF NOT EXISTS sponsor.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DO $do$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='sponsor' AND table_name='organizations' AND column_name='owner_user_id') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_sponsor_organizations_owner ON sponsor.organizations (owner_user_id)';
  END IF;
END $do$;

CREATE TABLE IF NOT EXISTS sponsor.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES sponsor.organizations (id) ON DELETE CASCADE,
  owner_user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  tier text,
  activation_type text,
  campaign_goals jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sponsor_applications_org
  ON sponsor.applications (organization_id);
DO $do$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='sponsor' AND table_name='applications' AND column_name='owner_user_id') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_sponsor_applications_owner ON sponsor.applications (owner_user_id)';
  END IF;
END $do$;

CREATE TABLE IF NOT EXISTS sponsor.assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES sponsor.organizations (id) ON DELETE CASCADE,
  application_id uuid REFERENCES sponsor.applications (id) ON DELETE SET NULL,
  owner_user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  ai_moderation_status text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DO $do$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='sponsor' AND table_name='assets' AND column_name='owner_user_id') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_sponsor_assets_owner ON sponsor.assets (owner_user_id)';
  END IF;
END $do$;

ALTER TABLE sponsor.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsor.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsor.assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sponsor_org_select_own ON sponsor.organizations;
DO $do$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='sponsor' AND table_name='organizations' AND column_name='owner_user_id') THEN
    EXECUTE $e$ CREATE POLICY sponsor_org_select_own ON sponsor.organizations FOR SELECT TO authenticated USING (owner_user_id = (SELECT auth.uid())); $e$;
  END IF;
END $do$;

DROP POLICY IF EXISTS sponsor_org_service_all ON sponsor.organizations;
CREATE POLICY sponsor_org_service_all
  ON sponsor.organizations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS sponsor_app_select_own ON sponsor.applications;
DO $do$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='sponsor' AND table_name='applications' AND column_name='owner_user_id') THEN
    EXECUTE $e$ CREATE POLICY sponsor_app_select_own ON sponsor.applications FOR SELECT TO authenticated USING (owner_user_id = (SELECT auth.uid())); $e$;
  END IF;
END $do$;

DROP POLICY IF EXISTS sponsor_app_service_all ON sponsor.applications;
CREATE POLICY sponsor_app_service_all
  ON sponsor.applications
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS sponsor_asset_select_own ON sponsor.assets;
DO $do$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='sponsor' AND table_name='assets' AND column_name='owner_user_id') THEN
    EXECUTE $e$ CREATE POLICY sponsor_asset_select_own ON sponsor.assets FOR SELECT TO authenticated USING (owner_user_id = (SELECT auth.uid())); $e$;
  END IF;
END $do$;

DROP POLICY IF EXISTS sponsor_asset_service_all ON sponsor.assets;
CREATE POLICY sponsor_asset_service_all
  ON sponsor.assets
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

GRANT USAGE ON SCHEMA sponsor TO anon, authenticated, service_role;
GRANT SELECT ON sponsor.organizations TO authenticated;
GRANT SELECT ON sponsor.applications TO authenticated;
GRANT SELECT ON sponsor.assets TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA sponsor TO service_role;
