import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "./supabase";

/**
 * Service role key bypasses RLS. Use only in server-side API routes / Server Actions.
 * Required once RLS is enabled on admin_* and team_members write paths.
 */
export function isServiceRoleConfigured(): boolean {
  const k = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return !!k && k.length > 40 && isSupabaseConfigured();
}

let _adminClient: SupabaseClient | null = null;

/**
 * Prefer service-role client; fall back to anon (legacy) if key not set.
 * After applying RLS hardening SQL, set SUPABASE_SERVICE_ROLE_KEY in production.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    return supabase;
  }
  if (isServiceRoleConfigured()) {
    if (!_adminClient) {
      _adminClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false, autoRefreshToken: false } }
      );
    }
    return _adminClient;
  }
  return supabase;
}
