import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import crypto from "crypto";

// Admin email constant
const ADMIN_EMAIL = "mark@hkfac.com";

// Generate secure session token
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Hash password (simple comparison for demo - use bcrypt in production)
function verifyPassword(inputPassword: string, storedPassword: string): boolean {
  // In production, use proper hashing like bcrypt.compare
  // For this demo, we'll do direct comparison (assuming Supabase or DB stores hashed password)
  return inputPassword === storedPassword;
}

export async function POST(request: NextRequest) {
  // Check Supabase configuration
  if (!isSupabaseConfigured()) {
    // Demo mode - allow login with any password for mark@hkfac.com
    const { email, locale } = await request.json();
    
    if (email.toLowerCase() !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized email address" },
        { status: 403 }
      );
    }

    // Create session for demo mode
    const sessionToken = generateSessionToken();
    
    const response = NextResponse.json({
      success: true,
      isFirstLogin: false, // Demo mode - skip first login flow
      message: "Demo mode: Login successful",
    });

    // Set session cookie
    response.cookies.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });

    return response;
  }

  try {
    const { email, password, locale } = await request.json();

    // Validate email
    if (!email || email.toLowerCase() !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized email address" },
        { status: 403 }
      );
    }

    // Check if admin user exists
    const { data: adminUser, error: fetchError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", ADMIN_EMAIL)
      .single();

    if (fetchError || !adminUser) {
      // Admin user doesn't exist, create with default password
      // In production, this should be set up manually
      return NextResponse.json(
        { error: "Admin user not configured" },
        { status: 500 }
      );
    }

    // Verify password
    // In production, use proper password hashing
    const isPasswordValid = verifyPassword(password, adminUser.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate session token
    const sessionToken = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 8);

    // Store session in database
    await supabase.from("admin_sessions").insert({
      user_id: adminUser.id,
      token: sessionToken,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString(),
    });

    // Update last login
    await supabase
      .from("admin_users")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", adminUser.id);

    // Create response with session
    const response = NextResponse.json({
      success: true,
      isFirstLogin: adminUser.is_first_login,
      message: "Login successful",
    });

    // Set session cookie
    response.cookies.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
