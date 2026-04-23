import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { hashPassword, verifyPassword } from "@/lib/password";
import crypto from "crypto";

const ADMIN_EMAIL = "mark@hkfac.com";

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    const { email } = await request.json();

    if (!email || email.toLowerCase() !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized email address" }, { status: 403 });
    }

    const sessionToken = generateSessionToken();
    const response = NextResponse.json({
      success: true,
      isFirstLogin: false,
      message: "Demo mode: Login successful",
    });

    response.cookies.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8,
      path: "/",
    });

    return response;
  }

  try {
    const { email, password } = await request.json();

    if (!email || email.toLowerCase() !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized email address" }, { status: 403 });
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const db = getSupabaseAdmin();

    const { data: adminUser, error: fetchError } = await db
      .from("admin_users")
      .select("*")
      .eq("email", ADMIN_EMAIL)
      .single();

    if (fetchError || !adminUser) {
      return NextResponse.json({ error: "Admin user not configured" }, { status: 500 });
    }

    const stored = adminUser.password_hash as string;
    const ok = await verifyPassword(password, stored);

    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Upgrade legacy plaintext to bcrypt on successful login
    if (stored && !stored.startsWith("$2")) {
      const newHash = await hashPassword(password);
      await db.from("admin_users").update({ password_hash: newHash }).eq("id", adminUser.id);
    }

    const sessionToken = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 8);

    await db.from("admin_sessions").insert({
      user_id: adminUser.id,
      token: sessionToken,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString(),
    });

    await db
      .from("admin_users")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", adminUser.id);

    const response = NextResponse.json({
      success: true,
      isFirstLogin: adminUser.is_first_login,
      message: "Login successful",
    });

    response.cookies.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
