import { supabase, isSupabaseConfigured } from "./supabase";

// ============================================
// Team Member Type Definitions
// ============================================

export type TeamMemberType = "founder" | "partner" | "advisor" | "associate";

export interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email?: string;
  linkedin_url?: string;
  
  // Localized roles
  role: {
    en: string;
    "zh-HK": string;
    "zh-CN": string;
  };
  
  // Expertise areas
  expertise_areas: string[];
  
  // Biography (max 200 chars)
  bio: {
    en: string;
    "zh-HK": string;
    "zh-CN": string;
  };
  
  // Extended description
  description?: {
    en: string;
    "zh-HK": string;
    "zh-CN": string;
  };
  
  // Value proposition for ME/SEA clients (max 150 chars)
  value_prop: {
    en: string;
    "zh-HK": string;
    "zh-CN": string;
  };
  
  // Illustration assets
  illustration_url?: string;
  illustration_status: "pending" | "generated" | "approved";
  
  // Member metadata
  member_type: TeamMemberType;
  display_order: number;
  is_active: boolean;
  
  // Credentials
  certifications: string[];
  awards: string[];
  education: string[];
  years_experience: number;
  
  // Client focus
  client_regions: string[];
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// Input type for creating/updating team members
export interface TeamMemberInput {
  first_name: string;
  last_name: string;
  email?: string;
  linkedin_url?: string;
  role_en: string;
  role_zh_hk: string;
  role_zh_cn: string;
  expertise_areas: string[];
  bio_en: string; // Max 200 chars
  bio_zh_hk: string;
  bio_zh_cn: string;
  value_prop_en: string; // Max 150 chars
  value_prop_zh_hk: string;
  value_prop_zh_cn: string;
  member_type: TeamMemberType;
  display_order?: number;
  certifications?: string[];
  awards?: string[];
  education?: string[];
  years_experience?: number;
  client_regions?: string[];
}

// API Response types
export interface TeamApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

// ============================================
// Public API Functions (Client-side safe)
// ============================================

/**
 * Fetch all active team members for public display
 * Ordered by: founder first, then by display_order
 */
export async function getTeamMembers(): Promise<TeamApiResponse<TeamMember[]>> {
  if (!isSupabaseConfigured()) {
    // Return mock data for development/build time
    return {
      data: getMockTeamMembers(),
      error: null,
      status: 200,
    };
  }

  try {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("is_active", true)
      .order("member_type", { ascending: true })
      .order("display_order", { ascending: true })
      .order("last_name", { ascending: true });

    if (error) throw error;

    // Transform database records to TeamMember interface
    const members: TeamMember[] = (data || []).map(transformDbRecordToMember);

    return {
      data: members,
      error: null,
      status: 200,
    };
  } catch (error) {
    console.error("Error fetching team members:", error);
    return {
      data: null,
      error: "Failed to load team members",
      status: 500,
    };
  }
}

/**
 * Fetch a single team member by ID
 */
export async function getTeamMemberById(
  id: string
): Promise<TeamApiResponse<TeamMember>> {
  if (!isSupabaseConfigured()) {
    const mock = getMockTeamMembers().find((m) => m.id === id);
    return {
      data: mock || null,
      error: mock ? null : "Member not found",
      status: mock ? 200 : 404,
    };
  }

  try {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (error) throw error;
    if (!data) {
      return {
        data: null,
        error: "Member not found",
        status: 404,
      };
    }

    return {
      data: transformDbRecordToMember(data),
      error: null,
      status: 200,
    };
  } catch (error) {
    console.error("Error fetching team member:", error);
    return {
      data: null,
      error: "Failed to load team member",
      status: 500,
    };
  }
}

/**
 * Fetch team members by expertise area
 */
export async function getTeamMembersByExpertise(
  expertise: string
): Promise<TeamApiResponse<TeamMember[]>> {
  if (!isSupabaseConfigured()) {
    const filtered = getMockTeamMembers().filter((m) =>
      m.expertise_areas.includes(expertise)
    );
    return {
      data: filtered,
      error: null,
      status: 200,
    };
  }

  try {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("is_active", true)
      .contains("expertise_areas", [expertise])
      .order("display_order", { ascending: true });

    if (error) throw error;

    return {
      data: (data || []).map(transformDbRecordToMember),
      error: null,
      status: 200,
    };
  } catch (error) {
    console.error("Error fetching team by expertise:", error);
    return {
      data: null,
      error: "Failed to load team members",
      status: 500,
    };
  }
}

// ============================================
// Admin API Functions (Server-side only)
// ============================================

/**
 * Create a new team member (Admin only)
 */
export async function createTeamMember(
  member: TeamMemberInput
): Promise<TeamApiResponse<TeamMember>> {
  if (!isSupabaseConfigured()) {
    return {
      data: null,
      error: "Supabase not configured",
      status: 503,
    };
  }

  try {
    // Validate bio length
    if (member.bio_en.length > 200) {
      return {
        data: null,
        error: "English bio exceeds 200 characters",
        status: 400,
      };
    }

    // Validate value_prop length
    if (member.value_prop_en.length > 150) {
      return {
        data: null,
        error: "English value proposition exceeds 150 characters",
        status: 400,
      };
    }

    const { data, error } = await supabase
      .from("team_members")
      .insert([member])
      .select()
      .single();

    if (error) throw error;

    return {
      data: transformDbRecordToMember(data),
      error: null,
      status: 201,
    };
  } catch (error) {
    console.error("Error creating team member:", error);
    return {
      data: null,
      error: "Failed to create team member",
      status: 500,
    };
  }
}

/**
 * Update team member illustration URL (Admin only)
 */
export async function updateMemberIllustration(
  memberId: string,
  illustrationUrl: string
): Promise<TeamApiResponse<boolean>> {
  if (!isSupabaseConfigured()) {
    return {
      data: false,
      error: "Supabase not configured",
      status: 503,
    };
  }

  try {
    const { error } = await supabase
      .from("team_members")
      .update({
        illustration_url: illustrationUrl,
        illustration_status: "approved",
        updated_at: new Date().toISOString(),
      })
      .eq("id", memberId);

    if (error) throw error;

    return {
      data: true,
      error: null,
      status: 200,
    };
  } catch (error) {
    console.error("Error updating illustration:", error);
    return {
      data: false,
      error: "Failed to update illustration",
      status: 500,
    };
  }
}

// ============================================
// Helper Functions
// ============================================

/**
 * Transform database record to TeamMember interface
 */
function transformDbRecordToMember(record: Record<string, unknown>): TeamMember {
  return {
    id: record.id as string,
    first_name: record.first_name as string,
    last_name: record.last_name as string,
    full_name: `${record.first_name} ${record.last_name}`,
    email: record.email as string | undefined,
    linkedin_url: record.linkedin_url as string | undefined,
    role: {
      en: record.role_en as string,
      "zh-HK": record.role_zh_hk as string,
      "zh-CN": record.role_zh_cn as string,
    },
    expertise_areas: (record.expertise_areas as string[]) || [],
    bio: {
      en: record.bio_en as string,
      "zh-HK": record.bio_zh_hk as string,
      "zh-CN": record.bio_zh_cn as string,
    },
    description: {
      en: record.description_en as string,
      "zh-HK": record.description_zh_hk as string,
      "zh-CN": record.description_zh_cn as string,
    },
    value_prop: {
      en: record.value_prop_en as string,
      "zh-HK": record.value_prop_zh_hk as string,
      "zh-CN": record.value_prop_zh_cn as string,
    },
    illustration_url: (record.illustration_url as string) || undefined,
    illustration_status:
      (record.illustration_status as TeamMember["illustration_status"]) ||
      "pending",
    member_type: record.member_type as TeamMemberType,
    display_order: (record.display_order as number) || 0,
    is_active: (record.is_active as boolean) ?? true,
    certifications: (record.certifications as string[]) || [],
    awards: (record.awards as string[]) || [],
    education: (record.education as string[]) || [],
    years_experience: (record.years_experience as number) || 0,
    client_regions: (record.client_regions as string[]) || [],
    created_at: record.created_at as string,
    updated_at: record.updated_at as string,
  };
}

/**
 * Get mock team members for development/build time
 */
function getMockTeamMembers(): TeamMember[] {
  return [
    {
      id: "mark-lin-001",
      first_name: "Mark GC",
      last_name: "Lin",
      full_name: "Mark GC Lin",
      email: "mark@hkfac.com",
      linkedin_url: "https://linkedin.com/in/markgclin",
      role: {
        en: "Founder & Strategic Growth Partner",
        "zh-HK": "創辦人暨戰略增長夥伴",
        "zh-CN": "创办人暨战略增长伙伴",
      },
      expertise_areas: [
        "FinTech",
        "Government Relations",
        "AI Strategy",
        "M&A",
        "Brokerage Transformation",
      ],
      bio: {
        en: "40-year FinTech veteran bridging Western enterprise ambitions and Greater China market realities. Honeywell Bull President's Club honoree and marathoner.",
        "zh-HK":
          "40年金融科技資深專家，橋接西方企業願景與大中華區市場現實。Honeywell Bull總裁俱樂部榮譽者，馬拉松愛好者。",
        "zh-CN":
          "40年金融科技资深专家，桥接西方企业愿景与大中华区市场现实。Honeywell Bull总裁俱乐部荣誉者，马拉松爱好者。",
      },
      value_prop: {
        en: "Brings 40 years of institutional memory to navigate Middle Eastern sovereign funds through Greater China complexities.",
        "zh-HK": "為中東主權基金帶來40年機構記憶，導航大中華區複雜格局。",
        "zh-CN": "为中东主权基金带来40年机构记忆，导航大中华区复杂格局。",
      },
      illustration_url: "/team/team-mark-lin-fac-style.png",
      illustration_status: "approved",
      member_type: "founder",
      display_order: 1,
      is_active: true,
      certifications: ["HKSFC Type 1", "HKSFC Type 4"],
      awards: ["President's Club 1993", "Best Hedge Fund Quantitative 2009"],
      education: ["CEIBS", "Wharton", "Tsinghua"],
      years_experience: 40,
      client_regions: ["middle-east", "southeast-asia", "europe"],
      created_at: "2017-10-01T00:00:00Z",
      updated_at: "2024-01-15T00:00:00Z",
    },
  ];
}

// ============================================
// Utilities
// ============================================

/**
 * Get localized content based on locale
 */
export function getLocalizedContent<T extends { en: string; "zh-HK": string; "zh-CN": string }>(
  content: T,
  locale: string
): string {
  switch (locale) {
    case "zh-HK":
      return content["zh-HK"] || content.en;
    case "zh-CN":
      return content["zh-CN"] || content.en;
    default:
      return content.en;
  }
}

/**
 * Get member type display name
 */
export function getMemberTypeLabel(type: TeamMemberType, locale: string): string {
  const labels = {
    founder: {
      en: "Founder",
      "zh-HK": "創辦人",
      "zh-CN": "创办人",
    },
    partner: {
      en: "Partner",
      "zh-HK": "合夥人",
      "zh-CN": "合伙人",
    },
    advisor: {
      en: "Advisor",
      "zh-HK": "顧問",
      "zh-CN": "顾问",
    },
    associate: {
      en: "Associate",
      "zh-HK": "助理",
      "zh-CN": "助理",
    },
  };

  const label = labels[type];
  return label[locale as keyof typeof label] || label.en;
}

/**
 * Expertise area display names
 */
export const EXPERTISE_DISPLAY_NAMES: Record<string, Record<string, string>> = {
  "FinTech": {
    en: "FinTech",
    "zh-HK": "金融科技",
    "zh-CN": "金融科技",
  },
  "Government Relations": {
    en: "Government Relations",
    "zh-HK": "政府關係",
    "zh-CN": "政府关系",
  },
  "AI Strategy": {
    en: "AI Strategy",
    "zh-HK": "AI戰略",
    "zh-CN": "AI战略",
  },
  "M&A": {
    en: "M&A",
    "zh-HK": "併購",
    "zh-CN": "并购",
  },
  "Brokerage Transformation": {
    en: "Brokerage",
    "zh-HK": "券商轉型",
    "zh-CN": "券商转型",
  },
  "Legal": {
    en: "Legal",
    "zh-HK": "法律",
    "zh-CN": "法律",
  },
  "Compliance": {
    en: "Compliance",
    "zh-HK": "合規",
    "zh-CN": "合规",
  },
  "Regulatory": {
    en: "Regulatory",
    "zh-HK": "監管",
    "zh-CN": "监管",
  },
};
