import { createClient } from "@supabase/supabase-js";

// These environment variables need to be set in your deployment environment
// For local development, use .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!supabaseUrl && !!supabaseAnonKey && 
         supabaseUrl.startsWith("https://") && 
         supabaseAnonKey.length > 20;
}

// Create a single supabase client for interacting with your database
// Use a dummy client during build if env vars are not set
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // We don't need auth persistence for lead capture
      },
    })
  : ({} as ReturnType<typeof createClient>); // Cast empty object for build-time type checking

// Type definition for lead capture form data
export interface LeadCaptureData {
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  title: string;
  region: "middle-east" | "southeast-asia" | "europe" | "americas" | "other";
  investment_focus: string;
  message?: string;
  whitepaper_request: boolean;
  source: string;
}

// Type for database response
export interface LeadRecord extends LeadCaptureData {
  id: string;
  created_at: string;
  email_sent: boolean;
  email_sent_at?: string;
}
