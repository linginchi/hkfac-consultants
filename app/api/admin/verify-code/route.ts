import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const ADMIN_EMAIL = "mark@hkfac.com";

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    // Validate email
    if (!email || email.toLowerCase() !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Validate code format
    if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: "Invalid verification code format" },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      // Verify code from database
      const { data: verification, error } = await supabase
        .from("verification_codes")
        .select("*")
        .eq("email", ADMIN_EMAIL)
        .eq("code", code)
        .eq("used", false)
        .gte("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error || !verification) {
        return NextResponse.json(
          { error: "Invalid or expired verification code" },
          { status: 400 }
        );
      }

      // Mark code as used
      await supabase
        .from("verification_codes")
        .update({ used: true, used_at: new Date().toISOString() })
        .eq("id", verification.id);

      return NextResponse.json({
        success: true,
        message: "Code verified successfully",
      });
    } else {
      // Demo mode - accept any 6-digit code for testing
      return NextResponse.json({
        success: true,
        message: "Demo mode: Code accepted",
      });
    }
  } catch (error) {
    console.error("Verify code error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
