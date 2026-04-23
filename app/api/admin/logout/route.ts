import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get("admin_session")?.value;

  if (sessionToken && isSupabaseConfigured()) {
    // Delete session from database
    await supabase
      .from("admin_sessions")
      .delete()
      .eq("token", sessionToken);
  }

  // Clear cookie
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  response.cookies.delete("admin_session");

  return response;
}
