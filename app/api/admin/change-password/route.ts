import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { hashPassword } from "@/lib/password";

export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get("admin_session")?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { newPassword } = await request.json();

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    if (!/[A-Z]/.test(newPassword)) {
      return NextResponse.json({ error: "Password must contain at least one uppercase letter" }, { status: 400 });
    }

    if (!/[0-9]/.test(newPassword)) {
      return NextResponse.json({ error: "Password must contain at least one number" }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      console.log("Demo mode: Password changed");
      return NextResponse.json({ success: true, message: "Password changed successfully" });
    }

    const db = getSupabaseAdmin();

    const { data: session, error: sessionError } = await db
      .from("admin_sessions")
      .select("user_id")
      .eq("token", sessionToken)
      .gte("expires_at", new Date().toISOString())
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const passwordHash = await hashPassword(newPassword);

    const { error: updateError } = await db
      .from("admin_users")
      .update({
        password_hash: passwordHash,
        is_first_login: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user_id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
  }
}
