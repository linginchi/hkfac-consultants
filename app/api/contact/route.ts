import { NextRequest, NextResponse } from "next/server";
import { supabase, LeadCaptureData, isSupabaseConfigured } from "@/lib/supabase";
import { resend, EMAIL_CONFIG, isResendConfigured, WhitepaperEmailData } from "@/lib/resend";

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_HOUR = 5;

// Simple rate limiting check
function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const lastRequest = rateLimitMap.get(email);

  if (!lastRequest || now - lastRequest > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(email, now);
    return true;
  }

  return false;
}

// Generate professional whitepaper email content
function generateWhitepaperEmail(data: WhitepaperEmailData, locale: string): {
  subject: string;
  html: string;
  text: string;
} {
  const isChinese = locale === "zh-HK" || locale === "zh-CN";
  const isHK = locale === "zh-HK";

  // Email subjects
  const subjects = {
    en: "Your Hong Kong Market Entry Strategy Whitepaper | FAC Hong Kong",
    "zh-HK": "您的香港市場進入策略白皮書 | FAC (香港)",
    "zh-CN": "您的香港市场进入策略白皮书 | FAC (香港)",
  };

  // Salutations
  const salutations = {
    en: `Dear ${data.firstName} ${data.lastName}`,
    "zh-HK": `${data.lastName}${data.firstName} 先生/女士`,
    "zh-CN": `${data.lastName}${data.firstName} 先生/女士`,
  };

  // Email body content
  const bodies = {
    en: {
      opening: `Thank you for your interest in FAC (Hong Kong) Ltd. We appreciate your inquiry regarding expansion opportunities in Greater China.`,
      paragraph1: `As requested, please find attached our comprehensive whitepaper: "Strategic Navigation: A Sovereign Fund's Guide to Hong Kong Market Entry." This document reflects four decades of institutional knowledge accumulated through our founder's journey from Honeywell Bull's President's Club to today's AI-enhanced execution capabilities.`,
      paragraph2: `The whitepaper addresses key considerations for Middle Eastern and Southeast Asian institutional investors, including regulatory navigation, government relations frameworks, and operational efficiency strategies that have proven successful for our partners.`,
      paragraph3: `Should you wish to discuss how FAC can support your specific expansion objectives, please do not hesitate to contact us directly at mark@hkfac.com or schedule a consultation through our website.`,
      closing: `We look forward to the possibility of partnering with ${data.company} in your Greater China endeavors.`,
      signature: `Yours sincerely,`,
      signatureName: `Mark GC Lin`,
      signatureTitle: `Founder & Strategic Growth Partner`,
      signatureCompany: `FAC (Hong Kong) Ltd.`,
      footer: `This email was sent from FAC (Hong Kong) Ltd. Hong Kong Science Park, Sha Tin, N.T., Hong Kong.`,
    },
    "zh-HK": {
      opening: `感謝您對FAC (香港) 有限公司的關注。我們珍視您對大中華區拓展機會的查詢。`,
      paragraph1: `隨函附上您所要求的白皮書：《戰略導航：主權基金香港市場進入指南》。本文件匯聚了我們創辦人四十年機構知識，從Honeywell Bull總裁俱樂部榮譽到當今AI增強執行能力的歷程精華。`,
      paragraph2: `白皮書針對中東及東南亞機構投資者，涵蓋監管導航、政府關係框架及經實證有效的運作效率策略等關鍵考量。`,
      paragraph3: `若您希望探討FAC如何支持您的具體拓展目標，歡迎直接聯絡我們：mark@hkfac.com，或透過網站預約諮詢。`,
      closing: `我們期待與${data.company}在大中華區的合作可能。`,
      signature: `順頌商祺，`,
      signatureName: `Mark GC Lin`,
      signatureTitle: `創辦人暨戰略增長夥伴`,
      signatureCompany: `FAC (香港) 有限公司`,
      footer: `此郵件由FAC (香港) 有限公司發出。地址：香港新界沙田香港科學園。`,
    },
    "zh-CN": {
      opening: `感谢您对FAC (香港) 有限公司的关注。我们珍视您对大中华区拓展机会的查询。`,
      paragraph1: `随函附上您所要求的白皮书：《战略导航：主权基金香港市场进入指南》。本文件汇聚了我们创办人四十年机构知识，从Honeywell Bull总裁俱乐部荣誉到当今AI增强执行能力的历程精华。`,
      paragraph2: `白皮书针对中东及东南亚机构投资者，涵盖监管导航、政府关系框架及经实证有效的运作效率策略等关键考量。`,
      paragraph3: `若您希望探讨FAC如何支持您的具体拓展目标，欢迎直接联络我们：mark@hkfac.com，或透过网站预约咨询。`,
      closing: `我们期待与${data.company}在大中华区的合作可能。`,
      signature: `顺颂商祺，`,
      signatureName: `Mark GC Lin`,
      signatureTitle: `创办人暨战略增长伙伴`,
      signatureCompany: `FAC (香港) 有限公司`,
      footer: `此邮件由FAC (香港) 有限公司发出。地址：香港新界沙田香港科学园。`,
    },
  };

  const content = isChinese ? (isHK ? bodies["zh-HK"] : bodies["zh-CN"]) : bodies["en"];
  const subject = subjects[locale as keyof typeof subjects] || subjects["en"];
  const salutation = salutations[locale as keyof typeof salutations] || salutations["en"];

  // HTML email template with professional styling
  const html = `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { border-bottom: 2px solid #d4af37; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #0f172a; }
    .tagline { font-size: 12px; color: #64748b; margin-top: 5px; }
    .content { margin-bottom: 30px; }
    .paragraph { margin-bottom: 16px; }
    .signature { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
    .signature-name { font-weight: bold; color: #0f172a; margin-bottom: 4px; }
    .signature-title { color: #64748b; font-size: 14px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; }
    .cta-box { background-color: #f8fafc; border-left: 3px solid #d4af37; padding: 16px; margin: 24px 0; }
    .gold { color: #d4af37; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">FAC <span class="gold">Hong Kong</span></div>
      <div class="tagline">Strategic Execution Hub for Greater China</div>
    </div>
    
    <div class="content">
      <p class="paragraph"><strong>${salutation}</strong>,</p>
      
      <p class="paragraph">${content.opening}</p>
      
      <div class="cta-box">
        <p class="paragraph"><strong>📋 Whitepaper Download</strong></p>
        <p class="paragraph">${content.paragraph1}</p>
      </div>
      
      <p class="paragraph">${content.paragraph2}</p>
      
      <p class="paragraph">${content.paragraph3}</p>
      
      <p class="paragraph">${content.closing}</p>
    </div>
    
    <div class="signature">
      <p>${content.signature}</p>
      <p class="signature-name">${content.signatureName}</p>
      <p class="signature-title">${content.signatureTitle}<br>${content.signatureCompany}</p>
    </div>
    
    <div class="footer">
      ${content.footer}
    </div>
  </div>
</body>
</html>
  `;

  // Plain text version
  const text = `
${salutation},

${content.opening}

WHITE PAPER DOWNLOAD

${content.paragraph1}

${content.paragraph2}

${content.paragraph3}

${content.closing}

${content.signature}
${content.signatureName}
${content.signatureTitle}
${content.signatureCompany}

---
${content.footer}
  `;

  return { subject, html, text };
}

// Send whitepaper email via Resend
async function sendWhitepaperEmail(data: WhitepaperEmailData): Promise<boolean> {
  if (!isResendConfigured()) {
    console.warn("Resend is not configured. Skipping email send.");
    return false;
  }

  try {
    const { subject, html, text } = generateWhitepaperEmail(data, data.locale);

    const { data: emailData, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: data.email,
      subject,
      html,
      text,
      replyTo: EMAIL_CONFIG.replyTo,
    });

    if (error) {
      console.error("Failed to send email:", error);
      return false;
    }

    console.log("Whitepaper email sent successfully:", emailData?.id);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

// Main POST handler
export async function POST(request: NextRequest) {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Lead capture service is not configured" },
      { status: 503 }
    );
  }

  try {
    // Parse request body
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      company,
      title,
      region,
      investmentFocus,
      message,
      whitepaperRequest,
      locale,
    } = body;

    // Validation
    if (!firstName || !lastName || !email || !company || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Rate limiting
    if (!checkRateLimit(email)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Prepare data for Supabase
    const leadData: LeadCaptureData = {
      first_name: firstName,
      last_name: lastName,
      email: email.toLowerCase(),
      company,
      title,
      region: region || "other",
      investment_focus: investmentFocus || "",
      message: message || "",
      whitepaper_request: whitepaperRequest || false,
      source: "website_contact_form",
    };

    // Insert into Supabase
    let leadRecord;
    try {
      const result = await supabase
        .from("leads")
        .insert([leadData])
        .select()
        .single();
      
      leadRecord = result.data;
      
      if (result.error) {
        throw result.error;
      }
    } catch (dbError) {
      console.error("Supabase error:", dbError);
      return NextResponse.json(
        { error: "Failed to save lead information" },
        { status: 500 }
      );
    }

    // Send whitepaper email if requested
    let emailSent = false;
    if (whitepaperRequest) {
      emailSent = await sendWhitepaperEmail({
        firstName,
        lastName,
        email,
        company,
        locale: locale || "en",
      });

      // Update record with email status
      if (emailSent && leadRecord?.id) {
        try {
          await supabase
            .from("leads")
            .update({
              email_sent: true,
              email_sent_at: new Date().toISOString(),
            })
            .eq("id", leadRecord.id);
        } catch (updateError) {
          console.error("Failed to update email status:", updateError);
          // Non-critical error, don't fail the request
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your inquiry. We will be in touch shortly.",
      emailSent,
      leadId: leadRecord?.id,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    supabaseConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    resendConfigured: isResendConfigured(),
  });
}
