import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { resend, isResendConfigured } from "@/lib/resend";
import crypto from "crypto";

const ADMIN_EMAIL = "mark@hkfac.com";

// Generate 6-digit verification code
function generateVerificationCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

// Generate verification email HTML
function generateVerificationEmail(code: string, locale: string): { subject: string; html: string } {
  const subjects: Record<string, string> = {
    en: "FAC Admin - Password Reset Verification Code",
    "zh-HK": "FAC 管理後臺 - 密碼重置驗證碼",
    "zh-CN": "FAC 管理后台 - 密码重置验证码",
  };

  const subject = subjects[locale] || subjects.en;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0F172A; color: #F8FAFC; padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #1E293B; border-radius: 12px; padding: 40px; border: 1px solid #334155; }
    .logo { text-align: center; margin-bottom: 30px; }
    .logo span { color: #D4AF37; font-weight: bold; font-size: 24px; }
    .code { background: #0F172A; border: 2px solid #06B6D4; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
    .code-number { font-size: 36px; font-weight: bold; color: #06B6D4; letter-spacing: 8px; }
    .warning { color: #94A3B8; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <span>FAC</span>
      <p style="color: #94A3B8; margin: 5px 0 0; font-size: 12px;">Administrative Strategic Hub</p>
    </div>
    
    <h2 style="color: #F8FAFC; margin-bottom: 20px;">Password Reset Request</h2>
    
    <p style="color: #94A3B8; line-height: 1.6;">
      You have requested to reset your admin password. Use the verification code below to proceed:
    </p>
    
    <div class="code">
      <p style="color: #64748B; margin: 0 0 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Verification Code</p>
      <div class="code-number">${code}</div>
    </div>
    
    <p style="color: #94A3B8; font-size: 14px;">
      This code will expire in <strong style="color: #06B6D4;">10 minutes</strong>.
    </p>
    
    <div class="warning">
      <p>If you did not request this password reset, please ignore this email and ensure your account is secure.</p>
      <p style="margin-top: 10px;">This is an automated message from FAC Hong Kong Admin System.</p>
    </div>
  </div>
</body>
</html>
  `;

  return { subject, html };
}

export async function POST(request: NextRequest) {
  try {
    const { email, locale } = await request.json();

    // Validate email
    if (!email || email.toLowerCase() !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized email address" },
        { status: 403 }
      );
    }

    // Generate verification code
    const code = generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes expiry

    // Store verification code
    if (isSupabaseConfigured()) {
      // Store in database
      await supabase.from("verification_codes").insert({
        email: ADMIN_EMAIL,
        code,
        expires_at: expiresAt.toISOString(),
        used: false,
        created_at: new Date().toISOString(),
      });
    } else {
      // Demo mode - store in memory (not for production)
      // In production, always use database
      console.log("Demo mode - Verification code:", code);
    }

    // Send email via Resend
    if (isResendConfigured()) {
      const { subject, html } = generateVerificationEmail(code, locale);

      const { error: emailError } = await resend.emails.send({
        from: "FAC Admin <noreply@hkfac.com>",
        to: ADMIN_EMAIL,
        subject,
        html,
      });

      if (emailError) {
        console.error("Failed to send email:", emailError);
        // Don't expose email error to client for security
      }
    } else {
      console.log("Resend not configured. Verification code:", code);
    }

    // Always return success (don't reveal if email exists or not)
    return NextResponse.json({
      success: true,
      message: "If the email exists, a verification code has been sent",
      // In demo mode, include the code for testing
      ...(process.env.NODE_ENV === "development" && !isResendConfigured() && { demoCode: code }),
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
