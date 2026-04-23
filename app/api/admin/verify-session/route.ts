import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get("admin_session")?.value;

  if (!sessionToken) {
    return NextResponse.json(
      { error: "No session" },
      { status: 401 }
    );
  }

  if (!isSupabaseConfigured()) {
    // Demo mode
    return NextResponse.json({
      valid: true,
      email: "mark@hkfac.com",
      isFirstLogin: false,
    });
  }

  try {
    const { data: session, error } = await supabase
      .from("admin_sessions")
      .select("*, admin_users (email, is_first_login)")
      .eq("token", sessionToken)
      .gte("expires_at", new Date().toISOString())
      .single();

    if (error || !session) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      valid: true,
      email: session.admin_users.email,
      isFirstLogin: session.admin_users.is_first_login,
    });
  } catch (error) {
    console.error("Verify session error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
