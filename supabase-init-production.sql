-- ============================================
-- FAC Hong Kong — 生產環境一次性初始化（Supabase SQL Editor）
-- 執行順序：整份貼上後一次 Run（若表已存在，CREATE IF NOT EXISTS / OR REPLACE 可重跑）
-- ============================================
--
-- 說明：
-- 1) 本站「顧問」資料在應用程式中的表名為 team_members；下方提供同名視圖 consultants 方便查詢。
-- 2) 管理後台登入使用自訂表 admin_users + admin_sessions，不依賴 Supabase Auth 的「註冊」流程。
-- 3) 目前 Next API 使用 NEXT_PUBLIC_SUPABASE_ANON_KEY；admin 相關表必須允許 anon 經 REST 訪問，
--    否則登入/驗證會失敗。下方對 admin 表採用「關閉 RLS」（簡化方案）。
--    生產環境更安全的做法是：後端改用 SUPABASE_SERVICE_ROLE_KEY（僅服務端、勿暴露給瀏覽器）
--    並為 admin 表重新設計 RLS。
-- ============================================

-- ---------- Leads（聯絡表單）----------
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT NOT NULL,
    title TEXT NOT NULL,
    region TEXT,
    investment_focus TEXT,
    message TEXT,
    whitepaper_request BOOLEAN DEFAULT FALSE,
    source TEXT DEFAULT 'website_contact_form',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon inserts" ON leads;
CREATE POLICY "Allow anon inserts" ON leads
    FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Deny anon reads" ON leads;
CREATE POLICY "Deny anon reads" ON leads
    FOR SELECT TO anon USING (false);

DROP POLICY IF EXISTS "Allow auth full access" ON leads;
CREATE POLICY "Allow auth full access" ON leads
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE VIEW leads_dashboard AS
SELECT
    id, first_name, last_name, email, company, title,
    region, investment_focus, whitepaper_request, source,
    created_at, email_sent, email_sent_at,
    CASE WHEN email_sent THEN 'Completed' ELSE 'Pending' END AS email_status
FROM leads
ORDER BY created_at DESC;

-- ---------- Team / 顧問（team_members）----------
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE,
    linkedin_url TEXT,
    role_en TEXT NOT NULL,
    role_zh_hk TEXT,
    role_zh_cn TEXT,
    expertise_areas TEXT[],
    bio_en TEXT CHECK (bio_en IS NULL OR LENGTH(bio_en) <= 200),
    bio_zh_hk TEXT CHECK (bio_zh_hk IS NULL OR LENGTH(bio_zh_hk) <= 200),
    bio_zh_cn TEXT CHECK (bio_zh_cn IS NULL OR LENGTH(bio_zh_cn) <= 200),
    description_en TEXT,
    description_zh_hk TEXT,
    description_zh_cn TEXT,
    value_prop_en TEXT CHECK (value_prop_en IS NULL OR LENGTH(value_prop_en) <= 150),
    value_prop_zh_hk TEXT CHECK (value_prop_zh_hk IS NULL OR LENGTH(value_prop_zh_hk) <= 150),
    value_prop_zh_cn TEXT CHECK (value_prop_zh_cn IS NULL OR LENGTH(value_prop_zh_cn) <= 150),
    illustration_url TEXT,
    photo_url TEXT,
    illustration_status TEXT DEFAULT 'pending',
    member_type TEXT DEFAULT 'advisor' CHECK (member_type IN ('founder', 'partner', 'advisor', 'associate')),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    certifications TEXT[],
    awards TEXT[],
    education TEXT[],
    years_experience INTEGER,
    joined_fac_date DATE,
    client_regions TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active);
CREATE INDEX IF NOT EXISTS idx_team_members_type ON team_members(member_type);
CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members(display_order);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 後台目前用 anon key 寫入 team_members；啟用 RLS 且僅允許 authenticated 會導致後台無法儲存。
-- 此處關閉 RLS 以與現有 Next 代碼一致（請儘快改為 service_role + 嚴格 RLS）。
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;

-- 邏輯表名「consultants」：與 team_members 同步（應用程式讀寫仍使用 team_members）
CREATE OR REPLACE VIEW consultants AS
SELECT * FROM team_members;

COMMENT ON VIEW consultants IS 'Alias of team_members for advisor/consultant data; app uses team_members.';

-- ---------- Admin（後台 mark@hkfac.com 等）----------
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_first_login BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ
);

CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_admin_users_timestamp ON admin_users;
CREATE TRIGGER update_admin_users_timestamp
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_users_updated_at();

CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_id ON admin_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);

CREATE TABLE IF NOT EXISTS verification_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    used BOOLEAN DEFAULT false,
    used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_verification_codes_code ON verification_codes(code);

CREATE TABLE IF NOT EXISTS admin_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES admin_users(id),
    action TEXT NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 與當前 Next 後端（anon key）對齊：關閉 admin 相關表 RLS（請儘快規劃改為 service_role）
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE verification_codes DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log DISABLE ROW LEVEL SECURITY;

-- ---------- 初始管理員（mark@hkfac.com）----------
-- password_hash 必須為 bcrypt（與 lib/password.ts 一致）。本地執行：
--   npm run hash:admin-password -- "YourStrongPassword"
-- 將輸出的哈希貼到下方 YourBcryptHash。
--
/*
INSERT INTO admin_users (email, password_hash, is_first_login, is_active, role)
VALUES ('mark@hkfac.com', 'YourBcryptHash', true, true, 'super_admin')
ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    is_active = EXCLUDED.is_active,
    role = EXCLUDED.role;
*/
