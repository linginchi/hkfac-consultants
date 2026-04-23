import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get("admin_session")?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      authenticated: true,
      email: "mark@hkfac.com",
      isFirstLogin: false,
    });
  }

  try {
    const db = getSupabaseAdmin();

    const { data: session, error } = await db
      .from("admin_sessions")
      .select("*, admin_users (email, is_first_login)")
      .eq("token", sessionToken)
      .gte("expires_at", new Date().toISOString())
      .single();

    if (error || !session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const adminUsers = session.admin_users as { email: string; is_first_login: boolean };

    return NextResponse.json({
      authenticated: true,
      email: adminUsers.email,
      isFirstLogin: adminUsers.is_first_login,
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
