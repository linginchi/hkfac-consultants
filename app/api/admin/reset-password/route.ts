import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const ADMIN_EMAIL = "mark@hkfac.com";

// Simple password hashing (use bcrypt in production)
function hashPassword(password: string): string {
  // In production, use bcrypt.hash(password, 10)
  // For demo, we'll use a simple hash
  const crypto = require("crypto");
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const { email, code, newPassword } = await request.json();

    // Validate email
    if (!email || email.toLowerCase() !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Validate password
    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Verify code (skip if already verified in previous step)
    if (code && isSupabaseConfigured()) {
      const { data: verification, error } = await supabase
        .from("verification_codes")
        .select("*")
        .eq("email", ADMIN_EMAIL)
        .eq("code", code)
        .eq("used", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error || !verification) {
        return NextResponse.json(
          { error: "Invalid verification" },
          { status: 400 }
        );
      }

      // Check if code was used recently (within last 30 minutes)
      const usedAt = new Date(verification.used_at);
      const now = new Date();
      const diffMinutes = (now.getTime() - usedAt.getTime()) / (1000 * 60);

      if (diffMinutes > 30) {
        return NextResponse.json(
          { error: "Verification expired, please request a new code" },
          { status: 400 }
        );
      }
    }

    if (isSupabaseConfigured()) {
      // Update password in database
      const passwordHash = hashPassword(newPassword);

      const { error: updateError } = await supabase
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
      // Demo mode
      console.log("Demo mode: Password would be updated to:", newPassword);
    }

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
