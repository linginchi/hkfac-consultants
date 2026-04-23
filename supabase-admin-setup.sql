-- ============================================
-- FAC Hong Kong - Admin Authentication System
-- 管理員認證系統數據庫設置
-- ============================================

-- ============================================
-- 1. Admin Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    
    -- Status flags
    is_first_login BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    
    -- Role and permissions
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    
    -- Security
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only allow access to authenticated admin users
CREATE POLICY "Admin users self access" ON admin_users
    FOR ALL
    TO authenticated
    USING (auth.uid() IN (
        SELECT id FROM admin_users WHERE role = 'super_admin'
    ));

-- Create update trigger
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_users_timestamp
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_users_updated_at();

-- ============================================
-- 2. Admin Sessions Table
-- ============================================
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    
    -- Session metadata
    ip_address INET,
    user_agent TEXT,
    
    -- Expiry
    expires_at TIMESTAMPTZ NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX idx_admin_sessions_user_id ON admin_sessions(user_id);
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at);

-- Enable RLS
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin sessions access" ON admin_sessions
    FOR ALL
    TO authenticated
    USING (auth.uid() IN (
        SELECT id FROM admin_users WHERE role = 'super_admin'
    ));

-- Cleanup expired sessions function
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM admin_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 3. Verification Codes Table
-- ============================================
CREATE TABLE IF NOT EXISTS verification_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    
    -- Status
    used BOOLEAN DEFAULT false,
    used_at TIMESTAMPTZ,
    
    -- Expiry
    expires_at TIMESTAMPTZ NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_verification_codes_email ON verification_codes(email);
CREATE INDEX idx_verification_codes_code ON verification_codes(code);
CREATE INDEX idx_verification_codes_expires ON verification_codes(expires_at);

-- Enable RLS
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Verification codes admin access" ON verification_codes
    FOR ALL
    TO authenticated
    USING (auth.uid() IN (
        SELECT id FROM admin_users WHERE role = 'super_admin'
    ));

-- Cleanup old verification codes function
CREATE OR REPLACE FUNCTION cleanup_old_verification_codes()
RETURNS void AS $$
BEGIN
    DELETE FROM verification_codes 
    WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 4. Admin Activity Log
-- ============================================
CREATE TABLE IF NOT EXISTS admin_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES admin_users(id),
    action TEXT NOT NULL,
    details JSONB,
    
    -- Request metadata
    ip_address INET,
    user_agent TEXT,
    
    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_admin_activity_user_id ON admin_activity_log(user_id);
CREATE INDEX idx_admin_activity_action ON admin_activity_log(action);
CREATE INDEX idx_admin_activity_created ON admin_activity_log(created_at);

-- Enable RLS
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin activity log access" ON admin_activity_log
    FOR ALL
    TO authenticated
    USING (auth.uid() IN (
        SELECT id FROM admin_users
    ));

-- Log activity function
CREATE OR REPLACE FUNCTION log_admin_activity(
    p_user_id UUID,
    p_action TEXT,
    p_details JSONB DEFAULT '{}',
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    INSERT INTO admin_activity_log (user_id, action, details, ip_address, user_agent)
    VALUES (p_user_id, p_action, p_details, p_ip_address, p_user_agent);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. Initial Admin User Setup
-- ============================================
-- Note: Run this after creating the tables to set up the initial admin user
-- IMPORTANT: Change the default password before running in production!

-- To set up initial admin user (run manually after setup):
/*
INSERT INTO admin_users (email, password_hash, is_first_login, role)
VALUES (
    'mark@hkfac.com',
    -- This is a placeholder hash. In production, use bcrypt with proper hashing
    -- For testing, you can use: 'changeme123' (but change immediately!)
    'sha256_hash_of_initial_password',
    true,  -- Force password change on first login
    'super_admin'
);
*/

-- ============================================
-- 6. Views for Dashboard
-- ============================================

-- Active sessions view
CREATE OR REPLACE VIEW v_active_admin_sessions AS
SELECT 
    s.id,
    s.user_id,
    u.email,
    s.ip_address,
    s.created_at,
    s.expires_at,
    CASE 
        WHEN s.expires_at > NOW() THEN 'Active'
        ELSE 'Expired'
    END as status
FROM admin_sessions s
JOIN admin_users u ON s.user_id = u.id
WHERE s.expires_at > NOW() - INTERVAL '24 hours'
ORDER BY s.created_at DESC;

-- Recent activity view
CREATE OR REPLACE VIEW v_recent_admin_activity AS
SELECT 
    a.id,
    a.user_id,
    u.email,
    a.action,
    a.details,
    a.ip_address,
    a.created_at
FROM admin_activity_log a
JOIN admin_users u ON a.user_id = u.id
ORDER BY a.created_at DESC;

-- ============================================
-- 7. Comments and Documentation
-- ============================================

COMMENT ON TABLE admin_users IS 'Stores administrator user accounts with authentication details';
COMMENT ON TABLE admin_sessions IS 'Tracks active admin sessions for security and session management';
COMMENT ON TABLE verification_codes IS 'Temporary storage for password reset verification codes';
COMMENT ON TABLE admin_activity_log IS 'Audit log for all administrative actions';

COMMENT ON COLUMN admin_users.is_first_login IS 'Flag indicating if user needs to change password on first login';
COMMENT ON COLUMN admin_users.failed_login_attempts IS 'Counter for failed login attempts for brute force protection';
COMMENT ON COLUMN verification_codes.expires_at IS 'Verification codes expire after 10 minutes';
