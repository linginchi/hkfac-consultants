-- ============================================
-- FAC Hong Kong - Team Members Database Setup
-- 团队成员数据结构 & API 预留
-- ============================================

-- Create team_members table for storing advisor information
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Information
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE,
    linkedin_url TEXT,
    
    -- Role & Position
    role_en TEXT NOT NULL,
    role_zh_hk TEXT,
    role_zh_cn TEXT,
    
    -- Professional Focus Areas (array of expertise)
    expertise_areas TEXT[], -- e.g., ['Legal', 'Compliance', 'FinTech', 'Government Relations']
    
    -- Biography (Max 200 chars per language)
    bio_en TEXT CHECK (LENGTH(bio_en) <= 200),
    bio_zh_hk TEXT CHECK (LENGTH(bio_zh_hk) <= 200),
    bio_zh_cn TEXT CHECK (LENGTH(bio_zh_cn) <= 200),
    
    -- Extended Description (for detail view)
    description_en TEXT,
    description_zh_hk TEXT,
    description_zh_cn TEXT,
    
    -- Value Proposition for Middle East / SEA Clients
    value_prop_en TEXT CHECK (LENGTH(value_prop_en) <= 150),
    value_prop_zh_hk TEXT CHECK (LENGTH(value_prop_zh_hk) <= 150),
    value_prop_zh_cn TEXT CHECK (LENGTH(value_prop_zh_cn) <= 150),
    
    -- Illustration / Photo Assets
    illustration_url TEXT, -- URL to AI-generated FAC-style illustration
    photo_url TEXT, -- Original professional photo (optional backup)
    illustration_status TEXT DEFAULT 'pending' -- 'pending', 'generated', 'approved'
    
    -- Member Type & Status
    member_type TEXT DEFAULT 'advisor' CHECK (member_type IN ('founder', 'partner', 'advisor', 'associate')),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    -- Credentials & Achievements
    certifications TEXT[], -- e.g., ['HKSFC Type 1', 'HKSFC Type 4']
    awards TEXT[], -- e.g., ['President\'s Club 1993', 'Best Hedge Fund 2009']
    education TEXT[], -- e.g., ['CEIBS', 'Wharton', 'Tsinghua']
    
    -- Experience Timeline
    years_experience INTEGER,
    joined_fac_date DATE,
    
    -- Client Focus Regions
    client_regions TEXT[], -- e.g., ['middle-east', 'southeast-asia', 'europe']
    
    -- Administrative Fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create indexes for common queries
CREATE INDEX idx_team_members_active ON team_members(is_active);
CREATE INDEX idx_team_members_type ON team_members(member_type);
CREATE INDEX idx_team_members_order ON team_members(display_order);
CREATE INDEX idx_team_members_expertise ON team_members USING GIN(expertise_areas);
CREATE INDEX idx_team_members_regions ON team_members USING GIN(client_regions);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to active members
CREATE POLICY "Allow public read active members" ON team_members
    FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

-- Policy: Allow authenticated admin users full access
CREATE POLICY "Allow admin full access" ON team_members
    FOR ALL
    TO authenticated
    USING (auth.uid() IN (
        SELECT id FROM auth.users 
        WHERE raw_user_meta_data->>'role' = 'admin'
    ))
    WITH CHECK (auth.uid() IN (
        SELECT id FROM auth.users 
        WHERE raw_user_meta_data->>'role' = 'admin'
    ));

-- ============================================
-- Team Member Illustrations Tracking
-- ============================================

CREATE TABLE IF NOT EXISTS team_illustrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
    
    -- Illustration Metadata
    version INTEGER DEFAULT 1,
    prompt_used TEXT, -- The AI prompt used to generate
    generation_params JSONB, -- Store parameters like seed, model version
    
    -- Asset URLs
    original_url TEXT,
    processed_url TEXT, -- After FAC style adjustments
    thumbnail_url TEXT,
    
    -- Review Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'review', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trigger for illustrations
CREATE TRIGGER update_team_illustrations_updated_at
    BEFORE UPDATE ON team_illustrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on illustrations
ALTER TABLE team_illustrations ENABLE ROW LEVEL SECURITY;

-- Policy: Public can view approved illustrations
CREATE POLICY "Allow public view approved illustrations" ON team_illustrations
    FOR SELECT
    TO anon, authenticated
    USING (status = 'approved');

-- Policy: Admin can manage all illustrations
CREATE POLICY "Allow admin manage illustrations" ON team_illustrations
    FOR ALL
    TO authenticated
    USING (auth.uid() IN (
        SELECT id FROM auth.users 
        WHERE raw_user_meta_data->>'role' = 'admin'
    ))
    WITH CHECK (auth.uid() IN (
        SELECT id FROM auth.users 
        WHERE raw_user_meta_data->>'role' = 'admin'
    ));

-- ============================================
-- Admin Activity Log (for tracking changes)
-- ============================================

CREATE TABLE IF NOT EXISTS team_admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'approve_illustration', 'regenerate_illustration')),
    member_id UUID REFERENCES team_members(id),
    changes JSONB, -- Store what changed
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on logs
ALTER TABLE team_admin_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view logs
CREATE POLICY "Allow admin view logs" ON team_admin_logs
    FOR SELECT
    TO authenticated
    USING (auth.uid() IN (
        SELECT id FROM auth.users 
        WHERE raw_user_meta_data->>'role' = 'admin'
    ));

-- ============================================
-- Views for Common Queries
-- ============================================

-- View: Active Team Members for Public Display
CREATE OR REPLACE VIEW v_team_members_public AS
SELECT 
    id,
    first_name,
    last_name,
    role_en,
    role_zh_hk,
    role_zh_cn,
    expertise_areas,
    bio_en,
    bio_zh_hk,
    bio_zh_cn,
    value_prop_en,
    value_prop_zh_hk,
    value_prop_zh_cn,
    illustration_url,
    member_type,
    display_order,
    certifications,
    years_experience,
    client_regions
FROM team_members
WHERE is_active = true
ORDER BY 
    CASE member_type 
        WHEN 'founder' THEN 1 
        WHEN 'partner' THEN 2 
        WHEN 'advisor' THEN 3 
        ELSE 4 
    END,
    display_order,
    last_name;

-- View: Team Members with Pending Illustrations
CREATE OR REPLACE VIEW v_team_pending_illustrations AS
SELECT 
    tm.id as member_id,
    tm.first_name,
    tm.last_name,
    tm.member_type,
    tm.illustration_status,
    ti.id as illustration_id,
    ti.status as illustration_review_status,
    ti.created_at as illustration_created_at
FROM team_members tm
LEFT JOIN team_illustrations ti ON tm.id = ti.member_id
WHERE tm.illustration_status != 'approved'
   OR ti.status IN ('pending', 'review');

-- ============================================
-- API Functions (for Admin Dashboard)
-- ============================================

-- Function: Get team member by ID with full details
CREATE OR REPLACE FUNCTION get_team_member_full(member_uuid UUID)
RETURNS TABLE (
    member_data JSONB,
    illustrations JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        to_jsonb(tm.*) as member_data,
        COALESCE(
            jsonb_agg(to_jsonb(ti.*) ORDER BY ti.version DESC) 
            FILTER (WHERE ti.id IS NOT NULL),
            '[]'::jsonb
        ) as illustrations
    FROM team_members tm
    LEFT JOIN team_illustrations ti ON tm.id = ti.member_id
    WHERE tm.id = member_uuid
    GROUP BY tm.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Update member illustration
CREATE OR REPLACE FUNCTION update_member_illustration(
    member_uuid UUID,
    new_illustration_url TEXT,
    admin_uuid UUID
)
RETURNS VOID AS $$
BEGIN
    -- Update member record
    UPDATE team_members 
    SET 
        illustration_url = new_illustration_url,
        illustration_status = 'approved',
        updated_at = NOW(),
        updated_by = admin_uuid
    WHERE id = member_uuid;
    
    -- Log the change
    INSERT INTO team_admin_logs (admin_id, action, member_id, changes)
    VALUES (
        admin_uuid,
        'approve_illustration',
        member_uuid,
        jsonb_build_object('illustration_url', new_illustration_url)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Sample Data Insert (Mark Lin as Founder)
-- ============================================

-- Note: Uncomment and run after table creation to seed initial data
/*
INSERT INTO team_members (
    first_name, last_name, email, linkedin_url,
    role_en, role_zh_hk, role_zh_cn,
    expertise_areas,
    bio_en, bio_zh_hk, bio_zh_cn,
    value_prop_en, value_prop_zh_hk, value_prop_zh_cn,
    member_type, display_order,
    certifications, awards, education,
    years_experience, joined_fac_date,
    client_regions,
    illustration_url, illustration_status
) VALUES (
    'Mark GC', 'Lin', 'mark@hkfac.com', 'https://linkedin.com/in/markgclin',
    'Founder & Strategic Growth Partner', '創辦人暨戰略增長夥伴', '创办人暨战略增长伙伴',
    ARRAY['FinTech', 'Government Relations', 'AI Strategy', 'M&A', 'Brokerage Transformation'],
    '40-year FinTech veteran bridging Western enterprise ambitions and Greater China market realities.',
    '40年金融科技資深專家，橋接西方企業願景與大中華區市場現實。',
    '40年金融科技资深专家，桥接西方企业愿景与大中华区市场现实。',
    'Brings 40 years of institutional memory to navigate Middle Eastern sovereign funds through Greater China complexities.',
    '為中東主權基金帶來40年機構記憶，導航大中華區複雜格局。',
    '为中东主权基金带来40年机构记忆，导航大中华区复杂格局。',
    'founder', 1,
    ARRAY['HKSFC Type 1', 'HKSFC Type 4'],
    ARRAY['President\'s Club 1993', 'Best Hedge Fund Quantitative 2009'],
    ARRAY['CEIBS', 'Wharton', 'Tsinghua'],
    40, '2017-10-01',
    ARRAY['middle-east', 'southeast-asia', 'europe'],
    '/team/mark-lin-fac-style.png', 'approved'
);
*/

-- ============================================
-- Comments for Documentation
-- ============================================

COMMENT ON TABLE team_members IS 'Stores FAC team member information including multi-language biographies and AI-generated illustration references';
COMMENT ON TABLE team_illustrations IS 'Tracks versions and approval status of FAC-style AI illustrations for team members';
COMMENT ON TABLE team_admin_logs IS 'Audit log for all administrative changes to team data';

COMMENT ON COLUMN team_members.bio_en IS 'Short biography max 200 characters (English)';
COMMENT ON COLUMN team_members.value_prop_en IS 'Value proposition for Middle East/SEA clients max 150 characters (English)';
COMMENT ON COLUMN team_members.illustration_url IS 'URL to AI-generated illustration following FAC_Illustration_Style.md guidelines';
