import type { NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type AdminSessionResult =
  | { ok: true; userId: string; demo: boolean }
  | { ok: false };

export async function getAdminSession(request: NextRequest): Promise<AdminSessionResult> {
  const token = request.cookies.get("admin_session")?.value;
  if (!token) {
    return { ok: false };
  }

  if (!isSupabaseConfigured()) {
    return { ok: true, userId: "demo", demo: true };
  }

  const db = getSupabaseAdmin();

  const { data, error } = await db
    .from("admin_sessions")
    .select("user_id")
    .eq("token", token)
    .gte("expires_at", new Date().toISOString())
    .maybeSingle();

  if (error || !data?.user_id) {
    return { ok: false };
  }

  return { ok: true, userId: data.user_id, demo: false };
}
