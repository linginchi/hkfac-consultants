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
    email: body.email === "" ? null : body.email != null ? String(body.email).trim() : undefined,
    linkedin_url: body.linkedin_url === "" ? null : body.linkedin_url != null ? String(body.linkedin_url).trim() : undefined,
    role_en: String(body.role_en || "").trim(),
    role_zh_hk: String(body.role_zh_hk || "").trim(),
    role_zh_cn: String(body.role_zh_cn || "").trim(),
    expertise_areas: parseStringArray(body.expertise_areas),
    bio_en: String(body.bio_en || "").trim(),
    bio_zh_hk: String(body.bio_zh_hk || "").trim(),
    bio_zh_cn: String(body.bio_zh_cn || "").trim(),
    description_en:
      body.description_en === undefined
        ? undefined
        : body.description_en === ""
          ? null
          : String(body.description_en).trim(),
    description_zh_hk:
      body.description_zh_hk === undefined
        ? undefined
        : body.description_zh_hk === ""
          ? null
          : String(body.description_zh_hk).trim(),
    description_zh_cn:
      body.description_zh_cn === undefined
        ? undefined
        : body.description_zh_cn === ""
          ? null
          : String(body.description_zh_cn).trim(),
    value_prop_en: String(body.value_prop_en || "").trim(),
    value_prop_zh_hk: String(body.value_prop_zh_hk || "").trim(),
    value_prop_zh_cn: String(body.value_prop_zh_cn || "").trim(),
    illustration_url:
      body.illustration_url === undefined
        ? undefined
        : body.illustration_url === ""
          ? null
          : String(body.illustration_url).trim(),
    illustration_status: illOk,
    member_type: mt,
    is_active: body.is_active === undefined ? undefined : Boolean(body.is_active),
    display_order:
      body.display_order === undefined
        ? undefined
        : typeof body.display_order === "number"
          ? body.display_order
          : parseInt(String(body.display_order || "0"), 10) || 0,
    certifications: parseStringArray(body.certifications),
    awards: parseStringArray(body.awards),
    education: parseStringArray(body.education),
    client_regions: parseStringArray(body.client_regions),
    years_experience:
      body.years_experience === undefined
        ? undefined
        : typeof body.years_experience === "number"
          ? body.years_experience
          : parseInt(String(body.years_experience || "0"), 10) || 0,
    joined_fac_date:
      body.joined_fac_date === undefined
        ? undefined
        : body.joined_fac_date === ""
          ? null
          : String(body.joined_fac_date).trim(),
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession(request);
  if (!session.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const db = getSupabaseAdmin();
  const { id } = await params;
  const { data, error } = await db.from("team_members").select("*").eq("id", id).maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Failed to load member" }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession(request);
  if (!session.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const db = getSupabaseAdmin();
  const { id } = await params;

  try {
    const body = await request.json();
    const row = normalizePayload(body);
    const err = validateMember(row);
    if (err) {
      return NextResponse.json({ error: err }, { status: 400 });
    }

    const updatePayload: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(row)) {
      if (v !== undefined) {
        updatePayload[k] = v;
      }
    }
    updatePayload.updated_at = new Date().toISOString();

    const { data, error } = await db.from("team_members").update(updatePayload).eq("id", id).select().single();

    if (error) {
      console.error("admin team update:", error);
      return NextResponse.json({ error: error.message || "Update failed" }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession(request);
  if (!session.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const db = getSupabaseAdmin();
  const { id } = await params;
  const { error } = await db.from("team_members").delete().eq("id", id);

  if (error) {
    console.error("admin team delete:", error);
    return NextResponse.json({ error: error.message || "Delete failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
