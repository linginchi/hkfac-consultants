import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getAdminSession } from "@/lib/admin-session";
import type { TeamMemberType } from "@/lib/team";

function parseStringArray(v: unknown): string[] {
  if (Array.isArray(v)) {
    return v.map(String).map((s) => s.trim()).filter(Boolean);
  }
  if (typeof v === "string") {
    return v
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizePayload(body: Record<string, unknown>): Record<string, unknown> {
  const memberType = body.member_type as string;
  const allowed: TeamMemberType[] = ["founder", "partner", "advisor", "associate"];
  const mt = allowed.includes(memberType as TeamMemberType) ? memberType : "advisor";

  const ill = (body.illustration_status as string) || "pending";
  const illOk = ["pending", "generated", "approved"].includes(ill) ? ill : "pending";

  return {
    first_name: String(body.first_name || "").trim(),
    last_name: String(body.last_name || "").trim(),
    email: body.email ? String(body.email).trim() : null,
    linkedin_url: body.linkedin_url ? String(body.linkedin_url).trim() : null,
    role_en: String(body.role_en || "").trim(),
    role_zh_hk: String(body.role_zh_hk || "").trim(),
    role_zh_cn: String(body.role_zh_cn || "").trim(),
    expertise_areas: parseStringArray(body.expertise_areas),
    bio_en: String(body.bio_en || "").trim(),
    bio_zh_hk: String(body.bio_zh_hk || "").trim(),
    bio_zh_cn: String(body.bio_zh_cn || "").trim(),
    description_en: body.description_en ? String(body.description_en).trim() : null,
    description_zh_hk: body.description_zh_hk ? String(body.description_zh_hk).trim() : null,
    description_zh_cn: body.description_zh_cn ? String(body.description_zh_cn).trim() : null,
    value_prop_en: String(body.value_prop_en || "").trim(),
    value_prop_zh_hk: String(body.value_prop_zh_hk || "").trim(),
    value_prop_zh_cn: String(body.value_prop_zh_cn || "").trim(),
    illustration_url: body.illustration_url ? String(body.illustration_url).trim() : null,
    illustration_status: illOk,
    member_type: mt,
    is_active: body.is_active !== false,
    display_order: typeof body.display_order === "number" ? body.display_order : parseInt(String(body.display_order || "0"), 10) || 0,
    certifications: parseStringArray(body.certifications),
    awards: parseStringArray(body.awards),
    education: parseStringArray(body.education),
    client_regions: parseStringArray(body.client_regions),
    years_experience:
      typeof body.years_experience === "number"
        ? body.years_experience
        : parseInt(String(body.years_experience || "0"), 10) || 0,
    joined_fac_date: body.joined_fac_date ? String(body.joined_fac_date).trim() : null,
  };
}

function validateMember(row: Record<string, unknown>): string | null {
  if (!(row.first_name as string) || !(row.last_name as string)) {
    return "first_name and last_name are required";
  }
  if (!(row.role_en as string)) {
    return "role_en is required";
  }
  if ((row.bio_en as string).length > 200 || (row.bio_zh_hk as string).length > 200 || (row.bio_zh_cn as string).length > 200) {
    return "Bio fields must be at most 200 characters";
  }
  if (
    (row.value_prop_en as string).length > 150 ||
    (row.value_prop_zh_hk as string).length > 150 ||
    (row.value_prop_zh_cn as string).length > 150
  ) {
    return "Value proposition fields must be at most 150 characters";
  }
  return null;
}

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured", data: [] }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const includeInactive = searchParams.get("all") === "1";

  const db = getSupabaseAdmin();
  let q = db.from("team_members").select("*").order("display_order", { ascending: true }).order("last_name", { ascending: true });
  if (!includeInactive) {
    q = q.eq("is_active", true);
  }

  const { data, error } = await q;

  if (error) {
    console.error("admin team list:", error);
    return NextResponse.json({ error: "Failed to load team members" }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [] });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  try {
    const db = getSupabaseAdmin();
    const body = await request.json();
    const row = normalizePayload(body);
    const err = validateMember(row);
    if (err) {
      return NextResponse.json({ error: err }, { status: 400 });
    }

    const insertPayload: Record<string, unknown> = {
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      linkedin_url: row.linkedin_url,
      role_en: row.role_en,
      role_zh_hk: row.role_zh_hk,
      role_zh_cn: row.role_zh_cn,
      expertise_areas: row.expertise_areas,
      bio_en: row.bio_en,
      bio_zh_hk: row.bio_zh_hk,
      bio_zh_cn: row.bio_zh_cn,
      value_prop_en: row.value_prop_en,
      value_prop_zh_hk: row.value_prop_zh_hk,
      value_prop_zh_cn: row.value_prop_zh_cn,
      member_type: row.member_type as TeamMemberType,
      display_order: row.display_order,
      certifications: row.certifications,
      awards: row.awards,
      education: row.education,
      years_experience: row.years_experience,
      client_regions: row.client_regions,
      illustration_url: row.illustration_url,
      illustration_status: row.illustration_status,
      is_active: row.is_active,
      description_en: row.description_en,
      description_zh_hk: row.description_zh_hk,
      description_zh_cn: row.description_zh_cn,
      joined_fac_date: row.joined_fac_date,
    };

    const { data, error } = await db.from("team_members").insert([insertPayload]).select().single();

    if (error) {
      console.error("admin team create:", error);
      return NextResponse.json({ error: error.message || "Create failed" }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
