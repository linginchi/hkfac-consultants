-- ============================================
-- FAC Hong Kong - Supabase Database Setup
-- Run this in your Supabase SQL Editor
-- ============================================

-- Create leads table for contact form submissions
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

-- Create index for email lookups
CREATE INDEX idx_leads_email ON leads(email);

-- Create index for created_at (useful for sorting)
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anon users (for the contact form)
CREATE POLICY "Allow anon inserts" ON leads
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Create policy to prevent reads from anon users (data protection)
CREATE POLICY "Deny anon reads" ON leads
    FOR SELECT
    TO anon
    USING (false);

-- Create policy to allow all operations for authenticated users (admin access)
CREATE POLICY "Allow auth full access" ON leads
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================
-- Optional: Create a view for leads dashboard
-- ============================================
CREATE OR REPLACE VIEW leads_dashboard AS
SELECT 
    id,
    first_name,
    last_name,
    email,
    company,
    title,
    region,
    investment_focus,
    whitepaper_request,
    source,
    created_at,
    email_sent,
    email_sent_at,
    CASE 
        WHEN email_sent THEN 'Completed'
        ELSE 'Pending'
    END as email_status
FROM leads
ORDER BY created_at DESC;

-- ============================================
-- Sample query to get recent leads
-- ============================================
-- SELECT * FROM leads_dashboard LIMIT 10;
