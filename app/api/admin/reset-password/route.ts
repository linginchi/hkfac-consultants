import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { hashPassword } from "@/lib/password";

const ADMIN_EMAIL = "mark@hkfac.com";

export async function POST(request: NextRequest) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || email.toLowerCase() !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    if (code && isSupabaseConfigured()) {
      const db = getSupabaseAdmin();
      const { data: verification, error } = await db
        .from("verification_codes")
        .select("*")
        .eq("email", ADMIN_EMAIL)
        .eq("code", code)
        .eq("used", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error || !verification) {
        return NextResponse.json({ error: "Invalid verification" }, { status: 400 });
      }

      const usedAt = new Date(verification.used_at as string);
      const diffMinutes = (Date.now() - usedAt.getTime()) / (1000 * 60);

      if (diffMinutes > 30) {
        return NextResponse.json(
          { error: "Verification expired, please request a new code" },
          { status: 400 }
        );
      }
    }

    if (isSupabaseConfigured()) {
      const db = getSupabaseAdmin();
      const passwordHash = await hashPassword(newPassword);

      const { error: updateError } = await db
        .from("admin_users")
        .update({
          password_hash: passwordHash,
          is_first_login: false,
          updated_at: new Date().toISOString(),
        })
        .eq("email", ADMIN_EMAIL);

      if (updateError) {
        throw updateError;
      }
    } else {
      console.log("Demo mode: Password would be updated");
    }

    return NextResponse.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
