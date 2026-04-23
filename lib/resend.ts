import { Resend } from "resend";

// Initialize Resend with API key from environment variables
const resendApiKey = process.env.RESEND_API_KEY || "";

// Check if Resend is properly configured
export function isResendConfigured(): boolean {
  return !!resendApiKey && resendApiKey.startsWith("re_");
}

// Only create Resend instance if API key is valid
export const resend = isResendConfigured()
  ? new Resend(resendApiKey)
  : ({} as Resend); // Cast for build-time type checking

// Email configuration
export const EMAIL_CONFIG = {
  from: "FAC Hong Kong <noreply@hkfac.com>",
  replyTo: "mark@hkfac.com",
  // Fallback to a default address if FAC domain is not yet configured
  fallbackFrom: "FAC Hong Kong <onboarding@resend.dev>",
};

// Type for whitepaper email data
export interface WhitepaperEmailData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  locale: string;
}
