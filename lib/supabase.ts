import { createClient } from "@supabase/supabase-js";

/**
 * `NEXT_PUBLIC_*` vars are inlined at **build time** in Next.js. For Cloudflare Pages, set
 * the same names under Settings → Environment variables (Production/Preview) **and** ensure
 * the build step sees them, or the client bundle may not contain the Supabase URL.
 */
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

/**
 * @returns Supabase public URL, or empty if unset (also useful for diagnostics in API routes).
 */
export function getSupabaseUrl(): string {
  return supabaseUrl;
}

export function isSupabaseConfigured(): boolean {
  return (
    !!supabaseUrl &&
    !!supabaseAnonKey &&
    supabaseUrl.startsWith("https://") &&
    supabaseAnonKey.length > 20
  );
}

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })
  : ({} as ReturnType<typeof createClient>);

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

export interface LeadRecord extends LeadCaptureData {
  id: string;
  created_at: string;
  email_sent: boolean;
  email_sent_at?: string;
}
