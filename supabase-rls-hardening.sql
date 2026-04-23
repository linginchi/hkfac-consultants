-- ============================================
-- FAC Hong Kong — RLS hardening (run in Supabase SQL Editor)
-- ============================================
--
-- IMPORTANT
-- ---------
-- 1) Supabase Row Level Security cannot read your Next.js `admin_session` cookie.
--    "Only admins may write" is enforced by: **no anon/authenticated policies** on
--    sensitive tables + **server-only** access via SUPABASE_SERVICE_ROLE_KEY.
-- 2) After this script, configure Cloudflare (and local .env) with:
--      SUPABASE_SERVICE_ROLE_KEY = <Project Settings → API → service_role>
--    Never expose this key to the browser or NEXT_PUBLIC_*.
-- 3) Public site continues to use NEXT_PUBLIC_SUPABASE_ANON_KEY for:
--      - SELECT on active team_members (read-only)
--      - INSERT on leads (your existing contact form policy)
--
-- ============================================

-- ---------- team_members ----------
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read active members" ON team_members;
DROP POLICY IF EXISTS "Allow admin full access" ON team_members;
DROP POLICY IF EXISTS "Public read active team" ON team_members;

-- Anonymous + logged-in Supabase users: read only active rows (public website)
CREATE POLICY "Public read active team"
  ON team_members
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- No INSERT / UPDATE / DELETE policies for anon or authenticated → writes denied.
-- API routes use the service role client, which bypasses RLS.

-- ---------- admin_users ----------
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin users self access" ON admin_users;

-- No policies: only service_role (server) can access.

-- ---------- admin_sessions ----------
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin sessions access" ON admin_sessions;

-- No policies: only service_role.

-- ---------- verification_codes ----------
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Verification codes admin access" ON verification_codes;

-- No policies: only service_role.

-- ---------- admin_activity_log (if present) ----------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'admin_activity_log'
  ) THEN
    ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admin activity log access" ON admin_activity_log;
  END IF;
END $$;

-- ---------- Optional: consultants view ----------
-- If you use VIEW consultants AS SELECT * FROM team_members, grant select to anon:
-- ALTER VIEW consultants SET (security_invoker = true);
-- (Usually the view inherits team_members RLS when security_invoker is true in PG15+)
